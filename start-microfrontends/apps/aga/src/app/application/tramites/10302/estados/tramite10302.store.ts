import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un catálogo genérico.
 * Un catálogo contiene un identificador único y una descripción asociada.
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
 * Interfaz que representa el estado inicial de la solicitud 10302.
 */
export interface Solicitud10302State {
  /**
   * Nombre del organismo público.
   */
  organismoPublico: string;

  /**
   * Lista de aduanas disponibles.
   */
  aduana: Catalogo[] | null;

  /**
   * Uso específico de la mercancía.
   */
  usoEspecifico: string;

  /**
   * Bandera para mostrar la tabla.
   */
  showTabla: boolean;

  /**
   * Tipo de mercancía.
   */
  tipoDeMercancia: string;

  /**
   * Unidad de medida de la mercancía.
   */
  unidadMedida: string;

  /**
   * Condición de la mercancía.
   */
  condicionMercancia: string;

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
   * Lista de países disponibles.
   */
  pais: Catalogo[] | null;

  /**
   * RFC del solicitante.
   */
  rfc: string;

  /**
   * Número del programa IMMEX.
   */
  numeroProgramaImmex: string;

  /**
   * Razón social del solicitante.
   */
  razonSocial: string;

  /**
   * Calle del domicilio fiscal.
   */
  calle: string;

  /**
   * Número exterior del domicilio fiscal.
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio fiscal.
   */
  numeroInterior: string;

  /**
   * Correo electrónico del solicitante.
   */
  correoElectronico: string;

  /**
   * Teléfono del solicitante.
   */
  telefono: string;

  /**
   * Correo electrónico opcional del solicitante.
   */
  correoElectronicoOpcional: string;

  /**
   * Teléfono opcional del solicitante.
   */
  telefonoOpcional: string;

  /**
   * Código postal del domicilio fiscal.
   */
  codigoPostal: string;

  /**
   * Estado del domicilio fiscal.
   */
  estado: string;

  /**
   * Colonia del domicilio fiscal.
   */
  colonia: string;

  /**
   * Datos relacionados con la mercancía.
   */
  datosDelMercancia: [];
}

/**
 * Función que crea el estado inicial de la solicitud 10302.
 * @returns Estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud10302State {
  return {
    organismoPublico: '',
    aduana: null,
    usoEspecifico: '',
    showTabla: true,
    tipoDeMercancia: '',
    unidadMedida: '',
    condicionMercancia: '1',
    ano: null,
    cantidad: '',
    marca: '',
    modelo: '',
    serie: '',
    pais: null,
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    telefono: '',
    correoElectronico: '',
    correoElectronicoOpcional: '',
    telefonoOpcional: '',
    rfc: '',
    numeroProgramaImmex: '',
    razonSocial: '',
    codigoPostal: '',
    estado: '',
    colonia: '',
    datosDelMercancia: [],
  };
}

/**
 * Clase que representa el store para manejar el estado de la solicitud 10302.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite10302', resettable: true })
export class Tramite10302Store extends Store<Solicitud10302State> {
  /**
   * Constructor del store.
   * Inicializa el estado con los valores predeterminados.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Establece el organismo público en el estado.
   * @param organismoPublico Nombre del organismo público.
   */
  public setOrganismoPublico(organismoPublico: string): void {
    this.update((state) => ({
      ...state,
      organismoPublico,
    }));
  }

  /**
   * Establece la lista de aduanas en el estado.
   * @param aduana Lista de aduanas.
   */
  public setAduana(aduana: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      aduana,
    }));
  }

  /**
   * Establece el tipo de mercancía en el estado.
   * @param tipoDeMercancia Tipo de mercancía.
   */
  public setTipoDeMercancia(tipoDeMercancia: string): void {
    this.update((state) => ({
      ...state,
      tipoDeMercancia,
    }));
  }

  /**
   * Establece la unidad de medida en el estado.
   * @param unidadMedida Unidad de medida.
   */
  public setUnidadMedida(unidadMedida: string): void {
    this.update((state) => ({
      ...state,
      unidadMedida,
    }));
  }

  /**
   * Establece la condición de la mercancía en el estado.
   * @param condicionMercancia Condición de la mercancía.
   */
  public setCondicionMercancia(condicionMercancia: string): void {
    this.update((state) => ({
      ...state,
      condicionMercancia,
    }));
  }

  /**
   * Establece la lista de años en el estado.
   * @param ano Lista de años.
   */
  public setAno(ano: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      ano,
    }));
  }

  /**
   * Establece la cantidad de mercancía en el estado.
   * @param cantidad Cantidad de mercancía.
   */
  public setCantidad(cantidad: string): void {
    this.update((state) => ({
      ...state,
      cantidad,
    }));
  }

  /**
   * Establece la marca de la mercancía en el estado.
   * @param marca Marca de la mercancía.
   */
  public setMarca(marca: string): void {
    this.update((state) => ({
      ...state,
      marca,
    }));
  }

  /**
   * Establece el modelo de la mercancía en el estado.
   * @param modelo Modelo de la mercancía.
   */
  public setModelo(modelo: string): void {
    this.update((state) => ({
      ...state,
      modelo,
    }));
  }

  /**
   * Establece la serie de la mercancía en el estado.
   * @param serie Serie de la mercancía.
   */
  public setSerie(serie: string): void {
    this.update((state) => ({
      ...state,
      serie,
    }));
  }

  /**
   * Establece la lista de países en el estado.
   * @param pais Lista de países.
   */
  public setPais(pais: Catalogo[]): void {
    this.update((state) => ({
      ...state,
      pais,
    }));
  }

  /**
   * Establece el uso específico de la mercancía en el estado.
   * @param usoEspecifico Uso específico de la mercancía.
   */
  public setUsoEspecifico(usoEspecifico: string): void {
    this.update((state) => ({
      ...state,
      usoEspecifico,
    }));
  }

  /**
   * Establece la calle del domicilio fiscal en el estado.
   * @param calle Calle del domicilio fiscal.
   */
  public setCalle(calle: string): void {
    this.update((state) => ({
      ...state,
      calle,
    }));
  }

  /**
   * Establece el número exterior del domicilio fiscal en el estado.
   * @param numeroExterior Número exterior del domicilio fiscal.
   */
  public setNumeroExterior(numeroExterior: string): void {
    this.update((state) => ({
      ...state,
      numeroExterior,
    }));
  }

  /**
   * Establece el número interior del domicilio fiscal en el estado.
   * @param numeroInterior Número interior del domicilio fiscal.
   */
  public setNumeroInterior(numeroInterior: string): void {
    this.update((state) => ({
      ...state,
      numeroInterior,
    }));
  }

  /**
   * Establece el teléfono del solicitante en el estado.
   * @param telefono Teléfono del solicitante.
   */
  public setTelefono(telefono: string): void {
    this.update((state) => ({
      ...state,
      telefono,
    }));
  }

  /**
   * Establece el correo electrónico del solicitante en el estado.
   * @param correoElectronico Correo electrónico del solicitante.
   */
  public setCorreoElectronico(correoElectronico: string): void {
    this.update((state) => ({
      ...state,
      correoElectronico,
    }));
  }

  /**
   * Establece el código postal del domicilio fiscal en el estado.
   * @param codigoPostal Código postal del domicilio fiscal.
   */
  public setCodigoPostal(codigoPostal: string): void {
    this.update((state) => ({
      ...state,
      codigoPostal,
    }));
  }

  /**
   * Establece el estado del domicilio fiscal en el estado.
   * @param estado Estado del domicilio fiscal.
   */
  public setEstado(estado: string): void {
    this.update((state) => ({
      ...state,
      estado,
    }));
  }

  /**
   * Establece la colonia del domicilio fiscal en el estado.
   * @param colonia Colonia del domicilio fiscal.
   */
  public setColonia(colonia: string): void {
    this.update((state) => ({
      ...state,
      colonia,
    }));
  }

  /**
   * Establece el RFC del solicitante en el estado.
   * @param rfc RFC del solicitante.
   */
  public setRfc(rfc: string): void {
    this.update((state) => ({
      ...state,
      rfc,
    }));
  }

  /**
   * Establece el número del programa IMMEX en el estado.
   * @param numeroProgramaImmex Número del programa IMMEX.
   */
  public setNumeroProgramaImmex(numeroProgramaImmex: string): void {
    this.update((state) => ({
      ...state,
      numeroProgramaImmex,
    }));
  }

  /**
   * Establece la razón social del solicitante en el estado.
   * @param razonSocial Razón social del solicitante.
   */
  public setRazonSocial(razonSocial: string): void {
    this.update((state) => ({
      ...state,
      razonSocial,
    }));
  }

  /**
   * Establece el correo electrónico opcional del solicitante en el estado.
   * @param correoElectronicoOpcional Correo electrónico opcional del solicitante.
   */
  public setCorreoElectronicoOpcional(correoElectronicoOpcional: string): void {
    this.update((state) => ({
      ...state,
      correoElectronicoOpcional,
    }));
  }

  /**
   * Establece el teléfono opcional del solicitante en el estado.
   * @param telefonoOpcional Teléfono opcional del solicitante.
   */
  public setTelefonoOpcional(telefonoOpcional: string): void {
    this.update((state) => ({
      ...state,
      telefonoOpcional,
    }));
  }

  /**
   * Establece los datos del contenedor.
   * @param datosDelMercancia Datos del contenedor.
   */
  public setDelMercancia(datosDelMercancia: []): void {
    this.update((state) => ({
      ...state,
      datosDelMercancia,
    }));
  }

  /**
   * Limpia los datos de la solicitud.
   */
  public limpiarSolicitud(): void {
    this.reset();
  }
}
