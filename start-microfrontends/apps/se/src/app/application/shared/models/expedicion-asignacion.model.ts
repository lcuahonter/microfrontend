import { ConfiguracionColumna } from "@libs/shared/data-access-user/src";

/**
 * Modelo de datos para la expedición y asignación
 */
export interface StoreValues {
  totalExpedir: number;
  montoExpedir: number;
  montoDisponibleAsignacion: number;
  cveAniosAutorizacion: string;
  numFolioAsignacionAux: string;
  cuerpoTabla: unknown[];
  mostrarDetalle: boolean;
  fechaFinVigencia: Date;
}
/** Modelo para la respuesta de la API de expedir monto
 * @interface ExpedirMonto
 */
export interface ExpedirMonto {
  /**
   * Monto a expedir
   * @type {number}
   */
  montoExpedir: number;
}

/** Modelo para la respuesta de la API de búsqueda de asignación
 * @interface BuscarAsignacionResponseItem
 */
export interface BuscarAsignacionResponseItem {
  estado?: { nombre: string };
  unidadAdministrativaRepresentacionFederal?: { nombre: string };
  asignacion?: {
    idAsignacion?: number;
    impTotalAprobado?: number;
    impTotalExpedido?: number;
    montoDisponible?: number;
    numFolioAsignacion?: string;
    fechaInicioVigencia?: string;
    fechaFinVigenciaAprobada?: string;
    idMecanismoAsignacion?: number;
  };
  mecanismoAsignacion?: {
    regimen?: string;
    descClasificacionProducto?: string;
    nombreMecanismoAsignacion?: string;
    nombreTratado?: string;
    paisesCupo?: Array<{ pais: { nombre: string } }>;
    observaciones?: string;
    descripcionFundamento?: string;
    unidadMedidaDescripcion?: string;
    nombreProducto?: string;
    fechaInicioVigencia?: string;
    fechaFinVigencia?: string;
    entitadNombre?: string;
  };
  fraccionArancelaria?: Array<string>;
  montoDisponibleAsignacion?: number;

}
/** Modelo para la respuesta de la API de búsqueda de asignación
 * @interface BuscarAsignacionResponse
 */
export interface BuscarAsignacionResponse {
  datos: BuscarAsignacionResponseItem[];
}

/**
 * Constantes para la configuración de la tabla de expedición de certificados
 */
export const CONFIGURACION_PARA_ENCABEZADO_DE_EXPEDIR_MONTO_TABLA: ConfiguracionColumna<ExpedirMonto>[] = [
  { encabezado: 'Monto a expedir', clave: (fila) => fila.montoExpedir, orden: 1 },
];


/** Modelo para el estado de la sección de expedición de certificados para asignación
*/
export interface StateExpedicionAsignacion {
  asignacionOficioNumeroForm: {
    cveAniosAutorizacion?: string;
    numFolioAsignacionAux?: string;
  };

  representacionFederalForm: {
    estado?: string;
    representacionFederal?: string;
  };

  controlMontosAsignacionForm: {
    sumaAprobada?: number | null;
    sumaExpedida?: number | null;
    montoDisponible?: number | null;
  };

  asignacionDatosForm: {
    idAsignacion?: number;
    numOficio?: string;
    fechaInicio?: string;
    fechaFinVigenciaAprobada?: string;
  };

  cupoDescripcionForm: {
    regimenAduanero?: string;
    descripcionProducto?: string;
    clasificaionSubproducto?: string;
    unidadMedidaOficialCupo?: string;
    fechaInicioVigencia?: string;
    fechaFinVigencia?: string;
    mecanismoAsignacion?: string;
    tratado?: string;
    fraccionesArancelarias?: string;
    paisesCupo?: string;
    observaciones?: string;
    descripcionFundamento?: string;
  };

  distribucionSaldoForm: {
    montoDisponibleAsignacion?: number | null;
    montoExpedir?: number | null;
    totalExpedir?: number;
  };
  totalExpedir?: number;
  montoDisponibleAsignacion?: number | null;
  cuerpoTabla?: ExpedirMonto[];
  mostrarDetalle?: boolean;
}