import { Solicitante } from '@libs/shared/data-access-user/src/core/models/shared/cadena-original-request.model';

/**
 * Estado del módulo T32504 usado en el store del trámite.
 * Contiene identificador de solicitud, datos de la empresa, clave `adace` y
 * el listado de direcciones/domicilios asociados.
 */
export interface T32504State {
  /** Identificador de la solicitud o `null` cuando aún no existe. */
  idSolicitud: number | null;
  /** Datos generales de la empresa relacionada con la solicitud. */
  datosEmpresa: DatosEmpresa;
  /** Código o identificador `adace` asociado al trámite. */
  adace: string;
  /** Lista de domicilios/lugares registrados para el trámite. */
  direcciones: DatosDomicilioLugar[];
}

/**
 * Información general de la empresa requerida por el trámite.
 */
export interface DatosEmpresa {
  /** Número del programa IMMEX asociado. */
  numero_programa_immex: string;
  /** Clave del permiso otorgado por SEDENA si aplica. */
  clave_permiso_sedena: string;
  /** Tipo de carga asociada al trámite. */
  tipo_carga: string;
  /** Valor genérico utilizado en UI (mes seleccionado en la pantalla inicial). */
  ide_generica2: string; //mes que se selecciona en pantalla inicial
  /** Valor genérico utilizado en UI (año seleccionado en la pantalla inicial). */
  ide_generica3: string; // año que se selecciona en pantalla inicial
}

/**
 * Representa los datos de un domicilio o lugar donde se realizan operaciones
 * de submanufactura dentro del trámite.
 */
export interface DatosDomicilioLugar {
  /** Identificador temporal usado en cliente para ediciones locales. */
  idTemporal?: number;
  /** RFC de la persona o entidad que recibe. */
  rfc: string;
  /** Número de programa IMMEX (opcional). */
  programa_immex?: string;
  /** Año del programa IMMEX (opcional). */
  anio_programa_immex?: string;
  /** Nombre comercial del domicilio. */
  nombre_comercial: string;
  /** Clave de la entidad federativa (estado). */
  clave_entidad_federativa: string;
  /** Descripción de la entidad federativa (opcional, calculada). */
  descEntidadFederativa?: string;
  /** Clave de la delegación o municipio. */
  clave_delegacion_municipio: string;
  /** Descripción de la alcaldía/municipio (opcional, calculada). */
  descAlcaldiaMunicipio?: string;
  /** Clave de la colonia. */
  colonias: string;
  /** Descripción de la colonia (opcional, calculada). */
  descColonias?: string;
  /** Nombre de la calle. */
  calle: string;
  /** Número exterior del domicilio. */
  numero_exterior: string;
  /** Número interior del domicilio (opcional). */
  numero_interior: string;
  /** Código postal del domicilio. */
  codigo_postal: string;
  /** Lista de mercancías asociadas a este domicilio. */
  mercancias: DatosMercanciaSubmanufactura[];
}

/**
 * Datos de una mercancía utilizada en operaciones de submanufactura.
 */
export interface DatosMercanciaSubmanufactura {
  /** Identificador temporal en cliente para edición/selección. */
  idTemporal?: number;
  /** Clave de la fracción arancelaria aplicable. */
  clave_fraccion_arancelaria: string;
  /** Descripción de la fracción arancelaria. */
  descFraccion: string;
  /** Código NICO de la mercancía. */
  nico: string;
  /** Clave de la unidad de medida. */
  clave_unidad_medida: string;
  /** Descripción de la unidad de medida. */
  descUnidadMedida: string;
  /** Cantidad de la mercancía (como string por formato). */
  cantidad: string;
  /** Valor en dólares estadounidenses (USD) como texto formateado. */
  valor_usd: string;
  /** Descripción libre de la mercancía. */
  descripcion_mercancia: string;
}

/**
 * Estructura para representar columnas de la tabla de domicilios en la UI.
 */
export interface ColumnasTabla {
  rfc: string;
  nombreComercial: string;
  entidadFederativa: string;
  alcaldiaMunicipio: string;
  colonias: string;
}
/**
 * Estructura para las columnas de la tabla de mercancías en la UI.
 */
export interface ColumnsTableMercancia {
  fracArancelaria: string;
  nico: string;
  unidadMedida: string;
  cantidad: string;
  valorUsd: string;
  descripcionMercancia: string;
}

/**
 * Respuesta genérica de plantilla para llamadas relacionadas al trámite T32504.
 */
export interface PlantillaReponseT32504 {
  codigo: string;
  mensaje: string;
}

/**
 * Request para guardar (crear/actualizar) una solicitud T32504.
 */
export interface GuardarSolicitudT32504Request {
  id_solicitud: number | null;
  solicitante: Solicitante;
  direcciones: DatosDomicilioLugar[];
  cve_rol_capturista: string;
  cve_usuario_capturista: string;
  boolean_generico: string;
  descripcion_generica3: string;
  numero_programa_immex: string;
  clave_permiso_sedena: string;
  ide_generica2: string;
  ide_generica3: string;
  clave_tipo_carga_masiva: string;
  adace: string;
  tipo_carga: string;
  representacion_federal: {
    cve_unidad_administrativa: string;
  };
}

/**
 * Request para guardado masivo de solicitudes T32504 (sin direcciones).
 */
export interface GuardarMasivoT32504Request {
  id_solicitud: number | null;
  solicitante: Solicitante;
  cve_rol_capturista: string;
  cve_usuario_capturista: string;
  numero_programa_immex: string;
  clave_permiso_sedena: string;
  ide_generica2: string; //mes que se selecciona en pantalla inicial
  ide_generica3: string; // año que se selecciona en pantalla inicial
  adace: string;
  tipo_carga: string;
  tipo_llenado: string;
  representacion_federal: {
    cve_unidad_administrativa: string;
  };
}

/**
 * Resultado devuelto por la API al guardar una solicitud.
 */
export interface GuardarResponse {
  id_solicitud: number;
  fecha_creacion: string;
  validacion_archivo: string;
}

export interface ResultadoSolicitud {
  /**
   * Indica si la solicitud fue exitosa.
   */
  exito: boolean;

  /**
   * Mensaje de error o éxito de la solicitud.
   */
  mensaje?: string;

  /**
   * Errores del modelo, si los hay.
   */
  erroresModelo?: { campo: string; errores: string[] }[];
}
