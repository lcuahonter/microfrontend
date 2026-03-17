
import { DISCRIMINATOR_VALUE } from '../constantes/constantes90303.enum';
import { Solicitud90303State } from '../state/Tramite90303.store';

/**
 * Construye el payload para guardar la solicitud del trámite 90303.
 * basado en los datos almacenados en el estado del store.
 * @param {Solicitud90303State} storeDatos - Datos actuales del store del trámite 90303.
 * @returns {Record<string, unknown>} Payload estructurado para la solicitud de guardado.
 */
export function buildGuardarPayload(storeDatos: Solicitud90303State): Record<string, unknown> {
  return {
    tipoDeSolicitud: 'guardar',
    idSolicitud: storeDatos.idSolicitud || 0,
    idTipoTramite: 90303,
    rfc: storeDatos.loginRfc,
    cveUnidadAdministrativa: '8302',
    costoTotal: 10000.5,
    discriminatorValue: DISCRIMINATOR_VALUE,
    certificadoSerialNumber: '1234567890ABCDEF',
    certificado: 'certificacionSAT',
    solicitud: {
        modalidad: "",
        booleanGenerico: true,
        descripcionSistemasMedicion: "Web",
        descripcionLugarEmbarque: "Localisation",
        numeroPermiso: "SI",
        fechaOperacion: "2025-09-19",
        nomOficialAutorizado: ""
    },
    planta: storeDatos.plantasTablaDatos?.map((planta) => ({
      calle: planta.calle,
      numeroInterior: planta.numeroInterior,
      numeroExterior: planta.numeroExterior,
      codigoPostal: planta.codigoPostal,
      colonia: planta.colonia,
      delegacionMunicipio: planta.municipioOAlcaldia,
      entidadFederativa: planta.estado,
      pais: planta.pais,
      rfc: planta.registroFederal,
      domicilioFiscal: planta.domicilioFiscal,
      razonSocial: planta.razonSocial,
      estatus: planta.estatus
    })),
    modificacion: {
      rfc: storeDatos.registroFederalContribuyentes,
      representacion_federal: storeDatos.representacionFederal,
      tipo_modificacion: storeDatos.tipoModificacion,
      modificacion_programa: storeDatos.modificacionPrograma
    },
    sector: storeDatos.sectorTablaDatos?.map((sector) => ({
      sectores: sector.listaDeSectores,
      clave_sector: sector.claveDelSector,
      estatus: sector.estatus,
    })),
    mercancias: storeDatos.mercanciaTablaDatos?.map((mercancia) => ({
      fraccion_arancelaria: mercancia.fraccionArancelaria?.cveFraccion,
      clave_sector: mercancia.cveSector,
      estatus: mercancia.descripcionTestado,
    })),
    "Lista-sectores": storeDatos.listaSectorTablaDatos?.map((sector) => ({
      sector: sector.sector,
      clave_sector: sector.cvSectorCatalogo,
      estatus: sector.descripcionTestado,
    })),
    productor_indirecto: storeDatos.productorTablaDatos?.map((productor) => ({
      rfc: productor.registroFederal,
      razon_social: productor.denominacion,
      correo: productor.correo,
      estatus: productor.eStatus,
    })),
    domicilio: {},
    solicitante: {},
    datosCertificacion: 'CERT-001',
    montoImportaciones: 500000,
    factorAmpliacion: 1.2,
    cveEntidad: 'string',
    idProgramaAutorizado: 0,
    folioPrograma: storeDatos.selectedFolioPrograma,
    tipoPrograma: storeDatos.selectedTipoPrograma,
    tipoModalidad: storeDatos.tipoModificacion,
    descripcionModalidad: storeDatos.modificacionPrograma,
  };
}