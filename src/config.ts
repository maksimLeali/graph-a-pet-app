export const config = {
  baseUrl: process.env.REACT_APP_BASE_URL ?? 'http://localhost:4000/graphql',
  environment: (process.env.REACT_APP_ENV ?? 'local') as
    | 'local'
    | 'development'
    | 'staging'
    | 'production',
  defaultLanguage: process.env.REACT_APP_DEFAULT_LANGUAGE ?? 'en',
}
