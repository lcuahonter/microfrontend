import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { RespuestaConsulta } from '../estados/models/exencion-impuestos.model';

/**
 * Servicio para gestionar las operaciones relacionadas con la Junta Técnica de Registro.
 * 
 * Este servicio proporciona métodos para interactuar con los datos de catálogos
 * relacionados con la Junta Técnica de Registro.
 * 
 * @example
 * // Ejemplo de uso:
 * constructor(private juntaTecnicaRegistroService: JuntaTecnicaRegistroService) {}
 * 
 * this.juntaTecnicaRegistroService.getOptionLista('transporte')
 *   .subscribe((respuesta) => {
 *     console.log(respuesta);
 *   });
 * 
 * @providedIn 'root' - Este servicio está disponible en toda la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class JuntaTecnicaRegistroService {

  constructor(
    private http: HttpClient,
  ) { }

    /**
     * Obtener una lista de Transporte
     * 
     * @param {string} catalogo - El nombre del catálogo a obtener.
     * @returns {Observable<RespuestaCatalogos>} Un observable con la respuesta del catálogo de transporte.
     */
    getOptionLista(catalogo: string): Observable<RespuestaCatalogos> {
      return this.http.get<RespuestaCatalogos>(`assets/json/6201/${catalogo}.json`);
    }

    /**
     * Obtiene los datos para la consulta del trámite.
     * @returns {Observable<RespuestaConsulta>} Observable con los datos de consulta.
     */
    getDatosConsulta(): Observable<RespuestaConsulta> {
      return this.http.get<RespuestaConsulta>('assets/json/6102/consulta_6102.json');
    }
}
