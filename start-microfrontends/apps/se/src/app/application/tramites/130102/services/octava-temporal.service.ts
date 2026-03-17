import { FormGroup } from '@angular/forms';

import { Catalogo, ENVIRONMENT } from '@libs/shared/data-access-user/src';

import { Injectable } from '@angular/core';

import { Solicitud130102State, Tramite130102Store } from '../../../estados/tramites/tramite130102.store';

import { FraccionArancelariaProsec, OctavaTemporal } from '../models/octava-temporal.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Servicio inyectable disponible en toda la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class FormularioRegistroService {
    /**
  * AppConfig es una inyección de dependencias que proporciona la configuración de la aplicación.
  */
  urlServer = ENVIRONMENT.URL_SERVER;

  /**
  * URL base para los catálogos auxiliares en formato JSON.
  */
  urlServerCatalogos = ENVIRONMENT.URL_SERVER_JSON_AUXILIAR;
  constructor(private http: HttpClient ,private tramite130102store: Tramite130102Store){

  }
  /**
   * Mapa que almacena los formularios registrados.
   */
  private formularios = new Map<string, FormGroup>();

  /**
   * Registra un formulario con una clave específica.
   * 
   * @param key - Clave identificadora del formulario.
   * @param formulario - Formulario reactivo a registrar.
   */
  registrarFormulario(key: string, formulario: FormGroup): void {
    this.formularios.set(key, formulario);
  }

  /*
   * Elimina un formulario registrado por su clave.
  */
  quitarFormulario(key: string): void {
    this.formularios.delete(key);
  }

  /**
   * Valida todos los formularios registrados.
   * Marca todos los campos como tocados y actualiza la validez.
   * 
   * @returns true si todos los formularios son válidos, false en caso contrario.
   */
  validarTodosFormularios(): boolean {
    let todosValidos = true;

    this.formularios.forEach(formulario => {
      formulario.markAllAsTouched();
      formulario.updateValueAndValidity();

      if (formulario.invalid) {
        todosValidos = false;
      }
    });

    return todosValidos;
  }

  /**
   * Resetea todos los formularios registrados.
   * 
   */

  resetFormularios(): void {
    this.formularios.forEach(formulario => {
      formulario.reset();
    });
  }
  /**
   * Obtiene un formulario registrado por su clave.
   * 
   * @param key - Clave identificadora del formulario.
   * @returns FormGroup asociado a la clave, o undefined si no existe.
   */
  getEntidadesFederativas(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/130102/entidad_federativa.json');
}
  /**
   * Obtiene las representaciones estatales desde un archivo JSON.
   * @returns Observable que emite un array de objetos Catalogo.
   */
getFraccionArancelariaTIGIE(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/130102/partidas-de-la-catalogos-select.json');
}
  
/*
* Obtiene las representaciones federales desde un archivo JSON.
* @returns Observable que emite un array de objetos Catalogo.
*/
getRepresentacionesFederales(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('assets/json/130102/representacion_federal.json');
}
  /*
  * Obtiene los datos de la solicitud desde un archivo JSON.
  * @returns Observable que emite el estado de la solicitud.
  */
   getSolicitudData(): Observable<Solicitud130102State> {
    return this.http.get<Solicitud130102State>('assets/json/130102/solicitude_data.json');
  }
  /**
   * Obtiene un formulario registrado por su clave.
   * @param key - Clave identificadora del formulario.
   * @returns FormGroup asociado a la clave, o undefined si no existe.
   */
  getPartidasFromJson(): Observable<OctavaTemporal[]> {
  return this.http.get<OctavaTemporal[]>('assets/json/130102/partidas.json');
}
/*
  * Obtiene las fracciones arancelarias de uso específico desde un archivo JSON.
  * @returns Observable que emite un array de objetos FraccionArancelariaProsec.
  */
getFraccionesUsoEspecifico(): Observable<FraccionArancelariaProsec[]> {
  return this.http.get<FraccionArancelariaProsec[]>('assets/json/130102/uso-especifico.json');
}
/*
  * Actualiza el estado del formulario con los datos proporcionados.
  * @param {Solicitud130102State} DATOS - Datos de la solicitud a actualizar.
  */
 actualizarEstadoFormulario(DATOS: Solicitud130102State): void {
  
    this.tramite130102store.setCriterioDictamen(DATOS.criterioDictamen);
    this.tramite130102store.setFraccion(DATOS.fraccion);
    this.tramite130102store.setDescripcion(DATOS.descripcion);
    this.tramite130102store.setFraccionArancelaria(DATOS.fraccionArancelaria);
    this.tramite130102store.setUnidadMedida(DATOS.unidadMedida);
    this.tramite130102store.setcantidad(DATOS.cantidad);
    this.tramite130102store.setValorFacturaUSD(DATOS.valorFacturaUSD);
    this.tramite130102store.setCantidad_partidas(DATOS.cantidadPartidas);
    this.tramite130102store.setFraccionArancelariaTIGIE(DATOS.fraccionArancelariaTIGIE);
    this.tramite130102store.setFraccionArancelariaTIGIE_TIGIE(DATOS.fraccionArancelariaTIGIE_TIGIE);
    this.tramite130102store.setdescripcion_partidas(DATOS.descripcionPartidas);
    this.tramite130102store.setvalorPartidaUSD(DATOS.valorPartidaUSD);
    this.tramite130102store.setFraccionArancelariaProsec(DATOS.fraccionArancelariaProsec);
    this.tramite130102store.setsolicitudMercancia(DATOS.solicitudMercancia);
    this.tramite130102store.setEntidad(DATOS.entidad);
    this.tramite130102store.setRepresentacion(DATOS.representacion);
    this.tramite130102store.setBloque(DATOS.bloque);
    this.tramite130102store.setDescripcionJustificacion(DATOS.descripcionJustificacion);
    this.tramite130102store.setObservaciones(DATOS.observaciones);
    this.tramite130102store.setProducto(DATOS.productos);
    this.tramite130102store.setSolicitude(DATOS.solicitud);
    this.tramite130102store.setcantidadTotal(DATOS.cantidadTotal);
    this.tramite130102store.setvalorTotalUSD(DATOS.valorTotalUSD);

   
  }
}
