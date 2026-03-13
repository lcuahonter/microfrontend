import { FormaRequerimiento, RespuestaContenedor, RespuestaTramite } from '../models/datos-tramite.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tramite31501Store } from '../../../estados/tramites/tramite31501.store';

@Injectable({
  providedIn: 'root'
})
export class AutoridadService {

  constructor(
    private http: HttpClient,
    private tramite31501Store: Tramite31501Store
  ) { }

    /**
   * Obtiene un requerimiento desde un archivo JSON local.
   *
   * @returns Un observable con los datos del requerimiento en formato `FormaRequerimiento`.
   */
  agregarRequerimiento(): Observable<FormaRequerimiento> {
    return this.http.get<FormaRequerimiento>(
      `assets/json/31501/requerimiento.json`
    );
  }

  /**
   * Obtener una lista de Aduanas
   * 
   * @param {string} catalogo - El nombre del catálogo a obtener.
   * @returns {Observable<RespuestaTramite>} Un observable con la respuesta del catálogo de aduanas.
   */
  getTramiteList(catalogo: string): Observable<RespuestaTramite> {
    return this.http.get<RespuestaTramite>(`assets/json/31501/${catalogo}.json`);
  }

    /**
   * Agregar una solicitud
   * 
   * @returns {Observable<RespuestaContenedor>} Un observable con la respuesta de agregar una solicitud.
   */
  agregarSolicitud(): Observable<RespuestaContenedor> {
    return this.http.get<RespuestaContenedor>(`assets/json/31501/contenedorLista.json`);
  }

    /**
   * Actualiza el estado del formulario en el store con los datos proporcionados.
   *
   * @param valor - Objeto del tipo `FormaRequerimiento` que contiene el motivo de cancelación y el tipo de requerimiento.
   */
  actualizarEstadoFormulario(valor: FormaRequerimiento): void {
    this.tramite31501Store.setMotivoCancelacion(valor.motivoCancelacion);
    this.tramite31501Store.setTipoDeRequerimiento(valor.tipoDeRequerimiento);
  }

}
