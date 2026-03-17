import { Tramite250103State, Tramite250103Store } from '../estados/tramite250103.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de obtener los datos relacionados con aduanas, inspectorías y alcaldías
 * desde archivos JSON locales. Este servicio realiza peticiones HTTP para cargar los datos necesarios
 * para el manejo de tipo de movimiento en la aplicación.
 */
@Injectable({
  providedIn: 'root', // Indica que este servicio está disponible a nivel global en la aplicación.
})
export class TipoMovimientoService {
  
  /**
   * Constructor del servicio. Recibe una instancia de HttpClient para realizar peticiones HTTP.
   * 
   * @param http Instancia de HttpClient para realizar las peticiones.
   */
  constructor(private http: HttpClient, private tramite250103Store:Tramite250103Store) {
    //
  }

  /**
   * Método que obtiene los datos de aduanas desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'aduana.json'.
   * 
   * @returns {Observable<Catalogo[]>} Observable con la lista de aduanas.
   */
  obtenerAduanaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250103/aduana.json');
  }

  /**
   * Método que obtiene los datos de inspectorías desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'inspectoria-profepa.json'.
   * 
   * @returns {Observable<Catalogo[]>} Observable con la lista de inspectorías.
   */
  obtenerInspectoriaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250103/inspectoria-profepa.json');
  }

  /**
   * Método que obtiene los datos de alcaldías desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'municipio-alcaldia.json'.
   * 
   * @returns {Observable<Catalogo[]>} Observable con la lista de alcaldías.
   */
  obtenerAlcaldíaData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/250103/municipio-alcaldia.json');
  }

  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite250103State): void {
    this.tramite250103Store.actualizarEstado(DATOS);
  }

  /**
  * Obtiene los datos de la solicitud.
  * @returns Observable con los datos de la solicitud.
  */
  getTipoMovimiento(): Observable<Tramite250103State> {
      return this.http.get<Tramite250103State>('assets/json/250103/tipo-movimiento.json');
  }
}
