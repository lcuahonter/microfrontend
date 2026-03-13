import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subject, takeUntil } from 'rxjs';
import { CapturarRequerimientoComponent } from '../capturar-requerimiento/capturar-requerimiento.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitarDocumentosEvaluacionComponent } from '../solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';
import { SolicitudRequerimientoQuery } from '../../../estados/queries/requerimientos.query';
import { SolicitudRequerimientosState } from '../../../estados/evaluacion-solicitud/requerimientos.store';

@Component({
  selector: 'app-requerimiento-informacion',
  standalone: true,
  imports: [CommonModule, CapturarRequerimientoComponent, SolicitarDocumentosEvaluacionComponent],
  templateUrl: './requerimiento-informacion.component.html',
  styleUrl: './requerimiento-informacion.component.scss',
})
export class RequerimientoInformacionComponent implements OnInit, OnDestroy {
  /**
    * Notificador para destruir las suscripciones.
    */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Estado de requerimiento de la información
   */
  public requerimientoState!: SolicitudRequerimientosState;
  /**
   * Índice de la pestaña seleccionada
  */
  indiceDictamen: number = 1;
  constructor(
    private router: Router,
    private solicitudRequerimientoQuery: SolicitudRequerimientoQuery,
  ) {
      // do nothing.
  }
  ngOnInit(): void {
    this.solicitudRequerimientoQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.requerimientoState = seccionState;
        })
      )
      .subscribe();
  }
   /**
   * Se ejecuta al destruir el componente.
   */
   ngOnDestroy(){
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
  /**
    * Método para seleccionar la pestaña
    * @param i indica el número de la pestaña seleccionada
    */
  seleccionaTab(i: number): void {
    this.indiceDictamen = i;
  }
  /**
   * Método para la función del botón continuar
   */
  continuar(): void {
    /**
     * Indica el tpo de requerimiento de la infomación requerida donde se encuentran 3 opciones
     * 1.- Docuemntos
     * 2.- Datos y Documentos
     * 3.- Datos 
     */
    const DATOS = 3;
    if (this.indiceDictamen === 2 || Number(this.requerimientoState.idTipoRequerimiento) === DATOS) {
      this.router.navigate(['funcionario/firma-electronica']);
    } else {
      this.indiceDictamen = 2;
    }
  }
}
