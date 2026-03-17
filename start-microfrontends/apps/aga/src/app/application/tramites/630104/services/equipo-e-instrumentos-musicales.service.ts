import { Tramite630104State, Tramite630104Store } from '../estados/tramites/tramite630104.store';
import { Catalogo } from '@ng-mf/data-access-user';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar la importación de vehículos y equipos e instrumentos musicales.
 * Este servicio proporciona métodos para obtener datos relacionados con la importación,
 * como listas de países, entidades federativas, representaciones federales y opciones de productos.
 */
@Injectable({
  providedIn: 'root',
})
export class EquipoEInstrumentosMusicalesService {
  private formsMap: { [key: string]: FormGroup } = {};
  private formValues: { [key: string]: unknown } = {};
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http Servicio HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient, private tramite630104Store:Tramite630104Store) {
    //
  }


  /**
   * Obtiene la lista de secciones aduaneras desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getSeccionAduanera(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/seccion-aduanera.json');
  }

  /**
   * Obtiene la lista de aduanas de ingreso desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getAduanaDeIngreso(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/aduana-de-ingreso.json');
  }

  /**
   * Obtiene la lista de propietarios desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getPropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/propietario.json');
  }

  /**
   * Obtiene la lista de tipos de propietarios desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getTipoDePropietario(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/tipo-de-propietario.json');
  }

  /**
   * Obtiene la lista de consultas por RFC desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getconsultarPorRFC(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/consultar-por-rfc.json');
  }

  /**
   * Obtiene la lista de tipos de representantes desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getTipoDeRepresentante(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/tipo-de-representante.json'); 
  }

  /**
   * Obtiene la lista de países desde un archivo JSON local.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite un arreglo de objetos tipo Catalogo.
   */
  getPais(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/630104/pais.json');
  }

  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite630104State): void {
    this.tramite630104Store.actualizarEstado(DATOS);
  }

  /**
  * Obtiene los datos de la solicitud.
  * @returns Observable con los datos de la solicitud.
  */
  getDatosDeLaSolicitud(): Observable<Tramite630104State> {
    return this.http.get<Tramite630104State>('assets/json/630104/datos-de-la-solicitud.json');
  }

  setForm(key: string, form: FormGroup): void {
    this.formsMap[key] = form;
    this.formValues[key] = form.value;
  }

}