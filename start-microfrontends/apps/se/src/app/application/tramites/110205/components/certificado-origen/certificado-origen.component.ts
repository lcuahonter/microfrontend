import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Catalogo, ConfiguracionColumna, SeccionLibQuery, SeccionLibState } from '@libs/shared/data-access-user/src';
import { Observable, Subject, delay, map, of, takeUntil } from 'rxjs';
import { Tramite110205State, Tramite110205Store } from '../../estados/tramite110205.store';
import { CARGA_MERCANCIA_EXPORT } from '../../../../shared/constantes/modificacion.enum';
import { CertificadoDeOrigenComponent } from '../../../../shared/components/certificado-de-origen/certificado-de-origen.component';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Mercancia } from '../../../../shared/models/modificacion.enum';
import { Modal } from 'bootstrap';
import { PeruCertificadoService } from '../../services/peru-certificado.service';
import { Tramite110205Query } from '../../estados/tramite110205.query';

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
  implements OnInit, AfterViewInit, OnDestroy
{
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
  datosTablaUno$: Observable<Mercancia[]> = of([]);

  /**
   * @descripcion
   * Valores actuales del formulario de certificado.
   */
  formCertificadoValues!: { [key: string]: unknown };

  /**
   * @descripcion
   * Estado actual del certificado.
   */
  private certificadoState!: Tramite110205State;

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
  public idProcedimiento = 110205;

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
   * Referencia al elemento del modal de modificación.
   */
  @ViewChild('modifyModal', { static: false }) modifyModal!: ElementRef;

  /**
   * @property {CertificadoDeOrigenComponent} certificadoDeOrigen
   * @description
   * Referencia al componente hijo `CertificadoDeOrigenComponent`.
   * Permite acceder a los métodos y propiedades del componente de certificado de origen desde el componente padre.
   */
  @ViewChild('certificadoDeOrigen')certificadoDeOrigen!:CertificadoDeOrigenComponent;

  /**
   * Indica si la tabla de mercancías disponibles está visible.
   * Cuando es `true`, la tabla se muestra en la interfaz de usuario.
   */
  mercanciasDisponiblesTabla: boolean = false;

  /**
   * Configuración de las columnas de la tabla de carga de mercancías.
   * Contiene la definición de cada columna utilizada para mostrar los datos de las mercancías.
   *
   * @type {ConfiguracionColumna<Mercancia>[]}
   */
  cargaMercanciaConfiguracionTabla: ConfiguracionColumna<Mercancia>[] = CARGA_MERCANCIA_EXPORT;

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
    private store: Tramite110205Store,
    private query: Tramite110205Query,
    private seccionQuery: SeccionLibQuery,
    public consultaQuery: ConsultaioQuery
  ) {
    this.query.formCertificado$
      .pipe(takeUntil(this.destroyNotifier$), delay(100))
      .subscribe((estado) => {
        this.formCertificadoValues = estado;
      });
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
        map((state: Tramite110205State) => {
          this.certificadoState = state;
          this.datosTabla$ = state.mercanciaTabla;
        })
      )
      .subscribe();
    this.datosTablaUno$ = this.query.selectmercanciaTablaUno$;
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
   * Inicia el proceso para buscar mercancías disponibles después de un breve retraso.
   *
   * Utiliza `setTimeout` para ejecutar el método `processBuscarMercancias` después de 100 milisegundos.
   * Esto puede ser útil para asegurar que ciertas operaciones previas hayan finalizado antes de realizar la búsqueda.
   */
  conseguirDisponiblesDatos(): void {
    setTimeout(() => {
      this.processBuscarMercancias();
    }, 100);
  }

  /**
   * @descripcion
   * Procesa la búsqueda de mercancías después de asegurar que los componentes estén inicializados.
   */
  private processBuscarMercancias(): void {
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
    this.peruCertificadoService
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
        error: () => {
          // this.toastr.error('Error al buscar Mercancia');
        },
      });

    this.mercanciasDisponibles = true;
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
   * Hook del ciclo de vida que se llama cuando el componente se destruye.
   * Limpia los recursos y suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}