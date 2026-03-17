import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PagoDeDerechosComponent } from '../../../../shared/components/pago-de-derechos/pago-de-derechos.component';
import { PagoDerechosFormState } from '../../../../shared/models/terceros-relacionados.model';
import { PagoDerechosQuery } from '../../../../shared/estados/queries/pago-derechos.query';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

/**
 * Componente que muestra la sección de Pago de Derechos.
 * Esta sección es común para todos los trámites.
 */
@Component({
  selector: 'app-pago-derechos',
  standalone: true,
  imports: [CommonModule, PagoDeDerechosComponent],
  templateUrl: './pago-derechos.component.html',
  styleUrl: './pago-derechos.component.scss',
})
export class PagoDerechosComponent implements OnInit, OnDestroy {

  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  formularioDeshabilitado: boolean = false;
  constructor(private pagoDrenchosQuery: PagoDerechosQuery, private consultaQuery: ConsultaioQuery) {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.formularioDeshabilitado = seccionState.readonly;
      });
  }

  ngOnInit(): void {
    if (this.formularioDeshabilitado) {
    this.pagoDrenchosQuery.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(state => {
        this.pagoDerechos = state;
      });
    }
  }
  idProcedimiento: number = 260515;

  @ViewChild(PagoDeDerechosComponent) pagoDeDerechosComponent!: PagoDeDerechosComponent;
  /**
   * @property {PagoDerechosFormState} pagoDerechos
   * @description Estado actual del formulario de pago de derechos, obtenido del store del trámite.
   */
  public pagoDerechos!: PagoDerechosFormState;

  validarContenedor(): boolean {
    return (
      this.pagoDeDerechosComponent?.formularioSolicitudValidacion() ?? false
    );
  }
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
    
}
