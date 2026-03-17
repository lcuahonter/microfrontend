import { Observable,catchError, throwError } from 'rxjs';
import { Solicitante110101State, Tramite110101Store } from '../estados/tramites/solicitante110101.store';
import { ENVIRONMENT } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';

@Injectable({
  providedIn: 'root'
})
export class PantallasSvcService {
/**
 * La URL base para el servidor auxiliar de JSON, cargada desde la configuración del entorno.
 */
 urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
   /**
  * constructor de la clase
  * @param http: constructor de HttpClient
  */
  constructor(
    private http: HttpClient,
    private tramite110101Store: Tramite110101Store
  ) {
    
   }

    /**
     * @description Función para obtener el trámite
     * @param id
     * @returns JSONResponse
     */
    obtenerTramite(id: number): Observable<JSONResponse> {
      return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Actualiza el estado del formulario en el tramite110101Store con los datos proporcionados.
     * @param DATOS - Un objeto de tipo `Solicitante110101State` que contiene los valores actualizados del formulario.
     */
    actualizarEstadoFormulario(DATOS: Solicitante110101State): void {
      this.tramite110101Store.setRfc(DATOS.rfc);
      this.tramite110101Store.setDenominacion(DATOS.denominacion);
      this.tramite110101Store.setActividadEconomica(DATOS.actividadEconomica);
      this.tramite110101Store.setCorreoElectronico(DATOS.correoElectronico);
      this.tramite110101Store.setPais(DATOS.pais);
      this.tramite110101Store.setTratado(DATOS.tratado);
      this.tramite110101Store.setOrigen(DATOS.origen);
      this.tramite110101Store.setNombreComercial(DATOS.nombreComercial);
      this.tramite110101Store.setNombreIngles(DATOS.nombreIngles);
      this.tramite110101Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
      this.tramite110101Store.setDescripcion(DATOS.descripcion);
      this.tramite110101Store.setValorTransaccion(DATOS.valorTransaccion);
      this.tramite110101Store.setEntidad(DATOS.entidad);
      this.tramite110101Store.setRepresentacion(DATOS.representacion);
      this.tramite110101Store.setMetodoSeparacion(DATOS.metodoSeparacion);
      this.tramite110101Store.setExportadorAutorizado(DATOS.exportadorAutorizado);
      this.tramite110101Store.setInformacionRadios(DATOS.informacionRadios);
    }

    /**
     * Recupera los datos del solicitante para el trámite 110101 realizando una solicitud HTTP GET
     * a un archivo JSON local. Retorna un observable que emite el objeto `Solicitante110101State`.
     * Maneja errores HTTP propagándolos a través del flujo del observable.
     *
     * @returns {Observable<Solicitante110101State>} Un observable que emite los datos del estado del solicitante.
     */
    getConsultaDatos(): Observable<Solicitante110101State> {
      return this.http.get<Solicitante110101State>('assets/json/110101/consulta-datos.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera los datos del catálogo desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos del catálogo.
     */
    getCatalogoDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/110101/tratdos-dropdown.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
}
