import {
  BaseAdapterTypes,
  RequiresDependency,
} from "@ben-shepherd/larascript-core";
import LocalMailDriver from "../adapters/LocalMailDriver";
import NodeMailDriver from "../adapters/NodeMailerDriver";
import ResendMailDriver from "../adapters/ResendMailDriver";
import { IMail } from "./data";

export type BaseMailAdapters = BaseAdapterTypes<MailAdapter> & {
  [key: string]: MailAdapter;
};

export interface MailAdapters extends BaseMailAdapters {
  local: LocalMailDriver;
  nodemailer: NodeMailDriver;
  resend: ResendMailDriver;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MailAdapterConstructor = new (options: any) => MailAdapter;

export interface MailAdapter extends RequiresDependency {
  send(mail: IMail): Promise<void>;
  getOptions<T>(): T;
}
