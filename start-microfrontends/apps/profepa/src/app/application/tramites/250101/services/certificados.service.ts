import { CertificadosFilaTableDatos, CertificadosFitoFilaTableDatos, CertificadosTablaDatos, PermisosCertificadosFitoFilaTableDatos } from '../models/flora-fauna.models';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de obtener los datos de los certificados desde archivos JSON locales.
 * Este servicio realiza peticiones HTTP para cargar los datos necesarios para mostrar en las tablas.
 */
@Injectable({
  providedIn: 'root' // Indica que este servicio está disponible a nivel global en la aplicación.
})
export class CertificadosService {

  /**
   * Constructor del servicio. Recibe una instancia de HttpClient para realizar peticiones HTTP.
   * 
   * @param http Instancia de HttpClient para realizar las peticiones.
   */
  constructor(private http: HttpClient) { 
    //
  }

  /**
   * Método que obtiene los datos de los encabezados de la tabla de certificados fitosanitarios.
   * Realiza una petición GET al archivo JSON 'certificados-fitosanitorios.json'.
   * 
   * @returns {Observable<CertificadosTablaDatos>} Observable con los datos de los encabezados de la tabla de certificados fitosanitarios.
   */
  getFitosanitoriosEncabezadoDeTabla(): Observable<CertificadosTablaDatos> {
    return this.http.get<CertificadosTablaDatos>('assets/json/250101/certificados-fitosanitorios.json');
  }

  /**
   * Método que obtiene los datos de los permisos de los certificados desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'permisos-certificados.json'.
   * 
   * @returns {Observable<CertificadosTablaDatos>} Observable con los datos de los permisos de los certificados.
   */
  getPermisoCertificadosDeTabla(): Observable<CertificadosTablaDatos> {
    return this.http.get<CertificadosTablaDatos>('assets/json/250101/permisos-certificados.json');
  }

  /**
   * Método que obtiene los datos de los certificados desde un archivo JSON.
   * Realiza una petición GET al archivo JSON 'certificados.json'.
   * 
   * @returns {Observable<CertificadosTablaDatos>} Observable con los datos de los certificados.
   */
  getCertificadosDeTabla(): Observable<CertificadosTablaDatos> {
    return this.http.get<CertificadosTablaDatos>('assets/json/250101/certificados.json');
  }

/**
 * Obtiene los datos de una fila de certificados desde un archivo JSON.
 *
 * @returns Un Observable con los datos de tipo `CertificadosFilaTableDatos`.
 */
getCertificadosFilaDeTabla(): Observable<CertificadosFilaTableDatos> {
  return this.http.get<CertificadosFilaTableDatos>('assets/json/250101/certificado-row.json');
}

/**
 * Obtiene los datos de una fila de certificados fitosanitarios desde un archivo JSON.
 *
 * @returns Un Observable con los datos de tipo `CertificadosFitoFilaTableDatos`.
 */
getCertificadosFitoFilaDeTabla(): Observable<CertificadosFitoFilaTableDatos> {
  return this.http.get<CertificadosFitoFilaTableDatos>('assets/json/250101/certificados-fito-row.json');
}

/**
 * Obtiene los datos de permisos relacionados con certificados fitosanitarios desde un archivo JSON.
 *
 * @returns Un Observable con los datos de tipo `PermisosCertificadosFitoFilaTableDatos`.
 */
getPermisoCertificadosFilaDeTabla(): Observable<PermisosCertificadosFitoFilaTableDatos> {
  return this.http.get<PermisosCertificadosFitoFilaTableDatos>('assets/json/250101/permisos-certificados-row.json');
}

}