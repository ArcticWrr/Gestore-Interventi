import { Component, input, output } from '@angular/core';
import type { Intervento } from '../../models/intervento';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-intervento-card',
  styleUrl: './intervento-card.css',
  templateUrl: './intervento-card.html',
})
export class InterventoCard {
  intervento = input.required<Intervento>(); //input signal
  completa = output<string>();
  modifica = output<string>();
  elimina = output<string>();
  avvia = output<string>();
}


/*output<number>() dichiara un evento personalizzato che trasporta un numero*/ 
/* dichiara un dato in ingresso obbligatorio.
 Il componente riceverà un oggetto Intervento
  dal componente che lo utilizza.
  Questo input è un signal: per leggerne il valore scriveremo intervento().*/