import dotenv from 'dotenv'

export const config = {
  baseUrl: 'https://graph-a-pet.makso.me/graphql',
  environment: 'local' as
    | 'local'
    | 'development'
    | 'staging'
    | 'production',
  defaultLanguage: 'it',
}
