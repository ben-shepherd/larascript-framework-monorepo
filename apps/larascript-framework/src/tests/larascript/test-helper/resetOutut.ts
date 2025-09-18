import { createOutputPath } from "./createOutputPath.js";
import { deleteOutput } from "./deleteOutput.js";

export const resetOutput = () => {
    deleteOutput();
    createOutputPath();
}