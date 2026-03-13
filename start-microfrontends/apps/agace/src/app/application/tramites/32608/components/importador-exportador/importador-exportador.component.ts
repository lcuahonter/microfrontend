import { CategoriaMensaje, ConfiguracionColumna, ConsultaioQuery, InputFecha, InputFechaComponent, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion, TipoNotificacionEnum, TituloComponent } from '@ng-mf/data-access-user';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPRESA_DEL_GRUPO, EMPRESA_DEL_GRUPO_CON_FECHA, FECHA_DE_INICIO, FECHA_DE_PAGO, INFORMACION_EMPRESA_OPTIONS, NOTA, OPCIONES_DE_BOTON_DE_RADIO, PANELS, PANELS1, REGISTRO_ESQUEMA_CERTIFICACION_OPTIONS, TRANSPORTISTAS_CONFIGURACION } from '../../enums/oea-textil-registro.enum';
import { EmpresaDelGrupo, RFCEnlaceOperativo, RubroTextil, TransportistasTable } from '../../models/oea-textil-registro.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32608State, Solicitud32608Store } from '../../estados/solicitud32608.store';
import { map, takeUntil } from 'rxjs';
import { AgregarTransportistasComponent } from '../agregar-transportistas/agregar-transportistas.component';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FECHA_DELA_ULTIMA_OPERACION } from '../../enums/oea-textil-registro.enum';
import { InputRadioComponent } from '@libs/shared/data-access-user/src'
import { Solicitud32608Query } from '../../estados/solicitud32608.query';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';
import { TemplateRef } from '@angular/core';


/**
 * Componente principal para gestionar los datos de importador y exportador
 * en el formulario, incluyendo la integración con transportistas y validaciones
 * dinámicas.
 */
@Component({
  selector: 'app-importador-exportador',
  standalone: true,
  providers: [BsModalService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    InputFechaComponent,
    TablaDinamicaComponent,
    TituloComponent,
    AgregarTransportistasComponent,
    NotificacionesComponent
  ],
  templateUrl: './importador-exportador.component.html',
  styleUrl: './importador-exportador.component.scss',
})
export class ImportadorExportadorComponent implements OnInit, OnDestroy {

  /**
   * Subject utilizado para gestionar la cancelación de suscripciones Observable.
   * Previene fugas de memoria al destruir el componente.
   */
  destroy$: Subject<void> = new Subject<void>();

  /**
   * Formulario reactivo principal para capturar datos de importador y exportador.
   * Incluye campos como fechas, montos, operaciones bancarias y validaciones.
   */
  importadorExportadorForm!: FormGroup;

  /**
   * Formulario reactivo para agregar enlaces operativos de empresas.
   * Maneja RFC, denominación social, domicilio y fechas de operación.
   */
  agregarEnlaceOperativoForm!: FormGroup;

  /**
   * Formulario reactivo para capturar datos de rubro IVA e IESPS.
   * Incluye campos para tipo de operación, monto y fecha de operación.
   * @type {FormGroup}
   **/
  rubroIVATextilForm!: FormGroup;

  /**
   * Opciones configurables para botones de radio en el formulario.
   * Importado desde las constantes de datos comunes.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Opciones disponibles para el registro de esquema de certificación.
   * Define las opciones seleccionables para certificaciones.
   */
  registroEsquemaCertificacionOptions = REGISTRO_ESQUEMA_CERTIFICACION_OPTIONS;

  /**
   * Opciones de información de empresa disponibles en el formulario.
   * Configuración para tipos de información empresarial.
   */
  informacionEmpresaOptions = INFORMACION_EMPRESA_OPTIONS;

  /**
   * Estado actual de la solicitud del trámite 32608.
   * Contiene toda la información del estado de la aplicación.
   */
  solicitudState!: Solicitud32608State;

  /**
   * Configuración del input de fecha de inicio para el formulario.
   * Define el formato y validaciones para fechas de pago.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * Configuración del input de fecha de fin de vigencia.
   * Define el formato y validaciones para fechas de inicio.
   */
  fechaDeFinDeVigencia: InputFecha = FECHA_DE_INICIO;

  /**
   * Configuración del input de fecha de la última operación.
   * Define el formato y validaciones para fechas de operaciones.
   */
  fechaDeLaUltimaOperacion: InputFecha = FECHA_DELA_ULTIMA_OPERACION;

  /**
   * Bandera que indica si el comercio exterior está activo.
   * Controla la visibilidad de campos relacionados con comercio exterior.
   */
  comercioExteriorActivo: boolean = false;

  /**
   * Bandera que indica si no hay comercio exterior activo.
   * Controla la lógica inversa de comercio exterior.
   */
  noComercioExteriorActivo: boolean = false;

  /**
   * Bandera que indica si la empresa es parte de un grupo de comercio exterior.
   * Controla campos específicos para grupos empresariales.
   */
  parteGrupoComercioExterior: boolean = false;

  /**
   * Bandera que indica si hay fusión o escisión con comercio exterior.
   * Controla validaciones específicas para fusiones empresariales.
   */
  esFusionOEscisionConComercioExterior: boolean = false;

  /**
   * Bandera que indica si es una empresa extranjera IMMEX.
   * Controla validaciones específicas para empresas IMMEX.
   */
  esEmpresaExtranjeraIMMEX: boolean = false;

  /**
   * Bandera que indica si no hay fusión/escisión con operación exterior.
   * Controla la lógica inversa de fusiones con comercio exterior.
   */
  noFusionEscisionConOperacionExterior: boolean = false;

  /**
   * Bandera que controla la visualización de errores en el formulario.
   * Se activa cuando hay errores de validación que deben mostrarse.
   */
  mostrarError: boolean = false;

  /**
   * Bandera que controla la visibilidad del campo de registro de esquema de certificación.
   * Se activa según las selecciones del usuario en el formulario.
   */
  registroEsquemaCertificacion: boolean = false;

  /**
   * Bandera que controla la visibilidad del campo de tipo de información de empresa.
   * Se activa según las configuraciones del formulario.
   */
  tipoInformacionEmpresa: boolean = false;

  /**
   * Configuración de columnas para la tabla de empresas del grupo.
   * Define la estructura y formato de las columnas a mostrar.
   */
  tableHeaderDatos: ConfiguracionColumna<EmpresaDelGrupo>[] = EMPRESA_DEL_GRUPO;

  /**
   * Configuración de columnas para la tabla de transportistas.
   * Define la estructura y formato de las columnas de transportistas.
   */
  transportistasConfiguracionColumnas: ConfiguracionColumna<TransportistasTable>[] = TRANSPORTISTAS_CONFIGURACION;

  /**
   * Lista de transportistas que se muestra en la tabla.
   * Array que contiene todos los transportistas agregados al trámite.
   */
  transportistasLista: TransportistasTable[] = [];

  /**
   * Lista de empresas del grupo que se muestra en la tabla principal.
   * Array que contiene todas las empresas agregadas con sus datos.
   */
  tablaDatos: EmpresaDelGrupo[] = [];

  /**
   * Bandera que controla la visibilidad de la columna de fecha en la tabla.
   * Se activa después de agregar el primer elemento a la tabla.
   */
  mostrarColumnaFecha: boolean = false;

  /**
   * Tipo de selección para la tabla dinámica.
   * Configurado para usar checkboxes en la selección de filas.
   */
  tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Referencia al modal principal para mostrar diferentes tipos de modales.
   * Se utiliza para gestionar el estado de modales de Bootstrap.
   */
  modalRef?: BsModalRef;

  /**
   * Referencia al modal secundario para abrir formularios.
   * Se utiliza específicamente para modales de agregar/editar datos.
   */
  modalRefabir?: BsModalRef;

  /**
   * Bandera que indica si el componente está en modo edición.
   * Controla el comportamiento del formulario entre agregar y modificar.
   */
  isEditMode: boolean = false;

  /**
   * Empresa actualmente seleccionada en la tabla.
   * Se utiliza para operaciones de edición y eliminación.
   */
  selectedEmpresa: EmpresaDelGrupo | null = null;

  /**
   * Mensaje que se muestra en los modales de selección.
   * Contiene texto dinámico para diferentes estados de validación.
   */
  mensajeSeleccion: string = '';

  /**
   * Configuración de paneles colapsables principales para la interfaz.
   * Importado desde las constantes de datos comunes.
   */
  panels = PANELS;

  /**
   * Configuración de paneles colapsables secundarios para la interfaz.
   * Importado desde las constantes de datos comunes.
   */
  panels1 = PANELS1;

  /**
   * Bandera que indica si el formulario debe estar en modo solo lectura.
   * Se actualiza según el estado de consulta del trámite.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el diálogo de notificación está habilitado.
   */
  public esHabilitarElDialogo: boolean = false;

  /**
   * Mensaje que indica un requisito obligatorio para acceder a la nota.
   */
  REQUISITO_OBLIGATORIO = NOTA.REQUISITO_OBLIGATORIO_PARA_ACCEDER_NOTA;

  /**
   * Notificación que se muestra al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /** Variable para almacenar la opción seleccionada para IVA e IEPS */
  autorizacion: boolean = false;

  /**
   * Referencia al template principal del modal.
   * Template para mostrar formularios de empresa.
   */
  @ViewChild('template') template!: TemplateRef<void>;

  /**
   * Referencia al template del modal de fecha inválida.
   * Se muestra cuando se selecciona una fecha futura no permitida.
   */
  @ViewChild('templateFechaInvalida') templateFechaInvalida!: TemplateRef<void>;

  /**
   * Referencia al template del modal de éxito.
   * Template para mostrar confirmaciones de operaciones exitosas.
   */
  @ViewChild('templateExito') templateExito!: TemplateRef<void>;

  /**
   * Referencia al template del modal de RFC duplicado.
   * Se muestra cuando se intenta agregar un RFC que ya existe.
   */
  @ViewChild('templateRFCDuplicado') templateRFCDuplicado!: TemplateRef<void>;

  /**
   * Referencia al template del modal de datos obligatorios.
   * Se muestra cuando faltan campos requeridos o hay errores de validación.
   */
  @ViewChild('templateDatosObligatorios') templateDatosObligatorios!: TemplateRef<void>;

  /**
   * Referencia al template del modal de confirmación de eliminación.
   * Template para confirmar la eliminación de empresas.
   */
  @ViewChild('templateConfirmacionEliminacion') templateConfirmacionEliminacion!: TemplateRef<void>;

  /**
   * Referencia al template del modal de selección requerida.
   * Se muestra cuando se requiere seleccionar un elemento de la tabla.
   */
  @ViewChild('templateSeleccionRequerida') templateSeleccionRequerida!: TemplateRef<void>;

  /**
   * Constructor del componente.
   * Inicializa los servicios necesarios y configura las suscripciones iniciales.
   * 
   * param fb - FormBuilder para crear formularios reactivos
   * param modalService - Servicio para gestionar modales de Bootstrap
   */
  constructor(
    public fb: FormBuilder,
    @Inject(BsModalService)
    private modalService: BsModalService,
    private solicitudService: SolicitudService,
    private tramite32608Store: Solicitud32608Store,
    private tramite32608Query: Solicitud32608Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   * Determina si debe guardar datos existentes o inicializar un formulario nuevo.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Guarda los datos del formulario y establece el estado de solo lectura.
   * Deshabilita todos los controles del formulario cuando está en modo consulta.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.importadorExportadorForm.disable();
    } else {
      this.importadorExportadorForm.enable();
    }
  }

  /**
   * Hook del ciclo de vida que se ejecuta después de la inicialización del componente.
   * Configura el estado inicial del formulario y las suscripciones necesarias.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.getDatosrubroTextil();
     this.importadorExportadorForm.get('opcionTrabajadores')?.valueChanges.subscribe((checked: boolean) => {
      const CONTROL = this.importadorExportadorForm.get('numeroEmpleadosIMSS');

      if (checked && !this.esFormularioSoloLectura) {
        CONTROL?.enable();
      } else {
        CONTROL?.disable();
      }
    });
    this.opcionActivosFijosFuncion();
  }

   opcionActivosFijosFuncion(): void {

    this.importadorExportadorForm.get('opcionActivosFijos')?.valueChanges.subscribe((checked: boolean) => {
      const CONTROL = this.importadorExportadorForm.get('valorTotalDe');

      if (checked && !this.esFormularioSoloLectura) {
        CONTROL?.enable();
      } else {
        CONTROL?.disable();
      }
    });

    // const control = this.importadorExportadorForm.get('valorTotalDe');  
    // if (checked && !this.esFormularioSoloLectura) {
    //   control?.enable();
    // } else {
    //   control?.disable();
    // }
  }
  /**
   * Inicializa los formularios reactivos con los valores del estado actual.
   * Configura validaciones y campos deshabilitados según las reglas de negocio.
   * Crea tanto el formulario principal como el de enlaces operativos.
   */
  inicializarFormulario(): void {
    this.obtenerEstadoSolicitud();
    this.importadorExportadorForm = this.fb.group({
      comercioExteriorRealizado: [this.solicitudState?.comercioExteriorRealizado, Validators.required],
      fechaDePago: [this.solicitudState?.fechaDePago, Validators.required],
      fechaInicioComercio: [this.solicitudState?.fechaInicioComercio, Validators.required],
      esParteGrupoComercioExterior: [this.solicitudState?.esParteGrupoComercioExterior, Validators.required],
      fusionEscisionConOperacionExterior: [this.solicitudState?.fusionEscisionConOperacionExterior, Validators.required],
      empresaExtranjeraIMMEX: [this.solicitudState?.empresaExtranjeraIMMEX, Validators.required],
      monto: [this.solicitudState?.monto, Validators.required],
      operacionesBancarias: [this.solicitudState?.operacionesBancarias, Validators.required],
      llavePago: [this.solicitudState?.llavePago, Validators.required],
      registroEsquemaCertificacion: [this.solicitudState?.registroEsquemaCertificacion, Validators.required],
      tipoInformacionEmpresa: [this.solicitudState?.tipoInformacionEmpresa, Validators.required],
      cuentaConProgramaIMMEX: [this.solicitudState?.cuentaConProgramaIMMEX, Validators.required],
      declaracionAnualISRRepresentantes: [this.solicitudState?.declaracionAnualISRRepresentantes],
      registroEsquemaCertificacionIVAIEPS: [this.solicitudState?.registroEsquemaCertificacionIVAIEPS, Validators.required],
      autorizacion100A: [this.solicitudState?.autorizacion100A, Validators.required],
      opcionTrabajadores: [this.solicitudState?.opcionTrabajadores, Validators.required], 
      opcionActivosFijos: [false], 
      numeroEmpleadosIMSS: [{ value: '', disabled: true }],
      valorTotalDe: [{ value: this.solicitudState?.valorTotalDe, disabled: true }],
      opcionCotizacion: [false],
      actualizar2051: [false],
      sistemaControl: [this.solicitudState?.sistemaControl, Validators.required],
      modalidadProgramaIMMEX: [this.solicitudState?.modalidadProgramaIMMEX, Validators.required],
      numeroProgramaIMMEX: [this.solicitudState?.numeroProgramaIMMEX, Validators.required],
    })
    this.agregarEnlaceOperativoForm = this.fb.group({
      rfcEnclaveOperativo: [this.solicitudState?.rfcEnclaveOperativo, Validators.required],
      enlaceOperativorfc: [
        { value: this.solicitudState?.enlaceOperativorfc, disabled: true }
      ],
      denominacionRazonsocial: [
        { value: this.solicitudState?.denominacionRazonsocial, disabled: true }
      ],
      domicilio: [{ value: this.solicitudState?.domicilio, disabled: true }],
      inputfechaDeLaUltimaOperacion: [{ value: this.solicitudState?.inputfechaDeLaUltimaOperacion, disabled: true }],
    });
    if (this.solicitudState?.tablaDatos) {
      this.tablaDatos = [...this.solicitudState.tablaDatos];
    }

    this.rubroIVATextilForm = this.fb.group({
      rubroCertificacion: [this.solicitudState?.rubroCertificacion, Validators.required],
      fechaFinVigenciaRubro: [this.solicitudState?.fechaFinVigenciaRubro, Validators.required],
      numeroOficio: [this.solicitudState?.numeroOficio, Validators.required],
    });
  }

  /**
   * Maneja el cambio de valor en el campo de fecha de pago.
   * Actualiza el formulario, valida fechas futuras y ejecuta validaciones de pago.
   * 
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  onFechaCambiada(nuevo_valor: string): void {
    this.importadorExportadorForm.get('fechaDePago')?.setValue(nuevo_valor);
    this.importadorExportadorForm.get('fechaDePago')?.markAsUntouched();

    if (ImportadorExportadorComponent.esFechaFutura(nuevo_valor)) {
      this.mostrarModalFechaInvalida();
    }
    this.validarCamposPago();
  }

  /**
   * Actualiza el valor de la fecha de inicio de comercio en el formulario.
   * Establece el valor y marca el campo como no tocado.
   * 
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  actualizarFechaInicioComercio(nuevo_valor: string): void {
    this.importadorExportadorForm.get('fechaInicioComercio')?.setValue(nuevo_valor);
    this.importadorExportadorForm.get('fechaInicioComercio')?.markAsUntouched();
  }

  /**
   * Actualiza el valor de la fecha de la última operación.
   * Valida que la fecha no sea futura y muestra modal de error si es necesario.
   * 
   * param nuevo_valor - Nuevo valor de la fecha en formato string
   */
  actualizarFechaDeLaUltimaOperacion(nuevo_valor: string): void {
    this.agregarEnlaceOperativoForm.get('inputfechaDeLaUltimaOperacion')?.setValue(nuevo_valor);
    this.agregarEnlaceOperativoForm.get('inputfechaDeLaUltimaOperacion')?.markAsUntouched();

    if (ImportadorExportadorComponent.esFechaFutura(nuevo_valor)) {
      this.mostrarModalFechaInvalida();
    }
  }

  /**
   * Método estático que verifica si una fecha seleccionada es mayor que la fecha actual.
   * Soporta formato DD/MM/YYYY y formatos estándar de fecha.
   * 
   * param fechaSeleccionada - Fecha en formato string a validar
   * returns true si la fecha es futura, false en caso contrario
   */
  static esFechaFutura(fechaSeleccionada: string): boolean {
    if (!fechaSeleccionada) {
      return false;
    }

    // Analizar la fecha - asumiendo formato DD/MM/YYYY
    let fechaSeleccionadaDate: Date;

    if (fechaSeleccionada.includes('/')) {
      const FECHA_PARTS = fechaSeleccionada.split('/');
      if (FECHA_PARTS.length !== 3) {
        return false;
      }
      const DIA = parseInt(FECHA_PARTS[0], 10);
      const MES = parseInt(FECHA_PARTS[1], 10) - 1; // El mes está indexado desde 0
      const ANIO = parseInt(FECHA_PARTS[2], 10);

      fechaSeleccionadaDate = new Date(ANIO, MES, DIA);
    } else {
      // Intentar analizar como formato de fecha estándar
      fechaSeleccionadaDate = new Date(fechaSeleccionada);
    }

    const FECHA_ACTUAL = new Date();

    // Reiniciar horas para comparar solo fechas
    FECHA_ACTUAL.setHours(0, 0, 0, 0);
    fechaSeleccionadaDate.setHours(0, 0, 0, 0);

    return fechaSeleccionadaDate > FECHA_ACTUAL;
  }

  /**
   * Muestra el modal de fecha inválida cuando se selecciona una fecha futura.
   * Configura el modal como pequeño y no dismissible.
   */
  mostrarModalFechaInvalida(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRef = this.modalService.show(this.templateFechaInvalida, MODAL_CONFIG);
  }

  /**
   * Cancela la operación actual del modal y resetea el formulario.
   * Cierra el modal, limpia el formulario y resetea el modo de edición.
   */
  cancelarModal(): void {
    this.modalRefabir?.hide();
    this.agregarEnlaceOperativoForm.reset();
    this.resetEditMode();
  }

  /**
   * Cierra el modal de fecha inválida.
   * Se ejecuta después de mostrar el error de fecha futura.
   */
  cerrarModalFechaInvalida(): void {
    this.modalRef?.hide();
  }

  /**
   * Abre el modal principal para mostrar formularios.
   * Configura el tamaño del modal como grande para mejor visualización.
   * 
   * param template - Template del modal a mostrar
   */
  abrirModal(template: TemplateRef<void>): void {
    this.modalRefabir = this.modalService.show(template, { class: 'modal-lg', });
  }

  /**
   * Busca información de una empresa por su RFC.
   * Valida que el RFC no esté duplicado antes de realizar la búsqueda.
   * Ejecuta la consulta al servicio para obtener datos adicionales.
   */
  buscarRFC(): void {
    const RFC = this.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo')?.value;
    if (RFC) {
      // Verificar si el RFC ya existe en la tabla
      if (this.existeRFCEnTabla(RFC)) {
        this.mostrarModalRFCDuplicado();
        return;
      }

      this.buscarDatosPorRFC(RFC);
    }
  }

  /**
   * Verifica si un RFC ya existe en la lista de empresas.
   * Realiza comparación insensible a mayúsculas/minúsculas.
   * 
   * param rfc - RFC a verificar en la lista
   * returns true si el RFC existe, false en caso contrario
   */
  existeRFCEnTabla(rfc: string): boolean {
    return this.tablaDatos.some(empresa =>
      empresa.rfcEnclaveOperativo?.toLowerCase() === rfc.toLowerCase()
    );
  }

  /**
   * Muestra el modal de RFC duplicado cuando se intenta agregar un RFC existente.
   * Configura el modal como pequeño y no dismissible.
   */
  mostrarModalRFCDuplicado(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRef = this.modalService.show(this.templateRFCDuplicado, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de RFC duplicado.
   * Se ejecuta después de mostrar el error de RFC duplicado.
   */
  cerrarModalRFCDuplicado(): void {
    this.modalRef?.hide();
  }

  /**
   * Realiza la búsqueda de datos de la empresa en el servicio por RFC.
   * Maneja respuestas exitosas y errores de la consulta.
   * Actualiza el formulario con los datos encontrados o limpia campos si no hay resultados.
   * 
   * param rfc - RFC de la empresa a buscar
   */
  buscarDatosPorRFC(rfc: string): void {
    this.solicitudService.conseguirDatosPorRFC(rfc)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos) => {
          const EMPRESA_DATA = datos[rfc];
          if (EMPRESA_DATA) {
            this.patchearDatosEmpresa(EMPRESA_DATA);
          } else {
            this.limpiarCamposEmpresa();
          }
        },
        error: (error) => {
          console.error('Error al buscar datos del RFC:', error);
          this.limpiarCamposEmpresa();
        }
      });
  }

  /**
   * Actualiza el formulario con los datos de la empresa encontrada.
   * Rellena automáticamente los campos de solo lectura con la información obtenida.
   * 
   * param empresaData - Datos de la empresa obtenidos del servicio
   */
  patchearDatosEmpresa(empresaData: RFCEnlaceOperativo): void {
    this.agregarEnlaceOperativoForm.patchValue({
      enlaceOperativorfc: empresaData.enlaceOperativorfc,
      denominacionRazonsocial: empresaData.denominacionRazonsocial,
      domicilio: empresaData.domicilio
    });
  }

  /**
   * Limpia los campos de información de la empresa en el formulario.
   * Se ejecuta cuando no se encuentran datos para el RFC consultado.
   */
  limpiarCamposEmpresa(): void {
    this.agregarEnlaceOperativoForm.patchValue({
      enlaceOperativorfc: '',
      denominacionRazonsocial: '',
      domicilio: '',
      inputfechaDeLaUltimaOperacion: ''
    });
  }

  /**
   * Procesa la aceptación y validación del enlace operativo.
   * Ejecuta todas las validaciones necesarias antes de agregar/actualizar.
   * Maneja tanto el modo de adición como el de edición de empresas.
   */
  aceptarEnlaceOperativo(): void {
    const RFC_VALUE = this.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo')?.value;
    const DATE_VALUE = this.agregarEnlaceOperativoForm.get('inputfechaDeLaUltimaOperacion')?.value;

    // Verificar que el campo RFC requerido esté lleno
    if (!RFC_VALUE?.trim()) {
      this.agregarEnlaceOperativoForm.get('rfcEnclaveOperativo')?.markAsTouched();
      return;
    }

    // En modo edición, verificar si el RFC existe en otros registros (excluyendo el actual)
    if (this.isEditMode && this.existeRFCEnTablaExcluyendo(RFC_VALUE, this.selectedEmpresa?.rfcEnclaveOperativo)) {
      this.mostrarModalDatosObligatorios();
      return;
    }
    // En modo agregar, verificar si el RFC ya existe
    if (!this.isEditMode && this.existeRFCEnTabla(RFC_VALUE)) {
      this.mostrarModalDatosObligatorios();
      return;
    }
    // Verificar si la fecha es futura (si se proporciona)
    if (DATE_VALUE && ImportadorExportadorComponent.esFechaFutura(DATE_VALUE)) {
      this.mostrarModalFechaInvalida();
      return;
    }

    // Proceder con agregar los datos
    const FORMDATOS = this.agregarEnlaceOperativoForm.getRawValue();

    const EMPRESA_DATA: EmpresaDelGrupo = {
      rfcEnclaveOperativo: FORMDATOS.rfcEnclaveOperativo,
      denominacionRazonsocial: FORMDATOS.denominacionRazonsocial,
      domicilio: FORMDATOS.domicilio,
      inputfechaDeLaUltimaOperacion: FORMDATOS.inputfechaDeLaUltimaOperacion
    };

    if (this.isEditMode && this.selectedEmpresa) {
      const INDEX = this.tablaDatos.findIndex(emp =>
        emp.rfcEnclaveOperativo === this.selectedEmpresa?.rfcEnclaveOperativo
      );
      if (INDEX !== -1) {
        this.tablaDatos[INDEX] = EMPRESA_DATA;
        this.tablaDatos = [...this.tablaDatos];
      }
    } else {
      this.tablaDatos = [...this.tablaDatos, EMPRESA_DATA];
    }

    this.actualizarTablaDatosEnStore();

    // Mostrar la columna de fecha después de agregar el primer elemento
    if (!this.mostrarColumnaFecha) {
      this.mostrarColumnaFecha = true;
      this.tableHeaderDatos = EMPRESA_DEL_GRUPO_CON_FECHA;
    }

    this.limpiarFormulario();
    this.isEditMode = false;
    this.limpiarSeleccion();
    this.modalRefabir?.hide();
    this.mostrarModalExito();
  }

  /**
   * Verifica si un RFC existe en la tabla excluyendo un RFC específico.
   * Útil para validaciones en modo edición donde el RFC actual debe ser excluido.
   * 
   * param rfc - RFC a verificar
   * param rfcExcluir - RFC a excluir de la verificación (opcional)
   * returns true si existe el RFC (excluyendo el especificado), false en caso contrario
   */
  existeRFCEnTablaExcluyendo(rfc: string, rfcExcluir?: string): boolean {
    return this.tablaDatos.some(empresa =>
      empresa.rfcEnclaveOperativo?.toLowerCase() === rfc.toLowerCase() &&
      empresa.rfcEnclaveOperativo?.toLowerCase() !== rfcExcluir?.toLowerCase()
    );
  }

  /**
   * Resetea el modo de edición a su estado inicial.
   * Establece el modo como adición y limpia banderas de edición.
   */
  resetEditMode(): void {
    this.isEditMode = false;
  }

  /**
   * Limpia la selección actual de empresa.
   * Resetea la empresa seleccionada a null.
   */
  limpiarSeleccion(): void {
    this.selectedEmpresa = null;
  }

  /**
   * Muestra el modal de datos obligatorios para errores de validación.
   * Se usa cuando faltan campos requeridos o hay datos duplicados.
   */
  mostrarModalDatosObligatorios(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRef = this.modalService.show(this.templateDatosObligatorios, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de datos obligatorios.
   * Se ejecuta después de mostrar errores de validación.
   */
  cerrarModalDatosObligatorios(): void {
    this.modalRef?.hide();
  }

  /**
   * Limpia completamente el formulario de enlace operativo.
   * Resetea todos los campos a valores vacíos y desactiva el modo edición.
   */
  limpiarFormulario(): void {
    this.agregarEnlaceOperativoForm.reset();
    this.agregarEnlaceOperativoForm.patchValue({
      rfcEnclaveOperativo: '',
      enlaceOperativorfc: '',
      denominacionRazonsocial: '',
      domicilio: '',
      inputfechaDeLaUltimaOperacion: ''
    });
    this.isEditMode = false;
  }

  /**
   * Marca todos los campos del formulario de enlace operativo como tocados.
   * Utilizado para mostrar errores de validación en todos los campos.
   */
  marcarCamposComoTocados(): void {
    Object.keys(this.agregarEnlaceOperativoForm.controls).forEach(key => {
      this.agregarEnlaceOperativoForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Muestra el modal de confirmación de éxito.
   * Se ejecuta después de completar operaciones exitosamente.
   */
  mostrarModalExito(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRef = this.modalService.show(this.templateExito, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de confirmación de éxito.
   * Se ejecuta después de mostrar el mensaje de operación exitosa.
   */
  cerrarModalExito(): void {
    this.modalRef?.hide();
  }

  /**
   * Maneja la selección de una fila en la tabla de empresas.
   * Actualiza la empresa seleccionada para operaciones posteriores.
   * 
   * param empresa - Empresa seleccionada de la tabla
   */
  onFilaSeleccionada(empresa: EmpresaDelGrupo): void {
    this.selectedEmpresa = empresa;
  }

  /**
   * Inicia el proceso de modificación de una empresa existente.
   * Valida que haya una empresa seleccionada y configura el modo de edición.
   * Rellena el formulario con los datos de la empresa seleccionada.
   */
  modificarEmpresa(): void {
    if (this.tablaDatos.length === 0 || !this.selectedEmpresa) {
      this.mensajeSeleccion = 'Debe seleccionar un elemento';
      this.mostrarModalSeleccionRequerida();
      return;
    }

    this.isEditMode = true;

    this.agregarEnlaceOperativoForm.patchValue({
      rfcEnclaveOperativo: '',
      enlaceOperativorfc: this.selectedEmpresa.rfcEnclaveOperativo,
      denominacionRazonsocial: this.selectedEmpresa.denominacionRazonsocial,
      domicilio: this.selectedEmpresa.domicilio,
      inputfechaDeLaUltimaOperacion: this.selectedEmpresa.inputfechaDeLaUltimaOperacion || ''
    });

    // Abrir el modal
    this.abrirModal(this.template);
  }

  /**
   * Inicia el proceso de eliminación de una empresa.
   * Valida que haya una empresa seleccionada antes de proceder.
   * Muestra el modal de confirmación para la eliminación.
   */
  eliminarEmpresa(): void {
    if (this.tablaDatos.length === 0 || !this.selectedEmpresa) {
      this.mensajeSeleccion = 'Debe seleccionar un elemento';
      this.mostrarModalSeleccionRequerida();
      return;
    }

    // Mostrar modal de confirmación antes de eliminar
    this.mostrarModalConfirmacionEliminacion();
  }

  /**
   * Confirma y ejecuta la eliminación de la empresa seleccionada.
   * Actualiza la lista y el store, resetea la selección y muestra confirmación.
   */
  confirmarEliminacionEmpresa(): void {
    if (!this.selectedEmpresa) {
      return;
    }

    // Eliminar la empresa seleccionada de la tabla
    this.tablaDatos = this.tablaDatos.filter(empresa =>
      empresa.rfcEnclaveOperativo !== this.selectedEmpresa?.rfcEnclaveOperativo
    );

    this.actualizarTablaDatosEnStore();
    this.limpiarSeleccion();

    // Cerrar modal de confirmación y mostrar éxito
    this.modalRef?.hide();
    this.mensajeSeleccion = 'Datos eliminados correctamente';
    this.mostrarModalSeleccionRequerida();
  }

  /**
   * Muestra el modal cuando se requiere seleccionar un elemento.
   * Se usa cuando el usuario intenta realizar una acción sin seleccionar una empresa.
   */
  mostrarModalSeleccionRequerida(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-sm'
    };

    this.modalRef = this.modalService.show(this.templateSeleccionRequerida, MODAL_CONFIG);
  }

  /**
   * Muestra el modal de confirmación para eliminar una empresa.
   * Requiere confirmación del usuario antes de proceder con la eliminación.
   */
  mostrarModalConfirmacionEliminacion(): void {
    const MODAL_CONFIG = {
      animated: true,
      keyboard: false,
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-m'
    };

    this.modalRef = this.modalService.show(this.templateConfirmacionEliminacion, MODAL_CONFIG);
  }

  /**
   * Cierra el modal de selección requerida.
   * Se ejecuta después de mostrar el mensaje de selección obligatoria.
   */
  cerrarModalSeleccionRequerida(): void {
    this.modalRef?.hide();
  }

  /**
   * Cierra el modal de confirmación de eliminación sin realizar cambios.
   * Cancela el proceso de eliminación y mantiene el estado actual.
   */
  cerrarModalConfirmacionEliminacion(): void {
    this.modalRef?.hide();
  }

  /**
   * Controla la funcionalidad de paneles colapsables principales en la interfaz.
   * Permite mostrar/ocultar secciones del formulario de manera acordeón.
   * 
   * param index - Índice del panel a mostrar/ocultar
   */
  mostrar_colapsable(index: number): void {
    const IS_CURRENTLY_OPEN = this.panels[index].isCollapsed;
    this.panels.forEach((panel: { isCollapsed: boolean }, i: number) => {
      panel.isCollapsed = i === index ? !IS_CURRENTLY_OPEN : true;
    });
  }

  /**
   * Valida la llave de pago y ejecuta validaciones de campos de pago.
   * Método auxiliar que dispara la validación completa de campos de pago.
   */
  validarLlavePago(): void {
    this.validarCamposPago();
  }

  /**
   * Valida que todos los campos de pago estén completos.
   * Actualiza la bandera de error según el estado de los campos requeridos.
   */
  validarCamposPago(): void {
    const FECHADEPAGE = this.importadorExportadorForm.get('fechaDePago')?.value;
    const MONTO = this.importadorExportadorForm.get('monto')?.value;
    const OPERACIONESBANCARIAS = this.importadorExportadorForm.get('operacionesBancarias')?.value;
    const LLAVEPAGO = this.importadorExportadorForm.get('llavePago')?.value;

    this.mostrarError = !FECHADEPAGE || !MONTO || !OPERACIONESBANCARIAS || !LLAVEPAGO;
  }

  /**
   * Controla la funcionalidad de paneles colapsables secundarios en la interfaz.
   * Permite mostrar/ocultar secciones del formulario de manera acordeón.
   * 
   * param index - Índice del panel a mostrar/ocultar
   */
  mostrar_colapsable1(index: number): void {
    const IS_CURRENTLY_OPEN = this.panels1[index].isCollapsed;
    this.panels1.forEach((panel1: { isCollapsed: boolean }, i: number) => {
      panel1.isCollapsed = i === index ? !IS_CURRENTLY_OPEN : true;
    });
  }

  /**
   * Validador de entrada que permite solo números en los campos.
   * Maneja teclas especiales como backspace, delete, flechas y atajos de teclado.
   * 
   * param event - Evento de teclado a validar
   * returns true si se permite la tecla, false si se bloquea
   */
  soloNumeros(event: KeyboardEvent): boolean {
    // Verificar que el formulario existe
    if (!this.importadorExportadorForm) {
      return false;
    }

    const CHARCODE = event.which ? event.which : event.keyCode;

    // Permitir: backspace (8), delete (46), tab (9), escape (27), enter (13)
    if ([8, 9, 27, 13, 46].indexOf(CHARCODE) !== -1 ||
      // Permitir: Ctrl+A (65), Ctrl+C (67), Ctrl+V (86), Ctrl+X (88)
      (CHARCODE === 65 && event.ctrlKey === true) ||
      (CHARCODE === 67 && event.ctrlKey === true) ||
      (CHARCODE === 86 && event.ctrlKey === true) ||
      (CHARCODE === 88 && event.ctrlKey === true) ||
      // Permitir: Home (36), End (35), flecha izquierda (37), flecha derecha (39)
      (CHARCODE >= 35 && CHARCODE <= 39)) {
      return true;
    }

    // Bloquear si no es un número (0-9)
    if (CHARCODE < 48 || CHARCODE > 57) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  /**
   * Maneja el evento de pegado para permitir solo números.
   * Filtra el contenido pegado para mantener solo caracteres numéricos.
   * 
   * param event - Evento de pegado del portapapeles
   * param fieldName - Nombre del campo en el formulario a actualizar
   */
  pegarSoloNumeros(event: ClipboardEvent, fieldName: string): void {
    event.preventDefault();
    const TEXTO_PEGADO = event.clipboardData?.getData('text') || '';
    const SOLO_NUMEROS = TEXTO_PEGADO.replace(/[^0-9]/g, '');

    const ELEMENTO_DESTINO = event.target as HTMLInputElement;
    const LONGITUD_MAXIMA = parseInt(ELEMENTO_DESTINO.getAttribute('maxlength') || '10', 10);
    const NUEVO_VALOR = SOLO_NUMEROS.substring(0, LONGITUD_MAXIMA);

    // Actualizar el control del formulario
    this.importadorExportadorForm.get(fieldName)?.setValue(NUEVO_VALOR);
  }

  /**
   * Validador de entrada que permite solo caracteres alfanuméricos y espacios.
   * Maneja teclas especiales y permite números, letras y espacios.
   * 
   * param event - Evento de teclado a validar
   * returns true si se permite la tecla, false si se bloquea
   */
  soloAlfanumericosConEspacios(event: KeyboardEvent): boolean {
    // Verificar que el formulario existe
    if (!this.importadorExportadorForm) {
      return false;
    }

    const CHARCODE = event.which ? event.which : event.keyCode;

    // Permitir: backspace (8), delete (46), tab (9), escape (27), enter (13), espacio (32)
    if ([8, 9, 27, 13, 46, 32].indexOf(CHARCODE) !== -1 ||
      // Permitir: Ctrl+A (65), Ctrl+C (67), Ctrl+V (86), Ctrl+X (88)
      (CHARCODE === 65 && event.ctrlKey === true) ||
      (CHARCODE === 67 && event.ctrlKey === true) ||
      (CHARCODE === 86 && event.ctrlKey === true) ||
      (CHARCODE === 88 && event.ctrlKey === true) ||
      // Permitir: Home (36), End (35), flecha izquierda (37), flecha derecha (39)
      (CHARCODE >= 35 && CHARCODE <= 39)) {
      return true;
    }

    // Permitir: números (48-57), letras mayúsculas (65-90), letras minúsculas (97-122)
    if ((CHARCODE >= 48 && CHARCODE <= 57) || // 0-9
      (CHARCODE >= 65 && CHARCODE <= 90) || // A-Z
      (CHARCODE >= 97 && CHARCODE <= 122)) { // a-z
      return true;
    }

    // Bloquear cualquier otro caracter
    event.preventDefault();
    return false;
  }

  /**
   * Maneja el evento de pegado para permitir solo caracteres alfanuméricos y espacios.
   * Filtra el contenido pegado para mantener solo caracteres válidos.
   * 
   * param event - Evento de pegado del portapapeles
   * param fieldName - Nombre del campo en el formulario a actualizar
   */
  pegarSoloAlfanumericos(event: ClipboardEvent, fieldName: string): void {
    event.preventDefault();
    const TEXTO_PEGADO = event.clipboardData?.getData('text') || '';
    const SOLO_ALFANUMERICOS = TEXTO_PEGADO.replace(/[^a-zA-Z0-9\s]/g, '');

    const ELEMENTO_DESTINO = event.target as HTMLInputElement;
    const LONGITUD_MAXIMA = parseInt(ELEMENTO_DESTINO.getAttribute('maxlength') || '25', 10);
    const NUEVO_VALOR = SOLO_ALFANUMERICOS.substring(0, LONGITUD_MAXIMA);

    // Actualizar el control del formulario
    this.importadorExportadorForm.get(fieldName)?.setValue(NUEVO_VALOR);
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
      this.tramite32608Store.actualizarEstado({ [campo]: CONTROL.value });
    }
  }
  /**
   * Maneja el cambio en el campo de registro de esquema de certificación IVA/IEPS.
   * Si se selecciona "No", limpia los campos relacionados en el formulario.
   * Si se selecciona "Sí", puede cargar datos desde un servicio o mantener los valores existentes.
   * 
   * param value - Valor seleccionado del campo de registro de esquema
   */

  /**
   * Maneja el cambio en el campo de registro de esquema de certificación IVA/IEPS.
   * Si se selecciona "No" (0), limpia los campos relacionados y los habilita.
   * Si se selecciona "Sí" (1), carga datos desde el servicio y deshabilita los campos.
   * 
   * param value - Valor seleccionado del campo de registro de esquema
   */
  onRegistroEsquemaCertificacionIVAIEPSChange(value: string | number): void {
    const VALUE_STRING = value.toString();

    if (VALUE_STRING === '0') {
      // Clear the form and enable fields when "No" is selected
      this.rubroIVATextilForm.patchValue({
        rubroCertificacion: '',
        fechaFinVigenciaRubro: '',
        numeroOficio: ''
      });

      // Enable all fields in the form
      this.rubroIVATextilForm.enable();

    } else if (VALUE_STRING === '1') {
      // Load data from service and disable fields when "Yes" is selected
      this.getDatosrubroTextil();

      // Disable all fields in the form after data is loaded
      setTimeout(() => {
        this.rubroIVATextilForm.disable();
      }, 100); // Small delay to ensure data is loaded first
    }
  }


  /**
   * Obtiene el estado actual de la solicitud desde el store.
   * Se suscribe a los cambios del estado y actualiza la tabla de datos.
   * Mantiene sincronizada la información entre el store y el componente.
   */
  obtenerEstadoSolicitud(): void {
    this.tramite32608Query.selectSolicitud$?.pipe(takeUntil(this.destroy$))
      .subscribe((data: Solicitud32608State) => {
        this.solicitudState = data;
        if (data.tablaDatos) {
          this.tablaDatos = [...data.tablaDatos];
        }
      });
  }

  /**
   * Actualiza la tabla de datos en el store de estado.
   * Sincroniza los cambios locales con el estado global de la aplicación.
   */
  actualizarTablaDatosEnStore(): void {
    this.tramite32608Store.actualizarEstado({ tablaDatos: this.tablaDatos });
  }

  /**
  * Actualiza el valor de la propiedad 2050 (Autorización 100-A) en el store
  * @param evento Nuevo valor para la propiedad
  */
  onAutorizacion100AChange(evento: string | number): void {


    if (evento === 0 || evento === '0') {
      this.autorizacion = true; // Show authorization fields
    }
    else {
      this.autorizacion = false; // Hide authorization fields
    }
  }

  /**
   * Método que se ejecuta cuando se selecciona una opción del botón de radio.
   * Habilita o deshabilita el diálogo de confirmación según la opción seleccionada.
   * @param {string, number} evento - El evento del cambio de valor del botón de radio.
   * @param {string} nota - Nota opcional para enviar al diálogo.
   */
  onSeleccionfalsa(evento: string | number, nota?: string): void {
    if (evento && (evento === '0' || evento === 0)) {
      this.enviarDialogData(nota);
      this.esHabilitarElDialogo = true;
    } else {
      this.esHabilitarElDialogo = false;
    }

  }

  /**
    * Envía los datos del formulario y muestra el modal de confirmación.
    * Si el formulario es inválido, marca todos los campos como tocados.
    */
  enviarDialogData(datos?: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ALERTA,
      modo: 'modal',
      titulo: '',
      mensaje: datos ? datos : this.REQUISITO_OBLIGATORIO,
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
      tamanioModal: 'modal-md',
    };
  }

  /**
* Método para cerrar el modal de confirmación.
* @returns {void}
*/
  cerrarModal(): void {
    this.esHabilitarElDialogo = false;
  }

  getDatosrubroTextil(): void {
    this.solicitudService.getDatosrubroTextil()
      .pipe(takeUntil(this.destroy$))
      .subscribe((datos: RubroTextil) => {
        this.rubroIVATextilForm.patchValue({
          rubroCertificacion: datos.rubroCertificacion,
          fechaFinVigenciaRubro: datos.fechaFinVigenciaRubro,
          numeroOficio: datos.numeroOficio
        });
        this.tramite32608Store.actualizarEstado(datos);

        // Disable the form after patching values if the current selection is '1'
        const CURRENT_VALUE = this.importadorExportadorForm.get('registroEsquemaCertificacionIVAIEPS')?.value;
        if (CURRENT_VALUE === '1') {
          this.rubroIVATextilForm.disable();
        }
      });
  }

  /**
* Verifica si el formulario `importadorExportadorForm` es válido.
* Si el formulario es válido, retorna `true`. 
* Si no es válido, marca todos los campos como tocados para mostrar los errores y retorna `false`.
*/
  validarFormulario(): boolean {
    let esValido = true;

    // Validate main form
    if (this.importadorExportadorForm.invalid) {
      this.importadorExportadorForm.markAllAsTouched();
      esValido = false;
    }


    return esValido;
  }

  /**
   * Hook del ciclo de vida que se ejecuta antes de destruir el componente.
   * Finaliza todas las suscripciones para prevenir fugas de memoria.
   * Completa el Subject destroy$ para cancelar observables activos.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}