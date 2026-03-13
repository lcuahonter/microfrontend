import { DatoSolicitudStore } from '../estados/tramites/dato-solicitud.store';
import { EstadoDatoSolicitud } from '../models/datos-solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable } from 'rxjs';

/**
 * @description
 * Servicio para gestionar las operaciones relacionadas con el aviso de reciclaje.
 * Proporciona métodos para actualizar el estado del formulario y obtener los datos
 * iniciales y completos del formulario desde archivos JSON locales.
 *
  * @class AvisoDeReciclajeServiceService
  */
@Injectable({
  providedIn: 'root'
})
export class AvisoDeReciclajeServiceService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones a archivos JSON locales.
   * @param datoSolicitudStore Store para gestionar el estado de los datos de la solicitud.
   */
  constructor(private http: HttpClient, private datoSolicitudStore: DatoSolicitudStore) { }

    /**
     * Actualiza el estado del formulario en el store con los datos proporcionados.
     * @param DATOS Objeto que contiene el estado actual de los datos de la solicitud.
     */
    actualizarEstadoFormulario(DATOS: EstadoDatoSolicitud): void {
      this.datoSolicitudStore.actualizarSolicitudForm(DATOS.solicitudForm);
      this.datoSolicitudStore.actualizarEmpresaReciclaje(DATOS.empresaReciclaje);
      this.datoSolicitudStore.actualizarLugarReciclaje(DATOS.lugarReciclaje);
      this.datoSolicitudStore.actualizarEmpresaTransportista(DATOS.empresaTransportista);
      this.datoSolicitudStore.actualizarPrecaucionesManejo(DATOS.precaucionesManejo);
    }

    /**
     * Obtiene los datos iniciales de la solicitud desde un archivo JSON local.
     * @returns Observable con el estado inicial de los datos de la solicitud.
     */
    obtenerDatosSolicitudInicial(): Observable<EstadoDatoSolicitud> {
      return this.http.get<EstadoDatoSolicitud>('assets/json/231003/inicializar-formulario-datos.json');
    }

    /**
     * Obtiene los datos completos del formulario (incluyendo residuos) desde un archivo JSON local.
     * @returns Observable con el estado completo de los datos de la solicitud.
     */
    obtenerDatosCompletosFormulario(): Observable<EstadoDatoSolicitud> {
      return this.http.get<EstadoDatoSolicitud>('assets/json/231003/inicializar-formulario-datos-residuos.json');
    }

    /**
     * Obtiene los datos de residuos desde un archivo JSON local.
     * @returns Observable con los datos de residuos.
     */
    obtenerAvisoDeReciclajeDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/231003/solicitude-tabla-datos.json');
    }

}
