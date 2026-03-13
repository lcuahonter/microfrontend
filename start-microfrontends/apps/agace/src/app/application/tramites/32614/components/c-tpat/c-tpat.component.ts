import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadio } from '../../models/solicitud.model';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud32614Query } from '../../estados/solicitud32614.query';
import { Solicitud32614State } from '../../estados/solicitud32614.store';
import { Solicitud32614Store } from '../../estados/solicitud32614.store';
import { SolicitudRadioLista } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';
/**
 * Componente que gestiona el formulario relacionado con la certificación CTPAT.
 * Utiliza radio buttons para capturar respuestas de sí/no relacionadas con la solicitud.
 */
@Component({
  selector: 'app-c-tpat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputRadioComponent],
  providers: [SolicitudService],
  templateUrl: './c-tpat.component.html',
  styleUrl: './c-tpat.component.scss',
})
/**
 * Componente que gestiona el formulario relacionado con la certificación CTPAT.
 * Utiliza radio buttons para capturar respuestas de sí/no relacionadas con la solicitud.
 */
export class CTPATComponent implements OnInit, OnDestroy {
  /** Formulario reactivo que contiene los campos de CTPAT identificados por sus IDs numéricos */
  ctpatForm!: FormGroup;

  /** Subject utilizado para cancelar las suscripciones activas al destruir el componente */
  private destroy$: Subject<void> = new Subject<void>();

  /** Objeto que contiene las opciones de respuesta tipo sí/no para los radio buttons */
  sinoOpcion: InputRadio = {} as InputRadio;

  /** Estado actual de la solicitud obtenido desde el store */
  solicitud32614State: Solicitud32614State = {} as Solicitud32614State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente. Inyecta dependencias necesarias y carga las opciones del radio button.
   * @param fb - FormBuilder para crear el formulario reactivo.
   * @param solicitudService - Servicio que realiza operaciones sobre la solicitud.
   * @param solicitud32614Store - Store para actualizar el estado de la solicitud.
   * @param solicitud32614Query - Query para observar cambios en el estado de la solicitud.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32614Store: Solicitud32614Store,
    public solicitud32614Query: Solicitud32614Query,
    public consultaioQuery: ConsultaioQuery
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirOpcionDeRadio();
  }

  /**
   * Inicializa el componente, crea el formulario y suscribe a los cambios en el estado de la solicitud.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.ctpatForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.ctpatForm.enable();
    }
  }

  /**
   * Inicializa el formulario `ctpatForm` con los valores actuales del estado `solicitud32614State`.
   *
   * Este método crea un formulario reactivo usando `FormBuilder`, asignando los valores
   * de los campos `'2089'`, `'2090'` y `'2091'`. Además, se suscribe al observable
   * `selectSolicitud$` para escuchar actualizaciones del estado y aplicar los valores
   * actualizados al formulario.
   *
   * También gestiona la destrucción de la suscripción usando `takeUntil` con `destroy$`.
   */
  inicializarFormulario(): void {
    this.ctpatForm = this.fb.group({
      '2089': [this.solicitud32614State[2089]],
      '2090': [this.solicitud32614State[2090]],
      '2091': [this.solicitud32614State[2091]],
    });

    this.solicitud32614Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32614State) => {
          this.solicitud32614State = respuesta;
          this.ctpatForm.patchValue({
            '2089': this.solicitud32614State[2089],
            '2090': this.solicitud32614State[2090],
            '2091': this.solicitud32614State[2091],
          });
        })
      )
      .subscribe();
  }

  /**
   * Llama al servicio para obtener las opciones de tipo sí/no para los radio buttons.
   */
  conseguirOpcionDeRadio(): void {
    this.solicitudService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
        },
      });
  }

  /**
   * Actualiza el valor del campo con ID 2089 en el store.
   * @param evento - Valor seleccionado en el radio button.
   */
  actualizar2089(evento: number | string): void {
    this.solicitud32614Store.actualizar2089(evento);
  }

  /**
   * Actualiza el valor del campo con ID 2090 en el store.
   * @param evento - Valor seleccionado en el radio button.
   */
  actualizar2090(evento: number | string): void {
    this.solicitud32614Store.actualizar2090(evento);
  }

  /**
   * Actualiza el valor del campo con ID 2091 en el store.
   * @param evento - Valor seleccionado en el radio button.
   */
  actualizar2091(evento: number | string): void {
    this.solicitud32614Store.actualizar2091(evento);
  }

  /**
   * Cancela todas las suscripciones activas al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
