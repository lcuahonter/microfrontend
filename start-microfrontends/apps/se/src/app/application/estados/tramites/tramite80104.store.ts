import { DisponsibleFiscal, FraccionArancelariaDescripcion } from '../../shared/models/empresas.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core'

/**
 * Creacion del estado inicial para la interfaz de tramite 90201
 * @returns Solicitud90201
 */
export interface Solicitud80104State { 
      rfc: string;
      estado:string;
      disponibles: DisponsibleFiscal[];
      seleccionadas: DisponsibleFiscal[];
      anexoDos: FraccionArancelariaDescripcion [];
      anexoTres: FraccionArancelariaDescripcion [];
      fraccionArancelaria:string;
      descripcion:string;
      fraccionTres:string;
      descripcionTres:string;
       
}
/**
 * Función que crea y devuelve el estado inicial para el trámite 80104.
 *
 * Este estado representa la información que se manejará durante el flujo del trámite,
 * incluyendo datos de la empresa, anexos y formularios asociados.
 *
 * @returns Un objeto con el estado inicial de tipo Solicitud80104State.
 */
export function createInitialState(): Solicitud80104State {
  return {   
    rfc: '',
    estado: '', 
    disponibles: [],
    seleccionadas: [],
    anexoDos: [],
    anexoTres: [],
    fraccionArancelaria:'',
    descripcion:'',
    fraccionTres:'',
    descripcionTres:'',

  };
}
/**
 * @fileoverview Este archivo contiene la definición de la clase `Tramite80104Store`, 
 * que extiende la funcionalidad de la clase `Store` para gestionar el estado de la 
 * solicitud 80104. Proporciona métodos para actualizar diferentes propiedades del 
 * estado, como RFC, estado, empresas disponibles y seleccionadas, fracciones 
 * arancelarias y descripciones asociadas.
 * 
 * @remarks
 * Esta clase utiliza decoradores de Angular y Akita para configurar la inyección 
 * de dependencias y la configuración del almacenamiento. Los métodos públicos 
 * permiten modificar el estado de manera controlada.
 * 
 * @author [Tu Nombre]
 * @version 1.0
 */

@Injectable({
    providedIn: 'root',
  })

  /**
 * @fileoverview
 * Este archivo contiene la definición de la clase `Tramite80104Store`, que extiende la funcionalidad de la clase `Store` 
 * para gestionar el estado de la solicitud 80104 en una aplicación Angular. 
 * Proporciona métodos para actualizar diferentes propiedades del estado, como RFC, estado, empresas disponibles y seleccionadas, 
 * así como información relacionada con los anexos dos y tres.
 * 
 * @remarks
 * La clase utiliza decoradores de Angular y Akita para configurar la inyección de dependencias y la gestión del estado.
 * Cada método de la clase actualiza una propiedad específica del estado utilizando el método `update` proporcionado por Akita.
 * 
 * @author
 * Equipo de desarrollo de iLink Digital
 * 
 * @version
 * 1.0.0
 */
  @StoreConfig({ name: 'tramite80104', resettable: true })
  export class Tramite80104Store extends Store<Solicitud80104State> {
    constructor() {
      super(createInitialState());
    }
    /**
     * Establece el valor del RFC en el estado.
     * @param rfc - Registro Federal de Contribuyentes del solicitante.
    */
    public setRfc(rfc: string):void {
        this.update((state) => ({
            ...state,
            rfc,
        }));
    }
    /**
     * Establece el valor del estado (entidad federativa) en el estado.
     * @param estado - Identificador del estado seleccionado.
    */
    public setEstado(estado: string):void {
        this.update((state) => ({
            ...state,
            estado,
        }));
    }
    /**
     * Establece la lista de empresas disponibles en el estado.
     * @param disponibles - Arreglo de empresas disponibles.
    */
    public setDisponibles(disponibles: DisponsibleFiscal[]):void {
        this.update((state) => ({
          ...state,
          disponibles,
        }));
      }
    /**
     * Establece la lista de empresas seleccionadas en el estado.
     * @param seleccionadas - Arreglo de empresas seleccionadas.
     */
      public setSeleccionadas(seleccionadas: DisponsibleFiscal[]):void {
        this.update((state) => ({
          ...state,
          seleccionadas,
        }));
      }
     /**
     * Establece el valor de la fracción arancelaria del Anexo Dos.
     * @param fraccionArancelaria - Fracción arancelaria capturada.
     */    
    public setFraccionArancelaria(fraccionArancelaria: string):void {
        this.update((state) => ({
            ...state,
            fraccionArancelaria,
        }));
    }
     /**
     * Establece la descripción correspondiente a la fracción arancelaria del Anexo Dos.
     * @param descripcion - Descripción de la fracción arancelaria.
     */
    public setDescripcion(descripcion: string):void {
        this.update((state) => ({
            ...state,
            descripcion,
        }));
    }
    /**
     * Establece el valor de la fracción arancelaria del Anexo Tres.
     * @param fraccionTres - Fracción arancelaria capturada para el Anexo Tres.
     */
    public setFraccionTres(fraccionTres: string):void {
        this.update((state) => ({
            ...state,
            fraccionTres,
        }));
    }
    /**
     * Establece la descripción correspondiente a la fracción arancelaria del Anexo Tres.
     * @param descripcionTres - Descripción de la fracción arancelaria del Anexo Tres.
     */
    public setDescripcionTres(descripcionTres: string):void {
        this.update((state) => ({
            ...state,
            descripcionTres,
        }));
    }
    /**
     * Establece el arreglo completo del Anexo Dos en el estado.
     * @param anexoDos - Arreglo de objetos que contienen fracción arancelaria y descripción.
     */
    public setAnexoDos(anexoDos: FraccionArancelariaDescripcion[]):void {
        this.update((state) => ({
          ...state,
          anexoDos,
        }));
      }
    /**
     * Establece el arreglo completo del Anexo Tres en el estado.
     * @param anexoTres - Arreglo de objetos que contienen fracción arancelaria y descripción.
     */
      public setAnexoTres(anexoTres: FraccionArancelariaDescripcion[]):void {
        this.update((state) => ({
          ...state,
          anexoTres,
        }));
      }
    
      
}