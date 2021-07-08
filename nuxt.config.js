import colors from 'vuetify/es5/util/colors'

export default {
  target: 'static',
  router: {
    base: '/course-viewer/',
  },
  head: {
    title: 'Course Viewer',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A simple viewer for school courses.' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
  },
  css: [],
  plugins: [],
  components: true,
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  modules: [],
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.red.base,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.yellow.base,
          success: colors.green.accent3,
        },
      },
    },
  },
  build: {},
}
