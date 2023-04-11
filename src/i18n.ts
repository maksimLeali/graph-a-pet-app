import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import _ from 'lodash'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import 'dayjs/locale/it'

import translations from './i18n/translations.json'
import { config } from './config'
import { Paths } from './utils/types'

const lng = localStorage.getItem('lang') || 'it'

dayjs.extend(localizedFormat)

export const changeLanguageSideEffects = (lng: string) => {
  dayjs.locale(lng)
}
changeLanguageSideEffects(lng)

export type I18NKey = Paths<typeof translations.it.graph_a_pet_app>

i18n.use(initReactI18next).init({
  fallbackLng: config.defaultLanguage,
  debug: config.environment !== 'production',
  resources: _.mapValues(translations, (values) => ({ translation: values.graph_a_pet_app })),
  lng,
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
