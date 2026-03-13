/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import { Injectable, OnInit } from '@angular/core';
import { AvisocalidadQuery } from '../../../shared/estados/queries/aviso-calidad.query';
import { DatosDomicilioLegalQuery } from '../../../shared/estados/queries/datos-domicilio-legal.query';

import { DatosDomicilioLegalState,DatosDomicilioLegalStore } from '../../../shared/estados/stores/datos-domicilio-legal.store';
import { PagoDerechosQuery } from '../../../shared/estados/queries/pago-derechos.query';

import { PagoDerechosState,PagoDerechosStore } from '../../../shared/estados/stores/pago-de-derechos.store';

import { AvisocalidadStore ,SolicitudState} from '../../../shared/estados/stores/aviso-calidad.store';


 


@Injectable({
  providedIn: 'root'
})
export class GuardarAdapter_260513 {
  establecimientDatos: SolicitudState = {} as SolicitudState;
  solicitudDatos: DatosDomicilioLegalState = {} as DatosDomicilioLegalState;
  static idSolicitud: number = 0;
  pagoDerechosDatos: PagoDerechosState = {} as PagoDerechosState;

  constructor(
    private establecimientQuery: AvisocalidadQuery,
    private solicitudQuery: DatosDomicilioLegalQuery,
    private pagoDrenchosQuery: PagoDerechosQuery
  ) {
    this.establecimientQuery.allStoreData$.subscribe(data => {
      this.establecimientDatos = data;
    });
    this.solicitudQuery.allStoreData$.subscribe(data => {
      this.solicitudDatos = data;
    });
    this.pagoDrenchosQuery.selectSolicitud$.subscribe(data => {
      this.pagoDerechosDatos = data;
    });
  }

  // eslint-disable-next-line complexity
  public toFormPayload(): unknown {
    return {
      solicitante: {
        rfc: this.solicitudDatos.rfc ?? "",
        nombre: this.solicitudDatos.nombre ?? "",
        actividadEconomica: "",
        correoElectronico: this.solicitudDatos.correo ?? "",
        rol_capturista : "personaMoral",
        domicilio: {
          pais: "México",
          codigoPostal: this.solicitudDatos.codigoPostal ?? "",
          estado: this.solicitudDatos.estado ?? "",
          municipioAlcaldia: this.solicitudDatos.muncipio ?? "",
          localidad: this.solicitudDatos.localidad ?? "",
          colonia: this.solicitudDatos.colonia ?? "",
          calle: this.solicitudDatos.calle ?? "",
          numeroExterior: "",
          numeroInterior: "",
          lada: this.solicitudDatos.lada ?? "",
          telefono: this.solicitudDatos.telefono ?? ""
        }
      },
      establecimiento: {
        rfcResponsableSanitario: this.establecimientDatos.rfcDel,
        razonSocial: this.establecimientDatos.denominacionRazonSocial,
        correoElectronico: this.establecimientDatos.correoElectronico,
        domicilio: {
          codigoPostal: this.solicitudDatos.codigoPostal,
          entidadFederativa: {
            clave: this.solicitudDatos.estado
          },
          descripcionMunicipio: this.solicitudDatos.muncipio,
          informacionExtra: this.solicitudDatos.localidad,
          descripcionColonia: this.solicitudDatos.colonia,
          calle: this.solicitudDatos.calle,
          lada: this.solicitudDatos.lada,
          telefono: this.solicitudDatos.telefono
        },
        original: "",
        avisoFuncionamiento: this.solicitudDatos.avisoCheckbox ?? true,
        numeroLicencia: this.solicitudDatos.licenciaSanitaria,
        aduanas: Array.isArray(this.solicitudDatos.aduanasDeEntradaObj)
          ? this.solicitudDatos.aduanasDeEntradaObj.map((a: { clave?: string }) => a?.clave || "")
          : []
      },
      datosSCIAN: Array.isArray(this.solicitudDatos.nicoTabla)
        ? this.solicitudDatos.nicoTabla.map((item: any) => ({
            cveScian: String(item.clave_Scian ?? item.claveScianModal ?? ""),
            descripcion: String(item.descripcion_Scian ?? item.claveDescripcionModal ?? ""),
            selected: true
          }))
        : [],
      pagoDeDerechos: {
        claveDeReferencia: this.pagoDerechosDatos.claveReferencia ?? "",
        cadenaPagoDependencia: this.pagoDerechosDatos.cadenaDependencia ?? "",
        banco: {
          clave: this.pagoDerechosDatos.banco ?? "",
          descripcion: this.pagoDerechosDatos.bancoObject?.descripcion ?? ""
        },
        llaveDePago: this.pagoDerechosDatos.llavePago ?? "",
        fecPago: this.pagoDerechosDatos.fechaPago ?? "",
        impPago: this.pagoDerechosDatos.importePago ?? ""
      },
     mercancias: Array.isArray(this.solicitudDatos.mercanciaTabla)
  ? this.solicitudDatos.mercanciaTabla.map((item: any) => ({
      objetoImportacionEnum: item.objetoImportacion ?? '',
      objetoImportacionDesc: item.objetoImportacionDesc ?? '',
      descOtroObjetoImportacion: item.objetoImportacionOtro ?? '',
      clasificacionToxicologica: {
        idClasificacionToxicologicaTipoTramite:
          item.clasificacionToxicologicaClave ?? '',
        clasificacionToxicologica:
          item.clasificacionToxicologica ?? ''
      },
      numeroCAS: item.numeroCas ?? '',
      registroSanitarioConComas:
      item.numeroRegistroSanitario ?? '',
      porcentajeConcentracion: item.porcentajeConcentracion ?? '',
      nombreComercial: item.nombreComercial ?? '',
      nombreComun: item.nombreComun ?? '',
      nombreCientifico: item.nombreCientifico ?? '',
      idEstadoFisico: item.estadoFisicoClave ?? '',
      estadoFisicoDescripcionOtros: item.estadoFisicoOtro ?? null,
      idMercancia: item.idMercancia ?? null,
      idClasificacionProducto: item.idClasificacionProducto ?? null,
      nombreClasificacionProducto: null,
      ideSubClasificacionProducto: null,
      nombreSubClasificacionProducto: null,
      descDenominacionEspecifica: null,
      descDenominacionDistintiva:  null,
      descripcionMercancia:  null,
      formaFarmaceuticaDescripcionOtros: null,
      fraccionArancelaria: {
        clave: item.fraccionArancelaria ?? '',
        descripcion: item.descripcionFraccion ?? ''
      },
      unidadMedidaComercial: {
        descripcion: item.umc ?? ''
      },
      cantidadUMCConComas: item.cantidadUmc ?? '',

      unidadMedidaTarifa: {
        descripcion: item.unidadMedidaTarifa ?? ''
      },
      cantidadUMTConComas: item.cantidadUmt ?? '',
      presentacion: item.presentacion ?? '',
      nombreCortoPaisOrigen: Array.isArray(item.paisDeOriginDatosObj)
        ? item.paisDeOriginDatosObj.map(
            (a: { clave?: string }) => a.clave ?? ''
          )
        : [],

      nombreCortoPaisProcedencia: Array.isArray(item.paisDeProcedenciaDatosObj)
            ? item.paisDeProcedenciaDatosObj.map((a: { clave?: string }) => a?.clave || "")
            : [],
      tipoProductoDescripcionOtros: null,
      nombreCortoUsoEspecifico: item.usoEspecifico ?? '',
      fechaCaducidadStr: null
    }))
  : [],
      representanteLegal: {
        rfc: this.solicitudDatos.rfc,
        resultadoIDC: "",
        nombre: this.solicitudDatos.nombre,
        apellidoPaterno: this.solicitudDatos.apellidoPaterno,
        apellidoMaterno: this.solicitudDatos.apellidoMaterno
      },
      solicitud: {
        discriminatorValue: 260513,
        declaracionesSeleccionadas: this.solicitudDatos.mensaje ?? true,
        regimen: this.solicitudDatos.regimen ?? "01",
        aduanaAIFA: "140",
        informacionConfidencial: true
      },
     idSolicitud: GuardarAdapter_260513.idSolicitud
    };
  }
  
      /**
       * Map an API response (form payload) back into a partial Tramite260203State.
       * This is a best-effort reverse mapping of `toFormPayload` and will only
       * populate commonly used fields. Unknown or complex nested fields are left
       * untouched so callers can merge them as needed.
       *
       * @param response API response object matching the form payload shape
       * @returns Partial<Tramite260203State>
       */
      // eslint-disable-next-line complexity
      static fromApiResponseToEstablecimientoDatos(response: unknown): Partial<SolicitudState> {
          if (!response || typeof response !== 'object') {
              return {};
          }
          const RESP = response as any;
          const DATOS_ESTABLECIMIENTO_FORM_STATE = {

            rfcDel: RESP.establecimiento?.rfcResponsableSanitario ?? '',
            denominacionRazonSocial: RESP.establecimiento?.razonSocial ?? '',
            correoElectronico: RESP.establecimiento?.correoElectronico ?? '',
          }
          return DATOS_ESTABLECIMIENTO_FORM_STATE;
        }


        static fromApiResponseToPago(response: unknown): Partial<PagoDerechosState> {
          if (!response || typeof response !== 'object') {
              return {};
          }
          const RESP = response as any;
            const DATOS_PAGO_FORM_STATE = {
            claveReferencia: RESP.pagoDeDerechos?.claveDeReferencia ?? '',
            cadenaDependencia: RESP.pagoDeDerechos?.cadenaPagoDependencia ?? '',
            banco: RESP.pagoDeDerechos?.banco?.clave ?? '',
            bancoObject: RESP.pagoDeDerechos?.banco
              ? { id: RESP.pagoDeDerechos.banco.id ?? '', clave: RESP.pagoDeDerechos.banco.clave ?? '', descripcion: RESP.pagoDeDerechos.banco.descripcion ?? '' }
              : undefined,
            llavePago: RESP.pagoDeDerechos?.llaveDePago ?? '',
            fechaPago: RESP.pagoDeDerechos?.fecPago ?? '',
            importePago: RESP.pagoDeDerechos?.impPago ?? '',
            };
          return DATOS_PAGO_FORM_STATE;
        }


          static fromApiResponseToSolicitudDatos(response: unknown): Partial<DatosDomicilioLegalState> {
            if (!response || typeof response !== 'object') {
                return {};
            }
            const RESP = response as any;
            const DATOS_SOLICITANTE_FORM_STATE = {
              codigoPostal: RESP.establecimiento?.domicilio?.codigoPostal ?? '',
              estado: RESP.establecimiento?.domicilio?.entidadFederativa?.clave ?? '',
              muncipio: RESP.establecimiento?.domicilio?.descripcionMunicipio ?? '',
              localidad: RESP.establecimiento?.domicilio?.informacionExtra ?? '',
              colonia: RESP.establecimiento?.domicilio?.descripcionColonia ?? '',
              calle: RESP.establecimiento?.domicilio?.calle ?? '',
              lada: RESP.establecimiento?.domicilio?.lada ?? '',
              telefono: RESP.establecimiento?.domicilio?.telefono ?? '',
              avisoCheckbox: RESP.establecimiento?.avisoFuncionamiento ?? false,
              licenciaSanitaria: RESP.establecimiento?.numeroLicencia ?? '',
              aduanaId: Array.isArray(RESP.establecimiento?.aduanas)? RESP.establecimiento.aduanas: [],
              aduanasDeEntrada: Array.isArray(RESP.establecimiento?.aduanas) ? RESP.establecimiento.aduanas : [],
              aduanasDeEntradaObj: Array.isArray(RESP.establecimiento?.aduanas)
              ? RESP.establecimiento.aduanas.map((clave: string) => ({ clave }))
              : [],

              // Datos SCIAN
              nicoTabla: Array.isArray(RESP.datosSCIAN)
              ? RESP.datosSCIAN.map((item: any) => ({
                clave_Scian: item.cveScian ?? '',
                descripcion_Scian: item.descripcion ?? '',
                selected: item.selected ?? true
              }))
              : [],

              // Datos del representante legal
              rfc: RESP.representanteLegal?.rfc ?? '',
              nombre: RESP.representanteLegal?.nombre ?? '',
              apellidoPaterno: RESP.representanteLegal?.apellidoPaterno ?? '',
              apellidoMaterno: RESP.representanteLegal?.apellidoMaterno ?? '',

              // Otros campos
              regimen: RESP.solicitud?.regimen ?? '',
              mensaje: RESP.solicitud?.declaracionesSeleccionadas ?? false,
              cumplimiento: RESP.solicitud?.informacionConfidencial === true ? 'Si' : 'No',

              // Mercancías
              mercanciaTabla: Array.isArray(RESP.mercancias)
                ? RESP.mercancias.map((item: any) => ({
                  idMercancia: item.idMercancia ?? '',
                  objetoImportacion: item.objetoImportacionEnum ?? '',
                  objetoImportacionClave: item.objetoImportacionEnum ?? '',
                  objetoImportacionOtro: item.descOtroObjetoImportacion ?? '',
                  clasificacionToxicologica:
                  item.clasificacionToxicologica?.clasificacionToxicologica ?? '',
                  clasificacionToxicologicaClave:
                  item.idClasificacionProducto ?? '1',
                  nombreComercial: item.nombreComercial ?? '',
                  nombreComun: item.nombreComun ?? '',
                  nombreCientifico: item.nombreCientifico ?? '',
                  porcentajeConcentracion: item.porcentajeConcentracion ?? '',
                  estadoFisico: item.idEstadoFisico ?? '',
                  estadoFisicoClave: item.idEstadoFisico ?? '',
                  estadoFisicoOtro: item.estadoFisicoDescripcionOtros ?? '',
                  idClasificacionProducto: item.idClasificacionProducto ?? '',
                  nombreClasificacionProducto: item.nombreClasificacionProducto ?? '',
                  ideSubClasificacionProducto: item.ideSubClasificacionProducto ?? '',
                  nombreSubClasificacionProducto: item.nombreSubClasificacionProducto ?? '',
                  descDenominacionEspecifica: item.descDenominacionEspecifica ?? '',
                  descDenominacionDistintiva: item.descDenominacionDistintiva ?? '',
                  descripcionMercancia: item.descripcionMercancia ?? '',
                  formaFarmaceuticaDescripcionOtros: item.formaFarmaceuticaDescripcionOtros ?? '',
                  fraccionArancelaria: item.fraccionArancelaria?.clave ?? '',
                  descripcionFraccion: item.fraccionArancelaria?.descripcion ?? '',
                  umc: item.unidadMedidaComercial?.descripcion ?? '',
                  cantidadUmc: item.cantidadUMCConComas ?? '',
                  unidadMedidaTarifa: item.unidadMedidaTarifa?.descripcion ?? '',
                  cantidadUmt: item.cantidadUMTConComas ?? '',
                  numeroRegistroSanitario: item.registroSanitarioConComas ?? '',
                  numeroCas: item.numeroCAS ?? '',
                  paisDeOriginDatosObj: Array.isArray(item.nombreCortoPaisOrigen)
                    ? item.nombreCortoPaisOrigen.map((clave: string) => ({
                      clave,
                      descripcion: ''
                    }))
                    : [],

                  paisDeProcedenciaDatosObj: Array.isArray(item.nombreCortoPaisProcedencia)
                    ? item.nombreCortoPaisProcedencia.map((clave: string) => ({
                      clave,
                      descripcion: ''
                    }))
                    : [],
                  paisProcedenciaUltimoPuerto: item.nombreCortoPaisProcedencia ?? [],
                  usoEspecifico: item.nombreCortoUsoEspecifico ?? '',
                  tipoProductoDescripcionOtros:
                    item.tipoProductoDescripcionOtros ?? '',
                  fechaCaducidadStr: item.fechaCaducidadStr ?? ''
                }))
                : []
            };
          return DATOS_SOLICITANTE_FORM_STATE;
        }
  
      /**
       * Convenience method: map the API response and patch it directly into the provided store.
       * If the `store` argument is omitted, the method simply returns the mapped partial state.
       *
       * @param response API response
       * @param store Optional Tramite260513Store instance to apply the patch
       * @returns Partial<SolicitudState> (and patches the store when provided)
       */
 

       static patchToStoreEstable(response: any, store?: AvisocalidadStore): void {
              const PARTIAL = GuardarAdapter_260513.fromApiResponseToEstablecimientoDatos(response);
              if (store) {
                  // Akita's update accepts a partial or updater function
                  store.update((state) => ({ ...state, ...PARTIAL }));
              }
            
          }

          
       static patchToStoreSolicitud(response: any, store?: DatosDomicilioLegalStore): void {
              const PARTIAL = GuardarAdapter_260513.fromApiResponseToSolicitudDatos(response);
              if (store) {
                  // Akita's update accepts a partial or updater function
                  store.update((state) => ({ ...state, ...PARTIAL }));
              }
            
          }

             static patchToStorePago(response: any, store?: PagoDerechosStore): void {
              const PARTIAL = GuardarAdapter_260513.fromApiResponseToPago(response);
              if (store) {
                  // Akita's update accepts a partial or updater function
                  store.update((state) => ({ ...state, ...PARTIAL }));
              }
            
          }

       static patchresponseToStore(response: any, avisocalidadStore: AvisocalidadStore, solicitudStore: DatosDomicilioLegalStore, pagoStore: PagoDerechosStore): void {
              GuardarAdapter_260513.patchToStoreEstable(response, avisocalidadStore);
              GuardarAdapter_260513.patchToStoreSolicitud(response, solicitudStore);
              GuardarAdapter_260513.patchToStorePago(response, pagoStore);
              GuardarAdapter_260513.idSolicitud=Number((response as any).idSolicitud);
          }

  }

