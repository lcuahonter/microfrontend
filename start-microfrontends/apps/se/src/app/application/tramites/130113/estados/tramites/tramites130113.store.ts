import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PartidasDeLaMercanciaModelo } from '../../../../shared/models/partidas-de-la-mercancia.model';


/**
 * 
 * Interfaz que define el estado del store `Tramite130113State`.
 * Este estado almacena toda la información relacionada con el trámite 130113.
 */
export interface Tramite130113State {
  /**
   * Identificador numérico de la solicitud actual.
   */
  idSolicitud: number;
  /** Producto seleccionado en el trámite. */
  producto: string;

  /** Descripción del producto o mercancía. */
  descripcion: string;

  /** Fracción arancelaria asociada al producto. */
  fraccion: string;

  /** Cantidad de producto o mercancía. */
  cantidad: string;

  /** Valor de la partida en USD. */
  valorPartidaUSD: number | string;

  /** Unidad de medida del producto o mercancía. */
  unidadMedida: string;

  /** Solicitud asociada al trámite. */
  solicitud: string;

  /** Valor predeterminado del selector en el formulario. */
  defaultSelect: string;

  /** Valor predeterminado del producto en el formulario. */
  defaultProducto: string;

  /** Régimen seleccionado en el trámite. */
  regimen: string;

  /** Clasificación del régimen seleccionado. */
  clasificacion: string;

  /** Fila seleccionada en la tabla de partidas de mercancía. */
  filaSeleccionada: PartidasDeLaMercanciaModelo[];

  /** Cantidad de partidas de la mercancía. */
  cantidadPartidasDeLaMercancia: string;

  /** Fracción TIGIE asociada a las partidas de la mercancía. */
  fraccionTigiePartidasDeLaMercancia: string;

  /** Descripción de la fracción asociada a las partidas de la mercancía. */
  fraccionDescripcionPartidasDeLaMercancia: string;

  /** Valor de la partida en USD para las partidas de la mercancía. */
  valorPartidaUSDPartidasDeLaMercancia: string;

  /** Descripción de las partidas de la mercancía. */
  descripcionPartidasDeLaMercancia: string;

  /** Valor de la factura en USD. */
  valorFacturaUSD: string;

  /** Bloque asociado al trámite. */
  bloque: string;

  /** Uso específico del producto o mercancía. */
  usoEspecifico: string;

  /** Justificación para la importación o exportación. */
  justificacionImportacionExportacion: string;

  /** Observaciones adicionales relacionadas con el trámite. */
  observaciones: string;

  /** Entidad federativa seleccionada en el trámite. */
  entidad: string;

  /** Representación federal seleccionada en el trámite. */
  representacion: string;

  /** Indica si se debe mostrar la tabla de partidas de mercancía. */
  mostrarTabla: boolean;

  /** Arreglo de partidas a mostrar en la tabla. */
  mostrarPartidas: MostrarPartidas[];
  /**
   * Formulario para modificar las partidas de la mercancía.
   */
  modificarPartidasDelaMercanciaForm: {
    /** Cantidad de partidas de la mercancía */
    cantidadPartidasDeLaMercancia: string;
    /** Valor en USD de las partidas de la mercancía */
    valorPartidaUSDPartidasDeLaMercancia: string;
    /** Descripción de las partidas de la mercancía */
    descripcionPartidasDeLaMercancia: string;
    /**
     * Clave de la fracción arancelaria TIGIE correspondiente a la partida
     * de la mercancía. Este valor representa la fracción seleccionada dentro
     * del catálogo TIGIE.
     */
    fraccionTigiePartidasDeLaMercancia: string;
    /**
     * Descripción asociada a la fracción arancelaria TIGIE dentro de
     * *Partidas de la mercancía*. Se utiliza para mostrar el detalle
     * descriptivo de la fracción seleccionada.
     */
    fraccionDescripcionPartidasDeLaMercancia: string;
  };
  /**   
   * Cantidad total de las partidas de la mercancía.
   */
  cantidadTotal: string;
  /**   
   * Valor total en USD de las partidas de la mercancía.
   */
  valorTotalUSD: string;
  /**   
    * Fechas seleccionadas en el formulario.
    */
  fechasSeleccionadas: string[];

  /** Lista de partidas de la mercancía asociadas al trámite. */
  tableBodyData: PartidasDeLaMercanciaModelo[];
}

/**
 * 
 * Función que crea el estado inicial del store `Tramite130113Store`.
 * @returns {Tramite130113State} Estado inicial del store.
 */
export function createInitialState(): Tramite130113State {
  return {
    idSolicitud:0,
    filaSeleccionada: [],
    mostrarTabla: false,
    solicitud: '',
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
    mostrarPartidas: [],
    modificarPartidasDelaMercanciaForm: {
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      fraccionTigiePartidasDeLaMercancia: '',
      fraccionDescripcionPartidasDeLaMercancia: '',
    },
    cantidadTotal: '',
    valorTotalUSD: '',
    fechasSeleccionadas: [],
    tableBodyData: [],
  };
}

/**
 * 
 * Servicio que implementa el store `Tramite130113Store` para gestionar el estado
 * relacionado con el trámite 130113.
 *
 * @decorador @Injectable
 * @decorador @StoreConfig
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130113' })
export class Tramite130113Store extends Store<Tramite130113State> {
  /**
   * 
   * Constructor del store `Tramite130113Store`.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }


  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite130113State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }
 
}
