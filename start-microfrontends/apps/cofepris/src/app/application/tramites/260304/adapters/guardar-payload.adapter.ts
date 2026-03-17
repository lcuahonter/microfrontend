/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 260304.
 * 
 * Este adaptador sigue los patrones establecidos por los adaptadores 260604 y 260201
 * para mantener consistencia en la estructura y formato del código.
 */

import { Injectable } from '@angular/core';
import { PagoDerechosState } from '../../../shared/estados/stores/pago-de-derechos.store';
import { Solicitud260304State } from '../estados/stores/tramite260304.store';
import { Solicitud2603State } from '../../../shared/estados/stores/2603/tramite2603.store';

@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_260304
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 260304.
 * 
 */
export class GuardarAdapter_260304 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Solicitud260304State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state: Solicitud260304State, datosState: Solicitud2603State, guardarDatos: any, pagoState: PagoDerechosState): unknown {

    return {
      idSolicitud: state.idSolicitud ?? 0, 
      /** -------------------------
       *  SECCIÓN: SOLICITANTE
       * --------------------------*/
      solicitante: {
        rfc: guardarDatos.rfc_original ?? "",
        nombre: guardarDatos.nombre ?? "",
        actividadEconomica: "Fabricación de productos de hierro y acero",
        correoElectronico: guardarDatos.email ?? "",
        domicilio: {
          pais: guardarDatos.ubicacion.pais_residencia ?? "",
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

      /** -------------------------
       *  SECCIÓN: SOLICITUD
       * --------------------------*/
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
        rfcResponsableSanitario: datosState?.rfc,
        razonSocial: datosState?.denominacionRazon,
        correoElectronico: datosState?.correoElecronico,

        domicilio: {
          codigoPostal: datosState?.codigoPostal,
          entidadFederativa: {
            clave: datosState?.estado
          },
          descripcionMunicipio: datosState?.municipio,
          informacionExtra: datosState?.localidad,
          descripcionColonia: datosState?.colonia,
          calle: datosState?.calleYNumero,
          lada: datosState?.lada,
          telefono: datosState?.telefono
        },

        original: "",
        avisoFuncionamiento: datosState?.avisoCheckbox === true,
        numeroLicencia: datosState?.licenciaSanitaria,
        aduanas: datosState?.aduana
      },

      /** -------------------------
       *  SECCIÓN: DATOS SCIAN
       * --------------------------*/
      datosSCIAN: (datosState.scianTabla ?? []).map((datos: any) => ({
        cveScian: datos.clave,
        descripcion: datos.descripcion,
        selected: true
      })),
      
      /** -------------------------
       *  SECCIÓN: MERCANCÍAS
       * --------------------------*/
      mercancias: Array.isArray(datosState.mercanciasTabla)
      ? datosState.mercanciasTabla.map((mercancia: any) => ({
          idMercancia: mercancia.id,
          clasificacionProducto: mercancia.especificarClasificac,
          subClasificacionProducto: "",
          denominacionDistintiva: mercancia.marcaComercialODenominacionDistintiva,
          numeroCAS: mercancia.numeroCas,
          fracionArancelaria: mercancia.fraccionArancelaria,
          descripcionMercancia: mercancia.marcaComercialODenominacionDistintiva,
          cantidadUMC: mercancia.umc,
          unidadMedidaUMC: mercancia.cantidadUmc,
          kgPorLote: mercancia.kgOrPorLote,
          piezasAFabricarConComas: "",
          nombreComunConComas: "",
          presentacion: mercancia.presentacion,
          numeroRegistroSanitario: mercancia.numeroDeRegistro,
          usoEspecifico: mercancia?.usoEspecifico,
          especificaUsoEspecifico: "",
          nombrePaisDestino: "",
          nombrePaisOrigen: mercancia?.paisDeOrigen,
          nombrePaisProcedencia: "",
          formaFarmaceuticaCorto: "",
          cantidadUMCConComas: mercancia.cantidadUmc,
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
        rfc: datosState?.rfc,
        resultadoIDC: "",
        nombre: datosState?.nombreORazon,
        apellidoPaterno: datosState?.apellidoPaterno,
        apellidoMaterno: datosState?.apellidoMaterno
      },

      /** -------------------------
       *  SECCIÓN: TERCEROS DESTINATARIOS
       * --------------------------*/
      gridTerceros_TIPERS_DES: Array.isArray(datosState.fabricantetabla)
        ? datosState.fabricantetabla.map((fabricante: any) => ({
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
              pais: {
                clave: "",
                nombre: fabricante.pais?.value || ""
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
          }))
        : [],

      /** -------------------------
       *  SECCIÓN: TERCEROS OTROS
       * --------------------------*/
      gridTerceros_TIPERS_OTR: Array.isArray(datosState.otrosTabla)
        ? datosState.otrosTabla.map((otrosTabla: any) => ({
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
                clave: "",
                nombre: otrosTabla.pais?.value || ""
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
          }))
        : [],

      /** -------------------------
       *  SECCIÓN: PAGO DE DERECHOS
       * --------------------------*/
      pagoDeDerechos: {
        claveDeReferencia: pagoState?.claveReferencia ?? '',
        cadenaPagoDependencia: pagoState?.cadenaDependencia ?? '',
        banco: {
          clave: "",
          descripcion: pagoState?.banco ?? ''
        },
        llaveDePago: pagoState?.llavePago ?? '',
        fecPago: pagoState?.fechaPago ?? '',
        impPago: pagoState?.importePago ?? '',
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
