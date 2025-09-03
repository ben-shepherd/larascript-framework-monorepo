import 'dotenv/config';

import { CommandNotFoundException } from '@larascript-framework/larascript-console';
import { Kernel, KernelOptions } from '@larascript-framework/larascript-core';
import appConfig from '@src/config/app.config';
import providers from '@src/config/providers.config';
import CommandBootService from '@src/core/services/CommandBootService';
import { logger } from '@src/core/services/Logger';

(async () => {
    try {
        const args = process.argv.slice(2);
        const cmdBoot  = new CommandBootService();
        const options: KernelOptions = cmdBoot.getKernelOptions(args, {})
        const environment = appConfig.env
        
        /**
         * Boot the kernel
         */
        await Kernel.boot({ environment, providers }, options);
        logger().info('[App]: Started');

        /**
         * Execute commands
         */
        await cmdBoot.boot(args);
    
    }
    catch (err) {
        
        // We can safetly ignore CommandNotFoundExceptions 
        if(err instanceof CommandNotFoundException) {
            return;
        }

        logger().error('[App]: Failed to start', err);
        throw err;
    }
})();