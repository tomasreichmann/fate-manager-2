require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  app: {
    title: 'FATE MANAGER',
    description: 'Manager for Fate RPG character sheets.',
    head: {
      titleTemplate: 'FATE MANAGER: %s',
      meta: [
        {name: 'description', content: 'Manager for Fate RPG character sheets.'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'FATE MANAGER'},
        {property: 'og:image', content: 'https://fate-manager.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'FATE MANAGER'},
        {property: 'og:description', content: 'Manager for Fate RPG character sheets.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@erikras'},
        {property: 'og:creator', content: '@erikras'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
