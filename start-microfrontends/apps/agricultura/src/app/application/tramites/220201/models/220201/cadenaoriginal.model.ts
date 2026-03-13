import { DocumentoRequerido, Solicitante } from "@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model";

export interface CadenaOriginalRequest {
    num_folio_tramite: string | null;
    boolean_extranjero: boolean;
    documento_requerido?: DocumentoRequerido[];
    solicitante: Solicitante;
    cve_rol_capturista: string;
    cve_usuario_capturista: string;
    fecha_firma: string;
}