export default class Component<T> {
  name: string;
  value: T;

  constructor(name: string, value: T) {
    this.name = name;
    this.value = value;
  }

  clone(): Component<T> {
    // In the future we can implement a clone method for custom object/instances
    if (this.value?.clone) {
      return this.value.clone();
    }

    if (!this.value) {
      return new Component(this.name, this.value);
    }

    if (typeof this.value === 'object') {
      const copied = Object.assign(
        Object.create(
          Object.getPrototypeOf(this.value)
        ),
        this.value
      );

      return new Component(this.name, copied);
    }

    // must be a primitive and won't need deep copy?
    return new Component(this.name, this.value);
  }

  static withState<U>(name: string, value: U): Component<U> {
    return new Component<U>(name, value);
  }

  static label(name: string): Component<null> {
    return new Component(name, null);
  }
}

export const createCamera2dComponent = (name: string, selector: string) => {
  const canvas = document.querySelector<HTMLCanvasElement>(selector);
  return Component.withState(name, {
    get context() {
      return canvas?.getContext('2d');
    },
    clone() {
      return this.context;
    }
  })
}
