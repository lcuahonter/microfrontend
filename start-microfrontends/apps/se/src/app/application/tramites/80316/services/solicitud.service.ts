import { API_ACTIVIDAD_PRODUCTIVA_PROSEC,COMUN_URL, GUARDAR_SOLICITUD} from '@libs/shared/data-access-user/src/core/servers/api-router';
import { Anexo, Bitacora, Complimentaria, DatosCertificacion, DatosDeLaTabla, DatosModificacion, DatosModificacionRespuesta, Empresas, Federetarios, FraccionSensible, Operacions, Plantas, RespuestaConsulta, Servicios } from '../models/datos-tramite.model';
import { Catalogo, HttpCoreService, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable,combineLatest, of,} from 'rxjs';
import { API_POST_MOSTRAR } from '../servers/api-route';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { DISCRIMINATOR_VALUE } from '../constantes/modificacion.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JSONRespuesta } from '../../../shared/models/shared803.model'
import { PROC_80316 } from '../servers/api-route';
import { RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Tramite80316Query } from '../estados/tramite80316.query';
import { Tramite80316Store } from '../estados/tramite80316.store';
import { map } from 'rxjs/operators';
/**
 * Servicio `SolicitudService` utilizado para gestionar las solicitudes relacionadas con el trámite 80316.
 * Este servicio proporciona métodos para obtener datos desde archivos JSON locales.
 */
@Injectable({
  providedIn: 'root',
})
export class SolicitudService {
    /**
   * URL base del host para todas las consultas de catálogos.
   *
   * Esta propiedad almacena la URL base configurada desde las variables de entorno
   * y se utiliza como prefijo para construir todos los endpoints de los catálogos.
   *
   * @type {string}
   * @readonly
   * @since 1.0.0
   */
  host: string;
  /**
   * Constructor del servicio `SolicitudService`.
   * 
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes a archivos JSON locales.
   */
  constructor(private http: HttpClient,
    private httpservice: HttpCoreService,
    private tramite80316Query: Tramite80316Query,
    private tramite80316Store: Tramite80316Store
  ) {
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  
  /**
   * Obtiene los datos del solicitante desde un archivo JSON local.
   * 
   * @returns {Observable<RespuestaCatalogos[]>} Un observable que emite un arreglo de datos del solicitante.
   */
  getDatosSolicitante(): Observable<RespuestaCatalogos[]> {
    return this.http.get<RespuestaCatalogos[]>(`assets/json/80316/datosSolicitante.json`);
  }

  /**
   * Obtiene los datos de modificación desde el endpoint correspondiente.
   * @returns 
   */
    getDatosModificacion(): Observable<JSONRespuesta<DatosModificacion>> {
      return this.httpservice
        .get<JSONRespuesta<DatosModificacionRespuesta>>(
          PROC_80316.DATOS_MODIFICACION
        )
        .pipe(
          map((response) => ({
            ...response,
            datos: {
              rfc: response.datos?.rfc_original ?? '',
              federal: response.datos?.representantes_legales?? '',
              tipo: response.datos?.identificacion?.tipo_sociedad ?? '',
              programa: response.datos?.identificacion?.email ?? '',
              actividadActual: response.datos?.actividades?.[0]?.d_actividad ?? '', 
              actividadProductiva: response.datos?.actividades?.[0]?.c_actividad ?? '',
            },
          }))
        );
    }

  /**
   * Obtiene los datos de actividades productivas desde un archivo JSON local.
   * 
   * @returns {Observable<RespuestaCatalogos>} Un observable que emite un objeto con los datos de actividades productivas.
   */
   getActividadProductiva(tramite: string): Observable<BaseResponse<Catalogo[]>> {
      const ENDPOINT = `${this.host}${API_ACTIVIDAD_PRODUCTIVA_PROSEC(tramite)}`;
      return this.httpservice.get<BaseResponse<Catalogo[]>>(ENDPOINT);
    }

  /**
   * Obtiene los datos complementarios desde un archivo JSON local.
   * 
   * @returns {Observable<Complimentaria[]>} Un observable que emite un arreglo de objetos de tipo `Complimentaria`.
   */
  obtenerComplimentaria(): Observable<Complimentaria[]> {
    return this.http.get<{ data: Complimentaria[] }>('assets/json/80316/complimentaria.json').pipe(
      map((res: { data: Complimentaria[] }) => res.data)
    );
  }

  /**
   * Obtiene los socios o accionistas asociados a una solicitud.
   * @param idSolicitud 
   * @returns  Observable<JSONRespuesta<Complimentaria[]>>
   */
  obtenerLosSocio(
      idSolicitud: string[]
    ): Observable<JSONRespuesta<Complimentaria[]>> {
      return this.httpservice.post<JSONRespuesta<Complimentaria[]>>(
        PROC_80316.BUSCAR_ASIGNACION_DATOS,
        {
          body: { idSolicitud },
        }
      );
    }

  /**
   * Obtiene una lista de anexos desde un archivo JSON local.
   * 
   * @returns {Observable<Anexo[]>} Un observable que emite un arreglo de objetos de tipo `Anexo`.
   */
  obtenerAnexo(): Observable<Anexo[]> {
    return this.http.get<{ data: Anexo[] }>('assets/json/80316/anexo.json').pipe(
      map((res: { data: Anexo[] }) => res.data)
    );
  }

  /**
   * Obtiene una lista de federatarios desde un archivo JSON local.
   * 
   * @returns {Observable<Federetarios[]>} Un observable que emite un arreglo de objetos de tipo `Federetarios`.
   */

   obtenerFederetarios(
      idSolicitud: string[]
    ): Observable<JSONRespuesta<Federetarios[]>> {
      return this.httpservice.post<JSONRespuesta<Federetarios[]>>(
        PROC_80316.FEDERETARIOS,
        {
          body: { idSolicitud },
        }
      );
    }

  /**
   * Obtiene una lista de operaciones desde un archivo JSON local.
   * 
   * @returns {Observable<Operacions[]>} Un observable que emite un arreglo de objetos de tipo `Operacions`.
   */

   obtenerOperacion(
      idSolicitud: string[]
    ): Observable<JSONRespuesta<Operacions[]>> {
      return this.httpservice.post<JSONRespuesta<Operacions[]>>(
        PROC_80316.CONSULTA_PLANTAS,
        {
          body: { idSolicitud },
        }
      );
    }
  /**
   * Obtiene una lista de empresas desde un archivo JSON local.
   * 
   * @returns {Observable<Empresas[]>} Un observable que emite un arreglo de objetos de tipo `Empresas`.
   */
 obtenerEmpresas(
      idSolicitud: string[]
    ): Observable<JSONRespuesta<Empresas[]>> {
       const PARAM = idSolicitud.join(',');
      return this.httpservice.get<JSONRespuesta<Empresas[]>>(
        PROC_80316.BUSCAR_EMPRESA_SUBMANUFACTURERA + PARAM
      );
    }
  /**
   * Obtiene una lista de plantas desde un archivo JSON local.
   * 
   * @returns {Observable<Plantas[]>} Un observable que emite un arreglo de objetos de tipo `Plantas`.
   */
 obtenerPlantas(
      idSolicitud: string[]
    ): Observable<JSONRespuesta<Plantas[]>> {
       const PARAM = idSolicitud.join(',');
      return this.httpservice.get<JSONRespuesta<Plantas[]>>(
        PROC_80316.CONSULTA_PLANTAS_SUBMANUFACTURERAS + PARAM
      );
    }

  /**
   * Obtiene una lista de servicios desde un archivo JSON local.
   * 
   * @returns {Observable<Servicios[]>} Un observable que emite un arreglo de objetos de tipo `Servicios`.
   */
obtenerServicios(
    idSolicitud: string[]
  ): Observable<JSONRespuesta<Servicios[]>> {
    return this.httpservice.post<JSONRespuesta<Servicios[]>>(
      PROC_80316.SERVICIOS_IMMEX,
      {
        body: { idSolicitud },
      }
    );
  }


   /**
     * Obtiene los datos de certificación SAT para un RFC dado.
     *
     * @param rfc El RFC para el cual se obtendrán los datos de certificación SAT.
     * @returns {Observable<JSONRespuesta<{ certificacionSAT: string }>>} Observable con los datos de certificación SAT.
     */
    obtenerDatosCertificacionSAT(
      rfc: string
    ): Observable<JSONRespuesta<{ certificacionSAT: string }>> {
      return this.httpservice.get<JSONRespuesta<{ certificacionSAT: string }>>(
        PROC_80316.CERTIFICACION_SAT + rfc
      );
    }
    /**
     * Obtiene los registros históricos de modificaciones en una bitácora.
     *
     * @returns {Observable<JSONRespuesta<Bitacora[]>>} Observable con los registros de la bitácora.
     */
    obtenerBitacora(idPrograma: string): Observable<JSONRespuesta<Bitacora[]>> {
      return this.httpservice.get<JSONRespuesta<Bitacora[]>>(
        PROC_80316.BITACORA + idPrograma
      );
    }

     /**
       * Obtiene las fracciones arancelarias de exportación asociadas a la solicitud.
       *
       * @param idSolicitud Arreglo de IDs de solicitud para las cuales se obtendrán las fracciones.
       * @returns {Observable<JSONRespuesta<Anexo[]>>} Observable con las fracciones de exportación.
       */
      obtenerFraccionesExportacion(
        idSolicitud: string[]
      ): Observable<JSONRespuesta<Anexo[]>> {
        const PARAM = idSolicitud.join(',');
        return this.httpservice.get<JSONRespuesta<Anexo[]>>(
          PROC_80316.ANEXO_FRACCIONES_EXPORTACION + PARAM
        );
      }

        /**
         * Obtiene las fracciones arancelarias de importación asociadas a la solicitud.
         *
         * @param idSolicitud Arreglo de IDs de solicitud para las cuales se obtendrán las fracciones.
         * @returns {Observable<JSONRespuesta<Anexo[]>>} Observable con las fracciones de importación.
         */
        obtenerFraccionesImportacion(
          idSolicitud: string[]
        ): Observable<JSONRespuesta<Anexo[]>> {
          const PARAM = idSolicitud.join(',');
          return this.httpservice.get<JSONRespuesta<Anexo[]>>(
            PROC_80316.ANEXO_FRACCIONES_IMPORTACION + PARAM
          );
        }


        
  /**
   * Obtiene una lista de fracciones sensibles desde un archivo JSON local.
   * 
   * @returns {Observable<FraccionSensible[]>} Un observable que emite un arreglo de objetos de tipo `FraccionSensible`.
   */
     obteneFraccionSensible(
          idSolicitud: string[]
        ): Observable<JSONRespuesta<FraccionSensible[]>> {
          const PARAM = idSolicitud.join(',');
          return this.httpservice.get<JSONRespuesta<FraccionSensible[]>>(
            PROC_80316.CONSULTA_FRACCIONES_SENSIBLES + PARAM
          );
        }


  /**
   * Obtiene los datos de la tabla desde un archivo JSON local.
   * 
   * @returns {Observable<DatosDeLaTabla[]>} Un observable que emite un objeto con los datos de la tabla.
   */
  getTablaData(): Observable<{ data: DatosDeLaTabla[] }> {
    return this.http.get<{ data: DatosDeLaTabla[] }>('assets/json/80316/tablaLista.json');
  }

  /**
   * Obtiene los tipos de persona desde un archivo JSON local.
   * 
   * @returns {Observable<RespuestaCatalogos>} Un observable que emite un objeto con los tipos de persona.
   */
  getTipoDePersona(): Observable<RespuestaCatalogos> {
    return this.http.get<RespuestaCatalogos>(`assets/json/80316/tipoDePersona.json`);
  }

  /**
   * @method getDatosConsulta
   * @description Obtiene los datos de consulta desde un archivo JSON local.
   * 
   * Este método realiza una solicitud HTTP GET para obtener los datos de consulta simulados desde el archivo `consultaDatos.json`.
   * 
   * @returns {Observable<RespuestaConsulta>} Un observable que emite la respuesta de los datos de consulta.
   */
  getDatosConsulta(): Observable<RespuestaConsulta> {
    return this.http.get<RespuestaConsulta>(`assets/json/80316/consultaDatos.json`);
  }

  /**
   * Obtiene los datos de certification desde un archivo JSON local.
   */
  getDatosCertificacion(): Observable<DatosCertificacion> {
    return this.http.get<DatosCertificacion>(`assets/json/80316/certification.json`);
  }


  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     * @param payload - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @param idTipoTramite - Identificador del tipo de trámite para construir la URL de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */
    guardarDatosPost(tramite: string,payload: Record<string, unknown>): Observable<JSONResponse> {
      const ENDPOINT = `${this.host}${GUARDAR_SOLICITUD(tramite)}`;
      return this.http.post<JSONResponse>(ENDPOINT, payload).pipe(
        map((response) => response)
      );
    }

      /**
       * Busca el ID de la solicitud basado en el payload proporcionado.
       *
       * @param payload Datos necesarios para buscar el ID de la solicitud.
       * @returns {Observable<JSONRespuesta<{ buscaIdSolicitud: string }>>} Observable con el ID de la solicitud.
       */
      buscarIdSolicitud(payload: {
        idPrograma: string;
        tipoPrograma: string;
      }): Observable<JSONRespuesta<{ buscaIdSolicitud: string }>> {
        return this.httpservice.post<JSONRespuesta<{ buscaIdSolicitud: string }>>(
          PROC_80316.BUSCAR_ID_SOLICITUD,
          {
            body: payload,
          }
        );
      
  }

   /**
     * Obtiene la lista de programas asociados a un RFC y tipo de programa específico.
     *
     * @param rfc El RFC para el cual se obtendrán los programas.
     * @param tipoPrograma El tipo de programa para filtrar la lista.
     * @returns {Observable<JSONRespuesta<ProgramaLista[]>>} Observable con la lista de programas.
     */
    obtenerListaProgramas(
      rfc: string,
      tipoPrograma: string
    ): Observable<JSONRespuesta<DatosDeLaTabla[]>> {
      return this.httpservice.get<JSONRespuesta<DatosDeLaTabla[]>>(
        PROC_80316.LISTA_PROGRAMAS + `${rfc}&tipoPrograma=${tipoPrograma}`
      );
    }
    
   /**
     * @description
     * Utility function to merge multiple state objects.
     * Removes duplicate keys and retains only meaningful values.
     * @param {...Record<string, any>} states - List of state objects to merge.
     * @returns {Record<string, unknown>} Merged state object.
     */
    private static mergeStates(...states: Record<string, unknown>[]): Record<string, unknown> {
      const RESULT: Record<string, unknown> = {};
  
      for (const STATE of states) {
        for (const [KEY, VALUE] of Object.entries(STATE)) {
          const EXISTING = RESULT[KEY];
  
          const IS_MEANINGFUL = VALUE !== null && VALUE !== undefined &&
            !(typeof VALUE === 'string' && VALUE.trim() === '') &&
            !(Array.isArray(VALUE) && VALUE.length === 0);
  
          if (!EXISTING || IS_MEANINGFUL) {
            RESULT[KEY] = VALUE;
          }
        }
      }
      return RESULT;
    }
  
     /**
      * @description
      * Obtiene el estado completo combinando múltiples fuentes de estado.
      * @returns {Observable<Record<string, unknown>>} Observable que emite el estado combinado.
      */
       getAllState(): Observable<Record<string, unknown>> {
         return combineLatest([
           this.tramite80316Query.allStoreData$,
         ]).pipe(
           map(([tramite120404Query,]) =>
             SolicitudService.mergeStates(
                tramite120404Query as unknown as Record<string, unknown>,
             )
           )
         );
       }

         /**
   * Construye el payload para la solicitud basada en los datos proporcionados y un valor discriminador.
   * @param data 
   * @param discriminatorValue 
   * @returns 
   */
  buildPayload(data: Record<string, unknown>): Record<string, unknown> {
  const FRACCION_EXPORTACION = (data as { fraccionesExportacion: Anexo[] }).fraccionesExportacion.map((fraccion) => ({
       claveProductoExportacion: fraccion.claveProductoExportacion,
         fraccionArancelaria: {
                cveFraccion: fraccion.cveFraccion || '',
            },
  }));

  const FRACCION_IMPORTACION = (data as { fraccionesImportacion: Anexo[] }).fraccionesImportacion.map((fraccion) => ({
            fraccionArancelaria: {
                cveFraccion: fraccion.cveFraccion || '',
            },
  }));

  const EMPRESA_SUBMANUFACTURERA = (data as { empresas: Empresas[] }).empresas.map((empresa) => ({
    idPlanta: empresa.id?.toString() || null,
            estatus: empresa.estatus || false,
  }));

  const SERVICIOS = (data as { servicios: Servicios[] }).servicios.map((servicio) => ({
    estatus: servicio.estatus || false,
            idServicio: servicio.id || null
  }));

   return {
    tipoDeSolicitud: "guardar",
    idSolicitud: data["idSolicitud"] || 0,
    cveRolCapturista: "PersonaMoral",
    idTipoTramite: 80316,
    rfc: "AAL0409235E6",
    cveUnidadAdministrativa: "2540",
    costoTotal: null,
    discriminatorValue: DISCRIMINATOR_VALUE,
    certificadoSerialNumber: null,
    certificado: null,
    numeroFolioTramiteOriginal: null,
    actividadSeleccionada: "APRO.24",
    idProgramaAutorizado: "122364",
    tipoPrograma: "TICPSE.IMMEX",
    tipoModalidad: "Cambio SE",
    descripcionModalidad: "Sector por autoridad",
    folioPrograma: "40",
    factorAmpliacion: 1.2,
    montoImportaciones: 500000,
    solicitante: {
        solicitanteDomicilio: {
            idDomicilio: 0,
            calle: "CAMINO VIEJO",
            numExterior: "1353",
            numInterior: null,
            codigoPostal: "81210",
            informacionExtra: "string",
            clave: "string",
            cveLocalidad: "00181210008",
            cveDelegMun: "25001",
            cveEntidad: "SIN",
            cvePais: "MEX",
            ciudad: "string",
            telefono: "55-98764532",
            fax: "string",
            municipio: "string",
            colonia: "00181210001",
            descUbicacion: "string",
            cveCatalogo: "string",
            telefonos: "string",
            tipoDomicilio: 0,
            localidad: {}
        },
        razonSocial: "INTEGRADORA DE URBANIZACIONES SIGNUM S DE RL DE CV",
        rfc: "AAL0409235E6",
        correoElectronico: "vucem2021@gmail.com"
    },

    fraccionesExportacion: [
        ...FRACCION_EXPORTACION
    ],
    fraccionesImportacion: [
        ...FRACCION_IMPORTACION
    ],
    empresaSubmanufacturera: [
          ...EMPRESA_SUBMANUFACTURERA
    ],
    servicios: [
        ...SERVICIOS
    ]

    };
 
}

/**
 * Actualiza los valores de mostrar para un trámite e ID de solicitud específicos.
 * @param tramite 
 * @param idSolicitud 
 * @returns 
 */
  actualizarValoresMostra<T>(tramite: number, idSolicitud: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${API_POST_MOSTRAR(tramite, idSolicitud)}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT);
  }

  /**
   * Establece los valores de mostrar en el store basado en los datos proporcionados.
   * @param datos
   * @param store 
   */
  establecerValoresMostrar(datos: unknown, store: Tramite80316Store): void {
    const PARTIAL = {
    empresas: SolicitudService.mapEmpresaData((datos as { empresa?: Empresas | Empresas[] }).empresa),
     };

  store.update(state => ({
    ...state,
    ...PARTIAL
  }));
  }

private static mapEmpresaData(empresa?: Empresas | Empresas[]): Empresas[] {
  if (!empresa) {
    return [];
  }

  const EMPRESA_LIST = Array.isArray(empresa) ? empresa : [empresa];

  return EMPRESA_LIST.map(e => ({
    rfc: e?.rfc ?? '',
    razonSocial: e?.razonSocial ?? ''
  }));
}

}