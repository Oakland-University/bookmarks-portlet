import i18n from 'i18next'
import Fetch from 'i18next-fetch-backend'
import Cache from 'i18next-localstorage-cache'
import LanguageDetector from 'i18next-browser-languagedetector'

const translateURL =
  '/translations/api/v1/locales/bookmarks/{{lng}}/{{ns}}.json'

localStorage.clear()

i18n.use(Fetch).use(Cache).use(LanguageDetector).init({
  fallbackLng: 'en',
  // have a common namespace used around the full app
  ns: ['view'],
  defaultNS: 'view',

  load: 'all',
  backend: {
    loadPath: translateURL
  },
  interpolation: {
    formatSeparator: ',',
    format: function(value, format, lng) {
      if (Object.is(format, 'uppercase')) {
        return value.toUpperCase()
      } else {
        return value
      }
    }
  }
})

export default i18n
