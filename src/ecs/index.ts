import Entity from "./entity";

export type EntityComponentMap = Record<string, Set<Entity>>;
export type EntityRecord = Record<string, Entity[]>;

export default class ECS {
  idCounter = 0;

  entities: Entity[] = [];
  systems: Record<PropertyKey, (map: EntityComponentMap) => void> = {};
  startupSystems: Record<PropertyKey, (map: EntityComponentMap) => void> = {};

  entityComponentMap: EntityComponentMap = {};

  spawn(): Entity {
    const entity = new Entity(this.idCounter++, this);

    this.entities.push(entity);

    return entity;
  }

  connect(componentName: string, entity: Entity) {
    if (!this.entityComponentMap[componentName]) {
      this.entityComponentMap[componentName] = new Set<Entity>();
    }

    if (this.entityComponentMap[componentName].has(entity)) {
      throw new Error(`This entity ${entity.id} already has component ${componentName}`)
    }

    this.entityComponentMap[componentName].add(entity);
  }

  addSystem(name: PropertyKey, system: (map: EntityComponentMap) => void) {
    this.systems[name] = system;
  }

  addStartupSystem(name: PropertyKey, system: (map: EntityComponentMap) => void) {
    this.startupSystems[name] = system;
  }

  run() {
    Object.values(this.startupSystems).forEach((system: (...any: any[]) => void) => {
      system(this.entityComponentMap);
    })

    this.calculateFrame();
  }

  calculateFrame() {
    Object.values(this.systems).forEach((system: (...any: any[]) => void) => {
      system(this.entityComponentMap);
    })

    requestAnimationFrame(() => this.calculateFrame());
  }
}
