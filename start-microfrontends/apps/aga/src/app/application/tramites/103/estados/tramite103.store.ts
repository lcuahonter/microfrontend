import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un catálogo genérico.
 */
export interface Catalogo {
  /**
   * Identificador único del catálogo.
   * @type {number}
   */
  id: number;

  /**
   * Descripción del catálogo.
   * @type {string}
   */
  descripcion: string;
}

/**
 * Interfaz que representa el estado de la solicitud 103.
 */
export interface Solicitud103State {
  /**
   * Número de manifiesto.
   * @type {string}
   */
  manifesto: string;

  /**
   * Organismo público relacionado.
   * @type {string}
   */
  organismoPublico: string;

  /**
   * Aduana seleccionada.
   * @type {string | null}
   */
  aduana: string | null;

  /**
   * Destino de la mercancía.
   * @type {string | null}
   */
  destinoMercancia: string | null;

  /**
   * Indica si se debe mostrar la tabla.
   * @type {boolean}
   */
  showTabla: boolean;

  /**
   * Tipo de mercancía.
   * @type {string}
   */
  tipoDeMercancia: string;

  /**
   * Uso específico de la mercancía.
   * @type {string}
   */
  usoEspecifico: string;

  /**
   * Unidad de medida.
   * @type {string}
   */
  unidadMedida: string;

  /**
   * Información del vehículo.
   * @type {string}
   */
  vehiculo: string;

  /**
   * Condición de la mercancía.
   * @type {string}
   */
  condicionMercancia: string;

  /**
   * Año relacionado.
   * @type {string | null}
   */
  ano: string | null;

  /**
   * Cantidad de mercancía.
   * @type {string}
   */
  cantidad: string;

  /**
   * Marca de la mercancía.
   * @type {string}
   */
  marca: string;

  /**
   * Modelo de la mercancía.
   * @type {string}
   */
  modelo: string;

  /**
   * Serie de la mercancía.
   * @type {string}
   */
  serie: string;

  /**
   * Datos adicionales de la mercancía.
   * @type {Array<unknown>}
   */
  datosDelMercancia: [];

  /**
   * Nombre del importador/exportador.
   * @type {string}
   */
  nombre: string;

  /**
   * Calle del domicilio.
   * @type {string}
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   * @type {number}
   */
  numeroExterior: string | number | null;

  /**
   * Número interior del domicilio.
   * @type {number}
   */
  numeroInterior: string | number | null;

  /**
   * Teléfono de contacto.
   * @type {number}
   */
  telefono: string | number | null;

  /**
   * Correo electrónico de contacto.
   * @type {string}
   */
  correoElectronico: string;

  /**
   * País del domicilio.
   * @type {string | null}
   */
  pais: string | null;

  /**
   * Código postal.
   * @type {number}
   */
  codigoPostal: string | number | null;

  /**
   * Estado del domicilio.
   * @type {number}
   */
  estado: string | number | null;

  /**
   * Colonia del domicilio.
   * @type {number}
   */
  colonia: string | number | null;

  /**
   * Opción adicional.
   * @type {string}
   */
  opcion: string;

  /**
   * Valor seleccionado en algún campo.
   * @type {string | null}
   */
  valorSeleccionado: string | null;

  /**
   * Persona moral relacionada.
   * @type {string}
   */
  personaMoral: string;
}

/**
 * Crea el estado inicial para la solicitud 103.
 * @returns {Solicitud103State} Estado inicial configurado.
 */
export function createInitialState(): Solicitud103State {
  return {
    manifesto: '',
    organismoPublico: '',
    aduana: null,
    destinoMercancia: null,
    showTabla: true,
    tipoDeMercancia: '',
    usoEspecifico: '',
    unidadMedida: '',
    vehiculo: '',
    condicionMercancia: '',
    ano: null,
    cantidad: '',
    marca: '',
    modelo: '',
    serie: '',
    datosDelMercancia: [],
    nombre: '',
    calle: '',
    numeroExterior: null,
    numeroInterior: '',
    telefono: null,
    correoElectronico: '',
    pais: null,
    codigoPostal: null,
    estado: null,
    colonia: null,
    opcion: '',
    valorSeleccionado: null,
    personaMoral: '',
  };
}

/**
 * Store para manejar el estado de la solicitud 103.
 * @extends {Store<Solicitud103State>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite103', resettable: true })
export class Tramite103Store extends Store<Solicitud103State> {
  /**
   * Constructor que inicializa el store con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Actualiza el número de manifiesto en el estado.
   * @param {string} manifesto - Número de manifiesto.
   */
  public setManifesto(manifesto: string): void {
    this.update((state) => ({ ...state, manifesto }));
  }

  /**
   * Actualiza el organismo público en el estado.
   * @param {string} organismoPublico - Nombre del organismo público.
   */
  public setOrganismoPublico(organismoPublico: string): void {
    this.update((state) => ({ ...state, organismoPublico }));
  }
  /**
   * Actualiza el persona moral en el estado.
   * @param {string} personaMoral - Nombre del persona moral.
   */
  public setPersonaMoral(personaMoral: string): void {
    this.update((state) => ({ ...state, personaMoral }));
  }
  /**
   * Actualiza la aduana en el estado.
   * @param {string} aduana - Código de aduana.
   */
  public setAduana(aduana: string): void {
    this.update((state) => ({ ...state, aduana }));
  }

  /**
   * Actualiza el destino de mercancía en el estado.
   * @param {string} destinoMercancia - Destino de la mercancía.
   */
  public setDestinoMercancia(destinoMercancia: string): void {
    this.update((state) => ({ ...state, destinoMercancia }));
  }

  /**
   * Actualiza el tipo de mercancía en el estado.
   * @param {string} tipoDeMercancia - Tipo de mercancía.
   */
  public setTipoDeMercancia(tipoDeMercancia: string): void {
    this.update((state) => ({ ...state, tipoDeMercancia }));
  }

  /**
   * Actualiza el uso específico en el estado.
   * @param {string} usoEspecifico - Uso específico de la mercancía.
   */
  public setUsoEspecifico(usoEspecifico: string): void {
    this.update((state) => ({ ...state, usoEspecifico }));
  }

  /**
   * Actualiza la unidad de medida en el estado.
   * @param {string} unidadMedida - Unidad de medida.
   */
  public setUnidadMedida(unidadMedida: string): void {
    this.update((state) => ({ ...state, unidadMedida }));
  }

  /**
   * Actualiza el vehículo en el estado.
   * @param {string} vehiculo - Información del vehículo.
   */
  public setVehiculo(vehiculo: string): void {
    this.update((state) => ({ ...state, vehiculo }));
  }

  /**
   * Actualiza la condición de la mercancía en el estado.
   * @param {string} condicionMercancia - Condición de la mercancía.
   */
  public setCondicionMercancia(condicionMercancia: string): void {
    this.update((state) => ({ ...state, condicionMercancia }));
  }

  /**
   * Actualiza el año en el estado.
   * @param {string} ano - Año relacionado.
   */
  public setAno(ano: string): void {
    this.update((state) => ({ ...state, ano }));
  }

  /**
   * Actualiza la cantidad en el estado.
   * @param {string} cantidad - Cantidad de mercancía.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({ ...state, cantidad }));
  }

  /**
   * Actualiza la marca en el estado.
   * @param {string} marca - Marca de la mercancía.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({ ...state, marca }));
  }

  /**
   * Actualiza el modelo en el estado.
   * @param {string} modelo - Modelo de la mercancía.
   */
  public setModelo(modelo: string): void {
    this.update((state) => ({ ...state, modelo }));
  }

  /**
   * Actualiza la serie en el estado.
   * @param {string} serie - Serie de la mercancía.
   */
  public setSerie(serie: string): void {
    this.update((state) => ({ ...state, serie }));
  }

  /**
   * Actualiza los datos de la mercancía en el estado.
   * @param {Array<unknown>} datosDelMercancia - Datos adicionales.
   */
  public setDelMercancia(datosDelMercancia: []): void {
    this.update((state) => ({ ...state, datosDelMercancia }));
  }

  /**
   * Actualiza el nombre en el estado.
   * @param {string} nombre - Nombre del importador/exportador.
   */
  public setNombre(nombre: string): void {
    this.update((state) => ({ ...state, nombre }));
  }

  /**
   * Actualiza la calle en el estado.
   * @param {string} calle - Calle del domicilio.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({ ...state, calle }));
  }

  /**
   * Actualiza el número exterior en el estado.
   * @param {number} numeroExterior - Número exterior del domicilio.
   */
  public setNumeroExterior(numeroExterior: number): void {
    this.update((state) => ({ ...state, numeroExterior }));
  }

  /**
   * Actualiza el número interior en el estado.
   * @param {number} numeroInterior - Número interior del domicilio.
   */
  public setNumeroInterior(numeroInterior: number): void {
    this.update((state) => ({ ...state, numeroInterior }));
  }

  /**
   * Actualiza el teléfono en el estado.
   * @param {number} telefono - Teléfono de contacto.
   */
  public setTelefono(telefono: number): void {
    this.update((state) => ({ ...state, telefono }));
  }

  /**
   * Actualiza el correo electrónico en el estado.
   * @param {string} correoElectronico - Correo electrónico de contacto.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({ ...state, correoElectronico }));
  }

  /**
   * Actualiza el país en el estado.
   * @param {string} pais - País del domicilio.
   */
  public setPais(pais: string): void {
    this.update((state) => ({ ...state, pais }));
  }

  /**
   * Actualiza el código postal en el estado.
   * @param {number} codigoPostal - Código postal.
   */
  public setCodigoPostal(codigoPostal: number): void {
    this.update((state) => ({ ...state, codigoPostal }));
  }

  /**
   * Actualiza el estado en el estado.
   * @param {number} estado - Estado del domicilio.
   */
  public setEstado(estado: number): void {
    this.update((state) => ({ ...state, estado }));
  }

  /**
   * Actualiza la colonia en el estado.
   * @param {number} colonia - Colonia del domicilio.
   */
  public setColonia(colonia: number): void {
    this.update((state) => ({ ...state, colonia }));
  }

  /**
   * Actualiza la opción en el estado.
   * @param {string} opcion - Opción adicional.
   */
  public setOpcion(opcion: string): void {
    this.update((state) => ({ ...state, opcion }));
  }

  /**
   * Actualiza el valor seleccionado en el estado.
   * @param {string | null} valorSeleccionado - Valor seleccionado.
   */
  public setValorSeleccionado(valorSeleccionado: string | null): void {
    this.update((state) => ({ ...state, valorSeleccionado }));
  }

  /**
   * Restablece el estado a los valores iniciales.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}