import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movilizacion } from '../modelos/datos-generales.model';
import { Observable } from 'rxjs';
import { PagoDeDerechos } from '../modelos/pago-de-derechos.model';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';

/**
 * Servicio para gestionar las revisiones.
 */
@Injectable({
  providedIn: 'root'
})
export class RevisionService {
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - El cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) { 
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * Obtiene los datos de la aduana de ingreso.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la aduana de ingreso.
   */
  getAduanaIngreso(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/aduana-ingreso.json');
  }

  /**
   * Obtiene los datos de la oficina de inspección.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la oficina de inspección.
   */
  getOficianaInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/oficiana-de-inspeccion.json');
  }

  /**
   * Obtiene los datos del punto de inspección.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de inspección.
   */
  getPuntoInspeccion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/punto-de-inspeccion.json');
  }

  /**
   * Obtiene los datos del establecimiento.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del establecimiento.
   */
  getEstablecimiento(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/establecimiento.json');
  }

  /**
   * Obtiene los datos del veterinario.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del veterinario.
   */
  getVeterinario(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220701/nombre.json');
  }

  /**
   * Obtiene los datos del régimen al que se destinarán las mercancías.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del régimen.
   */
  getRegimenDestinaran(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/regimen-destinaran.json');
  }

  /**
   * Obtiene los datos de la movilización nacional.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la movilización nacional.
   */
  getMovilizacionNacional(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/movilizacion-nacional.json');
  }

  /**
   * Obtiene los datos del punto de verificación.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del punto de verificación.
   */
  getPuntoVerificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/punto-verificacion.json');
  }

  /**
   * Obtiene los datos de la empresa transportista.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la empresa transportista.
   */
  getEmpresaTransportista(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/empresa-transportista.json');
  }

  /**
   * Obtiene los datos de la justificación.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos de la justificación.
   */
  getJustificacion(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/justificacion.json');
  }

  /**
   * Obtiene los datos del banco.
   * 
   * @returns {Observable<RespuestaCatalogos>} - Los datos del banco.
   */
  getBanco(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>('assets/json/220501/banco.json');
  }

  /** 
   * Servicio para obtener datos relacionados con la solicitud. 
   * @returns {Observable<PagoDeDerechos>} - Los datos del pago de derechos.
   */
  getPagoDeDerechos(): Observable<PagoDeDerechos> {
    return this.http.get<PagoDeDerechos>('assets/json/220501/pago-de-derechos.json');
  }

  /** 
   * Servicio para obtener los datos de movilización. 
   * @returns {Observable<Movilizacion>} - Los datos de la movilización.
   */
  getMovilizacion(): Observable<Movilizacion> {
    return this.http.get<Movilizacion>('assets/json/220501/movilizacion.json');
  }
}