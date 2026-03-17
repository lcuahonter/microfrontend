import { Acuicultura } from "../models/220203/importacion-de-acuicultura.module";
import { AcuiculturaStore } from "./220203/sanidad-certificado.store";
import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";

/**
 * @fileoverview
 * Query Akita para la gestión y selección reactiva del estado de importación de acuicultura 220203.
 * Permite observar el estado completo y partes específicas como terceros relacionados, mercancía y selecciones activas.
 * Cobertura de documentación completa: cada clase, método, propiedad y selector está documentado en español.
 * @module AcuiculturaQuery
 */

/**
 * Query Akita para la gestión y selección reactiva del estado del trámite de importación de acuicultura 220203.
 * Proporciona selectores observables para diferentes partes del estado de la aplicación.
 * Permite a los componentes suscribirse a cambios específicos en el estado global.
 * 
 * @class AcuiculturaQuery
 * @extends {Query<Acuicultura>}
 * @memberof AcuiculturaQuery
 */
@Injectable({ providedIn: 'root' })
export class AcuiculturaQuery extends Query<Acuicultura> {

  /**
   * Constructor de la query AcuiculturaQuery.
   * Inyecta el store de acuicultura y lo pasa a la clase base Query de Akita.
   * Establece la conexión entre el query y el store para observar cambios de estado.
   * 
   * @constructor
   * @param {AcuiculturaStore} store - Store Akita de acuicultura para gestión del estado
   * @memberof AcuiculturaQuery
   */
  constructor(protected override store: AcuiculturaStore) {
    super(store);
  }

  /**
   * Observable que emite el estado completo de acuicultura.
   * Proporciona acceso reactivo a toda la información del trámite de importación.
   * Utilizado cuando se necesita observar cambios en cualquier parte del estado.
   * 
   * @public
   * @readonly
   * @type {Observable<Acuicultura>}
   * @memberof AcuiculturaQuery
   */
  seleccionarTodo$ = this.select();

  /**
   * Observable que emite la lista de terceros relacionados del estado.
   * Proporciona acceso reactivo específicamente a los terceros asociados al trámite.
   * Utilizado en componentes que gestionan destinatarios e importadores.
   * 
   * @public
   * @readonly
   * @type {Observable<TercerosrelacionadosdestinoTable[]>}
   * @memberof AcuiculturaQuery
   */
  seleccionarTercerosRelacionados$ = this.select(estado => estado.tercerosRelacionados);
  
  /**
   * Observable que emite el grupo de mercancía del estado.
   * Proporciona acceso reactivo a las filas de mercancía capturadas en el formulario.
   * Utilizado en componentes que muestran y editan información de productos.
   * 
   * @public
   * @readonly
   * @type {Observable<Fila[]>}
   * @memberof AcuiculturaQuery
   */
  seleccionaraMercanciaGroup$ = this.select(estado => estado.mercanciaGroup);

  /**
   * Observable que emite el tercero relacionado actualmente seleccionado.
   * Proporciona acceso reactivo al tercero que está siendo editado o visualizado.
   * Utilizado en modales y formularios para mostrar datos del tercero seleccionado.
   * 
   * @public
   * @readonly
   * @type {Observable<TercerosrelacionadosdestinoTable>}
   * @memberof AcuiculturaQuery
   */
  seleccionarTerceros$ = this.select(estado => estado.selectedTerceros);



}