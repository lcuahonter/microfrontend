import {
  AVISO_DE_FUSION_RADIO_OPCIONES,
  CUENTA_DE_BOTON_DE_RADIO_OPCIONES,
  FUSIONE_FECHA_INPUT,
  TIPO_DE_BOTON_DE_RADIO_OPCIONES,
} from '../../constants/solicitud33304.enum';
import {
  CatalogoSelectComponent,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  Solicitud33304State,
  Solicitud33304Store,
} from '../../estados/solicitud33304Store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosEmpresasFusionadasComponent } from '../datos-empresas-fusionadas/datos-empresas-fusionadas.component';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { SolicitudService } from '../../services/solicitud.service';

@Component({
  selector: 'app-aviso-por-fusion',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
    InputRadioComponent,
    InputFechaComponent,
    DatosEmpresasFusionadasComponent,
  ],
  templateUrl: './aviso-por-fusion.component.html',
  styleUrl: './aviso-por-fusion.component.scss',
})
export class AvisoPorFusionComponent implements OnInit, OnDestroy {
  /**
   * Representa el formulario reactivo utilizado para gestionar los datos
   * relacionados con el aviso de extensión en el componente de solicitud.
   */
  formularioAvisoFusion!: FormGroup;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud33304State;

  /**
   * Opciones de tipo de persona obtenidas desde el servicio.
   */
  tipoOpciones = TIPO_DE_BOTON_DE_RADIO_OPCIONES;

  /**
   * Opciones de tipo de aviso filtradas según la selección del aviso de operación.
   * Inicialmente contiene todas las opciones disponibles.
   */
  tipoOpcionesFiltradas = [...TIPO_DE_BOTON_DE_RADIO_OPCIONES];

  /**
   * Opciones de aviso de fusión obtenidas desde la constante AVISO_DE_FUSION_RADIO_OPCIONES.
   */
  avisoDeOpciones = AVISO_DE_FUSION_RADIO_OPCIONES;

  /**
   * Opciones de tipo de cuenta obtenidas desde el servicio.
   */
  cuentaOptions = CUENTA_DE_BOTON_DE_RADIO_OPCIONES;

  /**
   * Valor de fecha de inicio seleccionado, inicializado con la constante `FUSIONE_FECHA_INPUT`.
   */
  fechaInputDatos: InputFecha = FUSIONE_FECHA_INPUT;

  /**
   * Sujeto utilizado como notificador para la destrucción del componente.
   * Se emite un valor cuando el componente se destruye, permitiendo cancelar
   * suscripciones o liberar recursos asociados.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa la suscripción al estado de solo lectura y llama a la inicialización del formulario.
   *
   * fb FormBuilder para crear el formulario reactivo.
   * Solicitud33304Store Store para actualizar el estado del trámite.
   * solicitud33304Query Query para obtener el estado del trámite.
   * consultaioQuery Query para obtener el estado de solo lectura.
   */
  constructor(
    private fb: FormBuilder,
    private solicitudService: SolicitudService,
    public solicitud33304Store: Solicitud33304Store,
    private solicitud33304Query: Solicitud33304Query,
    private consultaioQuery: ConsultaioQuery,
    private cdRef: ChangeDetectorRef
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Suscribe al observable selectSolicitud$ del servicio solicitud33304Query para obtener el estado de la solicitud
   * y lo asigna a la propiedad solicitudState. La suscripción se gestiona con takeUntil para evitar fugas de memoria.
   * Llama al método inicializarEstadoFormulario para configurar el formulario inicial del componente.
   */
  ngOnInit(): void {
    this.solicitud33304Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario();
  }

  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   * Si es solo lectura, deshabilita los campos y ajusta la configuración de la fecha.
   * Si no, inicializa el formulario en modo editable.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   * Si el formulario está en modo solo lectura, lo deshabilita; si no, lo habilita.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formularioAvisoFusion.disable();
    } else {
      this.formularioAvisoFusion.enable();
    }
  }

  /**
   * Inicializa el formulario formularioAvisoFusion con un conjunto de controles reactivos.
   * Cada control está asociado a una propiedad del estado solicitudState y requiere que su valor sea verdadero.
   * Aplica el validador personalizado para que todos los checkboxes deban estar seleccionados.
   */
  inicializarFormulario(): void {
    this.solicitud33304Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe(() => {
        this.formularioAvisoFusion = this.fb.group({
          avisoDeOperacion: [this.solicitudState?.avisoDeOperacion || ''],
          tipoOperacion: [this.solicitudState?.tipoOperacion || ''],
          cuenta: [this.solicitudState?.cuenta || ''],
          rfc: [this.solicitudState?.rfc || ''],
          denominacion: [this.solicitudState?.denominacion || ''],
          fechaFusioneEfecto: [this.solicitudState?.fechaFusioneEfecto || ''],
          folioAcuse: [this.solicitudState?.folioAcuse || ''],
        });
        this.formularioAvisoFusion
          .get('avisoDeOperacion')
          ?.valueChanges.pipe(takeUntil(this.destroyNotifier$))
          .subscribe(() => {
            this.actualizarOpcionesTipoOperacionPorAviso();
          });

        this.actualizarOpcionesTipoOperacionPorAviso();
      });
  }

  /**
   * Actualiza las opciones disponibles para el tipo de operación según el aviso de operación seleccionado.
   * Si el aviso seleccionado es '2', filtra las opciones para mostrar solo la opción con valor '1'.
   * Si no, muestra todas las opciones disponibles.
   * Además, valida si el valor actual de tipo de operación sigue siendo válido con las opciones filtradas;
   * si no es válido, lo reinicia a vacío.
   * Finalmente, solicita la detección de cambios para actualizar la vista.
   */
  actualizarOpcionesTipoOperacionPorAviso(): void {
    const AVISO_SELECCIONADO =
      this.formularioAvisoFusion?.get('avisoDeOperacion')?.value;
    if (AVISO_SELECCIONADO === '2') {
      this.tipoOpcionesFiltradas = TIPO_DE_BOTON_DE_RADIO_OPCIONES.filter(
        (op) => op.value === '1'
      );
    } else {
      this.tipoOpcionesFiltradas = [...TIPO_DE_BOTON_DE_RADIO_OPCIONES];
    }

    const TIPO_OPERACION_ACTUAL =
      this.formularioAvisoFusion?.get('tipoOperacion')?.value;
    const ES_OPCION_VALIDA = this.tipoOpcionesFiltradas.some(
      (op) => op.value === TIPO_OPERACION_ACTUAL
    );

    if (!ES_OPCION_VALIDA) {
      this.formularioAvisoFusion.get('tipoOperacion')?.setValue('');
    }

    this.cdRef.detectChanges();
  }

  /**
   * Actualiza el valor de la fecha de inicio de comercio en el formulario.
   * Establece el valor y marca el campo como no tocado.
   *
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  actualizarFecha(nuevo_valor: string, compo: string): void {
    this.formularioAvisoFusion.get(compo)?.setValue(nuevo_valor);
    this.formularioAvisoFusion.get(compo)?.markAsUntouched();
  }

  /**
   * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
   * @param form - El formulario reactivo.
   * @param campo - El nombre del campo en el formulario.
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.solicitud33304Store.actualizarEstado({
        [campo]: CONTROL.value,
      });
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente se destruye.
   * Emite un valor en el observable destroyNotifier$ para notificar a los suscriptores
   * que deben limpiar recursos o cancelar suscripciones, y luego completa el observable.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
