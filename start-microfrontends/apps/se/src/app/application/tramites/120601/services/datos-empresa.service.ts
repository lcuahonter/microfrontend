import { DatosEmpresa, DatosSociosTable, DatosSociosTableExtranjeros, RepresentacionFederal } from '../modelos/datos-empresa.model';
import { Tramite120601Store, Tramites120601State } from '../estados/tramite-120601.store';
import { Catalogo } from '@libs/shared/data-access-user/src';
import { HttpClient } from '@angular/common/http';
import { HttpCoreService } from '@libs/shared/data-access-user/src';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PROC_120601 } from '../servers/api.route';
import { Tramite120601Query } from '../estados/tramite-120601.query';

/**
 * Servicio para manejar los datos de la empresa en el trámite 120601.
 * Este servicio se encarga de obtener datos simulados desde archivos JSON
 * */
@Injectable({
  providedIn: 'root'
})  
export class DatosEmpresaService {

  /**
   * URL base para obtener los datos simulados desde archivos JSON.
   * @private
   * @type {string}
   */
  private assetsJsonUrl = '/assets/json/120601/';

  /**
   * Constructor del servicio.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient ,private tramite120601Store: Tramite120601Store,
    private tramite120601Query: Tramite120601Query,public httpService: HttpCoreService,) {
    // No se necesita lógica de inicialización adicional.
  }

  /**
   * Obtiene los datos simulados para la tabla datosSocios.
   * 
   * @returns {Observable<DatosSociosTable[]>} Observable que emite los datos.
   */
  obtenerDatosTablaDeSocios(): Observable<DatosSociosTable[]> {
    return this.http.get<DatosSociosTable[]>(`${this.assetsJsonUrl}datosSocios-table.json`);
  }

   /**
   * Obtiene los datos simulados para la tabla datosSocios.
   * 
   * @returns {Observable<DatosSociosTableExtranjeros[]>} Observable que emite los datos.
   */
  obtenerDatosTablaDeSociosExtranjeros(): Observable<DatosSociosTableExtranjeros[]> {
    return this.http.get<DatosSociosTableExtranjeros[]>(`${this.assetsJsonUrl}datosSociosExtranjenos.json`);
  }

  /**
   * Obtiene los datos del estado.
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite los datos.
   */
  obtenerEstado(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.assetsJsonUrl}tipoDeEmpresa.json`);
  }

  /**
   * Obtiene datos de Representación Federal
   * 
   * @returns {Observable<Catalogo[]>} Observable que emite los datos.
   */
  obtenerDatosDeRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(`${this.assetsJsonUrl}representacionFederal.json`);
  }

  /**
   * Obtener datos para la Tabla de Representación Federal
   * 
   * @returns {Observable<RepresentacionFederal[]>} Observable que emite los datos.
   */
  ObtenerTablaDeRepresentaciónFederal(): Observable<RepresentacionFederal[]> {
    return this.http.get<RepresentacionFederal[]>(`${this.assetsJsonUrl}representacionFederal-table.json`);
  }

  /**
   * Actualiza el estado del formulario con los datos proporcionados.
   * 
   * @param {DatosEmpresa} datos - Datos de la empresa a actualizar.
   */
  actualizarEstadoFormulario(datos: DatosEmpresa): void {
    if (datos.FormSolicitud?.datosImportadorExportador) {
      this.tramite120601Store.setNacionalidad(datos.FormSolicitud.datosImportadorExportador.nacionalidad);
      this.tramite120601Store.setPersona(datos.FormSolicitud.datosImportadorExportador.persona);
      this.tramite120601Store.setCadenaDependencia(datos.FormSolicitud.datosImportadorExportador.cadenaDependencia);
    }

    if (datos.solicitudForm?.tipoDeEmpresa) {
      this.tramite120601Store.setTipoDeEmpresa(String(datos.solicitudForm.tipoDeEmpresa.id));
    }

    if (datos.solicitudForm){
      this.tramite120601Store.setActividadEconomicaClave(datos.solicitudForm.actividadEconomicaClave);
    }

    if (datos.representacionFederal) {
      this.tramite120601Store.setEstado(String(datos.representacionFederal.estado.id));
      this.tramite120601Store.setRepresentacion(String(datos.representacionFederal.representacion.id));
    }
  }

  /**
   * Obtiene los datos de la empresa desde un archivo JSON.
   * 
   * @returns {Observable<DatosEmpresa>} Observable que emite los datos de la empresa.
   */
  getRegistroTomaMuestrasMercanciasData(): Observable<DatosEmpresa> {
    return this.http.get<DatosEmpresa>(`${this.assetsJsonUrl}datosEmpresa.json`);
  }

    /**
   * Envía una petición HTTP POST al endpoint definido para guardar los datos del trámite 110203.
   * Recibe un objeto genérico como cuerpo de la solicitud.
   * Devuelve un observable con la respuesta del servidor en formato de objeto.
   */
    guardarDatosPost(body: Record<string, unknown>): Observable<Record<string, unknown>> {
      return this.httpService.post<Record<string, unknown>>(PROC_120601.GUARDAR, { body: body });
    }

    /**
     * Obtiene el estado completo de la solicitud 120601 desde el store.
     * Retorna un observable que emite los cambios en el estado de la solicitud.
     * Permite suscribirse para reaccionar ante actualizaciones del estado.
     */
      getAllState(): Observable<Tramites120601State> {
        return this.tramite120601Query.selectSolicitud$;
      }

      /**
       * Obtiene la lista de accionistas de un contribuyente específico por RFC.
       * Retorna un Observable con un arreglo de DatosSociosTable.
       */
      getAccionistasByRFC(rfc: string): Observable<DatosSociosTable[]> {
        return this.httpService.get<DatosSociosTable[]>(PROC_120601.ACCIONISTAS, { params: { rfc } });
      }
      
    /**
    * Obtiene la lista de plantas de un estado específico usando su ID.
    * Retorna un Observable con los datos obtenidos del servicio HTTP.
    */
      obtenerPlantas(estadoId: string): Observable<any> {
        const URL = `${PROC_120601.PLANTAS}?rfcSolicitante=AAL0409235E6&entidadFederativa=${estadoId}`;
        return this.http.get<any>(URL);
      }

    /**
     * Obtiene un catálogo de representaciones federales filtradas
     * por el ID de la entidad federativa.
     */
      obtenerRepresentacionFederalPorEstado(estadoId: string): Observable<Catalogo[]> {
        const URL = `${PROC_120601.PLANTAS}?entidadFederativa=${estadoId}`;
        return this.httpService.get<Catalogo[]>(URL);
      }

    /**
     * Construye un objeto con la información de la empresa, incluyendo
     * representación federal, datos de la solicitud, ubicación de mercancía
     * y socios/accionistas a partir del estado de `Tramites120601State`.
     */
      buildDatosEmpresa(data:Tramites120601State): unknown {
        return{
          "representacionFederal" : {
            "estado": data.representacionFederal.estado,
            "representacionFederal": data.representacionFederal.representacion,
          },
          "datosSolicitud": {
            "tipoEmpresa": data.datosDeLaSolicitud.tipoDeEmpresa,
            "especifique": "Expo Internacional de Tecnología 2025",
            "actividadEconomicaClave": data.datosDeLaSolicitud.actividadEconomicaClave,
            "actividadEconomicaDescripcion": "Desarrollo de software y servicios de TI"
          },
          "ubicacionMercancia": {
            "paisNombre": data.domicilioFiscal.pais,
            "codigoPostal": data.domicilioFiscal.codigoPostal,
            "entidadFederativa": data.domicilioFiscal.entidadFederativa,
            "delegacionMunicipio": data.domicilioFiscal.municipio,
            "lada": data.domicilioFiscal.lada ?? '123',
            "localidad": data.domicilioFiscal.localidad,
            "colonia": data.domicilioFiscal.colonia,
            "calle": data.domicilioFiscal.calle,
            "numeroExterior": data.domicilioFiscal.nExt,
            "numeroInterior": data.domicilioFiscal.nInt ?? '111',
            "telefono": data.domicilioFiscal.telefono ?? '1234567890'
          },
          "sociosAccionistas": {
            "tipoNacionalidad": data.datosGeneralesSocios.nacionalidad,
            "tipoExtranjero": data.datosGeneralesSocios.persona,
            "mexicano": {
                "rfc": data.datosGeneralesSocios.cadenaDependencia
            },
            "extranjeroFisico": {
                "nombre": data.datosGeneralesSocios.nombre,
                "apellidoPaterno": data.datosGeneralesSocios.apellidoPaterno,
                "pais": data.datosGeneralesSocios.pais,
                "codigoPostal": data.datosGeneralesSocios.codigoPostal,
                "estado": data.datosGeneralesSocios.estado,
                "correoElectronico": data.datosGeneralesSocios.correoElectronico,
                "taxId": data.datosGeneralesSocios.taxId
            },
            "extranjeroMoral": {
                "taxId": data.datosGeneralesSocios.taxId,
                "razonSocial": data.datosGeneralesSocios.denominacion,
                "pais": data.datosGeneralesSocios.pais,
                "codigoPostal": data.datosGeneralesSocios.codigoPostal,
                "estado": data.datosGeneralesSocios.estado,
                "correoElectronico": data.datosGeneralesSocios.correoElectronico
            }
        }
      }
    }
  }