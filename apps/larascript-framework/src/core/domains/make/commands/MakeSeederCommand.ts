import BaseMakeFileCommand from "@/core/domains/make/base/BaseMakeFileCommand.js";
import MigrationFileService from "@/core/domains/migrations/services/MigrationFilesService.js";

export default class MakeSeederCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:seeder',
            description: 'Creates a new database seeder',
            makeType: 'Seeder',
            args: ['name'],
            endsWith: 'Seeder',
            customFilename: (name: string) => {
                return (new MigrationFileService).createDateFilename(name)
            }
        })
    }

}