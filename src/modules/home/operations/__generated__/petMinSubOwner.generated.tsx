import * as Types from '../../../../types.js';

import { gql } from '@apollo/client';
export type PetMinSubOwnerFragment = (
  { __typename?: 'Ownership' }
  & Pick<Types.Ownership, 'id'>
  & { user: (
    { __typename?: 'User' }
    & Pick<Types.User, 'id' | 'first_name' | 'email' | 'last_name'>
    & { profile_picture?: Types.Maybe<(
      { __typename?: 'Media' }
      & Pick<Types.Media, 'id' | 'scope'>
      & { main_colors?: Types.Maybe<Array<(
        { __typename?: 'MainColor' }
        & Pick<Types.MainColor, 'color' | 'contrast'>
      )>>, main_color?: Types.Maybe<(
        { __typename?: 'MainColor' }
        & Pick<Types.MainColor, 'color' | 'contrast'>
      )> }
    )> }
  ) }
);

export const PetMinSubOwnerFragmentDoc = gql`
    fragment petMinSubOwner on Ownership {
  id
  user {
    id
    first_name
    email
    last_name
    profile_picture {
      id
      scope
      main_colors {
        color
        contrast
      }
      main_color {
        color
        contrast
      }
    }
  }
}
    `;