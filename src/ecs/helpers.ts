import Entity from "./entity";

export const getSingle = (set: Set<Entity>) => {
  if (set.size > 2) {
    throw new Error(`Using 'getSingle' but there are more entites in the set`);
  }

  return set.values().next().value;
}
