import { Catalogo, CatalogoServices, HttpCoreService, LoginQuery } from '@ng-mf/data-access-user';
import { Observable, Subject, map, takeUntil} from 'rxjs';
import { Tramite130110State, Tramite130110Store } from '../../../estados/tramites/tramites130110.store';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROC_130110 } from '../servers/api-route';
import { PartidasDeLaMercanciaModelo } from '../../../shared/models/partidas-de-la-mercancia.model';
import { ProductoResponse } from '../../../shared/constantes/vehiculos-adaptados.enum';
import { Tramite130110Query } from '../../../estados/queries/tramite130110.query';

/**
 * Servicio para gestionar la importación de vehículos.
 * Este servicio proporciona métodos para obtener datos relacionados con la importación de vehículos,
 * como listas de países, entidades federativas, representaciones federales y opciones de productos.
 */
@Injectable({
  providedIn: 'root'
})
export class ImportacionNeumaticosComercializarService {
  // Valor de RFC de ejemplo
  private loginRfc: string = '';

  /**
   * @property {Subject<void>} destroyed$
   * @description Sujeto utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();
/**
* Constructor del servicio.
* Servicio HttpClient para realizar solicitudes HTTP.
*/
constructor(
  private http: HttpClient,
  public httpService: HttpCoreService,
  private tramite130110Store: Tramite130110Store,
  private query: Tramite130110Query,
  private catalogoServices: CatalogoServices, private loginQuery: LoginQuery) {
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
 * Un observable que emite una lista de países.
 */
getListaDePaisesDisponibles(): Observable<Catalogo[]> {
  return this.http.get<Catalogo[]>('/assets/json/130110/pais-procenia.json');
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
  * Obtiene la lista de entidades federativas desde un archivo JSON.
  * @returns {Observable<Catalogo[]>}
  */
  getEntidadFederativa(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.entidadesFederativasCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }

/**
 * Obtiene la lista de representaciones federales desde un archivo JSON.
 * @returns {Observable<Catalogo[]>}
 */
getRepresentacionFederal(tramite: string, cveEntidad: string): Observable<Catalogo[]> {
  return this.catalogoServices.representacionFederalCatalogo(tramite, "SIN").pipe(
    map(res => res?.datos ?? [])
  );
}

/**
 * Obtiene las opciones de solicitud desde un archivo JSON.
 * Un observable que emite las opciones de solicitud.
 */
getSolicitudeOptions(): Observable<ProductoResponse> {
  return this.http.get<ProductoResponse>(
    'assets/json/130110/solicitude-options.json'
  );
}

/**
 * Obtiene las opciones de producto desde un archivo JSON.
 * Un observable que emite las opciones de producto.
 */
getProductoOptions(): Observable<ProductoResponse> {
  return this.http.get<ProductoResponse>(
    'assets/json/130110/producto-opciones.json'
  );
}

/**
 * Obtiene los datos de la tabla de partidas de la mercancía.
 * @returns Observable con los datos de la tabla.
 */
getTablaDatos(): Observable<PartidasDeLaMercanciaModelo[]> {
    return this.http.get<PartidasDeLaMercanciaModelo[]>('assets/json/130110/partidas-de-la.json');
}

/**
 * Actualiza el estado del formulario en el store.
 * @param DATOS Estado actualizado del trámite.
 */
actualizarEstadoFormulario(DATOS: Tramite130110State): void {
    this.tramite130110Store.actualizarEstado(DATOS);
}

/**
 * Obtiene los datos de la solicitud.
 * @returns Observable con los datos de la solicitud.
 */
getDatosDeLaSolicitud(): Observable<Tramite130110State> {
    return this.http.get<Tramite130110State>('assets/json/130110/datos-de-la-solicitud.json');
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

  /** Obtiene el catálogo de fracciones arancelarias para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de fracciones arancelarias.
   */
  getFraccionesArancelarias(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.getFraccionesCatalogo(tramite).pipe(
      map(res => res?.datos ?? [])
    );
  }

  /** Obtiene el catálogo de unidades de medida para el trámite especificado.  
   *  @param {string} tramite - El identificador del trámite.
   *  @returns {Observable<Catalogo[]>} - Un observable que emite una lista de catálogos de unidades de medida.
   */
  getUMTCatalogo(tramite: string): Observable<Catalogo[]> {
    return this.catalogoServices.getUMTCatalogo(tramite, "01012902").pipe(
      map(res => res?.datos ?? [])
    );
  }

  /**
   * Obtiene todos los datos del estado almacenado en el store.
   * @returns {Observable<TramiteState>} Observable con todos los datos del estado.
   */
  getAllState(): Observable<Tramite130110State> {
    return this.query.selectSolicitud$;
  }

  guardarDatosPost(
    body: Record<string, unknown>
  ): Observable<Record<string, unknown>> {
    return this.httpService.post<Record<string, unknown>>(PROC_130110.GUARDAR, {
      body: body,
    });
  }

   /**
    * Construye la información de la mercancía a partir del estado del trámite.
    * @param item Estado del trámite
    * @returns Objeto con la información de la mercancía construida
    */
   buildMercancia(item: Tramite130110State): unknown {
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
       certificado_serial_number: "string"
     };
   }
 
   /** Construye la información de la representación federal a partir del estado del trámite.
    * @param item Estado del trámite
    * @returns Objeto con la información de la representación federal construida
    */
   buildRepresentacionFederal(item: Tramite130110State): unknown {
     return {
       cve_entidad_federativa: item.entidad,
       cve_unidad_administrativa: "0203"
     };
   }
 
   /** Construye la información de las entidades federativas a partir del estado del trámite.
    * @param item Estado del trámite
    * @returns Objeto con la información de las entidades federativas construida
    */
   buildEntidadesFederativas(item: Tramite130110State): unknown {
     return {
       cveEntidad: item.entidad
     };
   }

     /**
      * Construye las partidas de mercancía a partir del estado del trámite.
      * @param item Estado del trámite
      * @returns Objeto con las partidas de mercancía construidas
      */
    buildPartidasMercancia(item: Tramite130110State): unknown {
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
}