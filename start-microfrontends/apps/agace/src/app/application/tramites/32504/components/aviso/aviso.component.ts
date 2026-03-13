import {
  BotonAccionesTipos,
  Catalogo,
  ConfiguracionColumna,
  ConsultaioState,
  Notificacion,
  NotificacionesComponent,
  SoloNumerosDirective,
  esControlValido,
} from '@ng-mf/data-access-user';
import {
  CatalogoSelectComponent,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DOMICILIO_AVISO, TIPO_MANUAL } from '../../constants/aviso.enum';
import { CargaMasivaComponent } from '../carga-masiva/carga-masiva.component';
import { CatalogoT32504Service } from '../../services/catalogo-t32504.service';
import { CatalogosService } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosDomicilioLugar } from '../../models/aviso.model';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputTypes } from '@ng-mf/data-access-user';
import { ManualAvisoComponent } from '../manual-aviso/manual-aviso.component';
import { Modal } from 'bootstrap';
import { OnInit } from '@angular/core';
import { OpcionesDeRadio } from '../../../32501/models/aviso-catalogo.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Tramite32504Query } from '../../estados/tramite32504.query';
import { Tramite32504Store } from '../../estados/tramite32504.store';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * @component
 * @name AvisoComponent
 * @description Componente principal para la gestión del aviso en el trámite 32504. Permite capturar, mostrar y modificar los datos de la empresa, tipo de carga y datos manuales, así como gestionar la visualización y edición de una tabla dinámica de destinatarios.
 *
 * @property {InputConfig[]} configuracion - Configuración de los grupos y campos del formulario dinámico.
 * @property {FormularioDinamico[]} fiscal - Arreglo para la gestión de formularios dinámicos fiscales.
 * @property {FormGroup} formulario - Formulario reactivo principal del componente.
 * @property {Object} tableData - Configuración y datos de la tabla dinámica de destinatarios.
 * @property {boolean} esManualAsivoAgregarClicked - Indica si se ha hecho clic en el botón para agregar manualmente un aviso.
 * @property {typeof BotonAccionesTipos} botonAccionesTipos - Enumeración de los tipos de acciones de los botones.
 * @property {typeof TablaSeleccion} TablaSeleccion - Enumeración para la selección de filas en la tabla.
 * @property {any} evento - Objeto para almacenar eventos de interacción.
 * @property {typeof InputTypes} inputTypes - Enumeración de los tipos de input disponibles.
 * @property {Object} cargaTipo - Tipos de carga disponibles (manual o masiva).
 * @property {boolean} esFormularioSoloLectura - Indica si el formulario está en modo solo lectura.
 * @property {Subject<void>} destroyNotifier$ - Notificador para destruir suscripciones activas y evitar fugas de memoria.
 *
 **/
@Component({
  selector: 'app-aviso',
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    InputRadioComponent,
    ManualAvisoComponent,
    CargaMasivaComponent,
    TablaDinamicaComponent,
    NotificacionesComponent,
    SoloNumerosDirective,
  ],
  providers: [],
  standalone: true,
})
export class AvisoComponent implements OnInit {
  /**
   * Referencia al componente ManualAvisoComponent para acceder a sus métodos y propiedades.
   * @property {ManualAvisoComponent} manualAvisoComponent
   */
  @ViewChild('manualAviso') manualAvisoComponent!: ManualAvisoComponent;

  /**
   * Texto para mostrar en la alerta.
   * @property {string} textos
   */
  public textos: string = '';

  /**
   * Mensaje HTML que se muestra cuando las fechas no pertenecen al mismo periodo.
   */
  PERIODO_ERROR = `<p style="text-align: center;">Debe capturar fechas del mismo periodo.</p>`;

  /** Mensaje de validación para campos obligatorios. */
  mensajeCampoObligatorio: string = `<div class="text-danger">
          <small>Este campo es obligatorio</small>
        </div>`;

  /**
   * Clase CSS o identificador para el tipo de alerta a mostrar.
   */
  public infoAlerta: string = 'alert-danger';

  /**
   * Lista de domicilios asociados al aviso.
   */
  avisoDomicilios: DatosDomicilioLugar[] = [];

  /** Lista de elementos seleccionados en la tabla */
  itemsSeleccionados: Set<number> = new Set();

  /**
   * Configuración de columnas para la tabla de mercancías
   */
  avisosDomicilioConfig: ConfiguracionColumna<DatosDomicilioLugar>[] =
    DOMICILIO_AVISO;

  /**
   * Referencia al elemento del DOM del modal para  agregar mercancías.
   */
  @ViewChild('modalAgregarManual') modalElement!: ElementRef;

  /**
   * Muestra el modal para agregar una operación de importación.
   * Se utiliza el componente de Bootstrap Modal con una referencia al elemento del DOM.
   */
  abrirModalDomicilios(): void {
    const MODAL = new Modal(this.modalElement.nativeElement, {
      backdrop: 'static',
      keyboard: false,
    });
    MODAL.show();
  }

  /**
   * Cierra el modal de agregar/editar domicilios y limpia la selección actual en la tabla.
   */
  cerrarModal(): void {
    const MODAL = Modal.getInstance(this.modalElement.nativeElement);
    MODAL?.hide();
    this.tablaDinamica.clearSelection();
  }

  /**
   * Cierra el modal de agregar/editar y limpia selección y edición actual.
   */

  /**
   * Formulario principal del componente que agrupa los controles del aviso.
   */
  formulario!: FormGroup;

  /**
   * Enumeración de acciones usadas por los botones del header.
   */
  botonAccionesTipos = BotonAccionesTipos;

  /**
   * Modo de selección para la tabla dinámica.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Contenedor genérico para eventos o datos temporales.
   */
  evento = {};

  /**
   * Enumeración de tipos de input para formularios.
   */
  inputTypes = InputTypes;
  /**
   * Indica si el formulario está en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Propiedad para almacenar la fila seleccionada en la tabla.
   */
  filaSeleccionada: unknown = null;

  /**
   * @private
   * @description
   * Notificador utilizado para destruir las suscripciones activas cuando el componente se destruye,
   * evitando así fugas de memoria.
   *
   * @type {Subject<void>}
   * @memberof AvisoComponent
   */
  private destroyNotifier$: Subject<void> = new Subject();

  cargaManualValor: string = TIPO_MANUAL;

  /**
   * Indica si la acción de borrar registros está habilitada.
   */
  borrarHabilitado: boolean = false;

  /**
   * Indica si se debe mostrar el popup de selección de registro.
   * Valor booleano utilizado para controlar la visibilidad del componente emergente.
   */
  public mostrarPopupSeleccionRegistro = false;

  /**
   * Mensaje que se muestra en el popup cuando no se ha seleccionado un registro.
   * Se utiliza para informar al usuario antes de modificar datos.
   */
  public mensajePopupSeleccionRegistro =
    'Debe seleccionar un registro para modificar sus datos';

  /**
   * Indica si se debe mostrar el popup de confirmación de registro agregado.
   */
  public mostrarPopupRegistroAgregado = false;
  /**
   * Almacena el estado actual de la consulta relacionada con el trámite.
   * Contiene información necesaria para mostrar o procesar datos en el componente.
   */
  public consultaState!: ConsultaioState;
  RADIOS: OpcionesDeRadio[] = [
    {
      label: 'Manual',
      value: 'TIPCAR.MA',
    },
    {
      label: 'Carga masiva',
      value: 'TIPCAR.CM',
    },
  ];

  /**
   * Indica si se debe mostrar la vista de ingreso manual.
   */
  mostrarManual: boolean = true;

  /**
   * Formulario para los datos de la empresa (tipo de carga, periodo, etc.).
   */
  formEmpresa!: FormGroup;

  /**
   * Catálogo de meses para selección.
   */
  mesesCatalogo: Catalogo[] = [];

  /**
   * Catálogo de años para selección.
   */
  anioCatalogo: Catalogo[] = [];

  /**
   * Domicilio que se encuentra en edición; `null` cuando es nuevo.
   */
  domicilioAModificar: DatosDomicilioLugar | null | undefined = null;

  /**
   * Índices de filas seleccionadas en la tabla.
   */
  filasSeleccionadas: number[] = [];

  /**
   * Indica si se debe mostrar una notificación de información.
   */
  mostrarInfo: boolean = false;

  /**
   * Indica si se debe mostrar una alerta simple.
   */
  mostrarAlertaSimple: boolean = false;

  /**
   * Notificación para mostrar información específica.
   * @property {Notificacion} nuevaNotificacionInfo
   */
  public nuevaNotificacionInfo!: Notificacion;

  /**
   * Referencia al componente de tabla dinámica para domicilios del aviso.
   * @property {TablaDinamicaComponent<DatosDomicilioLugar>} tablaDinamica
   */
  @ViewChild(TablaDinamicaComponent)
  tablaDinamica!: TablaDinamicaComponent<DatosDomicilioLugar>;

  @ViewChild(CargaMasivaComponent)
  cargaMasivaComponent!: CargaMasivaComponent;

  /**
   * @constructor
   * @description Inicializa el componente, inyecta los servicios necesarios y crea el formulario principal.
   * @param {FormBuilder} fb - Servicio para la creación de formularios reactivos.
   * @param {CatalogosService} catalogosServicios - Servicio para obtener catálogos.
   * @param {Tramite32504Store} store - Store para la gestión del estado del trámite.
   * @param {AvisoDatosService} avisoDatosService - Servicio para obtener datos del aviso.
   * @param {ConsultaioQuery} consultaQuery - Query para consultar el estado de consulta.
   * @param {Tramite32504Query} query - Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private catalogosServicios: CatalogosService,
    private store: Tramite32504Store,
    private consultaQuery: ConsultaioQuery,
    private query: Tramite32504Query,
    private catalogoService: CatalogoT32504Service
  ) {}

  /**
   * * @method ngOnInit
   * @description Inicializa los grupos del formulario y suscribe el estado de solo lectura para habilitar o deshabilitar el formulario según corresponda.
   * */
  ngOnInit(): void {
    this.crearFormEmpresa();
    this.obtenerMesAviso();
    this.obtenerAnioAviso();
    this.obtenerEstadoSolicitud();
  }

  /**
   * @method obtenerEstadoSolicitud
   * @description Obtiene el estado actual de la solicitud desde el store y actualiza el formulario y los domicilios del aviso en consecuencia.
   *
   */
  obtenerEstadoSolicitud(): void {
    this.query.selectformulario$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        this.formEmpresa.patchValue(estado.datosEmpresa, { emitEvent: false });
        this.avisoDomicilios = estado.direcciones || [];
      });
  }

  /**
   * @method crearFormEmpresa
   * @description Crea el formulario para los datos de la empresa con los controles necesarios y sus validadores.
   */
  crearFormEmpresa(): void {
    this.formEmpresa = this.fb.group({
      tipo_carga: [TIPO_MANUAL, Validators.required],
      numero_programa_immex: ['', Validators.required],
      clave_permiso_sedena: ['', Validators.required],
      ide_generica2: ['', Validators.required],
      ide_generica3: ['', Validators.required],
    });
  }

  /**
   * @method obtenerMesAviso
   * @description Obtiene el catálogo de meses desde el servicio y lo asigna a la propiedad correspondiente.
   */
  obtenerMesAviso(): void {
    this.catalogoService
      .obtenerMeses()
      .pipe(
        map((response) => response.datos),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((meses) => {
        this.mesesCatalogo = meses || [];
      });
  }

  /**
   * Maneja la selección de filas desde la tabla dinámica (checkbox selection)
   */
  onFilasSeleccionadas(filasSeleccionadas: DatosDomicilioLugar): void {
    this.itemsSeleccionados.clear();
    if (filasSeleccionadas) {
      this.itemsSeleccionados.add(filasSeleccionadas.idTemporal ?? 0);
      this.domicilioAModificar = filasSeleccionadas;
    }
  }

  /**
   * Pregunta al usuario si desea borrar el domicilio seleccionado.
   * @returns nada
   */
  preguntarBorrarDomicilio(): void {
    if (this.itemsSeleccionados.size === 0) {
      return;
    }
    this.mostrarInfo = true;
    this.nuevaNotificacionInfo = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: '¿Desea eliminar el registro seleccionado?',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
  }

  /**
   * Borra los domicilios seleccionados en la tabla dinámica.
   * @returns
   */
  borrarDomicilio(): void {
    // Convertir a array y ordenar de mayor a menor para eliminar correctamente
    const INDICES_A_ELIMINAR = Array.from(this.itemsSeleccionados).sort(
      (a, b) => b - a
    );

    // Limpiar selecciones y actualizar tabla
    this.itemsSeleccionados.clear();
    this.borrarHabilitado = false;
    this.avisoDomicilios = [
      ...this.avisoDomicilios.filter(
        (d) => d.idTemporal && !INDICES_A_ELIMINAR.includes(d.idTemporal)
      ),
    ];
    this.store.setDirecciones(this.avisoDomicilios);
    this.tablaDinamica.clearSelection();
    this.mostrarNotificacion('El registro fue eliminado correctamente.');
  }

  /**
   * @method obtenerAnioAviso
   * @description Obtiene el catálogo de años desde el servicio y lo asigna a la propiedad correspondiente.
   */
  obtenerAnioAviso(): void {
    this.catalogoService
      .obtenerAnios()
      .pipe(
        map((response) => response.datos),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((anios) => {
        this.anioCatalogo = anios || [];
      });
  }

  /**
   * @method onRadioChange
   * @description Maneja el cambio en la selección del tipo de carga (manual o masiva) y actualiza la vista en consecuencia.
   */
  onRadioChange(): void {
    this.setValoresStore();
  }

  /**
   * La función maneja las acciones del botón.
   * @param accione - Parámetro que tiene la acción de ser del tipo BotonAccionesTipos.
   */
  accionesBotones(accione: BotonAccionesTipos): void {
    switch (accione) {
      case BotonAccionesTipos.AGREGAR:
        this.domicilioAModificar = null;
        this.abrirModalDomicilios();
        break;
      case BotonAccionesTipos.ELIMINAR:
        this.preguntarBorrarDomicilio();
        break;
      case BotonAccionesTipos.MODIFICAR: {
        if (this.itemsSeleccionados.size > 0) {
          this.manualAvisoComponent.domicilioInput = this.domicilioAModificar;
          this.abrirModalDomicilios();
        }
        break;
      }

      default:
        break;
    }
  }

  /**
   * Devuelve la fila seleccionada si existe, de lo contrario retorna null.
   * Utilizado para obtener el registro actualmente seleccionado por el usuario.
   */
  obtenerFilaSeleccionada(): unknown {
    return this.filaSeleccionada ? this.filaSeleccionada : null;
  }

  /**
   * Agrega una nueva fila a la tabla.
   * La fila se añade al final del arreglo de datos existente.
   */
  agregarFilaTabla(): void {
    this.itemsSeleccionados.clear();
    this.borrarHabilitado = false;
    this.cerrarModal();
    this.mostrarNotificacion('El registro fue agregado correctamente.');
  }

  /**
   *  @method onSubmit
   * @description Envía los datos del formulario al store para su almacenamiento.
   * @returns {void}
   */
  onSubmit(): void {
    this.store.setDatosEmpresa(this.formulario.value.datosEmpresa);
    this.store.setCargaTipo(this.formulario.value.cargaTipo);
  }

  /**
   * Valida si un campo específico dentro de un grupo de formularios es válido.
   * @method esCampoValido
   * @param nombreCampo nombre del campo a validar
   * @param nombreGrupo nombre del grupo al que pertenece el campo
   * @returns true si el campo es válido, false si no lo es, o null si el campo no existe
   */
  campoInvalido(nombreCampo: string): boolean | undefined {
    return esControlValido(this.formEmpresa, nombreCampo);
  }

  /**
   * Maneja la acción de aceptar en la información mostrada.
   * @param event Evento que indica si se aceptó la acción.
   */
  aceptarInfo(event: boolean): void {
    if (event) {
      this.mostrarInfo = false;
      this.borrarDomicilio();
    } else {
      this.mostrarInfo = false;
    }
  }

  /**
   * Valida el formulario de datos de la empresa.
   * @returns `true` si el formulario es válido, de lo contrario marca los controles como tocados y devuelve `false`.
   */
  validarFormulario(): boolean {
    if (!this.formEmpresa || this.formEmpresa.invalid) {
      this.formEmpresa.markAllAsTouched();
      return false;
    }
    if (
      this.formEmpresa.get('tipo_carga')?.value !== this.cargaManualValor &&
      !this.cargaMasivaComponent.archivoMasivo
    ) {
      this.mostrarNotificacion(
        'No se puede continuar, favor de cargar plantilla y/o esperar el correo de notificación'
      );
      return false;
    }
    return this.formEmpresa.valid;
  }

  /**
   * Valida si la tabla de domicilios tiene al menos un registro.
   * @returns 'true' si la tabla tiene registros, 'false' en caso contrario.
   */
  validarTabla(): boolean {
    return this.avisoDomicilios.length > 0;
  }

  /**
   * @description Actualiza los datos almacenados en el store.
   * @method setValoresStore
   * @param {FormGroup} form - El formulario a obtener los valores.
   * @param {string} campo - El nombre del campo del formulario a obtener.
   */
  setValoresStore(): void {
    const VALOR = this.formEmpresa.value;
    this.store.setDatosEmpresa(VALOR);
  }

  /**
   * Cierra la alerta modal.
   * @method aceptar
   */
  aceptarAlerta(): void {
    this.mostrarAlertaSimple = false;
  }

  /**
   * Metodo para mostrar una notificación simple.
   * @param mensaje el mensaje a mostrar en la notificación.
   */
  mostrarNotificacion(mensaje: string): void {
    this.mostrarInfo = false;
    this.mostrarAlertaSimple = true;
    this.nuevaNotificacionInfo = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 800,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
}
