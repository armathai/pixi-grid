import { Cell, IDebug } from '@armathai/grid-core';
import { Graphics } from 'pixi.js';
import { IContent, IPixiGrid } from './Types';

export class Debug {
    private _debugger!: Debugger;
    private _parent: IPixiGrid;

    public constructor(parent: IPixiGrid) {
        this._parent = parent;
    }

    public bringToTop(): void {
        if (!this._debugger) {
            return;
        }
    }

    public draw(cell: Cell<IContent>, lineWidth = 10, parentDebug?: IDebug): void {
        const { x: bx, y: by, width: bw, height: bh } = cell.bounds;
        const { x: px, y: py, width: pw, height: ph } = cell.area;
        const { debug = parentDebug } = cell.config;

        if (debug) {
            if (this._debugger === undefined) {
                // Init debugger
                this._debugger = new Debugger();
                this._parent.addChild(this._debugger);
            }

            const { color, fill } = debug;

            // Draw content area
            fill
                ? this._debugger.fillRect(px, py, pw, ph, lineWidth * 0.8, color)
                : this._debugger.strokeRect(px, py, pw, ph, lineWidth * 0.8, color);

            // Draw cell bounds
            this._debugger.strokeRect(bx, by, bw, bh, lineWidth, color);
        }

        cell.cells.forEach((el) => this.draw(el, lineWidth * 0.7, debug));
    }

    public clear(): void {
        if (!this._debugger) {
            return;
        }

        this._debugger.clear();
    }

    public strokeRect(
        x: number,
        y: number,
        w: number,
        h: number,
        lineWidth: number,
        color: number = Debugger.defaultColor,
    ): void {
        if (!this._debugger) {
            return;
        }

        this._debugger.fillRect(x, y, w, h, lineWidth, color);
    }

    public fillRect(
        x: number,
        y: number,
        w: number,
        h: number,
        lineWidth: number,
        color: number = Debugger.defaultColor,
    ): void {
        if (!this._debugger) {
            return;
        }

        this._debugger.strokeRect(x, y, w, h, lineWidth, color);
    }
}

export class Debugger extends Graphics {
    public static readonly defaultColor: number = 0xffffff;

    public strokeRect(
        x: number,
        y: number,
        w: number,
        h: number,
        lineWidth: number,
        color: number = Debugger.defaultColor,
    ): void {
        this.lineStyle(lineWidth, color, 1);
        this.drawRect(x, y, w, h);
    }

    public fillRect(
        x: number,
        y: number,
        w: number,
        h: number,
        lineWidth: number,
        color: number = Debugger.defaultColor,
    ): void {
        this.lineStyle(lineWidth, color, 1);
        this.beginFill(color, 0.4);
        this.drawRect(x, y, w, h);
        this.endFill();
    }
}
