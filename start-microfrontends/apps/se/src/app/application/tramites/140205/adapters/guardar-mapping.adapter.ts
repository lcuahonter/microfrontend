/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { Injectable } from '@angular/core';
import { Solicitud140205State } from '../estados/store/solicitud140205.store';

/**
 * Interfaz que representa la estructura del payload de API para el trámite 140102
 */
export interface CargaUtilDeRespuesta {
  tipoDeSolicitud: string;
  id_solcitud: number;
  cve_regimen: string;
  cve_clasificacion_regimen: string;
  productor: {
    tipo_persona: boolean;
    nombre: string;
    apellido_materno: string;
    apellido_paterno: string;
    razon_social: string;
    descripcion_ubicacion: string;
    rfc: string;
    pais: string;
  };
  solicitante: {
    rfc: string;
    nombre: string;
    es_persona_moral: boolean;
    certificado_serial_number: string;
  };
  representacion_federal: {
    cve_entidad_federativa: string;
    cve_unidad_administrativa: string;
  };
  certificados: Array<{
    idExpedicion: number;
    numCertificado: number;
    rfc: string;
    denominacion: string;
    numFolioOficio: string;
    numFolioTramite: string | null;
    estado: string;
    estadoCancelacion: number;
    montoAsignado: number;
    montoDisponible: number;
    montoExpedido: number;
    montoCancelado: number;
    representacionFederal: string;
    claveRepresentacionFederal: string;
    factorConversion: number;
    estadoTransmision: string | null;
    montoEjercidoCBP: number;
    fabricante: string;
    importador: string;
  }>;
  mecanismo_asignacion: {
    nombreMecanismoAsignacion: string;
    documentosMecanismo: string;
    idMecanismoAsignacion: number;
    observaciones: string;
    numeroPeriodoVigencia: string;
    ideTipoMecAsignacion: string;
    idePeriodoVigencia: string;
    ideOpinionMecanismo: string;
    descentralizar: boolean;
    fechaInicioVigencia: string;
    fechaFinVigencia: string;
    requiereBeneficiarios: boolean;
    descripcionFundamento: string;
    porcentaje: number | null;
    fechaEspecifica: string | null;
    requiereOpinion: boolean;
    numCantidadConstanteAcuerdo: number;
    numCertificadosPermitidos: number;
    fechaInicioRecepSolicitudes: string | null;
    fechaFinRecepSolicitudes: string | null;
    fechaProrrata: string | null;
    ideTipoComprobacionCert: string;
    activo: boolean;
    cveUnidadAdministrativa: string | null;
    fraccionesPorExpedir: boolean;
    fechaInicioVigenciaCertificados: string | null;
    fechaFinVigenciaCertificados: string | null;
    blnRequiereImportador: boolean;
    blnRequiereProductor: boolean;
    emitePEXIM: boolean;
    emiteCEROR: boolean;
    observacionesEmision: string | null;
    inactivoAutomatico: string | null;
    cupo: {
      idCupo: number;
      fechaInicioVigencia: string;
      fechaFinVigencia: string;
      fundamentos: string;
      regimen: string;
      unidadMedidaComercializacion: boolean;
      ideClasifSubproducto: string | null;
      descSubProductoOtro: string | null;
      ideTipoCupo: string;
      cveUsuario: string;
      cveProducto: string;
      idTratadoAcuerdo: number;
      cveUnidadMedidaOficialCupo: string;
      idCupoR: number | null;
      producto: {
        clave: string;
        sigla: string;
        nombre: string;
        descripcion: string;
        fechaCaptura: string;
        fechaInicioVigencia: string;
        fechaFinVigencia: string | null;
        blnActivo: boolean;
      };
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class GuardarMappingAdapter {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: Solicitud140205State): CargaUtilDeRespuesta {
    // Se asume que el estado tiene una propiedad 'certificados' de tipo ConfiguracionCertificados[]
    return {
      tipoDeSolicitud: 'guardar',
      id_solcitud: state.idSolicitud,
      cve_regimen: state.regimen,
      cve_clasificacion_regimen: '01',
      productor: {
        tipo_persona: true,
        nombre: 'Juan',
        apellido_materno: 'López',
        apellido_paterno: 'Norte',
        razon_social: 'Aceros Norte',
        descripcion_ubicacion: 'Calle Acero, No. 123, Col. Centro',
        rfc: 'AAL0409235E6',
        pais: 'USA',
      },
      solicitante: {
        rfc: 'AAL0409235E6',
        nombre: 'Juan Pérez',
        es_persona_moral: true,
        certificado_serial_number: '20001000000100001815',
      },
      representacion_federal: {
        cve_entidad_federativa: state.representacion,
        cve_unidad_administrativa: '0815',
      },
      certificados: (state.certificados || []).map((cert) => ({
        idExpedicion: cert.idExpedicion ?? '',
        numCertificado: cert.numCertificado ?? '',
        rfc: cert.rfc ?? '',
        denominacion: cert.denominacion ?? '',
        numFolioOficio: cert.numFolioOficio ?? '',
        numFolioTramite: cert.numFolioTramite ?? '',
        estado: cert.estado ?? '',
        estadoCancelacion: cert.estadoCancelacion ?? '',
        montoAsignado: cert.montoAsignado ?? '',
        montoDisponible: cert.montoDisponible ?? '',
        montoExpedido: cert.montoExpedido ?? '',
        montoCancelado: cert.montoCancelado ?? '',
        representacionFederal: cert.representacionFederal ?? '',
        claveRepresentacionFederal: cert.claveRepresentacionFederal ?? '',
        factorConversion: cert.factorConversion ?? '',
        estadoTransmision: cert.estadoTransmision ?? '',
        montoEjercidoCBP: cert.montoEjercidoCBP ?? '',
        fabricante: cert.fabricante ?? '',
        importador: cert.importador ?? '',
      })),
      mecanismo_asignacion: {
        nombreMecanismoAsignacion: state.mecanismo,
        documentosMecanismo: '',
        idMecanismoAsignacion: 10226,
        observaciones: 'observaciones',
        numeroPeriodoVigencia: '15',
        ideTipoMecAsignacion: 'TIMA.AD',
        idePeriodoVigencia: 'PERVIG.A',
        ideOpinionMecanismo: 'string',
        descentralizar: false,
        fechaInicioVigencia: '2025-01-18',
        fechaFinVigencia: '2025-12-31',
        requiereBeneficiarios: false,
        descripcionFundamento: 'fundamento de la vigencia del cupo',
        porcentaje: null,
        fechaEspecifica: null,
        requiereOpinion: false,
        numCantidadConstanteAcuerdo: 1,
        numCertificadosPermitidos: 100,
        fechaInicioRecepSolicitudes: null,
        fechaFinRecepSolicitudes: null,
        fechaProrrata: null,
        ideTipoComprobacionCert: 'TICCE.UAU',
        activo: true,
        cveUnidadAdministrativa: null,
        fraccionesPorExpedir: true,
        fechaInicioVigenciaCertificados: null,
        fechaFinVigenciaCertificados: null,
        blnRequiereImportador: true,
        blnRequiereProductor: true,
        emitePEXIM: false,
        emiteCEROR: false,
        observacionesEmision: null,
        inactivoAutomatico: null,
        cupo: {
          idCupo: state.cupo[0]?.idCupo ?? 0,
          fechaInicioVigencia:
            state.cupo[0]?.fechaInicioVigencia ?? '2025-01-18',
          fechaFinVigencia: state.cupo[0]?.fechaFinVigencia ?? '2025-12-31',
          fundamentos:
            state.cupo[0]?.fundamentos ?? 'fundamento de la vigencia del cupo',
          regimen: state.cupo[0]?.regimen ?? '',
          unidadMedidaComercializacion: true,
          ideClasifSubproducto: state.cupo[0]?.ideClasifSubproducto ?? '',
          descSubProductoOtro: state.cupo[0]?.descSubProductoOtro ?? '',
          ideTipoCupo: state.cupo[0]?.ideTipoCupo ?? 'TICU.TPL',
          cveUsuario: 'MAVL621207C95',
          cveProducto: state.producto,
          idTratadoAcuerdo: state.tratado ? Number(state.tratado) : 0,
          cveUnidadMedidaOficialCupo: '1',
          idCupoR: state.cupo[0]?.idCupoR ?? 123,
          producto: {
            clave: state.productoDetalle[0]?.clave ?? '1352',
            sigla: state.productoDetalle[0]?.sigla ?? 'TEL',
            nombre:
              state.productoDetalle[0]?.nombre ??
              'TELAS Y BIENES TEXTILES SIMPLES',
            descripcion:
              state.productoDetalle[0]?.descripcion ??
              'TPL 3-CAN TELAS Y BIENES TEXTILES SIMPLES',
            fechaCaptura:
              state.productoDetalle[0]?.fechaCaptura ?? '2011-01-01',
            fechaInicioVigencia:
              state.productoDetalle[0]?.fechaInicioVigencia ?? '2011-11-01',
            fechaFinVigencia:
              state.productoDetalle[0]?.fechaFinVigencia ?? null,
            blnActivo: state.productoDetalle[0]?.blnActivo ?? true,
          },
        },
      },
    };
  }
}
