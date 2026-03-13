import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';

/**
 * @descripcion
 * Interfaz que define el estado del store `Tramite130112State`.
 * Este estado almacena toda la información relacionada con el trámite 130112.
 */
export interface Tramite130112State {

  /**
   * Representa el estado de la gestión para el trámite 130112.
   * Contiene todos los campos y datos necesarios para el manejo del formulario,
   * la tabla dinámica de partidas de la mercancía, y la selección de opciones
   * relevantes en el proceso de solicitud.
   */
  idSolicitud?: number | null;
  /**
   * Producto seleccionado en el formulario.
   */
  producto?: string;

  /**
   * Descripción del producto ingresada en el formulario.
   */
  descripcion?: string;

  /**
   * Fracción arancelaria seleccionada en el formulario.
   */
  fraccion?: string;

  /**
   * Cantidad del producto ingresada en el formulario.
   */
  cantidad?: string;

  /**
   * Valor en USD de la partida ingresada en el formulario.
   */
  valorPartidaUSD?: string;

  /**
   * Unidad de medida seleccionada en el formulario.
   */
  unidadMedida?: string;

  /**
   * Solicitud seleccionada en el formulario.
   */
  solicitud?: string;

  /**
   * Valor por defecto para el campo de selección de solicitud.
   */
  defaultSelect?: string;

  /**
   * Valor por defecto para el campo de selección de producto.
   */
  defaultProducto?: string;

  /**
   * Régimen seleccionado en el formulario.
   */
  regimen?: string;

  /**
   * Clasificación del régimen seleccionada en el formulario.
   */
  clasificacion?: string;

  /**
   * Lista de filas seleccionadas en la tabla dinámica.
   */
  filaSeleccionada?: PartidasDeLaMercanciaModelo[];

  /**
   * Cantidad de partidas de la mercancía ingresada en el formulario.
   */
  cantidadPartidasDeLaMercancia?: string;

  /**
   * Fracción TIGIE de las partidas de la mercancía ingresada en el formulario.
   */
  fraccionTigiePartidasDeLaMercancia?: string;

  /**
   * Descripción de la fracción de las partidas de la mercancía ingresada en el formulario.
   * */
  fraccionDescripcionPartidasDeLaMercancia?: string;

  /**
   * Valor en USD de las partidas de la mercancía ingresado en el formulario.
   */
  valorPartidaUSDPartidasDeLaMercancia?: string;

  /**
   * Descripción de las partidas de la mercancía ingresada en el formulario.
   */
  descripcionPartidasDeLaMercancia?: string;

  /**
   * Valor de la factura en USD ingresado en el formulario.
   */
  valorFacturaUSD?: string;

  /**
   * Bloque seleccionado en el formulario.
   */
  bloque?: string;

  /**
   * Uso específico seleccionado en el formulario.
   */
  usoEspecifico?: string;

  /**
   * Justificación para la importación/exportación ingresada en el formulario.
   */
  justificacionImportacionExportacion?: string;

  /**
   * Observaciones ingresadas en el formulario.
   */
  observaciones?: string;

  /**
   * Entidad seleccionada en el formulario.
   */
  entidad?: string;

  /**
   * Representación seleccionada en el formulario.
   */
  representacion?: string;

  /**
   * Indica si la tabla dinámica debe mostrarse.
   */
  mostrarTabla?: boolean;
    /**
   * Datos del cuerpo de la tabla dinámica.
   */
  tableBodyData?: PartidasDeLaMercanciaModelo[];
  /**
   * Cantidad total de partidas de la mercancía.
   */
  cantidadTotal?: string;
  /*
  Valor total en USD de las partidas de la mercancía.
  */
  valorTotalUSD?: string;
  /** Arreglo de partidas a mostrar en la tabla. */
  mostrarPartidas?: MostrarPartidas[];

  /**   
   * Fechas seleccionadas en el formulario.
   */
 fechasSeleccionadas?: string[];
}

/**
 * @descripcion
 * Función que crea el estado inicial del store `Tramite130112Store`.
 * @returns {Tramite130112State} Estado inicial del store.
 */
export function createInitialState(): Tramite130112State {
  return {
    idSolicitud: 0,
    filaSeleccionada: [],
    mostrarTabla: true,
    solicitud: '',
    fraccion: '',
    defaultSelect: 'Inicial',
    producto: '',
    descripcion: '',
    cantidad: '',
    valorPartidaUSD: '',
    unidadMedida: '',
    defaultProducto: 'Nuevo',
    regimen: '',
    clasificacion: '',
    cantidadPartidasDeLaMercancia: '',
    fraccionTigiePartidasDeLaMercancia: '',
    fraccionDescripcionPartidasDeLaMercancia: '',
    valorPartidaUSDPartidasDeLaMercancia: '',
    descripcionPartidasDeLaMercancia: '',
    valorFacturaUSD: '',
    bloque: '',
    usoEspecifico: '',
    justificacionImportacionExportacion: '',
    observaciones: '',
    entidad: '',
    representacion: '',
    tableBodyData: [],
    cantidadTotal: '',
    valorTotalUSD: '',
    mostrarPartidas: [],
    fechasSeleccionadas: [],
  };
}

/**
 * @descripcion
 * Servicio que implementa el store `Tramite130112Store` para gestionar el estado
 * relacionado con el trámite 130112.
 *
 * @decorador @Injectable
 * @decorador @StoreConfig
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130112' })
export class Tramite130112Store extends Store<Tramite130112State> {
  /**
   * @descripcion
   * Constructor del store `Tramite130112Store`.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite130112State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }
}
