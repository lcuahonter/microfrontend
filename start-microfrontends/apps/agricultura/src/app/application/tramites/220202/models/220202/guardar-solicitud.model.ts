export interface GuardarSolicitud {
  id_solicitud: number | null;
  datos_solicitud: DatosSolicitud;
  transporte: Transporte;
  terceros: Terceros;
  pago: Pago;
  solicitante: Solicitante;
  representacion_federal: RepresentacionFederal;
}

// ================= DATOS SOLICITUD ===================
export interface DatosSolicitud {
  cve_aduana: string;
  oficina_inspeccion_sanidad_agropecuaria: string;
  punto_inspeccion: string;
  numero_autorizacion: string;
  clave_regimen: string;
  numero_carro_ferrocarril: string;
  mercancia: Mercancia[];
}

/**
 * Mercancia agragada a una solicitud
 * @interface Mercancia
 */
export interface Mercancia {
  tipo_requisito: number;
  requisito: string;
  numero_certificado: string;
  cve_fraccion: string;
  id_fraccion_gubernamental: number;
  clave_nico: string;
  descripcion_mercancia: string;
  cantidad_umt: number;
  clave_unidad_medida: string;
  cantidad_umc: number;
  clave_unidad_comercial: string;
  id_uso_mercancia_tipo_tramite: number;
  id_tipo_producto_tipo_tramite: number;
  numero_lote: string;
  clave_paises_origen: string;
  clave_paises_procedencia: string;
  idNombreCientifico: string;
  lista_detalle_mercancia: DetalleMercancia[];
}

/**
 * lista del detalle de cada registro de mercancia
 * @interface DetalleMercancia
 */
export interface DetalleMercancia {
  id_vida_silvestre: string;
}

/**
 * tipo de transporte de una solicitud
 * @interface Transporte
*/
export interface Transporte {
  ide_medio_transporte: string;
  identificacion_transporte: string;
  id_punto_verificacion: number;
  razon_social: string;
}

/**
 * terceros relacionados de una solicitud
 * @interface Terceros
*/
export interface Terceros {
  terceros_exportador: TerceroExportador[];
  terceros_destinatario: TerceroDestinatario[];
}

/**
 * terceros relacionados de una solicitud
 * @interface TerceroExportador
*/
export interface TerceroExportador {
  tipo_persona_sol: string;
  persona_moral: boolean;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  razon_social: string | null;
  pais: string;
  descripcion_ubicacion: string;
  lada: string | null;
  telefonos: string | null;
  correo: string;
}

/**
 * terceros relacionados de una solicitud
 * @interface TerceroDestinatario
*/
export interface TerceroDestinatario {
  tipo_persona_sol: string;
  persona_moral: boolean;
  num_establ_tif: string | null;
  nom_establ_tif: string | null;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  razon_social: string | null;
  pais: string;
  codigo_postal: string;
  cve_entidad: string;
  cve_deleg_mun: string;
  cve_colonia: string;
  calle: string;
  num_exterior: string;
  num_interior: string | null;
  lada: string | null;
  telefonos: string | null;
  correo: string;
}

/**
 * datos del pago de una solicitud
 * @interface Pago
*/
export interface Pago {
  exento_pago: boolean;
  ide_motivo_exento_pago: string | null;
  cve_referencia_bancaria: string;
  cadena_pago_dependencia: string;
  cve_banco: string;
  llave_pago: string;
  fec_pago: string;
  imp_pago: number;
}

/**
 * datos del solicitante
 * @interface Solicitante
*/
export interface Solicitante {
  rfc: string;
  rol_capturista: string;
  nombre: string;
  es_persona_moral: boolean;
  certificado_serial_number: number;
}

/**
 * representacion federal del solicitante
 * @interface RepresentacionFederal
*/export interface RepresentacionFederal {
  cve_entidad_federativa: string;
  cve_unidad_administrativa: string;
}

/**
 * Representa la respuesta despues del request de guardado.
 */
export interface RespuestaGuardarSolicitud {
  codigo: string;
  id_solicitud: number;
  fecha_actualización: string;
}