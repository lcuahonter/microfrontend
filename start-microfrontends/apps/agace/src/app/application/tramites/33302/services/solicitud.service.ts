/**
 * @fileoverview
 * Este archivo define el servicio `Solicitud32301Service`, que proporciona métodos para gestionar
 * los datos relacionados con el trámite 32301. Incluye operaciones para obtener datos simulados
 * desde archivos JSON, actualizar el estado del formulario en el store, y manejar listas de bancos.
 * 
 * @module Solicitud32301Service
 * @description
 * Este archivo contiene la implementación del servicio `Solicitud32301Service`, que interactúa con
 * el store y realiza solicitudes HTTP para manejar los datos del trámite 32301.
 */

import { Observable, catchError, of } from 'rxjs';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogoResponse } from '@ng-mf/data-access-user';
import { DatosPrevios } from '../models/avisomodify.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite33302Store } from '../estados/tramite33302.store';

/**
 * @class Solicitud32301Service
 * @description
 * Servicio que gestiona los datos relacionados con el trámite 32301.
 * Proporciona métodos para obtener datos simulados desde archivos JSON, actualizar el estado
 * del formulario en el store, y manejar listas de bancos.
 */
@Injectable({
  providedIn: 'root',
})
export class Solicitud32301Service {
  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private readonly jsonUrl: string = 'assets/json/32301';

  /**
   * Nombre del archivo JSON que contiene los datos del tipo de aviso.
   * @private
   * @type {string}
   */
  private readonly fileName: string = 'tipoDeAviso.json';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   * @param {Tramite33302Store} tramite33302Store - Store para gestionar el estado del trámite 32301.
   */
  constructor(
    private readonly http: HttpClient,
    private readonly tramite33302Store: Tramite33302Store
  ) {}

  /**
   * Obtiene los datos simulados para el tipo de aviso.
   * 
   * Realiza una solicitud HTTP GET para recuperar los datos desde un archivo JSON local.
   * 
   * @returns {Observable<CatalogoResponse>} Observable que emite los datos del tipo de aviso.
   */
  getAvisoModify(): Observable<CatalogoResponse> {
    return this.http
      .get<CatalogoResponse>(`${this.jsonUrl}/${this.fileName}`)
      .pipe(
        catchError(() => {
          // Retorna un objeto por defecto en caso de error para evitar que la aplicación falle.
          return of({
            id: 0,
            descripcion: '',
            code: 0,
            data: [],
            message: 'Respuesta por defecto debido a un error',
          } as unknown as CatalogoResponse);
        })
      );
  }

  /**
   * Actualiza el estado del formulario en el store `tramite33302Store`.
   * 
   * Este método asigna cada propiedad del estado recibido a su correspondiente
   * método setter en el store, asegurando que el estado del trámite 32301 esté sincronizado.
   * 
   * @param {DatosPrevios} DATOS - Objeto que contiene toda la información del formulario.
   */
  actualizarEstadoFormulario(DATOS: DatosPrevios): void {
    this.tramite33302Store.actualizarEstado({cadenaDependencia:DATOS.cadenaDependencia});
    this.tramite33302Store.actualizarEstado({claveDeReferencia:DATOS.claveDeReferencia});
    this.tramite33302Store.actualizarEstado({banco:DATOS.banco});
    this.tramite33302Store.actualizarEstado({llaveDePago:DATOS.llaveDePago});
    this.tramite33302Store.actualizarEstado({fechaDePago:DATOS.fechaDePago});
    this.tramite33302Store.actualizarEstado({importeDePago:DATOS.importeDePago});
    this.tramite33302Store.actualizarEstado({numeroDe:DATOS.numeroDe});
    this.tramite33302Store.actualizarEstado({foreignClientsSuppliers:DATOS.foreignClientsSuppliers});
    this.tramite33302Store.actualizarEstado({nationalSuppliers:DATOS.nationalSuppliers});
    this.tramite33302Store.actualizarEstado({modificationsMembers:DATOS.modificationsMembers});
    this.tramite33302Store.actualizarEstado({changesToLegalDocuments:DATOS.changesToLegalDocuments});
    this.tramite33302Store.actualizarEstado({mergerOrSplitNotice:DATOS.mergerOrSplitNotice});
    this.tramite33302Store.actualizarEstado({additionFractions:DATOS.additionFractions});
    this.tramite33302Store.actualizarEstado({contratados:DATOS.contratados});
    this.tramite33302Store.actualizarEstado({expirado:DATOS.expirado});
    this.tramite33302Store.actualizarEstado({derechos:DATOS.derechos});
    this.tramite33302Store.actualizarEstado({acepto253:DATOS.acepto253});
    this.tramite33302Store.actualizarEstado({presenten:DATOS.presenten});

  }

  /**
   * Obtiene los datos del registro de toma de muestras de mercancías.
   * 
   * Realiza una solicitud HTTP GET para recuperar un archivo JSON local
   * que contiene la estructura del estado inicial del trámite 32301.
   * 
   * @returns {Observable<DatosPrevios>} Observable que emite los datos del formulario.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<DatosPrevios> {
    return this.http.get<DatosPrevios>('assets/json/33302/datos-previos.json');
  }

  /**
   * Obtiene la lista de bancos desde un archivo JSON local.
   * 
   * Realiza una solicitud HTTP GET para recuperar los datos de la lista de bancos.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite la lista de bancos.
   */
  onBancoList(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/33302/banco-list.json');
  }
}