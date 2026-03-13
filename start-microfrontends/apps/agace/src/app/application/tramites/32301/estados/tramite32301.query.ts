import { FormularioGrupo } from '../models/avisomodify.model';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite32301Store } from './tramite32301.store';

/**
 * Consulta del trámite 32301.
 * Esta clase maneja las consultas sobre el estado del store `Tramite32301Store`.
 * Utiliza Akita para gestionar el estado de forma reactiva.
 * 
 * @export
 * @class Tramite32301Query
 * @extends {Query<FormularioGrupo>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite32301Query extends Query<FormularioGrupo> {
  /**
 * Selección del tipo de devolución del aviso.
 * Devuelve el estado actual de `tipoDevAviso` en el store.
 */
  selectState$ = this.select((state) => {
    return state;
  });

  /**
   * Selección del tipo de devolución del aviso.
   * Devuelve el estado actual de `tipoDevAviso` en el store.
   */
  selectTipoDevAviso$ = this.select((state) => {
    return state.tipoDevAviso;
  });

  /**
   * Selección del proveedor extranjero.
   * Devuelve el estado actual de `proveedorExtranjero` en el store.
   */
  selectProveedorExtranjero$ = this.select((state) => {
    return state.proveedorExtranjero;
  });

  /**
   * Selección de la modificación de socios.
   * Devuelve el estado actual de `modificacionSocios` en el store.
   */
  selectModificacionSocios$ = this.select((state) => {
    return state.modificacionSocios;
  });

  /**
   * Selección de la modificación de goce de inmueble.
   * Devuelve el estado actual de `modificacionGoceInmueble` en el store.
   */
  selectModificacionGoceInmueble$ = this.select((state) => {
    return state.modificacionGoceInmueble;
  });

  /**
   * Selección de los datos de la persona en el proceso de fusión o escisión.
   * Devuelve el estado actual de `personaFusionEscisionDTO` en el store.
   */
  selectpersonaFusionEscisionDTO$ = this.select((state) => {
    return state.personaFusionEscisionDTO;
  });

  /**
   * Selección de las fechas seleccionadas.
   * Devuelve el estado actual de `fechasSeleccionadas` en el store.
   */
  selectFechasSeleccionadas$ = this.select((state) => {
    return state.fechasSeleccionadas;
  });

  /**
   * Selección de los datos de la empresa.
   * Devuelve el estado actual de `datosEmpresa` en el store.
   */
  selectDatosEmpresa$ = this.select((state) => {
    return state.datosEmpresa;
  });

  /**
   * Selección del tipo de carga.
   * Devuelve el estado actual de `cargaTipo` en el store.
   */
  setCargaTipo$ = this.select((state) => {
    return state.cargaTipo;
  });

  /**
   * Selección de los datos de la persona que recibe el trámite.
   * Devuelve el estado actual de `datosQuienRecibe` en el store.
   */
  selectDatosQuienRecibe$ = this.select((state) => {
    return state.datosQuienRecibe;
  });

  /**
   * Selección de los datos de la mercancía y submanufactura.
   * Devuelve el estado actual de `datosMercanciaSubmanufactura` en el store.
   */
  selectDatosMercanciaSubmanufactura$ = this.select((state) => {
    return state.datosMercanciaSubmanufactura;
  });

  /**
   * Selección de los datos del domicilio y lugar de la operación.
   * Devuelve el estado actual de `datosDomicilioLugar` en el store.
   */
  selectDatosDomicilioLugar$ = this.select((state) => {
    return state.datosDomicilioLugar;
  });

  /**
   * Constructor de la clase Tramite32301Query.
   * @param store El store que maneja el estado de los datos del trámite.
   */
  constructor(protected override store: Tramite32301Store) {
    super(store);
  }
}
