import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConfiguracionAporteColumna,
  ConfiguracionColumna,
  InputRadioComponent,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  TablaConEntradaComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DOMICILIOS_CONFIGURACION_COLUMNAS,
  INVENTARIOS_CONFIGURACION,
  NUMERO_DE_EMPLEADOS_CONFIGURACION,
  SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS,
} from '../../constants/solicitud.enum';
import {
  Domicilios,
  InputRadio,
  Inventarios,
  NumeroDeEmpleados,
  SeccionSociosIC,
  SolicitudCatologoSelectLista,
  SolicitudRadioLista,
} from '../../models/solicitud.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  Solicitud32607State,
  Solicitud32607Store,
} from '../../estados/solicitud32607.store';
import { Subject, map, takeUntil } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { EnlaceOperativoComponent } from '../enlace-operativo/enlace-operativo.component';
import { InstalacionesPrincipalesComponent } from '../instalaciones-principales/instalaciones-principales.component';
import { MiembroDeLaEmpresaComponent } from '../miembro-de-la-empresa/miembro-de-la-empresa.component';
import { Modal } from 'bootstrap';
import { ModificarInventarioComponent } from '../modificar-inventario/modificar-inventario.component';
import { SeccionSubcontratadosComponent } from '../seccion-subcontratados/seccion-subcontratados.component';
import { Solicitud32607Query } from '../../estados/solicitud32607.query';
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente principal para la gestión de datos comunes de la solicitud.
 * Este componente se encarga de mostrar y gestionar las secciones relacionadas
 * con miembros de la empresa, subcontratados, instalaciones principales y otros
 * datos necesarios en el flujo de la solicitud.
 */
@Component({
  selector: 'app-datos-comunes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    InputRadioComponent,
    TituloComponent,
    TablaDinamicaComponent,
    MiembroDeLaEmpresaComponent,
    NotificacionesComponent,
    SeccionSubcontratadosComponent,
    InstalacionesPrincipalesComponent,
    TablaConEntradaComponent,
    ToastrModule,
    EnlaceOperativoComponent,
    ModificarInventarioComponent,
  ],
  providers: [SolicitudService, ToastrService],
  templateUrl: './datos-comunes.component.html',
  styleUrl: './datos-comunes.component.scss',
})
/**
 * Componente principal para la gestión de datos comunes de la solicitud.
 * Este componente se encarga de mostrar y gestionar las secciones relacionadas
 * con miembros de la empresa, subcontratados, instalaciones principales y otros
 * datos necesarios en el flujo de la solicitud.
 */
export class DatosComunesComponent implements OnInit, OnDestroy {
  /** Formulario principal que contiene los datos comunes del componente */
  datosComunesForm!: FormGroup;

  /** Subject para manejar la destrucción del componente y evitar fugas de memoria */
  private destroy$: Subject<void> = new Subject<void>();

  /** Modelo para la opción de tipo sí/no representado como radio button */
  sinoOpcion: InputRadio = {} as InputRadio;

  /** Catálogo para el sector productivo */
  sectorProductivo: CatalogosSelect = {} as CatalogosSelect;

  /** Catálogo para el tipo de servicio */
  servicio: CatalogosSelect = {} as CatalogosSelect;

  /** Catálogo para seleccionar el bimestre */
  bimestre: CatalogosSelect = {} as CatalogosSelect;

  /** Estado actual del formulario 32607 */
  solicitud32607State: Solicitud32607State = {} as Solicitud32607State;

  /** Tipo de tabla utilizada para mostrar número de empleados (checkbox) */
  numeroDeEmpleadosTabla = TablaSeleccion.CHECKBOX;

  /** Configuración de columnas para la tabla de número de empleados */
  numeroDeEmpleadosConfiguracionColumnas: ConfiguracionColumna<NumeroDeEmpleados>[] =
    NUMERO_DE_EMPLEADOS_CONFIGURACION;

  /** Lista completa de número de empleados */
  numeroDeEmpleadosLista: NumeroDeEmpleados[] = [] as NumeroDeEmpleados[];

  /** Lista de empleados seleccionados en la tabla */
  seleccionarNumeroDeEmpleadosLista: NumeroDeEmpleados[] =
    [] as NumeroDeEmpleados[];

  /** Configuración de columnas para la tabla de domicilios */
  domiciliosConfiguracionColumnas: ConfiguracionColumna<Domicilios>[] =
    DOMICILIOS_CONFIGURACION_COLUMNAS;

  /** Datos de los domicilios disponibles */
  domiciliosDatos: Domicilios[] = [] as Domicilios[];

  /** Domicilios seleccionados por el usuario */
  seleccionarDomiciliosDatos: Domicilios[] = [] as Domicilios[];

  /** Configuración de columnas para la tabla de inventarios */
  inventariosConfiguracionColumnas: ConfiguracionAporteColumna<Inventarios>[] =
    INVENTARIOS_CONFIGURACION;

  /** Datos de inventarios registrados */
  inventariosDatos: Inventarios[] = [] as Inventarios[];

  /** Inventarios seleccionados por el usuario */
  seleccionarInventarios: Inventarios[] = [] as Inventarios[];

  /** Configuración de columnas para la sección de socios IC */
  seccionSociosICConfiguracionColumnas: ConfiguracionColumna<SeccionSociosIC>[] =
    SECCION_SOCIOSIC_CONFIGURACION_COLUMNAS;

  /** Lista de socios IC registrados */
  listaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /** Lista de socios IC seleccionados por el usuario */
  seleccionarListaSeccionSociosIC: SeccionSociosIC[] = [] as SeccionSociosIC[];

  /**
   * Referencia al modal para agregar miembros de la empresa.
   */
  @ViewChild('modalAgregarMiembrosEmpresa', { static: false })
  modalElement!: ElementRef;

  /**
   * Referencia al elemento del DOM del modal de modificación de inventario.
   * Se utiliza para controlar la apertura y cierre del modal desde el componente.
   *
   * @type {ElementRef}
   * @memberof NombreDelComponente
   */
  @ViewChild('modalModificarInventario', { static: false })
  modalModificarInventarioElement!: ElementRef;

  /**
   * Referencia al modal de la sección de subcontratados.
   */
  @ViewChild('modalSeccionSubcontratados', { static: false })
  modalSeccionSubcontratadosElement!: ElementRef;

  /**
   * Referencia al modal de instalaciones principales.
   */
  @ViewChild('modalInstalacionesPrincipales', { static: false })
  modalInstalacionesPrincipalesElement!: ElementRef;

  /**
   * Referencia al modal de instalaciones principales.
   */
  @ViewChild('modalEnlaceOperativo', { static: false })
  modalEnlaceOperativoElement!: ElementRef;

  /**
   * Notificación utilizada para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice o identificador del elemento que se desea eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Lista de pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si el establecimiento está registrado en el IMSS.
   *
   * @type {boolean}
   */
  elimss: boolean = false;

  /**
   * Indica si el establecimiento cuenta con áreas especializadas.
   *
   * @type {boolean}
   */
  especializadas: boolean = false;

  /**
   * Constructor del componente. Inyecta dependencias necesarias y carga las opciones del radio button.
   * @param fb - FormBuilder para crear el formulario reactivo.
   * @param solicitudService - Servicio que realiza operaciones sobre la solicitud.
   * @param solicitud32607Store - Store para actualizar el estado de la solicitud.
   * @param solicitud32607Query - Query para observar cambios en el estado de la solicitud.
   * @param consultaioQuery - Query para consultar datos auxiliares necesarios.
   */
  constructor(
    public fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32607Store: Solicitud32607Store,
    public solicitud32607Query: Solicitud32607Query,
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
    this.conseguirOpcionDeRadio();
    this.conseguirSolicitudCatologoSelectLista();
    this.conseguirInventarios();
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa el formulario `datosComunesForm` con valores del estado actual
   * y suscribe a los cambios del store para mantener los datos sincronizados.
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
      this.datosComunesForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.datosComunesForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `datosComunesForm` con los valores actuales del estado `solicitud32607State`.
   *
   * Este formulario contiene una amplia variedad de campos que representan diferentes datos
   * requeridos por la solicitud 32607. Los valores iniciales de cada control se obtienen
   * directamente del estado actual gestionado por el store.
   *
   */
  inicializarFormulario(): void {
    this.datosComunesForm = this.fb.group({
      catseleccionados: [
        { value: this.solicitud32607State.catseleccionados, disabled: false },
      ],
      servicio: [{ value: this.solicitud32607State.servicio, disabled: false }],
      '190': [{ value: this.solicitud32607State['190'], disabled: false }],
      '191': [{ value: this.solicitud32607State['191'], disabled: false }],
      '199': [{ value: this.solicitud32607State['199'], disabled: false }],
      empleados: [
        { value: this.solicitud32607State.empleados, disabled: false },
      ],
      bimestre: [{ value: this.solicitud32607State.bimestre, disabled: false }],
      '2034': [{ value: this.solicitud32607State['2034'], disabled: false }],
      '236': [{ value: this.solicitud32607State['236'], disabled: false }],
      '237': [{ value: this.solicitud32607State['237'], disabled: false }],
      '238': [{ value: this.solicitud32607State['238'], disabled: false }],
      '239': [{ value: this.solicitud32607State['239'], disabled: false }],
      '240': [{ value: this.solicitud32607State['240'], disabled: false }],
      '241': [{ value: this.solicitud32607State['241'], disabled: false }],
      '243': [{ value: this.solicitud32607State['243'], disabled: false }],
      '244': [{ value: this.solicitud32607State['244'], disabled: false }],
      '245': [{ value: this.solicitud32607State['245'], disabled: false }],
      '246': [{ value: this.solicitud32607State['246'], disabled: false }],
      file1: [{ value: this.solicitud32607State.file1, disabled: false }],
      file2: [{ value: this.solicitud32607State.file2, disabled: false }],
      '247': [{ value: this.solicitud32607State['247'], disabled: false }],
      '248': [{ value: this.solicitud32607State['248'], disabled: false }],
      identificacion: [
        { value: this.solicitud32607State.identificacion, disabled: false },
      ],
      lugarDeRadicacion: [
        { value: this.solicitud32607State.lugarDeRadicacion, disabled: false },
      ],
      '249': [{ value: this.solicitud32607State['249'], disabled: false }],
      '250': [{ value: this.solicitud32607State['250'], disabled: false }],
      '251': [{ value: this.solicitud32607State['251'], disabled: false }],
      checkbox1: [
        { value: this.solicitud32607State.checkbox1, disabled: false },
      ],
      checkbox2: [
        { value: this.solicitud32607State.checkbox2, disabled: false },
      ],
      checkbox3: [
        { value: this.solicitud32607State.checkbox3, disabled: false },
      ],
      actualmente2: [
        { value: this.solicitud32607State.actualmente2, disabled: false },
      ],
      actualmente1: [
        { value: this.solicitud32607State.actualmente1, disabled: false },
      ],
    });

    /**
     * Suscripción al estado de solicitud en el store para mantener
     * sincronizados los datos del formulario con el estado global.
     */
    this.solicitud32607Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32607State) => {
          this.solicitud32607State = respuesta;
          this.datosComunesForm.patchValue({
            catseleccionados: this.solicitud32607State.catseleccionados,
            servicio: this.solicitud32607State.servicio,
            '190': this.solicitud32607State['190'],
            '191': this.solicitud32607State['191'],
            '199': this.solicitud32607State['199'],
            empleados: this.solicitud32607State.empleados,
            bimestre: this.solicitud32607State.bimestre,
            '2034': this.solicitud32607State['2034'],
            '236': this.solicitud32607State['236'],
            '237': this.solicitud32607State['237'],
            '238': this.solicitud32607State['238'],
            '239': this.solicitud32607State['239'],
            '240': this.solicitud32607State['240'],
            '241': this.solicitud32607State['241'],
            '243': this.solicitud32607State['243'],
            '244': this.solicitud32607State['244'],
            '245': this.solicitud32607State['245'],
            '246': this.solicitud32607State['246'],
            file1: this.solicitud32607State.file1,
            file2: this.solicitud32607State.file2,
            '247': this.solicitud32607State['247'],
            '248': this.solicitud32607State['248'],
            identificacion: this.solicitud32607State.identificacion,
            lugarDeRadicacion: this.solicitud32607State.lugarDeRadicacion,
            '249': this.solicitud32607State['249'],
            '250': this.solicitud32607State['250'],
            '251': this.solicitud32607State['251'],
            checkbox1: this.solicitud32607State.checkbox1,
            checkbox2: this.solicitud32607State.checkbox2,
            checkbox3: this.solicitud32607State.checkbox3,
            actualmente2: this.solicitud32607State.actualmente2,
            actualmente1: this.solicitud32607State.actualmente1,
          });
          this.numeroDeEmpleadosLista =
            this.solicitud32607State.numeroDeEmpleadosLista;
          this.domiciliosDatos = this.solicitud32607State.domiciliosDatos;
          this.listaSeccionSociosIC =
            this.solicitud32607State.listaSeccionSociosIC;
        })
      )
      .subscribe();
  }

  /**
   * Método para obtener la opción de radio (sí/no) desde el servicio.
   * Se suscribe al observable y asigna el resultado a `sinoOpcion`.
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
   * Método para obtener los catálogos del formulario desde el servicio.
   * Se asignan los valores correspondientes a sus propiedades.
   */
  conseguirSolicitudCatologoSelectLista(): void {
    this.solicitudService
      .conseguirSolicitudCatologoSelectLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudCatologoSelectLista) => {
          this.sectorProductivo = respuesta.sectorProductivo;
          this.servicio = respuesta.servicio;
          this.bimestre = respuesta.bimestre;
        },
      });
  }

  /**
   * Método para obtener los datos de inventarios desde el servicio.
   * Los resultados se asignan a la propiedad `inventariosDatos`.
   */
  conseguirInventarios(): void {
    this.solicitudService
      .conseguirInventarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: Inventarios[]) => {
          this.inventariosDatos = respuesta;
        },
      });
  }

  /**
   * Muestra el modal para agregar miembros de la empresa.
   * Se utiliza el elemento del DOM referenciado como modalElement.
   */
  agregarMiembrosEmpresa(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Muestra el modal para agregar subcontratados a la empresa.
   * Utiliza el elemento referenciado como modalSeccionSubcontratadosElement.
   */
  agregarSubcontratados(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(
        this.modalSeccionSubcontratadosElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Muestra el modal para agregar instalaciones principales de la empresa.
   * Utiliza el elemento referenciado como modalInstalacionesPrincipalesElement.
   */
  modificarInstalacionesPrincipales(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(
        this.modalInstalacionesPrincipalesElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Muestra el modal para agregar instalaciones principales de la empresa.
   * Utiliza el elemento referenciado como modalInstalacionesPrincipalesElement.
   */
  agregarInstalacionesPrincipales(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(
        this.modalEnlaceOperativoElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Actualiza la lista de miembros de la empresa con un nuevo registro recibido como evento.
   * También actualiza el store y agrega un objeto pedimento por defecto.
   * Muestra un modal con mensaje de éxito al usuario.
   *
   * @param {SeccionSociosIC} evento - Datos del nuevo miembro de la empresa.
   */
  eventoActualizarMiembro(evento: SeccionSociosIC): void {
    this.listaSeccionSociosIC = [...this.listaSeccionSociosIC, evento];
    this.solicitud32607Store.actualizarListaSeccionSociosIC(
      this.listaSeccionSociosIC
    );
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal('Datos guardados correctamente.');
    this.pedimentos.push(PEDIMENTO);
  }

  /**
   * Muestra una notificación en forma de modal con el mensaje proporcionado.
   * También almacena el índice de un elemento que se desea eliminar.
   *
   * @param {string} mensaje - El mensaje a mostrar en el modal.
   * @param {number} [i=0] - El índice del elemento a eliminar (opcional, por defecto 0).
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Agrega un nuevo subcontratado a la lista y actualiza el estado global en el store.
   *
   * @param {NumeroDeEmpleados} evento - Datos del subcontratado a agregar.
   */
  seccionSubcontratados(evento: NumeroDeEmpleados): void {
    this.numeroDeEmpleadosLista = [...this.numeroDeEmpleadosLista, evento];
    this.solicitud32607Store.actualizarNumeroDeEmpleadosLista(
      this.numeroDeEmpleadosLista
    );
  }

  /**
   * Agrega una nueva instalación principal a la lista y actualiza el store.
   * También agrega un objeto pedimento por defecto y muestra un mensaje de éxito.
   *
   * @param {Domicilios} evento - Datos de la instalación principal a agregar.
   */
  instalacionesPrincipales(evento: Domicilios): void {
    this.domiciliosDatos = [...this.domiciliosDatos, evento];
    this.solicitud32607Store.actualizarDomiciliosDatos(this.domiciliosDatos);
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal('Datos guardados correctamente.');
    this.pedimentos.push(PEDIMENTO);
  }
  /**
   * Actualiza el valor del catálogo seleccionado en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo seleccionado.
   */
  actualizarCatseleccionados(valor: Catalogo): void {
    this.solicitud32607Store.actualizarCatseleccionados(valor.id);
  }

  /**
   * Actualiza el servicio seleccionado en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al servicio.
   */
  actualizarServicio(valor: Catalogo): void {
    this.solicitud32607Store.actualizarServicio(valor.id);
  }

  /**
   * Actualiza el campo '190' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 190.
   */
  actualizar190(valor: string | number): void {
    this.solicitud32607Store.actualizar190(valor);
    if (valor === 2) {
      this.notificacionDeAlerta();
    }
  }

  /**
   * Actualiza el campo '191' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 191.
   */
  actualizar191(valor: string | number): void {
    this.solicitud32607Store.actualizar191(valor);
  }

  /**
   * Actualiza el campo '199' en el estado global.
   *
   * @param {string | number} valor - Valor numérico o de texto para el campo 199.
   */
  actualizar199(valor: string | number): void {
    this.solicitud32607Store.actualizar199(valor);
    if (valor === 1) {
      this.elimss = true;
    } else {
      this.elimss = false;
    }
  }

  /**
   * Actualiza el número de empleados ingresado.
   *
   * @param {Event} valor - Evento de entrada del usuario.
   */
  actualizarEmpleados(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarEmpleados(VALOR);
  }

  /**
   * Actualiza el valor del bimestre seleccionado en el estado global.
   *
   * @param {Catalogo} valor - Elemento del catálogo correspondiente al bimestre.
   */
  actualizarBimestre(valor: Catalogo): void {
    this.solicitud32607Store.actualizarBimestre(valor.id);
  }

  /**
   * Actualiza el campo '2034' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 2034.
   */
  actualizar2034(valor: string | number): void {
    this.solicitud32607Store.actualizar2034(valor);
  }

  /**
   * Actualiza el campo '236' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 236.
   */
  actualizar236(valor: string | number): void {
    this.solicitud32607Store.actualizar236(valor);
  }

  /**
   * Actualiza el campo '237' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 237.
   */
  actualizar237(valor: string | number): void {
    this.solicitud32607Store.actualizar237(valor);
    if (valor === 1) {
      this.especializadas = true;
    } else {
      this.especializadas = false;
    }
  }

  /**
   * Actualiza el campo '239' y, si el valor es 1, agrega un pedimento y muestra una advertencia.
   *
   * @param {string | number} valor - Valor para el campo 239.
   */
  actualizar239(valor: string | number): void {
    this.solicitud32607Store.actualizar239(valor);
    if (valor === 1) {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal(
        'Es un requisito obligatorio para acceder a Registro en el Esquema de Certificacion de Empresas, de conformidad con la regla 7.1.1. de las RGCE.'
      );
      this.pedimentos.push(PEDIMENTO);
    }
  }

  /**
   * Actualiza el campo '240' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 240.
   */
  actualizar240(valor: string | number): void {
    this.solicitud32607Store.actualizar240(valor);
  }

  /**
   * Actualiza el campo '241' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 240.
   */
  actualizar241(valor: string | number): void {
    this.solicitud32607Store.actualizar241(valor);
  }

  /**
   * Actualiza el campo '243' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 243.
   */
  actualizar243(valor: string | number): void {
    this.solicitud32607Store.actualizar243(valor);
  }

  /**
   * Actualiza el campo '244' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 244.
   */
  actualizar244(valor: string | number): void {
    this.solicitud32607Store.actualizar244(valor);
  }

  /**
   * Actualiza el campo '245' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 245.
   */
  actualizar245(valor: string | number): void {
    this.solicitud32607Store.actualizar245(valor);
  }

  /**
   * Actualiza el campo '246' en el estado global.
   *
   * @param {string | number} valor - Valor para el campo 246.
   */
  actualizar246(valor: string | number): void {
    this.solicitud32607Store.actualizar246(valor);
  }

  /**
   * Actualiza el valor del archivo 1 desde un input file.
   *
   * @param {Event} valor - Evento de cambio del input.
   */
  actualizarFile1(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarFile1(VALOR);
  }

  /**
   * Actualiza el valor del archivo 2 desde un input file.
   *
   * @param {Event} valor - Evento de cambio del input.
   */
  actualizarFile2(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarFile2(VALOR);
  }

  /**
   * Actualiza el campo '247' en el estado global.
   */
  actualizar247(valor: string | number): void {
    this.solicitud32607Store.actualizar247(valor);
  }

  /**
   * Actualiza el campo '248' en el estado global.
   */
  actualizar248(valor: string | number): void {
    this.solicitud32607Store.actualizar248(valor);
  }

  /**
   * Actualiza el valor del campo de identificación.
   */
  actualizarIdentificacion(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarIdentificacion(VALOR);
  }

  /**
   * Actualiza el valor del lugar de radicación.
   */
  actualizarLugarDeRadicacion(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarLugarDeRadicacion(VALOR);
  }

  /**
   * Actualiza el campo '249' en el estado global.
   */
  actualizar249(valor: string | number): void {
    this.solicitud32607Store.actualizar249(valor);
  }

  /**
   * Actualiza el campo '250' en el estado global.
   */
  actualizar250(valor: string | number): void {
    this.solicitud32607Store.actualizar250(valor);
  }

  /**
   * Actualiza el campo '251' en el estado global.
   */
  actualizar251(valor: string | number): void {
    this.solicitud32607Store.actualizar251(valor);
  }

  /**
   * Actualiza el valor del checkbox 1.
   */
  actualizarCheckbox1(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).checked;
    this.solicitud32607Store.actualizarCheckbox1(VALOR);
  }

  /**
   * Actualiza el valor del checkbox 2.
   */
  actualizarCheckbox2(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).checked;
    this.solicitud32607Store.actualizarCheckbox2(VALOR);
  }

  /**
   * Actualiza el valor del checkbox 3.
   */
  actualizarCheckbox3(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).checked;
    this.solicitud32607Store.actualizarCheckbox3(VALOR);
  }

  /**
   * Actualiza el campo 'Actualmente2' en el estado global.
   */
  actualizarActualmente2(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarActualmente2(VALOR);
  }

  /**
   * Actualiza el campo 'Actualmente1' en el estado global.
   */
  actualizarActualmente1(valor: Event): void {
    const VALOR = (valor.target as HTMLInputElement).value;
    this.solicitud32607Store.actualizarActualmente1(VALOR);
  }

  /**
   * Guarda la selección de inventarios hecha por el usuario.
   */
  seleccionarInventariosDatos(evento: Inventarios[]): void {
    this.seleccionarInventarios = evento;
  }

  /**
   * Elimina los inventarios seleccionados de la lista.
   */
  eliminarInventariosDatos(): void {
    if (this.seleccionarInventarios.length > 0) {
      this.seleccionarInventarios.forEach((elemento) => {
        const INDICE = this.inventariosDatos.findIndex(
          (inv) => inv.nombre === elemento.nombre
        );
        if (INDICE !== -1) {
          this.inventariosDatos.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Guarda la selección de socios hecha por el usuario.
   */
  seleccionarlistaSeccionSociosIC(evento: SeccionSociosIC[]): void {
    this.seleccionarListaSeccionSociosIC = evento;
  }

  /**
   * Elimina los socios seleccionados de la lista.
   */
  eliminarlistaSeccionSociosIC(): void {
    if (this.seleccionarListaSeccionSociosIC.length > 0) {
      this.seleccionarListaSeccionSociosIC.forEach((elemento) => {
        const INDICE = this.listaSeccionSociosIC.findIndex(
          (inv) => inv.nombre === elemento.nombre
        );
        if (INDICE !== -1) {
          this.listaSeccionSociosIC.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Guarda la selección de domicilios hecha por el usuario.
   */
  seleccionarDomiciliosDato(evento: Domicilios[]): void {
    this.seleccionarDomiciliosDatos = evento;
  }

  /**
   * Elimina los domicilios seleccionados de la lista.
   */
  eliminarDomiciliosDatos(): void {
    if (this.seleccionarDomiciliosDatos.length > 0) {
      this.seleccionarDomiciliosDatos.forEach((elemento) => {
        const INDICE = this.domiciliosDatos.findIndex(
          (inv) => inv.tipoInstalacion === elemento.tipoInstalacion
        );
        if (INDICE !== -1) {
          this.domiciliosDatos.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Guarda la selección de número de empleados hecha por el usuario.
   */
  seleccionarNumeroDeEmpleadosDato(evento: NumeroDeEmpleados[]): void {
    this.seleccionarNumeroDeEmpleadosLista = evento;
  }

  /**
   * Elimina los registros de número de empleados seleccionados.
   */
  eliminarNumeroDeEmpleadosDato(): void {
    if (this.seleccionarNumeroDeEmpleadosLista.length > 0) {
      this.seleccionarNumeroDeEmpleadosLista.forEach((elemento) => {
        const INDICE = this.numeroDeEmpleadosLista.findIndex(
          (inv) => inv.numeroDeEmpleados === elemento.numeroDeEmpleados
        );
        if (INDICE !== -1) {
          this.numeroDeEmpleadosLista.splice(INDICE, 1);
        }
      });
    }
  }

  /**
   * Agrega un nuevo control de inventario a la lista `inventariosDatos` si los campos obligatorios están completos.
   *
   * Si no se capturan `nombre` o `lugarRadicacion`, se muestra un mensaje de advertencia
   * mediante el método `abrirModal` y se agrega un objeto `PEDIMENTO` por evaluar.
   *
   * @returns {void}
   */
  agregarControlInventarios(): void {
    const NOMBRE = this.datosComunesForm.get('identificacion')?.value;
    const LUGARRADICACION =
      this.datosComunesForm.get('lugarDeRadicacion')?.value;
    const ANEXO24 = this.datosComunesForm.get('checkbox3')?.value;

    if (NOMBRE && LUGARRADICACION) {
      this.inventariosDatos.push({
        nombre: NOMBRE,
        lugarRadicacion: LUGARRADICACION,
        anexo24: ANEXO24,
      });
    } else {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal(
        'Debe capturar todos los datos marcados como obligatorios.'
      );
      this.pedimentos.push(PEDIMENTO);
    }
  }

  /**
   * Abre el modal para modificar el inventario seleccionado.
   *
   * Si hay elementos seleccionados en `seleccionarInventarios`, se muestra el modal correspondiente
   * utilizando la instancia de Bootstrap Modal.
   *
   * Si no hay elementos seleccionados, se muestra un mensaje de advertencia mediante el método `abrirModal`
   * y se agrega un objeto `PEDIMENTO` por evaluar a la lista `pedimentos`.
   *
   * @returns {void}
   */
  modificarInventario(): void {
    if (this.seleccionarInventarios.length > 0) {
      if (this.modalElement) {
        const MODAL_INSTANCE = new Modal(
          this.modalModificarInventarioElement.nativeElement
        );
        MODAL_INSTANCE.show();
      }
    } else {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal(
        'Debe capturar todos los datos marcados como obligatorios.'
      );
      this.pedimentos.push(PEDIMENTO);
    }
  }

  /**
   * Muestra una notificación de alerta indicando un requisito obligatorio para el registro en el Esquema de Certificación de Empresas.
   *
   * También agrega un objeto `PEDIMENTO` con valores predeterminados a la lista `pedimentos`, indicando que está pendiente de evaluación.
   *
   * @returns {void}
   */
  notificacionDeAlerta(): void {
    const PEDIMENTO = {
      patente: 0,
      pedimento: 0,
      aduana: 0,
      idTipoPedimento: 0,
      descTipoPedimento: 'Por evaluar',
      numero: '',
      comprobanteValor: '',
      pedimentoValidado: false,
    };
    this.abrirModal(
      'Es un requisito obligatorio para acceder al Registro en el Esquema de Certificación de Empresas, de conformidad con la regla 7.1.1. de las RGCE.'
    );
    this.pedimentos.push(PEDIMENTO);
  }

  /**
   * Elimina un pedimento de la lista `pedimentos` si el parámetro `borrar` es verdadero.
   *
   * Utiliza el índice almacenado en `elementoParaEliminar` para eliminar el pedimento correspondiente.
   *
   * @param borrar - Indica si se debe proceder con la eliminación del pedimento.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Limpia y completa la señal de destrucción para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
