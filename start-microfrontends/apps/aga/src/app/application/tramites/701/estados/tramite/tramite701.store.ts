
import { Store, StoreConfig } from '@datorama/akita';
import { DocumentoTabla } from '../../models/response/tipos-documentos-response.model';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un documento en el trámite 701.
 */
export interface Documentos701 {
    cve_persona: number | null;
    cve_doc: number;
    id_documento_solicitud?: number | null;
}

export interface Solicitud701State {
    /** Identificador de la solicitud, puede ser nulo si aún no se ha creado. */
    idSolicitud: number | null;

    /** Lista de documentos asociados a la solicitud. */
    documentos: Documentos701[];

    /** Documentos guardados en el estado antes de cambiar de tab. */
    documentosGuardados: DocumentoTabla[];
}

/**
 * Crea el estado inicial del trámite 701.
 * @returns Estado inicial de tipo `Solicitud701State`.
 */
export function createInitialState(): Solicitud701State {
    return {
        idSolicitud: 0,
        documentos: [],
        documentosGuardados: []
    }
}

/**
 * Servicio de estado global para gestionar el trámite 701 con Akita.
 * Proporciona métodos para actualizar cada campo del estado.
 */
@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'tramite701', resettable: true })
export class Tramite701Store extends Store<Solicitud701State> {
    /**
     * Constructor que inicializa el estado con los valores predeterminados.
     */
    constructor() {
        super(createInitialState());
    }

    /**
 * Guarda el ID de la solicitud en el estado.
 *
 * @param idSolicitud - El ID de la solicitud que se va a guardar.
 */
    public setIdSolicitud(idSolicitud: number): void {
        this.update((state) => ({
            ...state,
            idSolicitud,
        }));
    }

    /**
     * Guarda la lista de documentos en el estado.
     *
     * @param documentos - La lista de documentos que se va a guardar.
     */
    public setDocumentos(documentos: Documentos701[]): void {
        this.update((state) => ({
            ...state,
            documentos,
        }));
    }

    /**
     * Guarda la lista de documentos en el estado antes de cambiar de tab.
     *
     * @param documentosGuardados - La lista de documentos que se va a guardar.
     */
    public setDocumentosGuardados(documentosGuardados: DocumentoTabla[]): void {
        this.update((state) => ({
            ...state,
            documentosGuardados,
        }));
    }
}