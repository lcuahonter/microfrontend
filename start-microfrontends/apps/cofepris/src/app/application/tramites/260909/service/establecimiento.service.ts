/**
 * @fileoverview Servicio `EstablecimientoService`
 * Este servicio proporciona métodos para interactuar con los datos relacionados con el establecimiento,
 * incluyendo catálogos, datos de representantes, manifiestos, y propietarios.
 */
import { DatosDelSolicituteSeccionStateInterface, DatosDelSolicituteSeccionStateStoreI} from '../estados/datos-del-solicitud-seccion.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable} from 'rxjs';

import { Catalogo, JSONResponse } from '@libs/shared/data-access-user/src';

import { PropietarioTipoPersona } from '../models/datos-de-la-solicitud.model';

import { DatosDelSolicituteSeccionState, DatosDelSolicituteSeccionStateStore } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { PermisoImportacionBiologicaState, PermisoImportacionBiologicaStore } from '../../../shared/estados/permiso-importacion-biologica.store';

/**
 * @class EstablecimientoService
 * @description
 * Servicio que gestiona las solicitudes HTTP para obtener datos relacionados con el establecimiento.
 */
@Injectable({
  providedIn: 'root',
})
export class EstablecimientoService {
  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient,
    private tramiteStore: DatosDelSolicituteSeccionStateStoreI,
  private tramiteStoreData: DatosDelSolicituteSeccionStateStore,
  private tramite260909: PermisoImportacionBiologicaStore
  ) {
    //constructor
  }

  /**
   * Obtiene los datos del catálogo de SCIAN.
   * @returns {Observable<Catalogo[]>} Un observable con los datos del catálogo de SCIAN.
   */
  getSciandata(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260401/scianda.json');
  }

  /**
   * Obtiene los datos de justificación.
   * @returns {Observable<PropietarioTipoPersona[]>} Un observable con los datos de justificación.
   */
  getJustificationData(): Observable<PropietarioTipoPersona[]> {
    return this.http.get<PropietarioTipoPersona[]>('assets/json/cofepris/justificacion.json');
  }
  /**
   * Obtiene los datos de un establecimiento por su ID.
   * @param id ID del establecimiento.
   * @returns {Observable<Catalogo[]>} Un observable con los datos del establecimiento.
   */
  getEstadodata(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/260401/scianda.json');
  }
  /**
   * 
   * @returns {Observable<DatosDelSolicituteSeccionStateInterface>} Un observable con los datos del establecimiento.
   * @description
   */
  getPagoDerechos(): Observable<DatosDelSolicituteSeccionStateInterface> {
      return this.http.get<DatosDelSolicituteSeccionStateInterface>('assets/json/260909/serviciosExtraordinarios260909.json');
    }
    /**
     * 
     * @returns {Observable<DatosDomicilioLegalStore>} Un observable con los datos del estado de derechos.
     * @description
     */
    getEstadoDerechos(): Observable<DatosDelSolicituteSeccionState> {
    return this.http.get<DatosDelSolicituteSeccionState>('assets/json/260909/serviciosExtraordinarios.json');
  }
  /**
   * 
   * @param DATOS Datos del solicitante que se actualizarán en el estado del formulario.
   * @description
   */
  actualizarEstadoFormulario(DATOS: DatosDelSolicituteSeccionStateInterface): void {
  this.tramiteStore.setEstablecimientoCorreoElectronico(DATOS.establecimientoCorreoElectronico);
  this.tramiteStore.setEstablecimientoDomicilioCodigoPostal(DATOS.establecimientoDomicilioCodigoPostal);
  this.tramiteStore.setIdeGenerica1(DATOS.ideGenerica1);
  this.tramiteStore.setObservaciones(DATOS.observaciones);
  this.tramiteStore.setEstablecimientoRFCResponsableSanitario(DATOS.establecimientoRFCResponsableSanitario);
  this.tramiteStore.setEstablecimientoRazonSocial(DATOS.establecimientoRazonSocial);
  this.tramiteStore.setEstablecimientoEstados(DATOS.establecimientoEstados);
  this.tramiteStore.setDescripcionMunicipio(DATOS.descripcionMunicipio);
  this.tramiteStore.setLocalidad(DATOS.localidad);
  this.tramiteStore.setColonias(DATOS.colonias);
  this.tramiteStore.setCalle(DATOS.calle);
  this.tramiteStore.setLada(DATOS.lada);
  this.tramiteStore.setTelefono(DATOS.telefono);
  this.tramiteStore.setScian(DATOS.scian);
  this.tramiteStore.setEstablishomentoColonias(DATOS.establishomentoColonias);
  this.tramiteStore.setNoLicenciaSanitaria(DATOS.noLicenciaSanitaria);
  this.tramiteStore.setAvisoCheckbox(DATOS.avisoCheckbox);
  this.tramiteStore.setLicenciaSanitaria(DATOS.licenciaSanitaria);
  this.tramiteStore.setRegimen(DATOS.regimen);
  this.tramiteStore.setAduanasEntradas(DATOS.aduanasEntradas);
  this.tramiteStore.setDescripcionScian(DATOS.descripcionScian);
}
  /**
   * 
   * @param DATOS Datos del solicitante que se actualizarán en el estado del formulario.
   * @description Actualiza el formulario con los datos proporcionados.
   */
  actualizarFormulario(DATOS: DatosDelSolicituteSeccionState): void {
    this.tramiteStoreData.setRepresentanteRfc(DATOS.representanteRfc);
    this.tramiteStoreData.setRepresentanteNombre(DATOS.representanteNombre);
    this.tramiteStoreData.setRepresentanteApellidos(DATOS.apellidoPaterno, DATOS.apellidoMaterno);
    this.tramiteStoreData.setInformacionConfidencial(DATOS.informacionConfidencialRadio);
    this.tramiteStoreData.setManifests(DATOS.manifests);
  }

  /**
   * Obtiene los datos del pago de derechos.
   * @returns {Observable<PermisoImportacionBiologicaState>} Un observable con los datos del pago de derechos.
   */
  getPagoDerechosDatos(): Observable<PermisoImportacionBiologicaState> {
      return this.http.get<PermisoImportacionBiologicaState>('assets/json/260909/pago-derechos.json');
  }

  /**
   * Actualiza los datos relacionados con el pago de derechos en el formulario,
   * utilizando la información proporcionada en el estado de PermisoImportacionBiologica.
   *
   * @param DATOS - Objeto que contiene los datos necesarios para actualizar el pago de derechos,
   * incluyendo clave de referencia, cadena de la dependencia, llave de pago, fecha e importe.
   */
  actualizarPagoDerechosFormulario(DATOS: PermisoImportacionBiologicaState): void {
      this.tramite260909.setClaveDeReferncia(DATOS.setClaveDeReferncia);
      this.tramite260909.setCadenaDeLaDependencia(DATOS.setCadenaDeLaDependencia);
      this.tramite260909.setLlaveDePago(DATOS.setLlaveDePago);
      this.tramite260909.setFechaDePago(DATOS.setFechaDePago);
      this.tramite260909.setImporteDePago(DATOS.setImporteDePago);
      this.tramite260909.setBanco(DATOS.setBanco);
  }

  /**
   * Obtiene los datos del catálogo SCIAN desde un archivo JSON.
   * @returns Un observable que emite la respuesta JSON con los datos del catálogo SCIAN.
   */
  getScianTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/260909/scian-tabla-datos.json');
  }

  /**
   * Obtiene los datos del catálogo de mercancías desde un archivo JSON.
   * @returns Un observable que emite la respuesta JSON con los datos del catálogo de mercancías.
   */
  getMercanciasTablaDatos(): Observable<JSONResponse> {
    return this.http.get<JSONResponse>('assets/json/260909/mercancias-tabla-datos.json');
  }


}