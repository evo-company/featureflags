# 3. Add Slack notifications for project flag and value changes

Date: 2026-06-12

## Status

Accepted

## Context

Teams need a simple way to see feature flag and value changes without
continuously monitoring the FeatureFlags UI.

The notification mechanism must:

- support project-specific delivery targets
- be manageable from the UI rather than static server config
- work for both flag and value changes
- avoid slowing down mutation requests
- expose failures for operators through logs and metrics

## Decision

We will add Slack notifications delivered through Slack incoming webhooks.

### Channel management

- Notification channels are stored in the database, not in config files
- Channels are managed globally in the UI
- A channel contains a unique name, type, and webhook URL
- Channel type is modeled as an enum for forward compatibility, with only
  `SLACK_WEBHOOK` implemented now
- Projects select notification channels through a many-to-many relation, so a
  project may notify multiple Slack channels

### Data model

We add two new tables:

- `notification_channel`
- `project_notification_channel`

Deleting a project removes its project-channel links. Deleting a channel also
removes its project-channel links.

### Trigger point

Notifications are triggered from GraphQL mutation handlers, reusing the
existing `Changes` and `ValuesChanges` context objects that already capture
what changed for changelog generation.

Notifications are sent for:

- flag save/reset/delete flows
- value save/reset/delete flows

Delete handlers must capture entity name and project before deletion, because
that information is unavailable afterwards.

### Delivery model

Delivery is best-effort and asynchronous.

- Mutation responses do not wait for Slack delivery
- Dispatch creates background asyncio tasks
- Each task loads the current entity state, project channels, and editor name
- Messages are sent concurrently to all channels selected for the project
- Missing entities or projects with no channels are treated as no-ops
- No retries, outbox, polling, or LISTEN/NOTIFY are used

### Message format

Slack messages use legacy attachments so the colored sidebar can indicate
change type.

- green for enabled state
- red for disabled state
- grey for reset and deleted state

Messages include:

- the changed flag or value name
- rendered conditions when present
- the username of the editor

Value notifications also include current override and default values.

Messages do not include:

- links back to the UI
- emoji or instance prefixes
- customizable templates

### API and UI

We add GraphQL support for notification channel management:

- query all notification channels
- query channels attached to a project
- create or update a notification channel
- delete a notification channel
- replace a project's selected notification channels
- send a test notification to validate a webhook

UI changes include:

- a global notification channels settings page
- add/edit/delete channel actions
- client-side webhook URL validation
- a test-send action for a channel
- project settings multi-select for choosing Slack channels

### Configuration and observability

No new server configuration settings are introduced.

Slack delivery failures are logged and counted with Prometheus metrics.
Successful sends are also counted.

## Consequences

- FeatureFlags gains built-in Slack visibility for project changes
- Notification channels become reusable global objects across projects
- A project can fan out one change to multiple Slack destinations
- Notification failures do not break user mutations, but delivery is not
  guaranteed
- The server gains additional database tables, GraphQL surface area, and UI
  pages for notification management
- Operators can monitor notification health through logs and metrics
- The design is extensible to future channel types, but only Slack webhooks are
  supported now
- Permissions remain unchanged: channel management is available to any
  authenticated user, matching existing project-management behavior
