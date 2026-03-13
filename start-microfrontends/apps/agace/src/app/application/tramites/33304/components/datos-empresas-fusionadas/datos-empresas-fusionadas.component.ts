import {
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  ConfiguracionColumna,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  EMPRESAS_FUSIONE_TABLA_DATOS,
  FUSIONE_FECHA_INPUT,
  REGISTRO_CERTIFICACION_OPCIONES_RADIO_OPCIONES,
} from '../../constants/solicitud33304.enum';
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
import { Modal } from 'bootstrap';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { TablaEmpresaFusionada } from '../../modelos/aviso-de-empresa-fusionadas.model';

@Component({
  selector: 'app-datos-empresas-fusionadas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    NotificacionesComponent,
    InputFechaComponent,
  ],
  templateUrl: './datos-empresas-fusionadas.component.html',
  styleUrl: './datos-empresas-fusionadas.component.scss',
})
export class DatosEmpresasFusionadasComponent implements OnInit, OnDestroy {
  /**
   * Referencia al elemento DOM del modal de empresas fusionadas.
   */
  @ViewChild('fusionadasEmpresasElemento')
  fusionadasEmpresasElemento!: ElementRef;

  /**
   * Formulario reactivo para el registro y edición de empresas fusionadas.
   */
  fusionadasEmpresasForm!: FormGroup;

  /**
   * Referencia de solo lectura al enumerado de tipos de selección de tabla.
   */
  public readonly TablaSeleccion = TablaSeleccion;

  /**
   * Configuración de columnas para la tabla dinámica de enlaces operativos.
   */
  public readonly configuracionTabla: ConfiguracionColumna<TablaEmpresaFusionada>[] =
    EMPRESAS_FUSIONE_TABLA_DATOS;

  /**
   * Datos de la tabla de enlaces operativos.
   */
  empresaFusionadasLista: TablaEmpresaFusionada[] =
    [] as TablaEmpresaFusionada[];

  /**
   * Lista de filas seleccionadas en la tabla de enlaces operativos.
   */
  listaFilaSeleccionadaFusionadas: TablaEmpresaFusionada[] = [];

  /**
   * Fila actualmente seleccionada en la tabla de enlaces operativos.
   */
  filaSeleccionadaFusionadas!: TablaEmpresaFusionada;

  /**
   * Indica si el botón de modificar está habilitado.
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el botón de eliminar está habilitado.
   */
  enableEliminarBoton: boolean = false;

  /** Indica si una fila ha sido seleccionada en la tabla. */
  esFilaSeleccionada: boolean = false;

  /**
   * Indica si el popup de selección múltiple está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el formulario está en modo de edición.
   */
  modoEdicion: boolean = false;

  /**
   * Catálogo de estatus disponibles para el formulario.
   */
  estatus!: Catalogo[];

  /**
   * ID del registro que se está editando actualmente.
   */
  registroEditandoId?: number;

  /**
   * Configuración de notificación actual para mostrar al usuarfcrio.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Valor de fecha de inicio seleccionado, inicializado con la constante `FUSIONE_FECHA_INPUT`.
   */
  fechaInputDatos: InputFecha = FUSIONE_FECHA_INPUT;

  /**
   * Opciones para el campo de registro de certificación.
   * Utiliza las opciones definidas en el enumerado REGISTRO_CERTIFICACION_OPCIONES_RADIO_OPCIONES.
   */
  registroCertificacionOpciones =
    REGISTRO_CERTIFICACION_OPCIONES_RADIO_OPCIONES;

  /**
   * Indica si el formulario está en modo de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Subject para gestionar la destrucción de suscripciones.
   */
  private readonly destroyed$: Subject<void> = new Subject();

  /**
   * @property {Solicitud33304State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Solicitud33304State;

  /**
   * Constructor del componente.
   *
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param solicitud33304Store - Store para la gestión del estado de la solicitud.
   * @param solicitud33304Query - Query para consultar el estado de la solicitud.
   * @param consultaioQuery - Query para consultar el estado de solo lectura.
   *
   * Suscribe al estado de solo lectura y crea el formulario inicial.
   */
  constructor(
    public fb: FormBuilder,
    private solicitud33304Store: Solicitud33304Store,
    private solicitud33304Query: Solicitud33304Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();
    this.crearFormulario();
  }

  /**
   * Método del ciclo de vida que se ejecuta cuando el componente se inicializa.
   * - Se suscribe a `selectTramite30401$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `AgentesTablaDatos` a `avisoListaTransportistas`.
   *
   * La suscripción está gestionada con `takeUntil(this.destroyed$)`
   * para garantizar la limpieza cuando el componente se destruye.
   */
  ngOnInit(): void {
    this.solicitud33304Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Solicitud33304State) => {
        this.seccionState = datos;
        this.empresaFusionadasLista = this.seccionState.empresaFusionadasLista;
      });

    this.fusionadasEmpresasForm = this.fb.group({
      id: [null],
      registroCertificacion: [''],
      rfc: [''],
      denominacion: [''],
      folioVucem: [''],
      fechaInicioVigencia: [''],
      fechaFinVigencia: [''],
    });
  }

  /**
   * Crea el formulario reactivo para el registro de vehículos.
   */
  crearFormulario(): void {
    this.fusionadasEmpresasForm = this.fb.group({
      id: [null],
      registroCertificacion: [''],
      rfc: [''],
      denominacion: [''],
      folioVucem: [''],
      fechaInicioVigencia: [''],
      fechaFinVigencia: [''],
    });
  }

  /**
   * Agrega un registro de empresa fusionada con datos simulados (mock).
   * Si el campo 'rfc' tiene valor, se rellenan los demás campos del formulario con datos de ejemplo.
   */
  agregarRegistro(): void {
    let MOCK_DATA;
    const REGISTRO_VALUE = this.fusionadasEmpresasForm.get('rfc')?.value;
    if (REGISTRO_VALUE) {
      MOCK_DATA = {
        rfc: REGISTRO_VALUE,
        denominacion: 'INTEGRADORA DE URBANIZACIONES SIGNUM S DE',
        folioVucem: '2500301700020259910000040',
        fechaInicioVigencia: '30/05/2025',
        fechaFinVigencia: '02/07/2025',
      };
      this.fusionadasEmpresasForm.patchValue(MOCK_DATA);
    }
  }

  /**
   * Actualiza el valor de la fecha de inicio de vigencia en el formulario.
   * @param nuevo_valor - Nuevo valor para la fecha.
   * @param compo - Nombre del campo a actualizar.
   */
  actualizarFechaInicio(nuevo_valor: string, compo: string): void {
    this.fusionadasEmpresasForm.get(compo)?.setValue(nuevo_valor);
    this.fusionadasEmpresasForm.get(compo)?.markAsUntouched();
  }

  /**
   * Actualiza el valor de la fecha de fin de vigencia en el formulario.
   * @param nuevo_valor - Nuevo valor para la fecha.
   * @param compo - Nombre del campo a actualizar.
   */
  actualizarFechaFin(nuevo_valor: string, compo: string): void {
    this.fusionadasEmpresasForm.get(compo)?.setValue(nuevo_valor);
    this.fusionadasEmpresasForm.get(compo)?.markAsUntouched();
  }

  /**
   * Maneja la selección de filas en la tabla de enlaces operativos.
   *
   * @description
   * Actualiza el estado de las filas seleccionadas y controla la habilitación
   * de los botones de modificar y eliminar. Si no hay filas seleccionadas,
   * deshabilita los botones y limpia la selección.
   *
   */

  manejarFilaSeleccionada(fila: TablaEmpresaFusionada[]): void {
    this.listaFilaSeleccionadaFusionadas = fila;
    if (fila.length === 0) {
      this.filaSeleccionadaFusionadas = {} as TablaEmpresaFusionada;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
    this.filaSeleccionadaFusionadas = fila[fila.length - 1];
  }

  /**
   * Abre el cuadro de diálogo modal para el registro de enlaces operativos.
   *
   * @description
   * Inicializa y muestra el modal de Bootstrap para permitir al usuario
   * ingresar o editar información de enlaces operativos. Requiere que
   * el ViewChild esté inicializado.
   */
  agregarDialogoDatos(): void {
    if (this.fusionadasEmpresasElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.fusionadasEmpresasElemento?.nativeElement
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esFilaSeleccionada = false;
    this.multipleSeleccionPopupAbierto = false;
  }

  /**
   * Inicia el proceso de modificación de un registro de empresa fusionada.
   *
   * @description
   * Verifica si existen registros en la lista y si hay una fila seleccionada.
   * Si no hay registros, muestra una notificación de que no se encontró información.
   * Si no hay selección, solicita al usuario seleccionar un registro.
   * Si hay una sola fila seleccionada, prepara el formulario para edición,
   * asigna el ID del registro a editar y abre el diálogo de edición con los datos cargados.
   */
  modificarItemFusionadas(): void {
    this.cerrarModal();
    if (this.empresaFusionadasLista.length === 0) {
      this.abrirMultipleSeleccionPopup('', 'No se encontró información');
      this.esFilaSeleccionada = true;
      return;
    }
    if (this.listaFilaSeleccionadaFusionadas.length === 0) {
      this.abrirMultipleSeleccionPopup('', 'Seleccione un registro');
      this.esFilaSeleccionada = true;
      return;
    }
    if (
      this.listaFilaSeleccionadaFusionadas &&
      this.listaFilaSeleccionadaFusionadas.length === 1
    ) {
      this.filaSeleccionadaFusionadas = {
        ...this.listaFilaSeleccionadaFusionadas[0],
      };
      this.registroEditandoId = this.filaSeleccionadaFusionadas.id;
      this.modoEdicion = true;
      this.agregarDialogoDatos();
      this.actualizarDatosModificados();
    }
  }

  /**
   * Actualiza el formulario con los datos de la fila seleccionada para modificación.
   *
   * @description
   * Llena todos los campos del formulario con los valores de la fila seleccionada
   * para permitir la edición. Utiliza patchValue para actualizar solo los
   * campos especificados sin afectar el resto del formulario.
   */
  actualizarDatosModificados(): void {
    if (!this.filaSeleccionadaFusionadas) {
      return;
    }
    this.fusionadasEmpresasForm.patchValue({
      rfc: this.filaSeleccionadaFusionadas.rfc,
      denominacion: this.filaSeleccionadaFusionadas.denominacion,
      folioVucem: this.filaSeleccionadaFusionadas.folioVucem,
      fechaInicioVigencia:
        this.filaSeleccionadaFusionadas.fechaInicioVigencia,
      fechaFinVigencia: this.filaSeleccionadaFusionadas.fechaFinVigencia,
      estatus: this.filaSeleccionadaFusionadas.estatus,
      id: this.filaSeleccionadaFusionadas.id,
    });
  }

  /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de notificación con contenido dinámico.
   * Este método permite personalizar el título, mensaje y etiquetas de los botones del popup.
   * @param titulo - Título del popup
   * @param mensaje - Mensaje a mostrar en el popup
   * @param txtBtnAceptar - Texto del botón de aceptar (opcional, por defecto 'Cerrar')
   * @param txtBtnCancelar - Texto del botón de cancelar (opcional, por defecto '')
   */
  abrirMultipleSeleccionPopup(
    titulo: string,
    mensaje: string,
    txtBtnAceptar: string = 'Aceptar',
    txtBtnCancelar: string = ''
  ): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: titulo,
      mensaje: mensaje,
      cerrar: false,
      txtBtnAceptar: txtBtnAceptar,
      txtBtnCancelar: txtBtnCancelar,
    };
  }

  /**
   * Alterna la visibilidad del cuadro de diálogo modal para el registro de enlaces operativos.
   */
  cambiarEstadoModal(): void {
    const MODAL_INSTANCIA = Modal.getInstance(
      this.fusionadasEmpresasElemento.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * Cancela el cuadro de diálogo modal para el registro de enlaces operativos.
   */
  modalCancelar(): void {
    this.cambiarEstadoModal();
    this.limpiarFormulario();
  }

  /**
   * Restablece el formulario de registro de enlaces operativos a su estado inicial.
   */
  limpiarFormulario(): void {
    this.fusionadasEmpresasForm.reset();
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   *
   * @description
   * Valida el formulario y, si es válido, procesa los datos del enlace operativo.
   * Muestra una notificación de confirmación y resetea el formulario.
   * Si el formulario es inválido, marca todos los campos como tocados para
   * mostrar los errores de validación.
   */
  enviarDialogData(): void {
    if (!this.fusionadasEmpresasForm.valid) {
      this.fusionadasEmpresasForm.markAllAsTouched();
      return;
    }
    // this.abrirMultipleSeleccionPopup('', 'Datos guardados correctamente');
    this.esFilaSeleccionada = true;
    this.enlaceInfoDatos();
    this.limpiarFormulario();
    this.cambiarEstadoModal();
  }

  /**
   * Agrega o actualiza los datos del enlace operativo en la lista de registros.
   */
  enlaceInfoDatos(): void {
    if (!this.fusionadasEmpresasForm.valid) {
      return;
    }

    const FORM_DATA = this.fusionadasEmpresasForm.getRawValue();
    if (this.modoEdicion && this.registroEditandoId !== undefined) {
      this.empresaFusionadasLista = this.empresaFusionadasLista.map((item) =>
        item.id === this.registroEditandoId ? { ...item, ...FORM_DATA } : item
      );
    } else {
      const NEW_ID =
        this.empresaFusionadasLista.length > 0
          ? Math.max(
              ...this.empresaFusionadasLista.map((item) => item.id || 0)
            ) + 1
          : 1;
      const EMPRESA_TRANSPORTISTA: TablaEmpresaFusionada = {
        ...FORM_DATA,
        id: NEW_ID,
      };
      this.empresaFusionadasLista = [
        ...this.empresaFusionadasLista,
        EMPRESA_TRANSPORTISTA,
      ];
    }
    this.solicitud33304Store.actualizarEstado({
      empresaFusionadasLista: this.empresaFusionadasLista,
    });
    this.filaSeleccionadaFusionadas = {} as TablaEmpresaFusionada;
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
   * Método de limpieza que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
