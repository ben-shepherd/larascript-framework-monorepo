import 'tsconfig-paths/register';

import appConfig from '@/config/app.config.js';
import SetupProvider from '@/core/domains/setup/providers/SetupProvider.js';
import ConsoleProvider from '@/core/providers/ConsoleProvider.js';
import CryptoProvider from '@/core/providers/CryptoProvider.js';
import LoggerProvider from '@/core/providers/LoggerProvider.js';
import { app } from '@/core/services/App.js';
import { Kernel } from '@larascript-framework/larascript-core';

import DatabaseSetupProvider from "./core/providers/DatabaseSetupProvider.js";
import EnvServiceProvider from "./core/providers/EnvServiceProvider.js";
import PackageJsonProvider from "./core/providers/PackageJsonProvider.js";

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