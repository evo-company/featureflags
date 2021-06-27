from datetime import datetime, timedelta

import faker
import pytest

from sqlalchemy import and_, select
from google.protobuf.timestamp_pb2 import Timestamp

from featureflags.protobuf import graph_pb2
from featureflags.protobuf import service_pb2
from featureflags.server.utils import MC, ACC
from featureflags.server.schema import Statistics
from featureflags.server.feedback import add_statistics, yield_store_stats_tasks
from featureflags.server.feedback import store_statistics


f = faker.Faker()


@pytest.mark.asyncio
async def test_add_statistics(db):
    acc = ACC()
    mc = MC()

    project_name = f.pystr()
    variable_name = f.pystr()
    flag_name = f.pystr()

    interval = datetime(2017, 12, 12, 19, 34)
    interval_pb = Timestamp()
    interval_pb.FromDatetime(interval)

    await add_statistics(service_pb2.ExchangeRequest(
        project=project_name,
        variables=[service_pb2.Variable(name=variable_name,
                                        type=graph_pb2.Variable.STRING)],
        flags_usage=[service_pb2.FlagUsage(
            name=flag_name,
            interval=interval_pb,
            positive_count=1,
            negative_count=2,
        )]
    ), db=db, mc=mc, acc=acc)

    project_id = mc.project[project_name]
    variable_id = mc.variable[project_id][variable_name]
    flag_id = mc.flag[project_id][flag_name]
    assert project_id and variable_id and flag_id

    pos, neg = acc[flag_id][interval]
    assert pos == 1 and neg == 2

    await add_statistics(service_pb2.ExchangeRequest(
        project=project_name,
        variables=[service_pb2.Variable(name=variable_name,
                                        type=graph_pb2.Variable.STRING)],
        flags_usage=[service_pb2.FlagUsage(
            name=flag_name,
            interval=interval_pb,
            positive_count=3,
            negative_count=4,
        )]
    ), db=db, mc=mc, acc=acc)

    pos, neg = acc[flag_id][interval]
    assert pos == 4 and neg == 6

    for flag_stats in yield_store_stats_tasks(timedelta(0), acc=acc):
        await store_statistics(flag_stats, db=db)
    assert not acc[flag_id], acc

    result = await db.execute(
        select([Statistics.positive_count, Statistics.negative_count])
        .where(and_(Statistics.flag == flag_id,
                    Statistics.interval == interval))
    )
    row = await result.first()
    assert row.as_tuple() == (4, 6)
