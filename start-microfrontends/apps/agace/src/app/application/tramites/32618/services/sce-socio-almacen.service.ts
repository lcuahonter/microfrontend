
import { RubroTransporteFerrovario32618State, Tramite32618Store } from '../estados/tramite32618.store';
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
 * 
 */
  constructor(private http: HttpClient, private tramite32618Store: Tramite32618Store) {
    // Lógica de inicialización si es necesario
  }

  /**
 * @method getrubroTransporteFerrovarioData
 * @description
 * Obtiene los datos de la empresa para el trámite 120602 desde un archivo JSON local. 
 * @returns {Observable<RubroTransporteFerrovario32618State>} Observable con los datos de la empresa para el trámite.
 */
  getrubroTransporteFerrovarioData(): Observable<RubroTransporteFerrovario32618State> {
    return this.http.get<RubroTransporteFerrovario32618State>('assets/json/32613/rubro-transporte-ferrovario.json');
  }

  /**
 * @method actualizarEstadoFormulario
 * @description
 * Actualiza el valor de un campo específico en el store `Tramite32613Store` de manera dinámica.
 * @param {string} campo - Nombre del campo que se desea actualizar en el store.
 * @param {unknown} valor - Valor que se asignará al campo especificado.
 */
  actualizarEstadoFormulario(campo: string, valor: unknown): void {
    this.tramite32618Store.setDynamicFieldValue(campo, valor);
  }
}
