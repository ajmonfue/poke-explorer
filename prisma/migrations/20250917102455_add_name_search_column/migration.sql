CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE pokemons
    ADD COLUMN IF NOT EXISTS name_search text;

-- create trigger function
CREATE OR REPLACE FUNCTION pokemons_set_name_search()
RETURNS trigger AS $$
BEGIN
  NEW.name_search := unaccent(lower(NEW.name));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create trigger
DROP TRIGGER IF EXISTS trg_pokemons_name_search ON pokemons;
CREATE TRIGGER trg_pokemons_name_search
BEFORE INSERT OR UPDATE OF name ON pokemons
FOR EACH ROW
EXECUTE FUNCTION pokemons_set_name_search();

-- execute for existing rows
UPDATE pokemons SET name = name
WHERE name IS NOT NULL;

-- acelerate LIKE '%...%' and contains
DROP INDEX IF EXISTS pokemon_name_search_trgm;
CREATE INDEX IF NOT EXISTS pokemon_name_search_trgm
    ON pokemons USING GIN (name_search gin_trgm_ops);