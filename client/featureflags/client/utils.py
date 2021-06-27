def intervals_gen(interval=10, retry_interval_min=1, retry_interval_max=32):
    success = True
    retry_interval = retry_interval_min
    while True:
        if success:
            success = yield interval
            retry_interval = retry_interval_min
        else:
            success = yield retry_interval
            retry_interval = min(retry_interval * 2,
                                 retry_interval_max)
