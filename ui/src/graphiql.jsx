import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';
import 'graphiql/graphiql.css';

const fetcher = createGraphiQLFetcher({ url: '/graphql' });

export const GraphiQLRoot = () => {
  return <GraphiQL fetcher={fetcher} />;
}

