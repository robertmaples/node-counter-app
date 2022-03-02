const { ApolloServer, ApolloServerPluginStopHapiServer, gql } = require('apollo-server-hapi')
const hapi = require('@hapi/hapi')
const { v4: uuidv4 } = require('uuid');

const typeDefs = gql`
    type Counter {
        id: String!    
        value: Int!
    }
    type Query {
        getCounterById(id: String!): Counter
        getCounters: [Counter]
    }
    type Mutation {
        createCounter: Counter
        incrementCounter(id: String!): Counter
    }
`;

const counters = [
    {
        id: '9d0a8a68-f9a4-4464-9619-980c9db85eff',
        value: 100
    },
    {
        id: '33d184b3-0bdf-4c5f-8cc3-b930efadb1bd',
        value: 50,
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        getCounterById: (parent, args, context, info) => counters.find(c => c.id === args.id),
        getCounters: () => counters
    },
    Mutation: {
        createCounter: () => {
            const counter = {id: uuidv4(), value: 0}

            counters.push(counter)
            return counter
        },
        incrementCounter: (id) => {
            const counter = counters.find(id);

            counter.value = counter.value + 1;
            return counter;
        }
    }
};

async function startApolloServer(typeDefs, resolvers) {
    const app = hapi.server({ port: 4000 });
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginStopHapiServer({ hapiServer: app })],
    });

    await server.start();
    await server.applyMiddleware({ app });
    await app.start();
}

startApolloServer(typeDefs, resolvers)
