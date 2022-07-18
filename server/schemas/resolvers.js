const { User } = require('../models');
const { signToken } = require('../utils/auth');

function checkLogin(context){
  const user = context.user;
  if (!user) {
    throw new Error('You are not logged in.');
  }
  return user;
}


const resolvers = {
  Query: {
    me: async (parent, args, context) => checkLogin(context),
  },
  Mutation: {
    async login(parent, {email, password}, context){
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Can't find this user" );
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password');
      }
      const token = signToken(user);

      return { token, user };
    },

    async saveBook(parent, {authors, description, title, bookId, image, link}, context){
      const user = checkLogin(context);


      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: { authors, description, title, bookId, image, link } } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    async removeBook(parent, {bookId} , context){
      const user = checkLogin(context);
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new Error( "Couldn't find user with this id!" );
      }
      return updatedUser;
    },


    addUser: async (parent, args, context) => {
      const user = await User.create(args);

      if (!user) {
        throw new Error('Something is wrong!');
      }
      const token = signToken(user);
      return { token, user };

    },
  },
};

module.exports = resolvers;