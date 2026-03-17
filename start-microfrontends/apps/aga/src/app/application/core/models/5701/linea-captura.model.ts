/**
 * Representa una línea de captura utilizada para pagos o transacciones.
 *
 * @property lineaCaptura - Cadena que identifica la línea de captura.
 * @property monto - Monto asociado a la línea de captura.
 */
export interface LineaCaptura {
  lineaCaptura: string;
  monto: number;
}

/**
 * Representa la respuesta de validación para una línea de captura pagada.
 *
 * @property codigo - Código de resultado de la validación.
 * @property mensaje - Mensaje descriptivo del resultado.
 * @property datos - Datos detallados de la línea de captura pagada.
 */
export interface ValidaLineaCapturaPagadaResponse {
  codigo: string;
  mensaje: string;
  datos: DatosLineaCapturaPagada;
}

/**
 * Representa los datos de una línea de captura pagada.
 *
 * @property mensaje - Mensaje descriptivo del estado de la línea de captura.
 * @property pago_model - Modelo de pago asociado a la línea de captura.
 * @property valido - Indica si la línea de captura es válida.
 */
export interface DatosLineaCapturaPagada {
  mensaje: string;
  pago_model: PagoModel;
  valido: boolean;
}

/**
 * Representa un modelo de pago asociado a una línea de captura.
 *
 * @property ic - Identificador de la línea de captura.
 * @property aduana - Nombre de la aduana asociada al pago.
 * @property cve_aduana - Código de la aduana.
 * @property descripcion_tipo_documento - Descripción del tipo de documento.
 * @property documento - Documento asociado al pago.
 * @property estatus - Estado del pago.
 * @property fecha_pago - Fecha en que se realizó el pago.
 * @property guias - Información de las guías asociadas al pago.
 * @property importe - Importe del pago.
 * @property institucion_bancaria - Institución bancaria donde se realizó el pago.
 * @property patente - Patente asociada al pago.
 * @property transaccion - Identificador de la transacción del pago.
 */
export interface PagoModel {
  ic: string;
  aduana: string;
  cve_aduana: string;
  descripcion_tipo_documento: string;
  documento: string;
  estatus: string;
  fecha_pago: string;
  guias: string;
  importe: number;
  institucion_bancaria: string;
  patente: string;
  transaccion: string;
}
