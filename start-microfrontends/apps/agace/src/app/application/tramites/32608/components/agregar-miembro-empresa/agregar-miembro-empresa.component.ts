import {
  Catalogo,
  CatalogoSelectComponent,
  CategoriaMensaje,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TipoNotificacionEnum,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPRESA_MIEMBRO_TABLA_DATOS, MENSAJE_DE_VALIDACION, NOTA, OPCIONES_DE_BOTON_DE_RADIO } from '../../constants/oea-textil-registro.enum';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32608State, Solicitud32608Store } from '../../estados/solicitud32608.store';
import { Subject, map, takeUntil} from 'rxjs';
import { AgregarMiembroEmpresaTabla } from '../../models/oea-textil-registro.model';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { Solicitud32608Query } from '../../estados/solicitud32608.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente para agregar miembros de empresa en el trámite OEA textil.
 * 
 * Este componente independiente (`standalone`) permite registrar, editar y administrar
 * información de los miembros de la empresa solicitante del trámite OEA textil.
 * Incluye validación de RFC, manejo de personas físicas y morales, búsqueda de datos
 * y gestión a través de tabla dinámica interactiva.
 * 
 * @component
 * @selector app-agregar-miembro-empresa
 * @standalone true
 * @implements {OnInit, OnDestroy}
 * @author Equipo de desarrollo VUCEM
 * @version 1.0.0
 * @since 2024
 * 
 * @example
 * ```html
 * <app-agregar-miembro-empresa></app-agregar-miembro-empresa>
 * ```
 */
@Component({
  selector: 'app-agregar-miembro-empresa',
  standalone: true,
  imports: [
    CommonModule,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    NotificacionesComponent,
    TituloComponent,
    InputRadioComponent
  ],
  templateUrl: './agregar-miembro-empresa.component.html',
  styleUrl: './agregar-miembro-empresa.component.scss',
})
export class AgregarMiembroEmpresaComponent implements OnInit, OnDestroy {
    /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Define si el diálogo exitoso está habilitado.
   *
   * @property esHabilitarElDialogo
   * @type {boolean}
   * @default false
   */
  esHabilitarElDialogo: boolean = false;

  /**
   * Formulario reactivo para el registro de vehículos.
   */
  registroAgregarMiembroEmpresaForm!: FormGroup;

  /**
   * Formulario para gestionar los archivos adjuntos.
   *
   * Permite capturar y validar los datos relacionados con los archivos adjuntos.
   */
  formularioArchivo!: FormGroup;

  /**
   * Formulario para capturar el RFC.
   *
   * Este formulario es utilizado para validar y capturar el RFC del usuario.
   */
  rfcForm!: FormGroup;

  /**
   * Tipo de selección de tabla (CHECKBOX).
   */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * Lista de vehículos registrados.
   */
  agregarMiembroEmpresaList: AgregarMiembroEmpresaTabla[] = [] as AgregarMiembroEmpresaTabla[];

  /**
   * Nombre de la pestaña activa.
   */
  activeTab: string = 'parquevehicular';

  /**
   * Referencia al elemento modal para el registro de vehículos.
   */
  @ViewChild('registroDeAgregarMiembroEmpresa') registroDeAgregarMiembroEmpresaElemento!: ElementRef;

  /**
   * Referencia al elemento modal de confirmación.
   */
  @ViewChild('modalDeConfirmacion') confirmacionElemento!: ElementRef;

  /**
 * Referencia al componente AgregarMiembroEmpresaComponent para acceder a sus métodos de validación.
 */
  @ViewChild('agregarMiembroEmpresaRef') agregarMiembroEmpresaComponent!: AgregarMiembroEmpresaComponent;
  /**
   * Constante para la nota de confirmación del vehículo.
   */
  CONFIRMACION_NUMEROEMPLEADOS = NOTA.CONFIRMACION_NUMEROEMPLEADOS;

  MENSAJE_DE_VALIDACION = MENSAJE_DE_VALIDACION;

 /**
   * Configuración para las columnas de la tabla de miembros de empresa.
   */
  ParqueVehicular = EMPRESA_MIEMBRO_TABLA_DATOS;

  /**
   * Subject utilizado para rastrear la destrucción del componente.
   * Ayuda a cancelar la suscripción de observables para evitar fugas de memoria.
   */
  destroyed$: Subject<void> = new Subject();

  /**
   * Indica si el popup está abierto.
   */
  multipleSeleccionPopupAbierto: boolean = false;

  /**
   * Indica si el popup está abierto.
   */
  confirmEliminarPopupAbierto: boolean = false;

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Fila seleccionada en la tabla de mercancías.
   */
  filaSeleccionadaAgregarMiembroEmpresa!: AgregarMiembroEmpresaTabla;

  /**
   * Lista de filas seleccionadas en la tabla de mercancías.
   */
  listaFilaSeleccionadaEmpleado: AgregarMiembroEmpresaTabla[] = [] as AgregarMiembroEmpresaTabla[];

  /**
   * Indica si el botón de eliminar está habilitado.
   */
  enableEliminarBoton: boolean = false;

  /**
   * Indica si un archivo está seleccionado.
   */
  enableModficarBoton: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  confirmEliminarPopupCerrado: boolean = true;

  /**
   * Indica si se debe mostrar el modal de datos de mercancía.
   */
  mostrarModalDatosEmpleado: boolean = false;

  /**
   * Indica si el popup está cerrado.
   */
  multipleSeleccionPopupCerrado: boolean = true;

  /**
   * @property {Solicitud32608State} seccionState
   * Estado actual del formulario.
   */
  public seccionState!: Solicitud32608State;

  /**
     * Esta lista se llena con los datos del catálogo.
     */
    enSuCaracterDeList!: Catalogo[];
    
    /**
     * Se utiliza para seleccionar la nacionalidad en el formulario.
     */
    nacionalidadList!: Catalogo[];
    /**
     * Se utiliza para seleccionar el tipo de persona en el formulario.
     */
    tipoDePersonaList!: Catalogo[];

    /**
     * Opciones de botón de radio.
     */
    opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

   /**
   * Indicates whether the entity is consolidated in ET.
   *
   * @type {boolean}
   * @default false
   */
  radioSeleccionado: string = '';

  /**
   * Elemento seleccionado en el formulario.
   * Se utiliza para determinar qué sección del formulario se debe mostrar.
   */
  elementoSeleccionado: string = '';

  /**
   * Indica si el formulario es colapsable.
   */
  colapsable: boolean = true;
  /**
   * Formulario para agregar un miembro de la empresa.
   * Este formulario se utiliza para capturar los datos del miembro de la empresa.
   */
  agregarMiembroEmpresaForm!: FormGroup;

  /**
   * Constructor para AgregarMiembroEmpresaComponent.
   * Inicializa el formulario e inyecta los servicios necesarios.

   */
  constructor(
    public fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
    private solicitudService: SolicitudService,
    private tramite32608Store: Solicitud32608Store,
    private tramite32608Query: Solicitud32608Query,
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
   * - Se suscribe a `selectSolicitud$` para obtener datos del estado.
   * - Actualiza `seccionState` con la información más reciente del estado.
   * - Asigna `AgregarMiembroEmpresaTablaDatos` a `agregarMiembroEmpresaList`.
   *
   * La suscripción está gestionada con `takeUntil(this.destroyed$)`
   * para garantizar la limpieza cuando el componente se destruye.
   */
  ngOnInit(): void {
    this.obtenerlistadescargable();
    this.tramite32608Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((datos: Solicitud32608State) => {
        this.seccionState = datos;
      });

    this.agregarMiembroEmpresaList = this.seccionState.agregarMiembroEmpresa;
  }

  /**
   * Crea el formulario reactivo para el registro de vehículos.
   */
  crearFormulario(): void {
    this.registroAgregarMiembroEmpresaForm = this.fb.group({
      id: [null],
      rfcInput: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      rfc: ['', Validators.required],
      caracter: [null, Validators.required],
      nacionalidad: [null, Validators.required],
      obligadoTributarMexico: [null, Validators.required],
      apellidoMaterno: [''],
      tipoPersona: [null, Validators.required],
      apellidoPaterno: ['', Validators.required],
      nombre: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      miembroDeLaEmpresaTabla: [''],
    });
    
    // Set initial disabled state
    this.actualizarEstadoFormulario();
  }


    /**
   * @method obtenerlistadescargable
   * Obtiene las listas necesarias para llenar los selectores del formulario.
   */
  obtenerlistadescargable(): void {
    this.solicitudService.empresaListaDeSelects()
      .pipe(takeUntil(this.destroyed$),
  map((data) => {
    this.enSuCaracterDeList = data.enSuCaracterDeList;
    this.nacionalidadList = data.nacionalidadList;
    this.tipoDePersonaList = data.tipoDePersonaList;
  })
)
.subscribe();
  }

  /**
   * Abre el cuadro de diálogo modal para el registro de vehículos.
   */
  agregarDialogoDatos(): void {
    if (this.registroDeAgregarMiembroEmpresaElemento) {
      const MODAL_INSTANCIA = new Modal(
        this.registroDeAgregarMiembroEmpresaElemento?.nativeElement,
        { backdrop: false }
      );
      MODAL_INSTANCIA.show();
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   * Si el formulario es inválido, marca todos los campos como tocados.
   */
  enviarDialogData(): void {
    if (!this.registroAgregarMiembroEmpresaForm) {
      return;
    }
    
    if (this.registroAgregarMiembroEmpresaForm.valid) {
      this.enNuevaNotificacion(this.CONFIRMACION_NUMEROEMPLEADOS);
       this.esHabilitarElDialogo = true;
      this.AgregarMiembroEmpresaInfoDatos();
      this.limpiarFormulario();
      this.cambiarEstadoModal();
    } else {
      this.enNuevaNotificacion(this.MENSAJE_DE_VALIDACION);
      this.esHabilitarElDialogo = true;
      this.registroAgregarMiembroEmpresaForm.markAllAsTouched();
    }
  }

  /**
   * Envía los datos del formulario y muestra el modal de confirmación.
   */
  enNuevaNotificacion(datos:string):void {
     this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: datos,
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
  }

  /**
   * Cancela el cuadro de diálogo modal para el registro de vehículos.
   * Este método oculta el modal y restablece el formulario.
   */
  modalCancelar(): void {
    this.cambiarEstadoModal();
  }

  /**
   * Alterna la visibilidad del cuadro de diálogo modal para el registro de vehículos.
   * Si el modal está visible actualmente, se ocultará.
   */
  cambiarEstadoModal(): void {
    const MODAL_INSTANCIA = Modal.getInstance(
      this.registroDeAgregarMiembroEmpresaElemento.nativeElement
    );
    if (MODAL_INSTANCIA) {
      MODAL_INSTANCIA.hide();
    }
  }

  /**
   * Agrega los datos actuales del formulario a la lista de vehículos registrados.
   * Los datos del formulario se añaden al array `agregarMiembroEmpresaList`.
   */
  AgregarMiembroEmpresaInfoDatos(): void {
    const OBTENER_DESCRIPCION = (array: Catalogo[], index: number): string =>
      array && array.length > 0 ? (array[index - 1]?.descripcion || '') : '';

    const {
      tipoPersona: TIPO_PERSONA,
      nombre: NOMBRE,
      apellidoPaterno: APELLIDO_PATERNO,
      apellidoMaterno: APELLIDO_MATERNO,
      nombreCompleto: NOMBRE_COMPLETO,
      rfc: RFC,
      caracter: CARACTER,
      nacionalidad: NACIONALIDAD,
      obligadoTributarMexico: OBLIGADO_TRIBUTAR_MEXICO,
      nombreEmpresa: NOMBRE_EMPRESA,
    } = this.registroAgregarMiembroEmpresaForm.value;

     const PARTESNOMBRE = [
          NOMBRE,
          APELLIDO_PATERNO,
          APELLIDO_MATERNO
        ];

    const NOMBRE_COLLECCION = PARTESNOMBRE
      .filter(valor => valor !== undefined && valor !== null && valor !== '')
      .join(' ');

    const SELECTED_CARACTER = OBTENER_DESCRIPCION(this.enSuCaracterDeList || [], CARACTER);
    const SELECTED_NACIONALIDAD = OBTENER_DESCRIPCION(this.nacionalidadList || [], NACIONALIDAD);
    const SELECTED_TIPO_PERSONA = OBTENER_DESCRIPCION(this.tipoDePersonaList || [], TIPO_PERSONA);

    if (
      !this.filaSeleccionadaAgregarMiembroEmpresa ||
      Object.keys(this.filaSeleccionadaAgregarMiembroEmpresa).length === 0
    ) {
      const ID = this.agregarMiembroEmpresaList.length
        ? this.agregarMiembroEmpresaList[this.agregarMiembroEmpresaList.length - 1]?.id + 1
        : 1;

      const OBJETO = { 
        id: ID, 
        tipoPersona: SELECTED_TIPO_PERSONA,
        nombre: NOMBRE,
         nombreColleccion: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '1') ? NOMBRE_COLLECCION : '',
        apellidoPaterno: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '1') ? APELLIDO_PATERNO : '',
        apellidoMaterno: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '1') ? APELLIDO_MATERNO : '',
        nombreCompleto: this.radioSeleccionado === 'rfcSeccion' ? NOMBRE_COMPLETO : '',
        rfc: this.radioSeleccionado === 'rfcSeccion' ? RFC : '',
        caracter: SELECTED_CARACTER,
        nacionalidad: SELECTED_NACIONALIDAD,
        obligadoTributarMexico: OBLIGADO_TRIBUTAR_MEXICO ? AgregarMiembroEmpresaComponent.convertirValorRadioATexto(OBLIGADO_TRIBUTAR_MEXICO) : '',
        nombreEmpresa: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '2') ? NOMBRE_EMPRESA : '',
      } as AgregarMiembroEmpresaTabla;

      this.agregarMiembroEmpresaList = [...this.agregarMiembroEmpresaList, OBJETO];
      this.tramite32608Store.actualizarEstado({agregarMiembroEmpresa:this.agregarMiembroEmpresaList});
    } else {
      this.agregarMiembroEmpresaList = this.agregarMiembroEmpresaList.map((elemento) =>
        elemento.id === this.filaSeleccionadaAgregarMiembroEmpresa.id
          ? { ...elemento, 
            tipoPersona: SELECTED_TIPO_PERSONA,
            nombre: NOMBRE,
            nombreColleccion: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '1') ? NOMBRE_COLLECCION : '',
            apellidoPaterno: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '1') ? APELLIDO_PATERNO : '',
            apellidoMaterno: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '1') ? APELLIDO_MATERNO : '',
            nombreCompleto: this.radioSeleccionado === 'rfcSeccion' ? NOMBRE_COMPLETO : '',
            rfc: RFC,
            caracter: SELECTED_CARACTER,
            nacionalidad: SELECTED_NACIONALIDAD,
            obligadoTributarMexico: OBLIGADO_TRIBUTAR_MEXICO ? AgregarMiembroEmpresaComponent.convertirValorRadioATexto(OBLIGADO_TRIBUTAR_MEXICO) : '',
            nombreEmpresa: (this.radioSeleccionado === 'tipdeSeccion' && this.elementoSeleccionado === '2') ? NOMBRE_EMPRESA : '',
         }
          : elemento
      );

      this.tramite32608Store.actualizarEstado({agregarMiembroEmpresa:this.agregarMiembroEmpresaList});
      if (this.registroAgregarMiembroEmpresaForm.get('miembroDeLaEmpresaTabla')) {
        this.registroAgregarMiembroEmpresaForm.get('miembroDeLaEmpresaTabla')?.markAsUntouched();
      }
      this.filaSeleccionadaAgregarMiembroEmpresa = {} as AgregarMiembroEmpresaTabla;
    }
  }
  /**
   * Método para cerrar el modal de confirmación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  /**
   * Maneja la fila seleccionada en la tabla de mercancías.
   * fila Fila seleccionada.
   */
  manejarFilaSeleccionada(fila: AgregarMiembroEmpresaTabla[]): void {
    this.listaFilaSeleccionadaEmpleado = fila;
      if (fila.length === 0) {
      this.filaSeleccionadaAgregarMiembroEmpresa = {} as AgregarMiembroEmpresaTabla;
      this.enableModficarBoton = false;
      this.enableEliminarBoton = false;
      return;
    }
  this.filaSeleccionadaAgregarMiembroEmpresa = fila[fila.length - 1];
  }
  

  /**
   * Actualiza la fila seleccionada con los datos más recientes de la tabla.
   */
  actualizarFilaSeleccionada(): void {
    const DATOS_ACTUALIZADOS = this.agregarMiembroEmpresaList.find(
      (item) => item.id === this.filaSeleccionadaAgregarMiembroEmpresa.id
    );

    if (DATOS_ACTUALIZADOS) {
      this.filaSeleccionadaAgregarMiembroEmpresa = { ...DATOS_ACTUALIZADOS };
    }
  }

  /**
   * Filtra y elimina los elementos seleccionados de la tabla de mercancías.
   * Actualiza el estado del almacén y cierra el popup de confirmación de eliminación.
   */
  eliminarEmpleadoItem(evento:boolean): void {
    if(evento === true) {
      const IDS_TO_DELETE = this.listaFilaSeleccionadaEmpleado.map(
        (item) => item.id
      );

      this.agregarMiembroEmpresaList = this.agregarMiembroEmpresaList.filter(
        (item) => !IDS_TO_DELETE.includes(item.id)
      );

      this.listaFilaSeleccionadaEmpleado = [];
      this.filaSeleccionadaAgregarMiembroEmpresa = {} as AgregarMiembroEmpresaTabla;
      this.tramite32608Store.actualizarEstado({agregarMiembroEmpresa:this.agregarMiembroEmpresaList});
      this.cerrarEliminarConfirmationPopup();
    }
  }

  /**
   * Cierra el popup de confirmación de eliminación.
   */
  cerrarEliminarConfirmationPopup(): void {
    this.confirmEliminarPopupAbierto = false;
    this.confirmEliminarPopupCerrado = false;
  }

  /**
   * Modifica los datos de una fila seleccionada en la tabla de mercancías.
   * Actualiza el formulario de mercancía con los datos de la fila seleccionada
   * y abre el modal para editar los datos.
   */
    modificarItemEmpleado(): void {
    const SELECCIONADAS = this.listaFilaSeleccionadaEmpleado;
    if(this.agregarMiembroEmpresaList.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'No se encontró información',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
 
    if (!SELECCIONADAS || SELECCIONADAS.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona un registro',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
 
    if (SELECCIONADAS.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Selecciona sólo un registro para modificar.',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    this.actualizarFilaSeleccionada();
    this.agregarDialogoDatos();
    this.patchModifyiedData();
  }
 
  
  /**
   * @method patchModifyiedData
   * Rellena el formulario con los datos de la fila seleccionada para su modificación.
   * Este método utiliza `patchValue` para actualizar los valores del formulario.
   */
  patchModifyiedData(): void {
     const OBTENER_INDICE = (array: Catalogo[], value: string): number =>
      array.findIndex((item) => item.descripcion === value) + 1;
    const TIPO_PERSONA = OBTENER_INDICE(this.tipoDePersonaList, this.filaSeleccionadaAgregarMiembroEmpresa?.tipoPersona);
    const CARACTER = OBTENER_INDICE(this.enSuCaracterDeList, this.filaSeleccionadaAgregarMiembroEmpresa?.caracter);
    const NACIONALIDAD = OBTENER_INDICE(this.nacionalidadList, this.filaSeleccionadaAgregarMiembroEmpresa?.nacionalidad);
    
    // Determinar qué sección usar basado en los datos existentes
    if (this.filaSeleccionadaAgregarMiembroEmpresa?.rfc && this.filaSeleccionadaAgregarMiembroEmpresa?.nombreCompleto) {
      this.radioSeleccionado = 'rfcSeccion';
      this.registroAgregarMiembroEmpresaForm.patchValue({
        obligadoTributarMexico: '1'
      });
    } else {
      this.radioSeleccionado = 'tipdeSeccion';
      this.registroAgregarMiembroEmpresaForm.patchValue({
        obligadoTributarMexico: '0'
      });
      
      // Determinar el tipo de persona basado en los datos existentes
      if (this.filaSeleccionadaAgregarMiembroEmpresa?.nombre || this.filaSeleccionadaAgregarMiembroEmpresa?.apellidoPaterno) {
        this.elementoSeleccionado = '1'; // Persona Física
      } else if (this.filaSeleccionadaAgregarMiembroEmpresa?.nombreEmpresa) {
        this.elementoSeleccionado = '2'; // Persona Moral
      }
    }
    
    this.registroAgregarMiembroEmpresaForm.patchValue({
      id: this.filaSeleccionadaAgregarMiembroEmpresa?.id,
      tipoPersona: TIPO_PERSONA,
      nombre: this.filaSeleccionadaAgregarMiembroEmpresa?.nombre,
      apellidoPaterno: this.filaSeleccionadaAgregarMiembroEmpresa?.apellidoPaterno,
      apellidoMaterno: this.filaSeleccionadaAgregarMiembroEmpresa?.apellidoMaterno,
      nombreCompleto: this.filaSeleccionadaAgregarMiembroEmpresa?.nombreCompleto,
      rfc: this.filaSeleccionadaAgregarMiembroEmpresa?.rfc,
      rfcInput: this.filaSeleccionadaAgregarMiembroEmpresa?.rfc,
      caracter: CARACTER,
      nacionalidad: NACIONALIDAD,
      nombreEmpresa: this.filaSeleccionadaAgregarMiembroEmpresa?.nombreEmpresa,
    });
    
    // Actualizar el estado del formulario después de establecer los datos
    this.actualizarEstadoFormulario();
  }

  /**
   * @method abrirMultipleSeleccionPopup
   * Muestra un popup de error si se seleccionan múltiples filas para modificar.
   * Este método se activa cuando el botón de modificar está habilitado.
   */
  abrirMultipleSeleccionPopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: 'Selecciona sólo un registro para modificar.',
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };
    this.multipleSeleccionPopupAbierto = true;
  }

  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   */
  
  confirmEliminarEmpleadoItem(): void {
    if(this.agregarMiembroEmpresaList.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'No se encontró información',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    if (this.listaFilaSeleccionadaEmpleado.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.ALERTA,
        modo: 'modal',
        titulo: '',
        mensaje: 'Seleccione un registro',
        cerrar: false,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.multipleSeleccionPopupAbierto = true;
      return;
    }
    this.abrirElimninarConfirmationopup();
  }
 
  /**
   * @method abrirElimninarConfirmationopup
   * Abre un popup de confirmación para eliminar los registros seleccionados.
   * Si no hay registros seleccionados, no realiza ninguna acción.
   */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
    this.confirmEliminarPopupAbierto = true;
  }

  /**
   * Cierra el popup de selección múltiple.
   */
  cerrarMultipleSeleccionPopup(): void {
    this.multipleSeleccionPopupAbierto = false;
    this.multipleSeleccionPopupCerrado = false;
  }

  /**
   * Verifica si un control de formulario es inválido para mostrar mensajes de error.
   * Solo muestra errores para controles que están habilitados.
   * @param nombreControl - El nombre del control de formulario a verificar.
   * @returns Verdadero si el control es inválido y habilitado, de lo contrario, falso.
   */
  public esInvalido(nombreControl: string): boolean {
    const CONTROL = this.registroAgregarMiembroEmpresaForm.get(nombreControl);
    return CONTROL
      ? CONTROL.invalid && (CONTROL.touched || CONTROL.dirty) && CONTROL.enabled
      : false;
  }

  /**
   * Busca los detalles del RFC para una persona física nacional (PFN).
   * Si el RFC tiene longitud mayor a 0, realiza una llamada al solicitudService para obtener los detalles.
   * Actualiza el formulario con la denominación social y el número de empleados obtenidos.
   * @param rfc - El RFC de la persona física nacional.
   */
  onBuscarRfc(): void {
    if (this.registroAgregarMiembroEmpresaForm.get('rfcInput')?.valid) {
      this.solicitudService.getRFCDetails().pipe(
        takeUntil(this.destroyed$)
      ).subscribe({
        next: (result) => {
          const DATOS = result.data;
          this.registroAgregarMiembroEmpresaForm.patchValue({
            rfc: DATOS.rfc,
            nombreCompleto: DATOS.denominacionSocial,
          });
        }
      });
    }else {
      this.enNuevaNotificacion(this.MENSAJE_DE_VALIDACION);
      this.esHabilitarElDialogo = true;
      this.registroAgregarMiembroEmpresaForm.markAllAsTouched();
    }

  }

  /**
   * Restablece el formulario de registro de vehículos a su estado inicial.
   */
  limpiarFormulario(): void {
    this.registroAgregarMiembroEmpresaForm.reset();
    this.radioSeleccionado = '';
    this.elementoSeleccionado = '';
    // Actualizar el estado del formulario después del reset
    this.actualizarEstadoFormulario();
  }

/**
 * Maneja cambio de radio button y actualiza visibilidad de campos.
 * @param valor - Valor seleccionado ('0' o '1')
 */
  enCambioDeValor(valor: string | number): void {
    this.radioSeleccionado = valor === '1' ? 'rfcSeccion' : 'tipdeSeccion';
    // Actualizar el estado del formulario cuando cambia la selección
    this.actualizarEstadoFormulario();
  }

  alSeleccionarElemento(valor: Event): void {
    const VALOR = (valor.target as HTMLSelectElement)?.value;
      if (VALOR) {
    this.elementoSeleccionado = VALOR;
    // Actualizar el estado del formulario cuando cambia el tipo de persona
    this.actualizarEstadoFormulario();
      }
  }
  
   /**
   * Método para mostrar u ocultar el formulario colapsable.
   * Cambia el estado de la variable `colapsable`.
   */
  mostrar_colapsable(): void {
    this.colapsable = !this.colapsable;
  }

  
  /**
   * Actualiza el estado habilitado/deshabilitado de los controles del formulario
   * basado en la selección del radio button.
   */
  actualizarEstadoFormulario(): void {
    if (!this.registroAgregarMiembroEmpresaForm) {
      return;
    }

    if (this.radioSeleccionado === 'rfcSeccion') {
      // Habilitar campos RFC y deshabilitar campos manuales
      this.registroAgregarMiembroEmpresaForm.get('rfcInput')?.enable();
      this.registroAgregarMiembroEmpresaForm.get('nombreCompleto')?.enable();
      this.registroAgregarMiembroEmpresaForm.get('rfc')?.enable();
      
      // Deshabilitar campos manuales
      this.registroAgregarMiembroEmpresaForm.get('tipoPersona')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('nombre')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('apellidoPaterno')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('apellidoMaterno')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('nombreEmpresa')?.disable();
      
    } else if (this.radioSeleccionado === 'tipdeSeccion') {
      // Habilitar campos manuales y deshabilitar campos RFC
      this.registroAgregarMiembroEmpresaForm.get('tipoPersona')?.enable();
      
      // Deshabilitar campos RFC
      this.registroAgregarMiembroEmpresaForm.get('rfcInput')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('nombreCompleto')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('rfc')?.disable();
      
      // Habilitar/deshabilitar campos según el tipo de persona seleccionado
      if (this.elementoSeleccionado === '1') {
        // Persona Física - habilitar campos de nombre y apellidos
        this.registroAgregarMiembroEmpresaForm.get('nombre')?.enable();
        this.registroAgregarMiembroEmpresaForm.get('apellidoPaterno')?.enable();
        this.registroAgregarMiembroEmpresaForm.get('apellidoMaterno')?.enable();
        // Deshabilitar campo de empresa
        this.registroAgregarMiembroEmpresaForm.get('nombreEmpresa')?.disable();
      } else if (this.elementoSeleccionado === '2') {
        // Persona Moral - habilitar campo de empresa
        this.registroAgregarMiembroEmpresaForm.get('nombreEmpresa')?.enable();
        // Deshabilitar campos de nombre y apellidos
        this.registroAgregarMiembroEmpresaForm.get('nombre')?.disable();
        this.registroAgregarMiembroEmpresaForm.get('apellidoPaterno')?.disable();
        this.registroAgregarMiembroEmpresaForm.get('apellidoMaterno')?.disable();
      } else {
        // Ningún tipo seleccionado - deshabilitar todos los campos específicos
        this.registroAgregarMiembroEmpresaForm.get('nombre')?.disable();
        this.registroAgregarMiembroEmpresaForm.get('apellidoPaterno')?.disable();
        this.registroAgregarMiembroEmpresaForm.get('apellidoMaterno')?.disable();
        this.registroAgregarMiembroEmpresaForm.get('nombreEmpresa')?.disable();
      }
      
    } else {
      // Estado inicial - deshabilitar ambas secciones
      this.registroAgregarMiembroEmpresaForm.get('rfcInput')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('nombreCompleto')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('rfc')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('tipoPersona')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('nombre')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('apellidoPaterno')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('apellidoMaterno')?.disable();
      this.registroAgregarMiembroEmpresaForm.get('nombreEmpresa')?.disable();
    }
    
    // Los campos comunes siempre están habilitados
    this.registroAgregarMiembroEmpresaForm.get('caracter')?.enable();
    this.registroAgregarMiembroEmpresaForm.get('nacionalidad')?.enable();
    this.registroAgregarMiembroEmpresaForm.get('obligadoTributarMexico')?.enable();
  }

  /**
   * Convierte el valor del radio button (0/1) a su representación de texto (No/Sí)
   * @param value - El valor del radio button ('0' o '1')
   * @returns La representación de texto correspondiente
   */
  private static convertirValorRadioATexto(value: string): string {
    if (!value || value === '') {
      return '';
    }
    return value === '1' ? 'Sí' : 'No';
  }

  /**
   * Convierte el texto (No/Sí) a valor del radio button (0/1)
   * @param texto - El texto a convertir ('No' o 'Sí')
   * @returns El valor del radio button correspondiente
   */
  private static convertirTextoAValorRadio(texto: string): string {
    if (!texto || texto === '') {
      return '';
    }
    return texto === 'Sí' ? '1' : '0';
  }
  /**
   * @method ngOnDestroy
   * Hook de ciclo de vida que se ejecuta al destruir el componente.
   * Libera recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

/**
 * Valida que exista al menos un miembro de empresa registrado en la lista.
 * @returns boolean indicating if there are miembros de empresa registrados
 */
public validarAgregarMiembroEmpresa(): boolean {
  // Marcar el campo como tocado para mostrar el error
  this.registroAgregarMiembroEmpresaForm.get('miembroDeLaEmpresaTabla')?.markAsTouched();
  
  if (this.agregarMiembroEmpresaList.length === 0) {
    return false;
  }
  
  return true;
}
  
}
