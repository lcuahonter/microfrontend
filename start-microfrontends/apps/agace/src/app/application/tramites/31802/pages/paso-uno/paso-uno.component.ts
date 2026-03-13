import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ConsultaioQuery,
  ConsultaioState,
  FormularioDinamico,
  ValidacionesFormularioService,
} from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject, map, takeUntil } from 'rxjs';
import {
  Solicitud31802State,
  Tramite31802Store,
} from '../../state/Tramite31802.store';
import { RegistroSolicitudService } from '../../services/registro-solicitud-service.service';
import { SolicitudComponent } from '../../components/Solicitud.component';
import { Tramite31802Query } from '../../state/Tramite31802.query';

/**
 * Componente que representa el primer paso del trámite.
 */
@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styles: ``,
})
export class PasoUnoComponent implements OnInit, OnDestroy {
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false; // Indica si hay datos de respuesta del servidor

  private destroyNotifier$: Subject<void> = new Subject(); // Subject para manejar la destrucción de suscripciones
  public consultaState!: ConsultaioState; // Estado de la consulta

  /**
   * Tipo de persona seleccionada.
   */
  tipoPersona!: number;
  /**
   * Observable para manejar la destrucción del componente.
   * Se utiliza para cancelar suscripciones activas.
   */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /**
   * Configuración del formulario dinámico para la persona.
   */
  persona: FormularioDinamico[] = [];

  /**
   * Configuración del formulario dinámico para el domicilio fiscal.
   */
  domicilioFiscal: FormularioDinamico[] = [];

  /**
   * Índice del paso actual.
   */
  indice: number = 1;
  /**
   * Formulario reactivo que contiene los campos del paso uno del trámite.
   * Este formulario se utiliza para capturar y validar los datos ingresados por el usuario.
   */
  registroForm!: FormGroup;
  /**
   * Estado global de la solicitud 31802.
   * Contiene los valores actuales del trámite, como renovación, homologación, y otros datos relevantes.
   */
  public solicitudState!: Solicitud31802State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Subject para destruir notificador.
   */
  consultaDatos!: ConsultaioState;

  /**
   * Referencia al componente SolicitudComponent
   */
  @ViewChild(SolicitudComponent) solicitudComponent!: SolicitudComponent;

  /**
   * Constructor del componente PasoUnoComponent.
   *
   * @param fb - Servicio FormBuilder utilizado para construir formularios reactivos.
   * @param store - Almacén de estado para gestionar y almacenar datos relacionados con el trámite 31802.
   * @param query - Consulta para obtener datos del estado global del trámite 31802.
   * @param validacionesService - Servicio para realizar validaciones personalizadas en los formularios.
   */
  constructor(
    private consultaQuery: ConsultaioQuery, // Servicio para consultar el estado
    public fb: FormBuilder,
    private store: Tramite31802Store,
    private validacionesService: ValidacionesFormularioService,
    private solicitud31802Service: RegistroSolicitudService, // Servicio para manejar el estado de la solicitud 31802
    private query: Tramite31802Query
  ) {
    this.consultaQuery.selectConsultaioState$
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
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((consultaState) => {
          this.consultaState = consultaState;
        })
      )
      .subscribe();

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((solicitudState) => {
          this.solicitudState = solicitudState;
        })
      )
      .subscribe();

    this.donanteDomicilio();

    // Inicializa el formulario con los valores actuales del estado
    if (this.consultaState?.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
   * Método que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas para evitar fugas de memoria.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosDelFormulario();
    } else {
      this.donanteDomicilio();
    }
  }
  /**
   * Método para guardar los datos del formulario.
   * Se suscribe al servicio de registro de solicitud y actualiza el estado del formulario con los datos obtenidos.
   */
  guardarDatosFormulario(): void {
    // Método para guardar los datos del formulario
    this.solicitud31802Service
      .getDatosDeAvisoRenovacionDoc()
      .pipe(
        takeUntil(this.destroyNotifier$) // Se desuscribe al destruir el componente
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true; // Marca que hay datos de respuesta
          this.solicitud31802Service.actualizarEstadoFormulario(resp); // Actualiza el estado del formulario con la respuesta
        }
      });
  }

  /**
   * Establece el valor de renovación en el estado global.
   * @param evento Evento del tipo `Event` que contiene el valor del checkbox.
   */
  establecerRenovacion(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).checked;
    this.store.setRenovacion(VALOR);
  }

  /**
   * Establece el valor de homologación en el estado global.
   * @param evento Evento del tipo `Event` que contiene el valor del checkbox.
   */
  establecerHomologacion(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).checked;
    this.store.setHomologacion(VALOR);
  }
  /**
   * Selecciona una pestaña del asistente.
   * @param i Índice de la pestaña a seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }
  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  guardarDatosDelFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.registroForm?.disable();
    } else {
      this.registroForm?.enable();
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
      renovacion: [
        {
          value: this.solicitudState?.renovacion,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
      homologacion: [
        {
          value: this.solicitudState?.homologacion,
          disabled: this.esFormularioSoloLectura,
        },
        [Validators.requiredTrue],
      ],
    });
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