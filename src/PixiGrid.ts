import { align, Cell, CellScale, fit, ICellConfig, Rect } from '@armathai/grid-core';
import { Debug } from './Debugger';
import { IContent, IPixiChild, IPixiGrid } from './Types';

export abstract class PixiGrid extends PIXI.Container implements IPixiGrid {
  public abstract getGridConfig(): ICellConfig;

  protected grid!: Cell<IContent>;

  private _debug!: Debug;

  constructor() {
    super();

    this._debug = new Debug(this);
  }

  protected getCellByName(name: string) {
    return this.grid.getCellByName(name);
  }

  protected getCellByContent(content: IContent): Cell<IContent> | undefined {
    return this.grid.getCellByContent(content);
  }

  /**
   * @description Rebuilds Grid. Destroys existing grid and creates new one based on given or existing configuration
   * @param config Input configuration object. Can be empty, to build with existing configuration
   * @returns {void}
   */
  public rebuild(config?: ICellConfig): void {
    // saves cells references before destroying grid
    const cells = this.grid.getCells();

    // creates new grid
    this._internalBuild(config || this.grid.config);

    // sets old cells contents in new grid cells
    cells.forEach(cell => cell.contents.forEach(content => this._rebuildContent(cell.name, content)));
  }

  /**
   * @description Creates Grid object based on input configuration object
   * @param config Input configuration object.
   * @returns {void}
   */
  protected build(config: ICellConfig): void {
    this._internalBuild(config);
  }

  /**
   * @description Adds the given Game Object, to this Container.
   * @param cellName Cell name which will hold given child as content
   * @param child The Game Object, to add to the Container.
   * @param config Configuration object, which will be merged with cell configuration
   * @returns {this}
   */
  protected setChild(cellName: string, child: IPixiChild): this {
    this.addChild(child);
    this._patchChildDestroy(child, cellName);
    this._rebuildContent(cellName, child);

    if (child.postBuild !== undefined) {
      child.postBuild();
    }

    return this;
  }

  protected rebuildChild(child: IPixiChild, cellName?: string): this {
    const cell = this.getCellByContent(child);

    if (cell === undefined) {
      throw new Error(`No cell found with ${child}`);
    }

    if (cellName === undefined) {
      cellName = cell.name;
    }

    this._removeContent(child);
    this._rebuildContent(cellName, child);

    return this;
  }

  _patchChildDestroy(child: IPixiChild, cellName: string) {
    const childDestroy = child.destroy;
    child.destroy = (...args: any[]) => {
      childDestroy.call(child, ...args);

      this._removeContent(child);
    };
  }

  private _internalBuild(config: ICellConfig): void {
    this.grid = new Cell(config);

    this._debug.clear();
    this._debug.draw(this.grid);
  }

  private _rebuildContent(cellName: string, child: IContent): void {
    const cell = this.grid.getCellByName(cellName);

    if (cell === undefined) {
      throw new Error(`No cell found with name ${cellName}`);
    }

    this._removeContent(child);
    this._addContent(child, cell);
    this._resetContent(child, cell);
    this._adjustContent(child, cell);
  }

  protected _addContent(child: IPixiChild, cell: Cell<IContent>): void {
    cell.contents.push(child);
  }

  protected _removeContent(child: IPixiChild): void {
    const cell = this.getCellByContent(child);

    if (cell === undefined) {
      return;
    }

    cell.contents.splice(cell.contents.indexOf(child), 1);
  }

  private _adjustContent(child: IContent, cell: Cell<IContent>): void {
    child instanceof PixiGrid ? this._adjustGridChild(child, cell) : this._adjustChild(child, cell);
  }

  private _adjustGridChild(child: IPixiGrid, cell: Cell<IContent>): void {
    const gridConfig = child.getGridConfig();
    gridConfig.bounds = cell.area;

    child.rebuild(gridConfig);
  }

  private _adjustChild(child: IPixiChild, cell: Cell<IContent>): void {
    const childBounds = child.getBounds();

    this._scaleContent(child, cell, childBounds);
    this._positionContent(child, cell, childBounds);
  }

  private _scaleContent(child: IPixiChild, cell: Cell<IContent>, childBounds: Rect): void {
    switch (cell.scale) {
      case CellScale.None:
        break;
      case CellScale.Custom:
        if (!child.resize) {
          throw new Error('resize() function does not implemented');
        }

        child.resize(cell.area.width, cell.area.height);
        break;
      default:
        const worldScaleX = child.worldTransform.a / child.localTransform.a;
        const worldScaleY = child.worldTransform.d / child.localTransform.d;

        const childDimensions = {
          width: childBounds.width / worldScaleX,
          height: childBounds.height / worldScaleY,
        };

        const scale = fit(childDimensions, cell.area, cell.scale);
        child.scale.set(scale.x, scale.y);
    }
  }

  private _positionContent(child: IPixiChild, cell: Cell<IContent>, childBounds: Rect): void {
    const worldScaleX = child.worldTransform.a / child.localTransform.a;
    const worldScaleY = child.worldTransform.d / child.localTransform.d;

    const childDimensions = {
      width: (childBounds.width / worldScaleX) * child.scale.x,
      height: (childBounds.height / worldScaleY) * child.scale.y,
    };

    const pos = align(childDimensions, cell.area, cell.align);
    child.position.set(pos.x, pos.y);

    child.x -= (childBounds.x / worldScaleX) * child.scale.x;
    child.y -= (childBounds.y / worldScaleY) * child.scale.y;
  }

  private _resetContent(child: IPixiChild, cell: Cell<IContent>): void {
    child.position.set(0, 0);

    if (cell.scale !== CellScale.None) {
      child.scale.set(1, 1);
    }

    child.updateTransform();
  }
}
