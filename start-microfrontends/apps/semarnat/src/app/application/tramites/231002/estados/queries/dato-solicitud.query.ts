import { DatoSolicitudStore } from '../tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Query de Akita para observar y seleccionar el estado del formulario de solicitud.
 * Proporciona selectores individuales para acceder a partes específicas del estado.
 */
@Injectable({ providedIn: 'root' })
export class DatoSolicitudQuery extends Query<EstadoDatoSolicitud> {
  
  /**
   * Observable que emite todo el estado del formulario de solicitud.
   */
  estadoFormulario$ = this.select();

  /**
   * Constructor que inyecta el store del formulario de solicitud.
   * 
   * @param store - Store que contiene el estado de `EstadoDatoSolicitud`.
   */
  constructor(protected override store: DatoSolicitudStore) {
    super(store);
  }

  /**
   * Observable que emite los valores actuales del formulario 'solicitudForm'.
   */
  obtenerSolicitudForm$ = this.select((state) => state.solicitudForm);

  /**
   * Observable que emite los valores actuales del formulario 'empresaReciclaje'.
   */
  obtenerEmpresaReciclaje$ = this.select((state) => state.empresaReciclaje);

  /**
   * Observable que emite los valores actuales del formulario 'lugarReciclaje'.
   */
  obtenerLugarReciclaje$ = this.select((state) => state.lugarReciclaje);

  /**
   * Observable que emite los valores actuales del formulario 'empresaTransportista'.
   */
  obtenerEmpresaTransportista$ = this.select((state) => state.empresaTransportista);

  /**
   * Observable que emite los valores actuales del formulario 'precaucionesManejo'.
   */
  obtenerPrecaucionesManejo$ = this.select((state) => state.precaucionesManejo);
}
