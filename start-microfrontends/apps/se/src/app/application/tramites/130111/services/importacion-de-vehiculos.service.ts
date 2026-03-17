import { Catalogo, CatalogoServices, JSONResponse, MostrarPartidas } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { Tramite130111State, Tramite130111Store } from '../../../estados/tramites/tramites130111.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130111 } from '../servers/api-route';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { Tramite130111Query } from '../../../estados/queries/tramite130111.query';

/**
 * Servicio para gestionar la importación de vehículos.
 * Este servicio proporciona métodos para obtener datos relacionados con la importación de vehículos,
 * como listas de países, entidades federativas, representaciones federales y opciones de productos.
 */
@Injectable({
  providedIn: 'root',
})
export class ImportacionDeVehiculosService {
  /**
   * Constructor del servicio.
   * Servicio HttpClient para realizar solicitudes HTTP.
   */
  constructor(private http: HttpClient, private tramite130111Store: Tramite130111Store, public catalogoServices: CatalogoServices, public tramite130111Query: Tramite130111Query) {
    //
  }

  /**
   * Obtiene la lista de países disponibles desde un archivo JSON.
   * Un observable que emite una lista de países.
   */
  getListaDePaisesDisponibles(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('/assets/json/130111/pais-procenia.json');
  }

  /**
   * Obtiene la lista de países por bloque desde un archivo JSON.
   * El ID del bloque.
   * Un observable que emite una lista de países agrupados por bloque.
   */
  getPaisesPorBloque(_bloqueId: number): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130111/paises-por-bloque.json'
    );
  }

  /**
   * Obtiene la lista de entidades federativas desde un archivo JSON.
   * Un observable que emite una lista de entidades federativas.
   */
  getEntidadFederativa(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130111/entidad-federativa.json'
    );
  }

  /**
   * Obtiene la lista de representaciones federales desde un archivo JSON.
   * Un observable que emite una lista de representaciones federales.
   */
  getRepresentacionFederal(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(
      '/assets/json/130111/representacion-federal.json'
    );
  }

  /**
   * Obtiene las opciones de solicitud desde un archivo JSON.
   * Un observable que emite las opciones de solicitud.
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130111/solicitude-options.json'
    );
  }

  /**
   * Obtiene las opciones de producto desde un archivo JSON.
   * Un observable que emite las opciones de producto.
   */
  getProductoOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130111/producto-otions.json'
    );
  }

  /**
   * Obtiene los datos de la tabla de partidas de la mercancía desde un archivo JSON local.
   * Un observable que emite un arreglo de modelos de partidas de la mercancía.
   */
  getTablaDatos(): Observable<PartidasDeLaMercanciaModelo[]> {
    return this.http.get<PartidasDeLaMercanciaModelo[]>(
      'assets/json/130111/partidas-de-la.json'
    );
  }
  /**
 * Actualiza el estado del formulario en el store.
 * @param DATOS Estado actualizado del trámite.
 */
  actualizarEstadoFormulario(DATOS: Tramite130111State): void {
    this.tramite130111Store.actualizarEstado(DATOS);
  }
  /**
 * Obtiene los datos de la solicitud.
 * @returns Observable con los datos de la solicitud.
 */
  getDatosDeLaSolicitud(): Observable<Tramite130111State> {
    return this.http.get<Tramite130111State>('assets/json/130111/datos-de-la-solicitud.json');
  }


  /**
     * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
     *
     * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
     * @returns Observable con la respuesta de la solicitud POST.
     */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130111.GUARDAR, body);
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
   * Obtiene el catálogo de clasificaciones de régimen asociado a un trámite.
   * @param tramitesID Identificador del trámite
   * @returns Observable con un arreglo de clasificaciones de régimen (o vacío si no hay datos)
   */
  getClasificacionRegimenCatalogo(tramitesID: string): Observable<Catalogo[]> {
    const PAYLOAD_DATOS = { tramite: 'TITPEX.130111', id: tramitesID };
    return this.catalogoServices.clasificacionRegimenCatalogo('130111', PAYLOAD_DATOS)
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
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130111')
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
    return this.catalogoServices.unidadesMedidaTarifariaCatalogo(ID, FRACCION_ID)
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
  getMostrarPartidasService(tramite: string, ID: number): Observable<MostrarPartidas[]> {
    return this.catalogoServices.mostrarPartidasSolicitud(tramite, ID)
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
     * Obtiene todos los datos del estado almacenado en el store.
     * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
     */
  getAllState(): Observable<Tramite130111State> {
    return this.tramite130111Query.selectSolicitud$;
  }

  /**
   * Construye las partidas de mercancía a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con las partidas de mercancía construidas
   */
 buildPartidasMercancia(item: Tramite130111State): unknown {
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
  buildMercancia(item: Tramite130111State): unknown {
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
      rfc: "AAL0409235E6",
      pais: "SIN"
    };
  }

  /**
   * Construye la información del solicitante.
   * @returns Objeto con la información del solicitante
   */
  buildSolicitante(): unknown {
    return {
      rfc: "AAL0409235E6",
      nombre: "Juan Pérez",
      es_persona_moral: true,
      certificado_serial_number: ""
    };
  }

  /** Construye la información de la representación federal a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de la representación federal construida
   */
  buildRepresentacionFederal(item: Tramite130111State): unknown {
    return {
      cve_entidad_federativa: item.entidad,
      cve_unidad_administrativa: item.representacion
    };
  }

  /** Construye la información de las entidades federativas a partir del estado del trámite.
   * @param item Estado del trámite
   * @returns Objeto con la información de las entidades federativas construida
   */
  buildEntidadesFederativas(item: Tramite130111State): unknown {
    return {
      cveEntidad: item.entidad
    };
  }


}