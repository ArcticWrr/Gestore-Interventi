import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
//contenitore router,App non gestisce più interventi, modulo o filtri.
//  Il suo unico compito è mostrare la pagina scelta da app.routes.ts