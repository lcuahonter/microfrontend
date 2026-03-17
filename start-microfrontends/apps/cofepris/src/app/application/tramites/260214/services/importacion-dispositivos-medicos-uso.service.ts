import {
  Destinatario,
  Fabricante,
  Facturador,
  Proveedor,
} from '../../../shared/models/terceros-relacionados.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite260214State } from '../estados/tramite260214Store.store';

/**
 * @service
 * @name ImportacionDispositivosMedicosUsoService
 * @description
 * Servicio que proporciona métodos para realizar solicitudes HTTP relacionadas con el trámite 260214.
 * Permite obtener datos desde un archivo JSON para simular la respuesta de una API.
 *
 * @decorator Injectable
 * Marca la clase como un servicio inyectable en Angular.
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionDispositivosMedicosUsoService {
  /**
   * Creates an instance of ImportacionDispositivosMedicosUsoService.
   *
   * @param http - The Angular HttpClient used to perform HTTP requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías desde un archivo JSON.
   *
   * @returns Observable con los datos del estado de la solicitud `Solicitud230401State`,
   *          cargados desde el archivo JSON especificado en la ruta de `assets`.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<Tramite260214State> {
    return this.http.get<Tramite260214State>(
      'assets/json/260214/respuestaDeActualizacionDe.json'
    );
  }

  /**
   * Obtiene los datos de la tabla de fabricantes como destinatarios desde un archivo JSON local.
   *
   * @returns {Observable<Destinatario[]>} Observable que emite un arreglo de objetos `Destinatario`.
   * @description Este método realiza una petición HTTP para obtener los datos de la tabla de fabricantes como destinatarios.
   */
  getFabricanteTablaDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/260214/fabricante.json');
  }

  /**
   * @description
   * Obtiene la lista de destinatarios desde un archivo JSON local.
   *
   * @returns {Observable<Destinatario[]>} Un observable que emite un arreglo de destinatarios.
   *
   * @example
   * this.miServicio.getDestinatarioTablaDatos().subscribe((data) => {
   *   console.log(data);
   * });
   */
  getDestinatarioTablaDatos(): Observable<Destinatario[]> {
    return this.http.get<Destinatario[]>(
      'assets/json/260214/destinatario-final.json'
    );
  }

  /**
   * @description
   * Obtiene la lista de proveedores desde un archivo JSON local.
   *
   * @returns {Observable<Proveedor[]>} Un observable que emite un arreglo de proveedores.
   *
   * @example
   * this.miServicio.getProveedorTablaDatos().subscribe((data) => {
   *   console.log(data);
   * });
   */
  getProveedorTablaDatos(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>('assets/json/260214/proveedor.json');
  }

  /**
   * @description
   * Obtiene la lista de facturadores desde un archivo JSON local.
   *
   * @returns {Observable<Facturador[]>} Un observable que emite un arreglo de facturadores.
   *
   * @example
   * this.miServicio.getFacturadorTablaDatos().subscribe((data) => {
   *   console.log(data);
   * });
   */
  getFacturadorTablaDatos(): Observable<Facturador[]> {
    return this.http.get<Facturador[]>('assets/json/260214/facturador.json');
  }
}
