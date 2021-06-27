from featureflags.client.utils import intervals_gen


def test_intervals_gen_from_success():
    int_gen = intervals_gen()
    int_gen.send(None)
    assert int_gen.send(True) == 10
    assert int_gen.send(True) == 10
    assert int_gen.send(False) == 1
    assert int_gen.send(False) == 2
    assert int_gen.send(False) == 4
    assert int_gen.send(False) == 8
    assert int_gen.send(True) == 10
    assert int_gen.send(True) == 10
    assert int_gen.send(False) == 1
    assert int_gen.send(False) == 2
    assert int_gen.send(False) == 4
    assert int_gen.send(False) == 8
    assert int_gen.send(False) == 16
    assert int_gen.send(False) == 32
    assert int_gen.send(False) == 32
    assert int_gen.send(True) == 10
    assert int_gen.send(True) == 10


def test_intervals_gen_from_error():
    int_gen = intervals_gen()
    int_gen.send(None)
    assert int_gen.send(False) == 1
    assert int_gen.send(False) == 2
    assert int_gen.send(False) == 4
    assert int_gen.send(False) == 8
    assert int_gen.send(True) == 10
    assert int_gen.send(True) == 10
    assert int_gen.send(False) == 1
    assert int_gen.send(False) == 2
    assert int_gen.send(False) == 4
    assert int_gen.send(False) == 8
    assert int_gen.send(False) == 16
    assert int_gen.send(False) == 32
    assert int_gen.send(False) == 32
    assert int_gen.send(True) == 10
    assert int_gen.send(True) == 10
