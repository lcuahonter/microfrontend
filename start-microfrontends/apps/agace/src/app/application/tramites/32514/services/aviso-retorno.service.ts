import { Solicitud32514State, Tramite32514Store } from '../state/Tramite32514.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar la obtención de datos relacionados con los catálogos del trámite 32514.
 */
@Injectable({
  providedIn: 'root'
})
export class AdaceService {
  /**
   * Constructor que inyecta el cliente HTTP y el store del trámite 32514,
   * utilizados para realizar peticiones y gestionar el estado del trámite.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes al backend.
   * @param {Tramite32514Store} store - Store que gestiona el estado del trámite 32514.
   */
  constructor(private http: HttpClient, private store: Tramite32514Store,) {
    // Constructor utilizado para la creación de objetos requeridos en el componente
  }

  /**
   * Obtiene los datos del catálogo de años.
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo` con los datos de los años.
   */
  obtenerDatosAno(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32514/ano.json');
  }

  /**
   * Obtiene los datos del catálogo de meses.
   * @returns Un observable que emite una lista de objetos de tipo `Catalogo` con los datos de los meses.
   */
  obtenerDatosMes(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/32514/mes.json');
  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   * 
   * @returns Observable con los datos del estado de la solicitud `Solicitud32514State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
  */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud32514State> {
    return this.http.get<Solicitud32514State>('assets/json/32514/datos.json');
  }

}