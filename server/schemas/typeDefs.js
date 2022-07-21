const { gql } = require('apollo-server-express');

const typeDefs = gql`
  
  type Book{
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }  

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }
  
  type Auth {
    token: String!
    user: User!
  } 

  type Query {
    me:User
  }

  input SaveBookInput {
    authors: [String]
    description: String
    title: String
    bookId:String
    image: String
    link:String
  }

  type Mutation {
    
    login(email: String!, password: String!):Auth
    saveBook(input: SaveBookInput!):User
    removeBook(bookId: ID!):User
    addUser(username: String!, email: String!, password: String!):Auth

   
  }
`;

module.exports = typeDefs;
