/**
 * Este módulo define el componente `DomicilioTablaComponent` que maneja la información de los tratados y acuerdos.
 */

import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { DomicilioTabla, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';

import { CertificadoOrigenResponse } from '../../models/certificados-disponsible.model';
import { CommonModule } from '@angular/common';
import { DOMICILIO_TABLA_COLUMNAS } from '@ng-mf/data-access-user';
import { DomicilioTablaService } from '../../services/domicilio-tabla/domicilioTabla.service';

/**
 * Este módulo define el componente `DomicilioTablaComponent` que maneja la información de los tratados y acuerdos.
 */
@Component({
  selector: 'app-domicilio-tabla',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent],
  templateUrl: './domicilio-tabla.component.html',
  styleUrl: './domicilio-tabla.component.scss',
})
export class DomicilioTablaComponent implements OnInit, OnDestroy, OnChanges {
  /**
     * Datos del certificado de origen.
     * @type {CertificadoOrigenResponse | null}
     */
    @Input() certificadoDatos: CertificadoOrigenResponse | null = null;

  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {any}
   */
  configuracionTabla = DOMICILIO_TABLA_COLUMNAS;

  /**
   * Selección de la tabla inicializada como indefinida.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Datos que se mostrarán en la tabla.
   * @type {DomicilioTabla[]}
   */
  datosTabla: DomicilioTabla[] = [];

  /**
   * Subject para manejar la desuscripción cuando el componente se destruye.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Constructor del componente.
   * Servicio para obtener datos para el componente.
   * @param {DomicilioTablaService} service - Servicio para obtener datos de tratados y acuerdos.
   */
  constructor(private service: DomicilioTablaService) {
    // Lógica del constructor puede ser añadida aquí si es necesario
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene datos del servicio y los asigna a tableData.
   */
  ngOnInit(): void {
    this.service.getData().pipe(
      takeUntil(this.destroyed$)
    ).subscribe(
      (data: DomicilioTabla[]) => {
        this.datosTabla = data;
      }
    );
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
/**   * Hook del ciclo de vida que se llama cuando las propiedades enlazadas a datos de una directiva cambian.
   * Actualiza los datos de la tabla basándose en los nuevos datos del certificado.
   */
  ngOnChanges(): void {
    this.datosTabla = (this.certificadoDatos?.mercancias ?? []) as DomicilioTabla[];
  }

}