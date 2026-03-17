import { Mercancias, PlantasTabla, ProductorIndirecto, SectorTabla } from '../../../shared/models/complementaria.model';
import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { ListaSectoresTabla } from '../models/registro.model';
import { ProgramaLista } from '../../../shared/models/lista-programa.model';
/**
 * Representa un catálogo con un identificador y una descripción.
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
 * Estado inicial para la interfaz del trámite 90303.
 */
export interface Solicitud90303State {
  /**
   * RFC de inicio de sesión.
   * @type {string}
   */
  loginRfc?: string;

  /**
   * Estatus del trámite.
   * @type {string}
   */
  estatus?: string;

  /**
   * Registro Federal de Contribuyentes.
   * @type {string}
   */
  registroFederalContribuyentes?: string;

  /**
   * Representación Federal.
   * @type {string}
   */
  representacionFederal?: string;

  /**
   * Tipo de modificación (Baja, Activada, etc.).
   * @type {string}
   */
  tipoModificacion?: string;

  /**
   * Modificación del programa.
   * @type {string}
   */
  modificacionPrograma?: string;

  /**
   * Lista de datos del programa.
   */
  programaListaDatos?: ProgramaLista[];

  /**
   * Folio del programa seleccionado.
   */
  selectedFolioPrograma?: string;

  /**
   * Tipo de programa seleccionado.
   */
  selectedTipoPrograma?: string;

  /**
   * ID del programa seleccionado.
   */
  selectedIdPrograma?: string;

  /**
   * Tipo de programa (IMMEX o PROSEC)
   * @type {string}
   */
  tipoPrograma?: string;

  /**
   * ID de la solicitud.
   * @type {number}
   */
  idSolicitud?: number;

  /**
   * ID de la solicitud buscada.
   * @type {string}
   */
  buscarIdSolicitud?: string;

  /**
   * Datos de la tabla de plantas.
   * @type {PlantasTabla[]}
   */
  plantasTablaDatos?: PlantasTabla[];

  /**
   * Datos de la tabla de sectores.
   * @type {SectorTabla[]}
   */
  sectorTablaDatos?: SectorTabla[];

  /**
   * Datos de la tabla de mercancías.
   * @type {Mercancias[]}
   */
  mercanciaTablaDatos?: Mercancias[];

  /**
   * Datos de la tabla de productores indirectos.
   * @type {ProductorIndirecto[]}
   */
  productorTablaDatos?: ProductorIndirecto[];

  /**
   * Datos de la tabla de sectores activos.
   * @type {ListaSectoresTabla[]}
   */
  listaSectorTablaDatos?: ListaSectoresTabla[];
}
/**
 * Crea el estado inicial para la solicitud del trámite 90303.
 * @returns Estado inicial de tipo `Solicitud90303State`.
 */
export function createInitialState(): Solicitud90303State {
  return {
    loginRfc: '',
    estatus: '',
    registroFederalContribuyentes: '',
    representacionFederal: '',
    tipoModificacion: 'Baja',
    modificacionPrograma: '',
    programaListaDatos: [],
    selectedFolioPrograma: '',
    selectedTipoPrograma: '',
    selectedIdPrograma: '',
    tipoPrograma: '',
    idSolicitud: 0,
    buscarIdSolicitud: '',

    plantasTablaDatos: [],
    sectorTablaDatos: [],
    mercanciaTablaDatos: [],
    productorTablaDatos: [],
    listaSectorTablaDatos: [],
  };
}

/**
 * Store para manejar el estado del trámite 90303.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite90303', resettable: true })
export class Tramite90303Store extends Store<Solicitud90303State> {
  /**
   * Constructor de la clase Tramite90303Store
   */
  constructor() {
    super(createInitialState());
  }
  /**
   * Establece el RFC de inicio de sesión en el estado.
   *
   * @param loginRfc - RFC del usuario que ha iniciado sesión.
   */
  public setLoginRfc(loginRfc: string): void {
    this.update((state) => ({
      ...state,
      loginRfc,
    }));
  }
  
  /**
   * Actualiza el estado del store con los nuevos valores.
   * @param updateFunc Función que recibe el estado actual y retorna el nuevo estado.
   */
  public setEstatus(estatus: string): void {
    this.update((state) => ({ ...state, estatus }));
  }
  /**
   * Actualiza el estado del store con los nuevos valores.
   * @param updateFunc Función que recibe el estado actual y retorna el nuevo estado.
   */
  public setRegistroFederalContribuyentes(
    registroFederalContribuyentes: string
  ): void {
    this.update((state) => ({ ...state, registroFederalContribuyentes }));
  }
  /**
   * Actualiza el estado del store con los nuevos valores.
   * @param updateFunc Función que recibe el estado actual y retorna el nuevo estado.
   */
  public setRepresentacionFederal(representacionFederal: string): void {
    this.update((state) => ({ ...state, representacionFederal }));
  }
  /**
   * Actualiza el estado del store con los nuevos valores.
   * @param updateFunc Función que recibe el estado actual y retorna el nuevo estado.
   */
  public setTipoModificacion(tipoModificacion: string): void {
    this.update((state) => ({ ...state, tipoModificacion }));
  }
  /**
   * Actualiza el estado del store con los nuevos valores.
   * @param updateFunc Función que recibe el estado actual y retorna el nuevo estado.
   */
  public setModificacionPrograma(modificacionPrograma: string): void {
    this.update((state) => ({ ...state, modificacionPrograma }));
  }

  /**
   * Establece la lista de datos del programa en el estado.
   *
   * @param programaListaDatos - Arreglo de objetos ProgramaLista que representan la lista de datos del programa.
   */
  public setProgramaListaDatos(programaListaDatos: ProgramaLista[]): void {
    this.update((state) => ({
      ...state,
      programaListaDatos,
    }));
  }

  /**
   * Establece el folio del programa seleccionado en el estado.
   *
   * @param selectedFolioPrograma - El folio del programa seleccionado.
   */
  public setSelectedFolioPrograma(selectedFolioPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedFolioPrograma,
    }));
  }

  /**
   * Establece el tipo de programa seleccionado en el estado.
   *
   * @param selectedTipoPrograma - El tipo de programa seleccionado.
   */
  public setSelectedTipoPrograma(selectedTipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedTipoPrograma,
    }));
  }

  /**
   * Establece el ID del programa seleccionado en el estado.
   *
   * @param selectedIdPrograma - El ID del programa seleccionado.
   */
  public setSelectedIdPrograma(selectedIdPrograma: string): void {
    this.update((state) => ({
      ...state,
      selectedIdPrograma,
    }));
  }

  /**
   * Establece el tipo de programa (IMMEX o PROSEC) en el estado.
   *
   * @param tipoPrograma - El tipo de programa.
   */
  public setTipoPrograma(tipoPrograma: string): void {
    this.update((state) => ({
      ...state,
      tipoPrograma,
    }));
  }

  /**
   * Establece el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * Establece el ID de la solicitud buscada en el estado.
   *
   * @param buscarIdSolicitud - ID de la solicitud buscada.
   */
  public setBuscarIdSolicitud(buscarIdSolicitud: string): void {
    this.update((state) => ({
      ...state,
      buscarIdSolicitud,
    }));
  }

  /**
   * Establece los datos de la tabla de plantas en el estado.
   *
   * @param plantasTablaDatos - Arreglo de objetos PlantasTabla que representan los datos de la tabla de plantas.
   */
  public setPlantasTablaDatos(plantasTablaDatos: PlantasTabla[]): void {
    this.update((state) => ({
      ...state,
      plantasTablaDatos,
    }));
  }

  /**
   * Establece los datos de la tabla de sectores en el estado.
   *
   * @param sectorTablaDatos - Arreglo de objetos SectorTabla que representan los datos de la tabla de sectores.
   */
  public setSectorTablaDatos(sectorTablaDatos: SectorTabla[]): void {
    this.update((state) => ({
      ...state,
      sectorTablaDatos,
    }));
  }

  /**
   * Establece los datos de la tabla de mercancías en el estado.
   * 
   * @param mercanciaTablaDatos - Arreglo de objetos Mercancias que representan los datos de la tabla de mercancías.
   */
  public setMercanciaTablaDatos(mercanciaTablaDatos: Mercancias[]): void {
    this.update((state) => ({
      ...state,
      mercanciaTablaDatos,
    }));
  }

  /**
   * Establece los datos de la tabla de productores indirectos en el estado.
   * 
   * @param productorTablaDatos - Arreglo de objetos ProductorIndirecto que representan los datos de la tabla de productores indirectos.
   */
  public setProductorTablaDatos(productorTablaDatos: ProductorIndirecto[]): void {
    this.update((state) => ({
      ...state,
      productorTablaDatos,
    }));
  }

  /**
   * Establece los datos de la tabla de sectores activos en el estado.
   * 
   * @param listaSectorTablaDatos - Arreglo de objetos ListaSectoresTabla que representan los datos de la tabla de sectores activos.
   */
  public setListaSectorTablaDatos(listaSectorTablaDatos: ListaSectoresTabla[]): void {
    this.update((state) => ({
      ...state,
      listaSectorTablaDatos,
    }));
  }

  /**
   * Limpia los datos de la solicitud
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
