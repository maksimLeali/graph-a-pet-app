import * as Types from '../../../../types.js';

import { gql } from '@apollo/client';
export type MinUserFragment = (
  { __typename?: 'User' }
  & Pick<Types.User, 'id' | 'role' | 'first_name' | 'last_name' | 'email'>
  & { profile_picture?: Types.Maybe<(
    { __typename?: 'Media' }
    & Pick<Types.Media, 'id'>
  )> }
);

export const MinUserFragmentDoc = gql`
    fragment minUser on User {
  id
  role
  first_name
  last_name
  email
  profile_picture {
    id
  }
}
    `;