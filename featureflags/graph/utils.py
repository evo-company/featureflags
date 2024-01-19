import uuid


def is_valid_uuid(value: str) -> bool:
    try:
        uuid.UUID(value)
    except ValueError:
        return False
    else:
        return True


def update_map(map_: dict, update: dict) -> dict:
    map_ = map_.copy()
    map_.update(update)
    return map_
