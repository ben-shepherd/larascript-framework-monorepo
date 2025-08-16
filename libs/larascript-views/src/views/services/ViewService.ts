import { IViewServiceConfig } from "../interfaces/config";
import { RenderData } from "../interfaces/data";
import { IViewRenderService, IViewService } from "../interfaces/services";
import EjsRenderService from "./EjsRenderService";

export class ViewService implements IViewService {
  constructor(protected readonly config: IViewServiceConfig) {}

  render(data: RenderData): Promise<string> {
    return this.ejs().render(data);
  }

  ejs(): IViewRenderService {
    return new EjsRenderService(this.config);
  }
}

export default ViewService;
