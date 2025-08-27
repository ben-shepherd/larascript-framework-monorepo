import { IDatabaseDocument } from "@/database/interfaces/validator.t";
import { ObjectId } from "mongodb";

export interface IMongoDbIdentiferConcern {
  convertToObjectId(id: string | ObjectId): ObjectId;

  convertObjectIdToStringInDocument(
    document: IDatabaseDocument,
  ): IDatabaseDocument;
}
