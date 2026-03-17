export interface UploadDocumentResponse {
  codigo: string;
  mensaje?: string;
  datos?: Datos;
  error?: string;
  errores_modelo?: ErrorModelo[];
}


export interface ErrorModelo {
  campo: string;
  errores: string[];
}

export interface Datos {
  idSolicitud: string;
  referenciaSolicitud: string;
  uploadDocutoResponses: UploadDocutoResponse[];
}

export interface UploadDocutoResponse {
  documentoUUID: string;
  nombre: string;
  cargaEstadoKafka: string;
}


export interface DocumentoProcesadoResponse {
  codigo: string;
  mensaje: string;
  datos: DocumentoProcesado[];
}

export interface DocumentoProcesado {
  id_documento: number;
  nombre: string;
  estado_documento: string;
  fecha_creacion: string;
  inicio_vigencia: string;
  fin_vigencia: string;
  ruta_archivo: string;
  e_documento: string;
  mensaje_guardado: string;
  documento_uuid: string;
  carga_estado_kafka: string;
  cadena_original: string;
  id_tipo_documento: number
}

export interface Usuario {
  persona: {
    claveUsuario: string;
    rfc: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
  firmaElectronica: {
    cadenaOriginal: string;
    certificado: string;
    firma: string;
  };
  rolActual: string;
  rfcSolicitante: string;
  idSolicitud: number;
  referenciaSolicitud: string;
}