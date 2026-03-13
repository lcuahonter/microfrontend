
/**
 * Representa el modelo de datos para el prellenado de una solicitud en el sistema.
 *
 * @interface PrellenadoSolicitud
 *
 * @property {number | null} id_solicitud - Identificador único de la solicitud.
 * @property {string} cve_aduana - Clave de la aduana asociada.
 * @property {string} oficina_inspeccion_sanidad_agropecuaria - Oficina de inspección sanitaria agropecuaria.
 * @property {string} punto_inspeccion - Punto de inspección asignado.
 * @property {string | null} clave_UCON - Clave UCON, puede ser nula.
 * @property {string | null} establecimiento_TIF - Establecimiento TIF, puede ser nulo.
 * @property {string | null} nombre_veterinario - Nombre del veterinario responsable, puede ser nulo.
 * @property {string} numero_autorizacion - Número de autorización asignado.
 * @property {string} clave_regimen - Clave del régimen aduanero.
 * @property {Array} mercancia - Lista de mercancías asociadas a la solicitud.
 *
 * La propiedad `mercancia` incluye detalles como tipo, descripción, requisitos, cantidades,
 * país de origen/procedencia, presentación, planta autorizada, entre otros.
 * Además, cada mercancía puede contener una lista de detalles específicos (`lista_detalle_mercancia`),
 * que incluye información como número de lote, color, edad, raza, fechas relevantes, etc.
 */
export interface PrellenadoSolicitud {
    id_solicitud: number | null;
    cve_aduana: string;
    oficina_inspeccion_sanidad_agropecuaria: string;
    punto_inspeccion: string;
    clave_UCON: string | null;
    establecimiento_TIF: string | null;
    nombre_veterinario: string | null;
    numero_autorizacion: string;
    clave_regimen: string;
    mercancia: [
        {
            id_solicitud: null,
            id_mercancia_gob: null,
            numero_partida: 0,
            tipo_mercancia: string,
            descripcion_tipo_mercancia: string,
            tipo_requisito: 0,
            descripcion_tipo_requisito: string,
            requisitos: string,
            numero_certificado: number,
            cve_fraccion: string,
            descripcion_fracción_arancelaria: string,
            clave_nico: string,
            descripcion_nico: string,
            descripcion_mercancia: string,
            cantidad_umt: number,
            clave_unidad_medida: string,
            descripcion_umt: string,
            cantidad_umc: number,
            clave_unidad_comercial: string,
            descripcion_umc: string,
            id_especie: number,
            descripcion_especie: string,
            id_uso_mercancia_tipo_tramite: number,
            descripcion_uso: string,
            nombre_corto_pais_origen: string,
            nombre_pais_origen: string,
            nombre_corto_pais_procedencia: string,
            nombre_pais_procedencia: string,
            presentacion: string,
            descripcion_presentacion: string,
            cantidad_presentacion: number,
            id_tipo_presentacion: string,
            descripcion_tipo_presentacion: string,
            id_tipo_planta: string,
            descripcion_tipo_planta: string,
            id_planta_autorizada: string,
            descripcion_planta_autorizada: string | null,
            id_fraccion_gubernamental: number,
            cantidad_umc_con_comas: string,
            cantidad_umt_con_comas: string,
            descripcion_corta_mercancia: string,
            fraccion_arancelaria_corto: string,
            clave_paises_origen: string,
            clave_paises_procedencia: string,
            cantidadPresentacion: number,
            lista_detalle_mercancia: [
                {
                    id_detalle_mercancia: null,
                    id_mercancia_gob: null,
                    numero_lote_detalle: string,
                    color_pelaje_detalle: string,
                    edad_animal_detalle: string,
                    fase_desarrollo_detalle: string,
                    funcion_zootecnica_detalle: string,
                    nombre_mercancia_detalle: string,
                    numeroidentificacion_detalle: string,
                    raza_detalle: string,
                    id_sexo_detalle: string,
                    descripcion_sexo_detalle: string,
                    nombre_cientifico_detalle: string,
                    fecha_sacrificio: string,
                    fecha_elaboracion: string,
                    fecha_caducidad: string,
                    fecha_elaboracion_fin: string,
                    fecha_caducidad_fin: string,
                    fecha_sacrificio_fin: string,
                    fecha_sacrificio_str: string,
                    fecha_elaboracion_str: string,
                    fecha_caducidad_str: string,
                    fecha_elaboracion_str_fin: string,
                    fecha_caducidad_str_fin: string,
                    fecha_sacrificio_str_fin: string
                }
            ]
        }
    ]
}

/**
 * Representa los datos prellenados para una movilización.
 *
 * @property id_solicitud - Identificador de la solicitud (puede ser nulo).
 * @property id_transporte - Identificador del transporte (puede ser nulo).
 * @property coordenadas - Coordenadas geográficas asociadas.
 * @property ide_medio_transporte - Identificador del medio de transporte.
 * @property identificacion_transporte - Identificación del transporte.
 * @property id_punto_verificacion - Identificador del punto de verificación.
 * @property razon_social - Razón social asociada.
 */
export interface PrellenadoMovilizacion {
    id_solicitud: null,
    id_transporte: null,
    coordenadas: string,
    ide_medio_transporte: string,
    identificacion_transporte: string,
    id_punto_verificacion: number,
    razon_social: string
}

/**
 * Representa el modelo de prellenado para terceros relacionados en una solicitud.
 *
 * @interface PrellenadoTercerosRelacionados
 *
 * @property terceros_exportador - Lista de exportadores relacionados con la solicitud.
 *   - `id_solicitud`: Identificador de la solicitud (puede ser nulo).
 *   - `extranjero`: Indica si es extranjero.
 *   - `id_persona_sol`: Identificador de la persona (puede ser nulo).
 *   - `id_direccion_sol`: Identificador de la dirección (puede ser nulo).
 *   - `tipo_persona_sol`: Tipo de persona (constante "TIPERS.EXP").
 *   - `persona_moral`: Indica si es persona moral.
 *   - `nombre`, `apellido_paterno`, `apellido_materno`: Datos personales (pueden ser nulos).
 *   - `razon_social`: Razón social de la persona moral.
 *   - `pais`: País de origen.
 *   - `descripcion_ubicacion`: Descripción de la ubicación.
 *   - `lada`, `telefonos`, `correo`: Información de contacto.
 *
 * @property terceros_destinatario - Lista de destinatarios relacionados con la solicitud.
 *   - `id_solicitud`: Identificador de la solicitud (puede ser nulo).
 *   - `id_persona_sol`: Identificador de la persona (puede ser nulo).
 *   - `id_direccion_sol`: Identificador de la dirección (puede ser nulo).
 *   - `tipo_persona_sol`: Tipo de persona.
 *   - `persona_moral`: Indica si es persona moral.
 *   - `num_establ_tif`, `nom_establ_tif`: Información del establecimiento TIF (pueden ser nulos).
 *   - `nombre`, `apellido_paterno`, `apellido_materno`: Datos personales (pueden ser nulos).
 *   - `razon_social`: Razón social de la persona moral.
 *   - `pais`: País de origen.
 *   - `codigo_postal`, `cve_entidad`, `cve_deleg_mun`, `cve_colonia`: Información de ubicación.
 *   - `calle`, `num_exterior`, `num_interior`: Dirección detallada.
 *   - `lada`, `telefonos`, `correo`: Información de contacto.
 */
export interface PrellenadoTercerosRelacionados {
    terceros_exportador: [
        {
            id_solicitud: number | null,
            extranjero: boolean,
            id_persona_sol: number | null,
            id_direccion_sol: number | null,
            tipo_persona_sol: string,
            persona_moral: boolean,
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
            id_solicitud: number | null,
            id_persona_sol: number | null,
            id_direccion_sol: number | null,
            tipo_persona_sol: string,
            persona_moral: boolean,
            num_establ_tif: number | null,
            nom_establ_tif: number | null,
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
 * Modelo para prellenado de pago de derechos.
 *
 * @property id_solicitud - ID de la solicitud (puede ser nulo).
 * @property id_pago - ID del pago (puede ser nulo).
 * @property exento_pago - Indica si está exento de pago.
 * @property ide_motivo_exento_pago - ID del motivo de exención (puede ser nulo).
 * @property cve_referencia_bancaria - Clave de referencia bancaria.
 * @property cadena_pago_dependencia - Cadena de pago de la dependencia.
 * @property cve_banco - Clave del banco (puede ser nulo).
 * @property llave_pago - Llave del pago (puede ser nulo).
 * @property fec_pago - Fecha del pago (puede ser nulo).
 * @property imp_pago - Importe del pago (puede ser nulo).
 */
export interface PrellenadoPagoDerechos {
    id_solicitud: number | null,
    id_pago: number | null,
    exento_pago: false,
    ide_motivo_exento_pago: number | null,
    cve_referencia_bancaria: string,
    cadena_pago_dependencia: string,
    cve_banco: number | null,
    llave_pago: number | null,
    fec_pago: number | null,
    imp_pago: number | null,
    justificacion?: string | null
}
