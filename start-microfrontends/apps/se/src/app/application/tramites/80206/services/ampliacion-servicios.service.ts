/* eslint-disable class-methods-use-this */
/**
 * El `AmpliacionServiciosService` es un servicio de Angular diseñado para gestionar las operaciones relacionadas con la ampliación de servicios.
 * Proporciona métodos para obtener datos desde archivos JSON y gestionar la visibilidad de ciertos elementos en la interfaz de usuario.
 * 
 * Este servicio utiliza el cliente HTTP de Angular para realizar solicitudes a archivos JSON locales y expone observables para manejar datos y eventos.
 */

import { Arancelaria, ArancelariaImportacion, BuscarPayload, DatosResponse, FraccionArancelariaApiResponse, FraccionArancelariaImportacion, Sector } from '../models/datos-info.model';
import { JSONResponse, RespuestaCatalogos } from '@ng-mf/data-access-user';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { API_ROUTES } from '../../../shared/servers/api-route';
import { AmpliacionServiciosState } from '../estados/tramite80206.store';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Tramite80206Store } from '../estados/tramite80206.store';

@Injectable({
  providedIn: 'root',
})
export class AmpliacionServiciosService {
  /**
   * Constructor del servicio.
   */
  constructor(private readonly http: HttpClient, private tramiteStore: Tramite80206Store) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Subject para gestionar la visibilidad de ciertos elementos en la interfaz.
   */
  private deberiaMostrar = new Subject<boolean>();

  /**
   * Observable que expone el estado de visibilidad de ciertos elementos.
   */
  deberiaMostrar$ = this.deberiaMostrar.asObservable();

  /**
   * Envía el estado de visibilidad a los suscriptores.
   */
  enviarDeberiaMostrar(mostrar: boolean): void {
    this.deberiaMostrar.next(mostrar);
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   */
  getDatos(): Observable<DatosResponse[]> {
    return this.http
      .get<DatosResponse[]>("assets/json/80206/ampliacion-anexo.json")
      .pipe(map((res) => res));
  }

  /**
   * Obtiene la lista de selección de reglas desde un archivo JSON.
   */
  obtenerReglaSelectList(): Observable<RespuestaCatalogos> {
    return this.http
      .get<RespuestaCatalogos>("assets/json/80206/seleccionar-regla-dropdown.json")
      .pipe(map((res) => res));
  }

  /**
   * Obtiene la lista de selección de sectores desde un archivo JSON.
   */
  obtenerSectorSelectList(): Observable<RespuestaCatalogos> {
    return this.http
      .get<RespuestaCatalogos>("assets/json/80206/sector-dropdown.json")
      .pipe(map((res) => res));
  }
  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS:AmpliacionServiciosState): void {
    this.tramiteStore.setInfoRegistro(DATOS.infoRegistro);
    this.tramiteStore.setRfcEmpresa(DATOS.fraccion);
    this.tramiteStore.setImportacion(DATOS.importacion);
    this.tramiteStore.setCantidad(DATOS.cantidad);
    this.tramiteStore.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramiteStore.setSeleccionaLaModalidad(DATOS.seleccionaLaModalidad);
    this.tramiteStore.setSeleccionarRegla(DATOS.seleccionarRegla);
    this.tramiteStore.setSector(DATOS.sector);
    this.tramiteStore.setDatosSector(DATOS.datosSector);
    this.tramiteStore.setIsSelectedRegla(DATOS.isSelectedRegla);
    this.tramiteStore.setValor(DATOS.valor);
    this.tramiteStore.setDatosImmex(DATOS.datosImmex);
    this.tramiteStore.setDatosImportacion(DATOS.datosImportacion);
  }

  /**
   * Obtiene los datos de ampliación de servicios desde un archivo JSON.
   */
  getServiciosData(): Observable<AmpliacionServiciosState> {
    return this.http.get<AmpliacionServiciosState>('assets/json/80206/datos-previos.json')}

    /*
    * Realiza una solicitud para obtener información de fracciones arancelarias.
    * @param {BuscarPayload} body - Cuerpo de la solicitud con los parámetros necesarios.
    * @returns {Observable<JSONResponse>} - Observable con la respuesta de la API.
    */
 obtenerInformacionFraccion(body: BuscarPayload): Observable<JSONResponse> {
      return this.http.post<JSONResponse>(API_ROUTES('/sat-t80206','80206').buscarfraccionArancelaria, body).pipe(
        map((response) => response),
        catchError(() => {
          const ERROR = new Error(`Error al obtener la lista de plantas en ${API_ROUTES('/sat-t80206','80206').buscarfraccionArancelaria}`);
          return throwError(() => ERROR);
        })
      );
    }

  /**
 * Maps API response data to Arancelaria interface
 */
mapApiResponseToFraccionArancelaria(
    dato: FraccionArancelariaApiResponse[], 
    startIndex: number = 0
  ): Arancelaria[] {
    return dato.map((item, index) => ({
      fraccion: (startIndex + index + 1).toString(),
      fraccionArancelaria: item.cveFraccion || '',
      descripcionComercial: item.descripcion || item.descripcionUsuario || '',
      anexoII: item.tipoFraccion || '',
      tipo: item.tipoOperacion || '',
      umt: item.unidadMedida || item.umt || '',
      categoria: item.descripcionCategoria || item.claveCategoria || '',
      valorMensual: item.valorMonedaMensual?.toString() || '',
      valorAnual: item.valorMonedaAnual?.toString() || '',
      volumenrMensual: item.valorProduccionMensual?.toString() || '',
      volumenAnual: item.valorProduccionAnual?.toString() || '',
    }));
  }

 /**
 * Obtiene información de fracción arancelaria de importación.
 * Este método realiza una solicitud POST para obtener información detallada de una fracción arancelaria de importación específica.
 * Incluye manejo de errores en caso de fallo en la comunicación con el servidor.
 */
obtenerFraccionImportacion(body: FraccionArancelariaImportacion): Observable<JSONResponse> {
  return this.http.post<JSONResponse>(API_ROUTES('/sat-t80206','80206').buscarfraccionarancelariaImportacion, body).pipe(
    map((response) => response),
    catchError(() => {
      const ERROR = new Error(`Error al obtener información de fracción arancelaria de importación en ${API_ROUTES('/sat-t80206','80206').buscarfraccionarancelariaImportacion}`);
      return throwError(() => ERROR);
    })
  );
}

/**
 * Mapea los datos de respuesta de la API a la interfaz ArancelariaImportacion.
 * Este método transforma los datos de respuesta de la API en objetos que siguen la interfaz ArancelariaImportacion,
 * asignando valores por defecto cuando los campos están vacíos y generando números de fracción secuenciales.
 */
mapApiResponseToFraccionArancelariaImportacion(
  dato: FraccionArancelariaApiResponse[], 
  startIndex: number = 0
): ArancelariaImportacion[] {
  return dato.map((item, index) => ({
    fraccion: (startIndex + index + 1).toString(),
    fraccionArancelaria: item.fraccionPadre || '',
    descripcionFraccionPadre: item.descripcionFraccionPadre || '',
    fraccionArancelariaImportacion: item.cveFraccion || '',
    descripcionComercialImportacion: item.descripcion || '',
    anexoII: item.tipoFraccion || '',
    tipo: item.tipoOperacion || '',
    umt: item.unidadMedida || item.umt || '',
    categoria: item.descripcionCategoria || item.claveCategoria || '',
    valorMensual: item.valorMonedaMensual?.toString() || '',
    valorAnual: item.valorMonedaAnual?.toString() || '',
    volumenrMensual: item.valorProduccionMensual?.toString() || '',
    volumenAnual: item.valorProduccionAnual?.toString() || '',
  }));
}

/**
 * Obtiene información de sectores IMMEX.
 * Este método realiza una solicitud POST para obtener información detallada de un sector IMMEX específico.
 * La respuesta incluye atributos de solicitud mapeados relacionados con el sector consultado.
 */
obtenerSectoresImmex(body: { sectorImmex: string }): Observable<JSONResponse> {
  return this.http.post<JSONResponse>(API_ROUTES('/sat-t80206','80206').buscarSectoresImmex, body).pipe(
    map((response) => response),
    catchError(() => {
      const ERROR = new Error(`Error al obtener información del sector IMMEX en ${API_ROUTES('/sat-t80206','80206').buscarSectoresImmex}`);
      return throwError(() => ERROR);
    })
  );
}

/**
 * Mapea los datos de respuesta de la API a la interfaz Sector.
 * Este método transforma los datos de respuesta de sectores IMMEX, asegurando que todos los campos
 * tengan valores válidos y proporcionando cadenas vacías como valores por defecto para campos nulos.
 */
mapApiResponseToSectoresImmex(dato: Sector[]): Sector[] {
  return dato.map((item) => ({
    clave: item.clave || '',
    descripcion: item.descripcion || '',
  }));
}
}