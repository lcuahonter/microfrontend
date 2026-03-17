import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, FormularioDinamico } from '@ng-mf/data-access-user';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { EconomicoService } from '../../services/economico.service';
import { FormGroup } from '@angular/forms';
import { Solicitud32606State } from '../../state/tramite32606.store';

/** Componente que representa el primer paso del trámite. */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Tipo de persona seleccionada. */
  tipoPersona!: number;
  /** Datos del formulario de persona. */
  persona: FormularioDinamico[] = [];
  /** Datos del formulario de domicilio fiscal. */
  domicilioFiscal: FormularioDinamico[] = [];
  /** Índice de la pestaña seleccionada. */
  indice: number = 1;
  /** Observable para manejar la destrucción del componente y cancelar suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
  /** Formulario reactivo principal del solicitante. */
  solicitanteForm!: FormGroup;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Indica si el formulario está en modo solo lectura. */
  esFormularioSoloLectura: boolean = false;
  /** Estado de consulta actual para el formulario. */
  public consultaState!: ConsultaioState;
  /** Indica si se muestran los datos de respuesta. */
  public esDatosRespuesta: boolean = false;

  /** Constructor que inyecta los servicios necesarios. */
  constructor(
    public economico: EconomicoService,
    public consultaioQuery: ConsultaioQuery,
  ) {
    // El constructor se utiliza para la inyección de dependencias.
  }

  /** Método que se ejecuta al inicializar el componente. */
  ngOnInit(): void {
    this.consultaioQuery.selectConsultaioState$.pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        this.consultaState = seccionState;
      })
    ).subscribe();
    if (this.consultaState.update) {
      this.guardarDatosFormularios();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormularios(): void {
    this.economico
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.economico.actualizarEstadoFormulario(resp);
        }
      });
  }

  /** Selecciona una pestaña del asistente. */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /** Método que se ejecuta al destruir el componente y libera recursos de suscripciones. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}