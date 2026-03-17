/**
 * @fileoverview
 * This file contains the adapter service for converting between Akita state and API payload formats
 * for the trámite 140105 - Desistimiento de Permiso.
 */
import type { Cancelacion } from '../models/cancelacion-de-solicitus.model';
import { Injectable } from '@angular/core';

import type { DesistimientoDePermisoState, DesistimientoStore } from '../estados/desistimiento-de-permiso.store';

/**
 * Interface representing the API payload structure for trámite 140105
 * Based on backend team specification
 */
export interface AmpliacionServiciosPayload {
  solicitud: {
    idSolicitud: string;
    discriminatorValue: string;
    cveRolCapturista: string;
    cveUsuarioCapturista: string;
    solicitante: {
      cveUsuario: string;
      rol_capturista: string;
      rfc: string;
      razonSocial: string;
      descripcionGiro: string;
      correoElectronico: string;
      telefono: string;
      domicilio: {
        pais: {
          clave: string;
          nombre: string;
        };
        entidadFederativa: {
          clave: string;
          nombre: string;
        };
        delegacionMunicipio: {
          clave: string;
          nombre: string;
        };
        colonia: {
          clave: string;
          nombre: string;
        };
        localidad: {
          clave: string;
          nombre: string;
        };
        codigoPostal: string;
        calle: string;
        numeroExterior: string;
        numeroInterior: string;
      };
    };
  };
  puedeCapturarRepresentanteLegalCG: boolean;
  claveEntidadFederativa: string;
  idTramite: string;
  motivoCancelacion: string;
  numeroFolioTramiteCancelados: Array<{
    idResolucion: string;
    numeroResolucion: string;
    regimen: string;
    clasificacionRegimen: string;
    condicionMercancia: string;
    fraccionArancelaria: string;
    unidadMedida: string;
    cantidadImportarExportar: string;
    vigenciaResolucion: string;
    valorAutorizado: string;
    inicioResolucion: string;
    numFolioTramite: string;
    valorSolicitado: string;
    cantidadImportarExportarSolicitada: string;
    general: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class AmpliacionServiciosAdapter {
  /**
   * Creates a numeroFolioTramiteCancelado item from state data using dynamic data from search API
   * Similar to 140104 pattern - uses actual data from buscar API response
   * @param dato Single Cancelacion item from state populated by search API
   * @param _idTipoTramite Tramite ID (for future use)
   * @returns Formatted numeroFolioTramiteCancelado item with dynamic data
   */
  private static createNumeroFolioTramiteItem(dato: Partial<Cancelacion>, _idTipoTramite?: number): {
    idResolucion: string;
    numeroResolucion: string;
    regimen: string;
    clasificacionRegimen: string;
    condicionMercancia: string;
    fraccionArancelaria: string;
    unidadMedida: string;
    cantidadImportarExportar: string;
    vigenciaResolucion: string;
    valorAutorizado: string;
    inicioResolucion: string;
    numFolioTramite: string;
    valorSolicitado: string;
    cantidadImportarExportarSolicitada: string;
    general: string;
  } {
    return {
      // Use dynamic data from search API response instead of hardcoded defaults
      idResolucion: dato.idResolucion || '',
      numeroResolucion: dato.numeroResolucion || '',
      regimen: dato.regimen || '',
      clasificacionRegimen: dato.clasificacionRegimen || '',
      condicionMercancia: dato.condicionDeLaMercancia || '',
      fraccionArancelaria: dato.fraccionArancelaria || '',
      unidadMedida: dato.umt || '',
      cantidadImportarExportar: dato.cantidadImportarExportar || '',
      vigenciaResolucion: dato.vigenciaResolucion || '',
      valorAutorizado: dato.valorAutorizado || '',
      inicioResolucion: dato.inicioResolucion || '',
      numFolioTramite: dato.folioTramite || '',
      valorSolicitado: dato.valorSolicitado || '',
      cantidadImportarExportarSolicitada: dato.cantidadImportarExportarSolicitada || '',
      general: dato.general || ''
    };
  }

  /**
   * Convierte del estado de Akita al formato de payload de API según especificación del backend
   * Similar to 140104 - allows proceeding even with null search response
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: DesistimientoDePermisoState): AmpliacionServiciosPayload {
    // Check if we have valid search data, if not, proceed with minimal payload like 140104
    let NUMERO_FOLIO_TRAMITE_CANCELADOS: Array<{
      idResolucion: string;
      numeroResolucion: string;
      regimen: string;
      clasificacionRegimen: string;
      condicionMercancia: string;
      fraccionArancelaria: string;
      unidadMedida: string;
      cantidadImportarExportar: string;
      vigenciaResolucion: string;
      valorAutorizado: string;
      inicioResolucion: string;
      numFolioTramite: string;
      valorSolicitado: string;
      cantidadImportarExportarSolicitada: string;
      general: string;
    }> = [];
    
    if (state.datos && state.datos.length > 0) {
      // Validate that we have at least one item with meaningful data
      const HAS_VALID_DATA = state.datos.some(dato => 
        dato.folioTramite || dato.idResolucion || dato.regimen || dato.fraccionArancelaria
      );

      if (HAS_VALID_DATA) {
        // Use actual search data when available
        NUMERO_FOLIO_TRAMITE_CANCELADOS = state.datos.map(dato => 
          AmpliacionServiciosAdapter.createNumeroFolioTramiteItem(dato, state.idTipoTramite)
        );
      } else {
        // Even if datos exists but is empty, create minimal entry to allow proceeding
        NUMERO_FOLIO_TRAMITE_CANCELADOS = [{
          idResolucion: '',
          numeroResolucion: '',
          regimen: '',
          clasificacionRegimen: '',
          condicionMercancia: '',
          fraccionArancelaria: '',
          unidadMedida: '',
          cantidadImportarExportar: '',
          vigenciaResolucion: '',
          valorAutorizado: '',
          inicioResolucion: '',
          numFolioTramite: '',
          valorSolicitado: '',
          cantidadImportarExportarSolicitada: '',
          general: ''
        }];
      }
    } else {
      // No search data at all - create minimal payload to allow motivo cancelacion entry
      NUMERO_FOLIO_TRAMITE_CANCELADOS = [{
        idResolucion: '',
        numeroResolucion: '',
        regimen: '',
        clasificacionRegimen: '',
        condicionMercancia: '',
        fraccionArancelaria: '',
        unidadMedida: '',
        cantidadImportarExportar: '',
        vigenciaResolucion: '',
        valorAutorizado: '',
        inicioResolucion: '',
        numFolioTramite: '',
        valorSolicitado: '',
        cantidadImportarExportarSolicitada: '',
        general: ''
      }];
    }

    return {
      solicitud: {
        idSolicitud: "", // Backend expects empty string
        discriminatorValue: "140105",
        cveRolCapturista: "PersonaMoral",
        cveUsuarioCapturista: state.rfc || "AAL0409235E6",
        solicitante: {
          cveUsuario: state.rfc || "AAL0409235E6",
          rol_capturista: "PersonaMoral",
          rfc: state.rfc || "AAL0409235E6",
          razonSocial: "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
          descripcionGiro: "Siembra, cultivo y cosecha de otros cultivos",
          correoElectronico: "vucem2021@gmail.com",
          telefono: state.telefono || "55-98764532",
          domicilio: {
            pais: {
              clave: "MEX",
              nombre: "ESTADOS UNIDOS MEXICANOS"
            },
            entidadFederativa: {
              clave: "SIN",
              nombre: "SINALOA"
            },
            delegacionMunicipio: {
              clave: "25001",
              nombre: "AHOME"
            },
            colonia: {
              clave: "00181210001",
              nombre: "MIGUEL HIDALGO"
            },
            localidad: {
              clave: "00181210008",
              nombre: "LOS MOCHIS"
            },
            codigoPostal: "81210",
            calle: "CAMINO VIEJO",
            numeroExterior: "1353",
            numeroInterior: ""
          }
        }
      },
      puedeCapturarRepresentanteLegalCG: false,
      claveEntidadFederativa: state.claveEntidadFederativa || "SIN",
      idTramite: "140105",
      motivoCancelacion: state.motivoCancelacion || "",
      numeroFolioTramiteCancelados: NUMERO_FOLIO_TRAMITE_CANCELADOS
    };
  }

  /**
   * Mapea la respuesta de la API de vuelta al formato de estado de Akita
   * Following 80205 pattern exactly
   * @param payload El payload de respuesta de la API
   * @returns Objeto de estado formateado
   */
  static toState(payload: AmpliacionServiciosPayload): Partial<DesistimientoDePermisoState> {
    // Map numeroFolioTramiteCancelados back to datos array for store
    const DATOS = payload.numeroFolioTramiteCancelados.map(item => ({
      folioTramite: item.numFolioTramite,
      tipoDeSolicitud: "",
      regimen: item.regimen,
      cdr: "",
      condicionDeLaMercancia: item.condicionMercancia,
      fraccionArancelaria: item.fraccionArancelaria,
      umt: item.unidadMedida,
      cantidad: item.cantidadImportarExportar,
      usd: item.valorAutorizado,
      idResolucion: item.idResolucion,
      numeroResolucion: item.numeroResolucion,
      clasificacionRegimen: item.clasificacionRegimen,
      vigenciaResolucion: item.vigenciaResolucion,
      valorAutorizado: item.valorAutorizado,
      inicioResolucion: item.inicioResolucion,
      valorSolicitado: item.valorSolicitado,
      cantidadImportarExportarSolicitada: item.cantidadImportarExportarSolicitada,
      cantidadImportarExportar: item.cantidadImportarExportar,
      general: item.general
    }));

    return {
      idSolicitud: payload.solicitud.idSolicitud ? parseInt(payload.solicitud.idSolicitud, 10) : null,
      rfc: payload.solicitud.solicitante.rfc,
      telefono: payload.solicitud.solicitante.telefono,
      claveEntidadFederativa: payload.claveEntidadFederativa,
      motivoCancelacion: payload.motivoCancelacion,
      idTipoTramite: parseInt(payload.idTramite, 10),
      datos: DATOS,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static patchToStore(payload: any, store: DesistimientoStore): void {
    const STATE_UPDATE = AmpliacionServiciosAdapter.toState(payload);
    store.update(STATE_UPDATE);
  }
}