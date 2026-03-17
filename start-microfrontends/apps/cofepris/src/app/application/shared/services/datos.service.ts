import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo } from '@libs/shared/data-access-user/src';
import { DatosProducto } from '../models/datos-modificacion.model';
import { PreOperativo } from '../models/datos-modificacion.model';
import { ScianData } from '../models/datos-modificacion.model';


/**
 * Servicio que proporciona métodos para obtener datos relacionados con la solicitud 260603.
 */
@Injectable({
  providedIn: 'root'
})
export class DatosService {

  /**
   * Constructor del servicio `DatosService`.
   * @param http Cliente HTTP para realizar solicitudes a los archivos JSON.
   */
  constructor(private http: HttpClient) {
    //constructor
  }

  /**
   * Obtiene los datos de los estados desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `Catalogo` con los datos de los estados.
   */
  obtenerEstadoData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260603/estado.json');
  }

  /**
   * Obtiene los datos de la tabla SCIAN desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `ScianData` con los datos de la tabla SCIAN.
   */
  obternerDatosData(): Observable<ScianData[]> {
    return this.http.get<ScianData[]>('assets/json/260603/datos-scian-tabla.json');
  }

  /**
   * Obtiene las claves SCIAN desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `Catalogo` con las claves SCIAN.
   */
  obtenerClaveScian(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260603/clave-scian.json');
  }

  /**
   * Obtiene las descripciones SCIAN desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `Catalogo` con las descripciones SCIAN.
   */
  obtenerDescripcionScian(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260603/descripcion-scian.json');
  }

  /**
   * Obtiene las opciones preoperativas desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `PreOperativo` con las opciones preoperativas.
   */
  obtenerPreOperativo(): Observable<PreOperativo[]> {
    return this.http.get<PreOperativo[]>('assets/json/260603/pre-operativo.json');
  }

  /**
   * Obtiene los datos de los productos desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `DatosProducto` con los datos de los productos.
   */
  obtenerDatosProducto(): Observable<DatosProducto[]> {
    return this.http.get<DatosProducto[]>('assets/json/260603/datos-producto.json');
  }

  /**
   * Obtiene las clasificaciones de productos desde un archivo JSON.
   * @returns Un observable que emite una lista de objetos `Catalogo` con las clasificaciones de productos.
   */
  obtenerClasificationProductos(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260603/clasificacion-producto.json');
  }
}