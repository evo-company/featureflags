import sqlalchemy as sa

from alembic import op

revision = "a1b2c3d4e5f6"
down_revision = "69f91d9fab0f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "auth_user",
        sa.Column("oidc_subject", sa.String(), nullable=True),
    )
    op.create_unique_constraint(
        "auth_user_oidc_subject_key", "auth_user", ["oidc_subject"]
    )
    op.create_index("auth_user_oidc_subject_idx", "auth_user", ["oidc_subject"])


def downgrade() -> None:
    op.drop_index("auth_user_oidc_subject_idx", table_name="auth_user")
    op.drop_constraint(
        "auth_user_oidc_subject_key", "auth_user", type_="unique"
    )
    op.drop_column("auth_user", "oidc_subject")
