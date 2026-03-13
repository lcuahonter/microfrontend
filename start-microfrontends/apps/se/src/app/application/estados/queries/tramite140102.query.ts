import { Programa140102State, Tramite140102Store } from '../tramites/tramite140102.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';



/**
 * Clase que extiende de Query para manejar el estado de Programa140102.
 * Proporciona métodos y propiedades para seleccionar y observar cambios en el estado.
 * 
 * @template Programa140102State - Tipo genérico que representa el estado del programa.
 */
@Injectable({ 
  providedIn: 'root' 
})

export class Tramite140102Query extends Query<Programa140102State> {
  /**
   * Observable que selecciona el estado completo de la solicitud.
   * Permite suscribirse a los cambios en el estado completo del programa.
   * 
   * @type {Observable<Programa140102State>}
   */
  selectSolicitud$ = this.select((state) => {
    return state; // Devuelve el estado completo del programa.
  });

  /**
   * Constructor de la clase Tramite140102Query.
   * Inicializa la consulta con la tienda proporcionada.
   * 
   * @param {Tramite140102Store} store - Instancia de Tramite140102Store que contiene el estado.
   */
  constructor(protected override store: Tramite140102Store) {
    super(store); // Llama al constructor de la clase base Query con la tienda proporcionada.
  }
}
