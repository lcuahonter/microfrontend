import { CATALOGOS, ERROR_FORMA_ALERT, VALIDO, } from '../../constantes/elegibilidad-de-textiles.enums';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, delay, map, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

import {
  CatalogosSelect,
  ConfiguracionColumna,
  InputCheckComponent,
  Notificacion,
  NotificacionesComponent,
  REGEX_RFC,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
} from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component';
import radioOptionsData from '@libs/shared/theme/assets/json/120301/tipos-de-fabricante-exportador.json';
import radioOptionsNacional from '@libs/shared/theme/assets/json/120301/tipo-fabricantes-nacional.json';
import unidadRadioFields from '@libs/shared/theme/assets/json/220401/unidad.json';

import { ElegibilidadDeTextilesStore, TextilesState } from '../../estados/elegibilidad-de-textiles.store';
import { ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import {
  Solicitud120301State,
  Tramite120301Store,
} from '../../estados/tramites/tramite120301.store';
import { CodigoRespuesta } from '../../../../core/enum/se-core-enum';
import { DetalleEvaluaconSolicitudService } from '../../services/detalleEvaluaconSolicitud.service';
import { ElegibilidadDeTextilesQuery } from '../../queries/elegibilidad-de-textiles.query';
import { ElegibilidadTextilesService } from '../../services/elegibilidad-textiles/elegibilidad-textiles.service';
import { FabricanteNacionalRfcResponse } from '../../models/response/fabricante-nacional-response.model';
import { FabricanteResponse } from '../../models/response/fabricantes-response.model';
import { HistoricoColumns } from '../../models/elegibilidad-de-textiles.model';
import { HistoricoFabricantesService } from '../../services/historicoFabricantes.service';


/**
 * @component HistoricoFabricantesComponent
 * @description
 * Componente responsable de manejar el historial de fabricantes en el trámite de elegibilidad de textiles.
 * Permite capturar, mostrar y gestionar fabricantes nacionales mediante formularios y tablas dinámicas.
 * Gestiona el estado de validez del formulario y la sincronización con el store de la aplicación.
 *
 * @example
 * <app-historico-fabricantes [formularioDeshabilitado]="true"></app-historico-fabricantes>
 *
 * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
 * @property {FormGroup} historicoFabricantesForm - Formulario reactivo para capturar datos de fabricantes.
 * @property {any[]} radioOptions - Opciones de radio para el formulario.
 * @property {string | number} valorSeleccionado - Valor seleccionado del radio.
 * @property {string | number} defaultSelect - Valor por defecto del select.
 * @property {any[]} radioBoton - Opciones de radio para el formulario.
 * @property {TablaSeleccion} TablaSeleccion - Configuración para la selección de tablas.
 * @property {ConfiguracionColumna<HistoricoColumns>[]} tableColumns - Columnas de la tabla de fabricantes nacionales.
 * @property {HistoricoColumns[]} fabricantesNacionales - Datos de fabricantes nacionales.
 * @property {CatalogosSelect[]} dropdownConfigs - Configuraciones de los dropdowns.
 *
 * @method ngOnInit Inicializa el componente y obtiene los datos de los fabricantes.
 * @method ngOnDestroy Limpia las suscripciones al destruir el componente.
 * @method initActionFormBuild Inicializa el formulario reactivo.
 * @method recuperarDatos Obtiene los datos de fabricantes nacionales.
 * @method alValorCambiar Maneja el cambio de valor del radio.
 * @method setValoresStore Establece valores en el store de textiles.
 *
 * @see ElegibilidadDeTextilesStore
 * @see ElegibilidadDeTextilesQuery
 * @see SeccionLibStore
 * @see SeccionLibQuery
 * @see ElegibilidadTextilesService
 */
@Component({
  selector: 'app-historico-fabricantes',
  templateUrl: './historico-fabricantes.component.html',
  styleUrls: ['./historico-fabricantes.component.scss'],
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    InputRadioComponent,
    InputCheckComponent,
    TablaDinamicaComponent,
    ModalModule,
    NotificacionesComponent,
    ReactiveFormsModule,
  ],
})
export class HistoricoFabricantesComponent implements OnInit, OnDestroy {
  /**
   * @property {string} numeroFolio - Número de folio del trámite.
   */
  @Input()
  numeroFolio: string = '';
  /**
   * Almacena los fabricantes que serán evaluados.
   */
  fabricantesEvaluar: FabricanteResponse[] = [];

  /**
   * Indica si se debe mostrar la evaluación de fabricantes.
   */
  visualizarEvaluacion: boolean = false;

  /**
   * Método para ver detalle de un fabricante (usado en pruebas)
   */
  static verDetalle(_row: unknown): void {
    // Implementación vacía para pruebas
  }
  /**
   * Almacena los fabricantes seleccionados en la tabla de nacionales.
   */
  selectedFabricantesNacionales: HistoricoColumns[] = [];

  /**
   * Maneja el cambio de selección en la tabla de fabricantes nacionales.
   */
  onSeleccionNacionalChange(event: HistoricoColumns[]): void {
    this.selectedFabricantesNacionales = Array.isArray(event) ? event : [];
  }
  /**
   * @method abrirModalEliminar
   * @description Abre el modal de confirmación para eliminar fabricantes asociados.
   */
  abrirModalEliminar(): void {
    if (this.selectedFabricantesNacionales.length === 0) {
      const MODAL_ELEMENT = document.getElementById('confirmarSeleccionar');
      if (MODAL_ELEMENT) {
        const INSTANCIA_MODAL = new window.bootstrap.Modal(MODAL_ELEMENT);
        INSTANCIA_MODAL.show();
      }
      return;
    }
    // Agrega los seleccionados a fabricantesAsociados si no están ya
    this.selectedFabricantesNacionales.forEach(fab => {
      if (!this.fabricantesAsociados.some(a => a.numeroRegistroFiscal === fab.numeroRegistroFiscal)) {
        this.fabricantesAsociados.push(fab);
      }
    });
    this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue(this.fabricantesAsociados);
    // Limpia la selección nacional
    this.selectedFabricantesNacionales = [];
    this.cdr.detectChanges();

    const ELEMENTO_MODAL = document.getElementById('confirmarEliminarFabricante');
    const WIN = window as typeof window & { bootstrap?: { Modal: new (el: HTMLElement) => { show: () => void } } };
    if (ELEMENTO_MODAL && WIN.bootstrap && typeof WIN.bootstrap.Modal === 'function') {
      const INSTANCIA_MODAL = new WIN.bootstrap.Modal(ELEMENTO_MODAL);
      INSTANCIA_MODAL.show();
    }
  }
  /**
   * Indica si el botón de eliminar debe estar habilitado.
   * El botón se habilita si hay al menos un fabricante seleccionado en la tabla de asociados.
   * @returns {boolean} `true` si se puede eliminar, `false` en caso contrario.
   */
  get puedeEliminar(): boolean {
    return this.selectedFabricantes.length > 0;
  }

  /**
   * @method eliminarFabricantesAsociados
   * @description Elimina los fabricantes seleccionados de la lista de asociados.
   */
  eliminarFabricantesAsociados(): void {
    if (this.selectedFabricantes.length === 0) {
      return;
    }
    // Elimina los seleccionados de fabricantesAsociados
    this.fabricantesAsociados = this.fabricantesAsociados.filter(f =>
      !this.selectedFabricantes.some(sel => sel.numeroRegistroFiscal === f.numeroRegistroFiscal)
    );
    this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue(this.fabricantesAsociados);
    // Limpia la selección
    this.selectedFabricantes = [];
    this.cdr.detectChanges();

    // Oculta el modal manualmente para eliminar el backdrop después de actualizar el DOM
    setTimeout(() => {
      const ELEMENTO_MODAL = document.getElementById('confirmarEliminarFabricante');
      const VENTANA = window as typeof window & { bootstrap?: { Modal: new (el: HTMLElement) => { hide: () => void } } };
      if (ELEMENTO_MODAL && VENTANA.bootstrap && typeof VENTANA.bootstrap.Modal === 'function') {
        const INSTANCIA_MODAL = new VENTANA.bootstrap.Modal(ELEMENTO_MODAL);
        INSTANCIA_MODAL.hide();
      }

      const FONDOS_MODAL = document.querySelectorAll('.modal-backdrop');
      FONDOS_MODAL.forEach(fondo => fondo.parentNode?.removeChild(fondo));
    }, 100);
  }
  /**
   * @method asociadasFabricanteNuevo
   * @description Busca el fabricante por numeroRegistroFiscal en el JSON y lo muestra en la tabla fabricantesAsociados.
   */
  asociadasFabricanteNuevo(): void {
    const NUMERO_REGISTRO_FISCAL = this.historicoFabricantesForm.get('numeroRegistroFiscal')?.value;
    if (!NUMERO_REGISTRO_FISCAL) {
      this.fabricantesAsociados = [];
      this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue([]);
      return;
    }
    // Buscar en fabricantesNacionales el registro con el RFC dado
    const ENCONTRO = this.fabricantesNacionales.find(f => f.numeroRegistroFiscal === NUMERO_REGISTRO_FISCAL);
    if (ENCONTRO) {
      this.fabricantesAsociados = [ENCONTRO];
      this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue([ENCONTRO]);
    } else {
      this.fabricantesAsociados = [];
      this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue([]);
    }
  }

  /**
* @method abrirModalAgregar
* @description Abre el modal para agregar fabricante, o muestra error si ya existe uno asociado.
*/
  abrirModalAgregar(): void {
    // Sólo proceder si se selecciona un registro
    if (!this.selectedFabricantesNacionales.length) {
      // Opcionalmente, mostrar una modal o no hacer nada.
      return;
    }
    const SELECCIONADO = this.selectedFabricantesNacionales[0];
    const EXISTE = SELECCIONADO && SELECCIONADO.numeroRegistroFiscal
      ? this.fabricantesAsociados.some(f => f.numeroRegistroFiscal === SELECCIONADO.numeroRegistroFiscal)
      : false;
    if (EXISTE) {
      const MODAL_EXISTENTE = document.getElementById('modalFabricanteExistente');
      if (MODAL_EXISTENTE) {
        const WIN = window as typeof window & { bootstrap: { Modal: new (el: HTMLElement) => { show: () => void } } };
        const INSTANCIA_MODAL = new WIN.bootstrap.Modal(MODAL_EXISTENTE);
        INSTANCIA_MODAL.show();
      }
      return;
    }
    const MODAL_AGREGAR = document.getElementById('modalAgregar');
    if (MODAL_AGREGAR) {
      const WIN = window as typeof window & { bootstrap: { Modal: new (el: HTMLElement) => { show: () => void } } };
      const INSTANCIA_MODAL = new WIN.bootstrap.Modal(MODAL_AGREGAR);
      INSTANCIA_MODAL.show();
    }
  }
  /**
   * @property {boolean} mostrarOpcionNacional
   * @description
   * Bandera que indica si se debe mostrar la opción 'Nacional' en los radio buttons.
   * Se activa cuando el usuario selecciona 'No' en el control de radio, permitiendo mostrar opciones adicionales.
   * Es utilizada para controlar la lógica de visualización dinámica en el formulario.
   */
  mostrarOpcionNacional = false;
  /**
   * @property {Array<{label: string; value: string}>} filteredRadioOptions
   * @description
   * Getter que filtra las opciones de radio según la selección actual.
   * Inicialmente muestra solo la opción 'No', y agrega 'Nacional' cuando se selecciona 'No'.
   * Permite controlar dinámicamente las opciones disponibles en el formulario.
   * @returns {Array<{label: string; value: string}>} Opciones filtradas para el radio button.
   */
  get filteredRadioOptions(): Array<{ label: string; value: string }> {
    if (this.mostrarOpcionNacional) {
      return this.radioOptions;
    }
    return [this.radioOptions[0]];
  }
  /**
   * @property {HistoricoColumns[]} selectedFabricantes
   * @description
   * Almacena los fabricantes seleccionados en la tabla dinámica.
   * Se actualiza cada vez que el usuario selecciona o deselecciona filas en la tabla de fabricantes nacionales.
   * Permite gestionar la selección para acciones posteriores como asociar o eliminar fabricantes.
   */
  selectedFabricantes: HistoricoColumns[] = [];
  fabricantesAsociados: HistoricoColumns[] = [];


  /**
   * @method alSeleccionarClick
   * @description
   * Maneja el evento de clic en el botón 'Seleccionar'.
   * Si no hay fabricantes seleccionados, muestra un modal de confirmación para advertir al usuario.
   * Utiliza Bootstrap Modal para la visualización del mensaje.
   * @returns {void} No retorna ningún valor.
   */
  alSeleccionarClick(): void {
    if (this.selectedFabricantesNacionales.length === 0) {
      const ELEMENTO_MODAL = document.getElementById('confirmarSeleccionar');
      if (ELEMENTO_MODAL) {
        const INSTANCIA_MODAL = new window.bootstrap.Modal(ELEMENTO_MODAL);
        INSTANCIA_MODAL.show();
      }
      return;
    }
    // Agrega los seleccionados a fabricantesAsociados si no están ya
    this.selectedFabricantesNacionales.forEach(fab => {
      if (!this.fabricantesAsociados.some(a => a.numeroRegistroFiscal === fab.numeroRegistroFiscal)) {
        this.fabricantesAsociados.push(fab);
      }
    });
    this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue(this.fabricantesAsociados);
    // Limpia la selección nacional
    this.selectedFabricantesNacionales = [];
    this.cdr.detectChanges();
    // Opcional: cerrar modal si se usó para selección
    const ELEMENTO_MODAL = document.getElementById('confirmarSeleccionar');
    if (ELEMENTO_MODAL) {
      const FONDOS_MODAL = document.querySelectorAll('.modal-backdrop');
      FONDOS_MODAL.forEach(fondo => fondo.parentNode?.removeChild(fondo));
    }
  }
  /**
   * @property {boolean} formularioDeshabilitado - Indica si el formulario está deshabilitado.
   * Propiedad de entrada que controla si todos los controles del formulario deben estar deshabilitados.
   * Cuando es true, impide la edición de cualquier campo del formulario de histórico de fabricantes.
   * Se utiliza para casos donde el formulario debe ser de solo lectura o en estados de visualización.
   */
  /**
   * @property {boolean} formularioDeshabilitado
   * @description
   * Propiedad de entrada que indica si el formulario debe estar deshabilitado.
   * Cuando es true, todos los controles del formulario se muestran en modo solo lectura y no permiten edición.
   * Se utiliza para controlar el estado de edición del formulario en función del contexto del trámite.
   * @input
   * @default false
   */
  @Input()
  formularioDeshabilitado: boolean = false;

  /**
   * @property {FormGroup} historicoFabricantesForm - El grupo de formularios para capturar los datos de los fabricantes.
          alSeleccionarClick(): void {
   * del historial de fabricantes, incluyendo información fiscal, selecciones de tipo de fabricante
   * y datos de fabricantes nacionales. Maneja validaciones y sincronización con el estado global.
   */
  historicoFabricantesForm!: FormGroup;

  /**
 * @property {string} formularioAlertaError
 * @description
 * Mensaje HTML que se muestra cuando el formulario no es válido y faltan campos requeridos por capturar.
 * Se utiliza para mostrar una alerta visual al usuario en la interfaz.
 * Vacío cuando el formulario es válido.
 */
  public formularioAlertaError: string = '';

  /**
   * @property {HistoricoColumns[]} seleccionados
   * Filas seleccionadas para eliminar de la lista
   */
  seleccionados: HistoricoColumns[] = [];

  /**
  * @property {HistoricoColumns[]} seleccionFabricantesNacionales
  * Filas seleccionadas para eliminar de la lista
  */
  seleccionFabricantesNacionales: HistoricoColumns[] = [];

  /**
   * Recuperado de datos del state
   */
  public solicitudState!: Solicitud120301State;

  /**
   * @property {boolean} esFormaValido
   * @description
   * Bandera booleana que indica si el formulario tiene errores de validación.
   * Si es `true`, se muestra el mensaje de error; si es `false`, el formulario es válido y no se muestra la alerta.
   */
  public esFormaValido: boolean = false;

  /**
   * @property {EventEmitter<boolean>} mostrarTabs - Emite un valor booleano para mostrar las pestañas adicionales.
   * EventEmitter que comunica al componente padre cuándo debe mostrar las pestañas de navegación.
   * Se activa cuando el usuario completa exitosamente el proceso de guardado o validación.
   * Permite la coordinación entre componentes para la navegación de la interfaz.
   */
  @Output() mostrarTabs: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**
   * Contiene las configuraciones y opciones disponibles para los controles de radio button
   * relacionados con el tipo de fabricante exportador. Se inicializa con datos estáticos
   * importados desde un archivo JSON externo que define las opciones de selección.
   */
  radioOptions = radioOptionsData;

  /**
   * @property {any[]} radioOptionsNacional - Opciones de radio para el formulario de tipo de fabricante nacional.
   * Contiene las configuraciones y opciones disponibles para los controles de radio button
   * relacionados con el tipo de fabricante nacional. Se inicializa con datos estáticos
   * importados desde un archivo JSON externo que define las opciones de selección.
   */
  radioOptionsNacional = radioOptionsNacional;

  /**
   * @property {CatalogosSelect[]} dropdownConfigs - Configuraciones de los dropdowns.
   * Contiene las configuraciones necesarias para los controles de selección desplegable (dropdowns)
   * utilizados en el formulario. Incluye información sobre las fuentes de datos,
   * etiquetas y valores asociados a cada dropdown.
   */
  isNacional: boolean = false;

  /**
   * @property {boolean} isFabricantes - Indica si se muestran los fabricantes.
   * Controla la visibilidad de la sección de fabricantes en la interfaz.
   */
  isFabricantes: boolean = true;

  /**
   * @property {boolean} isNacionalTabla - Indica si se muestran los fabricantes nacionales en la tabla.
   * Controla la visibilidad de la tabla de fabricantes nacionales en la interfaz.
   * Cuando es true, la tabla se muestra; cuando es false, la tabla está oculta.
   */
  isNacionalTabla: boolean = false;

  /**
   * @property {string | number} selectedValue - Valor seleccionado del radio button.
   * Almacena el valor actualmente seleccionado en los controles de radio button del formulario.
   * Puede ser de tipo string o number dependiendo del tipo de opción seleccionada.
   * Se actualiza cuando el usuario cambia la selección en los controles de radio.
   */
  selectedValue: boolean | number = false;

  /**
   * @property {string | number} selectValueNacional - Valor seleccionado del radio button para fabricantes nacionales.
   * Almacena el valor actualmente seleccionado en los controles de radio button
   * relacionados con los fabricantes nacionales. Puede ser de tipo string o number
   * dependiendo del tipo de opción seleccionada. Se actualiza cuando el usuario
   * cambia la selección en los controles de radio.
   */
  selectValueNacional: string | number = '';

  /**
   * @property {string | number} defaultSelect - Valor por defecto del control de selección.
   * Define el valor inicial que debe mostrarse en los controles de selección cuando
   * el componente se inicializa. Proporciona un estado predeterminado para la interfaz.
   */
  defaultSelect: string | number = '';

  /**
   * @property {any[]} radioBoton - Opciones de radio para el formulario de unidad.
   * Contiene las configuraciones específicas para los controles de radio button
   * relacionados con la selección de unidades. Se inicializa con datos estáticos
   * importados desde un archivo JSON externo que define las opciones de unidad disponibles.
   */
  radioBoton = unidadRadioFields;

  /**
   * @property {TablaSeleccion} TablaSeleccion - Configuración para la selección de tablas.
   * Referencia a la enumeración o constante TablaSeleccion que define las opciones
   * de selección disponibles para las tablas dinámicas en el componente.
   * Se utiliza para configurar el comportamiento de selección en la tabla de fabricantes nacionales.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * @property {ConfiguracionColumna<HistoricoColumns>[]} tableColumns - Configuración de las columnas de la tabla de fabricantes nacionales.
   * Define la estructura, comportamiento y apariencia de cada columna en la tabla de fabricantes nacionales.
   * Cada elemento especifica el encabezado, la función de acceso a los datos (clave),
   * y el orden de visualización. Incluye información sobre nombre del fabricante, número de registro fiscal,
   * dirección, correo electrónico y teléfono de contacto.
   */
  tableColumns: ConfiguracionColumna<HistoricoColumns>[] = [
    {
      encabezado: 'Nombre del fabricante',
      clave: (fila) => fila.nombreFabricante,
      orden: 1,
    },
    {
      encabezado: 'Número de registro fiscal',
      clave: (fila) => fila.numeroRegistroFiscal,
      orden: 2,
    },
    {
      encabezado: 'Dirección',
      clave: (fila) => fila.direccion,
      orden: 3,
    },
    {
      encabezado: 'Correo Electrónico',
      clave: (fila) => fila.correoElectronico,
      orden: 4,
    },
    {
      encabezado: 'Teléfono',
      clave: (fila) => fila.telefono,
      orden: 5,
    },
  ];

  /**
   * @property {HistoricoColumns[]} fabricantesNacionales - Array de datos de fabricantes nacionales.
   * Contiene la información completa de todos los fabricantes nacionales disponibles.
   * Se carga dinámicamente desde el servicio y se actualiza según los criterios de búsqueda.
   * Cada elemento representa un fabricante con todos sus datos asociados como nombre,
   * registro fiscal, dirección, información de contacto y detalles administrativos.
   */
  fabricantesNacionales: HistoricoColumns[] = [];

  /**
   * @property {Subject<void>} destroyNotifier$ - Sujeto para manejar la destrucción de suscripciones.
   * Subject privado utilizado con el operador takeUntil para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido.
   */
  fabricante: HistoricoColumns[] = [];
  fabricanteEvaluacion: HistoricoColumns[] = [];

  /**
   * @property {Subject<void>} destroyNotifier$ - Sujeto para manejar la destrucción de suscripciones.
   * Subject privado utilizado con el operador takeUntil para cancelar automáticamente
   * todas las suscripciones activas cuando el componente es destruido.
   * Implementa el patrón estándar para prevenir fugas de memoria en Angular.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {TextilesState} historicoState - Estado actual del historial de fabricantes.
   * Almacena el estado completo relacionado con el historial de fabricantes en el contexto de elegibilidad de textiles.
   * Se actualiza mediante suscripciones al query correspondiente y contiene
   * toda la información necesaria para el funcionamiento del componente de histórico de fabricantes.
   * @private
   */
  private historicoState!: TextilesState;

  /**
   * @property {SeccionLibState} seccionState - Estado actual de la sección.
   * Mantiene el estado específico de la sección dentro del módulo de librerías.
   * Controla aspectos como la validez de la sección y su estado de activación.
   * Se utiliza para coordinar el estado entre diferentes secciones del trámite.
   * @private
   */
  private seccionState!: SeccionLibState;

  registraNumeroRegistro: boolean = false;
  /**Variable para mostrar el modal */
  public mostrarModal: boolean = false;
  /** Referencia al modal */
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  /** Indica si se debe abrir el modal */
  @Input() abrirModal: boolean = false;
  /** Evento que se emite al cerrar el modal */
  @Output() cerrar = new EventEmitter<void>();
  /**
       * Notificación que se muestra al usuario en caso de error o éxito en el proceso de firma.
       * Incluye información sobre el tipo de notificación, categoría, título y mensaje.
       */
  nuevaNotificacion!: Notificacion;
  /**
   * @property {boolean} eliminarFabricanteModal - Indica si el modal de eliminación de fabricante está abierto.
   */
  eliminarFabricanteModal: boolean = false;
  /**
   * @constructor
   * @description Constructor del componente. Inicializa los servicios necesarios para el funcionamiento del componente.
   * Inyecta todas las dependencias requeridas para el manejo de formularios reactivos,
   * gestión de estado global y local, consultas de datos y servicios específicos del dominio.
   * Establece la base para la comunicación entre el componente y los servicios del sistema
   * relacionados con la gestión del historial de fabricantes en el contexto de elegibilidad de textiles.
   * @param {FormBuilder} fb - Servicio de Angular para la creación y gestión de formularios reactivos.
   * @param {ElegibilidadDeTextilesStore} ElegibilidadDeTextilesStore - Store para manejar el estado global de elegibilidad de textiles.
   * @param {ElegibilidadDeTextilesQuery} ElegibilidadDeTextilesQuery - Query para consultar y suscribirse al estado de elegibilidad de textiles.
   * @param {SeccionLibStore} seccionStore - Store para manejar el estado específico de las secciones del módulo.
   * @param {SeccionLibQuery} seccionQuery - Query para consultar y suscribirse al estado de las secciones.
   * @param {ElegibilidadTextilesService} elegibilidadTextilesService - Servicio de dominio para manejar la lógica de negocio de elegibilidad de textiles.
   * @param {ChangeDetectorRef} cdr - Referencia al ChangeDetectorRef para manejar la detección de cambios.
   */
  constructor(
    private fb: FormBuilder,
    private ElegibilidadDeTextilesStore: ElegibilidadDeTextilesStore,
    private ElegibilidadDeTextilesQuery: ElegibilidadDeTextilesQuery,
    private seccionStore: SeccionLibStore,
    private seccionQuery: SeccionLibQuery,
    private elegibilidadTextilesService: ElegibilidadTextilesService,
    private cdr: ChangeDetectorRef,
    private historicoFabricantesService: HistoricoFabricantesService,
    private tramiteStore: Tramite120301Store,
    private evaluacionSolicitud: DetalleEvaluaconSolicitudService,
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }

  /**
   * @method ngOnInit
   * @description Inicializa el componente y obtiene los datos de los fabricantes.
   * Configura todas las suscripciones necesarias para el manejo del estado del componente,
   * inicializa el formulario reactivo, carga los datos de fabricantes nacionales,
   * establece la validación del formulario y configura el monitoreo de cambios.
   * También maneja el estado de habilitación del formulario basado en las propiedades de entrada
   * y sincroniza el estado de validez con el store global de la aplicación.
   * @returns {void} No retorna ningún valor.
   */
  ngOnInit(): void {
    this.solicitudState = this.tramiteStore.getValue(); // Akita getValue()
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();
    this.ElegibilidadDeTextilesQuery.selectTextile$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.historicoState = state as TextilesState;
        })
      )
      .subscribe();
    this.initActionFormBuild();


    // Asegúrese de que fabricantesAsociados esté en blanco inicialmente
    this.fabricantesAsociados = [];
    this.historicoFabricantesForm.get('fabricantesAsociados')?.setValue([]);

    this.historicoFabricantesForm.statusChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(10),
        tap((_value) => {
          if (this.historicoFabricantesForm.valid) {
            this.ElegibilidadDeTextilesStore.setFormaValida([
              ...this.historicoState.formaValida,
              { id: 3, descripcion: 'TodoValido' },
            ]);
          }
        })
      )
      .subscribe();

    this.seccionStore.establecerFormaValida([false]);

    if (
      this.historicoState.formaValida &&
      this.historicoState.formaValida[0] &&
      this.historicoState.formaValida[0].descripcion === VALIDO
    ) {
      this.seccionStore.establecerSeccion([true]);
      this.seccionStore.establecerFormaValida([true]);
    } else {
      this.seccionStore.establecerFormaValida([false]);
    }
    if (this.formularioDeshabilitado) {
      this.historicoFabricantesForm.disable();
      this.visualizarEvaluacion = true;
      this.isFabricantes = false;
    }
    if (this.numeroFolio) {
      this.consultarInformacionHistorico(this.numeroFolio);
    }

    if (this.historicoState.exportadorFabricanteMismo) {
      this.isNacional = true;
    }
    if (this.historicoState.exportadorFabricanteNacional) {
      const IDSOLICITUD = this.solicitudState.idSolicitud;
      this.isNacionalTabla = true;

      const TIPO_FABRICANTE = this.historicoFabricantesForm.get('exportadorFabricanteNacional')?.value === 'Nacional'
        ? 'NACIONAL'
        : this.historicoFabricantesForm.get('exportadorFabricanteNacional')?.value;

      this.recuperarDatos(TIPO_FABRICANTE, IDSOLICITUD);
    }

    if (this.historicoState.listaFabricantes?.length > 0) {
      this.fabricante = [...this.historicoState.listaFabricantes];
      this.isFabricantes = true;
    }
  }

  /**
   * Obtene
   */
  informacionHistorico!: FabricanteResponse;
  consultarInformacionHistorico(idFolio: string): void {
    this.evaluacionSolicitud.getDatosFabricante(idFolio)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          if (response.codigo === CodigoRespuesta.EXITO) {
            const DATOS = response.datos;
            this.fabricanteEvaluacion = [{
              numeroRegistroFiscal: DATOS?.numero_registro_fiscal ?? '',
              nombreFabricante: DATOS?.nombre_fabricante ?? '',
              direccion: DATOS?.direccion ?? '',
              correoElectronico: DATOS?.correo_electronico ?? '',
              telefono: DATOS?.telefono ?? ''
            }];

          } else {
            console.error('Error en la respuesta del servicio:', response.mensaje);
          }
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        }
      });
  }

  /**
   * @method initActionFormBuild
   * @description Inicializa el formulario reactivo para capturar los datos de los fabricantes.
   * Crea todos los controles del formulario con sus valores iniciales obtenidos del estado actual,
   * aplicando las validaciones necesarias para cada campo. Configura campos para información
   * sobre si el exportador es el mismo fabricante, número de registro fiscal con validaciones
   * de longitud mínima, y selección de fabricantes nacionales disponibles.
   * @returns {void} No retorna ningún valor.
   */
  initActionFormBuild(): void {
    this.historicoFabricantesForm = this.fb.group({
      exportadorFabricanteMismo: [
        this.historicoState.exportadorFabricanteMismo,
      ],
      exportadorFabricanteNacional: [
        this.historicoState.exportadorFabricanteNacional,
      ],
      numeroRegistroFiscal: [
        this.historicoState.numeroRegistroFiscal,
        [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(REGEX_RFC)],
      ],
      fabricantesNacionales: [[]],
      fabricantesAsociados: [[]],
    });
  }

  /**
   * @method recuperarDatos
   * @description Obtiene los datos de los fabricantes desde el servicio.
   * Realiza una petición HTTP al servicio para cargar los datos de fabricantes nacionales
   * desde un archivo JSON. Los datos obtenidos se asignan a la propiedad fabricantesNacionales
   * para su visualización en la tabla correspondiente. La suscripción se maneja con takeUntil
   * para evitar fugas de memoria. Los datos incluyen información completa de cada fabricante
   * nacional disponible en el sistema.
   * @returns {void} No retorna ningún valor.
   */
  recuperarDatos(tipoFabricante: string, idSolicitud: number): void {
    this.historicoFabricantesService
      .getFabricantes(tipoFabricante, idSolicitud)
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe({
        next: (resp) => {
          if (resp.codigo === '00' && resp.datos) {
            const FABRICANTES = resp.datos.fabricantes ?? [];

            this.fabricantesNacionales = FABRICANTES.map((f) => ({
              nombreFabricante: f.razon_social ?? '',
              numeroRegistroFiscal: f.clave_fabricante ?? '',
              direccion: f.direccion ?? '',
              correoElectronico: f.correo_electronico ?? '',
              telefono: f.telefono ?? '',
            }));
          } else {
            this.fabricantesNacionales = [];
            console.error('Error al obtener fabricantes:', resp.mensaje);
          }
        },
        error: (err) => {
          this.fabricantesNacionales = [];
          console.error('Error de conexión:', err);
        }
      });
  }


  /**
   * @property {string | number} valorSeleccionado - Valor seleccionado del radio button.
   * Almacena el valor actualmente seleccionado en los controles de radio button del formulario.
   */
  valorSeleccionado: string | number = '';

  /**
   * @method onSeleccionFabricantesNacionales
   * @description Maneja la selección de fabricantes nacionales desde un componente externo.
   * Almacena la lista de fabricantes nacionales seleccionados en una propiedad de la clase
   * para su posterior procesamiento. Este método actúa como callback para recibir datos
   * de selección múltiple desde otros componentes.
   * @param {HistoricoColumns[]} seleccion - Array de objetos HistoricoColumns que representan
   * los fabricantes nacionales seleccionados por el usuario.
   * @returns {void} No retorna ningún valor.
   */
  onSeleccionFabricantesNacionales(seleccion: HistoricoColumns[]): void {
    this.seleccionFabricantesNacionales = seleccion;
  }

  /**
   * @method seleccionarFabricantes
   * @description Procesa y agrega los fabricantes nacionales previamente seleccionados
   * a la lista principal de fabricantes. Valida que exista una selección previa y evita
   * duplicados basándose en el número de registro fiscal. Al finalizar el proceso,
   * limpia la selección temporal para prepararse para nuevas selecciones.
   * @returns {void} No retorna ningún valor.
   * @throws No lanza excepciones explícitas, pero retorna temprano si no hay selección.
   */
  seleccionarFabricantes(): void {
    if (!this.seleccionFabricantesNacionales || this.seleccionFabricantesNacionales.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un fabricante.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.cdr.detectChanges();
      return;
    }

    // Agregar seleccionados evitando duplicados
    this.seleccionFabricantesNacionales.forEach(fab => {
      const EXISTE = this.fabricante.some(f => f.numeroRegistroFiscal === fab.numeroRegistroFiscal);
      if (!EXISTE) {
        this.fabricante = [...this.fabricante, fab];
        this.ElegibilidadDeTextilesStore.setListaFabricantes(this.fabricante);

        // Convertir a FabricanteNacionalRfcResponse
        const FABCOMPLETO = this.mapHistoricoToFabricanteCompleto(fab);

        // Guardar completo
        this.ElegibilidadDeTextilesStore.setListaFabricantesCompletos([FABCOMPLETO]);
      }
    });

    // Opcional: limpiar selección
    this.seleccionFabricantesNacionales = [];
  }

  /**
   * Mapea un objeto HistoricoColumns a un objeto FabricanteNacionalRfcResponse.
   * @param fab Modelo de fabricante en formato HistoricoColumns.
   * @returns Modelo de fabricante en formato FabricanteNacionalRfcResponse.
   */
  mapHistoricoToFabricanteCompleto(fab: HistoricoColumns): FabricanteNacionalRfcResponse {
    return {
      id_persona_sol: '',
      id_persona_persona_sol_r: '',
      id_solicitud: '',
      nombre: fab.nombreFabricante,
      apellido_materno: '',
      apellido_paterno: '',
      razon_social: fab.nombreFabricante,
      rfc: fab.numeroRegistroFiscal,
      curp: '',
      correo_electronico: fab.correoElectronico,
      telefono: fab.telefono,
      descripcion_giro: '',
      domicilio: {
        id_direccion_sol: '',
        calle: fab.direccion,
        num_exterior: '',
        num_interior: '',
        cp: '',
        colonia: { clave: '', nombre: '' },
        localidad: { clave: '', nombre: '' },
        delegacion_municipio: '',
        entidad_federativa: { clave: '', nombre: '' },
        pais: { clave: '', nombre: '' }
      },
      bln_persona_moral: '',
      bln_extranjero: '0',
      tipo_persona: '',
      tipo_sociedad: ''
    };
  }


  /**
   * Selección del tipo de fabricante nacional.
   * Maneja el cambio de valor del radio button para fabricantes nacionales.
   * Actualiza la propiedad selectValueNacional con el nuevo valor seleccionado,
   * establece la bandera isNacionalTabla a true y recupera los datos de fabricantes
   * nacionales desde el servicio basado en el tipo seleccionado.
   * @param newValue - El nuevo valor seleccionado en el control de radio.
   */
  onValueChangeNacional(newValue: number | string): void {
    this.historicoFabricantesForm.get('exportadorFabricanteNacional')?.setValue(newValue);
    this.selectValueNacional = newValue;

    let tipoFabricante = '';
    if (newValue === 'Nacional') {
      tipoFabricante = 'NACIONAL';
    }
    const IDSOLICITUD = this.solicitudState.idSolicitud
    this.isNacionalTabla = true;
    this.recuperarDatos(tipoFabricante, IDSOLICITUD);

  }

  /**
   * Muestra el formulario para agregar un nuevo fabricante.
   * Cambia la bandera isFabricantes a false para mostrar el formulario
   * y ocultar la lista de fabricantes existentes.
   */
  fabricanteNuevo(): void {
    this.historicoFabricantesForm.get('numeroRegistroFiscal')?.setValue('');
    this.registraNumeroRegistro = true;
  }

  /**
   * Cancela la acción de agregar un nuevo fabricante.
   * Cambia la bandera isFabricantes a true para ocultar el formulario
   * y mostrar nuevamente la lista de fabricantes existentes.
   */
  cancelar(): void {
    this.modal?.hide();
    this.registraNumeroRegistro = false;
    this.cerrar.emit();
    this.cdr.detectChanges();
  }

  /**
   * @property {CatalogosSelect[]} dropdownConfigs - Configuraciones de los dropdowns del formulario.
   * Array que contiene la configuración específica para cada control de selección dropdown
   * utilizado en el formulario. Cada elemento define el label, requisitos de validación,
   * catálogos de datos asociados y opciones por defecto. Incluye configuraciones para
   * Delegaciones estatales SAGARPA, OSIA, Oficina Central y Distrito Desarrollo Rural (DDR).
   * Algunos dropdowns son requeridos mientras otros son opcionales según las reglas de negocio.
   */
  dropdownConfigs: CatalogosSelect[] = [
    {
      labelNombre: 'Delegaciones estatales SAGARPA',
      required: true,
      catalogos: CATALOGOS,
      primerOpcion: '',
    },
    {
      labelNombre: 'OSIA',
      required: true,
      catalogos: CATALOGOS,
      primerOpcion: '',
    },
    {
      labelNombre: 'Oficina Central',
      required: true,
      catalogos: CATALOGOS,
      primerOpcion: '',
    },
    {
      labelNombre: 'Distrito Desarrollo Rural (DDR)',
      required: false,
      catalogos: CATALOGOS,
      primerOpcion: '',
    },
  ];

  /**
   * @method setValoresStore
   * @description Establece los valores en el store de textiles.
   * Método utilitario que extrae el valor de un campo específico del formulario
   * y lo almacena en el store global utilizando el método especificado.
   * Facilita la sincronización entre el estado del formulario de histórico de fabricantes
   * y el estado global de la aplicación, asegurando consistencia de datos
   * entre diferentes componentes del sistema.
   * @param {FormGroup} form - El formulario reactivo del cual extraer el valor.
   * @param {string} campo - El nombre del campo del formulario a extraer.
   * @param {keyof ElegibilidadDeTextilesStore} metodoNombre - El nombre del método del store a invocar para guardar el valor.
   * @returns {void} No retorna ningún valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof ElegibilidadDeTextilesStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.ElegibilidadDeTextilesStore[metodoNombre] as (value: string) => void)(
      VALOR
    );
  }

  /**
 * Método para continuar al siguiente paso, validando el campo cantidadFacturas.
 * Si el formulario es inválido, muestra el mensaje de error y no permite continuar.
 * Si es válido, limpia el error y permite continuar.
 */

  continuar(): void {
    this.historicoFabricantesForm.markAllAsTouched();
    this.historicoFabricantesForm.updateValueAndValidity();
    this.cdr.detectChanges();

    if (!this.historicoFabricantesForm.valid) {
      this.formularioAlertaError = ERROR_FORMA_ALERT;
      this.esFormaValido = true;
      window.scrollTo(0, 0);
      return;
    }
    this.esFormaValido = false;
    this.formularioAlertaError = '';
    window.scrollTo(0, 0);

    this.mostrarTabs.emit(true);
  }

  /**
   * @method onSubmitRfc
   * @description Maneja la sumisión del formulario para buscar un fabricante por RFC.
   * Valida el formulario y, si es válido, realiza una llamada al servicio para buscar
   * un fabricante nacional utilizando el RFC proporcionado. Si la respuesta es exitosa
   * y contiene datos, actualiza la interfaz para mostrar los fabricantes.
   */
  onSubmitRfc(): void {
    if (this.historicoFabricantesForm.invalid) {
      this.historicoFabricantesForm.markAllAsTouched();
      return;
    }

    const RFC = this.historicoFabricantesForm.get('numeroRegistroFiscal')?.value;

    this.historicoFabricantesService
      .getFabricanteNacional(RFC)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (resp) => {
          if (resp.codigo === '00' && resp.datos) {
            this.isFabricantes = true;
            const FAB = resp.datos;
            // Mapear respuesta → HistoricoColumns
            const NUEVO_FABRICANTE: HistoricoColumns = {
              nombreFabricante: FAB.razon_social
                ? FAB.razon_social
                : `${FAB.nombre ?? ''} ${FAB.apellido_paterno ?? ''} ${FAB.apellido_materno ?? ''}`.trim(),
              numeroRegistroFiscal: FAB.rfc,
              direccion: FAB.domicilio
                ? `${FAB.domicilio.calle ?? ''} ${FAB.domicilio.num_exterior ?? ''}, ${FAB.domicilio.colonia.nombre ?? ''}, ${FAB.domicilio.entidad_federativa.nombre ?? ''}, ${FAB.domicilio.pais?.nombre ?? ''}`
                : '',
              correoElectronico: FAB.correo_electronico ?? '',
              telefono: FAB.telefono ?? '',
            };
            if (this.fabricante.length < 1) {
              // Limpiar la tabla y agregar
              this.fabricante = [...this.fabricante, NUEVO_FABRICANTE];
              this.ElegibilidadDeTextilesStore.setListaFabricantes(this.fabricante);
              this.ElegibilidadDeTextilesStore.setListaFabricantesCompletos([FAB]);
              this.cancelar();
            }
            else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'warning',
                modo: 'action',
                titulo: '',
                mensaje: 'Ya existe un fabricante previamente seleccionado.',
                cerrar: true,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
            }
          } else {
            console.error('Error en la búsqueda:', resp.mensaje);
          }
        },
        error: (err) => {
          console.error('Error en la petición:', err);
        },
      });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  onSeleccionChange(event: HistoricoColumns[]) {
    this.seleccionados = event;
  }

  /**
   * Eliminar filas seleccionadas de la tabla
   */
  eliminarSeleccionados(): void {
    if (this.seleccionados.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'warning',
        modo: 'action',
        titulo: '',
        mensaje: 'Debe seleccionar un fabricante.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }
    this.eliminarFabricanteModal = true;
  }

  aceptarEliminar(): void {
    if (this.seleccionados.length > 0) {
      this.fabricante = this.fabricante.filter(
        f => !this.seleccionados.some(sel => sel.numeroRegistroFiscal === f.numeroRegistroFiscal)
      );
      this.seleccionados = [];
    }
    this.ElegibilidadDeTextilesStore.setListaFabricantes(this.fabricante);
    this.cerrarEliminarModal();
  }

  cerrarEliminarModal(): void {
    this.modal?.hide();
    this.eliminarFabricanteModal = false;
    this.cerrar.emit();
    this.cdr.detectChanges();

  }

  /**
   * @method ngOnDestroy
   * @description Método que se ejecuta cuando el componente es destruido.
   * Implementa la limpieza necesaria para evitar fugas de memoria cancelando
   * todas las suscripciones activas mediante el subject destroyNotifier$.
   * Es una implementación estándar del patrón de limpieza en Angular que asegura
   * que todas las suscripciones del componente sean correctamente finalizadas
   * cuando el componente se destruye, liberando recursos del sistema.
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
 * Método que se ejecuta al ocultar el modal.
 */
  onHidden(): void {
    this.mostrarModal = false;
  }

  onCheckboxChange(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const ISCHECKED = INPUT.checked;
    this.setValoresStore(
      this.historicoFabricantesForm,
      'exportadorFabricanteMismo',
      'setExportadorFabricanteMismo'
    );
    this.historicoFabricantesForm.get('exportadorFabricanteMismo')?.setValue(ISCHECKED);
    if (!ISCHECKED) {
      // Reset all related state when unchecking
      this.isNacional = false;
      this.isNacionalTabla = false;
      // Clear form control values
      this.historicoFabricantesForm.get('exportadorFabricanteNacional')?.setValue('');
      this.selectValueNacional = '';

      // Clear manufacturer data and selections
      this.fabricantesNacionales = [];
      this.selectedFabricantesNacionales = [];
      this.seleccionFabricantesNacionales = [];

      // Update store to clear the values
      this.ElegibilidadDeTextilesStore.setExportadorFabricanteNacional('');

      this.cdr.detectChanges();
    }
    else {
      this.selectedValue = ISCHECKED;
      this.isNacional = true;
    }
  }
}
