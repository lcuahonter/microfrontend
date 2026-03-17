import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Catalogo,
  ConsultaioQuery,
  InputFecha,
  SeccionLibQuery,
  SeccionLibState,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';
import { CargaPorArchivoComponent } from '../../../../shared/components/carga-por-archivo/carga-por-archivo.component';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CommonModule } from '@angular/common';
import { IDPROCEDIMIENTO } from '../../constantes/peru-certificado.model';

import { ConfiguracionColumna, Mercancia } from '../../../../shared/models/modificacion.enum';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Modal } from 'bootstrap';

import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Tramite110221Query } from '../../estados/tramite110221.query';

import { Tramite110221State, Tramite110221Store } from '../../estados/tramite110221.store';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';

import { CARGA_MERCANCIA_EXPORT } from '../../../../shared/constantes/modificacion.enum';

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
    ReactiveFormsModule,
    CommonModule,
    MercanciaComponent,
    CertificadoDeOrigenComponent,
    CargaPorArchivoComponent,
  ],
  providers: [ToastrService, ValidarInicialmenteCertificadoService],
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.scss',
})
export class CertificadoOrigenComponent
  implements OnInit, OnDestroy, AfterViewInit
{
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
  formCertificado!: {
    [key: string]: undefined | boolean | string | number | object;
  };

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
 
   pais: Catalogo[] = [];

  /**
   * Estado seleccionado del catálogo.
   * @type {Catalogo}
   */
  estado: Catalogo[] = [];

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
   * Indica si la información de la mercancía proviene del listado de mercancías disponibles.
   *
   * Cuando es `true`, significa que el usuario seleccionó la mercancía desde una lista precargada.
   * Cuando es `false`, la mercancía fue ingresada manualmente por el usuario.
   *
   * @type {boolean}
   * @default false
   */
  fromMercanciasDisponibles: boolean = false;

  /**
   * Observable que emite los datos de la mercancia obtenida.
   * @type {Observable<Mercancia[]>}
   */
  datos1: Observable<Mercancia[]>;

/**
 * Indica si el domicilio del tercer operador está presente.
 * @type {boolean}
 */
  domicilio: boolean = false;
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
  buscarModel!: Modal;

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
  mercanciasDisponiblesTabla: boolean = false;

  /**
   * @property {ElementRef} modifyModal
   * @description
   * Referencia al elemento del modal de modificación en la plantilla HTML.
   * Se utiliza para inicializar y controlar la instancia del modal de modificación desde el componente.
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;

  /**
   * @property {ElementRef} buscarMercanciaModal
   * @description
   * Referencia al elemento del modal de búsqueda de mercancía en la plantilla HTML.
   * Se utiliza para controlar la apertura y cierre del modal desde el componente.
   */
  @ViewChild('buscarMercanciaModal', { static: false })
  buscarMercanciaModal!: ElementRef;

  /**
   * @property {CertificadoDeOrigenComponent} certificadoDeOrigen
   * @description
   * Referencia al componente hijo `CertificadoDeOrigenComponent`.
   * Permite acceder a los métodos y propiedades del componente de certificado de origen desde el componente padre.
   */
  @ViewChild('certificadoDeOrigen')
  certificadoDeOrigen!: CertificadoDeOrigenComponent;
  /**
   * Configuración de las columnas para la tabla de carga de mercancías.
   */
  cargaMercanciaConfiguracionTabla: ConfiguracionColumna<Mercancia>[] = CARGA_MERCANCIA_EXPORT;

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
   * Observable que emite los datos de la mercancia en formato tabla.
   * @type {Observable<Mercancia[]>}
   */
  /**
   * @descripcion
   * Observable para los datos de la tabla.
   */
  datosTabla$: Mercancia[] = [];
/**
   * @descripcion
   * Estado actual de la sección.
   */
  private seccionState!: SeccionLibState;
  /**
   * @property {number} idProcedimiento
   * @description
   * Identificador numérico del procedimiento actual para el trámite 110221.
   * Se utiliza para configurar y asociar el proceso en los componentes y servicios relacionados.
   */
  idProcedimiento: number = IDPROCEDIMIENTO;
/**
   * @descripcion
   * Observable para los datos de la tabla.
   */
  datosTablaUno$: Observable<Mercancia[]> = of([]);
  /**
   * @property {Tramite110221State} certificadoState
   * @description
   * Estado del certificado de origen para el trámite 110221.
   */
  private certificadoState!: Tramite110221State;

  /**
   * Constructor del componente CertificadoOrigenComponent.
   * Inicializa las dependencias necesarias para la gestión de certificados de origen.
   *
   * @param fb FormBuilder para la creación y gestión de formularios reactivos.
   * @param store Store para manejar el estado del trámite 110221.
   * @param tramiteQuery Query para consultar el estado del trámite 110221.
   * @param certificadoService Servicio para la gestión de certificados de origen.
   * @param toastr Servicio para mostrar notificaciones al usuario.
   * @param seccionQuery Query para consultar el estado de la sección.
   * @param seccionStore Store para manejar el estado de la sección.
   * @param consultaQuery Query para consultar el estado de consulta.
   */
  constructor(
    private store: Tramite110221Store,
    public tramiteQuery: Tramite110221Query,
    public certificadoService: ValidarInicialmenteCertificadoService,
    private toastr: ToastrService,
        private query: Tramite110221Query,
    
    private seccionQuery: SeccionLibQuery,
    public consultaQuery: ConsultaioQuery
  ) {
    /**
     * Suscripción para cargar los valores del formulario desde el store.
     */
    this.tramiteQuery.formCertificado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
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
    this.datos1 = (
      this.tramiteQuery.selectBuscarMercancia$ as Observable<Mercancia[]>
    ).pipe(
      map((mercancias: Mercancia[]) => mercancias as unknown as Mercancia[])
    );
  }

  /**
   * Método del ciclo de vida ngOnInit. Se utiliza para cargar los datos iniciales
   * y suscribirse a los cambios en el formulario.
   */
ngOnInit(): void {
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.seccionState = seccionState;
        })
      )
      .subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.query.selectPeru$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state: Tramite110221State) => {
          this.certificadoState = state;
          this.datosTabla$ = state.mercanciaTabla;
        })
      )
      .subscribe();
    this.datosTablaUno$ = this.query.selectmercanciaTablaUno$;
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
    this.store.setBloque(estado);
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
    // Obtener los valores del catálogo seleccionados del estado de la tienda
    const SELECTED_ESTADO = this.certificadoState?.estado;
    const SELECTED_BLOQUE = this.certificadoState?.paisBloques;
    const PAYLOAD = {
      rfcExportador: 'AAL0409235E6',
      tratadoAcuerdo: {
        "idTratadoAcuerdo": SELECTED_ESTADO?.id || SELECTED_ESTADO?.clave || '',
      },
      pais: {
        "cvePais": SELECTED_BLOQUE?.id || SELECTED_BLOQUE?.clave || '',
      },
    };

    this.certificadoService
      .buscarMercanciasCert(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response: any) => {
          const MAPPED_DATA: Mercancia[] = (response?.datos ?? []).map(
            (item: any) => ({
              
              id: item.idMercancia,
              fraccionArancelaria: item.fraccionArancelaria || '',
              numeroDeRegistrodeProductos: item.numeroRegistroProducto || '',
              numeroRegistroProducto: item.numeroRegistroProducto || '',
              fechaExpedicion: item.fechaExpedicion || '',
              fechaVencimiento: item.fechaVencimiento || '',
              nombreTecnico: item.nombreTecnico || '',
              nombreComercial: item.nombreComercial || '',
              nombreIngles: item.nombreIngles || '',
              fraccionNaladi: item.fraccionNaladi || '',
              fraccionNaladiSa93: item.fraccionNaladiSa93 || '',
              fraccionNaladiSa96: item.fraccionNaladiSa96 || '',
              fraccionNaladiSa02: item.fraccionNaladiSa02 || '',
              criterioParaConferirOrigen: item.criterioOrigen || '',
              valorDeContenidoRegional: item.valorDeContenidoRegional || '',
              normaOrigen: item.normaOrigen || '',
              otrasInstancias: item.otrasInstancias || '',
              criterioParaTratoPreferencial: item.criterioParaTratoPreferencial || '',
              cantidad: '',
              umc: '',
              tipoFactura: '',
              valorMercancia: '',
              fechaFinalInput: '',
              numeroFactura: '',
              unidadMedidaMasaBruta: '',
              complementoClasificacion: '',
              complementoDescripcion: '',
              nalad: '',
              fechaFactura: '',
              marca: '',
              numeroDeSerie: '',
            })
          );
          this.datosTablaUno$ = of(MAPPED_DATA || []);
          this.store.setbuscarMercancia(MAPPED_DATA);
        },
       
      });

    this.mercanciasDisponibles = true;
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
  abrirModificarModal(
    datos1: Mercancia,
    fromMercanciasDisponibles: boolean
  ): void {
    this.datosSeleccionados = datos1;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;
    this.store.setFormMercancia({ ...datos1 });

    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }
  /**
   * @descripcion
   * Método que actualiza el observable `datosTabla$` con un nuevo arreglo de objetos de tipo `Mercancia`.
   * También actualiza el store para mantener la sincronización de datos entre componentes.
   * @param {Mercancia[]} evento - Arreglo de objetos de tipo `Mercancia` que han sido seleccionados o procesados.
   */
  guardarClicado(evento: Mercancia[]): void {
    this.datosTabla$ = evento;
    this.store.setmercanciaTabla(evento);
  }

  /**
   * Envía los datos de una mercancía al estado global (store) para su almacenamiento o actualización.
   *
   * Este método recibe un objeto de tipo `Mercancia`, lo encapsula dentro de un arreglo
   * y lo pasa al método `setmercanciaTabla` del store, con el fin de actualizar la lista
   * de mercancías en el estado de la aplicación.
   *
   * @param {Mercancia} evento - Objeto que contiene la información de la mercancía seleccionada o editada.
   */
  emitmercaniasDatos(evento: Mercancia): void {
    this.store.setmercanciaTabla([evento]);
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
  setValoresStore(event: {
    formGroupName: string;
    campo: string;
    valor: undefined;
    storeStateName: string;
  }): void {
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

* Función auxiliar para registrar errores de validación de campos.
* @param form - El objeto formulario que contiene los campos a validar.

*/
private logFieldErrors(form: FormGroup): void {
  if (!form || !form.controls) {
    console.error('Form object or controls are not available.');
    return;
  }


  Object.keys(form.controls).forEach((field) => {
    const CONTROL = form.get(field); // Get the control by field name
    if (CONTROL?.disabled) {
      console.warn(`Field "${field}" is disabled.`);
    } else if (CONTROL?.invalid) {
      console.error(`Field "${field}" is invalid. Errors:`, CONTROL.errors);
    } 
  });
}

  /**
   * @inheritdoc
   * @method
   * @description
   * Este método se ejecuta después de que la vista del componente ha sido inicializada.
   * Inicializa el modal de modificación si está disponible.
   */
  ngAfterViewInit(): void {
    // Inicializa el modal de modificación
    if (this.modifyModal) {
      this.modalInstance = new Modal(this.modifyModal.nativeElement);
    }
    if (this.buscarMercanciaModal) {
      this.buscarModel = new Modal(this.buscarMercanciaModal.nativeElement);
    }
  }
}
