import { catchError, map, of, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatosGeneralesDelTramite, TareasActivas } from '../../core/models/datos-generales-del-tramite.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SolicitudTramiteQuery } from '../../estados/queries/tramite.query';
import { TramiteService } from '../../core/service/tramite.service';
import { TramiteState } from '../../estados/tramite/tramite.store';

@Component({
  selector: 'app-datos-generales-tramite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './datos-generales-tramite.component.html',
  styleUrl: './datos-generales-tramite.component.scss',
})
export class DatosGeneralesTramiteComponent implements OnInit, OnDestroy {
  /** 
  * Subject para destruir las suscripciones.
  */
  private destruirSuscripcion$: Subject<void> = new Subject();
  /** Formulario de tramite */
  public FormTramite!: FormGroup;
  /** Datos generales del tramite */
  datosGeneralesTramite: DatosGeneralesDelTramite = {
    numeroDeTramite: "",
    tipoDeSolicitud: "",
    diasHabilesTranscurridos: "",
    tareasActivas: []
  };
  /** Lista de tareas activas */
  tareas: TareasActivas[] = [];
  /**
  * Notificador para destruir las suscripciones.
  */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
     * Estado de la solicitud.
     */
  public solicitudTramiteState!: TramiteState;
  /**
   * idTramite
   */
  idTramite: string = "";
  constructor(
    private tramiteService: TramiteService,
    private fb: FormBuilder,
    private solicitudtramiteQuery: SolicitudTramiteQuery,
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente.
   * Inicializa el formulario de tramite y consulta los datos generales del tramite.
   */
  ngOnInit(): void {
    this.inicializaFormTramite();
    this.solicitudtramiteQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudTramiteState = seccionState;
          this.idTramite = seccionState.idTramite;
        })
      )
      .subscribe();
    this.consultarDatosGeneralesTramite();
  }

  /**
   * Inicializa el formulario de tramite
   * @returns {void}
   */
  inicializaFormTramite(): void {
    this.FormTramite = this.fb.group({
      numeroDeTramite: [{ value: '', disabled: true }],
      tipoDeSolicitud: [{ value: '', disabled: true }],
      diasHabilesTranscurridos: [{ value: '', disabled: true }],
      tareasActivas: [[]]
    });
  }

  /**
   * Consulta los datos generales del tramite
   * @returns {void}
   */
  consultarDatosGeneralesTramite(): void {
    this.tramiteService.obtenerDatosTramite(this.idTramite)
      .pipe(
        map((data) => {
          // Asignar los datos al formulario
          this.FormTramite.get('numeroDeTramite')?.setValue(data.numeroDeTramite);
          this.FormTramite.get('tipoDeSolicitud')?.setValue(data.tipoDeSolicitud);
          this.FormTramite.get('diasHabilesTranscurridos')?.setValue(data.diasHabilesTranscurridos);
          this.FormTramite.get('tareasActivas')?.setValue(data.tareasActivas);
          this.tareas = data.tareasActivas;

        }),
        catchError((_error) => {
          console.error('Error al consultar datos del trámite', _error);
          return of(null);
        }),
        takeUntil(this.destruirSuscripcion$)
      )
      .subscribe();
  }

  /**
* Se ejecuta al destruir el componente.
* Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
*/
  ngOnDestroy(): void {
    this.destruirSuscripcion$.next();
    this.destruirSuscripcion$.complete();
  }
}
