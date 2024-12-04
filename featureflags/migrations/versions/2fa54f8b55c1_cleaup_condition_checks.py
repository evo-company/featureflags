from alembic import op
from sqlalchemy.sql import text

revision = "2fa54f8b55c1"
down_revision = "a327a3ea7a5f"
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()

    conditions = list(conn.execute("SELECT id, checks FROM condition"))
    checks = list(conn.execute('SELECT id FROM "check"'))

    print("Found conditions: {}".format(len(conditions)))
    print("Found checks: {}".format(len(checks)))

    check_ids = {check.id for check in checks}

    for condition in conditions:
        new_checks = {check for check in condition.checks if check in check_ids}
        if set(condition.checks) != new_checks:
            print(
                "Updating condition {} with new checks: before={}, after={}".format(
                    condition.id, condition.checks, new_checks
                )
            )

            conn.execute(
                text("UPDATE condition SET checks = :checks WHERE id = :id"),
                {"checks": list(new_checks), "id": condition.id},
            )


def downgrade(): ...
