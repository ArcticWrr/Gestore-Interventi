import { Routes } from '@angular/router';
import { InterventoDettaglio } from './pages/intervento-dettaglio/intervento-dettaglio';
import { InterventiElenco } from './pages/interventi-elenco/interventi-elenco';

export const routes: Routes = [
  {
    path: '',
    component: InterventiElenco,
    pathMatch: 'full'
  },
  {
    path: 'interventi/:id',
    component: InterventoDettaglio
  }
];
/*Quando l’indirizzo corrisponde a interventi/qualcosa, mostra il componente
 InterventoDettaglio. http://localhost:4200/ -> InterventiElenco*/
