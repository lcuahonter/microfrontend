/**
 * Modelo de datos para el trámite 31907.
 *
 * Representa los campos mínimos esperados para una solicitud relacionada con el trámite 31907.
 * Las propiedades son opcionales porque dependiendo del flujo algunas pueden no estar presentes.
 *
 * Ejemplo:
 * const ejemplo: T31907Model = { idSolicitud: 123, folioTramite: 'FT-2025-0001' };
 */
export interface T31907Model {
	/** 
	 * Identificador numérico de la solicitud.
	 * Corresponde al id interno en la base de datos o sistema de gestión.
	 * @example 123
	 */
	idSolicitud?: number;
	/** 
	 * Folio del trámite tal como se muestra al usuario o en documentos oficiales.
	 * Cadena alfanumérica que puede incluir prefijos y guiones.
	 * @example "FT-2025-0001"
	 */
	folioTramite?: string;
}

/**
 * Detalle de una solicitud específica del trámite 31907.
 */
export interface DetalleSolicitud31907 {
	/**
	 * Identificador numérico de la solicitud.
	 * @example 12345
	 */
	id_solicitud: number,

	/**
	 * Folio del trámite asociado a la solicitud.
	 * @example "FT-2024-0001"
	 */
	num_folio_original: string,
	/**
	 * RFC del solicitante de la solicitud.
	 * @example "XAXX010101000"
	 */
	rfc_solicitante: string

	/**
	 * Justificación proporcionada en la solicitud.
	 */
	justificacion?: string
}


