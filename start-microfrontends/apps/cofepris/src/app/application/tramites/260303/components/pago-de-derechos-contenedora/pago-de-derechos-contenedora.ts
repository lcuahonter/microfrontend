import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/2603/terceros-relacionados.model';
import { Tramite260303Store } from '../../Estados/tramite260303.store';

/** PagoDeDerechosContenedoraComponent es responsable de manejar el componente de pago de derechos.
 */
@Component({
  selector: 'app-pago-de-derechos-contenedora',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-de-derechos-contenedora.html',
  styleUrls: ['./pago-de-derechos-contenedora.scss'],
})
export class PagoDeDerechosContenedoraComponent implements OnDestroy {
  /** Estado actual de la consulta. */
  @Input() consultaState!: ConsultaioState;

  /** Estado del formulario de pago de derechos. */
  public pagoDerechos: PagoDerechosFormState;

  /** Indica si el formulario está en modo solo lectura. */
  public esFormularioSoloLectura: boolean = false;

  /** Subject para notificar la destrucción del componente y cancelar suscripciones. */
  protected destroyNotifier$: Subject<void> = new Subject();

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Referencia al componente PagoDeDerechosComponent hijo. */
  @ViewChild(PagoDeDerechosComponent)
  pagoDeDerechosComponent!: PagoDeDerechosComponent;

  /** Constructor del componente. */
  constructor(
    public tramiteStore: Tramite260303Store,
    private consultaQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          setTimeout(() => {
            try {
              this.cdr.detectChanges();
            } catch (error) {
              // Suprimir errores de detección de cambios durante las pruebas
            }
          }, 0);
        })
      )
      .subscribe();
    this.pagoDerechos = this.tramiteStore.getValue().pagoDerechos;
  }

  /** Actualiza el estado del formulario de pago de derechos en el store. */
  updatePagoDerechos(event: PagoDerechosFormState): void {
    this.tramiteStore.updatePagoDerechos(event);
  }

  /** Valida el contenedor llamando a la validación del formulario hijo. */
  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
  /**
   * Exponer destroyNotifier$ con fines de prueba
   */
  public getDestroyNotifier(): Subject<void> {
    return this.destroyNotifier$;
  }

  /** Limpia las suscripciones al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
