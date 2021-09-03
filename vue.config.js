module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            externals: [ 'serialport', 'js-aprs-fap', 'js-aprs-tnc' ],
            nodeIntegration: true
        }
    }
}
