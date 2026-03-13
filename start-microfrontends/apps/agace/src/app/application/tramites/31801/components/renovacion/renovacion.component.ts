import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { REG_X, TituloComponent } from '@libs/shared/data-access-user/src';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { InputFechaComponent } from '@libs/shared/data-access-user/src/tramites/components/input-fecha/input-fecha.component';

import { InputFecha } from '@libs/shared/data-access-user/src';

import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { FECHA_FINAL, FECHA_INICIAL, FECHA_PAGO } from '../../constantes/renovacion.enum';
import { Manifiestos, ManifiestosRespuesta, RenovacionRespuesta } from '../../models/renovacion.model';
import { Renovacion31801State, Tramite31801Store } from '../../../../estados/tramites/tramite31801.store';
import { RenovacionService } from '../../services/renovacion/renovacion.service';
import { Tramite31801Query } from '../../../../estados/queries/tramite31801.query';

/**
 * Componente para gestionar la renovación de un trámite.
 */
@Component({
  selector: 'app-renovacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputFechaComponent
  ],
  templateUrl: './renovacion.component.html',
  styleUrl: './renovacion.component.scss',
})
export class RenovacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario de renovación.
   * @type {FormGroup}
   */
  renovacionForm!: FormGroup;

  /**
   * Configuración para el campo de fecha inicial.
   */
  fechaInicialInput: InputFecha = FECHA_INICIAL;

  /**
   * Configuración para el campo de fecha final.
   */
  fechaFinalInput: InputFecha = FECHA_FINAL;

  /**
   * Configuración para el campo de fecha de pago.
   */
  fechaPagoInput: InputFecha = FECHA_PAGO;

  /**
   * Lista de manifiestos obtenidos desde el servicio.
   */
  manifiestos: Manifiestos[] = [];

  /**
   * Estado de la renovación.
   * @type {Renovacion31801State}
   */
  public renovacionState!: Renovacion31801State;

  /**
   * Subject para destruir notificador.
   */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   * {boolean}
   */
  esFormularioSoloLectura: boolean = false; 

  /** Suscripción general para manejar y limpiar las suscripciones del componente. Se utiliza para evitar fugas de memoria. */
  private subscription: Subscription = new Subscription();
  
  /**
   * Estado seleccionado del trámite 110218.
   * Contiene los valores actuales almacenados en el estado global.
   */
  estadoSeleccionado!: Renovacion31801State;
  /**
   * Constructor del componente.
   * @param fb FormularioBuilder para crear formularios reactivos.
   * @param tramite31801Store Tienda para gestionar el estado del trámite 31801. 
   * @param tramite31801Query Consulta para obtener datos del trámite 31801.
   * @param renovacionService Servicio para obtener datos de renovación.
   */
  constructor(
    public fb: FormBuilder,
    private tramite31801Store: Tramite31801Store,
    private tramite31801Query: Tramite31801Query,
    private renovacionService: RenovacionService,
    private consultaioQuery: ConsultaioQuery,
  ) { 
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destruirNotificador$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
       this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }
  
  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   * Si es solo lectura, deshabilita los campos y ajusta la configuración de la fecha.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.crearRenovacionForm();
    }
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos y la fecha según corresponda.
   */
  guardarDatosFormulario(): void {
    this.crearRenovacionForm();
    if (this.esFormularioSoloLectura) {
      this.renovacionForm.disable();
    } else {
      this.renovacionForm.enable();
    }
  }

  /**
   * Inicializa los catálogos necesarios para el componente.
   * @returns {void}
   */
  ngOnInit(): void {
    this.obtenerRenovacionDatos();
    this.obtenerManifiestos();

    this.tramite31801Query.selectSeccionState$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.renovacionState = seccionState;
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario()
  }

  /**
   * Inicializa el formulario reactivo
   * @returns {void}
   */
  crearRenovacionForm(): void {
    this.subscription.add(
      this.tramite31801Query.selectSeccionState$
        .pipe(
          takeUntil(this.destruirNotificador$),
          map((seccionState) => {
            this.renovacionState = seccionState;
          })
        )
        .subscribe()
    );

    this.renovacionForm = this.fb.group({
      numeroOficio: [
        { value: this.renovacionState?.numeroOficio || '', disabled: true },
        [
          Validators.required
        ]
      ],
      fechaInicialInput: [
        { value: this.renovacionState?.fechaInicialInput || '', disabled: true }
      ],
      fechaFinalInput: [
        { value: this.renovacionState?.fechaFinalInput || '', disabled: true }
      ],
      fechaPago: [
        this.renovacionState?.fechaPago,
        [Validators.required]
      ],
      monedaNacional: [
        this.renovacionState?.monedaNacional,
        [
          Validators.required
        ]
      ],
      numeroOperacion: [
        this.renovacionState?.numeroOperacion,
        [
          Validators.required,
          Validators.pattern(REG_X.SOLO_NUMEROS)
        ]
      ],
      llavePago: [
        this.renovacionState?.llavePago,
        [
          Validators.required
        ]
      ],
      seleccionadaManifiesto:
        this.fb.array(this.renovacionState?.seleccionadaManifiesto),
    });
  }

  /**
   * Obtiene el FormArray correspondiente a 'seleccionadaManifiesto' dentro del formulario de registro de donación.
   * 
   * @returns {FormArray} El FormArray de 'seleccionadaManifiesto'.
   */
  get seleccionadaManifiesto(): FormArray {
    return this.renovacionForm.get('seleccionadaManifiesto') as FormArray;
  }

  /**
   * Obtiene los datos de renovación desde el servicio y los asigna al formulario.
   * 
   * @returns {void}
   */
  obtenerRenovacionDatos(): void {
    this.renovacionService.obtenerRenovacionDatos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (resultado: RenovacionRespuesta): void => {
          if (resultado) {
            const DATOS = resultado.data[0];
            this.renovacionForm.patchValue({
              numeroOficio: DATOS.numeroOficio,
              fechaFinalInput: DATOS.fechaFinalInput,
              fechaInicialInput: DATOS.fechaInicialInput
            });
          }
        }
      })
  }

  /**
   * Obtiene los manifiestos y los guarda en `manifiestos`.
   * Inicializa `manifiestosSeleccionados` con valores `false`.
   */
  obtenerManifiestos(): void {
    this.renovacionService.getManifiestos()
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe({
        next: (resultado: ManifiestosRespuesta) => {
          this.manifiestos = resultado?.data;
        }
      });
  }

  /**
   * Cambia el estado de la casilla de verificación según el índice.
   * 
   * @param event - El evento que se dispara al cambiar el estado del checkbox.
   * @param {number} index - Índice de la casilla de verificación.
   * 
   * @returns {void}
   */
  onManifiestoCheckboxCambiar(event: Event, index: number): void {
    const VALOR_ENTRADA = event.target as HTMLInputElement;
    this.seleccionadaManifiesto.controls[index].setValue(VALOR_ENTRADA.checked);
    this.setValorStore(this.renovacionForm, 'seleccionadaManifiesto');
  }

  /**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.renovacionForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValorStore(this.renovacionForm, 'fechaPago');
  }

  /**
   * Obtiene el estado actual del trámite desde el store.
   * Suscribe al observable del estado y actualiza la propiedad `estadoSeleccionado`.
   */
  getValorStore(): void {
    this.tramite31801Query.selectSeccionState$
      .pipe(takeUntil(this.destruirNotificador$))
      .subscribe((data) => {
        this.estadoSeleccionado = data;
      });
  }
  
  /**
   * Actualiza un valor específico en el store del trámite.
   * FormGroup - Formulario reactivo.
   * control - Nombre del control cuyo valor se actualizará en el store.
   */
   setValorStore(FormGroup: FormGroup, control: string): void {
    const VALOR = FormGroup.get(control)?.value;
    this.tramite31801Store.setTramite31801State({
      [control]: VALOR,
    });
   }

  /**
   * Se ejecuta al destruir el componente.
   * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
}