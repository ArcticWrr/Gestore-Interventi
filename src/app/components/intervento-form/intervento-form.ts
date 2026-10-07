import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-intervento-form',
  imports: [FormsModule],
  templateUrl: './intervento-form.html',
  styleUrl: './intervento-form.css',
})
export class InterventoForm {
  cliente = model('');
  descrizione = model('');
  tecnico = model('');
  dataIntervento = model('');
  note = model('');

  inModifica = input(false);
  errore = input('');
  salvataggio = input(false);

  salva = output<void>();
  annulla = output<void>();
}
/* model: Riceve il valore di un campo dal padre e comunica al padre le 
modifiche. Il padre decide se salvare o annullare. 
input: Riceve informazioni dal padre: modalità modifica e messaggio
di errore
output:Invia al padre un evento: richiesta di salvataggio 
o annullamento*/