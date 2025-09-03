import 'tsconfig-paths/register';

import { Kernel } from '@larascript-framework/larascript-core';
import appConfig from '@src/config/app.config';
import SetupProvider from '@src/core/domains/setup/providers/SetupProvider';
import ConsoleProvider from '@src/core/providers/ConsoleProvider';
import CryptoProvider from '@src/core/providers/CryptoProvider';
import LoggerProvider from '@src/core/providers/LoggerProvider';
import { app } from '@src/core/services/App';

import DatabaseSetupProvider from './core/providers/DatabaseSetupProvider';
import EnvServiceProvider from './core/providers/EnvServiceProvider';
import PackageJsonProvider from './core/providers/PackageJsonProvider';

(async () => {
    require('dotenv').config();

    await Kernel.boot({
        ...appConfig,
        environment: 'testing',
        providers: [
            new EnvServiceProvider(),
            new PackageJsonProvider(),
            new LoggerProvider(),
            new ConsoleProvider(),
            new DatabaseSetupProvider(),
            new CryptoProvider(),
            new SetupProvider()
        ]
    }, {})

    app('console').readerService(['app:setup']).handle();
})();