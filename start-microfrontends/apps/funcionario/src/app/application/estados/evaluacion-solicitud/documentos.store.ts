import { Store, StoreConfig } from '@datorama/akita';
import { CatalogoTipoDocumento } from '@libs/shared/data-access-user/src';
import { Injectable } from "@angular/core";

export interface SolicitudDocumentosState {
    /**
     * Parametro de la lista de documentos seleccionados
     */
    documentosSeleccionados: CatalogoTipoDocumento[];
}
/**
 * Creación del estado inicial para la interfaz de solicitud de documentos
 * @returns SolicitudDocumentosState
 */
export function createInitialState(): SolicitudDocumentosState {
    return {
        documentosSeleccionados: []
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'DocumentosStates', resettable: true })
export class DocumentosStates extends Store<SolicitudDocumentosState> {
    constructor() {
        super(createInitialState());
    }
    /**
     * Resetear valores
     */
    resetStore() {
        this.reset();
    }
    /**
     * Guarda la lista de documentos requeridos
     * @param documentosSeleccionados 
     */
    setSolicitudDocumentos(documentosSeleccionados: CatalogoTipoDocumento[]) {
        this.update(state => ({ ...state, documentosSeleccionados }));
    }
}
