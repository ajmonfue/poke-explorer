-- CreateTable
CREATE TABLE "public"."generations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,

    CONSTRAINT "generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pokemon_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,

    CONSTRAINT "pokemon_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pokemons" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "evolution_lines" TEXT[] NOT NULL,
    "evolution_stage" INTEGER NOT NULL,
    "generation_id" INTEGER NOT NULL,
    "attack" INTEGER,
    "defense" INTEGER,
    "height" INTEGER NOT NULL,
    "hp" INTEGER,
    "special_attack" INTEGER,
    "special_defense" INTEGER,
    "speed" INTEGER,
    "weight" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pokemon_type_relations" (
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_type_id" INTEGER NOT NULL,

    CONSTRAINT "pokemon_type_relations_pkey" PRIMARY KEY ("pokemon_id","pokemon_type_id")
);

-- AddForeignKey
ALTER TABLE "public"."pokemons" ADD CONSTRAINT "pokemons_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "public"."generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pokemon_type_relations" ADD CONSTRAINT "pokemon_type_relations_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "public"."pokemons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."pokemon_type_relations" ADD CONSTRAINT "pokemon_type_relations_pokemon_type_id_fkey" FOREIGN KEY ("pokemon_type_id") REFERENCES "public"."pokemon_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
