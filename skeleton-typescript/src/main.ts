import 'bootstrap';
import {Aurelia} from 'aurelia-framework';
import * as Backend from 'i18next-xhr-backend';
import * as LngDetector from 'i18next-browser-languagedetector';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin('aurelia-html-import-template-loader')
  aurelia.use.plugin('aurelia-i18n', (instance: any) => {
      // Fails on the line below
      instance.i18next
        .use(Backend)
        .use(LngDetector);

      return instance.setup({
        backend: {
          loadPath: '{{lng}}/{{ns}}',
          parse: (data) => data,
          ajax: loadLocales
        },
        detection: {
          order: ['localStorage', 'cookie', 'navigator'],
          lookupCookie: 'i18next',
          lookupLocalStorage: 'i18nextLng',
          caches: ['localStorage', 'cookie']
        },
        attributes: ['t', 'i18n'],
        fallbackLng: 'en',
        debug: false,
        ns: ['translation']
      });
    });
    
  aurelia.start().then(() => aurelia.setRoot());
}

function loadLocales(url, options, callback, data) {
  try {
    // include locale files as webpack chunks
    let waitForLocale = require('../locales/' + url + '.json');
    waitForLocale((locale) => {
      callback(locale, {status: '200'});
    });
  } catch (e) {
    callback(null, {status: '404'});
  }
}
