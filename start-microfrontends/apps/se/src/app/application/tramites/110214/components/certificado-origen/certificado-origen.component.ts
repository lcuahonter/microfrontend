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
  ConfiguracionColumna,
  SeccionLibQuery,
  SeccionLibState,
} from '@libs/shared/data-access-user/src';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { Tramite110214State, Tramite110214Store } from '../../../../estados/tramites/tramite110214.store';
import { CARGA_MERCANCIA_EXPORT } from '../../../../shared/constantes/modificacion.enum';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { MercanciaComponent } from '../../../../shared/components/mercancia/mercancia.component';
import { Modal } from 'bootstrap';
import { PeruCertificadoService } from '../../../110205/services/peru-certificado.service';
import { Tramite110214Query } from '../../../../estados/queries/tramite110214.query';
import { ValidarInicialmenteCertificadoService } from '../../services/validar-inicialmente-certificado.service';

/**
 * @descripcion
 * El componente `CertificadoOrigenComponent` es responsable de gestionar los datos y las interacciones
 * relacionadas con el formulario de certificado de origen en el módulo PERU.
 */
@Component({
  selector: 'app-certificado-origen',
  standalone: true,
  imports:[CommonModule, ReactiveFormsModule,MercanciaComponent,CertificadoDeOrigenComponent],
  templateUrl: './certificado-origen.component.html',
  styleUrl: './certificado-origen.component.scss',
})
export class CertificadoOrigenComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Indica si el botón continuar ha sido activado para ejecutar las validaciones del formulario. */
  @Input() isContinuarTriggered: boolean = false;

  /** Referencia al componente 'CertificadoOrigenComponent' en la plantilla.
   * Proporciona acceso a sus métodos y propiedades.
   */
  @ViewChild('CertificadoDeOrigenComponent', { static: false }) certificadoDeOrigenComponent!: CertificadoDeOrigenComponent;

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
  private certificadoState!: Tramite110214State;

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
  public idProcedimiento = 110214; 

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
   * Constructor del componente.
   * Inicializa el formulario y las dependencias necesarias para la carga de datos.
   */
  private actualizandoFormulario = false;

  /**
   * @descripcion
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;

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
    private readonly fb: FormBuilder,
    private peruCertificadoService: PeruCertificadoService,
    private store: Tramite110214Store,
    private query: Tramite110214Query,
    private seccionQuery: SeccionLibQuery,
    public consultaQuery: ConsultaioQuery,
    private validarInicialmenteCertificadoService: ValidarInicialmenteCertificadoService
  ) {}

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
        map((state: Tramite110214State) => {
          this.certificadoState = state;
          this.datosTabla$ = state.mercanciaTabla;
          this.datosTablaUno$ = state.disponiblesDatos;
        })
      )
      .subscribe();

    /**
     * Suscripción para cargar los valores del formulario desde el store.
     */
    this.query.formCertificado$.pipe(
      takeUntil(this.destroyNotifier$)
    ).subscribe(estado => {
      if (!this.actualizandoFormulario && estado) {
        this.actualizandoFormulario = true;        
        this.formCertificadoValues=estado;
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
      rfcExportador: "AAL0409235E6", 
      tratadoAcuerdo: { idTratadoAcuerdo: this.certificadoState.formCertificado['entidadFederativa']},
      pais: { cvePais: this.certificadoState.formCertificado['bloque'] || 'ARG' }
    };
  
    this.validarInicialmenteCertificadoService.obtenerMercanciasDisponibles(PAYLOAD)
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((respuesta: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const DATOS = (respuesta as any).datos ?? [];

        const MAPPED_DATOS = DATOS.map((item: unknown) => {
          const TYPED_ITEM = item as {
            fraccionArancelaria?: string;
            nombreTecnico?: string;
            nombreComercial?: string;
            numeroRegistroProducto?: string;
            fechaExpedicion?: string;
            fechaVencimiento?: string;
          };
          return {
            fraccionArancelaria: TYPED_ITEM.fraccionArancelaria ?? '',
            nombreTecnico: TYPED_ITEM.nombreTecnico ?? '',
            nombreComercial: TYPED_ITEM.nombreComercial ?? '',
            numeroDeRegistrodeProductos: TYPED_ITEM.numeroRegistroProducto ?? '',
            fechaExpedicion: TYPED_ITEM.fechaExpedicion ?? '',
            fechaVencimiento: TYPED_ITEM.fechaVencimiento ?? '',
          };
        });

        this.store.setDisponsiblesDatos(MAPPED_DATOS);
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
    this.store.setFormValidity('certificadoOrigen', valida);
  }

  /**
   * Actualiza la lista de mercancías mostradas en la tabla y sincroniza el estado global.
   *
   * Este método recibe un arreglo de objetos `Mercancia` seleccionados o procesados,
   * actualiza el observable local `datosTabla$` y persiste los cambios en el store global
   * mediante el método `setmercanciaTabla`.
   *
   * @param {Mercancia[]} evento - Lista de mercancías seleccionadas o procesadas para mostrar y almacenar.
   */
  guardarClicado(evento: Mercancia[]): void {
    this.datosTabla$ = evento;
    this.store.setmercanciaTabla(evento);
  }

  /**
   * @description
   * Valida los campos principales del formulario de certificado.
   * Verifica que los campos `entidadFederativa` y `bloque` tengan valores válidos
   * (no vacíos ni nulos). Si ambos son válidos, retorna `true`.
   * En caso contrario, marca todos los controles del formulario como "touched"
   * y retorna `false`.
   *
   * @returns {boolean} `true` si el formulario es válido; `false` en caso contrario.
   */
  validarFormulario(): void { 
    this.certificadoDeOrigenComponent?.validarFormularios();
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
