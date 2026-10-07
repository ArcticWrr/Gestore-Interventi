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
  ricercaCliente = model(''); //contiene tutto cio che l’utente scrive nel campo di ricerca, comunica nuovo valore a padre

  visualizzati = input<number>(0);
  totale = input<number>(0);
}