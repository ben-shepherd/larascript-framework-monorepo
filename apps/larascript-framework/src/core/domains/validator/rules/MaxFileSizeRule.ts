
import { IRule, IRuleError } from "@larascript-framework/larascript-validator";
import { TUploadedFile } from "@src/core/domains/http/interfaces/UploadedFile";

import ExtendedAbstractRule from "../abstract/ExtendedAbstractRule";


type Options = {
    maxKB: number;
    maxMB: number;
}

class MaxFileSizeRule extends ExtendedAbstractRule<Options> implements IRule {

    protected name: string = 'maxFileSize'

    protected errorTemplate: string = 'The :attribute field must not be greater than :mb MB.';

    protected misconfiguredTemplate: string = 'The minKB or minMB fields were not provided.'

    constructor({ maxKB, maxMB }: { maxMB?: number, maxKB?: number }) {
        super({ maxKB, maxMB })
    }

    public async test(): Promise<boolean> {
        const files = this.getHttpContext().getFiles(this.getAttribute())
        const tests = files?.every(file => this.handleSingleFile(file))

        return tests ?? false
    }

    protected handleSingleFile(file: TUploadedFile): boolean {
        const sizeMb = this.getMb() as number

        if (typeof sizeMb === 'undefined') {
            this.errorTemplate = this.misconfiguredTemplate
            return false
        }

        if (typeof file === 'undefined') {
            return true
        }


        const currentSizeMb = file.getSizeKb() / 1024

        if (sizeMb && currentSizeMb < sizeMb) {
            return true
        }

        return false
    }

    public getError(): IRuleError {
        return {
            [this.getDotNotationPath()]: [
                this.formatErrorMessage({
                    mb: this.getMb() ?? 'undefined'
                })
            ]
        }
    }

    /**
     * Get the maximum MB from the options
     * @returns 
     */
    protected getMb(): number | undefined {
        if (typeof this.options.maxKB === 'number') {
            return this.options.maxKB / 1024
        }

        return this.options.maxMB
    }

}


export default MaxFileSizeRule;
