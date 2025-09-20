import BaseMakeFileCommand from "../base/BaseMakeFileCommand.js";
import MakeServices from "../services/MakeServices.js";

export default class MakeMigrationCommand extends BaseMakeFileCommand {

    constructor() {
        super({
            signature: 'make:migration',
            description: 'Create a new migration',
            makeType: 'Migration',
            args: ['name'],
            customFilename: (name: string) => {
                return (MakeServices.getInstance().getMigrationFileService()).createDateFilename(name)
            }
        })
    }

}