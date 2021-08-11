module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            externals: [ 'js-aprs-fap' ],
            nodeIntegration: true
        }
    }
}
