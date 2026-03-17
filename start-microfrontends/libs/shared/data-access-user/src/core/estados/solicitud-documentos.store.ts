import { Store, StoreConfig } from '@datorama/akita';
import { CatalogoTipoDocumento } from '../models/shared/catalogos.model';
import { Injectable } from "@angular/core";
import { DocumentoRequerimiento } from '../models/iniciar-atender-requerimiento.model';

export interface SolicitudDocumentosState {
    /**
     * Parametro de la lista de documentos seleccionados
     */
    listaDocumentos: CatalogoTipoDocumento[];

    // lista de documentos que fueron guardados en la solicitud
    documentosCargadosSolicitud: DocumentoRequerimiento[];
}
/**
 * Creación del estado inicial para la interfaz de solicitud de documentos
 * @returns SolicitudDocumentosState
 */
export function createInitialSolicitudDocumentosStates(): SolicitudDocumentosState {
    return {
        listaDocumentos: [],
        documentosCargadosSolicitud: []
    };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'DocumentosStates', resettable: true })
export class SolicitudDocumentosStore extends Store<SolicitudDocumentosState> {
    constructor() {
        super(createInitialSolicitudDocumentosStates());
    }
    /**
     * Resetear valores
     */
    resetStore(): void {
        this.reset();
    }
    /**
     * Guarda la lista de documentos requeridos
     * @param listaDocumentos
     */
    setSolicitudDocumentos(listaDocumentos: CatalogoTipoDocumento[]): void {
        this.update(state => ({ ...state, listaDocumentos }));
    }

    /**
 * Guarda la lista de documentos que ya habian sido carcgados en la solicitud
 * @param listaDocumentos
 */
    setDocumentosCargadosSolicitud(documentosCargadosSolicitud: DocumentoRequerimiento[]): void {
        this.update(state => ({ ...state, documentosCargadosSolicitud }));
    }
}
