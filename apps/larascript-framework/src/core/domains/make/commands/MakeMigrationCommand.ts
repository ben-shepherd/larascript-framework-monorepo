import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";
import MigrationFileService from "@/core/domains/migrations/services/MigrationFilesService.js";

export default class MakeMigrationCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:migration',
            description: 'Create a new migration',
            makeType: 'Migration',
            args: ['name'],
            customFilename: (name: string) => {
                return (new MigrationFileService).createDateFilename(name)
            }
        })
    }

}