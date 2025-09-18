import { cn } from "~/lib/utils"
import type { PokemonStats } from "~/models/pokemon"

const pokemonStatName: Record<keyof PokemonStats, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    specialAttack: 'Sp. Attack',
    specialDefense: 'Sp. Defense',
    speed: 'Speed',
}

const pokemonStatCssClassName: Record<keyof PokemonStats, string> = {
    hp: 'bg-red-400',
    attack: 'bg-orange-400',
    defense: 'bg-yellow-400',
    specialAttack: 'bg-blue-400',
    specialDefense: 'bg-green-400',
    speed: 'bg-pink-400',
}

export function PokemonStat({pokemonStats, stat}: {pokemonStats: PokemonStats, stat: keyof PokemonStats}) {
    return (
        <div>
            <div className="flex justify-between mb-1">
                <span>{pokemonStatName[stat]}</span>
                <span>{pokemonStats[stat]}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
                <div
                    className={cn('h-2 rounded-full', pokemonStatCssClassName[stat])}
                    style={{ width: ((pokemonStats[stat] ?? 0) / 255 * 100) + '%' }}
                ></div>
            </div>
        </div>
    )
}