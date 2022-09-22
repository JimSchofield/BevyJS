import { EntityComponentMap, EntityRecord } from ".";

export const withComponents = (
  arr: string[],
  func: (components: EntityRecord) => void,
) => (map: EntityComponentMap) => {
    const entityMap = arr.reduce((acc, componentName) => {
      acc[componentName] = [...map[componentName]]

      return acc;
    }, {} as EntityRecord)

    func(entityMap);
};
