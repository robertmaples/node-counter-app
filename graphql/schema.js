const schema = `
    type Counter {
        id: ID!    
        value: Int!
    }
    type Query {
        getCounterById(id: ID!): Counter
    }
    type Mutation {
        createCounter(): Counter
        incrementCounter(id: ID!): Counter
    }
    schema {
        query: Query
        mutation: Mutation
    }
`;

module.exports = schema;