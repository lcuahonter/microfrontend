import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

import { MercanciaConfiguracionItem, Mercancias } from '../../enum/mercancia-tabla.enum';

import { DestinatarioConfiguracionItem } from '../../enum/destinatario-tabla.enum';
import { Catalogo } from '@libs/shared/data-access-user/src';


export interface SolicitudPayload {
  cve_regimen: string,
  cve_clasificacion_regimen: string,
  rol_capturista: string
  aduanas_entrada: string[],
  aduanas_salida: string[],
  movimientos: string[],
  mercancias: Mercancias[],
  destinatario: DestinatarioConfiguracionItem,
  pago: Pago,
  solicitante: Solicitante
}


/**
 * Interfaz que define el estado de la solicitud "Trámite 230901".
 * Contiene las propiedades necesarias para gestionar el estado del trámite,
 * incluyendo información sobre el movimiento, régimen, mercancías, y datos de pago.
 * 
 * @tipoDeMovimiento Tipo de movimiento seleccionado en el trámite.
 * @tipoDeRegimen Tipo de régimen seleccionado en el trámite.
 * @terecerosPopupState Estado del popup de terceros (abierto o cerrado).
 * @entidadFederativa Entidad federativa seleccionada en el trámite. 
 * @claveDeReferencia Clave de referencia asociada al trámite.
 * @cadenaPagoDependencia Cadena de pago proporcionada por la dependencia.
 * @impPago Importe del pago realizado.
 * @fec_pago Fecha en la que se realizó el pago.
 * @banco Banco donde se efectuó el pago.
 * @llaveDePago Llave única asociada al pago.
 */
export interface Solicitud230901State {
  idSolicitud: number,
  cve_regimen: string,
  cve_clasificacion_regimen: string,
  aduanas_entrada?: string[],
  aduanas_salida?: string[],
  movimientos?: string[],
  mercancias: MercanciaConfiguracionItem[],
  destinatario: DestinatarioConfiguracionItem[],
  aduanas_seleccionadas: string[],
  movimientos_seleccionados: string[],
  entidadFederativa: string,
  pasoUno: TabsValidos[],
  pago: Pago,
  solicitante: Solicitante,
  rol_capturista?: string,
  clasificacion_regimen?: Catalogo[],
  regimen?: Catalogo[]
}

/**
 * Representa la información relacionada con un pago.
 * 
 * @interface Pago
 * 
 * @property {string} cve_banco - Clave del banco donde se realizó el pago.
 * @property {number} imp_pago - Importe total del pago.
 * @property {string} fec_pago - Fecha en la que se realizó el pago.
  * @property {string} llave_pago - Llave única que identifica el pago.
 * @property {string} cve_referencia_bancaria - Clave de referencia bancaria asociada al pago.
 * @property {string} cadena_pago_dependencia - Cadena de pago proporcionada por la dependencia.
 */
export interface Pago {
  cve_banco: string,
  imp_pago: number
  fec_pago: string,
  llave_pago: string,
  cve_referencia_bancaria: string,
  cadena_pago_dependencia: string,
  banco?: Catalogo[]
}

export interface DestinatarioForm {
  entidadFederativa: string,
  destinatario: string[]
}
/**
 * Representa la información relacionada al solicitante
 * 
 * @interface Solicitante
 * 
 * @property {string} rfc - Rfc del solictante.
 * @property {number} nombre - Nombre solicitante.
 * @property {string} certificado_serial_number - certificado_serial_number solictante.
 */
export interface Solicitante {
  rfc: string,
  nombre: string,
  certificado_serial_number: string
}

export interface Destinatario {
  codigo_postal: string,
  cve_pais: string,
  cve_entidad_federativa: string,
  domicilio: string,
  ciudad: string,
  es_nuevo: boolean,
  pais: string,
  id_direccion?: string
}

/**
 * 
 * Función que crea el estado inicial de la solicitud "Trámite 230901".
 * Se utiliza para inicializar el estado del almacén.
 *
 * {Solicitud230901State} El estado inicial de la solicitud.
 */
export function createInitialState(): Solicitud230901State {
  return DEFAULT_VALUE_SOLICITUD_STATE;
}

const DEFAULT_TABS = [
  { nombreTab: 'solicitud', paginaTab: 2, completado: false },
  { nombreTab: 'tercero', paginaTab: 3, completado: false },
  { nombreTab: 'pagoDerechos', paginaTab: 4, completado: false }]

const DEFAULT_COMBO = [
  { id: 0, descripcion: '', clave: '' }]

export const DEFAULT_VALUE_SOLICITUD_STATE = {
  idSolicitud: 0,
  cve_regimen: '',
  cve_clasificacion_regimen: '',
  aduanas_entrada: [],
  aduanas_salida: [],
  movimientos: [],
  mercancias: [],
  destinatario: [],
  entidadFederativa: '',
  aduanas_seleccionadas: [],
  movimientos_seleccionados: [],
  pasoUno: DEFAULT_TABS,
  rol_capturista: '',
  pago: {
    cve_banco: '',
    imp_pago: 0,
    fec_pago: '',
    llave_pago: '',
    cve_referencia_bancaria: '',
    cadena_pago_dependencia: '',
    banco: []
  },
  solicitante: {
    rfc: '',
    nombre: '',
    certificado_serial_number: ''
  },
  clasificacion_regimen: [],
  regimen: []
};


/**
 * Store de la interfaz de DEFAULT_CONSULT_STATE
 */
export const DEFAULT_CONSULT_STATE = {
  procedureId: '',
  parameter: '',
  department: '',
  folioTramite: '',
  tipoDeTramite: '',
  estadoDeTramite: '',
  readonly: false,
  create: true,
  update: true,
  consultaioSolicitante: null,
  action_id: '',
  current_user: '',
  id_solicitud: '',
  nombre_pagina: '',
  idSolicitudSeleccionada: ''
};

export interface TabsValidos {
  nombreTab?: string,
  paginaTab: number,
  completado: boolean
}

/**
 * 
 * Clase que representa el almacén (store) para gestionar el estado del "Trámite 230901".
 * Utiliza Akita para proporcionar un manejo reactivo del estado.
 */
@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite230901', resettable: true })
export class Tramite230901Store extends Store<Solicitud230901State> {

  /**
   * 
   * Constructor que inicializa el almacén con el estado inicial.
   */
  constructor() {
    super(createInitialState());
  }


  /**
   * @método
   * @nombre establecerDatos
   * @descripción
   * Actualiza el estado con los valores proporcionados.
   * 
   * @param {Partial<Tramites30401State>} datos - Valores parciales para actualizar el estado.
   */
  public establecerDatos(datos: Partial<Solicitud230901State>): void {
    this.update((state) => ({
      ...state,
      ...datos,
    }));
  }

  /**
   * 
   * Actualiza el estado con los datos de la tabla de mercancía proporcionados.
   *
   * {ConfiguracionItem[]} Mercancias - Los datos de la tabla de mercancía.
   */
  public setMercancias(mercancias: MercanciaConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      mercancias,
    }));
  }

  /**
   * 
   * Actualiza el estado con los datos de la tabla de destinatario proporcionados.
   *
   * {ConfiguracionItem[]} Destinatario - Los datos de la tabla de destinatario.
   */
  public setDestinatario(destinatario: DestinatarioConfiguracionItem[]): void {
    this.update((state) => ({
      ...state,
      destinatario,
    }));
  }

  /**
  * 
  * Actualiza el estado con los datos de Pago Derechos.
  *
  * {ConfiguracionItem[]} Pago Derechos - Los datos de la pago de derechos.
  */
  public setPagoDerechos(pago: Pago): void {
    this.update((state) => ({
      ...state,
      pago,
    }));
  }

  /**
  * 
  * Actualiza el estado con los datos del solicitante.
  *
  * {ConfiguracionItem[]} Solicitante - Los datos del solicitante.
  */
  public setDatosSolicitante(solicitante: Solicitante): void {
    this.update((state) => ({
      ...state,
      solicitante,
    }));
  }

  /**
   * 
   * Actualiza el estado de los fomrularios de Paso Uno
   *
   */
  public setPasoUno(datos: TabsValidos): void {

    this.update((state) => {
      const { paginaTab, completado } = datos
      const updatedTabs = state.pasoUno.map(item => {
        if (item.paginaTab === paginaTab) {
          return { ...item, completado };
        }
        return item;
      });
      return { ...state, pasoUno: updatedTabs }
    })
  }
}