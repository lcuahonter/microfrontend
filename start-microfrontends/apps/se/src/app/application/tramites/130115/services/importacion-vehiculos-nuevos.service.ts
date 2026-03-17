/**
 * ImportacionVehiculosNuevosService
 */
import { Catalogo, CatalogoServices, JSONResponse, LoginQuery } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';

import { Tramite130115State, Tramite130115Store } from '../../../estados/tramites/tramite130115.store';
import { PROC_130115 } from '../servers/api-route';
import { Subject } from 'rxjs';
import { Tramite130115Query } from '../../../estados/queries/tramite130115.query';
import { takeUntil } from 'rxjs';
@Injectable({
  providedIn: 'root',
})

export class ImportacionVehiculosNuevosService {
  // Valor de RFC de ejemplo
  private loginRfc: string = '';

  /**
   * @property {Subject<void>} destroyed$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();
  /**
   * Crea una nueva instancia del servicio ImportacionVehiculosNuevosService.
   * 
   * @param http Servicio HttpClient para realizar solicitudes HTTP.
   * @param tramite130115Store Almacén para gestionar el estado del trámite 130115.
   * @param catalogoServices Servicio para acceder a los catálogos de datos.
   * @param query Consulta para obtener información del trámite 130115.
   */
  constructor(private http: HttpClient,private tramite130115Store: Tramite130115Store, private catalogoServices: CatalogoServices, private query: Tramite130115Query, private loginQuery: LoginQuery) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.loginRfc = seccionState.rfc;
        })
      )
      .subscribe();
  }
  
  /**
   * Obtiene la lista de países disponibles desde un archivo JSON.
   * @returns {Observable<Catalogo[]>}
   */
  getListaDePaisesDisponibles(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130115/pais-procenia.json');
  }
  /**
   * Obtiene la lista de países por bloque desde un archivo JSON.
   * @param {number} _bloqueId - El ID del bloque.
   * @returns {Observable<Catalogo[]>}
   */
  getPaisesPorBloque(_bloqueId: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130115/paises-por-bloque.json'
    );
  }
  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON.
   * @returns {Observable<Catalogo[]>}
   */
  getEntidadFederativa(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130115/entidad-federativa.json'
    );
  }

  /**
   * Obtiene las opciones de solicitud desde un archivo JSON.
   * @returns {Observable<ProductoResponse>}
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130115/solicitude-options.json'
    );
  }

  /**
   * Obtiene las opciones de producto desde un archivo JSON.
   * @returns {Observable<ProductoResponse>}
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130115/producto-otions.json'
    );
  }

       /**
   * Actualiza el estado del formulario en el store.
   * @param DATOS Estado actualizado del trámite.
   */
  actualizarEstadoFormulario(DATOS: Tramite130115State): void {
      this.tramite130115Store.actualizarEstado(DATOS);
  }
  /**
 * Obtiene los datos de la solicitud.
 * @returns Observable con los datos de la solicitud.
 */
getDatosDeLaSolicitud(): Observable<Tramite130115State> {
    return this.http.get<Tramite130115State>('assets/json/130115/datos-de-la-solicitud.json');
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

  /** Obtiene el catálogo de regímenes para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de regímenes.
   */
  getRegimenes(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.regimenesCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   *  Obtiene el catálogo de fracciones arancelarias asociado a un identificador.
   * @param ID Identificador para obtener las fracciones arancelarias
   * @returns Observable con un arreglo de fracciones arancelarias (o vacío si no hay datos)
   */
  getFraccionCatalogoService(ID: string): Observable<Catalogo[]> {
    return this.catalogoServices.fraccionesArancelariasCatalogo10(ID, 'TITPEX.130115')
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
    return this.catalogoServices.unidadesMedidaTarifariaCatalogo10(ID, FRACCION_ID)
      .pipe(
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
   *  Obtiene el catálogo de representación federal asociado a un identificador y clave de entidad.
   * @param ID Identificador para obtener la representación federal
   * @param cveEntidad Clave de la entidad para filtrar la representación federal
   * @returns Observable con un arreglo de representación federal (o vacío si no hay datos)
   */
  getRepresentacionFederalCatalogo(ID: string, cveEntidad: string): Observable<Catalogo[]> {
    return this.catalogoServices.representacionFederalCatalogo10(ID, cveEntidad).pipe(
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
     * Obtiene todos los datos del estado almacenado en el store.
     * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
     */
  getAllState(): Observable<Tramite130115State> {
    return this.query.selectSolicitud$;
  }

  /**
     * Construye las partidas de mercancía a partir del estado del trámite.
     * @param item Estado del trámite
     * @returns Objeto con las partidas de mercancía construidas
     */
   buildPartidasMercancia(item: Tramite130115State): unknown {
    const ROWS = Array.isArray(item.tableBodyData) ? item.tableBodyData : [];
    return ROWS.map(row => ({
      unidadesSolicitadas: Number(row.cantidad),
      unidadesAutorizadas: Number(item.cantidadPartidasDeLaMercancia),
      descripcionSolicitada: row.descripcion,
      descripcionAutorizada: item.descripcionPartidasDeLaMercancia,
      importeUnitarioUSD: Number(row.precioUnitarioUSD),
      importeTotalUSD: Number(row.totalUSD),
      autorizada: true,
      importeUnitarioUSDAutorizado: Number(row.precioUnitarioUSD),
      importeTotalUSDAutorizado: Number(item.valorPartidaUSDPartidasDeLaMercancia),
      fraccionArancelariaClave: item.fraccion,
      unidadMedidaClave: item.unidadMedida
    }));
  }
  
  
  /**
   * Construye la información de la mercancía a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de la mercancía construida
   */
  buildMercancia(item: Tramite130115State): unknown {
    return {
      cantidadComercial: 0,
      cantidadTarifaria: Number(item.cantidad),
      valorFacturaUSD: Number(item.valorFacturaUSD),
      descripcion: item.descripcion,
      condicionMercancia: item.producto,
      usoEspecifico: item.usoEspecifico,
      justificacionImportacionExportacion: item.justificacionImportacionExportacion,
      observaciones: item.observaciones,
      unidadMedidaTarifaria: { clave: item.unidadMedida },
      fraccionArancelaria: { cveFraccion: item.fraccion },
      partidasMercancia: this.buildPartidasMercancia(item)
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
  buildRepresentacionFederal(item: Tramite130115State): unknown {
    return {
      cve_entidad_federativa: item.entidad,
      cve_unidad_administrativa: item.representacion
    };
  }

  /** Construye la información de las entidades federativas a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de las entidades federativas construida
   */
  buildEntidadesFederativas(item: Tramite130115State): unknown {
    return {
      cveEntidad: "DGO"
    };
  }

  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     *
     * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130115.GUARDAR, body);
  }
}
