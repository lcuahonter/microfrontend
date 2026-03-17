import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { MostrarPartidas } from '@libs/shared/data-access-user/src';
import { PartidasDeLaMercanciaModelo } from '../../shared/models/partidas-de-la-mercancia.model';

/**
 * Estado inicial y configuración del store para el trámite 130202.
 */
export interface Tramite130114State {
  idSolicitud?: number;
  producto: string;
  descripcion: string;
  fraccion: string;
  cantidad: string;
  valorPartidaUSD: string;
  unidadMedida: string;
  solicitud: string;
  defaultSelect: string;
  defaultProducto: string;
  regimen: string;
  clasificacion: string;
  filaSeleccionada: PartidasDeLaMercanciaModelo[];
  cantidadPartidasDeLaMercancia: string;
  valorPartidaUSDPartidasDeLaMercancia: string;
  descripcionPartidasDeLaMercancia: string;
  valorFacturaUSD: string;
  bloque: string;
  usoEspecifico: string;
  justificacionImportacionExportacion: string;
  observaciones: string;
  entidad: string;
  representacion: string;
  mostrarTabla: boolean;
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
 * @description
 * Arreglo que contiene las fechas seleccionadas por el usuario.
 * 
 * Este listado se utiliza para almacenar y procesar las fechas
 * elegidas dentro del formulario o componente, permitiendo validar,
 * mostrar o enviar dicha información según la lógica del módulo.
 */
  fechasSeleccionadas: string[];

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
  };

  /**
   * Lista de partidas a mostrar.
   */
  mostrarPartidas: MostrarPartidas[];
}
/**
 * Crea el estado inicial del store.
 */
export function createInitialState(): Tramite130114State {
  return {
    idSolicitud: 0,
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
    fechasSeleccionadas: [],
    modificarPartidasDelaMercanciaForm: {
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
    },
    mostrarPartidas: [],
  };
}
/**
 * Store para manejar el estado del trámite 130202.
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite130114' })
export class Tramite130114Store extends Store<Tramite130114State> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado del store con los valores proporcionados.
   * Valores a actualizar en el estado.
   */
  public actualizarEstado(valores: Partial<Tramite130114State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }

  /**
 * @description
 * Restablece el estado del store realizando una llamada al método `reset()`.
 * 
 * Este método encapsula la lógica de reinicio, permitiendo limpiar o
 * restaurar los valores manejados en el store según la implementación
 * interna del método `reset()`.
 */
  resetStore(): void {
    this.reset();
  }
}
