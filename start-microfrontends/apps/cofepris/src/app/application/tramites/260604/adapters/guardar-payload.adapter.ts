/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 260604.
 */

import { Injectable } from '@angular/core';
import { Tramite260604State } from '../estados/tramite260604Store.store';
import {Tramite260604Store} from '../estados/tramite260604Store.store';

@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_260604
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 260604.
 */
export class GuardarAdapter_260604 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Tramite260604State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state: Tramite260604State): unknown {

    return {
      idSolicitud: state.idSolicitud || 0,

      /** -------------------------
       *  SECCIÓN: SOLICITANTE
       * --------------------------*/
      solicitante: {
        rfc: "AAL0409235E6",
        nombre: "ACEROS ALVARADO S.A. DE C.V.",
        actividadEconomica: "Fabricación de productos de hierro y acero",
        correoElectronico: "contacto@acerosalvarado.com",
        rol_capturista:"personaMoral",
        domicilio: {
          pais: "México",
          codigoPostal: "06700",
          estado: "Ciudad de México",
          municipioAlcaldia: "Cuauhtémoc",
          localidad: "Centro",
          colonia: "Roma Norte",
          calle: "Av. Insurgentes Sur",
          numeroExterior: "123",
          numeroInterior: "Piso 5, Oficina A",
          lada: "",
          telefono: "123456"
        },
        certificado_serial_number: "00001000000504465000"
      },

      /** -------------------------
       *  SECCIÓN: SOLICITUD
       * --------------------------*/
      solicitud: {
        discriminatorValue: 260604,
        declaracionesSeleccionadas: true,
        regimen: state.datosSolicitudFormState.regimen,
        aduanaAIFA: "",
        informacionConfidencial: state.datosSolicitudFormState.publico === 'Si'
      },

      /** -------------------------
       *  SECCIÓN: ESTABLECIMIENTO
       * --------------------------*/
      establecimiento: {
        rfcResponsableSanitario: state.datosSolicitudFormState.rfcSanitario,
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
        aduanas: state.datosSolicitudFormState.adunasDeEntradas
      },

      /** -------------------------
       *  SECCIÓN: DATOS SCIAN
       * --------------------------*/
      datosSCIAN: state.scianConfigDatos.map(datos => ({
        cveScian: datos.clave,
        descripcion: datos.descripcion,
        selected: true
      })),

      /** -------------------------
       *  SECCIÓN: MERCANCÍAS
       * --------------------------*/
      mercancias: (state.tablaMercanciasConfigDatos ?? []).map(mercancia => ({
        idMercancia: mercancia.id || null,
        idClasificacionProducto: mercancia.claveClasificacionProductoObj?.clave,
        nombreClasificacionProducto: mercancia.claveClasificacionProductoObj?.descripcion,
        ideSubClasificacionProducto: mercancia.especificarClasificacionObj?.clave,
        nombreSubClasificacionProducto: mercancia.especificarClasificacionObj?.descripcion,

        descDenominacionEspecifica: mercancia.denominacionComunInternacional,
        descDenominacionDistintiva: mercancia.marcaComercialODenominacionDistintiva,
        descripcionMercancia: mercancia.clasificacionProducto,

        idFormaFarmaceutica: mercancia.formaFarmaceutica,
        formaFarmaceuticaDescripcionOtros: mercancia.especifiqueForma,

        idEstadoFisico: mercancia.estadoFisicoObj?.clave,
        estadoFisicoDescripcionOtros: mercancia.especifiqueEstado,

        fraccionArancelaria: {
          clave: mercancia.fraccionArancelaria,
          descripcion: mercancia.descripcionFraccion
        },

        unidadMedidaComercial: {
          descripcion: mercancia.cantidadUMCObj?.descripcion,
          clave: mercancia.cantidadUMCObj?.clave
        },
        cantidadUMCConComas: mercancia.valorComercial,
        presentacion: mercancia.presentacion,
        nombreCortoPaisOrigen: [mercancia.paisDeOrigen],
        nombreCortoPaisProcedencia: [mercancia.paisProcedencia],
        nombreCortoUsoEspecifico: [mercancia.usoEspecifico?.toString()],

        idTipoProductoTipoTramite: mercancia.tipoProductoObj?.clave,
        tipoProductoDescripcionOtros: mercancia.especifique,

        fechaCaducidadStr: mercancia.fechaDeMovimiento
      })),

      /** -------------------------
       *  SECCIÓN: REPRESENTANTE LEGAL
       * --------------------------*/
      representanteLegal: {
        rfc: state.datosSolicitudFormState.representanteRfc,
        resultadoIDC: "",
        nombre: state.datosSolicitudFormState.representanteNombre,
        apellidoPaterno: state.datosSolicitudFormState.apellidoPaterno,
        apellidoMaterno: state.datosSolicitudFormState.apellidoMaterno
      },

      /** -------------------------
       *  SECCIÓN: TERCEROS FACTURADORES
       * --------------------------*/
      gridTerceros_TIPERS_FAC: state.facturadorTablaDatos.map(facturador => ({
        tipo_tercero: "TIPERS.FAB",
        ideTipoTercero: "",
        personaMoral: facturador.tipoPersona === "Moral" ? "1" : "0",
        denominacion: facturador.razonSocial,
        razonSocial: facturador.razonSocial,
        rfc: facturador.rfc,
        curp: facturador.curp,
        nombre: facturador.nombres,
        apellidoPaterno: facturador.primerApellido,
        apellidoMaterno: facturador.segundoApellido,
        telefono: facturador.telefono,
        correoElectronico: facturador.correoElectronico,
        numeroRegistro: "",

        domicilio: {
          pais: {
            clave: facturador.paisObj?.clave,
            nombre: facturador.paisObj?.descripcion
          },
          calle: facturador.calle,
          numeroExterior: facturador.numeroExterior,
          numeroInterior: facturador.numeroInterior,
          colonia: facturador.colonia,
          codigo_postal: facturador.codigoPostal,
          localidad: facturador.localidad,
          municipio: facturador.municipioAlcaldia,
          informacionExtra: "",
          codigoPostal: facturador.codigoPostal,
          descripcionColonia: facturador.colonia
        },

        idSolicitud: state.idSolicitud || 0
      }))
    };
  }
   /**
     * Maps API facturador data to internal facturador format
     */
   private static mapFacturadoresData(grid?: any[]): any[] {
    // eslint-disable-next-line complexity
    return (grid ?? []).map((p: any) => ({
        nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
        tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
        id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
        nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
        rfc: p.rfc ?? '',
        curp: p.curp ?? '',
        telefono: p.telefono ?? '',
        correoElectronico: p.correoElectronico ?? '',
        calle: p.domicilio?.calle ?? '',
        numeroExterior: p.domicilio?.numeroExterior ?? '',
        numeroInterior: p.domicilio?.numeroInterior ?? '',
        pais: p.domicilio?.pais?.nombre ?? '',
        colonia: p.domicilio?.descripcionColonia ?? '',
        municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
        localidad: p.domicilio?.localidad?.nombre ?? '',
        entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
        estadoLocalidad: p.domicilio?.localidad?.nombre ?? '',
        codigoPostal: p.domicilio?.codigoPostal ?? '',
        coloniaEquivalente: p.domicilio?.descripcionColonia ?? '',
        nombres: p.nombre ?? '',
        primerApellido: p.apellidoPaterno ?? '',
        segundoApellido: p.apellidoMaterno ?? '',
        razonSocial: p.razonSocial ?? '',
        lada: p.domicilio?.lada ?? ''
    }));
}

  /**
       * Map an API response (form payload) back into a partial Tramite260604State.
       * This is a best-effort reverse mapping of `toFormPayload` and will only
       * populate commonly used fields. Unknown or complex nested fields are left
       * untouched so callers can merge them as needed.
       *
       * @param response API response object matching the form payload shape
       * @returns Partial<Tramite260604State>
       */
      // eslint-disable-next-line complexity
      static fromApiResponse(response: unknown): Partial<Tramite260604State> {
          if (!response || typeof response !== 'object') {
              return {};
          }
          const RESP = response as any;
          const DATOS_SOLICITUD_FORM_STATE = {
              idSolicitud: RESP.idSolicitud ?? 0,
              denominacionRazon: RESP.establecimiento?.razonSocial ?? '',
              rfcSanitario: RESP.establecimiento?.rfcResponsableSanitario ?? '',
              correoElectronico: RESP.establecimiento?.correoElectronico ?? '',
              codigoPostal: RESP.establecimiento?.domicilio?.codigoPostal ?? '',
              municipioAlcaldia: RESP.establecimiento?.domicilio?.descripcionMunicipio ?? '',
              localidad: RESP.establecimiento?.domicilio?.informacionExtra ?? '',
              colonia: RESP.establecimiento?.domicilio?.descripcionColonia ?? '',
              calle: RESP.establecimiento?.domicilio?.calle ?? '',
              lada: RESP.establecimiento?.domicilio?.lada ?? '',
              telefono: RESP.establecimiento?.domicilio?.telefono ?? '',
              aviso: RESP.establecimiento?.avisoFuncionamiento ?? '',
              licenciaSanitaria: RESP.establecimiento?.numeroLicencia ?? '',
              adunasDeEntradas: RESP.establecimiento?.aduanas ?? '',
              regimen: RESP.solicitud?.regimen ?? '',
              publico: RESP.solicitud?.informacionConfidencial === true ? 'Si' : 'No',
              representanteRfc: RESP.representanteLegal?.rfc ?? '',
              representanteNombre: RESP.representanteLegal?.nombre ?? '',
              apellidoPaterno: RESP.representanteLegal?.apellidoPaterno ?? '',
              apellidoMaterno: RESP.representanteLegal?.apellidoMaterno ?? '',
              estado: RESP.establecimiento?.domicilio.entidadFederativa?.clave ?? '',
              aeropuerto: false,
              manifesto: RESP.solicitud?.declaracionesSeleccionadas ?? [],
          };
  
          const PARTIAL: Partial<Tramite260604State> = {
              datosSolicitudFormState: DATOS_SOLICITUD_FORM_STATE as any,
              scianConfigDatos: this.mapScianData(RESP.datosSCIAN) as any,
              tablaMercanciasConfigDatos: this.mapMercanciasData(RESP.mercancias) as any,
              facturadorTablaDatos: this.mapFacturadoresData(RESP.gridTerceros_TIPERS_FAC) as any,
               };
  
          return PARTIAL;
      }

      private static mapMercanciasData(arr?: any[]): any[] {
        // eslint-disable-next-line complexity
        return (arr ?? []).map((m: any) => ({
            claveClasificacionProductoObj: { 
                clave: m.idClasificacionProducto ?? '',
                descripcion: m.nombreClasificacionProducto ?? ''
            },
            especificarClasificacionObj: { 
                clave: m.ideSubClasificacionProducto ?? '',
                descripcion: m.nombreSubClasificacionProducto ?? ''
            },
            denominacionEspecificaProducto: m.descDenominacionEspecifica ?? '',
            denominacionComun: m.descripcionMercancia ?? '',
            denominacionDistintiva: m.descDenominacionDistintiva ?? '',
            formaFarmaceutica: m.formaFarmaceuticaDescripcionOtros ?? '',
            estadoFisico: m.estadoFisicoDescripcionOtros ?? '',
            fraccionArancelaria: m.fraccionArancelaria?.clave ?? '',
            descripcionFraccion: m.fraccionArancelaria?.descripcion ?? '',
           // cantidadUMC: m.cantidadUMCConComas ?? '',
            cantidadUMT: m.unidadMedidaTarifa?.descripcion ?? '',
            presentacion: m.presentacion ?? '',
            numeroRegistroSanitario: m.registroSanitarioConComas ?? '',
            paisDeOriginDatos: m.nombreCortoPaisOrigen ?? '',
            paisDeProcedenciaDatos: m.nombreCortoPaisProcedencia ?? '',
            tipoProducto: m.tipoProductoDescripcionOtros ?? '',
            usoEspecifico: m.nombreCortoUsoEspecifico ?? '',
            fechaCaducidad: m.fechaCaducidadStr ?? '',
            clasificacionProducto: m.nombreClasificacionProducto ?? '',
            especificarClasificacionProducto: m.nombreSubClasificacionProducto ?? '',
            unidadMedidaComercializacion: m.unidadMedidaComercial?.descripcion ?? '',
            unidadMedidaTarifa: m.unidadMedidaTarifa?.descripcion ?? '',
            paisOrigen: m.nombreCortoPaisOrigen ?? "",
            paisProcedencia: m.nombreCortoPaisProcedencia ?? "",
            id: m.idMercancia || null,
            paisOrigenDatosClave: m.nombreCortoPaisOrigen ?? "",
            paisProcedenciaDatosClave: m.nombreCortoPaisProcedencia ?? "",
            usoEspecificoDatosClave: m.nombreCortoUsoEspecifico ?? "",
            cantidadUmcValor: m.cantidadUMCConComas ?? '',
            cantidadUMC: m.unidadMedidaComercial?.descripcion ?? '',
            cantidadUmtValor: m.cantidadUMTConComas ?? '',
        }));
    }

      private static mapScianData(arr?: any[]): any[] {
        return (arr ?? []).map((d: any) => ({ 
            clave: d.cveScian ?? d.clave ?? '', 
            descripcion: d.descripcion ?? '' 
        }));
    }

   /**
       * Convenience method: map the API response and patch it directly into the provided store.
       * If the `store` argument is omitted, the method simply returns the mapped partial state.
       *
       * @param response API response
       * @param store Optional Tramite260604Store instance to apply the patch
       * @returns Partial<Tramite260604State> (and patches the store when provided)
       */
      static patchToStore(response: any, store?: Tramite260604Store): Partial<Tramite260604State> {
          const PARTIAL = GuardarAdapter_260604.fromApiResponse(response);
          if (store) {
              // Akita's update accepts a partial or updater function
              store.update((state) => ({ ...state, ...PARTIAL }));
          }
          return PARTIAL;
      }
}