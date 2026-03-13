import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultarequerimientosComponent } from "../consulta-requerimientos/consulta-requerimientos.component";
import { FolioQuery } from '../../../../core/queries/folio.query';

@Component({
  selector: 'lib-requerimientospaso1',
  standalone: true,
  imports: [CommonModule, ConsultarequerimientosComponent],
  templateUrl: './requerimientospaso1.component.html',
  styleUrl: './requerimientospaso1.component.scss',
})
export class Requerimientospaso1Component implements OnInit, OnDestroy {
  /**
   * Variable para almacenar el folio recuperado desde el store.
   * @type {string}
   */
  public folio!: string;

  /**
   * Subject utilizado para manejar la cancelación de suscripciones.
   * @type {Subject<void>}
   */
  private unsubscribe$ = new Subject<void>();

  /**
   * Índice de la pestaña seleccionada.
   * @type {number}
   */
  public indice: number = 1;

  /**
   * Constructor de la clase Requerimientospaso1Component.
   * @param folioQuery Consulta del folio desde el store.
   */
  constructor(private folioQuery: FolioQuery) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Recupera el folio desde el store.
   */
  ngOnInit(): void {
    /** 
     * Recuperar el folio desde el store.
     */
    this.folioQuery.getFolio()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((folio) => {
        this.folio = folio || '';
      });
  }

  /**
   * Método para seleccionar la pestaña.
   * @param {number} i - Número de la pestaña seleccionada.
   * @returns {void}
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   * @returns {void}
   */
  ngOnDestroy(): void {
    /** 
     * Emitir un valor para completar todas las suscripciones activas.
     */
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
