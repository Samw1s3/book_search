const { User } = require('../models');

function checkUserStatus(context){
    const user= context.user
    if(!user){
        throw new Errpr('You are not logged in.')
    } 
    return user;
}

const resolvers = {
  Query: {
    me: async (parents, args, context) => {
      return checkUserStatus(context);
    },
  },
  Mutation: {
    login: async(parent, {email, password}, context) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Can't find this user");
    }

    const correctPw = await user.isCorrectPassword(password);

    if (!correctPw) {
        throw new Error("Password Wrong");
    }
    const token = signToken(user);
    return { token, user };
    },
    
    saveBook: async (parent, {authors, description, title, bookId, image, link},context) => {
        const user= context.user
        if(!user){
            throw new Errpr('You are not logged in.')
        } console.log(user);
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $addToSet: { savedBooks: {authors, description, title, bookId, image, link}} },
            { new: true, runValidators: true }
          );
          return res.json(updatedUser);
        } catch (err) {
          console.log(err);
          return res.status(400).json(err);
        }
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId:bookId } } },
                { new: true }
              );
              return updatedUser;
        }
        throw new Error("You must be logged in");
    },
    addUser: async (parent, args, context) => {
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
