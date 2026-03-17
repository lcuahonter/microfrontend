
import { Elemento, Monumentos } from '../../tramites/280101/constantes/permiso-de-exportacion.enum'; // Importa las interfaces Elemento y Monumentos.
import { Store, StoreConfig } from '@datorama/akita'; // Importa las clases Store y StoreConfig de Akita para manejar el estado.
import { Injectable } from '@angular/core'; // Importa el decorador Injectable para inyección de dependencias.

/**
 * Representa un catálogo con un identificador único y una descripción.
 */
export interface Catalogo {
  /**
   * Identificador único del catálogo.
   */
  id: number;

  /**
   * Descripción del catálogo.
   */
  descripcion: string;
}

/**
 * Estado de la solicitud para el trámite 280101.
 * 
 * @property modalidadOpcion - Opción seleccionada para la modalidad del trámite.
 * @property exposicionOpcion - Opción seleccionada para la exposición.
 * @property nombre - Nombre del solicitante o entidad.
 * @property cantMonumentos - Cantidad de monumentos involucrados.
 * @property aduana - Aduana relacionada con el trámite.
 * @property descripcionClobGenerica - Descripción general del trámite.
 * @property aduanaEntrada - Aduana de entrada de los bienes.
 * @property elementoTablaDatos - Lista de elementos asociados al trámite.
 * @property monumentoTablaDatos - Lista de monumentos involucrados.
 * @property pais - País relacionado con la solicitud.
 * @property municipioOAlcadia - Municipio o alcaldía correspondiente.
 * @property localidad - Localidad relacionada con la solicitud.
 * @property codigoPostal - Código postal de la dirección.
 * @property estado - Identificador del estado.
 * @property colonia - Identificador de la colonia.
 * @property calle - Nombre de la calle.
 * @property numeroExterior - Número exterior de la dirección.
 * @property numeroInterior - Número interior de la dirección.
 */
export interface Solicitud280101State {
   /** Opción seleccionada para la modalidad del trámite.
  * @type {string}
  */
  modalidadOpcion: string; 
  /** Opción seleccionada para la exposición.
   * @type {string}
   * @default "false"
   * Representa si la exposición está habilitada o no.
   */
  exposicionOpcion: string; 
  /** Nombre del solicitante o entidad.
   * @type {string}
   */
  nombre: string; 
  /** Cantidad de monumentos involucrados.
   * @type {string}
   */
  cantMonumentos: string; 
  /** Aduana relacionada con el trámite.
   * @type {string}
   */
  aduana: string; 
  /**
   * Descripción general del trámite.
   * @type {string}
   */
  descripcionClobGenerica: string;
  /** Aduana de entrada de los bienes.
   * @type {string}
   */
  aduanaEntrada: string; 
  /** Lista de elementos asociados al trámite.
   * @type {Elemento[]}
   */
  elementoTablaDatos: Elemento[];
  /** Lista de monumentos involucrados.
   * @type {Monumentos[]}
   */
  monumentoTablaDatos: Monumentos[]; 
  /** País relacionado con la solicitud.
   * @type {string}
   */
  pais: string; 
  /** Municipio o alcaldía correspondiente.
   * @type {string}
   */
  municipioOAlcadia: string; 
  /** Localidad relacionada con la solicitud.
   * @type {string}
   */
  localidad: string; 
  /** Código postal de la dirección.
   * @type {number}
   * @default 0
   */
  codigoPostal: number;
  /** Identificador del estado.
   * @type {number}
   * @default 0
   */
  estado: number; 
  /** Identificador de la colonia.
   * @type {number}
   * @default 0
   */
  colonia: number; 
  /** Nombre de la calle.
   * @type {string}
   */
  calle: string;
  /** Número exterior de la dirección.
   * @type {number}
   * @default 0
   */
  numeroExterior: number;
  /** Número interior de la dirección.
   * @type {number}
   * @default 0
   */
  numeroInterior: number;
}

/**
 * Crea el estado inicial para la solicitud 280101.
 * 
 * @returns {Solicitud280101State} El estado inicial de la solicitud.
 * 
 * Propiedades iniciales:
 * - `modalidadOpcion`: Cadena vacía que representa la modalidad seleccionada.
 * - `exposicionOpcion`: Cadena con valor "false" que indica la opción de exposición.
 * - `cantMonumentos`: Cadena vacía que representa la cantidad de monumentos.
 * - `nombre`: Cadena vacía que representa el nombre.
 * - `aduana`: Valor inicial nulo para el catálogo de aduanas.
 * - `aduanaEntrada`: Valor inicial nulo para el catálogo de aduanas de entrada.
 * - `descripcionClobGenerica`: Cadena vacía para la descripción genérica.
 * - `elementoTablaDatos`: Lista vacía para los elementos añadidos.
 * - `monumentoTablaDatos`: Lista vacía para los monumentos.
 * - `pais`: Valor inicial nulo para el catálogo de países.
 * - `codigoPostal`: Número inicial con valor 0 para el código postal.
 * - `estado`: Número inicial con valor 0 para el estado.
 * - `municipioOAlcadia`: Cadena vacía para el municipio o alcaldía.
 * - `localidad`: Cadena vacía para la localidad.
 * - `calle`: Cadena vacía para la calle.
 * - `colonia`: Número inicial con valor 0 para la colonia.
 * - `numeroExterior`: Número inicial con valor 0 para el número exterior.
 * - `numeroInterior`: Número inicial con valor 0 para el número interior.
 */
export function createInitialState(): Solicitud280101State {
  return {
    modalidadOpcion: '', 
    exposicionOpcion: "false", 
    cantMonumentos: '', 
    nombre: '', 
    aduana: '', 
    aduanaEntrada: '', 
    descripcionClobGenerica: '', 
    elementoTablaDatos: [], 
    monumentoTablaDatos: [], 
    pais: '', 
    codigoPostal: 0, 
    estado: 0,
    municipioOAlcadia: '',
    localidad: '', 
    calle: '', 
    colonia: 0, 
    numeroExterior: 0, 
    numeroInterior: 0,
  };
}



/**
 * @fileoverview
 * Este archivo define la clase `Tramite280101Store`, que extiende la funcionalidad de un store
 * para gestionar el estado de la solicitud 280101. Proporciona métodos para actualizar
 * diferentes propiedades del estado, como catálogos, direcciones, y listas de elementos o monumentos.
 * 
 * Cada método incluye una descripción detallada de su propósito y los parámetros que recibe.
 * 
 * @remarks
 * - La clase utiliza decoradores de Angular y Akita para configurar el store.
 * - Los métodos de actualización utilizan la función `update` para modificar el estado.
 * - Se incluyen métodos para añadir y eliminar elementos de listas específicas.
 */
@Injectable({
  providedIn: 'root', // Proporciona el servicio en el nivel raíz.
})

@StoreConfig({ name: 'tramite280101', resettable: true }) // Configura el store con un nombre y la capacidad de reiniciarse.
export class Tramite280101Store extends Store<Solicitud280101State> {
  /**
   * Constructor del store.
   * Inicializa el estado con el estado inicial definido.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza la cantidad de monumentos en el estado.
   * @param cantMonumentos Cantidad de monumentos.
   */
  public setCantMonumentos(cantMonumentos: string): void {
    this.update((state) => ({
      ...state,
      cantMonumentos: cantMonumentos,
    }));
  }

  /**
   * Actualiza el catálogo de aduanas en el estado.
   * @param aduana Lista de aduanas.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({
      ...state,
      aduana: aduana,
    }));
  }

  /**
   * Actualiza el nombre en el estado.
   * @param nombre Nombre del solicitante.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({
      ...state,
      nombre: nombre,
    }));
  }

  /**
   * Actualiza el catálogo de países en el estado.
   * @param pais Lista de países.
   */
  public setPais(pais: string): void {
    this.update((state) => ({
      ...state,
      pais: pais,
    }));
  }

  /**
   * Actualiza la opción de exposición en el estado.
   * @param exposicionOpcion Opción de exposición seleccionada.
   */
  public setExposicionOpcion(exposicionOpcion: string): void {
    this.update((state) => ({
      ...state,
      exposicionOpcion: exposicionOpcion,
    }));
  }

  /**
   * Actualiza la visibilidad de la tabla en el estado.
   * @param showTabla Visibilidad de la tabla.
   */
  public setShowTabla(showTabla: boolean): void {
    this.update((state) => ({
      ...state,
      showTabla,
    }));
  }

  /**
   * Actualiza la descripción genérica en el estado.
   * @param descripcionClobGenerica Descripción genérica.
   */
  public setDescripcionClobGenerica(descripcionClobGenerica: string): void {
    this.update((state) => ({
      ...state,
      descripcionClobGenerica: descripcionClobGenerica,
    }));
  }

  /**
   * Actualiza la modalidad seleccionada en el estado.
   * @param modalidadOpcion Modalidad seleccionada.
   */
  public setModalidad(modalidadOpcion: string): void {
    this.update((state) => ({
      ...state,
      modalidadOpcion: modalidadOpcion,
    }));
  }

  /**
   * Actualiza el catálogo de aduanas de entrada en el estado.
   * @param aduanaEntrada Lista de aduanas de entrada.
   */
  public setAduanaEntrada(aduanaEntrada: string): void {
    this.update((state) => ({
      ...state,
      aduanaEntrada: aduanaEntrada,
    }));
  }

  /**
   * Actualiza la calle en el estado.
   * @param calle Calle.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle: calle,
    }));
  }

  /**
   * Actualiza el número exterior en el estado.
   * @param numeroExterior Número exterior.
   */
  public setNumeroExterior(numeroExterior: number): void {
    this.update((state) => ({
      ...state,
      numeroExterior: numeroExterior,
    }));
  }

  /**
   * Actualiza el número interior en el estado.
   * @param numeroInterior Número interior.
   */
  public setNumeroInterior(numeroInterior: number): void {
    this.update((state) => ({
      ...state,
      numeroInterior: numeroInterior,
    }));
  }

  /**
   * Actualiza el código postal en el estado.
   * @param codigoPostal Código postal.
   */
  public setCodigoPostal(codigoPostal: number): void {
    this.update((state) => ({
      ...state,
      codigoPostal: codigoPostal,
    }));
  }

  /**
   * Actualiza el estado en el estado.
   * @param estado Estado.
   */
  public setEstado(estado: number): void {
    this.update((state) => ({
      ...state,
      estado: estado,
    }));
  }

  /**
   * Actualiza la colonia en el estado.
   * @param colonia Colonia.
   */
  public setColonia(colonia: number): void {
    this.update((state) => ({
      ...state,
      colonia: colonia,
    }));
  }

  /**
   * Actualiza el municipio o alcaldía en el estado.
   * @param municipioOAlcadia Municipio o alcaldía.
   */
  public setMunicipioOAlcadia(municipioOAlcadia: string): void {
    this.update((state) => ({
      ...state,
      municipioOAlcadia: municipioOAlcadia,
    }));
  }

  /**
   * Actualiza la localidad en el estado.
   * @param localidad Localidad.
   */
  public setLocalidad(localidad: string): void {
    this.update((state) => ({
      ...state,
      localidad: localidad,
    }));
  }

  /**
   * Añade un elemento a la lista de elementos en el estado.
   * @param elemento Elemento a añadir.
   */
  public setElemento(elemento: Elemento): void {
    this.update((state) => ({
      ...state,
      elementoTablaDatos: [...state.elementoTablaDatos, elemento],
    }));
  }

  /**
   * Añade un monumento a la lista de monumentos en el estado.
   * @param monumento Monumento a añadir.
   */
  public setMonumento(monumento: Monumentos): void {
    this.update((state) => ({
      ...state,
      monumentoTablaDatos: [...state.monumentoTablaDatos, monumento],
    }));
  }

  /**
   * Borra un elemento de la lista de elementos añadidos en el estado.
   * @param elemento Elemento a borrar.
   */
  borrorElemento(elemento: Elemento): void {
    this.update((state) => {
      const INDICE_BORROR = state.elementoTablaDatos.findIndex((ele) =>
        Object.entries(elemento).every(([key, value]) => ele[key as keyof Elemento] === value)
      );

      if (INDICE_BORROR !== -1) {
        state.elementoTablaDatos.splice(INDICE_BORROR, 1);
      }

      return {
        ...state,
        elementoTablaDatos: [...state.elementoTablaDatos],
      };
    });
  }

  /**
   * Borra un monumento de la lista de monumentos en el estado.
   * @param monumento Monumento a borrar.
   */
  borrorMonumentos(monumento: Monumentos): void {
    this.update((state) => {
      const INDICE_BORROR = state.monumentoTablaDatos.findIndex((ele) =>
        Object.entries(monumento).every(([key, value]) => ele[key as keyof Monumentos] === value)
      );

      if (INDICE_BORROR !== -1) {
        state.monumentoTablaDatos.splice(INDICE_BORROR, 1);
      }

      return {
        ...state,
        monumentoTablaDatos: [...state.monumentoTablaDatos],
      };
    });
  }
}
