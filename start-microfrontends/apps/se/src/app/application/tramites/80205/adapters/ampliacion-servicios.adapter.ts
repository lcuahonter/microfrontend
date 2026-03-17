/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import type { AmpliacionServiciosState } from '../estados/tramite80205.store';
import { Injectable } from '@angular/core';

/**
 * Interfaz que representa un servicio en el payload
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
 * Interfaz que representa una empresa nacional en el payload
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
 * Interfaz que representa los detalles de la solicitud
 */
interface Solicitud {
  modalidad: string;
  folioProgramaAutorizado: number;
  folioPrograma?: string;
  anioPrograma: string;
}

/**
 * Interfaz que representa los detalles del domicilio
 */
interface Domicilio {
  idDomicilio: number;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  codigoPostal: string;
  informacionExtra: string;
  clave: string;
  cveLocalidad: string;
  cveDelegMun: string;
  cveEntidad: string;
  cvePais: string;
  ciudad: string;
  telefono: string;
  fax: string;
  municipio: string;
  colonia: string;
  descUbicacion: string;
  cveCatalogo: string;
  telefonos: string;
  tipoDomicilio: number;
}

/**
 * Interfaz que representa los detalles del solicitante
 */
interface Solicitante {
  idPersonaPersonaSolicitudR: number;
  idSolicitud: number;
  nombre: string;
  apellidoMaterno: string;
  apellidoPaterno: string;
  razonSocial: string;
  rfc: string;
  curp: string;
  ideTipoPersonaSol: string;
  correoElectronico: string;
  cedulaProfesional: string;
  nss: string;
  telefono: string;
  descripcionGiro: string;
  cvePaisOrigen: string;
  idDireccionSol: number;
  tipoPatenteAgente: string;
  recif: string;
  puesto: string;
  tipoAgente: string;
  numeroPatente: string;
  numeroIdentificacionFiscal: string;
  personaMoral: boolean;
  extranjero: boolean;
  organismoPublico: boolean;
  cveUsuario: string;
  paginaWeb: string;
  ideGenerica1: string;
  rfcExtranjero: string;
  codAutorizacion: string;
  actividadProductiva: string;
  estadoEvaluacionEntidad: string;
  estadoEntidad: string;
  original: boolean;
  modificado: boolean;
  numeroRegistro: string;
  concentimientoInstalacionRecuperacion: boolean;
  cveCatalogo: string;
  alquilado: boolean;
  volumenAlmacenaje: number;
  capacidadAlmacenaje: number;
  descripcionDetalladaActividadEconomica: string;
  activo: boolean;
  generico1: boolean;
  area: string;
  cveNacionalidad: string;
  clasificacionArancelaria: string;
  infoAdicional: boolean;
  montoImportacion: number;
  montoExportacion: number;
  pctParticAccionaria: number;
  ampliacionModelos: boolean;
  ampliacionPaises: boolean;
  fecFallecimiento: string;
}

/**
 * Interfaz que representa la estructura del payload de API para el trámite 80205
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
}

@Injectable({
  providedIn: 'root'
})
export class AmpliacionServiciosAdapter {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: AmpliacionServiciosState): AmpliacionServiciosPayload {
    // Combinar servicios de datosAutorizados y datosImmex
    const COMBINED_SERVICIOS: Servicio[] = [
      ...state.datosImmex.map(si => ({
        tipoServicio: si.tipoServicio,
        claveServicio: Number(si.claveServicio),
        testado: true,
        descripcion: si.descripcion ?? "",
        descripcionTipo: si.descripcionTipo,
      })),
      ...state.datosAutorizados.map(sa => ({
        tipoServicio: sa.tipoServicio,
        claveServicio: Number(sa.claveServicio),
        testado: true,
        descripcion: sa.descripcion ?? "",
        descripcionTipo: sa.descripcionTipo,
      }))
    ];

    // Convertir empresas al formato empresasNacionales
    const EMPRESAS_NACIONALES: EmpresaNacional[] = state.empresas.map(e => ({
      razonSocial: e.razonSocial ?? "",
      rfc: e.rfc ?? "",
      idServicio: e.idServicio ?? "",
      descripcionServicio: e.descripcionServicio ?? "",
      numeroPrograma: e.numeroPrograma ?? "",
      tiempoPrograma: e.tiempoPrograma ?? "",
    }));

    // Obtener datos de solicitud desde infoRegistro
    const SOLICITUD: Solicitud = {
      modalidad: state.infoRegistro.seleccionaLaModalidad,
      folioProgramaAutorizado: 0, // Esto debería venir de otro lugar en el estado
      anioPrograma: state.infoRegistro.ano
    };

    return {
      // Valores estáticos por ahora, estos deberían venir de configuración o otro estado
      tipoDeSolicitud: "guardar",
      idSolicitud: state.idSolicitud ?? 0,
      idTipoTramite: 80205,
      rfc: "AAL0409235E6",
      cveUnidadAdministrativa: "8101",
      costoTotal: 10000.5,
      certificadoSerialNumber: "1234567890ABCDEF",
      certificado: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A",
      numeroFolioTramiteOriginal: "TRM-2023-00001",
      nombre: "Juan",
      apPaterno: "Pérez",
      apMaterno: "López",
      telefono: "5551234567",
      solicitud: SOLICITUD,
      servicios: COMBINED_SERVICIOS,
      empresasNacionales: EMPRESAS_NACIONALES,
      discriminatorValue: "80205",
      solicitante: {},
      domicilio: {}

    };
  }

  /**
   * Mapea la respuesta de la API de vuelta al formato de estado de Akita
   * @param payload El payload de respuesta de la API
   * @returns Objeto de estado formateado
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