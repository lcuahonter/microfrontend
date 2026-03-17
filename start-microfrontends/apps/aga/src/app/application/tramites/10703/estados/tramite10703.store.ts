import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa el estado inicial de la solicitud 10703.
 */
export interface Solicitud10703State {
  /**
   * Lista de aduanas disponibles.
   */
  aduana: number;

  /**
   * Propiedad `manifesto` que indica si un manifiesto está presente o activado.
   * Se define como un valor booleano (`true` o `false`).
   */
  manifesto: boolean;

  /**
   * Propiedad `personaFisica` que representa si la entidad corresponde a una persona física.
   * Se define como un valor booleano (`true` o `false`).
   */
  personaFisica: boolean;

  /**
   * Nombre del organismo público.
   */
  organismoPublico: boolean;

  /**
   * Uso específico de la mercancía.
   */
  usoEspecifico: Catalogo[] | null;

  /**
   * Propiedad `opcion` que representa una elección o estado activado/desactivado.
   * Se define como un valor booleano (`true` o `false`).
   */
  opcion: boolean;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * Teléfono del solicitante.
   */
  telefono: number;

  /**
   * Número interior del domicilio fiscal.
   */
  numeroInterior: number;

  /**
   * Número exterior del domicilio fiscal.
   */
  numeroExterior: number;

  /**
   * Calle del domicilio fiscal.
   */
  calle: string;

  /**
   * Propiedad `nombre` que almacena el nombre de una persona, entidad u objeto.
   * Se define como una cadena de texto (`string`).
   */
  nombre: string;

  /**
   * Estado del domicilio fiscal.
   */
  estado: number;

  /**
   * Lista de países disponibles.
   */
  pais: Catalogo[] | null;

  /**
   * Código postal del domicilio fiscal.
   */
  codigoPostal: boolean;

  /**
   * Colonia del domicilio fiscal.
   */
  colonia: number;

  /**
   * Tipo de mercancía.
   */
  tipoDeMercancia: string;

  /**
   * Condición de la mercancía.
   */
  condicionMercancia: Catalogo[] | null;

  /**
   * Propiedad `especificoMercancia` que almacena información específica sobre la mercancía.
   * Se define como una cadena de texto (`string`).
   */
  especificoMercancia: string;

  /**
   * Unidad de medida de la mercancía.
   */
  unidadMedida: Catalogo[] | null;

  /**
   * Lista de años disponibles.
   */
  ano: Catalogo[] | null;

  /**
   * Cantidad de mercancía.
   */
  cantidad: string;

  /**
   * Marca de la mercancía.
   */
  marca: string;

  /**
   * Modelo de la mercancía.
   */
  modelo: string;

  /**
   * Serie de la mercancía.
   */
  serie: string;

  /**
   * Propiedad `vehiculo` que indica si un vehículo está presente o no.
   * Se define como un valor booleano (`true` o `false`).
   */
  vehiculo: boolean;
}

/**
 * Función que crea el estado inicial de la solicitud 10703.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud10703State {
  return {
    organismoPublico: true,
    aduana: 0,
    usoEspecifico: null,
    tipoDeMercancia: '',
    unidadMedida: null,
    condicionMercancia: null,
    ano: null,
    cantidad: '',
    marca: '',
    modelo: 'modelo',
    serie: '',
    pais: null,
    calle: '',
    numeroExterior: 0,
    numeroInterior: 0,
    telefono: 0,
    correoElectronico: '',
    codigoPostal: true,
    estado: 0,
    colonia: 0,
    manifesto: true,
    personaFisica: true,
    opcion: true,
    nombre: '',
    especificoMercancia: '',
    vehiculo: true,
  };
}

/**
 * Clase que representa el store para manejar el estado de la solicitud 10703.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite10703', resettable: true })
export class Tramite10703Store extends Store<Solicitud10703State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Método para establecer la lista de aduanas en el estado.
   * Se actualiza el estado con la nueva lista proporcionada.
   *
   * @param aduana - Número que representa la aduana.
   */
  public setAduana(aduana: number): void {
    /**
     * Llama al método `update()` para actualizar el estado existente,
     * fusionando la nueva información con el estado actual.
     */
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Método para actualizar el estado del formulario.
   * Recibe un objeto `newState` con las nuevas propiedades a actualizar.
   *
   * @param newState - Objeto que contiene las nuevas propiedades del estado del formulario.
   */
  public updateFormState(newState: object): void {
    /**
     * Llama al método `update()` para actualizar el estado existente,
     * fusionando las nuevas propiedades con el estado actual.
     */
    this.update((state) => ({
      ...state,
      ...newState,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
