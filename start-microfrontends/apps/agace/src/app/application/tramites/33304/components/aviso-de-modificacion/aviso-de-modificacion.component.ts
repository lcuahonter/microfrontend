import {
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  InputFecha,
  InputFechaComponent,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TableComponent,
  TipoNotificacionEnum,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Solicitud33304State, Solicitud33304Store } from '../../estados/solicitud33304Store';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoModificacionService } from '../../services/aviso-modificacion.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { ModificacionPartesComponent } from '../modificacion-partes/modificacion-partes.component';
import { ModificacionVigenciasComponent } from '../modificacion-vigencias/modificacion-vigencias.component';
import { PERFILES_FECHA_INPUT } from '../../../32605/constants/perfiles.enum';
import { RADIO_OPTIONS } from '../../constants/aviso-modificacion-tabla.enum';
import { Solicitud33304Query } from '../../estados/solicitud33304Query';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@libs/shared/data-access-user/src/core/enums/tabla-seleccion.enum';



@Component({
  selector: 'app-aviso-de-modificacion',
  standalone: true,
  imports: [
    CommonModule,
    InputFechaComponent,
    InputRadioComponent,
    TituloComponent,
    ReactiveFormsModule,
    FormsModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    NotificacionesComponent,
    TableComponent,
    ModificacionVigenciasComponent,
    ModificacionPartesComponent
  ],
  templateUrl: './aviso-de-modificacion.component.html',
  styleUrl: './aviso-de-modificacion.component.scss',
})
export class AvisoDeModificacionComponent implements OnInit, OnDestroy {

  /** Formulario de aviso de modificación */
  formularioAvisoDeModification!: FormGroup;

  /**
   * Referencia al elemento DOM del modal de enlace operativo.
   */
  public solicitudState!: Solicitud33304State;

  /**
  * @property {TablaSeleccion} CHECKBOX
  * @description Tipo de selección de la tabla dinámica (checkbox).
  */
  CHECKBOX = TablaSeleccion.CHECKBOX;

  /**
  * ID del registro que se está editando actualmente.
  */
  registroEditandoId?: number;

  /**
  * Indica si el formulario está en modo de edición.
  */
  modoEdicion: boolean = false;

  /** Opciones para los radios de selección: "Domicilio nuevo" o "Modificar domicilio" */
  radioOptions = RADIO_OPTIONS;

  /**
     * Valor de fecha de inicio seleccionado, inicializado con la constante `PERFILES_FECHA_DE_PAGO`.
     */
  fechaInputDatos: InputFecha = PERFILES_FECHA_INPUT;

  /** Solo lectura */
  esFormularioSoloLectura: boolean = false;

  /** Destroy notifier */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Catálogo de entidades federativas */
  entidadFederativa!: Catalogo[];

  /** Indica si una fila ha sido seleccionada en la tabla. */
  esFilaSeleccionada: boolean = false;

  // En tu HTML este catálogo se usa para “Alcaldía o Municipio”
  fraccionArancelaria!: Catalogo[];

  cveTipoDoc!: Catalogo[];

  /** Tabla de partes para <ng-table> */
  modificacionPartesHeader: string[] = ['RFC', 'Nombre', 'En su carácter de'];
  modificacionPartesData: { tbodyData: string[] }[] = [{ tbodyData: [] }];
  mostrarCampos: boolean = true;

  /**
    * Configuración de notificación actual para mostrar al usuario.
    */
  public nuevaNotificacion!: Notificacion;

  constructor(
    private fb: FormBuilder,
    private avisoModificacionService: AvisoModificacionService,
    public solicitud33304Store: Solicitud33304Store,
    private solicitud33304Query: Solicitud33304Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    // Sin condiciones extra: solo gestionar readonly
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.crearFormulario();

  }

  ngOnInit(): void {
    // Conservar la suscripción al estado por compatibilidad
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

  /** Readonly vs editable (sin otras condiciones) */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /** Aplica enable/disable según readonly */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.formularioAvisoDeModification.disable();
      this.modificacionPartesData = [
        { tbodyData: ['AAL0409235E6', 'Nombre de la parte (ejemplo)', 'Caracter'] }
      ];
    } else {
      this.formularioAvisoDeModification.enable();
    }
  }

  /**
   * Inicializa el **mismo** formulario con los campos que usas en tu HTML:
   * direccion, codigoPostal, cveEntidad, cveMunicipio, cveTipoDoc,
   * fechaInicioAnterior, fechaFinAnterior, rfcPartesC, rfcPartesCons,
   * nombrePartesCons, caracterDeCons, observaciones.
   */
  // eslint-disable-next-line complexity
  inicializarFormulario(): void {

    this.formularioAvisoDeModification = this.fb.group({
      direccion: [this.solicitudState?.direccion || '', [Validators.required, Validators.maxLength(250)]],
      codigoPostal: [
        this.solicitudState?.codigoPostal || '',
        [Validators.required, Validators.maxLength(5), Validators.pattern(/^\d{5}$/)]
      ],
      cveEntidad: [this.solicitudState?.cveEntidad || '', Validators.required],
      cveMunicipio: [this.solicitudState?.cveMunicipio || '', Validators.required],
      cveTipoDoc: [this.solicitudState?.cveTipoDoc || '', Validators.required],

      fechaInicioAnterior: [this.solicitudState?.fechaInicioAnterior || '', Validators.required],
      fechaFinAnterior: [this.solicitudState?.fechaFinAnterior || '', Validators.required],

      rfcPartesC: [
        this.solicitudState?.rfcPartesC || '',
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i),
        ],
      ],
      rfcPartesCons: [this.solicitudState?.rfcPartesCons || ''],
      nombrePartesCons: [this.solicitudState?.nombrePartesCons || ''],
      caracterDeCons: [this.solicitudState?.caracterDeCons || '', [Validators.required, Validators.maxLength(30)]],
      observaciones: [this.solicitudState?.observaciones || '', [Validators.maxLength(500)]],
      ideGenerica2: [this.solicitudState?.ideGenerica2 || ''],
      cveTipoDoc2: [this.solicitudState?.cveTipoDoc2 || '', Validators.required],
      direccion2: [this.solicitudState?.direccion2 || '', [Validators.required, Validators.maxLength(250)]],
      codigoPostal2: [
        this.solicitudState?.codigoPostal2 || '',
        [Validators.required, Validators.maxLength(5), Validators.pattern(/^\d{5}$/)]
      ],
      cveEntidad2: [this.solicitudState?.cveEntidad2 || '', Validators.required],
      cveMunicipio2: [this.solicitudState?.cveMunicipio2 || '', Validators.required],
      cveTipo2: [this.solicitudState?.cveTipo2 || '', Validators.required],
      fechaInicioAnterior2: [this.solicitudState?.fechaInicioAnterior2 || '', Validators.required],
      fechaFinAnterior2: [this.solicitudState?.fechaFinAnterior2 || '', Validators.required],
      rfcPartesCNuevo: [this.solicitudState?.rfcPartesCNuevo || '', [Validators.required, Validators.maxLength(13), Validators.pattern(/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i)]],
      rfcPartesConsNuevo: [this.solicitudState?.rfcPartesConsNuevo || ''],
      nombrePartesConsNuevo: [this.solicitudState?.nombrePartesConsNuevo || ''],
      caracterDeConsNuevo: [this.solicitudState?.caracterDeConsNuevo || '', [Validators.required, Validators.maxLength(30)]],
    });

    this.getEntidadFederativa();
    this.getFraccionArancelaria();
    this.getCveTipoDoc();

  }

  /** Handlers usados por los botones en tu HTML */
  cargarDatosRfcPartesC(): void {
    const RFC = this.formularioAvisoDeModification.get('rfcPartesC')?.value || '';
    this.formularioAvisoDeModification.patchValue({
      rfcPartesCons: RFC,
      nombrePartesCons: 'Nombre de la parte (ejemplo)',
    });

    const RFC2 = this.formularioAvisoDeModification.get('rfcPartesCNuevo')?.value || '';

    if (RFC2) {
      this.formularioAvisoDeModification.patchValue({
        rfcPartesConsNuevo: RFC2,
        nombrePartesConsNuevo: 'Nombre de la parte (ejemplo)',
      });
    }
  }

  limpiaCamposParteC(): void {
    this.formularioAvisoDeModification.patchValue({
      rfcPartesC: '',
      rfcPartesCons: '',
      nombrePartesCons: '',
      caracterDeCons: '',
    });
  }

  agregarParteC(): void {
    const RFC = this.formularioAvisoDeModification.get('rfcPartesCons')?.value;
    const NOMBRE = this.formularioAvisoDeModification.get('nombrePartesCons')?.value;
    const CARACTER = this.formularioAvisoDeModification.get('caracterDeCons')?.value;

    if (RFC && NOMBRE && CARACTER) {
      this.modificacionPartesData[0].tbodyData.push(RFC, NOMBRE, CARACTER);
      this.formularioAvisoDeModification.patchValue({
        rfcPartesCons: '',
        nombrePartesCons: '',
        caracterDeCons: '',
      });
      this.modificarItemTransportista();
    }
  }

  /**
   * Método para modificar el item del transportista.
   * Este método se invoca cuando se agrega una nueva parte C.
   */
  modificarItemTransportista(): void {
    this.cerrarModal();
    this.abrirMultipleSeleccionPopup('', 'Los datos han sido agregados correctamente');
    this.esFilaSeleccionada = true;
  }

  /**
     * Método para cerrar el modal de confirmación.
     * @returns {void}
     */
  cerrarModal(): void {
    this.esFilaSeleccionada = false;
  }


  eliminarParteC(): void {

    const ARR = this.modificacionPartesData[0].tbodyData;
    if (ARR.length >= 3) {
      ARR.splice(ARR.length - 3, 3);
    }
  }

  /**
  * Crea el formulario reactivo para el registro de vehículos.
  */
  crearFormulario(): void {
    this.formularioAvisoDeModification = this.fb.group({
      rfcPartesCons: [''],
      nombrePartesCons: [''],
      caracterDeCons: ['']
    });
  }

  /**
   * Actualiza el valor de la fecha de inicio de comercio en el formulario.
   * Establece el valor y marca el campo como no tocado.
   * 
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  actualizarFecha(nuevo_valor: string, compo: string): void {
    this.formularioAvisoDeModification.get(compo)?.setValue(nuevo_valor);
    this.formularioAvisoDeModification.get(compo)?.markAsUntouched();
  }

  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   * 
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.solicitud33304Store.actualizarEstado({ [campo]: CONTROL.value });
    }
  }

  guardarDomInmuebleNvo(): void {
    if (this.formularioAvisoDeModification.invalid) {
      this.formularioAvisoDeModification.markAllAsTouched();
      // eslint-disable-next-line no-useless-return
      return;
    }
  }

  cerrarDialogoDomInmuebleNvo(): void {
    this.formularioAvisoDeModification.reset();
    this.modificacionPartesData = [{ tbodyData: [] }];
  }


  /** Método para obtener las entidades federativas del servicio */
  getEntidadFederativa(): void {
    this.avisoModificacionService.getEntidadFederativa()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.entidadFederativa = Object.assign([], resp);
      });
  }

  getFraccionArancelaria(): void {
    this.avisoModificacionService.getFraccionArancelaria()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.fraccionArancelaria = Object.assign([], resp);
      });

  }

  getCveTipoDoc(): void {
    this.avisoModificacionService.getCveTipoDoc()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp) => {
        this.cveTipoDoc = Object.assign([], resp);
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

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
