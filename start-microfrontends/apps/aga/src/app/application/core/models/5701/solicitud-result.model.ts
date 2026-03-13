/**
 * Representa el resultado de una solicitud en el sistema.
 *
 * @property codigo - Código de resultado de la solicitud.
 * @property error - Mensaje de error general, si existe.
 * @property errores_modelo - Lista de errores específicos del modelo.
 * @property mensaje - Mensaje descriptivo del resultado.
 * @property datos - Datos asociados al resultado de la solicitud.
 */
export interface SolicitudResult {
 codigo: string;
 error: string;
 errores_modelo: ErroresModelo[];
 mensaje: string;
 datos: Datos;
}

/**
 * Representa los datos asociados a una solicitud en el sistema.
 *
 * @property id_solicitud Identificador único de la solicitud.
 * @property act_econo_preponderante Actividad económica preponderante.
 * @property ambito Ámbito de la solicitud.
 * @property anio Año relacionado con la solicitud.
 * @property avaluo_bien_cultural Avalúo del bien cultural.
 * @property clabe_bancaria CLABE bancaria asociada.
 * @property clave_pedimento Clave del pedimento aduanal.
 * @property desc_sist_pesaje_medicion Descripción del sistema de pesaje o medición.
 * @property estado Estado de la solicitud.
 * @property factor_conversion Factor de conversión utilizado.
 * @property fec_embarque Fecha de embarque.
 * @property fec_operacion Fecha de operación.
 * @property fec_pago Fecha de pago.
 * @property fec_revocacion Fecha de revocación.
 * @property fec_verificacion Fecha de verificación.
 * @property chk_sr_reg_vehiculos Indicador de registro de vehículos.
 * @property bln_consolidacion_cargas Indica si hay consolidación de cargas.
 * @property chk_toma_muestra Indicador de toma de muestra.
 * @property motivo Motivo de la solicitud.
 * @property chk_danio_exposicion Indicador de daño por exposición.
 * @property fec_reporte_pruebas Fecha de reporte de pruebas.
 * @property fec_fin Fecha de finalización.
 * @property fec_inicio Fecha de inicio.
 * @property justificacion_tecnica Justificación técnica de la solicitud.
 * @property metodo_separacion_contable Método de separación contable.
 * @property monto Monto asociado a la solicitud.
 * @property num_autorizacion Número de autorización.
 * @property num_certificado Número de certificado.
 * @property num_certificado_internacional Número de certificado internacional.
 * @property num_constancia Número de constancia.
 * @property num_cuenta_bancaria Número de cuenta bancaria.
 * @property num_expediente Número de expediente.
 * @property num_licencia Número de licencia.
 * @property patente_agente_adu Patente del agente aduanal.
 * @property num_permiso Número de permiso.
 * @property num_prog_dgcese Número de programa DGCSE.
 * @property num_registro Número de registro.
 * @property num_registro_ambiental Número de registro ambiental.
 * @property num_registro_uma Número de registro UMA.
 * @property num_reporte Número de reporte.
 * @property num_sucursal_bancaria Número de sucursal bancaria.
 * @property nom_banco Nombre del banco.
 * @property nom_consul Nombre del cónsul.
 * @property nom_oficial_autorizado Nombre del oficial autorizado.
 * @property num_certificados Número de certificados.
 * @property num_copias Número de copias.
 * @property personal Información de personal.
 * @property preferencia_arancelaria Preferencia arancelaria.
 * @property puntos_verificacion Puntos de verificación.
 * @property tipo_regimen Tipo de régimen.
 * @property c_region Código de región.
 * @property region Región.
 * @property tasa_ad_valorem Tasa ad valorem.
 * @property tipo_cambio Tipo de cambio.
 * @property tipo_moneda Tipo de moneda.
 * @property tipo_operacion Tipo de operación.
 * @property tratado Tratado relacionado.
 * @property imp_valor_comercial Importe del valor comercial.
 * @property cve_aduana Clave de aduana.
 * @property ide_tipo_solicitud_pexim Identificador de tipo de solicitud PEXIM.
 * @property cve_regimen Clave de régimen.
 * @property cve_clasificacion_regimen Clave de clasificación de régimen.
 * @property ide_actividad_productiva Identificador de actividad productiva.
 * @property ide_tipo_caat Identificador de tipo CAAT.
 * @property ide_tipo_prog_fom_exp Identificador de tipo de programa de fomento a la exportación.
 * @property id_programa_autorizado_se Identificador de programa autorizado por SE.
 * @property ide_tipo_transito Identificador de tipo de tránsito.
 * @property observaciones Observaciones adicionales.
 * @property id_dependencia_solicitante Identificador de la dependencia solicitante.
 * @property descripcion Descripción general.
 * @property id_direccion_sol Identificador de la dirección solicitante.
 * @property descGenerica1 Descripción genérica 1.
 * @property descGenerica2 Descripción genérica 2.
 * @property descGenerica3 Descripción genérica 3.
 * @property ideGenerica1 Identificador genérico 1.
 * @property ideGenerica2 Identificador genérico 2.
 * @property ideGenerica3 Identificador genérico 3.
 * @property cve_tipo_empresa_recif Clave de tipo de empresa recicladora.
 * @property id_actividad_economica_sat Identificador de actividad económica SAT.
 * @property bln_empresa_mismo_grupo Indica si la empresa pertenece al mismo grupo.
 * @property plazo Plazo de la solicitud.
 * @property bln_reg_automatizado Indica si el registro es automatizado.
 * @property bln_immex Indica si aplica IMMEX.
 * @property periodo_dictaminacion Periodo de dictaminación.
 * @property descClobGenerica1 Descripción CLOB genérica 1.
 * @property descClobGenerica2 Descripción CLOB genérica 2.
 * @property cve_pais Clave de país.
 * @property id_asignacion Identificador de asignación.
 * @property bln_empresa_controladora Indica si es empresa controladora.
 * @property fec_propuesta_visita Fecha propuesta para visita.
 * @property bln_merc_forma_parte_patrim Indica si el mercado forma parte del patrimonio.
 * @property id_act_prod_prosec_se Identificador de actividad productiva PROSEC SE.
 * @property cve_ucon Clave UCON.
 * @property cve_pais_importador Clave de país importador.
 * @property nom_establecimiento_operacion Nombre del establecimiento de operación.
 * @property nom_establecimiento_tif Nombre del establecimiento TIF.
 * @property bln_excento_pago Indica si está exento de pago.
 * @property fec_arribo Fecha de arribo.
 * @property fec_inspeccion Fecha de inspección.
 * @property fec_ini_permanencia_extranjero Fecha de inicio de permanencia en el extranjero.
 * @property fec_fin_permanencia_extranjero Fecha de fin de permanencia en el extranjero.
 * @property bln_guardia_custodia Indica si requiere guardia y custodia.
 * @property desc_lugar_embarque Descripción del lugar de embarque.
 * @property desc_locacion Descripción de la locación.
 * @property num_permiso_cnsns Número de permiso CNSNS.
 * @property num_programa_immex Número de programa IMMEX.
 * @property cve_oisa Clave OISA.
 * @property cve_permiso_sedena Clave de permiso SEDENA.
 * @property desc_punto_ingreso Descripción del punto de ingreso.
 * @property ide_tipo_movimiento_gob Identificador de tipo de movimiento gubernamental.
 * @property fec_tramite_semarnat Fecha de trámite SEMARNAT.
 * @property bln_prioridad_solicitud Indica la prioridad de la solicitud.
 * @property ide_actividad_en_destino Identificador de actividad en destino.
 * @property id_tipo_producto_ttra Identificador de tipo de producto TTRA.
 * @property bln_informacion_confidencial Indica si la información es confidencial.
 * @property bln_productor_extranjero Indica si es productor extranjero.
 * @property num_establecimiento Número de establecimiento.
 * @property coordenadas_geograficas Coordenadas geográficas.
 * @property bln_franja_region_fronteriza Indica si pertenece a franja o región fronteriza.
 * @property id_tipo_mod_programa_se Identificador de tipo de modalidad de programa SE.
 * @property id_descripcion_prod Identificador de descripción de producto.
 * @property capacidad_almacenamiento Capacidad de almacenamiento.
 * @property id_clasif_residuo_ttra Identificador de clasificación de residuo TTRA.
 * @property bln_req_inspec_inmd Indica si requiere inspección inmediata.
 * @property num_carro_ferrocarril Número de carro de ferrocarril.
 * @property id_lugar_inspeccion Identificador de lugar de inspección.
 * @property desc_guia_ruta Descripción de la guía de ruta.
 * @property num_total_carros Número total de carros.
 * @property total_guias Total de guías.
 * @property id_empresa_gob Identificador de empresa gubernamental.
 * @property id_norma_oficial Identificador de norma oficial.
 * @property ide_medio_transporte_gob Identificador de medio de transporte gubernamental.
 * @property cantidad_bienes Cantidad de bienes.
 * @property blnGenerico1 Indicador genérico 1.
 * @property ide_tipo_certificacion_nom Identificador de tipo de certificación NOM.
 * @property id_periodo_cafetalero Identificador de periodo cafetalero.
 * @property id_clasif_cafe Identificador de clasificación de café.
 * @property cve_catalogo Clave de catálogo.
 * @property id_combinacion_sg Identificador de combinación SG.
 * @property id_fraccion_gob Identificador de fracción gubernamental.
 * @property bln_modificacion Indica si es una modificación.
 * @property bln_prorroga Indica si es una prórroga.
 * @property bln_cisen Indica si aplica CISEN.
 * @property bln_solic_ferroviarios Indica si solicita servicios ferroviarios.
 * @property id_folio_externo Identificador de folio externo.
 * @property info_adicional Información adicional.
 * @property cve_tipo_contenedor Clave de tipo de contenedor.
 * @property folio_importacion_temporal Folio de importación temporal.
 * @property datos_tramite Datos del trámite asociado.
 */
export interface Datos {
 id_solicitud: number;
 act_econo_preponderante: string;
 ambito: string;
 anio: number;
 avaluo_bien_cultural: string;
 clabe_bancaria: string;
 clave_pedimento: string;
 desc_sist_pesaje_medicion: string;
 estado: string;
 factor_conversion: string;
 fec_embarque: Date;
 fec_operacion: Date;
 fec_pago: Date;
 fec_revocacion: Date;
 fec_verificacion: Date;
 chk_sr_reg_vehiculos: string;
 bln_consolidacion_cargas: boolean;
 chk_toma_muestra: string;
 motivo: string;
 chk_danio_exposicion: string;
 fec_reporte_pruebas: Date;
 fec_fin: Date;
 fec_inicio: Date;
 justificacion_tecnica: string;
 metodo_separacion_contable: string;
 monto: number;
 num_autorizacion: string;
 num_certificado: string;
 num_certificado_internacional: string;
 num_constancia: string;
 num_cuenta_bancaria: string;
 num_expediente: string;
 num_licencia: string;
 patente_agente_adu: number;
 num_permiso: string;
 num_prog_dgcese: string;
 num_registro: string;
 num_registro_ambiental: string;
 num_registro_uma: string;
 num_reporte: string;
 num_sucursal_bancaria: string;
 nom_banco: string;
 nom_consul: string;
 nom_oficial_autorizado: string;
 num_certificados: string;
 num_copias: string;
 personal: string;
 preferencia_arancelaria: string;
 puntos_verificacion: string;
 tipo_regimen: string;
 c_region: string;
 region: string;
 tasa_ad_valorem: string;
 tipo_cambio: string;
 tipo_moneda: string;
 tipo_operacion: string;
 tratado: string;
 imp_valor_comercial: number;
 cve_aduana: string;
 ide_tipo_solicitud_pexim: string;
 cve_regimen: string;
 cve_clasificacion_regimen: string;
 ide_actividad_productiva: string;
 ide_tipo_caat: string;
 ide_tipo_prog_fom_exp: string;
 id_programa_autorizado_se: number;
 ide_tipo_transito: string;
 observaciones: string;
 id_dependencia_solicitante: number;
 descripcion: string;
 id_direccion_sol: number;
 descGenerica1: string;
 descGenerica2: string;
 descGenerica3: string;
 ideGenerica1: string;
 ideGenerica2: string;
 ideGenerica3: string;
 cve_tipo_empresa_recif: string;
 id_actividad_economica_sat: number;
 bln_empresa_mismo_grupo: number;
 plazo: string;
 bln_reg_automatizado: number;
 bln_immex: number;
 periodo_dictaminacion: number;
 descClobGenerica1: string;
 descClobGenerica2: string;
 cve_pais: string;
 id_asignacion: number;
 bln_empresa_controladora: number;
 fec_propuesta_visita: Date;
 bln_merc_forma_parte_patrim: number;
 id_act_prod_prosec_se: number;
 cve_ucon: string;
 cve_pais_importador: string;
 nom_establecimiento_operacion: string;
 nom_establecimiento_tif: string;
 bln_excento_pago: number;
 fec_arribo: Date;
 fec_inspeccion: Date;
 fec_ini_permanencia_extranjero: Date;
 fec_fin_permanencia_extranjero: Date;
 bln_guardia_custodia: boolean;
 desc_lugar_embarque: string;
 desc_locacion: string;
 num_permiso_cnsns: string;
 num_programa_immex: string;
 cve_oisa: string;
 cve_permiso_sedena: string;
 desc_punto_ingreso: string;
 ide_tipo_movimiento_gob: string;
 fec_tramite_semarnat: Date;
 bln_prioridad_solicitud: number;
 ide_actividad_en_destino: string;
 id_tipo_producto_ttra: number;
 bln_informacion_confidencial: boolean;
 bln_productor_extranjero: number;
 num_establecimiento: string;
 coordenadas_geograficas: string;
 bln_franja_region_fronteriza: number;
 id_tipo_mod_programa_se: number;
 id_descripcion_prod: number;
 capacidad_almacenamiento: number;
 id_clasif_residuo_ttra: number;
 bln_req_inspec_inmd: number;
 num_carro_ferrocarril: string;
 id_lugar_inspeccion: number;
 desc_guia_ruta: string;
 num_total_carros: number;
 total_guias: string;
 id_empresa_gob: number;
 id_norma_oficial: number;
 ide_medio_transporte_gob: string;
 cantidad_bienes: number;
 blnGenerico1: boolean;
 ide_tipo_certificacion_nom: string;
 id_periodo_cafetalero: number;
 id_clasif_cafe: number;
 cve_catalogo: string;
 id_combinacion_sg: number;
 id_fraccion_gob: number;
 bln_modificacion: boolean;
 bln_prorroga: boolean;
 bln_cisen: boolean;
 bln_solic_ferroviarios: number;
 id_folio_externo: number;
 info_adicional: string;
 cve_tipo_contenedor: string;
 folio_importacion_temporal: string;
 datos_tramite: DatosTramite;
}

/**
 * Representa los datos asociados a un trámite.
 *
 * @property listTransporteDespacho - Lista de transportes de despacho relacionados con el trámite.
 * @property listUnidadArribo - Lista de unidades de arribo asociadas al trámite.
 * @property personaResponsable - Lista de personas responsables de la notificación.
 * @property importador_exportador - Información del importador o exportador.
 * @property tipo_servicio - Tipo de servicio solicitado en el trámite.
 * @property despacho - Información del despacho aduanal.
 * @property pedimentos - Lista de pedimentos asociados al trámite.
 * @property mercancias - Información de las mercancías involucradas.
 * @property transporte_despacho - Detalle del transporte de despacho principal.
 * @property unidad_arribo - Detalle de la unidad de arribo principal.
 * @property list_transporte_despacho - Lista adicional de transportes de despacho.
 * @property list_unidad_arribo - Lista adicional de unidades de arribo.
 * @property list_fechas_sevex - Lista de fechas relevantes para SEVEX.
 * @property list_persona_noti - Lista de personas notificadas.
 * @property lista_pagos - Lista de pagos realizados o asociados al trámite.
 */
export interface DatosTramite {
 listTransporteDespacho: TransporteDespacho[];
 listUnidadArribo: UnidadArribo[];
 personaResponsable: ListPersonaNoti[];
 importador_exportador: ImportadorExportador;
 tipo_servicio: TipoServicio;
 despacho: Despacho;
 pedimentos: Pedimento[];
 mercancias: Mercancias;
 transporte_despacho: TransporteDespacho;
 unidad_arribo: UnidadArribo;
 list_transporte_despacho: TransporteDespacho[];
 list_unidad_arribo: UnidadArribo[];
 list_fechas_sevex: ListFechasSevex[];
 list_persona_noti: ListPersonaNoti[];
 lista_pagos: ListaPago[];
}

/**
 * Representa la información relacionada con un despacho aduanal.
 *
 * @property aduana_despacho - Nombre o clave de la aduana donde se realiza el despacho.
 * @property id_seccion_despacho - Identificador numérico de la sección de despacho.
 * @property bln_lda - Indica si aplica la Ley de los Derechos Aduaneros (LDA).
 * @property rfc_despacho - RFC del agente o apoderado aduanal encargado del despacho.
 * @property bln_dd - Indica si aplica el Documento Digital (DD).
 * @property folio_ddex - Folio del Documento Digital de Exportación (DDEX).
 * @property tipo_despacho - Tipo de despacho realizado.
 * @property nombre_recinto - Nombre del recinto fiscal o fiscalizado.
 * @property domicilio - Domicilio del recinto donde se realiza el despacho.
 * @property especifique - Campo para especificar información adicional relevante al despacho.
 * @property fecha_inicio - Fecha de inicio del despacho (formato ISO).
 * @property hora_inicio - Hora de inicio del despacho.
 * @property fecha_final - Fecha de finalización del despacho (formato ISO).
 * @property hora_fin - Hora de finalización del despacho.
 * @property tipo_operacion - Tipo de operación aduanera realizada.
 * @property encargo_conferido - Indica si existe encargo conferido para el despacho.
 * @property relacion - Indica si existe relación con otra operación o documento.
 * @property bln_despacho - Indica si el despacho está activo o habilitado.
 */
export interface Despacho {
 aduana_despacho: string;
 id_seccion_despacho: number;
 bln_lda: boolean;
 rfc_despacho: string;
 bln_dd: boolean;
 folio_ddex: string;
 tipo_despacho: string;
 nombre_recinto: string;
 domicilio: string;
 especifique: string;
 fecha_inicio: string;
 hora_inicio: string;
 fecha_final: string;
 hora_fin: string;
 tipo_operacion: string;
 encargo_conferido: boolean;
 relacion: boolean;
 bln_despacho: boolean;
}

/**
 * Representa la información de un importador o exportador.
 *
 * @property rfc - RFC del importador/exportador.
 * @property nombre - Nombre del importador/exportador.
 * @property industria_automotriz - Indica si pertenece a la industria automotriz.
 * @property desc_industrial_automotriz - Descripción de la industria automotriz, si aplica.
 * @property programa_fomento - Indica si cuenta con un programa de fomento.
 * @property desc_programa_fomento - Descripción del programa de fomento, si aplica.
 * @property immex - Indica si cuenta con el programa IMMEX.
 * @property desc_inmex - Descripción del programa IMMEX, si aplica.
 * @property numero_registro - Indica si tiene número de registro.
 * @property certificacion_a - Indica si cuenta con certificación tipo A.
 * @property certificacion_aa - Indica si cuenta con certificación tipo AA.
 * @property certificacion_aaa - Indica si cuenta con certificación tipo AAA.
 * @property socio_comercial - Indica si es socio comercial.
 * @property id_socio_comercial - Identificador del socio comercial, si aplica.
 * @property oea - Indica si cuenta con la certificación OEA.
 * @property revision_origen - Indica si está sujeto a revisión de origen.
 */
export interface ImportadorExportador {
 rfc: string;
 nombre: string;
 industria_automotriz: boolean;
 desc_industrial_automotriz: string;
 programa_fomento: boolean;
 desc_programa_fomento: string;
 immex: boolean;
 desc_inmex: string;
 numero_registro: boolean;
 certificacion_a: boolean;
 certificacion_aa: boolean;
 certificacion_aaa: boolean;
 socio_comercial: boolean;
 id_socio_comercial: string;
 oea: boolean;
 revision_origen: boolean;
}

/**
 * Representa la información relacionada con el transporte de despacho.
 *
 * @property tipo_transporte - Tipo de transporte utilizado.
 * @property emp_transportista - Empresa transportista responsable.
 * @property numero_porte - Número de porte o guía de transporte.
 * @property fecha_porte - Fecha del porte o traslado.
 * @property marca_transporte - Marca del vehículo de transporte.
 * @property modelo_transporte - Modelo del vehículo de transporte.
 * @property placas_transporte - Placas del vehículo de transporte.
 * @property contenedor_transporte - Identificador del contenedor utilizado.
 * @property observaciones - Observaciones adicionales sobre el transporte.
 * @property numero_bl - Número de Bill of Lading (BL) o conocimiento de embarque.
 * @property tipo_equipo - Tipo de equipo utilizado en el transporte.
 * @property iniciales_equipo - Iniciales del equipo de transporte.
 * @property numero_equipo - Número identificador del equipo.
 * @property rfc_empresa - RFC de la empresa transportista.
 * @property nombre_transportista - Nombre del transportista.
 * @property num_gafete - Número de gafete del transportista.
 * @property tipo_transporte_des - Descripción del tipo de transporte.
 * @property datos_transporte - Datos adicionales del transporte.
 * @property descripcion_equipo - Descripción del equipo utilizado.
 */
export interface TransporteDespacho {
 tipo_transporte: string;
 emp_transportista: string;
 numero_porte: string;
 fecha_porte: Date;
 marca_transporte: string;
 modelo_transporte: string;
 placas_transporte: string;
 contenedor_transporte: string;
 observaciones: string;
 numero_bl: string;
 tipo_equipo: string;
 iniciales_equipo: string;
 numero_equipo: string;
 rfc_empresa: string;
 nombre_transportista: string;
 num_gafete: string;
 tipo_transporte_des: string;
 datos_transporte: string;
 descripcion_equipo: string;
}

/**
 * Representa la información de una unidad de arribo utilizada en el proceso de solicitud.
 *
 * @property tipo_transporte Tipo de transporte utilizado.
 * @property emp_transportista Empresa transportista responsable.
 * @property numero_porte Número de porte o guía de transporte.
 * @property fecha_porte Fecha del porte o guía.
 * @property marca_transporte Marca del medio de transporte.
 * @property modelo_transporte Modelo del medio de transporte.
 * @property placas_transporte Placas del medio de transporte.
 * @property contenedor_transporte Identificador del contenedor de transporte.
 * @property numero_bl Número de conocimiento de embarque (BL).
 * @property tipo_equipo Tipo de equipo utilizado en el transporte.
 * @property descripcion_equipo Descripción del equipo de transporte.
 * @property iniciales_equipo Iniciales del equipo de transporte.
 * @property numero_equipo Número identificador del equipo.
 * @property arribo_pendiente_aereo Indica si el arribo aéreo está pendiente.
 * @property guia_master_aereo Número de guía master aérea.
 * @property guia_house_aereo Número de guía house aérea.
 * @property fecha_arribo_aereo Fecha de arribo aéreo.
 * @property hora_arribo_aereo Hora de arribo aéreo.
 * @property guia_valida Indica si la guía es válida.
 * @property guia_house_valida Indica si la guía house es válida.
 * @property guia_master_valida Indica si la guía master es válida.
 * @property guia_bl_Maritimo Número de BL marítimo.
 * @property guia_house_maritimo Número de guía house marítima.
 * @property nombre_buque_maritimo Nombre del buque marítimo.
 * @property contenedor_maritimo Identificador del contenedor marítimo.
 * @property datos_transporte Información adicional del transporte.
 * @property observaciones Observaciones adicionales.
 * @property mismosDatosTransporte Indica si se utilizan los mismos datos de transporte.
 */
export interface UnidadArribo {
 tipo_transporte: string;
 emp_transportista: string;
 numero_porte: string;
 fecha_porte: Date;
 marca_transporte: string;
 modelo_transporte: string;
 placas_transporte: string;
 contenedor_transporte: string;
 numero_bl: string;
 tipo_equipo: string;
 descripcion_equipo: string;
 iniciales_equipo: string;
 numero_equipo: string;
 arribo_pendiente_aereo: boolean;
 guia_master_aereo: string;
 guia_house_aereo: string;
 fecha_arribo_aereo: Date;
 hora_arribo_aereo: string;
 guia_valida: boolean;
 guia_house_valida: boolean;
 guia_master_valida: boolean;
 guia_bl_Maritimo: string;
 guia_house_maritimo: string;
 nombre_buque_maritimo: string;
 contenedor_maritimo: string;
 datos_transporte: string;
 observaciones: string;
 mismosDatosTransporte: boolean;
}

/**
 * Representa una lista de fechas relacionadas con SEVEX y RNI para una solicitud específica.
 *
 * @property {number} id_fecha - Identificador único de la fecha.
 * @property {number} id_solicitud - Identificador de la solicitud asociada.
 * @property {string} fecha - Fecha en formato de cadena (por ejemplo, 'YYYY-MM-DD').
 * @property {Date} fecha_desc - Fecha en formato de objeto Date para descripciones o procesamiento adicional.
 * @property {string} hora_inicio_svex - Hora de inicio para SEVEX (formato 'HH:mm').
 * @property {string} hora_final_svex - Hora de finalización para SEVEX (formato 'HH:mm').
 * @property {string} hora_inicio_rni - Hora de inicio para RNI (formato 'HH:mm').
 * @property {string} hora_fin_rni - Hora de finalización para RNI (formato 'HH:mm').
 * @property {boolean} fuera_horario - Indica si la fecha/hora está fuera del horario permitido.
 * @property {boolean} mismo_horario - Indica si los horarios de SEVEX y RNI son los mismos.
 */
export interface ListFechasSevex {
 id_fecha: number;
 id_solicitud: number;
 fecha: string;
 fecha_desc: Date;
 hora_inicio_svex: string;
 hora_final_svex: string;
 hora_inicio_rni: string;
 hora_fin_rni: string;
 fuera_horario: boolean;
 mismo_horario: boolean;
}

/**
 * Representa la información de una persona notificada asociada a una solicitud.
 *
 * @property id_persona Identificador único de la persona.
 * @property id_solicitud Identificador de la solicitud relacionada.
 * @property gafete Número o código de gafete de la persona.
 * @property correo_electronico Correo electrónico de la persona.
 * @property nombre Nombre(s) de la persona.
 * @property apellido_paterno Apellido paterno de la persona.
 * @property apellido_materno Apellido materno de la persona.
 */
export interface ListPersonaNoti {
 id_persona: number;
 id_solicitud: number;
 gafete: string;
 correo_electronico: string;
 nombre: string;
 apellido_paterno: string;
 apellido_materno: string;
}

/**
 * Representa la información de un pago asociado a una solicitud.
 *
 * @property {number} id_pago - Identificador único del pago.
 * @property {number} id_solicitud - Identificador de la solicitud relacionada con el pago.
 * @property {string} linea_captura - Línea de captura asociada al pago.
 * @property {number} monto - Monto del pago realizado.
 * @property {boolean} bln_activo - Indica si el pago está activo.
 * @property {number} id_modulo - Identificador del módulo relacionado al pago.
 * @property {string} cve_modulo - Clave del módulo relacionado al pago.
 */
export interface ListaPago {
 id_pago: number;
 id_solicitud: number;
 linea_captura: string;
 monto: number;
 bln_activo: boolean;
 id_modulo: number;
 cve_modulo: string;
}

/**
 * Representa la información de una mercancía en el sistema.
 *
 * @property pais_origen - País de origen de la mercancía.
 * @property descripcion_generica - Descripción general de la mercancía.
 * @property justificacion - Justificación para la inclusión de la mercancía.
 * @property pais_procedencia - País de procedencia de la mercancía.
 */
export interface Mercancias {
 pais_origen: string;
 descripcion_generica: string;
 justificacion: string;
 pais_procedencia: string;
}

/**
 * Representa la información de un pedimento asociado a una solicitud.
 *
 * @property {number} id_pedimento - Identificador único del pedimento.
 * @property {number} id_solicitud - Identificador de la solicitud relacionada.
 * @property {number} numero_pedimento - Número del pedimento.
 * @property {number} patente - Número de patente aduanal.
 * @property {string} pedimento - Descripción o clave del pedimento.
 * @property {string} aduana - Nombre o clave de la aduana correspondiente.
 * @property {string} tipo_pedimento - Tipo de pedimento (por ejemplo, importación, exportación).
 * @property {string} numeros - Números adicionales relacionados con el pedimento.
 * @property {string} cove - Clave o referencia COVE asociada.
 * @property {boolean} bln_activo - Indica si el pedimento está activo.
 * @property {Date} fecha_edo_ws_pedimento - Fecha del estado del pedimento en el sistema web service.
 * @property {number} estado_pedimento - Estado actual del pedimento.
 * @property {number} sub_estado_pedimento - Subestado específico del pedimento.
 * @property {boolean} bln_valido_pedimento - Indica si el pedimento es válido.
 */
export interface Pedimento {
 id_pedimento: number;
 id_solicitud: number;
 numero_pedimento: number;
 patente: number;
 pedimento: string;
 aduana: string;
 tipo_pedimento: string;
 numeros: string;
 cove: string;
 bln_activo: boolean;
 fecha_edo_ws_pedimento: Date;
 estado_pedimento: number;
 sub_estado_pedimento: number;
 bln_valido_pedimento: boolean;
}

/**
 * Representa un tipo de servicio asociado a una solicitud.
 *
 * @property {number} id_tipo_servicio - Identificador único del tipo de servicio.
 * @property {number} id_solicitud - Identificador de la solicitud relacionada.
 * @property {boolean} bln_activo - Indica si el tipo de servicio está activo.
 * @property {number} cve_tipo_servicio - Clave del tipo de servicio.
 * @property {string} desc_tipo_servicio - Descripción del tipo de servicio.
 * @property {string} numero_svex - Número SVEX asociado al servicio.
 * @property {number} rni - Número de Registro Nacional de Importadores.
 * @property {Date} fecha_inicio_servicio - Fecha de inicio del servicio.
 * @property {Date} fecha_fin_servicio - Fecha de fin del servicio.
 * @property {string} hora_inicio_servicio - Hora de inicio del servicio (formato HH:mm).
 * @property {string} hora_fin_servicio - Hora de fin del servicio (formato HH:mm).
 * @property {number} patente - Número de patente aduanal.
 * @property {number} id_patentes_aduanales - Identificador de la patente aduanal asociada.
 */
export interface TipoServicio {
 id_tipo_servicio: number;
 id_solicitud: number;
 bln_activo: boolean;
 cve_tipo_servicio: number;
 desc_tipo_servicio: string;
 numero_svex: string;
 rni: number;
 fecha_inicio_servicio: Date;
 fecha_fin_servicio: Date;
 hora_inicio_servicio: string;
 hora_fin_servicio: string;
 patente: number;
 id_patentes_aduanales: number;
}

/**
 * Representa un modelo de errores asociados a un campo específico.
 *
 * @property campo - Nombre del campo donde ocurrieron los errores.
 * @property errores - Lista de mensajes de error relacionados con el campo.
 */
export interface ErroresModelo {
 campo: string;
 errores: string[];
}

/**
 * Representa la respuesta de una solicitud de eliminación de una solicitud en el sistema.
 * Esta interfaz define la estructura de la respuesta que se espera al eliminar una solicitud.
 * @property codigo - Código de resultado de la operación de eliminación.
 * @property mensaje - Mensaje descriptivo del resultado de la operación.
 * @property datos - Indica si la operación de eliminación fue exitosa (true) o no (false).
 */
export interface EliminaSolicitudResponse {
    codigo: string;
    mensaje: string;
    datos: boolean
}
