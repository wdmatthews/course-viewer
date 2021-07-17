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
          primary: colors.lightBlue.lighten3,
          accent: colors.yellow.lighten3,
          secondary: colors.blueGrey.base,
          info: colors.cyan.base,
          success: colors.green.accent2,
          warning: colors.amber.accent1,
          error: colors.red.accent1,
        },
      },
    },
  },
  build: {},
}
