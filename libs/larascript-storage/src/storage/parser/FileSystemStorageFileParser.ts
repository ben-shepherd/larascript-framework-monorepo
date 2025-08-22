import fs from "fs";
import StorageFile from "../data/StorageFile";
import { FileNotFoundException } from "../exceptions/FileNotFoundException";
import { InvalidStorageFileException } from "../exceptions/InvalidStorageFileException";
import { FileSystemMeta, S3Meta } from "../interfaces/meta";
import {
  createFileSystemStorageFile,
  toAbsolutePath,
} from "../utils/StorageUtils";

class FileSystemStorageFileParser {
  public parseStorageFileOrStringS3(
    file: StorageFile | string,
  ): StorageFile<S3Meta> {
    if (typeof file === "object") {
      return file as StorageFile<S3Meta>;
    }

    if (typeof file === "string") {
      // TODO: This needs to be properly implemented with a storage instance
      throw new InvalidStorageFileException(
        "S3 storage not implemented in parser",
      );
    }

    throw new InvalidStorageFileException(
      "Unable to determine type of StorageFile from parameter. Expected string or object. Got: " +
        typeof file,
    );
  }

  /**
   * Parses the input and returns a StorageFile instance.
   * If the input is already a StorageFile, it is returned as-is.
   * If the input is a string, attempts to resolve it to a StorageFile.
   */
  public parseStorageFileOrString(
    file: StorageFile | string,
    storageDirectory: string,
  ): StorageFile<FileSystemMeta> {
    if (typeof file === "object") {
      return file as StorageFile<FileSystemMeta>;
    }

    if (typeof file === "string") {
      return this.getStorageFileFromString(file, storageDirectory);
    }

    throw new InvalidStorageFileException(
      "Unable to determine type of StorageFile from parameter. Expected string or object. Got: " +
        typeof file,
    );
  }

  /**
   * Retrieves a StorageFile instance from a given file path string.
   * Attempts to resolve the file path as-is, and if not found, tries to resolve it as a relative path within the storage directory.
   * @param {string} file - The file path or key to resolve.
   * @param {string} storageDirectory - The storage directory path
   * @returns {StorageFile<FileSystemMeta>} The corresponding StorageFile instance.
   * @throws {FileNotFoundException} If the file cannot be found at either path.
   * @protected
   */
  protected getStorageFileFromString(file: string, storageDirectory: string) {
    if (fs.existsSync(file)) {
      return createFileSystemStorageFile(file, storageDirectory);
    }

    const fullPath = toAbsolutePath(file, storageDirectory);

    if (fs.existsSync(fullPath)) {
      return createFileSystemStorageFile(fullPath, storageDirectory);
    }

    throw new FileNotFoundException(
      "Unable to determine the correct file path for: " + file,
    );
  }
}

export default FileSystemStorageFileParser;
