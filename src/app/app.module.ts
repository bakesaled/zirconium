import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WINDOW_PROVIDERS } from './window.service';

@NgModule({
  declarations: [AppComponent, GameComponent],
  imports: [BrowserModule, MatIconModule, MatButtonModule],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {}
