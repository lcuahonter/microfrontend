/**
 * @fileoverview
 * Este archivo contiene el servicio adaptador para convertir entre el estado de Akita y los formatos de payload de API
 * para el trámite de ampliación de servicios 80205.
 */

import { Injectable } from '@angular/core';
import { Tramite260218State,Tramite260218Store } from '../estados/tramite260218Store.store';


@Injectable({
  providedIn: 'root'
})
export class GuardarMappingAdapter {
  /**
   * Convierte del estado de Akita al formato de payload de API usando las mismas claves
   * @param state El estado actual de Akita
   * @returns Payload formateado para la API
   */
  
  static toFormPayload(state: Tramite260218State): unknown {
    return {
    "idSolicitud":"0",
      "solicitante": {
        "rfc": "AAL0409235E6",
        "nombre": "ACEROS ALVARADO S.A. DE C.V.",
        "actividadEconomica": "Fabricación de productos de hierro y acero",
        "correoElectronico": "contacto@acerosalvarado.com",
        "rol_capturista" : "PersonaMoral",
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
          "discriminatorValue": 260218,
          "declaracionesSeleccionadas": state.datosSolicitudFormState.manifesto,
          "regimen": state.datosSolicitudFormState.regimen,
          "aduanaAIFA": "",
          "informacionConfidencial": state.datosSolicitudFormState.publico === 'Si' ? true : false
      },
      "establecimiento": {
          "rfcResponsableSanitario": state.datosSolicitudFormState.rfcSanitario,
          "razonSocial": state.datosSolicitudFormState.denominacionRazon,
          "correoElectronico": state.datosSolicitudFormState.correoElectronico,
          "domicilio": {
              "codigoPostal": state.datosSolicitudFormState.codigoPostal,
              "entidadFederativa": {
                  "clave": state.datosSolicitudFormState.estado,
              },
              "descripcionMunicipio": state.datosSolicitudFormState.municipioAlcaldia,
              "informacionExtra": state.datosSolicitudFormState.localidad,
              "descripcionColonia": state.datosSolicitudFormState.colonia,
              "calle": state.datosSolicitudFormState.calle,
              "lada": state.datosSolicitudFormState.lada,
              "telefono": state.datosSolicitudFormState.telefono
          },
          "original": "",
          "avisoFuncionamiento": state.datosSolicitudFormState.aviso,
          "numeroLicencia": state.datosSolicitudFormState.licenciaSanitaria,
          "aduanas": state.datosSolicitudFormState.adunasDeEntradas
      },
      "datosSCIAN": state.scianConfigDatos.map((datos)=>{
        return {
              "cveScian": datos.clave,
              "descripcion": datos.descripcion,
              "selected": true
          }
      }),
      "mercancias": (state.tablaMercanciasConfigDatos ?? []).map((mercancia) => {
        return {
              "idMercancia": mercancia.id?.toString() ?? null,
              "idClasificacionProducto": mercancia.claveClasificacionProductoObj?.clave,
              "nombreClasificacionProducto": mercancia.claveClasificacionProductoObj?.descripcion,
              "ideSubClasificacionProducto": mercancia.especificarClasificacionObj?.clave,
              "nombreSubClasificacionProducto": mercancia.especificarClasificacionObj?.descripcion,
              "descDenominacionEspecifica": mercancia.denominacionEspecificaProducto,
              "descDenominacionDistintiva": mercancia.denominacionDistintiva,
              "descripcionMercancia": mercancia.denominacionComun,
              "formaFarmaceuticaDescripcionOtros": mercancia.formaFarmaceutica,
              "estadoFisicoDescripcionOtros": mercancia.estadoFisico,
              "fraccionArancelaria": {
                  "clave": mercancia.fraccionArancelaria,
                  "descripcion": mercancia.descripcionFraccion
              },
              "unidadMedidaComercial": {
                descripcion: mercancia.cantidadUMC
            },
            "cantidadUMCConComas": mercancia.cantidadUmcValor,
            "unidadMedidaTarifa": {
                descripcion: mercancia.cantidadUMT
            },
            "cantidadUMTConComas": mercancia.cantidadUmtValor,
              "presentacion": mercancia.presentacion,
              "registroSanitarioConComas": mercancia.numeroRegistroSanitario,
              "nombreCortoPaisOrigen": mercancia.paisOrigenDatosClave,
              "nombreCortoPaisProcedencia": mercancia.paisProcedenciaDatosClave,
              "tipoProductoDescripcionOtros": mercancia.tipoProducto,
              "nombreCortoUsoEspecifico": mercancia.usoEspecificoDatosClave,
              "fechaCaducidadStr": mercancia.fechaCaducidad
          }
      }),
      "representanteLegal": {
          "rfc": state.datosSolicitudFormState.representanteRfc,
          "resultadoIDC": "",
          "nombre": state.datosSolicitudFormState.representanteNombre,
          "apellidoPaterno": state.datosSolicitudFormState.apellidoPaterno,
          "apellidoMaterno": state.datosSolicitudFormState.apellidoMaterno
      },
      "gridTerceros_TIPERS_FAB": state.fabricanteTablaDatos.map((fabricante) => {
        return {
              "idPersonaSolicitud": "",
              "ideTipoTercero": "",
              "personaMoral": fabricante.tipoPersona === "Moral" ? "1" : "0",
              "booleanExtranjero": fabricante.nacionalidad === 'Extranjero' ? "1" : "0",
              "booleanFisicaNoContribuyente": "0",
              "denominacion": fabricante.tipoPersona === "Moral" ? fabricante.razonSocial : `${fabricante.nombres} ${fabricante.primerApellido} ${fabricante.segundoApellido}`,
              "razonSocial": fabricante.razonSocial,
              "rfc": fabricante.rfc,
              "curp": fabricante.curp,
              "nombre": fabricante.nombres,
              "apellidoPaterno": fabricante.primerApellido,
              "apellidoMaterno": fabricante.segundoApellido,
              "telefono": fabricante.telefono,
              "correoElectronico": fabricante.correoElectronico,
              "actividadProductiva": "",
              "actividadProductivaDesc": "",
              "descripcionGiro": "",
              "numeroRegistro": "",
              "domicilio": {
                  "calle": fabricante.calle,
                  "numeroExterior": fabricante.numeroExterior,
                  "numeroInterior": fabricante.numeroInterior,
                  "pais": {
                      "clave": fabricante.paisObj?.clave,
                      "nombre": fabricante.paisObj?.descripcion
                  },
                  "colonia": {
                      "clave": fabricante.coloniaObj?.clave,
                      "nombre": fabricante.coloniaObj?.descripcion
                  },
                  "delegacionMunicipio": {
                      "clave": fabricante.municipioAlcaldiaObj?.clave,
                      "nombre": fabricante.municipioAlcaldiaObj?.descripcion
                  },
                  "localidad": {
                      "clave": fabricante.localidadObj?.clave,
                      "nombre": fabricante.localidadObj?.descripcion
                  },
                  "entidadFederativa": {
                      "clave": fabricante.entidadFederativaObj?.clave,
                      "nombre": fabricante.entidadFederativaObj?.descripcion
                  },
                  "informacionExtra": "",
                  "codigoPostal": fabricante.codigoPostal,
                  "descripcionColonia": fabricante.colonia
              },
              "idSolicitud": "0"
          }
      }),
      "gridTerceros_TIPERS_DES": state.destinatarioFinalTablaDatos.map((destinatario) => {
        return {
            "idPersonaSolicitud": "",
            "ideTipoTercero": "TIPERS.FAB",
            "personaMoral": destinatario.tipoPersona === "Moral" ? "1" : "0",
            "booleanExtranjero": "",
            "booleanFisicaNoContribuyente": "0",
            "denominacion": "LABORATORIOS PISA S.A. DE C.V.",
            "razonSocial": destinatario.razonSocial,
            "rfc": destinatario.rfc,
            "curp": destinatario.curp,
            "nombre": destinatario.nombres,
            "apellidoPaterno": destinatario.primerApellido,
            "apellidoMaterno": destinatario.segundoApellido,
            "telefono": destinatario.telefono,
            "correoElectronico": destinatario.correoElectronico,
            "actividadProductiva": "",
            "actividadProductivaDesc": "",
            "descripcionGiro": "",
            "numeroRegistro": "",
            "domicilio": {
                "calle": destinatario.calle,
                "numeroExterior": destinatario.numeroExterior,
                "numeroInterior": destinatario.numeroInterior,
                "pais": {
                    "clave": destinatario.paisObj?.clave,
                    "nombre": destinatario.paisObj?.descripcion
                },
                "colonia": {
                    "clave": destinatario.coloniaObj?.clave,
                    "nombre": destinatario.coloniaObj?.descripcion
                },
                "delegacionMunicipio": {
                    "clave": destinatario.municipioObj?.clave,
                    "nombre": destinatario.municipioObj?.descripcion
                },
                "localidad": {
                    "clave": destinatario.localidadObj?.clave,
                    "nombre": destinatario.localidadObj?.descripcion
                },
                "entidadFederativa": {
                    "clave": "",
                    "nombre": ""
                },
                "informacionExtra": "",
                "codigoPostal": destinatario.codigoPostal,
                "descripcionColonia": destinatario.colonia
            },
            "idSolicitud": "0"
          }
      }),
      "gridTerceros_TIPERS_PVD": state.proveedorTablaDatos.map((proveedor) => {
        return {
            "idPersonaSolicitud": "",
            "ideTipoTercero": "",
            "personaMoral": proveedor.tipoPersona === "Moral" ? "1" : "0",
            "booleanExtranjero": "",
            "booleanFisicaNoContribuyente": "",
            "denominacion": proveedor.razonSocial,
            "razonSocial": proveedor.razonSocial,
            "rfc": proveedor.rfc,
            "curp": proveedor.curp,
            "nombre": proveedor.nombres,
            "apellidoPaterno": proveedor.primerApellido,
            "apellidoMaterno": proveedor.segundoApellido,
            "telefono": proveedor.telefono,
            "correoElectronico": proveedor.correoElectronico,
            "actividadProductiva": "",
            "actividadProductivaDesc": "",
            "descripcionGiro": "",
            "numeroRegistro": "",
            "domicilio": {
                "calle": proveedor.calle,
                "numeroExterior": proveedor.numeroExterior,
                "numeroInterior": proveedor.numeroInterior,
                "pais": {
                    "clave": proveedor.paisObj?.clave,
                    "nombre": proveedor.paisObj?.descripcion
                },
                "colonia": {
                    "clave": "",
                    "nombre": ""
                },
                "delegacionMunicipio": {
                    "clave": "",
                    "nombre": ""
                },
                "localidad": {
                    "clave": "",
                    "nombre": ""
                },
                "entidadFederativa": {
                    "clave": "",
                    "nombre": ""
                },
                "informacionExtra": "",
                "codigoPostal": proveedor.codigoPostal,
                "descripcionColonia": proveedor.colonia
            },
            "idSolicitud": "0"
          }
      }),
      "gridTerceros_TIPERS_FAC": state.facturadorTablaDatos.map((facturador) => { 
        return {
          "idPersonaSolicitud": "",
          "ideTipoTercero": "",
          "personaMoral": facturador.tipoPersona === "Moral" ? "1" : "0",
          "booleanExtranjero": "",
          "booleanFisicaNoContribuyente": "",
          "denominacion": facturador.razonSocial,
          "razonSocial": facturador.razonSocial,
          "rfc": facturador.rfc,
          "curp": facturador.curp,
          "nombre": facturador.nombres,
          "apellidoPaterno": facturador.primerApellido,
          "apellidoMaterno": facturador.segundoApellido,
          "telefono": facturador.telefono,
          "correoElectronico": facturador.correoElectronico,
          "actividadProductiva": "",
          "actividadProductivaDesc": "",
          "descripcionGiro": "",
          "numeroRegistro": "",
          "domicilio": {
              "calle": facturador.calle,
              "numeroExterior": facturador.numeroExterior,
              "numeroInterior": facturador.numeroInterior,
              "pais": {
                  "clave": facturador.paisObj?.clave,
                  "nombre": facturador.paisObj?.descripcion
              },
              "colonia": {
                  "clave": "",
                  "nombre": ""
              },
              "delegacionMunicipio": {
                  "clave": "",
                  "nombre": ""
              },
              "localidad": {
                  "clave": "",
                  "nombre": ""
              },
              "entidadFederativa": {
                  "clave": "",
                  "nombre": ""
              },
              "informacionExtra": "",
              "codigoPostal": facturador.codigoPostal,
              "descripcionColonia": facturador.colonia
          },
          "idSolicitud": "0"
        }
      }),
      "pagoDeDerechos": {
          "claveDeReferencia": state.pagoDerechos.claveReferencia,
          "cadenaPagoDependencia": state.pagoDerechos.cadenaDependencia,
          "banco": {
              "clave": state.pagoDerechos.bancoObject?.clave,
              "descripcion": state.pagoDerechos.bancoObject?.descripcion
          },
          "llaveDePago": state.pagoDerechos.llavePago,
          "fecPago": state.pagoDerechos.fechaPago,
          "impPago": state.pagoDerechos.importePago
      }
    
    }
  }
    private static mapScianData(arr?: any[]): any[] {
          return (arr ?? []).map((d: any) => ({ 
              clave: d.cveScian ?? d.clave ?? '', 
              descripcion: d.descripcion ?? '' 
          }));
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
              //cantidadUMC: m.cantidadUMCConComas ?? '',
              cantidadUMT:m.unidadMedidaTarifa?.descripcion ?? '',
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
  
      private static mapFabricantesData(grid?: any[]): any[] {
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
              colonia: p.domicilio?.colonia?.nombre ?? '',
              municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
              localidad: p.domicilio?.localidad?.nombre ?? '',
              entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
              estadoLocalidad: p.domicilio?.entidadFederativa?.nombre ?? '',
              codigoPostal: p.domicilio?.codigoPostal ?? '',
              coloniaEquivalente: p.domicilio?.descripcionColonia ?? '',
              nombres: p.nombre ?? '',
              primerApellido: p.apellidoPaterno ?? '',
              segundoApellido: p.apellidoMaterno ?? '',
              razonSocial: p.razonSocial ?? '',
              lada: p.domicilio?.lada ?? ''
          }));
      }
  
  
      private static mapDestinatariosData(grid?: any[]): any[] {
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
              colonia: p.domicilio?.colonia?.nombre ?? '',
              municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
              localidad: p.domicilio?.localidad?.nombre ?? '',
              entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
              estadoLocalidad: p.domicilio?.entidadFederativa?.nombre ?? '',
              codigoPostal: p.domicilio?.codigoPostal ?? '',
              coloniaEquivalente: p.domicilio?.descripcionColonia ?? '',
              nombres: p.nombre ?? '',
              primerApellido: p.apellidoPaterno ?? '',
              segundoApellido: p.apellidoMaterno ?? '',
              razonSocial: p.razonSocial ?? '',
              lada: p.domicilio?.lada ?? ''
          }));
      }
  
  
      private static mapProveedoresData(grid?: any[]): any[] {
          // eslint-disable-next-line complexity
          return (grid ?? []).map((p: any) => ({
              rfc: p.rfc ?? '',
              razonSocial: p.razonSocial ?? '',
              nombres: p.nombre ?? '',
              primerApellido: p.apellidoPaterno ?? '',
              segundoApellido: p.apellidoMaterno ?? '',
              telefono: p.telefono ?? '',
              correoElectronico: p.correoElectronico ?? '',
              pais: p.domicilio?.pais?.nombre ?? '',
              municipioAlcaldia: p.domicilio?.delegacionMunicipio?.nombre ?? '',
              localidad: p.domicilio?.localidad?.nombre ?? '',
              entidadFederativa: p.domicilio?.entidadFederativa?.nombre ?? '',
              estadoLocalidad: p.domicilio?.entidadFederativa?.nombre ?? '',
              codigoPostal: p.domicilio?.codigoPostal ?? '',
              colonia: p.domicilio?.descripcionColonia ?? '',
              nombreRazonSocial: p.denominacion ?? p.razonSocial ?? '',
              curp: p.curp ?? '',
              calle: p.domicilio?.calle ?? '',
              numeroExterior: p.domicilio?.numeroExterior ?? '',
              numeroInterior: p.domicilio?.numeroInterior ?? '',
              tipoPersona: p.personaMoral === '1' ? 'Moral' : 'Física',
              nacionalidad: p.booleanExtranjero === '1' ? 'Extranjero' : 'Nacional',
              actividadEconomica: '',
              id: parseInt(p.idPersonaSolicitud ?? '0', 10) || undefined,
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
  
  
      private static mapPagoDerechosData(pagoData?: any): any {
          return {
              claveReferencia: pagoData?.claveDeReferencia ?? '',
              cadenaDependencia: pagoData?.cadenaPagoDependencia ?? '',
              bancoObject: {
                  clave: pagoData?.banco?.clave ?? '',
                  descripcion: pagoData?.banco?.descripcion ?? '',
                  id: pagoData?.banco?.clave ?? '',
              },
              llavePago: pagoData?.llaveDePago ?? '',
              fechaPago: pagoData?.fecPago ?? '',
              importePago: pagoData?.impPago ?? '',
              banco: pagoData?.banco?.clave ?? '',
          };
      }
  
      /**
       * Map an API response (form payload) back into a partial Tramite260218State.
       * This is a best-effort reverse mapping of `toFormPayload` and will only
       * populate commonly used fields. Unknown or complex nested fields are left
       * untouched so callers can merge them as needed.
       *
       * @param response API response object matching the form payload shape
       * @returns Partial<Tramite260218State>
       */
      // eslint-disable-next-line complexity
      static fromApiResponse(response: unknown): Partial<Tramite260218State> {
          if (!response || typeof response !== 'object') {
              return {};
          }
          const resp = response as any;
          const DATOS_SOLICITUD_FORM_STATE = {
              denominacionRazon: resp.establecimiento?.razonSocial ?? '',
              rfcSanitario: resp.establecimiento?.rfcResponsableSanitario ?? '',
              correoElectronico: resp.establecimiento?.correoElectronico ?? '',
              codigoPostal: resp.establecimiento?.domicilio?.codigoPostal ?? '',
              municipioAlcaldia: resp.establecimiento?.domicilio?.descripcionMunicipio ?? '',
              localidad: resp.establecimiento?.domicilio?.informacionExtra ?? '',
              colonia: resp.establecimiento?.domicilio?.descripcionColonia ?? '',
              calle: resp.establecimiento?.domicilio?.calle ?? '',
              lada: resp.establecimiento?.domicilio?.lada ?? '',
              telefono: resp.establecimiento?.domicilio?.telefono ?? '',
              aviso: resp.establecimiento?.avisoFuncionamiento ?? '',
              licenciaSanitaria: resp.establecimiento?.numeroLicencia ?? '',
              adunasDeEntradas: resp.establecimiento?.aduanas ?? '',
              regimen: resp.solicitud?.regimen ?? '',
              publico: resp.solicitud?.informacionConfidencial === true ? 'Si' : 'No',
              representanteRfc: resp.representanteLegal?.rfc ?? '',
              representanteNombre: resp.representanteLegal?.nombre ?? '',
              apellidoPaterno: resp.representanteLegal?.apellidoPaterno ?? '',
              apellidoMaterno: resp.representanteLegal?.apellidoMaterno ?? '',
              estado: resp.establecimiento?.domicilio.entidadFederativa?.clave ?? '',
              aeropuerto: false,
              manifesto: resp.solicitud?.declaracionesSeleccionadas ?? [],
          };
  
          const PARTIAL: Partial<Tramite260218State> = {
              datosSolicitudFormState: DATOS_SOLICITUD_FORM_STATE as any,
              scianConfigDatos: this.mapScianData(resp.datosSCIAN) as any,
              tablaMercanciasConfigDatos: this.mapMercanciasData(resp.mercancias) as any,
              fabricanteTablaDatos: this.mapFabricantesData(resp.gridTerceros_TIPERS_FAB) as any,
              destinatarioFinalTablaDatos: this.mapDestinatariosData(resp.gridTerceros_TIPERS_DES) as any,
              proveedorTablaDatos: this.mapProveedoresData(resp.gridTerceros_TIPERS_PVD) as any,
              facturadorTablaDatos: this.mapFacturadoresData(resp.gridTerceros_TIPERS_FAC) as any,
              pagoDerechos: this.mapPagoDerechosData(resp.pagoDeDerechos) as any,
          };
  
          return PARTIAL;
      }
  
      /**
       * Convenience method: map the API response and patch it directly into the provided store.
       * If the `store` argument is omitted, the method simply returns the mapped partial state.
       *
       * @param response API response
       * @param store Optional Tramite260218Store instance to apply the patch
       * @returns Partial<Tramite260218State> (and patches the store when provided)
       */
      static patchToStore(response: any, store?: Tramite260218Store): Partial<Tramite260218State> {
          const PARTIAL = GuardarMappingAdapter.fromApiResponse(response);
          if (store) {
              // Akita's update accepts a partial or updater function
              store.update((state) => ({ ...state, ...PARTIAL }));
          }
          return PARTIAL;
      }
}

