import {DatoSolicitudStore} from '../tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../../models/datos-solicitud.model';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class DatoSolicitudQuery extends Query<EstadoDatoSolicitud> {

 /** 
 * Observable del estado completo del formulario de reciclaje.
 */
estadoFormulario$ = this.select();

/**
 * Constructor del query que inyecta el store correspondiente.
 * @param store - Store que contiene el estado del formulario de reciclaje.
 */
constructor(protected override store: DatoSolicitudStore) {
  super(store);
}

/**
 * Obtiene los valores actuales del formulario 'solicitudForm'.
 */
obtenerSolicitudForm$ = this.select(state => state.solicitudForm);

/**
 * Obtiene los valores actuales del formulario 'empresaReciclaje'.
 */
obtenerEmpresaReciclaje$ = this.select(state => state.empresaReciclaje);

/**
 * Obtiene los valores actuales del formulario 'lugarReciclaje'.
 */
obtenerLugarReciclaje$ = this.select(state => state.lugarReciclaje);

/**
 * Obtiene los valores actuales del formulario 'empresaTransportista'.
 */
obtenerEmpresaTransportista$ = this.select(state => state.empresaTransportista);

/**
 * Obtiene los valores actuales del formulario 'precaucionesManejo'.
 */
obtenerPrecaucionesManejo$ = this.select(state => state.precaucionesManejo);

}
