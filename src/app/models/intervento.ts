export interface Intervento {
  id: string;
  cliente: string;
  descrizione: string;
  dataIntervento: string;
  note: string;
  stato: 'Da svolgere' | 'In corso' | 'Completato';
  tecnico: string;
}