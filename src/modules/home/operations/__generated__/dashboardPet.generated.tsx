import * as Types from '../../../../types.js';

import { gql } from '@apollo/client';
export type DashboardPetFragment = (
  { __typename?: 'Pet' }
  & Pick<Types.Pet, 'name' | 'id'>
  & { main_picture?: Types.Maybe<(
    { __typename?: 'Media' }
    & Pick<Types.Media, 'id' | 'url' | 'ref_id'>
    & { main_color?: Types.Maybe<(
      { __typename?: 'MainColor' }
      & Pick<Types.MainColor, 'color' | 'contrast'>
    )>, main_colors?: Types.Maybe<Array<(
      { __typename?: 'MainColor' }
      & Pick<Types.MainColor, 'color' | 'contrast'>
    )>> }
  )>, health_card?: Types.Maybe<(
    { __typename?: 'HealthCard' }
    & Pick<Types.HealthCard, 'id'>
    & { treatments: (
      { __typename?: 'PaginatedTreatments' }
      & Pick<Types.PaginatedTreatments, 'success'>
      & { items: Array<Types.Maybe<(
        { __typename?: 'Treatment' }
        & Pick<Types.Treatment, 'id' | 'date' | 'name' | 'type'>
      )>>, error?: Types.Maybe<(
        { __typename?: 'Error' }
        & Pick<Types.Error, 'code' | 'message'>
      )> }
    ) }
  )> }
);

export const DashboardPetFragmentDoc = gql`
    fragment DashboardPet on Pet {
  name
  id
  main_picture {
    id
    main_color {
      color
      contrast
    }
    main_colors {
      color
      contrast
    }
    url
    ref_id
  }
  health_card {
    id
    treatments(
      commonSearch: {filters: {ranges: [{key: "date", value: {min: $date_from, max: $date_to}}]}}
    ) {
      items {
        id
        date
        name
        type
      }
      success
      error {
        code
        message
      }
    }
  }
}
    `;