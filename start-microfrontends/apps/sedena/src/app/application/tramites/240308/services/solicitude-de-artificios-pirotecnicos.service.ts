/**
 * Servicio para gestionar la solicitud de artificios pirotécnicos.
 * Este servicio se encarga de obtener los datos del trámite desde un archivo JSON
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Tramite240308State, Tramite240308Store } from '../estados/tramite240308Store.store';
import { Observable } from 'rxjs';

/**
 * ExportadorAutorizadoService
 */
@Injectable({
  providedIn: 'root'
})
/**
 * Servicio para gestionar la obtención y actualización de datos de exportadores autorizados.
 *
 * @export
 * @class ExportadorAutorizadoService
 */
export class SolicitudeDeArtificiosPirotecnicosService {
  /**
   * Constructor del servicio.
   * @param {HttpClient} http - Servicio HTTP para realizar solicitudes al servidor.
   * @param {Tramite110102Store} estadoTramite - Servicio para manejar el estado global del trámite.
   */
  constructor(
    private http: HttpClient,
    private estadoTramite: Tramite240308Store
  ) {}

  /**
   * Obtiene los datos del trámite desde un archivo JSON local.
   * @returns {Observable<Tramite240308State>} Observable con los datos del trámite.
   */
  obtenerDatos(): Observable<Tramite240308State> {
    return this.http.get<Tramite240308State>('./assets/json/240308/datos.json');
  }

  /**
   * Establece los datos de la solicitud en el estado global del trámite.
   * @param {Tramite240308State} datos - Datos del trámite a establecer.
   */
  establecerDatosDeLaSolicitud(datos: Tramite240308State): void {
    this.estadoTramite.updateDatosDelTramiteFormState(datos.datosDelTramite);
    this.estadoTramite.updateDestinatarioFinalTablaDatos(datos.destinatarioFinalTablaDatos);
    this.estadoTramite.updateJustificacionFormulario(datos.justificacionTramiteFormState);
    this.estadoTramite.updateMercanciaTablaDatos(datos.merccancialTablaDatos);
    this.estadoTramite.updatePagoDerechosFormState(datos.pagoDerechos);
    this.estadoTramite.updateProveedorTablaDatos(datos.proveedorTablaDatos);
  }
}