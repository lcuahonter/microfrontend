import { Catalogo, RespuestaCatalogos } from '@libs/shared/data-access-user/src';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Solicitud2614State, Tramite2614Store } from '../../../estados/tramites/tramite2614.store';
import { HttpClient } from '@angular/common/http';
import { InformaciondeProcedencia } from '../../constantes/shared2614/informacion-de-procedencia.enum';
import { TramiteAsociados } from '../../../shared/models/tramite-asociados.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudModificacionPermisoInternacionService implements OnDestroy {
 /**
   * Subject utilizado para manejar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();
 /**
   * Lista de bancos disponibles para el pago de derechos.
   */
 banco: Catalogo[] = [];

 /**
  * Constructor del servicio.
  * Param http Cliente HTTP para realizar solicitudes a servicios externos.
  */
 constructor(private http: HttpClient,private tramite2614Store: Tramite2614Store) {
   // Constructor
 }

 /**
  * Obtiene la lista de destinatarios desde un archivo JSON.
  * Retorna un observable con la lista de destinatarios.
  */
 obtenerDestinatarioListo(): Observable<InformaciondeProcedencia[]> {
   return this.http
     .get<InformaciondeProcedencia[]>('../../../assets/json/2614/destinatario-mock.json')
     .pipe();
 }

 /**
  * Inicializa los datos de los catálogos necesarios para el pago de derechos.
  * Realiza una solicitud para obtener la lista de bancos.
  */
 inicializaPagoDeDerechosDatosCatalogos(): void {
   this.obtenerRespuestaPorUrl(this, 'banco', '/2614/banco.json');
 }

 /**
  * Realiza una solicitud HTTP para obtener datos desde una URL específica
  * y los asigna a una variable del servicio.
  * Param self Referencia al servicio actual.
  * Param variable Nombre de la variable donde se almacenarán los datos.
  * Param url URL del archivo JSON que contiene los datos.
  */
 obtenerRespuestaPorUrl(
   self: SolicitudModificacionPermisoInternacionService,
   variable: keyof SolicitudModificacionPermisoInternacionService,
   url: string
 ): void {
   if (self && variable && url) {
     this.http
       .get<RespuestaCatalogos>(`assets/json${url}`).pipe(takeUntil(this.destroyNotifier$))
       .subscribe((resp): void => {
         (self[variable] as Catalogo[]) =
           resp?.code === 200 && resp.data ? resp.data : [];
       });
   }
 }

 /**
  * Obtiene la lista de trámites asociados desde un archivo JSON.
  * Retorna un observable con la lista de trámites asociados.
  */
 obtenerTramitesAsociados(): Observable<TramiteAsociados[]> {
   return this.http.get<TramiteAsociados[]>(
     'assets/json/2614/tramite-asociados.json'
   );
 }

  /**
   * Obtiene la lista de países desde un archivo JSON local.
   * @returns Observable con el arreglo de objetos de tipo Catalogo.
   */
  getPaisData(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>('assets/json/2614/pais.json');
  }
   /**
   * Actualiza el estado del formulario en el store.
   * @param DATOS Estado actualizado del trámite.
   */
    actualizarEstadoFormulario(DATOS: Solicitud2614State): void {
      this.tramite2614Store.actualizarEstado(DATOS);
  }
  /**
 * Obtiene los datos de la solicitud.
 * @returns Observable con los datos de la solicitud.
 */
getDatosDeLaSolicitud(): Observable<Solicitud2614State> {
  return this.http.get<Solicitud2614State>('assets/json/2614/datos.json');
}

   /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el Subject para evitar fugas de memoria.
   */
   ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
