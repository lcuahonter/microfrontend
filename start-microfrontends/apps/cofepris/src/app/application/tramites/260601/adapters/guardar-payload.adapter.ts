/**
 * @fileoverview
 * Servicio adaptador que transforma el estado interno (Akita)
 * al formato requerido por la API para el trámite 260601.
 */

import { AvisoSanitarioState } from '../../../estados/tramites/tramite260601.store';
import { Injectable } from '@angular/core';
import { Tramite260601Store } from '../../../estados/tramites/tramite260601.store';
import { TablaMercanciasDatos } from '../../../shared/models/shared2606/datos-solicitud.model';

@Injectable({
  providedIn: 'root'
})
/**
 * @class GuardarAdapter_260601
 * @description
 * Adaptador encargado de convertir el estado almacenado en Akita
 * hacia el payload final esperado por el backend para guardar información
 * del trámite 260601.
 */
export class GuardarAdapter_260601 {

  /**
   * Convierte el estado Akita al payload final requerido por la API.
   *
   * @method toFormPayload
   * @static
   * @param {Tramite260601State} state - Estado actual del trámite.
   * @returns {unknown} Payload completo formateado para enviar al backend.
   */
  static toFormPayload(state: AvisoSanitarioState): unknown {

    console.log('Adaptador ', state);

    return {

      /** -------------------------
       *  SECCIÓN: SOLICITANTE
       * --------------------------*/
      solicitante: {
        rfc: "AAL0409235E6",
        nombre: "ACEROS ALVARADO S.A. DE C.V.",
        actividadEconomica: "Fabricación de productos de hierro y acero",
        correoElectronico: "contacto@acerosalvarado.com",
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
          telefono: "123456",
          rol_capturista: "PersonaMoral"
        },
        certificado_serial_number: "00001000000504465000"
      },

      /** -------------------------
       *  SECCIÓN: SOLICITUD
       * --------------------------*/
      solicitud: {
        discriminatorValue: 260601,
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
        aduanas:  [
            "010"
        ], },

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
        ideSubClasificacionProducto: mercancia.especificarClasificacionObj?.clave,

        descDenominacionEspecifica: mercancia.denominacionComunInternacional,
        descDenominacionDistintiva: mercancia.marcaComercialODenominacionDistintiva,
        descripcioModelo: mercancia.modelo,
        descripcionProducto: mercancia.descripcionDelProducto,
        descripcionMercancia: mercancia.clasificacionProducto,

        clavesPaisesDestino: mercancia.paisDestino?.toString(),

        fraccionArancelaria: {
          clave: mercancia.fraccionArancelaria,
          descripcion: mercancia.descripcionFraccion
        },

        unidadMedidaComercial: {
          descripcion: mercancia.cantidadUMCObj?.descripcion
        },
        cantidadUMCConComas: mercancia.valorComercial,
        presentacion: mercancia.presentacion,
        nombreCortoPaisOrigen: mercancia.paisOriginDatosClave,
        nombreCortoPaisProcedencia: mercancia.paisProcedenciaDatosClave,
        nombreCortoUsoEspecifico: Array.isArray(mercancia.usoEspecificoDatosClave) 
        ? mercancia.usoEspecificoDatosClave.join(',') 
        : mercancia.usoEspecificoDatosClave,
        idTipoProductoTipoTramite: mercancia.tipoProductoObj?.clave,
        tipoProductoDescripcionOtros: mercancia.especifique,
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
      gridTerceros_TIPERS_FAB: state.fabricanteTablaDatos.map((fabricante) => {
        return {
              idPersonaSolicitud: "",
              ideTipoTercero: "",
              personaMoral: fabricante.tipoPersona === "Moral" ? "1" : "0",
              booleanExtranjero: fabricante.nacionalidad === 'Extranjero' ? "1" : "0",
              booleanFisicaNoContribuyente: "0",
              denominacion: fabricante.razonSocial,
              razonSocial: fabricante.razonSocial,
              rfc: fabricante.rfc,
              curp: fabricante.curp,
              nombre: fabricante.nombres,
              apellidoPaterno: fabricante.primerApellido,
              apellidoMaterno: fabricante.segundoApellido,
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
                    clave: fabricante.paisObj?.clave,
                    nombre: fabricante.paisObj?.descripcion
                  },
                  colonia: {
                      clave: "",
                      nombre: fabricante.colonia
                  },
                  delegacionMunicipio: {
                      clave: "",
                      nombre: fabricante.municipioAlcaldia
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
              idSolicitud: state.idSolicitud || 0
          }
      }),
      gridTerceros_TIPERS_PVD: state.proveedorTablaDatos.map((proveedor) => {
        return {
            idPersonaSolicitud: "",
            ideTipoTercero: "",
            personaMoral: proveedor.tipoPersona === "Moral" ? "1" : "0",
            booleanExtranjero: "",
            booleanFisicaNoContribuyente: "",
            denominacion: proveedor.razonSocial,
            razonSocial: proveedor.razonSocial,
            rfc: proveedor.rfc,
            curp: proveedor.curp,
            nombre: proveedor.nombres,
            apellidoPaterno: proveedor.primerApellido,
            apellidoMaterno: proveedor.segundoApellido,
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
                  clave: proveedor.paisObj?.clave,
                  nombre: proveedor.paisObj?.descripcion
                },
                colonia: {
                    clave: "",
                    nombre: proveedor.colonia
                },
                delegacionMunicipio: {
                    clave: "",
                    nombre: proveedor.municipioAlcaldia
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
            idSolicitud: state.idSolicitud || 0
          }
      }),
      idSolicitud: state.idSolicitud || 0
    };
  }/**
         * Convenience method: map the API response and patch it directly into the provided store.
         * If the `store` argument is omitted, the method simply returns the mapped partial state.
         *
         * @param response API response
         * @param store Optional Tramite260604Store instance to apply the patch
         * @returns Partial<Tramite260604State> (and patches the store when provided)
         */
        static patchToStore(response: any, store?: Tramite260601Store): Partial<AvisoSanitarioState> {
            const PARTIAL = GuardarAdapter_260601.fromApiResponse(response);
            if (store) {
                // Akita's update accepts a partial or updater function
                store.update((state) => ({ ...state, ...PARTIAL }));
            }
            return PARTIAL;
        }

        private static mapScianData(arr?: any[]): any[] {
          return (arr ?? []).map((d: any) => ({ 
              clave: d.cveScian ?? d.clave ?? '', 
              descripcion: d.descripcion ?? '' 
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
      static fromApiResponse(response: unknown): Partial<AvisoSanitarioState> {
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
  
          const PARTIAL: Partial<AvisoSanitarioState> = {
              datosSolicitudFormState: DATOS_SOLICITUD_FORM_STATE as any,
              scianConfigDatos: this.mapScianData(RESP.datosSCIAN) as any,
              tablaMercanciasConfigDatos: this.mapMercanciasData(RESP.mercancias) as any,
              proveedorTablaDatos: this.mapFacturadoresData(RESP.gridTerceros_TIPERS_PVD) as any,
              fabricanteTablaDatos: this.mapFacturadoresData(RESP.gridTerceros_TIPERS_FAB) as any,
               };
  
          return PARTIAL;
      }

      private static mapMercanciasData(arr?: any[]): any {
        // eslint-disable-next-line complexity
        return (arr ?? []).map((m: any) => ({
          denominacionEspecificaProducto: m.descDenominacionEspecifica ?? '',
          clasificacionProducto: m.idClasificacionProducto  ?? '',
          paisDestino: m.clavesPaisesDestino ?? '',
          paisDeOrigen: m.nombreCortoPaisOrigen?.join(', ') ?? '',
          claveClasificacionProductoObj: {
            clave: m.idClasificacionProducto ?? '',
            descripcion: m.nombreClasificacionProducto ?? ''
          },
          especificarClasificacionObj: {
            clave: m.ideSubClasificacionProducto ?? '',
            descripcion: m.nombreSubClasificacionProducto ?? ''
          },
          tipoProductoObj: {
            clave: m.tipoProductoDescripcionOtro ?? '',
            descripcion: m.tipoProductoDescripcionOtros ?? ''
          },
          formaFarmaceuticaObj: {
            descripcion: m.formaFarmaceuticaDescripcionOtros ?? ''
          },
          estadoFisicoObj: {
            descripcion: m.estadoFisicoDescripcionOtros ?? ''
          },
          cantidadUMCObj: {
            descripcion: m.unidadMedidaComercial?.descripcion ?? ''
          },
          especificarClasificacionProducto: m.nombreSubClasificacionProducto ?? '',
          denominacionComunInternacional: m.descripcionMercancia ?? '',
          PorcentajeDeConcentracion: m.porcentajeConcentracion ?? '',
          valorComercial: m.valorComercial ?? '',
          marcaComercialODenominacionDistintiva: m.descDenominacionDistintiva ?? '',
          denominacionDistintiva: m.descDenominacionDistintiva ?? '',
          denominacionComun: m.descripcionMercancia ?? '',
          formaFarmaceutica: m.formaFarmaceuticaDescripcionOtros ?? '',
          estadoFisico: m.estadoFisicoDescripcionOtros ?? '',
          fraccionArancelaria: m.fraccionArancelaria?.clave ?? '',
          descripcionFraccion: m.fraccionArancelaria?.descripcion ?? '',
          unidadMedidaComercializacion: m.unidadMedidaComercial?.descripcion ?? '',
          cantidadUMC: m.cantidadUMCConComas ?? '',
          cantidadUmcValor: m.cantidadUMCConComas ?? '',
          unidadMedidaTarifa: m.unidadMedidaTarifa?.descripcion ?? '',
          cantidadUMT: m.unidadMedidaTarifa?.descripcion ?? '',
          cantidadUmtValor: m.cantidadUMTConComas ?? '',
          presentacion: m.presentacion ?? '',
          numeroRegistroSanitario: m.registroSanitarioConComas ?? '',
          paisOrigen: m.nombreCortoPaisOrigen?.join(', ') ?? '',
          paisProcedencia: m.nombreCortoPaisProcedencia?.join(', ') ?? '',
          tipoProducto: m.tipoProductoDescripcionOtros ?? '',
          usoEspecifico: m.nombreCortoUsoEspecifico?.join(', ') ?? '',
          detallarUsoEspecifico: m.detallarUsoEspecifico ?? '',
          numeroDePiezasAFabricar: m.numeroDePiezasAFabricar ?? '',
          descripcionNumeroDePiezas: m.descripcionNumeroDePiezas ?? '',
          numeroCAS: m.numeroCAS ?? '',
          cantidadDeLotes: m.cantidadDeLotes ?? '',
          kgPorLote: m.kgPorLote ?? '',
          paisDeDestino: m.clavesPaisesDestino ?? '',
          denominacionCumonInternacional: m.denominacionCumonInternacional ?? '',
          caducidad: m.fechaCaducidadStr ?? '',
          marcaComercialDenominacion: m.marcaComercialDenominacion ?? '',
          especifique: m.especifique ?? '',
          especifiqueForma: m.especifiqueForma ?? '',
          especifiqueEstado: m.especifiqueEstado ?? '',
          especifiqueObligatorio: m.especifiqueObligatorio ?? '',
          fechaDeMovimiento: m.fechaDeMovimiento ?? '',
          paisDeOriginDatos: m.nombreCortoPaisOrigen ?? [],
          paisDeProcedenciaDatos: m.nombreCortoPaisProcedencia ?? [],
          id: m.idMercancia || null,
          modelo: m.descripcioModelo ?? '',
          descripcionDelProducto: m.descripcionProducto ?? '',
          usoEspecificoDatosClave: m.nombreCortoUsoEspecifico ?? [],
          paisProcedenciaDatosClave: m.nombreCortoPaisProcedencia ?? [],
          paisOriginDatosClave: m.nombreCortoPaisOrigen ?? []
        }));
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

}


