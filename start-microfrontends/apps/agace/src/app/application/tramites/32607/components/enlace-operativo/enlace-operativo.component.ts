import { Catalogo, CatalogoSelectComponent, CatalogosSelect, ConfiguracionColumna, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src'; 
import { Component,OnDestroy, OnInit } from '@angular/core'; 
import { ENTIDAD_FEDERATIVE, INSTALACIONS_CONFIGURACION_COLUMNAS } from '../../constants/solicitud.enum'; 
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'; 
import { Solicitud32607State, Solicitud32607Store } from '../../estados/solicitud32607.store'; 
import { Subject, map, takeUntil } from 'rxjs'; 
import { CommonModule } from '@angular/common'; 
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Instalacions } from '../../models/solicitud.model'; 
import { Solicitud32607Query } from '../../estados/solicitud32607.query'; 
import { SolicitudService } from '../../services/solicitud.service';

/**
 * Componente responsable de gestionar la sección "Enlace Operativo" dentro del formulario de solicitud.
 * 
 * Este componente utiliza un formulario reactivo para capturar y mostrar información relacionada con
 * el enlace operativo, incluyendo selección de catálogos y una tabla dinámica.
 * 
 * @selector app-enlace-operativo
 * @standalone true
 * @templateUrl ./enlace-operativo.component.html
 * @styleUrl ./enlace-operativo.component.scss
 * @imports CommonModule, ReactiveFormsModule, TituloComponent, CatalogoSelectComponent, TablaDinamicaComponent
 */
@Component({
  selector: 'app-enlace-operativo',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TablaDinamicaComponent,
  ],
  templateUrl: './enlace-operativo.component.html',
  styleUrl: './enlace-operativo.component.scss',
})
export class EnlaceOperativoComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo utilizado para capturar los datos del enlace operativo.
   *
   * @type {FormGroup}
   */
  enlaceOperativoForm!: FormGroup;

  /**
   * Lista de instalaciones recuperadas o ingresadas por el usuario.
   *
   * @type {Instalacions[]}
   */
  instalacions: Instalacions[] = [] as Instalacions[];

  /**
   * Catálogo con las entidades federativas disponibles para la selección.
   *
   * @type {CatalogosSelect}
   */
  entidadFederative: CatalogosSelect = ENTIDAD_FEDERATIVE;

  /**
   * Configuración del tipo de selección para la tabla de número de empleados.
   * En este caso, se utiliza selección por checkbox.
   *
   * @type {TablaSeleccion}
   */
  numeroDeEmpleadosTabla = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla de instalaciones.
   *
   * @type {ConfiguracionColumna<Instalacions>[]}
   */
  instalacionsConfiguracionColumnas: ConfiguracionColumna<Instalacions>[] =
    INSTALACIONS_CONFIGURACION_COLUMNAS;

  /**
   * Lista de datos de instalaciones ingresadas en el formulario.
   *
   * @type {Instalacions[]}
   */
  instalacionsDatos: Instalacions[] = [] as Instalacions[];

  /**
   * Observable para manejar la destrucción de suscripciones y evitar fugas de memoria.
   *
   * @private
   * @type {Subject<void>}
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * Estado actual de la solicitud 32607, utilizado para acceder a datos globales del store.
   *
   * @type {Solicitud32607State}
   */
  solicitud32607State: Solicitud32607State = {} as Solicitud32607State;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

/**
 * Constructor del componente.
 * 
 * Inyecta los servicios necesarios para gestionar formularios, el estado de la solicitud 32607
 * y consultas auxiliares utilizadas en el formulario del enlace operativo.
 *
 * @param fb - Servicio para la creación y gestión de formularios reactivos.
 * @param solicitudService - Servicio que gestiona las operaciones de la solicitud.
 * @param solicitud32607Store - Store que mantiene y actualiza el estado de la solicitud 32607.
 * @param solicitud32607Query - Query que permite leer el estado de la solicitud 32607.
 * @param consultaioQuery - Query para obtener catálogos y datos auxiliares.
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
    this.guardarEntidadFederative();
  }

  /**
   * Método del ciclo de vida `OnInit`.
   * 
   * Se ejecuta al inicializar el componente y se encarga de preparar el estado inicial del formulario
   * mediante la llamada a `inicializarEstadoFormulario()`.
   *
   * @returns {void}
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
      this.enlaceOperativoForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.enlaceOperativoForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario reactivo `enlaceOperativoForm` con los datos del estado actual de la solicitud.
   * 
   * Crea el formulario con el valor inicial de `entidad` y suscribe a los cambios en el estado de la solicitud
   * (`selectSolicitud$`). Cada vez que el estado cambia, se actualiza el valor del campo `entidad` en el formulario.
   * 
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria cuando el componente se destruya.
   *
   * @returns {void}
   */
  inicializarFormulario(): void {
    this.enlaceOperativoForm = this.fb.group({
      entidad: [this.solicitud32607State.entidad],
    });
    this.solicitud32607Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroy$),
        map((respuesta: Solicitud32607State) => {
          this.solicitud32607State = respuesta;
          this.enlaceOperativoForm.patchValue({
            entidad: this.solicitud32607State.entidad,
          });
        })
      )
      .subscribe();
  }

  /**
   * Llama al servicio para guardar la entidad federativa seleccionada y actualiza el catálogo local.
   * 
   * La respuesta del backend se asigna a `entidadFederative.catalogos`.
   * La suscripción se cancela automáticamente al destruir el componente.
   *
   * @returns {void}
   */
  guardarEntidadFederative(): void {
    this.solicitudService
      .guardarEntidadFederative()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: Catalogo[]) => {
          this.entidadFederative.catalogos = respuesta;
        },
      });
  }

  /**
   * Llama al servicio para guardar las instalaciones y actualiza los datos locales.
   * 
   * La respuesta se asigna a `instalacionsDatos`.
   * La suscripción se limpia automáticamente con `takeUntil`.
   *
   * @returns {void}
   */
  guardarInstalacions(): void {
    this.solicitudService
      .guardarInstalacions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: Instalacions[]) => {
          this.instalacionsDatos = respuesta;
        },
      });
  }

  /**
   * Actualiza la entidad federativa seleccionada en el store y guarda las instalaciones correspondientes.
   * 
   * @param evento - Catálogo seleccionado que contiene el ID de la entidad federativa.
   * @returns {void}
   */
  actualizarEntidadFederative(evento: Catalogo): void {
    this.solicitud32607Store.actualizarEntidad(evento.id);
    this.guardarInstalacions();
  }

  /**
   * Asigna la lista de instalaciones seleccionadas al arreglo local `instalacions`.
   * 
   * @param evento - Lista de instalaciones seleccionadas por el usuario.
   * @returns {void}
   */
  seleccionarInstalacionsDato(evento: Instalacions[]): void {
    this.instalacions = evento;
  }

  /**
   * Método del ciclo de vida `OnDestroy`.
   * 
   * Libera las suscripciones observables utilizando `destroy$` para evitar fugas de memoria.
   *
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
