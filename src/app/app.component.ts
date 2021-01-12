import { Component, ViewChild } from '@angular/core';
import { GameComponent } from './game/game.component';
import { version } from 'package.json';

@Component({
  selector: 'zir-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(GameComponent, { static: true }) gameComponent: GameComponent;
  pausedScene;

  get version() {
    return version;
  }

  onDrawerOpenedChange($event: boolean) {
    if (!this.gameComponent) {
      console.warn('no game component yet');
      return;
    }
    const activeScene = this.gameComponent.phaserGame.scene.getScenes(true)[0];
    if ($event) {
      this.pausedScene = activeScene;
      this.gameComponent.phaserGame.scene.pause(activeScene.scene.key);
    } else {
      this.gameComponent.phaserGame.scene.resume(this.pausedScene.scene.key);
      this.pausedScene = undefined;
    }
  }
}
