import {
  AfterViewInit,
  ChangeDetectorRef,
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
} from '@libs/shared/data-access-user/src';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InsumosDisponibles, Mercancia } from '../../../../shared/models/modificacion.enum';
import {
  Solicitud110207State,
  Tramite110207Store,
} from '../../state/Tramite110207.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CARGA_MERCANCIA_EXPORT } from '../../../../shared/constantes/modificacion.enum';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Modal } from 'bootstrap';
import { RegistroService } from '../../services/registro.service';
import { ToastrService } from 'ngx-toastr';
import { Tramite110207Query } from '../../state/Tramite110207.query';

@Component({
  selector: 'app-certificado-origen',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CertificadoDeOrigenComponent,
    MercanciaComponent,
  ],
  providers: [ToastrService],
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.css',
})
export class CertificadoOrigenComponent
  implements OnInit, OnDestroy, AfterViewInit {

  /**
   * @descripcion
   * Abre el modal de modificación con los datos proporcionados.
   * @param datos1 - Los datos de la mercancía a modificar.
   * @param fromMercanciasDisponibles - Indica si los datos provienen de las mercancías disponibles.
   */
  isEnableMercancia: boolean = false;

  /**
   * @descripcion
   * Lista de estados disponibles.
   */
  estado: Catalogo[] = [];

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
  operador: boolean = false;

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
  datosTabla$: Mercancia[] = [];

  /**
   * @descripcion
   * Observable para los datos de la tabla.
   */
  datosTablaUno: Mercancia[] = [];

  /**
   * @descripcion
   * Valores actuales del formulario de certificado.
   */
  formCertificadoValues!: { [key: string]: unknown };

  /**
   * @descripcion
   * Estado actual del certificado.
   */
  private certificadoState!: Solicitud110207State;

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
   * @descripcion
   * Indica si el formulario se encuentra en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * @property {string} idProcedimiento
   * @description Identificador del procedimiento, utilizado para la gestión del trámite.
   */
  public idProcedimiento = 110207;

  /**
   * Configuración de las columnas de la tabla de carga de mercancías.
   * Contiene la definición de cada columna utilizada para mostrar los datos de las mercancías.
   *
   * @type {ConfiguracionColumna<Mercancia>[]}
   */
  cargaMercanciaConfiguracionTabla: ConfiguracionColumna<Mercancia>[] =
    CARGA_MERCANCIA_EXPORT;

  /**
   * Referencia al componente hijo CertificadoDeOrigenComponent
   * Permite acceder al formulario y métodos del componente hijo
   */
  @ViewChild(CertificadoDeOrigenComponent)
  certificadoDeOrigenComponent!: CertificadoDeOrigenComponent;

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

  tableInsumosData: InsumosDisponibles[] = [];

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
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: true }) modifyModal!: ElementRef;

  /**
   * Formulario reactivo utilizado para la gestión de los datos del certificado.
   * @type {FormGroup}
   */
  formCertificado!: {
    [key: string]: undefined | boolean | string | number | object;
  };

  /**
   * @descripcion
   * Constructor que inicializa los servicios y dependencias requeridas.
   * @param fb - Instancia de FormBuilder para gestionar formularios.
   * @param peruCertificadoService - Servicio para obtener datos relacionados con el certificado.
   * @param store - Almacén para gestionar el estado del formulario de certificado.
   * @param query - Consulta para obtener el estado del formulario.
   * @param seccionStore - Almacén para gestionar el estado de la sección.
   * @param seccionQuery - Consulta para obtener el estado de la sección.
   */
  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private store: Tramite110207Store,
    private query: Tramite110207Query,
    private toastr: ToastrService,
    private seccionQuery: SeccionLibQuery,
    public consultaQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef
  ) { }

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

    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((state: Solicitud110207State) => {
          this.certificadoState = state;
          this.datosTabla$ = state.mercanciaTabla;
          this.datosTablaUno = state.disponiblesDatos;

        })
      )
      .subscribe();

    this.query.formCertificado$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((estado) => {
        if (!this.actualizandoFormulario && estado) {
          this.actualizandoFormulario = true;
          this.formCertificado = estado as {
            [key: string]: string | number | boolean | object | undefined;
          };
          this.actualizandoFormulario = false;
        }
      });
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
    const PAYLOAD = {
      rfcExportador: 'AAL0409235E6',
      tratadoAcuerdo: {
        idTratadoAcuerdo: this.formCertificado['entidadFederativa'],
      },
      pais: { cvePais: this.formCertificado['bloque'] || '' },
    };

    this.registroService
      .buscarMercanciasCert(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (response) => {
          interface TratadoAplicable {
            nombreTratado?: string;
          }

          interface ResponseItem {
            idMercancia?: number | null;
            numeroRegistroProducto: string;
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

          const MAPPED_DATA: Mercancia[] = (
            (response as ResponseType)?.datos ?? []
          ).map(
            (item: ResponseItem): Mercancia => ({
              id: item.idMercancia ?? undefined,
              fraccionArancelaria: item.fraccionArancelaria || '',
              numeroRegistroProducto: item.numeroRegistroProducto || '',
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
            })
          );
          this.store.setDisponsiblesDatos(MAPPED_DATA);
        },
        error: () => {
          this.toastr.error('Error al buscar Mercancia');
        },
      });
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
    this.store.setBloque([estado]);
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

    this.isEnableMercancia = true;

    if(this.certificadoState?.formCertificado?.['bloque']==='JPN'){
      this.conseguirInsumosDisponiblesDatos();
    }

    this.cdr.detectChanges();
    this.modalInstance = new Modal(this.modifyModal.nativeElement);
    this.modalInstance.show();
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
  }

  /**
   * @descripcion
   * Cierra el modal de modificación.
   */
  cerrarModificarModal(): void {
    this.tablaSeleccionEvent = true;
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.isEnableMercancia = false;
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
   * @param {Mercancia[]} evento - Arreglo de objetos de tipo `Mercancia` que han sido seleccionados o procesados.
   */
  guardarClicado(evento: Mercancia[]): void {
    this.datosTabla$ = evento;
  }

  /**
   * Método público para validar todos los formularios del componente datos-certificado.
   * Valida el formulario del componente hijo DatosCertificadoDeComponent y actualiza el estado.
   * @returns boolean indicando si todos los formularios son válidos
   */
  public validateAll(): boolean {
    let valid = true;

    // Validar el componente hijo datos-certificado-de
    if (this.certificadoDeOrigenComponent) {
      // Usar el método validarFormularios del componente hijo que marca los campos como touched
      const IS_CHILD_FORM_VALID = this.certificadoDeOrigenComponent.validarFormularios();
      if (!IS_CHILD_FORM_VALID) {
        valid = false;
      }
      // Actualizar el estado de validez en el store
      this.setFormValida(IS_CHILD_FORM_VALID);
    }

    return valid;
  }


  conseguirInsumosDisponiblesDatos(): void {
    const INSUMOS_DISPONIBLES: InsumosDisponibles[] = this.datosTablaUno.map(
      (item: Mercancia, index: number): InsumosDisponibles => ({
        id:index,
        nombre: item.nombreTecnico,
        fraccionArancelaria: item.fraccionArancelaria,
        originario: "no",
        cantidad: item.cantidad || "",
        idInsumo: "",
        numeroRegistro: "",
        idSolicitudInsumo: "",
      })
    );
    this.tableInsumosData = INSUMOS_DISPONIBLES;
    this.store.setInsumosDisponiblesTabla(INSUMOS_DISPONIBLES);
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
