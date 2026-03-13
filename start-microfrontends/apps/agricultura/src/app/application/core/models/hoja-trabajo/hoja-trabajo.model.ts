import { parseToString } from '@ng-mf/data-access-user';
/**
 * Class: HojaTrabajo.model.ts
 *
 * Description:
 *
 * Modelos para funcionalidad e hoja de trabajo y sus tabs
 *
 *
 * @created 28 de noviembre de 2025
 * @version 1.0
 * @category Model
 */
/**
 * Representa la estructura principal de datos para una "Hoja de Trabajo" dentro de la aplicación.
 *
 * @property id_hoja_trabajo - Identificador único de la hoja de trabajo.
 * @property num_folio_tramite - Número de folio asociado al trámite.
 * @property numero_fleje - Número de fleje utilizado para identificación.
 * @property requiere_toma_muestra - Indica si se requiere toma de muestra.
 * @property requiere_tratamiento - Indica si se requiere tratamiento.
 * @property aplica_guardia_custodia - Especifica si aplica guardia y custodia.
 * @property lugar_inspeccion - Lugar donde se realiza la inspección, o null si no se especifica.
 * @property tipo_prueba - Tipo de prueba a realizar, o null si no se especifica.
 * @property detalles - Lista de elementos de detalle asociados a la hoja de trabajo.
 * @property codigos_aleatorios - Arreglo de códigos aleatorios relacionados con la hoja de trabajo.
 * @property orden_tratamiento - Información de la orden de tratamiento.
 * @property remision_muestra - Información de la remisión de muestra.
 * @property validaciones - Resultados o requisitos de validación para la hoja de trabajo.
 */
export interface HojaTrabajoModel {
  id_hoja_trabajo: number;
  num_folio_tramite: string;
  numero_fleje: string;
  requiere_toma_muestra: boolean;
  requiere_tratamiento: boolean;
  aplica_guardia_custodia: number;
  lugar_inspeccion: string | null;
  tipo_prueba: string | null;
  detalles: Detalle[];
  codigos_aleatorios: CodigosAleatorio[];
  orden_tratamiento: OrdenTratamiento;
  remision_muestra: RemisionMuestra;
  validaciones: ValidacionesModel;
}

/**
 * Representa la información de detalle para un elemento de hoja de trabajo.
 *
 * @property id_mercancia_gob - Identificador único de la mercancía gubernamental.
 * @property id_detalle_hoja_trabajo - Identificador único del detalle de la hoja de trabajo.
 * @property id_hoja_trabajo - Identificador único de la hoja de trabajo.
 * @property clave_seccion - Clave de la sección asociada al detalle.
 * @property numero_requisito - Número de requisito.
 * @property descripcion_requisito - Descripción del requisito.
 * @property aplica_entrega_documentos - Indica si aplica la entrega de documentos (usualmente como bandera).
 * @property id_restriccion_tipo_tramite - Identificador del tipo de restricción del trámite.
 * @property descripcion_restriccion - Descripción de la restricción.
 */
export interface Detalle {
  id_mercancia_gob: number;
  id_mercancia: number;
  id_detalle_hoja_trabajo: number;
  id_hoja_trabajo: number;
  clave_seccion: string;
  cve_seccion: string;
  numero_requisito: number;
  descripcion_requisito: string;
  aplica_entrega_documentos: number;
  id_restriccion_tipo_tramite: number;
  descripcion_restriccion: string;
  requisitos: string;
}

/**
 * Representa la información de un código aleatorio asociado a la hoja de trabajo.
 *
 * @property id_codigo_aleatorio - Identificador único del código aleatorio.
 * @property codigo_aleatorio - Valor del código aleatorio.
 * @property id_hoja_trabajo - Identificador de la hoja de trabajo asociada.
 */
export interface CodigosAleatorio {
  id_codigo_aleatorio: number;
  codigo_aleatorio: string;
  id_hoja_trabajo: number;
}

/**
 * Representa la información de una orden de tratamiento asociada a la hoja de trabajo.
 *
 * @property orden_tratamiento - Identificador único de la orden de tratamiento.
 * @property descripcion_mercancia_tratada - Descripción de la mercancía tratada.
 * @property producto_aplicado - Producto aplicado en el tratamiento.
 * @property dosis_tratamiento - Dosis utilizada en el tratamiento.
 * @property cantidad_mercancia_tratada - Cantidad de mercancía tratada.
 * @property clave_unidad_medida - Clave de la unidad de medida utilizada.
 * @property descripcion_tratamiento - Descripción del tratamiento realizado.
 * @property tiempo_exposicion - Tiempo de exposición durante el tratamiento.
 * @property tipo_tratamiento - Tipo de tratamiento aplicado.
 * @property observacion - Observaciones adicionales sobre el tratamiento.
 * @property nombre_empresa - Nombre de la empresa que realizó el tratamiento.
 */
export interface OrdenTratamiento {
  orden_tratamiento: number;
  descripcion_mercancia_tratada: string;
  producto_aplicado: string;
  dosis_tratamiento: string;
  cantidad_mercancia_tratada: number;
  clave_unidad_medida: string;
  descripcion_tratamiento: string;
  tiempo_exposicion: string;
  tipo_tratamiento: string;
  observacion: string;
  nombre_empresa: string;
}

/**
 * Representa la información de una remisión de muestra asociada a la hoja de trabajo.
 *
 * @property id_remision_muestra - Identificador único de la remisión de muestra.
 * @property remision_muestra - Número de la remisión de muestra.
 * @property tipo_laboratorio - Tipo de laboratorio donde se realiza el análisis.
 * @property id_laboratorio_tipo_tramite - Identificador del tipo de trámite del laboratorio.
 * @property descripcion_laboratorio - Descripción del laboratorio.
 * @property descripcion_analisis_solicitado - Descripción del análisis solicitado.
 * @property tamano_muestra - Tamaño de la muestra.
 * @property clave_unidad_medida - Clave de la unidad de medida utilizada.
 * @property fecha_toma_muestra - Fecha en que se tomó la muestra.
 * @property numero_lote - Número de lote de la muestra.
 * @property observaciones - Observaciones adicionales sobre la muestra.
 * @property nombre_responsable_mercancia - Nombre del responsable de la mercancía.
 */
export interface RemisionMuestra {
  id_remision_muestra: number;
  remision_muestra: number;
  tipo_laboratorio: string;
  id_laboratorio_tipo_tramite: number;
  descripcion_laboratorio: string;
  descripcion_analisis_solicitado: string;
  tamano_muestra: string;
  clave_unidad_medida: string;
  fecha_toma_muestra: string;
  numero_lote: string;
  observaciones: string;
  nombre_responsable_mercancia: string;
}

/**
 * Representa el modelo de validaciones para una hoja de trabajo.
 *
 * @property {boolean} hojaTrabajo - Indica si la hoja de trabajo ha sido validada.
 * @property {boolean} remisionMuestra - Indica si la remisión de muestra ha sido validada.
 * @property {boolean} ordenTratamiento - Indica si la orden de tratamiento ha sido validada.
 */
export interface ValidacionesModel {
  hojaTrabajo: boolean;
  remisionMuestra: boolean;
  ordenTratamiento: boolean;
}

/**
 * Crea un estado inicial o parcial para el modelo HojaTrabajoModel.
 * Permite inicializar los valores por defecto o sobreescribirlos con los parámetros proporcionados.
 *
 * @param params - Objeto parcial con los valores a sobreescribir en el modelo.
 * @returns Un objeto HojaTrabajoModel con los valores inicializados.
 */
export function createDatosState(
  params: Partial<HojaTrabajoModel> = {}
): HojaTrabajoModel {
  return {
    id_hoja_trabajo: params.id_hoja_trabajo || 0,
    num_folio_tramite: parseToString(params.num_folio_tramite),
    numero_fleje: parseToString(params.numero_fleje),
    requiere_toma_muestra: params.requiere_toma_muestra || false,
    requiere_tratamiento: params.requiere_tratamiento || false,
    aplica_guardia_custodia: params.aplica_guardia_custodia || 0,
    lugar_inspeccion: params.lugar_inspeccion || null,
    tipo_prueba: params.tipo_prueba || null,
    detalles: [],
    codigos_aleatorios: [
      {
        id_codigo_aleatorio: 0,
        codigo_aleatorio: '',
        id_hoja_trabajo: 0,
      },
    ],
    validaciones: {
      hojaTrabajo: params?.validaciones?.hojaTrabajo || false,
      remisionMuestra: params?.validaciones?.remisionMuestra || false,
      ordenTratamiento: params?.validaciones?.ordenTratamiento || false,
    },
    orden_tratamiento: {
      orden_tratamiento: params?.orden_tratamiento?.orden_tratamiento || 0,
      descripcion_mercancia_tratada: parseToString(
        params?.orden_tratamiento?.descripcion_mercancia_tratada
      ),
      producto_aplicado: parseToString(
        params?.orden_tratamiento?.producto_aplicado
      ),
      dosis_tratamiento: parseToString(
        params?.orden_tratamiento?.dosis_tratamiento
      ),
      cantidad_mercancia_tratada:
        params?.orden_tratamiento?.cantidad_mercancia_tratada || 0,
      clave_unidad_medida: parseToString(
        params?.orden_tratamiento?.clave_unidad_medida
      ),
      descripcion_tratamiento: parseToString(
        params?.orden_tratamiento?.descripcion_tratamiento
      ),
      tiempo_exposicion: parseToString(
        params?.orden_tratamiento?.tiempo_exposicion
      ),
      tipo_tratamiento: parseToString(
        params?.orden_tratamiento?.tipo_tratamiento
      ),
      observacion: parseToString(params?.orden_tratamiento?.observacion),
      nombre_empresa: parseToString(params?.orden_tratamiento?.nombre_empresa),
    },
    remision_muestra: {
      id_remision_muestra: params?.remision_muestra?.id_remision_muestra || 0,
      remision_muestra: params?.remision_muestra?.remision_muestra || 0,
      tipo_laboratorio: parseToString(
        params?.remision_muestra?.tipo_laboratorio
      ),
      id_laboratorio_tipo_tramite:
        params?.remision_muestra?.id_laboratorio_tipo_tramite || 0,
      descripcion_laboratorio: parseToString(
        params?.remision_muestra?.descripcion_laboratorio
      ),
      descripcion_analisis_solicitado: parseToString(
        params?.remision_muestra?.descripcion_analisis_solicitado
      ),
      tamano_muestra: parseToString(params?.remision_muestra?.tamano_muestra),
      clave_unidad_medida: parseToString(
        params?.remision_muestra?.clave_unidad_medida
      ),
      fecha_toma_muestra: parseToString(
        params?.remision_muestra?.fecha_toma_muestra
      ),
      numero_lote: parseToString(params?.remision_muestra?.numero_lote),
      observaciones: parseToString(params?.remision_muestra?.observaciones),
      nombre_responsable_mercancia: parseToString(
        params?.remision_muestra?.nombre_responsable_mercancia
      ),
    },
  };
}
