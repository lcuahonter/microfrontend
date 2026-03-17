
/**
 * @file guardar.mapper.ts
 * @description Mapper para construir el payload de guardado de la solicitud IMMEX Ampliación Sensibles.
 * @author Ultrasist
 * @date 2025-09-30
 */
import { ImmexRegistroState } from '../estados/immex-ampliacion-sensibles.store';

/**
 * Construye el objeto de datos para guardar la solicitud IMMEX Ampliación Sensibles.
 * @param storeData Estado actual del registro IMMEX.
 * @returns Objeto con la información estructurada para guardar.
 */
export function buildGuardarPayload(storeData: ImmexRegistroState): unknown {
  return {
    "tipoDeSolicitud": "guardar",
    "idSolicitud": 0,
    "idTipoTramite": 80202,
    "rfc": "WMM1307249Q8",
    "cveUnidadAdministrativa": "0305",
    "costoTotal": 10000.5,
    "certificadoSerialNumber": "1234567890ABCDEF",
    "certificado": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A",
    "numeroFolioTramiteOriginal": "TRM-2023-00001",
    "nombre": "Juan",
    "apPaterno": "Pérez",
    "apMaterno": "López",
    "telefono": "5551234567",
    "productoExportacionDtoList": (storeData.exportacion ?? []).map(item => (
      {
        "claveProductoExportacion": 1,
  "testado": true,
  "claveServicioImmex": null,
  "tipoFraccion": "TIPD.EX",
  "visible": true,
  "fraccionPadre": null,
  "replica": true,
  "activo": true,
  "idProductoExp": null,
  "complemento": {
    "anexoII": "NO SENSIBLE",
    "tipo": "EXPORTACION",
    "unidadMedida": "Kilogramo",
    "categoria": "TICAT.MP",
    "descripcion": "DEJ JLFKDSFDSFSDF",
    "valorMensual": "12",
    "valorAnual": "432",
    "volumenMensual": "5435",
    "volumenAnual": "534",
    "testado": true,
    "fecFinVigencia": "2025-09-07",
    "volumenAnualSolicitado": null
  },
  "fraccionCompuesta": null,
  "cveServicioImmex": {
    "claveServicio": 1,
    "nombre": "ABASTECIMIENTO, ALMACENAJE O DISTRIBUCION DE MERCANCIAS",
    "tipoServicio": "TISIMMEX.TN",
    "blnActivo": true,
    "fechaInicioVigencia": "2025-09-07",
    "fechaFinVigencia": "2025-09-07"
  },
  "cveSector": null,
  "idSectorProsecSol": 0,
  "blnFraccionSeleccionada": 0,
  "descripcionTestado": null,
  "proyectosImmex": [
    {
      "tipoDocumento": "TIDPI.CM",
      "descripcion": null,
      "fechaFirma": "04/09/2025",
      "fechaVigencia": "04/09/2025",
      "rfcFirmante": "WMM1307249Q8",
      "razonFirmante": "SILVA",
      "testado": true,
      "fecFinVigencia": "2025-09-07"
    }
  ],
  "proyectosClientes": [
    {
      "paisOrigen": "AUSTIRA",
      "rfcProveedor": "WERWSV",
      "razonProveedor": "WER QWER QW",
      "paisDestino": "ANTARTIDA",
      "rfcClient": "WMM1307249Q8",
      "razonCliente": "CLICNTE UNO ",
      "domicilioCliente": null,
      "testado": true,
      "fecFinVigencia": "2025-09-07"
    }
  ],
  "fraccionArancelaria": {
    "fraccionPadre": item.fraccionImportacion,
    "descripcionFraccionPadre": "",
    "tipoFraccion": "",
    "exenta": true,
    "fraccionCompuesta": "",
    "claveFraccionPadre": "",
    "unidadMedida": "",
    "fraccionConcatenada": "",
    "descripcionTestado": "",
    "testado": true,
    "tipoOperacion": "",
    "valorMonedaMensual": "",
    "valorMonedaAnual": "",
    "valorProduccionMensual": "",
    "valorProduccionAnual": "",
    "valorProduccionAnualSolicitada": "",
    "claveCategoria": "",
    "descripcionCategoria": "",
    "mensaje": "",
    "descripcionUsuario": item.descripcionTigie,
    "umt": item.umt,
    "idFraccion": item.id,
    "idProducto": "",
    "idProductoPadre": "",
    "claveProductoExportacion": 0,
    "descripcionServicio": "",
    "rowID": "",
    "cveFraccion": "61032301",
    "capitulo": "",
    "partida": "",
    "subPartida": "",
    "descripcion": item.descripcionComercialExport,
    "fechaCaptura": "2025-09-07T12:43:35.647Z",
    "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
    "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
    "cveUsuario": "",
    "cveCapituloFraccion": "",
    "cvePartidaFraccion": "",
    "cveSubPartidaFraccion": "",
    "activo": true,
    "activoAnexo28": true,
    "decretoImmex": true,
    "sector": [
      {
        "cveSector": "",
        "nombre": "",
        "productorIndirecto": 0,
        "ampliacionMercancias": 0,
        "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
        "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
        "blnActivo": 0
      }
    ],
    "cveServicioImmex": {
      "claveServicio": 1,
      "nombre": "",
      "tipoServicio": "",
      "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
      "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
      "blnActivo": true
    },
    "listaProveedores": [
      {
        "idProveedor": "",
        "paisOrigen": "",
        "rfcProveedor": "",
        "razonProveedor": "",
        "paisDestino": "",
        "rfcCliente": "",
        "razonCliente": "",
        "domicilio": "",
        "testado": true,
        "idProductoP": "",
        "descTestado": ""
      }
    ],
    "listaProyecto": [
      {
        "idProyecto": "",
        "tipoDocumento": "",
        "descDocumento": "",
        "otro": "",
        "fechaIncio": "",
        "fechaFin": "",
        "firmante": {
          "idFirmante": "",
          "rfc": "",
          "razonSocial": "",
          "claveFraccion": ""
        },
        "testado": "",
        "idProducto": "",
        "descTestado": ""
      }
    ],
    "nicoDtos": [
      {
        "claveNico": "00",
        "descripcion": "",
        "testadoNico": "",
        "testadoInt": true
      }
    ]
  }
})),

"mercanciaImportacion": (storeData.importacion ?? []).map(item => ({
  "claveMercanciaImportacion": 0,
  "testado": 0,
  "tipoFraccion": "",
  "visible": true,
  "fraccionPadre": "",
  "blnFraccionSeleccionada": 0,
  "claveFraccionPadre": "",
  "fraccionCompuesta": "",
  "descripcionTestado": "",
  "unidadMedida": "",
  "tipoOperacion": "",
  "valorMonedaMensual": "",
  "valorMonedaAnual": "",
  "valorProduccionMensual": "",
  "valorProduccionAnual": "",
  "valorProduccionAnualSolicitada": "",
  "categoria": "",
  "mensaje": "",
  "umt": item.umt,
  "claveCategoria": "",
  "descripcionUsuario": item.descripcionTigie,
  "descripcionFraccionPadre": "",
  "idProductoPadre": "",
  "idProducto": "",
  "permisoPadre": "",
  "fraccionArancelaria": {
    "fraccionPadre": "",
    "descripcionFraccionPadre": "",
    "tipoFraccion": "",
    "exenta": true,
    "fraccionCompuesta": "",
    "claveFraccionPadre": "",
    "unidadMedida": "",
    "fraccionConcatenada": "",
    "descripcionTestado": "",
    "testado": true,
    "tipoOperacion": "",
    "valorMonedaMensual": "",
    "valorMonedaAnual": "",
    "valorProduccionMensual": "",
    "valorProduccionAnual": "",
    "valorProduccionAnualSolicitada": "",
    "claveCategoria": "",
    "descripcionCategoria": "",
    "mensaje": "",
    "descripcionUsuario": item.descripcionTigie,
    "umt": item.umt,
    "idFraccion": "",
    "idProducto": "",
    "idProductoPadre": "",
    "claveProductoExportacion": 0,
    "descripcionServicio": "",
    "rowID": "",
    "cveFraccion": item.fraccionArancelaria,
    "capitulo": "",
    "partida": "",
    "subPartida": "",
    "descripcion": "",
    "fechaCaptura": "2025-09-07T12:43:35.647Z",
    "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
    "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
    "cveUsuario": "",
    "cveCapituloFraccion": "",
    "cvePartidaFraccion": "",
    "cveSubPartidaFraccion": "",
    "activo": true,
    "activoAnexo28": true,
    "decretoImmex": true,
    "sector": [
      {
        "cveSector": "",
        "nombre": "",
        "productorIndirecto": 0,
        "ampliacionMercancias": 0,
        "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
        "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
        "blnActivo": 0
      }
    ],
    "cveServicioImmex": {
      "claveServicio": 1,
      "nombre": "",
      "tipoServicio": "",
      "fechaInicioVigencia": "2025-09-07T12:43:35.647Z",
      "fechaFinVigencia": "2025-09-07T12:43:35.647Z",
      "blnActivo": true
    },
    "listaProveedores": [
      {
        "idProveedor": "",
        "paisOrigen": "",
        "rfcProveedor": "",
        "razonProveedor": "",
        "paisDestino": "",
        "rfcCliente": "",
        "razonCliente": "",
        "domicilio": "",
        "testado": true,
        "idProductoP": "",
        "descTestado": ""
      }
    ],
    "listaProyecto": [
      {
        "idProyecto": "",
        "tipoDocumento": "",
        "descDocumento": "",
        "otro": "",
        "fechaIncio": "",
        "fechaFin": "",
        "firmante": {
          "idFirmante": "",
          "rfc": "",
          "razonSocial": "",
          "claveFraccion": ""
        },
        "testado": "",
        "idProducto": "",
        "descTestado": ""
      }
    ],
    "nicoDtos": (item.nicosTable ?? []).map(nico => ({
      "claveNico": nico.NICO_Columna_1 || "00",
      "descripcion": nico.NICO_Columna_2 || "",
      "testadoNico": "",
      "testadoInt": true
    }))
  },
  "listaProveedores": [
    {
      "idProveedor": "",
      "paisOrigen": "",
      "rfcProveedor": "",
      "razonProveedor": "",
      "paisDestino": "",
      "rfcCliente": "",
      "razonCliente": "",
      "domicilio": "",
      "testado": true,
      "idProductoP": "",
      "descTestado": ""
    }
  ],
  "listaProyecto": [
    {
      "idProyecto": "",
      "tipoDocumento": "",
      "descDocumento": "",
      "otro": "",
      "fechaIncio": "",
      "fechaFin": "",
      "firmante": {
        "idFirmante": "",
        "rfc": "",
        "razonSocial": "",
        "claveFraccion": ""
      },
      "testado": "",
      "idProducto": "",
      "descTestado": ""
    }
  ],
  "nicoDtos": (item.nicosTable ?? []).map(nico => ({
    "claveNico": nico.NICO_Columna_1 || "01",
    "descripcion": nico.NICO_Columna_2 || "",
    "testadoNico": "",
    "testadoInt": true
  })),
  "proyectosClientes": [
    {
      "paisOrigen": "",
      "rfcProveedor": "",
      "razonProveedor": "",
      "paisDestino": "ARGELIA (REPUBLICA DEMOCRATICA Y POPULAR DE)",
      "rfcClient": "GDFGFDHGJGHJGH",
      "razonCliente": "D FFGSDFSFSDF",
      "domicilioCliente": "",
      "testado": false,
      "fecFinVigencia": null
    }
  ],
  "complemento": {
    "anexoII": "NO SENSIBLE",
    "tipo": "EXPORTACION",
    "unidadMedida": "Kilogramo",
    "categoria": "TICAT.MP",
    "descripcion": item.descripcionTigie,
    "valorMensual": null,
    "valorAnual": item.cantidadAnual?.toString() || "0",
    "volumenMensual": item.cantidadPorPeriodo?.toString() || "0",
    "volumenAnual": item.cantidadAnual?.toString() || "0",
    "testado": true,
    "fecFinVigencia": null,
    "volumenAnualSolicitado": item.capacidadInstalada?.toString() || null
  }
})),
    "programaImmex": {
        "folioPrograma": "",
        "tipoPrograma": "",
        "movimientoProgramaSE": "",
        "rfc": "MTR8012148K9",
        "anioPrograma": 0,
        "fechaInicioVigencia": "2025-09-03",
        "fechaFinVigencia": "2025-09-03",
        "actividadProductiva": "",
        "fechaSuspension": "2025-09-03",
        "modalidad": "",
        "numeroImmex": "",
        "resolucionId": 0,
        "unidadAdministrativaId": 0
    },
    "datosCertificacion": "CERT-001",
    "id_solicitud": 12345,
    "discriminatorValue": "80202",
    "certificacion_sat": "CERTIFICADO",
    "unidadAdministrativaRepresentacionFederal": {
        "clave": "",
        "idDependencia": 0,
        "claveEntidad": "",
        "claveUnidadAdminR": "",
        "ideTipoUnidadAdministrativa": "",
        "nivel": 0,
        "acronimo": "",
        "nombre": "",
        "descripcion": "",
        "fechaInicioVigencia": "2025-09-08",
        "fechaFinVigencia": "2025-09-08",
        "activo": true,
        "idDireccion": 0,
        "fronteriza": true
    },
    "programaAutorizadoEconomia": {
        "idProgramaAutorizado": 0,
        "folioPrograma": "",
        "tipoPrograma": "",
        "movimientoProgramaSE": "",
        "rfc": "MTR8012148K9",
        "anioPrograma": 0,
        "resolucionId": 0,
        "unidadAdministrativaId": 0,
        "fechaInicioVigencia": "2025-09-08",
        "fechaFinVigencia": "2025-09-08",
        "actividadProductiva": "",
        "fechaSuspension": "2025-09-08"
    },
    "domicilio": {
        "idDomicilio": 0,
        "calle": "",
        "numeroExterior": "",
        "numeroInterior": "",
        "codigoPostal": "",
        "informacionExtra": "",
        "clave": "",
        "cveLocalidad": "",
        "cveDelegMun": "",
        "cveEntidad": "",
        "cvePais": "",
        "ciudad": "",
        "telefono": "",
        "fax": "",
        "municipio": "",
        "colonia": "",
        "descUbicacion": "",
        "cveCatalogo": "",
        "telefonos": "",
        "tipoDomicilio": 0,
        "coloniaEntity": {
            "nombre": ""
        },
        "delegacionMunicipio": {
            "cveDelegMun":""
        },
        "entidadFederativa":{
            "cveEntidad":""
        },"pais":{
            "cvePais":""
        }

    },
    "solicitante": {
        "idPersonaPersonaSolicitudR": 0,
        "idSolicitud": 202734824,
        "nombre": "",
        "apellidoMaterno": "",
        "apellidoPaterno": "",
        "razonSocial": "AGRICOLA ALPE S DE RL DE CV",
        "rfc": "WMM1307249Q8",
        "curp": "",
        "ideTipoPersonaSol": "TIPERS.SL",
        "correoElectronico": "vucem.soporte.aplicativo@ultrasist.com.mx",
        "cedulaProfesional": "",
        "nss": "",
        "telefono": "8154563",
        "descripcionGiro": "Siembra, cultivo y cosecha de papa",
        "cvePaisOrigen": "",
        "idDireccionSol": 260833725,
        "tipoPatenteAgente": "",
        "recif": "",
        "puesto": "",
        "tipoAgente": "",
        "numeroPatente": "",
        "numeroIdentificacionFiscal": "",
        "personaMoral": false,
        "extranjero": false,
        "organismoPublico": false,
        "cveUsuario": "WMM1307249Q8",
        "paginaWeb": "",
        "ideGenerica1": "",
        "rfcExtranjero": "",
        "codAutorizacion": "",
        "actividadProductiva": "",
        "estadoEvaluacionEntidad": "AUTORIZADO",
        "estadoEntidad": "AUTORIZADO",
        "original": false,
        "modificado": false,
        "numeroRegistro": "",
        "concentimientoInstalacionRecuperacion": false,
        "cveCatalogo": "",
        "alquilado": false,
        "volumenAlmacenaje": 0,
        "capacidadAlmacenaje": 0,
        "descripcionDetalladaActividadEconomica": "",
        "activo": false,
        "generico1": false,
        "area": "",
        "cveNacionalidad": "",
        "clasificacionArancelaria": "",
        "infoAdicional": false,
        "montoImportacion": 0,
        "montoExportacion": 0,
        "pctParticAccionaria": 0,
        "ampliacionModelos": false,
        "ampliacionPaises": false,
        "fecFallecimiento": "2025-09-07",
        "cveUnidadAdministrativa": null
    }
}
}

