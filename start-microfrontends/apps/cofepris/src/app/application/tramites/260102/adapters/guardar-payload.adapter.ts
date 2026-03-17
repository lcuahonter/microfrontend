/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { Injectable } from '@angular/core';
import { Tramite260102State } from '../estados/stores/tramite260102Store.store';



@Injectable({
  providedIn: 'root'
})
export class GuardarAdapter_260102 {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: Tramite260102State): unknown {
    console.log('Estado para payload:', state);
    return {
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
 solicitud: {
          discriminatorValue: 260103,
          regimen: "01",
          declaracionesSeleccionadas: true,
          aduanaAIFA: "",
          informacionConfidencial:true
      },
      establecimiento: {
        rfcResponsableSanitario: "XAXX010101000",
        razonSocial: state.datosSolicitudFormState.denominacionRazon,
        correoElectronico: state.datosSolicitudFormState.correoElectronico,

        domicilio: {
          codigoPostal: state.datosSolicitudFormState.codigoPostal,
          entidadFederativa: {
            clave: state.datosSolicitudFormState.estado
          },
          descripcionMunicipio: state.datosSolicitudFormState.municipioAlcaldia,
          informacionExtra: state.datosSolicitudFormState.localidad,
          descripcionColonia: state.datosSolicitudFormState.colonia,
          calle: state.datosSolicitudFormState.calle,
          lada: state.datosSolicitudFormState.lada,
          telefono: state.datosSolicitudFormState.telefono
        },

        original: "",
        avisoFuncionamiento: state.datosSolicitudFormState.aviso,
        numeroLicencia: state.datosSolicitudFormState.licenciaSanitaria,
        aduanas:""
      },

      datosSCIAN: state.scianConfigDatos.map(item => ({
        cveScian: item.clave,
        descripcion: item.descripcion,
                 selected: true
      })),

      mercancias: (state.tablaMercanciasConfigDatos ?? []).map(merc => ({
        idMercancia: merc.id || "",
        idClasificacionProducto: merc.claveClasificacionProductoObj?.clave,
        nombreClasificacionProducto: merc.claveClasificacionProductoObj?.descripcion,

        ideSubClasificacionProducto: merc.especificarClasificacionObj?.clave,
        nombreSubClasificacionProducto: merc.especificarClasificacionObj?.descripcion,

        descDenominacionEspecifica: merc.denominacionEspecificaProducto,
        descDenominacionDistintiva: merc.denominacionDistintiva || "Paracetamol Tabletas 500mg",
        descripcionMercancia: "",

        formaFarmaceuticaDescripcionOtros: merc.especifiqueForma || "Tableta",
        estadoFisicoDescripcionOtros: merc.especifiqueEstado || "Sólido",

        fraccionArancelaria: {
          clave: merc.fraccionArancelaria,
          descripcion: merc.descripcionFraccion
        },

        unidadMedidaComercial: {
          descripcion: merc.cantidadUMCObj?.descripcion
        },

        cantidadUMCConComas:"50,000",
        cantidadUMTConComas: merc.cantidadUmtValor || '10000',

        presentacion: merc.presentacion || "Frasco x 100 tabletax",
        registroSanitarioConComas: merc.numeroRegistroSanitario || "COFEPRIS-REG-001-2024-SSA1",

        nombreCortoPaisOrigen: merc.paisDeOriginDatos?.toString(),
        nombreCortoPaisProcedencia: merc.paisDeProcedenciaDatos?.toString(),

        tipoProductoDescripcionOtros: merc.especifique,
        nombreCortoUsoEspecifico: merc.usoEspecifico?.toString(),

        fechaCaducidadStr: merc.fechaCaducidad || "31/12/2026",
        
        NumeroLotes: merc.clavesLote?.map(l => ({
          numeroLote: l.clave,
          fechaElaboracionStr: l.fabricacion,
          fechaCaducidadStr: l.caducidad
        })) ?? []
      })),

      representanteLegal: {
        rfc: state.datosSolicitudFormState.representanteRfc,
        resultadoIDC: "",
        nombre: state.datosSolicitudFormState.representanteNombre,
        apellidoPaterno: state.datosSolicitudFormState.apellidoPaterno,
        apellidoMaterno: state.datosSolicitudFormState.apellidoMaterno
      },

      gridTerceros_TIPERS_FAB: state.fabricanteTablaDatos.map(f => ({
        idPersonaSolicitud: f.id,
        ideTipoTercero: "TIPERS.FAB",
        personaMoral: f.tipoPersona === "Moral" ? "1" : "0",
        booleanExtranjero: f.nacionalidad === 'Extranjero' ? "1" : "0",
        booleanFisicaNoContribuyente: "0",

        denominacion:
          f.tipoPersona === "Moral"
            ? f.razonSocial
            : `${f.nombres} ${f.primerApellido} ${f.segundoApellido}`,

        razonSocial: f.razonSocial,
        rfc: f.rfc,
        curp: f.curp,

        nombre: f.nombres,
        apellidoPaterno: f.primerApellido,
        apellidoMaterno: f.segundoApellido,

        telefono: f.telefono,
        correoElectronico: f.correoElectronico,

        actividadProductiva: "",
        actividadProductivaDesc: "",
        descripcionGiro: "",
        numeroRegistro: "",

        domicilio: {
          calle: "",
          numeroExterior: f.numeroExterior,
          numeroInterior: f.numeroInterior,

          pais: {
            clave: f.paisObj?.clave,
            nombre: f.paisObj?.descripcion
          },

          colonia: {
            clave: f.coloniaObj?.clave,
            nombre: f.coloniaObj?.descripcion
          },

          delegacionMunicipio: {
            clave: f.municipioAlcaldiaObj?.clave,
            nombre: f.municipioAlcaldiaObj?.descripcion
          },

          localidad: {
            clave: f.localidadObj?.clave,
            nombre: f.localidadObj?.descripcion
          },

          entidadFederativa: {
            clave: f.entidadFederativaObj?.clave,
            nombre: f.entidadFederativaObj?.descripcion
          },

          informacionExtra: "",
          codigoPostal: f.codigoPostal,
          descripcionColonia: f.colonia
        },

        idSolicitud: "",
      })),

      gridTerceros_TIPERS_DES:state.fabricanteTablaDatos.map(f => ({
        "idPersonaSolicitud": f.id,
        "ideTipoTercero": "TIPERS.FAB",
        personaMoral: f.tipoPersona === "Moral" ? "1" : "0",
        "booleanFisicaNoContribuyente": "0",
       
        denominacion:
          f.tipoPersona === "Moral"
            ? f.razonSocial
            : `${f.nombres} ${f.primerApellido} ${f.segundoApellido}`,

        razonSocial: f.razonSocial,
        rfc: f.rfc,
        curp: f.curp,

        nombre: f.nombres,
        apellidoPaterno: f.primerApellido,
        apellidoMaterno: f.segundoApellido,
          telefono: f.telefono,
        correoElectronico: f.correoElectronico,
        actividadProductiva: "",
        actividadProductivaDesc: "",
        descripcionGiro: "",
        numeroRegistro: "",
       
        domicilio: {
          calle: "",
          numeroExterior: f.numeroExterior,
          numeroInterior: f.numeroInterior,

          pais: {
            clave: f.paisObj?.clave,
            nombre: f.paisObj?.descripcion
          },

          colonia: {
            clave: f.coloniaObj?.clave,
            nombre: f.coloniaObj?.descripcion
          },

          delegacionMunicipio: {
            clave: f.municipioAlcaldiaObj?.clave,
            nombre: f.municipioAlcaldiaObj?.descripcion
          },

          localidad: {
            clave: f.localidadObj?.clave,
            nombre: f.localidadObj?.descripcion
          },

          entidadFederativa: {
            clave: f.entidadFederativaObj?.clave,
            nombre: f.entidadFederativaObj?.descripcion
          },

          informacionExtra: "",
          codigoPostal: f.codigoPostal,
          descripcionColonia: f.colonia
        },
        
    })),
      

      pagoDeDerechos: {
        claveDeReferencia: state.pagoDerechos.claveReferencia,
        cadenaPagoDependencia: state.pagoDerechos.cadenaDependencia,

        banco: {
          clave: state.pagoDerechos.bancoObject?.clave,
          descripcion: state.pagoDerechos.bancoObject?.descripcion
        },

        llaveDePago: state.pagoDerechos.llavePago,
        fecPago: state.pagoDerechos.fechaPago,
        impPago: state.pagoDerechos.importePago
      }

    };
  }
}