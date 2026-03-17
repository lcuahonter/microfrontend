import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  SolicitanteComponent
} from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosDelTramiteContenedoraComponent } from '../../components/datos-del-tramite-contenedora/datos-del-tramite-contenedora.component';
import { SolicitudService } from '../../services/solicitud/solicitud.service';
import { TercerosRelacionadosContenedoraComponent } from '../../components/terceros-relacionados-contenedora/terceros-relacionados-contenedora.component';
import { Tramite240122Query } from '../../estados/tramite240122Query.query';
import { Tramite240122Store } from '../../estados/tramite240122Store.store';

/**
 * @component
 * @name PasoUnoComponent
 * @description
 * Componente que representa el primer paso del formulario para el trámite 240122.
 * Administra la selección de pestañas, obtiene datos del servicio si es necesario
 * y mantiene sincronizado el estado usando Akita.
 *
 * @implements OnInit, AfterViewInit, OnDestroy
 */
@Component({
  selector: 'app-paso-uno',
  standalone: true,
  imports: [
    CommonModule,
    SolicitanteComponent,
    DatosDelTramiteContenedoraComponent,
    TercerosRelacionadosContenedoraComponent,
  ],
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Índice actual de la pestaña seleccionada.
   * @type {number | undefined}
   */
  public indice: number | undefined = 1;

  /**
   * Estado de la consulta de IO, utilizado para determinar si se deben cargar datos iniciales.
   * @type {ConsultaioState}
   */
  public consultaState!: ConsultaioState;

  /**
   * Subject que se utiliza para cancelar todas las suscripciones al destruir el componente.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description Inyecta servicios y stores necesarios para consultar y actualizar el estado del trámite.
   * 
   * @param tramite240122Query Consulta reactiva al estado del trámite.
   * @param tramite240122Store Store para actualizar el estado del trámite.
   * @param solicitudService Servicio encargado de obtener el estado inicial desde un JSON.
   * @param consultaQuery Consulta para obtener el estado global relacionado con el solicitante.
   */
  constructor(
    private tramite240122Query: Tramite240122Query,
    private tramite240122Store: Tramite240122Store,
    private readonly solicitudService: SolicitudService,
    private readonly consultaQuery: ConsultaioQuery
  ) {}

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se suscribe al estado del índice de pestaña actual y al estado del solicitante.
   */
  ngOnInit(): void {
    this.tramite240122Query.getTabSeleccionado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((tab) => {
        this.indice = tab;
      });
       this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.consultaState = seccionState;
      })).subscribe();
  }

  /**
   * @method ngAfterViewInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta después de que la vista ha sido completamente inicializada.
   * Carga los datos del trámite desde el archivo JSON si el estado de consulta lo permite.
   */
  ngAfterViewInit(): void {
    if (this.consultaState.update) {
      this.solicitudService.getPermisoExtraordinario()
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((datos) => {
          this.tramite240122Store.actualizarTrimateState(datos);
        });
    }
  }

  /**
   * @method seleccionaTab
   * @description Actualiza el índice de la pestaña seleccionada en el estado global.
   * @param i Índice de la pestaña que fue seleccionada.
   */
  public seleccionaTab(i: number): void {
    this.tramite240122Store.updateTabSeleccionado(i);
  }

  /**
   * @method ngOnDestroy
   * @description
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * Se ejecuta justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
