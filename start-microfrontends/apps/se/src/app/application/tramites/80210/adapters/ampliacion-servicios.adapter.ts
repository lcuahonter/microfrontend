/**
 * @fileoverview
 * This file contains the adapter service for converting between Akita state and API payload formats
 * for the ampliacion servicios trámite 80210.
 */
import { Injectable } from '@angular/core';
import type { Tramites80210State } from '../estados/tramites80210.store';

/**
 * Interface representing a service in the payload
 */
interface Servicio {
  tipoServicio: string;
  claveServicio: number;
  descripcion: string;
  descripcionTipo: string;
  testado?: boolean;
  estatus?: boolean;
  desEstatus?: string;
}

/**
 * Interface representing a national company in the payload
 */
interface EmpresaNacional {
  razonSocial: string;
  rfc: string;
  idServicio: string;
  descripcionServicio: string;
  numeroPrograma: string;
  tiempoPrograma: string;
  idCompuestoEmpresa?: string;
  idServicioAutorizado?: number;
}

/**
 * Interface representing the solicitud details
 */
interface Solicitud {
  modalidad: string;
  folioProgramaAutorizado: number;
  folioPrograma?: string;
  anioPrograma: string;
}

interface PlantasSubmanufactureras {
  idPlanta: string;
  calle: string;
  numeroInterior: string;
  numeroExterior: string;
  codigoPostal: string;
  colonia: string;
  delegacionMunicipio: string;
  entidadFederativa: string;
  pais: string;
  rfc: string;
  domicilioFiscal: string;
  razonSocial: string;
  claveEntidadFederativa: string;
  clavePlantaEmpresa: string;
  clavePais: string;
  claveDelegacionMunicipio: string;
  estatus: boolean;
  desEstatus: string;
  localidad: string;
  telefono: string;
  fax: string;
  idDireccion: string;
  testadoP: number;
  empresaCalle: string;
  empresaNumeroInterior: string;
  empresaNumeroExterior: string;
  empresaCodigoPostal: string;
  empresaColonia: string;
  empresaDelegacionMunicipio: string;
  empresaEntidadFederativa: string;
  empresaPais: string;
  empresaClaveEntidadFederativa: string;
  empresaClavePlantaEmpresa: string;
  empresaClavePais: string;
  empresaClaveDelegacionMunicipio: string;
  empresaCorreoElectronico: string;
  empresaTipo: string;
  permaneceMercancia: string;
  rfcActivo: string;
  domiciliosInscritos: string;
  personaMoralISR: string;
  opinionSAT: string;
  fecha32D: string;
  firmantes: {
    idPlantaF: string;
    tipoFirmante: string;
    descTipoFirmante: string;
  }[];
  datosComplementarios: {
    idPlantaC: string;
    idDato: string;
    amparoPrograma: string;
    tipoDocumento: string;
    descDocumento: string;
    descripcionOtro: string;
    documentoRespaldo: string;
    descDocRespaldo: string;
    respaldoOtro: string;
    fechaFirma: string;
    fechaVigencia: string;
    fechaFirmaRespaldo: string;
    fechaVigenciaRespaldo: string;
  }[];
}

/**
 * Interface representing the API payload structure for trámite 80205
 */
export interface AmpliacionServiciosPayload {
  tipoDeSolicitud: string;
  idSolicitud: number;
  idTipoTramite: number;
  rfc: string;
  cveUnidadAdministrativa: string;
  costoTotal: number;
  certificadoSerialNumber: string;
  certificado: string;
  numeroFolioTramiteOriginal: string;
  nombre: string;
  apPaterno: string;
  apMaterno: string;
  telefono: string;
  solicitud: Solicitud;
  servicios: Servicio[];
  empresasNacionales: EmpresaNacional[];
  discriminatorValue: string;
  discriminator_value?: string;
  solicitante: object;
  domicilio: object;
  plantasSubmanufactureras: PlantasSubmanufactureras[];
}

@Injectable({
  providedIn: 'root',
})
export class AmpliacionServiciosAdapter {
  /**
   * Converts from Akita state to API payload format using the same keys
   * @param state The current Akita state
   * @returns Formatted payload for API
   */
  static toFormPayload(state: Tramites80210State): AmpliacionServiciosPayload {
    // Map the first selected planta to domicilio (if available)
    const SELECTED_PLANTA = state.plantasSeleccionadas?.[0];
    // Map Plantas (from state.plantasSeleccionadas[0]) to PlantasSubmanufactureras
    const PLANTAS_SUBMANUFACTURERAS: PlantasSubmanufactureras = {
      idPlanta: SELECTED_PLANTA?.id?.toString() ?? '',
      calle: SELECTED_PLANTA?.calle ?? '',
      numeroInterior: SELECTED_PLANTA?.numInterior ?? '',
      numeroExterior: SELECTED_PLANTA?.numExterior ?? '',
      codigoPostal: SELECTED_PLANTA?.codigoPostal ?? '',
      colonia: SELECTED_PLANTA?.colonia ?? '',
      delegacionMunicipio: SELECTED_PLANTA?.municipio ?? '',
      entidadFederativa: SELECTED_PLANTA?.entidadFederativa ?? '',
      pais: SELECTED_PLANTA?.pais ?? '',
      rfc: SELECTED_PLANTA?.registroFederal ?? '',
      domicilioFiscal: SELECTED_PLANTA?.domicilio ?? '',
      razonSocial: SELECTED_PLANTA?.razon ?? '',
      claveEntidadFederativa: '',
      clavePlantaEmpresa: '',
      clavePais: '',
      claveDelegacionMunicipio: '',
      estatus: false,
      desEstatus: '',
      localidad: '',
      telefono: '',
      fax: '',
      idDireccion: '',
      testadoP: 0,
      empresaCalle: '',
      empresaNumeroInterior: '',
      empresaNumeroExterior: '',
      empresaCodigoPostal: '',
      empresaColonia: '',
      empresaDelegacionMunicipio: '',
      empresaEntidadFederativa: '',
      empresaPais: '',
      empresaClaveEntidadFederativa: '',
      empresaClavePlantaEmpresa: '',
      empresaClavePais: '',
      empresaClaveDelegacionMunicipio: '',
      empresaCorreoElectronico: '',
      empresaTipo: '',
      permaneceMercancia: '',
      rfcActivo: '',
      domiciliosInscritos: '',
      personaMoralISR: '',
      opinionSAT: '',
      fecha32D: '',
      firmantes: [],
      datosComplementarios: [],
    };

    // Get solicitud data from infoRegistro
    const SOLICITUD: Solicitud = {
      modalidad: 'temporal',
      folioProgramaAutorizado: 0,
      anioPrograma: 'temporal',
    };

    return {
      // Valores estáticos por ahora, estos deberían provenir de la configuración u otro estado
      tipoDeSolicitud: 'guardar',
      idSolicitud: state.idSolicitud ?? 0,
      idTipoTramite: 80210,
      rfc: 'AAL0409235E6',
      cveUnidadAdministrativa: '8101',
      costoTotal: 10000.5,
      certificadoSerialNumber: '1234567890ABCDEF',
      certificado: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A',
      numeroFolioTramiteOriginal: 'TRM-2023-00001',
      nombre: 'Juan',
      apPaterno: 'Pérez',
      apMaterno: 'López',
      telefono: '5551234567',
      solicitud: SOLICITUD,
      servicios: [],
      empresasNacionales: [],
      discriminatorValue: '80210',
      solicitante: {},
      domicilio: {},
      plantasSubmanufactureras: [PLANTAS_SUBMANUFACTURERAS],
    };
  }

  /**
   * Maps API response back to Akita state format
   * @param payload The API response payload
   * @returns Formatted state object
   */
  //   static toState(payload: AmpliacionServiciosPayload): AmpliacionServiciosState {
  //     return {
  //       idSolicitud: payload.idSolicitud,
  //       infoRegistro: payload.infoRegistro,
  //       datosImmex: payload.datosImmex,
  //       datos: payload.datos,
  //       aduanaDeIngreso: payload.aduanaDeIngreso,
  //       aduanaDeIngresoSelecion: payload.aduanaDeIngresoSelecion,
  //       formaValida: payload.formaValida,
  //       empresas: payload.empresas,
  //       servicios: payload.servicios,
  //       rfcEmpresa: payload.rfcEmpresa,
  //       numeroPrograma: payload.numeroPrograma,
  //       tiempoPrograma: payload.tiempoPrograma
  //     };
  //   }
}
