import { Catalogo } from "@ng-mf/data-access-user";
import { CatalogosSelect } from "@ng-mf/data-access-user";
/**
 * Interfaz que representa una lista de pasos en un asistente.
 * 
 */
export interface ListaPasosWizard {
  /**
 * @property {number} indice - El índice del paso en el asistente.
 */
  indice: number;
  /**
 * @property {string} titulo - El título del paso.
 */
  titulo: string;
  /**
 * @property {boolean} activo - Indica si el paso está activo.
 */
  activo: boolean;
  /**
 * Interfaz que representa una lista de pasos en un asistente.
 * 
 * @property {boolean} completado - Indica si el paso ha sido completado.
 */
  completado: boolean;
}

/** 
 * Interfaz que representa el historial de inspecciones físicas.
 */
export interface HistorialInspeccionFisica {
  /** Número de artículo de mercancía*/
  numeroPartidaMercancia: string;
  
  /** Fracción arancelaria aduanera */
  fraccionArancelaria: string;
  
  /** código nico */
  nico: string;
  
  /** Cantidad en UMT */
  cantidadUmt: string;
  
  /** Cantidad inspeccionada*/
  cantidadInspeccion: string;
  
  /** Saldo pendiente */
  saldoPendiente: string;
  
  /** Fecha de inspección en formato de cadena */
  fechaInspeccionString: string;
}

/** 
 * Interfaz que representa detalles de vagones de ferrocarril.
 */
export interface CarrosDeFerrocarril {
  /** Identificación de inspección física */
  idInspeccionFisica: number;
  
  /** Número de autorización */
  numeroAutorizacion: string;
  
  /** Número de artículo de mercancía */
  numeroPartidaMercancia: string;
  
  /** Número total de vagones de ferrocarril */
  numeroTotalCarros: number;
}

/** 
 * Interfaz que representa una solicitud u orden.
 */
export interface Solicitud {
  /** Fecha de creación */
  fechaCreacion: string;
  
  /** Nombre o identificador de la mercancía */
  mercancia: string;
  
  /** Cantidad solicitada */
  cantidad: string;
  
  /** Proveedor de la mercancia */
  proovedor: string;
/**
 * Régimen del trámite.
 */
regimen: string;

/**
 * Tipo de producto relacionado con el trámite.
 */
tipoProducto: string;

/**
 * País de procedencia del producto.
 */
paisProcedencia: string;

/**
 * Clasificación de las mercancías.
 */
clasificacionMercancia: string;

/**
 * Fracción arancelaria del producto.
 */
fraccionArancelaria: string;

/**
 * Descripción de la fracción arancelaria.
 */
descFraccionArancelaria: string;

/**
 * Cantidad del producto en letras.
 */
cantidadLetra: string;

/**
 * Género del producto.
 */
genero: string;

/**
 * Especie del producto.
 */
especie: string;

/**
 * Nombre común del producto.
 */
nombreComun: string;

/**
 * Descripción del producto.
 */
descripcionProducto: string;

/**
 * Unidad de medida del producto.
 */
cantidadUMC: string;

/**
 * Indica si hay manifiestos y descripción.
 */
manifiestosYdesc: boolean;

/**
 * Rango de días seleccionado.
 */
seleccionarsRangoDias: string;

/**
 * Rango de días seleccionado para las aduanas.
 */
seleccionarsRangoDiasAduanas: string;

/**
 * Rango de días seleccionado para el país de origen.
 */
seleccionarsRangoDiasPaisOrigen: string;

/**
 * Rango de días seleccionado para el destino.
 */
seleccionarsRangoDiasDestino: string;
}

/** 
 * Interfaz que representa los detalles de la mercancía.
 */
export interface DatosDeMercancias {
  /** Fracción arancelaria aduanera*/
  fraccionArancelaria: string;
  
  /** Descripción de la fracción arancelaria aduanera */
  descripcionFraccion: string;
  
  /** Código NICO (número de identificación específico) */
  nico: string;
  
  /** Descripción del código NICO */
  nicoDescripcion: string;
  
  /** Cantidad solicitada en UMT (Tipo de unidad de medida) */
  cantidadSolicitadaUMT: number;
  
  /** Tipo de unidad de medida */
  unidadMedidaUMT: string;
  
  /** Cantidad total en UMT */
  cantidadTotalUMT: number;
  
  /** Saldo pendiente */
  saldoPendiente: number;
  
  /** Indica si el elemento está seleccionado. */
  selected?: boolean;
}

/** 
 * Interfaz que representa la estructura de carga de datos inicial.
 */
export interface CargarDatosIniciales {
  /** Encabezados para el historial de inspección */
  hHistorialinspeccion: string[];
  
  /** Datos del historial de inspección */
  dHistorialInspecciones: HistorialInspeccionFisica[];
  
  /** Datos de vagones de ferrocarril */
  dCarrosDeFerrocarril: CarrosDeFerrocarril[];
  
  /** Cabeceras para mesa de vagones de ferrocarril */
  hCarroFerrocarril: string[];
  
  /** Encabezados para solicitudes */
  solicitudDatos: string[];
  
  /** Solicitar datos */
  dSolicitud: Solicitud[];
  
  /** encabezadas para mercancias */
  hMercancias: string[];
  
  /** encabezados para mercancia */
  dMercancia: DatosDeMercancias[];

  /** Medio de transporte */
  medioDeTransporte: CatalogosSelect;
}
/**
 * Interfaz que representa los datos del trámite realizar.
 */
export interface DatosDelTramiteRealizar {
  /** Clave de control */
  pendientesCertificados: Catalogo[];
  /** Certificados autorizados */
  horaInspeccion: Catalogo[];
  /** Hora de inspección */
  aduanaIngreso: Catalogo[];
  /** Aduana de ingreso */
  sanidadAgropecuaria: Catalogo[];
  /** Oficina de inspección de Sanidad Agropecuaria */
  puntoInspeccion: Catalogo[];
}