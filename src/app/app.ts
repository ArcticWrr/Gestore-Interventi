import { Component,  computed, inject, signal } from '@angular/core';
import type { Intervento } from './models/intervento';
import { InterventoCard } from './components/intervento-card/intervento-card';
import { InterventiService } from './services/interventi.service';
import { InterventoForm } from './components/intervento-form/intervento-form';
import { InterventoFiltro } from './components/intervento-filtro-stato/intervento-filtro-stato';

@Component({
  selector: 'app-root',
  imports: [InterventoCard, InterventoForm, InterventoFiltro],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
/*L’importazione in cima rende disponibile la classe nel file;
 quella dentro @Component permette di usare il componente nel template. */
export class App {
  nuovoCliente = '';
  nuovoDescrizione = '';
  nuovoTecnico = '';
  errore = '';
  filtroStato = signal('Tutti'); //signal contiene un valore e permette ad Angular di sapere quando cambia
  idInModifica: string | null = null;
 
  private interventiService = inject(InterventiService);
  caricamento = this.interventiService.caricamento;
  erroreCaricamento = this.interventiService.erroreCaricamento;
  salvataggio = this.interventiService.salvataggio;

  get interventi(): Intervento[] {
    return this.interventiService.caricaInterventi();
  }
  
completaIntervento(id: string) {
  this.interventiService.completa(id);
}

eliminaIntervento(id: string) {
  this.interventiService.elimina(id);

  if (this.idInModifica === id) {
    this.annullaModifica();
  }
}
/*Il servizio elimina il dato. Il componente decide se svuotare
 il modulo, perché è un comportamento dell’interfaccia*/

  modificaIntervento(id: string) {
  const intervento = this.interventi.find(
    elemento => elemento.id === id
  );

  if (!intervento) {
    return;
  }

  this.idInModifica = id;
  this.nuovoCliente = intervento.cliente;
  this.nuovoDescrizione = intervento.descrizione;
  this.nuovoTecnico = intervento.tecnico;
  this.errore = '';
}

annullaModifica() {
  this.idInModifica = null;
  this.nuovoCliente = '';
  this.nuovoDescrizione = '';
  this.nuovoTecnico = '';
  this.errore = '';
}

  salvaIntervento() {
    const cliente = this.nuovoCliente.trim();
    const descrizione = this.nuovoDescrizione.trim();
    const tecnico = this.nuovoTecnico.trim();

    if (!cliente || !descrizione || !tecnico) {
      this.errore = 'Compila cliente, descrizione e tecnico.';
      return;
    }

    this.errore = '';

    if (this.idInModifica !== null) {
      this.interventiService
        .aggiorna(
          this.idInModifica,
          cliente,
          descrizione,
          tecnico
        )
        .subscribe({
          next: () => {
            this.annullaModifica();
          },
          error: errore => {
            console.error(errore);
            this.errore = 'Impossibile salvare le modifiche.';
          }
        });

      return;
    }
/*Abbiamo spostato .subscribe() e i suoi blocchi next/error in App perché è App che gestisce il modulo
e deve decidere cosa fare dopo la risposta del server.
App poteva solo avviare l’operazione ma non sapeva quando fosse terminata. Per questo svuotava subito il modulo,
anche se il server poteva fallire.
Ora il servizio restituisce l’Observable e App si iscrive*/
    this.interventiService
      .aggiungi(cliente, descrizione, tecnico)
      .subscribe({
        next: () => {
          this.annullaModifica();
        },
        error: errore => {
          console.error(errore);
          this.errore = 'Impossibile aggiungere l’intervento.';
        }
      });
  }

  interventiFiltrati = computed(() => {
    const filtro = this.filtroStato();

    if (filtro === 'Tutti') {
      return this.interventi;
    }

    return this.interventi.filter(
      intervento => intervento.stato === filtro
    );
  });

}
/* Questo file contiene i dati del componente e la sua configurazione:
- import rende disponibile Component, fornito da Angular.
- Component(...) identifica la classe come componente e la collega ai file HTML e CSS.
- selector: 'app-root' indica il tag HTML che ospita il componente.
- export class App contiene le proprietà che useremo nella pagina. */
