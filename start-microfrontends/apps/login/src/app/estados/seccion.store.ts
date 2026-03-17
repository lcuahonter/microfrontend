import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Estado para almacenar la información de cada sección contenida dentro de un paso
 */
export interface SeccionState {
  seccion: boolean[];
  formaValida: boolean[];
}

/**
 * Creación del estado inicial para la interfaz de secciones
 * @returns SeccionState
 */
export function createInitialState(): SeccionState {
  return {
    seccion: [],
    formaValida: [],
  };
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'seccion', resettable: true, })
export class SeccionStore extends Store<SeccionState> {
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda un elemento por cada sección que se encuentre
   * @param seccion validacion
   */
  public establecerSeccion(seccion: boolean[]) {
    this.update(state => ({
      ...state,
      seccion,
    }));
  }

  /**
   * Agrega elementos por cada seccion indicando si el formulario es válido o no
   * @param formaValida 
   */
  public establecerFormaValida(formaValida: boolean[]) {
    this.update(state => ({
      ...state,
      formaValida,
    }));
  }

  /**
   * Limpia los datos de la sección
   */
  public limpiarSeccion() {
    this.reset();
  }
}