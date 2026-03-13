import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Catalogo } from '@ng-mf/data-access-user';

import { Solicitud110218State ,Tramite110218Store} from '../estados/tramites/tramite110218.store';

/**
 * Servicio para gestionar la información relacionada con el Certificado Técnico Japón.
 */
@Injectable({
  providedIn: 'root'
})
export class CertificadoTecnicoJaponService {

  /**
   * Constructor del servicio.
   * @param http Cliente HTTP para realizar peticiones.
   * @param estado Estado global del trámite.
   */
  constructor(private http: HttpClient,private estado :Tramite110218Store) { }

  /**
   * Obtiene los datos del certificado técnico Japón.
   */
  getDatosCertificado(): Observable<{ [key: string]: string | number | boolean }> {
    return this.http.get<{ [key: string]: string | number | boolean }>('assets/json/110218/certificado-tecnico-japon.json');
  }

  /**
   * Obtiene los tratados relacionados.
   */
  gettratados(): Observable<{ tratadoAcuerdo: string; paisBloque: string; paisdeOrigen: string; paisDestino: string; fechadeExpedicion: string; fechadeVencimiento: string }> {
    return this.http.get<{ tratadoAcuerdo: string; paisBloque: string; paisdeOrigen: string; paisDestino: string; fechadeExpedicion: string; fechadeVencimiento: string }>('assets/json/110218/tratados.json');
  }

  /**
   * Obtiene el representante legal.
   */
  getrepresentante(): Observable<{ empresa: string }> {
    return this.http.get<{ empresa: string }>('assets/json/110218/representante-legal.json');
  }
 
  /**
   * Obtiene el catálogo de unidades de medida.
   */
  getUnidadMedida():Observable<Catalogo[]>{
    return this.http.get<Catalogo[]>('assets/json/110218/unidad-medida.json');
  }
  
  /**
   * Obtiene el catálogo de tipos de factura.
   */
  getTipodeFctura():Observable<Catalogo[]>{
    return this.http.get<Catalogo[]>('assets/json/110218/tipo-de-factura.json');
  }

  /**
   * Obtiene el registro actual del trámite.
   */
  obtenerRegistro(): Observable<Solicitud110218State> {
    return this.http.get<Solicitud110218State>('./assets/json/110218/datos.json');
  }

  /**
   * Actualiza el estado global del trámite con los datos proporcionados.
   * @param {Tramite110102State} registro - Los datos del registro que se actualizarán en el estado global.
   */
  actualizarRegistro(registro: Solicitud110218State): void {
    this.estado.setTramite110218State({
      ...registro
    });
  }

  /** Actualiza el estado del formulario en el store con los datos proporcionados.  
 *  Establece el régimen seleccionado desde el objeto de estado.
 *  */
  actualizarEstadoFormulario(DATOS: Solicitud110218State): void {
    this.estado.update(DATOS);
  }

/** Obtiene los datos simulados del registro de toma de muestras de mercancías  
 *  desde un archivo JSON local para el trámite 110203. */
  getRegistroTomaMuestrasMercanciasData(): Observable<Solicitud110218State> {
    return this.http.get<Solicitud110218State>('assets/json/110203/serviciosExtraordinarios.json');
  }
}