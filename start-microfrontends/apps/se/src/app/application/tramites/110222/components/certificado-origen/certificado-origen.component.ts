import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Catalogo,
  ConfiguracionColumna,
  SeccionLibQuery,
  SeccionLibState,
  SeccionLibStore,
} from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, delay, map, of, takeUntil } from 'rxjs';
import {
  Tramite110222State,
  Tramite110222Store,
} from '../../estados/tramite110222.store';
import { CARGA_MERCANCIA_EXPORT } from '../../../../shared/constantes/modificacion.enum';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ELEMENTOS_REQUERIDOS } from '../../constantes/peru-certificado.module';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Modal } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Tramite110222Query } from '../../estados/tramite110222.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';

/**
 * @descripcion
 * El componente `CertificadoOrigenComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el formulario de certificado de origen en el módulo PERU.
 */
@Component({
  selector: 'app-certificado-origen',
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.scss',
})
export class CertificadoOrigenComponent
  implements OnInit, AfterViewInit, OnDestroy {
  /** Referencia al componente CertificadoDeOrigenComponent para marcar campos como tocados */
  @ViewChild('certificadoDeOrigen')
  certificadoDeOrigen!: CertificadoDeOrigenComponent;
  /** Referencia al componente mercanciaComponent para marcar campos como tocados */
  @ViewChild('MercanciaComponent') mercanciaComponent?: MercanciaComponent;
  /**
   * Configuración de las columnas de la tabla de carga de mercancías.
   * Contiene la definición de cada columna utilizada para mostrar los datos de las mercancías.
   *
   * @type {ConfiguracionColumna<Mercancia>[]}
   */
  cargaMercanciaConfiguracionTabla: ConfiguracionColumna<Mercancia>[] =
    CARGA_MERCANCIA_EXPORT;

  /**
   * @descripcion
   * Lista de estados disponibles.
   */
  estado: Catalogo[] = [];

  /**
   * Indicates whether the domicile option is selected.
   * When set to `true`, the domicile is considered active or chosen.
   */
  domicilio: boolean = false;

  /**
   * Indicates the current language state.
   *
   * When `true`, the application is set to an alternate language (e.g., English).
   * When `false`, the default language is used (e.g., Spanish).
   */
  idioma: boolean = false;

  /**
   * @descripcion
   * Lista de países disponibles.
   */
  pais: Catalogo[] = [];

  /**
   * @descripcion
   * Lista de datos disponibles relacionados con mercancías.
   */
  disponiblesDatos: Mercancia[] = [];

  /**
   * @descripcion
   * Indica si el operador está activo.
   */
  operador: boolean = true;

  /**
   * @descripcion
   * Datos seleccionados para modificación.
   */
  datosSeleccionados!: Mercancia;

  /**
   * @descripcion
   * Instancia del modal de modificación.
   */
  modalInstance!: Modal;

  /**
   * @descripcion
   * Evento para indicar si se seleccionó una fila en la tabla.
   */
  tablaSeleccionEvent: boolean = true;

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
   * Observable para los datos de la tabla.
   */
  datosTablaUno$: Observable<Mercancia[]> = of([]);

  /**
   * @descripcion
   * Observable para los datos de la tabla.
   */
  datosTabla$: Mercancia[] = [];

  /**
   * @descripcion
   * Valores actuales del formulario de certificado.
   */
  formCertificadoValues!: { [key: string]: unknown };

  /**
   * @descripcion
   * Estado actual del certificado.
   */
  private certificadoState!: Tramite110222State;

  /**
   * @descripcion
   * Notificador para gestionar la destrucción de suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @descripcion
   * Estado actual de la sección.
   */
  private seccionState!: SeccionLibState;

  /**
   * @description
   * Lista de elementos requeridos para completar el formulario o proceso.
   */
  public readonly elementosRequeridos = ELEMENTOS_REQUERIDOS;

  /**
   * @descripcion
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /** Identificador del procedimiento actual. */
  idProcedimiento: number = 110222;
  /** Formulario reactivo para el registro. */
  registroForm!: FormGroup;

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
   * @descripcion
   * Constructor que inicializa los servicios y dependencias requeridas.
   * @param fb - Instancia de FormBuilder para gestionar formularios.
   * @param ValidarInicialmenteCertificadoService - Servicio para obtener datos relacionados con el certificado.
   * @param store - Almacén para gestionar el estado del formulario de certificado.
   * @param query - Consulta para obtener el estado del formulario.
   * @param seccionStore - Almacén para gestionar el estado de la sección.
   * @param seccionQuery - Consulta para obtener el estado de la sección.
   */
  constructor(
    private readonly fb: FormBuilder,
    public ValidarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService,
    public store: Tramite110222Store,
    public query: Tramite110222Query,
    public seccionStore: SeccionLibStore,
    public seccionQuery: SeccionLibQuery,
    public consultaQuery: ConsultaioQuery,
    private toastr: ToastrService
  ) {
    // this.query.formCertificado$
    //   .pipe(takeUntil(this.destroyNotifier$), delay(100))
    //   .subscribe((estado) => {
    //     this.formCertificadoValues = estado;
    //   });
  }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de inicializar el componente.
   * Obtiene los datos iniciales para el formulario.
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

    this.query.selectPeru$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state: Tramite110222State) => {
          this.certificadoState = state;
          this.formCertificadoValues = state.formCertificado || {};
          this.datosTabla$ = state.mercanciaTabla || [];
        })
      )
      .subscribe();

      
          // this.query.selectSolicitud$
          //   .pipe(
          //     takeUntil(this.destroyNotifier$),
          //     map((state: Solicituds110201State) => {
          //       this.certificadoState = state;
          //       this.formCertificadoValues = state.formCertificado || {};
          //       this.datosTabla$ = state.mercanciaTabla || [];
          //       this.datosTablaUno$ = state.disponiblesDatos || [];
          //     })
          //   )
          //   .subscribe();

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.query.selectTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state) => {
          this.certificadoState = state as Tramite110222State;
        })
      )
      .subscribe()
    // this.datosTablaUno$ = this.query.selectmercanciaTablaUno$ || ;
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
    this.store.setFormCertificadoGenric({ [CAMPO]: VALOR });
  }

  /**
   * @descripcion
   * Obtiene los datos disponibles relacionados con mercancías.
   */
  conseguirDisponiblesDatos(): void {
    setTimeout(() => {
      this.processBuscarMercancias();
    }, 100);
  }

  /**
   * @descripcion
   * Actualiza el almacén con los datos del formulario.
   * @param e - Los datos del formulario a almacenar.
   */
  obtenerDatosFormulario(e: unknown): void {
    this.store.setFormCertificado(
      e as { [key: string]: string | number | boolean | object | undefined }
    );
  }

  /**
   * @descripcion
   * Actualiza el almacén con el estado seleccionado.
   * @param estado - El estado seleccionado.
   */
  tipoEstadoSeleccion(estado: Catalogo): void {
    this.store.setEstado(estado);
  }

  /**
   * @descripcion
   * Actualiza el almacén con el bloque seleccionado.
   * @param estado - El bloque seleccionado.
   */
  tipoSeleccion(estado: Catalogo): void {
    this.store.setBloque(estado);
    this.store.setBloques(estado);
  }

  /*
    * @descripcion
    * Procesa la búsqueda de mercancías basándose en el estado y bloque seleccionados.
    */
  private processBuscarMercancias(): void {
    const SELECTED_ESTADO = this.certificadoState?.estado;
    const SELECTED_BLOQUE = this.certificadoState?.paisBloques;

    const PAYLOAD = {
      rfcExportador: 'AAL0409235E6',
      tratadoAcuerdo: {
        idTratadoAcuerdo: SELECTED_ESTADO?.id || SELECTED_ESTADO?.clave || '',
      },
      pais: { cvePais: SELECTED_BLOQUE?.id || SELECTED_BLOQUE?.clave || '' },
    };

    this.ValidarInicialmenteCertificadoService.buscarMercanciasCert(PAYLOAD)
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
              criterioParaConferirOrigen: item.criterioOrigen || '',
              valorDeContenidoRegional: item.valorDeContenidoRegional || '',
              normaOrigen: item.normaOrigen || '',
              otrasInstancias: item.otrasInstancias || '',
              criterioParaTratoPreferencial: item.criterioParaTratoPreferencial || '',
            })
          );
          this.datosTablaUno$ = of(MAPPED_DATA || []);

          this.store.setbuscarMercancia(MAPPED_DATA);
        },
        error: () => {
          // this.toastr.error('Error al buscar Mercancia');
        },
      });

    this.mercanciasDisponibles = true;
  }

  /**
   * @descripcion
   * Abre el modal de modificación con los datos seleccionados.
   * @param disponiblesDatos - Los datos seleccionados para modificación.
   */
  abrirModificarModal(
    disponiblesDatos: Mercancia,
    fromMercanciasDisponibles: boolean
  ): void {
    this.datosSeleccionados = disponiblesDatos;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;
    this.store.setFormMercancia({ ...disponiblesDatos });
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  /**
   * @descripcion
   * Cierra el modal de modificación.
   */
  cerrarModificarModal(): void {
    if (this.modalInstance) {
      this.tablaSeleccionEvent = true;
      this.modalInstance.hide();
    }
  }

  /**
   * @descripcion
   * Hook del ciclo de vida que se llama después de que la vista del componente se haya inicializado.
   * Inicializa el modal de modificación.
   */
  ngAfterViewInit(): void {
    if (this.modifyModal) {
      this.modalInstance = new Modal(this.modifyModal.nativeElement);
    }
  }

  /**
   * @descripcion
   * Actualiza el almacén con el estado de validación del formulario.
   * @param valida - El estado de validación del formulario.
   */
  setFormValida(valida: boolean): void {
    this.store.setFormValida({ certificado: valida });
  }
  /**
   * @descripcion
   * Método que actualiza el observable `datosTabla$` con un nuevo arreglo de objetos de tipo `Mercancia`.
   * @param {Mercancia[]} event - Arreglo de objetos de tipo `Mercancia` que han sido seleccionados o procesados.
   */
  guardarClicado(evento: Mercancia[]): void {
    this.datosTabla$ = evento;
    this.store.setmercanciaTabla(evento);
  }

  /**
   * Emite los datos de una mercancía seleccionada y los guarda en el store.
   *
   * @param {Mercancia} evento - Objeto que contiene la información de la mercancía seleccionada.
   * @returns {void}
   */
  emitmercaniasDatos(evento: Mercancia): void {
    this.store.setmercanciaTabla([evento]);
  }
  /**
   * @descripcion
   * Hook del ciclo de vida que se llama cuando el componente se destruye.
   * Limpia los recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}