/**
 * Interface que representa el modelo de datos para el prellenado de la solicitud.
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
  numero_carro_ferrocarril: string;
  clave_regimen: string;
  mercancia: [
    {
      id_solicitud: null,
      id_mercancia_gob: number | undefined,
      numero_partida: number,
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
      numero_lote: string,
      idDescripcionFraccion: number,
      fase_desarrollo: string,
      id_tipo_producto_tipo_tramite: number,
      descripcion_tipo_producto: string,
      lista_detalle_mercancia: [
        {
          id_detalle_mercancia: number,
          id_mercancia_gob: number,
          id_vida_silvestre: number,
          nombre_cientifico: string
        }
      ]
    }
  ]
}

/**
 * Interface que representa el prellenado de la solicitud de movilizacion nacional
 */
export interface PrellenadoSolicitudMovilizacionNacional {
  id_solicitud: number,
  id_transporte: string,
  ide_medio_transporte: string,
  identificacion_transporte: string,
  id_punto_verificacion: string,
  razon_social: string
}

/**
 * Interface que representa el prellenado de la solicitud de terceros relacionados
 */
export interface PrellenadoSolicitudTercerosRelacionados {
  terceros_exportador: [
    {
      id_solicitud: number | null,
      extranjero: boolean,
      id_persona_sol: number | null,
      id_direccion_sol: number,
      tipo_persona_sol: string | null,
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
      id_solicitud: number |null,
      id_persona_sol: number |null,
      id_direccion_sol: number |null,
      tipo_persona_sol: string | null,
      persona_moral: boolean,
      num_establ_tif: number | null,
      nom_establ_tif: string | null,
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
 * Interface que representa el prellenado de la solicitud de pago de derechos
 */
export interface PrellenadoSolicitudPagoDerechos {
  id_solicitud: number | null,
  id_pago: number | null,
  exento_pago: string,
  ide_motivo_exento_pago: string,
  cve_referencia_bancaria: string,
  cadena_pago_dependencia: string,
  cve_banco: string,
  llave_pago: string,
  fec_pago: string,
  imp_pago: string
}