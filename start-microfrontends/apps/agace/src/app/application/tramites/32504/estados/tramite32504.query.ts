import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { T32504State } from '../models/aviso.model';
import { Tramite32504Store } from './tramite32504.store';

/**
 * @class Tramite32504Query
 * @description Consulta de estado para el trámite 32504. Permite seleccionar diferentes partes del estado relacionadas con el formulario del trámite.
 * @extends {Query<T32504State>}
 */
@Injectable({ providedIn: 'root' })
export class Tramite32504Query extends Query<T32504State> {
  /**
   * Observable que emite los datos de la empresa.
   * @type {Observable<any>}
   */
  selectDatosEmpresa$ = this.select((state) => {
    return state.datosEmpresa;
  });



  
  selectDomicilios$ = this.select((state) => {
    return state.direcciones;
  });

  /**
   * Observable que emite los datos del domicilio del lugar.
   * @type {Observable<any>}
   */
  selectDatosDomicilioLugar$ = this.select((state) => {
    return state.direcciones;
  });

  /**
   * Observable que emite el estado completo del formulario.
   * @type {Observable<FormularioGrupo>}
   */
  selectformulario$ = this.select((state) => {
    return state;
  });

  /**
   * Constructor de la clase Tramite32504Query.
   * @param {Tramite32504Store} store - Store que gestiona el estado del trámite 32504.
   */
  constructor(protected override store: Tramite32504Store) {
    super(store);
  }
}
