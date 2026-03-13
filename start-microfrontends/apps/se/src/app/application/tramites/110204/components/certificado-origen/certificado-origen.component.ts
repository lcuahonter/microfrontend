import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Catalogo, CatalogoSelectComponent,InputFecha,InputFechaComponent,SeccionLibQuery,SeccionLibState,SeccionLibStore,TablaDinamicaComponent, TablaSeleccion, TituloComponent, formatearFechaYyyyMmDd} from '@libs/shared/data-access-user/src';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import { CargaPorArchivoComponent } from '../carga-por-archivo/carga-por-archivo.component'
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CertificadosOrigenGridService } from '../../services/certificadosOrigenGrid.service';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { IDPROCEDIMIENTO } from '../../constantes/modificacion.enum';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Tramite110204Query } from '../../estados/tramite110204.query';
import { Tramite110204Store } from '../../estados/tramite110204.store';

/**
 * Constante que representa la configuración de la fecha final en el componente de certificado de origen.
 * 
 * @constant
 * @type {Object}
 * @property {string} labelNombre - El nombre de la etiqueta para la fecha final.
 * @property {boolean} required - Indica si el campo de fecha final es obligatorio.
 * @property {boolean} habilitado - Indica si el campo de fecha final está habilitado.
*/
export const FECHA_INICIO = {
  labelNombre: 'Fecha inicio',
  required: true,
  habilitado: true,
};

/**
 * Constante que representa la configuración de la fecha final en el componente de certificado de origen.
 * 
 * @constant
 * @type {Object}
 * @property {string} labelNombre - El nombre de la etiqueta para la fecha final.
 * @property {boolean} required - Indica si el campo de fecha final es obligatorio.
 * @property {boolean} habilitado - Indica si el campo de fecha final está habilitado.
 */
export const FECHA_FINAL = {
  labelNombre: 'Fecha fin',
  required: true,
  habilitado: true,
};

/**
 * Componente para gestionar los certificados de origen.
 * Se encarga de manejar los formularios, la carga de catálogos, la validación y la interacción con el store.
 */
@Component({
  selector: 'app-certificado-origen',
  standalone: true,
  imports: [
    TituloComponent,
    ReactiveFormsModule,
    CommonModule,
    TablaDinamicaComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    MercanciaComponent,
    CertificadoDeOrigenComponent,
    CargaPorArchivoComponent
  ],
  providers: [ToastrService],
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.scss',
})
export class CertificadoOrigenComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * @descripcion
   * Indica si el operador está activo.
   */
  operador: boolean = true;

  /**
   * @input
   * @description
   * Indica si el formulario debe estar deshabilitado. Cuando es `true`, los controles del formulario estarán inactivos y no permitirán la edición por parte del usuario.
   * @type {boolean}
   */
  @Input() formularioDeshabilitado: boolean = false;

  /**
   * Formulario reactivo utilizado para la gestión de los datos del certificado.
   * @type {FormGroup}
   */
  formCertificado!: { [key: string]: undefined | boolean | string | number | object };

  /**
   * Configuración de las fechas de inicio y fin.
   * @type {InputFecha}
   */
  public fechaInicioInput: InputFecha = FECHA_INICIO;
  /**
   * Configuración de la fecha final en el formulario de certificado de origen.
   * @type {InputFecha}
   */
  public fechaFinalInput: InputFecha = FECHA_FINAL;
  /**
   * Observable que emite la lista de estados disponibles.
   * @type {Observable<Catalogo[]>}
   */
  estados$!: Observable<Catalogo[]>;

  /**
   * Observable que emite la lista de países y bloques disponibles.
   * @type {Observable<Catalogo[]>}
   */
  pais$!: Observable<Catalogo[]>;

  /**
   * Estado seleccionado del catálogo.
   * @type {Catalogo}
   */
  estado!: Catalogo;

  /**
   * País o bloque seleccionado.
   * @type {Catalogo}
   */
  paisBloque!: Catalogo;

  /**
   * Subject para gestionar el ciclo de vida del componente.
   * @type {Subject<void>}
   */
  destroyNotifier$: Subject<void> = new Subject();
  /**
   * Datos de la bitácora obtenidos desde el servicio.
   * @type {MercanciaShared[]}
   */
  datos: Mercancia[] = [];

  /**
   * Observable que emite los datos de la mercancia obtenida.
   * @type {Observable<Mercancia[]>}
   */
  datos1: Observable<Mercancia[]>;

  /**
   * Estado de la selección de la tabla.
   * @type {TablaSeleccion}
   */
  seleccionTabla = TablaSeleccion.UNDEFINED;

  /**
   * Estado de la sección, gestionado mediante el store.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;


  /**
 * Datos de la bitácora obtenidos desde el servicio.
 * @type {Mercancia[]}
 */

  datosSeleccionados!: Mercancia;
  /**
 * Instancia del modal de modificación.
 */
  modalInstance!: Modal;

  /**
   * @property {Modal} buscarModel
   * @description
   * Instancia del modal de búsqueda de mercancía.
   * Se utiliza para mostrar y controlar el modal de búsqueda de mercancías en el componente.
   */
  buscarModel!: Modal

  /**
   * @descripcion
   * Indica si el campo de mercancías está activo.
   */
  cargoDeMercancias: boolean = true;

  /**
   * @descripcion
   * Indica si hay mercancías disponibles.
   */
  mercanciasDisponibles: boolean = true;

  /**
   * @descripcion
   * Indica si hay mercancías disponibles en la tabla.
   */
  mercanciasDisponiblesTabla: boolean = true;

  /**
 * @property {ElementRef} modifyModal
 * @description
 * Referencia al elemento del modal de modificación en la plantilla HTML.
 * Se utiliza para inicializar y controlar la instancia del modal de modificación desde el componente.
 */
  @ViewChild('modifyModal', { static: true }) modifyModal!: ElementRef;

  /**
* @property {ElementRef} buscarMercanciaModal
* @description
* Referencia al elemento del modal de búsqueda de mercancía en la plantilla HTML.
* Se utiliza para controlar la apertura y cierre del modal desde el componente.
*/
  @ViewChild('buscarMercanciaModal', { static: true }) buscarMercanciaModal!: ElementRef;

  /**
   * @property {CertificadoDeOrigenComponent} certificadoDeOrigen
   * @description
   * Referencia al componente hijo `CertificadoDeOrigenComponent`.
   * Permite acceder a los métodos y propiedades del componente de certificado de origen desde el componente padre.
   */
  @ViewChild('certificadoDeOrigen') certificadoDeOrigen!: CertificadoDeOrigenComponent;

  /**
   * Constructor del componente.
   * Inicializa el formulario y las dependencias necesarias para la carga de datos.
   * @param fb FormBuilder para la creación del formulario reactivo.
   * @param store Store para gestionar los datos de estado.
   * @param tramiteQuery Consulta de estado para obtener los valores del formulario.
   * @param certificadoService Servicio para la gestión de los certificados.
   * @param toastr Servicio de notificaciones para mostrar mensajes.
   * @param seccionQuery Consulta para obtener el estado de la sección.
   * @param seccionStore Store para actualizar el estado de la sección.
   */
  private actualizandoFormulario = false;

  /**
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   * Cuando es verdadero, los controles del formulario estarán deshabilitados.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado de selección de la tabla.
   * @type {boolean}
   */
  tablaSeleccionEvent: boolean = false;

  /**
   * Indica si los datos de la mercancía provienen del listado de mercancías disponibles.
   * 
   * @type {boolean}
   * @default false
   * 
   * @example
   * // true: el usuario seleccionó una mercancía desde la lista disponible
   * // false: la mercancía se está agregando manualmente
   * this.fromMercanciasDisponibles = true;
   */
  fromMercanciasDisponibles: boolean = false;

  /**
   * Observable que emite los datos de la mercancia en formato tabla.
   * @type {Observable<Mercancia[]>}
   */
  datosTabla$: Observable<Mercancia[]> = of([]);

  /**
   * @property {number} idProcedimiento
   * @description
   * Identificador numérico del procedimiento actual para el trámite 110204.
   * Se utiliza para configurar y asociar el proceso en los componentes y servicios relacionados.
   */
  idProcedimiento: number = IDPROCEDIMIENTO
  /**
   * @descripcion
   * Abre el modal de modificación con los datos proporcionados.
   * @param datos1 - Los datos de la mercancía a modificar.
   * @param fromMercanciasDisponibles - Indica si los datos provienen de las mercancías disponibles.
   */
  isEnableMercancia: boolean = false;
  /**
   * Constructor del componente CertificadoOrigenComponent.
   * Inicializa las dependencias necesarias para la gestión de certificados de origen.
   * 
   * @param fb FormBuilder para la creación y gestión de formularios reactivos.
   * @param store Store para manejar el estado del trámite 110204.
   * @param tramiteQuery Query para consultar el estado del trámite 110204.
   * @param certificadoService Servicio para la gestión de certificados de origen.
   * @param toastr Servicio para mostrar notificaciones al usuario.
   * @param seccionQuery Query para consultar el estado de la sección.
   * @param seccionStore Store para manejar el estado de la sección.
   * @param consultaQuery Query para consultar el estado de consulta.
   */
  constructor(
    private fb: FormBuilder,
    private store: Tramite110204Store,
    public tramiteQuery: Tramite110204Query,
    public certificadoService: CertificadosOrigenGridService,
    private toastr: ToastrService,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    public consultaQuery: ConsultaioQuery,
    public cdr: ChangeDetectorRef
  ) {

    /**
     * Suscripción para cargar los valores del formulario desde el store.
     */
    this.tramiteQuery.formCertificado$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(estado => {
      if (!this.actualizandoFormulario && estado) {
        this.actualizandoFormulario = true;
        this.formCertificado = estado;
        this.actualizandoFormulario = false;
      }
    });


    /**
     * Suscripción al estado de la sección para obtener y actualizar el estado.
     */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccion = seccionState;
        })
      )
      .subscribe();

    /**
     * Asignación de los observables que contienen los catálogos de estados y países.
     */
    this.estados$ = this.tramiteQuery.selectAltaPlanta$;
    this.pais$ = this.tramiteQuery.selectPaisBloque$;
    this.datos1 = (this.tramiteQuery.selectBuscarMercancia$ as Observable<Mercancia[]>).pipe(
      map((mercancias: Mercancia[]) => mercancias as unknown as Mercancia[])
    );

  }

  /**
   * Método del ciclo de vida ngOnInit. Se utiliza para cargar los datos iniciales
   * y suscribirse a los cambios en el formulario.
   */
  ngOnInit(): void {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.datosTabla$ = this.tramiteQuery.selectmercanciaTabla$;
  }
  /**
   *  @descripcion  
   * Actualiza el modal de modificación con los datos proporcionados.
   * @param datos1 
   * @param fromMercanciasDisponibles 
   */
  updatedModificarModal(
    datos1: Mercancia,
    fromMercanciasDisponibles: boolean
  ): void {
    this.datosSeleccionados = datos1;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;

    this.isEnableMercancia = true;

    this.store.setFormMercancia({ ...datos1 });
    this.store.setMercanciaTabla([datos1]);
  }

  /**
   * Establece el estado seleccionado en el store.
   * @param {Catalogo} estado El estado seleccionado.
   */
  tipoEstadoSeleccion(estado: Catalogo): void {
    this.store.setEstado(estado);
  }

  /**
   * Establece el bloque seleccionado en el store.
   * @param {Catalogo} estado El bloque seleccionado.
   */
  tipoSeleccion(estado: Catalogo): void {
    this.store.setBloque([estado]);
  }

  /**
   * Método del ciclo de vida ngOnDestroy. Se utiliza para cancelar las suscripciones y evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Busca la mercancia y actualiza los datos en el store.
   */
  buscarrMercancia(): void {
    const PAYLOAD = {
      rfcExportador: 'AAL0409235E6',
      tratadoAcuerdo: { idTratadoAcuerdo: this.formCertificado['entidadFederativa'] },
      pais: { cvePais: this.formCertificado['bloque'] || '' },
      fraccionArancelaria: this.formCertificado['fraccionArancelariaForm'] || '',
      numeroRegistro: this.formCertificado['registroProductoForm'] || null,
      nombreComercial: this.formCertificado['nombreComercialForm'] || '',
      fechaInicio: formatearFechaYyyyMmDd(this.formCertificado['fechaInicioInput'] as string) || "",
      fechaFin: formatearFechaYyyyMmDd(this.formCertificado['fechaFinalInput'] as string) || "",
    };

    this.certificadoService
      .buscarMercanciasCert(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          interface TratadoAplicable {
            nombreTratado?: string;
          }

          interface ResponseItem {
            idMercancia?: number | null;
            fraccionArancelaria?: string;
            numeroRegistro?: string;
            fechaExpedicion?: string;
            fechaVencimiento?: string;
            nombreTecnico?: string;
            nombreComercial?: string;
            fraccionNALADIClave?: string;
            fraccionNALADSA93Clave?: string;
            fraccionNALADISA96Clave?: string;
            fraccionNALADISA02Clave?: string;
            criterioOrigen?: string;
            porcentajeContenidoRegional?: string;
            tratadoAplicable?: TratadoAplicable;
            unidadMedida?: string;
          }

          interface ResponseType {
            datos?: ResponseItem[];
          }

          const MAPPED_DATA: Mercancia[] = ((response as ResponseType)?.datos ?? []).map((item: ResponseItem): Mercancia => ({
            id: item.idMercancia ?? undefined,
            fraccionArancelaria: item.fraccionArancelaria || '',
            numeroDeRegistrodeProductos: item.numeroRegistro || '',
            fechaExpedicion: item.fechaExpedicion || '',
            fechaVencimiento: item.fechaVencimiento || '',
            nombreTecnico: item.nombreTecnico || '',
            nombreComercial: item.nombreComercial || '',
            fraccionNaladi: item.fraccionNALADIClave || '',
            fraccionNaladiSa93: item.fraccionNALADSA93Clave || '',
            fraccionNaladiSa96: item.fraccionNALADISA96Clave || '',
            fraccionNaladiSa02: item.fraccionNALADISA02Clave || '',
            criterioParaConferirOrigen: item.criterioOrigen || '',
            valorDeContenidoRegional: item.porcentajeContenidoRegional || '',
            normaOrigen: item.tratadoAplicable?.nombreTratado || '',
            cantidad: '',
            umc: '',
            tipoFactura: '',
            valorMercancia: '',
            fechaFinalInput: '',
            numeroFactura: '',
            unidadMedidaMasaBruta: item.unidadMedida || '',
            complementoClasificacion: '',
            complementoDescripcion: '',
            nalad: '',
            fechaFactura: '',
            marca: '',
            nombreIngles: '',
            otrasInstancias: '',
            criterioParaTratoPreferencial: '',
            numeroDeSerie: '',
          }));


          this.store.setbuscarMercancia(MAPPED_DATA);
        },
        error: () => {
          this.toastr.error('Error al buscar Mercancia');
        },
      });
  }



  /**
   * @method abrirModalCargaPorArchivo
   * @description
   * Abre el modal de carga por archivo utilizando la instancia de `buscarModel`.
   * Si la instancia del modal existe, muestra el modal en la interfaz de usuario.
   * 
   * @returns {void}
   */
  abrirModalCargaPorArchivo(): void {
    if (this.buscarModel) {
      this.buscarModel.show();
    }
  }
  /**
 * Método para abrir el modal de modificación.
 */
  abrirModificarModal(datos1: Mercancia, fromMercanciasDisponibles: boolean): void {
    this.datosSeleccionados = datos1;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;
    this.isEnableMercancia = true;

    this.store.setFormMercancia({ ...datos1 });
    this.store.setMercanciaTabla([datos1]);

    this.cdr.detectChanges();
    this.modalInstance = new Modal(this.modifyModal.nativeElement);
    this.modalInstance.show();
  }

  /**
   * @method guardarClicado
   * @description
   * Actualiza el observable `datosTabla$` con el arreglo de mercancías recibido como parámetro.
   * Se utiliza para reflejar los datos seleccionados o modificados en la tabla de mercancías del componente.
   * 
   * @param {Mercancia[]} event - Arreglo de mercancías que se asigna al observable de la tabla.
   * @returns {void}
   */
  guardarClicado(event: Mercancia[]): void {
    this.datosTabla$ = of(event);
  }

  /**
   * Cierra el modal de modificación si está abierto.
   * 
   * @remarks
   * Este método verifica si hay una instancia de modal activa y, 
   * en caso afirmativo, la oculta.
   */
  cerrarModificarModal(): void {
    if (this.modalInstance) {
      this.tablaSeleccionEvent = true;
      this.modalInstance.hide();
    }
    this.isEnableMercancia = false;
  }

  /**
 * Establece el estado de validez del formulario en el store.
 * @param valida Indica si el formulario es válido o no.
 */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ certificado: valida });
  }

  /**
   * @descripcion
   * Actualiza el almacén con los datos del formulario de certificado.
   * @param event - Objeto que contiene el nombre del grupo de formulario, el campo, el valor y el nombre del estado del almacén.
   */
  setValoresStore(event: { formGroupName: string, campo: string, valor: undefined, storeStateName: string }): void {
    const { campo: CAMPO, valor: VALOR } = event;
    this.store.setFormCertificado({ [CAMPO]: VALOR });
  }
  /**
   * @method validarFormulario
   * @description
   * Valida el formulario de certificado de origen utilizando el componente hijo `CertificadoDeOrigenComponent`.
   * Retorna `true` si el formulario es válido, de lo contrario retorna `false`.
   * Si el componente hijo no está disponible, retorna `false`.
   *
   * @returns {boolean} Indica si el formulario es válido.
   */
  validarFormulario(): boolean {
    let isValid = true;
    if (this.certificadoDeOrigen) {
      if (!this.certificadoDeOrigen.validarFormularios()) {
        isValid = false;
      }
    } else {
      isValid = false;
    }
    return isValid;
  }

  /**
   * @inheritdoc
   * @method
   * @description
   * Este método se ejecuta después de que la vista del componente ha sido inicializada.
   * Inicializa el modal de modificación si está disponible.
   */
  ngAfterViewInit(): void {
     this.modalInstance = new Modal(this.modifyModal.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
    if (this.modifyModal) {
      this.modalInstance = new Modal(this.modifyModal.nativeElement);
    }
    if (this.buscarMercanciaModal) {
      this.buscarModel = new Modal(this.buscarMercanciaModal.nativeElement);
    }
  }

  /**
   * Emite los datos de una mercancía seleccionada o capturada y los almacena en el estado global.
   * 
   * Este método envuelve el objeto de tipo `Mercancia` en un arreglo y lo envía al store
   * mediante el método `setMercanciaTabla`, para actualizar la lista de mercancías.
   *
   * @param {Mercancia} evento - Objeto que contiene la información de la mercancía seleccionada o modificada.
   */
  emitmercaniasDatos(evento: Mercancia): void {
    this.store.setMercanciaTabla([evento]);
  }

}
