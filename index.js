const hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const { apolloHapi, graphiqlHapi } = require('apollo-server');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const Counter = require('./models/counter');

const graphqlSchema = require('./graphql/schema');
const createResolvers = require('./graphql/resolvers');

const server = hapi.Server({
    port: 8080,
    host: 'localhost'
});

mongoose.connect('mongodb://localhost:27017/test')

const executableSchema = makeExecutableSchema({
   typeDefs: [graphqlSchema],
    resolvers: createResolvers({ Counter })
});

server.register({
    register: apolloHapi,
    options: {
        path: '/graphql',
        apolloOptions: () => ({
            pretty: true,
            schema: executableSchema,
        }),
    },
});

server.register({
    register: graphiqlHapi,
    options: {
        path: '/graphiql',
        graphiqlOptions: {
            endpointUrl: '/graphql'
        }
    },
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.url}`);
});