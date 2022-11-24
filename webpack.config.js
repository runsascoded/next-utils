const {
    VanillaExtractPlugin
} = require('@vanilla-extract/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new VanillaExtractPlugin(),
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.vanilla\.css$/i, // Targets only CSS files generated by vanilla-extract
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            url: false // Required as image imports should be handled via JS/TS import statements
                        }
                    }
                ]
            }
        ],
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ],
        },
    },
    entry: './src/nav.tsx',
};