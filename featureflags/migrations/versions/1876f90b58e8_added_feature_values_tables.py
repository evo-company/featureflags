import sqlalchemy as sa

from alembic import op
from sqlalchemy.dialects import postgresql


revision = "1876f90b58e8"
down_revision = "8df4e7dd1897"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "value",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=True),
        sa.Column("value_default", sa.String(), nullable=False),
        sa.Column("value_override", sa.String(), nullable=False),
        sa.Column("project", postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(
            ["project"],
            ["project.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("project", "name"),
    )
    op.create_index(
        "value_project_name_idx", "value", ["project", "name"], unique=False
    )
    op.create_table(
        "value_changelog",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("timestamp", postgresql.TIMESTAMP(), nullable=False),
        sa.Column("auth_user", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("value", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "actions",
            postgresql.ARRAY(
                sa.Enum(
                    "ENABLE_VALUE",
                    "DISABLE_VALUE",
                    "ADD_CONDITION",
                    "DISABLE_CONDITION",
                    "RESET_VALUE",
                    "DELETE_VALUE",
                    "UPDATE_VALUE_VALUE_OVERRIDE",
                    name="value_changelog_actions",
                )
            ),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["auth_user"],
            ["auth_user.id"],
        ),
        sa.ForeignKeyConstraint(["value"], ["value.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "value_condition",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("value", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("value_override", sa.String(), nullable=False),
        sa.Column(
            "checks",
            postgresql.ARRAY(postgresql.UUID(as_uuid=True), as_tuple=True),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["value"],
            ["value.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.drop_table("stats")
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "stats",
        sa.Column(
            "flag", postgresql.UUID(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "interval",
            postgresql.TIMESTAMP(),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "positive_count", sa.INTEGER(), autoincrement=False, nullable=True
        ),
        sa.Column(
            "negative_count", sa.INTEGER(), autoincrement=False, nullable=True
        ),
        sa.PrimaryKeyConstraint("flag", "interval", name="stats_pkey"),
    )
    op.drop_table("value_condition")
    op.drop_table("value_changelog")
    op.drop_index("value_project_name_idx", table_name="value")
    op.drop_table("value")
    # ### end Alembic commands ###
