import { ENVIRONMENT, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable,catchError, throwError } from 'rxjs';
import { Solicitude32612DosState, Tramite32612DosStore } from '../estados/solicitud32612Dos.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tramite32612Store } from '../estados/solicitud32612.store';

/**
 * Servicio para gestionar operaciones relacionadas con el esquema de certificación
 * del trámite 32612. Proporciona métodos para obtener datos auxiliares desde archivos
 * JSON, interactuar con el backend, y actualizar el estado de los formularios en los stores.
 *
 * @remarks
 * Este servicio utiliza `HttpClient` para realizar peticiones HTTP y depende de los stores
 * `Tramite32612Store` y `Tramite32612DosStore` para la gestión del estado de los formularios.
 *
 * @example
 * ```typescript
 * constructor(private esquemaService: EsquemaDeCertificacionService) {}
 *
 * this.esquemaService.obtenerTramite(123).subscribe(response => {
 *   // Manejar respuesta
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class EsquemaDeCertificacionService {

/**
 * La URL del servidor utilizada para operaciones auxiliares con JSON.
 * Este valor se obtiene de la configuración del entorno.
 */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;

  /**
   * Inicializa una instancia de EsquemaDeCertificacionService.
   * 
   * @param http - HttpClient de Angular para realizar solicitudes HTTP.
   * @param tramiteStore - Servicio store para gestionar el estado relacionado con Tramite32612.
   * @param tramiteDosStore - Servicio store para gestionar el estado relacionado con Tramite32612Dos.
   */
  constructor(
    private http: HttpClient,
    private tramiteStore: Tramite32612Store,
    private tramiteDosStore: Tramite32612DosStore
  ) {
    
  }


    /**
     @description Función para obtener el trámite
     @param id
     @returns JSONResponse
    */
    obtenerTramite(id: number): Observable<JSONResponse> {
      return this.http.get<JSONResponse>(`${this.urlServer}/${id}`).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera los datos del catálogo "Indique" desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos del catálogo.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getIndiqueCatalogo(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/catalog-indique.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera los datos de la tabla de sociedades desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos de la tabla de sociedades.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getSociedadesTablaDatos(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/socidad-tabla.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera los datos de las instalaciones desde un archivo JSON local.
     *
     * @returns Un Observable que emite un `JSONResponse` con los datos de las instalaciones.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getDatosDeLasInstalaciones(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/datos-instalaciones.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera los datos del agente aduanal desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos del agente aduanal.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getConsultaDatosAgenteAduanal(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/consulta-agente-aduanal.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Actualiza el estado de un campo del formulario estableciendo su valor dinámicamente en el store de trámite.
     *
     * @param campo - El nombre del campo del formulario a actualizar.
     * @param valor - El nuevo valor que se asignará al campo del formulario. Puede ser un string, número o booleano.
     */
    actualizarEstadoFormulario(campo: string, valor: string | number | boolean): void {
      this.tramiteStore.setDynamicFieldValue(campo, valor);
    }

    /**
     * Recupera los datos de consulta del agente aduanal desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos de la consulta.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getConsultaAgente(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/consulta-aduanal.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Actualiza el estado del formulario en el tramiteDosStore usando los datos proporcionados en `Solicitude32612DosState`.
     *
     * Establece las siguientes propiedades en el store:
     * - Número de patente
     * - Número de registro
     * - Nombre del agente aduanal
     * - Número de trabajadores IMSS
     * - Número de trabajadores contratistas
     * - Servicios adicionales
     * - Indique (información adicional)
     *
     * @param DATOS - El objeto de estado que contiene los datos del formulario a establecer en el store.
     */
    estadoFormulario(DATOS: Solicitude32612DosState): void {
      this.tramiteDosStore.setNumeroPatente(DATOS.numeroPatente);
      this.tramiteDosStore.setNumeroRegistro(DATOS.numeroRegistro);
      this.tramiteDosStore.setNombreAgenteAduanal(DATOS.nombreAgenteAduanal);
      this.tramiteDosStore.setNumeroTrabajadoresIMSS(DATOS.numeroTrabajadoresIMSS);
      this.tramiteDosStore.setNumeroTrabajadoresContratistas(DATOS.numeroTrabajadoresContratistas);
      this.tramiteDosStore.setServiciosAdicionales(DATOS.serviciosAdicionales);
      this.tramiteDosStore.setIndique(DATOS.indique);
    }

    /**
     * Recupera la lista de perfiles realizando una solicitud HTTP GET a un archivo JSON local.
     *
     * @returns Un Observable que emite un `JSONResponse` con los datos de los perfiles.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getConsultaPerfiles(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/consulta-perfiles.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Actualiza el tramiteDosStore con los datos del formulario proporcionados en un objeto Solicitude32612DosState.
     *
     * Este método establece varias propiedades en el tramiteDosStore, como número de registro,
     * organismo certificador, nombre del programa, opción, superficie de la instalación, número de empleados,
     * operaciones mensuales de exportación/importación, tipos de servicios, actividad preponderante,
     * antigüedad de la instalación, tipo de instalación y nombre de la agencia aduanal.
     *
     * @param DATOS - El objeto de estado que contiene los datos del formulario a aplicar en el tramiteDosStore.
     */
    estadoFormularioPerfiles(DATOS: Solicitude32612DosState): void {
      this.tramiteDosStore.setNumeroDeRegistro(DATOS.numeroDeRegistro);
      this.tramiteDosStore.setOrganismoCertificador(DATOS.organismoCertificador);
      this.tramiteDosStore.setNombrePrograma(DATOS.nombrePrograma);
      this.tramiteDosStore.setOpcion(DATOS.opcion);
      this.tramiteDosStore.setSuperficieInstalacion(DATOS.superficieInstalacion);
      this.tramiteDosStore.setNumeroEmpleados(DATOS.numeroEmpleados);
      this.tramiteDosStore.setOperacionesMensualesExp(DATOS.operacionesMensualesExp);
      this.tramiteDosStore.setOperacionesMensualesImp(DATOS.operacionesMensualesImp);
      this.tramiteDosStore.setTiposServicios(DATOS.tiposServicios);
      this.tramiteDosStore.setActividadPreponderante(DATOS.actividadPreponderante);
      this.tramiteDosStore.setAntiguedadInstalacion(DATOS.antiguedadInstalacion);
      this.tramiteDosStore.setTipoInstalacion(DATOS.tipoInstalacion);
      this.tramiteDosStore.setNombreAgenciaAduanal(DATOS.nombreAgenciaAduanal);
    }

    /**
     * Recupera los datos de perfiles Accodiane para consulta.
     *
     * Este método realiza una solicitud HTTP GET para obtener los datos JSON desde el recurso local
     * `consulta-perfiles-accodiane.json`. La respuesta se envuelve en un `Observable` de tipo `JSONResponse`.
     * En caso de error durante la solicitud HTTP, el error se propaga utilizando `throwError`.
     *
     * @returns {Observable<JSONResponse>} Un observable que contiene los datos de perfiles Accodiane.
     */
    getPrefilesConsultaAccodiane(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/consulta-perfiles-accodiane.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera la lista de mandatarios de agente desde un archivo JSON local.
     *
     * @returns {Observable<JSONResponse>} Un observable que emite la respuesta JSON con los datos de los mandatarios de agente.
     *
     * @remarks
     * Este método realiza una solicitud HTTP GET para obtener los datos desde 'assets/json/32612/mandatarios-de-agente.json'.
     * Si ocurre un error durante la solicitud, este es capturado y relanzado como un error observable.
     */
    getMandatariosDeAgenteTabla(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/mandatarios-de-agente.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera el catálogo de aduanas activas desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos del catálogo de aduanas.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getAduanaActuaCatalog(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/aduana-catalog.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }


    /**
     * Recupera el catálogo de RFC para agentes desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos del catálogo de RFC.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getRfcDelAgenteCatalog(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/rfc-del-agente-catalog.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }

    /**
     * Recupera el catálogo de entidades federativas desde un archivo JSON local.
     *
     * @returns Un Observable que emite un JSONResponse con los datos del catálogo.
     * @throws Emite un error si la solicitud HTTP falla.
     */
    getEntidadFederativaCatalog(): Observable<JSONResponse> {
      return this.http.get<JSONResponse>('assets/json/32612/entidad-federativa.json').pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
    }
  }
