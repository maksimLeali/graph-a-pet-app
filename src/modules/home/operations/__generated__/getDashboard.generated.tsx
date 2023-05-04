import * as Types from '../../../../types.js';

import { DashboardPetFragment } from './dashboardPet.generated';
import { gql } from '@apollo/client';
import { DashboardPetFragmentDoc } from './dashboardPet.generated';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type GetUserDashboardQueryVariables = Types.Exact<{
  date_from: Types.Scalars['String'];
  date_to: Types.Scalars['String'];
}>;


export type GetUserDashboardQuery = (
  { __typename?: 'Query' }
  & { getUserDashboard: (
    { __typename?: 'UserDashboardResult' }
    & Pick<Types.UserDashboardResult, 'success'>
    & { dashboard?: Types.Maybe<(
      { __typename?: 'UserDashboard' }
      & { ownerships?: Types.Maybe<(
        { __typename?: 'PaginatedOwnerships' }
        & Pick<Types.PaginatedOwnerships, 'success'>
        & { items: Array<Types.Maybe<(
          { __typename?: 'Ownership' }
          & Pick<Types.Ownership, 'id'>
          & { pet: (
            { __typename?: 'Pet' }
            & DashboardPetFragment
          ) }
        )>>, error?: Types.Maybe<(
          { __typename?: 'Error' }
          & Pick<Types.Error, 'code' | 'message'>
        )> }
      )>, reports?: Types.Maybe<(
        { __typename?: 'PaginatedReports' }
        & Pick<Types.PaginatedReports, 'success'>
        & { items: Array<Types.Maybe<(
          { __typename?: 'Report' }
          & Pick<Types.Report, 'id' | 'created_at' | 'place' | 'latitude' | 'longitude'>
        )>>, error?: Types.Maybe<(
          { __typename?: 'Error' }
          & Pick<Types.Error, 'code' | 'message'>
        )> }
      )> }
    )>, error?: Types.Maybe<(
      { __typename?: 'Error' }
      & Pick<Types.Error, 'code' | 'message'>
    )> }
  ) }
);


export const GetUserDashboardDocument = gql`
    query getUserDashboard($date_from: String!, $date_to: String!) {
  getUserDashboard {
    dashboard {
      ownerships {
        items {
          id
          pet {
            ...DashboardPet
          }
        }
        success
        error {
          code
          message
        }
      }
      reports {
        items {
          id
          created_at
          place
          latitude
          longitude
        }
        success
        error {
          code
          message
        }
      }
    }
    success
    error {
      code
      message
    }
  }
}
    ${DashboardPetFragmentDoc}`;

/**
 * __useGetUserDashboardQuery__
 *
 * To run a query within a React component, call `useGetUserDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserDashboardQuery({
 *   variables: {
 *      date_from: // value for 'date_from'
 *      date_to: // value for 'date_to'
 *   },
 * });
 */
export function useGetUserDashboardQuery(baseOptions: Apollo.QueryHookOptions<GetUserDashboardQuery, GetUserDashboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserDashboardQuery, GetUserDashboardQueryVariables>(GetUserDashboardDocument, options);
      }
export function useGetUserDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDashboardQuery, GetUserDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserDashboardQuery, GetUserDashboardQueryVariables>(GetUserDashboardDocument, options);
        }
export type GetUserDashboardQueryHookResult = ReturnType<typeof useGetUserDashboardQuery>;
export type GetUserDashboardLazyQueryHookResult = ReturnType<typeof useGetUserDashboardLazyQuery>;
export type GetUserDashboardQueryResult = Apollo.QueryResult<GetUserDashboardQuery, GetUserDashboardQueryVariables>;