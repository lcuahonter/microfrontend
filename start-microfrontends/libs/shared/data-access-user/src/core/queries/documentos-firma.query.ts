import { DocumentosFirmaState, DocumentosFirmaStore } from '../estados/documentos-firma.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';


/**
 * Query para acceder al estado de los documentos de firma.
 * Permite seleccionar información específica del store `DocumentosFirmaStore`.
 */
@Injectable({ providedIn: 'root' })
export class DocumentosFirmaQuery extends Query<DocumentosFirmaState> {

  /** Observable que emite los documentos actuales almacenados en el estado. */
  documentos$ = this.select('documentos');
  /** Observable que emite los documentos especificos almacenados en el estado. */
  documentosEspecificos$ = this.select('documentos_especificos');

  /**
   * Constructor de la clase.
   * 
   * @param store - Instancia del store `DocumentosFirmaStore` que mantiene el estado de los documentos de firma.
   */
  constructor(protected override store: DocumentosFirmaStore) {
    super(store);
  }
}
