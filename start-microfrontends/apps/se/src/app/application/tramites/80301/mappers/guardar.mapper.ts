import { DISCRIMINATOR_VALUE } from '../constantes/modificacion.enum';
import { Solicitud80301State } from '../estados/tramite80301.store';

/**
 * Construye el payload para guardar la solicitud de modificación
 * basado en los datos almacenados en el estado del store.
 * @param {Solicitud80301State} storeDatos - Datos actuales del store del trámite 80301.
 * @returns {Record<string, unknown>} Payload estructurado para la solicitud de guardado.
 */
export function buildGuardarPayload(storeDatos: Solicitud80301State): Record<string, unknown> {
  /**
   * Mapea las fracciones de exportación e importación desde el estado del store
   * y las transforma en el formato requerido para el payload.
   */
  const FRACCION_EXPORTACION = storeDatos.datosExportacion?.map((fraccion) => ({
    fraccionPadre: fraccion.fraccionPadre,
    descripcionTestado: fraccion.desEstatus,
    claveProductoExportacion: fraccion.claveProductoExportacion,
    visible: fraccion.visible
  }));

  /**
   * Mapea las fracciones de importación desde el estado del store
   * y las transforma en el formato requerido para el payload.
   */
  const FRACCION_IMPORTACION = storeDatos.datosImportacion?.map((fraccion) => ({
    fraccionPadre: fraccion.fraccionPadre,
    descripcionTestado: fraccion.desEstatus,
    claveProductoExportacion: fraccion.claveProductoExportacion,
    visible: fraccion.visible
  }));

  /**
   * Mapea las fracciones adicionales de exportación e importación
   * obtenidas de los anexos y las transforma en el formato requerido para el payload.
   */
  const ANEXO_FRACCION_EXPORTACION = storeDatos.fraccionesExportacion?.map(
    (fraccion) => ({
      tipoFraccion: fraccion.tipoFraccion,
      idProductoExp: fraccion.claveProductoExportacion,
    })
  );

  /**
   * Mapea las fracciones adicionales de importación obtenidas de los anexos
   * y las transforma en el formato requerido para el payload.
   */
  const ANEXO_FRACCION_IMPORTACION = storeDatos.fraccionesImportacion?.map(
    (fraccion) => ({
      tipoFraccion: fraccion.tipoFraccion,
      fraccionPadre: fraccion.fraccionPadre,
    })
  );

  return {
    tipoDeSolicitud: 'guardar',
    idSolicitud: storeDatos.idSolicitud || 0,
    idTipoTramite: 80301,
    rfc: storeDatos.loginRfc,
    cveUnidadAdministrativa: '8302',
    costoTotal: 10000.5,
    discriminatorValue: DISCRIMINATOR_VALUE,
    certificadoSerialNumber: '1234567890ABCDEF',
    certificado: 'certificacionSAT',
    solicitud: {
      modalidad: '',
      booleanGenerico: true,
      descripcionSistemasMedicion: 'Web',
      descripcionLugarEmbarque: 'Localisation',
      numeroPermiso: 'SI',
      fechaOperacion: '2025-09-19',
      nomOficialAutorizado: '',
    },
    sociosAccionistas: storeDatos.sociosAccionistas?.map((socio) => ({
      rfc: socio.rfc,
      nombre: socio.nombre,
      apellidoMaterno: socio.apellidoMaterno,
      apellidoPaterno: socio.apellidoPaterno,
    })),
    notarios: storeDatos.notarios?.map((fedatario) => ({
      nombreNotario: fedatario.nombreNotario,
      apellidoMaterno: fedatario.apellidoMaterno,
      apellidoPaterno: fedatario.apellidoPaterno,
      numeroActa: fedatario.numeroActa,
      numeroNotaria: fedatario.numeroNotaria,
      numeroNotario: null,
      delegacionMunicipio: fedatario.delegacionMunicipio,
      entidadFederativa: fedatario.entidadFederativa,
      fechaActa: fedatario.fechaActa,
    })),
    planta: storeDatos.planta?.map((planta) => ({
      idPlanta: planta.idPlanta,
      calle: planta.calle,
      numeroInterior: planta.numeroInterior,
      numeroExterior: planta.numeroExterior,
      codigoPostal: planta.codigoPostal,
      colonia: planta.colonia,
      delegacionMunicipio: planta.delegacionMunicipio,
      entidadFederativa: planta.entidadFederativa,
      pais: planta.pais,
      rfc: planta.rfc,
      estatus: planta.estatus,
      desEstatus: planta.desEstatus,
      localidad: planta.localidad,
      telefono: planta.telefono,
    })),
    fraccionesExportacion: [
      ...(FRACCION_EXPORTACION || []),
      ...(ANEXO_FRACCION_EXPORTACION || []),
    ],
    fraccionesImportacion: [
      ...(FRACCION_IMPORTACION || []),
      ...(ANEXO_FRACCION_IMPORTACION || []),
    ],
    servicios: storeDatos.servicios?.map((servicio) => ({
      idServicio: servicio.id,
      tipoServicio: servicio.tipoDeServicio,
      testado: servicio.testado,
      descripcion: servicio.descripcion,
      descripcionTipo: servicio.descripcionTipo,
      estatus: servicio.desEstatus,
    })),
    unidadAdministrativaRepresentacionFederal: {
      clave: storeDatos.datosModificacion?.representacionFederal,
    },
    domicilio: {},
    solicitante: {},
    datosCertificacion: 'CERT-001',
    montoImportaciones: 500000,
    factorAmpliacion: 1.2,
    certificacion_sat: storeDatos.certificacionSAT,
    cveEntidad: 'string',
    idProgramaAutorizado: 0,
    folioPrograma: storeDatos.selectedFolioPrograma,
    tipoPrograma: storeDatos.selectedTipoPrograma,
    tipoModalidad: storeDatos.datosModificacion?.tipo,
    descripcionModalidad: storeDatos.datosModificacion?.programa,
  };
}