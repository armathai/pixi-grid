import { ICellConfig } from '@armathai/grid-core';
import { Container } from 'pixi.js';

export type IPixiChild = Container & {
    destroy(...args: unknown[]): void;
    resize?(width: number, height: number): void;
    postBuild?(): void;
};

export type IPixiGrid = IPixiChild & {
    getGridConfig(): ICellConfig;
    rebuild(config?: ICellConfig): void;
};

export type IContent = IPixiChild | IPixiGrid;
