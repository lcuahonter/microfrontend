import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject,map,takeUntil } from 'rxjs';

import { BtnContinuarComponent, SolicitanteComponent } from '@ng-mf/data-access-user';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


/**
 * Componente para el paso uno del wizard.
 */
@Component({
  selector: 'paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
   standalone: true,
   imports: [BtnContinuarComponent,FormsModule,ReactiveFormsModule,CommonModule,SolicitanteComponent],
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Índice del paso actual.
   */
  indice: number = 1;
  /**
   * Estado de la consulta.
   */
  public consultaState!: ConsultaioState;

  /**
   * RFC del solicitante.
   */
  @Input() rfcSolicitante!: string;

   /**
   * Notificador para destruir las suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

   /**
   * Constructor del componente.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la consulta.
   */
  constructor(
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Selecciona una pestaña del wizard.
   * @param {number} i - Índice de la pestaña.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Método que se ejecuta al inicializar el componente.
   * Suscribe al estado de la consulta.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: ConsultaioState) => {
          this.consultaState = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Completa el notificador para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
