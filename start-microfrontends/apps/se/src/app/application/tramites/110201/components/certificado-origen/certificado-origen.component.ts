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
  formatearFechaYyyyMmDd,
} from '@libs/shared/data-access-user/src';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  Solicituds110201State,
  Tramites110201Store,
} from '../../state/tramites110201.store';
import { Subject, map, takeUntil } from 'rxjs';
import { BuscarMercanciasResponse } from '../../enum/certificado.enum';
import { CARGA_MERCANCIA_EXPORT } from '../../../../shared/constantes/modificacion.enum';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Modal } from 'bootstrap';
import { Solocitud110201Service } from '../../services/service110201.service';
import { Tramites110201Query } from '../../state/tramites110201.query';

/**
 * @descripcion
 * El componente `CertificadoOrigenComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el formulario de certificado de origen en el módulo PERU.
 */
@Component({
  selector: 'app-certificado-origen',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MercanciaComponent, CertificadoDeOrigenComponent],
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.scss',
})
export class CertificadoOrigenComponent
  implements OnInit, AfterViewInit, OnDestroy {
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
   * Abre el modal de modificación con los datos proporcionados.
   * @param datos1 - Los datos de la mercancía a modificar.
   * @param fromMercanciasDisponibles - Indica si los datos provienen de las mercancías disponibles.
   */
  isEnableMercancia: boolean = false;
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
  datosTablaUno$: Mercancia[] = [];

  /**
   * @descripcion
   * Valores actuales del formulario de certificado.
   */
  formCertificadoValues!: { [key: string]: unknown };

  /**
   * @descripcion
   * Estado actual del certificado.
   */
  private certificadoState!: Solicituds110201State;

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
  public idProcedimiento = 110201;

  /**
   * Configuración de las columnas de la tabla de carga de mercancías.
   * Contiene la definición de cada columna utilizada para mostrar los datos de las mercancías.
   *
   * @type {ConfiguracionColumna<Mercancia>[]}
   */
  cargaMercanciaConfiguracionTabla: ConfiguracionColumna<Mercancia>[] = CARGA_MERCANCIA_EXPORT;

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
   * Referencia al componente hijo CertificadoDeOrigenComponent
   * Permite acceder al formulario y métodos del componente hijo
   */
  @ViewChild(CertificadoDeOrigenComponent)
  certificadoDeOrigenComponent!: CertificadoDeOrigenComponent;
  /**
   * @descripcion
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: true }) modifyModal!: ElementRef;

  /**
   * @descripcion
   * Constructor que inicializa los servicios y dependencias requeridas.
   * @param fb - Instancia de FormBuilder para gestionar formularios.
   * @param solicitudService - Servicio para obtener datos relacionados con el certificado.
   * @param store - Almacén para gestionar el estado del formulario de certificado.
   * @param query - Consulta para obtener el estado del formulario.
   * @param seccionStore - Almacén para gestionar el estado de la sección.
   * @param seccionQuery - Consulta para obtener el estado de la sección.
   */
  constructor(
    private readonly fb: FormBuilder,
    private solicitudService: Solocitud110201Service,
    private store: Tramites110201Store,
    private query: Tramites110201Query,
    private seccionQuery: SeccionLibQuery,
    public consultaQuery: ConsultaioQuery,
    public cdr: ChangeDetectorRef
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
        map((state: Solicituds110201State) => {
          this.certificadoState = state;
          this.formCertificadoValues = state.formCertificado || {};
          this.datosTabla$ = state.mercanciaTabla || [];
          this.datosTablaUno$ = state.disponiblesDatos || [];
        })
      )
      .subscribe();
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
    this.store.setmercanciaTabla([datos1]);
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
      tratadoAcuerdo: { idTratadoAcuerdo: this.certificadoState.formCertificado?.['entidadFederativa'] || '105' },
      pais: { cvePais: this.certificadoState.formCertificado?.['bloque'] || "ARG" },
      fraccionArancelaria: this.certificadoState.formCertificado?.['fraccionArancelariaForm'] || '',
      numeroRegistro: this.certificadoState.formCertificado?.['registroProductoForm'] || null,
      nombreComercial: this.certificadoState.formCertificado?.['nombreComercialForm'] || '',
      fechaInicio: formatearFechaYyyyMmDd(this.certificadoState.formCertificado?.['fechaInicioInput'] as string) || "",
      fechaFin: formatearFechaYyyyMmDd(this.certificadoState.formCertificado?.['fechaFinalInput'] as string) || "",
    };

    this.solicitudService
      .buscarMercanciasCert(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe({
        next: (res) => {
          const RESPONSE = res as unknown as BuscarMercanciasResponse;

          const MAPPED_DATA: Mercancia[] = (RESPONSE.datos ?? []).map((item) => ({
            id: item.idMercancia,
            fraccionArancelaria: item.fraccionArancelaria || '',
            numeroRegistroProducto: item.numeroRegistroProducto || '',
            fechaExpedicion: item.fechaExpedicion || '',
            fechaVencimiento: item.fechaVencimiento || '',
            nombreTecnico: item.nombreTecnico || '',
            nombreComercial: item.nombreComercial || '',
            criterioParaConferirOrigen: item.criterioOrigen || '',
            valorDeContenidoRegional: item.valorContenidoRegional || '',
            normaOrigen: item.normaOrigen || '',
            nombreIngles: item.nombreIngles || '',
          }));

          this.disponiblesDatos = MAPPED_DATA;
          this.store.setDisponsiblesDatos(MAPPED_DATA);
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
    this.store.setBloque(estado.descripcion);
  }

  /**
   * @descripcion
   * Abre el modal de modificación con los datos seleccionados.
   * @param disponiblesDatos - Los datos seleccionados para modificación.
   */
  abrirModificarModal(
    datos1: Mercancia,
    fromMercanciasDisponibles: boolean
  ): void {
    this.datosSeleccionados = datos1;
    this.fromMercanciasDisponibles = fromMercanciasDisponibles;

    this.isEnableMercancia = true;

    this.store.setFormMercancia({ ...datos1 });
    this.store.setmercanciaTabla([datos1]);

    this.cdr.detectChanges();
    this.modalInstance = new Modal(this.modifyModal.nativeElement);
    this.modalInstance.show();
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
    this.modalInstance = new Modal(this.modifyModal.nativeElement, {
      backdrop: 'static',
      keyboard: false
    });
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
