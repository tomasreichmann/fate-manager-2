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
    description: 'Your toolbox for running and playing FATE CORE RPG',
    head: {
      titleTemplate: '%s | FATE MANAGER',
      meta: [
        {name: 'description', content: 'Your toolbox for running and playing FATE CORE RPG'},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'FATE MANAGER'},
        {property: 'og:image', content: 'https://fate-manager.herokuapp.com/logo.jpg'},
        {property: 'og:locale', content: 'en_US'},
        {property: 'og:title', content: 'FATE MANAGER'},
        {property: 'og:description', content: 'Your toolbox for running and playing FATE CORE RPG'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@erikras'},
        {property: 'og:creator', content: '@erikras'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  },

}, environment);
