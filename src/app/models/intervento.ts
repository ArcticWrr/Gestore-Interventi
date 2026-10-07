export interface Intervento {
  id: string;
  cliente: string;
  descrizione: string;
  stato: 'Da svolgere' | 'In corso' | 'Completato';
  tecnico: string;
}