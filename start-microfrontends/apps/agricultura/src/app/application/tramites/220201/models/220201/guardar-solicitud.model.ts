/**
 * Interfaz que representa la estructura de un objeto "GuardaSolicitud".
 *
 * @interface GuardaSolicitud
 * @property {number | null} id_solicitud - El identificador único de la solicitud, o null si no está asignado.
 * @property {object} datos_solicitud - Detalles de la solicitud.
 * @property {string} datos_solicitud.cve_aduana - Clave de aduana asociada con la solicitud.
 * @property {string} datos_solicitud.oficina_inspeccion_sanidad_agropecuaria - Oficina de inspección de sanidad agropecuaria.
 * @property {string} datos_solicitud.punto_inspeccion - Punto de inspección.
 * @property {string} datos_solicitud.clave_UCON - Clave UCON para la solicitud.
 * @property {string} datos_solicitud.establecimiento_TIF - Información del establecimiento TIF.
 * @property {string} datos_solicitud.nombre_veterinario - Nombre del veterinario involucrado.
 * @property {string} datos_solicitud.numero_autorizacion - Número de autorización.
 * @property {string} datos_solicitud.clave_regimen - Clave del régimen para la solicitud.
 * @property {Mercancia[]} datos_solicitud.mercancia - Lista de detalles de la mercancía.
 * @property {DatosMovilizacion} transporte - Detalles del transporte para la solicitud.
 * @property {Tercerosrelacionados} terceros - Información sobre terceros relacionados.
 * @property {Pago} pago - Detalles del pago para la solicitud.
 * @property {object} solicitante - Información del solicitante.
 * @property {string} solicitante.rfc - RFC (Registro Federal de Contribuyentes) del solicitante.
 * @property {string} solicitante.nombre - Nombre del solicitante.
 * @property {boolean} solicitante.es_persona_moral - Indica si el solicitante es una persona moral.
 * @property {string} solicitante.certificado_serial_number - Número de serie del certificado del solicitante.
 * @property {object} representacion_federal - Detalles de la representación federal.
 * @property {string} representacion_federal.cve_entidad_federativa - Clave de la entidad federativa (por ejemplo, "DGO").
 * @property {string} representacion_federal.cve_unidad_administrativa - Clave de la unidad administrativa (por ejemplo, "1016").
 */
export interface GuardaSolicitud {
    id_solicitud: number | null,
    datos_solicitud: {
        clave_regimen: string,
        cve_aduana: string,
        oficina_inspeccion_sanidad_agropecuaria: string,
        punto_inspeccion: string,
        clave_UCON: string,
        establecimiento_TIF: string,
        nombre_veterinario: string,
        numero_autorizacion: string,
        mercancia: Mercancia[]
    },
    transporte: DatosMovilizacion,
    terceros: Tercerosrelacionados,
    pago: Pago,
    solicitante: {
        rfc: string,
        nombre: string,
        es_persona_moral: true,
        certificado_serial_number: string,
        rol_capturista: string
    },
    representacion_federal: {
        cve_entidad_federativa: "DGO",
        cve_unidad_administrativa: "1016"
    }
}

/**
 * Representa los detalles de una mercancía en un trámite específico.
 * 
 * @property numero_lote_detalle - Número de lote de la mercancía.
 * @property color_pelaje_detalle - Color o pelaje del animal.
 * @property edad_animal_detalle - Edad del animal.
 * @property fase_desarrollo_detalle - Fase de desarrollo del animal.
 * @property funcion_zootecnica_detalle - Función zootécnica del animal.
 * @property nombre_mercancia_detalle - Nombre de la mercancía.
 * @property numeroidentificacion_detalle - Número de identificación del animal.
 * @property raza_detalle - Raza del animal.
 * @property id_sexo_detalle - Identificador del sexo del animal.
 * @property nombre_cientifico_detalle - Nombre científico de la mercancía.
 * @property fecha_sacrificio - Fecha de sacrificio del animal.
 * @property fecha_elaboracion - Fecha de elaboración del producto.
 * @property fecha_caducidad - Fecha de caducidad del producto.
 * @property fecha_elaboracion_fin - Fecha de finalización de elaboración.
 * @property fecha_caducidad_fin - Fecha de finalización de caducidad.
 * @property fecha_sacrificio_fin - Fecha de finalización del sacrificio.
 */
export interface ListaDetalleMercancia {
    numero_lote_detalle: string,
    color_pelaje_detalle: string,
    edad_animal_detalle: string,
    fase_desarrollo_detalle: string,
    funcion_zootecnica_detalle: string,
    nombre_mercancia_detalle: string,
    numeroidentificacion_detalle: string,
    raza_detalle: string,
    id_sexo_detalle: string,
    nombre_cientifico_detalle: string,
    fecha_sacrificio: string,
    fecha_elaboracion: string,
    fecha_caducidad: string,
    fecha_elaboracion_fin: string,
    fecha_caducidad_fin: string,
    fecha_sacrificio_fin: string
}

/**
 * Representa la información de una mercancía en un trámite.
 * 
 * @property tipo_mercancia - Tipo de mercancía.
 * @property tipo_requisito - Tipo de requisito asociado.
 * @property requisito - Descripción del requisito.
 * @property numero_certificado - Número del certificado relacionado.
 * @property cve_fraccion - Clave de la fracción arancelaria.
 * @property id_fraccion_gubernamental - Identificador de la fracción gubernamental.
 * @property clave_nico - Clave NICO asociada.
 * @property descripcion_mercancia - Descripción detallada de la mercancía.
 * @property cantidad_umt - Cantidad en unidad de medida de trámite.
 * @property clave_unidad_medida - Clave de la unidad de medida de trámite.
 * @property cantidad_umc - Cantidad en unidad de medida comercial.
 * @property clave_unidad_comercial - Clave de la unidad de medida comercial.
 * @property id_especie - Identificador de la especie de la mercancía.
 * @property id_uso_mercancia_tipo_tramite - Identificador del uso de la mercancía en el trámite.
 * @property presentacion - Presentación de la mercancía.
 * @property cantidad_presentacion - Cantidad en la presentación especificada.
 * @property id_tipo_presentacion - Identificador del tipo de presentación.
 * @property id_tipo_planta - Identificador del tipo de planta.
 * @property id_planta_autorizada - Identificador de la planta autorizada.
 * @property clave_paises_origen - Clave de los países de origen.
 * @property clave_paises_procedencia - Clave de los países de procedencia.
 * @property lista_detalle_mercancia - Lista de detalles adicionales de la mercancía.
 */
export interface Mercancia {
    tipo_mercancia: string,
    tipo_requisito: number,
    requisito: string,
    numero_certificado: string,
    cve_fraccion: string,
    id_fraccion_gubernamental: number,
    clave_nico: string,
    descripcion_mercancia: string,
    cantidad_umt: number,
    clave_unidad_medida: string,
    cantidad_umc: number,
    clave_unidad_comercial: string,
    id_especie: number,
    id_uso_mercancia_tipo_tramite: number,
    presentacion: string,
    cantidad_presentacion: number,
    id_tipo_presentacion: string,
    id_tipo_planta: string,
    id_planta_autorizada: string,
    clave_paises_origen: string,
    clave_paises_procedencia: string,
    id_tipoPlanta: string,
    lista_detalle_mercancia: ListaDetalleMercancia[]
}

/**
 * Representa los datos necesarios para la movilización de mercancías.
 * 
 * @property coordenadas - Coordenadas geográficas del punto de origen o destino.
 * @property ide_medio_transporte - Identificador del medio de transporte utilizado.
 * @property identificacion_transporte - Identificación específica del transporte (ej. placas).
 * @property id_punto_verificacion - Identificador del punto de verificación asociado.
 * @property razon_social - Razón social de la entidad responsable de la movilización.
 */
export interface DatosMovilizacion {
    coordenadas: string,
    ide_medio_transporte: string,
    identificacion_transporte: string,
    id_punto_verificacion: number,
    razon_social: string
}

/**
 * Representa la información relacionada con un pago.
 * 
 * @interface Pago
 * 
 * @property {true} exento_pago - Indica si el pago está exento.
 * @property {string} ide_motivo_exento_pago - Identificador del motivo de exención de pago.
 * @property {string} cve_referencia_bancaria - Clave de referencia bancaria asociada al pago.
 * @property {string} cadena_pago_dependencia - Cadena de pago proporcionada por la dependencia.
 * @property {string} cve_banco - Clave del banco donde se realizó el pago.
 * @property {string} llave_pago - Llave única que identifica el pago.
 * @property {string} fec_pago - Fecha en la que se realizó el pago.
 * @property {number} imp_pago - Importe total del pago.
 */
export interface Pago {
    exento_pago: true,
    ide_motivo_exento_pago: string,
    cve_referencia_bancaria: string | null,
    cadena_pago_dependencia: string | null,
    cve_banco: string,
    llave_pago: string | null,
    fec_pago: string,
    imp_pago: number
}

/**
 * Interfaz que representa a los terceros relacionados en un proceso.
 * 
 * @property terceros_exportador - Detalles de los terceros exportadores:
 * - `tipo_persona_sol`: Tipo de persona (física o moral).
 * - `persona_moral`: Indica si es persona moral.
 * - `nombre`, `apellido_paterno`, `apellido_materno`: Nombre y apellidos.
 * - `razon_social`: Razón social.
 * - `pais`: País del exportador.
 * - `descripcion_ubicacion`: Descripción de la ubicación.
 * - `lada`, `telefonos`, `correo`: Contacto del exportador.
 * 
 * @property terceros_destinatario - Detalles de los terceros destinatarios:
 * - `tipo_persona_sol`: Tipo de persona (física o moral).
 * - `persona_moral`: Indica si es persona moral.
 * - `num_establ_tif`, `nom_establ_tif`: Número y nombre del establecimiento TIF.
 * - `nombre`, `apellido_paterno`, `apellido_materno`: Nombre y apellidos.
 * - `razon_social`: Razón social.
 * - `pais`, `codigo_postal`: País y código postal.
 * - `cve_entidad`, `cve_deleg_mun`, `cve_colonia`: Claves de ubicación.
 * - `calle`, `num_exterior`, `num_interior`: Dirección.
 * - `lada`, `telefonos`, `correo`: Contacto del destinatario.
 */
export interface Tercerosrelacionados {
    terceros_exportador: [
        {
            tipo_persona_sol: string,
            persona_moral: true,
            nombre: string,
            apellido_paterno: string,
            apellido_materno: string,
            razon_social: string,
            pais: string,
            descripcion_ubicacion: string,
            lada: string,
            telefonos: string,
            correo: string
        }
    ],
    terceros_destinatario: [
        {
            tipo_persona_sol: string,
            persona_moral: true,
            num_establ_tif: string,
            nom_establ_tif: string,
            nombre: string,
            apellido_paterno: string,
            apellido_materno: string,
            razon_social: string,
            pais: string,
            codigo_postal: string,
            cve_entidad: string,
            cve_deleg_mun: string,
            cve_colonia: string,
            calle: string,
            num_exterior: string,
            num_interior: string,
            lada: string,
            telefonos: string,
            correo: string
        }
    ]
}

/**
 * Represents the response received after saving a request.
 */
export interface RespuestaGuardarSolicitud {
    codigo: string;
    id_solicitud: number;
    fecha_actualización: string;
}