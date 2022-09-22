import Component, { createCamera2dComponent } from './ecs/component';
import ECS from './ecs/index';
import {getSingle} from './ecs/helpers';

const game = new ECS();

// const myComponent = Component.label('test');
const pos = Component.withState('pos', {
  x: 0,
  y: 0,
});
const vel = Component.withState('vel', {
  x: 1,
  y: 1,
});
const size = Component.withState('size', 40);

// Set up canvas component
const ctx = createCamera2dComponent('ctx', '#canvas');
game.spawn().insertComponent(ctx);

// Insert boxes to draw
game.spawn()
  .insertComponent(pos)
  .insertComponent(size)
  .insertComponent(vel);

game.addStartupSystem('setupCamera', _map => {
  console.log('starting');
});

game.addSystem('moving boxes', ({ pos }) => {
  pos.forEach(entity => {
    let size = entity.size.value;
    
    if (entity.pos.value.x + size + 1 > 300) {
      entity.vel.value.x *= -1;
    }

    if (entity.pos.value.y + size + 1 > 150) {
      entity.vel.value.y *= -1;
    }

    if (entity.pos.value.x < 0) {
      entity.vel.value.x *= -1;
    }

    if (entity.pos.value.y < 0) {
      entity.vel.value.y *= -1;
    }

    entity.pos.value.x += entity.vel.value.x;
    entity.pos.value.y += entity.vel.value.y;
  });
});

game.addSystem('animateBoxes', ({ pos , ctx}) => {
  let ctxEntity = getSingle(ctx).ctx as CanvasRenderingContext2D;

  ctxEntity.fillStyle = 'orange';
  ctxEntity.fillRect(0, 0, 5000, 5000);

  ctxEntity.fillStyle = 'blue';
  pos.forEach(entity => {
    let size = entity.size.value;
    ctxEntity.fillRect(entity.pos.value.x, entity.pos.value.y, size, size);
  });
});

game.run();
