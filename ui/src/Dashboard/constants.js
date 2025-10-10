export const Type = {
  __DEFAULT__: 0,
  STRING:  1,
  NUMBER: 2,
  TIMESTAMP: 3,
  SET: 4
}

export const Operator = {
    __DEFAULT__: 0,
    EQUAL: 1,
    LESS_THAN: 2,
    LESS_OR_EQUAL: 3,
    GREATER_THAN: 4,
    GREATER_OR_EQUAL: 5,
    CONTAINS: 6,
    PERCENT: 7,
    REGEXP: 8,
    WILDCARD: 9,
    SUBSET: 10,
    SUPERSET: 11
};

export const TYPES = {
    [Type.STRING]: {
        operators: [
            Operator.EQUAL,
            Operator.LESS_THAN,
            Operator.LESS_OR_EQUAL,
            Operator.GREATER_THAN,
            Operator.GREATER_OR_EQUAL,
            Operator.PERCENT,
            Operator.CONTAINS,
            Operator.REGEXP,
            Operator.WILDCARD
        ]
    },
    [Type.NUMBER]: {
        operators: [
            Operator.EQUAL,
            Operator.LESS_THAN,
            Operator.LESS_OR_EQUAL,
            Operator.GREATER_THAN,
            Operator.GREATER_OR_EQUAL,
            Operator.PERCENT
        ]
    },
    [Type.TIMESTAMP]: {
        operators: [
            Operator.EQUAL,
            Operator.LESS_THAN,
            Operator.LESS_OR_EQUAL,
            Operator.GREATER_THAN,
            Operator.GREATER_OR_EQUAL
        ]
    },
    [Type.SET]: {
        operators: [
            Operator.EQUAL,
            Operator.SUBSET,
            Operator.SUPERSET
        ]
    }
};

export const Operators =  {
    [Operator.EQUAL]: {title: 'equal'},
    [Operator.LESS_THAN]: {title: 'less than'},
    [Operator.LESS_OR_EQUAL]: {title: 'less or equal'},
    [Operator.GREATER_THAN]: {title: 'greater than'},
    [Operator.GREATER_OR_EQUAL]: {title: 'greater or equal'},
    [Operator.PERCENT]: {title: 'percent'},
    [Operator.CONTAINS]: {title: 'contains'},
    [Operator.REGEXP]: {title: 'regexp'},
    [Operator.WILDCARD]: {title: 'wildcard'},
    [Operator.SUPERSET]: {title: 'includes'},
    [Operator.SUBSET]: {title: 'included in'}
};

export const KIND = {
    VALUE_STRING: 'value_string',
    VALUE_NUMBER: 'value_number',
    VALUE_TIMESTAMP: 'value_timestamp',
    VALUE_SET: 'value_set',
}

export const KIND_TO_TYPE = {
    [KIND.VALUE_STRING]: Type.STRING,
    [KIND.VALUE_NUMBER]: Type.NUMBER,
    [KIND.VALUE_TIMESTAMP]: Type.TIMESTAMP,
    [KIND.VALUE_SET]: Type.SET,
};

export const TYPE_TO_KIND = {
    [Type.STRING]: KIND.VALUE_STRING,
    [Type.NUMBER]: KIND.VALUE_NUMBER,
    [Type.TIMESTAMP]: KIND.VALUE_TIMESTAMP,
    [Type.SET]: KIND.VALUE_SET,
};
