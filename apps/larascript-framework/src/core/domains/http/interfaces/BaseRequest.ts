import IAuthorizedRequest from "@/core/domains/http/interfaces/IAuthorizedRequest.js";
import { IRequestIdentifiable } from "@/core/domains/http/interfaces/IRequestIdentifable.js";
import { ISecurityRequest } from "@/core/domains/http/interfaces/ISecurity.js";
import { IValidatorRequest } from "@/core/domains/http/interfaces/IValidatorRequest.js";
import { TUploadedFile } from "@/core/domains/http/interfaces/UploadedFile.js";
import { Request } from "express";

/**
 * TBaseRequest combines multiple request interfaces to create a comprehensive request type.
 * It extends Express's Request and includes:
 * - Authorization capabilities (IAuthorizedRequest)
 * - Request validation (IValidatorRequest) 
 * - Security features (ISecurityRequest)
 * - Request identification (IRequestIdentifiable)
 */
export type TBaseRequest = Request & IAuthorizedRequest & IValidatorRequest & ISecurityRequest & IRequestIdentifiable & { files: TUploadedFile | TUploadedFile[] | undefined };