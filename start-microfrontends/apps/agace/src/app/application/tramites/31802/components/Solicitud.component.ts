import {
  AlertComponent,
  ConsultaioState,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_SOLO_NUMEROS,
  TEXTOS,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FECHA_FINAL,
  FECHA_INICIAL,
  FECHA_PAGO,
} from '../model/registro.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReplaySubject, Subject, map, takeUntil } from 'rxjs';
import {
  Solicitud31802State,
  Tramite31802Store,
} from '../state/Tramite31802.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { RegistroSolicitudService } from './../services/registro-solicitud-service.service';
import { Solicitud31802Enum } from '../constants/solicitud31802.enum';
import { Tramite31802Query } from '../state/Tramite31802.query';

/**
 * Componente que gestiona la solicitud del trámite 31803.
 * Contiene la lógica para inicializar el formulario, manejar eventos y comunicarse con el estado global.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputFechaComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    AlertComponent,
    NotificacionesComponent,
  ],
  providers: [RegistroSolicitudService],
  templateUrl: './Solicitud.component.html',
  styleUrl: './Solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Observable para manejar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas.
   */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud31802State;

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
   * Enumeración que contiene los textos utilizados en el componente.
   */
  solicitudEnum = Solicitud31802Enum;

  /**
   * Formulario reactivo para gestionar los datos de la solicitud.
   */
  registroForm!: FormGroup;

  /**
   * Flag para determinar si el formulario es de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Subject para destruir notificador.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Consulta los datos del formulario.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Valor seleccionado del radio.
   */
  valorSeleccionado!: string;

  /**
   * Opciones de radio.
   */
  radioOpcions = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' },
  ];

  /**
   * Textos utilizados en el componente.
   */
  TEXTOS = TEXTOS.ADVERTENCIA;

  /**
   * Información de alerta.
   */
  infoAlert = 'alert-danger';

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaAlertaNotificacion!: Notificacion;

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   *
   * @param registroSolicitud Servicio para obtener datos relacionados con la solicitud.
   * @param fb Constructor de formularios reactivos.
   * @param store Almacén global para gestionar el estado del trámite.
   * @param query Consulta para obtener el estado actual del trámite.
   * @param validacionesService Servicio para validar campos del formulario.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    public fb: FormBuilder,
    public store: Tramite31802Store,
    private query: Tramite31802Query,
    public validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario, obtiene datos iniciales y suscribe al estado global.
   */
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
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosDelFormulario();
    } else {
      this.donanteDomicilio();
    }
  }
  /**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.registroForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.registroForm, 'fechaPago', 'setFechaPago');
  }
  /**
   * Maneja el envío del formulario.
   * Valida el formulario antes de realizar acciones adicionales.
   */
  enviarFormulario(): void {
    if (this.registroForm.valid) {
      // Aquí se implementará la lógica para manejar el envío del formulario.
    }
  }

  /**
   * Cambia el valor seleccionado del radio.
   * @param valor Valor seleccionado.
   */
  cambiarRadio(valor: string | number): void {
    this.valorSeleccionado = valor as string;
    this.store.setValorSeleccionado(this.valorSeleccionado);
    if (this.valorSeleccionado === 'no') {
      this.abrirAlertaModal();
    }
  }

  /**
   * Verifica si un campo del formulario es válido.
   *
   * @param form Formulario reactivo.
   * @param field Nombre del campo a validar.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Marca todos los campos del formulario como tocados si es inválido.
   */
  validarDestinatarioFormulario(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
    }
  }

  /**
   * Guarda los datos del formulario en el estado global.
   */
  guardarDatosDelFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.registroForm.disable();
    } else {
      this.registroForm.enable();
    }
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   *
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el almacén para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31802Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa el formulario con los valores actuales del estado.
   */
  donanteDomicilio(): void {
    this.registroForm = this.fb.group({
      numeroOficio: [
        {
          value: this.solicitudState?.numeroOficio,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.required],
      ],
      llave: [
        {
          value: this.solicitudState?.llave,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.required, Validators.maxLength(20)],
      ],
      manifiesto1: [
        {
          value: this.solicitudState?.manifiesto1,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
      manifiesto2: [
        {
          value: this.solicitudState?.manifiesto2,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
      manifiesto3: [
        {
          value: this.solicitudState?.manifiesto3,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
      numeroOperacion: [
        {
          value: this.solicitudState?.numeroOperacion,
          disabled: this.esFormularioSoloLectura,
        },
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(REGEX_SOLO_NUMEROS),
        ],
      ],
      fechaPago: [
        {
          value: this.solicitudState?.fechaPago,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.required],
      ],
      monedaNacional: [
        {
          value: this.solicitudState?.monedaNacional,
          disabled: this.esFormularioSoloLectura,
        },
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern(REGEX_SOLO_NUMEROS),
        ],
      ],
      fechaInicio: [
        {
          value: this.solicitudState?.fechaInicio,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.required],
      ],
      fechaFinal: [
        {
          value: this.solicitudState?.fechaFinal,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.required],
      ],
      manifiesto4: [
        {
          value: this.solicitudState?.manifiesto4,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
      manifiesto5: [
        {
          value: this.solicitudState?.manifiesto5,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
      opcion: [
        {
          value: this.solicitudState?.opcion,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.required],
      ],
    });
  }

  /**
   * Abre el modal de alerta.
   * @returns {void}
   */
  abrirAlertaModal(): void {
    this.nuevaAlertaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: TEXTOS.ADVERTENCIA,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Ok',
      txtBtnCancelar: '',
    };
  }

  /**
   * Valida el formulario y marca los campos requeridos como tocados.
   * @returns {boolean} - Retorna verdadero si el formulario es válido, falso en caso contrario.
   */
  validarFormulario(): boolean {
    let campos: string[] = [];

    if (this.solicitudState.renovacion && this.solicitudState.homologacion) {
      // Ambos verdaderos
      campos = [
        'fechaPago',
        'numeroOperacion',
        'llave',
        'monedaNacional',
        'manifiesto1',
        'manifiesto2',
        'manifiesto5',
        'manifiesto4',
        'opcion',
      ];
    } else if (
      this.solicitudState.renovacion &&
      !this.solicitudState.homologacion
    ) {
      // Solo renovación
      campos = [
        'fechaPago',
        'numeroOperacion',
        'llave',
        'monedaNacional',
        'manifiesto1',
        'manifiesto2',
        'manifiesto3',
      ];
    } else if (
      !this.solicitudState.renovacion &&
      this.solicitudState.homologacion
    ) {
      // Solo homologación
      campos = ['manifiesto5', 'manifiesto4', 'opcion'];
    } else {
      // Ambos falso
      campos = ['manifiesto5'];
    }

    // Marca los campos como tocados para que aparezcan los mensajes de validación
    campos.forEach((campo) => {
      this.registroForm.get(campo)?.markAsTouched();
      this.registroForm.get(campo)?.updateValueAndValidity();
    });

    // Retorna falso si alguno de los campos requeridos es inválido
    if (campos.some((campo) => this.registroForm.get(campo)?.invalid)) {
      return false;
    }

    return true;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
