import { Programa140101State, Tramite140101Store } from '../tramites/tramite140101.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';



/**
 * Clase que extiende de Query para manejar el estado de Programa140101.
 * Proporciona métodos y propiedades para seleccionar y observar cambios en el estado.
 * 
 * @template Programa140101State - Tipo genérico que representa el estado del programa.
 */
@Injectable({ 
  providedIn: 'root' 
})

export class Tramite140101Query extends Query<Programa140101State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite suscribirse a los cambios en el estado completo del programa.
   * 
   * @type {Observable<Programa140101State>}
   */
  selectSolicitud$ = this.select((state) => {
    return state; // Devuelve el estado completo del programa.
  });

  /**
   * Constructor de la clase Tramite140101Query.
   * Inicializa la consulta con la tienda proporcionada.
   * 
   * @param {Tramite140101Store} store - Instancia de Tramite140101Store que contiene el estado.
   */
  constructor(protected override store: Tramite140101Store) {
    super(store); // Llama al constructor de la clase base Query con la tienda proporcionada.
  }
}
