// eslint-disable-next-line @typescript-eslint/no-require-imports
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'audioStorageUI',
            filename: 'remoteEntry.js',
            exposes: {
                './getToken': './src/utils/getToken', // Expose the getToken function
            },
            shared: {
                react: { singleton: true, eager: true, requiredVersion: '^17.0.0' },
                'react-dom': { singleton: true, eager: true, requiredVersion: '^17.0.0' },
                axios: { singleton: true, eager: true },
            },
        }),
    ],
};