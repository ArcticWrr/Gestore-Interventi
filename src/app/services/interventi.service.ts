import { Injectable, signal } from '@angular/core';
import type { Intervento } from '../models/intervento';

@Injectable({
  providedIn: 'root'
})
export class InterventiService {
private interventi = signal<Intervento[]>([
  {
    id: 1,
    cliente: 'Rossi Srl',
    descrizione: 'Configurazione del gestionale',
    stato: 'Da svolgere',
    tecnico: 'Mario Rossi'
  },
  {
    id: 2,
    cliente: 'Bianchi Spa',
    descrizione: 'Aggiornamento del CRM',
    stato: 'Da svolgere',
    tecnico: 'Laura Verdi'
  }
]);

caricaInterventi(): Intervento[] {
  return this.interventi();
}

completa(id: number) {
  this.interventi.update(elenco =>
    elenco.map(intervento =>
      intervento.id === id
        ? { ...intervento, stato: 'Completato' }//...intervento restituisce tutte proprieta di intervento
        : intervento
    )
  );
}
/*elenco è un parametro che riceve il valore
 attuale del signal this.interventi, quindi l’array degli interventi.*/

elimina(id: number) {
  this.interventi.update(elenco =>
    elenco.filter(intervento => intervento.id !== id)
  );
}

aggiungi(cliente: string, descrizione: string, tecnico: string) {
  const nuovoId = Math.max(
    0,
    ...this.interventi().map(intervento => intervento.id)
  ) + 1;

  const nuovoIntervento: Intervento = {
    id: nuovoId,
    cliente,
    descrizione,
    stato: 'Da svolgere',
    tecnico
  };

  this.interventi.update(elenco => [
    ...elenco,
    nuovoIntervento
  ]);
}

aggiorna(
  id: number,
  cliente: string,
  descrizione: string,
  tecnico: string
): boolean {
  const trovato = this.interventi().find(
    intervento => intervento.id === id
  );

  if (!trovato) {
    return false;
  }

  this.interventi.update(elenco =>
    elenco.map(intervento =>
      intervento.id === id
        ? { ...intervento, cliente, descrizione, tecnico }
        : intervento
    )
  );

  return true;
}
}