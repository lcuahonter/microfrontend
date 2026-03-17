import { AbstractControl } from '@angular/forms';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { DatosProcedureState } from '../../../estados/tramites/tramites261101.store';
import { DatosProcedureStore } from '../../../estados/tramites/tramites261101.store';
import { Domicilio } from '../modelos/domicilio-establecimientos.model';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancias } from '../modelos/mercancias.model';
import { Observable } from 'rxjs';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { ScianData } from '../../../shared/models/datos-modificacion.model';
import { TramiteAsociados } from '../../../shared/models/tramite-asociados.model';

@Injectable({
  providedIn: 'root'
})  

export class DatosSolicitudService {

  /**
 * Lista de catálogos relacionados con los bancos.
 * 
 * Esta propiedad almacena los datos de los catálogos obtenidos desde un archivo JSON
 * que contienen información sobre los bancos disponibles para el pago de derechos.
 */
  banco!: Catalogo[];
  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient,private store: DatosProcedureStore) {
    // No se necesita lógica de inicialización adicional.
    
  }


  /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
   static isValid(control: AbstractControl, campo?: string): boolean | null {
    if (control instanceof FormGroup && campo) {
      return control?.controls[campo]?.errors && control?.controls[campo]?.touched;
    }
    return control?.errors && control?.touched;
  }


    /**
   * Valida si el campo de un formulario no contiene errores
   * @param {AbstractControl} control  : Control del formulario
   * @param {string} campo  : si el control es un FormGroup
   * @returns {boolean | null} : Retorna true si el campo contiene errores y ha sido tocado, de lo contrario retorna false
   */
    static isValidForm(control: AbstractControl, campo?: string): boolean | null {
      if (control instanceof FormGroup && campo) {
        return control?.controls[campo]?.errors && control?.controls[campo]?.touched;
      }
      return control?.errors && control?.touched;
    }

  
  /**
   * Obtiene los datos de los domicilios de los establecimientos desde un archivo JSON.
   * 
   * @returns {Observable<Domicilio[]>} Un observable que emite una lista de objetos `Domicilio` con los datos de los domicilios.
   */
  getDomicilioData(): Observable<Domicilio[]> {
    return this.http.get<Domicilio[]>('assets/json/261101/domicilio-establecimientos.json');
  }
  
  /**
   * Obtiene los datos de las mercancías desde un archivo JSON.
   * 
   * @returns {Observable<Mercancias[]>} Un observable que emite una lista de objetos `Mercancias` con los datos de las mercancías.
   */
  getMercanciasData(): Observable<Mercancias[]> {
    return this.http.get<Mercancias[]>('assets/json/261101/mercancias.json');
  }

   /**
   * Obtiene los datos de las aduanas desde un archivo JSON.
   * 
   * @returns {Observable<Domicilio[]>} Un observable que emite una lista de objetos `Domicilio` con los datos de las aduanas.
   */
   getAduanaData(): Observable<Domicilio[]> {
    return this.http.get<Domicilio[]>('assets/json/261101/aduana.json');
  }

    /**
     * Obtiene los datos de la tabla SCIAN desde un archivo JSON.
     * @returns Un observable que emite una lista de objetos `ScianData` con los datos de la tabla SCIAN.
     */
    obternerDatosData(): Observable<ScianData[]> {
      return this.http.get<ScianData[]>('assets/json/261101/datos-scian-tabla.json');
    }
      /**
       * Obtiene los trámites asociados desde un archivo JSON.
       *
       * {Observable<TramiteAsociados[]>} Un observable con la lista de trámites asociados.
       */
      obtenerTramitesAsociados(): Observable<TramiteAsociados[]> {
        return this.http.get<TramiteAsociados[]>(
          'assets/json/261101/tramite-asociados.json'
        );
      }

      
  /**
   * Inicializa los datos de los catálogos relacionados con el pago de derechos.
   */
  inicializaPagoDeDerechosDatosCatalogos(): void {
    this.obtenerRespuestaPorUrl(this, 'banco', '/261101/banco.json');
  }
        /**
         * Obtiene una respuesta desde una URL y asigna los datos a una variable.
         * {AutorizacionesDeVidaSilvestreService} self - El objeto que contiene la variable donde se almacenarán los datos de la respuesta.
         * {keyof AutorizacionesDeVidaSilvestreService} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
         * {string} url - La URL desde la cual se obtendrá la respuesta.
         * {void}
         *
         * Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
         * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
         * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
         */
        obtenerRespuestaPorUrl(
          self: DatosSolicitudService,
          variable: keyof DatosSolicitudService,
          url: string
        ): void {
          if (self && variable && url) {
            this.http
              .get<RespuestaCatalogos>(`assets/json${url}`)
              .subscribe((resp): void => {
                (self[variable] as Catalogo[]) =
                  resp?.code === 200 && resp.data ? resp.data : [];
              });
          }
        }
  /**
   * Obtiene los datos del registro del paso uno.
   * @returns {Observable<PasoUno>} : Retorna un observable con los datos del paso uno.
   */
  getRegistroPasoUnoData(): Observable<DatosProcedureState> {
    return this.http.get<DatosProcedureState>('assets/json/261101/tramites-datos.json');
  }
  /**
 * Actualiza el estado del formulario con los datos proporcionados.
 * 
 * Este método toma un objeto `DatosProcedureState` y lo utiliza para actualizar
 * el estado almacenado en el `store`. Es útil para sincronizar los datos del formulario
 * con el estado global de la aplicación.
 * 
 * @param {DatosProcedureState} DATOS - Los datos que se utilizarán para actualizar el estado del formulario.
 * 
 * @returns {void}
 */
  actualizarEstadoFormulario(DATOS: DatosProcedureState): void {
    this.store.establecerDatos(DATOS);
  }
}
