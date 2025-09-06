import {
  EnvironmentDevelopment,
  EnvironmentProduction,
  EnvironmentTesting,
} from "../consts/EnvironmentType.js";

export type EnvironmentType =
  | typeof EnvironmentDevelopment
  | typeof EnvironmentProduction
  | typeof EnvironmentTesting;

export type EnvironmentConfig = {
  environment: EnvironmentType;
};
