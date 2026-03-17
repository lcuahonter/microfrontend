import { RespuestaDatos, RespuestaTabla, RespuestaTablaCertificado } from '@libs/shared/data-access-user/src/core/models/110208/certificado.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

/**
 * Servicio para validar inicialmente los datos relacionados con el trámite 110208.
 */
@Injectable({
  providedIn: 'root'
})
export class ValidarInicalmenteService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes a recursos externos.
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   * @returns Un observable con la respuesta de los catálogos.
   */
  obtenerEstadoList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110208/seleccion.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   * @returns Un observable con la respuesta de los catálogos.
   */
  obtenerPaisList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110208/pais.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   * @returns Un observable con la respuesta de los catálogos.
   */
  obtenerUMCList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110208/umc.json');
  }

  /**
   * Obtiene la lista de estados desde un archivo JSON local.
   * @returns Un observable con la respuesta de los catálogos.
   */
  obtenerTipoDeFacturaList(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/110208/tipo-de-factura.json');
  }

  /**
   * Obtiene los datos del formulario desde un archivo JSON local.
   * @returns Un observable con los datos del formulario.
   */
  obtenerFormDatos(): Observable<RespuestaDatos> {
    return this.http.get<RespuestaDatos>('assets/json/110208/mercancia-datos.json');
  }

  /**
   * Obtiene los datos de la tabla de mercancías desde un archivo JSON local.
   * @returns Un observable con los datos de la tabla de mercancías.
   */
  obtenerTablaDatos(): Observable<RespuestaTabla> {
    return this.http.get<RespuestaTabla>('assets/json/110208/mercancias-tabla.json');
  }

  /**
   * Obtiene los datos de la tabla de certificados de origen desde un archivo JSON local.
   * @returns Un observable con los datos de la tabla de certificados.
   */
  obtenerTablaDatosCertificado(): Observable<RespuestaTablaCertificado> {
    return this.http.get<RespuestaTablaCertificado>('assets/json/110208/certificado-tabla.json');
  }
}