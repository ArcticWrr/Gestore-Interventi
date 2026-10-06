import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intervento-filtro-stato',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './intervento-filtro-stato.html',
  styleUrl: './intervento-filtro-stato.css'
})
export class InterventoFiltro {
  filtroStato = model<string>('Tutti');
  visualizzati = input<number>(0);
  totale = input<number>(0);
}