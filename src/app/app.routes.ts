import { Routes } from '@angular/router';
import { InterventoDettaglio } from './pages/intervento-dettaglio/intervento-dettaglio';


export const routes: Routes = [
  {
    path: 'interventi/:id',
    component: InterventoDettaglio
  }
];
/*Quando l’indirizzo corrisponde a interventi/qualcosa, mostra il componente
 InterventoDettaglio.*/
