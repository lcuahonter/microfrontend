import { Catalogo, Fabricante, Otros } from '@libs/shared/data-access-user/src';
import { AbstractControl } from '@angular/forms';
import { DatosProcedureState } from '../estados/tramites261103.store';
import { DatosProcedureStore } from '../estados/tramites261103.store';
import { Domicilio } from '../modelos/domicilio-establecimientos.model';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercancias } from '../modelos/mercancias.model';
import { Observable } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { ScianData } from '../../../shared/models/datos-modificacion.model';
import { Subject } from 'rxjs';
import { TramiteAsociados } from '../../../shared/models/tramite-asociados.model';
import { takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})  

export class ModificacionPermisoImportacionMedicamentosService implements OnDestroy {

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

  /**
 * Notificador para gestionar la destrucción de suscripciones.
 * 
 * Esta propiedad es un `Subject` que se utiliza para emitir un evento de finalización
 * y cancelar todas las suscripciones activas cuando el componente o servicio es destruido.
 */
private destroyNotifier$: Subject<void> = new Subject<void>();

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
    return this.http.get<Domicilio[]>('assets/json/261103/domicilio-establecimientos.json');
  }
  
  /**
   * Obtiene los datos de las mercancías desde un archivo JSON.
   * 
   * @returns {Observable<Mercancias[]>} Un observable que emite una lista de objetos `Mercancias` con los datos de las mercancías.
   */
  getMercanciasData(): Observable<Mercancias[]> {
    return this.http.get<Mercancias[]>('assets/json/261103/mercancias.json');
  }

  /**
   * Obtiene los datos de las aduanas desde un archivo JSON.
   * 
   * @returns {Observable<Domicilio[]>} Un observable que emite una lista de objetos `Domicilio` con los datos de las aduanas.
   */
   getAduanaData(): Observable<Domicilio[]> {
    return this.http.get<Domicilio[]>('assets/json/261103/aduana.json');
  }

    /**
     * Obtiene los datos de la tabla SCIAN desde un archivo JSON.
     * @returns Un observable que emite una lista de objetos `ScianData` con los datos de la tabla SCIAN.
     */
    obternerDatosData(): Observable<ScianData[]> {
      return this.http.get<ScianData[]>('assets/json/261103/datos-scian-tabla.json');
    }

      
  /**
   * Inicializa los datos de los catálogos relacionados con el pago de derechos.
   */
  inicializaPagoDeDerechosDatosCatalogos(): void {
    this.obtenerRespuestaPorUrl(this, 'banco', '/261103/banco.json');
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
          self: ModificacionPermisoImportacionMedicamentosService,
          variable: keyof ModificacionPermisoImportacionMedicamentosService,
          url: string
        ): void {
          if (self && variable && url) {
            this.http
              .get<RespuestaCatalogos>(`assets/json${url}`).pipe(takeUntil(this.destroyNotifier$))
              .subscribe((resp): void => {
                (self[variable] as Catalogo[]) =
                  resp?.code === 200 && resp.data ? resp.data : [];
              });
          }
        }

/**
   * @description Destruye la suscripción cuando el componente es destruido.
   * @method ngOnDestroy
   * @returns {void}
 */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Obtiene los datos del registro del paso uno.
   * @returns {Observable<PasoUno>} : Retorna un observable con los datos del paso uno.
   */
  getRegistroPasoUnoData(): Observable<DatosProcedureState> {
    return this.http.get<DatosProcedureState>('assets/json/261103/tramites-datos.json');
  }

  /**
   * Obtiene los datos del registro de la sección de registro.
   * @returns {Observable<DatosProcedureState>} : Retorna un observable con los datos del registro.
   */
  getRegistrarDatos(): Observable<DatosProcedureState> {
    return this.http.get<DatosProcedureState>('assets/json/261103/registrar-datos.json');
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


  /**
   * Obtiene la lista de fabricantes desde un archivo JSON local.
   *
   * @returns Un Observable que emite un array de objetos `Fabricante` cargados desde 'assets/json/261103/tabla-datos.json'.
   */
  getTablaDatos(): Observable<Fabricante[]> {
    return this.http.get<Fabricante[]>('assets/json/261103/tabla-datos.json');
  }

  /**
   * Obtiene un array de objetos `Otros` desde un archivo JSON local.
   *
   * @returns Un `Observable` que emite un array de objetos `Otros` cargados desde 'assets/json/261103/otros-tabla-datos.json'.
   */
  getOtrosTablaDatos(): Observable<Otros[]> {
    return this.http.get<Otros[]>('assets/json/261103/otros-tabla-datos.json');
  }

}