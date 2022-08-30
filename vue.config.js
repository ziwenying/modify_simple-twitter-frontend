module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/modify_simple-twitter-frontend/'
    : '/',
  css: { extract: false },
}