import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import { Dashboard } from './Dashboard'
import { Auth } from './Auth'
import { AuthProvider } from './context/auth';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ApolloProvider client={client}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sign-in" element={<Auth />} />
          </Routes>
        </AuthProvider>
      </ApolloProvider>
    </HashRouter>
  </React.StrictMode>
)
