import { TClassConstructor } from "./ClassConstructor.t";

export const compose = (BaseClass: TClassConstructor, ...mixins) => {
  return mixins.reduce((Class, mixinFunc) => mixinFunc(Class), BaseClass);
};
