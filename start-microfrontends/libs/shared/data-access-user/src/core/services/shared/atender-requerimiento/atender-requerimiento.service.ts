/**
 * Servicio para atender requerimientos y obtener información relacionada.
 *
 * Este servicio proporciona métodos para consultar los requisitos de un requerimiento
 * a través de peticiones HTTP.
 *
 * @author Tu Nombre
 * @since 1.0.0
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interfaz que representa la respuesta de un requerimiento.
 *
 * @property {number} code - Código de respuesta del requerimiento.
 * @property {string} message - Mensaje descriptivo de la respuesta.
 * @property {Requisitos} data - Objeto con los datos de los requisitos del requerimiento.
 */
export interface Requerimiento {
  code:number;
  message:string;
  data:Requisitos;
}

/**
 * Interfaz que representa los datos de los requisitos de un requerimiento.
 *
 * @property {string} fechaRequerimiento - Fecha en la que se realizó el requerimiento.
 * @property {string} justificacionRequerimiento - Justificación del requerimiento.
 */
export interface Requisitos {
  fechaRequerimiento: string;
  justificacionRequerimiento:string;
}

@Injectable({
  providedIn: 'root'
})

/**
   * Constructor del servicio.
   * @param http Cliente HTTP inyectado para realizar peticiones.
   */

export class AtenderRequerimientoService {

    constructor(private http: HttpClient) {
      // El constructor se utiliza para la inyección de dependencias.
    }


    /**
 * Obtiene la información de los requisitos de un requerimiento.
 *
 * Realiza una petición HTTP GET para obtener los datos de requisitos desde un archivo JSON local.
 *
 * @returns {Observable<Requerimiento>} Un observable que emite la información del requerimiento.
 *
 * @example
 * this.atenderRequerimientoService.informacionRequisitos().subscribe((resp) => {
 *   console.log(resp.data.fechaRequerimiento);
 * });
 */
public informacionRequisitos():Observable<Requerimiento> {
  return this.http.get<Requerimiento>('./assets/json/shared/informacion-requisitos.json');
}

}
