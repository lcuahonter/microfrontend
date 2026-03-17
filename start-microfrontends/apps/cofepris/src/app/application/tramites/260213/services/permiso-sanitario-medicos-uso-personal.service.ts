import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260213State } from '../estados/tramite260213Store.store';

/**
 * @service PermisoSanitarioMedicosUsoPersonalService
 * @description
 * Servicio de Angular para gestionar las solicitudes relacionadas con el trámite 260213.
 * Este servicio realiza peticiones HTTP para obtener datos relacionados con el permiso sanitario
 * de dispositivos médicos para uso personal.
 *
 * @providedIn root
 * Este servicio está disponible en toda la aplicación a través del inyector raíz.
 */
@Injectable({
  providedIn: 'root'
})
export class PermisoSanitarioMedicosUsoPersonalService {

  /**
   * Creates an instance of the service.
   * 
   * @param http - The Angular HttpClient used to perform HTTP requests.
   */
  constructor( private readonly http: HttpClient) { }

  /**
  * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
  * 
  * @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
  *          cargados desde el archivo JSON especificado en la ruta de `assets`.
  */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260213State> {
    return this.http.get<Tramite260213State>('assets/json/260213/respuestaDeActualizacionDe.json');
  }
}
