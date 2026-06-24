import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision = "f3a9c41e88d2"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "notification_channel",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, unique=True),
        sa.Column(
            "type",
            postgresql.ENUM("SLACK_WEBHOOK", name="notification_channel_type"),
            nullable=False,
        ),
        sa.Column("webhook_url", sa.String(), nullable=False),
    )
    op.create_table(
        "project_notification_channel",
        sa.Column(
            "project",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("project.id"),
            primary_key=True,
        ),
        sa.Column(
            "channel",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("notification_channel.id"),
            primary_key=True,
        ),
    )


def downgrade() -> None:
    op.drop_table("project_notification_channel")
    op.drop_table("notification_channel")
    postgresql.ENUM(name="notification_channel_type").drop(op.get_bind())
