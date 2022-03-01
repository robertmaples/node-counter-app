const resolvers = (models) => ({
    Query: {
        getCounterById(root, { id }) {
            return models.Counter.findById(id).then((response) => response);
        }
    },
    Mutation: {
        createCounter(root) {
            const counter = new models.Counter();
            return counter.save().then((response) => response);
        },
    },
});

module.exports = resolvers;