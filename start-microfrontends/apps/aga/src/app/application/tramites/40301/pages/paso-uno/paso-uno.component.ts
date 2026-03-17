import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { CapturarComponent } from '../../components/capturar/capturar.component';
import { CapturarService } from '../../services/capturar.service';
import { FormularioSolicitud } from '../../modelos/datos-formulario.model';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /**
   * Representa el índice de la pestaña activa.
   * Se utiliza para rastrear y gestionar la pestaña actualmente seleccionada.
   * 
   * @type {number}
   */
  indice: number = 1;

  /**
   * Evento que se emite cuando se cambia la pestaña activa.
   * El valor emitido es el índice de la nueva pestaña seleccionada.
   * 
   * @type {EventEmitter<number>}
   */
  @Output() pestanaCambiado = new EventEmitter<number>();

  /**
   * Evento que se emite para indicar si el formulario es válido.
   * El valor emitido es un booleano que representa el estado de validez.
   * 
   * @type {EventEmitter<boolean>}
   */
  @Output() isValid = new EventEmitter<boolean>();

  /**
   * Referencia al componente `CapturarComponent` hijo.
   * Se utiliza para interactuar con el componente capturar desde este componente.
   * 
   * @type {CapturarComponent}
   */
  @ViewChild(CapturarComponent) capturarComponent!: CapturarComponent;

  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /** Subject para notificar la destrucción del componente. */
  public destroyNotifier$: Subject<void> = new Subject();
  /**
  * @property {ConsultaioState} consultaDatos
  * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
  */
  consultaDatos!: ConsultaioState;

  constructor(
    private capturarService: CapturarService,
    private consultaQuery: ConsultaioQuery
  ) {
    
  }
  /**
   * Constructor del componente `PasoUnoComponent`.
   * Inicializa el componente y establece el índice de la pestaña activa.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
    .pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaDatos = seccionState;
    })).subscribe();

    if (this.consultaDatos.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.capturarService.getTramiteSavedData()
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.capturarService.actualizarEstadoFormulario(resp);
        }
      });
  }
  /**
   * @method seleccionaTab
   * @description
   * Cambia la pestaña activa y emite el nuevo índice seleccionado.
   * @param {number} i - Índice de la pestaña seleccionada.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
    this.pestanaCambiado.emit(this.indice);
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Este método emite un valor al `destroyNotifier$` y lo completa para cancelar
   * todas las suscripciones activas y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Valida el formulario del paso uno y marca errores visuales
   * @returns boolean - true si es válido
   */
  public validarFormulario(): boolean {
    const SOL_FORM = this.capturarComponent?.solicitudForm;
    if (SOL_FORM) {
      if (SOL_FORM.invalid) {
        SOL_FORM.markAllAsTouched(); // Activa los mensajes de error en el HTML
        return false;
      }
      return true;
    }

    return false;
  }

  /**
   * Obtiene los valores actuales del formulario
   * @returns los datos del formulario (ej. datos del Director General)
   */
  public obtenerDatos(): FormularioSolicitud {
    return this.capturarComponent?.solicitudForm?.value as FormularioSolicitud;
  }

  /**
   * Resetea el formulario a su estado inicial
   */
  public limpiarFormulario(): void {
    this.capturarComponent?.solicitudForm?.reset();
  }

}

