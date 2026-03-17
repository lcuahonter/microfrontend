import { Catalogo, CatalogoServices, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/**
 * Servicio para la gestión de la asignación de expedición de certificados.
 * @description Este servicio se encarga de realizar las peticiones HTTP necesarias para obtener los catálogos y datos relacionados con la asignación de expedición de certificados.
 */
@Injectable({
  providedIn: 'root'
})

/**
 * Servicio para la gestión de la asignación de expedición de certificados.
 * @description Este servicio se encarga de realizar las peticiones HTTP necesarias para obtener los catálogos y datos relacionados con la asignación de expedición de certificados.
 */
export class ExpedicionCertificadosAsignacionService {
  /** Ruta base de la API */
  apiRoutes:string = 'https://api-v30.cloud-ultrasist.net/api';
/**
   * Constructor del servicio de catálogos.
   * @param http - Inyección del servicio HttpClient para realizar peticiones HTTP.
   * @description Este servicio se encarga de obtener los catálogos necesarios para el funcionamiento de la aplicación.
   */
  constructor(
    private http: HttpClient, private catalogoServices: CatalogoServices,public httpService:HttpCoreService
  ) { 
    // Constructor vacío

  }

  /**
   * Obtiene el catálogo de años de autorización.
   * @returns Un observable que emite la respuesta del catálogo de años de autorización.
   * @description Este método realiza una petición HTTP GET para obtener el catálogo de años de autorización desde un archivo JSON local.
   */
  getAniosAutorizacionCatalogo(tramite: string): Observable<Catalogo[]> {
     return this.catalogoServices.anosCatalogo(tramite).pipe(
          map(res => res?.datos ?? [])
        );
  }
  


  /**
   * Busca una asignación enviando una solicitud POST al endpoint de la API especificado.
   *
   * @param id - El identificador utilizado para construir la URL del endpoint de la API.
   * @param body - El payload de la solicitud como un objeto de pares clave-valor.
   * @returns Un Observable que emite la respuesta JSON de la API.
   */
  buscarAsignacion(id:string,body: Record<string, unknown>): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(`${this.apiRoutes}/sat-t${id}/solicitud/buscar`, { body: body });
  }



}
