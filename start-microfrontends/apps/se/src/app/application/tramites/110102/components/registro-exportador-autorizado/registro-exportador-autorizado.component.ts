/**
 * Este componente maneja el registro de exportadores autorizados, incluyendo la interacción con el estado global y la validación de formularios.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConsultaioQuery, ExportadorAutorizadoService } from "@ng-mf/data-access-user";
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';
import { Tramite110102Store } from '../../estados/store/tramite110102.store';

/**
 * Componente que gestiona el registro de exportadores autorizados, incluyendo opciones específicas para Japón.
 */
@Component({
  selector: 'app-registro-exportador-autorizado',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, InputRadioComponent],
  templateUrl: './registro-exportador-autorizado.component.html',
  styleUrls: ['./registro-exportador-autorizado.component.scss'],
})
export class RegistroExportadorAutorizadoComponent implements OnInit, OnDestroy {
  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  esSoloLectura!: boolean;

  /**
   * Opciones de exportador autorizado.
   */
  opcionesExportador!: { label: string; value: string | number }[];

  /**
   * Opciones de exportador autorizado para Japón.
   */
  opcionesExportadorJapon!: { label: string; value: string | number }[];

  /**
   * Formulario reactivo para gestionar los datos del registro de exportador autorizado.
   */
  formularioRegistroExportador!: FormGroup;

  /**
   * Indica si se debe mostrar el bloque de opciones de exportador autorizado.
   */
  mostrarOpcionesExportador: boolean = false;

  /**
   * Indica si se debe mostrar el bloque de opciones de exportador autorizado para Japón.
   */
  mostrarOpcionesExportadorJapon: boolean = false;

  /**
   * Subject que emite un evento cuando el componente es destruido, permitiendo la desuscripción de observables.
   */
  private destruido$ = new Subject<void>();

  /**
   * Constructor del componente.
   * @param {FormBuilder} formBuilder - Servicio para la creación de formularios reactivos.
   * @param {ExportadorAutorizadoService} servicioExportador - Servicio para obtener datos de exportadores autorizados.
   * @param {Tramite110102Store} estadoTramite - Servicio para manejar el estado del trámite.
   * @param {Tramite110102Query} consultaTramite - Servicio para consultar el estado del trámite.
   */
  constructor(
    private formBuilder: FormBuilder,
    private consultaQuery: ConsultaioQuery,
    private servicioExportador: ExportadorAutorizadoService,
    private estadoTramite: Tramite110102Store,
    private consultaTramite: Tramite110102Query
  ) {}

  /**
   * Hook del ciclo de vida que se llama después de que las propiedades enlazadas a datos de una directiva se inicializan.
   * Inicializa el formulario y configura las suscripciones necesarias.
   */
  ngOnInit(): void {
    this.inicializarFormulario();
    this.consultaQuery.selectConsultaioState$
      .pipe(takeUntil(this.destruido$))
      .subscribe((estadoSeccion) => {
        this.esSoloLectura = estadoSeccion.readonly;
        this.habilitarDeshabilitarFormulario();
      });
  }

  /**
   * Inicializa el formulario con los valores predeterminados y obtiene datos del estado global.
   */
  inicializarFormulario(): void {
    this.formularioRegistroExportador = this.formBuilder.group({
      solicitaSeparacionContable: [false],
      solicitaExportadorAutorizado: [false],
      condicionExportador: [''],
      solicitaExportadorAutorizadoJPN: [false],
      condicionExportadorJPN: ['']
    });
    this.obtenerValoresDelEstado();
    this.obtenerOpcionesExportador();
    this.obtenerOpcionesExportadorJapon();
  }

  /**
   * Habilita o deshabilita los controles del formulario según el estado de solo lectura.
   */
  habilitarDeshabilitarFormulario(): void {
    if (this.esSoloLectura) {
      this.formularioRegistroExportador.disable();
    } else {
      this.formularioRegistroExportador.enable();
    }
  }

  /**
   * Maneja el cambio del control `solicitaExportadorAutorizado`.
   * @param {Event} evento - El evento de cambio.
   */
  alCambiarExportadorAutorizado(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    this.mostrarOpcionesExportador = INPUT.checked;
    this.establecerValoresEnEstado(this.formularioRegistroExportador, 'solicitaExportadorAutorizado');

    if (!INPUT.checked) {
      this.estadoTramite.establecerDatos({ condicionExportador: '' });
    }
  }

  /**
   * Maneja el cambio del control `solicitaExportadorAutorizadoJapon`.
   * @param {Event} evento - El evento de cambio.
   */
  alCambiarExportadorAutorizadoJapon(evento: Event): void {
    const INPUT = evento.target as HTMLInputElement;
    this.mostrarOpcionesExportadorJapon = INPUT.checked;
    this.establecerValoresEnEstado(this.formularioRegistroExportador, 'solicitaExportadorAutorizadoJPN');

    if (!INPUT.checked) {
      this.estadoTramite.establecerDatos({ condicionExportadorJPN: '' });
    }
  }

  /**
   * Obtiene las opciones de exportador autorizado desde el servicio.
   */
  obtenerOpcionesExportador(): void {
    this.servicioExportador.getExportadorAutorizado()
      .pipe(takeUntil(this.destruido$))
      .subscribe((datos) => {
        this.opcionesExportador = datos;
      });
  }

  /**
   * Obtiene las opciones de exportador autorizado para Japón desde el servicio.
   */
  obtenerOpcionesExportadorJapon(): void {
    this.servicioExportador.getExportadorAutorizadoJPN()
      .pipe(takeUntil(this.destruido$))
      .subscribe((datos) => {
        this.opcionesExportadorJapon = datos;
      });
  }

  /**
   * Establece los valores en el estado global a partir de un campo específico del formulario.
   * @param {FormGroup} formulario - El formulario reactivo del cual se obtiene el valor.
   * @param {string} campo - El nombre del campo del formulario cuyo valor se establecerá en el estado.
   */
  establecerValoresEnEstado(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    this.estadoTramite.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Obtiene los valores del estado global y los asigna al formulario.
   */
  obtenerValoresDelEstado(): void {
    this.consultaTramite.selectTramite110102$
      .pipe(
        takeUntil(this.destruido$),
        map((estadoSeccion) => {
          this.formularioRegistroExportador.patchValue({
            solicitaSeparacionContable: estadoSeccion.solicitaSeparacionContable,
            solicitaExportadorAutorizado: estadoSeccion.solicitaExportadorAutorizado,
            condicionExportador: estadoSeccion.condicionExportador,
            solicitaExportadorAutorizadoJPN: estadoSeccion.solicitaExportadorAutorizadoJPN,
            condicionExportadorJPN: estadoSeccion.condicionExportadorJPN
          });
        })
      )
      .subscribe();

    this.mostrarOpcionesExportador = this.formularioRegistroExportador.get('solicitaExportadorAutorizado')?.value;
    this.mostrarOpcionesExportadorJapon = this.formularioRegistroExportador.get('solicitaExportadorAutorizadoJPN')?.value;
  }

  /**
   * Hook del ciclo de vida que se llama cuando la directiva se destruye.
   * Completa el subject `destruido$` para desuscribirse de todos los observables.
   */
  ngOnDestroy(): void {
    this.destruido$.next();
    this.destruido$.complete();
  }
}

