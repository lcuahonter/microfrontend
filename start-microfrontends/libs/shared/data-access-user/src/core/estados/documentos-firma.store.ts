import { Store, StoreConfig } from '@datorama/akita';
import { DocumentoProcesado } from '../models/shared/cargar-documentos.model';
import { DocumentoRequeridoFirmar } from '../models/shared/firma-electronica/request/firmar-request.model';
import { Injectable } from '@angular/core';

/**
 * Estado de los documentos de firma.
 */
export interface DocumentosFirmaState {
    /** Lista de documentos que requieren firma. */
    documentos: DocumentoRequeridoFirmar[];
    /** Lista de documentos especificos que requieren firma. */
    documentos_especificos: DocumentoProcesado[]
}

/**
 * Función que crea el estado inicial para `DocumentosFirmaState`.
 * 
 * @returns Estado inicial con la lista de documentos vacía.
 */
export function createInitialStateDocumentosFirma(): DocumentosFirmaState {
    return {
        documentos: [],
        documentos_especificos: []
    };
}

/**
 * Store para manejar el estado de los documentos de firma.
 * Proporciona una fuente de verdad reactiva para el estado `DocumentosFirmaState`.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'documentos-firma' })
export class DocumentosFirmaStore extends Store<DocumentosFirmaState> {
    /**
     * Constructor del store.
     * Inicializa el store con el estado inicial definido por `createInitialState`.
     */
    constructor() {
        super(createInitialStateDocumentosFirma());
    }
}

