import { DomicilioState, DomicilioStore } from '../../../shared/estados/stores/domicilio.store';
import { Observable,Subject,catchError, throwError } from 'rxjs';
import { Solicitud260701State, Tramite260701Store } from '../estados/tramites/tramite260701.store';
import { ENVIRONMENT } from '@libs/shared/data-access-user/src/enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONResponse } from '@libs/shared/data-access-user/src';
/**
 * Servicio para gestionar operaciones relacionadas con certificados y licencias.
 * Proporciona métodos para obtener datos desde el servidor o archivos JSON locales,
 * incluyendo trámites, catálogos y tablas asociadas.
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class CertificadosLicenciasService {

  /**
   * Subject utilizado para emitir y escuchar eventos personalizados dentro del servicio.
   * Puede ser suscrito para comunicación basada en eventos entre componentes o servicios.
   * @private
   */
  private eventSubject = new Subject();
  /**
   * Flujo observable que emite eventos desde el subject interno de eventos.
   * Suscríbete a este observable para escuchar notificaciones de eventos.
   */
  event$ = this.eventSubject.asObservable();
  /**
   * La URL del servidor utilizada para operaciones auxiliares con JSON.
   * Este valor se obtiene de la configuración del entorno.
   */
  urlServer = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  
  /**
   * Inicializa una nueva instancia del servicio CertificadosLicenciasService.
   * 
   * @param http - El servicio HttpClient utilizado para realizar solicitudes HTTP.
   */
  constructor(
    private http: HttpClient,
    private tramite260701Store: Tramite260701Store,
    private domicilioStore: DomicilioStore
  ) {
    //
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
   * Recupera los datos del banco desde un archivo JSON local.
   * @returns Un `Observable` que emite un `JSONResponse` que contiene los datos
   *          del archivo `banco-catalog.json`.
   */
  getBancoDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/banco-catalog.json');
  }

  /**
   * Recupera los datos de los "trámites" asociados desde un archivo JSON local.
   * @returns Un `Observable` que emite un `JSONResponse` que contiene los datos
   *          del archivo `tramites-asociados-tabla.json`.
   */
  getTramitesAsociados(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/tramites-asociados-tabla.json');
  }

  /**
   * Recupera los datos del destinatario desde un archivo JSON local.
   * @returns Un `Observable` que emite un `JSONResponse` que contiene los datos del destinatario.
   */
  getDestinatarioDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/destinatario-tabla.json');
  }

  /**
   * Recupera los datos del fabricante desde un archivo JSON local.
   * @returns {Observable<JSONResponse>} Un observable que contiene la respuesta JSON
   * con los datos del fabricante.
   */
  getFabricanteDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/fabricante-tabla.json');
  }

  /**
   * Recupera el catálogo de estados desde un archivo JSON local.
   * @returns {Observable<JSONResponse>} Un observable que contiene la respuesta JSON
   * con los datos del catálogo de estados.
   */
  getEstadoCatalogo(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/estado-catalog.json');
  }

  /**
   * Recupera los datos de la tabla SCIAN desde un archivo JSON local.
   * @returns Un `Observable` que emite un `JSONResponse` que contiene los datos
   *          del archivo `scian-tabla.json` ubicado en el directorio de assets.
   */
  getScianTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/scian-tabla.json');
  }

  /**
   * Recupera los datos de "mercancías" desde un archivo JSON local.
   * @returns Un `Observable` que emite un `JSONResponse` que contiene los datos
   *          del archivo JSON.
   */
  getMercanciasTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/mercancias-tabla.json');
  }

  /**
   * Recupera una lista de datos clave desde un archivo JSON.
   *
   * @returns Un `Observable` que emite la respuesta JSON que contiene la lista de datos clave.
   */
  getListaClaveTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('./assets/json/260701/lista-claves.json');
  }

  /**
   * Recupera los datos de consulta para el estado Solicitud260701State.
   * @returns Un Observable que emite el objeto `Solicitud260701State` obtenido.
   */
  getConsultaDatos(): Observable<Solicitud260701State> {
    return this.http.get<Solicitud260701State>('./assets/json/260701/consulta-datos.json');
  }

  /**
   * Recupera los datos del representante legal desde un archivo JSON local.
   * @returns Un `Observable` que emite un `DomicilioState` que contiene los datos
   *          del archivo `represent-consulta.json`.
   */
  getRepresentLegalaConsulta(): Observable<DomicilioState> {
    return this.http.get<DomicilioState>('./assets/json/260701/represent-consulta.json');
  }

  /**
   * Actualiza el estado del formulario en el store `tramite260701Store` utilizando los datos proporcionados.
   */
  actualizarEstadoFormulario(DATOS: Solicitud260701State): void {
    this.tramite260701Store.setDenominacionORazonSocial(DATOS.denominacionORazonSocial);
    this.tramite260701Store.setCorreoElectronico(DATOS.correoElectronico);
    this.tramite260701Store.setCodigoPostal(DATOS.codigoPostal);
    this.tramite260701Store.setEstado(DATOS.estado);
    this.tramite260701Store.setMunicipio(DATOS.municipio);
    this.tramite260701Store.setLocalidad(DATOS.localidad);
    this.tramite260701Store.setColonia(DATOS.colonia);
    this.tramite260701Store.setCalle(DATOS.calle);
    this.tramite260701Store.setLada(DATOS.lada);
    this.tramite260701Store.setTelefono(DATOS.telefono);
    this.tramite260701Store.setAvisoCheckbox(DATOS.avisoCheckbox);
    this.tramite260701Store.setLicenciaSanitaria(DATOS.licenciaSanitaria);
    this.tramite260701Store.setMarcarEnCasoDeQueSea(DATOS.marcarEnCasoDeQueSea);
    this.tramite260701Store.setRegimen(DATOS.regimen);
    this.tramite260701Store.setAduanasEntradas(DATOS.aduanasEntradas);
    this.tramite260701Store.setNumeroPermiso(DATOS.numeroPermiso);
    this.tramite260701Store.setClaveScianModal(DATOS.claveScianModal);
    this.tramite260701Store.setClaveDescripcionModal(DATOS.claveDescripcionModal);
    this.tramite260701Store.setClasificacion(DATOS.clasificacion);
    this.tramite260701Store.setEspecificarClasificacionProducto(DATOS.especificarClasificacionProducto);
    this.tramite260701Store.setDenominacionEspecifica(DATOS.denominacionEspecifica);
    this.tramite260701Store.setDenominacionDistintiva(DATOS.denominacionDistintiva);
    this.tramite260701Store.setDenominacionComun(DATOS.denominacionComun);
    this.tramite260701Store.setTipoDeProducto(DATOS.tipoDeProducto);
    this.tramite260701Store.setEstadoFisico(DATOS.estadoFisico);
    this.tramite260701Store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite260701Store.setDescripcionFraccion(DATOS.descripcionFraccion);
    this.tramite260701Store.setCantidadUMT(DATOS.cantidadUMT);
    this.tramite260701Store.setUMT(DATOS.UMT);
    this.tramite260701Store.setCantidadUMC(DATOS.cantidadUMC);
    this.tramite260701Store.setUMC(DATOS.UMC);
    this.tramite260701Store.setPresentacion(DATOS.presentacion);
    this.tramite260701Store.setNumeroRegistro(DATOS.numeroRegistro);
    this.tramite260701Store.setFechaCaducidad(DATOS.fechaCaducidad);
    this.tramite260701Store.setClaveDeLosLotes(DATOS.claveDeLosLotes);
    this.tramite260701Store.setCumplimiento(DATOS.cumplimiento);
    this.tramite260701Store.setClaveDeReferencia(DATOS.claveDeReferencia);
    this.tramite260701Store.setCadenaDependencia(DATOS.cadenaDependencia);
    this.tramite260701Store.setBanco(DATOS.banco);
    this.tramite260701Store.setLlaveDePago(DATOS.llaveDePago);
    this.tramite260701Store.setFechaPago(DATOS.fechaPago);
    this.tramite260701Store.setImportePago(DATOS.importePago);
    this.tramite260701Store.setRfc(DATOS.rfc);
    this.tramite260701Store.setNombre(DATOS.nombre);
    this.tramite260701Store.setApellidoPaterno(DATOS.apellidoPaterno);
    this.tramite260701Store.setApellidoMaterno(DATOS.apellidoMaterno);
    this.tramite260701Store.setDenominacionSocial(DATOS.denominacionSocial);
    this.tramite260701Store.setTerceroNombre(DATOS.terceroNombre);
    this.tramite260701Store.setPrimerApellido(DATOS.primerApellido);
    this.tramite260701Store.setNacional(DATOS.nacional);
    this.tramite260701Store.setExtranjero(DATOS.extranjero);
    this.tramite260701Store.setTipoPersona(DATOS.tipoPersona);
    this.tramite260701Store.setTercerosRelacionadosRfc(DATOS.tercerosRelacionadosRfc);
    this.tramite260701Store.setCurp(DATOS.curp);
    this.tramite260701Store.setRazonSocial(DATOS.razonSocial);
    this.tramite260701Store.setPais(DATOS.pais);
    this.tramite260701Store.setTercerosRelacionadosEstado(DATOS.tercerosRelacionadosEstado);
    this.tramite260701Store.setTercerosRelacionadosMunicipio(DATOS.tercerosRelacionadosMunicipio);
    this.tramite260701Store.setTercerosRelacionadosLocalidad(DATOS.tercerosRelacionadosLocalidad);
    this.tramite260701Store.setTercerosRelacionadosColonia(DATOS.tercerosRelacionadosColonia);
    this.tramite260701Store.setTercerosRelacionadosCalle(DATOS.tercerosRelacionadosCalle);
    this.tramite260701Store.setTercerosRelacionadosCodigoPostal(DATOS.tercerosRelacionadosCodigoPostal);
    this.tramite260701Store.setNumeroExterior(DATOS.numeroExterior);
    this.tramite260701Store.setNumeroInterior(DATOS.numeroInterior);
    this.tramite260701Store.setTercerosRelacionadosLada(DATOS.tercerosRelacionadosLada);
    this.tramite260701Store.setTercerosRelacionadosTelefono(DATOS.tercerosRelacionadosTelefono);
    this.tramite260701Store.setTercerosRelacionadosCorreoElectronico(DATOS.tercerosRelacionadosCorreoElectronico);
    this.tramite260701Store.setMuncipio(DATOS.municipio);
    this.tramite260701Store.setTipoOperacion(DATOS.tipoOperacion);
    this.tramite260701Store.setJustificacion(DATOS.justificacion);
  }

  /**
   * Actualiza el estado del representante legal en el store `domicilioStore` utilizando los datos proporcionados.
   */
  actualizarRepresentLegala(DATOS: DomicilioState): void {
    this.domicilioStore.setRfc(DATOS.rfc);
    this.domicilioStore.setNombreRazonSocial(DATOS.nombreRazonSocial);
    this.domicilioStore.setApellidoPaterno(DATOS.apellidoPaterno);
    this.domicilioStore.setApellidoMaterno(DATOS.apellidoMaterno);
    this.domicilioStore.setCumplimiento(DATOS.cumplimiento);
  }

  /**
   * Emite un evento booleano a los suscriptores a través de eventSubject.
   *
   * @param datos - El valor booleano que se emitirá a los observadores.
   */
  emitEvent(datos: boolean): void {
    this.eventSubject.next(datos);
  }

}
