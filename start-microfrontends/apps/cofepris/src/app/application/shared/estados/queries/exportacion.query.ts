import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
 
import { ExportacionStore } from '../stores/exportacion.store';
 
import { ExportacionState } from '../stores/exportacion.store';
 
/**
* class ExportacionQuery
* description Clase para realizar consultas sobre el estado del trámite 260604.
* Extiende la funcionalidad de Akita Query para seleccionar datos del estado.
*/
@Injectable({ providedIn: 'root' })
export class ExportacionQuery extends Query<ExportacionState> {
  /**
   * property selectSolicitud$
   * description Observable que selecciona el estado completo de la solicitud.
   */
  selectSolicitud$ = this.select((state) => {
    return state;
  });
 
  /**
   * constructor
   * description Constructor que inicializa la consulta con el almacén de trámites 260604.
   * param tramites260604 Inyección del almacén de trámites 260604.
   */
  constructor(private exportacionStore: ExportacionStore) {
    // Llama al constructor de la clase base Query con el almacén inyectado.
    super(exportacionStore);
  }
}