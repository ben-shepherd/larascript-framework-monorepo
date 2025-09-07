import BaseSeeder from "@/core/domains/migrations/base/BaseSeeder.js";
import { SeederTestModel } from "@/tests/larascript/migration/seeder.test.js";

export class Seeder extends BaseSeeder {

    group?: string = 'testing';

    async up(): Promise<void> {
        
        const john = SeederTestModel.create({ name: 'John' })
        await john.save();

        const jane = SeederTestModel.create({ name: 'Jane' })
        await jane.save();

    }

}