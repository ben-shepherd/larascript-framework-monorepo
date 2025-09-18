import QuestionDTO from "@/core/domains/setup/DTOs/QuestionDTO.js";
import InvalidDefaultCredentialsError from "@/core/domains/setup/exceptions/InvalidDefaultCredentialsError.js";
import { IAction } from "@/core/domains/setup/interfaces/IAction.js";
import { ISetupCommand } from "@/core/domains/setup/interfaces/ISetupCommand.js";
import { app } from "@/core/services/App.js";

class SetupDefaultDatabase implements IAction {

    /**
     * Handle the action 
     * - Updates the .env DATABASE_DRIVER
     * @param ref 
     * @param question 
     */
    async handle(ref: ISetupCommand, question: QuestionDTO): Promise<any> {
        const adapterName = question.getAnswer() as string;

        if (adapterName === 'all') {
            return await this.updateEnvForAllDatabases(ref);
        }

        ref.writeLine('Updating .env');
        await this.updateEnv(adapterName, ref);
        await this.updateEnvDefaultConnection(adapterName, ref);
    }

    /**
     * Update the .env for all databases
     * @param ref 
     */
    private async updateEnvForAllDatabases(ref: ISetupCommand) {
        ref.writeLine('Updating .env for all databases');
        const adaptersNames = app('db').getAvailableAdaptersNames();

        for (const adapter of adaptersNames) {
            await this.updateEnv(adapter, ref);

        }
        await this.updateEnvDefaultConnection('postgres', ref);
        return;
    }

    /**
     * Update the .env for the default connection
     * @param adapterName 
     * @param ref 
     */
    async updateEnvDefaultConnection(adapterName: string, ref: ISetupCommand) {
        ref.env.copyFileFromEnvExample();

        const credentials = app('db').getDefaultCredentials(adapterName);

        if (!credentials) {
            throw new InvalidDefaultCredentialsError(`The default credentials are invalid or could not be found for adapter '${adapterName}'`);
        }

        const env: Record<string, string> = {
            DATABASE_DEFAULT_CONNECTION: adapterName,
        }
        await ref.env.updateValues(env);
    }

    /**
     * Update the .env
     * @param adapterName 
     * @param ref 
     */
    async updateEnv(adapterName: string, ref: ISetupCommand) {
        ref.env.copyFileFromEnvExample();

        const credentials = app('db').getDefaultCredentials(adapterName);

        if (!credentials) {
            throw new InvalidDefaultCredentialsError(`The default credentials are invalid or could not be found for adapter '${adapterName}'`);
        }

        const env: Record<string, string> = {}

        if (adapterName === 'postgres') {
            env.DATABASE_POSTGRES_CONNECTION = adapterName;
            env.DATABASE_POSTGRES_URI = credentials;
        }

        if (adapterName === 'mongodb') {
            env.DATABASE_MONGODB_CONNECTION = adapterName;
            env.DATABASE_MONGODB_URI = credentials;
        }

        await ref.env.updateValues(env);
    }

}

export default SetupDefaultDatabase