import sqlalchemy as sa

from alembic import op
from sqlalchemy.sql import table, column
from sqlalchemy.dialects import postgresql


revision = "94e4203113b0"
down_revision = "cce98484f923"
branch_labels = None
depends_on = None


def upgrade():
    auth_session = table("auth_session", column("auth_user", postgresql.UUID()))

    op.execute(auth_session.delete().where(auth_session.c.auth_user.is_(None)))

    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column(
        "auth_session",
        "auth_user",
        existing_type=postgresql.UUID(),
        nullable=False,
    )
    op.drop_column("auth_session", "user")
    # ### end Alembic commands ###