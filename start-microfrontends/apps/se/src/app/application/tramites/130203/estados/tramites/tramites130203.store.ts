import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

/**
 * @interface Tramite130203State
 * @description Define la estructura del estado para el trámite 130203.
 */
export interface Tramite130203State {
  idSolicitud: number;
  /** Nombre del producto. */
  producto: string;

  /** Descripción del producto. */
  descripcion: string;

  /** Fracción arancelaria del producto. */
  fraccion: string;

  /** Cantidad del producto. */
  cantidad: string;

  /** Valor de la partida en dólares estadounidenses. */
  valorPartidaUSD: string;

  /** Unidad de medida del producto. */
  unidadMedida: string;

  /** Información de la solicitud. */
  solicitud: string;

  /** Valor predeterminado del campo de selección. */
  defaultSelect: string;

  /** Producto predeterminado. */
  defaultProducto: string;

  /** Régimen relacionado con el trámite. */
  regimen: string;

  /** Clasificación del producto. */
  clasificacion: string;

  /** Fila seleccionada en la tabla de partidas de la mercancía. */
  filaSeleccionada: PartidasDeLaMercanciaModelo[];

  /** Cantidad de partidas de la mercancía. */
  cantidadPartidasDeLaMercancia: string;

  /** Valor de la partida en dólares estadounidenses para las partidas de la mercancía. */
  valorPartidaUSDPartidasDeLaMercancia: string;

  /** Descripción de las partidas de la mercancía. */
  descripcionPartidasDeLaMercancia: string;

  /** Valor de la factura en dólares estadounidenses. */
  valorFacturaUSD: string;

  /** Bloque relacionado con el trámite. */
  bloque: string;

  /** Uso específico del producto. */
  usoEspecifico: string;

  /** Justificación para la importación o exportación. */
  justificacionImportacionExportacion: string;

  /** Observaciones adicionales. */
  observaciones: string;

  /** Número de permiso de importación. */
  numeroPermisoImportacion: string;

  /** Entidad relacionada con el trámite. */
  entidad: string;

  /** Representación relacionada con el trámite. */
  representacion: string;

  /** Indica si se debe mostrar la tabla. */
  mostrarTabla: boolean;

  /** Nombre del exportador. */
  nombreExportador: string;

  /** Dirección del exportador. */
  direccionExportador: string;

  /** Nombre del importador. */
  nombreImportador: string;

  /** Dirección del importador. */
  direccionImportador: string;

  /** Número en letra de los lotes. */
  numeroEnLetraDeLosLotes: string;

  /** Número en letra de los lotes en inglés. */
  numeroEnLetraDeLosLotesEnIngles: string;

  /** Número de la factura. */
  numeroDeFactura: string;

  /** Cantidad en quilates. */
  cantidadEnQuilates: string;

  /** Valor de los diamantes. */
  valorDeLosDiamantes: string;

  /** Estado relacionado con el trámite. */
  state: string;

  /** Indica si el producto es mixto. */
  mixed: boolean;

  /** País de origen del producto. */
  paisOrigen: number | null;

  /** Valor adicional para especificar detalles. */
  especifique: number;

  /** Número relacionado con el trámite. */
  numero: string;

  /** Tipo de empresa relacionada con el trámite. */
  tipoEmpresa: string;

  /** Valor del checkbox de línea. */
  lineaCheckbox: boolean;

  /** Nombre relacionado con el trámite. */
  nombre: string;
  /**
   * Datos del cuerpo de la tabla dinámica.
   */
  tableBodyData: PartidasDeLaMercanciaModelo[];
  /**
   * Cantidad total de partidas de la mercancía.
   */
  cantidadTotal: string;
  /*
  Valor total en USD de las partidas de la mercancía.
  */
  valorTotalUSD: string;

  /**   
    * Fechas seleccionadas en el formulario.
    */
  fechasSeleccionadas: string[];


  formDelTramite: {
    solicitud: string,
    regimen: string,
    clasificacion: string,
  }
}

/**
 * @function createInitialState
 * @description Crea el estado inicial para el trámite 130203.
 * @returns {Tramite130203State} Estado inicial con valores predeterminados.
 */
export function createInitialState(): Tramite130203State {
  return {
    idSolicitud: 0,
    filaSeleccionada: [],
    mostrarTabla: true,
    solicitud: 'TISOL.I',
    fraccion: '',
    defaultSelect: 'TISOL.I',
    producto: 'CONDMER.N',
    descripcion: '',
    cantidad: '',
    valorPartidaUSD: '',
    unidadMedida: '',
    defaultProducto: 'CONDMER.N',
    regimen: '',
    clasificacion: '',
    cantidadPartidasDeLaMercancia: '',
    valorPartidaUSDPartidasDeLaMercancia: '',
    descripcionPartidasDeLaMercancia: '',
    valorFacturaUSD: '',
    bloque: '',
    usoEspecifico: '',
    justificacionImportacionExportacion: '',
    observaciones: '',
    numeroPermisoImportacion: '',
    entidad: '',
    representacion: '',
    nombreExportador: '',
    direccionExportador: '',
    nombreImportador: '',
    direccionImportador: '',
    numeroEnLetraDeLosLotes: '',
    numeroEnLetraDeLosLotesEnIngles: '',
    numeroDeFactura: '',
    cantidadEnQuilates: '',
    valorDeLosDiamantes: '',
    numero: '',
    state: '',
    mixed: false,
    paisOrigen: null,
    especifique: 0,
    tipoEmpresa: '',
    lineaCheckbox: false,
    nombre: '',
    tableBodyData: [],
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],
    formDelTramite: {
      solicitud: '',
      regimen: '',
      clasificacion: '',
    }
  };
}

/**
 * @class Tramite130203Store
 * @description Clase que extiende la funcionalidad de Akita Store para gestionar el estado del trámite 130203.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130203' })
export class Tramite130203Store extends Store<Tramite130203State> {
  /**
   * @constructor
   * @description Inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite130203State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  public resetStore(): void {
    this.reset();
  }
}
