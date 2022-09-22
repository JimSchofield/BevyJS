import ECS from ".";
import Component from "./component";

export default class Entity {
  id: number;
  private _worldRef: ECS;

  constructor(id: number, worldRef: ECS) {
    this.id =  id;
    this._worldRef = worldRef;
  }

  insertComponent<T>(component: Component<T>): this {
    this[component.name] = component.clone();

    this._worldRef.connect(component.name, this);

    return this;
  }
}
