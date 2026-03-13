import { ChangeDetectorRef, Component, OnDestroy, ViewChild} from '@angular/core';
import { ConsultaioQuery, ConsultaioState, RegistroSolicitudService} from '@ng-mf/data-access-user';
import { DatosDeLaSolicitudComponent, TipoDeProducto } from '../../../../shared/components/2603/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DatosSolicitudFormState } from '../../../../shared/models/datos-solicitud.model';
import { Tramite260303Query } from '../../Estados/tramite260303.query';
import { Tramite260303Store } from '../../Estados/tramite260303.store';

/**
 * @component DatosDeLaSolicitudContenedoraComponent
 * @description Componente contenedor para el trámite 260303, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite260303Store`.
 **/
@Component({
  selector: 'app-datos-de-la-solicitud-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  providers: [Tramite260303Store],
  templateUrl: './datos-de-la-solicitud.contenedora.html',
  styleUrls: ['./datos-de-la-solicitud.contenedora.scss'],
})
export class DatosDeLaSolicitudContenedoraComponent implements OnDestroy {
  /** Subject para notificar la destrucción del componente y cancelar suscripciones. */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la consulta. */
  consultaState!: ConsultaioState;

  /** Referencia al componente DatosDeLaSolicitudComponent hijo. */
  @ViewChild(DatosDeLaSolicitudComponent)
  datosDeLaSolicitudComponent!: DatosDeLaSolicitudComponent;

  /** Indica si el formulario está en modo solo lectura. */
  public esFormularioSoloLectura: boolean = false;

  /** Constructor del componente. */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private query: Tramite260303Query,
    private store: Tramite260303Store,
    private cdr: ChangeDetectorRef,
    private registroSolicitudService: RegistroSolicitudService
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Maneja el evento de cambio de selección del componente 2603.
   */
  onSelectionChange(event: TipoDeProducto): void {
    this.store.setTipoDeProducto(event as unknown as string);
  }

  /** Actualiza el estado del formulario de datos de la solicitud en el store. */
  public updateDatosSolicitud(event: DatosSolicitudFormState): void {
    this.flattenAndSet(event);
  }

  /** Método recursivo para aplanar un objeto y establecer sus valores en el store. */
  private flattenAndSet(obj: any): void {
    Object.keys(obj).forEach((key) => {
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        this.flattenAndSet(obj[key]);
      } else {
        this.store.setDynamicFieldValue(key, obj[key]);
      }
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
