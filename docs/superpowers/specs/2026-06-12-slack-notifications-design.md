# Slack notifications for flag and value changes — design

Date: 2026-06-12
Status: approved

## Goal

When someone changes a feature flag or a value, the server pushes a formatted
message to the Slack channels configured for that project. Notification
channels (name + Slack incoming-webhook URL) are managed globally in the UI,
Grafana-style; each project selects any number of channels in its settings.

Reference message (existing "Flag Master" bot):

```
| Flag SHOPEX_8350_MULTIPLATFORM_SUBSCRIPTION_MANAGEMENT_CABINET: true
| Conditions:
| user.email eq volodymyr.tereshchenko@smartweb.com.ua
| Updated: volodymyr.tereshchenko@smartweb.com.ua
```

(colored side bar: green when enabled, red when disabled)

## Decisions

- Channels are stored in the DB and managed via a new global settings UI
  page (not the server config file).
- Both Flag and Value changes notify.
- A project can have **multiple** channels (M2M); the project settings tab
  uses a multi-select.
- No emoji / instance prefix in messages (the 🇺🇦 in the reference is
  dropped).
- No links in messages: the flag/value name renders in backticks (Slack
  inline code) instead of linking back to the UI. No `public_url` config
  setting.
- Delivery is **best-effort, async**: the mutation response never waits on
  Slack; failures are logged + counted in a Prometheus metric; no retries,
  no outbox.
- Trigger mechanism: hook in the GraphQL mutation handlers, reusing the
  existing `Changes` / `ValuesChanges` context objects (the same data that
  feeds the changelog). No polling, no LISTEN/NOTIFY.

## Data model

New tables, one alembic migration (`featureflags/models.py` +
`featureflags/migrations/versions/`):

```python
class NotificationChannelType(enum.Enum):
    SLACK_WEBHOOK = 1

class NotificationChannel(Base):
    __tablename__ = "notification_channel"
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False, unique=True)
    type = Column(
        Enum(NotificationChannelType, name="notification_channel_type"),
        nullable=False,
    )
    webhook_url = Column(String, nullable=False)

class ProjectNotificationChannel(Base):
    __tablename__ = "project_notification_channel"
    project: UUID = Column(ForeignKey("project.id"), primary_key=True)
    channel: UUID = Column(
        ForeignKey("notification_channel.id"), primary_key=True
    )
```

- `type` only has `SLACK_WEBHOOK` today; the enum exists for forward
  compatibility.
- `actions.delete_project` additionally deletes the project's
  `project_notification_channel` rows.
- Deleting a channel deletes its `project_notification_channel` rows.

## Server flow

New module `featureflags/services/notifications.py` containing:

1. **`NotificationsService`** — owns a lazily-created `httpx.AsyncClient`
   (5s timeout). Registered as a singleton in the web `Container`
   (`featureflags/web/container.py`), closed via container shutdown
   (`providers.Resource` or explicit shutdown hook). Exposed to graph
   handlers through a new context key `GraphContext.NOTIFICATIONS`, wired in
   `init_graph_context(...)` (`featureflags/graph/context.py`). The
   parameter defaults to `None` (tests / http app pass nothing → dispatch
   is a no-op).

2. **Dispatch API** (called from mutation handlers in
   `featureflags/graph/graph.py`):
   - `dispatch_flag_changes(engine, session, changes: Changes)` — called in
     `save_flag` and `reset_flag` after `update_changelog`.
   - `dispatch_value_changes(engine, session, changes: ValuesChanges)` —
     called in `save_value` and `reset_value` after
     `update_value_changelog`.
   - `dispatch_flag_deleted(engine, session, flag_name, project_id)` /
     `dispatch_value_deleted(engine, session, value_name, project_id)` —
     `delete_flag` / `delete_value` handlers SELECT name + project **before**
     running the delete action (the row is gone afterwards and deletes never
     reach the changelog), then dispatch.

3. **Background task**: each dispatch spawns `asyncio.create_task(...)`;
   tasks are kept in a module-level `set` with a done-callback discard so
   they are not garbage-collected mid-flight. The GraphQL response returns
   immediately.

4. **Inside the task** (own DB connection from the engine):
   - Load editor username (`auth_user.username` by `session.user`).
   - Per changed flag: load name, `enabled`, project name + project's
     channels, conditions (ordered by position) with checks and variable
     names. Per changed value: same plus `value_default`, `value_override`,
     and each condition's `value_override`.
   - Skip silently when the project has no channels or the entity no longer
     exists.
   - Render one Slack message per changed flag/value and POST it to every
     channel of the project concurrently (`asyncio.gather`).

5. **Readonly mode**: mutations do not run on readonly replicas, so the
   notifier is naturally inert there. No extra guard needed.

## Message format

Slack **legacy attachments** payload — the only format with the colored side
bar:

```json
{
  "attachments": [
    {
      "color": "#36a64f",
      "text": "Flag `FLAG_NAME`: true\nConditions:\nuser.email eq one@example.com\nUpdated: editor@example.com",
      "mrkdwn_in": ["text"]
    }
  ]
}
```

Title line (`` `NAME` `` is the flag/value name in backticks — Slack
inline code; no link):

| Case | Title | Color |
|---|---|---|
| Flag enabled (after change) | ``Flag `NAME`: true`` | `#36a64f` (green) |
| Flag disabled (after change) | ``Flag `NAME`: false`` | `#d63232` (red) |
| `RESET_FLAG` in actions | ``Flag `NAME`: reset`` | `#aaaaaa` (grey) |
| Flag deleted | ``Flag `NAME`: deleted`` | `#aaaaaa` (grey) |
| Value enabled | ``Value `NAME`: enabled, override: "42" (default: "10")`` | green |
| Value disabled | ``Value `NAME`: disabled, override: "42" (default: "10")`` | red |
| `RESET_VALUE` in actions | ``Value `NAME`: reset`` | grey |
| Value deleted | ``Value `NAME`: deleted`` | grey |

- Reset/deleted take precedence over the enabled-state rendering.
- "Enabled" means the stored `enabled` column is `True`; `False` and
  `None` (never overridden) both render as `false` / `disabled` — same
  coercion the GraphQL graph applies.

Conditions block (omitted when the entity has no conditions, e.g. the
`SHOPEX_9126` reference message):

- One line per condition; checks within a condition joined with ` and `:
  `user.company_id eq 3150894 and user.is_staff eq true`
- Value conditions append their override: `user.email eq x@y.com → "99"`
- Check value comes from whichever of
  `value_string/value_number/value_timestamp/value_set` is set.
- Operator rendering: `EQUAL→eq`, `LESS_THAN→<`, `LESS_OR_EQUAL→<=`,
  `GREATER_THAN→>`, `GREATER_OR_EQUAL→>=`, `CONTAINS→contains`,
  `PERCENT→%`, `REGEXP→regexp`, `WILDCARD→wildcard`, `SUBSET→subset`,
  `SUPERSET→superset`.

Last line: `Updated: {username}` (usernames are emails in this system).

## GraphQL API

Following existing hiku patterns in `featureflags/graph/graph.py` (each
mutation returns a node with an `error` field; actions in
`featureflags/graph/actions.py` are `@auth_required @track`):

Queries:
- Root link `notificationChannels: Sequence[NotificationChannel]` — all
  channels, auth required. Node fields: `id`, `name`, `type`, `webhookUrl`.
- `Project` node: new link `notificationChannels:
  Sequence[NotificationChannel]` via M2M `LinkQuery`.

Mutations:
- `saveNotificationChannel(id: Optional[String], name: String!,
  webhookUrl: String!) → {error}` — create when `id` is null, else update.
  Validates: non-empty name, name unique (DB constraint surfaced as
  error), URL starts with `http://` or `https://`. Type is implicitly
  `SLACK_WEBHOOK`.
- `deleteNotificationChannel(id: String!) → {error}` — deletes M2M rows
  first, then the channel.
- `setProjectNotificationChannels(projectId: String!,
  channelIds: [String!]!) → {error}` — replaces the project's set
  (delete all M2M rows for the project, insert the given ones).

New actions: `save_notification_channel`, `delete_notification_channel`,
`set_project_notification_channels`.

No permission system exists in the app (any authenticated user can already
delete a project); channel management is likewise open to all authenticated
users.

## UI

React + antd + Apollo, existing patterns (`ui/src/Dashboard/`):

- **Global settings page** — new route `#/settings` (`ui/src/main.jsx`),
  new component `ui/src/Dashboard/NotificationChannels.jsx`:
  - antd `Table` of channels: name, webhook URL, edit + delete buttons.
  - "Add channel" button; add/edit share a `Modal` form (name, webhook
    URL, both required; URL validated client-side as http(s)).
  - Delete uses a confirmation modal (same style as project delete).
  - Wrapped in `Base` like the dashboard, with a Back button navigating
    to `/`.
- **Sidebar entry** — gear icon (`SettingOutlined`) button pinned at the
  bottom of the projects `Sider` in `ui/src/Dashboard/Dashboard.jsx`,
  navigates to `/settings`.
- **Project settings tab** (`ui/src/Dashboard/Settings.jsx`) — new
  "Notifications" block: `Select mode="multiple"` of all channels,
  pre-filled from the project's current channels, saved via
  `setProjectNotificationChannels` on change, with success/error `message`
  feedback.
- **Queries** (`ui/src/Dashboard/queries.js`):
  `NOTIFICATION_CHANNELS_QUERY`, `SAVE_NOTIFICATION_CHANNEL_MUTATION`,
  `DELETE_NOTIFICATION_CHANNEL_MUTATION`,
  `SET_PROJECT_NOTIFICATION_CHANNELS_MUTATION`; `PROJECTS_QUERY` extended
  with `notificationChannels { id }`.

## Config

No new config settings — channels live in the DB.

## Error handling

- Slack send failure (non-2xx, timeout, connection error): `log.warning`
  with channel name + reason; increment Prometheus counter
  `slack_notification_errors_total` (labeled by channel name). Successful
  sends increment `slack_notifications_total`. Never raised into the
  request path.
- Channel CRUD validation errors return through the mutation `error` field.
- Channel deleted between change and send: channels are loaded at send
  time, so the send set is simply whatever exists then; empty → no-op.
- Background task wraps its whole body in try/except with `log.exception`
  so an unexpected error can never produce an unhandled task exception.

## Testing

pytest, existing patterns from `featureflags/tests/test_actions.py`:

- **Actions**: channel create / update (incl. duplicate name error) /
  delete (M2M cleanup), `set_project_notification_channels` replace
  semantics, `delete_project` cleans M2M rows.
- **Message builder** (pure-function unit tests): flag
  enabled/disabled/reset/deleted; value with override/default; condition
  rendering — multi-check joins, every operator, every value kind
  (string/number/timestamp/set); value-condition `→ "override"` suffix;
  name rendered in backticks.
- **Dispatch**: `httpx.MockTransport` capturing POSTs — payload shape,
  one message per changed entity, fan-out to multiple channels; failure
  path increments the error metric and does not raise; deleted-flag event
  uses the name captured before deletion; no channels → no HTTP call.
- **GraphQL**: mutation handlers dispatch on save/reset/delete for flags
  and values (service injected as a fake recording calls).

## Out of scope

- Retries / outbox / delivery guarantees.
- Other channel types (email, Telegram, generic webhook) — enum is ready,
  nothing else is built.
- Permissions / roles for channel management.
- Per-flag or per-event filtering (which actions notify).
- Message i18n or customizable templates.
