import { AppSingleton, BaseProvider } from "@larascript-framework/larascript-core";
import { IMailConfig, MailService } from "@larascript-framework/larascript-mail";
import appConfig, { IAppConfig } from "@src/config/app.config";
import { mailConfig } from "@src/config/mail.config";
import { app } from "@src/core/services/App";

class MailProvider extends BaseProvider {

    config: IMailConfig = mailConfig

    appConfig: IAppConfig = appConfig
    
    async register(): Promise<void> {
        const mailService = new MailService(this.config, this.appConfig)
        mailService.setDependencyLoader(AppSingleton.container)
        this.bind('mail', mailService)
    }

    async boot(): Promise<void> {
        app('mail').boot()
    }

}

export default MailProvider