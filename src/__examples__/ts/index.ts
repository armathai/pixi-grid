import chick from '../assets/img/chick.png';
import duck from '../assets/img/duck.png';
import owl from '../assets/img/owl.png';
import parrot from '../assets/img/parrot.png';
import pixel from '../assets/img/pixel.png';
import { MainView } from './MainView';

class Game extends PIXI.Application {
    public constructor() {
        super({ resizeTo: window, backgroundColor: 0xcdcdcd });
        document.getElementById('gameContainer')?.appendChild(this.view);
        this.loader
            .add('chick', chick)
            .add('duck', duck)
            .add('owl', owl)
            .add('parrot', parrot)
            .add('pixel', pixel)
            .load(() => {
                this.stage.addChild(new MainView());
            });
    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        const game = new Game();
        window.game = game;
    }
};
