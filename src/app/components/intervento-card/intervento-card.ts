import { Component, input, output } from '@angular/core';
import type { Intervento } from '../../models/intervento';

@Component({
  imports: [],
  selector: 'app-intervento-card',
  styleUrl: './intervento-card.css',
  templateUrl: './intervento-card.html',
})
export class InterventoCard {
  intervento = input.required<Intervento>(); //input signal
  completa = output<number>();
  modifica = output<number>();
  elimina = output<number>();
}


/*output<number>() dichiara un evento personalizzato che trasporta un numero*/ 
/* dichiara un dato in ingresso obbligatorio.
 Il componente riceverà un oggetto Intervento
  dal componente che lo utilizza.
  Questo input è un signal: per leggerne il valore scriveremo intervento().*/