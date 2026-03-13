/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */
import { Tramite260704State, Tramite260704Store } from '../estados copy/stores/tramite260704Store.store';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class GuardarAdapter_260704 {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  static toFormPayload(state: Tramite260704State): unknown {
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
          discriminatorValue: 260704,
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

      datosSCIAN: state.scianConfigDatos.map((item: any) => ({
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

      gridTerceros_TIPERS_DES:state.fabricanteTablaDatos.map((f: any) => ({
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
      /**
       * Convenience method: map the API response and patch it directly into the provided store.
       * If the `store` argument is omitted, the method simply returns the mapped partial state.
       *
       * @param response API response
       * @param store Optional Tramite260202Store instance to apply the patch
       * @returns Partial<Tramite260903State> (and patches the store when provided)
       */
      static patchToStore(response: any, store?: Tramite260704Store): Partial<Tramite260704State> {
        const PARTIAL = GuardarAdapter_260704.fromApiResponse(response);
        if (store && PARTIAL) {
          if (PARTIAL.idSolicitud !== undefined) {store.setIdSolicitud(PARTIAL.idSolicitud);}
          if (PARTIAL.datosSolicitudFormState) {store.updateDatosSolicitudFormState(PARTIAL.datosSolicitudFormState);}
          if (PARTIAL.scianConfigDatos) {store.updateScianConfigDatos(PARTIAL.scianConfigDatos);}
          if (PARTIAL.tablaMercanciasConfigDatos) {store.updateTablaMercanciasConfigDatos(PARTIAL.tablaMercanciasConfigDatos);}
          if (PARTIAL.pagoDerechos) {store.updatePagoDerechos(PARTIAL.pagoDerechos);}
          if (PARTIAL.fabricanteTablaDatos) {store.updateFabricanteTablaDatos(PARTIAL.fabricanteTablaDatos);}
          if (PARTIAL.destinatarioFinalTablaDatos) {store.updateDestinatarioFinalTablaDatos(PARTIAL.destinatarioFinalTablaDatos);}
        }
        return PARTIAL;
      }
      /**
           * Map an API response (form payload) back into a partial Tramite260202State.
           * This is a best-effort reverse mapping of `toFormPayload` and will only
           * populate commonly used fields. Unknown or complex nested fields are left
           * untouched so callers can merge them as needed.
           *
           * @param response API response object matching the form payload shape
           * @returns Partial<Tramite260202State>
           */
          // eslint-disable-next-line complexity
          static fromApiResponse(response: unknown): Partial<Tramite260704State> {
            if (!response || typeof response !== 'object') {return {};}
            const RESP = response as any;
            const DATOS = RESP.datos ? RESP.datos : RESP;

            // datosSolicitudFormState mapping (with all defaults)
            const ESTABLECIMIENTO = DATOS.establecimiento || {};
            const SOLICITUD = DATOS.solicitud || {};
            const REPRESENTANTE_LEGAL = DATOS.representanteLegal || {};
            const DOMICILIO = ESTABLECIMIENTO.domicilio || {};
            const DATOS_SOLICITUD_FORM_STATE: any = {
              immex: '',
              ano: '',
              tipoOperacion: '',
              justification: '',
              rfcSanitario: ESTABLECIMIENTO.rfcResponsableSanitario || '',
              denominacionRazon: ESTABLECIMIENTO.razonSocial || '',
              correoElectronico: ESTABLECIMIENTO.correoElectronico || '',
              codigoPostal: DOMICILIO.codigoPostal || '',
              estado: DOMICILIO.entidadFederativa?.clave || '',
              municipioAlcaldia: DOMICILIO.descripcionMunicipio || '',
              localidad: DOMICILIO.informacionExtra || '',
              colonia: DOMICILIO.descripcionColonia || '',
              calle: DOMICILIO.calle || '',
              lada: DOMICILIO.lada || '',
              telefono: DOMICILIO.telefono || '',
              aviso: ESTABLECIMIENTO.avisoFuncionamiento ? 'true' : '',
              licenciaSanitaria: ESTABLECIMIENTO.numeroLicencia || '',
              regimen: SOLICITUD.regimen || '',
              adunasDeEntradas: ESTABLECIMIENTO.aduanas || '',
              aeropuerto: false,
              publico: 'si',
              representanteRfc: REPRESENTANTE_LEGAL.rfc || '',
              representanteNombre: REPRESENTANTE_LEGAL.nombre || '',
              apellidoPaterno: REPRESENTANTE_LEGAL.apellidoPaterno || '',
              apellidoMaterno: REPRESENTANTE_LEGAL.apellidoMaterno || '',
              marca: '',
              especifique: '',
              claveDeLos: '',
              fechaDeFabricacio: '',
              fechaDeCaducidad: '',
              manifiestosCasillaDeVerificacion: false,
            };

            // SCIAN
            const SCIAN_CONFIG_DATOS = Array.isArray(DATOS.datosSCIAN) ? DATOS.datosSCIAN.map((item: any) => ({
              clave: item.cveScian || '',
              descripcion: item.descripcion || '',
              selected: Boolean(item.selected),
            })) : [];

            // Mercancias
            // eslint-disable-next-line complexity
            const TABLA_MERCANCIAS_CONFIG_DATOS = Array.isArray(DATOS.mercancias) ? DATOS.mercancias.map((m: any) => ({
              id: m.idMercancia || '',
              claveClasificacionProductoObj: { clave: m.idClasificacionProducto || '', descripcion: m.nombreClasificacionProducto || '' },
              especificarClasificacionObj: { clave: m.ideSubClasificacionProducto || '', descripcion: m.nombreSubClasificacionProducto || '' },
              denominacionEspecificaProducto: m.descDenominacionEspecifica || '',
              denominacionDistintiva: m.descDenominacionDistintiva || '',
              descripcionMercancia: m.descripcionMercancia || '',
              especifiqueForma: m.formaFarmaceuticaDescripcionOtros || '',
              especifiqueEstado: m.estadoFisicoDescripcionOtros || '',
              fraccionArancelaria: m.fraccionArancelaria?.clave || '',
              descripcionFraccion: m.fraccionArancelaria?.descripcion || '',
              cantidadUMCObj: { descripcion: m.unidadMedidaComercial?.descripcion || '' },
              cantidadUmcValor: m.cantidadUMCConComas || '',
              cantidadUmtValor: m.cantidadUMTConComas || '',
              presentacion: m.presentacion || '',
              numeroRegistroSanitario: m.registroSanitarioConComas || '',
              paisDeOriginDatos: m.nombreCortoPaisOrigen ? [m.nombreCortoPaisOrigen] : [],
              paisDeProcedenciaDatos: m.nombreCortoPaisProcedencia ? [m.nombreCortoPaisProcedencia] : [],
              especifique: m.tipoProductoDescripcionOtros || '',
              usoEspecifico: m.nombreCortoUsoEspecifico ? [m.nombreCortoUsoEspecifico] : [],
              fechaCaducidad: m.fechaCaducidadStr || '',
            })) : [];

            // Pago de derechos
           const PAGO_DERECHOS = DATOS.pagoDeDerechos ? {
  claveReferencia: DATOS.pagoDeDerechos.claveDeReferencia || '',
  cadenaDependencia: DATOS.pagoDeDerechos.cadenaPagoDependencia || '',
  estado: '',
  llavePago: DATOS.pagoDeDerechos.llaveDePago || '',
  fechaPago: DATOS.pagoDeDerechos.fecPago || '',
  importePago: DATOS.pagoDeDerechos.impPago || '',
  banco: DATOS.pagoDeDerechos.banco?.clave || '', // <-- add this line
  bancoObject: DATOS.pagoDeDerechos.banco ? {
    id: DATOS.pagoDeDerechos.banco.id ?? '',
    clave: DATOS.pagoDeDerechos.banco.clave || '',
    descripcion: DATOS.pagoDeDerechos.banco.descripcion || '',
  } : { id: '', clave: '', descripcion: '' },
} : { claveReferencia: '', cadenaDependencia: '', estado: '', llavePago: '', fechaPago: '', importePago: '', banco: '', bancoObject: { id: '', clave: '', descripcion: '' } };

            // Fabricantes y destinatarios (always arrays)
            const FABRICANTE_TABLA_DATOS = Array.isArray(DATOS.gridTerceros_TIPERS_FAB) ? DATOS.gridTerceros_TIPERS_FAB : [];
            const DESTINATARIO_FINAL_TABLA_DATOS = Array.isArray(DATOS.gridTerceros_TIPERS_DES) ? DATOS.gridTerceros_TIPERS_DES : [];

            // idSolicitud fallback to 0
            const ID_SOLICITUD = DATOS.solicitud?.id_solicitud || DATOS.id_solicitud || 0;

            return {
              idSolicitud: ID_SOLICITUD,
              datosSolicitudFormState: DATOS_SOLICITUD_FORM_STATE,
              scianConfigDatos: SCIAN_CONFIG_DATOS,
              tablaMercanciasConfigDatos: TABLA_MERCANCIAS_CONFIG_DATOS,
              pagoDerechos: PAGO_DERECHOS,
              fabricanteTablaDatos: FABRICANTE_TABLA_DATOS,
              destinatarioFinalTablaDatos: DESTINATARIO_FINAL_TABLA_DATOS,
            };
          }
}