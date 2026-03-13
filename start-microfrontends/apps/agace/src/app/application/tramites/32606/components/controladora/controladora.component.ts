import { CONTROLADAS_TABLA, RADIO_01, RADIO_AUTORIZO, RADIO_CLASIFICACION, TRANSPORTISTAS_TABLA } from '../../constantes/adace32606.enum';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, InputFecha, InputFechaComponent, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { FECHA_INICIO, FECHA_PAGO } from '../../models/adace.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../../state/tramite32606.store';
import { CommonModule } from '@angular/common';
import { ControladoraLabelEnum } from '../../constantes/labels32606.enum';
import { EconomicoService } from '../../services/economico.service';
import { Tramite32606Query } from '../../state/tramite32606.query';
/**
 * Componente encargado de gestionar el formulario de la sección "Controladora".
 * Permite inicializar, habilitar/deshabilitar y actualizar los valores del formulario,
 * así como interactuar con el estado global y los servicios relacionados.
 */
@Component({
  selector: 'app-controladora',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputRadioComponent, InputFechaComponent, TituloComponent,
    TablaDinamicaComponent
  ],
  templateUrl: './controladora.component.html',
  styleUrl: './controladora.component.scss',
})
export class ControladoraComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal de la sección controladora. */
  public controladoraForm !: FormGroup;
  /** Opciones para el radio tipo 01. */
  radioOpcions01 = RADIO_01;
  /** Opciones para el radio de autorización. */
  radioAutorizo = RADIO_AUTORIZO;
  /** Opciones para el radio de clasificación. */
  radioClasificacion = RADIO_CLASIFICACION;
  /** Configuración para el campo de fecha de inicio. */
  fechaInicio: InputFecha = FECHA_INICIO;
  /** Configuración para el campo de fecha de pago. */
  fechaDePago: InputFecha = FECHA_PAGO;
  /** Referencia a la tabla de selección. */
  TablaSeleccion = TablaSeleccion;
  /** Configuración de la tabla de transportistas. */
  public transportistasTabla = TRANSPORTISTAS_TABLA;
  /** Configuración de la tabla de controladas. */
  public controladasTabla = CONTROLADAS_TABLA;
  /** Indica si el formulario está en modo solo lectura. */
  soloLectura: boolean = false;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Observable para controlar la destrucción de suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
  /** Etiquetas para los campos del formulario. */
  enumEtiquetas = ControladoraLabelEnum;

  /** Constructor que inicializa servicios y suscripciones. */
  constructor(private economico: EconomicoService,
    public query: Tramite32606Query,
    public store: Tramite32606Store,
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /** Inicializa el formulario y sus valores según el modo solo lectura. */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.inicializarEstadoFormulario();
  }

  /** Establece el estado inicial del formulario según soloLectura. */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /** Habilita o deshabilita el formulario según soloLectura. */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.controladoraForm.disable();
    } else {
      this.controladoraForm.enable();
    }
  }

  /** Actualiza el campo fechaInicio en el formulario y store. */
  cambioFechaInicio(nuevo_fechaInicio: string): void {
    this.controladoraForm.patchValue({
      fechaPago: nuevo_fechaInicio,
    });
    this.setValoresStore(this.controladoraForm, 'fechaInicio', 'setFechaInicio');
  }

  /** Actualiza el campo fechaPago en el formulario y store. */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.controladoraForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.controladoraForm, 'fechaInicio', 'setFechaPago');
  }

  /** Marca todos los campos como tocados si el formulario es inválido. */
  validarDestinatarioFormulario(): void {
    if (this.controladoraForm.invalid) {
      this.controladoraForm.markAllAsTouched();
    }
  }

  /** Actualiza un valor en el store usando el nombre del método. */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32606Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** Inicializa el formulario con los valores del estado de la solicitud. */
  donanteDomicilio(): void {
    this.controladoraForm = this.fb.group({
      tipoRadio21: [{ value: this.solicitudState?.tipoRadio21, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio22: [{ value: this.solicitudState?.tipoRadio22, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio23: [{ value: this.solicitudState?.tipoRadio23, disabled: this.soloLectura }, [Validators.required]],
      monto: [{ value: this.solicitudState?.monto, disabled: this.soloLectura }, [Validators.required]],
      operacionesBancarias: [{ value: this.solicitudState?.operacionesBancarias, disabled: this.soloLectura }, [Validators.required]],
      llavePago: [{ value: this.solicitudState?.llavePago, disabled: this.soloLectura }, [Validators.required]],
      modalidad: [{ value: this.solicitudState?.modalidad, disabled: this.soloLectura }, [Validators.required]],
      fechaRegistro: [{ value: this.solicitudState?.fechaRegistro, disabled: this.soloLectura }, [Validators.required]],
      numeroAutorizacion: [{ value: this.solicitudState?.numeroAutorizacion, disabled: this.soloLectura }, [Validators.required]],
      radioAutorizo: [{ value: this.solicitudState?.radioAutorizo, disabled: this.soloLectura }, [Validators.required]],
      radioClasificacion: [{ value: this.solicitudState?.radioClasificacion, disabled: this.soloLectura }, [Validators.required]],
    });
  }

  /** Libera recursos y completa el observable destroyed$ al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}