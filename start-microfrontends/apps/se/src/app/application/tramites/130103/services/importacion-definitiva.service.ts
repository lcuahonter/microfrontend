import { Catalogo, CatalogoServices, HttpCoreService, JSONResponse, MostrarPartidas } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { Tramite130103State, Tramite130103Store } from '../../../estados/tramites/tramite130103.store';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/shared/base-response.model';
import { COMUN_URL } from '@libs/shared/data-access-user/src/core/servers/api-router';
import { DatosResponse } from '../models/importacion-definitiva.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130103 } from '../servers/api-route';
import { Tramite130103Query } from '../../../estados/queries/tramite130103.query';
/**
 * @Injectable
 * @providedIn root
 * @description
 * Decorador que marca la clase `ImportacionDefinitivaService` como un servicio inyectable en Angular.
 */
@Injectable({
  providedIn: 'root'
})

export class ImportacionDefinitivaService {
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
    * @property {Tramite130114State} solicitudState
    * @description
    * Estado actual de la solicitud del trámite 130114.
    */
  solicitudState!: Tramite130103State;
  /**
* @constructor
* @description
* Constructor del servicio  `ImportacionDefinitivaService`.
* @param {HttpClient} http - Servicio de Angular para realizar solicitudes HTTP.
* @param {Tramite130103Store} tramite130103Store - Store para manejar el estado del trámite 130103.
*/
  constructor(private http: HttpClient, private tramite130103Store: Tramite130103Store,
    private catalogoServices: CatalogoServices, private tramite130103Query: Tramite130103Query,
    public httpService: HttpCoreService,) {
    // Lógica de inicialización si es necesario
    this.host = `${COMUN_URL.BASE_URL}`;
  }

  /**
 * @method actualizarEstadoFormulario
 * @description
 * Actualiza el valor de un campo específico en el store `Tramite120101Store` de manera dinámica.
 * 
 * Detalles:
 * - Utiliza el método `setDynamicFieldValue` del store para modificar el valor del campo indicado.
 * - Permite mantener sincronizado el estado global del trámite con los cambios realizados en el formulario.
 * 
 * @param {string} campo - Nombre del campo que se desea actualizar en el store.
 * @param {unknown} valor - Valor que se asignará al campo especificado.
 * 
 * @example
 * this.actualizarEstadoFormulario('pais', 'México');
 * // Actualiza el campo 'pais' en el store con el valor 'México'.
 */

  actualizarEstadoFormulario(DATOS: Tramite130103State): void {
    this.tramite130103Store.actualizarEstado(DATOS);
  }

  /**
       * Obtiene el catálogo de tratados/acuerdos asociados a un trámite.
       * @param tramitesID - Identificador del trámite
       * @param tratadoAsociado - Clave del tratado asociado
       * @returns Observable con un arreglo de tratados (o vacío si no hay datos)
       */
  getRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }
  /**
   * Obtiene el catálogo de clasificaciones de régimen según el trámite y clave de régimen proporcionados.
   * @param tramitesID 
   * @param cveRegimen 
   * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
   */
  getClasificacionesRegimen(tramitesID: string,cveRegimen: string): Observable<Catalogo[]> {
    return this.catalogoServices.getClasificacionRegimen(tramitesID,cveRegimen)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene el catálogo de unidades de medida desde el servicio y lo asigna a la propiedad `unidadMedidaCatalogo`.
   *
   * @returns {void}
   */
  getUnidadMedidaCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.catalogoUnidadMedida(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene el catálogo de divisiones de fracción desde el servicio y lo asigna a la propiedad `fraccionDivisionesCatalogo`.
   *
   * @returns {void}
   */

  getFraccionDivisionesCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.catalogoFraccionDivisiones(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene el catálogo de esquema de regla desde el servicio y lo asigna a la propiedad `esquemaRegla`.
   *
   * @returns {void}
   */

  getEsquemaReglaCatalogo(tramitesID: string): Observable<Catalogo[]> {
    return this.catalogoServices.catalogoEsquemaRegla(tramitesID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene el catálogo de clasificaciones de régimen asociado a un trámite.
   * @param tramitesID Identificador del trámite
   * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
   */
  getClasificacionRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    const PAYLOAD_DATOS = { tramite: 'TITPEX.130103', id: tramitesID };
    return this.catalogoServices.clasificacionRegimenCatalogo('130103', PAYLOAD_DATOS)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de fracciones arancelarias asociado a un identificador.
   * @param ID Identificador para obtener las fracciones arancelarias
   * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
   */
  getFraccionCatalogoService(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130103')
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de unidades de medida tarifaria asociado a un identificador y fracción arancelaria.
   * @param ID Identificador para obtener las unidades de medida tarifaria
   * @param FRACCION_ID Identificador de la fracción arancelaria
   * @returns Observable con un arreglo de unidades de medida tarifaria (o vacío si no hay datos)
   */
  getUMTService(ID: string, FRACCION_ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.unidadesMedidasTarifariasCatalogo(ID, FRACCION_ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de entidades federativas asociado a un identificador.
   * @param ID Identificador para obtener las entidades federativas
   * @returns Observable con un arreglo de entidades federativas (o vacío si no hay datos)
   */
  getEntidadesFederativasCatalogo(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.entidadesFederativasCatalogo(ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   *  Obtiene el catálogo de representación federal asociado a un identificador y clave de entidad.
   * @param ID Identificador para obtener la representación federal
   * @param cveEntidad Clave de la entidad para filtrar la representación federal
   * @returns Observable con un arreglo de representación federal (o vacío si no hay datos)
   */
  getRepresentacionFederalCatalogo(ID: string, cveEntidad: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo(ID, cveEntidad).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   *  Obtiene el catálogo de todos los países seleccionados asociado a un identificador.
   * @param ID Identificador para obtener los países seleccionados
   * @returns Observable con un arreglo de países seleccionados (o vacío si no hay datos)
   */
  getTodosPaisesSeleccionados(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.todosPaisesSeleccionados(ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene la lista de bloques comerciales (tratados o acuerdos) según el trámite proporcionado.
   *
   * @param {string} tramite - Identificador del trámite o tipo de operación para la consulta del catálogo.
   * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de bloques.
   */
  getBloqueService(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.tratadosAcuerdoCatalogo(tramite, 'TITRAC.TA')
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   *  Obtiene el catálogo de mostrar partidas asociado a un trámite e identificador.
   * @param tramite Identificador del trámite
   * @param ID Identificador para obtener las mostrar partidas
   * @returns Observable con un arreglo de mostrar partidas (o vacío si no hay datos)
   */
  getMostrarPartidasService(solicitud_id: number): Observable<BaseResponse<MostrarPartidas[]>> {
    const ENDPOINT = PROC_130103.MOSTAR_PARTIDAS + solicitud_id;
    return this.http.get<BaseResponse<MostrarPartidas[]>>(ENDPOINT);
  }

  /**
 * Obtiene la lista de países asociados a un bloque comercial según el trámite y el identificador proporcionado.
 *
 * @param {string} tramite - Identificador del trámite o tipo de operación que se está realizando.
 * @param {string} ID - Identificador del bloque o parámetro necesario para la consulta.
 * @returns {Observable<Catalogo[]>} Un observable que emite un arreglo de elementos del catálogo de países.
 */
  getPaisesPorBloqueService(tramite: string, ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getpaisesBloqueCatalogo(tramite, ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Obtiene las descripciones de las fracciones arancelarias correspondientes
   * al trámite especificado y las devuelve en forma de catálogo.
   *
   * Este método consume el servicio `getFraccionesArancelariasAutoCompleteCatalogo`,
   * el cual retorna un objeto que contiene la propiedad `datos`.  
   * Si la respuesta no contiene datos válidos, se retorna un arreglo vacío.
   *
   * @param {string} tramite - Identificador del trámite para el cual se realiza la consulta.
   * @param {string} ID - Clave o término que se utilizará para filtrar la fracción arancelaria.
   *
   * @returns {Observable<Catalogo[]>} Observable que emite una lista de elementos del catálogo.
   */
  getFraccionDescripcionPartidasDeLaMercanciaService(tramite: string, ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.getFraccionesArancelariasAutoCompleteCatalogo(tramite, ID)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130103.GUARDAR, body);
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta de búsqueda especificada.
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  buscarDatosPost(body: Record<string, unknown>): Observable<unknown> {
    return this.httpService.post<unknown>(PROC_130103.BUSCAR, { body });
  }
  /**
      * Obtiene todos los datos del estado almacenado en el store.
      * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
      */
  getAllState(): Observable<Tramite130103State> {
    return this.tramite130103Query.selectSolicitud$;
  }

  /**
   * Genera el payload de datos a partir del estado del trámite 130103.
   *
   * Este método toma la información contenida en el estado (`Tramite130113State`)
   * y construye un arreglo de objetos con los valores necesarios para enviar al
   * backend, principalmente para las partidas de la mercancía.  
   *
   * Si `tableBodyData` no es un arreglo válido, se utiliza un arreglo vacío para
   * evitar errores.
   *
   * @param {Tramite130113State} item - Estado actual del trámite con la información
   *        capturada y calculada por el usuario.
   *
   * @returns {unknown} Arreglo de objetos con el payload listo para enviarse.
   */
  getPayloadDatos(item: Tramite130103State): unknown {
    const ROWS = Array.isArray(item.tableBodyData) ? item.tableBodyData : [];
    return ROWS.map(row => ({
      unidadesSolicitadas: Number(row.cantidad),
      unidadesAutorizadas: Number(item.cantidad),
      descripcionSolicitada: row.descripcion,
      descripcionAutorizada: item.descripcion,
      importeUnitarioUSD: Number(row.precioUnitarioUSD),
      importeTotalUSD: Number(row.totalUSD),
      autorizada: true,
      importeUnitarioUSDAutorizado: Number(row.precioUnitarioUSD),
      importeTotalUSDAutorizado: Number(item.valorFacturaUSD),
      fraccionArancelariaClave: item.fraccion,
      unidadMedidaClave: item.unidadMedida,
      unidadMedidaDescripcion: row.unidadDeMedida
    }));
  }

  /**
   * @description
   * Construye y devuelve el payload completo requerido para guardar la
   * información del trámite 130114.  
   * 
   * Este método toma el estado actual del trámite y lo transforma en el
   * formato esperado por el backend, incluyendo datos de mercancía,
   * productor, solicitante, representación federal y países seleccionados.
   *
   * También genera la sección `partidasMercancia` a partir del método
   * auxiliar `getPayloadDatos(item)`.
   *
   * @param {Tramite130114State} item  
   * Estado actual del trámite, del cual se extraen los valores necesarios
   * para estructurar el payload.
   *
   * @returns {unknown}  
   * Objeto con la estructura completa del payload listo para enviarse
   * al servicio correspondiente.
   */
  guardarPayloadDatos(item: Tramite130103State): unknown {
    const MERCANCIA = this.getPayloadDatos(item);
    return {
      "tipoDeSolicitud": "guardar",
      "cveRolCapturista": "PersonaMoral",
      "idTipoTramite": 130103,
      "discriminatorValue": 130103,
      "ideGenerica1": 90,
      "tipo_solicitud_pexim": item.defaultSelect,
      "mercancia": {
        "cantidadComercial": Number(item.cantidad),
        "cantidadTarifaria": Number(item.cantidad),
        "valorFacturaUSD": Number(item.valorFacturaUSD),
        "condicionMercancia": item.producto,
        "descripcion": item.descripcion,
        "usoEspecifico": item.usoEspecifico,
        "justificacionImportacionExportacion": item.justificacionImportacionExportacion,
        "observaciones": item.observaciones,
        "unidadMedidaTarifaria": {
          "clave": item.unidadMedida
        },
        "fraccionArancelaria": {
          "cveFraccion": item.fraccion
        },
        "fraccionTigiePartidasDeLaMercancia": item.fraccionDescripcionPartidasDeLaMercancia,
        "partidasMercancia": MERCANCIA,
      },
      "id_solcitud": item.idSolicitud || 0,
      "cve_regimen": item.regimen,
      "cve_clasificacion_regimen": item.clasificacion,
      "productor": {
        "tipo_persona": true,
        "nombre": "Juan",
        "apellido_materno": "López",
        "apellido_paterno": "Norte",
        "razon_social": "Aceros Norte",
        "descripcion_ubicacion": "Calle Acero, No. 123, Col. Centro",
        "rfc": "AAL0409235E6",
        "pais": "SIN"
      },
      "solicitante": {
        "actividad": "",
        "calle": "",
        "codigoPostal": "83600",
        "colonia": "OTRA NO ESPECIFICADA EN EL CATALOGO",
        "correo": "brpomskyldi@etllpqhpyrpks.zgi",
        "estado": "26",
        "lada": "Fijo",
        "localidad": "REGION ARROYO SECO",
        "municipio": "CABORCA",
        "numeroExterior": "1353",
        "numeroInterior": "",
        "pais": "ESTADOS UNIDOS MEXICANOS",
        "razonSocial": "INTEGRADORA DE URBANIZACIONES SIGNUM",
        "rfc": "MAVL621207C95",
        "telefono": ""
      },
      "representacion_federal": {
        "cve_entidad_federativa": item.entidad,
        "cve_unidad_administrativa": item.representacion
      },
      "entidades_federativas": {
        "cveEntidad": "SIN"
      },
      "usoEspecificoMercanciaRegla": {
        "fraccionArancelariaProsec": item.fraccionArancelariaProsec,
        "descripcionFraccionProsec": item.descripcionFraccionProsec,

        "gridFraccionArancelariaReglaOctava": [
          {
            "claveFraccion": "02",
            "descripcion": "TEST"
          }
        ],
        "esquemaReglaOctavaCombo": item.mercanciaEsquema,
        "justificacionImportacionExportacion": item.criterioDictamen
      },
      "lista_paises": item.fechasSeleccionadas
    };
  }

  /**
   * Actualiza los valores de mostrar para un trámite e ID de solicitud específicos.
   * @param tramite 
   * @param idSolicitud 
   * @returns 
   */
  actualizarValoresMostra<T>(tramite: number, idSolicitud: number): Observable<BaseResponse<T>> {
    const ENDPOINT = `${this.host}${PROC_130103.API_POST_MOSTRAR(tramite, idSolicitud)}`;
    return this.http.get<BaseResponse<T>>(ENDPOINT);
  }

  /**
     * Establece los valores de mostrar en el store basado en los datos proporcionados.
     * @param datos
     * @param store 
     */
  establecerValoresMostrar(datos: unknown, store: Tramite130103Store): void {

    const DATA = datos as DatosResponse;
    const DATOS_PARTIDAS_MERCANCIA = datos as {
      mercancia?: {
        partidasMercancia?: Array<{
          unidadesSolicitadas?: number;
          importeTotalUSD?: number;
          fraccionClave?: string;
          fraccionDescripcion?: string;
          candidatoEliminar?: number;
        }>;
      };
    };
    const REPRESENTACION_FEDERAL = datos as {
      representacion_federal?: {
        cve_entidad_federativa?: string;
        cve_unidad_administrativa?: string;
      };
    };
    const PROCEDENCIA = datos as {
      mercancia?: {
        usoEspecifico?: string;
        justificacionImportacionExportacion?: string;
        observaciones?: string;
      };
    };
    const USO_ESPECIFICO = datos as {
      usoEspecificoMercanciaRegla?: {
        fraccionArancelariaProsec?: string;
        descripcionFraccionProsec?: string;
        gridFraccionArancelariaReglaOctava?: Array<{
          claveFraccion?: string;
          descripcion?: string;
        }>;
        esquemaReglaOctavaCombo?: string;
      };
    };

    const PARTIDA = DATOS_PARTIDAS_MERCANCIA.mercancia?.partidasMercancia?.[0];
    const PARTIAL = {
      regimen: (datos as { cve_regimen?: string })?.cve_regimen || '',
      clasificacion: (datos as { cve_clasificacion_regimen?: string })?.cve_clasificacion_regimen || '',
      descripcion: DATA.mercancia?.descripcion || '',

      cveFraccion:
        DATA.mercancia?.fraccionArancelaria?.cveFraccion || '',

      unidadMedida:
        DATA.mercancia?.unidadMedidaTarifaria?.clave || '',

      cantidad:
        DATA.mercancia?.cantidadComercial?.toString() || '',

      valorFacturaUSD:
        DATA.mercancia?.valorFacturaUSD?.toString() || '',

      cantidadPartidasDeLaMercancia:
        (PARTIDA?.candidatoEliminar)?.toString() ?? '',

      fraccionTigiePartidasDeLaMercancia: PARTIDA?.fraccionClave || '',

      descripcionPartidasDeLaMercancia: PARTIDA?.fraccionDescripcion || '',

      valorPartidaUSDPartidasDeLaMercancia:
        PARTIDA?.importeTotalUSD !== undefined ? PARTIDA.importeTotalUSD.toString() : '',


      entidad:
        REPRESENTACION_FEDERAL.representacion_federal?.cve_entidad_federativa || '',

      representacion:
        REPRESENTACION_FEDERAL.representacion_federal?.cve_unidad_administrativa || '',

      usoEspecifico:
        PROCEDENCIA.mercancia?.usoEspecifico || '',

      justificacionImportacionExportacion:
        PROCEDENCIA.mercancia?.justificacionImportacionExportacion || '',

      observaciones:
        PROCEDENCIA.mercancia?.observaciones || '',

      fraccionArancelariaProsec:
        USO_ESPECIFICO.usoEspecificoMercanciaRegla?.fraccionArancelariaProsec || '',

      descripcionFraccionProsec:
        USO_ESPECIFICO.usoEspecificoMercanciaRegla?.descripcionFraccionProsec || '',

      mercanciaEsquema:
        typeof USO_ESPECIFICO.usoEspecificoMercanciaRegla?.gridFraccionArancelariaReglaOctava === 'string'
          ? USO_ESPECIFICO.usoEspecificoMercanciaRegla?.gridFraccionArancelariaReglaOctava
          : '',

      criterioDictamen:
        USO_ESPECIFICO.usoEspecificoMercanciaRegla?.esquemaReglaOctavaCombo,

    }
    store.update(state => ({
      ...state,
      ...PARTIAL
    }));
  }


}
