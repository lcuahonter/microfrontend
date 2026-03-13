/**
 * Este módulo define el componente `CertificadoDisponiblesComponent` que maneja la información de los tratados y acuerdos.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subject, map, takeUntil } from 'rxjs';

import { CERTIFICADO_DISPONIBLES_COLUMNAS, CertificadoDisponibles, ConsultaioQuery, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@ng-mf/data-access-user';
import { CertificadoDisponiblesService } from '../../services/certificado-disponibles/certificadoDisponibles.service';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';


/**
 * Este módulo define el componente `CertificadoDisponiblesComponent` que maneja la información de los tratados y acuerdos.
 */
@Component({
  selector: 'app-certificado-disponibles',
  standalone: true,
  imports: [CommonModule, TablaDinamicaComponent, TituloComponent],
  templateUrl: './certificado-disponibles.component.html',
  styleUrl: './certificado-disponibles.component.scss',
})
export class CertificadoDisponiblesComponent implements OnInit, OnDestroy {

  /**
   * Configuración de la tabla que se utilizará en el componente.
   * @type {any}
   */
  configuracionTabla = CERTIFICADO_DISPONIBLES_COLUMNAS;

  /**
   * Selección de la tabla inicializada como indefinida.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Datos que se mostrarán en la tabla.
   * @type {any}
   */
  public datosTabla: CertificadoDisponibles[] = [];

  /**
   * Subject para manejar la desuscripción cuando el componente se destruye.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
  /**
   * Evento que se emite cuando se hace clic en una fila de la tabla.
   * @type {EventEmitter<void>}
   */
  @Output() rowClicked = new EventEmitter<CertificadoDisponibles>();

  @Input() esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Servicio para obtener datos para el componente.
   * @param {CertificadoDisponiblesService} service - Servicio para obtener datos de tratados y acuerdos.
   */
  constructor(private service: CertificadoDisponiblesService,
    private consultaioQuery: ConsultaioQuery,
    public tramiteQuery: Tramite110210Query
  ) {
     this.consultaioQuery.selectConsultaioState$
          .pipe(
            takeUntil(this.destroyed$),
            map((seccionState) => {
              this.esFormularioSoloLectura = seccionState.readonly;
            })
          )
          .subscribe();
  }

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Obtiene datos del servicio y los asigna a tableData.
   */
  ngOnInit(): void {
    this.tramiteQuery.selectTabla$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((data: CertificadoDisponibles[]) => {
        this.datosTabla = data;
      });
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject destroyed$ para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Maneja el evento de clic en una fila de la tabla.
   * Emite el evento rowClicked con los datos de la fila seleccionada.
   * @param {CertificadoDisponibles} event - Datos de la fila que fue clickeada.
   */
  onFilaClick(event: CertificadoDisponibles): void{
     if (this.esFormularioSoloLectura) {
      return; 
    }
    this.rowClicked.emit(event);
  }
}