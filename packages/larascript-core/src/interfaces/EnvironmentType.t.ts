import {
  EnvironmentDevelopment,
  EnvironmentProduction,
  EnvironmentTesting,
} from "@/consts/EnvironmentType";

export type EnvironmentType =
  | typeof EnvironmentDevelopment
  | typeof EnvironmentProduction
  | typeof EnvironmentTesting;

export type EnvironmentConfig = {
  environment: EnvironmentType;
};
