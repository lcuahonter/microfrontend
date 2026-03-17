import { DocumentosState, DocumentosStore } from "../estados/documentos.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

@Injectable({ providedIn: 'root' })
export class DocumentosQuery extends Query<DocumentosState> {
    /**
     * Selecciona el estado completo de la sección
     */
    selectDocumentoState$ = this.select((state) => {
        return state;
    });

    constructor(protected override store: DocumentosStore) {
        super(store);
    }
}