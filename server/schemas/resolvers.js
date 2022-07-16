const { User } = require('../models');

const resolvers = {
  Query: {
    user: async () => {
      return User.find({});
    },
    users: async (parent, { _id }) => {
      const params = _id ? { _id } : {};
      return User.find(params);
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const user = await User.create(args);

      if (!user) {
        throw new Error('Something is wrong!');
      }
      const token = signToken(user);
      res.json({ token, user});
    },
  },
};

module.exports = resolvers;
