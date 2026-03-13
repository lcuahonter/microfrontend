import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Solicitante } from '../../core/models/32502/tramite32502.model'

/**
 * Creacion del estado inicial para la interfaz de tramite 32502
 * @returns Solicitud32502
 */
export interface Solicitud32502State {
  adace: string;
  razonSocial: string;
  rfc: string;
  rfcExtranjero: string;
  cveFraccionArancelaria: string;
  reglaFraccion: string;
  nico: string;
  valorUSD: string;
  marca: string;
  peso: string;
  fechaInicio: string;
  numeroSerie: string;
  descripcionMercancia: string;
  informacionExtra: string;
  entidadFederativa: string;
  delegacionMunicipio: string;
  colonia: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  patenteAutorizacion: string;
  rfcAgenteAduanal: string;
  numeroPedimento: string;
  claveAduana: string;
  informacionConfidencial: boolean;
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  tipoDocumento: string;
  dropdown: string;
  commonCheckbox: boolean;
  individualCheckbox: boolean [];
  cve_declaracion: string;

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
 * Crea el estado inicial para la solicitud 32502.
 *
 * @returns {Solicitud32502State} Objeto con todos los campos inicializados.
 */
export function createInitialState(): Solicitud32502State {
  return {
    adace: '',
    razonSocial: '',
    rfc: '',
    rfcExtranjero: '',
    cveFraccionArancelaria: '',
    reglaFraccion: '',
    nico: '',
    valorUSD: '',
    marca: '',
    peso: '',
    fechaInicio: '',
    numeroSerie: '',
    descripcionMercancia: '',
    informacionExtra: '',
    entidadFederativa: '',
    delegacionMunicipio: '',
    colonia: '',
    informacionConfidencial: false,
    calle: '',
    numeroExterior: '',
    numeroInterior: '',
    codigoPostal: '',
    patenteAutorizacion: '',
    rfcAgenteAduanal: '',
    numeroPedimento: '',
    claveAduana: '',
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    tipoDocumento: '',
    dropdown: '',
    commonCheckbox: false,
    individualCheckbox: [false, false, false, false, false, false],
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
  cve_declaracion: ''
  };
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tramite32502', resettable: true })
/**
 * Clase encargada de manejar y actualizar el estado de la solicitud 32502.
 */
export class Tramite32502Store extends Store<Solicitud32502State> {
 
 
  /**
   * Constructor: inicializa el estado con valores por defecto.
   */
  constructor() {
    super(createInitialState());
  }


    /** Métodos para actualizar diferentes propiedades del estado de la solicitud. */
    public establecerDatos(datos: Partial<Solicitud32502State>): void {
      this.update((state) => ({
        ...state,
        ...datos,
      }));
    }
}