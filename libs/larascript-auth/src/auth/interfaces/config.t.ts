import { IAuthAdapter } from "./adapter.t";
import { IJwtConfig } from "./jwt.t";

export interface IBaseDriverConfig<Adapter extends IAuthAdapter = IAuthAdapter>
  extends Record<string, unknown> {
  name: string;
  options: ReturnType<Adapter["getConfig"]>["options"];
}

export interface IAuthConfig {
  drivers: Record<string, IBaseDriverConfig> & {
    jwt: IJwtConfig;
  };
}
