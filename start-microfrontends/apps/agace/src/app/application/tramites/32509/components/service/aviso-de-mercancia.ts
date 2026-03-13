/**
 * @description
 * Servicio encargado de obtener y actualizar los datos del formulario de aviso de mercancía para el trámite 32509.
 * Permite la obtención de datos desde un archivo JSON local y la actualización del estado del formulario en el store correspondiente.
 * 
 * @author Equipo VUCEM
 * @since 2025
 */

import { DestruccionState, DestruccionStore } from '../../estados/Tramite32509.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { DestruccionQuery } from '../../estados/Tramite32509.query';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';


/**
 * @descripcion
 * Decorador que marca la clase como un servicio inyectable y la registra en el inyector raíz de Angular.
 * Esto permite que el servicio esté disponible en toda la aplicación sin necesidad de declararlo en los providers de un módulo específico.
 * 
 * @see https://angular.io/api/core/Injectable
 */
@Injectable({
  providedIn: 'root'
})

export class AvisoDeMercanciaService {
  /**
   * Constructor del servicio AvisoDeMercanciaService.
   * 
   * @param httpClient Cliente HTTP para realizar solicitudes a archivos o servicios externos.
   * @param store Store para gestionar el estado de destrucción.
   * @param query Query para consultar el estado de destrucción.
   */
  constructor(
    private httpClient: HttpClient, 
    private store: DestruccionStore,
    private query: DestruccionQuery,
  ) {}

  /**
   * @method getAcuiculturaData
   * Obtiene los datos del formulario de certificados de origen desde un archivo JSON local.
   * @returns {Observable<DestruccionState>} Observable con el estado del trámite.
   */
  public getAcuiculturaData(): Observable<DestruccionState> {
    return this.httpClient.get<DestruccionState>('assets/json/32509/tipo_form.json');
  }

/**
 * @method getEntidadFederativaData
 * Obtiene los datos de las entidades federativas desde un archivo JSON local.
 * 
 * @returns {Observable<Catalogo[]>} Observable con la lista de entidades federativas.
 */
getEntidadFederativaData(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('assets/json/32509/domicilio.json');
}

/**
* @method getAlcaldiaMunicipo
* Obtiene los datos de las alcaldías o municipios desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de alcaldías o municipios.
*/
getAlcaldiaMunicipo(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('./assets/json/32509/alcaldio.json');
}

/**
* @method getColonia
* Obtiene los datos de las colonias desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de colonias.
*/
getColonia(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('./assets/json/32509/colonia.json');
}

/**
* @method getMerccanciaEntidadFederativa
* Obtiene los datos de las entidades federativas relacionadas con la mercancía desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de entidades federativas de la mercancía.
*/
getMerccanciaEntidadFederativa(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('./assets/json/32509/domicilio.json');
}

/**
* @method getMerccanciaAlcaldiaMunicipo
* Obtiene los datos de las alcaldías o municipios relacionados con la mercancía desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de alcaldías o municipios de la mercancía.
*/
getMerccanciaAlcaldiaMunicipo(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('./assets/json/32509/alcaldiaomunicipio.json');
}

/**
* @method getMerccanciaColonia
* Obtiene los datos de las colonias relacionadas con la mercancía desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de colonias de la mercancía.
*/
getMerccanciaColonia(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('./assets/json/32509/mercanciascolonia.json');
}

/**
* @method getTarifa
* Obtiene los datos de las tarifas desde un archivo JSON local.
* 
* @returns {Observable<Catalogo[]>} Observable con la lista de tarifas.
*/
getTarifa(): Observable<Catalogo[]> {
  return this.httpClient.get<Catalogo[]>('./assets/json/32509/unidaddemedia.json');
}

  /**
   * @method actualizarEstadoFormulario
   * Actualiza el estado completo del formulario en el store de acuicultura.
   * Cada campo del objeto recibido es asignado al store correspondiente.
   * 
   * @param DATOS Objeto de tipo DestruccionState con los datos a actualizar.
   */
  public actualizarEstadoFormulario(DATOS: DestruccionState): void {
    this.store.setTipoDeAviso(DATOS.tipoDeAviso);
    this.store.setNombre(DATOS.nombre);
    this.store.setRfc(DATOS.rfc);
    this.store.setEntidadFederativa(DATOS.entidadFederativa);
    this.store.setAlcaldiaMunicipo(DATOS.alcaldiaMunicipo);
    this.store.setColonia(DATOS.colonia);
    this.store.setCalle(DATOS.calle);
    this.store.setNumeroExterior(DATOS.numeroExterior);
    this.store.setNumeroInterior(DATOS.numeroInterior);
    this.store.setCodigoPostal(DATOS.codigoPostal);
    this.store.setCartaCupo(DATOS.cartaCupo);
    this.store.setNumeraDeAcuse(DATOS.numeraDeAcuse);
    this.store.setDestruccionMercancia(DATOS.destruccionMercancia);
    this.store.setMerccanciaEntidadFederativa(DATOS.merccanciaEntidadFederativa);
    this.store.setMerccanciaAlcaldiaMunicipo(DATOS.merccanciaAlcaldiaMunicipo);
    this.store.setMerccanciaColonia(DATOS.merccanciaColonia);
    this.store.setMerccanciaCalle(DATOS.merccanciaCalle);
    this.store.setMerccanciaNumeroExterior(DATOS.merccanciaNumeroExterior);
    this.store.setMerccanciaNumeroInterior(DATOS.merccanciaNumeroInterior);
    this.store.setMerccanciaCodigoPostal(DATOS.merccanciaCodigoPostal);
    this.store.setDestruir(DATOS.destruir);
    this.store.setTarifa(DATOS.tarifa);
    this.store.setDestruccionEntidadFederativa(DATOS.destruccionEntidadFederativa);
    this.store.setDestruccionAlcaldiaMunicipo(DATOS.destruccionAlcaldiaMunicipo);
    this.store.setDestruccionColonia(DATOS.destruccionColonia);
    this.store.setDestruccionCalle(DATOS.destruccionCalle);
    this.store.setDestruccionNumeroExterior(DATOS.destruccionNumeroExterior);
    this.store.setDestruccionNumeroInterior(DATOS.destruccionNumeroInterior);
    this.store.setDestruccionCodigoPostal(DATOS.destruccionCodigoPostal);
    this.store.setDestruccionHora(DATOS.destruccionHora);
    this.store.setDesturccionProceso(DATOS.desturccionProceso);
    this.store.setCasofortuito(DATOS.casofortuito);
    this.store.setDonoMercancia(DATOS.donoMercancia);
    this.store.setCondicionesMateriales(DATOS.condicionesMateriales);
    this.store.setCaboDestruccionFecha(DATOS.caboDestruccionFecha);
  }
}