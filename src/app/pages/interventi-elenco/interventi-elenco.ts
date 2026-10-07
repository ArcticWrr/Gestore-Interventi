import { Component,  computed, inject, signal } from '@angular/core';
import type { Intervento } from '../../models/intervento';
import { InterventoCard } from '../../components/intervento-card/intervento-card';
import { InterventiService } from '../../services/interventi.service';
import { InterventoForm } from '../../components/intervento-form/intervento-form';
import { InterventoFiltro } from '../../components/intervento-filtro-stato/intervento-filtro-stato';

@Component({
  selector: 'app-interventi-elenco',
  imports: [InterventoCard, InterventoForm, InterventoFiltro],
  templateUrl: './interventi-elenco.html',
  styleUrls: ['./interventi-elenco.css'],
})
/*L’importazione in cima rende disponibile la classe nel file;
 quella dentro @Component permette di usare il componente nel template. */
export class InterventiElenco {
  nuovoCliente = '';
  nuovoDescrizione = '';
  nuovoTecnico = '';
  nuoveNote = '';
  nuovaDataIntervento = '';
  errore = '';
  filtroStato = signal('Tutti'); //signal contiene un valore e permette ad Angular di sapere quando cambia
  ricercaCliente = signal('');  //Questo signal conserva il valore usato per filtrare l’elenco
  idInModifica: string | null = null;
 
  private interventiService = inject(InterventiService);
  caricamento = this.interventiService.caricamento;
  erroreCaricamento = this.interventiService.erroreCaricamento;
  salvataggio = this.interventiService.salvataggio;
  erroreOperazione = this.interventiService.erroreOperazione;

  get interventi(): Intervento[] {
    return this.interventiService.caricaInterventi();
  }

  resetModulo() {
    this.idInModifica = null;
    this.nuovoCliente = '';
    this.nuovoDescrizione = '';
    this.nuovoTecnico = '';
    this.errore = '';
    this.nuovaDataIntervento = '';
    this.nuoveNote = '';
  }

  completaIntervento(id: string) {
    this.interventiService.completa(id);
  }

  eliminaIntervento(id: string) {
    this.interventiService.elimina(id);

    if (this.idInModifica === id) {
      this.resetModulo();
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
    this.nuoveNote = intervento.note;
    this.errore = '';
  }

  avviaIntervento(id: string) {
    this.interventiService.avvia(id);
  }

  salvaIntervento() {
    const cliente = this.nuovoCliente.trim();
    const descrizione = this.nuovoDescrizione.trim();
    const tecnico = this.nuovoTecnico.trim();
    const dataIntervento = this.nuovaDataIntervento;
    const note = this.nuoveNote.trim();

    const campiBaseMancanti = (!cliente || !descrizione || !tecnico);
    const dataMancanteInCreazione = this.idInModifica === null && !dataIntervento;

    if (campiBaseMancanti || dataMancanteInCreazione) {
      this.errore =
        'Compila cliente, descrizione, tecnico e data.';
      return;
    }

    this.errore = '';

    if (this.idInModifica !== null) { // modifica un intervento esistente
      this.interventiService
        .aggiorna(this.idInModifica, cliente, descrizione, tecnico, note)
        .subscribe({
          next: () => {
            this.resetModulo();
          },
          error: errore => {
            console.error(errore);
            this.errore = 'Impossibile salvare le modifiche.';
          }
        });

      return;
    } else { //creo nuovo intervento
      this.interventiService
        .aggiungi(cliente, descrizione, tecnico, dataIntervento, note)
        .subscribe({
          next: () => {
            this.resetModulo();
          },
          error: errore => {
            console.error(errore);
            this.errore = 'Impossibile aggiungere l’intervento.';
          }
        });
      }
  }
  /*Abbiamo spostato .subscribe() e i suoi blocchi next/error in App perché è App che gestisce il modulo
  e deve decidere cosa fare dopo la risposta del server.
  App poteva solo avviare l’operazione ma non sapeva quando fosse terminata. Per questo svuotava subito il modulo,
  anche se il server poteva fallire.
  Ora il servizio restituisce l’Observable e App si iscrive*/


  interventiFiltrati = computed(() => {
  const filtro = this.filtroStato();
  const ricerca = this.ricercaCliente()
    .trim()
    .toLowerCase();

  return this.interventi.filter(intervento => {
    const corrispondeStato =
      filtro === 'Tutti' ||
      intervento.stato === filtro;

    const corrispondeCliente =
      intervento.cliente
        .toLowerCase()
        .includes(ricerca);

    return corrispondeStato && corrispondeCliente;
  });
  });

}
/* Questo file contiene i dati del componente e la sua configurazione:
- import rende disponibile Component, fornito da Angular.
- Component(...) identifica la classe come componente e la collega ai file HTML e CSS.
- selector: 'app-root' indica il tag HTML che ospita il componente.
- export class App contiene le proprietà che useremo nella pagina. */
