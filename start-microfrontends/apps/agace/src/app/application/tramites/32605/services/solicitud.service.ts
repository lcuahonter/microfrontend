import { ApiResponse, BuscarRfcResponse, InstalacionesInterface } from '../models/oea-textil-registro.model';
import { EnlaceOperativo, RFCEnlaceOperativo, TransportistasListaInterface } from '../models/solicitud.model';
import { Solicitud32605State, Solicitud32605Store } from '../estados/solicitud32605.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { GuardarDatosFormulario } from '../models/solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Inventarios } from '../models/solicitud.model';
import { Observable } from 'rxjs';
import { PersonaRespuestaTabla } from '../models/personas-notificaciones-tabla.model';
import { RecibirNotificaciones } from '../models/solicitud.model';
import { RepresentanteLegal } from '../models/solicitud.model';
import { SeccionSubcontratados } from '../models/solicitud.model';
import { SolicitudCatologoSelectLista } from '../models/solicitud.model';
import { SolicitudRadioLista } from '../models/solicitud.model';
import { forkJoin } from 'rxjs';

/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32605 a partir de archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Servicio encargado de obtener los datos necesarios para el llenado del formulario
 * de la solicitud 32605 a partir de archivos JSON locales.
 */
export class SolicitudService {
  /**
   * Constructor que inyecta el cliente HTTP.
   * @param http - Cliente HTTP para realizar peticiones.
   */
  constructor(
    private http: HttpClient,
    public solicitud32605Store: Solicitud32605Store
  ) {
    // Lógica del constructor aquí
  }

  /**
   * Obtiene la lista de opciones para recibir notificaciones.
   */
  conseguirRecibirNotificaciones(): Observable<RecibirNotificaciones[]> {
    return this.http.get<RecibirNotificaciones[]>(
      'assets/json/32605/recibir-notificaciones.json'
    );
  }

  /**
   * Obtiene la lista de enlaces operativos desde un archivo JSON local.
   * @returns Observable con un arreglo de EnlaceOperativo.
   */
  conseguirEnlaceOperativoDatos(): Observable<EnlaceOperativo[]> {
    return this.http.get<EnlaceOperativo[]>(
      'assets/json/32605/enlace-operativo-datos.json'
    );
  }

  /**
   * Obtiene los datos del representante legal desde un archivo JSON local.
   * @returns Observable con un objeto de tipo RepresentanteLegal.
   */
  conseguirRepresentanteLegalDatos(): Observable<RepresentanteLegal> {
    return this.http.get<RepresentanteLegal>(
      'assets/json/32605/representante-legal-datos.json'
    );
  }

  /**
   * Obtiene las opciones de radio de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudRadioLista.
   */
  conseguirOpcionDeRadio(): Observable<SolicitudRadioLista> {
    return this.http.get<SolicitudRadioLista>(
      'assets/json/32605/solicitud-radio-lista.json'
    );
  }

  

  /**
   * Obtiene los catálogos selectivos de la solicitud desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SolicitudCatologoSelectLista.
   */
  conseguirSolicitudCatologoSelectLista(): Observable<SolicitudCatologoSelectLista> {
    return this.http.get<SolicitudCatologoSelectLista>(
      'assets/json/32605/solicitud-catologo-select-lista.json'
    );
  }

  /**
   * Obtiene los datos de la sección de subcontratados desde un archivo JSON local.
   * @returns Observable con un objeto de tipo SeccionSubcontratados.
   */
  conseguirSeccionSubcontratados(): Observable<SeccionSubcontratados> {
    return this.http.get<SeccionSubcontratados>(
      'assets/json/32605/seccion-subcontratados.json'
    );
  }

  /**
   * Obtiene los inventarios registrados desde un archivo JSON local.
   * @returns Observable con un arreglo de Inventarios.
   */
  conseguirInventarios(): Observable<Inventarios[]> {
    return this.http.get<Inventarios[]>(
      'assets/json/32605/inventarios-datos.json'
    );
  }

  /**
   * Realiza una solicitud HTTP GET para obtener los datos guardados del formulario
   * desde un archivo JSON local.
   *
   * @returns {Observable<GuardarDatosFormulario>} Un observable que emite los datos del formulario.
   */
  guardarDatosFormulario(): Observable<GuardarDatosFormulario> {
    return this.http.get<GuardarDatosFormulario>(
      'assets/json/32605/guardar-datos-formulario.json'
    );
  }

 


  //service para guardar los datos del formulario---------------

   /**
   * Obtiene los datos de una empresa por RFC
   * RFC de la empresa a buscar
   * Observable con los datos de la empresa
   */
  conseguirDatosPorRFC(_rfc: string): Observable<{ [key: string]: RFCEnlaceOperativo }> {
    return this.http.get<{ [key: string]: RFCEnlaceOperativo }>('assets/json/32605/rfc-datos.json');
  }
  /**
   * Obtiene la lista de transportistas desde un archivo JSON local.
   * Observable con un arreglo de TransportistasTable.
   */
  conseguirTransportistasLista(_rfc: string): Observable<{ [key: string]: TransportistasListaInterface }> {
    return this.http.get<{ [key: string]: TransportistasListaInterface }>('assets/json/32605/transportistas-lista.json');
  }

  /**
 * Actualiza el estado completo de la solicitud 32605 en el store.
 * Recibe un objeto con todos los datos del formulario y los persiste en el estado global.
 * 
 * param DATOS - Objeto completo del estado de la solicitud con todos los campos actualizados
 */
  actualizarEstado(DATOS: Solicitud32605State): void {
    this.solicitud32605Store.actualizarEstado(DATOS);
  }
  /**
 * Obtiene los datos completos de la solicitud desde un archivo JSON local.
 * Utilizado para cargar información predeterminada o datos guardados previamente.
 * 
 * returns Observable que emite el estado completo de la solicitud 32605
 */
   obtenerDatos(): Observable<Solicitud32605State> {
    return this.http.get<Solicitud32605State>('assets/json/32605/datos.json');
  }
   /**
   * Obtiene los datos de la tabla de personas.
   * Realiza una petición a un recurso local en formato JSON que contiene datos relacionados con personas.
   *
   * @returns {Observable<PersonaRespuestaTabla>} Un observable con los datos de la tabla de personas.
   * @memberof SolicitudDeRegistroInvocarService
   */
  obtenerPersonaTablaDatos(): Observable<PersonaRespuestaTabla> {
    return this.http.get<PersonaRespuestaTabla>('assets/json/32605/personas-notificacione.json');
  }

  sectorListaDeSelects(): Observable<{
  sectorProductivoList: Catalogo[];
  sectorServicioList: Catalogo[];
  bimestreList: Catalogo[];
}> {
  return forkJoin({
    sectorProductivoList: this.http.get<Catalogo[]>('assets/json/32605/sector-productivo-list.json'),
    sectorServicioList: this.http.get<Catalogo[]>('assets/json/32605/sector-servicio-list.json'),
    bimestreList: this.http.get<Catalogo[]>('assets/json/32605/bimestre-list.json'),
  });
}

  /**
   * Obtiene los detalles del RFC desde un archivo JSON local.
   * 
   * @returns {Observable<BuscarRfcResponse>} Un observable que emite los detalles del RFC.
   */
  getRFCDetails(): Observable<BuscarRfcResponse> {
    return this.http.get<BuscarRfcResponse>('assets/json/32605/buscar-rfc-datos.json');
  }

  /**
   * Obtiene la lista de Entidades Federativas.
   * 
   * @returns {Observable<any>} Un observable que contiene los datos de las entidades federativas.
   */
  getEntidadesFederativas(): Observable<ApiResponse<Catalogo>> {
    return this.http.get<ApiResponse<Catalogo>>(`assets/json/32605/entidad-federativa-list.json`);
  }

  /**
   * Obtiene la lista de instalaciones desde un archivo JSON local.
   * 
   * @returns {Observable<ApiResponse<InstalacionesInterface>>} Un observable que emite los datos de las instalaciones.
   */
  getInstalacionesDatos(): Observable<ApiResponse<InstalacionesInterface>> {
    return this.http.get<ApiResponse<InstalacionesInterface>>(`assets/json/32605/instalaciones-list.json`);
  }

    /**
   * Obtiene la lista de Entidades Federativas.
   * 
   * @returns {Observable<any>} Un observable que contiene los datos de las entidades federativas.
   */
  getDomiciliosRegistrados(): Observable<ApiResponse<Catalogo>> {
    return this.http.get<ApiResponse<Catalogo>>(`assets/json/32605/domicilios-registrados-list.json`);
  }

  getTipoInstalacion(): Observable<ApiResponse<Catalogo>> {
    return this.http.get<ApiResponse<Catalogo>>(`assets/json/32605/tipo-Instalacion-list.json`);
  }

  empresaListaDeSelects(): Observable<{
  enSuCaracterDeList: Catalogo[];
  nacionalidadList: Catalogo[];
  tipoDePersonaList: Catalogo[];
}> {
  return forkJoin({
    enSuCaracterDeList: this.http.get<Catalogo[]>('assets/json/32605/en-su-caracter-de-list.json'),
    nacionalidadList: this.http.get<Catalogo[]>('assets/json/32605/nacionali-dad-list.json'),
    tipoDePersonaList: this.http.get<Catalogo[]>('assets/json/32605/tipo-de-persona-list.json'),
  });
}

}
