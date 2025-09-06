import { BaseSingleton } from "../base/index.js";
import { UninitializedContainerError } from "../exceptions/UninitializedContainerError.js";
import { RequiresDependency } from "../interfaces/index.js";
import { Containers, Kernel } from "../kernel/Kernel.js";

/**
 * @module App
 * @description The App service allows you to access kernel containers and configure the app environment
 */
export const appSingleton = <T extends Containers, K extends keyof T = keyof T>(
  name: K,
) => AppSingleton.container<T>(name) as T[K];

/**
/**
 * Returns the dependency loader for the application.
 * This function provides access to the application's dependency injection loader,
 * allowing you to resolve and inject dependencies as needed.
 * 
 * @returns The application's dependency loader instance.
 */
export const dependencyLoader = () => AppSingleton.dependencies();

/**
/**
 * Injects dependencies into an instance that implements RequiresDependency.
 * 
 * @param instance The instance to inject dependencies into.
 * @returns The same instance with dependencies injected.
 */
export const withDependencies = <T extends RequiresDependency>(instance: T) => {
  instance.setDependencyLoader(dependencyLoader());
  return instance;
};

/**
 * Short hand for App.env()
 */
export const appEnv = (): string | undefined => AppSingleton.env();

/**
 * App service
 * Allows you to access kernel containers
 * and configure the app environment
 */

export class AppSingleton extends BaseSingleton {
  /**
   * Environment
   * The environment the app is running in
   */
  public env!: string;

  /**
   * Global values
   */
  protected values: Record<string, unknown> = {};

  /**
   * Sets a value
   * @param key The key of the value
   * @param value The value to set
   */
  public static setValue(key: string, value: unknown): void {
    this.getInstance().values[key] = value;
  }

  /**
   * Gets a value
   * @param key The key of the value to get
   */
  public static getValue<T>(key: string): T | undefined {
    return this.getInstance().values[key] as T;
  }

  /**
   * Sets a container
   * @param name The name of the container
   * @param container The container to set
   */
  public static setContainer<Name extends keyof Containers & string>(
    name: Name,
    container: Containers[Name],
  ) {
    const kernel = Kernel.getInstance();

    if (kernel.booted()) {
      throw new Error("Kernel is already booted");
    }
    if (!name || name === "") {
      throw new Error("Container name cannot be empty");
    }
    if (kernel.containers.has(name)) {
      throw new Error("Container already exists");
    }

    kernel.containers.set(name, container);
  }

  /**
   * Gets a container
   * @param name The name of the container
   * @returns The container if it exists, or throws an UninitializedContainerError if not
   */
  public static container<T extends Containers, K extends keyof T = keyof T>(
    name: K,
  ): T[K] {
    const kernel = Kernel.getInstance();

    if (!kernel.containers.has(name as keyof Containers)) {
      throw new UninitializedContainerError(name as string);
    }

    return kernel.containers.get(name as keyof Containers) as T[K];
  }

  /**
   * Returns the dependency loader function.
   * This function can be passed into services or classes that require access to application containers
   * for dependency injection. It allows services to retrieve their required dependencies by name.
   *
   * @returns A function that retrieves containers by name.
   */
  public static dependencies() {
    return this.container;
  }

  /**
   * Safely retrieves a container by its name.
   * Attempts to get the specified container from the kernel.
   * If the container is not initialized, it returns undefined.
   * Throws an error for other exceptions.
   *
   * @template K - The type of the container key.
   * @param {K} name - The name of the container to retrieve.
   * @returns {IContainers[K] | undefined} The container if found, otherwise undefined.
   * @throws {Error} If an unexpected error occurs.
   */
  public static safeContainer<K extends keyof Containers = keyof Containers>(
    name: K,
  ): Containers[K] | undefined {
    try {
      return this.container(name);
    } catch (err) {
      if (err instanceof UninitializedContainerError) {
        return undefined;
      }

      throw err;
    }
  }

  /**
   * Checks if a container is ready.
   * A container is considered ready if it has been set using the setContainer method.
   * @template K - The type of the container key.
   * @param {K} name - The name of the container to check.
   * @returns {boolean} Whether the container is ready or not.
   */
  public static containerReady<K extends keyof Containers = keyof Containers>(
    name: K,
  ): boolean {
    return this.safeContainer(name) !== undefined;
  }

  /**
   * Gets the environment
   * @returns The environment if set, or undefined if not
   */
  public static env(): string | undefined {
    return this.getInstance().env;
  }
}
