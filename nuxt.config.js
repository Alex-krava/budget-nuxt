const routerBase = process.env.DEPLOY_ENV === 'GH_PAGES' ? {
  router: {
    base: '/budget-nuxt/budgets'
  }
} : {
  router: {
    base: '/budgets'
  }
}

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: 'budget-nuxt',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    vendor: ['axios']
  },
  ...routerBase,
  env: {
    currencies: ['USD', 'EUR', 'GBP', 'RUB'],
    exchangeApiResource: 'https://api.ratesapi.io/api/latest'
  },
  plugins: [
    {src: '~/plugins/vuelidate'}
  ]
}

