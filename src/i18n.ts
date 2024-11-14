import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import _ from 'lodash'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/it'
import 'dayjs/locale/de'
import 'dayjs/locale/fr'
import 'dayjs/locale/ru'
import 'dayjs/locale/es'

import general from './i18n/translations.json'
import breeds from './i18n/breeds.json'
import { config } from '@config'
import { Paths } from './utils/types'

const lng = localStorage.getItem('lang') || 'it'

dayjs.extend(localizedFormat)

export const changeLanguageSideEffects = (lng: string) => {
  dayjs.locale(lng)
}
changeLanguageSideEffects(lng)

export type I18NKey = Paths<typeof translations.it>


const loadResources = (namespaces: { [key: string]: any }) => {
  const resources: any = {}

  // Iterate over each namespace (general, eloris, etc.)
  Object.entries(namespaces).forEach(([namespace, translations]) => {
    // Iterate over each language inside the namespace
    Object.entries(translations).forEach(([lang, translation]) => {
      // If the language doesn't exist yet, create it
      if (!resources[lang]) {
        resources[lang] = {}
      }
      // Add the namespace to the corresponding language
      resources[lang][namespace] = translation
    })
  })

  return resources
}

const translations = loadResources({
  general,
  breeds
})


i18n.use(initReactI18next).init({
  fallbackLng: config.defaultLanguage,
  debug: config.environment !== 'production',
  resources: translations,
  lng,
  ns: ['general', 'breeds'],
  defaultNS: "general",
  interpolation: {
    escapeValue: false,

  },
})

export default i18n
