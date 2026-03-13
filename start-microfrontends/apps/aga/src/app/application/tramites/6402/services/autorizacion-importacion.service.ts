import { CatalogoLista, DatosSolicitante, RespuestaConsulta, SolicitudTablaDatos } from '../models/autorizacion-importacion.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/**
 * Servicio para gestionar las operaciones relacionadas con el aviso de traslado.
 * 
 * Este servicio proporciona métodos para obtener datos como catálogos, tablas de aviso,
 * tablas de mercancías, y otros datos necesarios para el trámite 6402.
 * 
 * @injectable
 * @providedIn 'root' - Disponible como singleton en toda la aplicación
 * 
 * @example
 * ```typescript
 * constructor(private autorizacionService: AutorizacionImportacionService) {}
 * 
 * ngOnInit() {
 *   this.autorizacionService.obtenerAduanas().subscribe(aduanas => {
 *     console.log('Aduanas obtenidas:', aduanas);
 *   });
 * }
 * ```
 * 
 * @author Equipo de desarrollo VUCEM 3.0
 * @version 1.0.0
 * @since 2024
 */
@Injectable({
  providedIn: 'root'
})
export class AutorizacionImportacionService {
  /**
   * Constructor del servicio AutorizacionImportacionService.
   * 
   * @param http Cliente HTTP inyectado para realizar solicitudes HTTP a los recursos JSON.
   * @description Inicializa el servicio con las dependencias necesarias para obtener
   * datos de catálogos y tablas relacionadas con el trámite 6402.
   */
  constructor(private http: HttpClient) {
    // Constructor - Inyección de dependencias
  }
  /**
   * Obtiene los datos del solicitante desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `DatosSolicitante` con los datos del solicitante.
   * @description Consulta el archivo JSON local para obtener la información
   * del solicitante necesaria para el formulario del trámite 6402.
   */
  obtenerDatosSolicitante(): Observable<DatosSolicitante> {
    return this.http.get<DatosSolicitante>(`assets/json/6402/datosSolicitante.json`);
  }
  /**
   * Obtiene los datos de la tabla de solicitud desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `SolicitudTablaDatos` con los datos de la tabla de solicitud.
   * @description Consulta el archivo JSON local para obtener los datos estructurados
   * de la tabla de autorización utilizada en el formulario del trámite 6402.
   */
  obtenerSolicitudTabla(): Observable<SolicitudTablaDatos> {
    return this.http.get<SolicitudTablaDatos>(`assets/json/6402/autorizacion-tabla.json`);
  }
  
  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con la lista de entidades federativas.
   * @description Consulta el archivo JSON local para obtener el catálogo de entidades
   * federativas de México utilizadas en direcciones y ubicaciones.
   */
  obtenerFederativa(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/entidad-federativa.json`);
  }

  /**
   * Obtiene la lista de aduanas desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con los datos de las aduanas.
   * @description Consulta el archivo JSON local para obtener el catálogo de aduanas
   * disponibles para el proceso de importación temporal.
   * 
   * @example
   * ```typescript
   * this.obtenerAduanas().subscribe({
   *   next: (aduanas) => console.log('Aduanas:', aduanas),
   *   error: (error) => console.error('Error:', error)
   * });
   * ```
   */
  obtenerAduanas(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/aduanas.json`);
  }

  /**
   * Obtiene la lista de aduaneras desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con los datos de las aduaneras.
   * @description Consulta el archivo JSON local para obtener el catálogo de secciones
   * aduaneras disponibles.
   */
  obtenerAduaneras(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/aduaneras.json`);
  }

  /**
   * Obtiene el catálogo de recintos fiscalizados desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con los datos del catálogo.
   * @description Consulta el archivo JSON local para obtener los recintos fiscalizados
   * habilitados para operaciones aduaneras.
   */
  obtenerRecintoFiscalizado(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/recinto-fiscalizado.json`);
  }

  /**
   * Obtiene el catálogo de tipos de documento desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con los datos del tipo de documento.
   * @description Consulta el archivo JSON local para obtener los tipos de documentos
   * válidos para el proceso de importación temporal (Pedimento, Folio VUCEM, Formato oficial).
   */
  obtenerTipoDeDocumento(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/tipo-de-documento.json`);
  }

  /**
   * Obtiene el catálogo de medios de transporte desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con los datos del catálogo.
   * @description Consulta el archivo JSON local para obtener los medios de transporte
   * disponibles (Aéreo, Marítimo, Ferroviario, Carretero) para el arribo al país.
   */
  obtenerMedioDeTransporte(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/medio-de-transporte.json`);
  }

  /**
   * Obtiene la lista de países de procedencia desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con los datos de los países de procedencia.
   * @description Consulta el archivo JSON local para obtener el catálogo de países
   * de procedencia válidos para las operaciones de comercio exterior.
   */
  obtenerPaisDeProcedencia(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/pais-de-procedencia.json`);
  }

  /**
   * Obtiene una lista de opciones "Sí" o "No" desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con las opciones "Sí" o "No".
   * @description Consulta el archivo JSON local para obtener opciones binarias
   * utilizadas en formularios de decisión (Sí/No).
   */
  obtenerSiNo(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/si-no.json`);
  }

  /**
   * Obtiene el catálogo de tipos de destino desde un archivo JSON local.
   * 
   * @returns Observable que emite un objeto de tipo `CatalogoLista` con el catálogo de tipos de destino.
   * @description Consulta el archivo JSON local para obtener los tipos de destino
   * disponibles para las mercancías reemplazadas (Retorno, Destrucción, Importación definitiva).
   */
  obtenerTipoDeDestino(): Observable<CatalogoLista> {
    return this.http.get<CatalogoLista>(`assets/json/6402/tipo-de-destino.json`);
  }

  /**
   * Obtiene los datos para la consulta del trámite 6402.
   * 
   * @returns Observable que emite un objeto de tipo `RespuestaConsulta` con los datos de consulta.
   * @description Consulta el archivo JSON local para obtener datos de ejemplo
   * para la funcionalidad de consulta del trámite 6402.
   * 
   * @example
   * ```typescript
   * this.getDatosConsulta().subscribe({
   *   next: (datos) => this.procesarDatosConsulta(datos),
   *   error: (error) => this.manejarError(error)
   * });
   * ```
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>('assets/json/6402/consulta_6402.json');
  }
 
}