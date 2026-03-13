import { RubroTransporteFerrovario32613State, Tramite32613Store } from '../../../../estados/tramites/tramite32613.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/** Decorador que marca el servicio como disponible en la raíz de la aplicación. */
@Injectable({
  providedIn: 'root'
})

export class RubroTransporteFerrovarioService {

  /**
 * @constructor
 * @description
 * Constructor del servicio  `RubroTransporteFerrovarioService`.
 * @param {HttpClient} http - Servicio de Angular para realizar solicitudes HTTP.
 * @param {Tramite32613Store} tramite32613Store - Store para manejar el estado del trámite 32613.
 */
  constructor(private http: HttpClient, private tramite32613Store: Tramite32613Store) {
    // Lógica de inicialización si es necesario
  }

  /**
 * @method getrubroTransporteFerrovarioData
 * @description
 * Obtiene los datos de la empresa para el trámite 120602 desde un archivo JSON local. 
 * @returns {Observable<RubroTransporteFerrovario32613State>} Observable con los datos de la empresa para el trámite.
 */
  getrubroTransporteFerrovarioData(): Observable<RubroTransporteFerrovario32613State> {
    return this.http.get<RubroTransporteFerrovario32613State>('assets/json/32613/rubro-transporte-ferrovario.json');
  }

  /**
 * @method actualizarEstadoFormulario
 * @description
 * Actualiza el valor de un campo específico en el store `Tramite32613Store` de manera dinámica.
 * @param {string} campo - Nombre del campo que se desea actualizar en el store.
 * @param {unknown} valor - Valor que se asignará al campo especificado.
 */
  actualizarEstadoFormulario(campo: string, valor: unknown): void {
    this.tramite32613Store.setDynamicFieldValue(campo, valor);
  }
}
