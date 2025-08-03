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
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  type: TreatmentType;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPet: PetResult;
  addPetToMe: PetAddedResult;
  addPetToUser: PetAddedResult;
  checkCode: CodeValidationResult;
  createCode: CodeResult;
  createHealthCard: HealthCardResult;
  createMedia: MediaResult;
  createPet: PetResult;
  createReport: ReportResult;
  createTreatment: TreatmentResult;
  createUser: UserResult;
  deleteOwnership: DeleteResult;
  deletePet: DeleteResult;
  deleteUser: DeleteResult;
  linkPetToMe: OwnershipResult;
  linkPetToUser: OwnershipResult;
  login: NewTokenResult;
  logout: Scalars['Boolean']['output'];
  refreshToken: NewTokenResult;
  resendCode: GenericResult;
  respondToReport: ReportResult;
  restoreMemoriae: RestoredResult;
  signUp: UserResult;
  updateHealthCard: HealthCardResult;
  updateMe: UserResult;
  updateMedia: MediaResult;
  updateOwnership: OwnershipResult;
  updatePet: PetResult;
  updateReport: ReportResult;
  updateTreatment: TreatmentResult;
  updateUser: UserResult;
  verifyUser: NewTokenResult;
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


export type MutationCheckCodeArgs = {
  code: Scalars['String']['input'];
};


export type MutationCreateCodeArgs = {
  data: CodeCreate;
};


export type MutationCreateHealthCardArgs = {
  data: HealthCardCreate;
};


export type MutationCreateMediaArgs = {
  data: MediaCreate;
};


export type MutationCreatePetArgs = {
  data: PetCreate;
};


export type MutationCreateReportArgs = {
  data: ReportCreate;
};


export type MutationCreateTreatmentArgs = {
  data: TreatmentCreate;
};


export type MutationCreateUserArgs = {
  data: UserCreate;
};


export type MutationDeleteOwnershipArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePetArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
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


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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


export type MutationSignUpArgs = {
  data: UserCreate;
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


export type MutationUpdateTreatmentArgs = {
  data: TreatmentUpdate;
  id: Scalars['ID']['input'];
};


export type MutationUpdateUserArgs = {
  data: UserUpdate;
  id: Scalars['ID']['input'];
};


export type MutationVerifyUserArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
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

export type Ownership = {
  __typename?: 'Ownership';
  custody_level: CustodyLevel;
  id: Scalars['ID']['output'];
  pet: Pet;
  user: User;
};

export type OwnershipResult = {
  __typename?: 'OwnershipResult';
  error?: Maybe<Error>;
  ownership?: Maybe<Ownership>;
  success: Scalars['Boolean']['output'];
};

export type OwnershipUpdate = {
  custody_level: CustodyLevel;
};

export type OwnershipsResult = {
  __typename?: 'OwnershipsResult';
  error?: Maybe<Error>;
  ownerships: Array<Maybe<Ownership>>;
  success: Scalars['Boolean']['output'];
};

export type PaginatedCodes = {
  __typename?: 'PaginatedCodes';
  error?: Maybe<Error>;
  items: Array<Maybe<Code>>;
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

export type PaginatedMedias = {
  __typename?: 'PaginatedMedias';
  error?: Maybe<Error>;
  items: Array<Maybe<Media>>;
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

export type PaginatedReports = {
  __typename?: 'PaginatedReports';
  error?: Maybe<Error>;
  items: Array<Maybe<Report>>;
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
  birthday: Scalars['String']['output'];
  breed: Scalars['String']['output'];
  chip_code?: Maybe<Scalars['String']['output']>;
  coat_length: CoatLength;
  diet?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  disciplines?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  gender: Gender;
  health_card?: Maybe<HealthCard>;
  id: Scalars['ID']['output'];
  intollerance?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  main_picture?: Maybe<Media>;
  name: Scalars['String']['output'];
  neutered: Scalars['Boolean']['output'];
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
  birthday: Scalars['String']['input'];
  breed: Scalars['String']['input'];
  chip_code?: InputMaybe<Scalars['String']['input']>;
  coat_length?: InputMaybe<CoatLength>;
  diet?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  disciplines?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  gender: Gender;
  intollerance?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name: Scalars['String']['input'];
  neutered: Scalars['Boolean']['input'];
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

export type PetsResult = {
  __typename?: 'PetsResult';
  error?: Maybe<Error>;
  pets: Array<Maybe<Pet>>;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  getCode: CodeResult;
  getDamnatioMemoriae?: Maybe<DamnatioMemoriaeResult>;
  getDashboard: DashboardResult;
  getGroupedStatistics: StatisticsResult;
  getHealthCard?: Maybe<HealthCardResult>;
  getMedia: MediaResult;
  getOrCreateCode?: Maybe<CodeResult>;
  getOwnership: OwnershipResult;
  getPet: PetResult;
  getRealTimeStatistic: RealTimeStatisticResult;
  getReport?: Maybe<ReportResult>;
  getTreatment?: Maybe<TreatmentResult>;
  getUser: UserResult;
  getUserDashboard: UserDashboardResult;
  listCodes: PaginatedCodes;
  listDamnationesMemoriae?: Maybe<PaginatedDamnationesMemoriae>;
  listHealthCards: PaginatedHealthCards;
  listMedias: PaginatedMedias;
  listMyPets: PaginatedPets;
  listMyTreatments: PaginatedTreatments;
  listOwnerships: PaginatedOwnerships;
  listPets: PaginatedPets;
  listReports: PaginatedReports;
  listTreatments: PaginatedTreatments;
  listUsers: PaginatedUsers;
  me: UserResult;
};


export type QueryGetCodeArgs = {
  id: Scalars['ID']['input'];
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


export type QueryGetMediaArgs = {
  id: Scalars['ID']['input'];
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


export type QueryGetReportArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTreatmentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListCodesArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListDamnationesMemoriaeArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListHealthCardsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListMediasArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListMyPetsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListMyTreatmentsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListOwnershipsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListPetsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListReportsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListTreatmentsArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
};


export type QueryListUsersArgs = {
  commonSearch?: InputMaybe<CommonSearch>;
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

export type SearchFilter = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  value?: InputMaybe<Scalars['String']['input']>;
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

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type Treatment = {
  __typename?: 'Treatment';
  booster?: Maybe<Treatment>;
  created_at: Scalars['String']['output'];
  date: Scalars['String']['output'];
  duration?: Maybe<TreatmentDuration>;
  frequency_times?: Maybe<Scalars['Int']['output']>;
  frequency_unit?: Maybe<FrequencyUnit>;
  frequency_value?: Maybe<Scalars['Int']['output']>;
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
  frequency_times?: InputMaybe<Scalars['Int']['input']>;
  frequency_unit?: InputMaybe<FrequencyUnit>;
  frequency_value?: InputMaybe<Scalars['Int']['input']>;
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
  Operation = 'OPERATION',
  Reminder = 'REMINDER',
  Tablet = 'TABLET',
  Training = 'TRAINING',
  Vaccine = 'VACCINE'
}

export type TreatmentUpdate = {
  booster_date?: InputMaybe<Scalars['String']['input']>;
  date?: InputMaybe<Scalars['String']['input']>;
  delete_old?: InputMaybe<Scalars['Boolean']['input']>;
  frequency_times?: InputMaybe<Scalars['Int']['input']>;
  frequency_unit?: InputMaybe<FrequencyUnit>;
  frequency_value?: InputMaybe<Scalars['Int']['input']>;
  logs?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TreatmentType>;
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

export enum TreatmentDuration {
  HalfHour = 'HALF_HOUR',
  Hour = 'HOUR',
  HourAndHalf = 'HOUR_AND_HALF',
  QuarterHour = 'QUARTER_HOUR',
  TenMinutes = 'TEN_MINUTES',
  ThreeQuarter = 'THREE_QUARTER',
  TwoHours = 'TWO_HOURS'
}

export type FullReportFragment = { __typename?: 'Report', id: string, notes?: Array<string | null> | null, place: string, type: ReportType, date: string, medias?: Array<{ __typename?: 'Media', id: string, url: string } | null> | null, reporter: { __typename?: 'Reporter', email: string, first_name: string, last_name: string, user_id?: string | null }, responders: Array<{ __typename?: 'Reporter', email: string } | null>, coordinates: { __typename?: 'Coordinates', latitude?: number | null, longitude?: number | null }, pet?: { __typename?: 'Pet', id: string, name: string, years?: number | null, weight_kg?: number | null, gender: Gender, breed: string, main_picture?: { __typename?: 'Media', id: string } | null } | null };

export type MinReportFragment = { __typename?: 'Report', id: string, place: string, latitude: number, longitude: number, created_at: string, type: ReportType, date: string, reporter: { __typename?: 'Reporter', email: string, user_id?: string | null } };

export type AppointmentFragment = { __typename?: 'Treatment', id: string, date: string, type: TreatmentType, name: string, duration?: TreatmentDuration | null, health_card?: { __typename?: 'HealthCard', pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string } | null } | null } } | null };

export type DashboardPetFragment = { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, health_card?: { __typename?: 'HealthCard', id: string, treatments: { __typename?: 'PaginatedTreatments', success?: boolean | null, items: Array<{ __typename?: 'Treatment', id: string, date: string, name: string, type: TreatmentType } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } } | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type FullPetFragment = { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, breed: string, coat_length: CoatLength, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, pictures?: { __typename?: 'PaginatedMedias', items: Array<{ __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null> } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type FullTreatmentFragment = { __typename?: 'Treatment', id: string, name: string, date: string, logs?: Array<string | null> | null, type: TreatmentType, frequency_unit?: FrequencyUnit | null, frequency_value?: number | null, frequency_times?: number | null, booster?: { __typename?: 'Treatment', id: string } | null, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string, name: string, type: TreatmentType } | null> | null };

export type MinPetFragment = { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null };

export type MinUserFragment = { __typename?: 'User', id: string, role: UserRole, first_name: string, last_name: string, email: string, profile_picture?: { __typename?: 'Media', id: string } | null };

export type PetMinSubOwnerFragment = { __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } };

export type CreateMediaMutationVariables = Exact<{
  data: MediaCreate;
}>;


export type CreateMediaMutation = { __typename?: 'Mutation', createMedia: { __typename?: 'MediaResult', media?: { __typename?: 'Media', id: string, ref_id: string, type: string, scope: string } | null } };

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


export type GetReportQuery = { __typename?: 'Query', getReport?: { __typename?: 'ReportResult', success: boolean, report?: { __typename?: 'Report', id: string, notes?: Array<string | null> | null, place: string, type: ReportType, date: string, medias?: Array<{ __typename?: 'Media', id: string, url: string } | null> | null, reporter: { __typename?: 'Reporter', email: string, first_name: string, last_name: string, user_id?: string | null }, responders: Array<{ __typename?: 'Reporter', email: string } | null>, coordinates: { __typename?: 'Coordinates', latitude?: number | null, longitude?: number | null }, pet?: { __typename?: 'Pet', id: string, name: string, years?: number | null, weight_kg?: number | null, gender: Gender, breed: string, main_picture?: { __typename?: 'Media', id: string } | null } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } | null };

export type ListReportsQueryVariables = Exact<{
  commonSearch: CommonSearch;
}>;


export type ListReportsQuery = { __typename?: 'Query', listReports: { __typename?: 'PaginatedReports', success?: boolean | null, items: Array<{ __typename?: 'Report', id: string, place: string, latitude: number, longitude: number, created_at: string, type: ReportType, date: string, reporter: { __typename?: 'Reporter', email: string, user_id?: string | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', page_size?: number | null, total_items?: number | null } } };

export type CreateTreatmentMutationVariables = Exact<{
  treatment: TreatmentCreate;
}>;


export type CreateTreatmentMutation = { __typename?: 'Mutation', createTreatment: { __typename?: 'TreatmentResult', success?: boolean | null, error?: { __typename?: 'Error', extra?: string | null, code: string, message: string } | null, treatment?: { __typename?: 'Treatment', id: string, name: string, date: string, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string } | null> | null } | null } };

export type GetTreatmentQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetTreatmentQuery = { __typename?: 'Query', getTreatment?: { __typename?: 'TreatmentResult', error?: { __typename?: 'Error', code: string, message: string } | null, treatment?: { __typename?: 'Treatment', id: string, name: string, date: string, logs?: Array<string | null> | null, type: TreatmentType, frequency_unit?: FrequencyUnit | null, frequency_value?: number | null, frequency_times?: number | null, booster?: { __typename?: 'Treatment', id: string } | null, related?: Array<{ __typename?: 'MinTreatment', id: string, date: string, name: string, type: TreatmentType } | null> | null } | null } | null };

export type ListMyTreatmentsQueryVariables = Exact<{
  commonSearch: CommonSearch;
}>;


export type ListMyTreatmentsQuery = { __typename?: 'Query', listMyTreatments: { __typename?: 'PaginatedTreatments', success?: boolean | null, items: Array<{ __typename?: 'Treatment', id: string, date: string, type: TreatmentType, name: string, duration?: TreatmentDuration | null, health_card?: { __typename?: 'HealthCard', pet: { __typename?: 'Pet', id: string, name: string, main_picture?: { __typename?: 'Media', id: string, main_color?: { __typename?: 'MainColor', color: string } | null } | null } } | null } | null>, error?: { __typename?: 'Error', code: string, message: string } | null, pagination: { __typename?: 'Pagination', page_size?: number | null, total_items?: number | null } } };

export type GetUserDashboardQueryVariables = Exact<{
  date_from: Scalars['String']['input'];
  date_to: Scalars['String']['input'];
}>;


export type GetUserDashboardQuery = { __typename?: 'Query', getUserDashboard: { __typename?: 'UserDashboardResult', success?: boolean | null, dashboard?: { __typename?: 'UserDashboard', ownerships?: { __typename?: 'PaginatedOwnerships', success?: boolean | null, items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, health_card?: { __typename?: 'HealthCard', id: string, treatments: { __typename?: 'PaginatedTreatments', success?: boolean | null, items: Array<{ __typename?: 'Treatment', id: string, date: string, name: string, type: TreatmentType } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } } | null, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } | null, reports?: { __typename?: 'PaginatedReports', success?: boolean | null, items: Array<{ __typename?: 'Report', id: string, place: string, latitude: number, longitude: number, created_at: string, type: ReportType, date: string, reporter: { __typename?: 'Reporter', email: string, user_id?: string | null } } | null>, error?: { __typename?: 'Error', code: string, message: string } | null } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type GetOrCreateQueryVariables = Exact<{
  ref_id: Scalars['String']['input'];
  ref_table: Scalars['String']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetOrCreateQuery = { __typename?: 'Query', getOrCreateCode?: { __typename?: 'CodeResult', success: boolean, error?: { __typename?: 'Error', code: string, message: string } | null, code?: { __typename?: 'Code', id: string, code: string, ref_id: string, ref_table: string } | null } | null };

export type GetPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetPetQuery = { __typename?: 'Query', getPet: { __typename?: 'PetResult', success: boolean, pet?: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

export type AddPetToMeMutationVariables = Exact<{
  data: PetCreate;
  custodyLevel?: InputMaybe<CustodyLevel>;
}>;


export type AddPetToMeMutation = { __typename?: 'Mutation', addPetToMe: { __typename?: 'PetAddedResult', data?: { __typename?: 'NewOwnership', pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null } };

export type CheckCodeMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type CheckCodeMutation = { __typename?: 'Mutation', checkCode: { __typename?: 'CodeValidationResult', success: boolean, is_valid?: boolean | null, error?: { __typename?: 'Error', code: string, message: string } | null, code?: { __typename?: 'Code', id: string, code: string, ref_id: string, ref_table: string } | null } };

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


export type LinkPetToMeMutation = { __typename?: 'Mutation', linkPetToMe: { __typename?: 'OwnershipResult', success: boolean, ownership?: { __typename?: 'Ownership', id: string, custody_level: CustodyLevel, pet: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } } | null, error?: { __typename?: 'Error', message: string, code: string } | null } };

export type GetFullPetQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFullPetQuery = { __typename?: 'Query', getPet: { __typename?: 'PetResult', success: boolean, pet?: { __typename?: 'Pet', name: string, id: string, weight_kg?: number | null, birthday: string, gender: Gender, neutered: boolean, breed: string, coat_length: CoatLength, main_picture?: { __typename?: 'Media', id: string, url: string, ref_id: string, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null } | null, ownerships?: { __typename?: 'PaginatedOwnerships', items: Array<{ __typename?: 'Ownership', id: string, custody_level: CustodyLevel, user: { __typename?: 'User', id: string, first_name: string, email: string, last_name: string, profile_picture?: { __typename?: 'Media', id: string, scope: string, main_colors?: Array<{ __typename?: 'MainColor', color: string, contrast: string }> | null, main_color?: { __typename?: 'MainColor', color: string, contrast: string } | null } | null } } | null> } | null } | null, error?: { __typename?: 'Error', code: string, message: string } | null } };

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
      commonSearch: {order_by: "date", order_direction: "asc", filters: {ranges: [{key: "date", value: {min: $date_from, max: $date_to}}]}}
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
  frequency_unit
  frequency_value
  frequency_times
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
export const GetFullPetDocument = gql`
    query getFullPet($id: ID!) {
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