import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AlertComponent,
  Catalogo,
  CatalogosSelect,
  ConfiguracionColumna,
  Notificacion,
  NotificacionesComponent,
  Pedimento,
  TablaDinamicaComponent,
  TablaSeleccion,
  TableComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';

import {
  CatalogoSelectComponent,
  InputRadioComponent,
} from '@libs/shared/data-access-user/src';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';

import {
  MERCANICA_CONFIGURACION,
  SALDO_PENDIENTE_NOTIFICACION,
} from '../../constantes/constantes';
import {
  Solicitud220502State,
  Solicitud220502Store,
} from '../../estados/tramites220502.store';
import { Subject, map, takeUntil } from 'rxjs';
import { AgregarMercanciaComponent } from '../agregar-mercancia/agregar-mercancia.component';
import { CommonModule } from '@angular/common';
import { DatosDeMercancias } from '../../models/solicitud-pantallas.model';
import { MercanciaTabla } from '../../models/medio-transporte.model';
import { Modal } from 'bootstrap';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/solicitud-pantallas.enum';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


/**
 * Componente para gestionar los datos del medio de transporte.
 */
@Component({
  selector: 'app-medio-transporte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TableComponent,
    InputRadioComponent,
    TooltipModule,
    AlertComponent,
    TablaDinamicaComponent,
    AgregarMercanciaComponent,
    NotificacionesComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (): ControlContainer =>
        inject<ControlContainer>(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './medio-transporte.component.html',
  styleUrl: './medio-transporte.component.scss',
})
/**
 * Componente para gestionar los datos del medio de transporte
 */
export class MedioTransporteComponent implements OnInit, OnDestroy, OnChanges {
  /** Propiedad de entrada para identificar la clave de control en el formulario principal */
  @Input() claveDeControl: string = '';

  /** Propiedad de entrada para contener datos relacionados con mercancia. */
  @Input() hMercanciaTabla: string[] = [];

  /** Propiedad de entrada para contener datos relacionados con mercancia. */
  @Input() dMercanciaBody: DatosDeMercancias[] = [];

  /** Propiedad de entrada para gestionar la selección del método de transporte. */
  @Input() mediodetransporte: CatalogosSelect = {} as CatalogosSelect;

  /**
   * @description
   * Índice de la mercancía seleccionada en la lista.
   *
   * El valor por defecto es `-1`, lo que indica que no hay
   * ninguna mercancía seleccionada inicialmente.
   */
  inputMercanciaSelection: number = -1;

  /** Inyectar el ControlContainer principal para administrar los controles de formulario */
  parentContainer = inject(ControlContainer);

  /** Getter para acceder al grupo de formularios principal */
  get grupoFormularioPadre(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }

  /** Tipo de selección en la tabla */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @description
   * Configuración de las columnas de la tabla de mercancías.
   *
   * Define la estructura, encabezados, visibilidad y propiedades de
   * cada columna que se mostrará en la vista de la tabla de mercancías.
   *
   * Se inicializa con la constante `MERCANICA_CONFIGURACION`,
   * que contiene la definición predeterminada de las columnas.
   */
  mercanciaConfiguracionColumnas: ConfiguracionColumna<MercanciaTabla>[] =
    MERCANICA_CONFIGURACION;

  /** Lista de domicilios seleccionados */
  @Input() mercanciaLista: MercanciaTabla[] = [] as MercanciaTabla[];

  /**
   * @description
   * Lista de mercancías seleccionadas por el usuario en la vista.
   *
   * Esta colección se utiliza para identificar sobre qué mercancías
   * se aplicarán acciones como la modificación de saldos o la validación.
   */
  mercanciaSeleccionLista: MercanciaTabla[] = [];

  /**
   * Valor seleccionado para el campo "¿Es solicitud ferros?".
   */
  esSolicitudFerrosValor!: string;

  /**
   * Opciones disponibles para el grupo de botones de radio.
   *
   * Estas opciones suelen representar valores como "Sí", "No", etc.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @description
   * Texto constante que representa el mensaje o clave para notificar
   * el saldo pendiente en la mercancía o pedimento.
   *
   * Se inicializa con el valor de la constante global/local
   * `SALDO_PENDIENTE_NOTIFICACION`.
   *
   * @type {string}
   * @example
   * ```ts
   * console.log(this.SALDO_PENDIENTE_NOTIFICACION);
   * // "Saldo pendiente por notificar"
   * ```
   */
  SALDO_PENDIENTE_NOTIFICACION: string = SALDO_PENDIENTE_NOTIFICACION;

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Elemento a eliminar de la tabla de pedimentos.
   */
  elementoParaEliminar!: number;

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  pedimentos: Array<Pedimento> = [];

  /**
   * Referencia al elemento del modal.
   */
  @ViewChild('modalModificarSaldoMercancia')
  modalModificarSaldoMercancia!: ElementRef<HTMLDivElement>;

  /**
   * @description
   * Instancia del modal utilizada para mostrar u ocultar las ventanas emergentes
   * relacionadas con la gestión de mercancías.
   *
   * Esta propiedad se inicializa dinámicamente al crear el modal con:
   * ```ts
   * this.MODAL_INSTANCE = new Modal(this.modalModificarSaldoMercancia.nativeElement);
   * ```
   *
   * @type {Modal}
   */
  MODAL_INSTANCE!: Modal;
  /**
   * Datos utilizados para renderizar la tabla.
   *
   * Contiene encabezados (`tableHeader`) y filas de contenido (`tableBody`).
   */
  tableData = {
    tableBody: [],
    tableHeader: [],
  };

  /**
   * Variable que almacena el estado actual de la solicitud.
   * Se inicializa como un objeto vacío de tipo `Solicitud220502State`.
   */
  solicitud220502State: Solicitud220502State = {} as Solicitud220502State;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * @constructor
   * Inyecta las dependencias necesarias para gestionar y consultar el estado de la solicitud 220502.
   *
   * @param solicitud220502Query - Servicio Query para consultar el estado de la solicitud 220502.
   * @param solicitud220502Store - Store que gestiona y actualiza el estado de la solicitud 220502.
   */
  constructor(
    public solicitud220502Query: Solicitud220502Query,
    public solicitud220502Store: Solicitud220502Store,
     private solicitudService: SolicitudPantallasService,
  ) {
    /** Inyectar el ControlContainer principal para administrar los controles de formulario */
  }

  /**
   * Gancho de ciclo de vida que inicializa el componente.
   * Agrega un control de formulario dinámico al formulario principal
   */
  ngOnInit(): void {
    if (this.claveDeControl) {
      // Agregar un nuevo FormGroup dinámicamente al formulario principal
      this.grupoFormularioPadre.addControl(
        this.claveDeControl,
        new FormGroup({
          transporteIdMedio: new FormControl(
            this.solicitud220502State.transporteIdMedio,
            [Validators.required]
          ),
          identificacionTransporte: new FormControl(
            this.solicitud220502State.identificacionTransporte,
            [Validators.maxLength(30)]
          ),
          esSolicitudFerros: new FormControl(
            this.solicitud220502State.esSolicitudFerros,
            [Validators.required]
          ),
          totalDeGuiasAmparadas: new FormControl(
            this.solicitud220502State.totalDeGuiasAmparadas,
            [Validators.maxLength(50)]
          ),
        })
      );
    }

    this.solicitud220502Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((res: Solicitud220502State) => {
          this.solicitud220502State = res;
          const FORM_GROUP = this.grupoFormularioPadre.get(
            this.claveDeControl
          ) as FormGroup;
          if (FORM_GROUP) {
            FORM_GROUP.patchValue({
              transporteIdMedio: this.solicitud220502State.transporteIdMedio,
              identificacionTransporte:
                this.solicitud220502State.identificacionTransporte,
              esSolicitudFerros: this.solicitud220502State.esSolicitudFerros,
              totalDeGuiasAmparadas:
                this.solicitud220502State.totalDeGuiasAmparadas,
            });
          }
        })
      )
      .subscribe();

    if (this.formularioDeshabilitado) {
      this.grupoFormularioPadre.disable();
    }
  }
  /**
   * compo doc
   * @method enCambioDeValor
   * @description Actualiza el valor seleccionado.
   * @param {string | number} value - Nuevo valor seleccionado.
   *
   * Este método es para la etiqueta de radio de producto.
   */
  enCambioDeValor(value: string | number): void {
    this.solicitud220502Store.setEsSolicitudFerros(value);
  }

  /**
   * Maneja los cambios en las propiedades de entrada y actualiza los datos de la tabla en consecuencia.
   * @param {SimpleChanges} changes - Objeto que contiene las propiedades modificadas.
   *
   */
  ngOnChanges(changes: SimpleChanges): void {
    const TBODYKEY = 'hMercanciaTabla';
    const TBODYDATA = 'dMercanciaBody';
    if (changes[TBODYKEY]?.currentValue) {
      this.tableData.tableHeader = changes[TBODYKEY]?.currentValue;
    }
    if (changes[TBODYDATA]?.currentValue) {
      this.tableData.tableBody = changes[TBODYDATA]?.currentValue;
    }
  }

  /**
   * Maneja la selección de un método de transporte.
   * Actualiza el formulario con la descripción del transporte seleccionado.
   * @param e - El artículo del catálogo seleccionado que representa el método de transporte.
   */
  seleccionMedioDeTransporte(e: Catalogo): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre?.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre?.controls[this.claveDeControl].patchValue({
        transporteIdMedio: e.descripcion,
      });
    }
  }
  /**
   * Actualiza el medio de transporte en el estado de la solicitud.
   *
   * @param event - Objeto de tipo Catalogo que contiene el identificador del medio de transporte.
   */
  setTransporteIdMedio(event: Catalogo): void {
    this.solicitud220502Store.setTransporteIdMedio(event.clave??'');
  }

  /**
   * Actualiza la identificación del transporte en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene la identificación del transporte.
   */
  setIdentificacionTransporte(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.solicitud220502Store.setIdentificacionTransporte(VALUE);
  }

  /**
   * Actualiza el total de guías amparadas en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene el número total de guías amparadas.
   */
  setTotalDeGuiasAmparadas(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.solicitud220502Store.setTotalDeGuiasAmparadas(VALUE);
  }

  /**
   * @description
   * Obtiene la lista de mercancías seleccionadas desde la vista y la asigna
   * a la propiedad `mercanciaSeleccionLista` del componente.
   *
   * @param {MercanciaTabla[]} evento - Arreglo de mercancías seleccionadas.
   *
   * @example
   * ```ts
   * this.obtenerMercanciaLista([{ id: 1, nombre: 'Producto A' }]);
   * // Resultado: this.mercanciaSeleccionLista contendrá el objeto de 'Producto A'
   * ```
   */
  obtenerMercanciaLista(evento: MercanciaTabla[]): void {
    this.mercanciaSeleccionLista = evento;
  }

  /**
   * @description
   * Permite modificar los saldos de las mercancías seleccionadas.
   *
   * - Si no hay mercancías seleccionadas pero existe al menos una en la lista general,
   *   muestra un modal con el mensaje **"Seleccione una mercancía"** y agrega un objeto
   *   de pedimento con valores iniciales.
   *
   * - Si existen mercancías seleccionadas y el modal está disponible, abre el modal
   *   para modificar el saldo de la mercancía seleccionada.
   */
  modificarSaldosMercancia(): void {
    if (
      this.mercanciaSeleccionLista.length === 0 &&
      this.mercanciaLista.length > 0
    ) {
      const PEDIMENTO = {
        patente: 0,
        pedimento: 0,
        aduana: 0,
        idTipoPedimento: 0,
        descTipoPedimento: 'Por evaluar',
        numero: '',
        comprobanteValor: '',
        pedimentoValidado: false,
      };
      this.abrirModal('Seleccione una mercancía');
      this.pedimentos.push(PEDIMENTO);
    } else {
      if (
        this.modalModificarSaldoMercancia &&
        this.mercanciaSeleccionLista.length > 0
      ) {
        this.MODAL_INSTANCE = new Modal(
          this.modalModificarSaldoMercancia.nativeElement
        );
        this.MODAL_INSTANCE.show();
      }
    }
  }
    /**
 * Selecciona una mercancía y la agrega a la lista en el store.
 * @param item Objeto de tipo MercanciaTabla que será agregado a la lista.
 */
seleccionarMercancia(item: MercanciaTabla[]): void {
  this.solicitud220502Store.setMercanciaLista(item);
}

  /**
   * @description
   * Actualiza un elemento de tipo `MercanciaTabla` dentro de la lista `mercanciaLista`.
   *
   * - Si el evento existe y se encuentra en la lista (comparando por `id`),
   *   se agrega una nueva copia de dicho elemento a la lista.
   * - Posteriormente se cierra la instancia del modal (`MODAL_INSTANCE`).
   *
   * @param {MercanciaTabla | undefined} evento - Objeto de mercancía recibido desde la vista o evento.
   */
  actualizarMercanciaEnTabla(evento: MercanciaTabla | undefined): void {
    if (evento) {
      const INDEX = this.mercanciaLista.findIndex(
        (item) => item.id === evento.id
      );
      if (INDEX !== -1) {
        this.mercanciaLista[INDEX] = {
          ...this.mercanciaLista[INDEX],
          ...evento,
        };
      }
      this.mercanciaLista = [...this.mercanciaLista];
         this.seleccionarMercancia(this.mercanciaLista )
    }
    this.inputMercanciaSelection = -1;
    this.mercanciaSeleccionLista = [];
    this.MODAL_INSTANCE.hide();
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   *
   * @param {number} i - El índice del elemento a eliminar.
   *
   * @remarks
   * Después de eliminar el elemento, se actualiza el título y mensaje del modal,
   * y se abre el modal para mostrar un aviso al usuario.
   */
  abrirModal(mensaje: string, i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };

    this.elementoParaEliminar = i;
  }

  /**
   * Elimina un elemento de la tabla de pedimento, si se confirma la acción.
   * @param borrar Indica si se debe proceder con la eliminación.
   * @returns {void}
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }
  /**
 * Marca todos los controles del FormGroup como tocados y sucios.
 */
  marcarControlesComoTocados(): void {
    const FORMGROUP = this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup;
  
    if (!FORMGROUP) {
      return;
    }
  
    const CONTROLS = FORMGROUP.controls as { [key: string]: AbstractControl };
  
    Object.values(CONTROLS).forEach(control => {
      control.markAsTouched({ onlySelf: true });
      control.markAsDirty({ onlySelf: true });
      control.updateValueAndValidity();
    });
  }
  

  /**
   * Gancho de ciclo de vida que limpia el componente.
   * Elimina el control de formulario dinámico del formulario principal.
   */
  ngOnDestroy(): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre?.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre?.removeControl(this.claveDeControl);
    }
  }
}
