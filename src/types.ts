import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export enum AreaType {
  Common = 'COMMON',
  Kennel = 'KENNEL',
  Medical = 'MEDICAL',
  Office = 'OFFICE',
  Other = 'OTHER',
  Outdoor = 'OUTDOOR',
  Playground = 'PLAYGROUND',
  Quarantine = 'QUARANTINE',
  Storage = 'STORAGE'
}

export enum BoxStatus {
  Available = 'AVAILABLE',
  Full = 'FULL',
  NeedsCleaning = 'NEEDS_CLEANING',
  Occupied = 'OCCUPIED',
  OutOfService = 'OUT_OF_SERVICE'
}

export type ChangeShelterInput = {
  pet_id: Scalars['ID']['input'];
  shelter_id_from: Scalars['ID']['input'];
  shelter_id_to: Scalars['ID']['input'];
};

export enum CoatLength {
  Hairless = 'HAIRLESS',
  Long = 'LONG',
  Medium = 'MEDIUM',
  Short = 'SHORT'
}

export type Code = {
  __typename?: 'Code';
  code: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  created_by: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ref_id: Scalars['ID']['output'];
  ref_table: Scalars['String']['output'];
  scope: Scalars['String']['output'];
  valid: Scalars['Boolean']['output'];
};

export type CodeCreate = {
  code: Scalars['String']['input'];
  ref_id: Scalars['String']['input'];
  ref_table: Scalars['String']['input'];
};

export type CodeResult = {
  __typename?: 'CodeResult';
  code?: Maybe<Code>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type CodeValidationResult = {
  __typename?: 'CodeValidationResult';
  code?: Maybe<Code>;
  error?: Maybe<Error>;
  is_valid?: Maybe<Scalars['Boolean']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CommonSearch = {
  filters?: InputMaybe<DeepFilters>;
  order_by?: InputMaybe<Scalars['String']['input']>;
  order_direction?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  page_size?: InputMaybe<Scalars['Int']['input']>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude?: Maybe<Scalars['Float']['output']>;
  longitude?: Maybe<Scalars['Float']['output']>;
};

export type CreatePersonalWorkspaceInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  contacts?: InputMaybe<Array<InputMaybe<ShelterContactInput>>>;
  district?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  postal_code?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  street_number?: InputMaybe<Scalars['String']['input']>;
};

export type CreateShelterPersonInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  shelter_id: Scalars['ID']['input'];
  source?: InputMaybe<ShelterPersonSource>;
  status?: InputMaybe<ShelterPersonStatus>;
  user_id?: InputMaybe<Scalars['ID']['input']>;
};

export type Cure = {
  __typename?: 'Cure';
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  frequency_times?: Maybe<Scalars['Int']['output']>;
  frequency_unit?: Maybe<FrequencyUnit>;
  frequency_value?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  treatment: MinTreatment;
};

export type CureCreate = {
  date: Scalars['String']['input'];
  frequency_times?: InputMaybe<Scalars['Int']['input']>;
  frequency_unit?: InputMaybe<FrequencyUnit>;
  frequency_value?: InputMaybe<Scalars['Int']['input']>;
  health_card_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type CureResult = {
  __typename?: 'CureResult';
  cure?: Maybe<Cure>;
  error?: Maybe<Error>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type CureUpdate = {
  date?: InputMaybe<Scalars['String']['input']>;
  frequency_times?: InputMaybe<Scalars['Int']['input']>;
  frequency_unit?: InputMaybe<FrequencyUnit>;
  frequency_value?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum CustodyLevel {
  Owner = 'OWNER',
  PetSitter = 'PET_SITTER',
  SubOwner = 'SUB_OWNER'
}

export type DailyStats = {
  __typename?: 'DailyStats';
  active_users: Scalars['Int']['output'];
  active_users_percent: Scalars['Float']['output'];
  all_pets: Scalars['Int']['output'];
  all_reports: Scalars['Int']['output'];
  all_users: Scalars['Int']['output'];
  daily_reports: Scalars['Int']['output'];
};

export type DamnatioMemoriae = {
  __typename?: 'DamnatioMemoriae';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  original_data?: Maybe<Scalars['JSON']['output']>;
  original_table: Scalars['String']['output'];
};

export type DamnatioMemoriaeResult = {
  __typename?: 'DamnatioMemoriaeResult';
  DamnatioMemoriae?: Maybe<DamnatioMemoriae>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type Dashboard = {
  __typename?: 'Dashboard';
  active_users: Scalars['Int']['output'];
  active_users_mean: Scalars['Int']['output'];
  active_users_percent: Scalars['Float']['output'];
  active_users_percent_stats: Array<Scalars['Float']['output']>;
  active_users_stats: Array<Scalars['Int']['output']>;
  all_pet_stats: Array<Scalars['Int']['output']>;
  all_pets: Scalars['Int']['output'];
  all_users: Scalars['Int']['output'];
  all_users_stats: Array<Scalars['Int']['output']>;
  labels: Array<Scalars['String']['output']>;
};

export type DashboardResult = {
  __typename?: 'DashboardResult';
  dashboard?: Maybe<Dashboard>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type DeepFilters = {
  and?: InputMaybe<DeepFilters>;
  fixed?: InputMaybe<Array<InputMaybe<FixedFilter>>>;
  join?: InputMaybe<Array<InputMaybe<Join>>>;
  lists?: InputMaybe<Array<InputMaybe<ListFilter>>>;
  not?: InputMaybe<DeepFilters>;
  or?: InputMaybe<DeepFilters>;
  ranges?: InputMaybe<Array<InputMaybe<RangeFilter>>>;
  search?: InputMaybe<SearchFilter>;
};

export type DefaultResult = {
  __typename?: 'DefaultResult';
  error?: Maybe<Error>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  error?: Maybe<Error>;
  id?: Maybe<Scalars['ID']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type Error = {
  __typename?: 'Error';
  code: Scalars['String']['output'];
  errorCode?: Maybe<Scalars['String']['output']>;
  extra?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type Filters = {
  fixed?: InputMaybe<Array<InputMaybe<FixedFilter>>>;
  join?: InputMaybe<Array<InputMaybe<Join>>>;
  lists?: InputMaybe<Array<InputMaybe<ListFilter>>>;
  ranges?: InputMaybe<Array<InputMaybe<RangeFilter>>>;
  search?: InputMaybe<Array<InputMaybe<SearchFilter>>>;
};

export type FixedFilter = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export enum FrequencyUnit {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  NotSaid = 'NOT_SAID'
}

export type GenericResult = {
  __typename?: 'GenericResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type HealthCard = {
  __typename?: 'HealthCard';
  id: Scalars['ID']['output'];
  notes: Array<Maybe<Scalars['String']['output']>>;
  pet: Pet;
  treatments: PaginatedTreatments;
};


export type HealthCardTreatmentsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type HealthCardCreate = {
  pet_id: Scalars['ID']['input'];
};

export type HealthCardResult = {
  __typename?: 'HealthCardResult';
  error?: Maybe<Error>;
  health_card?: Maybe<HealthCard>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type HealthCardUpdate = {
  notes: Array<InputMaybe<Scalars['String']['input']>>;
};

export enum InventoryCategory {
  Equipment = 'EQUIPMENT',
  FoodDry = 'FOOD_DRY',
  FoodWet = 'FOOD_WET',
  Hygiene = 'HYGIENE',
  Medicine = 'MEDICINE',
  Other = 'OTHER'
}

/** just see */
export type Join = {
  key: Scalars['String']['input'];
  value: DeepFilters;
};

export type ListFilter = {
  key?: InputMaybe<Scalars['String']['input']>;
  value: Array<InputMaybe<Scalars['String']['input']>>;
};

export type MainColor = {
  __typename?: 'MainColor';
  color: Scalars['String']['output'];
  contrast: Scalars['String']['output'];
};

export type MainColorCreate = {
  color: Scalars['String']['input'];
  contrast?: InputMaybe<Scalars['String']['input']>;
};

export enum MapElementType {
  Bench = 'BENCH',
  Door = 'DOOR',
  FeedingPoint = 'FEEDING_POINT',
  Gate = 'GATE',
  Other = 'OTHER',
  Tree = 'TREE',
  Wall = 'WALL',
  WaterPoint = 'WATER_POINT'
}

export enum MapUnit {
  Meters = 'METERS',
  Pixels = 'PIXELS'
}

export type Media = {
  __typename?: 'Media';
  id: Scalars['ID']['output'];
  main_color?: Maybe<MainColor>;
  main_colors?: Maybe<Array<MainColor>>;
  ref_id: Scalars['String']['output'];
  scope: Scalars['String']['output'];
  type: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type MediaCreate = {
  main_color?: InputMaybe<MainColorCreate>;
  main_colors?: InputMaybe<Array<InputMaybe<MainColorCreate>>>;
  ref_id: Scalars['String']['input'];
  scope: Scalars['String']['input'];
  type: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type MediaResult = {
  __typename?: 'MediaResult';
  error?: Maybe<Error>;
  media?: Maybe<Media>;
  success: Scalars['Boolean']['output'];
};

export type MediaUpdate = {
  main_color?: InputMaybe<MainColorCreate>;
  main_colors?: InputMaybe<Array<InputMaybe<MainColorCreate>>>;
  ref_id?: InputMaybe<Scalars['String']['input']>;
  scope?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type MinTreatment = {
  __typename?: 'MinTreatment';
  date: Scalars['String']['output'];
  duration?: Maybe<TreatmentDuration>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: TreatmentType;
};

export enum MovementType {
  Adjustment = 'ADJUSTMENT',
  Consumption = 'CONSUMPTION',
  Donation = 'DONATION',
  Restock = 'RESTOCK',
  Waste = 'WASTE'
}

export type Mutation = {
  __typename?: 'Mutation';
  acceptPetOwnershipInvite: OwnershipResult;
  acceptShelterInvite: ShelterInviteResult;
  acceptShelterOwnershipTransfer: ShelterOwnershipTransferResult;
  addPet: PetResult;
  addPetToMe: PetAddedResult;
  addPetToUser: PetAddedResult;
  approveShelterClaim: ShelterClaimRequestResult;
  archiveShelterInventoryItem: ShelterInventoryItemResult;
  archiveShelterPerson: ShelterPersonResult;
  assignPetToBox: ShelterBoxOccupancyResult;
  cancelShelterClaim: ShelterClaimRequestResult;
  cancelShelterOwnershipTransfer: ShelterOwnershipTransferResult;
  cancelShelterWalk: ShelterWalkResult;
  changeShelter: ShelterPetResult;
  checkCode: CodeValidationResult;
  completeShelterTask: ShelterTaskResult;
  completeShelterWalk: ShelterWalkResult;
  createCode: CodeResult;
  createCure: CureResult;
  createHealthCard: HealthCardResult;
  createMedia: MediaResult;
  createPersonalWorkspace: ShelterResult;
  createPet: PetResult;
  createPetWeight: PetWeightResult;
  createReport: ReportResult;
  createShelter: ShelterResult;
  createShelterArea: ShelterAreaResult;
  createShelterBox: ShelterBoxResult;
  createShelterInventoryItem: ShelterInventoryItemResult;
  createShelterInventoryMovement: ShelterInventoryMovementResult;
  createShelterInvite: ShelterInviteResult;
  createShelterMap: ShelterMapResult;
  createShelterMapElement: ShelterMapElementResult;
  createShelterPerson: ShelterPersonResult;
  createShelterPet: ShelterPetResult;
  createShelterPets: ShelterPetsResult;
  createShelterPetsWithData: ShelterPetsResult;
  createShelterRole: ShelterRoleResult;
  createShelterTask: ShelterTaskResult;
  createShelterWalk: ShelterWalkResult;
  createShelterWalkRating: ShelterWalkRatingResult;
  createShelterZone: ShelterZoneResult;
  createTreatment: TreatmentResult;
  createUser: UserResult;
  createWalk: WalkResult;
  createWalkRating: WalkRatingResult;
  deleteCure: DeleteResult;
  deleteOwnership: DeleteResult;
  deletePet: DeleteResult;
  deleteShelter: DeleteResult;
  deleteShelterArea: DeleteResult;
  deleteShelterBox: DeleteResult;
  deleteShelterInventoryItem: DeleteResult;
  deleteShelterMap: DeleteResult;
  deleteShelterMapElement: DeleteResult;
  deleteShelterPet: DeleteResult;
  deleteShelterRole: DeleteResult;
  deleteShelterTask: DeleteResult;
  deleteShelterWalk: DeleteResult;
  deleteShelterZone: DeleteResult;
  deleteTreatment: DeleteResult;
  deleteUser: DeleteResult;
  deleteWalk: DeleteResult;
  deleteWalkRating: DeleteResult;
  dismissNotification: NotificationResult;
  invitePetOwnership: OwnershipResult;
  linkPetToMe: OwnershipResult;
  linkPetToUser: OwnershipResult;
  linkShelterPersonToUser: ShelterPersonResult;
  login: NewTokenResult;
  logout: Scalars['Boolean']['output'];
  markAllNotificationsAsRead: NotificationResult;
  markBoxCleaned: ShelterBoxResult;
  markNotificationAsRead: NotificationResult;
  movePetBetweenBoxes: ShelterBoxOccupancyResult;
  refreshToken: NewTokenResult;
  rejectPetOwnershipInvite: OwnershipResult;
  rejectShelterClaim: ShelterClaimRequestResult;
  rejectShelterInvite: ShelterInviteResult;
  rejectShelterOwnershipTransfer: ShelterOwnershipTransferResult;
  releasePetFromBox: ShelterBoxOccupancyResult;
  requestShelterClaim: ShelterClaimRequestResult;
  requestShelterOwnershipTransfer: ShelterOwnershipTransferResult;
  resendCode: GenericResult;
  respondToReport: ReportResult;
  restoreMemoriae: RestoredResult;
  saveShelterMapLayout: ShelterMapResult;
  setBoxOutOfService: ShelterBoxResult;
  setShelterWalkManualDuration: ShelterWalkResult;
  signUp: UserResult;
  skipShelterTask: ShelterTaskResult;
  startShelterWalk: ShelterWalkResult;
  updateCure: CureResult;
  updateHealthCard: HealthCardResult;
  updateMe: UserResult;
  updateMedia: MediaResult;
  updateOwnership: OwnershipResult;
  updatePet: PetResult;
  updateReport: ReportResult;
  updateShelter: ShelterResult;
  updateShelterArea: ShelterAreaResult;
  updateShelterBox: ShelterBoxResult;
  updateShelterInventoryItem: ShelterInventoryItemResult;
  updateShelterMap: ShelterMapResult;
  updateShelterMapElement: ShelterMapElementResult;
  updateShelterPerson: ShelterPersonResult;
  updateShelterRole: ShelterRoleResult;
  updateShelterTask: ShelterTaskResult;
  updateShelterWalk: ShelterWalkResult;
  updateShelterZone: ShelterZoneResult;
  updateTreatment: TreatmentResult;
  updateUser: UserResult;
  updateWalk: WalkResult;
  updateWalkRating: WalkRatingResult;
  verifyUser: NewTokenResult;
};


export type MutationAcceptPetOwnershipInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAcceptShelterInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAcceptShelterOwnershipTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAddPetArgs = {
  pet: PetCreate;
};


export type MutationAddPetToMeArgs = {
  custodyLevel?: InputMaybe<CustodyLevel>;
  pet: PetCreate;
};


export type MutationAddPetToUserArgs = {
  pet: PetCreate;
  userId: Scalars['String']['input'];
};


export type MutationApproveShelterClaimArgs = {
  decision_note?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationArchiveShelterInventoryItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveShelterPersonArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAssignPetToBoxArgs = {
  box_id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
  shelter_pet_id: Scalars['ID']['input'];
};


export type MutationCancelShelterClaimArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelShelterOwnershipTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCancelShelterWalkArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationChangeShelterArgs = {
  data: ChangeShelterInput;
};


export type MutationCheckCodeArgs = {
  code: Scalars['String']['input'];
};


export type MutationCompleteShelterTaskArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCompleteShelterWalkArgs = {
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCreateCodeArgs = {
  data: CodeCreate;
};


export type MutationCreateCureArgs = {
  data: CureCreate;
};


export type MutationCreateHealthCardArgs = {
  data: HealthCardCreate;
};


export type MutationCreateMediaArgs = {
  data: MediaCreate;
};


export type MutationCreatePersonalWorkspaceArgs = {
  data: CreatePersonalWorkspaceInput;
};


export type MutationCreatePetArgs = {
  data: PetCreate;
};


export type MutationCreatePetWeightArgs = {
  data: PetWeightCreate;
};


export type MutationCreateReportArgs = {
  data: ReportCreate;
};


export type MutationCreateShelterArgs = {
  data: ShelterCreate;
};


export type MutationCreateShelterAreaArgs = {
  data: ShelterAreaCreate;
};


export type MutationCreateShelterBoxArgs = {
  data: ShelterBoxCreate;
};


export type MutationCreateShelterInventoryItemArgs = {
  data: ShelterInventoryItemCreate;
};


export type MutationCreateShelterInventoryMovementArgs = {
  data: ShelterInventoryMovementCreate;
};


export type MutationCreateShelterInviteArgs = {
  data: ShelterInviteCreate;
};


export type MutationCreateShelterMapArgs = {
  data: ShelterMapCreate;
};


export type MutationCreateShelterMapElementArgs = {
  data: ShelterMapElementCreate;
};


export type MutationCreateShelterPersonArgs = {
  data: CreateShelterPersonInput;
};


export type MutationCreateShelterPetArgs = {
  data: ShelterPetCreate;
};


export type MutationCreateShelterPetsArgs = {
  data: ShelterPetsCreate;
};


export type MutationCreateShelterPetsWithDataArgs = {
  data: ShelterPetsWithDataCreate;
};


export type MutationCreateShelterRoleArgs = {
  data: ShelterRoleCreate;
};


export type MutationCreateShelterTaskArgs = {
  data: ShelterTaskCreate;
};


export type MutationCreateShelterWalkArgs = {
  data: ShelterWalkCreate;
};


export type MutationCreateShelterWalkRatingArgs = {
  data: ShelterWalkRatingCreate;
};


export type MutationCreateShelterZoneArgs = {
  data: ShelterZoneCreate;
};


export type MutationCreateTreatmentArgs = {
  data: TreatmentCreate;
};


export type MutationCreateUserArgs = {
  data: UserCreate;
};


export type MutationCreateWalkArgs = {
  data: WalkCreate;
};


export type MutationCreateWalkRatingArgs = {
  data: WalkRatingCreate;
};


export type MutationDeleteCureArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteOwnershipArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterAreaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterBoxArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterInventoryItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterMapArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterMapElementArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterPetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterRoleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterWalkArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteShelterZoneArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTreatmentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWalkArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteWalkRatingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDismissNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationInvitePetOwnershipArgs = {
  custodyLevel: CustodyLevel;
  petId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationLinkPetToMeArgs = {
  custodyLevel?: InputMaybe<CustodyLevel>;
  petId: Scalars['ID']['input'];
};


export type MutationLinkPetToUserArgs = {
  custodyLevel?: InputMaybe<CustodyLevel>;
  petId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationLinkShelterPersonToUserArgs = {
  person_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMarkBoxCleanedArgs = {
  box_id: Scalars['ID']['input'];
};


export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMovePetBetweenBoxesArgs = {
  reason?: InputMaybe<Scalars['String']['input']>;
  shelter_pet_id: Scalars['ID']['input'];
  to_box_id: Scalars['ID']['input'];
};


export type MutationRejectPetOwnershipInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRejectShelterClaimArgs = {
  decision_note?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationRejectShelterInviteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRejectShelterOwnershipTransferArgs = {
  id: Scalars['ID']['input'];
};


export type MutationReleasePetFromBoxArgs = {
  occupancy_id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRequestShelterClaimArgs = {
  data: ShelterClaimInput;
  shelter_id: Scalars['ID']['input'];
};


export type MutationRequestShelterOwnershipTransferArgs = {
  new_role_for_previous_owner?: InputMaybe<RoleLevel>;
  shelter_id: Scalars['ID']['input'];
  to_user_id: Scalars['ID']['input'];
};


export type MutationResendCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationRespondToReportArgs = {
  id: Scalars['ID']['input'];
  reporter: ReporterCreate;
};


export type MutationRestoreMemoriaeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSaveShelterMapLayoutArgs = {
  data: ShelterMapLayoutInput;
  map_id: Scalars['ID']['input'];
};


export type MutationSetBoxOutOfServiceArgs = {
  box_id: Scalars['ID']['input'];
  out_of_service: Scalars['Boolean']['input'];
};


export type MutationSetShelterWalkManualDurationArgs = {
  duration_minutes: Scalars['Int']['input'];
  id: Scalars['ID']['input'];
};


export type MutationSignUpArgs = {
  data: UserCreate;
};


export type MutationSkipShelterTaskArgs = {
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};


export type MutationStartShelterWalkArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCureArgs = {
  data: CureUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateHealthCardArgs = {
  data: HealthCardUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateMeArgs = {
  data: UserUpdate;
};


export type MutationUpdateMediaArgs = {
  data: MediaUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateOwnershipArgs = {
  data: OwnershipUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdatePetArgs = {
  data: PetUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateReportArgs = {
  data: ReportUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterArgs = {
  data: ShelterUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterAreaArgs = {
  data: ShelterAreaUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterBoxArgs = {
  data: ShelterBoxUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterInventoryItemArgs = {
  data: ShelterInventoryItemUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterMapArgs = {
  data: ShelterMapUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterMapElementArgs = {
  data: ShelterMapElementUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterPersonArgs = {
  data: UpdateShelterPersonInput;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterRoleArgs = {
  data: ShelterRoleUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterTaskArgs = {
  data: ShelterTaskUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterWalkArgs = {
  data: ShelterWalkUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateShelterZoneArgs = {
  data: ShelterZoneUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateTreatmentArgs = {
  data: TreatmentUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateWalkArgs = {
  data: WalkUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateWalkRatingArgs = {
  data: WalkRatingUpdate;
  id: Scalars['ID']['input'];
};


export type MutationVerifyUserArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
};

export type MyShelterDashboard = {
  __typename?: 'MyShelterDashboard';
  in_progress_walk_count: Scalars['Int']['output'];
  inventory_alerts: Array<MyShelterDashboardInventoryAlert>;
  low_stock_count: Scalars['Int']['output'];
  out_of_stock_count: Scalars['Int']['output'];
  overdue_task_count: Scalars['Int']['output'];
  task_count: Scalars['Int']['output'];
  tasks: Array<MyShelterDashboardTask>;
  walk_count: Scalars['Int']['output'];
  walks: Array<MyShelterDashboardWalk>;
};

export type MyShelterDashboardInventoryAlert = {
  __typename?: 'MyShelterDashboardInventoryAlert';
  action_url: Scalars['String']['output'];
  current_quantity: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  minimum_threshold?: Maybe<Scalars['Float']['output']>;
  name: Scalars['String']['output'];
  shelter_id: Scalars['ID']['output'];
  shelter_name: Scalars['String']['output'];
  status: ShelterInventoryAlertStatus;
};

export type MyShelterDashboardResult = {
  __typename?: 'MyShelterDashboardResult';
  dashboard?: Maybe<MyShelterDashboard>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type MyShelterDashboardTask = {
  __typename?: 'MyShelterDashboardTask';
  action_url: Scalars['String']['output'];
  area?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  is_overdue: Scalars['Boolean']['output'];
  scheduled_at?: Maybe<Scalars['String']['output']>;
  shelter_id: Scalars['ID']['output'];
  shelter_name: Scalars['String']['output'];
  status: TaskStatus;
  task_type: ShelterTaskType;
};

export type MyShelterDashboardWalk = {
  __typename?: 'MyShelterDashboardWalk';
  action_url: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pet_name: Scalars['String']['output'];
  scheduled_at?: Maybe<Scalars['String']['output']>;
  shelter_id: Scalars['ID']['output'];
  shelter_name: Scalars['String']['output'];
  status: ShelterWalkStatus;
};

export type NewOwnership = {
  __typename?: 'NewOwnership';
  ownership: Ownership;
  pet: Pet;
};

export type NewTokenResult = {
  __typename?: 'NewTokenResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type Notification = {
  __typename?: 'Notification';
  action_url?: Maybe<Scalars['String']['output']>;
  actor_user_id?: Maybe<Scalars['ID']['output']>;
  created_at: Scalars['String']['output'];
  dedupe_key?: Maybe<Scalars['String']['output']>;
  dismissed_at?: Maybe<Scalars['String']['output']>;
  entity_id?: Maybe<Scalars['ID']['output']>;
  entity_type?: Maybe<NotificationEntityType>;
  expires_at?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['JSON']['output']>;
  pet_id?: Maybe<Scalars['ID']['output']>;
  priority: NotificationPriority;
  read_at?: Maybe<Scalars['String']['output']>;
  scheduled_at?: Maybe<Scalars['String']['output']>;
  shelter_id?: Maybe<Scalars['ID']['output']>;
  status: NotificationStatus;
  title: Scalars['String']['output'];
  type: NotificationType;
  updated_at?: Maybe<Scalars['String']['output']>;
  user_id: Scalars['ID']['output'];
};

export enum NotificationEntityType {
  Ownership = 'OWNERSHIP',
  Pet = 'PET',
  Shelter = 'SHELTER',
  ShelterInvite = 'SHELTER_INVITE',
  ShelterJoinRequest = 'SHELTER_JOIN_REQUEST',
  ShelterOwnershipTransfer = 'SHELTER_OWNERSHIP_TRANSFER',
  ShelterTask = 'SHELTER_TASK',
  Treatment = 'TREATMENT'
}

export enum NotificationPriority {
  High = 'HIGH',
  Low = 'LOW',
  Normal = 'NORMAL',
  Urgent = 'URGENT'
}

export type NotificationResult = {
  __typename?: 'NotificationResult';
  error?: Maybe<Error>;
  notification?: Maybe<Notification>;
  success: Scalars['Boolean']['output'];
};

export enum NotificationStatus {
  Dismissed = 'DISMISSED',
  Expired = 'EXPIRED',
  Read = 'READ',
  Unread = 'UNREAD'
}

export enum NotificationType {
  PetBirthday = 'PET_BIRTHDAY',
  PetOwnershipInvite = 'PET_OWNERSHIP_INVITE',
  ShelterInvite = 'SHELTER_INVITE',
  ShelterJoinRequest = 'SHELTER_JOIN_REQUEST',
  ShelterOwnershipTransfer = 'SHELTER_OWNERSHIP_TRANSFER',
  ShelterTaskInstance = 'SHELTER_TASK_INSTANCE',
  TreatmentReminder = 'TREATMENT_REMINDER'
}

export type Ownership = {
  __typename?: 'Ownership';
  custody_level: CustodyLevel;
  id: Scalars['ID']['output'];
  pet: Pet;
  status: OwnershipStatus;
  user: User;
};

export type OwnershipResult = {
  __typename?: 'OwnershipResult';
  error?: Maybe<Error>;
  ownership?: Maybe<Ownership>;
  success: Scalars['Boolean']['output'];
};

export enum OwnershipStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type OwnershipUpdate = {
  custody_level: CustodyLevel;
};

export type OwnershipsResult = {
  __typename?: 'OwnershipsResult';
  error?: Maybe<Error>;
  ownerships: Array<Maybe<Ownership>>;
  success: Scalars['Boolean']['output'];
};

export type PaginatedBoxOccupancies = {
  __typename?: 'PaginatedBoxOccupancies';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterBoxOccupancy>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedCodes = {
  __typename?: 'PaginatedCodes';
  error?: Maybe<Error>;
  items: Array<Maybe<Code>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedCures = {
  __typename?: 'PaginatedCures';
  error?: Maybe<Error>;
  items: Array<Maybe<Cure>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedDamnationesMemoriae = {
  __typename?: 'PaginatedDamnationesMemoriae';
  error?: Maybe<Error>;
  items: Array<Maybe<DamnatioMemoriae>>;
  pagination: Pagination;
  success: Scalars['Boolean']['output'];
};

export type PaginatedHealthCards = {
  __typename?: 'PaginatedHealthCards';
  error?: Maybe<Error>;
  items: Array<Maybe<HealthCard>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedInventoryItems = {
  __typename?: 'PaginatedInventoryItems';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterInventoryItem>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedInventoryMovements = {
  __typename?: 'PaginatedInventoryMovements';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterInventoryMovement>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedMapElements = {
  __typename?: 'PaginatedMapElements';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterMapElement>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedMedias = {
  __typename?: 'PaginatedMedias';
  error?: Maybe<Error>;
  items: Array<Maybe<Media>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedNotifications = {
  __typename?: 'PaginatedNotifications';
  error?: Maybe<Error>;
  items: Array<Maybe<Notification>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedOwnerships = {
  __typename?: 'PaginatedOwnerships';
  error?: Maybe<Error>;
  items: Array<Maybe<Ownership>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedPets = {
  __typename?: 'PaginatedPets';
  error?: Maybe<Error>;
  items: Array<Maybe<Pet>>;
  pagination: Pagination;
  success: Scalars['Boolean']['output'];
};

export type PaginatedPublicShelters = {
  __typename?: 'PaginatedPublicShelters';
  error?: Maybe<Error>;
  items: Array<Maybe<PublicShelter>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedReports = {
  __typename?: 'PaginatedReports';
  error?: Maybe<Error>;
  items: Array<Maybe<Report>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterAreas = {
  __typename?: 'PaginatedShelterAreas';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterArea>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterBoxes = {
  __typename?: 'PaginatedShelterBoxes';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterBox>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterClaimRequests = {
  __typename?: 'PaginatedShelterClaimRequests';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterClaimRequest>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterMaps = {
  __typename?: 'PaginatedShelterMaps';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterMap>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterOwnershipTransfers = {
  __typename?: 'PaginatedShelterOwnershipTransfers';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterOwnershipTransfer>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterPeople = {
  __typename?: 'PaginatedShelterPeople';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterPerson>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterPets = {
  __typename?: 'PaginatedShelterPets';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterPet>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterRoles = {
  __typename?: 'PaginatedShelterRoles';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterRole>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterTasks = {
  __typename?: 'PaginatedShelterTasks';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterTask>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterWalks = {
  __typename?: 'PaginatedShelterWalks';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterWalk>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelterZones = {
  __typename?: 'PaginatedShelterZones';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterZone>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedShelters = {
  __typename?: 'PaginatedShelters';
  error?: Maybe<Error>;
  items: Array<Maybe<Shelter>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedTreatments = {
  __typename?: 'PaginatedTreatments';
  error?: Maybe<Error>;
  items: Array<Maybe<Treatment>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  error?: Maybe<Error>;
  items: Array<Maybe<User>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedWalkRatings = {
  __typename?: 'PaginatedWalkRatings';
  error?: Maybe<Error>;
  items: Array<Maybe<WalkRating>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type PaginatedWalks = {
  __typename?: 'PaginatedWalks';
  error?: Maybe<Error>;
  items: Array<Maybe<Walk>>;
  pagination: Pagination;
  success?: Maybe<Scalars['Boolean']['output']>;
};

/** how a list is owganized by how many items has been found, in which page we are, the number of element per page and how many pages there are */
export type Pagination = {
  __typename?: 'Pagination';
  current_page?: Maybe<Scalars['Int']['output']>;
  page_size?: Maybe<Scalars['Int']['output']>;
  total_items?: Maybe<Scalars['Int']['output']>;
  total_pages?: Maybe<Scalars['Int']['output']>;
};

export type Pet = {
  __typename?: 'Pet';
  birthday?: Maybe<Scalars['String']['output']>;
  breed?: Maybe<Scalars['String']['output']>;
  chip_code?: Maybe<Scalars['String']['output']>;
  coat_length?: Maybe<CoatLength>;
  diet?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  disciplines?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  gender?: Maybe<Gender>;
  health_card?: Maybe<HealthCard>;
  id: Scalars['ID']['output'];
  intollerance?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  main_picture?: Maybe<Media>;
  name: Scalars['String']['output'];
  neutered?: Maybe<Scalars['Boolean']['output']>;
  ownerships?: Maybe<PaginatedOwnerships>;
  pictures?: Maybe<PaginatedMedias>;
  report?: Maybe<Report>;
  temperament?: Maybe<Scalars['String']['output']>;
  weight_kg?: Maybe<Scalars['Float']['output']>;
  years?: Maybe<Scalars['Int']['output']>;
};


export type PetOwnershipsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type PetPicturesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type PetAddedResult = {
  __typename?: 'PetAddedResult';
  data?: Maybe<NewOwnership>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type PetCreate = {
  birthday?: InputMaybe<Scalars['String']['input']>;
  breed?: InputMaybe<Scalars['String']['input']>;
  chip_code?: InputMaybe<Scalars['String']['input']>;
  coat_length?: InputMaybe<CoatLength>;
  diet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  disciplines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  gender?: InputMaybe<Gender>;
  intollerance?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
  neutered?: InputMaybe<Scalars['Boolean']['input']>;
  temperament?: InputMaybe<Scalars['String']['input']>;
  weight_kg?: InputMaybe<Scalars['Float']['input']>;
};

export enum PetFamily {
  Birds = 'BIRDS',
  Canine = 'CANINE',
  Feline = 'FELINE',
  Fish = 'FISH',
  Reptile = 'REPTILE'
}

export type PetResult = {
  __typename?: 'PetResult';
  error?: Maybe<Error>;
  pet?: Maybe<Pet>;
  success: Scalars['Boolean']['output'];
};

export type PetUpdate = {
  birthday?: InputMaybe<Scalars['String']['input']>;
  breed?: InputMaybe<Scalars['String']['input']>;
  chip_code?: InputMaybe<Scalars['String']['input']>;
  coat_length?: InputMaybe<CoatLength>;
  diet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  disciplines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  gender?: InputMaybe<Gender>;
  intollerance?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  neutered?: InputMaybe<Scalars['Boolean']['input']>;
  temperament?: InputMaybe<Scalars['String']['input']>;
  weight_kg?: InputMaybe<Scalars['Float']['input']>;
};

export type PetWeight = {
  __typename?: 'PetWeight';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pet_id: Scalars['ID']['output'];
  weight_kg: Scalars['Float']['output'];
};

export type PetWeightChartData = {
  __typename?: 'PetWeightChartData';
  data: Array<Maybe<Scalars['Float']['output']>>;
  labels: Array<Scalars['String']['output']>;
};

export type PetWeightChartResult = {
  __typename?: 'PetWeightChartResult';
  chart?: Maybe<PetWeightChartData>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type PetWeightCreate = {
  pet_id: Scalars['ID']['input'];
  weight_kg: Scalars['Float']['input'];
};

export type PetWeightResult = {
  __typename?: 'PetWeightResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  weight?: Maybe<PetWeight>;
};

export type PetsResult = {
  __typename?: 'PetsResult';
  error?: Maybe<Error>;
  pets: Array<Maybe<Pet>>;
  success: Scalars['Boolean']['output'];
};

export type PublicShelter = {
  __typename?: 'PublicShelter';
  accepts_volunteers: Scalars['Boolean']['output'];
  city?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  logo_media_id?: Maybe<Scalars['ID']['output']>;
  name: Scalars['String']['output'];
  public_contact_email?: Maybe<Scalars['String']['output']>;
  public_contact_phone?: Maybe<Scalars['String']['output']>;
  public_description?: Maybe<Scalars['String']['output']>;
  public_lat?: Maybe<Scalars['Float']['output']>;
  public_lng?: Maybe<Scalars['Float']['output']>;
  public_location_label?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
};

export type PublicShelterSearchInput = {
  accepts_volunteers?: InputMaybe<Scalars['Boolean']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  page_size?: InputMaybe<Scalars['Int']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  discoverShelters: PaginatedPublicShelters;
  getCode: CodeResult;
  getCure: Cure;
  getCurrentBoxForPet: ShelterBoxResult;
  getDamnatioMemoriae?: Maybe<DamnatioMemoriaeResult>;
  getDashboard: DashboardResult;
  getGroupedStatistics: StatisticsResult;
  getHealthCard?: Maybe<HealthCardResult>;
  getLatestPetWeight: PetWeightResult;
  getMedia: MediaResult;
  getMyShelterDashboard: MyShelterDashboardResult;
  getOrCreateCode?: Maybe<CodeResult>;
  getOwnership: OwnershipResult;
  getPet: PetResult;
  getPetWalkingStats: WalkRatingChartResult;
  getPetWeightStats: PetWeightChartResult;
  getPublicShelter?: Maybe<PublicShelter>;
  getRealTimeStatistic: RealTimeStatisticResult;
  getReport?: Maybe<ReportResult>;
  getShelter: ShelterResult;
  getShelterArea: ShelterAreaResult;
  getShelterBox: ShelterBoxResult;
  getShelterInventoryItem: ShelterInventoryItemResult;
  getShelterInvite: ShelterInviteResult;
  getShelterMap: ShelterMapResult;
  getShelterMapElement: ShelterMapElementResult;
  getShelterOperationalDashboard: ShelterOperationalDashboardResult;
  getShelterPerson?: Maybe<ShelterPerson>;
  getShelterPet: ShelterPetResult;
  getShelterPetWalkingStats: WalkRatingChartResult;
  getShelterRole: ShelterRoleResult;
  getShelterTask: ShelterTaskResult;
  getShelterWalk: ShelterWalkResult;
  getShelterZone: ShelterZoneResult;
  getTreatment?: Maybe<TreatmentResult>;
  getUnreadNotificationCount: Scalars['Int']['output'];
  getUser: UserResult;
  getUserDashboard: UserDashboardResult;
  getWalk: Walk;
  getWalkRating: WalkRatingResult;
  listCodes: PaginatedCodes;
  listCures: PaginatedCures;
  listDamnationesMemoriae?: Maybe<PaginatedDamnationesMemoriae>;
  listHealthCards: PaginatedHealthCards;
  listLowStockItems: PaginatedInventoryItems;
  listMedias: PaginatedMedias;
  listMyNotifications: PaginatedNotifications;
  listMyOwnershipTransfers: PaginatedShelterOwnershipTransfers;
  listMyPets: PaginatedPets;
  listMyShelterClaimRequests: PaginatedShelterClaimRequests;
  listMyTreatments: PaginatedTreatments;
  listOperationalShelterTasks: PaginatedShelterTasks;
  listOperationalShelterWalks: PaginatedShelterWalks;
  listOwnerships: PaginatedOwnerships;
  listPets: PaginatedPets;
  listPetsNeedingWalk: PaginatedShelterPets;
  listReports: PaginatedReports;
  listShelterAreas: PaginatedShelterAreas;
  listShelterBoxOccupancies: PaginatedBoxOccupancies;
  listShelterBoxes: PaginatedShelterBoxes;
  listShelterClaimRequests: PaginatedShelterClaimRequests;
  listShelterInventoryItems: PaginatedInventoryItems;
  listShelterInventoryMovements: PaginatedInventoryMovements;
  listShelterKpiHistory: ShelterKpiHistoryResult;
  listShelterMapElements: PaginatedMapElements;
  listShelterMaps: PaginatedShelterMaps;
  listShelterOwnershipTransfers: PaginatedShelterOwnershipTransfers;
  listShelterPeople: PaginatedShelterPeople;
  listShelterPets: PaginatedShelterPets;
  listShelterRoles: PaginatedShelterRoles;
  listShelterTasks: PaginatedShelterTasks;
  listShelterWalks: PaginatedShelterWalks;
  listShelterZones: PaginatedShelterZones;
  listShelters: PaginatedShelters;
  listTreatments: PaginatedTreatments;
  listUsers: PaginatedUsers;
  listWalkRatings: PaginatedWalkRatings;
  listWalks: PaginatedWalks;
  me: UserResult;
  myShelterAuthorization: ShelterAuthorizationResult;
};


export type QueryDiscoverSheltersArgs = {
  search?: InputMaybe<PublicShelterSearchInput>;
};


export type QueryGetCodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCureArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetCurrentBoxForPetArgs = {
  shelter_pet_id: Scalars['ID']['input'];
};


export type QueryGetDamnatioMemoriaeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGroupedStatisticsArgs = {
  date_from: Scalars['String']['input'];
  date_to?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetHealthCardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetLatestPetWeightArgs = {
  pet_id: Scalars['ID']['input'];
};


export type QueryGetMediaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetMyShelterDashboardArgs = {
  date_from: Scalars['String']['input'];
  date_to: Scalars['String']['input'];
};


export type QueryGetOrCreateCodeArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  ref_id: Scalars['String']['input'];
  ref_table: Scalars['String']['input'];
};


export type QueryGetOwnershipArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPetWalkingStatsArgs = {
  period: StatsPeriod;
  pet_id: Scalars['ID']['input'];
};


export type QueryGetPetWeightStatsArgs = {
  period: StatsPeriod;
  pet_id: Scalars['ID']['input'];
};


export type QueryGetPublicShelterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterAreaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterBoxArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterInventoryItemArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterInviteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterMapArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterMapElementArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterOperationalDashboardArgs = {
  shelter_id: Scalars['ID']['input'];
};


export type QueryGetShelterPersonArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterPetArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterPetWalkingStatsArgs = {
  period: StatsPeriod;
  shelter_pet_id: Scalars['ID']['input'];
};


export type QueryGetShelterRoleArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterWalkArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetShelterZoneArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTreatmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetWalkArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetWalkRatingArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListCodesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListCuresArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListDamnationesMemoriaeArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListHealthCardsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListLowStockItemsArgs = {
  shelter_id: Scalars['ID']['input'];
};


export type QueryListMediasArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListMyNotificationsArgs = {
  search?: InputMaybe<CommonSearch>;
};


export type QueryListMyOwnershipTransfersArgs = {
  search?: InputMaybe<CommonSearch>;
};


export type QueryListMyPetsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListMyShelterClaimRequestsArgs = {
  search?: InputMaybe<CommonSearch>;
};


export type QueryListMyTreatmentsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListOperationalShelterTasksArgs = {
  shelter_id: Scalars['ID']['input'];
};


export type QueryListOperationalShelterWalksArgs = {
  shelter_id: Scalars['ID']['input'];
};


export type QueryListOwnershipsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListPetsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListPetsNeedingWalkArgs = {
  hours?: InputMaybe<Scalars['Int']['input']>;
  shelter_id: Scalars['ID']['input'];
};


export type QueryListReportsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterAreasArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterBoxOccupanciesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterBoxesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterClaimRequestsArgs = {
  search?: InputMaybe<CommonSearch>;
  shelter_id: Scalars['ID']['input'];
};


export type QueryListShelterInventoryItemsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterInventoryMovementsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterKpiHistoryArgs = {
  days?: InputMaybe<Scalars['Int']['input']>;
  shelter_id: Scalars['ID']['input'];
};


export type QueryListShelterMapElementsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterMapsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterOwnershipTransfersArgs = {
  search?: InputMaybe<CommonSearch>;
  shelter_id: Scalars['ID']['input'];
};


export type QueryListShelterPeopleArgs = {
  search?: InputMaybe<CommonSearch>;
  shelter_id: Scalars['ID']['input'];
};


export type QueryListShelterPetsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterRolesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterTasksArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterWalksArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListShelterZonesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListSheltersArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListTreatmentsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListUsersArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListWalkRatingsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListWalksArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryMyShelterAuthorizationArgs = {
  shelter_id: Scalars['ID']['input'];
};

export type RangeFilter = {
  key: Scalars['String']['input'];
  value?: InputMaybe<RangeFilterValue>;
};

export type RangeFilterValue = {
  max?: InputMaybe<Scalars['String']['input']>;
  min?: InputMaybe<Scalars['String']['input']>;
};

export type RealTimeStatisticResult = {
  __typename?: 'RealTimeStatisticResult';
  error?: Maybe<Error>;
  statistics?: Maybe<DailyStats>;
  success: Scalars['Boolean']['output'];
};

export type Recurrence = {
  __typename?: 'Recurrence';
  freq: RecurrenceFreq;
  interval: Scalars['Int']['output'];
  start_at?: Maybe<Scalars['String']['output']>;
  time_of_day?: Maybe<Scalars['String']['output']>;
  week_ordinal?: Maybe<Scalars['Int']['output']>;
  weekdays?: Maybe<Array<Weekday>>;
};

export enum RecurrenceFreq {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

export type RecurrenceInput = {
  freq: RecurrenceFreq;
  interval?: InputMaybe<Scalars['Int']['input']>;
  start_at?: InputMaybe<Scalars['String']['input']>;
  time_of_day?: InputMaybe<Scalars['String']['input']>;
  week_ordinal?: InputMaybe<Scalars['Int']['input']>;
  weekdays?: InputMaybe<Array<Weekday>>;
};

export type Report = {
  __typename?: 'Report';
  coordinates: Coordinates;
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  medias?: Maybe<Array<Maybe<Media>>>;
  notes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  pet?: Maybe<Pet>;
  place: Scalars['String']['output'];
  reporter: Reporter;
  responders: Array<Maybe<Reporter>>;
  type: ReportType;
  updated_at: Scalars['String']['output'];
};

export type ReportCreate = {
  date?: InputMaybe<Scalars['String']['input']>;
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  notes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  pet_id?: InputMaybe<Scalars['String']['input']>;
  place: Scalars['String']['input'];
  reporter: ReporterCreate;
  type: ReportType;
};

export type ReportResult = {
  __typename?: 'ReportResult';
  error?: Maybe<Error>;
  report?: Maybe<Report>;
  success: Scalars['Boolean']['output'];
};

export enum ReportType {
  Found = 'FOUND',
  Missing = 'MISSING'
}

export type ReportUpdate = {
  latitude?: InputMaybe<Scalars['Float']['input']>;
  longitude?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  place?: InputMaybe<Scalars['String']['input']>;
  responders?: InputMaybe<Array<InputMaybe<ReporterCreate>>>;
};

export type Reporter = {
  __typename?: 'Reporter';
  email: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  last_name: Scalars['String']['output'];
  user_id?: Maybe<Scalars['String']['output']>;
};

export type ReporterCreate = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  user_id?: InputMaybe<Scalars['String']['input']>;
};

export type RestoredResult = {
  __typename?: 'RestoredResult';
  error?: Maybe<Error>;
  restored?: Maybe<Scalars['JSON']['output']>;
  success: Scalars['Boolean']['output'];
  table?: Maybe<Scalars['String']['output']>;
};

export enum RoleLevel {
  Manager = 'MANAGER',
  Owner = 'OWNER',
  Staff = 'STAFF',
  Volunteer = 'VOLUNTEER'
}

export type SearchFilter = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type Shelter = {
  __typename?: 'Shelter';
  accepts_volunteers: Scalars['Boolean']['output'];
  city: Scalars['String']['output'];
  contacts?: Maybe<Array<Maybe<ShelterContact>>>;
  created_at: Scalars['String']['output'];
  district?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  pets?: Maybe<PaginatedShelterPets>;
  postal_code: Scalars['String']['output'];
  province_code: Scalars['String']['output'];
  public_contact_email?: Maybe<Scalars['String']['output']>;
  public_contact_phone?: Maybe<Scalars['String']['output']>;
  public_description?: Maybe<Scalars['String']['output']>;
  public_lat?: Maybe<Scalars['Float']['output']>;
  public_lng?: Maybe<Scalars['Float']['output']>;
  public_location_label?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Scalars['String']['output']>;
  roles?: Maybe<PaginatedShelterRoles>;
  street: Scalars['String']['output'];
  street_number: Scalars['String']['output'];
  type: ShelterType;
  verification_status: ShelterVerificationStatus;
  visibility: ShelterVisibility;
};


export type ShelterPetsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type ShelterRolesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type ShelterArea = {
  __typename?: 'ShelterArea';
  area_type: AreaType;
  boxes: Array<ShelterBox>;
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  map_id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  zone?: Maybe<ShelterZone>;
  zone_id: Scalars['ID']['output'];
};

export type ShelterAreaCreate = {
  area_type: AreaType;
  color?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  map_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
  zone_id: Scalars['ID']['input'];
};

export type ShelterAreaResult = {
  __typename?: 'ShelterAreaResult';
  area?: Maybe<ShelterArea>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type ShelterAreaUpdate = {
  area_type?: InputMaybe<AreaType>;
  color?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  zone_id?: InputMaybe<Scalars['ID']['input']>;
};

export type ShelterAreaUpsert = {
  area_type: AreaType;
  color?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
  zone_id: Scalars['ID']['input'];
};

export type ShelterAuthorization = {
  __typename?: 'ShelterAuthorization';
  membership_status?: Maybe<Scalars['String']['output']>;
  permissions: Array<Scalars['String']['output']>;
  shelter_id: Scalars['ID']['output'];
};

export type ShelterAuthorizationResult = {
  __typename?: 'ShelterAuthorizationResult';
  authorization?: Maybe<ShelterAuthorization>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type ShelterBox = {
  __typename?: 'ShelterBox';
  area?: Maybe<ShelterArea>;
  capacity: Scalars['Int']['output'];
  created_at: Scalars['String']['output'];
  current_occupants: Array<ShelterPet>;
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  is_out_of_service: Scalars['Boolean']['output'];
  label: Scalars['String']['output'];
  last_cleaned_at?: Maybe<Scalars['String']['output']>;
  map_id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  occupancy_history?: Maybe<PaginatedBoxOccupancies>;
  rotation: Scalars['Float']['output'];
  status: BoxStatus;
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
  zone?: Maybe<ShelterZone>;
  zone_id: Scalars['ID']['output'];
};


export type ShelterBoxOccupancy_HistoryArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type ShelterBoxCreate = {
  area_id?: InputMaybe<Scalars['ID']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
  height: Scalars['Float']['input'];
  label: Scalars['String']['input'];
  map_id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  rotation?: InputMaybe<Scalars['Float']['input']>;
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
  zone_id: Scalars['ID']['input'];
};

export type ShelterBoxOccupancy = {
  __typename?: 'ShelterBoxOccupancy';
  box: ShelterBox;
  created_at: Scalars['String']['output'];
  entered_at: Scalars['String']['output'];
  exited_at?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  moved_by?: Maybe<User>;
  reason?: Maybe<Scalars['String']['output']>;
  shelter_pet: ShelterPet;
};

export type ShelterBoxOccupancyResult = {
  __typename?: 'ShelterBoxOccupancyResult';
  error?: Maybe<Error>;
  occupancy?: Maybe<ShelterBoxOccupancy>;
  success: Scalars['Boolean']['output'];
};

export type ShelterBoxResult = {
  __typename?: 'ShelterBoxResult';
  box?: Maybe<ShelterBox>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type ShelterBoxUpdate = {
  area_id?: InputMaybe<Scalars['ID']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  is_out_of_service?: InputMaybe<Scalars['Boolean']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  rotation?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
  zone_id?: InputMaybe<Scalars['ID']['input']>;
};

export type ShelterBoxUpsert = {
  area_id?: InputMaybe<Scalars['ID']['input']>;
  capacity?: InputMaybe<Scalars['Int']['input']>;
  height: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  label: Scalars['String']['input'];
  rotation?: InputMaybe<Scalars['Float']['input']>;
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
  zone_id: Scalars['ID']['input'];
};

export type ShelterClaimInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  proof_data?: InputMaybe<Scalars['JSON']['input']>;
};

export type ShelterClaimRequest = {
  __typename?: 'ShelterClaimRequest';
  created_at: Scalars['String']['output'];
  decision_note?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  proof_data?: Maybe<Scalars['JSON']['output']>;
  requester: User;
  reviewed_at?: Maybe<Scalars['String']['output']>;
  reviewed_by?: Maybe<User>;
  shelter: Shelter;
  status: ShelterClaimRequestStatus;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ShelterClaimRequestResult = {
  __typename?: 'ShelterClaimRequestResult';
  error?: Maybe<Error>;
  shelter_claim_request?: Maybe<ShelterClaimRequest>;
  success: Scalars['Boolean']['output'];
};

export enum ShelterClaimRequestStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ShelterContact = {
  __typename?: 'ShelterContact';
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type ShelterContactInput = {
  type: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ShelterCreate = {
  city: Scalars['String']['input'];
  contacts?: InputMaybe<Array<InputMaybe<ShelterContactInput>>>;
  district?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  postal_code: Scalars['String']['input'];
  province_code: Scalars['String']['input'];
  region?: InputMaybe<Scalars['String']['input']>;
  street: Scalars['String']['input'];
  street_number: Scalars['String']['input'];
};

export enum ShelterInventoryAlertStatus {
  LowStock = 'LOW_STOCK',
  OutOfStock = 'OUT_OF_STOCK'
}

export type ShelterInventoryItem = {
  __typename?: 'ShelterInventoryItem';
  archived_at?: Maybe<Scalars['String']['output']>;
  archived_by?: Maybe<User>;
  category: InventoryCategory;
  created_at: Scalars['String']['output'];
  current_quantity: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  is_below_threshold: Scalars['Boolean']['output'];
  minimum_threshold?: Maybe<Scalars['Float']['output']>;
  movements?: Maybe<PaginatedInventoryMovements>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  shelter: Shelter;
  unit: Scalars['String']['output'];
};


export type ShelterInventoryItemMovementsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type ShelterInventoryItemCreate = {
  category: InventoryCategory;
  initial_quantity?: InputMaybe<Scalars['Float']['input']>;
  minimum_threshold?: InputMaybe<Scalars['Float']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  shelter_id: Scalars['ID']['input'];
  unit: Scalars['String']['input'];
};

export type ShelterInventoryItemResult = {
  __typename?: 'ShelterInventoryItemResult';
  error?: Maybe<Error>;
  item?: Maybe<ShelterInventoryItem>;
  success: Scalars['Boolean']['output'];
};

export type ShelterInventoryItemUpdate = {
  category?: InputMaybe<InventoryCategory>;
  minimum_threshold?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type ShelterInventoryMovement = {
  __typename?: 'ShelterInventoryMovement';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  item: ShelterInventoryItem;
  movement_type: MovementType;
  notes?: Maybe<Scalars['String']['output']>;
  quantity: Scalars['Float']['output'];
  registered_by: User;
};

export type ShelterInventoryMovementCreate = {
  allow_negative?: InputMaybe<Scalars['Boolean']['input']>;
  item_id: Scalars['ID']['input'];
  movement_type: MovementType;
  notes?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Float']['input'];
};

export type ShelterInventoryMovementResult = {
  __typename?: 'ShelterInventoryMovementResult';
  error?: Maybe<Error>;
  movement?: Maybe<ShelterInventoryMovement>;
  success: Scalars['Boolean']['output'];
};

export type ShelterInvite = {
  __typename?: 'ShelterInvite';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invited_by?: Maybe<User>;
  role: RoleLevel;
  shelter: Shelter;
  status: ShelterInviteStatus;
  user: User;
};

export type ShelterInviteCreate = {
  role: RoleLevel;
  shelter_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};

export type ShelterInviteResult = {
  __typename?: 'ShelterInviteResult';
  error?: Maybe<Error>;
  shelter_invite?: Maybe<ShelterInvite>;
  success: Scalars['Boolean']['output'];
};

export enum ShelterInviteStatus {
  Accepted = 'ACCEPTED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ShelterKpiHistoryResult = {
  __typename?: 'ShelterKpiHistoryResult';
  error?: Maybe<Error>;
  items: Array<Maybe<ShelterKpiSnapshot>>;
  success: Scalars['Boolean']['output'];
};

export type ShelterKpiSnapshot = {
  __typename?: 'ShelterKpiSnapshot';
  boxes_free: Scalars['Int']['output'];
  boxes_full: Scalars['Int']['output'];
  boxes_occupied: Scalars['Int']['output'];
  boxes_out_of_service: Scalars['Int']['output'];
  boxes_total: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  low_stock_count: Scalars['Int']['output'];
  pets_needing_walk: Scalars['Int']['output'];
  pets_total: Scalars['Int']['output'];
  pets_without_box: Scalars['Int']['output'];
  shelter_id: Scalars['ID']['output'];
  tasks_completed_today: Scalars['Int']['output'];
  tasks_due_this_week: Scalars['Int']['output'];
  tasks_overdue: Scalars['Int']['output'];
  tasks_pending: Scalars['Int']['output'];
  tasks_recurring: Scalars['Int']['output'];
  tasks_total: Scalars['Int']['output'];
  walks_completed_today: Scalars['Int']['output'];
  walks_planned_today: Scalars['Int']['output'];
};

export type ShelterMap = {
  __typename?: 'ShelterMap';
  areas: Array<ShelterArea>;
  background_media?: Maybe<Media>;
  boxes: Array<ShelterBox>;
  created_at: Scalars['String']['output'];
  elements: Array<ShelterMapElement>;
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  shelter: Shelter;
  unit: MapUnit;
  width: Scalars['Float']['output'];
  zones: Array<ShelterZone>;
};

export type ShelterMapCreate = {
  background_media_id?: InputMaybe<Scalars['ID']['input']>;
  height: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  shelter_id: Scalars['ID']['input'];
  unit?: InputMaybe<MapUnit>;
  width: Scalars['Float']['input'];
};

export type ShelterMapElement = {
  __typename?: 'ShelterMapElement';
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  element_type: MapElementType;
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  label?: Maybe<Scalars['String']['output']>;
  map_id: Scalars['ID']['output'];
  rotation: Scalars['Float']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type ShelterMapElementCreate = {
  color?: InputMaybe<Scalars['String']['input']>;
  element_type: MapElementType;
  height: Scalars['Float']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  map_id: Scalars['ID']['input'];
  rotation?: InputMaybe<Scalars['Float']['input']>;
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type ShelterMapElementResult = {
  __typename?: 'ShelterMapElementResult';
  element?: Maybe<ShelterMapElement>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type ShelterMapElementUpdate = {
  color?: InputMaybe<Scalars['String']['input']>;
  element_type?: InputMaybe<MapElementType>;
  height?: InputMaybe<Scalars['Float']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  rotation?: InputMaybe<Scalars['Float']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type ShelterMapElementUpsert = {
  color?: InputMaybe<Scalars['String']['input']>;
  element_type: MapElementType;
  height: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  label?: InputMaybe<Scalars['String']['input']>;
  rotation?: InputMaybe<Scalars['Float']['input']>;
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type ShelterMapLayoutInput = {
  areas: Array<ShelterAreaUpsert>;
  boxes: Array<ShelterBoxUpsert>;
  deleted_area_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  deleted_box_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  deleted_element_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  deleted_zone_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  elements?: InputMaybe<Array<ShelterMapElementUpsert>>;
  zones?: InputMaybe<Array<ShelterZoneUpsert>>;
};

export type ShelterMapResult = {
  __typename?: 'ShelterMapResult';
  error?: Maybe<Error>;
  map?: Maybe<ShelterMap>;
  success: Scalars['Boolean']['output'];
};

export type ShelterMapUpdate = {
  background_media_id?: InputMaybe<Scalars['ID']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<MapUnit>;
  width?: InputMaybe<Scalars['Float']['input']>;
};

export type ShelterOperationalDashboard = {
  __typename?: 'ShelterOperationalDashboard';
  boxes_available: Scalars['Int']['output'];
  boxes_free: Scalars['Int']['output'];
  boxes_full: Scalars['Int']['output'];
  boxes_needing_cleaning: Scalars['Int']['output'];
  boxes_occupied: Scalars['Int']['output'];
  boxes_out_of_service: Scalars['Int']['output'];
  boxes_total: Scalars['Int']['output'];
  low_stock_count: Scalars['Int']['output'];
  low_stock_items: Array<ShelterInventoryItem>;
  occupancy_rate: Scalars['Float']['output'];
  pets_needing_walk: Scalars['Int']['output'];
  pets_total: Scalars['Int']['output'];
  pets_without_box: Scalars['Int']['output'];
  shelter_id: Scalars['ID']['output'];
  tasks_completed_today: Scalars['Int']['output'];
  tasks_due_this_week: Scalars['Int']['output'];
  tasks_overdue: Scalars['Int']['output'];
  tasks_pending: Scalars['Int']['output'];
  tasks_recurring: Scalars['Int']['output'];
  tasks_skipped_today: Scalars['Int']['output'];
  tasks_total: Scalars['Int']['output'];
  walks_completed_today: Scalars['Int']['output'];
  walks_in_progress: Scalars['Int']['output'];
  walks_planned_today: Scalars['Int']['output'];
};

export type ShelterOperationalDashboardResult = {
  __typename?: 'ShelterOperationalDashboardResult';
  dashboard?: Maybe<ShelterOperationalDashboard>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type ShelterOwnershipTransfer = {
  __typename?: 'ShelterOwnershipTransfer';
  accepted_at?: Maybe<Scalars['String']['output']>;
  cancelled_at?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  expires_at?: Maybe<Scalars['String']['output']>;
  from_user: User;
  id: Scalars['ID']['output'];
  new_role_for_previous_owner?: Maybe<RoleLevel>;
  rejected_at?: Maybe<Scalars['String']['output']>;
  shelter: Shelter;
  status: ShelterOwnershipTransferStatus;
  to_user: User;
  updated_at?: Maybe<Scalars['String']['output']>;
};

export type ShelterOwnershipTransferResult = {
  __typename?: 'ShelterOwnershipTransferResult';
  error?: Maybe<Error>;
  shelter_ownership_transfer?: Maybe<ShelterOwnershipTransfer>;
  success: Scalars['Boolean']['output'];
};

export enum ShelterOwnershipTransferStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Rejected = 'REJECTED'
}

export type ShelterPerson = {
  __typename?: 'ShelterPerson';
  archived_at?: Maybe<Scalars['String']['output']>;
  archived_by?: Maybe<User>;
  created_at: Scalars['String']['output'];
  created_by?: Maybe<User>;
  email?: Maybe<Scalars['String']['output']>;
  first_name?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  last_name?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  shelter: Shelter;
  source: ShelterPersonSource;
  status: ShelterPersonStatus;
  updated_at?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ShelterPersonResult = {
  __typename?: 'ShelterPersonResult';
  error?: Maybe<Error>;
  shelter_person?: Maybe<ShelterPerson>;
  success: Scalars['Boolean']['output'];
};

export enum ShelterPersonSource {
  Import = 'IMPORT',
  Invite = 'INVITE',
  Manual = 'MANUAL',
  Visit = 'VISIT',
  VolunteerRequest = 'VOLUNTEER_REQUEST'
}

export enum ShelterPersonStatus {
  ActiveUser = 'ACTIVE_USER',
  Archived = 'ARCHIVED',
  PendingInvite = 'PENDING_INVITE',
  Visitor = 'VISITOR',
  Volunteer = 'VOLUNTEER'
}

export type ShelterPet = {
  __typename?: 'ShelterPet';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_active: Scalars['Boolean']['output'];
  left_at?: Maybe<Scalars['String']['output']>;
  pet: Pet;
  shelter: Shelter;
};

export type ShelterPetCreate = {
  pet_id: Scalars['ID']['input'];
  shelter_id: Scalars['ID']['input'];
};

export type ShelterPetData = {
  birthday: Scalars['String']['input'];
  breed?: InputMaybe<Scalars['String']['input']>;
  chip_code?: InputMaybe<Scalars['String']['input']>;
  coat_length?: InputMaybe<CoatLength>;
  gender?: InputMaybe<Gender>;
  name: Scalars['String']['input'];
  neutered?: InputMaybe<Scalars['Boolean']['input']>;
  temperament?: InputMaybe<Scalars['String']['input']>;
  weight_kg?: InputMaybe<Scalars['Float']['input']>;
};

export type ShelterPetResult = {
  __typename?: 'ShelterPetResult';
  error?: Maybe<Error>;
  shelter_pet?: Maybe<ShelterPet>;
  success: Scalars['Boolean']['output'];
};

export type ShelterPetsCreate = {
  pet_ids: Array<Scalars['ID']['input']>;
  shelter_id: Scalars['ID']['input'];
};

export type ShelterPetsResult = {
  __typename?: 'ShelterPetsResult';
  error?: Maybe<Error>;
  shelter_pets?: Maybe<Array<Maybe<ShelterPet>>>;
  success: Scalars['Boolean']['output'];
};

export type ShelterPetsWithDataCreate = {
  pets: Array<ShelterPetData>;
  shelter_id: Scalars['ID']['input'];
};

export type ShelterResult = {
  __typename?: 'ShelterResult';
  error?: Maybe<Error>;
  shelter?: Maybe<Shelter>;
  success: Scalars['Boolean']['output'];
};

export type ShelterRole = {
  __typename?: 'ShelterRole';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  role: RoleLevel;
  shelter: Shelter;
  user: User;
};

export type ShelterRoleCreate = {
  role: RoleLevel;
  shelter_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
};

export type ShelterRoleResult = {
  __typename?: 'ShelterRoleResult';
  error?: Maybe<Error>;
  shelter_role?: Maybe<ShelterRole>;
  success: Scalars['Boolean']['output'];
};

export type ShelterRoleUpdate = {
  role?: InputMaybe<RoleLevel>;
};

export type ShelterTask = {
  __typename?: 'ShelterTask';
  area?: Maybe<Scalars['String']['output']>;
  assignee_shelter_people: Array<ShelterPerson>;
  assignees: Array<User>;
  completed_at?: Maybe<Scalars['String']['output']>;
  completed_by?: Maybe<User>;
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_recurring: Scalars['Boolean']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  recurrence?: Maybe<Recurrence>;
  scheduled_at?: Maybe<Scalars['String']['output']>;
  scheduled_date?: Maybe<Scalars['String']['output']>;
  shelter: Shelter;
  shelter_pet?: Maybe<ShelterPet>;
  skipped_at?: Maybe<Scalars['String']['output']>;
  skipped_by?: Maybe<User>;
  status: TaskStatus;
  task_type: ShelterTaskType;
};

export type ShelterTaskCreate = {
  area?: InputMaybe<Scalars['String']['input']>;
  assignee_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  assignee_shelter_person_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  is_recurring?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<RecurrenceInput>;
  scheduled_at?: InputMaybe<Scalars['String']['input']>;
  shelter_box_id?: InputMaybe<Scalars['ID']['input']>;
  shelter_id: Scalars['ID']['input'];
  shelter_pet_id?: InputMaybe<Scalars['ID']['input']>;
  task_type: ShelterTaskType;
};

export type ShelterTaskResult = {
  __typename?: 'ShelterTaskResult';
  error?: Maybe<Error>;
  shelter_task?: Maybe<ShelterTask>;
  success: Scalars['Boolean']['output'];
};

export enum ShelterTaskType {
  Cleaning = 'CLEANING',
  DeepCleaning = 'DEEP_CLEANING',
  Feeding = 'FEEDING',
  Grooming = 'GROOMING',
  Medication = 'MEDICATION',
  Other = 'OTHER'
}

export type ShelterTaskUpdate = {
  area?: InputMaybe<Scalars['String']['input']>;
  assignee_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  assignee_shelter_person_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  is_recurring?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  recurrence?: InputMaybe<RecurrenceInput>;
  scheduled_at?: InputMaybe<Scalars['String']['input']>;
  task_type?: InputMaybe<ShelterTaskType>;
};

export enum ShelterType {
  OfficialShelter = 'OFFICIAL_SHELTER',
  PersonalWorkspace = 'PERSONAL_WORKSPACE'
}

export type ShelterUpdate = {
  accepts_volunteers?: InputMaybe<Scalars['Boolean']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  contacts?: InputMaybe<Array<InputMaybe<ShelterContactInput>>>;
  district?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  province_code?: InputMaybe<Scalars['String']['input']>;
  public_contact_email?: InputMaybe<Scalars['String']['input']>;
  public_contact_phone?: InputMaybe<Scalars['String']['input']>;
  public_description?: InputMaybe<Scalars['String']['input']>;
  public_lat?: InputMaybe<Scalars['Float']['input']>;
  public_lng?: InputMaybe<Scalars['Float']['input']>;
  public_location_label?: InputMaybe<Scalars['String']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  street_number?: InputMaybe<Scalars['String']['input']>;
};

export enum ShelterVerificationStatus {
  PendingClaim = 'PENDING_CLAIM',
  Rejected = 'REJECTED',
  Unverified = 'UNVERIFIED',
  Verified = 'VERIFIED'
}

export enum ShelterVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
  Unlisted = 'UNLISTED'
}

export type ShelterWalk = {
  __typename?: 'ShelterWalk';
  cancelled_at?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  duration_minutes?: Maybe<Scalars['Int']['output']>;
  ended_at?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  ratings?: Maybe<Array<Maybe<ShelterWalkRating>>>;
  scheduled_at?: Maybe<Scalars['String']['output']>;
  shelter_pet: ShelterPet;
  started_at?: Maybe<Scalars['String']['output']>;
  status: ShelterWalkStatus;
  walker?: Maybe<User>;
  walker_shelter_person?: Maybe<ShelterPerson>;
};

export type ShelterWalkCreate = {
  notes?: InputMaybe<Scalars['String']['input']>;
  scheduled_at?: InputMaybe<Scalars['String']['input']>;
  shelter_person_id?: InputMaybe<Scalars['ID']['input']>;
  shelter_pet_id: Scalars['ID']['input'];
  walker_id?: InputMaybe<Scalars['ID']['input']>;
};

export type ShelterWalkRating = {
  __typename?: 'ShelterWalkRating';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  type: WalkRatingType;
  walk: ShelterWalk;
};

export type ShelterWalkRatingCreate = {
  rating: Scalars['Int']['input'];
  type: WalkRatingType;
  walk_id: Scalars['ID']['input'];
};

export type ShelterWalkRatingResult = {
  __typename?: 'ShelterWalkRatingResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  walk_rating?: Maybe<ShelterWalkRating>;
};

export type ShelterWalkResult = {
  __typename?: 'ShelterWalkResult';
  error?: Maybe<Error>;
  shelter_walk?: Maybe<ShelterWalk>;
  success: Scalars['Boolean']['output'];
};

export enum ShelterWalkStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Planned = 'PLANNED'
}

export type ShelterWalkUpdate = {
  notes?: InputMaybe<Scalars['String']['input']>;
  scheduled_at?: InputMaybe<Scalars['String']['input']>;
};

export type ShelterZone = {
  __typename?: 'ShelterZone';
  areas: Array<ShelterArea>;
  boxes: Array<ShelterBox>;
  color?: Maybe<Scalars['String']['output']>;
  created_at: Scalars['String']['output'];
  height: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  map_id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  width: Scalars['Float']['output'];
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type ShelterZoneCreate = {
  color?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  map_id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type ShelterZoneResult = {
  __typename?: 'ShelterZoneResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  zone?: Maybe<ShelterZone>;
};

export type ShelterZoneUpdate = {
  color?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Float']['input']>;
  x?: InputMaybe<Scalars['Float']['input']>;
  y?: InputMaybe<Scalars['Float']['input']>;
};

export type ShelterZoneUpsert = {
  color?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Float']['input'];
  id?: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  width: Scalars['Float']['input'];
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

export type Statistic = {
  __typename?: 'Statistic';
  all_active_users: Scalars['Int']['output'];
  all_pets: Scalars['Int']['output'];
  all_user: Scalars['Int']['output'];
  date: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type StatisticResult = {
  __typename?: 'StatisticResult';
  error?: Maybe<Error>;
  statistic?: Maybe<Statistic>;
  success: Scalars['Boolean']['output'];
};

export type Statistics = {
  __typename?: 'Statistics';
  active_users_max: Array<Scalars['Float']['output']>;
  active_users_mean: Array<Scalars['Float']['output']>;
  active_users_min: Array<Scalars['Float']['output']>;
  all_pets: Array<Scalars['Float']['output']>;
  all_users: Array<Scalars['Float']['output']>;
  labels: Array<Scalars['String']['output']>;
};

export type StatisticsResult = {
  __typename?: 'StatisticsResult';
  error?: Maybe<Error>;
  statistics?: Maybe<Statistics>;
  success: Scalars['Boolean']['output'];
};

export enum StatsPeriod {
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export enum TaskStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Overdue = 'OVERDUE',
  Pending = 'PENDING',
  Skipped = 'SKIPPED'
}

export type Treatment = {
  __typename?: 'Treatment';
  booster?: Maybe<Treatment>;
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  duration?: Maybe<TreatmentDuration>;
  health_card?: Maybe<HealthCard>;
  id: Scalars['ID']['output'];
  logs?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  name: Scalars['String']['output'];
  related?: Maybe<Array<Maybe<MinTreatment>>>;
  type: TreatmentType;
};

export type TreatmentCreate = {
  booster_date?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['String']['input'];
  duration?: InputMaybe<TreatmentDuration>;
  health_card_id: Scalars['ID']['input'];
  logs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
  type: TreatmentType;
};

export type TreatmentResult = {
  __typename?: 'TreatmentResult';
  error?: Maybe<Error>;
  success?: Maybe<Scalars['Boolean']['output']>;
  treatment?: Maybe<Treatment>;
};

export enum TreatmentType {
  Antiparasitic = 'ANTIPARASITIC',
  Check = 'CHECK',
  Cure = 'CURE',
  Operation = 'OPERATION',
  Reminder = 'REMINDER',
  Tablet = 'TABLET',
  Training = 'TRAINING',
  Vaccine = 'VACCINE',
  Walk = 'WALK'
}

export type TreatmentUpdate = {
  booster_date?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  delete_old?: InputMaybe<Scalars['Boolean']['input']>;
  logs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  treatmentDuration?: InputMaybe<TreatmentDuration>;
  type?: InputMaybe<TreatmentType>;
};

export type UpdateShelterPersonInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<ShelterPersonSource>;
  status?: InputMaybe<ShelterPersonStatus>;
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['String']['output'];
  email: Scalars['String']['output'];
  first_name: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  last_activity?: Maybe<Scalars['String']['output']>;
  last_name: Scalars['String']['output'];
  ownerships?: Maybe<PaginatedOwnerships>;
  pets_on_loan: Scalars['Int']['output'];
  pets_owned: Scalars['Int']['output'];
  profile_picture?: Maybe<Media>;
  reports?: Maybe<PaginatedReports>;
  role: UserRole;
};


export type UserOwnershipsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type UserReportsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type UserCreate = {
  email: Scalars['String']['input'];
  first_name: Scalars['String']['input'];
  last_name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserDashboard = {
  __typename?: 'UserDashboard';
  ownerships?: Maybe<PaginatedOwnerships>;
  reports?: Maybe<PaginatedReports>;
  user_id?: Maybe<Scalars['String']['output']>;
};


export type UserDashboardOwnershipsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type UserDashboardReportsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type UserDashboardResult = {
  __typename?: 'UserDashboardResult';
  dashboard?: Maybe<UserDashboard>;
  error?: Maybe<Error>;
  success?: Maybe<Scalars['Boolean']['output']>;
};

export type UserResult = {
  __typename?: 'UserResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export type UserUpdate = {
  email?: InputMaybe<Scalars['String']['input']>;
  first_name?: InputMaybe<Scalars['String']['input']>;
  last_activity?: InputMaybe<Scalars['String']['input']>;
  last_name?: InputMaybe<Scalars['String']['input']>;
};

export type UsersResult = {
  __typename?: 'UsersResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  users: Array<Maybe<User>>;
};

export type Walk = {
  __typename?: 'Walk';
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  distance_km: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  ratings?: Maybe<PaginatedWalkRatings>;
  treatment: MinTreatment;
};


export type WalkRatingsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};

export type WalkCreate = {
  date: Scalars['String']['input'];
  distance_km: Scalars['Float']['input'];
  duration?: InputMaybe<TreatmentDuration>;
  health_card_id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type WalkRating = {
  __typename?: 'WalkRating';
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  type: WalkRatingType;
  walk: Walk;
};

export type WalkRatingChartData = {
  __typename?: 'WalkRatingChartData';
  labels: Array<Scalars['String']['output']>;
  series: Array<WalkRatingSeries>;
};

export type WalkRatingChartResult = {
  __typename?: 'WalkRatingChartResult';
  chart?: Maybe<WalkRatingChartData>;
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
};

export type WalkRatingCreate = {
  rating: Scalars['Int']['input'];
  type: WalkRatingType;
  walk_id: Scalars['ID']['input'];
};

export type WalkRatingResult = {
  __typename?: 'WalkRatingResult';
  error?: Maybe<Error>;
  success: Scalars['Boolean']['output'];
  walk_rating?: Maybe<WalkRating>;
};

export type WalkRatingSeries = {
  __typename?: 'WalkRatingSeries';
  data: Array<Maybe<Scalars['Float']['output']>>;
  type: WalkRatingType;
};

export enum WalkRatingType {
  Aggression = 'AGGRESSION',
  Behavior = 'BEHAVIOR',
  Calm = 'CALM',
  LeashPulling = 'LEASH_PULLING',
  Overall = 'OVERALL'
}

export type WalkRatingUpdate = {
  rating?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<WalkRatingType>;
};

export type WalkResult = {
  __typename?: 'WalkResult';
  error?: Maybe<Error>;
  success?: Maybe<Scalars['Boolean']['output']>;
  walk?: Maybe<Walk>;
};

export type WalkUpdate = {
  date?: InputMaybe<Scalars['String']['input']>;
  distance_km?: InputMaybe<Scalars['Float']['input']>;
  duration?: InputMaybe<TreatmentDuration>;
  notes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export enum Weekday {
  Fri = 'FRI',
  Mon = 'MON',
  Sat = 'SAT',
  Sun = 'SUN',
  Thu = 'THU',
  Tue = 'TUE',
  Wed = 'WED'
}

export enum TreatmentDuration {
  HalfHour = 'HALF_HOUR',
  Hour = 'HOUR',
  HourAndHalf = 'HOUR_AND_HALF',
  QuarterHour = 'QUARTER_HOUR',
  TenMinutes = 'TEN_MINUTES',
  ThreeQuarter = 'THREE_QUARTER',
  TwoHours = 'TWO_HOURS'
}

export type FullReportFragment = { __typename?: 'Report', id: string, notes?: Array<string | null> | null, place: string, type: ReportType, date: string, medias?: Array<{ __typename?: 'Media', id: string, url: string } | null> | null, reporter: { __typename?: 'Reporter', email: string, first_name: string, last_name: string, user_id?: string | null }, responders: Array<{ __typename?: 'Reporter', email: string } | null>, coordinates: { __typename?: 'Coordinates', latitude?: number | null, longitude?: number | null }, pet?: { __typename?: 'Pet', id: string, name: string, years?: number | null, weight_kg?: number | null, gender?: Gender | null, breed?: string | null, main_picture?: { __typename?: 'Media', id: string } | null } | null };

export type MinReportFragment = { __typename?: 'Report', id: string, place: string, latitude: number, longitude: number, created_at: string, type: ReportType, date: string, reporter: { __typename?: 'Reporter', email: string, user_id?: string | null } };

export type AppointmentFragment = { __typename?: 'Treatment', id: string, date: string, type: TreatmentType, name: string, duration?: TreatmentDuration | null, health_card?: { __typename?: 'HealthCard', pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string } | null } | null } } | null };

export type DashboardPetFragment = { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, health_card?: { __typename?: 'HealthCard', id: string, treatments: { __typename?: 'PaginatedTreatments', success?: boolean | null, items: Array<{ __typename?: 'Treatment', id: string, date: string, name: string, type: TreatmentType } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } } | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type FullPetFragment = { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, pictures?: { __typename?: 'PaginatedMedias', items: Array<{ __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null> } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type FullTreatmentFragment = { __typename?: 'Treatment', id: string, name: string, date: string, logs?: Array<string | null> | null, type: TreatmentType, health_card?: { __typename?: 'HealthCard', id: string, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null, booster?: { __typename?: 'Treatment', id: string } | null, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string, name: string, type: TreatmentType } | null> | null };

export type MinPetFragment = { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type MinUserFragment = { __typename?: 'User', id: string, role: UserRole, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null };

export type PetMinSubOwnerFragment = { __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } };

export type CreateMediaMutationVariables = Exact<{
  data: MediaCreate;
}>;


export type CreateMediaMutation = { __typename?: 'Mutation', createMedia: { __typename?: 'MediaResult', media?: { __typename?: 'Media', id: string, ref_id: string, type: string, scope: string } | null } };

export type UpdateMediaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: MediaUpdate;
}>;


export type UpdateMediaMutation = { __typename?: 'Mutation', updateMedia: { __typename?: 'MediaResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, media?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: UserUpdate;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null } | null } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'NewTokenResult', token?: string | null, success: boolean, error?: { __typename?: 'Error', code: string, message: string, extra?: string | null } | null, user?: { __typename?: 'User', id: string, role: UserRole, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null } | null } };

export type ResendCodeMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResendCodeMutation = { __typename?: 'Mutation', resendCode: { __typename?: 'GenericResult', success: boolean, error?: { __typename?: 'Error', message: string, code: string, extra?: string | null } | null } };

export type SignUpMutationVariables = Exact<{
  data: UserCreate;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'UserResult', success: boolean, user?: { __typename?: 'User', id: string, last_name: string, first_name: string, email: string, role: UserRole } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type VerifyMutationVariables = Exact<{
  email: Scalars['String']['input'];
  code: Scalars['String']['input'];
}>;


export type VerifyMutation = { __typename?: 'Mutation', verifyUser: { __typename?: 'NewTokenResult', token?: string | null, success: boolean, error?: { __typename?: 'Error', code: string, message: string, extra?: string | null } | null, user?: { __typename?: 'User', id: string, role: UserRole, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null } | null } };

export type CreateReportMutationVariables = Exact<{
  data: ReportCreate;
}>;


export type CreateReportMutation = { __typename?: 'Mutation', createReport: { __typename?: 'ReportResult', report?: { __typename?: 'Report', id: string } | null, error?: { __typename?: 'Error', message: string, code: string } | null } };

export type GetReportQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetReportQuery = { __typename?: 'Query', getReport?: { __typename?: 'ReportResult', success: boolean, report?: { __typename?: 'Report', id: string, notes?: Array<string | null> | null, place: string, type: ReportType, date: string, medias?: Array<{ __typename?: 'Media', id: string, url: string } | null> | null, reporter: { __typename?: 'Reporter', email: string, first_name: string, last_name: string, user_id?: string | null }, responders: Array<{ __typename?: 'Reporter', email: string } | null>, coordinates: { __typename?: 'Coordinates', latitude?: number | null, longitude?: number | null }, pet?: { __typename?: 'Pet', id: string, name: string, years?: number | null, weight_kg?: number | null, gender?: Gender | null, breed?: string | null, main_picture?: { __typename?: 'Media', id: string } | null } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } | null };

export type ListReportsQueryVariables = Exact<{
  commonSearch: CommonSearch;
}>;


export type ListReportsQuery = { __typename?: 'Query', listReports: { __typename?: 'PaginatedReports', success?: boolean | null, items: Array<{ __typename?: 'Report', id: string, place: string, latitude: number, longitude: number, created_at: string, type: ReportType, date: string, reporter: { __typename?: 'Reporter', email: string, user_id?: string | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', page_size?: number | null, total_items?: number | null } } };

export type CreateCureMutationVariables = Exact<{
  cure: CureCreate;
}>;


export type CreateCureMutation = { __typename?: 'Mutation', createCure: { __typename?: 'CureResult', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, cure?: { __typename?: 'Cure', id: string, frequency_times?: number | null, frequency_value?: number | null, frequency_unit?: FrequencyUnit | null } | null } };

export type CreateTreatmentMutationVariables = Exact<{
  treatment: TreatmentCreate;
}>;


export type CreateTreatmentMutation = { __typename?: 'Mutation', createTreatment: { __typename?: 'TreatmentResult', success?: boolean | null, error?: { __typename?: 'Error', extra?: string | null, code: string, message: string } | null, treatment?: { __typename?: 'Treatment', id: string, name: string, date: string, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string } | null> | null } | null } };

export type CreateWalkMutationVariables = Exact<{
  walk: WalkCreate;
}>;


export type CreateWalkMutation = { __typename?: 'Mutation', createWalk: { __typename?: 'WalkResult', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, walk?: { __typename?: 'Walk', id: string, distance_km: number } | null } };

export type CreateWalkRatingMutationVariables = Exact<{
  walkRating: WalkRatingCreate;
}>;


export type CreateWalkRatingMutation = { __typename?: 'Mutation', createWalkRating: { __typename?: 'WalkRatingResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, walk_rating?: { __typename?: 'WalkRating', id: string, type: WalkRatingType, rating: number } | null } };

export type DeleteTreatmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTreatmentMutation = { __typename?: 'Mutation', deleteTreatment: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type UpdateTreatmentMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: TreatmentUpdate;
}>;


export type UpdateTreatmentMutation = { __typename?: 'Mutation', updateTreatment: { __typename?: 'TreatmentResult', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, treatment?: { __typename?: 'Treatment', id: string, name: string, date: string, logs?: Array<string | null> | null, type: TreatmentType, health_card?: { __typename?: 'HealthCard', id: string, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null, booster?: { __typename?: 'Treatment', id: string } | null, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string, name: string, type: TreatmentType } | null> | null } | null } };

export type GetTreatmentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTreatmentQuery = { __typename?: 'Query', getTreatment?: { __typename?: 'TreatmentResult', error?: { __typename?: 'Error', code: string, message: string } | null, treatment?: { __typename?: 'Treatment', id: string, name: string, date: string, logs?: Array<string | null> | null, type: TreatmentType, health_card?: { __typename?: 'HealthCard', id: string, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null, booster?: { __typename?: 'Treatment', id: string } | null, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string, name: string, type: TreatmentType } | null> | null } | null } | null };

export type ListMyTreatmentsQueryVariables = Exact<{
  commonSearch: CommonSearch;
}>;


export type ListMyTreatmentsQuery = { __typename?: 'Query', listMyTreatments: { __typename?: 'PaginatedTreatments', success?: boolean | null, items: Array<{ __typename?: 'Treatment', id: string, date: string, type: TreatmentType, name: string, duration?: TreatmentDuration | null, health_card?: { __typename?: 'HealthCard', pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string } | null } | null } } | null } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', page_size?: number | null, total_items?: number | null } } };

export type GetWalkByTreatmentQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type GetWalkByTreatmentQuery = { __typename?: 'Query', listWalks: { __typename?: 'PaginatedWalks', error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'Walk', id: string, distance_km: number, ratings?: { __typename?: 'PaginatedWalkRatings', items: Array<{ __typename?: 'WalkRating', id: string, type: WalkRatingType, rating: number } | null> } | null } | null> } };

export type GetUserDashboardQueryVariables = Exact<{
  date_from: Scalars['String']['input'];
  date_to: Scalars['String']['input'];
}>;


export type GetUserDashboardQuery = { __typename?: 'Query', getUserDashboard: { __typename?: 'UserDashboardResult', success?: boolean | null, dashboard?: { __typename?: 'UserDashboard', ownerships?: { __typename?: 'PaginatedOwnerships', success?: boolean | null, items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, health_card?: { __typename?: 'HealthCard', id: string, treatments: { __typename?: 'PaginatedTreatments', success?: boolean | null, items: Array<{ __typename?: 'Treatment', id: string, date: string, name: string, type: TreatmentType } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } } | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } | null, reports?: { __typename?: 'PaginatedReports', success?: boolean | null, items: Array<{ __typename?: 'Report', id: string, place: string, latitude: number, longitude: number, created_at: string, type: ReportType, date: string, reporter: { __typename?: 'Reporter', email: string, user_id?: string | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type GetOrCreateQueryVariables = Exact<{
  ref_id: Scalars['String']['input'];
  ref_table: Scalars['String']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrCreateQuery = { __typename?: 'Query', getOrCreateCode?: { __typename?: 'CodeResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, code?: { __typename?: 'Code', id: string, code: string, ref_id: string, ref_table: string } | null } | null };

export type GetPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPetQuery = { __typename?: 'Query', getPet: { __typename?: 'PetResult', success: boolean, pet?: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type MinNotificationFragment = { __typename?: 'Notification', id: string, type: NotificationType, status: NotificationStatus, priority: NotificationPriority, title: string, message?: string | null, entity_type?: NotificationEntityType | null, entity_id?: string | null, action_url?: string | null, actor_user_id?: string | null, shelter_id?: string | null, pet_id?: string | null, payload?: any | null, created_at: string, read_at?: string | null };

export type DismissNotificationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DismissNotificationMutation = { __typename?: 'Mutation', dismissNotification: { __typename?: 'NotificationResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, notification?: { __typename?: 'Notification', id: string, type: NotificationType, status: NotificationStatus, priority: NotificationPriority, title: string, message?: string | null, entity_type?: NotificationEntityType | null, entity_id?: string | null, action_url?: string | null, actor_user_id?: string | null, shelter_id?: string | null, pet_id?: string | null, payload?: any | null, created_at: string, read_at?: string | null } | null } };

export type MarkAllNotificationsAsReadMutationVariables = Exact<{ [key: string]: never; }>;


export type MarkAllNotificationsAsReadMutation = { __typename?: 'Mutation', markAllNotificationsAsRead: { __typename?: 'NotificationResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type MarkNotificationAsReadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type MarkNotificationAsReadMutation = { __typename?: 'Mutation', markNotificationAsRead: { __typename?: 'NotificationResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, notification?: { __typename?: 'Notification', id: string, type: NotificationType, status: NotificationStatus, priority: NotificationPriority, title: string, message?: string | null, entity_type?: NotificationEntityType | null, entity_id?: string | null, action_url?: string | null, actor_user_id?: string | null, shelter_id?: string | null, pet_id?: string | null, payload?: any | null, created_at: string, read_at?: string | null } | null } };

export type AcceptPetOwnershipInviteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AcceptPetOwnershipInviteMutation = { __typename?: 'Mutation', acceptPetOwnershipInvite: { __typename?: 'OwnershipResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type RejectPetOwnershipInviteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RejectPetOwnershipInviteMutation = { __typename?: 'Mutation', rejectPetOwnershipInvite: { __typename?: 'OwnershipResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type AcceptShelterInviteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AcceptShelterInviteMutation = { __typename?: 'Mutation', acceptShelterInvite: { __typename?: 'ShelterInviteResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type RejectShelterInviteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RejectShelterInviteMutation = { __typename?: 'Mutation', rejectShelterInvite: { __typename?: 'ShelterInviteResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type AcceptShelterOwnershipTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AcceptShelterOwnershipTransferMutation = { __typename?: 'Mutation', acceptShelterOwnershipTransfer: { __typename?: 'ShelterOwnershipTransferResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type RejectShelterOwnershipTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RejectShelterOwnershipTransferMutation = { __typename?: 'Mutation', rejectShelterOwnershipTransfer: { __typename?: 'ShelterOwnershipTransferResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type GetUnreadNotificationCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUnreadNotificationCountQuery = { __typename?: 'Query', getUnreadNotificationCount: number };

export type ListMyNotificationsQueryVariables = Exact<{
  search?: InputMaybe<CommonSearch>;
}>;


export type ListMyNotificationsQuery = { __typename?: 'Query', listMyNotifications: { __typename?: 'PaginatedNotifications', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'Notification', id: string, type: NotificationType, status: NotificationStatus, priority: NotificationPriority, title: string, message?: string | null, entity_type?: NotificationEntityType | null, entity_id?: string | null, action_url?: string | null, actor_user_id?: string | null, shelter_id?: string | null, pet_id?: string | null, payload?: any | null, created_at: string, read_at?: string | null } | null>, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type AddPetToMeMutationVariables = Exact<{
  data: PetCreate;
  custodyLevel?: InputMaybe<CustodyLevel>;
}>;


export type AddPetToMeMutation = { __typename?: 'Mutation', addPetToMe: { __typename?: 'PetAddedResult', data?: { __typename?: 'NewOwnership', pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null } };

export type CheckCodeMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type CheckCodeMutation = { __typename?: 'Mutation', checkCode: { __typename?: 'CodeValidationResult', success: boolean, is_valid?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, code?: { __typename?: 'Code', id: string, code: string, ref_id: string, ref_table: string } | null } };

export type CreatePetWeightMutationVariables = Exact<{
  data: PetWeightCreate;
}>;


export type CreatePetWeightMutation = { __typename?: 'Mutation', createPetWeight: { __typename?: 'PetWeightResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, weight?: { __typename?: 'PetWeight', id: string, created_at: string, weight_kg: number } | null } };

export type DeleteOwnershipMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteOwnershipMutation = { __typename?: 'Mutation', deleteOwnership: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type DeletePetMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletePetMutation = { __typename?: 'Mutation', deletePet: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type LinkPetToMeMutationVariables = Exact<{
  petId: Scalars['ID']['input'];
  custodyLevel: CustodyLevel;
}>;


export type LinkPetToMeMutation = { __typename?: 'Mutation', linkPetToMe: { __typename?: 'OwnershipResult', success: boolean, ownership?: { __typename?: 'Ownership', id: string, custody_level: CustodyLevel, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null, error?: { __typename?: 'Error', message: string, code: string } | null } };

export type UpdatePetMutationVariables = Exact<{
  data: PetUpdate;
  id: Scalars['ID']['input'];
}>;


export type UpdatePetMutation = { __typename?: 'Mutation', updatePet: { __typename?: 'PetResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, pet?: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } | null } };

export type GetFullPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  date_from: Scalars['String']['input'];
  date_to: Scalars['String']['input'];
}>;


export type GetFullPetQuery = { __typename?: 'Query', getPet: { __typename?: 'PetResult', success: boolean, pet?: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday?: string | null, gender?: Gender | null, neutered?: boolean | null, breed?: string | null, coat_length?: CoatLength | null, pictures?: { __typename?: 'PaginatedMedias', items: Array<{ __typename?: 'Media', id: string } | null> } | null, health_card?: { __typename?: 'HealthCard', id: string, treatments: { __typename?: 'PaginatedTreatments', items: Array<{ __typename?: 'Treatment', id: string, date: string, type: TreatmentType, name: string, duration?: TreatmentDuration | null, health_card?: { __typename?: 'HealthCard', pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string } | null } | null } } | null } | null> } } | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type GetLatestPetWeightQueryVariables = Exact<{
  pet_id: Scalars['ID']['input'];
}>;


export type GetLatestPetWeightQuery = { __typename?: 'Query', getLatestPetWeight: { __typename?: 'PetWeightResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, weight?: { __typename?: 'PetWeight', id: string, created_at: string, weight_kg: number } | null } };

export type GetPetWalkingStatsQueryVariables = Exact<{
  pet_id: Scalars['ID']['input'];
  period: StatsPeriod;
}>;


export type GetPetWalkingStatsQuery = { __typename?: 'Query', getPetWalkingStats: { __typename?: 'WalkRatingChartResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, chart?: { __typename?: 'WalkRatingChartData', labels: Array<string>, series: Array<{ __typename?: 'WalkRatingSeries', type: WalkRatingType, data: Array<number | null> }> } | null } };

export type GetPetWeightStatsQueryVariables = Exact<{
  pet_id: Scalars['ID']['input'];
  period: StatsPeriod;
}>;


export type GetPetWeightStatsQuery = { __typename?: 'Query', getPetWeightStats: { __typename?: 'PetWeightChartResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, chart?: { __typename?: 'PetWeightChartData', labels: Array<string>, data: Array<number | null> } | null } };

export type ListPetWalkRatingsQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListPetWalkRatingsQuery = { __typename?: 'Query', listWalkRatings: { __typename?: 'PaginatedWalkRatings', error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'WalkRating', id: string, type: WalkRatingType, rating: number } | null> } };

export type FullShelterFragment = { __typename?: 'Shelter', id: string, name: string, city: string, region?: string | null, district?: string | null, street: string, street_number: string, postal_code: string, province_code: string, type: ShelterType, verification_status: ShelterVerificationStatus, contacts?: Array<{ __typename?: 'ShelterContact', type?: string | null, value?: string | null } | null> | null, roles?: { __typename?: 'PaginatedShelterRoles', items: Array<{ __typename?: 'ShelterRole', id: string, role: RoleLevel, user: { __typename?: 'User', id: string, role: UserRole, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null } } | null> } | null, pets?: { __typename?: 'PaginatedShelterPets', items: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type FullShelterMapFragment = { __typename?: 'ShelterMap', id: string, name: string, width: number, height: number, unit: MapUnit, zones: Array<{ __typename?: 'ShelterZone', id: string, name: string, x: number, y: number, width: number, height: number, color?: string | null }>, areas: Array<{ __typename?: 'ShelterArea', id: string, name: string, area_type: AreaType, x: number, y: number, width: number, height: number, color?: string | null, zone?: { __typename?: 'ShelterZone', id: string } | null }>, boxes: Array<{ __typename?: 'ShelterBox', id: string, label: string, x: number, y: number, width: number, height: number, rotation: number, capacity: number, status: BoxStatus, is_out_of_service: boolean, area?: { __typename?: 'ShelterArea', id: string } | null, zone?: { __typename?: 'ShelterZone', id: string } | null, current_occupants: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } }>, occupancy_history?: { __typename?: 'PaginatedBoxOccupancies', items: Array<{ __typename?: 'ShelterBoxOccupancy', id: string, exited_at?: string | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } } | null> } | null }>, elements: Array<{ __typename?: 'ShelterMapElement', id: string, element_type: MapElementType, x: number, y: number, width: number, height: number, rotation: number, color?: string | null, label?: string | null }> };

export type MinInventoryItemFragment = { __typename?: 'ShelterInventoryItem', id: string, name: string, category: InventoryCategory, unit: string, minimum_threshold?: number | null, current_quantity: number, is_below_threshold: boolean, notes?: string | null };

export type MinShelterFragment = { __typename?: 'Shelter', id: string, name: string, city: string, region?: string | null, street: string, street_number: string, postal_code: string, province_code: string, type: ShelterType, verification_status: ShelterVerificationStatus, visibility: ShelterVisibility, contacts?: Array<{ __typename?: 'ShelterContact', type?: string | null, value?: string | null } | null> | null };

export type MinShelterClaimRequestFragment = { __typename?: 'ShelterClaimRequest', id: string, status: ShelterClaimRequestStatus, message?: string | null, proof_data?: any | null, decision_note?: string | null, created_at: string, reviewed_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, requester: { __typename?: 'User', id: string, first_name: string, last_name: string }, reviewed_by?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null };

export type MinShelterOwnershipTransferFragment = { __typename?: 'ShelterOwnershipTransfer', id: string, status: ShelterOwnershipTransferStatus, new_role_for_previous_owner?: RoleLevel | null, created_at: string, accepted_at?: string | null, rejected_at?: string | null, cancelled_at?: string | null, expires_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, from_user: { __typename?: 'User', id: string, first_name: string, last_name: string }, to_user: { __typename?: 'User', id: string, first_name: string, last_name: string } };

export type MinShelterPersonFragment = { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, phone?: string | null, status: ShelterPersonStatus, source: ShelterPersonSource, notes?: string | null, created_at: string, archived_at?: string | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null };

export type MinShelterTaskFragment = { __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null };

export type MinShelterWalkFragment = { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } };

export type PublicShelterFragment = { __typename?: 'PublicShelter', id: string, name: string, city?: string | null, region?: string | null, public_description?: string | null, public_contact_email?: string | null, public_contact_phone?: string | null, logo_media_id?: string | null, accepts_volunteers: boolean, public_location_label?: string | null, public_lat?: number | null, public_lng?: number | null };

export type AssignPetToBoxMutationVariables = Exact<{
  box_id: Scalars['ID']['input'];
  shelter_pet_id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type AssignPetToBoxMutation = { __typename?: 'Mutation', assignPetToBox: { __typename?: 'ShelterBoxOccupancyResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, occupancy?: { __typename?: 'ShelterBoxOccupancy', id: string } | null } };

export type CancelShelterWalkMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelShelterWalkMutation = { __typename?: 'Mutation', cancelShelterWalk: { __typename?: 'ShelterWalkResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_walk?: { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null } };

export type CompleteShelterTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type CompleteShelterTaskMutation = { __typename?: 'Mutation', completeShelterTask: { __typename?: 'ShelterTaskResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_task?: { __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null } };

export type CompleteShelterWalkMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
}>;


export type CompleteShelterWalkMutation = { __typename?: 'Mutation', completeShelterWalk: { __typename?: 'ShelterWalkResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_walk?: { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null } };

export type CreatePersonalWorkspaceMutationVariables = Exact<{
  data: CreatePersonalWorkspaceInput;
}>;


export type CreatePersonalWorkspaceMutation = { __typename?: 'Mutation', createPersonalWorkspace: { __typename?: 'ShelterResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter?: { __typename?: 'Shelter', id: string, name: string, city: string, region?: string | null, street: string, street_number: string, postal_code: string, province_code: string, type: ShelterType, verification_status: ShelterVerificationStatus, visibility: ShelterVisibility, contacts?: Array<{ __typename?: 'ShelterContact', type?: string | null, value?: string | null } | null> | null } | null } };

export type CreatePetMutationVariables = Exact<{
  data: PetCreate;
}>;


export type CreatePetMutation = { __typename?: 'Mutation', createPet: { __typename?: 'PetResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, pet?: { __typename?: 'Pet', id: string, name: string } | null } };

export type CreateShelterInventoryItemMutationVariables = Exact<{
  data: ShelterInventoryItemCreate;
}>;


export type CreateShelterInventoryItemMutation = { __typename?: 'Mutation', createShelterInventoryItem: { __typename?: 'ShelterInventoryItemResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, item?: { __typename?: 'ShelterInventoryItem', id: string, name: string, category: InventoryCategory, unit: string, minimum_threshold?: number | null, current_quantity: number, is_below_threshold: boolean, notes?: string | null } | null } };

export type CreateShelterInventoryMovementMutationVariables = Exact<{
  data: ShelterInventoryMovementCreate;
}>;


export type CreateShelterInventoryMovementMutation = { __typename?: 'Mutation', createShelterInventoryMovement: { __typename?: 'ShelterInventoryMovementResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, movement?: { __typename?: 'ShelterInventoryMovement', id: string, movement_type: MovementType, quantity: number } | null } };

export type CreateShelterInviteMutationVariables = Exact<{
  data: ShelterInviteCreate;
}>;


export type CreateShelterInviteMutation = { __typename?: 'Mutation', createShelterInvite: { __typename?: 'ShelterInviteResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_invite?: { __typename?: 'ShelterInvite', id: string, status: ShelterInviteStatus, role: RoleLevel } | null } };

export type CreateShelterMapMutationVariables = Exact<{
  data: ShelterMapCreate;
}>;


export type CreateShelterMapMutation = { __typename?: 'Mutation', createShelterMap: { __typename?: 'ShelterMapResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, map?: { __typename?: 'ShelterMap', id: string, name: string, width: number, height: number, unit: MapUnit, zones: Array<{ __typename?: 'ShelterZone', id: string, name: string, x: number, y: number, width: number, height: number, color?: string | null }>, areas: Array<{ __typename?: 'ShelterArea', id: string, name: string, area_type: AreaType, x: number, y: number, width: number, height: number, color?: string | null, zone?: { __typename?: 'ShelterZone', id: string } | null }>, boxes: Array<{ __typename?: 'ShelterBox', id: string, label: string, x: number, y: number, width: number, height: number, rotation: number, capacity: number, status: BoxStatus, is_out_of_service: boolean, area?: { __typename?: 'ShelterArea', id: string } | null, zone?: { __typename?: 'ShelterZone', id: string } | null, current_occupants: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } }>, occupancy_history?: { __typename?: 'PaginatedBoxOccupancies', items: Array<{ __typename?: 'ShelterBoxOccupancy', id: string, exited_at?: string | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } } | null> } | null }>, elements: Array<{ __typename?: 'ShelterMapElement', id: string, element_type: MapElementType, x: number, y: number, width: number, height: number, rotation: number, color?: string | null, label?: string | null }> } | null } };

export type CreateShelterPetMutationVariables = Exact<{
  data: ShelterPetCreate;
}>;


export type CreateShelterPetMutation = { __typename?: 'Mutation', createShelterPet: { __typename?: 'ShelterPetResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } | null } };

export type CreateShelterTaskMutationVariables = Exact<{
  data: ShelterTaskCreate;
}>;


export type CreateShelterTaskMutation = { __typename?: 'Mutation', createShelterTask: { __typename?: 'ShelterTaskResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_task?: { __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null } };

export type CreateShelterWalkMutationVariables = Exact<{
  data: ShelterWalkCreate;
}>;


export type CreateShelterWalkMutation = { __typename?: 'Mutation', createShelterWalk: { __typename?: 'ShelterWalkResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_walk?: { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null } };

export type CreateShelterWalkRatingMutationVariables = Exact<{
  data: ShelterWalkRatingCreate;
}>;


export type CreateShelterWalkRatingMutation = { __typename?: 'Mutation', createShelterWalkRating: { __typename?: 'ShelterWalkRatingResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, walk_rating?: { __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null } };

export type DeleteShelterInventoryItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteShelterInventoryItemMutation = { __typename?: 'Mutation', deleteShelterInventoryItem: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type DeleteShelterRoleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteShelterRoleMutation = { __typename?: 'Mutation', deleteShelterRole: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type DeleteShelterTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteShelterTaskMutation = { __typename?: 'Mutation', deleteShelterTask: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type DeleteShelterWalkMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteShelterWalkMutation = { __typename?: 'Mutation', deleteShelterWalk: { __typename?: 'DeleteResult', success?: boolean | null, id?: string | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type MovePetBetweenBoxesMutationVariables = Exact<{
  shelter_pet_id: Scalars['ID']['input'];
  to_box_id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type MovePetBetweenBoxesMutation = { __typename?: 'Mutation', movePetBetweenBoxes: { __typename?: 'ShelterBoxOccupancyResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, occupancy?: { __typename?: 'ShelterBoxOccupancy', id: string } | null } };

export type ReleasePetFromBoxMutationVariables = Exact<{
  occupancy_id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type ReleasePetFromBoxMutation = { __typename?: 'Mutation', releasePetFromBox: { __typename?: 'ShelterBoxOccupancyResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, occupancy?: { __typename?: 'ShelterBoxOccupancy', id: string } | null } };

export type SaveShelterMapLayoutMutationVariables = Exact<{
  map_id: Scalars['ID']['input'];
  data: ShelterMapLayoutInput;
}>;


export type SaveShelterMapLayoutMutation = { __typename?: 'Mutation', saveShelterMapLayout: { __typename?: 'ShelterMapResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, map?: { __typename?: 'ShelterMap', id: string, name: string, width: number, height: number, unit: MapUnit, zones: Array<{ __typename?: 'ShelterZone', id: string, name: string, x: number, y: number, width: number, height: number, color?: string | null }>, areas: Array<{ __typename?: 'ShelterArea', id: string, name: string, area_type: AreaType, x: number, y: number, width: number, height: number, color?: string | null, zone?: { __typename?: 'ShelterZone', id: string } | null }>, boxes: Array<{ __typename?: 'ShelterBox', id: string, label: string, x: number, y: number, width: number, height: number, rotation: number, capacity: number, status: BoxStatus, is_out_of_service: boolean, area?: { __typename?: 'ShelterArea', id: string } | null, zone?: { __typename?: 'ShelterZone', id: string } | null, current_occupants: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } }>, occupancy_history?: { __typename?: 'PaginatedBoxOccupancies', items: Array<{ __typename?: 'ShelterBoxOccupancy', id: string, exited_at?: string | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } } | null> } | null }>, elements: Array<{ __typename?: 'ShelterMapElement', id: string, element_type: MapElementType, x: number, y: number, width: number, height: number, rotation: number, color?: string | null, label?: string | null }> } | null } };

export type SetShelterWalkManualDurationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  duration_minutes: Scalars['Int']['input'];
}>;


export type SetShelterWalkManualDurationMutation = { __typename?: 'Mutation', setShelterWalkManualDuration: { __typename?: 'ShelterWalkResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_walk?: { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null } };

export type RequestShelterClaimMutationVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
  data: ShelterClaimInput;
}>;


export type RequestShelterClaimMutation = { __typename?: 'Mutation', requestShelterClaim: { __typename?: 'ShelterClaimRequestResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_claim_request?: { __typename?: 'ShelterClaimRequest', id: string, status: ShelterClaimRequestStatus, message?: string | null, proof_data?: any | null, decision_note?: string | null, created_at: string, reviewed_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, requester: { __typename?: 'User', id: string, first_name: string, last_name: string }, reviewed_by?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null } };

export type CancelShelterClaimMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelShelterClaimMutation = { __typename?: 'Mutation', cancelShelterClaim: { __typename?: 'ShelterClaimRequestResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_claim_request?: { __typename?: 'ShelterClaimRequest', id: string, status: ShelterClaimRequestStatus, message?: string | null, proof_data?: any | null, decision_note?: string | null, created_at: string, reviewed_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, requester: { __typename?: 'User', id: string, first_name: string, last_name: string }, reviewed_by?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null } };

export type RequestShelterOwnershipTransferMutationVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
  to_user_id: Scalars['ID']['input'];
  new_role_for_previous_owner?: InputMaybe<RoleLevel>;
}>;


export type RequestShelterOwnershipTransferMutation = { __typename?: 'Mutation', requestShelterOwnershipTransfer: { __typename?: 'ShelterOwnershipTransferResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_ownership_transfer?: { __typename?: 'ShelterOwnershipTransfer', id: string, status: ShelterOwnershipTransferStatus, new_role_for_previous_owner?: RoleLevel | null, created_at: string, accepted_at?: string | null, rejected_at?: string | null, cancelled_at?: string | null, expires_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, from_user: { __typename?: 'User', id: string, first_name: string, last_name: string }, to_user: { __typename?: 'User', id: string, first_name: string, last_name: string } } | null } };

export type CancelShelterOwnershipTransferMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelShelterOwnershipTransferMutation = { __typename?: 'Mutation', cancelShelterOwnershipTransfer: { __typename?: 'ShelterOwnershipTransferResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_ownership_transfer?: { __typename?: 'ShelterOwnershipTransfer', id: string, status: ShelterOwnershipTransferStatus, new_role_for_previous_owner?: RoleLevel | null, created_at: string, accepted_at?: string | null, rejected_at?: string | null, cancelled_at?: string | null, expires_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, from_user: { __typename?: 'User', id: string, first_name: string, last_name: string }, to_user: { __typename?: 'User', id: string, first_name: string, last_name: string } } | null } };

export type CreateShelterPersonMutationVariables = Exact<{
  data: CreateShelterPersonInput;
}>;


export type CreateShelterPersonMutation = { __typename?: 'Mutation', createShelterPerson: { __typename?: 'ShelterPersonResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, phone?: string | null, status: ShelterPersonStatus, source: ShelterPersonSource, notes?: string | null, created_at: string, archived_at?: string | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null } };

export type UpdateShelterPersonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: UpdateShelterPersonInput;
}>;


export type UpdateShelterPersonMutation = { __typename?: 'Mutation', updateShelterPerson: { __typename?: 'ShelterPersonResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, phone?: string | null, status: ShelterPersonStatus, source: ShelterPersonSource, notes?: string | null, created_at: string, archived_at?: string | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null } };

export type ArchiveShelterPersonMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ArchiveShelterPersonMutation = { __typename?: 'Mutation', archiveShelterPerson: { __typename?: 'ShelterPersonResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, phone?: string | null, status: ShelterPersonStatus, source: ShelterPersonSource, notes?: string | null, created_at: string, archived_at?: string | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null } };

export type LinkShelterPersonToUserMutationVariables = Exact<{
  person_id: Scalars['ID']['input'];
  user_id: Scalars['ID']['input'];
}>;


export type LinkShelterPersonToUserMutation = { __typename?: 'Mutation', linkShelterPersonToUser: { __typename?: 'ShelterPersonResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, phone?: string | null, status: ShelterPersonStatus, source: ShelterPersonSource, notes?: string | null, created_at: string, archived_at?: string | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null } };

export type SkipShelterTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
}>;


export type SkipShelterTaskMutation = { __typename?: 'Mutation', skipShelterTask: { __typename?: 'ShelterTaskResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_task?: { __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null } };

export type StartShelterWalkMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type StartShelterWalkMutation = { __typename?: 'Mutation', startShelterWalk: { __typename?: 'ShelterWalkResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_walk?: { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null } };

export type UpdateShelterInventoryItemMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ShelterInventoryItemUpdate;
}>;


export type UpdateShelterInventoryItemMutation = { __typename?: 'Mutation', updateShelterInventoryItem: { __typename?: 'ShelterInventoryItemResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, item?: { __typename?: 'ShelterInventoryItem', id: string, name: string, category: InventoryCategory, unit: string, minimum_threshold?: number | null, current_quantity: number, is_below_threshold: boolean, notes?: string | null } | null } };

export type UpdateShelterMapMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ShelterMapUpdate;
}>;


export type UpdateShelterMapMutation = { __typename?: 'Mutation', updateShelterMap: { __typename?: 'ShelterMapResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, map?: { __typename?: 'ShelterMap', id: string, name: string, width: number, height: number, unit: MapUnit, zones: Array<{ __typename?: 'ShelterZone', id: string, name: string, x: number, y: number, width: number, height: number, color?: string | null }>, areas: Array<{ __typename?: 'ShelterArea', id: string, name: string, area_type: AreaType, x: number, y: number, width: number, height: number, color?: string | null, zone?: { __typename?: 'ShelterZone', id: string } | null }>, boxes: Array<{ __typename?: 'ShelterBox', id: string, label: string, x: number, y: number, width: number, height: number, rotation: number, capacity: number, status: BoxStatus, is_out_of_service: boolean, area?: { __typename?: 'ShelterArea', id: string } | null, zone?: { __typename?: 'ShelterZone', id: string } | null, current_occupants: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } }>, occupancy_history?: { __typename?: 'PaginatedBoxOccupancies', items: Array<{ __typename?: 'ShelterBoxOccupancy', id: string, exited_at?: string | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } } | null> } | null }>, elements: Array<{ __typename?: 'ShelterMapElement', id: string, element_type: MapElementType, x: number, y: number, width: number, height: number, rotation: number, color?: string | null, label?: string | null }> } | null } };

export type UpdateShelterPublicProfileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ShelterUpdate;
}>;


export type UpdateShelterPublicProfileMutation = { __typename?: 'Mutation', updateShelter: { __typename?: 'ShelterResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter?: { __typename?: 'Shelter', id: string, public_description?: string | null, public_contact_email?: string | null, public_contact_phone?: string | null, accepts_volunteers: boolean, public_location_label?: string | null, public_lat?: number | null, public_lng?: number | null } | null } };

export type UpdateShelterTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  data: ShelterTaskUpdate;
}>;


export type UpdateShelterTaskMutation = { __typename?: 'Mutation', updateShelterTask: { __typename?: 'ShelterTaskResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_task?: { __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null } };

export type DiscoverSheltersQueryVariables = Exact<{
  search?: InputMaybe<PublicShelterSearchInput>;
}>;


export type DiscoverSheltersQuery = { __typename?: 'Query', discoverShelters: { __typename?: 'PaginatedPublicShelters', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'PublicShelter', id: string, name: string, city?: string | null, region?: string | null, public_description?: string | null, public_contact_email?: string | null, public_contact_phone?: string | null, logo_media_id?: string | null, accepts_volunteers: boolean, public_location_label?: string | null, public_lat?: number | null, public_lng?: number | null } | null>, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type GetCurrentBoxForPetQueryVariables = Exact<{
  shelter_pet_id: Scalars['ID']['input'];
}>;


export type GetCurrentBoxForPetQuery = { __typename?: 'Query', getCurrentBoxForPet: { __typename?: 'ShelterBoxResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, box?: { __typename?: 'ShelterBox', id: string, label: string, capacity: number, status: BoxStatus, map_id: string, area?: { __typename?: 'ShelterArea', id: string, name: string, area_type: AreaType, color?: string | null } | null } | null } };

export type GetMyShelterDashboardQueryVariables = Exact<{
  date_from: Scalars['String']['input'];
  date_to: Scalars['String']['input'];
}>;


export type GetMyShelterDashboardQuery = { __typename?: 'Query', getMyShelterDashboard: { __typename?: 'MyShelterDashboardResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, dashboard?: { __typename?: 'MyShelterDashboard', task_count: number, overdue_task_count: number, walk_count: number, in_progress_walk_count: number, low_stock_count: number, out_of_stock_count: number, tasks: Array<{ __typename?: 'MyShelterDashboardTask', id: string, shelter_id: string, shelter_name: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, is_overdue: boolean, scheduled_at?: string | null, action_url: string }>, walks: Array<{ __typename?: 'MyShelterDashboardWalk', id: string, shelter_id: string, shelter_name: string, pet_name: string, status: ShelterWalkStatus, scheduled_at?: string | null, action_url: string }>, inventory_alerts: Array<{ __typename?: 'MyShelterDashboardInventoryAlert', id: string, shelter_id: string, shelter_name: string, name: string, current_quantity: number, minimum_threshold?: number | null, status: ShelterInventoryAlertStatus, action_url: string }> } | null } };

export type GetPublicShelterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPublicShelterQuery = { __typename?: 'Query', getPublicShelter?: { __typename?: 'PublicShelter', id: string, name: string, city?: string | null, region?: string | null, public_description?: string | null, public_contact_email?: string | null, public_contact_phone?: string | null, logo_media_id?: string | null, accepts_volunteers: boolean, public_location_label?: string | null, public_lat?: number | null, public_lng?: number | null } | null };

export type GetShelterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetShelterQuery = { __typename?: 'Query', getShelter: { __typename?: 'ShelterResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter?: { __typename?: 'Shelter', id: string, name: string, city: string, region?: string | null, district?: string | null, street: string, street_number: string, postal_code: string, province_code: string, type: ShelterType, verification_status: ShelterVerificationStatus, contacts?: Array<{ __typename?: 'ShelterContact', type?: string | null, value?: string | null } | null> | null, roles?: { __typename?: 'PaginatedShelterRoles', items: Array<{ __typename?: 'ShelterRole', id: string, role: RoleLevel, user: { __typename?: 'User', id: string, role: UserRole, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null } } | null> } | null, pets?: { __typename?: 'PaginatedShelterPets', items: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } | null } };

export type GetShelterMapQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetShelterMapQuery = { __typename?: 'Query', getShelterMap: { __typename?: 'ShelterMapResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, map?: { __typename?: 'ShelterMap', id: string, name: string, width: number, height: number, unit: MapUnit, zones: Array<{ __typename?: 'ShelterZone', id: string, name: string, x: number, y: number, width: number, height: number, color?: string | null }>, areas: Array<{ __typename?: 'ShelterArea', id: string, name: string, area_type: AreaType, x: number, y: number, width: number, height: number, color?: string | null, zone?: { __typename?: 'ShelterZone', id: string } | null }>, boxes: Array<{ __typename?: 'ShelterBox', id: string, label: string, x: number, y: number, width: number, height: number, rotation: number, capacity: number, status: BoxStatus, is_out_of_service: boolean, area?: { __typename?: 'ShelterArea', id: string } | null, zone?: { __typename?: 'ShelterZone', id: string } | null, current_occupants: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } }>, occupancy_history?: { __typename?: 'PaginatedBoxOccupancies', items: Array<{ __typename?: 'ShelterBoxOccupancy', id: string, exited_at?: string | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } } | null> } | null }>, elements: Array<{ __typename?: 'ShelterMapElement', id: string, element_type: MapElementType, x: number, y: number, width: number, height: number, rotation: number, color?: string | null, label?: string | null }> } | null } };

export type GetShelterOperationalDashboardQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
}>;


export type GetShelterOperationalDashboardQuery = { __typename?: 'Query', getShelterOperationalDashboard: { __typename?: 'ShelterOperationalDashboardResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, dashboard?: { __typename?: 'ShelterOperationalDashboard', shelter_id: string, walks_completed_today: number, walks_planned_today: number, pets_needing_walk: number, tasks_pending: number, tasks_overdue: number, tasks_completed_today: number, tasks_total: number, tasks_recurring: number, tasks_due_this_week: number, boxes_total: number, boxes_free: number, boxes_occupied: number, boxes_full: number, boxes_out_of_service: number, pets_total: number, pets_without_box: number, low_stock_count: number } | null } };

export type GetShelterPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetShelterPetQuery = { __typename?: 'Query', getShelterPet: { __typename?: 'ShelterPetResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string } } | null } };

export type GetShelterPetWalkingStatsQueryVariables = Exact<{
  shelter_pet_id: Scalars['ID']['input'];
  period: StatsPeriod;
}>;


export type GetShelterPetWalkingStatsQuery = { __typename?: 'Query', getShelterPetWalkingStats: { __typename?: 'WalkRatingChartResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, chart?: { __typename?: 'WalkRatingChartData', labels: Array<string>, series: Array<{ __typename?: 'WalkRatingSeries', type: WalkRatingType, data: Array<number | null> }> } | null } };

export type GetShelterPublicProfileQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetShelterPublicProfileQuery = { __typename?: 'Query', getShelter: { __typename?: 'ShelterResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter?: { __typename?: 'Shelter', id: string, name: string, public_description?: string | null, public_contact_email?: string | null, public_contact_phone?: string | null, accepts_volunteers: boolean, public_location_label?: string | null, public_lat?: number | null, public_lng?: number | null } | null } };

export type GetShelterTaskQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetShelterTaskQuery = { __typename?: 'Query', getShelterTask: { __typename?: 'ShelterTaskResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_task?: { __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null } };

export type GetShelterWalkQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetShelterWalkQuery = { __typename?: 'Query', getShelterWalk: { __typename?: 'ShelterWalkResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, shelter_walk?: { __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null } };

export type ListMyOwnershipTransfersQueryVariables = Exact<{
  search?: InputMaybe<CommonSearch>;
}>;


export type ListMyOwnershipTransfersQuery = { __typename?: 'Query', listMyOwnershipTransfers: { __typename?: 'PaginatedShelterOwnershipTransfers', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'ShelterOwnershipTransfer', id: string, status: ShelterOwnershipTransferStatus, new_role_for_previous_owner?: RoleLevel | null, created_at: string, accepted_at?: string | null, rejected_at?: string | null, cancelled_at?: string | null, expires_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, from_user: { __typename?: 'User', id: string, first_name: string, last_name: string }, to_user: { __typename?: 'User', id: string, first_name: string, last_name: string } } | null>, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListOperationalShelterTasksQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
}>;


export type ListOperationalShelterTasksQuery = { __typename?: 'Query', listOperationalShelterTasks: { __typename?: 'PaginatedShelterTasks', success?: boolean | null, items: Array<{ __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListOperationalShelterWalksQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
}>;


export type ListOperationalShelterWalksQuery = { __typename?: 'Query', listOperationalShelterWalks: { __typename?: 'PaginatedShelterWalks', success?: boolean | null, items: Array<{ __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListPetsNeedingWalkQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
  hours?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListPetsNeedingWalkQuery = { __typename?: 'Query', listPetsNeedingWalk: { __typename?: 'PaginatedShelterPets', success?: boolean | null, items: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type ListShelterClaimRequestsQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
  search?: InputMaybe<CommonSearch>;
}>;


export type ListShelterClaimRequestsQuery = { __typename?: 'Query', listShelterClaimRequests: { __typename?: 'PaginatedShelterClaimRequests', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'ShelterClaimRequest', id: string, status: ShelterClaimRequestStatus, message?: string | null, proof_data?: any | null, decision_note?: string | null, created_at: string, reviewed_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, requester: { __typename?: 'User', id: string, first_name: string, last_name: string }, reviewed_by?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null>, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListShelterInventoryItemsQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterInventoryItemsQuery = { __typename?: 'Query', listShelterInventoryItems: { __typename?: 'PaginatedInventoryItems', success?: boolean | null, items: Array<{ __typename?: 'ShelterInventoryItem', id: string, name: string, category: InventoryCategory, unit: string, minimum_threshold?: number | null, current_quantity: number, is_below_threshold: boolean, notes?: string | null } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListShelterMapsQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterMapsQuery = { __typename?: 'Query', listShelterMaps: { __typename?: 'PaginatedShelterMaps', success?: boolean | null, items: Array<{ __typename?: 'ShelterMap', id: string, name: string, width: number, height: number, unit: MapUnit } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type ListShelterMediasQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterMediasQuery = { __typename?: 'Query', listMedias: { __typename?: 'PaginatedMedias', success?: boolean | null, items: Array<{ __typename?: 'Media', id: string, url: string, type: string, scope: string, ref_id: string } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListShelterOwnershipTransfersQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
  search?: InputMaybe<CommonSearch>;
}>;


export type ListShelterOwnershipTransfersQuery = { __typename?: 'Query', listShelterOwnershipTransfers: { __typename?: 'PaginatedShelterOwnershipTransfers', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'ShelterOwnershipTransfer', id: string, status: ShelterOwnershipTransferStatus, new_role_for_previous_owner?: RoleLevel | null, created_at: string, accepted_at?: string | null, rejected_at?: string | null, cancelled_at?: string | null, expires_at?: string | null, shelter: { __typename?: 'Shelter', id: string, name: string }, from_user: { __typename?: 'User', id: string, first_name: string, last_name: string }, to_user: { __typename?: 'User', id: string, first_name: string, last_name: string } } | null>, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListShelterPeopleQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
  search?: InputMaybe<CommonSearch>;
}>;


export type ListShelterPeopleQuery = { __typename?: 'Query', listShelterPeople: { __typename?: 'PaginatedShelterPeople', success?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, items: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null, email?: string | null, phone?: string | null, status: ShelterPersonStatus, source: ShelterPersonSource, notes?: string | null, created_at: string, archived_at?: string | null, user?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null } | null>, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListShelterPetsMinQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterPetsMinQuery = { __typename?: 'Query', listShelterPets: { __typename?: 'PaginatedShelterPets', success?: boolean | null, items: Array<{ __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, gender?: Gender | null, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type ListShelterRolesMinQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterRolesMinQuery = { __typename?: 'Query', listShelterRoles: { __typename?: 'PaginatedShelterRoles', success?: boolean | null, items: Array<{ __typename?: 'ShelterRole', id: string, role: RoleLevel, user: { __typename?: 'User', id: string, first_name: string, last_name: string } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type ListShelterTasksQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterTasksQuery = { __typename?: 'Query', listShelterTasks: { __typename?: 'PaginatedShelterTasks', success?: boolean | null, items: Array<{ __typename?: 'ShelterTask', id: string, task_type: ShelterTaskType, area?: string | null, status: TaskStatus, scheduled_at?: string | null, completed_at?: string | null, is_recurring: boolean, notes?: string | null, recurrence?: { __typename?: 'Recurrence', freq: RecurrenceFreq, interval: number, weekdays?: Array<Weekday> | null, week_ordinal?: number | null, time_of_day?: string | null, start_at?: string | null } | null, assignees: Array<{ __typename?: 'User', id: string, first_name: string, last_name: string }>, assignee_shelter_people: Array<{ __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null }>, shelter_pet?: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } | null } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListShelterWalksQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListShelterWalksQuery = { __typename?: 'Query', listShelterWalks: { __typename?: 'PaginatedShelterWalks', success?: boolean | null, items: Array<{ __typename?: 'ShelterWalk', id: string, status: ShelterWalkStatus, scheduled_at?: string | null, started_at?: string | null, ended_at?: string | null, duration_minutes?: number | null, notes?: string | null, ratings?: Array<{ __typename?: 'ShelterWalkRating', id: string, type: WalkRatingType, rating: number } | null> | null, walker?: { __typename?: 'User', id: string, first_name: string, last_name: string } | null, walker_shelter_person?: { __typename?: 'ShelterPerson', id: string, first_name?: string | null, last_name?: string | null } | null, shelter_pet: { __typename?: 'ShelterPet', id: string, pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string } | null } } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type ListSheltersQueryVariables = Exact<{
  commonSearch?: InputMaybe<CommonSearch>;
}>;


export type ListSheltersQuery = { __typename?: 'Query', listShelters: { __typename?: 'PaginatedShelters', success?: boolean | null, items: Array<{ __typename?: 'Shelter', id: string, name: string, city: string, region?: string | null, street: string, street_number: string, postal_code: string, province_code: string, type: ShelterType, verification_status: ShelterVerificationStatus, visibility: ShelterVisibility, contacts?: Array<{ __typename?: 'ShelterContact', type?: string | null, value?: string | null } | null> | null } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', current_page?: number | null, page_size?: number | null, total_items?: number | null, total_pages?: number | null } } };

export type MyShelterAuthorizationQueryVariables = Exact<{
  shelter_id: Scalars['ID']['input'];
}>;


export type MyShelterAuthorizationQuery = { __typename?: 'Query', myShelterAuthorization: { __typename?: 'ShelterAuthorizationResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, authorization?: { __typename?: 'ShelterAuthorization', shelter_id: string, membership_status?: string | null, permissions: Array<string> } | null } };

export const FullReportFragmentDoc = gql`
    fragment FullReport on Report {
  id
  medias {
    id
    url
  }
  reporter {
    email
    first_name
    last_name
    user_id
  }
  responders {
    email
  }
  notes
  coordinates {
    latitude
    longitude
  }
  place
  pet {
    id
    name
    years
    weight_kg
    gender
    breed
    main_picture {
      id
    }
  }
  type
  date
  medias {
    id
  }
}
    `;
export const MinReportFragmentDoc = gql`
    fragment MinReport on Report {
  id
  reporter {
    email
    user_id
  }
  place
  latitude
  longitude
  created_at
  type
  date
}
    `;
export const AppointmentFragmentDoc = gql`
    fragment Appointment on Treatment {
  id
  date
  type
  name
  duration
  health_card {
    pet {
      id
      name
      main_picture {
        id
        main_color {
          color
        }
      }
    }
  }
}
    `;
export const PetMinSubOwnerFragmentDoc = gql`
    fragment petMinSubOwner on Ownership {
  id
  custody_level
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
export const MinPetFragmentDoc = gql`
    fragment MinPet on Pet {
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
  ownerships {
    items {
      ...petMinSubOwner
    }
  }
  weight_kg
  birthday
  gender
  neutered
  breed
  coat_length
}
    ${PetMinSubOwnerFragmentDoc}`;
export const DashboardPetFragmentDoc = gql`
    fragment DashboardPet on Pet {
  ...MinPet
  health_card {
    id
    treatments(
      commonSearch: {order_by: "date", order_direction: "asc", filters: {ranges: [{key: "date", value: {min: $date_from, max: $date_to}}], lists: [{key: "type", value: ["REMINDER", "TABLET", "OPERATION", "TRAINING", "ANTIPARASITIC"]}]}}
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
    ${MinPetFragmentDoc}`;
export const FullPetFragmentDoc = gql`
    fragment FullPet on Pet {
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
  pictures {
    items {
      id
      main_color {
        color
        contrast
      }
      url
      ref_id
    }
  }
  ownerships {
    items {
      ...petMinSubOwner
    }
  }
  weight_kg
  birthday
  gender
  breed
  coat_length
}
    ${PetMinSubOwnerFragmentDoc}`;
export const FullTreatmentFragmentDoc = gql`
    fragment FullTreatment on Treatment {
  id
  name
  date
  logs
  type
  health_card {
    id
    pet {
      ...MinPet
    }
  }
  booster {
    id
  }
  related {
    id
    date
    name
    type
  }
}
    ${MinPetFragmentDoc}`;
export const MinNotificationFragmentDoc = gql`
    fragment MinNotification on Notification {
  id
  type
  status
  priority
  title
  message
  entity_type
  entity_id
  action_url
  actor_user_id
  shelter_id
  pet_id
  payload
  created_at
  read_at
}
    `;
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
export const FullShelterFragmentDoc = gql`
    fragment FullShelter on Shelter {
  id
  name
  city
  region
  district
  street
  street_number
  postal_code
  province_code
  type
  verification_status
  contacts {
    type
    value
  }
  roles {
    items {
      id
      role
      user {
        ...minUser
      }
    }
  }
  pets {
    items {
      id
      pet {
        id
        name
        main_picture {
          id
          main_color {
            color
            contrast
          }
        }
      }
    }
  }
}
    ${MinUserFragmentDoc}`;
export const FullShelterMapFragmentDoc = gql`
    fragment FullShelterMap on ShelterMap {
  id
  name
  width
  height
  unit
  zones {
    id
    name
    x
    y
    width
    height
    color
  }
  areas {
    id
    name
    area_type
    x
    y
    width
    height
    color
    zone {
      id
    }
  }
  boxes {
    id
    label
    x
    y
    width
    height
    rotation
    capacity
    status
    is_out_of_service
    area {
      id
    }
    zone {
      id
    }
    current_occupants {
      id
      pet {
        id
        name
      }
    }
    occupancy_history {
      items {
        id
        exited_at
        shelter_pet {
          id
          pet {
            id
            name
          }
        }
      }
    }
  }
  elements {
    id
    element_type
    x
    y
    width
    height
    rotation
    color
    label
  }
}
    `;
export const MinInventoryItemFragmentDoc = gql`
    fragment MinInventoryItem on ShelterInventoryItem {
  id
  name
  category
  unit
  minimum_threshold
  current_quantity
  is_below_threshold
  notes
}
    `;
export const MinShelterFragmentDoc = gql`
    fragment MinShelter on Shelter {
  id
  name
  city
  region
  street
  street_number
  postal_code
  province_code
  type
  verification_status
  visibility
  contacts {
    type
    value
  }
}
    `;
export const MinShelterClaimRequestFragmentDoc = gql`
    fragment MinShelterClaimRequest on ShelterClaimRequest {
  id
  status
  message
  proof_data
  decision_note
  created_at
  reviewed_at
  shelter {
    id
    name
  }
  requester {
    id
    first_name
    last_name
  }
  reviewed_by {
    id
    first_name
    last_name
  }
}
    `;
export const MinShelterOwnershipTransferFragmentDoc = gql`
    fragment MinShelterOwnershipTransfer on ShelterOwnershipTransfer {
  id
  status
  new_role_for_previous_owner
  created_at
  accepted_at
  rejected_at
  cancelled_at
  expires_at
  shelter {
    id
    name
  }
  from_user {
    id
    first_name
    last_name
  }
  to_user {
    id
    first_name
    last_name
  }
}
    `;
export const MinShelterPersonFragmentDoc = gql`
    fragment MinShelterPerson on ShelterPerson {
  id
  first_name
  last_name
  email
  phone
  status
  source
  notes
  created_at
  archived_at
  user {
    id
    first_name
    last_name
  }
}
    `;
export const MinShelterTaskFragmentDoc = gql`
    fragment MinShelterTask on ShelterTask {
  id
  task_type
  area
  status
  scheduled_at
  completed_at
  is_recurring
  recurrence {
    freq
    interval
    weekdays
    week_ordinal
    time_of_day
    start_at
  }
  notes
  assignees {
    id
    first_name
    last_name
  }
  assignee_shelter_people {
    id
    first_name
    last_name
  }
  shelter_pet {
    id
    pet {
      id
      name
      main_picture {
        id
      }
    }
  }
}
    `;
export const MinShelterWalkFragmentDoc = gql`
    fragment MinShelterWalk on ShelterWalk {
  id
  status
  scheduled_at
  started_at
  ended_at
  duration_minutes
  notes
  ratings {
    id
    type
    rating
  }
  walker {
    id
    first_name
    last_name
  }
  walker_shelter_person {
    id
    first_name
    last_name
  }
  shelter_pet {
    id
    pet {
      id
      name
      main_picture {
        id
      }
    }
  }
}
    `;
export const PublicShelterFragmentDoc = gql`
    fragment PublicShelter on PublicShelter {
  id
  name
  city
  region
  public_description
  public_contact_email
  public_contact_phone
  logo_media_id
  accepts_volunteers
  public_location_label
  public_lat
  public_lng
}
    `;
export const CreateMediaDocument = gql`
    mutation createMedia($data: MediaCreate!) {
  createMedia(data: $data) {
    media {
      id
      ref_id
      type
      scope
    }
  }
}
    `;
export type CreateMediaMutationFn = Apollo.MutationFunction<CreateMediaMutation, CreateMediaMutationVariables>;

/**
 * __useCreateMediaMutation__
 *
 * To run a mutation, you first call `useCreateMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMediaMutation, { data, loading, error }] = useCreateMediaMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateMediaMutation(baseOptions?: Apollo.MutationHookOptions<CreateMediaMutation, CreateMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMediaMutation, CreateMediaMutationVariables>(CreateMediaDocument, options);
      }
export type CreateMediaMutationHookResult = ReturnType<typeof useCreateMediaMutation>;
export type CreateMediaMutationResult = Apollo.MutationResult<CreateMediaMutation>;
export type CreateMediaMutationOptions = Apollo.BaseMutationOptions<CreateMediaMutation, CreateMediaMutationVariables>;
export const UpdateMediaDocument = gql`
    mutation updateMedia($id: ID!, $data: MediaUpdate!) {
  updateMedia(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    media {
      id
      main_color {
        color
        contrast
      }
    }
  }
}
    `;
export type UpdateMediaMutationFn = Apollo.MutationFunction<UpdateMediaMutation, UpdateMediaMutationVariables>;

/**
 * __useUpdateMediaMutation__
 *
 * To run a mutation, you first call `useUpdateMediaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMediaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMediaMutation, { data, loading, error }] = useUpdateMediaMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateMediaMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMediaMutation, UpdateMediaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMediaMutation, UpdateMediaMutationVariables>(UpdateMediaDocument, options);
      }
export type UpdateMediaMutationHookResult = ReturnType<typeof useUpdateMediaMutation>;
export type UpdateMediaMutationResult = Apollo.MutationResult<UpdateMediaMutation>;
export type UpdateMediaMutationOptions = Apollo.BaseMutationOptions<UpdateMediaMutation, UpdateMediaMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($id: ID!, $data: UserUpdate!) {
  updateUser(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    user {
      id
      first_name
      last_name
      email
      profile_picture {
        id
      }
    }
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    success
    error {
      code
      message
      extra
    }
    user {
      ...minUser
    }
  }
}
    ${MinUserFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ResendCodeDocument = gql`
    mutation resendCode($email: String!) {
  resendCode(email: $email) {
    success
    error {
      message
      code
      extra
    }
  }
}
    `;
export type ResendCodeMutationFn = Apollo.MutationFunction<ResendCodeMutation, ResendCodeMutationVariables>;

/**
 * __useResendCodeMutation__
 *
 * To run a mutation, you first call `useResendCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendCodeMutation, { data, loading, error }] = useResendCodeMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResendCodeMutation(baseOptions?: Apollo.MutationHookOptions<ResendCodeMutation, ResendCodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ResendCodeMutation, ResendCodeMutationVariables>(ResendCodeDocument, options);
      }
export type ResendCodeMutationHookResult = ReturnType<typeof useResendCodeMutation>;
export type ResendCodeMutationResult = Apollo.MutationResult<ResendCodeMutation>;
export type ResendCodeMutationOptions = Apollo.BaseMutationOptions<ResendCodeMutation, ResendCodeMutationVariables>;
export const SignUpDocument = gql`
    mutation SignUp($data: UserCreate!) {
  signUp(data: $data) {
    user {
      id
      last_name
      first_name
      email
      role
    }
    success
    error {
      code
      message
    }
  }
}
    `;
export type SignUpMutationFn = Apollo.MutationFunction<SignUpMutation, SignUpMutationVariables>;

/**
 * __useSignUpMutation__
 *
 * To run a mutation, you first call `useSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signUpMutation, { data, loading, error }] = useSignUpMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSignUpMutation(baseOptions?: Apollo.MutationHookOptions<SignUpMutation, SignUpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument, options);
      }
export type SignUpMutationHookResult = ReturnType<typeof useSignUpMutation>;
export type SignUpMutationResult = Apollo.MutationResult<SignUpMutation>;
export type SignUpMutationOptions = Apollo.BaseMutationOptions<SignUpMutation, SignUpMutationVariables>;
export const VerifyDocument = gql`
    mutation verify($email: String!, $code: String!) {
  verifyUser(email: $email, code: $code) {
    token
    success
    error {
      code
      message
      extra
    }
    user {
      ...minUser
    }
  }
}
    ${MinUserFragmentDoc}`;
export type VerifyMutationFn = Apollo.MutationFunction<VerifyMutation, VerifyMutationVariables>;

/**
 * __useVerifyMutation__
 *
 * To run a mutation, you first call `useVerifyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyMutation, { data, loading, error }] = useVerifyMutation({
 *   variables: {
 *      email: // value for 'email'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifyMutation(baseOptions?: Apollo.MutationHookOptions<VerifyMutation, VerifyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyMutation, VerifyMutationVariables>(VerifyDocument, options);
      }
export type VerifyMutationHookResult = ReturnType<typeof useVerifyMutation>;
export type VerifyMutationResult = Apollo.MutationResult<VerifyMutation>;
export type VerifyMutationOptions = Apollo.BaseMutationOptions<VerifyMutation, VerifyMutationVariables>;
export const CreateReportDocument = gql`
    mutation createReport($data: ReportCreate!) {
  createReport(data: $data) {
    report {
      id
    }
    error {
      message
      code
    }
  }
}
    `;
export type CreateReportMutationFn = Apollo.MutationFunction<CreateReportMutation, CreateReportMutationVariables>;

/**
 * __useCreateReportMutation__
 *
 * To run a mutation, you first call `useCreateReportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReportMutation, { data, loading, error }] = useCreateReportMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateReportMutation(baseOptions?: Apollo.MutationHookOptions<CreateReportMutation, CreateReportMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateReportMutation, CreateReportMutationVariables>(CreateReportDocument, options);
      }
export type CreateReportMutationHookResult = ReturnType<typeof useCreateReportMutation>;
export type CreateReportMutationResult = Apollo.MutationResult<CreateReportMutation>;
export type CreateReportMutationOptions = Apollo.BaseMutationOptions<CreateReportMutation, CreateReportMutationVariables>;
export const GetReportDocument = gql`
    query getReport($id: ID!) {
  getReport(id: $id) {
    report {
      ...FullReport
    }
    success
    error {
      code
      message
    }
  }
}
    ${FullReportFragmentDoc}`;

/**
 * __useGetReportQuery__
 *
 * To run a query within a React component, call `useGetReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReportQuery(baseOptions: Apollo.QueryHookOptions<GetReportQuery, GetReportQueryVariables> & ({ variables: GetReportQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetReportQuery, GetReportQueryVariables>(GetReportDocument, options);
      }
export function useGetReportLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetReportQuery, GetReportQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetReportQuery, GetReportQueryVariables>(GetReportDocument, options);
        }
export function useGetReportSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetReportQuery, GetReportQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetReportQuery, GetReportQueryVariables>(GetReportDocument, options);
        }
export type GetReportQueryHookResult = ReturnType<typeof useGetReportQuery>;
export type GetReportLazyQueryHookResult = ReturnType<typeof useGetReportLazyQuery>;
export type GetReportSuspenseQueryHookResult = ReturnType<typeof useGetReportSuspenseQuery>;
export type GetReportQueryResult = Apollo.QueryResult<GetReportQuery, GetReportQueryVariables>;
export const ListReportsDocument = gql`
    query listReports($commonSearch: CommonSearch!) {
  listReports(commonSearch: $commonSearch) {
    items {
      ...MinReport
    }
    success
    error {
      code
      message
    }
    pagination {
      page_size
      total_items
    }
  }
}
    ${MinReportFragmentDoc}`;

/**
 * __useListReportsQuery__
 *
 * To run a query within a React component, call `useListReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListReportsQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListReportsQuery(baseOptions: Apollo.QueryHookOptions<ListReportsQuery, ListReportsQueryVariables> & ({ variables: ListReportsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListReportsQuery, ListReportsQueryVariables>(ListReportsDocument, options);
      }
export function useListReportsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListReportsQuery, ListReportsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListReportsQuery, ListReportsQueryVariables>(ListReportsDocument, options);
        }
export function useListReportsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListReportsQuery, ListReportsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListReportsQuery, ListReportsQueryVariables>(ListReportsDocument, options);
        }
export type ListReportsQueryHookResult = ReturnType<typeof useListReportsQuery>;
export type ListReportsLazyQueryHookResult = ReturnType<typeof useListReportsLazyQuery>;
export type ListReportsSuspenseQueryHookResult = ReturnType<typeof useListReportsSuspenseQuery>;
export type ListReportsQueryResult = Apollo.QueryResult<ListReportsQuery, ListReportsQueryVariables>;
export const CreateCureDocument = gql`
    mutation CreateCure($cure: CureCreate!) {
  createCure(data: $cure) {
    success
    error {
      code
      message
    }
    cure {
      id
      frequency_times
      frequency_value
      frequency_unit
    }
  }
}
    `;
export type CreateCureMutationFn = Apollo.MutationFunction<CreateCureMutation, CreateCureMutationVariables>;

/**
 * __useCreateCureMutation__
 *
 * To run a mutation, you first call `useCreateCureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCureMutation, { data, loading, error }] = useCreateCureMutation({
 *   variables: {
 *      cure: // value for 'cure'
 *   },
 * });
 */
export function useCreateCureMutation(baseOptions?: Apollo.MutationHookOptions<CreateCureMutation, CreateCureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateCureMutation, CreateCureMutationVariables>(CreateCureDocument, options);
      }
export type CreateCureMutationHookResult = ReturnType<typeof useCreateCureMutation>;
export type CreateCureMutationResult = Apollo.MutationResult<CreateCureMutation>;
export type CreateCureMutationOptions = Apollo.BaseMutationOptions<CreateCureMutation, CreateCureMutationVariables>;
export const CreateTreatmentDocument = gql`
    mutation CreateTreatment($treatment: TreatmentCreate!) {
  createTreatment(data: $treatment) {
    success
    error {
      extra
      code
      message
    }
    treatment {
      id
      name
      date
      related {
        id
        date
      }
    }
  }
}
    `;
export type CreateTreatmentMutationFn = Apollo.MutationFunction<CreateTreatmentMutation, CreateTreatmentMutationVariables>;

/**
 * __useCreateTreatmentMutation__
 *
 * To run a mutation, you first call `useCreateTreatmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTreatmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTreatmentMutation, { data, loading, error }] = useCreateTreatmentMutation({
 *   variables: {
 *      treatment: // value for 'treatment'
 *   },
 * });
 */
export function useCreateTreatmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateTreatmentMutation, CreateTreatmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTreatmentMutation, CreateTreatmentMutationVariables>(CreateTreatmentDocument, options);
      }
export type CreateTreatmentMutationHookResult = ReturnType<typeof useCreateTreatmentMutation>;
export type CreateTreatmentMutationResult = Apollo.MutationResult<CreateTreatmentMutation>;
export type CreateTreatmentMutationOptions = Apollo.BaseMutationOptions<CreateTreatmentMutation, CreateTreatmentMutationVariables>;
export const CreateWalkDocument = gql`
    mutation CreateWalk($walk: WalkCreate!) {
  createWalk(data: $walk) {
    success
    error {
      code
      message
    }
    walk {
      id
      distance_km
    }
  }
}
    `;
export type CreateWalkMutationFn = Apollo.MutationFunction<CreateWalkMutation, CreateWalkMutationVariables>;

/**
 * __useCreateWalkMutation__
 *
 * To run a mutation, you first call `useCreateWalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWalkMutation, { data, loading, error }] = useCreateWalkMutation({
 *   variables: {
 *      walk: // value for 'walk'
 *   },
 * });
 */
export function useCreateWalkMutation(baseOptions?: Apollo.MutationHookOptions<CreateWalkMutation, CreateWalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWalkMutation, CreateWalkMutationVariables>(CreateWalkDocument, options);
      }
export type CreateWalkMutationHookResult = ReturnType<typeof useCreateWalkMutation>;
export type CreateWalkMutationResult = Apollo.MutationResult<CreateWalkMutation>;
export type CreateWalkMutationOptions = Apollo.BaseMutationOptions<CreateWalkMutation, CreateWalkMutationVariables>;
export const CreateWalkRatingDocument = gql`
    mutation CreateWalkRating($walkRating: WalkRatingCreate!) {
  createWalkRating(data: $walkRating) {
    success
    error {
      code
      message
    }
    walk_rating {
      id
      type
      rating
    }
  }
}
    `;
export type CreateWalkRatingMutationFn = Apollo.MutationFunction<CreateWalkRatingMutation, CreateWalkRatingMutationVariables>;

/**
 * __useCreateWalkRatingMutation__
 *
 * To run a mutation, you first call `useCreateWalkRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWalkRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWalkRatingMutation, { data, loading, error }] = useCreateWalkRatingMutation({
 *   variables: {
 *      walkRating: // value for 'walkRating'
 *   },
 * });
 */
export function useCreateWalkRatingMutation(baseOptions?: Apollo.MutationHookOptions<CreateWalkRatingMutation, CreateWalkRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWalkRatingMutation, CreateWalkRatingMutationVariables>(CreateWalkRatingDocument, options);
      }
export type CreateWalkRatingMutationHookResult = ReturnType<typeof useCreateWalkRatingMutation>;
export type CreateWalkRatingMutationResult = Apollo.MutationResult<CreateWalkRatingMutation>;
export type CreateWalkRatingMutationOptions = Apollo.BaseMutationOptions<CreateWalkRatingMutation, CreateWalkRatingMutationVariables>;
export const DeleteTreatmentDocument = gql`
    mutation deleteTreatment($id: ID!) {
  deleteTreatment(id: $id) {
    error {
      code
      message
    }
    success
    id
  }
}
    `;
export type DeleteTreatmentMutationFn = Apollo.MutationFunction<DeleteTreatmentMutation, DeleteTreatmentMutationVariables>;

/**
 * __useDeleteTreatmentMutation__
 *
 * To run a mutation, you first call `useDeleteTreatmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTreatmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTreatmentMutation, { data, loading, error }] = useDeleteTreatmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTreatmentMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTreatmentMutation, DeleteTreatmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTreatmentMutation, DeleteTreatmentMutationVariables>(DeleteTreatmentDocument, options);
      }
export type DeleteTreatmentMutationHookResult = ReturnType<typeof useDeleteTreatmentMutation>;
export type DeleteTreatmentMutationResult = Apollo.MutationResult<DeleteTreatmentMutation>;
export type DeleteTreatmentMutationOptions = Apollo.BaseMutationOptions<DeleteTreatmentMutation, DeleteTreatmentMutationVariables>;
export const UpdateTreatmentDocument = gql`
    mutation UpdateTreatment($id: ID!, $data: TreatmentUpdate!) {
  updateTreatment(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    treatment {
      ...FullTreatment
    }
  }
}
    ${FullTreatmentFragmentDoc}`;
export type UpdateTreatmentMutationFn = Apollo.MutationFunction<UpdateTreatmentMutation, UpdateTreatmentMutationVariables>;

/**
 * __useUpdateTreatmentMutation__
 *
 * To run a mutation, you first call `useUpdateTreatmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTreatmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTreatmentMutation, { data, loading, error }] = useUpdateTreatmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTreatmentMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTreatmentMutation, UpdateTreatmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTreatmentMutation, UpdateTreatmentMutationVariables>(UpdateTreatmentDocument, options);
      }
export type UpdateTreatmentMutationHookResult = ReturnType<typeof useUpdateTreatmentMutation>;
export type UpdateTreatmentMutationResult = Apollo.MutationResult<UpdateTreatmentMutation>;
export type UpdateTreatmentMutationOptions = Apollo.BaseMutationOptions<UpdateTreatmentMutation, UpdateTreatmentMutationVariables>;
export const GetTreatmentDocument = gql`
    query getTreatment($id: ID!) {
  getTreatment(id: $id) {
    error {
      code
      message
    }
    treatment {
      ...FullTreatment
    }
  }
}
    ${FullTreatmentFragmentDoc}`;

/**
 * __useGetTreatmentQuery__
 *
 * To run a query within a React component, call `useGetTreatmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTreatmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTreatmentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTreatmentQuery(baseOptions: Apollo.QueryHookOptions<GetTreatmentQuery, GetTreatmentQueryVariables> & ({ variables: GetTreatmentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTreatmentQuery, GetTreatmentQueryVariables>(GetTreatmentDocument, options);
      }
export function useGetTreatmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTreatmentQuery, GetTreatmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTreatmentQuery, GetTreatmentQueryVariables>(GetTreatmentDocument, options);
        }
export function useGetTreatmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTreatmentQuery, GetTreatmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTreatmentQuery, GetTreatmentQueryVariables>(GetTreatmentDocument, options);
        }
export type GetTreatmentQueryHookResult = ReturnType<typeof useGetTreatmentQuery>;
export type GetTreatmentLazyQueryHookResult = ReturnType<typeof useGetTreatmentLazyQuery>;
export type GetTreatmentSuspenseQueryHookResult = ReturnType<typeof useGetTreatmentSuspenseQuery>;
export type GetTreatmentQueryResult = Apollo.QueryResult<GetTreatmentQuery, GetTreatmentQueryVariables>;
export const ListMyTreatmentsDocument = gql`
    query listMyTreatments($commonSearch: CommonSearch!) {
  listMyTreatments(commonSearch: $commonSearch) {
    items {
      ...Appointment
    }
    success
    error {
      code
      message
    }
    pagination {
      page_size
      total_items
    }
  }
}
    ${AppointmentFragmentDoc}`;

/**
 * __useListMyTreatmentsQuery__
 *
 * To run a query within a React component, call `useListMyTreatmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMyTreatmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMyTreatmentsQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListMyTreatmentsQuery(baseOptions: Apollo.QueryHookOptions<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables> & ({ variables: ListMyTreatmentsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables>(ListMyTreatmentsDocument, options);
      }
export function useListMyTreatmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables>(ListMyTreatmentsDocument, options);
        }
export function useListMyTreatmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables>(ListMyTreatmentsDocument, options);
        }
export type ListMyTreatmentsQueryHookResult = ReturnType<typeof useListMyTreatmentsQuery>;
export type ListMyTreatmentsLazyQueryHookResult = ReturnType<typeof useListMyTreatmentsLazyQuery>;
export type ListMyTreatmentsSuspenseQueryHookResult = ReturnType<typeof useListMyTreatmentsSuspenseQuery>;
export type ListMyTreatmentsQueryResult = Apollo.QueryResult<ListMyTreatmentsQuery, ListMyTreatmentsQueryVariables>;
export const GetWalkByTreatmentDocument = gql`
    query getWalkByTreatment($commonSearch: CommonSearch) {
  listWalks(commonSearch: $commonSearch) {
    error {
      code
      message
    }
    items {
      id
      distance_km
      ratings {
        items {
          id
          type
          rating
        }
      }
    }
  }
}
    `;

/**
 * __useGetWalkByTreatmentQuery__
 *
 * To run a query within a React component, call `useGetWalkByTreatmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWalkByTreatmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWalkByTreatmentQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useGetWalkByTreatmentQuery(baseOptions?: Apollo.QueryHookOptions<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>(GetWalkByTreatmentDocument, options);
      }
export function useGetWalkByTreatmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>(GetWalkByTreatmentDocument, options);
        }
export function useGetWalkByTreatmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>(GetWalkByTreatmentDocument, options);
        }
export type GetWalkByTreatmentQueryHookResult = ReturnType<typeof useGetWalkByTreatmentQuery>;
export type GetWalkByTreatmentLazyQueryHookResult = ReturnType<typeof useGetWalkByTreatmentLazyQuery>;
export type GetWalkByTreatmentSuspenseQueryHookResult = ReturnType<typeof useGetWalkByTreatmentSuspenseQuery>;
export type GetWalkByTreatmentQueryResult = Apollo.QueryResult<GetWalkByTreatmentQuery, GetWalkByTreatmentQueryVariables>;
export const GetUserDashboardDocument = gql`
    query getUserDashboard($date_from: String!, $date_to: String!) {
  getUserDashboard {
    dashboard {
      ownerships {
        items {
          id
          custody_level
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
          ...MinReport
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
    ${DashboardPetFragmentDoc}
${MinReportFragmentDoc}`;

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
export function useGetUserDashboardQuery(baseOptions: Apollo.QueryHookOptions<GetUserDashboardQuery, GetUserDashboardQueryVariables> & ({ variables: GetUserDashboardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserDashboardQuery, GetUserDashboardQueryVariables>(GetUserDashboardDocument, options);
      }
export function useGetUserDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserDashboardQuery, GetUserDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserDashboardQuery, GetUserDashboardQueryVariables>(GetUserDashboardDocument, options);
        }
export function useGetUserDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUserDashboardQuery, GetUserDashboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUserDashboardQuery, GetUserDashboardQueryVariables>(GetUserDashboardDocument, options);
        }
export type GetUserDashboardQueryHookResult = ReturnType<typeof useGetUserDashboardQuery>;
export type GetUserDashboardLazyQueryHookResult = ReturnType<typeof useGetUserDashboardLazyQuery>;
export type GetUserDashboardSuspenseQueryHookResult = ReturnType<typeof useGetUserDashboardSuspenseQuery>;
export type GetUserDashboardQueryResult = Apollo.QueryResult<GetUserDashboardQuery, GetUserDashboardQueryVariables>;
export const GetOrCreateDocument = gql`
    query getOrCreate($ref_id: String!, $ref_table: String!, $code: String) {
  getOrCreateCode(ref_id: $ref_id, ref_table: $ref_table, code: $code) {
    error {
      code
      message
    }
    success
    code {
      id
      code
      ref_id
      ref_table
    }
  }
}
    `;

/**
 * __useGetOrCreateQuery__
 *
 * To run a query within a React component, call `useGetOrCreateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrCreateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrCreateQuery({
 *   variables: {
 *      ref_id: // value for 'ref_id'
 *      ref_table: // value for 'ref_table'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useGetOrCreateQuery(baseOptions: Apollo.QueryHookOptions<GetOrCreateQuery, GetOrCreateQueryVariables> & ({ variables: GetOrCreateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrCreateQuery, GetOrCreateQueryVariables>(GetOrCreateDocument, options);
      }
export function useGetOrCreateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrCreateQuery, GetOrCreateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrCreateQuery, GetOrCreateQueryVariables>(GetOrCreateDocument, options);
        }
export function useGetOrCreateSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrCreateQuery, GetOrCreateQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrCreateQuery, GetOrCreateQueryVariables>(GetOrCreateDocument, options);
        }
export type GetOrCreateQueryHookResult = ReturnType<typeof useGetOrCreateQuery>;
export type GetOrCreateLazyQueryHookResult = ReturnType<typeof useGetOrCreateLazyQuery>;
export type GetOrCreateSuspenseQueryHookResult = ReturnType<typeof useGetOrCreateSuspenseQuery>;
export type GetOrCreateQueryResult = Apollo.QueryResult<GetOrCreateQuery, GetOrCreateQueryVariables>;
export const GetPetDocument = gql`
    query getPet($id: ID!) {
  getPet(id: $id) {
    pet {
      ...MinPet
    }
    success
    error {
      code
      message
    }
  }
}
    ${MinPetFragmentDoc}`;

/**
 * __useGetPetQuery__
 *
 * To run a query within a React component, call `useGetPetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPetQuery(baseOptions: Apollo.QueryHookOptions<GetPetQuery, GetPetQueryVariables> & ({ variables: GetPetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPetQuery, GetPetQueryVariables>(GetPetDocument, options);
      }
export function useGetPetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPetQuery, GetPetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPetQuery, GetPetQueryVariables>(GetPetDocument, options);
        }
export function useGetPetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPetQuery, GetPetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPetQuery, GetPetQueryVariables>(GetPetDocument, options);
        }
export type GetPetQueryHookResult = ReturnType<typeof useGetPetQuery>;
export type GetPetLazyQueryHookResult = ReturnType<typeof useGetPetLazyQuery>;
export type GetPetSuspenseQueryHookResult = ReturnType<typeof useGetPetSuspenseQuery>;
export type GetPetQueryResult = Apollo.QueryResult<GetPetQuery, GetPetQueryVariables>;
export const DismissNotificationDocument = gql`
    mutation dismissNotification($id: ID!) {
  dismissNotification(id: $id) {
    success
    error {
      code
      message
    }
    notification {
      ...MinNotification
    }
  }
}
    ${MinNotificationFragmentDoc}`;
export type DismissNotificationMutationFn = Apollo.MutationFunction<DismissNotificationMutation, DismissNotificationMutationVariables>;

/**
 * __useDismissNotificationMutation__
 *
 * To run a mutation, you first call `useDismissNotificationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissNotificationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissNotificationMutation, { data, loading, error }] = useDismissNotificationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDismissNotificationMutation(baseOptions?: Apollo.MutationHookOptions<DismissNotificationMutation, DismissNotificationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissNotificationMutation, DismissNotificationMutationVariables>(DismissNotificationDocument, options);
      }
export type DismissNotificationMutationHookResult = ReturnType<typeof useDismissNotificationMutation>;
export type DismissNotificationMutationResult = Apollo.MutationResult<DismissNotificationMutation>;
export type DismissNotificationMutationOptions = Apollo.BaseMutationOptions<DismissNotificationMutation, DismissNotificationMutationVariables>;
export const MarkAllNotificationsAsReadDocument = gql`
    mutation markAllNotificationsAsRead {
  markAllNotificationsAsRead {
    success
    error {
      code
      message
    }
  }
}
    `;
export type MarkAllNotificationsAsReadMutationFn = Apollo.MutationFunction<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;

/**
 * __useMarkAllNotificationsAsReadMutation__
 *
 * To run a mutation, you first call `useMarkAllNotificationsAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkAllNotificationsAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markAllNotificationsAsReadMutation, { data, loading, error }] = useMarkAllNotificationsAsReadMutation({
 *   variables: {
 *   },
 * });
 */
export function useMarkAllNotificationsAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>(MarkAllNotificationsAsReadDocument, options);
      }
export type MarkAllNotificationsAsReadMutationHookResult = ReturnType<typeof useMarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationResult = Apollo.MutationResult<MarkAllNotificationsAsReadMutation>;
export type MarkAllNotificationsAsReadMutationOptions = Apollo.BaseMutationOptions<MarkAllNotificationsAsReadMutation, MarkAllNotificationsAsReadMutationVariables>;
export const MarkNotificationAsReadDocument = gql`
    mutation markNotificationAsRead($id: ID!) {
  markNotificationAsRead(id: $id) {
    success
    error {
      code
      message
    }
    notification {
      ...MinNotification
    }
  }
}
    ${MinNotificationFragmentDoc}`;
export type MarkNotificationAsReadMutationFn = Apollo.MutationFunction<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;

/**
 * __useMarkNotificationAsReadMutation__
 *
 * To run a mutation, you first call `useMarkNotificationAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkNotificationAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markNotificationAsReadMutation, { data, loading, error }] = useMarkNotificationAsReadMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkNotificationAsReadMutation(baseOptions?: Apollo.MutationHookOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>(MarkNotificationAsReadDocument, options);
      }
export type MarkNotificationAsReadMutationHookResult = ReturnType<typeof useMarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationResult = Apollo.MutationResult<MarkNotificationAsReadMutation>;
export type MarkNotificationAsReadMutationOptions = Apollo.BaseMutationOptions<MarkNotificationAsReadMutation, MarkNotificationAsReadMutationVariables>;
export const AcceptPetOwnershipInviteDocument = gql`
    mutation acceptPetOwnershipInvite($id: ID!) {
  acceptPetOwnershipInvite(id: $id) {
    success
    error {
      code
      message
    }
  }
}
    `;
export type AcceptPetOwnershipInviteMutationFn = Apollo.MutationFunction<AcceptPetOwnershipInviteMutation, AcceptPetOwnershipInviteMutationVariables>;

/**
 * __useAcceptPetOwnershipInviteMutation__
 *
 * To run a mutation, you first call `useAcceptPetOwnershipInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptPetOwnershipInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptPetOwnershipInviteMutation, { data, loading, error }] = useAcceptPetOwnershipInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptPetOwnershipInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptPetOwnershipInviteMutation, AcceptPetOwnershipInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptPetOwnershipInviteMutation, AcceptPetOwnershipInviteMutationVariables>(AcceptPetOwnershipInviteDocument, options);
      }
export type AcceptPetOwnershipInviteMutationHookResult = ReturnType<typeof useAcceptPetOwnershipInviteMutation>;
export type AcceptPetOwnershipInviteMutationResult = Apollo.MutationResult<AcceptPetOwnershipInviteMutation>;
export type AcceptPetOwnershipInviteMutationOptions = Apollo.BaseMutationOptions<AcceptPetOwnershipInviteMutation, AcceptPetOwnershipInviteMutationVariables>;
export const RejectPetOwnershipInviteDocument = gql`
    mutation rejectPetOwnershipInvite($id: ID!) {
  rejectPetOwnershipInvite(id: $id) {
    success
    error {
      code
      message
    }
  }
}
    `;
export type RejectPetOwnershipInviteMutationFn = Apollo.MutationFunction<RejectPetOwnershipInviteMutation, RejectPetOwnershipInviteMutationVariables>;

/**
 * __useRejectPetOwnershipInviteMutation__
 *
 * To run a mutation, you first call `useRejectPetOwnershipInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectPetOwnershipInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectPetOwnershipInviteMutation, { data, loading, error }] = useRejectPetOwnershipInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectPetOwnershipInviteMutation(baseOptions?: Apollo.MutationHookOptions<RejectPetOwnershipInviteMutation, RejectPetOwnershipInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectPetOwnershipInviteMutation, RejectPetOwnershipInviteMutationVariables>(RejectPetOwnershipInviteDocument, options);
      }
export type RejectPetOwnershipInviteMutationHookResult = ReturnType<typeof useRejectPetOwnershipInviteMutation>;
export type RejectPetOwnershipInviteMutationResult = Apollo.MutationResult<RejectPetOwnershipInviteMutation>;
export type RejectPetOwnershipInviteMutationOptions = Apollo.BaseMutationOptions<RejectPetOwnershipInviteMutation, RejectPetOwnershipInviteMutationVariables>;
export const AcceptShelterInviteDocument = gql`
    mutation acceptShelterInvite($id: ID!) {
  acceptShelterInvite(id: $id) {
    success
    error {
      code
      message
    }
  }
}
    `;
export type AcceptShelterInviteMutationFn = Apollo.MutationFunction<AcceptShelterInviteMutation, AcceptShelterInviteMutationVariables>;

/**
 * __useAcceptShelterInviteMutation__
 *
 * To run a mutation, you first call `useAcceptShelterInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptShelterInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptShelterInviteMutation, { data, loading, error }] = useAcceptShelterInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptShelterInviteMutation(baseOptions?: Apollo.MutationHookOptions<AcceptShelterInviteMutation, AcceptShelterInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptShelterInviteMutation, AcceptShelterInviteMutationVariables>(AcceptShelterInviteDocument, options);
      }
export type AcceptShelterInviteMutationHookResult = ReturnType<typeof useAcceptShelterInviteMutation>;
export type AcceptShelterInviteMutationResult = Apollo.MutationResult<AcceptShelterInviteMutation>;
export type AcceptShelterInviteMutationOptions = Apollo.BaseMutationOptions<AcceptShelterInviteMutation, AcceptShelterInviteMutationVariables>;
export const RejectShelterInviteDocument = gql`
    mutation rejectShelterInvite($id: ID!) {
  rejectShelterInvite(id: $id) {
    success
    error {
      code
      message
    }
  }
}
    `;
export type RejectShelterInviteMutationFn = Apollo.MutationFunction<RejectShelterInviteMutation, RejectShelterInviteMutationVariables>;

/**
 * __useRejectShelterInviteMutation__
 *
 * To run a mutation, you first call `useRejectShelterInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectShelterInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectShelterInviteMutation, { data, loading, error }] = useRejectShelterInviteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectShelterInviteMutation(baseOptions?: Apollo.MutationHookOptions<RejectShelterInviteMutation, RejectShelterInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectShelterInviteMutation, RejectShelterInviteMutationVariables>(RejectShelterInviteDocument, options);
      }
export type RejectShelterInviteMutationHookResult = ReturnType<typeof useRejectShelterInviteMutation>;
export type RejectShelterInviteMutationResult = Apollo.MutationResult<RejectShelterInviteMutation>;
export type RejectShelterInviteMutationOptions = Apollo.BaseMutationOptions<RejectShelterInviteMutation, RejectShelterInviteMutationVariables>;
export const AcceptShelterOwnershipTransferDocument = gql`
    mutation acceptShelterOwnershipTransfer($id: ID!) {
  acceptShelterOwnershipTransfer(id: $id) {
    success
    error {
      code
      message
    }
  }
}
    `;
export type AcceptShelterOwnershipTransferMutationFn = Apollo.MutationFunction<AcceptShelterOwnershipTransferMutation, AcceptShelterOwnershipTransferMutationVariables>;

/**
 * __useAcceptShelterOwnershipTransferMutation__
 *
 * To run a mutation, you first call `useAcceptShelterOwnershipTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptShelterOwnershipTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptShelterOwnershipTransferMutation, { data, loading, error }] = useAcceptShelterOwnershipTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAcceptShelterOwnershipTransferMutation(baseOptions?: Apollo.MutationHookOptions<AcceptShelterOwnershipTransferMutation, AcceptShelterOwnershipTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptShelterOwnershipTransferMutation, AcceptShelterOwnershipTransferMutationVariables>(AcceptShelterOwnershipTransferDocument, options);
      }
export type AcceptShelterOwnershipTransferMutationHookResult = ReturnType<typeof useAcceptShelterOwnershipTransferMutation>;
export type AcceptShelterOwnershipTransferMutationResult = Apollo.MutationResult<AcceptShelterOwnershipTransferMutation>;
export type AcceptShelterOwnershipTransferMutationOptions = Apollo.BaseMutationOptions<AcceptShelterOwnershipTransferMutation, AcceptShelterOwnershipTransferMutationVariables>;
export const RejectShelterOwnershipTransferDocument = gql`
    mutation rejectShelterOwnershipTransfer($id: ID!) {
  rejectShelterOwnershipTransfer(id: $id) {
    success
    error {
      code
      message
    }
  }
}
    `;
export type RejectShelterOwnershipTransferMutationFn = Apollo.MutationFunction<RejectShelterOwnershipTransferMutation, RejectShelterOwnershipTransferMutationVariables>;

/**
 * __useRejectShelterOwnershipTransferMutation__
 *
 * To run a mutation, you first call `useRejectShelterOwnershipTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectShelterOwnershipTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectShelterOwnershipTransferMutation, { data, loading, error }] = useRejectShelterOwnershipTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRejectShelterOwnershipTransferMutation(baseOptions?: Apollo.MutationHookOptions<RejectShelterOwnershipTransferMutation, RejectShelterOwnershipTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RejectShelterOwnershipTransferMutation, RejectShelterOwnershipTransferMutationVariables>(RejectShelterOwnershipTransferDocument, options);
      }
export type RejectShelterOwnershipTransferMutationHookResult = ReturnType<typeof useRejectShelterOwnershipTransferMutation>;
export type RejectShelterOwnershipTransferMutationResult = Apollo.MutationResult<RejectShelterOwnershipTransferMutation>;
export type RejectShelterOwnershipTransferMutationOptions = Apollo.BaseMutationOptions<RejectShelterOwnershipTransferMutation, RejectShelterOwnershipTransferMutationVariables>;
export const GetUnreadNotificationCountDocument = gql`
    query getUnreadNotificationCount {
  getUnreadNotificationCount
}
    `;

/**
 * __useGetUnreadNotificationCountQuery__
 *
 * To run a query within a React component, call `useGetUnreadNotificationCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnreadNotificationCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnreadNotificationCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUnreadNotificationCountQuery(baseOptions?: Apollo.QueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>(GetUnreadNotificationCountDocument, options);
      }
export function useGetUnreadNotificationCountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>(GetUnreadNotificationCountDocument, options);
        }
export function useGetUnreadNotificationCountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>(GetUnreadNotificationCountDocument, options);
        }
export type GetUnreadNotificationCountQueryHookResult = ReturnType<typeof useGetUnreadNotificationCountQuery>;
export type GetUnreadNotificationCountLazyQueryHookResult = ReturnType<typeof useGetUnreadNotificationCountLazyQuery>;
export type GetUnreadNotificationCountSuspenseQueryHookResult = ReturnType<typeof useGetUnreadNotificationCountSuspenseQuery>;
export type GetUnreadNotificationCountQueryResult = Apollo.QueryResult<GetUnreadNotificationCountQuery, GetUnreadNotificationCountQueryVariables>;
export const ListMyNotificationsDocument = gql`
    query listMyNotifications($search: CommonSearch) {
  listMyNotifications(search: $search) {
    success
    error {
      code
      message
    }
    items {
      ...MinNotification
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinNotificationFragmentDoc}`;

/**
 * __useListMyNotificationsQuery__
 *
 * To run a query within a React component, call `useListMyNotificationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMyNotificationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMyNotificationsQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListMyNotificationsQuery(baseOptions?: Apollo.QueryHookOptions<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>(ListMyNotificationsDocument, options);
      }
export function useListMyNotificationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>(ListMyNotificationsDocument, options);
        }
export function useListMyNotificationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>(ListMyNotificationsDocument, options);
        }
export type ListMyNotificationsQueryHookResult = ReturnType<typeof useListMyNotificationsQuery>;
export type ListMyNotificationsLazyQueryHookResult = ReturnType<typeof useListMyNotificationsLazyQuery>;
export type ListMyNotificationsSuspenseQueryHookResult = ReturnType<typeof useListMyNotificationsSuspenseQuery>;
export type ListMyNotificationsQueryResult = Apollo.QueryResult<ListMyNotificationsQuery, ListMyNotificationsQueryVariables>;
export const AddPetToMeDocument = gql`
    mutation addPetToMe($data: PetCreate!, $custodyLevel: CustodyLevel) {
  addPetToMe(pet: $data, custodyLevel: $custodyLevel) {
    data {
      pet {
        ...MinPet
      }
    }
  }
}
    ${MinPetFragmentDoc}`;
export type AddPetToMeMutationFn = Apollo.MutationFunction<AddPetToMeMutation, AddPetToMeMutationVariables>;

/**
 * __useAddPetToMeMutation__
 *
 * To run a mutation, you first call `useAddPetToMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddPetToMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addPetToMeMutation, { data, loading, error }] = useAddPetToMeMutation({
 *   variables: {
 *      data: // value for 'data'
 *      custodyLevel: // value for 'custodyLevel'
 *   },
 * });
 */
export function useAddPetToMeMutation(baseOptions?: Apollo.MutationHookOptions<AddPetToMeMutation, AddPetToMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddPetToMeMutation, AddPetToMeMutationVariables>(AddPetToMeDocument, options);
      }
export type AddPetToMeMutationHookResult = ReturnType<typeof useAddPetToMeMutation>;
export type AddPetToMeMutationResult = Apollo.MutationResult<AddPetToMeMutation>;
export type AddPetToMeMutationOptions = Apollo.BaseMutationOptions<AddPetToMeMutation, AddPetToMeMutationVariables>;
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
export const CreatePetWeightDocument = gql`
    mutation createPetWeight($data: PetWeightCreate!) {
  createPetWeight(data: $data) {
    success
    error {
      code
      message
    }
    weight {
      id
      created_at
      weight_kg
    }
  }
}
    `;
export type CreatePetWeightMutationFn = Apollo.MutationFunction<CreatePetWeightMutation, CreatePetWeightMutationVariables>;

/**
 * __useCreatePetWeightMutation__
 *
 * To run a mutation, you first call `useCreatePetWeightMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePetWeightMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPetWeightMutation, { data, loading, error }] = useCreatePetWeightMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePetWeightMutation(baseOptions?: Apollo.MutationHookOptions<CreatePetWeightMutation, CreatePetWeightMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePetWeightMutation, CreatePetWeightMutationVariables>(CreatePetWeightDocument, options);
      }
export type CreatePetWeightMutationHookResult = ReturnType<typeof useCreatePetWeightMutation>;
export type CreatePetWeightMutationResult = Apollo.MutationResult<CreatePetWeightMutation>;
export type CreatePetWeightMutationOptions = Apollo.BaseMutationOptions<CreatePetWeightMutation, CreatePetWeightMutationVariables>;
export const DeleteOwnershipDocument = gql`
    mutation deleteOwnership($id: ID!) {
  deleteOwnership(id: $id) {
    error {
      code
      message
    }
    success
    id
  }
}
    `;
export type DeleteOwnershipMutationFn = Apollo.MutationFunction<DeleteOwnershipMutation, DeleteOwnershipMutationVariables>;

/**
 * __useDeleteOwnershipMutation__
 *
 * To run a mutation, you first call `useDeleteOwnershipMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOwnershipMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOwnershipMutation, { data, loading, error }] = useDeleteOwnershipMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteOwnershipMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOwnershipMutation, DeleteOwnershipMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOwnershipMutation, DeleteOwnershipMutationVariables>(DeleteOwnershipDocument, options);
      }
export type DeleteOwnershipMutationHookResult = ReturnType<typeof useDeleteOwnershipMutation>;
export type DeleteOwnershipMutationResult = Apollo.MutationResult<DeleteOwnershipMutation>;
export type DeleteOwnershipMutationOptions = Apollo.BaseMutationOptions<DeleteOwnershipMutation, DeleteOwnershipMutationVariables>;
export const DeletePetDocument = gql`
    mutation deletePet($id: ID!) {
  deletePet(id: $id) {
    error {
      code
      message
    }
    success
    id
  }
}
    `;
export type DeletePetMutationFn = Apollo.MutationFunction<DeletePetMutation, DeletePetMutationVariables>;

/**
 * __useDeletePetMutation__
 *
 * To run a mutation, you first call `useDeletePetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePetMutation, { data, loading, error }] = useDeletePetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeletePetMutation(baseOptions?: Apollo.MutationHookOptions<DeletePetMutation, DeletePetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePetMutation, DeletePetMutationVariables>(DeletePetDocument, options);
      }
export type DeletePetMutationHookResult = ReturnType<typeof useDeletePetMutation>;
export type DeletePetMutationResult = Apollo.MutationResult<DeletePetMutation>;
export type DeletePetMutationOptions = Apollo.BaseMutationOptions<DeletePetMutation, DeletePetMutationVariables>;
export const LinkPetToMeDocument = gql`
    mutation linkPetToMe($petId: ID!, $custodyLevel: CustodyLevel!) {
  linkPetToMe(petId: $petId, custodyLevel: $custodyLevel) {
    ownership {
      id
      custody_level
      pet {
        ...MinPet
      }
    }
    success
    error {
      message
      code
    }
  }
}
    ${MinPetFragmentDoc}`;
export type LinkPetToMeMutationFn = Apollo.MutationFunction<LinkPetToMeMutation, LinkPetToMeMutationVariables>;

/**
 * __useLinkPetToMeMutation__
 *
 * To run a mutation, you first call `useLinkPetToMeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkPetToMeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkPetToMeMutation, { data, loading, error }] = useLinkPetToMeMutation({
 *   variables: {
 *      petId: // value for 'petId'
 *      custodyLevel: // value for 'custodyLevel'
 *   },
 * });
 */
export function useLinkPetToMeMutation(baseOptions?: Apollo.MutationHookOptions<LinkPetToMeMutation, LinkPetToMeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkPetToMeMutation, LinkPetToMeMutationVariables>(LinkPetToMeDocument, options);
      }
export type LinkPetToMeMutationHookResult = ReturnType<typeof useLinkPetToMeMutation>;
export type LinkPetToMeMutationResult = Apollo.MutationResult<LinkPetToMeMutation>;
export type LinkPetToMeMutationOptions = Apollo.BaseMutationOptions<LinkPetToMeMutation, LinkPetToMeMutationVariables>;
export const UpdatePetDocument = gql`
    mutation updatePet($data: PetUpdate!, $id: ID!) {
  updatePet(data: $data, id: $id) {
    success
    error {
      code
      message
    }
    pet {
      ...MinPet
    }
  }
}
    ${MinPetFragmentDoc}`;
export type UpdatePetMutationFn = Apollo.MutationFunction<UpdatePetMutation, UpdatePetMutationVariables>;

/**
 * __useUpdatePetMutation__
 *
 * To run a mutation, you first call `useUpdatePetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePetMutation, { data, loading, error }] = useUpdatePetMutation({
 *   variables: {
 *      data: // value for 'data'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdatePetMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePetMutation, UpdatePetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePetMutation, UpdatePetMutationVariables>(UpdatePetDocument, options);
      }
export type UpdatePetMutationHookResult = ReturnType<typeof useUpdatePetMutation>;
export type UpdatePetMutationResult = Apollo.MutationResult<UpdatePetMutation>;
export type UpdatePetMutationOptions = Apollo.BaseMutationOptions<UpdatePetMutation, UpdatePetMutationVariables>;
export const GetFullPetDocument = gql`
    query getFullPet($id: ID!, $date_from: String!, $date_to: String!) {
  getPet(id: $id) {
    pet {
      ...MinPet
      pictures(
        commonSearch: {order_by: "created_at", order_direction: "desc", filters: {fixed: [{key: "scope", value: "pet_picture"}]}}
      ) {
        items {
          id
        }
      }
      health_card {
        id
        treatments(
          commonSearch: {order_by: "date", order_direction: "asc", filters: {ranges: [{key: "date", value: {min: $date_from, max: $date_to}}]}}
        ) {
          items {
            ...Appointment
          }
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
    ${MinPetFragmentDoc}
${AppointmentFragmentDoc}`;

/**
 * __useGetFullPetQuery__
 *
 * To run a query within a React component, call `useGetFullPetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFullPetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFullPetQuery({
 *   variables: {
 *      id: // value for 'id'
 *      date_from: // value for 'date_from'
 *      date_to: // value for 'date_to'
 *   },
 * });
 */
export function useGetFullPetQuery(baseOptions: Apollo.QueryHookOptions<GetFullPetQuery, GetFullPetQueryVariables> & ({ variables: GetFullPetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFullPetQuery, GetFullPetQueryVariables>(GetFullPetDocument, options);
      }
export function useGetFullPetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFullPetQuery, GetFullPetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFullPetQuery, GetFullPetQueryVariables>(GetFullPetDocument, options);
        }
export function useGetFullPetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFullPetQuery, GetFullPetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFullPetQuery, GetFullPetQueryVariables>(GetFullPetDocument, options);
        }
export type GetFullPetQueryHookResult = ReturnType<typeof useGetFullPetQuery>;
export type GetFullPetLazyQueryHookResult = ReturnType<typeof useGetFullPetLazyQuery>;
export type GetFullPetSuspenseQueryHookResult = ReturnType<typeof useGetFullPetSuspenseQuery>;
export type GetFullPetQueryResult = Apollo.QueryResult<GetFullPetQuery, GetFullPetQueryVariables>;
export const GetLatestPetWeightDocument = gql`
    query getLatestPetWeight($pet_id: ID!) {
  getLatestPetWeight(pet_id: $pet_id) {
    success
    error {
      code
      message
    }
    weight {
      id
      created_at
      weight_kg
    }
  }
}
    `;

/**
 * __useGetLatestPetWeightQuery__
 *
 * To run a query within a React component, call `useGetLatestPetWeightQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLatestPetWeightQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLatestPetWeightQuery({
 *   variables: {
 *      pet_id: // value for 'pet_id'
 *   },
 * });
 */
export function useGetLatestPetWeightQuery(baseOptions: Apollo.QueryHookOptions<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables> & ({ variables: GetLatestPetWeightQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables>(GetLatestPetWeightDocument, options);
      }
export function useGetLatestPetWeightLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables>(GetLatestPetWeightDocument, options);
        }
export function useGetLatestPetWeightSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables>(GetLatestPetWeightDocument, options);
        }
export type GetLatestPetWeightQueryHookResult = ReturnType<typeof useGetLatestPetWeightQuery>;
export type GetLatestPetWeightLazyQueryHookResult = ReturnType<typeof useGetLatestPetWeightLazyQuery>;
export type GetLatestPetWeightSuspenseQueryHookResult = ReturnType<typeof useGetLatestPetWeightSuspenseQuery>;
export type GetLatestPetWeightQueryResult = Apollo.QueryResult<GetLatestPetWeightQuery, GetLatestPetWeightQueryVariables>;
export const GetPetWalkingStatsDocument = gql`
    query getPetWalkingStats($pet_id: ID!, $period: StatsPeriod!) {
  getPetWalkingStats(pet_id: $pet_id, period: $period) {
    success
    error {
      code
      message
    }
    chart {
      labels
      series {
        type
        data
      }
    }
  }
}
    `;

/**
 * __useGetPetWalkingStatsQuery__
 *
 * To run a query within a React component, call `useGetPetWalkingStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPetWalkingStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPetWalkingStatsQuery({
 *   variables: {
 *      pet_id: // value for 'pet_id'
 *      period: // value for 'period'
 *   },
 * });
 */
export function useGetPetWalkingStatsQuery(baseOptions: Apollo.QueryHookOptions<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables> & ({ variables: GetPetWalkingStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables>(GetPetWalkingStatsDocument, options);
      }
export function useGetPetWalkingStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables>(GetPetWalkingStatsDocument, options);
        }
export function useGetPetWalkingStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables>(GetPetWalkingStatsDocument, options);
        }
export type GetPetWalkingStatsQueryHookResult = ReturnType<typeof useGetPetWalkingStatsQuery>;
export type GetPetWalkingStatsLazyQueryHookResult = ReturnType<typeof useGetPetWalkingStatsLazyQuery>;
export type GetPetWalkingStatsSuspenseQueryHookResult = ReturnType<typeof useGetPetWalkingStatsSuspenseQuery>;
export type GetPetWalkingStatsQueryResult = Apollo.QueryResult<GetPetWalkingStatsQuery, GetPetWalkingStatsQueryVariables>;
export const GetPetWeightStatsDocument = gql`
    query getPetWeightStats($pet_id: ID!, $period: StatsPeriod!) {
  getPetWeightStats(pet_id: $pet_id, period: $period) {
    success
    error {
      code
      message
    }
    chart {
      labels
      data
    }
  }
}
    `;

/**
 * __useGetPetWeightStatsQuery__
 *
 * To run a query within a React component, call `useGetPetWeightStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPetWeightStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPetWeightStatsQuery({
 *   variables: {
 *      pet_id: // value for 'pet_id'
 *      period: // value for 'period'
 *   },
 * });
 */
export function useGetPetWeightStatsQuery(baseOptions: Apollo.QueryHookOptions<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables> & ({ variables: GetPetWeightStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables>(GetPetWeightStatsDocument, options);
      }
export function useGetPetWeightStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables>(GetPetWeightStatsDocument, options);
        }
export function useGetPetWeightStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables>(GetPetWeightStatsDocument, options);
        }
export type GetPetWeightStatsQueryHookResult = ReturnType<typeof useGetPetWeightStatsQuery>;
export type GetPetWeightStatsLazyQueryHookResult = ReturnType<typeof useGetPetWeightStatsLazyQuery>;
export type GetPetWeightStatsSuspenseQueryHookResult = ReturnType<typeof useGetPetWeightStatsSuspenseQuery>;
export type GetPetWeightStatsQueryResult = Apollo.QueryResult<GetPetWeightStatsQuery, GetPetWeightStatsQueryVariables>;
export const ListPetWalkRatingsDocument = gql`
    query listPetWalkRatings($commonSearch: CommonSearch) {
  listWalkRatings(commonSearch: $commonSearch) {
    error {
      code
      message
    }
    items {
      id
      type
      rating
    }
  }
}
    `;

/**
 * __useListPetWalkRatingsQuery__
 *
 * To run a query within a React component, call `useListPetWalkRatingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPetWalkRatingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPetWalkRatingsQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListPetWalkRatingsQuery(baseOptions?: Apollo.QueryHookOptions<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>(ListPetWalkRatingsDocument, options);
      }
export function useListPetWalkRatingsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>(ListPetWalkRatingsDocument, options);
        }
export function useListPetWalkRatingsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>(ListPetWalkRatingsDocument, options);
        }
export type ListPetWalkRatingsQueryHookResult = ReturnType<typeof useListPetWalkRatingsQuery>;
export type ListPetWalkRatingsLazyQueryHookResult = ReturnType<typeof useListPetWalkRatingsLazyQuery>;
export type ListPetWalkRatingsSuspenseQueryHookResult = ReturnType<typeof useListPetWalkRatingsSuspenseQuery>;
export type ListPetWalkRatingsQueryResult = Apollo.QueryResult<ListPetWalkRatingsQuery, ListPetWalkRatingsQueryVariables>;
export const AssignPetToBoxDocument = gql`
    mutation assignPetToBox($box_id: ID!, $shelter_pet_id: ID!, $reason: String) {
  assignPetToBox(
    box_id: $box_id
    shelter_pet_id: $shelter_pet_id
    reason: $reason
  ) {
    success
    error {
      code
      message
    }
    occupancy {
      id
    }
  }
}
    `;
export type AssignPetToBoxMutationFn = Apollo.MutationFunction<AssignPetToBoxMutation, AssignPetToBoxMutationVariables>;

/**
 * __useAssignPetToBoxMutation__
 *
 * To run a mutation, you first call `useAssignPetToBoxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignPetToBoxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignPetToBoxMutation, { data, loading, error }] = useAssignPetToBoxMutation({
 *   variables: {
 *      box_id: // value for 'box_id'
 *      shelter_pet_id: // value for 'shelter_pet_id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useAssignPetToBoxMutation(baseOptions?: Apollo.MutationHookOptions<AssignPetToBoxMutation, AssignPetToBoxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AssignPetToBoxMutation, AssignPetToBoxMutationVariables>(AssignPetToBoxDocument, options);
      }
export type AssignPetToBoxMutationHookResult = ReturnType<typeof useAssignPetToBoxMutation>;
export type AssignPetToBoxMutationResult = Apollo.MutationResult<AssignPetToBoxMutation>;
export type AssignPetToBoxMutationOptions = Apollo.BaseMutationOptions<AssignPetToBoxMutation, AssignPetToBoxMutationVariables>;
export const CancelShelterWalkDocument = gql`
    mutation cancelShelterWalk($id: ID!, $reason: String) {
  cancelShelterWalk(id: $id, reason: $reason) {
    success
    error {
      code
      message
    }
    shelter_walk {
      ...MinShelterWalk
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;
export type CancelShelterWalkMutationFn = Apollo.MutationFunction<CancelShelterWalkMutation, CancelShelterWalkMutationVariables>;

/**
 * __useCancelShelterWalkMutation__
 *
 * To run a mutation, you first call `useCancelShelterWalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelShelterWalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelShelterWalkMutation, { data, loading, error }] = useCancelShelterWalkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useCancelShelterWalkMutation(baseOptions?: Apollo.MutationHookOptions<CancelShelterWalkMutation, CancelShelterWalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelShelterWalkMutation, CancelShelterWalkMutationVariables>(CancelShelterWalkDocument, options);
      }
export type CancelShelterWalkMutationHookResult = ReturnType<typeof useCancelShelterWalkMutation>;
export type CancelShelterWalkMutationResult = Apollo.MutationResult<CancelShelterWalkMutation>;
export type CancelShelterWalkMutationOptions = Apollo.BaseMutationOptions<CancelShelterWalkMutation, CancelShelterWalkMutationVariables>;
export const CompleteShelterTaskDocument = gql`
    mutation completeShelterTask($id: ID!, $notes: String) {
  completeShelterTask(id: $id, notes: $notes) {
    success
    error {
      code
      message
    }
    shelter_task {
      ...MinShelterTask
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;
export type CompleteShelterTaskMutationFn = Apollo.MutationFunction<CompleteShelterTaskMutation, CompleteShelterTaskMutationVariables>;

/**
 * __useCompleteShelterTaskMutation__
 *
 * To run a mutation, you first call `useCompleteShelterTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteShelterTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeShelterTaskMutation, { data, loading, error }] = useCompleteShelterTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      notes: // value for 'notes'
 *   },
 * });
 */
export function useCompleteShelterTaskMutation(baseOptions?: Apollo.MutationHookOptions<CompleteShelterTaskMutation, CompleteShelterTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteShelterTaskMutation, CompleteShelterTaskMutationVariables>(CompleteShelterTaskDocument, options);
      }
export type CompleteShelterTaskMutationHookResult = ReturnType<typeof useCompleteShelterTaskMutation>;
export type CompleteShelterTaskMutationResult = Apollo.MutationResult<CompleteShelterTaskMutation>;
export type CompleteShelterTaskMutationOptions = Apollo.BaseMutationOptions<CompleteShelterTaskMutation, CompleteShelterTaskMutationVariables>;
export const CompleteShelterWalkDocument = gql`
    mutation completeShelterWalk($id: ID!, $notes: String) {
  completeShelterWalk(id: $id, notes: $notes) {
    success
    error {
      code
      message
    }
    shelter_walk {
      ...MinShelterWalk
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;
export type CompleteShelterWalkMutationFn = Apollo.MutationFunction<CompleteShelterWalkMutation, CompleteShelterWalkMutationVariables>;

/**
 * __useCompleteShelterWalkMutation__
 *
 * To run a mutation, you first call `useCompleteShelterWalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompleteShelterWalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [completeShelterWalkMutation, { data, loading, error }] = useCompleteShelterWalkMutation({
 *   variables: {
 *      id: // value for 'id'
 *      notes: // value for 'notes'
 *   },
 * });
 */
export function useCompleteShelterWalkMutation(baseOptions?: Apollo.MutationHookOptions<CompleteShelterWalkMutation, CompleteShelterWalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CompleteShelterWalkMutation, CompleteShelterWalkMutationVariables>(CompleteShelterWalkDocument, options);
      }
export type CompleteShelterWalkMutationHookResult = ReturnType<typeof useCompleteShelterWalkMutation>;
export type CompleteShelterWalkMutationResult = Apollo.MutationResult<CompleteShelterWalkMutation>;
export type CompleteShelterWalkMutationOptions = Apollo.BaseMutationOptions<CompleteShelterWalkMutation, CompleteShelterWalkMutationVariables>;
export const CreatePersonalWorkspaceDocument = gql`
    mutation createPersonalWorkspace($data: CreatePersonalWorkspaceInput!) {
  createPersonalWorkspace(data: $data) {
    success
    error {
      code
      message
    }
    shelter {
      ...MinShelter
    }
  }
}
    ${MinShelterFragmentDoc}`;
export type CreatePersonalWorkspaceMutationFn = Apollo.MutationFunction<CreatePersonalWorkspaceMutation, CreatePersonalWorkspaceMutationVariables>;

/**
 * __useCreatePersonalWorkspaceMutation__
 *
 * To run a mutation, you first call `useCreatePersonalWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePersonalWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPersonalWorkspaceMutation, { data, loading, error }] = useCreatePersonalWorkspaceMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePersonalWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<CreatePersonalWorkspaceMutation, CreatePersonalWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePersonalWorkspaceMutation, CreatePersonalWorkspaceMutationVariables>(CreatePersonalWorkspaceDocument, options);
      }
export type CreatePersonalWorkspaceMutationHookResult = ReturnType<typeof useCreatePersonalWorkspaceMutation>;
export type CreatePersonalWorkspaceMutationResult = Apollo.MutationResult<CreatePersonalWorkspaceMutation>;
export type CreatePersonalWorkspaceMutationOptions = Apollo.BaseMutationOptions<CreatePersonalWorkspaceMutation, CreatePersonalWorkspaceMutationVariables>;
export const CreatePetDocument = gql`
    mutation createPet($data: PetCreate!) {
  createPet(data: $data) {
    success
    error {
      code
      message
    }
    pet {
      id
      name
    }
  }
}
    `;
export type CreatePetMutationFn = Apollo.MutationFunction<CreatePetMutation, CreatePetMutationVariables>;

/**
 * __useCreatePetMutation__
 *
 * To run a mutation, you first call `useCreatePetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPetMutation, { data, loading, error }] = useCreatePetMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePetMutation(baseOptions?: Apollo.MutationHookOptions<CreatePetMutation, CreatePetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePetMutation, CreatePetMutationVariables>(CreatePetDocument, options);
      }
export type CreatePetMutationHookResult = ReturnType<typeof useCreatePetMutation>;
export type CreatePetMutationResult = Apollo.MutationResult<CreatePetMutation>;
export type CreatePetMutationOptions = Apollo.BaseMutationOptions<CreatePetMutation, CreatePetMutationVariables>;
export const CreateShelterInventoryItemDocument = gql`
    mutation createShelterInventoryItem($data: ShelterInventoryItemCreate!) {
  createShelterInventoryItem(data: $data) {
    success
    error {
      code
      message
    }
    item {
      ...MinInventoryItem
    }
  }
}
    ${MinInventoryItemFragmentDoc}`;
export type CreateShelterInventoryItemMutationFn = Apollo.MutationFunction<CreateShelterInventoryItemMutation, CreateShelterInventoryItemMutationVariables>;

/**
 * __useCreateShelterInventoryItemMutation__
 *
 * To run a mutation, you first call `useCreateShelterInventoryItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterInventoryItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterInventoryItemMutation, { data, loading, error }] = useCreateShelterInventoryItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterInventoryItemMutation, CreateShelterInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterInventoryItemMutation, CreateShelterInventoryItemMutationVariables>(CreateShelterInventoryItemDocument, options);
      }
export type CreateShelterInventoryItemMutationHookResult = ReturnType<typeof useCreateShelterInventoryItemMutation>;
export type CreateShelterInventoryItemMutationResult = Apollo.MutationResult<CreateShelterInventoryItemMutation>;
export type CreateShelterInventoryItemMutationOptions = Apollo.BaseMutationOptions<CreateShelterInventoryItemMutation, CreateShelterInventoryItemMutationVariables>;
export const CreateShelterInventoryMovementDocument = gql`
    mutation createShelterInventoryMovement($data: ShelterInventoryMovementCreate!) {
  createShelterInventoryMovement(data: $data) {
    success
    error {
      code
      message
    }
    movement {
      id
      movement_type
      quantity
    }
  }
}
    `;
export type CreateShelterInventoryMovementMutationFn = Apollo.MutationFunction<CreateShelterInventoryMovementMutation, CreateShelterInventoryMovementMutationVariables>;

/**
 * __useCreateShelterInventoryMovementMutation__
 *
 * To run a mutation, you first call `useCreateShelterInventoryMovementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterInventoryMovementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterInventoryMovementMutation, { data, loading, error }] = useCreateShelterInventoryMovementMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterInventoryMovementMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterInventoryMovementMutation, CreateShelterInventoryMovementMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterInventoryMovementMutation, CreateShelterInventoryMovementMutationVariables>(CreateShelterInventoryMovementDocument, options);
      }
export type CreateShelterInventoryMovementMutationHookResult = ReturnType<typeof useCreateShelterInventoryMovementMutation>;
export type CreateShelterInventoryMovementMutationResult = Apollo.MutationResult<CreateShelterInventoryMovementMutation>;
export type CreateShelterInventoryMovementMutationOptions = Apollo.BaseMutationOptions<CreateShelterInventoryMovementMutation, CreateShelterInventoryMovementMutationVariables>;
export const CreateShelterInviteDocument = gql`
    mutation createShelterInvite($data: ShelterInviteCreate!) {
  createShelterInvite(data: $data) {
    success
    error {
      code
      message
    }
    shelter_invite {
      id
      status
      role
    }
  }
}
    `;
export type CreateShelterInviteMutationFn = Apollo.MutationFunction<CreateShelterInviteMutation, CreateShelterInviteMutationVariables>;

/**
 * __useCreateShelterInviteMutation__
 *
 * To run a mutation, you first call `useCreateShelterInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterInviteMutation, { data, loading, error }] = useCreateShelterInviteMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterInviteMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterInviteMutation, CreateShelterInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterInviteMutation, CreateShelterInviteMutationVariables>(CreateShelterInviteDocument, options);
      }
export type CreateShelterInviteMutationHookResult = ReturnType<typeof useCreateShelterInviteMutation>;
export type CreateShelterInviteMutationResult = Apollo.MutationResult<CreateShelterInviteMutation>;
export type CreateShelterInviteMutationOptions = Apollo.BaseMutationOptions<CreateShelterInviteMutation, CreateShelterInviteMutationVariables>;
export const CreateShelterMapDocument = gql`
    mutation createShelterMap($data: ShelterMapCreate!) {
  createShelterMap(data: $data) {
    success
    error {
      code
      message
    }
    map {
      ...FullShelterMap
    }
  }
}
    ${FullShelterMapFragmentDoc}`;
export type CreateShelterMapMutationFn = Apollo.MutationFunction<CreateShelterMapMutation, CreateShelterMapMutationVariables>;

/**
 * __useCreateShelterMapMutation__
 *
 * To run a mutation, you first call `useCreateShelterMapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterMapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterMapMutation, { data, loading, error }] = useCreateShelterMapMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterMapMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterMapMutation, CreateShelterMapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterMapMutation, CreateShelterMapMutationVariables>(CreateShelterMapDocument, options);
      }
export type CreateShelterMapMutationHookResult = ReturnType<typeof useCreateShelterMapMutation>;
export type CreateShelterMapMutationResult = Apollo.MutationResult<CreateShelterMapMutation>;
export type CreateShelterMapMutationOptions = Apollo.BaseMutationOptions<CreateShelterMapMutation, CreateShelterMapMutationVariables>;
export const CreateShelterPetDocument = gql`
    mutation createShelterPet($data: ShelterPetCreate!) {
  createShelterPet(data: $data) {
    success
    error {
      code
      message
    }
    shelter_pet {
      id
      pet {
        id
        name
      }
    }
  }
}
    `;
export type CreateShelterPetMutationFn = Apollo.MutationFunction<CreateShelterPetMutation, CreateShelterPetMutationVariables>;

/**
 * __useCreateShelterPetMutation__
 *
 * To run a mutation, you first call `useCreateShelterPetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterPetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterPetMutation, { data, loading, error }] = useCreateShelterPetMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterPetMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterPetMutation, CreateShelterPetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterPetMutation, CreateShelterPetMutationVariables>(CreateShelterPetDocument, options);
      }
export type CreateShelterPetMutationHookResult = ReturnType<typeof useCreateShelterPetMutation>;
export type CreateShelterPetMutationResult = Apollo.MutationResult<CreateShelterPetMutation>;
export type CreateShelterPetMutationOptions = Apollo.BaseMutationOptions<CreateShelterPetMutation, CreateShelterPetMutationVariables>;
export const CreateShelterTaskDocument = gql`
    mutation createShelterTask($data: ShelterTaskCreate!) {
  createShelterTask(data: $data) {
    success
    error {
      code
      message
    }
    shelter_task {
      ...MinShelterTask
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;
export type CreateShelterTaskMutationFn = Apollo.MutationFunction<CreateShelterTaskMutation, CreateShelterTaskMutationVariables>;

/**
 * __useCreateShelterTaskMutation__
 *
 * To run a mutation, you first call `useCreateShelterTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterTaskMutation, { data, loading, error }] = useCreateShelterTaskMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterTaskMutation, CreateShelterTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterTaskMutation, CreateShelterTaskMutationVariables>(CreateShelterTaskDocument, options);
      }
export type CreateShelterTaskMutationHookResult = ReturnType<typeof useCreateShelterTaskMutation>;
export type CreateShelterTaskMutationResult = Apollo.MutationResult<CreateShelterTaskMutation>;
export type CreateShelterTaskMutationOptions = Apollo.BaseMutationOptions<CreateShelterTaskMutation, CreateShelterTaskMutationVariables>;
export const CreateShelterWalkDocument = gql`
    mutation createShelterWalk($data: ShelterWalkCreate!) {
  createShelterWalk(data: $data) {
    success
    error {
      code
      message
    }
    shelter_walk {
      ...MinShelterWalk
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;
export type CreateShelterWalkMutationFn = Apollo.MutationFunction<CreateShelterWalkMutation, CreateShelterWalkMutationVariables>;

/**
 * __useCreateShelterWalkMutation__
 *
 * To run a mutation, you first call `useCreateShelterWalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterWalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterWalkMutation, { data, loading, error }] = useCreateShelterWalkMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterWalkMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterWalkMutation, CreateShelterWalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterWalkMutation, CreateShelterWalkMutationVariables>(CreateShelterWalkDocument, options);
      }
export type CreateShelterWalkMutationHookResult = ReturnType<typeof useCreateShelterWalkMutation>;
export type CreateShelterWalkMutationResult = Apollo.MutationResult<CreateShelterWalkMutation>;
export type CreateShelterWalkMutationOptions = Apollo.BaseMutationOptions<CreateShelterWalkMutation, CreateShelterWalkMutationVariables>;
export const CreateShelterWalkRatingDocument = gql`
    mutation createShelterWalkRating($data: ShelterWalkRatingCreate!) {
  createShelterWalkRating(data: $data) {
    success
    error {
      code
      message
    }
    walk_rating {
      id
      type
      rating
    }
  }
}
    `;
export type CreateShelterWalkRatingMutationFn = Apollo.MutationFunction<CreateShelterWalkRatingMutation, CreateShelterWalkRatingMutationVariables>;

/**
 * __useCreateShelterWalkRatingMutation__
 *
 * To run a mutation, you first call `useCreateShelterWalkRatingMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterWalkRatingMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterWalkRatingMutation, { data, loading, error }] = useCreateShelterWalkRatingMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterWalkRatingMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterWalkRatingMutation, CreateShelterWalkRatingMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterWalkRatingMutation, CreateShelterWalkRatingMutationVariables>(CreateShelterWalkRatingDocument, options);
      }
export type CreateShelterWalkRatingMutationHookResult = ReturnType<typeof useCreateShelterWalkRatingMutation>;
export type CreateShelterWalkRatingMutationResult = Apollo.MutationResult<CreateShelterWalkRatingMutation>;
export type CreateShelterWalkRatingMutationOptions = Apollo.BaseMutationOptions<CreateShelterWalkRatingMutation, CreateShelterWalkRatingMutationVariables>;
export const DeleteShelterInventoryItemDocument = gql`
    mutation deleteShelterInventoryItem($id: ID!) {
  deleteShelterInventoryItem(id: $id) {
    success
    id
    error {
      code
      message
    }
  }
}
    `;
export type DeleteShelterInventoryItemMutationFn = Apollo.MutationFunction<DeleteShelterInventoryItemMutation, DeleteShelterInventoryItemMutationVariables>;

/**
 * __useDeleteShelterInventoryItemMutation__
 *
 * To run a mutation, you first call `useDeleteShelterInventoryItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShelterInventoryItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShelterInventoryItemMutation, { data, loading, error }] = useDeleteShelterInventoryItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShelterInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShelterInventoryItemMutation, DeleteShelterInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShelterInventoryItemMutation, DeleteShelterInventoryItemMutationVariables>(DeleteShelterInventoryItemDocument, options);
      }
export type DeleteShelterInventoryItemMutationHookResult = ReturnType<typeof useDeleteShelterInventoryItemMutation>;
export type DeleteShelterInventoryItemMutationResult = Apollo.MutationResult<DeleteShelterInventoryItemMutation>;
export type DeleteShelterInventoryItemMutationOptions = Apollo.BaseMutationOptions<DeleteShelterInventoryItemMutation, DeleteShelterInventoryItemMutationVariables>;
export const DeleteShelterRoleDocument = gql`
    mutation deleteShelterRole($id: ID!) {
  deleteShelterRole(id: $id) {
    success
    id
    error {
      code
      message
    }
  }
}
    `;
export type DeleteShelterRoleMutationFn = Apollo.MutationFunction<DeleteShelterRoleMutation, DeleteShelterRoleMutationVariables>;

/**
 * __useDeleteShelterRoleMutation__
 *
 * To run a mutation, you first call `useDeleteShelterRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShelterRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShelterRoleMutation, { data, loading, error }] = useDeleteShelterRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShelterRoleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShelterRoleMutation, DeleteShelterRoleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShelterRoleMutation, DeleteShelterRoleMutationVariables>(DeleteShelterRoleDocument, options);
      }
export type DeleteShelterRoleMutationHookResult = ReturnType<typeof useDeleteShelterRoleMutation>;
export type DeleteShelterRoleMutationResult = Apollo.MutationResult<DeleteShelterRoleMutation>;
export type DeleteShelterRoleMutationOptions = Apollo.BaseMutationOptions<DeleteShelterRoleMutation, DeleteShelterRoleMutationVariables>;
export const DeleteShelterTaskDocument = gql`
    mutation deleteShelterTask($id: ID!) {
  deleteShelterTask(id: $id) {
    success
    id
    error {
      code
      message
    }
  }
}
    `;
export type DeleteShelterTaskMutationFn = Apollo.MutationFunction<DeleteShelterTaskMutation, DeleteShelterTaskMutationVariables>;

/**
 * __useDeleteShelterTaskMutation__
 *
 * To run a mutation, you first call `useDeleteShelterTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShelterTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShelterTaskMutation, { data, loading, error }] = useDeleteShelterTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShelterTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShelterTaskMutation, DeleteShelterTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShelterTaskMutation, DeleteShelterTaskMutationVariables>(DeleteShelterTaskDocument, options);
      }
export type DeleteShelterTaskMutationHookResult = ReturnType<typeof useDeleteShelterTaskMutation>;
export type DeleteShelterTaskMutationResult = Apollo.MutationResult<DeleteShelterTaskMutation>;
export type DeleteShelterTaskMutationOptions = Apollo.BaseMutationOptions<DeleteShelterTaskMutation, DeleteShelterTaskMutationVariables>;
export const DeleteShelterWalkDocument = gql`
    mutation deleteShelterWalk($id: ID!) {
  deleteShelterWalk(id: $id) {
    success
    id
    error {
      code
      message
    }
  }
}
    `;
export type DeleteShelterWalkMutationFn = Apollo.MutationFunction<DeleteShelterWalkMutation, DeleteShelterWalkMutationVariables>;

/**
 * __useDeleteShelterWalkMutation__
 *
 * To run a mutation, you first call `useDeleteShelterWalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteShelterWalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteShelterWalkMutation, { data, loading, error }] = useDeleteShelterWalkMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteShelterWalkMutation(baseOptions?: Apollo.MutationHookOptions<DeleteShelterWalkMutation, DeleteShelterWalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteShelterWalkMutation, DeleteShelterWalkMutationVariables>(DeleteShelterWalkDocument, options);
      }
export type DeleteShelterWalkMutationHookResult = ReturnType<typeof useDeleteShelterWalkMutation>;
export type DeleteShelterWalkMutationResult = Apollo.MutationResult<DeleteShelterWalkMutation>;
export type DeleteShelterWalkMutationOptions = Apollo.BaseMutationOptions<DeleteShelterWalkMutation, DeleteShelterWalkMutationVariables>;
export const MovePetBetweenBoxesDocument = gql`
    mutation movePetBetweenBoxes($shelter_pet_id: ID!, $to_box_id: ID!, $reason: String) {
  movePetBetweenBoxes(
    shelter_pet_id: $shelter_pet_id
    to_box_id: $to_box_id
    reason: $reason
  ) {
    success
    error {
      code
      message
    }
    occupancy {
      id
    }
  }
}
    `;
export type MovePetBetweenBoxesMutationFn = Apollo.MutationFunction<MovePetBetweenBoxesMutation, MovePetBetweenBoxesMutationVariables>;

/**
 * __useMovePetBetweenBoxesMutation__
 *
 * To run a mutation, you first call `useMovePetBetweenBoxesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMovePetBetweenBoxesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [movePetBetweenBoxesMutation, { data, loading, error }] = useMovePetBetweenBoxesMutation({
 *   variables: {
 *      shelter_pet_id: // value for 'shelter_pet_id'
 *      to_box_id: // value for 'to_box_id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useMovePetBetweenBoxesMutation(baseOptions?: Apollo.MutationHookOptions<MovePetBetweenBoxesMutation, MovePetBetweenBoxesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MovePetBetweenBoxesMutation, MovePetBetweenBoxesMutationVariables>(MovePetBetweenBoxesDocument, options);
      }
export type MovePetBetweenBoxesMutationHookResult = ReturnType<typeof useMovePetBetweenBoxesMutation>;
export type MovePetBetweenBoxesMutationResult = Apollo.MutationResult<MovePetBetweenBoxesMutation>;
export type MovePetBetweenBoxesMutationOptions = Apollo.BaseMutationOptions<MovePetBetweenBoxesMutation, MovePetBetweenBoxesMutationVariables>;
export const ReleasePetFromBoxDocument = gql`
    mutation releasePetFromBox($occupancy_id: ID!, $reason: String) {
  releasePetFromBox(occupancy_id: $occupancy_id, reason: $reason) {
    success
    error {
      code
      message
    }
    occupancy {
      id
    }
  }
}
    `;
export type ReleasePetFromBoxMutationFn = Apollo.MutationFunction<ReleasePetFromBoxMutation, ReleasePetFromBoxMutationVariables>;

/**
 * __useReleasePetFromBoxMutation__
 *
 * To run a mutation, you first call `useReleasePetFromBoxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReleasePetFromBoxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [releasePetFromBoxMutation, { data, loading, error }] = useReleasePetFromBoxMutation({
 *   variables: {
 *      occupancy_id: // value for 'occupancy_id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useReleasePetFromBoxMutation(baseOptions?: Apollo.MutationHookOptions<ReleasePetFromBoxMutation, ReleasePetFromBoxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReleasePetFromBoxMutation, ReleasePetFromBoxMutationVariables>(ReleasePetFromBoxDocument, options);
      }
export type ReleasePetFromBoxMutationHookResult = ReturnType<typeof useReleasePetFromBoxMutation>;
export type ReleasePetFromBoxMutationResult = Apollo.MutationResult<ReleasePetFromBoxMutation>;
export type ReleasePetFromBoxMutationOptions = Apollo.BaseMutationOptions<ReleasePetFromBoxMutation, ReleasePetFromBoxMutationVariables>;
export const SaveShelterMapLayoutDocument = gql`
    mutation saveShelterMapLayout($map_id: ID!, $data: ShelterMapLayoutInput!) {
  saveShelterMapLayout(map_id: $map_id, data: $data) {
    success
    error {
      code
      message
    }
    map {
      ...FullShelterMap
    }
  }
}
    ${FullShelterMapFragmentDoc}`;
export type SaveShelterMapLayoutMutationFn = Apollo.MutationFunction<SaveShelterMapLayoutMutation, SaveShelterMapLayoutMutationVariables>;

/**
 * __useSaveShelterMapLayoutMutation__
 *
 * To run a mutation, you first call `useSaveShelterMapLayoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSaveShelterMapLayoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [saveShelterMapLayoutMutation, { data, loading, error }] = useSaveShelterMapLayoutMutation({
 *   variables: {
 *      map_id: // value for 'map_id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSaveShelterMapLayoutMutation(baseOptions?: Apollo.MutationHookOptions<SaveShelterMapLayoutMutation, SaveShelterMapLayoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SaveShelterMapLayoutMutation, SaveShelterMapLayoutMutationVariables>(SaveShelterMapLayoutDocument, options);
      }
export type SaveShelterMapLayoutMutationHookResult = ReturnType<typeof useSaveShelterMapLayoutMutation>;
export type SaveShelterMapLayoutMutationResult = Apollo.MutationResult<SaveShelterMapLayoutMutation>;
export type SaveShelterMapLayoutMutationOptions = Apollo.BaseMutationOptions<SaveShelterMapLayoutMutation, SaveShelterMapLayoutMutationVariables>;
export const SetShelterWalkManualDurationDocument = gql`
    mutation setShelterWalkManualDuration($id: ID!, $duration_minutes: Int!) {
  setShelterWalkManualDuration(id: $id, duration_minutes: $duration_minutes) {
    success
    error {
      code
      message
    }
    shelter_walk {
      ...MinShelterWalk
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;
export type SetShelterWalkManualDurationMutationFn = Apollo.MutationFunction<SetShelterWalkManualDurationMutation, SetShelterWalkManualDurationMutationVariables>;

/**
 * __useSetShelterWalkManualDurationMutation__
 *
 * To run a mutation, you first call `useSetShelterWalkManualDurationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetShelterWalkManualDurationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setShelterWalkManualDurationMutation, { data, loading, error }] = useSetShelterWalkManualDurationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      duration_minutes: // value for 'duration_minutes'
 *   },
 * });
 */
export function useSetShelterWalkManualDurationMutation(baseOptions?: Apollo.MutationHookOptions<SetShelterWalkManualDurationMutation, SetShelterWalkManualDurationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetShelterWalkManualDurationMutation, SetShelterWalkManualDurationMutationVariables>(SetShelterWalkManualDurationDocument, options);
      }
export type SetShelterWalkManualDurationMutationHookResult = ReturnType<typeof useSetShelterWalkManualDurationMutation>;
export type SetShelterWalkManualDurationMutationResult = Apollo.MutationResult<SetShelterWalkManualDurationMutation>;
export type SetShelterWalkManualDurationMutationOptions = Apollo.BaseMutationOptions<SetShelterWalkManualDurationMutation, SetShelterWalkManualDurationMutationVariables>;
export const RequestShelterClaimDocument = gql`
    mutation requestShelterClaim($shelter_id: ID!, $data: ShelterClaimInput!) {
  requestShelterClaim(shelter_id: $shelter_id, data: $data) {
    success
    error {
      code
      message
    }
    shelter_claim_request {
      ...MinShelterClaimRequest
    }
  }
}
    ${MinShelterClaimRequestFragmentDoc}`;
export type RequestShelterClaimMutationFn = Apollo.MutationFunction<RequestShelterClaimMutation, RequestShelterClaimMutationVariables>;

/**
 * __useRequestShelterClaimMutation__
 *
 * To run a mutation, you first call `useRequestShelterClaimMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestShelterClaimMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestShelterClaimMutation, { data, loading, error }] = useRequestShelterClaimMutation({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRequestShelterClaimMutation(baseOptions?: Apollo.MutationHookOptions<RequestShelterClaimMutation, RequestShelterClaimMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestShelterClaimMutation, RequestShelterClaimMutationVariables>(RequestShelterClaimDocument, options);
      }
export type RequestShelterClaimMutationHookResult = ReturnType<typeof useRequestShelterClaimMutation>;
export type RequestShelterClaimMutationResult = Apollo.MutationResult<RequestShelterClaimMutation>;
export type RequestShelterClaimMutationOptions = Apollo.BaseMutationOptions<RequestShelterClaimMutation, RequestShelterClaimMutationVariables>;
export const CancelShelterClaimDocument = gql`
    mutation cancelShelterClaim($id: ID!) {
  cancelShelterClaim(id: $id) {
    success
    error {
      code
      message
    }
    shelter_claim_request {
      ...MinShelterClaimRequest
    }
  }
}
    ${MinShelterClaimRequestFragmentDoc}`;
export type CancelShelterClaimMutationFn = Apollo.MutationFunction<CancelShelterClaimMutation, CancelShelterClaimMutationVariables>;

/**
 * __useCancelShelterClaimMutation__
 *
 * To run a mutation, you first call `useCancelShelterClaimMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelShelterClaimMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelShelterClaimMutation, { data, loading, error }] = useCancelShelterClaimMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelShelterClaimMutation(baseOptions?: Apollo.MutationHookOptions<CancelShelterClaimMutation, CancelShelterClaimMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelShelterClaimMutation, CancelShelterClaimMutationVariables>(CancelShelterClaimDocument, options);
      }
export type CancelShelterClaimMutationHookResult = ReturnType<typeof useCancelShelterClaimMutation>;
export type CancelShelterClaimMutationResult = Apollo.MutationResult<CancelShelterClaimMutation>;
export type CancelShelterClaimMutationOptions = Apollo.BaseMutationOptions<CancelShelterClaimMutation, CancelShelterClaimMutationVariables>;
export const RequestShelterOwnershipTransferDocument = gql`
    mutation requestShelterOwnershipTransfer($shelter_id: ID!, $to_user_id: ID!, $new_role_for_previous_owner: RoleLevel) {
  requestShelterOwnershipTransfer(
    shelter_id: $shelter_id
    to_user_id: $to_user_id
    new_role_for_previous_owner: $new_role_for_previous_owner
  ) {
    success
    error {
      code
      message
    }
    shelter_ownership_transfer {
      ...MinShelterOwnershipTransfer
    }
  }
}
    ${MinShelterOwnershipTransferFragmentDoc}`;
export type RequestShelterOwnershipTransferMutationFn = Apollo.MutationFunction<RequestShelterOwnershipTransferMutation, RequestShelterOwnershipTransferMutationVariables>;

/**
 * __useRequestShelterOwnershipTransferMutation__
 *
 * To run a mutation, you first call `useRequestShelterOwnershipTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRequestShelterOwnershipTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [requestShelterOwnershipTransferMutation, { data, loading, error }] = useRequestShelterOwnershipTransferMutation({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *      to_user_id: // value for 'to_user_id'
 *      new_role_for_previous_owner: // value for 'new_role_for_previous_owner'
 *   },
 * });
 */
export function useRequestShelterOwnershipTransferMutation(baseOptions?: Apollo.MutationHookOptions<RequestShelterOwnershipTransferMutation, RequestShelterOwnershipTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RequestShelterOwnershipTransferMutation, RequestShelterOwnershipTransferMutationVariables>(RequestShelterOwnershipTransferDocument, options);
      }
export type RequestShelterOwnershipTransferMutationHookResult = ReturnType<typeof useRequestShelterOwnershipTransferMutation>;
export type RequestShelterOwnershipTransferMutationResult = Apollo.MutationResult<RequestShelterOwnershipTransferMutation>;
export type RequestShelterOwnershipTransferMutationOptions = Apollo.BaseMutationOptions<RequestShelterOwnershipTransferMutation, RequestShelterOwnershipTransferMutationVariables>;
export const CancelShelterOwnershipTransferDocument = gql`
    mutation cancelShelterOwnershipTransfer($id: ID!) {
  cancelShelterOwnershipTransfer(id: $id) {
    success
    error {
      code
      message
    }
    shelter_ownership_transfer {
      ...MinShelterOwnershipTransfer
    }
  }
}
    ${MinShelterOwnershipTransferFragmentDoc}`;
export type CancelShelterOwnershipTransferMutationFn = Apollo.MutationFunction<CancelShelterOwnershipTransferMutation, CancelShelterOwnershipTransferMutationVariables>;

/**
 * __useCancelShelterOwnershipTransferMutation__
 *
 * To run a mutation, you first call `useCancelShelterOwnershipTransferMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelShelterOwnershipTransferMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelShelterOwnershipTransferMutation, { data, loading, error }] = useCancelShelterOwnershipTransferMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelShelterOwnershipTransferMutation(baseOptions?: Apollo.MutationHookOptions<CancelShelterOwnershipTransferMutation, CancelShelterOwnershipTransferMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CancelShelterOwnershipTransferMutation, CancelShelterOwnershipTransferMutationVariables>(CancelShelterOwnershipTransferDocument, options);
      }
export type CancelShelterOwnershipTransferMutationHookResult = ReturnType<typeof useCancelShelterOwnershipTransferMutation>;
export type CancelShelterOwnershipTransferMutationResult = Apollo.MutationResult<CancelShelterOwnershipTransferMutation>;
export type CancelShelterOwnershipTransferMutationOptions = Apollo.BaseMutationOptions<CancelShelterOwnershipTransferMutation, CancelShelterOwnershipTransferMutationVariables>;
export const CreateShelterPersonDocument = gql`
    mutation createShelterPerson($data: CreateShelterPersonInput!) {
  createShelterPerson(data: $data) {
    success
    error {
      code
      message
    }
    shelter_person {
      ...MinShelterPerson
    }
  }
}
    ${MinShelterPersonFragmentDoc}`;
export type CreateShelterPersonMutationFn = Apollo.MutationFunction<CreateShelterPersonMutation, CreateShelterPersonMutationVariables>;

/**
 * __useCreateShelterPersonMutation__
 *
 * To run a mutation, you first call `useCreateShelterPersonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateShelterPersonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createShelterPersonMutation, { data, loading, error }] = useCreateShelterPersonMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateShelterPersonMutation(baseOptions?: Apollo.MutationHookOptions<CreateShelterPersonMutation, CreateShelterPersonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateShelterPersonMutation, CreateShelterPersonMutationVariables>(CreateShelterPersonDocument, options);
      }
export type CreateShelterPersonMutationHookResult = ReturnType<typeof useCreateShelterPersonMutation>;
export type CreateShelterPersonMutationResult = Apollo.MutationResult<CreateShelterPersonMutation>;
export type CreateShelterPersonMutationOptions = Apollo.BaseMutationOptions<CreateShelterPersonMutation, CreateShelterPersonMutationVariables>;
export const UpdateShelterPersonDocument = gql`
    mutation updateShelterPerson($id: ID!, $data: UpdateShelterPersonInput!) {
  updateShelterPerson(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    shelter_person {
      ...MinShelterPerson
    }
  }
}
    ${MinShelterPersonFragmentDoc}`;
export type UpdateShelterPersonMutationFn = Apollo.MutationFunction<UpdateShelterPersonMutation, UpdateShelterPersonMutationVariables>;

/**
 * __useUpdateShelterPersonMutation__
 *
 * To run a mutation, you first call `useUpdateShelterPersonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShelterPersonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShelterPersonMutation, { data, loading, error }] = useUpdateShelterPersonMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateShelterPersonMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShelterPersonMutation, UpdateShelterPersonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShelterPersonMutation, UpdateShelterPersonMutationVariables>(UpdateShelterPersonDocument, options);
      }
export type UpdateShelterPersonMutationHookResult = ReturnType<typeof useUpdateShelterPersonMutation>;
export type UpdateShelterPersonMutationResult = Apollo.MutationResult<UpdateShelterPersonMutation>;
export type UpdateShelterPersonMutationOptions = Apollo.BaseMutationOptions<UpdateShelterPersonMutation, UpdateShelterPersonMutationVariables>;
export const ArchiveShelterPersonDocument = gql`
    mutation archiveShelterPerson($id: ID!) {
  archiveShelterPerson(id: $id) {
    success
    error {
      code
      message
    }
    shelter_person {
      ...MinShelterPerson
    }
  }
}
    ${MinShelterPersonFragmentDoc}`;
export type ArchiveShelterPersonMutationFn = Apollo.MutationFunction<ArchiveShelterPersonMutation, ArchiveShelterPersonMutationVariables>;

/**
 * __useArchiveShelterPersonMutation__
 *
 * To run a mutation, you first call `useArchiveShelterPersonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveShelterPersonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveShelterPersonMutation, { data, loading, error }] = useArchiveShelterPersonMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveShelterPersonMutation(baseOptions?: Apollo.MutationHookOptions<ArchiveShelterPersonMutation, ArchiveShelterPersonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ArchiveShelterPersonMutation, ArchiveShelterPersonMutationVariables>(ArchiveShelterPersonDocument, options);
      }
export type ArchiveShelterPersonMutationHookResult = ReturnType<typeof useArchiveShelterPersonMutation>;
export type ArchiveShelterPersonMutationResult = Apollo.MutationResult<ArchiveShelterPersonMutation>;
export type ArchiveShelterPersonMutationOptions = Apollo.BaseMutationOptions<ArchiveShelterPersonMutation, ArchiveShelterPersonMutationVariables>;
export const LinkShelterPersonToUserDocument = gql`
    mutation linkShelterPersonToUser($person_id: ID!, $user_id: ID!) {
  linkShelterPersonToUser(person_id: $person_id, user_id: $user_id) {
    success
    error {
      code
      message
    }
    shelter_person {
      ...MinShelterPerson
    }
  }
}
    ${MinShelterPersonFragmentDoc}`;
export type LinkShelterPersonToUserMutationFn = Apollo.MutationFunction<LinkShelterPersonToUserMutation, LinkShelterPersonToUserMutationVariables>;

/**
 * __useLinkShelterPersonToUserMutation__
 *
 * To run a mutation, you first call `useLinkShelterPersonToUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkShelterPersonToUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkShelterPersonToUserMutation, { data, loading, error }] = useLinkShelterPersonToUserMutation({
 *   variables: {
 *      person_id: // value for 'person_id'
 *      user_id: // value for 'user_id'
 *   },
 * });
 */
export function useLinkShelterPersonToUserMutation(baseOptions?: Apollo.MutationHookOptions<LinkShelterPersonToUserMutation, LinkShelterPersonToUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkShelterPersonToUserMutation, LinkShelterPersonToUserMutationVariables>(LinkShelterPersonToUserDocument, options);
      }
export type LinkShelterPersonToUserMutationHookResult = ReturnType<typeof useLinkShelterPersonToUserMutation>;
export type LinkShelterPersonToUserMutationResult = Apollo.MutationResult<LinkShelterPersonToUserMutation>;
export type LinkShelterPersonToUserMutationOptions = Apollo.BaseMutationOptions<LinkShelterPersonToUserMutation, LinkShelterPersonToUserMutationVariables>;
export const SkipShelterTaskDocument = gql`
    mutation skipShelterTask($id: ID!, $reason: String) {
  skipShelterTask(id: $id, reason: $reason) {
    success
    error {
      code
      message
    }
    shelter_task {
      ...MinShelterTask
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;
export type SkipShelterTaskMutationFn = Apollo.MutationFunction<SkipShelterTaskMutation, SkipShelterTaskMutationVariables>;

/**
 * __useSkipShelterTaskMutation__
 *
 * To run a mutation, you first call `useSkipShelterTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSkipShelterTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [skipShelterTaskMutation, { data, loading, error }] = useSkipShelterTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useSkipShelterTaskMutation(baseOptions?: Apollo.MutationHookOptions<SkipShelterTaskMutation, SkipShelterTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SkipShelterTaskMutation, SkipShelterTaskMutationVariables>(SkipShelterTaskDocument, options);
      }
export type SkipShelterTaskMutationHookResult = ReturnType<typeof useSkipShelterTaskMutation>;
export type SkipShelterTaskMutationResult = Apollo.MutationResult<SkipShelterTaskMutation>;
export type SkipShelterTaskMutationOptions = Apollo.BaseMutationOptions<SkipShelterTaskMutation, SkipShelterTaskMutationVariables>;
export const StartShelterWalkDocument = gql`
    mutation startShelterWalk($id: ID!) {
  startShelterWalk(id: $id) {
    success
    error {
      code
      message
    }
    shelter_walk {
      ...MinShelterWalk
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;
export type StartShelterWalkMutationFn = Apollo.MutationFunction<StartShelterWalkMutation, StartShelterWalkMutationVariables>;

/**
 * __useStartShelterWalkMutation__
 *
 * To run a mutation, you first call `useStartShelterWalkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStartShelterWalkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [startShelterWalkMutation, { data, loading, error }] = useStartShelterWalkMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useStartShelterWalkMutation(baseOptions?: Apollo.MutationHookOptions<StartShelterWalkMutation, StartShelterWalkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<StartShelterWalkMutation, StartShelterWalkMutationVariables>(StartShelterWalkDocument, options);
      }
export type StartShelterWalkMutationHookResult = ReturnType<typeof useStartShelterWalkMutation>;
export type StartShelterWalkMutationResult = Apollo.MutationResult<StartShelterWalkMutation>;
export type StartShelterWalkMutationOptions = Apollo.BaseMutationOptions<StartShelterWalkMutation, StartShelterWalkMutationVariables>;
export const UpdateShelterInventoryItemDocument = gql`
    mutation updateShelterInventoryItem($id: ID!, $data: ShelterInventoryItemUpdate!) {
  updateShelterInventoryItem(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    item {
      ...MinInventoryItem
    }
  }
}
    ${MinInventoryItemFragmentDoc}`;
export type UpdateShelterInventoryItemMutationFn = Apollo.MutationFunction<UpdateShelterInventoryItemMutation, UpdateShelterInventoryItemMutationVariables>;

/**
 * __useUpdateShelterInventoryItemMutation__
 *
 * To run a mutation, you first call `useUpdateShelterInventoryItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShelterInventoryItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShelterInventoryItemMutation, { data, loading, error }] = useUpdateShelterInventoryItemMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateShelterInventoryItemMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShelterInventoryItemMutation, UpdateShelterInventoryItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShelterInventoryItemMutation, UpdateShelterInventoryItemMutationVariables>(UpdateShelterInventoryItemDocument, options);
      }
export type UpdateShelterInventoryItemMutationHookResult = ReturnType<typeof useUpdateShelterInventoryItemMutation>;
export type UpdateShelterInventoryItemMutationResult = Apollo.MutationResult<UpdateShelterInventoryItemMutation>;
export type UpdateShelterInventoryItemMutationOptions = Apollo.BaseMutationOptions<UpdateShelterInventoryItemMutation, UpdateShelterInventoryItemMutationVariables>;
export const UpdateShelterMapDocument = gql`
    mutation updateShelterMap($id: ID!, $data: ShelterMapUpdate!) {
  updateShelterMap(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    map {
      ...FullShelterMap
    }
  }
}
    ${FullShelterMapFragmentDoc}`;
export type UpdateShelterMapMutationFn = Apollo.MutationFunction<UpdateShelterMapMutation, UpdateShelterMapMutationVariables>;

/**
 * __useUpdateShelterMapMutation__
 *
 * To run a mutation, you first call `useUpdateShelterMapMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShelterMapMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShelterMapMutation, { data, loading, error }] = useUpdateShelterMapMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateShelterMapMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShelterMapMutation, UpdateShelterMapMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShelterMapMutation, UpdateShelterMapMutationVariables>(UpdateShelterMapDocument, options);
      }
export type UpdateShelterMapMutationHookResult = ReturnType<typeof useUpdateShelterMapMutation>;
export type UpdateShelterMapMutationResult = Apollo.MutationResult<UpdateShelterMapMutation>;
export type UpdateShelterMapMutationOptions = Apollo.BaseMutationOptions<UpdateShelterMapMutation, UpdateShelterMapMutationVariables>;
export const UpdateShelterPublicProfileDocument = gql`
    mutation updateShelterPublicProfile($id: ID!, $data: ShelterUpdate!) {
  updateShelter(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    shelter {
      id
      public_description
      public_contact_email
      public_contact_phone
      accepts_volunteers
      public_location_label
      public_lat
      public_lng
    }
  }
}
    `;
export type UpdateShelterPublicProfileMutationFn = Apollo.MutationFunction<UpdateShelterPublicProfileMutation, UpdateShelterPublicProfileMutationVariables>;

/**
 * __useUpdateShelterPublicProfileMutation__
 *
 * To run a mutation, you first call `useUpdateShelterPublicProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShelterPublicProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShelterPublicProfileMutation, { data, loading, error }] = useUpdateShelterPublicProfileMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateShelterPublicProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShelterPublicProfileMutation, UpdateShelterPublicProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShelterPublicProfileMutation, UpdateShelterPublicProfileMutationVariables>(UpdateShelterPublicProfileDocument, options);
      }
export type UpdateShelterPublicProfileMutationHookResult = ReturnType<typeof useUpdateShelterPublicProfileMutation>;
export type UpdateShelterPublicProfileMutationResult = Apollo.MutationResult<UpdateShelterPublicProfileMutation>;
export type UpdateShelterPublicProfileMutationOptions = Apollo.BaseMutationOptions<UpdateShelterPublicProfileMutation, UpdateShelterPublicProfileMutationVariables>;
export const UpdateShelterTaskDocument = gql`
    mutation updateShelterTask($id: ID!, $data: ShelterTaskUpdate!) {
  updateShelterTask(id: $id, data: $data) {
    success
    error {
      code
      message
    }
    shelter_task {
      ...MinShelterTask
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;
export type UpdateShelterTaskMutationFn = Apollo.MutationFunction<UpdateShelterTaskMutation, UpdateShelterTaskMutationVariables>;

/**
 * __useUpdateShelterTaskMutation__
 *
 * To run a mutation, you first call `useUpdateShelterTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateShelterTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateShelterTaskMutation, { data, loading, error }] = useUpdateShelterTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateShelterTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateShelterTaskMutation, UpdateShelterTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateShelterTaskMutation, UpdateShelterTaskMutationVariables>(UpdateShelterTaskDocument, options);
      }
export type UpdateShelterTaskMutationHookResult = ReturnType<typeof useUpdateShelterTaskMutation>;
export type UpdateShelterTaskMutationResult = Apollo.MutationResult<UpdateShelterTaskMutation>;
export type UpdateShelterTaskMutationOptions = Apollo.BaseMutationOptions<UpdateShelterTaskMutation, UpdateShelterTaskMutationVariables>;
export const DiscoverSheltersDocument = gql`
    query discoverShelters($search: PublicShelterSearchInput) {
  discoverShelters(search: $search) {
    success
    error {
      code
      message
    }
    items {
      ...PublicShelter
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${PublicShelterFragmentDoc}`;

/**
 * __useDiscoverSheltersQuery__
 *
 * To run a query within a React component, call `useDiscoverSheltersQuery` and pass it any options that fit your needs.
 * When your component renders, `useDiscoverSheltersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDiscoverSheltersQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useDiscoverSheltersQuery(baseOptions?: Apollo.QueryHookOptions<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>(DiscoverSheltersDocument, options);
      }
export function useDiscoverSheltersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>(DiscoverSheltersDocument, options);
        }
export function useDiscoverSheltersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>(DiscoverSheltersDocument, options);
        }
export type DiscoverSheltersQueryHookResult = ReturnType<typeof useDiscoverSheltersQuery>;
export type DiscoverSheltersLazyQueryHookResult = ReturnType<typeof useDiscoverSheltersLazyQuery>;
export type DiscoverSheltersSuspenseQueryHookResult = ReturnType<typeof useDiscoverSheltersSuspenseQuery>;
export type DiscoverSheltersQueryResult = Apollo.QueryResult<DiscoverSheltersQuery, DiscoverSheltersQueryVariables>;
export const GetCurrentBoxForPetDocument = gql`
    query getCurrentBoxForPet($shelter_pet_id: ID!) {
  getCurrentBoxForPet(shelter_pet_id: $shelter_pet_id) {
    success
    error {
      code
      message
    }
    box {
      id
      label
      capacity
      status
      map_id
      area {
        id
        name
        area_type
        color
      }
    }
  }
}
    `;

/**
 * __useGetCurrentBoxForPetQuery__
 *
 * To run a query within a React component, call `useGetCurrentBoxForPetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentBoxForPetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentBoxForPetQuery({
 *   variables: {
 *      shelter_pet_id: // value for 'shelter_pet_id'
 *   },
 * });
 */
export function useGetCurrentBoxForPetQuery(baseOptions: Apollo.QueryHookOptions<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables> & ({ variables: GetCurrentBoxForPetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables>(GetCurrentBoxForPetDocument, options);
      }
export function useGetCurrentBoxForPetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables>(GetCurrentBoxForPetDocument, options);
        }
export function useGetCurrentBoxForPetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables>(GetCurrentBoxForPetDocument, options);
        }
export type GetCurrentBoxForPetQueryHookResult = ReturnType<typeof useGetCurrentBoxForPetQuery>;
export type GetCurrentBoxForPetLazyQueryHookResult = ReturnType<typeof useGetCurrentBoxForPetLazyQuery>;
export type GetCurrentBoxForPetSuspenseQueryHookResult = ReturnType<typeof useGetCurrentBoxForPetSuspenseQuery>;
export type GetCurrentBoxForPetQueryResult = Apollo.QueryResult<GetCurrentBoxForPetQuery, GetCurrentBoxForPetQueryVariables>;
export const GetMyShelterDashboardDocument = gql`
    query getMyShelterDashboard($date_from: String!, $date_to: String!) {
  getMyShelterDashboard(date_from: $date_from, date_to: $date_to) {
    success
    error {
      code
      message
    }
    dashboard {
      task_count
      overdue_task_count
      walk_count
      in_progress_walk_count
      low_stock_count
      out_of_stock_count
      tasks {
        id
        shelter_id
        shelter_name
        task_type
        area
        status
        is_overdue
        scheduled_at
        action_url
      }
      walks {
        id
        shelter_id
        shelter_name
        pet_name
        status
        scheduled_at
        action_url
      }
      inventory_alerts {
        id
        shelter_id
        shelter_name
        name
        current_quantity
        minimum_threshold
        status
        action_url
      }
    }
  }
}
    `;

/**
 * __useGetMyShelterDashboardQuery__
 *
 * To run a query within a React component, call `useGetMyShelterDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyShelterDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyShelterDashboardQuery({
 *   variables: {
 *      date_from: // value for 'date_from'
 *      date_to: // value for 'date_to'
 *   },
 * });
 */
export function useGetMyShelterDashboardQuery(baseOptions: Apollo.QueryHookOptions<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables> & ({ variables: GetMyShelterDashboardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables>(GetMyShelterDashboardDocument, options);
      }
export function useGetMyShelterDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables>(GetMyShelterDashboardDocument, options);
        }
export function useGetMyShelterDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables>(GetMyShelterDashboardDocument, options);
        }
export type GetMyShelterDashboardQueryHookResult = ReturnType<typeof useGetMyShelterDashboardQuery>;
export type GetMyShelterDashboardLazyQueryHookResult = ReturnType<typeof useGetMyShelterDashboardLazyQuery>;
export type GetMyShelterDashboardSuspenseQueryHookResult = ReturnType<typeof useGetMyShelterDashboardSuspenseQuery>;
export type GetMyShelterDashboardQueryResult = Apollo.QueryResult<GetMyShelterDashboardQuery, GetMyShelterDashboardQueryVariables>;
export const GetPublicShelterDocument = gql`
    query getPublicShelter($id: ID!) {
  getPublicShelter(id: $id) {
    ...PublicShelter
  }
}
    ${PublicShelterFragmentDoc}`;

/**
 * __useGetPublicShelterQuery__
 *
 * To run a query within a React component, call `useGetPublicShelterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicShelterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicShelterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPublicShelterQuery(baseOptions: Apollo.QueryHookOptions<GetPublicShelterQuery, GetPublicShelterQueryVariables> & ({ variables: GetPublicShelterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPublicShelterQuery, GetPublicShelterQueryVariables>(GetPublicShelterDocument, options);
      }
export function useGetPublicShelterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPublicShelterQuery, GetPublicShelterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPublicShelterQuery, GetPublicShelterQueryVariables>(GetPublicShelterDocument, options);
        }
export function useGetPublicShelterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPublicShelterQuery, GetPublicShelterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPublicShelterQuery, GetPublicShelterQueryVariables>(GetPublicShelterDocument, options);
        }
export type GetPublicShelterQueryHookResult = ReturnType<typeof useGetPublicShelterQuery>;
export type GetPublicShelterLazyQueryHookResult = ReturnType<typeof useGetPublicShelterLazyQuery>;
export type GetPublicShelterSuspenseQueryHookResult = ReturnType<typeof useGetPublicShelterSuspenseQuery>;
export type GetPublicShelterQueryResult = Apollo.QueryResult<GetPublicShelterQuery, GetPublicShelterQueryVariables>;
export const GetShelterDocument = gql`
    query getShelter($id: ID!) {
  getShelter(id: $id) {
    success
    error {
      code
      message
    }
    shelter {
      ...FullShelter
    }
  }
}
    ${FullShelterFragmentDoc}`;

/**
 * __useGetShelterQuery__
 *
 * To run a query within a React component, call `useGetShelterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetShelterQuery(baseOptions: Apollo.QueryHookOptions<GetShelterQuery, GetShelterQueryVariables> & ({ variables: GetShelterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterQuery, GetShelterQueryVariables>(GetShelterDocument, options);
      }
export function useGetShelterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterQuery, GetShelterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterQuery, GetShelterQueryVariables>(GetShelterDocument, options);
        }
export function useGetShelterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterQuery, GetShelterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterQuery, GetShelterQueryVariables>(GetShelterDocument, options);
        }
export type GetShelterQueryHookResult = ReturnType<typeof useGetShelterQuery>;
export type GetShelterLazyQueryHookResult = ReturnType<typeof useGetShelterLazyQuery>;
export type GetShelterSuspenseQueryHookResult = ReturnType<typeof useGetShelterSuspenseQuery>;
export type GetShelterQueryResult = Apollo.QueryResult<GetShelterQuery, GetShelterQueryVariables>;
export const GetShelterMapDocument = gql`
    query getShelterMap($id: ID!) {
  getShelterMap(id: $id) {
    success
    error {
      code
      message
    }
    map {
      ...FullShelterMap
    }
  }
}
    ${FullShelterMapFragmentDoc}`;

/**
 * __useGetShelterMapQuery__
 *
 * To run a query within a React component, call `useGetShelterMapQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterMapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterMapQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetShelterMapQuery(baseOptions: Apollo.QueryHookOptions<GetShelterMapQuery, GetShelterMapQueryVariables> & ({ variables: GetShelterMapQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterMapQuery, GetShelterMapQueryVariables>(GetShelterMapDocument, options);
      }
export function useGetShelterMapLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterMapQuery, GetShelterMapQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterMapQuery, GetShelterMapQueryVariables>(GetShelterMapDocument, options);
        }
export function useGetShelterMapSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterMapQuery, GetShelterMapQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterMapQuery, GetShelterMapQueryVariables>(GetShelterMapDocument, options);
        }
export type GetShelterMapQueryHookResult = ReturnType<typeof useGetShelterMapQuery>;
export type GetShelterMapLazyQueryHookResult = ReturnType<typeof useGetShelterMapLazyQuery>;
export type GetShelterMapSuspenseQueryHookResult = ReturnType<typeof useGetShelterMapSuspenseQuery>;
export type GetShelterMapQueryResult = Apollo.QueryResult<GetShelterMapQuery, GetShelterMapQueryVariables>;
export const GetShelterOperationalDashboardDocument = gql`
    query getShelterOperationalDashboard($shelter_id: ID!) {
  getShelterOperationalDashboard(shelter_id: $shelter_id) {
    success
    error {
      code
      message
    }
    dashboard {
      shelter_id
      walks_completed_today
      walks_planned_today
      pets_needing_walk
      tasks_pending
      tasks_overdue
      tasks_completed_today
      tasks_total
      tasks_recurring
      tasks_due_this_week
      boxes_total
      boxes_free
      boxes_occupied
      boxes_full
      boxes_out_of_service
      pets_total
      pets_without_box
      low_stock_count
    }
  }
}
    `;

/**
 * __useGetShelterOperationalDashboardQuery__
 *
 * To run a query within a React component, call `useGetShelterOperationalDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterOperationalDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterOperationalDashboardQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *   },
 * });
 */
export function useGetShelterOperationalDashboardQuery(baseOptions: Apollo.QueryHookOptions<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables> & ({ variables: GetShelterOperationalDashboardQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables>(GetShelterOperationalDashboardDocument, options);
      }
export function useGetShelterOperationalDashboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables>(GetShelterOperationalDashboardDocument, options);
        }
export function useGetShelterOperationalDashboardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables>(GetShelterOperationalDashboardDocument, options);
        }
export type GetShelterOperationalDashboardQueryHookResult = ReturnType<typeof useGetShelterOperationalDashboardQuery>;
export type GetShelterOperationalDashboardLazyQueryHookResult = ReturnType<typeof useGetShelterOperationalDashboardLazyQuery>;
export type GetShelterOperationalDashboardSuspenseQueryHookResult = ReturnType<typeof useGetShelterOperationalDashboardSuspenseQuery>;
export type GetShelterOperationalDashboardQueryResult = Apollo.QueryResult<GetShelterOperationalDashboardQuery, GetShelterOperationalDashboardQueryVariables>;
export const GetShelterPetDocument = gql`
    query getShelterPet($id: ID!) {
  getShelterPet(id: $id) {
    success
    error {
      code
      message
    }
    shelter_pet {
      id
      pet {
        id
        name
      }
    }
  }
}
    `;

/**
 * __useGetShelterPetQuery__
 *
 * To run a query within a React component, call `useGetShelterPetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterPetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterPetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetShelterPetQuery(baseOptions: Apollo.QueryHookOptions<GetShelterPetQuery, GetShelterPetQueryVariables> & ({ variables: GetShelterPetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterPetQuery, GetShelterPetQueryVariables>(GetShelterPetDocument, options);
      }
export function useGetShelterPetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterPetQuery, GetShelterPetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterPetQuery, GetShelterPetQueryVariables>(GetShelterPetDocument, options);
        }
export function useGetShelterPetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterPetQuery, GetShelterPetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterPetQuery, GetShelterPetQueryVariables>(GetShelterPetDocument, options);
        }
export type GetShelterPetQueryHookResult = ReturnType<typeof useGetShelterPetQuery>;
export type GetShelterPetLazyQueryHookResult = ReturnType<typeof useGetShelterPetLazyQuery>;
export type GetShelterPetSuspenseQueryHookResult = ReturnType<typeof useGetShelterPetSuspenseQuery>;
export type GetShelterPetQueryResult = Apollo.QueryResult<GetShelterPetQuery, GetShelterPetQueryVariables>;
export const GetShelterPetWalkingStatsDocument = gql`
    query getShelterPetWalkingStats($shelter_pet_id: ID!, $period: StatsPeriod!) {
  getShelterPetWalkingStats(shelter_pet_id: $shelter_pet_id, period: $period) {
    success
    error {
      code
      message
    }
    chart {
      labels
      series {
        type
        data
      }
    }
  }
}
    `;

/**
 * __useGetShelterPetWalkingStatsQuery__
 *
 * To run a query within a React component, call `useGetShelterPetWalkingStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterPetWalkingStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterPetWalkingStatsQuery({
 *   variables: {
 *      shelter_pet_id: // value for 'shelter_pet_id'
 *      period: // value for 'period'
 *   },
 * });
 */
export function useGetShelterPetWalkingStatsQuery(baseOptions: Apollo.QueryHookOptions<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables> & ({ variables: GetShelterPetWalkingStatsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables>(GetShelterPetWalkingStatsDocument, options);
      }
export function useGetShelterPetWalkingStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables>(GetShelterPetWalkingStatsDocument, options);
        }
export function useGetShelterPetWalkingStatsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables>(GetShelterPetWalkingStatsDocument, options);
        }
export type GetShelterPetWalkingStatsQueryHookResult = ReturnType<typeof useGetShelterPetWalkingStatsQuery>;
export type GetShelterPetWalkingStatsLazyQueryHookResult = ReturnType<typeof useGetShelterPetWalkingStatsLazyQuery>;
export type GetShelterPetWalkingStatsSuspenseQueryHookResult = ReturnType<typeof useGetShelterPetWalkingStatsSuspenseQuery>;
export type GetShelterPetWalkingStatsQueryResult = Apollo.QueryResult<GetShelterPetWalkingStatsQuery, GetShelterPetWalkingStatsQueryVariables>;
export const GetShelterPublicProfileDocument = gql`
    query getShelterPublicProfile($id: ID!) {
  getShelter(id: $id) {
    success
    error {
      code
      message
    }
    shelter {
      id
      name
      public_description
      public_contact_email
      public_contact_phone
      accepts_volunteers
      public_location_label
      public_lat
      public_lng
    }
  }
}
    `;

/**
 * __useGetShelterPublicProfileQuery__
 *
 * To run a query within a React component, call `useGetShelterPublicProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterPublicProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterPublicProfileQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetShelterPublicProfileQuery(baseOptions: Apollo.QueryHookOptions<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables> & ({ variables: GetShelterPublicProfileQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables>(GetShelterPublicProfileDocument, options);
      }
export function useGetShelterPublicProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables>(GetShelterPublicProfileDocument, options);
        }
export function useGetShelterPublicProfileSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables>(GetShelterPublicProfileDocument, options);
        }
export type GetShelterPublicProfileQueryHookResult = ReturnType<typeof useGetShelterPublicProfileQuery>;
export type GetShelterPublicProfileLazyQueryHookResult = ReturnType<typeof useGetShelterPublicProfileLazyQuery>;
export type GetShelterPublicProfileSuspenseQueryHookResult = ReturnType<typeof useGetShelterPublicProfileSuspenseQuery>;
export type GetShelterPublicProfileQueryResult = Apollo.QueryResult<GetShelterPublicProfileQuery, GetShelterPublicProfileQueryVariables>;
export const GetShelterTaskDocument = gql`
    query getShelterTask($id: ID!) {
  getShelterTask(id: $id) {
    success
    error {
      code
      message
    }
    shelter_task {
      ...MinShelterTask
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;

/**
 * __useGetShelterTaskQuery__
 *
 * To run a query within a React component, call `useGetShelterTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterTaskQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetShelterTaskQuery(baseOptions: Apollo.QueryHookOptions<GetShelterTaskQuery, GetShelterTaskQueryVariables> & ({ variables: GetShelterTaskQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterTaskQuery, GetShelterTaskQueryVariables>(GetShelterTaskDocument, options);
      }
export function useGetShelterTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterTaskQuery, GetShelterTaskQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterTaskQuery, GetShelterTaskQueryVariables>(GetShelterTaskDocument, options);
        }
export function useGetShelterTaskSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterTaskQuery, GetShelterTaskQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterTaskQuery, GetShelterTaskQueryVariables>(GetShelterTaskDocument, options);
        }
export type GetShelterTaskQueryHookResult = ReturnType<typeof useGetShelterTaskQuery>;
export type GetShelterTaskLazyQueryHookResult = ReturnType<typeof useGetShelterTaskLazyQuery>;
export type GetShelterTaskSuspenseQueryHookResult = ReturnType<typeof useGetShelterTaskSuspenseQuery>;
export type GetShelterTaskQueryResult = Apollo.QueryResult<GetShelterTaskQuery, GetShelterTaskQueryVariables>;
export const GetShelterWalkDocument = gql`
    query getShelterWalk($id: ID!) {
  getShelterWalk(id: $id) {
    success
    error {
      code
      message
    }
    shelter_walk {
      ...MinShelterWalk
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;

/**
 * __useGetShelterWalkQuery__
 *
 * To run a query within a React component, call `useGetShelterWalkQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetShelterWalkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetShelterWalkQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetShelterWalkQuery(baseOptions: Apollo.QueryHookOptions<GetShelterWalkQuery, GetShelterWalkQueryVariables> & ({ variables: GetShelterWalkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetShelterWalkQuery, GetShelterWalkQueryVariables>(GetShelterWalkDocument, options);
      }
export function useGetShelterWalkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetShelterWalkQuery, GetShelterWalkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetShelterWalkQuery, GetShelterWalkQueryVariables>(GetShelterWalkDocument, options);
        }
export function useGetShelterWalkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetShelterWalkQuery, GetShelterWalkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetShelterWalkQuery, GetShelterWalkQueryVariables>(GetShelterWalkDocument, options);
        }
export type GetShelterWalkQueryHookResult = ReturnType<typeof useGetShelterWalkQuery>;
export type GetShelterWalkLazyQueryHookResult = ReturnType<typeof useGetShelterWalkLazyQuery>;
export type GetShelterWalkSuspenseQueryHookResult = ReturnType<typeof useGetShelterWalkSuspenseQuery>;
export type GetShelterWalkQueryResult = Apollo.QueryResult<GetShelterWalkQuery, GetShelterWalkQueryVariables>;
export const ListMyOwnershipTransfersDocument = gql`
    query listMyOwnershipTransfers($search: CommonSearch) {
  listMyOwnershipTransfers(search: $search) {
    success
    error {
      code
      message
    }
    items {
      ...MinShelterOwnershipTransfer
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterOwnershipTransferFragmentDoc}`;

/**
 * __useListMyOwnershipTransfersQuery__
 *
 * To run a query within a React component, call `useListMyOwnershipTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListMyOwnershipTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListMyOwnershipTransfersQuery({
 *   variables: {
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListMyOwnershipTransfersQuery(baseOptions?: Apollo.QueryHookOptions<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>(ListMyOwnershipTransfersDocument, options);
      }
export function useListMyOwnershipTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>(ListMyOwnershipTransfersDocument, options);
        }
export function useListMyOwnershipTransfersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>(ListMyOwnershipTransfersDocument, options);
        }
export type ListMyOwnershipTransfersQueryHookResult = ReturnType<typeof useListMyOwnershipTransfersQuery>;
export type ListMyOwnershipTransfersLazyQueryHookResult = ReturnType<typeof useListMyOwnershipTransfersLazyQuery>;
export type ListMyOwnershipTransfersSuspenseQueryHookResult = ReturnType<typeof useListMyOwnershipTransfersSuspenseQuery>;
export type ListMyOwnershipTransfersQueryResult = Apollo.QueryResult<ListMyOwnershipTransfersQuery, ListMyOwnershipTransfersQueryVariables>;
export const ListOperationalShelterTasksDocument = gql`
    query listOperationalShelterTasks($shelter_id: ID!) {
  listOperationalShelterTasks(shelter_id: $shelter_id) {
    items {
      ...MinShelterTask
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;

/**
 * __useListOperationalShelterTasksQuery__
 *
 * To run a query within a React component, call `useListOperationalShelterTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useListOperationalShelterTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListOperationalShelterTasksQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *   },
 * });
 */
export function useListOperationalShelterTasksQuery(baseOptions: Apollo.QueryHookOptions<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables> & ({ variables: ListOperationalShelterTasksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables>(ListOperationalShelterTasksDocument, options);
      }
export function useListOperationalShelterTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables>(ListOperationalShelterTasksDocument, options);
        }
export function useListOperationalShelterTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables>(ListOperationalShelterTasksDocument, options);
        }
export type ListOperationalShelterTasksQueryHookResult = ReturnType<typeof useListOperationalShelterTasksQuery>;
export type ListOperationalShelterTasksLazyQueryHookResult = ReturnType<typeof useListOperationalShelterTasksLazyQuery>;
export type ListOperationalShelterTasksSuspenseQueryHookResult = ReturnType<typeof useListOperationalShelterTasksSuspenseQuery>;
export type ListOperationalShelterTasksQueryResult = Apollo.QueryResult<ListOperationalShelterTasksQuery, ListOperationalShelterTasksQueryVariables>;
export const ListOperationalShelterWalksDocument = gql`
    query listOperationalShelterWalks($shelter_id: ID!) {
  listOperationalShelterWalks(shelter_id: $shelter_id) {
    items {
      ...MinShelterWalk
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;

/**
 * __useListOperationalShelterWalksQuery__
 *
 * To run a query within a React component, call `useListOperationalShelterWalksQuery` and pass it any options that fit your needs.
 * When your component renders, `useListOperationalShelterWalksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListOperationalShelterWalksQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *   },
 * });
 */
export function useListOperationalShelterWalksQuery(baseOptions: Apollo.QueryHookOptions<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables> & ({ variables: ListOperationalShelterWalksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables>(ListOperationalShelterWalksDocument, options);
      }
export function useListOperationalShelterWalksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables>(ListOperationalShelterWalksDocument, options);
        }
export function useListOperationalShelterWalksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables>(ListOperationalShelterWalksDocument, options);
        }
export type ListOperationalShelterWalksQueryHookResult = ReturnType<typeof useListOperationalShelterWalksQuery>;
export type ListOperationalShelterWalksLazyQueryHookResult = ReturnType<typeof useListOperationalShelterWalksLazyQuery>;
export type ListOperationalShelterWalksSuspenseQueryHookResult = ReturnType<typeof useListOperationalShelterWalksSuspenseQuery>;
export type ListOperationalShelterWalksQueryResult = Apollo.QueryResult<ListOperationalShelterWalksQuery, ListOperationalShelterWalksQueryVariables>;
export const ListPetsNeedingWalkDocument = gql`
    query listPetsNeedingWalk($shelter_id: ID!, $hours: Int) {
  listPetsNeedingWalk(shelter_id: $shelter_id, hours: $hours) {
    items {
      id
      pet {
        id
        name
        main_picture {
          id
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
    `;

/**
 * __useListPetsNeedingWalkQuery__
 *
 * To run a query within a React component, call `useListPetsNeedingWalkQuery` and pass it any options that fit your needs.
 * When your component renders, `useListPetsNeedingWalkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListPetsNeedingWalkQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *      hours: // value for 'hours'
 *   },
 * });
 */
export function useListPetsNeedingWalkQuery(baseOptions: Apollo.QueryHookOptions<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables> & ({ variables: ListPetsNeedingWalkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables>(ListPetsNeedingWalkDocument, options);
      }
export function useListPetsNeedingWalkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables>(ListPetsNeedingWalkDocument, options);
        }
export function useListPetsNeedingWalkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables>(ListPetsNeedingWalkDocument, options);
        }
export type ListPetsNeedingWalkQueryHookResult = ReturnType<typeof useListPetsNeedingWalkQuery>;
export type ListPetsNeedingWalkLazyQueryHookResult = ReturnType<typeof useListPetsNeedingWalkLazyQuery>;
export type ListPetsNeedingWalkSuspenseQueryHookResult = ReturnType<typeof useListPetsNeedingWalkSuspenseQuery>;
export type ListPetsNeedingWalkQueryResult = Apollo.QueryResult<ListPetsNeedingWalkQuery, ListPetsNeedingWalkQueryVariables>;
export const ListShelterClaimRequestsDocument = gql`
    query listShelterClaimRequests($shelter_id: ID!, $search: CommonSearch) {
  listShelterClaimRequests(shelter_id: $shelter_id, search: $search) {
    success
    error {
      code
      message
    }
    items {
      ...MinShelterClaimRequest
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterClaimRequestFragmentDoc}`;

/**
 * __useListShelterClaimRequestsQuery__
 *
 * To run a query within a React component, call `useListShelterClaimRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterClaimRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterClaimRequestsQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListShelterClaimRequestsQuery(baseOptions: Apollo.QueryHookOptions<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables> & ({ variables: ListShelterClaimRequestsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables>(ListShelterClaimRequestsDocument, options);
      }
export function useListShelterClaimRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables>(ListShelterClaimRequestsDocument, options);
        }
export function useListShelterClaimRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables>(ListShelterClaimRequestsDocument, options);
        }
export type ListShelterClaimRequestsQueryHookResult = ReturnType<typeof useListShelterClaimRequestsQuery>;
export type ListShelterClaimRequestsLazyQueryHookResult = ReturnType<typeof useListShelterClaimRequestsLazyQuery>;
export type ListShelterClaimRequestsSuspenseQueryHookResult = ReturnType<typeof useListShelterClaimRequestsSuspenseQuery>;
export type ListShelterClaimRequestsQueryResult = Apollo.QueryResult<ListShelterClaimRequestsQuery, ListShelterClaimRequestsQueryVariables>;
export const ListShelterInventoryItemsDocument = gql`
    query listShelterInventoryItems($commonSearch: CommonSearch) {
  listShelterInventoryItems(commonSearch: $commonSearch) {
    items {
      ...MinInventoryItem
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinInventoryItemFragmentDoc}`;

/**
 * __useListShelterInventoryItemsQuery__
 *
 * To run a query within a React component, call `useListShelterInventoryItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterInventoryItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterInventoryItemsQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterInventoryItemsQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>(ListShelterInventoryItemsDocument, options);
      }
export function useListShelterInventoryItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>(ListShelterInventoryItemsDocument, options);
        }
export function useListShelterInventoryItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>(ListShelterInventoryItemsDocument, options);
        }
export type ListShelterInventoryItemsQueryHookResult = ReturnType<typeof useListShelterInventoryItemsQuery>;
export type ListShelterInventoryItemsLazyQueryHookResult = ReturnType<typeof useListShelterInventoryItemsLazyQuery>;
export type ListShelterInventoryItemsSuspenseQueryHookResult = ReturnType<typeof useListShelterInventoryItemsSuspenseQuery>;
export type ListShelterInventoryItemsQueryResult = Apollo.QueryResult<ListShelterInventoryItemsQuery, ListShelterInventoryItemsQueryVariables>;
export const ListShelterMapsDocument = gql`
    query listShelterMaps($commonSearch: CommonSearch) {
  listShelterMaps(commonSearch: $commonSearch) {
    items {
      id
      name
      width
      height
      unit
    }
    success
    error {
      code
      message
    }
  }
}
    `;

/**
 * __useListShelterMapsQuery__
 *
 * To run a query within a React component, call `useListShelterMapsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterMapsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterMapsQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterMapsQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterMapsQuery, ListShelterMapsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterMapsQuery, ListShelterMapsQueryVariables>(ListShelterMapsDocument, options);
      }
export function useListShelterMapsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterMapsQuery, ListShelterMapsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterMapsQuery, ListShelterMapsQueryVariables>(ListShelterMapsDocument, options);
        }
export function useListShelterMapsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterMapsQuery, ListShelterMapsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterMapsQuery, ListShelterMapsQueryVariables>(ListShelterMapsDocument, options);
        }
export type ListShelterMapsQueryHookResult = ReturnType<typeof useListShelterMapsQuery>;
export type ListShelterMapsLazyQueryHookResult = ReturnType<typeof useListShelterMapsLazyQuery>;
export type ListShelterMapsSuspenseQueryHookResult = ReturnType<typeof useListShelterMapsSuspenseQuery>;
export type ListShelterMapsQueryResult = Apollo.QueryResult<ListShelterMapsQuery, ListShelterMapsQueryVariables>;
export const ListShelterMediasDocument = gql`
    query listShelterMedias($commonSearch: CommonSearch) {
  listMedias(commonSearch: $commonSearch) {
    items {
      id
      url
      type
      scope
      ref_id
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    `;

/**
 * __useListShelterMediasQuery__
 *
 * To run a query within a React component, call `useListShelterMediasQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterMediasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterMediasQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterMediasQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterMediasQuery, ListShelterMediasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterMediasQuery, ListShelterMediasQueryVariables>(ListShelterMediasDocument, options);
      }
export function useListShelterMediasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterMediasQuery, ListShelterMediasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterMediasQuery, ListShelterMediasQueryVariables>(ListShelterMediasDocument, options);
        }
export function useListShelterMediasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterMediasQuery, ListShelterMediasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterMediasQuery, ListShelterMediasQueryVariables>(ListShelterMediasDocument, options);
        }
export type ListShelterMediasQueryHookResult = ReturnType<typeof useListShelterMediasQuery>;
export type ListShelterMediasLazyQueryHookResult = ReturnType<typeof useListShelterMediasLazyQuery>;
export type ListShelterMediasSuspenseQueryHookResult = ReturnType<typeof useListShelterMediasSuspenseQuery>;
export type ListShelterMediasQueryResult = Apollo.QueryResult<ListShelterMediasQuery, ListShelterMediasQueryVariables>;
export const ListShelterOwnershipTransfersDocument = gql`
    query listShelterOwnershipTransfers($shelter_id: ID!, $search: CommonSearch) {
  listShelterOwnershipTransfers(shelter_id: $shelter_id, search: $search) {
    success
    error {
      code
      message
    }
    items {
      ...MinShelterOwnershipTransfer
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterOwnershipTransferFragmentDoc}`;

/**
 * __useListShelterOwnershipTransfersQuery__
 *
 * To run a query within a React component, call `useListShelterOwnershipTransfersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterOwnershipTransfersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterOwnershipTransfersQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListShelterOwnershipTransfersQuery(baseOptions: Apollo.QueryHookOptions<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables> & ({ variables: ListShelterOwnershipTransfersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables>(ListShelterOwnershipTransfersDocument, options);
      }
export function useListShelterOwnershipTransfersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables>(ListShelterOwnershipTransfersDocument, options);
        }
export function useListShelterOwnershipTransfersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables>(ListShelterOwnershipTransfersDocument, options);
        }
export type ListShelterOwnershipTransfersQueryHookResult = ReturnType<typeof useListShelterOwnershipTransfersQuery>;
export type ListShelterOwnershipTransfersLazyQueryHookResult = ReturnType<typeof useListShelterOwnershipTransfersLazyQuery>;
export type ListShelterOwnershipTransfersSuspenseQueryHookResult = ReturnType<typeof useListShelterOwnershipTransfersSuspenseQuery>;
export type ListShelterOwnershipTransfersQueryResult = Apollo.QueryResult<ListShelterOwnershipTransfersQuery, ListShelterOwnershipTransfersQueryVariables>;
export const ListShelterPeopleDocument = gql`
    query listShelterPeople($shelter_id: ID!, $search: CommonSearch) {
  listShelterPeople(shelter_id: $shelter_id, search: $search) {
    success
    error {
      code
      message
    }
    items {
      ...MinShelterPerson
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterPersonFragmentDoc}`;

/**
 * __useListShelterPeopleQuery__
 *
 * To run a query within a React component, call `useListShelterPeopleQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterPeopleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterPeopleQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *      search: // value for 'search'
 *   },
 * });
 */
export function useListShelterPeopleQuery(baseOptions: Apollo.QueryHookOptions<ListShelterPeopleQuery, ListShelterPeopleQueryVariables> & ({ variables: ListShelterPeopleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterPeopleQuery, ListShelterPeopleQueryVariables>(ListShelterPeopleDocument, options);
      }
export function useListShelterPeopleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterPeopleQuery, ListShelterPeopleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterPeopleQuery, ListShelterPeopleQueryVariables>(ListShelterPeopleDocument, options);
        }
export function useListShelterPeopleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterPeopleQuery, ListShelterPeopleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterPeopleQuery, ListShelterPeopleQueryVariables>(ListShelterPeopleDocument, options);
        }
export type ListShelterPeopleQueryHookResult = ReturnType<typeof useListShelterPeopleQuery>;
export type ListShelterPeopleLazyQueryHookResult = ReturnType<typeof useListShelterPeopleLazyQuery>;
export type ListShelterPeopleSuspenseQueryHookResult = ReturnType<typeof useListShelterPeopleSuspenseQuery>;
export type ListShelterPeopleQueryResult = Apollo.QueryResult<ListShelterPeopleQuery, ListShelterPeopleQueryVariables>;
export const ListShelterPetsMinDocument = gql`
    query listShelterPetsMin($commonSearch: CommonSearch) {
  listShelterPets(commonSearch: $commonSearch) {
    items {
      id
      pet {
        id
        name
        gender
        main_picture {
          id
          main_color {
            color
            contrast
          }
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
    `;

/**
 * __useListShelterPetsMinQuery__
 *
 * To run a query within a React component, call `useListShelterPetsMinQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterPetsMinQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterPetsMinQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterPetsMinQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>(ListShelterPetsMinDocument, options);
      }
export function useListShelterPetsMinLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>(ListShelterPetsMinDocument, options);
        }
export function useListShelterPetsMinSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>(ListShelterPetsMinDocument, options);
        }
export type ListShelterPetsMinQueryHookResult = ReturnType<typeof useListShelterPetsMinQuery>;
export type ListShelterPetsMinLazyQueryHookResult = ReturnType<typeof useListShelterPetsMinLazyQuery>;
export type ListShelterPetsMinSuspenseQueryHookResult = ReturnType<typeof useListShelterPetsMinSuspenseQuery>;
export type ListShelterPetsMinQueryResult = Apollo.QueryResult<ListShelterPetsMinQuery, ListShelterPetsMinQueryVariables>;
export const ListShelterRolesMinDocument = gql`
    query listShelterRolesMin($commonSearch: CommonSearch) {
  listShelterRoles(commonSearch: $commonSearch) {
    items {
      id
      role
      user {
        id
        first_name
        last_name
      }
    }
    success
    error {
      code
      message
    }
  }
}
    `;

/**
 * __useListShelterRolesMinQuery__
 *
 * To run a query within a React component, call `useListShelterRolesMinQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterRolesMinQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterRolesMinQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterRolesMinQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>(ListShelterRolesMinDocument, options);
      }
export function useListShelterRolesMinLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>(ListShelterRolesMinDocument, options);
        }
export function useListShelterRolesMinSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>(ListShelterRolesMinDocument, options);
        }
export type ListShelterRolesMinQueryHookResult = ReturnType<typeof useListShelterRolesMinQuery>;
export type ListShelterRolesMinLazyQueryHookResult = ReturnType<typeof useListShelterRolesMinLazyQuery>;
export type ListShelterRolesMinSuspenseQueryHookResult = ReturnType<typeof useListShelterRolesMinSuspenseQuery>;
export type ListShelterRolesMinQueryResult = Apollo.QueryResult<ListShelterRolesMinQuery, ListShelterRolesMinQueryVariables>;
export const ListShelterTasksDocument = gql`
    query listShelterTasks($commonSearch: CommonSearch) {
  listShelterTasks(commonSearch: $commonSearch) {
    items {
      ...MinShelterTask
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterTaskFragmentDoc}`;

/**
 * __useListShelterTasksQuery__
 *
 * To run a query within a React component, call `useListShelterTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterTasksQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterTasksQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterTasksQuery, ListShelterTasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterTasksQuery, ListShelterTasksQueryVariables>(ListShelterTasksDocument, options);
      }
export function useListShelterTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterTasksQuery, ListShelterTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterTasksQuery, ListShelterTasksQueryVariables>(ListShelterTasksDocument, options);
        }
export function useListShelterTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterTasksQuery, ListShelterTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterTasksQuery, ListShelterTasksQueryVariables>(ListShelterTasksDocument, options);
        }
export type ListShelterTasksQueryHookResult = ReturnType<typeof useListShelterTasksQuery>;
export type ListShelterTasksLazyQueryHookResult = ReturnType<typeof useListShelterTasksLazyQuery>;
export type ListShelterTasksSuspenseQueryHookResult = ReturnType<typeof useListShelterTasksSuspenseQuery>;
export type ListShelterTasksQueryResult = Apollo.QueryResult<ListShelterTasksQuery, ListShelterTasksQueryVariables>;
export const ListShelterWalksDocument = gql`
    query listShelterWalks($commonSearch: CommonSearch) {
  listShelterWalks(commonSearch: $commonSearch) {
    items {
      ...MinShelterWalk
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterWalkFragmentDoc}`;

/**
 * __useListShelterWalksQuery__
 *
 * To run a query within a React component, call `useListShelterWalksQuery` and pass it any options that fit your needs.
 * When your component renders, `useListShelterWalksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListShelterWalksQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListShelterWalksQuery(baseOptions?: Apollo.QueryHookOptions<ListShelterWalksQuery, ListShelterWalksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListShelterWalksQuery, ListShelterWalksQueryVariables>(ListShelterWalksDocument, options);
      }
export function useListShelterWalksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListShelterWalksQuery, ListShelterWalksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListShelterWalksQuery, ListShelterWalksQueryVariables>(ListShelterWalksDocument, options);
        }
export function useListShelterWalksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListShelterWalksQuery, ListShelterWalksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListShelterWalksQuery, ListShelterWalksQueryVariables>(ListShelterWalksDocument, options);
        }
export type ListShelterWalksQueryHookResult = ReturnType<typeof useListShelterWalksQuery>;
export type ListShelterWalksLazyQueryHookResult = ReturnType<typeof useListShelterWalksLazyQuery>;
export type ListShelterWalksSuspenseQueryHookResult = ReturnType<typeof useListShelterWalksSuspenseQuery>;
export type ListShelterWalksQueryResult = Apollo.QueryResult<ListShelterWalksQuery, ListShelterWalksQueryVariables>;
export const ListSheltersDocument = gql`
    query listShelters($commonSearch: CommonSearch) {
  listShelters(commonSearch: $commonSearch) {
    items {
      ...MinShelter
    }
    success
    error {
      code
      message
    }
    pagination {
      current_page
      page_size
      total_items
      total_pages
    }
  }
}
    ${MinShelterFragmentDoc}`;

/**
 * __useListSheltersQuery__
 *
 * To run a query within a React component, call `useListSheltersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListSheltersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListSheltersQuery({
 *   variables: {
 *      commonSearch: // value for 'commonSearch'
 *   },
 * });
 */
export function useListSheltersQuery(baseOptions?: Apollo.QueryHookOptions<ListSheltersQuery, ListSheltersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListSheltersQuery, ListSheltersQueryVariables>(ListSheltersDocument, options);
      }
export function useListSheltersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListSheltersQuery, ListSheltersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListSheltersQuery, ListSheltersQueryVariables>(ListSheltersDocument, options);
        }
export function useListSheltersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListSheltersQuery, ListSheltersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListSheltersQuery, ListSheltersQueryVariables>(ListSheltersDocument, options);
        }
export type ListSheltersQueryHookResult = ReturnType<typeof useListSheltersQuery>;
export type ListSheltersLazyQueryHookResult = ReturnType<typeof useListSheltersLazyQuery>;
export type ListSheltersSuspenseQueryHookResult = ReturnType<typeof useListSheltersSuspenseQuery>;
export type ListSheltersQueryResult = Apollo.QueryResult<ListSheltersQuery, ListSheltersQueryVariables>;
export const MyShelterAuthorizationDocument = gql`
    query myShelterAuthorization($shelter_id: ID!) {
  myShelterAuthorization(shelter_id: $shelter_id) {
    success
    error {
      code
      message
    }
    authorization {
      shelter_id
      membership_status
      permissions
    }
  }
}
    `;

/**
 * __useMyShelterAuthorizationQuery__
 *
 * To run a query within a React component, call `useMyShelterAuthorizationQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyShelterAuthorizationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMyShelterAuthorizationQuery({
 *   variables: {
 *      shelter_id: // value for 'shelter_id'
 *   },
 * });
 */
export function useMyShelterAuthorizationQuery(baseOptions: Apollo.QueryHookOptions<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables> & ({ variables: MyShelterAuthorizationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables>(MyShelterAuthorizationDocument, options);
      }
export function useMyShelterAuthorizationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables>(MyShelterAuthorizationDocument, options);
        }
export function useMyShelterAuthorizationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables>(MyShelterAuthorizationDocument, options);
        }
export type MyShelterAuthorizationQueryHookResult = ReturnType<typeof useMyShelterAuthorizationQuery>;
export type MyShelterAuthorizationLazyQueryHookResult = ReturnType<typeof useMyShelterAuthorizationLazyQuery>;
export type MyShelterAuthorizationSuspenseQueryHookResult = ReturnType<typeof useMyShelterAuthorizationSuspenseQuery>;
export type MyShelterAuthorizationQueryResult = Apollo.QueryResult<MyShelterAuthorizationQuery, MyShelterAuthorizationQueryVariables>;