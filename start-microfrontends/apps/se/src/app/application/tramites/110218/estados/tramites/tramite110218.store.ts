import { Store, StoreConfig } from '@datorama/akita';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';

import { CompliMentaria } from '../../models/certificado-tecnico-japon.enum';
import radioOpciones from '@libs/shared/theme/assets/json/110203/datos-busqueda.json';

/**
 * @interface Solicitud110218State
 * @description Define la estructura del estado para el trámite 110218.
 */
export interface Solicitud110218State {
  /** ID de la solicitud */
  idSolicitud: number | null;

  /** Puerto de embarque de la mercancía */
  puertodeEmbarque: string;

  /** Puerto de desembarque de la mercancía */
  puertodeDesembarque: string;

  /** Puerto de tránsito de la mercancía */
  puertodeTransito: string;

  /** Nombre de la embarcación utilizada */
  nombredelaEmbarcacion: string;

  /** Número de vuelo asociado al trámite */
  numerodeVuelo: string;

  /** Nombre del solicitante */
  nombre: string;

  /** Primer apellido del solicitante */
  primerApellido: string;

  /** Segundo apellido del solicitante */
  segundoApellido: string;

  /** Número de registro fiscal del solicitante o empresa */
  numeroderegistroFiscal: string;

  /** Razón social de la empresa */
  razonSocial: string;

  /** Calle del domicilio fiscal */
  calle: string;

  /** Número y/o letra del domicilio fiscal */
  numeroLetra: string;

  /** Ciudad del domicilio fiscal */
  ciudad: string;

  /** Correo electrónico de contacto */
  correoElectronico: string;

  /** Número de fax del contacto principal */
  fax: string;

  /** Número de teléfono del contacto principal */
  telefono: string;

  /** Nombre del representante legal */
  nombredelRepresentante: string;

  /** Cargo del representante legal */
  cargo: string;

  /** Teléfonos alternativos de contacto */
  telefonos: string;

  /** Faxes alternativos */
  faxs: string;

  /** Correos electrónicos alternativos */
  correoElectronicos: string;

  /** Lugar donde se realiza el trámite */
  lugar: string;

  /** Observaciones adicionales al trámite */
  observaciones: string;

  /** Tabla con datos complementarios */
  tableDataDatos: CompliMentaria[];

  /** Unidad de medida de comercialización */
  unidaddeMedidadeComercializacion: Catalogo | null;

  /** Tipo de factura utilizada */
  tipodeFactura: Catalogo | null;

  /** Descripción complementaria del trámite */
  complementoDelaDescripcion: string;

  /** Marca del producto o mercancía */
  marca: string;

  /** Valor declarado de la mercancía */
  valorMercancia: string;

  /** Número de factura asociada */
  numerodeFactura: string;

  /** Número de solicitud del trámite */
  numeroSolicitud: string;

  /** Fecha en la que se realizó la solicitud */
  fechaSolicitud: string;

  /** Estado actual del trámite */
  estado: string;

  /** Nombre del solicitante o responsable */
  solicitante: string;

  /** **Valor seleccionado dentro del proceso de solicitud** */
  valorSeleccionado: string | number;
  
  /** **Número de certificado asociado a la solicitud** */
  numeroDeCertificado: string;

  /** **Tratado o acuerdo relacionado con la solicitud** */
  tratadoAcuerdo: string;

  /** **País o bloque económico relacionado con la solicitud** */
  paisBloque: string;
}

/**
 * @function createInitialState
 * @returns {Solicitud110218State} Estado inicial del trámite 110218 con valores predeterminados.
 * @description
 * Inicializa todos los campos del estado con valores vacíos, nulos o arreglos vacíos según el tipo de dato.
 * Este estado es utilizado por defecto al crear el store del trámite.
 */
export function createInitialState(): Solicitud110218State {
  return {
    idSolicitud: 0,
    puertodeEmbarque: '',
    puertodeDesembarque: '',
    puertodeTransito: '',
    nombredelaEmbarcacion: '',
    numerodeVuelo: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    numeroderegistroFiscal: '',
    razonSocial: '',
    calle: '',
    numeroLetra: '',
    ciudad: '',
    correoElectronico: '',
    fax: '',
    telefono: '',
    nombredelRepresentante: '',
    cargo: '',
    telefonos: '',
    faxs: '',
    correoElectronicos: '',
    lugar: '',
    observaciones: '',
    tableDataDatos: [],
    unidaddeMedidadeComercializacion: null,
    tipodeFactura: null,
    complementoDelaDescripcion: '',
    marca: '',
    valorMercancia: '',
    numerodeFactura: '',
    numeroSolicitud: '',
    fechaSolicitud: '',
    estado: '',
    solicitante: '',
    valorSeleccionado: radioOpciones?.radioOptions[0].label,
    numeroDeCertificado: '',
    tratadoAcuerdo: '',
    paisBloque: '',
  };
}

/**
 * @class Tramite110218Store
 * @extends Store<Solicitud110218State>
 * @description
 * Store de estado gestionado por Akita para el trámite 110218.
 * Proporciona una estructura centralizada para manejar y actualizar el estado de la solicitud.
 *
 * @example
 * ```ts
 * tramite110218Store.setTramite110218State({ nombre: 'Juan' });
 * ```
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tramite110218', resettable: true })
export class Tramite110218Store extends Store<Solicitud110218State> {
  /**
   * @constructor
   * Inicializa el store con el estado predeterminado usando `createInitialState`.
   */
  constructor() {
    super(createInitialState());
  }

  /**
   * Guarda el ID de la solicitud en el estado.
   *
   * @param idSolicitud - El ID de la solicitud que se va a guardar.
   */
  public setIdSolicitud(idSolicitud: number): void {
    this.update((state) => ({
      ...state,
      idSolicitud,
    }));
  }

  /**
   * @method setTramite110218State
   * @description
   * Actualiza el estado del trámite con los valores proporcionados.
   * Solo se actualizan las propiedades que estén definidas en el objeto recibido.
   *
   * @param {Partial<Solicitud110218State>} valores - Objeto parcial con las propiedades a actualizar.
   *
   * @example
   * ```ts
   * tramite110218Store.setTramite110218State({ ciudad: 'Monterrey', estado: 'Nuevo León' });
   * ```
   */
  setTramite110218State(valores: Partial<Solicitud110218State>): void {
    this.update((state) => ({
      ...state,
      ...valores,
    }));
  }
}
