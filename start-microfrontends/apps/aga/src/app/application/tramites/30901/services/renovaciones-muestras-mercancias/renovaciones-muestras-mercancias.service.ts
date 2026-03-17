import { HttpClient } from '@angular/common/http';
import { ImportanteCatalogoSeleccion } from '../../models/registro-muestras-mercancias.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para manejar las renovaciones de muestras de mercancías.
 * 
 * @remarks
 * Este servicio proporciona métodos para interactuar con la API relacionada con las renovaciones de muestras de mercancías.
 */
@Injectable({
  providedIn: 'root',
})
export class RenovacionesMuestrasMercanciasService {

  /**
   * Constructor del servicio RenovacionesMuestrasMercanciasService.
   * 
   * @param httpClient - Cliente HTTP inyectado para realizar solicitudes HTTP.
   */
  constructor(private httpClient: HttpClient) {
       // Si es necesario, se puede agregar aquí la lógica de inicialización
  }

  /**
   * Obtiene las opciones desplegables desde un archivo JSON.
   *
   * @returns {Observable<ImportanteCatalogoSeleccion>} Un observable que emite el catálogo de opciones desplegables.
   */
  obtenerOpcionesDesplegables(): Observable<ImportanteCatalogoSeleccion> {
    return this.httpClient.get<ImportanteCatalogoSeleccion>('assets/json/30901/registro-muestras-mercancias.json');
  }

}
