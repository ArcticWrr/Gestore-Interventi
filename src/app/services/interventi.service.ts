import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import type { Intervento } from '../models/intervento';
import { finalize, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterventiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/interventi';
  private interventi = signal<Intervento[]>([]);
  readonly caricamento = signal(true);
  readonly erroreCaricamento = signal('');  
  readonly salvataggio = signal(false);
  readonly erroreOperazione = signal('');

  constructor() {
    this.caricaDaApi();
  }

  private caricaDaApi() {
    this.caricamento.set(true);
    this.erroreCaricamento.set('');
    this.http
      .get<Intervento[]>(this.apiUrl)
      .subscribe({ //richiesta GET, subscribe attende risposta
        next: dati => {//eseguito quando dati arrivano
          this.interventi.set(dati);
          this.caricamento.set(false);
        },
        error: errore => {
          console.error('Errore durante il caricamento:', errore);
          this.caricamento.set(false);
          this.erroreCaricamento.set('Errore durante il caricamento');
        }
      });
  }

  caricaInterventi(): Intervento[] {
    return this.interventi();
  }

  completa(id: string) {
    this.erroreOperazione.set('');
    const url = `${this.apiUrl}/${id}`;
    this.http
      .patch<Intervento>(url, { //PATCH comunica al server di modificare soltanto lo stato
        stato: 'Completato'
      }) //JSON Server aggiorna db.json e restituisce l’intervento completo
      .subscribe({
        next: interventoAggiornato => {
          this.interventi.update(elenco =>
            elenco.map(intervento =>
              intervento.id === id
                ? interventoAggiornato
                : intervento
            )
          );
        },
        error: errore => {
          console.error(
            'Errore durante il completamento:',
            errore
          );
          this.erroreOperazione.set(
            'Impossibile completare l’intervento.'
          );
        }
      });
  }

  elimina(id: string) {
    this.erroreOperazione.set('');
    const url = `${this.apiUrl}/${id}`;
    this.http
      .delete<void>(url)
      .subscribe({
        next: () => { //Questo blocco aggiorna quella copia locale (next non ci passa parametri)
          this.interventi.update(elenco =>
            elenco.filter(
              intervento => intervento.id !== id
            )
          );
        },
        error: errore => {
          console.error(
            'Errore durante l’eliminazione:',
            errore
          );
          this.erroreOperazione.set(
            'Impossibile eliminare l’intervento.'
          );
        }
      });
  }

  avvia(id: string) {
    this.erroreOperazione.set('');
    const url = `${this.apiUrl}/${id}`;

    this.http
      .patch<Intervento>(url, {
        stato: 'In corso'
      })
      .subscribe({ //subscribe() avvia l’Observable HTTP e stabilisce cosa fare quando arriva una risposta
        next: interventoAggiornato => {
          this.interventi.update(elenco =>
            elenco.map(intervento =>
              intervento.id === id
                ? interventoAggiornato
                : intervento
            )
          );
        },
        error: errore => {
          console.error(
            'Errore durante l’avvio:',
            errore
          );

          this.erroreOperazione.set(
            'Impossibile avviare l’intervento.'
          );
        }
      });
  }

  aggiungi(cliente: string, descrizione: string, tecnico: string) {
    const nuovoIntervento: Omit<Intervento, 'id'> = {
      cliente,
      descrizione,
      stato: 'Da svolgere',
      tecnico
    }; // oggetto con tutte le proprietà di Intervento tranne id

    this.salvataggio.set(true);
    return this.http
      .post<Intervento>(this.apiUrl, nuovoIntervento)
      .pipe(
        tap(interventoCreato => {
          this.interventi.update(elenco => [
            ...elenco,
            interventoCreato
          ]);
        }),
        finalize(() => {
          this.salvataggio.set(false);
        })
      );
  }
  /*Prima il servizio eseguiva direttamente subscribe,
  di conseguenza, App non poteva sapere quando la richiesta
  fosse realmente terminata.
  La nuova versione restituisce la richiesta: return consegna
  l’Observable ad App. La richiesta verrà controllata dal componente padre
  Quando il server restituisce l’intervento:
1. tap riceve interventoCreato;
2. il servizio lo aggiunge al signal;
3. Angular aggiorna l’elenco
finalize viene eseguito quando la richiesta termina, sia in caso di successo che di errore. In questo caso, finalize serve a disattivare il segnale salvataggio, che indica al componente padre che la richiesta è terminata.

App deve reagire al successo?
Sì  → servizio restituisce Observable, App fa subscribe
No  → il servizio può fare subscribe internamente
*/

  aggiorna(id: string, cliente: string, descrizione: string, tecnico: string) {
    const url = `${this.apiUrl}/${id}`;
    this.salvataggio.set(true);
    return this.http
      .patch<Intervento>(url, {
        cliente,
        descrizione,
        tecnico
      })
      .pipe(
        tap(interventoAggiornato => {
          this.interventi.update(elenco =>
            elenco.map(intervento =>
              intervento.id === id
                ? interventoAggiornato
                : intervento
            )
          );
        }),
        finalize(() => {
          this.salvataggio.set(false);
        })
      );
  }
}
/*update modifica il valore contenuto in un signal usando il suo valore attuale.
interventi è un signal che contiene un array, quando viene fatto update, Angular:
prende l’array attuale e lo passa nel parametro elenco;
esegue la funzione;
salva nel signal il nuovo array restituito;
aggiorna le parti della pagina che dipendono da quel signal.

La differenza tra set e update è:
- set sostituisce il valore del signal con un nuovo valore;
- update prende il valore attuale del signal, lo modifica e lo salva di nuovo nel signal. salvataggio fatto da post o patch
*/
