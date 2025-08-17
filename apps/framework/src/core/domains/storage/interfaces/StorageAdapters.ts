import { BaseAdapterTypes } from "@larascript-framework/larascript-core";

export interface StorageAdapters extends BaseAdapterTypes {
    fileSystem: unknown;
    s3: unknown;
}