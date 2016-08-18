module.exports = {
    module: {
        loaders: [
            {
                test: /\.es6$/,
                loaders: [
                    'imports-loader',
                    'babel-loader?presets[]=es2015'
                ]
            }
        ]
    }
}

