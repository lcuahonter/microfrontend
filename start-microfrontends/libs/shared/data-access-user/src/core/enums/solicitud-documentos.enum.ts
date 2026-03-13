import { CatalogoTipoDocumento } from "../models/shared/catalogos.model";

export const CONFIGURACION_ENCABEZADO_DOCUMENTOS = [
    { encabezado: 'Tipo de documento', clave: (item: CatalogoTipoDocumento) => item.description, orden: 1 },
]

export const API_GET_DOCUMENTOS_ESPECIFICOS = (TRAMITE: string) : string => `sat-t${TRAMITE}/requerimiento/generar/documentos-especificos`;