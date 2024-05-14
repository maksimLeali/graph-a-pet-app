

const env = import.meta.env


export const config = {
  baseUrl: env.VITE_BASE_URL ?? 'https://graph-a-pet.makso.me/graphql',
  environment: env.MODE ?? 'development' ,
  defaultLanguage: env.VITE_DEFAULT_LANGUAGE ??  'it',
}

console.log(config)