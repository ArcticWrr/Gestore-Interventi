export interface Intervento {
  id: number;
  cliente: string;
  descrizione: string;
  stato: 'Da svolgere' | 'Completato';
  tecnico: string;
}