import { environment } from './environments/environment'



export const config = {
  baseUrl: environment.baseUrl ?? 'https://graph-a-pet.makso.me/graphql',
  environment: environment.environment ?? 'development' ,
  defaultLanguage: 'it',
}
