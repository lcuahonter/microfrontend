import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud130301State } from '../../../../estados/tramites/tramite130301.store';
import { SolicitudForma } from '@libs/shared/data-access-user/src/core/models/130301/solicitud-prorroga.model';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite130301Query } from '../../../../estados/queries/tramite130301.query';

/**
 * Componente para gestionar la solicitud del trámite.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule
  ],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para la solicitud.
   */
  solicitudForm!: FormGroup;

  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Datos del formulario de la solicitud obtenidos del servicio.
   */
  solicitudFormDatos: SolicitudForma[] = [];

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud130301State;

  /**
   * Constructor del componente.
   * @param fb Constructor de formularios reactivos.
   * @param tramite130301Query Query para obtener el estado del trámite 130301.
   */
  constructor(
    private fb: FormBuilder,
    private tramite130301Query: Tramite130301Query
  ) {
    this.tramite130301Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.solicitudState = seccionState;
      })
    )
    .subscribe();
  }

  /**
   * Método de inicialización del componente.
   */
  ngOnInit(): void {
    this.crearFormulario();
  }
  /**
   * Crea y configura un formulario reactivo para gestionar la solicitud del trámite con campos deshabilitados.
   */
  crearFormulario():void{
    this.solicitudForm = this.fb.group({
      folio: [{ value: '', disabled: true }],
      fechaInicio: [{ value: '', disabled: true }],
      estatusSolicitud: [{ value: '', disabled: true }],
      folioResolucion: [{ value: '', disabled: true }]
    });
  }

  /**
   * Obtiene los datos del formulario desde el servicio.
   */
  obtenerFormDatos(): void {
    this.solicitudForm.patchValue({
      folio: this.solicitudState?.numeroFolioTramiteOriginal,
      fechaInicio: this.solicitudState?.fechaInicioProrroga,
      estatusSolicitud: this.solicitudState?.estatusSolicitud,
      folioResolucion: this.solicitudState?.folioPermiso
    });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * Libera los recursos y destruye los observables activos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}