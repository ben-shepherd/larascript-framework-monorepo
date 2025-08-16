import { BaseCastable } from "./BaseCastable";
import { TCasts } from "./types.t";

const castObject = <ReturnType = unknown>(
  data: unknown,
  casts: TCasts,
): ReturnType => {
  return new BaseCastable().getCastFromObject<ReturnType>(
    data as Record<string, unknown>,
    casts,
  );
};

export default castObject;
