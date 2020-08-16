import { ICellConfig } from '@armathai/grid-core';

export type IPixiChild = PIXI.Container & {
  destroy(...args: any[]): void;
  resize?(width: number, height: number): void;
  postBuild?(): void;
};

export type IPixiGrid = IPixiChild & {
  rebuild(config?: ICellConfig): void;
};

export type IContent = IPixiChild | IPixiGrid;

declare global {
  interface Window {
    game: PIXI.Application;
  }
}
