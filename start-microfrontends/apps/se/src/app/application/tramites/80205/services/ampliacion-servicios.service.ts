import { AmpliacionServiciosState, ServicioAmpliacion } from '../models/datos-info.model';
import {Observable,map } from 'rxjs';
import {AmpliacionServiciosStore} from '../estados/tramite80205.store';
import { COMUN_URL } from '../../../core/server/api-router';
import { Catalogo } from '../constantes/modificacion.enum';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Servicio } from '../models/datos-info.model';




/**
 * Servicio para la gestión de ampliación de servicios IMMEX.
 * 
 * @export
 * @class AmpliacionServiciosService
 */
@Injectable({
  providedIn: 'root',
})
export class AmpliacionServiciosService {

  /**
   * URL base para las peticiones HTTP.
   * @type {string}
   */
  host!: string;

  /**
   * Constructor del servicio.
   * @param {HttpClient} http - Cliente HTTP de Angular
   * @param {AmpliacionServiciosStore} tramite80205Store - Store de Akita
   */
  constructor(private readonly http: HttpClient,
    private tramite80205Store: AmpliacionServiciosStore
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   * @returns {Observable<Servicio[]>} Observable con array de servicios
   */
  getDatos(): Observable<Servicio[]> {
    return this.http
    .get<Servicio[]>("assets/json/80205/ampliacion-servicios.json")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .pipe(map((res: any) => res.data));
}

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * @param {AmpliacionServiciosState} DATOS - Datos a actualizar en el estado
   */

  actualizarEstadoFormulario(DATOS:AmpliacionServiciosState): void {
    this.tramite80205Store.setInfoRegistro(DATOS.servicios);
   this.tramite80205Store.setAduanaDeIngresoSeleccion(DATOS.aduanaDeIngresoSelecion as Catalogo);
    this.tramite80205Store.setNumeroPrograma(DATOS.numeroPrograma); 
    this.tramite80205Store.setRfcEmpresa(DATOS.rfcEmpresa);
    this.tramite80205Store.setTiempoPrograma(DATOS.tiempoPrograma);
    this.tramite80205Store.setDatosImmex(
      (DATOS.tablaDatosIMMEX as unknown as ServicioAmpliacion[])
    );
    this.tramite80205Store.setDatos(DATOS.tablaDatos);

  }
  /**
   * Obtiene el estado de ampliación de servicios desde archivo JSON.
   * @returns {Observable<AmpliacionServiciosState>} Observable con el estado completo
   */

  getServiciosData(): Observable<AmpliacionServiciosState> {
    return this.http.get<AmpliacionServiciosState>('assets/json/80205/ampliacion-campo.json');
  }

}


