import { TClassConstructor } from "./interfaces/ClassConstructor.t";

export const compose = (BaseClass: TClassConstructor, ...mixins) => {
  return mixins.reduce((Class, mixinFunc) => mixinFunc(Class), BaseClass);
};
