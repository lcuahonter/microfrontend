/**
 * @fileoverview
 * Este archivo define la clase `Tramite105Query`, que extiende de la clase `Query` proporcionada por Akita.
 * Su propósito es facilitar la consulta de datos almacenados en el estado de la aplicación relacionado con el trámite 105.
 * 
 * @author [Tu Nombre]
 * @version 1.0
 * @date 09/04/2025
 */

import { Solicitud105State, Tramite105Store } from './tramite105.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * @class Tramite105Query
 * @extends Query<Solicitud105State>
 * 
 * @description
 * Esta clase proporciona métodos para seleccionar datos específicos del estado `Solicitud105State`
 * utilizando la librería Akita. Cada método devuelve un observable que emite los valores correspondientes
 * cuando el estado cambia.
 */
@Injectable({ providedIn: 'root' })
export class Tramite105Query extends Query<Solicitud105State> {
  /**
   * @constructor
   * @param {Tramite105Store} store - Instancia del store que contiene el estado `Solicitud105State`.
   */
  constructor(protected override store: Tramite105Store) {
    super(store);
  }

  /**
   * @property {Observable<Solicitud105State>} selectSolicitud$
   * Observable que emite el estado completo de `Solicitud105State`.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * @property {Observable<any>} selectImportacion$
   * Observable que emite el valor de `importacion` en el estado.
   */
  selectImportacion$ = this.select((state) => state.importacion);

  /**
   * @property {Observable<any>} selectExportacion$
   * Observable que emite el valor de `exportacion` en el estado.
   */
  selectExportacion$ = this.select((state) => state.exportacion);

  /**
   * @property {Observable<any>} selectDepositoFiscalGas$
   * Observable que emite el valor de `depositoFiscalGas` en el estado.
   */
  selectDepositoFiscalGas$ = this.select((state) => state.depositoFiscalGas);

  /**
   * @property {Observable<any>} selectDepositoFiscalVehiculos$
   * Observable que emite el valor de `depositoFiscalVehiculos` en el estado.
   */
  selectDepositoFiscalVehiculos$ = this.select((state) => state.depositoFiscalVehiculos);

  /**
   * @property {Observable<any>} selectDistribucionGas$
   * Observable que emite el valor de `distribucionGas` en el estado.
   */
  selectDistribucionGas$ = this.select((state) => state.distribucionGas);

  /**
   * @property {Observable<any>} selectServiciosTerceros$
   * Observable que emite el valor de `serviciosTerceros` en el estado.
   */
  selectServiciosTerceros$ = this.select((state) => state.serviciosTerceros);

  /**
   * @property {Observable<any>} selectIndustriaAutomotriz$
   * Observable que emite el valor de `industriaAutomotriz` en el estado.
   */
  selectIndustriaAutomotriz$ = this.select((state) => state.industriaAutomotriz);

  /**
   * @property {Observable<any>} selectDomicilio$
   * Observable que emite el valor de `domicilio` en el estado.
   */
  selectDomicilio$ = this.select((state) => state.domicilio);

  /**
   * @property {Observable<any>} selectUbicacion$
   * Observable que emite el valor de `ubicacion` en el estado.
   */
  selectUbicacion$ = this.select((state) => state.ubicacion);

  /**
   * @property {Observable<any>} selectPais$
   * Observable que emite el valor de `pais` en el estado.
   */
  selectPais$ = this.select((state) => state.pais);

  /**
   * @property {Observable<any>} selectCodigoPostal$
   * Observable que emite el valor de `codigoPostal` en el estado.
   */
  selectCodigoPostal$ = this.select((state) => state.codigoPostal);

  /**
   * @property {Observable<any>} selectEntidadFederativa$
   * Observable que emite el valor de `entidadFederativa` en el estado.
   */
  selectEntidadFederativa$ = this.select((state) => state.entidadFederativa);

  /**
   * @property {Observable<any>} selectMunicipioDelegacion$
   * Observable que emite el valor de `municipioDelegacion` en el estado.
   */
  selectMunicipioDelegacion$ = this.select((state) => state.municipioDelegacion);

  /**
   * @property {Observable<any>} selectlocalidad$
   * Observable que emite el valor de `localidad` en el estado.
   */
  selectlocalidad$ = this.select((state) => state.localidad);

  /**
   * @property {Observable<any>} selectColonia$
   * Observable que emite el valor de `colonia` en el estado.
   */
  selectColonia$ = this.select((state) => state.colonia);

  /**
   * @property {Observable<any>} selectEntidadFederativaDos$
   * Observable que emite el valor de `entidadFederativaDos` en el estado.
   */
  selectEntidadFederativaDos$ = this.select((state) => state.entidadFederativaDos);

  /**
   * @property {Observable<any>} selectCalle$
   * Observable que emite el valor de `calle` en el estado.
   */
  selectCalle$ = this.select((state) => state.calle);

  /**
   * @property {Observable<any>} selectNumeroExterior$
   * Observable que emite el valor de `numeroExterior` en el estado.
   */
  selectNumeroExterior$ = this.select((state) => state.numeroExterior);

  /**
   * @property {Observable<any>} selectNumeroInterior$
   * Observable que emite el valor de `numeroInterior` en el estado.
   */
  selectNumeroInterior$ = this.select((state) => state.numeroInterior);

  /**
   * @property {Observable<any>} selectUbicacionDescripcion$
   * Observable que emite el valor de `ubicacionDescripcion` en el estado.
   */
  selectUbicacionDescripcion$ = this.select((state) => state.ubicacionDescripcion);

  /**
   * @property {Observable<any>} selectAduana$
   * Observable que emite el valor de `aduana` en el estado.
   */
  selectAduana$ = this.select((state) => state.aduana);

  /**
   * @property {Observable<any>} selectFraccionarancelaria$
   * Observable que emite el valor de `fraccionarancelaria` en el estado.
   */
  selectFraccionarancelaria$ = this.select((state) => state.fraccionarancelaria);

  /**
   * @property {Observable<any>} selectProcedimientoCargaDescarga$
   * Observable que emite el valor de `procedimientoCargaDescarga` en el estado.
   */
  selectProcedimientoCargaDescarga$ = this.select((state) => state.procedimientoCargaDescarga);

  /**
   * @property {Observable<any>} selectSistemasMedicionUbicacion$
   * Observable que emite el valor de `sistemasMedicionUbicacion` en el estado.
   */
  selectSistemasMedicionUbicacion$ = this.select((state) => state.sistemasMedicionUbicacion);

  /**
   * @property {Observable<any>} selectMotivoNoDespachoAduana$
   * Observable que emite el valor de `motivoNoDespachoAduana` en el estado.
   */
  selectMotivoNoDespachoAduana$ = this.select((state) => state.motivoNoDespachoAduana);

  /**
   * @property {Observable<any>} selectOperaciones$
   * Observable que emite el valor de `operaciones` en el estado.
   */
  selectOperaciones$ = this.select((state) => state.operaciones);
}