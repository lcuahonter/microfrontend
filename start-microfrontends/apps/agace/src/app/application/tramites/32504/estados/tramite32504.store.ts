import {
  ColumnasTabla,
  ColumnsTableMercancia,
  DatosDomicilioLugar,
  DatosEmpresa,
  DatosMercanciaSubmanufactura,
  T32504State,
} from '../models/aviso.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado inicial del formulario del trámite 32504.
 * @type {FormularioGrupo}
 */
export const INITIAL_STATE: T32504State = {
  idSolicitud: null,
  adace: '',
  datosEmpresa: {
    tipo_carga: 'TIPCAR.MA',
    numero_programa_immex: '',
    ide_generica3: '',
    ide_generica2: '',
    clave_permiso_sedena: '',
  },
  direcciones: [],
};

/**
 * @class Tramite32504Store
 * @description Store para la gestión del estado del formulario del trámite 32504.
 * @extends {Store<FormularioGrupo>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite-32504', resettable: true })
export class Tramite32504Store extends Store<T32504State> {
  /**
   * Crea una instancia de Tramite32504Store e inicializa el estado.
   */
  constructor() {
    super(INITIAL_STATE);
  }

  /**
   * Establece los datos de la empresa en el estado.
   *
   * @param {DatosEmpresa} datosEmpresa - Los datos de la empresa que se van a establecer en el estado.
   * @returns {void}
   */
  setDatosEmpresa(datosEmpresa: DatosEmpresa): void {
    this.update((state) => ({
      ...state,
      datosEmpresa,
    }));
  }

  /**
   * Establece el tipo de carga en el estado.
   *
   * @param {CargaTipo} cargaTipo - El tipo de carga que se va a establecer en el estado.
   * @returns {void}
   */
  setCargaTipo(cargaTipo: string): void {
    this.update((state) => ({
      ...state,
      cargaTipo,
    }));
  }

  /**
   * Establece los datos del domicilio del lugar en el estado.
   *
   * @param {direcciones} direcciones - Los datos del domicilio del lugar que se van a establecer en el estado.
   * @returns {void}
   */
  setDirecciones(direcciones: DatosDomicilioLugar[]): void {
    this.update((state) => ({
      ...state,
      direcciones,
    }));
  }

  /**
   * Establece los datos de la mercancía para submanufactura en el estado.
   *
   * @param {DatosMercanciaSubmanufactura} datosMercanciaSubmanufactura - Los datos de la mercancía para submanufactura que se van a establecer en el estado.
   * @returns {void}
   */
  setDatosMercanciaSubmanufactura(
    datosMercanciaSubmanufactura: DatosMercanciaSubmanufactura
  ): void {
    this.update((state) => ({
      ...state,
      datosMercanciaSubmanufactura,
    }));
  }

  /**
   * Actualiza el estado general del formulario con los datos proporcionados.
   *
   * @param {FormularioGrupo} datos - Los nuevos datos del formulario que se utilizarán para actualizar el estado.
   * @returns {void}
   */
  setEstadoGeneral(datos: T32504State): void {
    this.update((state) => ({
      ...state,
      datos,
    }));
  }
  /**
   * Actualiza el estado con una nueva lista de avisos.
   *
   * @param aviso Lista de objetos de tipo ColumnasTabla que reemplazará el valor actual.
   */
  public setAviso(aviso: ColumnasTabla[]): void {
    this.update((state) => ({
      ...state,
      aviso,
    }));
  }
  /** Actualiza el estado con mercancías nuevas.
   *  Reemplaza la lista existente por la recibida.
   *  Se utiliza al cargar datos o reiniciar la tabla. */
  public setMercancias(mercancias: ColumnsTableMercancia[]): void {
    this.update((state) => ({
      ...state,
      mercancias,
    }));
  }
  /**
   * Restaura el estado del store a su estado inicial.
   * @returns {void}
   */
  public limpiarFormulario(): void {
    this.reset();
  }
}
