import { Injectable } from '@angular/core';
import {OperacionDeImportacion, Solicitante} from "../models/aviso-catalogo.model";
import { Store } from '@datorama/akita';
import { StoreConfig } from '@datorama/akita';

/**
 * Interfaz que define la estructura del estado de la solicitud 32501.
 */
export interface Solicitud32501State {
  /**
   * Código único de identificación.
   */
  adace: string;

  /**
   * Fecha de inicio de exposición en formato string.
   */
  fechaIniExposicion: string;

  /**
   * Identificador genérico.
   */
  ideGenerica1: string | number;

  /**
   * Identificación de la transacción en VU.
   */
  idTransaccionVU: string;

  /**
   * Clave de fracción arancelaria, puede ser un número o una cadena.
   */
  cveFraccionArancelaria: string | number;

  /**
   * Número de Identificación Comercial.
   */
  nico: string;

  /**
   * Peso de la mercancía.
   */
  peso: string;

  /**
   * Valor en dólares estadounidenses.
   */
  valorUSD: string;

  /**
   * Descripción detallada de la mercancía.
   */
  descripcionMercancia: string;

  /**
   * Nombre comercial de la mercancía.
   */
  nombreComercial: string;

  /**
   * Identificación de la entidad federativa, puede ser un número o una cadena.
   */
  entidadFederativa: string | number;

  /**
   * Identificación de la delegación o municipio, puede ser un número o una cadena.
   */
  delegacionMunicipio: string | number;

  /**
   * Identificación de la colonia, puede ser un número o una cadena.
   */
  colonia: string | number;

  /**
   * Nombre de la calle.
   */
  calle: string;

  /**
   * Número exterior del domicilio.
   */
  numeroExterior: string;

  /**
   * Número interior del domicilio.
   */
  numeroInterior: string;

  /**
   * Código postal del domicilio.
   */
  codigoPostal: string;

  /**
   * Número de patente asociado.
   */
  patente: string;

  /**
   * Registro Federal de Contribuyentes (RFC).
   */
  rfc: string;

  /**
   * Número de pedimento aduanal.
   */
  pedimento: string;

  /**
   * Código de la aduana, puede ser un número o una cadena.
   */
  aduana: string | number;

  /** Descripcion Aduana */
  aduana_desc: string;
  
  /**
   * Costos de servicios de terceros, puede ser un número o una cadena.
   */
  serviciosTerceros:string|number;
  /**
   * Lista de operaciones de importación asociadas a la solicitud.
   */
  operacionDeImportacionLista: OperacionDeImportacion[];

  /**
   * Id de la solicitud
   */
  idSolicitud: number;

  /**
   * Id de documentos cargados
   */
  documentoSelecionadoLista: Number[];

  /**
   * Número de trámite generado
   */
  numeroTramite: number;

  /** Solicitante */
  solicitante: Solicitante;

}

/**
 * Función para crear el estado inicial de la solicitud 32501.
 * Devuelve un objeto con valores vacíos o por defecto.
 */
export function createInitialSolicitudState(): Solicitud32501State {
  return {
    adace: '2424',
    fechaIniExposicion: '',
    ideGenerica1: '',
    idTransaccionVU: '',
    cveFraccionArancelaria: '',
    nico: '',
    peso: '',
    valorUSD: '',
    descripcionMercancia: '',
    nombreComercial: '',
    entidadFederativa: '',
    delegacionMunicipio: '',
    colonia: '',
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    codigoPostal: '',
    patente: '',
    rfc: '',
    pedimento: '',
    aduana: '',
    aduana_desc: '',
    serviciosTerceros: '',
    operacionDeImportacionLista:[],
    idSolicitud: 0,
    numeroTramite: 0,
    documentoSelecionadoLista: [], 
    solicitante: {
      rfc: '',
      denominacion: '',
      actividadEconomica: '',
      correoElectronico: '',
      pais: '',
      codigoPostal: '',
      entidadFederativa: '',
      municipio: '',
      localidad: '',
      colonia: '',
      calle: '',
      nExt: '',
      nInt: '',
      lada: '',
      telefono: '',
      adace: '',
      cveEntidadFederativa: '',
      tipoPersona: ''
    },    
  };
}

/**
 * Servicio de almacenamiento para la solicitud 32501.
 * Se encarga de gestionar y actualizar el estado de la solicitud.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'solicitud32501', resettable: true })
export class Solicitud32501Store extends Store<Solicitud32501State> {
  /**
   * Constructor que inicializa el estado de la solicitud con valores predeterminados.
   */
  constructor() {
    super(createInitialSolicitudState());
  }

  /** Métodos para actualizar diferentes propiedades del estado de la solicitud. */
  public establecerDatos(datos: Partial<Solicitud32501State>): void {
    this.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
   * Restaura el estado del almacén a su valor inicial.
   */
  resetStore(): void {
    this.reset();
  }
}
