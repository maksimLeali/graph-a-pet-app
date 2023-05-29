import * as Types from '../../../../types.js';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions =  {}
export type CheckCodeMutationVariables = Types.Exact<{
  code: Types.Scalars['String'];
}>;


export type CheckCodeMutation = (
  { __typename?: 'Mutation' }
  & { checkCode: (
    { __typename?: 'CodeValidationResult' }
    & Pick<Types.CodeValidationResult, 'success' | 'is_valid'>
    & { error?: Types.Maybe<(
      { __typename?: 'Error' }
      & Pick<Types.Error, 'code' | 'message'>
    )>, code?: Types.Maybe<(
      { __typename?: 'Code' }
      & Pick<Types.Code, 'id' | 'code' | 'ref_id' | 'ref_table'>
    )> }
  ) }
);


export const CheckCodeDocument = gql`
    mutation checkCode($code: String!) {
  checkCode(code: $code) {
    error {
      code
      message
    }
    success
    is_valid
    code {
      id
      code
      ref_id
      ref_table
    }
  }
}
    `;
export type CheckCodeMutationFn = Apollo.MutationFunction<CheckCodeMutation, CheckCodeMutationVariables>;

/**
 * __useCheckCodeMutation__
 *
 * To run a mutation, you first call `useCheckCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkCodeMutation, { data, loading, error }] = useCheckCodeMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useCheckCodeMutation(baseOptions?: Apollo.MutationHookOptions<CheckCodeMutation, CheckCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckCodeMutation, CheckCodeMutationVariables>(CheckCodeDocument, options);
      }
export type CheckCodeMutationHookResult = ReturnType<typeof useCheckCodeMutation>;
export type CheckCodeMutationResult = Apollo.MutationResult<CheckCodeMutation>;
export type CheckCodeMutationOptions = Apollo.BaseMutationOptions<CheckCodeMutation, CheckCodeMutationVariables>;