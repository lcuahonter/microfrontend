import { AvisocalidadStore, SolicitudState } from '../estados/stores/aviso-calidad.store';
import {DatosDomicilioLegalState, DatosDomicilioLegalStore,} from '../../shared/estados/stores/datos-domicilio-legal.store';
import { EstadoCombinado } from '../models/solicitud.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SolicitudService {

  /**
   * @description
   * Servicio que gestiona la lógica de negocio relacionada con la solicitud de aviso de funcionamiento.
   * Permite actualizar el estado del formulario y obtener datos iniciales para la solicitud.
   */
  constructor(private http: HttpClient,
    private avisocalidadStore: AvisocalidadStore,
    private datosDomicilioLegalStore: DatosDomicilioLegalStore
  ) {
    // Lógica de inicialización si es necesario
  }

  /**
   * @description
   * Actualiza el estado del formulario con los datos proporcionados.
   * Utiliza el store para establecer los valores de cada campo del formulario.
   * @param DATOS - Objeto que contiene los datos de la solicitud.
   */
  actualizarEstadoFormulario(DATOS: EstadoCombinado): void { 
    const SOLICITUD_STATE: SolicitudState = DATOS.solicitudState;
    const DATOS_DOMICILIO_LEGAL_STATE: DatosDomicilioLegalState = DATOS.datosDomicilioLegalState;
    this.avisocalidadStore.setRfcDel(SOLICITUD_STATE.rfcDel);
    this.avisocalidadStore.setDenominacionRazonSocial(SOLICITUD_STATE.denominacionRazonSocial);
    this.avisocalidadStore.setCorreoElectronico(SOLICITUD_STATE.correoElectronico);
    this.avisocalidadStore.setCodigoPostal(SOLICITUD_STATE.codigoPostal);
    this.avisocalidadStore.setEstado(SOLICITUD_STATE.estado);
    this.avisocalidadStore.setMuncipio(SOLICITUD_STATE.muncipio);
    this.avisocalidadStore.setLocalidad(SOLICITUD_STATE.localidad);
    this.avisocalidadStore.setColonia(SOLICITUD_STATE.colonia);
    this.avisocalidadStore.setCalle(SOLICITUD_STATE.calle);
    this.avisocalidadStore.setLada(SOLICITUD_STATE.lada);
    this.avisocalidadStore.setTelefono(SOLICITUD_STATE.telefono);
    this.avisocalidadStore.setAvisoCheckbox(SOLICITUD_STATE.avisoCheckbox);
    this.avisocalidadStore.setLicenciaSanitaria(SOLICITUD_STATE.licenciaSanitaria);
    this.avisocalidadStore.setclaveReferencia(SOLICITUD_STATE.claveReferencia);
    this.avisocalidadStore.setcadenaDependencia(SOLICITUD_STATE.cadenaDependencia);
    this.avisocalidadStore.setbanco(SOLICITUD_STATE.banco);
    this.avisocalidadStore.setllavePago(SOLICITUD_STATE.llavePago);
    this.avisocalidadStore.setfechaPago(SOLICITUD_STATE.fechaPago);
    this.avisocalidadStore.setimportePago(SOLICITUD_STATE.importePago);
    this.avisocalidadStore.setClaveScianModal(SOLICITUD_STATE.claveScianModal);
    this.avisocalidadStore.setClaveDescripcionModal(SOLICITUD_STATE.claveDescripcionModal);
    this.avisocalidadStore.setNombreComercial(SOLICITUD_STATE.nombreComercial);
    this.avisocalidadStore.setNombreComun(SOLICITUD_STATE.nombreComun);
    this.avisocalidadStore.setNombreCientifico(SOLICITUD_STATE.nombreCientifico);
    this.avisocalidadStore.setUsoEspecifico(SOLICITUD_STATE.usoEspecifico);
    this.avisocalidadStore.setEstadoFisico(SOLICITUD_STATE.estadoFisico);
    this.avisocalidadStore.setFraccionArancelaria(SOLICITUD_STATE.fraccionArancelaria);
    this.avisocalidadStore.setDescripcionFraccion(SOLICITUD_STATE.descripcionFraccion);
    this.avisocalidadStore.setCantidadUMT(SOLICITUD_STATE.cantidadUMT);
    this.avisocalidadStore.setUMT(SOLICITUD_STATE.UMT);
    this.avisocalidadStore.setCantidadUMC(SOLICITUD_STATE.cantidadUMC);
    this.avisocalidadStore.setUMC(SOLICITUD_STATE.UMC);
    this.avisocalidadStore.setNumerocas(SOLICITUD_STATE.numeroCas);
    this.avisocalidadStore.setPorcentajeConcentracion(SOLICITUD_STATE.porcentajeConcentracion);
    this.avisocalidadStore.setClasificacionToxicologica(SOLICITUD_STATE.clasificacionToxicologica);
    this.avisocalidadStore.setObjetoImportacion(SOLICITUD_STATE.objetoImportacion);
    this.datosDomicilioLegalStore.setCumplimiento(DATOS_DOMICILIO_LEGAL_STATE.cumplimiento);
    this.datosDomicilioLegalStore.setRfc(DATOS_DOMICILIO_LEGAL_STATE.rfc);
    this.datosDomicilioLegalStore.setNombre(DATOS_DOMICILIO_LEGAL_STATE.nombre);
    this.datosDomicilioLegalStore.setApellidoPaterno(DATOS_DOMICILIO_LEGAL_STATE.apellidoPaterno);
    this.datosDomicilioLegalStore.setApellidoMaterno(DATOS_DOMICILIO_LEGAL_STATE.apellidoMaterno);
  }

  /**
   * @description
   * Obtiene los datos iniciales para la solicitud de aviso de funcionamiento.
   * Carga los datos desde un archivo JSON local.
   * @returns Observable<SolicitudState> - Un observable que emite el estado de la solicitud.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<EstadoCombinado> {
    return this.http.get<EstadoCombinado>('assets/json/cofepris/permiso-de-importacion.json');
  }

}
