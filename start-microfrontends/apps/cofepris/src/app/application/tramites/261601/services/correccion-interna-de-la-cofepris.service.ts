
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TramitesAsociados } from '../models/destinatario.model';

import { Solicitud261601State, Solicitud261601Store } from '../estados/tramites261601.store';

@Injectable({
  providedIn: 'root'
})
export class CorreccionInternaDeLaCofeprisService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes.
   * @param solicitud261601Store Store para gestionar el estado de la solicitud 261601.
   */
  constructor(private http: HttpClient, private solicitud261601Store: Solicitud261601Store) {}
  /**
   * Método para actualizar el estado del formulario con los datos proporcionados.
   * @param DATOS Objeto que contiene los datos de la solicitud 261601.
   */
  actualizarEstadoFormulario(DATOS: Solicitud261601State): void {
     this.solicitud261601Store.setRfc(DATOS.rfc);
     this.solicitud261601Store.setCumplocon(DATOS.cumplocon);
     this.solicitud261601Store.setLegalRazonSocial(DATOS.legalRazonSocial);
     this.solicitud261601Store.setApellidoPaterno(DATOS.apellidoPaterno);
     this.solicitud261601Store.setApellidoMaterno(DATOS.apellidoMaterno);   
     this.solicitud261601Store.setDetalledelaSolicitud(DATOS.detalledelaSolicitud);   
  }

  /**
   * Método para obtener los trámites asociados desde un archivo JSON.
   * @returns Un observable que emite una lista de trámites asociados.
   */
  getTramitesAsociados(): Observable<TramitesAsociados[]> {
      return this.http.get<TramitesAsociados[]>('./assets/json/261601/tramitesasociados.json');
    }

  /**
   * Método para obtener los datos de la solicitud desde un archivo JSON.
   * @returns Un observable que emite una lista con los datos de la solicitud.
   */
  getSolicitudData(): Observable<TramitesAsociados[]> {
    return this.http.get<TramitesAsociados[]>('./assets/json/261601/solicitud.json');
  }
  /**
   * Método para obtener los datos de consulta desde un archivo JSON.
   * @returns Un observable que emite el estado de la solicitud 261601.
   */
  getConsultaData(): Observable<Solicitud261601State> {
    return this.http.get<Solicitud261601State>('assets/json/261601/consulta.json');
  }
}
