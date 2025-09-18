import { env } from "~/env";
import type { IDataSourceAdapter } from "./ports";
import { PrismaDataSource } from "./adapters/prisma/adapter";
import { PokeApiDataSource } from "./adapters/pokeapi/adapter";


let dataSource: IDataSourceAdapter | null = null;
export function getDataSource(): IDataSourceAdapter {
  if (!dataSource)
    dataSource = env.DATA_SOURCE === "prisma" ? new PrismaDataSource() : new PokeApiDataSource();
  
  return dataSource;
}