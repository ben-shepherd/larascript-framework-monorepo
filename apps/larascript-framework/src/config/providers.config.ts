import { IAsyncSessionService } from '@larascript-framework/async-session';
import { ICryptoService } from '@larascript-framework/crypto-js';
import { IAclConfig, IBasicACLService } from '@larascript-framework/larascript-acl';
import { IAuthService, IJwtAuthService } from '@larascript-framework/larascript-auth';
import { IEnvService, IPackageJsonService, IProvider } from '@larascript-framework/larascript-core';
import { IDatabaseService, IEloquentQueryBuilderService } from '@larascript-framework/larascript-database';
import { IEventService, IWorkerService } from '@larascript-framework/larascript-events';
import { ILoggerService } from '@larascript-framework/larascript-logger';
import { IMailService } from '@larascript-framework/larascript-mail';
import { IStorageService } from '@larascript-framework/larascript-storage';
import { IValidatorFn } from '@larascript-framework/larascript-validator';
import { IViewRenderService, IViewService } from '@larascript-framework/larascript-views';
import { IAppService } from "@src/app/interfaces/IAppService";
import AppServiceProvider from "@src/app/providers/AppServiceProvider";
import RoutesProvider from "@src/app/providers/RoutesProvider";
import { IAppConfig } from "@src/config/app.config";
import ICommandService from '@src/core/domains/console/interfaces/ICommandService';
import ConsoleProvider from "@src/core/domains/console/providers/ConsoleProvider";
import EventProvider from "@src/core/domains/events/providers/EventProvider";
import IHttpService from '@src/core/domains/http/interfaces/IHttpService';
import { IRequestContext } from '@src/core/domains/http/interfaces/IRequestContext';
import HttpErrorHandlerProvider from "@src/core/domains/http/providers/HttpErrorHandlerProvider";
import HttpProvider from "@src/core/domains/http/providers/HttpProvider";
import MakeProvider from "@src/core/domains/make/providers/MakeProvider";
import MigrationProvider from "@src/core/domains/migrations/providers/MigrationProvider";
import SetupProvider from "@src/core/domains/setup/providers/SetupProvider";
import ACLProvider from "@src/core/providers/ACLProvider";
import AsyncSessionProvider from "@src/core/providers/AsyncSessionProvider";
import AuthProvider from "@src/core/providers/AuthProvider";
import CommandsProvider from '@src/core/providers/CommandsProvider';
import CryptoProvider from "@src/core/providers/CryptoProvider";
import DatabaseProvider from '@src/core/providers/DatabaseProvider';
import EnvServiceProvider from "@src/core/providers/EnvServiceProvider";
import LoggerProvider from "@src/core/providers/LoggerProvider";
import MailProvider from "@src/core/providers/MailProvider";
import PackageJsonProvider from "@src/core/providers/PackageJsonProvider";
import StorageProvider from "@src/core/providers/StorageProvider";
import ValidatorProvider from "@src/core/providers/ValidatorProvider";
import ViewProvider from "@src/core/providers/ViewProvider";
import readline from 'node:readline';

/**
 * Interface defining all available service providers in the application.
 * This interface provides TypeScript type hints when accessing providers using app('serviceName').
 */
export interface Providers {
    [key: string]: unknown;

    // Larascript providers
    "envService": IEnvService;
    "packageJsonService": IPackageJsonService;
    "events": IEventService;
    "events.worker": IWorkerService;
    "auth": IAuthService;
    "auth.jwt": IJwtAuthService;
    "acl.basic": IBasicACLService;
    "acl.basic.config": IAclConfig;
    "db": IDatabaseService;
    "query": IEloquentQueryBuilderService;
    "http": IHttpService;
    "requestContext": IRequestContext;
    "console": ICommandService;
    "readline": readline.Interface;
    "validatorFn": IValidatorFn;
    "logger": ILoggerService;
    "crypto": ICryptoService;
    "asyncSession": IAsyncSessionService;
    "storage": IStorageService;
    "mail": IMailService;
    "view": IViewService;
    "view:ejs": IViewRenderService;

    // App specific providers
    "app": IAppService;
    "app.config": IAppConfig;
}

/**
 * Providers
 */
const providers: IProvider[] = [

    // Include the core providers
    new LoggerProvider(),
    new AsyncSessionProvider(),
    new EnvServiceProvider(),
    new PackageJsonProvider(),
    new ConsoleProvider(),
    new EventProvider(),
    new DatabaseProvider(),
    new ACLProvider(),
    new AuthProvider(),
    new MigrationProvider(),
    new MakeProvider(),
    new ValidatorProvider(),
    new CryptoProvider(),
    new SetupProvider(),
    new CommandsProvider(),
    new StorageProvider(),
    new ViewProvider(),
    new MailProvider(),
    new HttpProvider(),
    new RoutesProvider(),
    new HttpErrorHandlerProvider(),

    // Add your providers here
    new AppServiceProvider(),

]

export default providers;