/* eslint-disable complexity */
/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 260304.
 * 
 * Este adaptador sigue los patrones establecidos por los adaptadores 260604 y 260201
 * para mantener consistencia en la estructura y formato del código.
 */

import { DatosSolicitudFormState, TablaMercanciasDatos, TablaScianConfig } from '../../../shared/models/2603/datos-solicitud.model';
import { Injectable } from '@angular/core';
import { Solicitud260302StateUno } from '../estados/stores/tramite260302.store';
import { Tramite2603Store } from '../../../shared/estados/stores/2603/tramite2603.store';
import { Solicitud2603State } from '../../../shared/estados/stores/2603/tramite2603.store';

@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_260304
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 260301.
 * 
 * Estructura organizada siguiendo patrones de 260604/260201:
 * - Documentación JSDoc completa
 * - Secciones organizadas con headers claros
 * - Mapeo condicional mejorado
 * - Manejo de arrays y objetos nulos
 */
export class GuardarAdapter_260302 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Solicitud260301State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state: Solicitud260302StateUno, tableStore: any): unknown {

    return {
      "idSolicitud": 0,
    "solicitante": {
                "rfc": "AAL0409235E6",
                "nombre": "ACEROS ALVARADO S.A. DE C.V.",
                "actividadEconomica": "Fabricación de productos de hierro y acero",
                "correoElectronico": "contacto@acerosalvarado.com",
                "domicilio": {
                    "pais": "México",
                    "codigoPostal": "06700",
                    "estado": "Ciudad de México",
                    "municipioAlcaldia": "Cuauhtémoc",
                    "localidad": "Centro",
                    "colonia": "Roma Norte",
                    "calle": "Av. Insurgentes Sur",
                    "numeroExterior": "123",
                    "numeroInterior": "Piso 5, Oficina A",
                    "lada": "",
                    "telefono": "123456"
                },
            },
    "solicitud": {
        "discriminatorValue": 260302,
        "declaracionesSeleccionadas": true,
        "regimen": "01",
        "aduanaAIFA": "140",
        "informacionConfidencial": true
    },
     /** -------------------------
       *  SECCIÓN: ESTABLECIMIENTO
       * --------------------------*/
     establecimiento: {
      razonSocial: tableStore.denominacionRazon, // Maps to "denominacionRazon"
      correoElectronico: tableStore.correoElecronico, // Maps to "correoElecronico"
  
      domicilio: {
        codigoPostal: tableStore.codigoPostal, // Maps to "codigoPostal"
        entidadFederativa: {
          clave: tableStore.estado, // Maps to "estado"
        },
        descripcionMunicipio: tableStore.municipio, // Maps to "municipio"
        informacionExtra: tableStore.localidad, // Maps to "localidad"
        descripcionColonia: tableStore.colonia, // Maps to "colonia"
        calle: tableStore.calleYNumero, // Maps to "calleYNumero"
        lada: tableStore.lada, // Maps to "lada"
        telefono: tableStore.telefono, // Maps to "telefono"
      },
  
      original: "", // No direct mapping
      avisoFuncionamiento: tableStore.avisoDeFuncionamiento === true, // Maps to "avisoDeFuncionamiento"
      numeroLicencia: tableStore.licenciaSanitaria, // Maps to "licenciaSanitaria"
      aduanas: tableStore.aduana, // Maps to "aduana"
    },

      /** -------------------------
       *  SECCIÓN: DATOS SCIAN
       * --------------------------*/
      datosSCIAN: (tableStore.scianTabla ?? []).map((datos: any) => ({
        cveScian: datos.clave,
        descripcion: datos.descripcion,
        selected: true
      })),
      
        /** -------------------------
       *  SECCIÓN: MERCANCÍAS
       * --------------------------*/
      
      mercancias: (tableStore.mercanciasTabla ?? []).map((mercancia: any) =>
       ({
        idMercancia: mercancia.idMercancia?.toString() ?? "", // Maps to "idMercancia"
        idClasificacionProducto: mercancia.clasificacion?.clave ?? "325",// Maps to the first item in "clasificacion"
        nombreClasificacionProducto: mercancia.clasificacion[0] ?? "",// Maps to the first item in "clasificacion"
        ideSubClasificacionProducto: "223", // No direct mapping, leave empty
        nombreSubClasificacionProducto: " ", // No direct mapping, leave empty
        descDenominacionEspecifica: mercancia.especificar ?? "", // Maps to "especificar"
        descDenominacionDistintiva: mercancia.denominacion ?? "", // Maps to "denominacion"
        descripcionMercancia: mercancia.descripcionDeLa ?? "", // Maps to "descripcionDeLa"
        formaFarmaceuticaDescripcionOtros: mercancia.formaFarmaceutica?.[0] ?? "", // Maps to the first item in "formaFarmaceutica"
        estadoFisicoDescripcionOtros: "", // No direct mapping, leave empty
        fraccionArancelaria: {
          clave: mercancia.fraccion ?? "", // Maps to "fraccion"
          descripcion: mercancia.descripcionDeLa ?? "", // Maps to "descripcionDeLa"
        },
        unidadMedidaComercial: {
          descripcion: mercancia.umc?.[0] ?? "Pieza" // Maps to the first item in "umc"
        },
        cantidadUMCConComas: "50.000", // Joins "cantidadUmc" array with commas
        unidadMedidaTarifa: {
          descripcion: mercancia.umt ?? "Kilogramo", // Maps to "umt"
        },
        cantidadUMTConComas: mercancia.cantidadUmt ?? "", // Maps to "cantidadUmt"
        presentacion: mercancia.presentacion ?? "qa", // Maps to "presentacion"
        registroSanitarioConComas: mercancia.registroSanitario ?? "", // Maps to "registroSanitario"
        nombreCortoPaisOrigen:  ["JPN","MEX","DEU"], // Maps to "paisDeOrigen"
        nombreCortoPaisProcedencia:  ["JPN","MEX","DEU"], // Maps to "paisDeProcedencia"
        tipoProductoDescripcionOtros: mercancia.tipoDeProducto?.[0] ?? "", // Maps to the first item in "tipoDeProducto"
        nombreCortoUsoEspecifico: ["98","1"], // Maps to "uso"
        especificaUsoEspecifico: mercancia.detalle ?? "", // Maps to "detalle"
        numeroDePiezasAFabricar: mercancia.numeroFabricar ?? "", // Maps to "numeroFabricar"
        descripcionNumeroDePiezas: mercancia.descripcionDePiezas ?? "", // Maps to "descripcionDePiezas"
        numeroCAS: mercancia.numeroCas ?? "", // Maps to "numeroCas"
        cantidadLotes: mercancia.cantidad ?? "", // Maps to "cantidad"
        kgPorLote: mercancia.kg ?? "", // Maps to "kg"
        clavesPaisesDestino: mercancia.paisDeDestino?.[0] ?? "", // Maps to the first item in "paisDeDestino"
        fechaCaducidadStr: "31/12/2026", 
      })),
      /** -------------------------
       *  SECCIÓN: REPRESENTANTE LEGAL
       * --------------------------*/
      representanteLegal: {
        rfc: tableStore.rfc, // Maps to "rfc"
        resultadoIDC: "", // No direct mapping
        nombre: tableStore.nombre, // Maps to "nombre"
        apellidoPaterno: tableStore.apellidoPaterno, // Maps to "apellidoPaterno"
        apellidoMaterno: tableStore.apellidoMaterno, // Maps to "apellidoMaterno"
      },

  

      /** -------------------------
       *  SECCIÓN: TERCEROS OTROS
       * --------------------------*/
        gridTerceros_TIPERS_OTR: Array.isArray(tableStore.otrosTabla)
        ? tableStore.otrosTabla.map((otrosTabla: any) => ({
            idPersonaSolicitud: "",
            ideTipoTercero: "TIPERS.OTR",
            personaMoral: "0",
            booleanExtranjero: "0",
            booleanFisicaNoContribuyente: "0",
            denominacion: otrosTabla.nombre,
            razonSocial: otrosTabla.nombre,
            rfc: otrosTabla.rfc,
            curp: otrosTabla.curp,
            nombre: otrosTabla.nombre,
            apellidoPaterno: "",
            apellidoMaterno: "",
            telefono: otrosTabla.telefono,
            correoElectronico: otrosTabla.correoElectronico,
            actividadProductiva: "",
            actividadProductivaDesc: "",
            descripcionGiro: "",
            numeroRegistro: "",
            domicilio: {
              calle: otrosTabla.calle,
              numeroExterior: otrosTabla.numeroExterior,
              numeroInterior: otrosTabla.numeroInterior,
              pais: {
                "clave": otrosTabla.paisObj?.clave,
                "nombre": otrosTabla.paisObj?.descripcion
            },
              colonia: {
                clave: "",
                nombre: otrosTabla.colonia
              },
              delegacionMunicipio: {
                clave: "",
                nombre: otrosTabla.municipio
              },
              localidad: {
                clave: "",
                nombre: otrosTabla.localidad
              },
              entidadFederativa: {
                clave: "",
                nombre: otrosTabla.entidadFederativa
              },
              informacionExtra: "",
              codigoPostal: otrosTabla.codigoPostal,
              descripcionColonia: otrosTabla.colonia
            },
            // idSolicitud: state.idSolicitud ?? 0
          }))
        : [],

      
      

     

      /** -------------------------
       *  SECCIÓN: TERCEROS CERTIFICADO ANALITICO
       * --------------------------*/

      gridTerceros_TIPERS_DES: Array.isArray(tableStore.fabricanteTablaDatos)
        ? tableStore.fabricanteTablaDatos.map((proveedor: any) => ({
            idPersonaSolicitud: "",
            ideTipoTercero: "TIPERS.CEAN",
            personaMoral: "0",
            booleanExtranjero: "0",
            booleanFisicaNoContribuyente: "0",
            denominacion: proveedor.nombre,
            razonSocial: proveedor.nombre,
            rfc: proveedor.rfc,
            curp: proveedor.curp,
            nombre: proveedor.nombre,
            apellidoPaterno: "",
            apellidoMaterno: "",
            telefono: proveedor.telefono,
            correoElectronico: proveedor.correoElectronico,
            actividadProductiva: "",
            actividadProductivaDesc: "",
            descripcionGiro: "",
            numeroRegistro: "",
            domicilio: {
              calle: proveedor.calle,
              numeroExterior: proveedor.numeroExterior,
              numeroInterior: proveedor.numeroInterior,
              pais: {
                "clave": proveedor.paisObj?.clave,
                "nombre": proveedor.paisObj?.descripcion
            },
              colonia: {
                clave: "",
                nombre: proveedor.colonia
              },
              delegacionMunicipio: {
                clave: "",
                nombre: proveedor.municipio
              },
              localidad: {
                clave: "",
                nombre: proveedor.localidad
              },
              entidadFederativa: {
                clave: "",
                nombre: proveedor.entidadFederativa
              },
              informacionExtra: "",
              codigoPostal: proveedor.codigoPostal,
              descripcionColonia: proveedor.colonia
            },
            // idSolicitud: state.idSolicitud ?? 0
          }))
        : [],
        pagoDeDerechos: {
          claveDeReferencia: tableStore.claveDeReferencia, // Maps to "claveDeReferencia"
          cadenaPagoDependencia: tableStore.cadenaDaLaDependencia, // Maps to "cadenaDaLaDependencia"
          banco: {
            clave: "", // No direct mapping
            descripcion: tableStore.banco, // Maps to "banco"
          },
          llaveDePago: tableStore.laveDePago, // Maps to "laveDePago"
          fecPago: tableStore.fechaDePago, // Maps to "fechaDePago"
          impPago: tableStore.importeDePago, // Maps to "importeDePago"
        },
};
  }
}






export function mapBackendToSolicitud2603(resp: any): Solicitud2603State {
  const datos = resp?.datos;
  const est = datos?.establecimiento;
  const dom = est?.domicilio;
  const scian = datos?.datosSCIAN?.[0];
  const merc = datos?.mercancias?.[0];
  const pago = datos?.pagoDeDerechos;
  const rep = datos?.representanteLegal;

  return {
    idSolicitud: Number(datos?.idSolicitud ?? 0),

    // Solicitud
    regimen: datos?.solicitud?.regimen ?? '',
    aduana: datos?.solicitud?.aduanaAIFA ?? '',
    manifiestos: !!datos?.solicitud?.informacionConfidencial,

    // Establecimiento
    denominacionRazon: est?.razonSocial ?? '',
    correoElecronico: est?.correoElectronico ?? '',
    codigoPostal: dom?.codigoPostal ?? '',
    estado: dom?.entidadFederativa?.clave ?? '',
    municipio: dom?.descripcionMunicipio ?? '',
    localidad: '',
    colonia: dom?.descripcionColonia ?? '',
    calleYNumero: dom?.calle ?? '',
    lada: dom?.lada ?? '',
    telefono: dom?.telefono ?? '',
    avisoDeFuncionamiento: est?.avisoFuncionamiento ?? false,
    licenciaSanitaria: est?.numeroLicencia ?? '',

    // SCIAN
    scianTabla: datos?.datosSCIAN ?? [],
    claveScian: scian?.cveScian ?? '',
    descripcion: scian?.descripcion ?? '',

    // Mercancía
    clasificacion: merc?.clasificacionProducto ?? '',
    especificarClasificacionProducto: merc?.subClasificacionProducto ?? '',
    denominacionDistintiva: merc?.denominacionDistintiva ?? '',
    denominacionComun: merc?.descripcionMercancia ?? '',
    fraccionArancelaria: merc?.fracionArancelaria ?? '',
    cantidadUMC: merc?.cantidadUMCConComas ?? '',
    cantidadUMT: merc?.cantidadUMTConComas ?? '',
    UMT: merc?.unidadMedidaTarifa?.descripcion ?? '',
    UMC: '',
    presentacion: merc?.presentacion ?? '',
    numeroCas: merc?.numeroCAS ?? '',
    mercanciasTabla: datos?.mercancias ?? [],

    // Representante legal
    rfc: rep?.rfc ?? '',
    nombre: rep?.nombre ?? '',
    apellidoPaterno: rep?.apellidoPaterno ?? '',
    apellidoMaterno: rep?.apellidoMaterno ?? '',

    // Terceros
    fabricantetabla: datos?.gridTerceros_TIPERS_FAB ?? [],
    certificadoAnaliticoTablaDatos: datos?.gridTerceros_TIPERS_CEAN ?? [],
    proveedorTablaDatos: datos?.gridTerceros_TIPERS_PVD ?? [],
    facturadorTablaDatos: datos?.gridTerceros_TIPERS_FAC ?? [],
    otrosTabla: datos?.gridTerceros_TIPERS_OTR ?? [],

    // Pago
    claveDeReferencia: pago?.claveDeReferencia ?? '',
    cadenaDaLaDependencia: pago?.cadenaPagoDependencia ?? '',
    banco: pago?.banco?.descripcion ?? '',
    laveDePago: pago?.llaveDePago ?? '',
    fechaDePago: pago?.fecPago ?? '',
    importeDePago: pago?.impPago ?? '',

    // --- Remaining fields not present in backend ---
    claveScianModal: '',
    avisoCheckbox: false,
    regimenDestinara: '',
    numeroPermiso: '',
    losDatosNo: '',
    nombreORazon: '',
    clave: '',
    denominacionEspecifica: '',
    tipoDeProducto: '',
    especifique: '',
    estadoFisico: '',
    descripcionFraccion: '',
    numeroRegistro: '',
    fechaCaducidad: '',
    cumplimiento: '',
    dci: '',
    marcaComercialODenominacionDistintiva: '',
    descripcionDeLaFraccion: '',
    cantidadDeLotes: '',
    kgOrPorLote: '',
    pais: '',
    paisDeProcedencia: '',
    detallarUso: '',
    numeroDePiezas: '',
    descripcionDelNumeroDePiezas: '',
    numeroDeRegistro: '',
    tipoDocumento: '',
    tercerosRelacionadosDenominacionSocial: '',
    tercerosRelacionadosTerceroNombre: '',
    tercerosNacionalidad: '',
    tipoPersona: '',
    tercerosRelacionadosRfc: '',
    tercerosRelacionadosCurp: '',
    tercerosRelacionadosRazonSocial: '',
    tercerosRelacionadosPais: '',
    tercerosRelacionadosEstado: '',
    tercerosRelacionadosCodigoPostal: '',
    tercerosRelacionadosCalle: '',
    tercerosRelacionadosNumeroExterior: '',
    tercerosRelacionadosNumeroInterior: '',
    tercerosRelacionadosLada: '',
    tercerosRelacionadosTelefono: '',
    tercerosRelacionadosCorreoElectronico: '',
    datosPersonalesNombre: '',
    datosPersonalesPrimerApellido: '',
    datosPersonalesSegundoApellido: '',
    tercerosRelacionadosMunicipio: '',
    tercerosRelacionadosLocalidad: '',
    tercerosRelacionadosColonia: ''
  };
}
export function mapPago(response: any): any {
  const pago = response?.datos?.pagoDeDerechos;
  const estado = response?.datos?.establecimiento?.domicilio?.entidadFederativa?.clave;

  return {
    banco: pago?.banco?.clave ?? '',
    bancoObject: pago?.banco?.descripcion ?? '',
    cadenaDependencia: pago?.cadenaPagoDependencia ?? '',
    claveReferencia: pago?.claveDeReferencia ?? '',
    estado: estado ?? '',
    fechaPago: pago?.fecPago ?? '',
    importePago: pago?.impPago ?? '',
    llavePago: pago?.llaveDePago ?? ''
  };
}

