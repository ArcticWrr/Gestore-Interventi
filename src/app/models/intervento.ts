export interface Intervento {
  id: string;
  cliente: string;
  descrizione: string;
  stato: 'Da svolgere' | 'Completato';
  tecnico: string;
}