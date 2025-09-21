import { env } from "~/env";
import type { IDataSourceAdapter } from "./ports";
import { PrismaDataSource } from "./adapters/prisma/adapter";
import { PokeApiDataSource } from "./adapters/pokeapi/adapter";

declare global {
  var __DATA_SOURCE__: IDataSourceAdapter | undefined;
}


export function getDataSource(): IDataSourceAdapter {
  globalThis.__DATA_SOURCE__ ??= env.DATA_SOURCE === "prisma"
    ? new PrismaDataSource()
    : new PokeApiDataSource();
  return globalThis.__DATA_SOURCE__;
}