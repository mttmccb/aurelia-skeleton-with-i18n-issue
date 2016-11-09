import {Aurelia} from 'aurelia-framework';
// we want font-awesome to load as soon as possible to show the fa-spinner
import '../styles/styles.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import * as Backend from 'i18next-xhr-backend';
import * as LngDetector from 'i18next-browser-languagedetector';
import 'intl';

// comment out if you don't want a Promise polyfill (remove also from webpack.config.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin('aurelia-animator-css');
  // if the css animator is enabled, add swap-order="after" to all router-view elements

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
  await aurelia.start();
  aurelia.setRoot('app');

  // if you would like your website to work offline (Service Worker), 
  // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
  /*
  const offline = await System.import('offline-plugin/runtime');
  offline.install();
  */
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
