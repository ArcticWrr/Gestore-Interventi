import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InterventiService } from '../../services/interventi.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  imports: [RouterLink],
  selector: 'app-intervento-dettaglio',
  styleUrl: './intervento-dettaglio.css',
  templateUrl: './intervento-dettaglio.html',
})
export class InterventoDettaglio {
  private route = inject(ActivatedRoute);
  private interventiService = inject(InterventiService);

  id = toSignal(
  this.route.paramMap.pipe(
    map(parametri => parametri.get('id'))
  ),
  { initialValue: null }
);//legge l’ID dall’indirizzo come signal, così il componente si aggiorna se l’ID cambia.

  caricamento = this.interventiService.caricamento;
  erroreCaricamento = this.interventiService.erroreCaricamento;

  intervento = computed(() =>
    this.interventiService
      .caricaInterventi()
      .find(intervento => intervento.id === this.id())
  );
}
