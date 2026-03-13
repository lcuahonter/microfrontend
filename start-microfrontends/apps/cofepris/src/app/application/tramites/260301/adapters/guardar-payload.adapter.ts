/* eslint-disable complexity */
/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 260304.
 * 
 * Este adaptador sigue los patrones establecidos por los adaptadores 260604 y 260201
 * para mantener consistencia en la estructura y formato del código.
 */
import { Injectable } from '@angular/core';
import { Solicitud260301State } from '../estados/stores/tramite260301.store';
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
export class GuardarAdapter_260301 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Solicitud260301State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state: Solicitud260301State, tableStore: any,guardarDatos: any): unknown {

    return {
      "idSolicitud": state.idSolicitud ?? 0,
    solicitante: {
        rfc: guardarDatos.rfc_original ?? "",
        nombre: guardarDatos.nombre ?? "",
        actividadEconomica: "Fabricación de productos de hierro y acero",
        correoElectronico: guardarDatos.email ?? "",
        domicilio: {
          pais: "ESTADOS UNIDOS MEXICANOS",
          codigoPostal: guardarDatos.ubicacion.cp ?? "",
          estado: guardarDatos.ubicacion.d_ent_fed ?? "",
          municipioAlcaldia: guardarDatos.ubicacion.d_municipio ?? "",
          localidad: guardarDatos.ubicacion.d_localidad ?? "",
          colonia: guardarDatos.ubicacion.d_colonia ?? "",
          calle: guardarDatos.ubicacion.calle ?? "",
          numeroExterior: guardarDatos.ubicacion.n_exterior ?? "",
          numeroInterior: guardarDatos.ubicacion.n_interior ?? "",
          lada:"",
          telefono: guardarDatos.ubicacion.telefono_1 ?? ""
        }, 
        certificado_serial_number: "00001000000504465000"
      },
    "solicitud": {
        "discriminatorValue": 260301,
        "declaracionesSeleccionadas": true,
        "regimen": "01",
        "aduanaAIFA": "140",
        "informacionConfidencial": true
    },
     /** -------------------------
       *  SECCIÓN: ESTABLECIMIENTO
       * --------------------------*/
      establecimiento: {
        razonSocial: state.denominacionRazon,
        correoElectronico: state.correoElecronico,

        domicilio: {
          codigoPostal: state.codigoPostal,
          entidadFederativa: {
            clave: state.estado
          },
          descripcionMunicipio: state.municipio,
          informacionExtra: state.localidad,
          descripcionColonia: state.colonia,
          calle: state.calleYNumero,
          lada: state.lada,
          telefono: state.telefono
        },

        original: "",
        avisoFuncionamiento: state.avisoDeFuncionamiento === "true",
        numeroLicencia: state.licenciaSanitaria,
        aduanas: state.aduana
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
    mercancias: Array.isArray(tableStore.mercanciasTabla)
      ? tableStore.mercanciasTabla.map((mercancia: any) => ({
          idMercancia: mercancia.id,
          clasificacionProducto: mercancia.especificarClasificac,
          subClasificacionProducto: "",
          denominacionDistintiva: mercancia.marcaComercialODenominacionDistintiva,
          numeroCAS: mercancia.numeroCas,
          fracionArancelaria: mercancia.fraccionArancelaria,
          descripcionMercancia: mercancia.marcaComercialODenominacionDistintiva,
          cantidadUMC: 
                "Docenas par"
            ,
          unidadMedidaUMC: "Docena par",
          kgPorLote: mercancia.kgOrPorLote,
          piezasAFabricarConComas: "",
          nombreComunConComas: "",
          presentacion: mercancia.presentacion,
          numeroRegistroSanitario: mercancia.numeroDeRegistro,
          usoEspecifico: ["98", "1"],
          especificaUsoEspecifico: "",
          nombrePaisDestino: "",
          nombrePaisOrigen: ["MEX", "JPN", "DEU"],
          nombrePaisProcedencia: "",
          formaFarmaceuticaCorto: "",
          cantidadUMCConComas: null,
          cantidadUMTConComas: mercancia.cantidadUmt,
          unidadMedidaTarifa: {
            descripcion: "Kilogramo"
          }
        }))
      : [],
      /** -------------------------
       *  SECCIÓN: REPRESENTANTE LEGAL
       * --------------------------*/
      representanteLegal: {
        rfc: state.rfc,
        resultadoIDC: "",
        nombre: state.nombre,
        apellidoPaterno: state.apellidoPaterno,
        apellidoMaterno: state.apellidoMaterno
      },

   /** -------------------------
       *  SECCIÓN: TERCEROS FABRICANTE
       * --------------------------*/

       gridTerceros_TIPERS_FAB: Array.isArray(tableStore.fabricantetabla)
        ? tableStore.fabricantetabla.map((fabricante: any) => ({
            idPersonaSolicitud: "",
            ideTipoTercero: "TIPERS.FAB",
            personaMoral: "0",
            booleanExtranjero: "0",
            booleanFisicaNoContribuyente: "0",
            denominacion: fabricante.nombre,
            razonSocial: fabricante.nombre,
            rfc: fabricante.rfc,
            curp: fabricante.curp,
            nombre: fabricante.nombre,
            apellidoPaterno: "",
            apellidoMaterno: "",
            telefono: fabricante.telefono,
            correoElectronico: fabricante.correoElectronico,
            actividadProductiva: "",
            actividadProductivaDesc: "",
            descripcionGiro: "",
            numeroRegistro: "",
            domicilio: {
              calle: fabricante.calle,
              numeroExterior: fabricante.numeroExterior,
              numeroInterior: fabricante.numeroInterior,
              pais:{
                "clave": fabricante.paisObj?.clave,
                "nombre": fabricante.paisObj?.descripcion
            },
              colonia: {
                clave: "",
                nombre: fabricante.colonia
              },
              delegacionMunicipio: {
                clave: "",
                nombre: fabricante.municipio
              },
              localidad: {
                clave: "",
                nombre: fabricante.localidad
              },
              entidadFederativa: {
                clave: "",
                nombre: fabricante.entidadFederativa
              },
              informacionExtra: "",
              codigoPostal: fabricante.codigoPostal,
              descripcionColonia: fabricante.colonia
            },
            // idSolicitud: state.idSolicitud ?? 0
          }))
        : [],

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
       *  SECCIÓN: TERCEROS PROVEEDOR
       * --------------------------*/

        gridTerceros_TIPERS_PVD: Array.isArray(tableStore.proveedorTablaDatos)
        ? tableStore.proveedorTablaDatos.map((proveedor: any) => ({
            idPersonaSolicitud: "",
            ideTipoTercero: "TIPERS.FAC",
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
      

      /** -------------------------
       *  SECCIÓN: TERCEROS FACTURADOR
       * --------------------------*/
      gridTerceros_TIPERS_FAC: Array.isArray(tableStore.facturadorTablaDatos)
        ? tableStore.facturadorTablaDatos.map((fabricante: any) => ({
            idPersonaSolicitud: "",
            ideTipoTercero: "TIPERS.FAC",
            personaMoral: "0",
            booleanExtranjero: "0",
            booleanFisicaNoContribuyente: "0",
            denominacion: fabricante.nombre,
            razonSocial: fabricante.nombre,
            rfc: fabricante.rfc,
            curp: fabricante.curp,
            nombre: fabricante.nombre,
            apellidoPaterno: "",
            apellidoMaterno: "",
            telefono: fabricante.telefono,
            correoElectronico: fabricante.correoElectronico,
            actividadProductiva: "",
            actividadProductivaDesc: "",
            descripcionGiro: "",
            numeroRegistro: "",
            domicilio: {
              calle: fabricante.calle,
              numeroExterior: fabricante.numeroExterior,
              numeroInterior: fabricante.numeroInterior,
              pais: {
                "clave": fabricante.paisObj?.clave,
                "nombre": fabricante.paisObj?.descripcion
            },
              colonia: {
                clave: "",
                nombre: fabricante.colonia
              },
              delegacionMunicipio: {
                clave: "",
                nombre: fabricante.municipio
              },
              localidad: {
                clave: "",
                nombre: fabricante.localidad
              },
              entidadFederativa: {
                clave: "",
                nombre: fabricante.entidadFederativa
              },
              informacionExtra: "",
              codigoPostal: fabricante.codigoPostal,
              descripcionColonia: fabricante.colonia
            },
            // idSolicitud: state.idSolicitud ?? 0
          }))
        : [],

      /** -------------------------
       *  SECCIÓN: TERCEROS CERTIFICADO ANALITICO
       * --------------------------*/

         gridTerceros_TIPERS_CEAN: Array.isArray(tableStore.certificadoAnaliticoTablaDatos)
        ? tableStore.certificadoAnaliticoTablaDatos.map((proveedor: any) => ({
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
        claveDeReferencia: state.claveDeReferencia,
        cadenaPagoDependencia: state.cadenaDaLaDependencia,
        banco: {
          clave: "",
          descripcion: state.banco
        },
        llaveDePago: state.laveDePago,
        fecPago: state.fechaDePago,
        impPago: state.importeDePago
      }
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

