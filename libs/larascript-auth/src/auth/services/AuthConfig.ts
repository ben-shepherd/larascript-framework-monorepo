import { IAuthDriverConfig } from "../interfaces";
import { AuthAdapterConstructor, IAuthAdapter } from "../interfaces/adapter.t";


/**
 * AuthConfig is a configuration service for managing authentication adapters.
 * It provides a centralized way to define and configure different authentication
 * strategies (like JWT, OAuth, etc.) through a consistent interface.
 * 
 * The class offers static helper methods to:
 * - Define multiple auth configurations using the `define()` method
 * - Create individual adapter configs using the `config()` method with type safety
 * 
 * Example usage:
 * ```ts
 * const authConfig = AuthConfig.define([
 *   AuthConfig.config(JwtAuthAdapter, {
 *     name: 'jwt',
 *     settings: {
 *       secret: 'xxx',
 *       expiresIn: 60
 *     }
 *   })
 * ]);
 * ```
 */
class AuthConfig {

    /**
     * Create a new auth adapter config
     * @param driver - The auth adapter constructor
     * @param options - The config for the adapter
     * @returns The adapter config
     */
    public static config<Adapter extends IAuthAdapter = IAuthAdapter>(
        name: string,
        driver: AuthAdapterConstructor<Adapter>,
        options: ReturnType<Adapter['getConfig']>
    ): IAuthDriverConfig<Adapter> {
        return {
            name,
            driver,
            options: options
        }
    }


}

export default AuthConfig;