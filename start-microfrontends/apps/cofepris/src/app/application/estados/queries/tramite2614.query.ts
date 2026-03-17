import {
  Solicitud2614State,
  Tramite2614Store,
} from '../tramites/tramite2614.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

/**
 * Servicio para consultar el estado unificado del Tramite2614.
 * Proporciona selectores y consultas para ambos tipos de trámites (261401 y 261402).
 * 
 * @export
 * @class Tramite2614Query
 * @extends {Query<Solicitud2614State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite2614Query extends Query<Solicitud2614State> {
  /**
   * Observable para seleccionar el estado completo de la solicitud.
   * 
   * @type {Observable<Solicitud2614State>}
   * @memberof Tramite2614Query
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });

  /**
   * Observable para seleccionar las observaciones de la solicitud.
   * 
   * @type {Observable<string>}
   * @memberof Tramite2614Query
   */
  selectObservaciones$ = this.select(state => state.observaciones);

  /**
   * Observable para seleccionar los datos de destinatarios.
   * 
   * @type {Observable<any[]>}
   * @memberof Tramite2614Query
   */
  selectDestinatarioDatos$ = this.select(state => state.destinatarioDatos);

  /**
   * Observable para seleccionar la información de pago.
   * 
   * @type {Observable<object>}
   * @memberof Tramite2614Query
   */
  selectInfoPago$ = this.select(state => ({
    claveDeReferencia: state.claveDeReferencia,
    cadenaPagoDependencia: state.cadenaPagoDependencia,
    bancoClave: state.bancoClave,
    llaveDePago: state.llaveDePago,
    fecPago: state.fecPago,
    impPago: state.impPago,
  }));

  /**
   * Observable para seleccionar la información de la persona (para trámite 261401).
   * 
   * @type {Observable<object>}
   * @memberof Tramite2614Query
   */
  selectInfoPersona$ = this.select(state => ({
    tipoPersona: state.tipoPersona,
    nombre: state.nombre,
    primerApellido: state.primerApellido,
    segundoApellido: state.segundoApellido,
    denominacion: state.denominacion,
  }));

  /**
   * Observable para seleccionar la información de contacto y domicilio.
   * 
   * @type {Observable<object>}
   * @memberof Tramite2614Query
   */
  selectInfoContacto$ = this.select(state => ({
    pais: state.pais,
    estado: state.estado,
    domicilio: state.domicilio,
    calle: state.calle,
    numeroExterior: state.numeroExterior,
    numeroInterior: state.numeroInterior,
    codigopostal: state.codigopostal,
    correoElectronico: state.correoElectronico,
    lada: state.lada,
    telefono: state.telefono,
  }));

  /**
   * Crea una instancia de Tramite2614Query.
   * 
   * @param {Tramite2614Store} store - El store para consultar el estado.
   * @memberof Tramite2614Query
   */
  constructor(protected override store: Tramite2614Store) {
    super(store);
  }
}