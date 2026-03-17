import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Catalogo } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';

import { DomicilioNotificacion } from '../models/cancelacions.model';

import { CancelacionDeAutorizaciones } from '../models/cancelacions.model'

/**
 * @description
 * Servicio para manejar las cancelaciones de autorizaciones 140201.
 * Este servicio proporciona métodos para obtener datos relacionados con las cancelaciones.
 */
@Injectable({
  providedIn: 'root',
})
export class CancelacionesService {
  /**
   * @ignore
   */
  constructor(private http: HttpClient) {
    //constructor
  }

  /**
   * Obtiene las entidades desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable con la lista de entidades.
   */
  getEntidades(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/140201/entidad140201.json');
  }

  /**
   * Obtiene las colonias desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable con la lista de colonias.
   */
  getColonia(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/140201/colonia140201.json');
  }

  /**
   * Obtiene los municipios desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable con la lista de municipios.
   */
  getmunicipio(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/140201/municipio140201.json');
  }

  /**
   * Obtiene las localidades desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Un observable con la lista de localidades.
   */
  getLocalidad(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/140201/localidad140201.json');
  }
  /**
   * Obtiene la información de notificación de domicilio desde un archivo JSON.
   * @returns {Observable<DomicilioNotificacion>} Un observable con la información de notificación de domicilio.
   */
  getInfo(): Observable<DomicilioNotificacion> {
    return this.http.get<DomicilioNotificacion>(
      'assets/json/140201/notificacionsInfo.json'
    );
  }


  /**
   * Obtiene los datos de cancelación de autorizaciones desde un archivo JSON.
   * @returns {Observable<CancelacionDeAutorizaciones[]>} Un observable con la lista de cancelaciones de autorizaciones.
   */
  getCancelacionDeAutorizaciones(): Observable<CancelacionDeAutorizaciones[]> {
    return this.http.get<CancelacionDeAutorizaciones[]>('assets/json/140201/cancelacion-de-autorizaciones-140201.json');
  }
}
