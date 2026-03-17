import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Representa el estado de la solicitud 11105.
 */
export interface Solicitud11105State {

  /**
   * Código de la aduana relacionada con la solicitud.
   */
  aduana: string;

  /**
   * Indica si la solicitud es de un organismo público.
   */
  organismoPublico: boolean;

  /**
   * Nombre del solicitante.
   */
  nombre: string;

  /**
   * Indica si el solicitante es una persona física.
   */
  personaFisica: boolean;

  /**
   * Tipo de mercancía involucrada en la solicitud.
   */
  tipoMercancia: string;
  /**
   * Uso específico de la mercancía.
   */
  usoEspecifico?: string;
  /**
   * Condición de la mercancía.
   */
  condicion?: string;
  /**
   * Marca de la mercancía.
   */
  marca?: string;
  /**
   * Año de fabricación de la mercancía.
   */
  ano?: string;
  /**
   * Modelo de la mercancía.
   */
  modelo?: string;
  /**
   * Número de serie de la mercancía.
   */
  serie?: string;
  /**
   * Manifiesto relacionado con la mercancía.
   */
  manifesto?: boolean;
  /**
   * Dirección del solicitante.
   */
  calle?: string;
  /**
   * Número exterior de la dirección del solicitante.
   */
  numeroExterior?: string;
  /**
   * Número interior de la dirección del solicitante.
   */
  numeroInterior?: string;
  /**
   * Número de teléfono del solicitante.
   */
  telefono?: string;
  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico?: string;
  /**
   * País del solicitante.
   */
  pais?: string;
  /**
   * Código postal de la dirección del solicitante.
   */
  codigoPostal?: string;
  /**
   * Estado del solicitante.
   */
  estado?: string;
  /**
   * Colonia del solicitante.
   */
  colonia?: string;
  /**
   * Indica si la opción parcial está seleccionada.
   */
  opcion:string;
  /**
   * Folio original de la solicitud, si aplica.
   */
  folioOriginal?: string;
  /**
   * Justificación del desistimiento de la solicitud, si aplica.
   */
  justificacionDelDesistimiento?: string;
}

/**
 * Crea el estado inicial para la solicitud 11105.
 *
 * @returns {Solicitud11105State} El estado inicial con los valores predeterminados:
 * - `radioParcial`: Indica si la opción parcial está seleccionada (por defecto `false`).
 * - `contenedores`: Cadena vacía para los contenedores.
 * - `aduana`: Cadena vacía para la aduana.
 * - `observaciones`: Cadena vacía para las observaciones.
 */
export function createInitialState(): Solicitud11105State {
  return {
    aduana: '',
    organismoPublico: false,
    nombre: 'PRUEBA QA',
    personaFisica: false,
    tipoMercancia: '',
    usoEspecifico: '',
    condicion: '',
    marca: '',
    ano: '',
    modelo: '',
    serie: '',
    manifesto: true,
    calle: 'av revolución',
    numeroExterior: '1181',
    numeroInterior: '',
    telefono: '1123456776543',
    correoElectronico: 'paulinosistemas24@gmail.com',
    pais: '1',
    codigoPostal: '03930',
    estado: 'Distrito Federal',
    colonia: 'CENTRO',
    opcion: 'si',
    folioOriginal: '',
    justificacionDelDesistimiento: '',
  };
}

/**
 * Store que gestiona el estado de la solicitud 11105.
 */
/**
 * Clase `Solicitud11105Store` que extiende de `Store<Solicitud11105State>`.
 * 
 * Esta clase representa una tienda de estado para manejar la información
 * relacionada con la solicitud 11105. Proporciona métodos para actualizar
 * diferentes propiedades del estado y para restablecer el estado a su
 * configuración inicial.
 * 
 * @remarks
 * - La clase utiliza decoradores de Angular como `@Injectable` para
 *   inyección de dependencias y `@StoreConfig` para configurar la tienda.
 * - Los métodos de esta clase permiten modificar propiedades específicas
 *   del estado de manera controlada.
 * 
 * @example
 * ```typescript
 * const store = new Solicitud11105Store();
 * store.setRadioParcial(true);
 * store.setContenedores('ABC123');
 * store.limpiarSolicitud();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud11105', resettable: true })
export class Solicitud11105Store extends Store<Solicitud11105State> {
  /**
   * Constructor de la clase.
   * Inicializa el estado inicial llamando al método `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el valor de la propiedad "aduana" en el estado.
   *
   * @param aduana - El valor de la aduana que se desea establecer.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({ ...state, aduana }));
  }

  /**
   * Establece el valor de la propiedad "organismoPublico" en el estado.
   * 
   * @param organismoPublico - El valor booleano que indica si la solicitud es de un organismo público.
   */
  public setOrganismoPublico(organismoPublico: boolean): void {
    this.update((state) => ({ ...state, organismoPublico }));
  }

 /**
 * Establece el valor de la propiedad "nombre" en el estado.
 *
 * @param nombre - El valor del nombre que se desea establecer.
 */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /**
   * Establece el valor de la propiedad "personaFisica" en el estado.
   * 
   * @param personaFisica - El valor booleano que indica si el solicitante es una persona física.
   */
  public setPersonaFisica(personaFisica: boolean): void {
    this.update((state) => ({ ...state, personaFisica }));
  }

  /**
   * Establece el valor de la propiedad "tipoMercancia" en el estado.
   *
   * @param tipoMercancia - El valor del tipo de mercancía que se desea establecer.
   */
  public setTipoMercancia(tipoMercancia: string): void {
    this.update((state) => ({ ...state, tipoMercancia }));
  }

  /**
   * Establece el valor de la propiedad "usoEspecifico" en el estado.
   *
   * @param usoEspecifico - El valor del uso específico que se desea establecer.
   */
  public setUsoEspecifico(usoEspecifico: string): void {
    this.update((state) => ({ ...state, usoEspecifico }));
  }

  /**
   * Establece el valor de la propiedad "condicion" en el estado.
   *
   * @param condicion - El valor de la condición que se desea establecer.
   */
  public setCondicion(condicion: string): void {
    this.update((state) => ({ ...state, condicion }));
  }

  /**
   * Establece el valor de la propiedad "marca" en el estado.
   *
   * @param marca - El valor de la marca que se desea establecer.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({ ...state, marca }));
  }

  /**
   * Establece el valor de la propiedad "ano" en el estado.
   *
   * @param ano - El valor del año que se desea establecer.
   */
  public setAno(ano: string): void {
    this.update((state) => ({ ...state, ano }));
  }

  /**
   * Establece el valor de la propiedad "modelo" en el estado.
   *
   * @param modelo - El valor del modelo que se desea establecer.
   */
  public setModelo(modelo: string): void {
    this.update((state) => ({ ...state, modelo }));
  }
  /**
   * Establece el valor de la propiedad "serie" en el estado.
   *
   * @param serie - El valor de la serie que se desea establecer.
   */
  public setSerie(serie: string): void {
    this.update((state) => ({ ...state, serie }));
  }
  /**
   * Establece el valor de la propiedad "manifesto" en el estado.
   *
   * @param manifesto - El valor del manifiesto que se desea establecer.
   */
  public setManifesto(manifesto: boolean): void {
    this.update((state) => ({ ...state, manifesto }));
  }
  /**
   * Establece el valor de la propiedad "calle" en el estado.
   *
   * @param calle - El valor de la calle que se desea establecer.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({ ...state, calle }));
  }
  /**
   * Establece el valor de la propiedad "numeroExterior" en el estado.
   *
   * @param numeroExterior - El valor del número exterior que se desea establecer.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({ ...state, numeroExterior }));
  }
  /**
   * Establece el valor de la propiedad "numeroInterior" en el estado.
   *
   * @param numeroInterior - El valor del número interior que se desea establecer.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({ ...state, numeroInterior }));
  }
  /**
   * Establece el valor de la propiedad "telefono" en el estado.
   *
   * @param telefono - El valor del teléfono que se desea establecer.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({ ...state, telefono }));
  }
  /**
   * Establece el valor de la propiedad "correoElectronico" en el estado.
   *
   * @param correoElectronico - El valor del correo electrónico que se desea establecer.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({ ...state, correoElectronico }));
  }
  /**
   * Establece el valor de la propiedad "pais" en el estado.
   *
   * @param pais - El valor del país que se desea establecer.
   */ 
  public setPais(pais: string): void {
    this.update((state) => ({ ...state, pais }));
  }
  /**
   * Establece el valor de la propiedad "codigoPostal" en el estado.
   *
   * @param codigoPostal - El valor del código postal que se desea establecer.
   */
  public setCodigoPostal(codigoPostal: string): void {
  this.update((state) => ({ ...state, codigoPostal }));
  }
  /**
   * Establece el valor de la propiedad "estado" en el estado.
   *
   * @param estado - El valor del estado que se desea establecer.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({ ...state, estado }));
  }
  /**
   * Establece el valor de la propiedad "colonia" en el estado.
   *
   * @param colonia - El valor de la colonia que se desea establecer.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({ ...state, colonia }));
  }
  /**
   * Establece el valor de la propiedad "radioParcial" en el estado.
   *
   * @param opcion - El valor booleano que indica si la opción parcial está seleccionada.
   */
  public setFolioOriginal(folioOriginal: string): void {
  this.update((state) => ({ ...state, folioOriginal }));
  }
  /**
   * Establece el valor de la propiedad "justificacionDelDesistimiento" en el estado.
   *
   * @param justificacionDelDesistimiento - La justificación del desistimiento que se desea establecer.
   */
  public setJustificacionDelDesistimiento(justificacionDelDesistimiento: string): void {
  this.update((state) => ({ ...state, justificacionDelDesistimiento }));
  }
  /**
   * Establece el valor de la propiedad "opcion" en el estado.
   *
   * @param opcion - El valor string que indica si la opción está seleccionada.
   */
  public setOpcion(opcion: string): void {
    this.update((state) => ({ ...state, opcion }));
  }

  /**
   * Limpia la solicitud actual restableciendo su estado.
   * Este método llama a la función `reset` para reiniciar los valores
   * de la solicitud a su estado inicial.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
