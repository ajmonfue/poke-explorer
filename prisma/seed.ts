
import { PrismaClient, type PokemonTypeRelation } from '@prisma/client';
import { PokeApiDataSource } from '~/server/datasources/adapters/pokeapi/adapter';

const prisma = new PrismaClient();

async function main() {
    const apiDataSource = new PokeApiDataSource();

    // insert types
    const pokemonTypes = await apiDataSource.findPokemonTypes();
    const typeIdByHandle = new Map<string, number>();
    for (const t of pokemonTypes) {
        const record = await prisma.pokemonType.create({
            data: {
                name: t.name,
                handle: t.handle,
                id: t.id,
            },
        });
        typeIdByHandle.set(t.handle, record.id);
    }
    console.log(`✔ ${typeIdByHandle.size} types inserted`);

    // insert generations
    const generations = await apiDataSource.findGenerations();
    const genIdByHandle = new Map<string, number>();
    for (const g of generations) {
        const record = await prisma.generation.create({
            data: { name: g.name, handle: g.handle, id: g.id },
        });
        genIdByHandle.set(g.handle, record.id);
    }
    console.log(`✔ ${genIdByHandle.size} generations inserted`);

    // insert pokemons
    const pokemons = await apiDataSource.getAllPokemons();
    for (const p of pokemons) {
        const created = await prisma.pokemon.create({
            data: {
                name: p.name,
                description: p.description,
                imageUrl: p.imageUrl ?? '',
                generationId: p.generation.id,   
                nameSearch: p.name.toLowerCase(),
                evolutionLines: p.evolutionLines,
                evolutionStage: p.evolutionStage,
                height: p.height,
                weight: p.weight,
                hp: p.hp,
                attack: p.attack,
                defense: p.defense,
                specialAttack: p.specialAttack,
                specialDefense: p.specialDefense,
                speed: p.speed,
                id: p.id,
            },
        });

        const typeRelationsData: Array<PokemonTypeRelation> = [];
        for (const pokemonType of p.types) {
            typeRelationsData.push({ pokemonId: created.id, pokemonTypeId: pokemonType.id });
        }

        if (typeRelationsData.length) {
            await prisma.pokemonTypeRelation.createMany({
                data: typeRelationsData,
                skipDuplicates: true,
            });
        }
    }
    console.log(`✔ ${pokemons.length} pokemons inserted`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('Error in seed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
