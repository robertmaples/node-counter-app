const hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
const { apolloHapi, graphiqlHapi } = require('apollo-server');
const { makeExecutableSchema } = require('graphql-tools');

const Counter = require('./models/counter');

const graphqlSchema = require('./graphql/schema');
const createResolvers = require('./graphql/resolvers');

const server = new hapi.Server();

server.connection({
    host: 'localhost',
    port: 8080
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
    options: '/graphiql',
    graphiqlOptions: {
        endpointUrl: '/graphql'
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.url}`);
});