import { TClassConstructor } from "@/utils/ClassConstructor.t";
import { compose } from "@/utils/compose";
import { HasCastableConcern } from "./HasCastableConcern";
import { IHasCastableConcern } from "./types.t";

export const BaseCastable: TClassConstructor<IHasCastableConcern> = compose(
  class {},
  HasCastableConcern,
);
