import { ActivatedRoute, Router } from '@angular/router';
import {
  CONFIGURACION_LISTA_PROGRAMA,
  DISCRIMINATOR_VALUE,
  TICPSE,
} from '../../constantes/modificacion.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConfiguracionColumna,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { IniciarTramiteService } from '@libs/shared/data-access-user/src/core/services/shared/resolver/iniciar-tramite.service';
import { LoginQuery } from '@ng-mf/data-access-user';
import { ProgramaLista } from '../../models/plantas-consulta.model';
import { SolicitudService } from '../../services/solicitud.service';
import { Tramite80301Store } from '../../estados/tramite80301.store';

/**
 * Componente para el registro de solicitudes de modificación del programa IMMEX.
 * Permite al usuario seleccionar un programa de una lista y navegar al proceso de registro de modificación.
 * @component RegistroSolicitudComponent
 */
@Component({
  selector: 'app-registro-solicitud',
  standalone: true,
  imports: [CommonModule, TituloComponent, TablaDinamicaComponent],
  templateUrl: './registro-solicitud.component.html',
  styleUrl: './registro-solicitud.component.scss',
})

/**
 * Clase que representa el componente de registro de solicitudes de modificación del programa IMMEX.
 * @class RegistroSolicitudComponent
 */
export class RegistroSolicitudComponent implements OnInit, OnDestroy {
  /**
   * Título del componente que se muestra en la interfaz de usuario.
   * @type {string}
   */
  titulo: string =
    'Registro de solicitud modificación programa IMMEX (Baja de fracciones autorizadas)';

  /**
   * Configuración de las columnas para la tabla de programas.
   * Define cómo se mostrarán los datos en la tabla.
   * @type {ConfiguracionColumna<ProgramaLista>[]}
   */
  programaListaTablaConfiguracion: ConfiguracionColumna<ProgramaLista>[] =
    CONFIGURACION_LISTA_PROGRAMA;

  /**
   * Datos de la lista de programas que se mostrarán en la tabla.
   * @type {ProgramaLista[]}
   */
  programaListaDatosTabla: ProgramaLista[] = [];

  /**
   * RFC del usuario actual.
   * @type {string}
   */
  private loginRfc: string = '';

  /**
   * Tipo de programa seleccionado (IMMEX o PROSEC).
   * @type {string}
   */
  tipoPrograma: string = '';

  /**
   * Subject utilizado para notificar cuando se debe completar y limpiar las suscripciones activas.
   * Esto ayuda a prevenir fugas de memoria al completar las suscripciones al destruir el componente.
   * @type {Subject<void>}
   */
  public destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente RegistroSolicitudComponent.
   * @param solicitudService Servicio para manejar las solicitudes.
   * @param router Servicio para la navegación entre rutas.
   * @param route Servicio para acceder a la ruta activa.
   * @param tramite80301Store Almacén para gestionar el estado del trámite 80301.
   * @param loginQuery Consulta para obtener el estado de inicio de sesión.
   * @param iniciarService Servicio para iniciar el trámite.
   */
  constructor(
    private solicitudService: SolicitudService,
    private router: Router,
    private route: ActivatedRoute,
    private tramite80301Store: Tramite80301Store,
    private loginQuery: LoginQuery,
    private iniciarService: IniciarTramiteService
  ) {
    this.loginQuery.selectLoginState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((loginState) => {
          this.loginRfc = loginState.rfc;
          this.tramite80301Store.setLoginRfc(this.loginRfc);
        })
      )
      .subscribe();
  }

  /**
   * Método de inicialización del componente.
   * Se llama automáticamente cuando el componente es creado.
   * Aquí se obtienen los datos de la lista de programas.
   * @return {void}
   */
  ngOnInit(): void {
    this.obtenerListaProgramas();
  }

  /**
   * Método que obtiene la lista de programas desde el servicio.
   * Asigna los datos obtenidos a la variable `programaListaDatosTabla`.
   * @return {void}
   */
  obtenerListaProgramas(): void {
    this.tipoPrograma = DISCRIMINATOR_VALUE.startsWith('80')
      ? TICPSE.TICPSE_IMMEX
      : TICPSE.TICPSE_PROSEC;

    this.tramite80301Store.setSelectedTipoPrograma(this.tipoPrograma);

    this.solicitudService
      .obtenerListaProgramas(this.loginRfc, this.tipoPrograma)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((response) => {
        this.programaListaDatosTabla =
          response.datos?.map((item: ProgramaLista) => ({
            tipoPrograma: item.tipoPrograma,
            idProgramaCompuesto: item.idProgramaCompuesto,
            idProgramaAutorizado: item.idProgramaAutorizado,
            rfc: item.rfc,
            folioPrograma: item.folioPrograma,
          })) || [];
        this.tramite80301Store.setProgramaListaDatos(
          this.programaListaDatosTabla
        );
      });
  }

  /**
   * Método que se ejecuta al hacer clic en una fila de la tabla.
   * Navega a la ruta de registro de modificación relativa a la ruta actual.
   * @param event Objeto que contiene la información de la fila clickeada.
   * @return {void}
   */
  onFilaClic(event: ProgramaLista): void {
    this.actualizarSeleccionadaPrograma(event);
    this.iniciarService.setTramiteDatos({
      folio_programa: event.folioPrograma || '',
      id_programa_autorizado: event.idProgramaAutorizado || ''
    });
    this.router.navigate(['../registro-modificacion-page'], {
      relativeTo: this.route
    });
  }

  /**
   * Método que actualiza la información del programa seleccionado en el store.
   * @param event Objeto que contiene la información del programa seleccionado.
   * @return {void}
   */
  actualizarSeleccionadaPrograma(event: ProgramaLista): void {
    this.tramite80301Store.setSelectedFolioPrograma(event.folioPrograma || '');
    this.tramite80301Store.setSelectedIdPrograma(
      event.idProgramaAutorizado || ''
    );
    this.tramite80301Store.setTipoPrograma(event.tipoPrograma || '');
  }

  /**
   * Método que se ejecuta cuando el componente es destruido.
   * Notifica a todos los observables que deben completarse y cancela las suscripciones activas.
   * Esto asegura que no haya fugas de memoria.
   * @return {void}
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}