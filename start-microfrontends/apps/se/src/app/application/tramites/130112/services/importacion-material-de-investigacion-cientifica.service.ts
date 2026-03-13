import { Catalogo, CatalogoServices, HttpCoreService, JSONResponse, LoginQuery } from '@ng-mf/data-access-user';
import { Observable, Subject, map, takeUntil} from 'rxjs';
import { Tramite130112State, Tramite130112Store } from '../estados/tramites/tramites130112.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130112 } from '../servers/api-route';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { Tramite130112Query } from '../estados/queries/tramite130112.query';

/**
 * @descripcion
 * Servicio que proporciona métodos para obtener datos relacionados con el trámite de importación
 * de material de investigación científica. Este servicio realiza solicitudes HTTP para obtener
 * datos desde archivos JSON estáticos.
 *
 * @decorador @Injectable
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionMaterialDeInvestigacionCientificaService {
  // Valor de RFC de ejemplo
  private loginRfc: string = '';

  /**
   * @property {Subject<void>} destroyed$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();
  /**
   * @descripcion
   * Constructor del servicio. Inyecta el cliente HTTP para realizar solicitudes.
   * @param {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient, private tramite130112Store:Tramite130112Store, private catalogoServices: CatalogoServices, private httpService: HttpCoreService, private query: Tramite130112Query, private loginQuery: LoginQuery) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
  }

  /** Obtiene el catálogo de bloques para el trámite especificado.  
 *  @param {string} tramite - El identificador del trámite.
 *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de bloques.
 */
  getBloque(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.tratadosAcuerdoCatalogo(tramite, "TITRAC.TA").pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene la lista de países por bloque desde un archivo JSON.
   * @param {number} _bloqueId - El ID del bloque.
   * @returns {Observable<Catalogo[]>}
   */
  getPaisesPorBloque(tramite: string, _bloqueId: string): Observable<Catalogo[]> {
    return this.catalogoServices.getpaisesBloqueCatalogo(tramite, _bloqueId).pipe(
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
   * @descripcion
   * Obtiene la lista de representaciones federales desde un archivo JSON.
   * @returns {Observable<Catalogo[]>} Observable que emite la lista de representaciones federales.
   */
  getRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130112/representacion-federal.json'
    );
  }

  /**
   * @descripcion
   * Obtiene las opciones de solicitud desde un archivo JSON.
   * @returns {Observable<ProductoResponse>} Observable que emite las opciones de solicitud.
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130112/solicitude-options.json'
    );
  }

  /**
   * @descripcion
   * Obtiene las opciones de producto desde un archivo JSON.
   * @returns {Observable<ProductoResponse>} Observable que emite las opciones de producto.
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130112/producto-options.json'
    );
  }

  /**
   * @descripcion
   * Obtiene la lista de partidas de la mercancía desde un archivo JSON.
   * @returns {Observable<PartidasDeLaMercanciaModelo[]>} Observable que emite la lista de partidas.
   */
  getTablaDatos(): Observable<PartidasDeLaMercanciaModelo[]> {
      return this.http.get<PartidasDeLaMercanciaModelo[]>(
            'assets/json/130112/partidas-de-la.json'
          );
    }
    
  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite130112State): void {
    this.tramite130112Store.actualizarEstado(DATOS);
  }

  /**
   * Obtiene los datos de una solicitud específica.
   * @param idSolicitud Identificador de la solicitud a obtener.
   * @returns Observable con la respuesta JSON de la solicitud.
   */
  getDatosDeLaSolicitud(idSolicitud: number): Observable<JSONResponse> {
    const ENDPOINT = PROC_130112.MOSTRAR + idSolicitud;
    return this.http.get<JSONResponse>(ENDPOINT);
  }

  /** Obtiene el catálogo de regímenes para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de regímenes.
   */
  getRegimenes(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /** Obtiene el catálogo de clasificaciones de régimen para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de clasificaciones de régimen.
   */
  getRegimenClasificacion(tramite: string, cveClasificacion: string): Observable<Catalogo[]> {
    return this.catalogoServices.getClasificacionRegimen(tramite, cveClasificacion).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /** Obtiene el catálogo de fracciones arancelarias para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de fracciones arancelarias.
   */
  getFraccionesArancelarias(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.fraccionesArancelariasCatalogo(tramite, "TITPEX.130112").pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene la descripción de la fracción para las partidas de la mercancía.
   * @param tramite Identificador del trámite
   * @param ID Identificador de la fracción
   * @returns Observable con un arreglo de descripciones de fracciones (o vacío si no hay datos)
   */
  getFraccionDescripcionPartidasDeLaMercanciaService(tramite: string, ID: string): Observable<Catalogo[]> {
  return this.catalogoServices.getFraccionesArancelariasAutoCompleteCatalogo(tramite, ID)
    .pipe(
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
   * Obtiene el catálogo de todos los países seleccionados asociado a un identificador.
   * @param ID Identificador para obtener los países seleccionados
   * @returns Observable con un arreglo de países seleccionados (o vacío si no hay datos)
   */
  getTodosPaisesSeleccionados(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.todosPaisesSeleccionados(ID).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Guarda los datos del trámite mediante una solicitud POST.
   * @param body Cuerpo de la solicitud con los datos a guardar.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<JSONResponse> {
    return this.httpService.post<JSONResponse>(PROC_130112.GUARDAR, {
      body: body,
    });
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130112State> {
    return this.query.selectSolicitud$;
  }

  /** Obtiene el catálogo de unidades de medida para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de unidades de medida.
   */
  getUMTCatalogo(tramite: string, FRACCION_ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.unidadesMedidaTarifariaCatalogo(tramite, "98060002").pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene la lista completa de países desde el servidor.
   * @param tramite Identificador del trámite o tipo de operación para la consulta del catálogo.
   * @returns Observable con un arreglo de elementos del catálogo de países.
   */
  getPaisesTodoService(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.todosPaisesSeleccionados(tramite)
      .pipe(
        map(res => res?.datos ?? [])
      );
  }

  /**
   * Genera el payload de datos para las partidas de la mercancía.
   * @param item Estado del trámite
   * @returns Objeto con el payload de datos generado
   */
  getPayloadDatos(item: Tramite130112State): unknown {
    const ROWS = Array.isArray(item.tableBodyData) ? item.tableBodyData : [];
    return ROWS.map(row => ({
      unidadesSolicitadas: Number(row.cantidad),
      unidadesAutorizadas: Number(item.cantidadPartidasDeLaMercancia),
      descripcionSolicitada: row.descripcion,
      descripcionAutorizada: item.descripcion,
      importeUnitarioUSD: Number(row.precioUnitarioUSD),
      importeTotalUSD: Number(row.totalUSD),
      autorizada: true,
      importeUnitarioUSDAutorizado: Number(row.precioUnitarioUSD),
      importeTotalUSDAutorizado: Number(item.valorFacturaUSD),
      fraccionArancelariaClave: item.fraccion,
      unidadMedidaClave: item.unidadMedida
    }));
  }

  /**
   * Construye la información de la mercancía a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de la mercancía construida
   */
  buildMercancia(item: Tramite130112State): unknown {
    return {
      cantidadComercial: Number(item.cantidad),
      cantidadTarifaria: Number(item.cantidad),
      valorFacturaUSD: Number(item.valorFacturaUSD),
      descripcion: item.descripcion,
      condicionMercancia: item.producto,
      usoEspecifico: item.usoEspecifico,
      justificacionImportacionExportacion: item.justificacionImportacionExportacion,
      observaciones: item.observaciones,
      unidadMedidaTarifaria: { clave: item.unidadMedida },
      fraccionArancelaria: { cveFraccion: item.fraccion },
      partidasMercancia: this.getPayloadDatos(item)
    };
  }

  /** Construye la información del productor.
   * @returns Objeto con la información del productor
   */
  buildProductor(): unknown {
    return {
      tipo_persona: true,
      nombre: "Juan",
      apellido_materno: "López",
      apellido_paterno: "Norte",
      razon_social: "Aceros Norte",
      descripcion_ubicacion: "Calle Acero, No. 123, Col. Centro",
      rfc: this.loginRfc,
      pais: "SIN"
    };
  }

  /**
   * Construye la información del solicitante.
   * @returns Objeto con la información del solicitante
   */
  buildSolicitante(): unknown {
    return {
      rfc: this.loginRfc,
      nombre: "Juan Pérez",
      es_persona_moral: true,
      certificado_serial_number: ""
    };
  }

  /** Construye la información de la representación federal a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de la representación federal construida
   */
  buildRepresentacionFederal(item: Tramite130112State): unknown {
    return {
      cve_entidad_federativa: item.entidad,
      cve_unidad_administrativa: item.representacion
    };
  }

  /** Construye la información de las entidades federativas a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de las entidades federativas construida
   */
  buildEntidadesFederativas(item: Tramite130112State): unknown {
    return {
      cveEntidad: item.entidad
    };
  }

  /**
   * Convierte los datos obtenidos de la solicitud en el formato del estado del trámite.
   * @param built Datos obtenidos de la solicitud.
   * @returns Objeto con los datos convertidos al formato del estado del trámite.
   */
  reverseBuildSolicitud130112(built: Record<string, unknown>
  ): Record<string, unknown> {
    const MERCANCIA = built['mercancia'] as Record<string, unknown> ?? {};
    const PARTIDAS_MERCANCIA = MERCANCIA?.['partidasMercancia'] as Record<string, unknown>[] ?? [];
    const REPRESENTACION_FEDERAL = built['representacion_federal'] as Record<string, unknown> ?? {};

    const TOTAL_CANTIDAD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['unidadesSolicitadas']) || 0);
    }, 0);

    const TOTAL_VALOR_USD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['importeTotalUSDAutorizado']) || 0);
    }, 0);

    return {
      solicitud: built['tipo_solicitud_pexim'],
      regimen: built['cve_regimen'],
      clasificacion: built['cve_clasificacion_regimen'],
      producto: MERCANCIA?.['condicionMercancia'],
      descripcion: MERCANCIA?.['descripcion'],
      fraccion: (MERCANCIA?.['fraccionArancelaria'] as Record<string, unknown>)?.['cveFraccion'],
      cantidad: MERCANCIA?.['cantidadTarifaria'],
      valorFacturaUSD: MERCANCIA?.['valorFacturaUSD'],
      unidadMedida: (MERCANCIA?.['unidadMedidaTarifaria'] as Record<string, unknown>)?.['clave'],

      cantidadPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      fraccionTigiePartidasDeLaMercancia: '',
      fraccionDescripcionPartidasDeLaMercancia: '',
      tableBodyData: this.reverseMapPartidasDeLaMercancia(PARTIDAS_MERCANCIA),
      cantidadTotal: TOTAL_CANTIDAD.toString(),
      valorTotalUSD: TOTAL_VALOR_USD.toString(),
      bloque: '',
      fechasSeleccionadas: built['lista_paises'] ?? [],
      usoEspecifico: MERCANCIA?.['usoEspecifico'] ?? '',
      justificacionImportacionExportacion: MERCANCIA?.['justificacionImportacionExportacion'] ?? '',
      observaciones: MERCANCIA?.['observaciones'] ?? '',
      entidad: REPRESENTACION_FEDERAL?.['cve_entidad_federativa'] ?? '',
      representacion: REPRESENTACION_FEDERAL?.['cve_unidad_administrativa'] ?? '',
    }
  }

  /**
   * Convierte los datos de las partidas de la mercancía al formato del estado del trámite.
   * @param datos Datos de las partidas de la mercancía. 
   * @returns Objeto con los datos convertidos al formato del estado del trámite.
   */
  reverseMapPartidasDeLaMercancia(datos: Record<string, unknown>[]
  ): Record<string, unknown>[] {
    const PARTIDAS_MERCANCIAS = datos?.map((item: Record<string, unknown>, index: number) => ({
      id: index.toString() ?? '',
      cantidad: (item['unidadesSolicitadas'] as string) ?? '',
      unidadDeMedida: (item['unidadMedidaDescripcion'] as string) ?? '',
      fraccionFrancelaria: (item['fraccionArancelariaDescripcion'] as string) ?? '',
      descripcion: (item['descripcionSolicitada'] as string) ?? '',
      precioUnitarioUSD: (item['importeUnitarioUSDAutorizado'] as string) ?? '',
      totalUSD: (item['importeTotalUSDAutorizado'] as string) ?? '',
      fraccionTigiePartidasDeLaMercancia: (item['unidadesAutorizadas'] as string) ?? '',
      fraccionDescripcionPartidasDeLaMercancia: (item['descripcionAutorizada'] as string) ?? '',
    })) ?? [];

    return PARTIDAS_MERCANCIAS;
  }
}