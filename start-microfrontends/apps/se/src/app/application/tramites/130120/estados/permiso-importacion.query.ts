import { DatosGrupos } from '../models/permiso-importacion-modification.model';
import { Injectable } from '@angular/core';
import { PermisoImportacionStore } from './permiso-importacion.store';
import { Query } from '@datorama/akita';

/**
 * Consulta de datos para el trámite 130120.
 * 
 * @export
 * @class Tramite130120Query
 * @extends {Query<DatosGrupos>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite130120Query extends Query<DatosGrupos> {
  /**
   * Observable para los datos de la empresa.
   */
  selectDatosEmpresa$ = this.select((state) => {
    return state.datosRealizer;
  });

  /**
   * Observable para los datos de la mercancía.
   */
  setCargaTipo$ = this.select((state) => {
    return state.datosMercanica;
  })

  /**
   * Observable para los datos de quien recibe.
   */
  selectDatosQuienRecibe$ = this.select((state) => {
    return state.datosExporta;
  });

  /**
   * Observable para los datos de submanufactura de la mercancía.
   */
  selectDatosMercanciaSubmanufactura$ = this.select((state) => {
    return state.datosProductor;
  });

  /**
   * Observable para los datos del domicilio o lugar.
   */
  selectDatosDomicilioLugar$ = this.select((state) => {
    return state.datosExportador;
  });

  /**
   * Observable para los datos de la representación federal.
   */
  selectDatosFederal$ = this.select((state) => {
    return state.datosFederal;
  });

  selectDatos$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite130120Query.
   * @param store Instancia del store de permiso de importación.
   */
  constructor(protected override store: PermisoImportacionStore) {
    super(store);
  }
}