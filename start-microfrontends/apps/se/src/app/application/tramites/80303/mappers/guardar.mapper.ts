import { DISCRIMINATOR_VALUE } from "../constants/modificacion-programa-immex-baja-submanufacturera.enum";
import { Tramite80303State } from '../estados/tramite80303Store.store';

/**
 * Construye el payload para guardar la solicitud de modificación
 * basado en los datos almacenados en el estado del store.
 * @param {Tramite80303State} storeDatos - Datos actuales del store del trámite 80303.
 * @returns {Record<string, unknown>} Payload estructurado para la solicitud de guardado.
 */
export function buildGuardarPayload(storeDatos: Tramite80303State): Record<string, unknown> {
  // Fracciones Exportación
  const FRACCIONES_EXPORTACION = (storeDatos.anexoExportacionTablaDatos || []).map((fraccion) => ({
    fraccionArancelaria: {
      descripcionFraccionPadre: fraccion.descripcion || '',
    },
    tipoFraccion: fraccion.tipoFraccion || '',
    fraccionPadre: fraccion.descripcion || '',
  }));

  // Fracciones Importación
  const FRACCIONES_IMPORTACION = (storeDatos.anexoImportacionTablaDatos || []).map((fraccion) => ({
    fraccionArancelaria: {
      descripcionFraccionPadre: fraccion.descripcion,
      tipoFraccion: fraccion.tipoFraccion,
    }
  }));
  
  const FRACCIONES_SENSIBLES = storeDatos.sensiblesTablaDatos?.map((fraccion) => ({
    cantidad: fraccion.cantidad?.toString(),
    complemento: fraccion.complemento || '',
    cveFraccion: fraccion.cveFraccion || '',
    descUnidadMedida: fraccion.descripcion || '',
    unidadMedidaTarifaria: fraccion.unidadMedidaTarifaria || '',
    valor: fraccion.valor?.toString(),
  }));
  
   // Socios/Accionistas
  const SOCIOS_ACCIONISTAS = storeDatos.accionistasTablaDatos?.map((socio) => ({
    rfc: socio.rfc||'',
    nombre: socio.nombre || '',
    apellidoMaterno: socio.apellidoMaterno || '',
    apellidoPaterno: socio.apellidoPaterno || '',
  }));

  const NOTARIOS = storeDatos.federatariosTablaDatos?.map((fedatario) => ({
    nombreNotario: fedatario.nombreNotario || '',
    apellidoMaterno: fedatario.apellidoMaterno || '',
    apellidoPaterno: fedatario.apellidoPaterno || '',
    numeroActa: fedatario.numeroActa || '',
    fechaActa: fedatario.fechaActa || '',
    numeroNotaria: fedatario.numeroNotaria || '',
    delegacionMunicipio: fedatario.delegacionMunicipio || '',
    entidadFederativa: fedatario.entidadFederativa || '',
  }));

  // Plantas Manufactureras
  const PLANTA = storeDatos.plantasManufacturerasTablaDatos?.map((planta) => ({
    calle: planta.calle || '',
    numeroInterior: planta.numeroInterior || '',
    numeroExterior: planta.numeroExterior || '',
    codigoPostal: planta.codigoPostal || '',
    colonia: planta.colonia || '',
    localidad: planta.localidad || '',
    delegacionMunicipio: planta.municipioDelegacion || '',
    entidadFederativa: planta.estado || '',
    pais: planta.pais || '',
    rfc: planta.rfc || '',
    estatus: planta.estatus || '',
    desEstatus: planta.desEstatus || '',
  }));
 
  const EMPRESAS = storeDatos.empresasSubmanufacturerasTablaDatos?.map((empresa) => ({
    rfc: empresa.rfc || '',
    razonSocial: empresa.razonSocial || '',
    calle: empresa.calle || '',
    numeroInterior: empresa.numeroInterior || '',
    numeroExterior: empresa.numeroExterior || '',
    codigoPostal: empresa.codigoPostal || '',
    colonia: empresa.colonia || '',
    delegacionMunicipio: empresa.municipioDelegacion || '',
    entidadFederativa: empresa.estado || '',
    pais: empresa.pais || '',
    telefono: empresa.telefono || '',
    estatus: empresa.estatus || '',
  }));

  const PLANTAS_IMMEX = storeDatos.plantasIMMEXDatos?.map((planta) => ({
    calle: planta.calle || '',
    numeroExterior: planta.numeroExterior || '',
    numeroInterior: planta.numeroInterior || '',
    codigoPostal: planta.codigoPostal || '',
    colonia: planta.colonia || '',
    delegacionMunicipio: planta.municipioDelegacion || '',
    entidadFederativa: planta.estadoDistrito || '',
    pais: planta.pais || '',
    rfc: planta.rfc || '',
    estatus: planta.estatus || '',
    localidad: planta.localidad || '',
  }));

  const PLANTAS_SUBMANUFACTURERAS = storeDatos.plantasManufacturerasTablaDatos?.map((planta) => ({
    calle: planta.calle || '',
    numeroExterior: planta.numeroExterior || '',
    numeroInterior: planta.numeroInterior || '',
    codigoPostal: planta.codigoPostal || '',
    colonia: planta.colonia || '',
    delegacionMunicipio: planta.municipioDelegacion || '',
    pais: planta.pais || '',
    rfc: planta.rfc || '',
    razonSocial: planta.razonSocial || '',
    estatus: planta.estatus || '',
    desEstatus: planta.desEstatus || '',
    localidad: planta.localidad || '',
    entidadFederativa: planta.entidadFederativa || '',
  }));

  const SERVICIOS = storeDatos.serviciosImmexTablaDatos?.map((servicio) => ({
    idServicio: servicio.id,
    descripcion: servicio.descripcion || '',
    tipoServicio: servicio.descripcionTipo || '',
    testado: servicio.desEstatus === 'Activada' ? true : false,
  }));
  
return {
    tipoDeSolicitud: 'guardar',
    idSolicitud: storeDatos.idSolicitud || 0,
    idTipoTramite: 80303,
    rfc: 'AAL0409235E6',
    cveUnidadAdministrativa: '1016',
    costoTotal: 10000.5,
    discriminatorValue: DISCRIMINATOR_VALUE,
    certificadoSerialNumber: '1234567890ABCDEF',
    certificado: storeDatos.certificacionSAT,
    solicitud: {
        modalidad: "",
        booleanGenerico: true,
        descripcionSistemasMedicion: "Web",
        descripcionLugarEmbarque: "Localisation",
        numeroPermiso: "SI",
        fechaOperacion: "2025-09-19",
        nomOficialAutorizado: ""
    },
    solicitante: {},   
    sociosAccionistas: SOCIOS_ACCIONISTAS,
    notarios: NOTARIOS,
    planta: PLANTA,
    empresas: EMPRESAS,
    plantasIMMEX: PLANTAS_IMMEX,
    plantasSubmanufactureras: PLANTAS_SUBMANUFACTURERAS,
    fraccionesExportacion: FRACCIONES_EXPORTACION,
    fraccionesImportacion: FRACCIONES_IMPORTACION,   
    fraccionesSensibles: FRACCIONES_SENSIBLES,
    servicios: SERVICIOS,
    unidadAdministrativaRepresentacionFederal: {
      clave: storeDatos.modificacionDatos?.representacionFederal || '',
    },
    domicilio: {},
    datosCertificacion: 'CERT-001',
    montoImportaciones: 500000,
    factorAmpliacion: 1.2,
    certificacion_sat: storeDatos.certificacionSAT || '',
    cveEntidad: 'string',
    idProgramaAutorizado: 0,
    tipoPrograma: storeDatos.selectedTipoPrograma,
    tipoModalidad: storeDatos.datosModificacion?.tipo,
    descripcionModalidad: storeDatos.datosModificacion?.programa,
  };
}