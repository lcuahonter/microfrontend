import { Component, Inject, OnInit, TemplateRef, ViewChild, computed, effect, inject, input, signal, untracked } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Catalogo, ConfiguracionColumna, TablaSeleccion } from '@ng-mf/data-access-user';
import { DESTINATARIO_TABLA_CONFIGURACION, DestinatarioConfiguracionItem } from '../../enum/destinatario-tabla.enum';
import { MODAL_CONFIG } from '../../enum/autorizaciones.enum';

import { DestinatarioForm, Tramite230901Store } from '../../estados/store/tramite230901.store';

import { DatosTramite230902Service } from '../../services/datos-tramite-230901.service';
import { DestinatarioComponent } from '../destinatario/destinatario.component';
import { SHARED_MODULES } from '../../shared-imports';
import { UtilidadesService } from '../../services/utilidades.service';
import { DefaultValidacionFormularios } from '../../interfaces/catalogos.response';
import { ValidacionFormularios } from '../../interfaces/catalogos.interface';


/**
 * Componente que gestiona los datos relacionados con terceros en el trámite "230901".
 * Incluye la configuración de formularios, tablas dinámicas y la interacción con servicios
 * relacionados con autorizaciones de vida silvestre.
 */
@Component({
  selector: 'terceros',
  templateUrl: './terceros.component.html',
  styleUrl: './terceros.component.scss',
  providers: [BsModalService],
  imports: [SHARED_MODULES, DestinatarioComponent],
  standalone: true
})
export class TercerosComponent implements OnInit {
  /** 
   * Inyección de dependencia para construir formularios reactivos. 
  */
  private formBuilder = inject(FormBuilder)
  /**
   * Inyección de dependencia de servicio para invocar el storage.
   */
  public store = inject(Tramite230901Store)
  /**
 * Utilidades a reutilizar dentro del tramite
 */
  public utils = inject(UtilidadesService);
  /** 
   * Inyección de dependencia de servicio para invocar los servicios de catlogos a necesitar.
  */
  public datosService = inject(DatosTramite230902Service)

  /** 
    * Inicializa el estado del formulario 
   */
  public solicitudState = this.utils.solicitud;

  /** 
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
  */
  public consultaState = this.utils.consultaState;

  @Inject(BsModalService)
  private modalService = inject(BsModalService)

  /**
 * Valida si el formulario esta validado par continuar el proceso caso contrario habilita el formulario requerido
 */
  esGuardarDatos = input<ValidacionFormularios>(DefaultValidacionFormularios);

  /**
   * Bandera para distinguir si la tabla tienen datos
  */
  esDatosDestinatario = computed(() => this.solicitudState().destinatario.length === 0)

  /** Referencia al modal de Nacionalidad */
  @ViewChild('modalAgregarNacionalidad', { static: false }) agregarModal!: TemplateRef<Element>;

  /**
   * Referencia al elemento del modal de Bootstrap.
   * @property {ElementRef} modalRef
   */
  modalRef!: BsModalRef | null;

  /** Formulario reactivo para capturar la entidad federativa del destinatario. */
  formularioDestinatario!: FormGroup;

  /** Indica si el popup está abierto. */
  popupAbierto = false;

  /** Indica si el popup está cerrado. */
  popupCerrado = true;

  /**
   * Configuración de las columnas de la tabla de terceros.
   * Define cómo se mostrarán los datos en la tabla.
   */
  configuracionColumnas: ConfiguracionColumna<DestinatarioConfiguracionItem>[] = DESTINATARIO_TABLA_CONFIGURACION;

  /** Tipo de selección de la tabla (por ejemplo, selección por checkbox). */
  tipoSeleccionTabla: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /**
   * Indica si el botón de modificar está habilitado.
   */
  botonModificarHabilitado = signal<boolean>(false)

  /** Indica si el formulario está en modo solo lectura. */
  esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);

  /** Obtiene la clave clasificacion seleccionada */
  cve_clasificacion_regimen = computed(() => this.solicitudState().cve_clasificacion_regimen)

  /** Leyenda label Destinatario */
  lblDestinatario = computed(() => (this.cve_clasificacion_regimen() === '01') ? 'Entidad federativa' : 'Pais')

  /** Catalogo de los destinatarios Recintos */
  destinatariosRecinto!: Catalogo[];

  /** Tabla de los destinatarios Recintos por clave */
  destinatarioRecintoClave!: DestinatarioConfiguracionItem[];
  /**
     * Un arreglo que contiene las filas seleccionadas de tipo `DestinatarioConfiguracionItem`.
     * Esto se utiliza para gestionar los elementos seleccionados en el contexto del componente.
     */
  listaFilaSeleccionada = signal<DestinatarioConfiguracionItem[]>([]);

  /** 
  * Computed para obtener los valores del formulario
 */
  getFormValor = computed(() => this.utils.getFormValor<DestinatarioForm>(this.formularioDestinatario))

  /** Puede definir explícitamente el tipo de acceso de control dinámico */
  get formControls(): { [key: string]: AbstractControl } { return this.formularioDestinatario.controls; }
  /** Obtiene el grupo de formulario de los Datos de la tabla Destinatario. */
  get destinatario() { return this.formControls['destinatario'] }
  /** Obtiene el grupo de formulario la entidad Federativa seleccionada */
  get entidadFederativa() { return this.formControls['entidadFederativa'] }

  /**
   * Constructor del componente TercerosComponent.
   * Inicializa los servicios y dependencias necesarias para gestionar el estado
   * y los datos relacionados con terceros.
   */
  constructor() {
    effect(() => {
      const VALUE = this.esGuardarDatos();
      untracked(() => {
        const { isFormValid, isGuardForm } = VALUE;
        if (!isFormValid && isGuardForm) {
          this.formularioDestinatario.markAllAsTouched();
        }
      });
    });
  }

  /**
   * Método del ciclo de vida que se ejecuta al inicializar el componente.
   * Inicializa los catálogos de datos de terceros, se suscribe al estado de la solicitud
   * y crea el formulario del destinatario.
   */
  ngOnInit() {
    this.crearFormularioDestinatario();
    if (!this.esFormularioSoloLectura()) {
      this.catalogoRecintos()
    }

  }
  /**
 * Crea el formulario reactivo para capturar la entidad federativa del destinatario.
 * Inicializa el valor del formulario con el estado actual de la solicitud.
 */
  crearFormularioDestinatario() {
    this.formularioDestinatario = this.formBuilder.group({
      entidadFederativa: [this.solicitudState().entidadFederativa],
      destinatario: [this.solicitudState().destinatario, Validators.required],
    });
  }

  /** Carga el catalogo de Recintos */
  async catalogoRecintos() {
    this.destinatariosRecinto = await this.datosService.getDestinatarioRecinto(this.cve_clasificacion_regimen(), this.solicitudState().solicitante.rfc);//'AAL0409235E6'
  }

  /**
   * Maneja los cambios en la entidad federativa seleccionada.
   * Actualiza el estado del almacén y agrega una entrada a la tabla de datos
   * si la entidad federativa es válida y la tabla está vacía.
   */
  async manejarCambioEntidadFederativa(event: Event): Promise<void> {
    const CLAVE_RECINTO = (event.target as HTMLInputElement).value;

    this.destinatarioRecintoClave = await this.datosService.getDestinatarioRecintoClave(this.cve_clasificacion_regimen(), this.solicitudState().solicitante.rfc, CLAVE_RECINTO);

    const DATOS = this.destinatarioRecintoClave.map(item => ({
      ...item,
      id_direccion: item.id_direccion,
      cve_entidad_federativa: item.cve_entidad || item.cve_pais,
      domicilio: item.desc_ubicacion,
      pais: item.nombre_pais,
      ciudad: '',
      es_nuevo: false,
    }))
    this.destinatario.patchValue(DATOS);
    this.utils.setValoresStore(this.formularioDestinatario, 'entidadFederativa')
    this.store.setDestinatario(DATOS)
    this.actualizaFormValido()
  }

  /**
   * Elimina la fila seleccionada de la Tabla
   */
  eliminarSeleccionados(): void {
    this.utils.limpiarForm(this.formularioDestinatario);
    this.utils.setValoresStore(this.formularioDestinatario, 'entidadFederativa')
    this.store.setDestinatario([])
    this.actualizaFormValido()
  }

  /**
   * Maneja la fila seleccionada en la tabla de terceros.
   * Habilita o deshabilita el botón de modificar según la selección.
   */
  manejarFilaSeleccionada(filaSeleccionada: DestinatarioConfiguracionItem[]): void {
    this.botonModificarHabilitado.set(filaSeleccionada.length > 0);
    this.listaFilaSeleccionada.set(filaSeleccionada)
  }

  /**
   * Evento para abrie el modal de la carga de Destinatarios 
   */
  abrirMOdal(): void {
    this.modalRef = this.modalService.show(this.agregarModal, MODAL_CONFIG);
  }

  /** 
   * Cierra modal y elimina toda referencia a el mismo. 
   * */
  cancelarModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  /** 
   * Obtiene los datos del modal de Destinatario y lo asigna al formulario 
   * */
  obtieneDatosNacionalidad(): void {
    this.utils.setFormValores(this.formularioDestinatario, { destinatario: this.solicitudState().destinatario })
    this.actualizaFormValido();
  }

  /** 
   * Valida el estatus del fromulario y setea valos en el store
  */
  actualizaFormValido(): void {
    this.store.setPasoUno({ paginaTab: 3, completado: this.formularioDestinatario.valid })
  }
}