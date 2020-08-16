import { PixiGrid } from '../../PixiGrid';
import { getChildViewGridConfig, getMainViewGridConfig } from './grid-configs';

export class MainView extends PixiGrid {
  private _duckGroup!: PIXI.Container;
  private _childGrid!: PixiGrid;

  constructor() {
    super(getMainViewGridConfig());
    this._build();
  }

  private _build(): void {
    this._buildGroup();
    this._buildChildGrid();
    this._setResizeListener();

    // TEST;
    setInterval(() => {
      this._duckGroup.rotation += 0.02;
      this.rebuild();
    }, 20);
  }

  private _buildGroup(): void {
    const group = new PIXI.Container();

    const duck1 = PIXI.Sprite.from('duck');
    const duck2 = PIXI.Sprite.from('duck');

    duck1.anchor.set(-2, 2);
    duck2.anchor.set(2, -2);

    group.addChild(duck1);
    group.addChild(duck2);
    group.scale.set(0.5);

    this.setChild('main_1', (this._duckGroup = group));
  }

  private _buildChildGrid(): void {
    const childView = new ChildView();
    this.setChild('main_2', childView);
  }

  private _setResizeListener(): void {
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.rebuild(getMainViewGridConfig());
      }, 200);
    });
  }
}

// tslint:disable-next-line: max-classes-per-file
class ChildView extends PixiGrid {
  constructor() {
    super(getChildViewGridConfig());
  }

  public postBuild(): void {
    const owl = PIXI.Sprite.from('owl');
    owl.anchor.set(0.5);

    const parrot1 = PIXI.Sprite.from('parrot');
    const parrot2 = PIXI.Sprite.from('parrot');

    parrot1.x = 200;
    parrot2.x = -200;

    const chick = PIXI.Sprite.from('chick');
    const pixel = PIXI.Sprite.from('pixel');

    const parrotCont = new PIXI.Container();
    parrotCont.addChild(parrot1);
    parrotCont.addChild(parrot2);

    this.setChild('child_1', owl);
    this.setChild('child_2', parrotCont);
    this.setChild('child_3', chick);
    this.setChild('child_4', pixel);

    setInterval(() => {
      owl.rotation += 0.005;
      parrotCont.rotation += 0.005;
      pixel.rotation += 0.005;
      chick.rotation += 0.005;
      parrot1.rotation -= 0.01;
      this.rebuild();
    });
  }
}
