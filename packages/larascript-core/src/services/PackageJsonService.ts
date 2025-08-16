import { exec } from "child_process";
import fs from "fs";
import util from "util";

const execPromise = util.promisify(exec);

export type PackageJsonServiceConfig = {
  packageJsonPath: string;
};

/**
 * IPackageJsonService is an interface for a service that handles operations with package.json
 *
 * @interface IPackageJsonService
 */
export interface IPackageJsonService {
  packageJsonPath: string;
  installPackage(name: string): Promise<void>;
  uninstallPackage(name: string): Promise<void>;
  getJson(): Promise<IPackageJson>;
  writeFileContents(contents: string, filePath?: string): Promise<void>;
  readFileContents(filePath?: string): Promise<string>;
}

export interface IPackageJson {
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
}

/**
 * PackageJsonService is a service that handles operations with package.json
 *
 * @implements IPackageJsonService
 */
export class PackageJsonService implements IPackageJsonService {
  packageJsonPath!: string;

  constructor(protected readonly config: PackageJsonServiceConfig) {
    this.packageJsonPath = config.packageJsonPath;
  }

  /**
   * Install a package using yarn
   * @param name - name of the package to install
   * @returns a promise that resolves when the package is installed
   */
  async installPackage(name: string) {
    const cmd = `yarn add ${name}`;
    console.log("Running command: ", cmd);
    await execPromise(cmd);
  }

  /**
   * Uninstall a package using yarn
   * @param name - name of the package to uninstall
   * @returns a promise that resolves when the package is uninstalled
   */
  async uninstallPackage(name: string) {
    const packageJson = await this.getJson();
    const containsPackage = Object.keys(packageJson.dependencies).includes(
      name,
    );

    if (!containsPackage) {
      return;
    }

    const cmd = `yarn remove ${name}`;
    console.log("Running command: ", cmd);
    await execPromise(cmd);
  }

  /**
   * Reads the package.json file and returns its contents as an object
   * @returns a promise that resolves with the package.json contents
   */
  getJson = async (): Promise<IPackageJson> => {
    return JSON.parse(await this.readFileContents()) as IPackageJson;
  };

  /**
   * Writes the contents to the package.json file
   * @param contents - contents to write to the file
   * @param filePath - path to the file to write to (defaults to packageJsonPath)
   * @returns a promise that resolves when the file is written
   */
  writeFileContents = (
    contents: string,
    filePath: string = this.packageJsonPath,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, contents, "utf8", (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };

  /**
   * Reads the contents of the package.json file
   * @param filePath - path to the file to read from (defaults to packageJsonPath)
   * @returns a promise that resolves with the contents of the file
   */
  readFileContents = (
    filePath: string = this.packageJsonPath,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  };
}
