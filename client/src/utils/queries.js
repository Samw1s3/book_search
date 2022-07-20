import { gql } from '@apollo/client';

export const GET_ME = gql`
  query User {
    me {
      _id
      username
      savedBooks{
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

