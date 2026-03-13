import { AccesosTabla } from '../models/tecnologicos.model';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar la obtención de datos tecnológicos.
 * Este servicio realiza solicitudes HTTP para obtener datos de catálogos relacionados con el trámite 324.
 */
@Injectable({
  providedIn: 'root',
})
export class TecnologicosService {
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a los recursos.
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtiene los datos del catálogo de "Aduana".
   * @returns Un observable con la lista de opciones del catálogo de aduanas.
   */
  obtenerDatosAduana(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/324/aduana.json');
  }

  /**
   * Obtiene los datos del catálogo de "Rol".
   * @returns Un observable con la lista de opciones del catálogo de roles.
   */
  obtenerDatosRol(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/324/rol.json');
  }

  /**
   * Obtiene los datos del catálogo de "Sistema".
   * @returns Un observable con la lista de opciones del catálogo de sistemas.
   */
  obtenerDatosSistema(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/324/sistema.json');
  }

  /**
   * Obtiene los datos del catálogo de "Tipo Movimiento".
   * @returns Un observable con la lista de opciones del catálogo de tipos de movimiento.
   */
  obtenerDatosTipoMovimiento(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/324/tipo-movimiento.json');
  }

  /**
   * Obtiene el estado de la petición tecnológica.
   * @returns Un observable con la lista de accesos tecnológicos.
   */
  obtenerTecnologicos(): Observable<AccesosTabla[]> {
    return this.http.get<AccesosTabla[]>('assets/json/324/tecnologicos.json');
  }
}