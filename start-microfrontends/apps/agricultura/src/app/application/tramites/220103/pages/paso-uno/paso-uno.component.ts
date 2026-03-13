/**
 * paso-uno.component.ts
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, takeUntil } from 'rxjs';
import { SanidadAcuicolaImportacionService } from '../../services/sanidad-acuicola-importacion.service';
import { Tramite220103State } from '../../estados/tramites/tramites220103.store';

/**
 * @component
 * @name PasoUnoComponent
 * @description
 * Componente que representa el primer paso en un proceso de múltiples pasos.
 * Gestiona la obtención de datos del servidor y la selección de pestañas.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  standalone: false,
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * @property {boolean} datosRespuestaDisponibles
   * Indica si los datos de respuesta del servidor están disponibles.
   */
  public datosRespuestaDisponibles: boolean = false;

  /**
   * @property {Subject<void>} notificadorDestruccion$
   * Subject para notificar la destrucción del componente y desuscribirse de observables.
   * @private
   */
  private notificadorDestruccion$: Subject<void> = new Subject();

  /**
   * @property {ConsultaioState} estadoConsulta
   * Estado actual de la consulta.
   */
  public estadoConsulta!: ConsultaioState;

  /**
   * @property {number} indice
   * El índice de la pestaña actualmente seleccionada.
   */
  public indice: number = 1;

  /**
   * @property {number} indicePestana
   * Índice de la pestaña seleccionada (duplicado, puede ser eliminado si no es necesario).
   */
  public indicePestana: number = 1;

  /**
   * constructor
   * @param {SanidadAcuicolaImportacionService} servicio - Servicio para gestionar datos de sanidad acuícola.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado de la consulta.
   */
  constructor(
    private servicio: SanidadAcuicolaImportacionService,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * ngOnInit
   * @description
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Configura las suscripciones necesarias y verifica si se deben obtener datos del servidor.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((estadoSeccion) => {
        this.estadoConsulta = estadoSeccion;
      });

    if (this.estadoConsulta.update) {
      this.obtenerDatosDeSolicitudes();
    } else {
      this.datosRespuestaDisponibles = true;
    }
  }

  /**
   * seleccionarPestana
   * @description
   * Selecciona una pestaña estableciendo su índice.
   * @param {number} i - El índice de la pestaña a seleccionar.
   */
  seleccionarPestana(i: number): void {
    this.indice = i;
  }

  /**
   * obtenerDatosDeSolicitudes
   * @description
   * Obtiene los datos de la bandeja de solicitudes desde el servidor.
   */
  obtenerDatosDeSolicitudes(): void {
    this.servicio.obtenerDatos()
      .pipe(takeUntil(this.notificadorDestruccion$))
      .subscribe((respuesta: Tramite220103State) => {
        if (respuesta) {
          this.datosRespuestaDisponibles = true;
          this.servicio.actualizarEstado(respuesta);
        }
      });
  }

  /**
   * ngOnDestroy
   * @description
   * Hook del ciclo de vida que se llama justo antes de que el componente sea destruido.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.notificadorDestruccion$.next();
    this.notificadorDestruccion$.complete();
  }
}