import { Catalogo, CatalogoServices, JSONResponse } from '@libs/shared/data-access-user/src';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ImportacionesAgropecuariasState } from '../estados/importaciones-agropecuarias.store';
import { Injectable } from '@angular/core';
import { PROC_130107 } from '../servers/api-route';
import { Tramite130107Query } from '../../../estados/queries/tramite130107.query';
import { Tramite130107Store } from '../../../estados/tramites/tramite130107.store';

/**
 * @Injectable
 * @providedIn root
 * @description
 * Decorador que marca la clase `DatosDeLaSolicitudService` como un servicio inyectable en Angular.
 */
@Injectable({
  providedIn: 'root'
})
export class DatosDeLaSolicitudService {

  /**
   * @constructor
   * @description
   * Constructor del servicio `RegistroDeSolicitudService`.
   * Inyecta el servicio HttpClient para realizar peticiones HTTP y el store para manejar el estado de cancelación.
   * @param {HttpClient} http - Servicio de Angular para realizar solicitudes HTTP.
   * @param {CancelacionStore} cancelacionStore - Store para manejar el estado del cancelacionStore.
   */
  constructor(private http: HttpClient, 
    private catalogoServices: CatalogoServices, 
    private tramite130107Store: Tramite130107Store,
    private tramite130107Query: Tramite130107Query) {
    // Lógica de inicialización si es necesario
  }

  /**
   * @method getImportacionDefinitivaData
   * @description
   * Obtiene los datos de importación definitiva desde un archivo JSON local.
   * Realiza una petición HTTP GET y retorna un observable con el estado de cancelación.
   * @returns {Observable<CancelacionState>} Observable con los datos del estado de cancelación.
   */
  getImportacionDefinitivaData(): Observable<ImportacionesAgropecuariasState> {
    return this.http.get<ImportacionesAgropecuariasState>('assets/json/130107/solicitud-datos.json');
  }

  // /**
  //  * @method actualizarEstadoFormulario
  //  * @description
  //  * Actualiza el valor de un campo específico en el store `CancelacionStore` de manera dinámica.
  //  * 
  //  * Detalles:
  //  * - Utiliza el método `setDynamicFieldValue` del store para modificar el valor del campo indicado.
  //  * - Permite mantener sincronizado el estado global del trámite con los cambios realizados en el formulario.
  //  * 
  //  * @param {string} campo - Nombre del campo que se desea actualizar en el store.
  //  * @param {unknown} valor - Valor que se asignará al campo especificado.
  //  * 
  //  * @example
  //  * this.actualizarEstadoFormulario('pais', 'México');
  //  * // Actualiza el campo 'pais' en el store con el valor 'México'.
  //  */
  // actualizarEstadoFormulario(campo: string, valor: unknown): void {
  //   this.importacionesAgropecuariasStore.setDynamicFieldValue(
  //     campo,
  //     valor as string | number | boolean | null | undefined
  //   );
  // }

  /**
     *  Obtiene el catálogo de mostrar partidas asociado a un trámite e identificador.
     * @param tramite Identificador del trámite
     * @param ID Identificador para obtener las mostrar partidas
     * @returns Observable con un arreglo de mostrar partidas (o vacío si no hay datos)
     */
  getMostrarPartidasService(solicitud_id: number): Observable<JSONResponse> {
    const ENDPOINT = PROC_130107.MOSTAR_PARTIDAS + solicitud_id;
    return this.http.get<JSONResponse>(ENDPOINT);
  }

  /**
 * Construye el estado del trámite a partir de los datos proporcionados.
 * @param DATOS Datos obtenidos del servicio.
 * @returns Estado del trámite construido.
 */
  reverseBuildSolicitud130113(DATOS: Record<string, unknown[]>): Record<string, unknown> {
    const REPRESENTACION_FEDERAL = DATOS['representacionFederal'] as unknown as Record<string, unknown>;
    const MERCANCIAS_DATA = DATOS['mercancia'] as unknown as Record<string, unknown>;
    const PARTIDAS_MERCANCIA = (MERCANCIAS_DATA?.['partidasMercancia'] as Record<string, unknown>[] | undefined) ?? [];

    const PARTIDAS_MERCANCIA_DATOS = PARTIDAS_MERCANCIA?.map((item: Record<string, unknown>, index: number) => ({
      id: index.toString(),
      cantidad: (item['unidadesSolicitadas'] as string),
      unidadDeMedida: (item['unidadMedidaDescripcion'] as string),
      fraccionFrancelaria: (item['fraccionArancelariaClave'] as string),
      descripcion: (item['descripcionSolicitada'] as string),
      precioUnitarioUSD: (item['importeUnitarioUSDAutorizado'] as string),
      totalUSD: (item['importeTotalUSDAutorizado'] as string),
      fraccionTigiePartidasDeLaMercancia: (item['unidadesAutorizadas'] as string),
      fraccionDescripcionPartidasDeLaMercancia: (item['descripcionAutorizada'] as string),
    })) ?? [];

    const TOTAL_CANTIDAD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['unidadesSolicitadas']) || 0);
    }, 0);

    const TOTAL_VALOR_USD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['importeTotalUSDAutorizado']) || 0);
    }, 0);

    return {
      idSolicitud: DATOS?.['idSolicitud'] as unknown as number || 0,
      filaSeleccionada: [],
      mostrarTabla: false,
      solicitud: (DATOS?.['tipo_solicitud_pexim'] as unknown as string) || '',
      fraccion: (MERCANCIAS_DATA?.['fraccionArancelaria'] as Record<string, unknown>)?.['cveFraccion'] as string || '',
      producto: (MERCANCIAS_DATA?.['condicionMercancia'] as unknown as string) || '',
      descripcion: PARTIDAS_MERCANCIA[0]['descripcionSolicitada'] as string || '',
      cantidad: PARTIDAS_MERCANCIA[0]['unidadesAutorizadas'] as string || '',
      valorPartidaUSD: 0,
      unidadMedida: PARTIDAS_MERCANCIA[0]['unidadMedidaClave'] as string || '',
      regimen: (DATOS?.['cve_regimen'] as unknown as string) || '',
      clasificacion: (DATOS?.['cve_clasificacion_regimen'] as unknown as string) || '',
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      valorFacturaUSD: PARTIDAS_MERCANCIA[0]['importeTotalUSD'] as string || '',
      bloque: '',
      usoEspecifico: MERCANCIAS_DATA?.["usoEspecifico"] as string || '',
      justificacionImportacionExportacion: MERCANCIAS_DATA?.["justificacionImportacionExportacion"] as string || '',
      observaciones: MERCANCIAS_DATA?.["observaciones"] as string || '',
      entidad: REPRESENTACION_FEDERAL['cve_entidad_federativa'] as string || '',
      representacion: REPRESENTACION_FEDERAL['cve_unidad_administrativa'] as string || '',
      modificarPartidasDelaMercanciaForm: {
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
      },
      mostrarPartidas: [],
      cantidadTotal: TOTAL_CANTIDAD.toString(),
      valorTotalUSD: TOTAL_VALOR_USD.toString(),
      fechasSeleccionadas: DATOS?.['listaPaises'] as unknown as string[] || [],
      tableBodyData: PARTIDAS_MERCANCIA_DATOS || [],
    };
  }

  /**
   * Actualiza el estado del formulario en el store.
   * @param DATOS Estado actualizado del trámite.
   */
  actualizarEstadoFormulario(DATOS: Record<string, unknown[]>): void {
    const REPRESENTACION_FEDERAL = DATOS['representacionFederal'] as unknown as Record<string, unknown>;
    const MERCANCIAS_DATA = DATOS['mercancia'] as unknown as Record<string, unknown>;
    const PARTIDAS_MERCANCIA = (MERCANCIAS_DATA?.['partidasMercancia'] as Record<string, unknown>[] | undefined) ?? [];

    const PARTIDAS_MERCANCIA_DATOS = PARTIDAS_MERCANCIA?.map((item: Record<string, unknown>, index: number) => ({
      id: index.toString(),
      cantidad: (item['unidadesSolicitadas'] as string),
      unidadDeMedida: (item['unidadMedidaDescripcion'] as string),
      fraccionFrancelaria: (item['fraccionArancelariaClave'] as string),
      descripcion: (item['descripcionSolicitada'] as string),
      precioUnitarioUSD: (item['importeUnitarioUSDAutorizado'] as string),
      totalUSD: (item['importeTotalUSDAutorizado'] as string),
      fraccionTigiePartidasDeLaMercancia: (item['unidadesAutorizadas'] as string),
      fraccionDescripcionPartidasDeLaMercancia: (item['descripcionAutorizada'] as string),
    })) ?? [];

    const TOTAL_CANTIDAD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['unidadesSolicitadas']) || 0);
    }, 0);

    const TOTAL_VALOR_USD = PARTIDAS_MERCANCIA.reduce((total, item) => {
      return total + (Number(item['importeTotalUSDAutorizado']) || 0);
    }, 0);

    const JSON_MOSTRAR = {
      idSolicitud: DATOS?.['idSolicitud'] as unknown as number || 0,
      filaSeleccionada: [],
      mostrarTabla: false,
      solicitud: (DATOS?.['tipo_solicitud_pexim'] as unknown as string) || '',
      fraccion: (MERCANCIAS_DATA?.['fraccionArancelaria'] as Record<string, unknown>)?.['cveFraccion'] as string || '',
      producto: (MERCANCIAS_DATA?.['condicionMercancia'] as unknown as string) || '',
      descripcion: PARTIDAS_MERCANCIA[0]['descripcionSolicitada'] as string || '',
      cantidad: PARTIDAS_MERCANCIA[0]['unidadesAutorizadas'] as string || '',
      valorPartidaUSD: 0,
      unidadMedida: PARTIDAS_MERCANCIA[0]['unidadMedidaClave'] as string || '',
      regimen: (DATOS?.['cve_regimen'] as unknown as string) || '',
      clasificacion: (DATOS?.['cve_clasificacion_regimen'] as unknown as string) || '',
      cantidadPartidasDeLaMercancia: '',
      valorPartidaUSDPartidasDeLaMercancia: '',
      descripcionPartidasDeLaMercancia: '',
      valorFacturaUSD: PARTIDAS_MERCANCIA[0]['importeTotalUSD'] as string || '',
      bloque: '',
      usoEspecifico: MERCANCIAS_DATA?.["usoEspecifico"] as string || '',
      justificacionImportacionExportacion: MERCANCIAS_DATA?.["justificacionImportacionExportacion"] as string || '',
      observaciones: MERCANCIAS_DATA?.["observaciones"] as string || '',
      entidad: REPRESENTACION_FEDERAL['cve_entidad_federativa'] as string || '',
      representacion: REPRESENTACION_FEDERAL['cve_unidad_administrativa'] as string || '',
      modificarPartidasDelaMercanciaForm: {
        cantidadPartidasDeLaMercancia: '',
        valorPartidaUSDPartidasDeLaMercancia: '',
        descripcionPartidasDeLaMercancia: '',
        fraccionTigiePartidasDeLaMercancia: '',
        fraccionDescripcionPartidasDeLaMercancia: '',
      },
      mostrarPartidas: [],
      cantidadTotal: TOTAL_CANTIDAD.toString(),
      valorTotalUSD: TOTAL_VALOR_USD.toString(),
      fechasSeleccionadas: DATOS?.['listaPaises'] as unknown as string[] || [],
      tableBodyData: PARTIDAS_MERCANCIA_DATOS || [],
    }
    this.tramite130107Store.actualizarEstado(JSON_MOSTRAR);

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

}