import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Catalogo, CategoriaMensaje, ConfiguracionColumna, CrossListLable, CrosslistComponent, Notificacion, TablaSeleccion, TipoNotificacionEnum } from '@ng-mf/data-access-user';

import { AQUANDAS_CROSSLIST_LABEL, MODAL_CONFIG, MOVIMIENTO_CROSSLIST_LABEL } from '../../enum/autorizaciones.enum';
import { CROSSLIST_BOTONS, CrosslistBoton } from '../../enum/crosslist-botons.enum';
import { MERCANCIA_TABLA_CONFIGURACION, MercanciaConfiguracionItem } from '../../enum/mercancia-tabla.enum';

import { Tramite230901Store } from '../../estados/store/tramite230901.store';

import { DatosTramite230902Service } from '../../services/datos-tramite-230901.service';
import { MercanciaComponent } from '../mercancia/mercancia.component';
import { SHARED_MODULES } from '../../shared-imports';
import { UtilidadesService } from '../../services/utilidades.service';
import { DefaultValidacionFormularios } from '../../interfaces/catalogos.response';
import { ValidacionFormularios } from '../../interfaces/catalogos.interface';


/*
 * Componente que gestiona los datos de la solicitud, incluyendo la configuración de formularios,
 * tablas dinámicas y la interacción con servicios relacionados con autorizaciones de vida silvestre.
 */
@Component({
  selector: 'datos-solicitud',
  templateUrl: './datos-solicitud.component.html',
  styleUrls: ['./datos-solicitud.component.scss'],
  standalone: true,
  imports: [SHARED_MODULES, MercanciaComponent],
  providers: [BsModalService]
})

export class DatosSolicitudComponent implements OnInit {
  /** 
 * Inyección de dependencia para construir formularios reactivos. 
*/
  private formBuilder = inject(FormBuilder);
  /**
   * Inyección de dependencia de servicio para invocar el storage.
   */
  public store = inject(Tramite230901Store);
  /**
 * Utilidades a reutilizar dentro del tramite
 */
  public utils = inject(UtilidadesService);

  /** Datos de Catalogos */
  public datosService = inject(DatosTramite230902Service);

  /** 
  * Inicializa el estado del formulario 
  */
  public solicitudState = this.utils.solicitud;

  /** 
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`. 
  */
  public consultaState = this.utils.consultaState;

  private modalService = inject(BsModalService)
  /* Tipo de Movimiento Seleccionado */
  cve_clasificacion_regimen!: string;

  /* Bandera para habiltar terceros */
  habilitarTerceros = output<boolean>();
  /**
     * Valida si el formulario esta validado par continuar el proceso caso contrario habilita el formulario requerido
     */
  esGuardarDatos = input<ValidacionFormularios>(DefaultValidacionFormularios);

  /** Notificación que se muestra al usuario. */
  public nuevaNotificacionEliminar: Notificacion | null = null;

  /** Referencia al elemento del modal de Bootstrap. */
  modalRef!: BsModalRef | null;

  /** Referencia al modal de Mercancias */
  @ViewChild('modalAgregarMercancias', { static: false }) agregarModal!: TemplateRef<Element>;

  @ViewChild("CrosslistComponentAduanas") crossListAduana!: CrosslistComponent;
  @ViewChild("CrosslistComponentMovimientos") crossListMovimientos!: CrosslistComponent;

  /** Botones para la lista cruzada. */
  crossListBotons!: CrosslistBoton[];
  /** Botones para las aduanas. */
  aduanasBotons!: CrosslistBoton[];

  /** Botones configurados para la lista dinámica de movimientos. */
  botonesMovimientos!: CrosslistBoton[];

  /** Formulario reactivo para los datos de la solicitud. */
  formularioSolicitud!: FormGroup;

  /**  Etiquetas para las listas dinámicas de aduanas. */
  etiquetaAduanas: CrossListLable = AQUANDAS_CROSSLIST_LABEL;

  /** Etiquetas para las listas dinámicas de movimientos. */
  etiquetaMovimientos: CrossListLable = MOVIMIENTO_CROSSLIST_LABEL;


  /**  Configuración de las columnas para la tabla de mercancías. */
  configuracionTablaMercancia: ConfiguracionColumna<MercanciaConfiguracionItem>[] = MERCANCIA_TABLA_CONFIGURACION;

  /** Tipo de selección para la tabla dinámica. */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**  Lista de filas seleccionadas en la tabla de mercancías. */
  listaFilaSeleccionadaMercancia!: MercanciaConfiguracionItem[];

  /**  Indica si un archivo está seleccionado. */
  enableModificarBoton = signal<boolean>(true);

  /** Indica si el popup está abierto. */
  confirmEliminarPopupAbierto = signal<boolean>(false);

  /** Indica si el botón de eliminar está habilitado. */
  enableEliminarBoton = signal<boolean>(true);

  /** Indica si el formulario está en modo solo lectura. */
  esFormularioSoloLectura = signal<boolean>(this.consultaState().readonly);

  /** Lista seleccionada de aduanas. Contiene las aduanas seleccionadas por el usuario. */
  listaSeleccionadaAduanas: string[] = this.solicitudState().aduanas_seleccionadas;

  /** Lista seleccionada de movimientos. Contiene los movimientos seleccionadas por el usuario. */
  listaMovimientosSeleccionados: string[] = this.solicitudState().movimientos_seleccionados;

  //mercancias = computed(() => this.solicitudState().mercancias)
  mercancias: MercanciaConfiguracionItem[] = this.solicitudState().mercancias

  /** Notificación que se muestra al usuario.*/
  public nuevaNotificacion!: Notificacion;

  public tiposMovimientos: Catalogo[] = this.datosService.tiposMovimientos();
  public tiposRegimen: Catalogo[] = this.datosService.tiposRegimenes();

  /**
   * @evento
   * @nombre fechasSeleccionadasChangeEvent
   * @descripcion Evento que se emite cuando cambian las fechas seleccionadas en el crosslist.
   * @tipo {EventEmitter<string[]>}
   */
  @Output() fechasSeleccionadasChangeEvent = new EventEmitter<string[]>();


  constructor() {
    effect(() => {
      const VALUE = this.esGuardarDatos();
      const { isFormValid, isGuardForm } = VALUE;
      if (!isFormValid && isGuardForm) {
        this.formularioSolicitud.markAllAsTouched();
      }
    });
  }

  /** Puede definir explícitamente el tipo de acceso de control dinámico */
  get formControls(): { [key: string]: AbstractControl } { return this.formularioSolicitud.controls; }
  /** Obtiene el grupo de formulario de los Datos de la tabla Mercancias. */
  get datosTablaMercancia() { return this.formControls['mercancias'] }
  /** Obtiene el grupo de formulario de la Clave Clasificacion Regimen. */
  get cveClasificacionRegimen() { return this.formControls['cve_clasificacion_regimen'] }
  /** Obtiene el grupo de formulario de la Clave Tipo Regimen. */
  get tipoRegimen() { return this.formControls['cve_regimen'] }
  /** Obtiene el grupo de formulario de las Aduanas Seleccionadas */
  get aduanasSeleccionadas() { return this.formControls['aduanas_seleccionadas'] }
  /** Obtiene el grupo de formulario de los Movimientos Seleccionadas */
  get movimientosSeleccionados() { return this.formControls['movimientos_seleccionados'] }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.crearFormularioSolicitud();
    if (this.esFormularioSoloLectura()) {
      this.cargaAduanasMovimientos()
    }
  }

  cargaAduanasMovimientos(): void {
    this.tiposMovimientos = this.solicitudState().clasificacion_regimen!;
    this.tiposRegimen = this.solicitudState().regimen!;
    this.cveClasificacionRegimen.setValue(this.solicitudState().cve_clasificacion_regimen, { emitEvent: false });
    this.tipoRegimen.setValue(this.solicitudState().cve_regimen, { emitEvent: false });
  }

  /**
 * Se ejecuta después de que la vista del componente se ha inicializado.
 * Configura los componentes crosslist cuando están disponibles.
 */
  async ngAfterViewInit(): Promise<void> {
    await this.esperarComponentesCrosslistListos();
    this.configurarComponentesCrosslist();
  }

  /**
   * Espera hasta que los componentes crosslist estén listos para su uso.
   * Implementa un mecanismo de polling asíncrono para verificar la disponibilidad.
   */
  private esperarComponentesCrosslistListos(): Promise<void> {
    return new Promise<void>((resolve) => {
      const VERIFICAR_COMPONENTES = (): void => {
        if (this.crossListAduana && this.crossListMovimientos) {
          resolve();
        } else {
          setTimeout(VERIFICAR_COMPONENTES, 50);
        }
      };
      VERIFICAR_COMPONENTES();
    });
  }

  /**
   * Configura los componentes crosslist una vez que están disponibles.
   */
  private configurarComponentesCrosslist(): void {
    this.crossListBotons = CROSSLIST_BOTONS(this.crossListAduana);
    this.botonesMovimientos = CROSSLIST_BOTONS(this.crossListMovimientos);
    this.aduanasBotons = (this.solicitudState().cve_clasificacion_regimen === '01') ? this.crossListBotons.slice(1) : this.crossListBotons;
  }

  /**
   * Funcion que habilita el Tab de terceros y borra la información que tenian por defecto cada wue cambie de opción.
   */
  habilitaTerceros(): void {
    this.store.establecerDatos({ cve_clasificacion_regimen: this.cveClasificacionRegimen.value });
    this.utils.limpiarForm(this.formularioSolicitud);
    this.cveClasificacionRegimen.patchValue(this.solicitudState().cve_clasificacion_regimen)
    this.store.setDestinatario([])
    this.store.setMercancias([]);
    this.habilitarTerceros.emit(this.solicitudState().cve_clasificacion_regimen !== '');

    // Recreate crosslist buttons if they are undefined or empty
    if (!this.crossListBotons || this.crossListBotons.length === 0) {
      this.configurarComponentesCrosslist();
    }
    // Ensure crosslist components are initialized before using them
    if (this.crossListBotons && this.crossListBotons.length > 0) {
      this.aduanasBotons = (this.solicitudState().cve_clasificacion_regimen === '01') ? this.crossListBotons.slice(1) : this.crossListBotons;
      this.crossListAduana?.quitar('t')
      this.crossListMovimientos?.quitar('t')
    }
  }

  /** Crea el formulario reactivo para los datos de la solicitud. */
  crearFormularioSolicitud(): void {
    this.formularioSolicitud = this.formBuilder.group({
      cve_regimen: ['', Validators.required],
      cve_clasificacion_regimen: ['', Validators.required],
      aduanas_seleccionadas: ['', Validators.required],
      movimientos_seleccionados: ['', Validators.required],
      mercancias: ['', Validators.required],
    });
    this.utils.setFormValores(this.formularioSolicitud, this.solicitudState())
  }

  /**
   * Setea el tipo de regimen seleccionado
   */
  setTipoRegimen() {
    this.tipoRegimen.patchValue(this.tipoRegimen.value);
    this.store.establecerDatos({ cve_regimen: this.tipoRegimen.value })
    this.esValidoFormulario();
  }

  /** Cierra modal y elimina toda referencia a el mismo. */
  cancelarModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
    this.datosTablaMercancia.patchValue(this.solicitudState().mercancias);
    this.esValidoFormulario();
  }

  /**  Maneja la fila seleccionada en la tabla de mercancías. */
  manejarFilaSeleccionada(fila: MercanciaConfiguracionItem[]): void {
    if (fila.length === 0) {
      this.listaFilaSeleccionadaMercancia = [];
      this.deshabilitaBotonEliminarModificar();
      return;
    }
    this.enableModificarBoton.set(false);
    this.enableEliminarBoton.set(false);
    this.listaFilaSeleccionadaMercancia = fila;
  }

  /**
   * Confirma la eliminación de los elementos seleccionados en la tabla de mercancías.
   * Si no hay elementos seleccionados, no realiza ninguna acción.
   * Si hay elementos seleccionados, abre el popup de confirmación de eliminación.
   */
  confirmEliminarMercanciaItem(): void {
    if (this.listaFilaSeleccionadaMercancia.length === 0) { return; }
    this.confirmEliminarPopupAbierto.set(true);
  }

  /**  Muestra el formulario de mercancía en un modal. */
  mostrarFormularioMercanciaModal(opcion: string): void {
    if (opcion === 'agregar') { this.listaFilaSeleccionadaMercancia = [] }
    if (opcion === 'modificar' && this.listaFilaSeleccionadaMercancia.length >= 2) { this.abrirMultipleSeleccionPopup(); return; }
    this.modalRef = this.modalService.show(this.agregarModal, MODAL_CONFIG);
  }

  /**  Elimina la mercancía seleccionada de la tabla */
  eliminarMercancia(): void {
    if (this.listaFilaSeleccionadaMercancia.length === 0) { return; }
    this.abrirElimninarConfirmationopup();
  }

  /** Maneja la respuesta del modal de confirmación de eliminación */
  onEliminarConfirmacion(confirmado: boolean): void {
    // eslint-disable-next-line no-unused-expressions
    (confirmado) ? this.confirmarEliminarMercancia() : this.nuevaNotificacionEliminar = null;
  }

  /** Confirma elemento a eliminar  */
  confirmarEliminarMercancia(): void {
    const ACTUALIZACION_DATOS_TABLA_MERCANCIA = this.utils.eliminaMercancia(this.mercancias, this.listaFilaSeleccionadaMercancia)
    this.store.setMercancias(ACTUALIZACION_DATOS_TABLA_MERCANCIA);
    this.listaFilaSeleccionadaMercancia = [];
    this.deshabilitaBotonEliminarModificar();
    this.esValidoFormulario();
  }

  /**Deshabilta los botones de modificar y eliminar en caso de no seleccionar opcion */
  deshabilitaBotonEliminarModificar(): void {
    this.enableModificarBoton.set(true);
    this.enableEliminarBoton.set(true);
  }

  /**
  * @method abrirElimninarConfirmationopup
  * Abre un popup de confirmación para eliminar los registros seleccionados.
  * Si no hay registros seleccionados, no realiza ninguna acción.
  */
  abrirElimninarConfirmationopup(): void {
    this.nuevaNotificacionEliminar = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.ERROR,
      modo: 'modal',
      titulo: '',
      mensaje: '¿Estás seguro que deseas eliminar los registros marcados?',
      cerrar: false,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: 'Cancelar',
    };
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
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }
  /** Validar formulario */
  esValidoFormulario(): void {
    this.store.setPasoUno({ paginaTab: 2, completado: this.formularioSolicitud.valid })
  }

  /** Filtra las aduanas seleccionadas por clave */
  obtieneClaveAduanas(aduanaSeleccionada: string[]): void {
    const CLAVES_ADUANAS = this.utils.getClaveArray(this.datosService.listaAduanas(), aduanaSeleccionada);
    const ADUANAS = this.solicitudState().cve_clasificacion_regimen === '01' ? { aduanas_entrada: CLAVES_ADUANAS } : { aduanas_salida: CLAVES_ADUANAS };
    this.store.establecerDatos(ADUANAS);
    this.aduanasSeleccionadas.patchValue(aduanaSeleccionada);
    this.utils.setValoresStore(this.formularioSolicitud, 'aduanas_seleccionadas');
    this.esValidoFormulario();
  }

  /** Filtra los movimientos seleccionadas por clave */
  obtieneClaveMovimientos(movimientoSeleccionado: string[]): void {
    this.listaMovimientosSeleccionados = movimientoSeleccionado;
    const CLAVES_MOVIMIENTOS = this.utils.getClaveArray(this.datosService.listaMovimientos(), this.listaMovimientosSeleccionados);
    this.store.establecerDatos({ movimientos: CLAVES_MOVIMIENTOS });
    this.movimientosSeleccionados.patchValue(movimientoSeleccionado);
    this.utils.setValoresStore(this.formularioSolicitud, 'movimientos_seleccionados');
    this.esValidoFormulario();
  }
}


