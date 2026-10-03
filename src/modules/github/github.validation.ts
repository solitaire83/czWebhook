import { z } from "zod";

export const GithubValidations = z.object({}).loose();

export type GithubValidationsType = z.infer<typeof GithubValidations>;