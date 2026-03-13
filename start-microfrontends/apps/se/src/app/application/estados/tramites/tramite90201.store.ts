import { ProductorIndirectoTabla, SectoresTabla } from '@libs/shared/data-access-user/src/core/models/90201/expansion-de-productores.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la solicitud para el trámite 90201.
 *
 * @property fraccion - Fracción arancelaria relacionada con la solicitud.
 * @property sector - Sector económico al que pertenece la solicitud.
 * @property rfc - Registro Federal de Contribuyentes del solicitante.
 * @property representacionFederal - Indica si existe representación federal.
 * @property actividadProductiva - Actividad productiva principal del solicitante.
 */
export interface Solicitud90201State {
  idSolicitud: number | null;
  fraccion: string;
  sector: string;
  rfc: string;
  representacionFederal: string;
  actividadProductiva: string;
  sectorDatos: SectoresTabla[];
  productorDatos: ProductorIndirectoTabla[];
}

/**
 * Crea y retorna el estado inicial para la solicitud 90201.
 * 
 * @returns {Solicitud90201State} Un objeto que representa el estado inicial con valores vacíos para fracción, sector, RFC, representación federal y actividad productiva.
 */
export function createInitialState(): Solicitud90201State {
  return {
    idSolicitud: 89893,
    fraccion: '',
    sector: '',
    rfc: '',
    representacionFederal: '',
    actividadProductiva: '',
    sectorDatos: [],
    productorDatos: []
  };
}

/**
 * Store para gestionar el estado de la solicitud 90201.
 * 
 * Proporciona métodos para actualizar los campos principales de la solicitud,
 * tales como fracción, sector, RFC, representación federal y actividad productiva.
 * Permite también limpiar el estado de la solicitud.
 * 
 * @extends Store<Solicitud90201State>
 * @decorator @Injectable
 * @decorator @StoreConfig
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite90201', resettable: true })
export class Tramite90201Store extends Store<Solicitud90201State> {

  /**
   * Constructor de la clase.
   * Llama al constructor de la clase base pasando el estado inicial creado por `createInitialState()`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el estado con el valor proporcionado para la fracción arancelaria.
   *
   * @param fraccion - La nueva fracción arancelaria que se establecerá en el estado.
   */
  public setFraccion(fraccion: string):void {
    this.update((state) => ({
      ...state,
      fraccion,
    }));
  }

  /**
   * Actualiza el sector de la solicitud.
   *
   * @param sector - El nuevo sector que se establecerá en el estado.
   */
  public setSector(sector: string):void {
    this.update((state) => ({
      ...state,
      sector,
    }));
  }

  /**
   * Actualiza el RFC de la solicitud.
   *
   * @param rfc - El nuevo RFC que se establecerá en el estado.
   */
  public setRfc(rfc: string):void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Actualiza el estado con el valor proporcionado para la representación federal.
   *
   * @param representacionFederal - El nuevo valor de la representación federal que se establecerá en el estado.
   */
  public setRepresentacionFederal(representacionFederal: string):void {
    this.update((state) => ({ 
      ...state,
      representacionFederal,
    }));
  }
  
  /**
   * Actualiza el estado con una nueva actividad productiva.
   *
   * @param actividadProductiva - La actividad productiva que se va a establecer en el estado.
   */
  public setActividadProductiva(actividadProductiva: string):void {
    this.update((state) => ({
      ...state,
      actividadProductiva,
    }));
  }

  /**
   * Limpia la solicitud actual restableciendo el estado a sus valores iniciales.
   * Utiliza el método `reset()` para reiniciar todos los campos relacionados con la solicitud.
   */
  public limpiarSolicitud():void {
    this.reset();
  }

  /**
     * @method setProductorDatos
     * @description
     * Actualiza el arreglo de datos de productores en el estado.
     * @param {FilaProductos[]} productorDatos - Nuevo arreglo de datos de productores a almacenar.
     * @returns {void}
     */
    public setProductorDatos(productorDatos: ProductorIndirectoTabla[]): void {
      this.update((state) => ({ ...state, productorDatos }));
    }

      /**
       * @method setSectorDatos
       * @description
       * Actualiza el arreglo de datos de sectores en el estado.
       * @param {SectoresTabla[]} sectorDatos - Nuevo arreglo de sectores a almacenar.
       * @returns {void}
       */
      public setSectorDatos(sectorDatos: SectoresTabla[]): void {
        this.update((state) => ({ ...state, sectorDatos }));
      }
}
