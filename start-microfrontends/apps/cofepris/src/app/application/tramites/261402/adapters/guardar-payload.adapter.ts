/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 261402.
 * 
 * Este adaptador sigue los patrones establecidos por los adaptadores 260604 y 260201
 * para mantener consistencia en la estructura y formato del código.
 */

import { Injectable } from '@angular/core';
import { Solicitud261402State } from '../estados/tramite261402.store';
import { Solicitud2614State } from '../../../estados/tramites/tramite2614.store';
import { DatosDelSolicituteSeccionState } from '../../../shared/estados/stores/datos-del-solicitute-seccion.store';
import { PagoDerechosFormState } from '../../../shared/models/pago-derechos.model';

@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_261402
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 261402.
 * 
 */
export class GuardarAdapter_261402 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Solicitud261402State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state: Solicitud261402State, datosState: DatosDelSolicituteSeccionState, solicitud2614State: Solicitud2614State, guardarDatos: any, pagoState: PagoDerechosFormState): unknown {

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
        certificado_serial_number: ""
      },

      /** -------------------------
       *  SECCIÓN: SOLICITUD
       * --------------------------*/
      "solicitud": {
        "discriminatorValue": 261402,
        "declaracionesSeleccionadas": true,
        "regimen": "01",
        "aduanaAIFA": "140",
        "informacionConfidencial": true
      },
      
      /** -------------------------
       *  SECCIÓN: ESTABLECIMIENTO
       * --------------------------*/
      "establecimiento": {
          "rfcResponsableSanitario": datosState?.establecimientoRFCResponsableSanitario || datosState?.rfcDelProfesionalResponsable || "",
          "razonSocial": datosState?.establecimientoRazonSocial || datosState?.establecimientoDenominacionRazonSocial || "",
          "correoElectronico": datosState?.establecimientoCorreoElectronico || "",
          "domicilio": {
              "codigoPostal": datosState?.establecimientoDomicilioCodigoPostal || "",
              "entidadFederativa": {
                  "clave": datosState?.establecimientoEstados || datosState?.establecimientoDomicilioEstado || ""
              },
              "descripcionMunicipio": datosState?.descripcionMunicipio || datosState?.establecimientoMunicipioYAlcaldia || "",
              "informacionExtra": datosState?.localidad || datosState?.establecimientoDomicilioLocalidad || "",
              "descripcionColonia": datosState?.establishomentoColonias || datosState?.establecimientoDomicilioColonia || datosState?.colonias || "",
              "calle": datosState?.calle || datosState?.establecimientoDomicilioCalle || "",
              "lada": datosState?.lada || datosState?.establecimientoDomicilioLada || "",
              "telefono": datosState?.telefono || datosState?.establecimientoDomicilioTelefono || ""
          },
          "original": "",
          "avisoFuncionamiento": datosState?.avisoCheckbox || datosState?.avisoDeFuncionamiento || false,
          "numeroLicencia": datosState?.noDeLicenciaSanitaria || datosState?.licenciaSanitaria || datosState?.noLicenciaSanitaria || "",
          "aduanas": datosState?.aduanasEntradas || datosState?.aduanaDeSalida || ""
      },

      /** -------------------------
       *  SECCIÓN: DATOS SCIAN
       * --------------------------*/
      "datosSCIAN": [{
        "cveScian": datosState.scian,
        "descripcion": datosState.descripcionScian,
        "selected": true
      }],

      /** -------------------------
       *  SECCIÓN: MERCANCÍAS
       * --------------------------*/
      "mercancias": (() => {
        let merchandiseData: any[] = [];
        
        if (datosState?.establecimientoData && Array.isArray(datosState.establecimientoData) && datosState.establecimientoData.length > 0) {
          merchandiseData = datosState.establecimientoData;
        }
        else if (state?.scianTabla && Array.isArray(state.scianTabla) && state.scianTabla.length > 0) {
          merchandiseData = state.scianTabla;
        }
        
        if (merchandiseData.length === 0) {
          return [];
        }
        
        return merchandiseData.map((producto) => ({
          "idMercancia": producto?.id ?? null,
          "idClasificacionProducto": producto?.tipoDeProducto || producto?.clasificacion || "",
          "nombreClasificacionProducto": "",
          "ideSubClasificacionProducto": "",
          "nombreSubClasificacionProducto": "",
          "descDenominacionEspecifica": producto?.nombreEspecifico || producto?.denominacionEspecifica || "",
          "descDenominacionDistintiva": producto?.denominacionDistintiva || "",
          "descripcionMercancia": producto?.nombreEspecifico || producto?.denominacionEspecifica || "",
          "formaFarmaceuticaDescripcionOtros": "",
          "estadoFisicoDescripcionOtros": "",
          "fraccionArancelaria": {
              "clave": producto?.fraccionArancelaria || "",
              "descripcion": producto?.descripcionFraccion || ""
          },
          "unidadMedidaComercial": {
              "descripcion": producto?.unidadDeMedida || producto?.UMT || ""
          },
          "cantidadUMCConComas": producto?.cantidadOVolumen || producto?.cantidadUMT || "",
          "unidadMedidaTarifa": {
              "descripcion": producto?.UMT || ""
          },
          "cantidadUMTConComas": producto?.cantidadUMT || "",
          "presentacion": producto?.Presentacion || producto?.presentacion || "",
          "nombreCortoPaisOrigen": producto?.paisOrigen ? [producto.paisOrigen] : [],
          "nombreCortoPaisProcedencia": producto?.paisProcedencia ? [producto.paisProcedencia] : [],
          "tipoProductoDescripcionOtros": producto?.tipoDeProducto || producto?.clasificacion || "",
          "nombreCortoUsoEspecifico": []
        }));
      })(),
      
      /** -------------------------
       *  SECCIÓN: REPRESENTANTE LEGAL
       * --------------------------*/
      "representanteLegal": {
          "rfc": datosState?.representanteRfc || "",
          "resultadoIDC": "",
          "nombre": datosState?.representanteNombre || "",
          "apellidoPaterno": datosState?.apellidoPaterno || "",
          "apellidoMaterno": datosState?.apellidoMaterno || ""
      },
      
      /** -------------------------
       *  SECCIÓN: TERCEROS DESTINATARIOS
       * --------------------------*/
      gridTerceros_TIPERS_INF: (() => {
        let thirdPartyData: any[] = [];
        
        if (solicitud2614State?.destinatarioDatos && Array.isArray(solicitud2614State.destinatarioDatos) && solicitud2614State.destinatarioDatos.length > 0) {
          thirdPartyData = solicitud2614State.destinatarioDatos;
        }
        
        if (thirdPartyData.length === 0) {
          return [];
        }
        
        return thirdPartyData.map((destinatario) => ({
          idPersonaSolicitud: "",
          ideTipoTercero: "TIPERS.DES",
          personaMoral: "0",
          booleanExtranjero: "0",
          booleanFisicaNoContribuyente: "0",
          denominacion: destinatario?.nombre || destinatario?.denominacion || "",
          razonSocial: destinatario?.nombre || destinatario?.razonSocial || "",
          rfc: destinatario?.rfc || "",
          curp: destinatario?.curp || "",
          nombre: destinatario?.nombre || "",
          apellidoPaterno: destinatario?.apellidoPaterno || "",
          apellidoMaterno: destinatario?.apellidoMaterno || "",
          telefono: destinatario?.telefono || "",
          correoElectronico: destinatario?.correoElectronico || "",
          actividadProductiva: "",
          actividadProductivaDesc: "",
          descripcionGiro: "",
          numeroRegistro: "",
          domicilio: {
            calle: destinatario?.calle || "",
            numeroExterior: destinatario?.numeroExterior || "",
            numeroInterior: destinatario?.numeroInterior || "",
            pais: {
              clave: "",
              nombre: destinatario?.pais || ""
            },
            colonia: {
              clave: "",
              nombre: destinatario?.colonia || ""
            },
            delegacionMunicipio: {
              clave: "",
              nombre: destinatario?.municipio || ""
            },
            localidad: {
              clave: "",
              nombre: destinatario?.localidad || ""
            },
            entidadFederativa: {
              clave: "",
              nombre: destinatario?.entidadFederativa || ""
            },
            informacionExtra: "",
            codigoPostal: destinatario?.codigoPostal || "",
            descripcionColonia: destinatario?.colonia || ""
          },
        }));
      })(),

      /** -------------------------
       *  SECCIÓN: PAGO DE DERECHOS
       * --------------------------*/
      pagoDeDerechos: {
        claveDeReferencia: pagoState?.claveReferencia ?? '',
        cadenaPagoDependencia: pagoState?.cadenaDependencia ?? '',
        banco: {
          clave: "",
          descripcion: pagoState?.estado ?? ''
        },
        llaveDePago: pagoState?.llavePago ?? '',
        fecPago: pagoState?.fechaPago ?? '',
        impPago: pagoState?.importePago ?? '',
      }
    };
  }

}
