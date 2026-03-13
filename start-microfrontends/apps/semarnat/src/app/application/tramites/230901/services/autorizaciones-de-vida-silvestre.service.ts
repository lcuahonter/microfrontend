import { Catalogo, JsonResponseCatalogo } from '@libs/shared/data-access-user/src';
import { Solicitud230901State, Tramite230901Store } from '../estados/store/tramite230901.store';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar los datos relacionados con autorizaciones de vida silvestre.
 * Este servicio se encarga de inicializar y obtener datos de catálogos necesarios
 * para los trámites relacionados con la vida silvestre.
 */
@Injectable({
  providedIn: 'root',
})
export class AutorizacionesDeVidaSilvestreService {
  /** Catálogo de tipos de movimiento. */
  tiposDeMovimiento: Catalogo[] = [];
  /** Catálogo de tipos de régimen.*/
  tiposDeRegimen: Catalogo[] = [];
  /** Catálogo de tipos de régimen.*/
  aduanas: Catalogo[] = [];
  /** Catálogo de fracciones arancelarias.*/
  fraccionArancelaria: Catalogo[] = [];
  /** Catálogo de descripciones de fracciones arancelarias.*/
  fraccionArancelariaDescripcion: Catalogo[] = [];
  /** Catálogo de clasificaciones taxonómicas. */
  clasificacionTaxonomica: Catalogo[] = [];
  /** Catálogo de nombres científicos. */
  nombreCientifico: Catalogo[] = [];
  /** Catálogo de nombres comunes. */
  nombreComun: Catalogo[] = [];
  /** Catálogo de unidades de medida. */
  unidadMedida: Catalogo[] = [];
  /** Catálogo de países de origen. */
  paisOrigen: Catalogo[] = [];
  /** Catálogo de países de procedencia. */
  paisProcedencia: Catalogo[] = [];
  /**  Catálogo de entidades federativas. */
  entidadFederativa: Catalogo[] = [];
  /** Catálogo de bancos. */
  bancos: Catalogo[] = [];

  /**
   * Injects del servicio.
   * {HttpClient} http - Cliente HTTP para realizar solicitudes.
   */
  private http = inject(HttpClient);
  private tramite230901Store = inject(Tramite230901Store);

  /**
   * Inicializa los datos de los catálogos relacionados con la solicitud.
   */
  public inicializaDatosSolicitudDatosCatalogos(): void {
    this.obtenerRespuestaPorUrl(this, 'tiposDeMovimiento', '/230901/tiposDeMovimiento.json');
    this.obtenerRespuestaPorUrl(this, 'tiposDeRegimen', '/230901/tiposDeRegimen.json');
    this.obtenerRespuestaPorUrl(this, 'aduanas', '/230901/aduanas.json');
  }

  /**
   * Inicializa los datos de los catálogos relacionados con terceros.
   */
  public inicializaTercerosDatosCatalogos(): void {
    this.obtenerRespuestaPorUrl(this, 'entidadFederativa', '/230901/entidadFederativa.json');
  }

  /**
   * Inicializa los datos de los catálogos relacionados con el pago de derechos.
   */
  public inicializaPagoDeDerechosDatosCatalogos(): void {
    this.obtenerRespuestaPorUrl(this, 'bancos', '/230901/bancos.json');
  }

  /**
   * Inicializa los datos de los catálogos relacionados con mercancías.
   */
  public inicializaMercanciaDatosCatalogos(): void {
    this.obtenerRespuestaPorUrl(this, 'fraccionArancelaria', '/230901/fraccionArancelaria.json');
    this.obtenerRespuestaPorUrl(this, 'fraccionArancelariaDescripcion', '/230901/fraccionArancelariaDescripcion.json');
    this.obtenerRespuestaPorUrl(this, 'clasificacionTaxonomica', '/230901/clasificacionTaxonomica.json');
    this.obtenerRespuestaPorUrl(this, 'nombreCientifico', '/230901/nombreCientifico.json');
    this.obtenerRespuestaPorUrl(this, 'nombreComun', '/230901/nombreComun.json');
    this.obtenerRespuestaPorUrl(this, 'unidadMedida', '/230901/unidadMedida.json');
    this.obtenerRespuestaPorUrl(this, 'paisOrigen', '/230901/paisOrigen.json');
    this.obtenerRespuestaPorUrl(this, 'paisProcedencia', '/230901/paisProcedencia.json');
  }

  /**
   * Obtiene una respuesta desde una URL y asigna los datos a una variable.
   * {AutorizacionesDeVidaSilvestreService} self - El objeto que contiene la variable donde se almacenarán los datos de la respuesta.
   * {keyof AutorizacionesDeVidaSilvestreService} variable - El nombre de la variable donde se almacenarán los datos de la respuesta.
   * {string} url - La URL desde la cual se obtendrá la respuesta.
   * {void}
   *
   * Si la variable y la URL son válidas, se realiza una solicitud HTTP GET a la URL especificada.
   * Si la respuesta tiene un código 200 y contiene datos, estos se asignan a la variable especificada.
   * Si la variable o la URL no son válidas, se asigna un arreglo vacío a la variable.
   */
  obtenerRespuestaPorUrl(
    self: AutorizacionesDeVidaSilvestreService,
    variable: keyof AutorizacionesDeVidaSilvestreService,
    url: string
  ): void {
    if (self && variable && url) {
      this.http.get<JsonResponseCatalogo>(`assets/json${url}`).subscribe((resp): void => {
        (self[variable] as Catalogo[]) = resp?.codigo === '00' && resp.datos ? resp.datos : [];
      });
    }
  }

  /**
  * Obtiene los datos de la solicitud de autorizaciones de vida silvestre.
  * @returns Observable con los datos de la solicitud.
  */
  getAutorizacionesDeVidaSilvestre(): Observable<Solicitud230901State> {
    return this.http.get<Solicitud230901State>('assets/json/230901/autorizacionesDeVidaSilvestre.json');
  }

  /**
  * Actualiza el estado del formulario en el store.
  * @param DATOS Estado actualizado del trámite.
  */
  actualizarEstadoFormulario(DATOS: Solicitud230901State): void {
    this.tramite230901Store.establecerDatos(DATOS);
  }
}