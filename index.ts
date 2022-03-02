import {ApolloServer, ApolloServerPluginStopHapiServer, gql} from "apollo-server-hapi";
import {Server} from "hapi"
import { v4 as uuidv4 } from "uuid"


interface Counter {
    id: string;
    value: number;
}

const typeDefs = gql`
    type Counter {
        id: String!
        value: Int!
    }
    type Query {
        getCounter(id: String!): Counter
        getCounters: [Counter]
    }
    type Mutation {
        createCounter: Counter
        incrementCounter(id: String!): Counter
    }
`;

const counters: Counter[] = [
    {
        id: '9d0a8a68-f9a4-4464-9619-980c9db85eff',
        value: 100
    },
    {
        id: '33d184b3-0bdf-4c5f-8cc3-b930efadb1bd',
        value: 50,
    },
];

const resolvers = {
    Query: {
        getCounter: (parent, args: {id: string}) => counters.find(c => c.id === args.id),
        getCounters: () => counters
    },
    Mutation: {
        createCounter: () => {
            const counter = {id: uuidv4(), value: 0}

            counters.push(counter)
            return counter
        },
        incrementCounter: (parent, args: {id: string}) => {
            const counter = counters.find(c => c.id === args.id);

           if (counter) {
               counter.value = counter.value + 1;
           }

            return counter;
        }
    }
};

async function startApolloServer(typeDefs, resolvers) {
    const app = new Server({port: 4000 })
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginStopHapiServer({hapiServer: app})],
    });

    await server.start();
    await server.applyMiddleware({app});
    await app.start();
}

startApolloServer(typeDefs, resolvers)
