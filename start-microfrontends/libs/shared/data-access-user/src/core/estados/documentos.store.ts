import { Store, StoreConfig } from "@datorama/akita";
import { Injectable } from "@angular/core";
import { TipoDocumentos } from "../models/shared/anexar-documentos.model";

/**
 * Modelo para almacenar la información del estado de los documentos requeridos y opcionales
 */

export interface DocumentosState {
    catalogoDocumentosRequeridos: TipoDocumentos[];
    catalogoDocumentosOpcionales: TipoDocumentos[];
}

/**
 * Creación del estado inicial para el catálogo de documentos
 * @returns CatalogoDocumentos
 */
export function createInitialStateDocumentos(): DocumentosState {
    return {
        catalogoDocumentosRequeridos: [],
        catalogoDocumentosOpcionales: [],
    }
}

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'documentos', resettable: true })
export class DocumentosStore extends Store<DocumentosState> {
    constructor() {
        super(createInitialStateDocumentos());
    }

    /**
     * Guarda el catálogo de documentos en el state
     *
     * @param catalogoDocumentos
     */
    public establecerCatalogoDocumentos(catalogoDocumentos: TipoDocumentos[]): void {
        this.update((state) => ({
            ...state,
            catalogoDocumentos,
        }));
    }
}
