
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Solicitud80301State } from './tramite80301.store';
import { Tramite80301Store } from './tramite80301.store';

/**
 * Servicio inyectable para consultar el estado del trámite 80301.
 */
@Injectable({ providedIn: 'root' })
/**
 * Clase de consulta para el trámite 80301.
 * @class Tramite80301Query
 */
export class Tramite80301Query extends Query<Solicitud80301State> {
   
   /**
    * Constructor de la clase Tramite80301Query.
    * @param store Instancia del Tramite80301Store para acceder al estado.
    * @constructor
    */
   constructor(
     protected override store: Tramite80301Store) {
     super(store);
   }   
  
   /**
    * Selector para obtener el estado completo de la solicitud del trámite 80301.
    * @returns {Solicitud80301State} El estado completo de la solicitud.
    */
   selectSolicitud$ = this.select((state) => {
     return state;
   });
}