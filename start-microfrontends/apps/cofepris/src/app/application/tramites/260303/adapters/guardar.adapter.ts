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
import { Solicitud260303State } from '../Estados/tramite260303.store';
import { Solicitud2603State } from '../../../shared/estados/stores/2603/tramite2603.store';

@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_260304
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 260303.
 * 
 * Estructura organizada siguiendo patrones de 260604/260201:
 * - Documentación JSDoc completa
 * - Secciones organizadas con headers claros
 * - Mapeo condicional mejorado
 * - Manejo de arrays y objetos nulos
 */
export class GuardarAdapter_260303 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Solicitud260303State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state260303: Solicitud260303State, state: Solicitud2603State, tableStore: any, guardarDatos: any, pagoState: PagoDerechosState): unknown {

    return {
      idSolicitud: state260303.idSolicitud ?? 0,
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
          lada: "",
          telefono: guardarDatos.ubicacion.telefono_1 ?? ""
        },
        certificado_serial_number: "00001000000504465000"
      },
      "solicitud": {
        "discriminatorValue": 260303,
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
          cantidadUMC: mercancia.umc,
          unidadMedidaUMC: mercancia.cantidadUmc,
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
          telefono: fabricante.telefono,
          correoElectronico: fabricante.correoElectronico,
          descripcionGiro: "",
          numeroRegistro: "",
          domicilio: {
            calle: fabricante.calle,
            numeroExterior: fabricante.numeroExterior,
            numeroInterior: fabricante.numeroInterior,
            pais: {
              clave: "",
              nombre: fabricante.pais
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
          telefono: otrosTabla.telefono,
          correoElectronico: otrosTabla.correoElectronico,
          descripcionGiro: "",
          numeroRegistro: "",
          domicilio: {
            calle: otrosTabla.calle,
            numeroExterior: otrosTabla.numeroExterior,
            numeroInterior: otrosTabla.numeroInterior,
            pais: {
              clave: "",
              nombre: otrosTabla.pais
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
          descripcionGiro: "",
          numeroRegistro: "",
          domicilio: {
            calle: proveedor.calle,
            numeroExterior: proveedor.numeroExterior,
            numeroInterior: proveedor.numeroInterior,
            pais: {
              clave: "",
              nombre: proveedor.pais
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
          telefono: fabricante.telefono,
          correoElectronico: fabricante.correoElectronico,
          descripcionGiro: "",
          numeroRegistro: "",
          domicilio: {
            calle: fabricante.calle,
            numeroExterior: fabricante.numeroExterior,
            numeroInterior: fabricante.numeroInterior,
            pais: {
              clave: "",
              nombre: fabricante.pais
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
          telefono: proveedor.telefono,
          correoElectronico: proveedor.correoElectronico,
          descripcionGiro: "",
          numeroRegistro: "",
          domicilio: {
            calle: proveedor.calle,
            numeroExterior: proveedor.numeroExterior,
            numeroInterior: proveedor.numeroInterior,
            pais: {
              clave: "",
              nombre: proveedor.pais
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
        }))
        : [],
      pagoDeDerechos: {
        claveDeReferencia: pagoState?.claveReferencia ?? '',
        cadenaPagoDependencia: pagoState?.cadenaDependencia ?? '',
        banco: {
          clave: "",
          descripcion: pagoState?.banco ?? ''
        },
        llaveDePago: pagoState?.llavePago ?? '',
        fechaPago: pagoState?.fechaPago ?? '',
        impPago: pagoState?.importePago ?? '',
      }
    };
  }
}
