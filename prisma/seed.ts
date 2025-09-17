
import { PrismaClient, type PokemonTypeRelation } from '@prisma/client';

const prisma = new PrismaClient();

const GENERATIONS = [
    { handle: 'generation-i', name: 'Generation I' },
    { handle: 'generation-ii', name: 'Generation II' },
    { handle: 'generation-iii', name: 'Generation III' },
    { handle: 'generation-iv', name: 'Generation IV' },
    { handle: 'generation-v', name: 'Generation V' },
    { handle: 'generation-vi', name: 'Generation VI' },
    { handle: 'generation-vii', name: 'Generation VII' },
    { handle: 'generation-viii', name: 'Generation VIII' },
    { handle: 'generation-ix', name: 'Generation IX' },
];

const TYPES = [
    { handle: 'normal', name: 'Normal' },
    { handle: 'fire', name: 'Fire' },
    { handle: 'water', name: 'Water' },
    { handle: 'electric', name: 'Electric' },
    { handle: 'grass', name: 'Grass' },
    { handle: 'ice', name: 'Ice' },
    { handle: 'fighting', name: 'Fighting' },
    { handle: 'poison', name: 'Poison' },
    { handle: 'ground', name: 'Ground' },
    { handle: 'flying', name: 'Flying' },
    { handle: 'psychic', name: 'Psychic' },
    { handle: 'bug', name: 'Bug' },
    { handle: 'rock', name: 'Rock' },
    { handle: 'ghost', name: 'Ghost' },
    { handle: 'dragon', name: 'Dragon' },
    { handle: 'dark', name: 'Dark' },
    { handle: 'steel', name: 'Steel' },
    { handle: 'fairy', name: 'Fairy' },
];

const officialArtwork = (dex: number) =>
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;


const POKEMON_DATA: Array<{
    name: string;
    handle: string;
    description: string;
    dex: number;
    generationHandle: string;
    types: Array<string>;
    evolutionLines: Array<string>;
    evolutionStage: number;
}> = [
        // Bulbasaur
        {
            name: 'Bulbasaur',
            handle: 'bulbasaur',
            description: 'A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.',
            dex: 1,
            generationHandle: 'generation-i',
            types: ['grass', 'poison'],
            evolutionLines: ['bulbasaur'],
            evolutionStage: 1,
        },
        {
            name: 'Ivysaur',
            handle: 'ivysaur',
            description: 'When the bud on its back starts swelling, a sweet aroma wafts to indicate the flower\'s coming bloom.',
            dex: 2,
            generationHandle: 'generation-i',
            types: ['grass', 'poison'],
            evolutionLines: ['bulbasaur'],
            evolutionStage: 2,
        },
        {
            name: 'Venusaur',
            handle: 'venusaur',
            description: 'Its plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.',
            dex: 3,
            generationHandle: 'generation-i',
            types: ['grass', 'poison'],
            evolutionLines: ['bulbasaur'],
            evolutionStage: 3,
        },

        // Charmander
        {
            name: 'Charmander',
            handle: 'charmander',
            description: 'It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail.',
            dex: 4,
            generationHandle: 'generation-i',
            types: ['fire'],
            evolutionLines: ['charmander'],
            evolutionStage: 1,
        },
        {
            name: 'Charmeleon',
            handle: 'charmeleon',
            description: 'It lashes about with its tail to knock down its foe. It is fired up in battle, using its scorching tail.',
            dex: 5,
            generationHandle: 'generation-i',
            types: ['fire'],
            evolutionLines: ['charmander'],
            evolutionStage: 2,
        },
        {
            name: 'Charizard',
            handle: 'charizard',
            description: 'It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.',
            dex: 6,
            generationHandle: 'generation-i',
            types: ['fire', 'flying'],
            evolutionLines: ['charmander'],
            evolutionStage: 3,
        },

        // Squirtle
        {
            name: 'Squirtle',
            handle: 'squirtle',
            description: 'When it retracts its long neck into its shell, it squirts out water with vigorous force.',
            dex: 7,
            generationHandle: 'generation-i',
            types: ['water'],
            evolutionLines: ['squirtle'],
            evolutionStage: 1,
        },
        {
            name: 'Wartortle',
            handle: 'wartortle',
            description: 'It is recognized as a symbol of longevity. If its shell has algae on it, that Wartortle is very old.',
            dex: 8,
            generationHandle: 'generation-i',
            types: ['water'],
            evolutionLines: ['squirtle'],
            evolutionStage: 2,
        },
        {
            name: 'Blastoise',
            handle: 'blastoise',
            description: 'It crushes its foe under its heavy body to cause fainting. In a pinch, it withdraws inside its shell.',
            dex: 9,
            generationHandle: 'generation-i',
            types: ['water'],
            evolutionLines: ['squirtle'],
            evolutionStage: 3,
        },

        // Pikachu
        {
            name: 'Pichu',
            handle: 'pichu',
            description: 'Despite its small size, it can zap even adult humans. However, if it does so, it also surprises itself.',
            dex: 172,
            generationHandle: 'generation-ii',
            types: ['electric'],
            evolutionLines: ['pichu'],
            evolutionStage: 1,
        },
        {
            name: 'Pikachu',
            handle: 'pikachu',
            description: 'Pikachu that can generate powerful electricity have cheek sacs that are extra soft and super stretchy.',
            dex: 25,
            generationHandle: 'generation-i',
            types: ['electric'],
            evolutionLines: ['pichu'],
            evolutionStage: 2,
        },
        {
            name: 'Raichu',
            handle: 'raichu',
            description: 'Its long tail serves as a ground to protect itself from its own high-voltage power.',
            dex: 26,
            generationHandle: 'generation-i',
            types: ['electric'],
            evolutionLines: ['pichu'],
            evolutionStage: 3,
        },

        // Eevee
        {
            name: 'Eevee',
            handle: 'eevee',
            description: 'Its ability to evolve into many forms allows it to adapt smoothly and perfectly to any environment.',
            dex: 133,
            generationHandle: 'generation-i',
            types: ['normal'],
            evolutionLines: ['eevee'],
            evolutionStage: 1,
        },
        {
            name: 'Vaporeon',
            handle: 'vaporeon',
            description: 'Its cell composition is similar to water molecules. As a result, it can melt away into water.',
            dex: 134,
            generationHandle: 'generation-i',
            types: ['water'],
            evolutionLines: ['eevee', 'vaporeon'],
            evolutionStage: 2,
        },
        {
            name: 'Jolteon',
            handle: 'jolteon',
            description: 'Its lungs contain an organ that creates electricity. The crackling sound of electricity can be heard when it exhales.',
            dex: 135,
            generationHandle: 'generation-i',
            types: ['electric'],
            evolutionLines: ['eevee', 'jolteon'],
            evolutionStage: 2,
        },
        {
            name: 'Flareon',
            handle: 'flareon',
            description: 'It has a flame sac in its body. Its body temperature tops 1,650 degrees Fahrenheit before battle.',
            dex: 136,
            generationHandle: 'generation-i',
            types: ['fire'],
            evolutionLines: ['eevee', 'flareon'],
            evolutionStage: 2,
        },
        {
            name: 'Espeon',
            handle: 'espeon',
            description: 'It unleashes psychic power from the orb on its forehead. When its power is exhausted, the orb grows dull and dark.',
            dex: 196,
            generationHandle: 'generation-ii',
            types: ['psychic'],
            evolutionLines: ['eevee', 'espeon'],
            evolutionStage: 2,
        },
        {
            name: 'Umbreon',
            handle: 'umbreon',
            description: 'When agitated, this Pokémon protects itself by spraying poisonous sweat from its pores.',
            dex: 197,
            generationHandle: 'generation-ii',
            types: ['dark'],
            evolutionLines: ['eevee', 'umbreon'],
            evolutionStage: 2,
        },
        {
            name: 'Leafeon',
            handle: 'leafeon',
            description: 'It absorbs sunlight and uses it to grow, much like a plant. When clean, its leafy fur is silky and soft.',
            dex: 470,
            generationHandle: 'generation-iv',
            types: ['grass'],
            evolutionLines: ['eevee', 'leafeon'],
            evolutionStage: 2,
        },
        {
            name: 'Glaceon',
            handle: 'glaceon',
            description: 'It can freeze the moisture in the air around it to instantly create flurries of diamond dust.',
            dex: 471,
            generationHandle: 'generation-iv',
            types: ['ice'],
            evolutionLines: ['eevee', 'glaceon'],
            evolutionStage: 2,
        },
        {
            name: 'Sylveon',
            handle: 'sylveon',
            description: 'It wraps its ribbonlike feelers around its trainer\'s arm because this touch enables it to read its trainer\'s feelings.',
            dex: 700,
            generationHandle: 'generation-vi',
            types: ['fairy'],
            evolutionLines: ['eevee', 'sylveon'],
            evolutionStage: 2,
        },
    ];

async function main() {
    
    // insert types
    const typeIdByHandle = new Map<string, number>();
    for (const t of TYPES) {
        const record = await prisma.pokemonType.create({
            data: { name: t.name, handle: t.handle },
        });
        typeIdByHandle.set(t.handle, record.id);
    }
    console.log(`✔ ${typeIdByHandle.size} types inserted`);

    // insert generations
    const genIdByHandle = new Map<string, number>();
    for (const g of GENERATIONS) {
        const record = await prisma.generation.create({
            data: { name: g.name, handle: g.handle },
        });
        genIdByHandle.set(g.handle, record.id);
    }
    console.log(`✔ ${genIdByHandle.size} generations inserted`);

    // insert pokemons
    for (const p of POKEMON_DATA) {
        const generationId = genIdByHandle.get(p.generationHandle);
        if (!generationId) {
            throw new Error(`Generation not found for handle: ${p.generationHandle}`);
        }

        const created = await prisma.pokemon.create({
            data: {
                name: p.name,
                description: p.description,
                imageUrl: officialArtwork(p.dex),
                generationId,
                nameSearch: p.name.toLowerCase(),
                evolutionLines: p.evolutionLines,
                evolutionStage: p.evolutionStage,
            },
        });

        const typeRelationsData: Array<PokemonTypeRelation> = [];
        for (const th of p.types) {
            const tid = typeIdByHandle.get(th);
            if (!tid) {
                throw new Error(`Pokemon type not found: ${th}`);
            }
            typeRelationsData.push({ pokemonId: created.id, pokemonTypeId: tid });
        }

        if (typeRelationsData.length) {
            await prisma.pokemonTypeRelation.createMany({
                data: typeRelationsData,
                skipDuplicates: true,
            });
        }
    }
    console.log(`✔ ${POKEMON_DATA.length} pokemons inserted`);
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
