import { Catalogo, CatalogoServices, JSONResponse } from '@ng-mf/data-access-user';
import { Observable, map } from 'rxjs';
import { Tramite130217State, Tramite130217Store } from '../../../estados/tramites/tramite130217.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130217 } from '../servers/api-route';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { Tramite130217Query } from '../../../estados/queries/tramite130217.query';

@Injectable({
  providedIn: 'root',
})
export class ControlPermisosPreviosExportacionService {
  constructor(
    private http: HttpClient,
    private tramite130217Store: Tramite130217Store,
    private tramite130217Query: Tramite130217Query,
    private catalogoServices: CatalogoServices
  ) {
    //
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130217State> {
    return this.tramite130217Query.selectSolicitud$;
  }

  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Tramite130217State): void {
    this.tramite130217Store.actualizarEstado(DATOS);
  }

  /**
    * Obtiene el catálogo de tratados/acuerdos asociados a un trámite.
    * @param tramitesID - Identificador del trámite
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
  getClasificacionRegimenCatalogo(ID: string, CLASSIFICACIONES_REGIMEN: string): Observable<Catalogo[]> {    
    return this.catalogoServices.getClasificacionRegimen(ID, CLASSIFICACIONES_REGIMEN)
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
    return this.catalogoServices.fraccionesArancelariasCatalogo(ID, 'TITPEX.130217').pipe(
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
   * Obtiene las opciones de solicitud desde un archivo JSON.
   * @returns {Observable<ProductoResponse>}
   */
  getSolicitudeOptions(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      'assets/json/130217/solicitude-options.json'
    );
  }

  /**
   * Envía los datos proporcionados mediante una solicitud HTTP POST a la ruta especificada.
   *
   * @param body - Objeto que contiene los datos a enviar en el cuerpo de la solicitud.
   * @returns Observable con la respuesta de la solicitud POST.
   */
  guardarDatosPost(body: Record<string, unknown>): Observable<JSONResponse> {
    return this.http.post<JSONResponse>(PROC_130217.GUARDAR, body);
  }
  /**
   * Genera el payload de datos de las partidas de mercancía basado en el estado del trámite.
   * @param item - Estado actual del trámite 130217
   * @returns Array con los datos procesados de las partidas
   */
  getPayloadDatos(item: Tramite130217State): unknown {
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
      unidadMedidaClave: item.unidadMedida
    }));
  }

  /**
   * Genera el payload de mercancía para el trámite 130217.
   * @param item - Estado actual del trámite 130217
   * @returns Objeto con los datos de mercancía formateados
   */
  getPayloadMercancia(item: Tramite130217State): unknown {
    return {
      "cantidadComercial": 0,
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
      "partidasMercancia": this.getPayloadDatos(item),
    };
  }

  /**
   * Genera el payload de productor para el trámite 130217.
   * @returns Objeto con los datos del productor
   */
  getPayloadProductor(): unknown {
    return {
      "tipo_persona": true,
      "nombre": "Juan",
      "apellido_materno": "López",
      "apellido_paterno": "Norte",
      "razon_social": "Aceros Norte",
      "descripcion_ubicacion": "Calle Acero, No. 123, Col. Centro",
      "rfc": "AAL0409235E6",
      "pais": "SIN"
    };
  }

  /**
   * Genera el payload de solicitante para el trámite 130217.
   * @returns Objeto con los datos del solicitante
   */
  getPayloadSolicitante(): unknown {
    return {
      "rfc": "AAL0409235E6",
      "nombre": "Juan Pérez",
      "es_persona_moral": true,
      "certificado_serial_number": "string"
    };
  }

  /**
   * Genera el payload de representación federal para el trámite 130217.
   * @param item - Estado actual del trámite 130217
   * @returns Objeto con los datos de representación federal
   */
  getPayloadRepresentacionFederal(item: Tramite130217State): unknown {
    return {
      "cve_entidad_federativa": item.entidad,
      "cve_unidad_administrativa": item.representacion
    };
  }

  /**
   * Genera el payload de entidad federativa para el trámite 130217.
   * @param item - Estado actual del trámite 130217
   * @returns Objeto con los datos de entidad federativa
   */
  getPayloadEntidadFederativa(item: Tramite130217State): unknown {
    return {
      "cveEntidad": item.entidad
    };
  }

}
