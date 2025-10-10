import sqlalchemy as sa

from alembic import op

revision = '69f91d9fab0f'
down_revision = '2fa54f8b55c1'
branch_labels = None
depends_on = None


def upgrade():
    # Add position column to condition table
    op.add_column(
        "condition",
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
    )
     # Add position column to value_condition table
    op.add_column(
        "value_condition",
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
    )
    # Initialize positions for existing records to avoid conflicts
    # For conditions: set position based on current order
    op.execute(
        """
        WITH numbered AS (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY flag ORDER BY id) - 1 as pos
            FROM condition
        )
        UPDATE condition SET position = numbered.pos
        FROM numbered WHERE condition.id = numbered.id
        """
    )

    # Add unique constraint for flag + position
    op.create_unique_constraint(
        "condition_flag_position_unique", "condition", ["flag", "position"]
    )

    # For value_conditions: set position based on current order
    op.execute(
        """
        WITH numbered AS (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY value ORDER BY id) - 1 as pos
            FROM value_condition
        )
        UPDATE value_condition SET position = numbered.pos
        FROM numbered WHERE value_condition.id = numbered.id
        """
    )
    # Add unique constraint for value + position
    op.create_unique_constraint(
        "value_condition_value_position_unique",
        "value_condition",
        ["value", "position"],
    )


def downgrade():
    # Drop unique constraints
    op.drop_constraint(
        "value_condition_value_position_unique", "value_condition", type_="unique"
    )
    op.drop_constraint(
        "condition_flag_position_unique", "condition", type_="unique"
    )

    # Drop position columns
    op.drop_column("value_condition", "position")
    op.drop_column("condition", "position")
