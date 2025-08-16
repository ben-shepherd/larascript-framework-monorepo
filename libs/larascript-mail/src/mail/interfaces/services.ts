import { BaseMailAdapters, MailAdapter } from "./adapter";
import { IMail } from "./data";

export interface IMailService {
  boot(): void;
  send(mail: IMail, driver?: keyof BaseMailAdapters): Promise<void>;
  getDefaultDriver(): MailAdapter;
  getDriver<T extends MailAdapter = MailAdapter>(
    name: keyof BaseMailAdapters,
  ): T;
}
