# 2. Split project into client/server, protobuf, clients

Date: 2023-10-16

## Status

Accepted

## Context

Developing project further with old architecture is difficult. Namespace packages is poorly supported by IDEs and will
add complexity to the project infrastructure setup.

## Decision

We need to split project into client/server, protobuf, clients and develop them separately as it is more straightforward
and will allow to use more mature tools.

## Consequences

- We will have to develop and maintain more projects
- We will have more flexibility in choosing tools
- Project will be easier to understand and develop, test
