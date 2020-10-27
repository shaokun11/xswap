module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            if (env === 'production') {
                webpackConfig.devtool = 'none'
                webpackConfig.externals = {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                }
                webpackConfig.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
            }
            return webpackConfig
        },
    },
}
