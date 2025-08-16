import { DependencyLoader, RequiresDependency } from "@repo/larascript-core";
import { ILoggerService } from "@repo/larascript-logger";
import { IViewRenderService } from "@repo/larascript-views";
import { IMail } from "../interfaces";

abstract class BaseMailAdapter implements RequiresDependency {
  protected view!: IViewRenderService;

  protected logger!: ILoggerService;

  setDependencyLoader(loader: DependencyLoader): void {
    this.view = loader("view");
    this.logger = loader("logger");
  }

  async generateBodyString(mail: IMail): Promise<string> {
    const body = mail.getBody();

    if (typeof body === "string") {
      return body;
    }

    const { view, data = {} } = body;

    return await this.view.render({
      view,
      data,
    });
  }
}

export default BaseMailAdapter;
