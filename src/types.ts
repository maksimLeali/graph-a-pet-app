export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  Upload: any;
};

export type Coat = {
  __typename?: 'Coat';
  id: Scalars['ID'];
  name: Scalars['String'];
  length: CoatLength;
  colors: Array<Maybe<Scalars['String']>>;
  pattern: CoatPattern;
  texture: Scalars['String'];
};

export type CoatCreate = {
  length: CoatLength;
  colors: Array<Maybe<Scalars['String']>>;
  pattern: CoatPattern;
};

export enum CoatLength {
  Short = 'SHORT',
  Medium = 'MEDIUM',
  Long = 'LONG',
  Hairless = 'HAIRLESS'
}

export enum CoatName {
  Fur = 'FUR',
  Scales = 'SCALES',
  Feathers = 'FEATHERS',
  Skin = 'SKIN',
  Shed = 'SHED',
  Coat = 'COAT'
}

export enum CoatPattern {
  Merle = 'MERLE',
  Brindle = 'BRINDLE',
  Harlequin = 'HARLEQUIN',
  Ticked = 'TICKED',
  Spotted = 'SPOTTED',
  Roan = 'ROAN',
  Tricolor = 'TRICOLOR',
  Bicolor = 'BICOLOR',
  Solid = 'SOLID',
  Colorpoint = 'COLORPOINT'
}

export type CoatUpdate = {
  length?: Maybe<CoatLength>;
  colors?: Maybe<Array<Maybe<Scalars['String']>>>;
  pattern?: Maybe<CoatPattern>;
};

export type CommonSearch = {
  page?: Maybe<Scalars['Int']>;
  page_size?: Maybe<Scalars['Int']>;
  order_by?: Maybe<Scalars['String']>;
  order_direction?: Maybe<Scalars['String']>;
  filters?: Maybe<DeepFilters>;
};

export type Coordinates = {
  __typename?: 'Coordinates';
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

export enum CustodyLevel {
  SubOwner = 'SUB_OWNER',
  Owner = 'OWNER',
  PetSitter = 'PET_SITTER'
}

export type DailyStats = {
  __typename?: 'DailyStats';
  all_users: Scalars['Int'];
  active_users: Scalars['Int'];
  all_pets: Scalars['Int'];
  all_reports: Scalars['Int'];
  daily_reports: Scalars['Int'];
  active_users_percent: Scalars['Float'];
};

export type DamnatioMemoriae = {
  __typename?: 'DamnatioMemoriae';
  id: Scalars['ID'];
  created_at: Scalars['String'];
  original_table: Scalars['String'];
  original_data?: Maybe<Scalars['JSON']>;
};

export type DamnatioMemoriaeResult = {
  __typename?: 'DamnatioMemoriaeResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  DamnatioMemoriae?: Maybe<DamnatioMemoriae>;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  active_users: Scalars['Int'];
  active_users_percent: Scalars['Float'];
  all_users: Scalars['Int'];
  all_pets: Scalars['Int'];
  labels: Array<Scalars['String']>;
  active_users_mean: Scalars['Int'];
  active_users_percent_stats: Array<Scalars['Float']>;
  active_users_stats: Array<Scalars['Int']>;
  all_pet_stats: Array<Scalars['Int']>;
  all_users_stats: Array<Scalars['Int']>;
};

export type DashboardResult = {
  __typename?: 'DashboardResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  dashboard?: Maybe<Dashboard>;
};

export type DeepFilters = {
  and?: Maybe<DeepFilters>;
  or?: Maybe<DeepFilters>;
  not?: Maybe<DeepFilters>;
  fixed?: Maybe<Array<Maybe<FixedFilter>>>;
  ranges?: Maybe<Array<Maybe<RangeFilter>>>;
  search?: Maybe<SearchFilter>;
  lists?: Maybe<Array<Maybe<ListFilter>>>;
  join?: Maybe<Array<Maybe<Join>>>;
};

export type DefaultResult = {
  __typename?: 'DefaultResult';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
};

export type DeleteResult = {
  __typename?: 'DeleteResult';
  success?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  error?: Maybe<Error>;
};

export type Error = {
  __typename?: 'Error';
  code: Scalars['String'];
  message: Scalars['String'];
  extra?: Maybe<Scalars['String']>;
};

export type Filters = {
  fixed?: Maybe<Array<Maybe<FixedFilter>>>;
  ranges?: Maybe<Array<Maybe<RangeFilter>>>;
  lists?: Maybe<Array<Maybe<ListFilter>>>;
  join?: Maybe<Array<Maybe<Join>>>;
  search?: Maybe<Array<Maybe<SearchFilter>>>;
};

export type FixedFilter = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export enum FrequencyUnit {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Yearly = 'YEARLY'
}

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  NotSaid = 'NOT_SAID'
}

export type HealthCard = {
  __typename?: 'HealthCard';
  id: Scalars['ID'];
  pet: Pet;
  treatments: PaginatedTreatments;
  notes: Array<Maybe<Scalars['String']>>;
};


export type HealthCardTreatmentsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};

export type HealthCardCreate = {
  pet_id: Scalars['ID'];
};

export type HealthCardResult = {
  __typename?: 'HealthCardResult';
  health_card?: Maybe<HealthCard>;
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
};

export type HealthCardUpdate = {
  notes: Array<Maybe<Scalars['String']>>;
};


export type Join = {
  key: Scalars['String'];
  value: DeepFilters;
};

export type ListFilter = {
  key?: Maybe<Scalars['String']>;
  value: Array<Maybe<Scalars['String']>>;
};

export type MainColor = {
  __typename?: 'MainColor';
  color: Scalars['String'];
  contrast: Scalars['String'];
};

export type MainColorCreate = {
  color: Scalars['String'];
  contrast?: Maybe<Scalars['String']>;
};

export type Media = {
  __typename?: 'Media';
  id: Scalars['ID'];
  url: Scalars['String'];
  type: Scalars['String'];
  scope: Scalars['String'];
  main_color?: Maybe<MainColor>;
  main_colors?: Maybe<Array<MainColor>>;
  ref_id: Scalars['String'];
};

export type MediaCreate = {
  url: Scalars['String'];
  scope: Scalars['String'];
  ref_id: Scalars['String'];
  main_colors?: Maybe<Array<Maybe<MainColorCreate>>>;
  main_color?: Maybe<MainColorCreate>;
  type: Scalars['String'];
};

export type MediaResult = {
  __typename?: 'MediaResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  media?: Maybe<Media>;
};

export type MediaUpdate = {
  url?: Maybe<Scalars['String']>;
  scope?: Maybe<Scalars['String']>;
  ref_id?: Maybe<Scalars['String']>;
  main_colors?: Maybe<Array<Maybe<MainColorCreate>>>;
  main_color?: Maybe<MainColorCreate>;
  type?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: UserResult;
  signUp: UserResult;
  updateUser: UserResult;
  deleteUser: DeleteResult;
  updateMe: UserResult;
  createPet: PetResult;
  updatePet: PetResult;
  deletePet: DeleteResult;
  deleteOwnership: DeleteResult;
  updateOwnership: OwnershipResult;
  login: NewTokenResult;
  logout: Scalars['Boolean'];
  addPet: PetResult;
  addPetToUser: PetAddedResult;
  addPetToMe: PetAddedResult;
  refreshToken: NewTokenResult;
  createHealthCard: HealthCardResult;
  updateHealthCard: HealthCardResult;
  createTreatment: TreatmentResult;
  updateTreatment: TreatmentResult;
  createReport: ReportResult;
  updateReport: ReportResult;
  updateMedia: MediaResult;
  createMedia: MediaResult;
  restoreMemoriae: RestoredResult;
  respondToReport: ReportResult;
};


export type MutationCreateUserArgs = {
  data: UserCreate;
};


export type MutationSignUpArgs = {
  data: UserCreate;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  data: UserUpdate;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateMeArgs = {
  data: UserUpdate;
};


export type MutationCreatePetArgs = {
  data: PetCreate;
};


export type MutationUpdatePetArgs = {
  id: Scalars['ID'];
  data: PetUpdate;
};


export type MutationDeletePetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteOwnershipArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateOwnershipArgs = {
  id: Scalars['ID'];
  data: OwnershipUpdate;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationAddPetArgs = {
  pet: PetCreate;
};


export type MutationAddPetToUserArgs = {
  pet: PetCreate;
  userId: Scalars['String'];
};


export type MutationAddPetToMeArgs = {
  pet: PetCreate;
  custodyLevel?: Maybe<CustodyLevel>;
};


export type MutationCreateHealthCardArgs = {
  data: HealthCardCreate;
};


export type MutationUpdateHealthCardArgs = {
  id: Scalars['ID'];
  data: HealthCardUpdate;
};


export type MutationCreateTreatmentArgs = {
  data: TreatmentCreate;
};


export type MutationUpdateTreatmentArgs = {
  id: Scalars['ID'];
  data: TreatmentUpdate;
};


export type MutationCreateReportArgs = {
  data: ReportCreate;
};


export type MutationUpdateReportArgs = {
  id: Scalars['ID'];
  data: ReportUpdate;
};


export type MutationUpdateMediaArgs = {
  id: Scalars['ID'];
  data: MediaUpdate;
};


export type MutationCreateMediaArgs = {
  data: MediaCreate;
};


export type MutationRestoreMemoriaeArgs = {
  id: Scalars['ID'];
};


export type MutationRespondToReportArgs = {
  id: Scalars['ID'];
  reporter: ReporterCreate;
};

export type NewOwnership = {
  __typename?: 'NewOwnership';
  pet: Pet;
  ownership: Ownership;
};

export type NewTokenResult = {
  __typename?: 'NewTokenResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  token?: Maybe<Scalars['String']>;
  user?: Maybe<User>;
};

export type Ownership = {
  __typename?: 'Ownership';
  id: Scalars['ID'];
  user: User;
  pet: Pet;
  custody_level: CustodyLevel;
};

export type OwnershipResult = {
  __typename?: 'OwnershipResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  ownership?: Maybe<Ownership>;
};

export type OwnershipUpdate = {
  custody_level: CustodyLevel;
};

export type OwnershipsResult = {
  __typename?: 'OwnershipsResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  ownerships: Array<Maybe<Ownership>>;
};

export type PaginatedDamnationesMemoriae = {
  __typename?: 'PaginatedDamnationesMemoriae';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  items: Array<Maybe<DamnatioMemoriae>>;
  pagination: Pagination;
};

export type PaginatedHealthCards = {
  __typename?: 'PaginatedHealthCards';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
  items: Array<Maybe<HealthCard>>;
  pagination: Pagination;
};

export type PaginatedMedias = {
  __typename?: 'PaginatedMedias';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
  items: Array<Maybe<Media>>;
  pagination: Pagination;
};

export type PaginatedOwnerships = {
  __typename?: 'PaginatedOwnerships';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
  items: Array<Maybe<Ownership>>;
  pagination: Pagination;
};

export type PaginatedPets = {
  __typename?: 'PaginatedPets';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  items: Array<Maybe<Pet>>;
  pagination: Pagination;
};

export type PaginatedReports = {
  __typename?: 'PaginatedReports';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
  items: Array<Maybe<Report>>;
  pagination: Pagination;
};

export type PaginatedTreatments = {
  __typename?: 'PaginatedTreatments';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
  items: Array<Maybe<Treatment>>;
  pagination: Pagination;
};

export type PaginatedUsers = {
  __typename?: 'PaginatedUsers';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
  items: Array<Maybe<User>>;
  pagination: Pagination;
};

/** how a list is owganized by how many items has been found, in which page we are, the number of element per page and how many pages there are */
export type Pagination = {
  __typename?: 'Pagination';
  total_items?: Maybe<Scalars['Int']>;
  total_pages?: Maybe<Scalars['Int']>;
  current_page?: Maybe<Scalars['Int']>;
  page_size?: Maybe<Scalars['Int']>;
};

export type Pet = {
  __typename?: 'Pet';
  id: Scalars['ID'];
  name: Scalars['String'];
  ownerships?: Maybe<PaginatedOwnerships>;
  body: PetBody;
  birthday: Scalars['String'];
  neutered: Scalars['Boolean'];
  gender: Gender;
  health_card?: Maybe<HealthCard>;
  chip_code?: Maybe<Scalars['String']>;
  weight_kg?: Maybe<Scalars['Float']>;
  temperament?: Maybe<Scalars['String']>;
  diet?: Maybe<Array<Maybe<Scalars['String']>>>;
  intollerance?: Maybe<Array<Maybe<Scalars['String']>>>;
  disciplines?: Maybe<Array<Maybe<Scalars['String']>>>;
  main_picture?: Maybe<Media>;
};


export type PetOwnershipsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};

export type PetAddedResult = {
  __typename?: 'PetAddedResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  data?: Maybe<NewOwnership>;
};

export type PetBody = {
  __typename?: 'PetBody';
  id: Scalars['ID'];
  coat: Coat;
  image: Media;
  tags: Array<Maybe<Tag>>;
  family: PetFamily;
  breed: Scalars['String'];
};

export type PetBodyCreate = {
  family: PetFamily;
  breed: Scalars['String'];
  coat: CoatCreate;
};

export type PetBodyUpdate = {
  family?: Maybe<PetFamily>;
  breed?: Maybe<Scalars['String']>;
  coat?: Maybe<CoatUpdate>;
};

export type PetCreate = {
  name: Scalars['String'];
  body: PetBodyCreate;
  birthday: Scalars['String'];
  neutered: Scalars['Boolean'];
  gender: Gender;
  chip_code?: Maybe<Scalars['String']>;
  weight_kg?: Maybe<Scalars['Float']>;
  temperament?: Maybe<Scalars['String']>;
  diet?: Maybe<Array<Maybe<Scalars['String']>>>;
  intollerance?: Maybe<Array<Maybe<Scalars['String']>>>;
  disciplines?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum PetFamily {
  Reptile = 'REPTILE',
  Canine = 'CANINE',
  Feline = 'FELINE',
  Birds = 'BIRDS',
  Fish = 'FISH'
}

export type PetResult = {
  __typename?: 'PetResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  pet?: Maybe<Pet>;
};

export type PetUpdate = {
  name?: Maybe<Scalars['String']>;
  body?: Maybe<PetBodyUpdate>;
  birthday?: Maybe<Scalars['String']>;
  neutered?: Maybe<Scalars['Boolean']>;
  gender?: Maybe<Gender>;
  chip_code?: Maybe<Scalars['String']>;
  weight_kg?: Maybe<Scalars['Float']>;
  temperament?: Maybe<Scalars['String']>;
  diet?: Maybe<Array<Maybe<Scalars['String']>>>;
  intollerance?: Maybe<Array<Maybe<Scalars['String']>>>;
  disciplines?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type PetsResult = {
  __typename?: 'PetsResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  pets: Array<Maybe<Pet>>;
};

export type Query = {
  __typename?: 'Query';
  listUsers: PaginatedUsers;
  getUser: UserResult;
  listPets: PaginatedPets;
  getPet: PetResult;
  me: UserResult;
  getOwnership: OwnershipResult;
  listOwnerships: PaginatedOwnerships;
  listHealthCards: PaginatedHealthCards;
  getHealthCard?: Maybe<HealthCardResult>;
  getTreatment?: Maybe<TreatmentResult>;
  listTreatments: PaginatedTreatments;
  getReport?: Maybe<ReportResult>;
  listReports: PaginatedReports;
  getMedia: MediaResult;
  listMedias: PaginatedMedias;
  getDashboard: DashboardResult;
  getRealTimeStatistic: RealTimeStatisticResult;
  getGroupedStatistics: StatisticsResult;
  getDamnatioMemoriae?: Maybe<DamnatioMemoriaeResult>;
  listDamnationesMemoriae?: Maybe<PaginatedDamnationesMemoriae>;
  getUserDashboard: UserDashboardResult;
};


export type QueryListUsersArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryListPetsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryGetPetArgs = {
  id: Scalars['ID'];
};


export type QueryGetOwnershipArgs = {
  id: Scalars['ID'];
};


export type QueryListOwnershipsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryListHealthCardsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryGetHealthCardArgs = {
  id: Scalars['ID'];
};


export type QueryGetTreatmentArgs = {
  id: Scalars['ID'];
};


export type QueryListTreatmentsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryGetReportArgs = {
  id: Scalars['ID'];
};


export type QueryListReportsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryGetMediaArgs = {
  id: Scalars['ID'];
};


export type QueryListMediasArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type QueryGetGroupedStatisticsArgs = {
  date_from: Scalars['String'];
  date_to?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
};


export type QueryGetDamnatioMemoriaeArgs = {
  id: Scalars['ID'];
};


export type QueryListDamnationesMemoriaeArgs = {
  commonSearch?: Maybe<CommonSearch>;
};

export type RangeFilter = {
  key: Scalars['String'];
  value?: Maybe<RangeFilterValue>;
};

export type RangeFilterValue = {
  min?: Maybe<Scalars['String']>;
  max?: Maybe<Scalars['String']>;
};

export type RealTimeStatisticResult = {
  __typename?: 'RealTimeStatisticResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  statistics?: Maybe<DailyStats>;
};

export type Report = {
  __typename?: 'Report';
  id: Scalars['ID'];
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
  type: ReportType;
  place: Scalars['String'];
  coordinates: Coordinates;
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  reporter: Reporter;
  responders: Array<Maybe<Reporter>>;
  notes?: Maybe<Array<Maybe<Scalars['String']>>>;
  pet?: Maybe<Pet>;
};

export type ReportCreate = {
  type: ReportType;
  place: Scalars['String'];
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  reporter: ReporterCreate;
  notes?: Maybe<Array<Maybe<Scalars['String']>>>;
  pet_id?: Maybe<Scalars['String']>;
};

export type ReportResult = {
  __typename?: 'ReportResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  report?: Maybe<Report>;
};

export enum ReportType {
  Missing = 'MISSING',
  Found = 'FOUND'
}

export type ReportUpdate = {
  place?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  notes?: Maybe<Array<Maybe<Scalars['String']>>>;
  responders?: Maybe<Array<Maybe<ReporterCreate>>>;
};

export type Reporter = {
  __typename?: 'Reporter';
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  user_id?: Maybe<Scalars['String']>;
};

export type ReporterCreate = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  user_id?: Maybe<Scalars['String']>;
};

export type RestoredResult = {
  __typename?: 'RestoredResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  table?: Maybe<Scalars['String']>;
  restored?: Maybe<Scalars['JSON']>;
};

export type SearchFilter = {
  value?: Maybe<Scalars['String']>;
  fields?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Statistic = {
  __typename?: 'Statistic';
  id: Scalars['ID'];
  date: Scalars['String'];
  all_user: Scalars['Int'];
  all_pets: Scalars['Int'];
  all_active_users: Scalars['Int'];
};

export type StatisticResult = {
  __typename?: 'StatisticResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  statistic?: Maybe<Statistic>;
};

export type Statistics = {
  __typename?: 'Statistics';
  labels: Array<Scalars['String']>;
  active_users_mean: Array<Scalars['Float']>;
  active_users_min: Array<Scalars['Float']>;
  active_users_max: Array<Scalars['Float']>;
  all_users: Array<Scalars['Float']>;
  all_pets: Array<Scalars['Float']>;
};

export type StatisticsResult = {
  __typename?: 'StatisticsResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  statistics?: Maybe<Statistics>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  text: Scalars['String'];
};

export type Treatment = {
  __typename?: 'Treatment';
  id: Scalars['ID'];
  created_at: Scalars['String'];
  type: TreatmentType;
  name: Scalars['String'];
  date: Scalars['String'];
  logs?: Maybe<Array<Maybe<Scalars['String']>>>;
  frequency_value?: Maybe<Scalars['Int']>;
  frequency_times?: Maybe<Scalars['Int']>;
  frequency_unit?: Maybe<FrequencyUnit>;
  booster?: Maybe<Treatment>;
  health_card?: Maybe<HealthCard>;
};

export type TreatmentCreate = {
  health_card_id: Scalars['ID'];
  name: Scalars['String'];
  date: Scalars['String'];
  type: TreatmentType;
  logs?: Maybe<Array<Maybe<Scalars['String']>>>;
  booster_date?: Maybe<Scalars['String']>;
  frequency_times?: Maybe<Scalars['Int']>;
  frequency_value?: Maybe<Scalars['Int']>;
  frequency_unit?: Maybe<FrequencyUnit>;
};

export type TreatmentResult = {
  __typename?: 'TreatmentResult';
  treatment?: Maybe<Treatment>;
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Error>;
};

export enum TreatmentType {
  Vaccine = 'VACCINE',
  Antiparasitic = 'ANTIPARASITIC',
  Tablet = 'TABLET',
  Operation = 'OPERATION',
  Reminder = 'REMINDER'
}

export type TreatmentUpdate = {
  logs?: Maybe<Array<Maybe<Scalars['String']>>>;
  date?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  delete_old?: Maybe<Scalars['Boolean']>;
  booster_date?: Maybe<Scalars['String']>;
  type?: Maybe<TreatmentType>;
  frequency_times?: Maybe<Scalars['Int']>;
  frequency_value?: Maybe<Scalars['Int']>;
  frequency_unit?: Maybe<FrequencyUnit>;
};


export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  role: UserRole;
  created_at: Scalars['String'];
  ownerships?: Maybe<PaginatedOwnerships>;
  pets_owned: Scalars['Int'];
  pets_on_loan: Scalars['Int'];
  last_activity?: Maybe<Scalars['String']>;
  profile_picture?: Maybe<Media>;
  reports?: Maybe<PaginatedReports>;
};


export type UserOwnershipsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type UserReportsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};

export type UserCreate = {
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserDashboard = {
  __typename?: 'UserDashboard';
  user_id?: Maybe<Scalars['String']>;
  ownerships?: Maybe<PaginatedOwnerships>;
  reports?: Maybe<PaginatedReports>;
};


export type UserDashboardOwnershipsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};


export type UserDashboardReportsArgs = {
  commonSearch?: Maybe<CommonSearch>;
};

export type UserDashboardResult = {
  __typename?: 'UserDashboardResult';
  dashboard?: Maybe<UserDashboard>;
  error?: Maybe<Error>;
  success?: Maybe<Scalars['Boolean']>;
};

export type UserResult = {
  __typename?: 'UserResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  user?: Maybe<User>;
};

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN'
}

export type UserUpdate = {
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  last_activity?: Maybe<Scalars['String']>;
};

export type UsersResult = {
  __typename?: 'UsersResult';
  success: Scalars['Boolean'];
  error?: Maybe<Error>;
  users: Array<Maybe<User>>;
};
