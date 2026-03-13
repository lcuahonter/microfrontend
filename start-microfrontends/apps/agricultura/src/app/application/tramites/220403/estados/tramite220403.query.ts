import { FormularioGrupo } from '../models/acuicola.module';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Tramite220403Store } from './tramite220403.store';

/**
 * Tramite query
 *
 * @export
 * @class TramiteQuery
 * @extends {Query<FormularioGrupo>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite220403Query extends Query<FormularioGrupo> {
    /**
   * @property {Observable<any>} setDatosRealizar$
   * @description
   * Observable que emite los datos relacionados con la sección "Realizar" del formulario.
   */
  setDatosRealizar$ = this.select((state) => {
    return state.datosRealizar;
  });

  /**
   * @property {Observable<any>} setCombinacionRequerida$
   * @description
   * Observable que emite la información sobre la combinación requerida en el trámite.
   */
  setCombinacionRequerida$ = this.select((state) => {
    return state.combinacionRequerida;
  });

  /**
   * @property {Observable<any>} setTransporte$
   * @description
   * Observable que emite los datos relacionados con el transporte en el trámite.
   */
  setTransporte$ = this.select((state) => {
   return state.transporte;
  })

  /**
   * @property {Observable<any>} setPagoDerechos$
   * @description
   * Observable que emite la información sobre el pago de derechos en el trámite.
   */
  setPagoDerechos$ = this.select((state) => {
    return state.pagoDerechos;
  });

  /**
   * @property {Observable<any>} setTercerosRelacionados$
   * @description
   * Observable que emite los datos de los terceros relacionados en el trámite.
   */
  setTercerosRelacionados$ = this.select((state) => {
    return state.tercerosRelacionados;
  });

  /**
   * @property {Observable<FormularioGrupo>} selectTramite$
   * @description
   * Observable que emite el estado completo del trámite.
   */
  selectTramite$ = this.select((state) => {
    return state;
  });

  /**
   * @constructor
   * @description
   * Inicializa la query con el store correspondiente.
   * @param store {Tramite220403Store} - Instancia del store asociado.
   */
  constructor(protected override store: Tramite220403Store) {
    super(store);
  }
  
}