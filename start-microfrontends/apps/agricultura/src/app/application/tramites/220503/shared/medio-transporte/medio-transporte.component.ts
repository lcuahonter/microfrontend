import { AlertComponent, Catalogo, ConfiguracionColumna,ConsultaioQuery, Notificacion, NotificacionesComponent, Pedimento , TablaDinamicaComponent, TablaSeleccion,} from '@ng-mf/data-access-user';

import { CatalogoSelectComponent, InputRadioComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatosDeMercancias, MercanciaTabla } from '../../models/solicitud-pantallas.model';

import { CatalogosSelect } from '@ng-mf/data-access-user';
import { CommonModule } from '@angular/common';

import { ControlContainer } from '@angular/forms';

import { ES_SOLICITUD_FERROS_VALOR } from '../../enums/texto-enum';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { Modal } from 'bootstrap';
import { OPCIONES_DE_BOTON_DE_RADIO } from '../../enums/solicitud-pantallas.enum';
import { OnChanges } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { Solicitud220503Query } from '../../estados/tramites220503.query';
import { Solicitud220503State } from '../../estados/tramites220503.store';
import { Solicitud220503Store } from '../../estados/tramites220503.store';
import { Subject } from 'rxjs';
import { TableComponent } from '@ng-mf/data-access-user';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

import { AgregarMercanciaComponent } from '../agregar-mercancia/agregar-mercancia.component';
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

  /** Tipo de selección en la tabla */
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;

  /**
   * @description
   * Configuración de las columnas de la tabla de mercancías.
   */
  mercanciaConfiguracionColumnas: ConfiguracionColumna<MercanciaTabla>[] = [
    {
      encabezado: 'Fracción arancelaria',
      clave: (item: MercanciaTabla) => item.fraccionArancelaria,
      orden: 1,
    },
    {
      encabezado: 'Descripción de la fracción',
      clave: (item: MercanciaTabla) => item.descripcionFraccion,
      orden: 2,
    },
    {
      encabezado: 'Nico',
      clave: (item: MercanciaTabla) => item.nico,
      orden: 3,
    },
    {
      encabezado: 'Descripción Nico',
      clave: (item: MercanciaTabla) => item.descripcion,
      orden: 4,
    },
    {
      encabezado: 'Unidad de medida de tarifa (UMT)',
      clave: (item: MercanciaTabla) => item.unidaddeMedidaDeUMT,
      orden: 5,
    },
    {
      encabezado: 'Cantidad total UMT',
      clave: (item: MercanciaTabla) => item.cantidadTotalUMT,
      orden: 6,
    },
    {
      encabezado: 'Saldo pendiente',
      clave: (item: MercanciaTabla) => item.saldoPendiente,
      orden: 7,
    },
  ];

  /** Lista de mercancías */
  @Input() mercanciaLista: MercanciaTabla[] = [] as MercanciaTabla[];

  /**
   * @description
   * Lista de mercancías seleccionadas por el usuario en la vista.
   */
  mercanciaSeleccionLista: MercanciaTabla[] = [];

  /**
   * Índice de la mercancía seleccionada en la lista.
   */
  inputMercanciaSelection: number = -1;

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
   */
  MODAL_INSTANCE!: Modal;

  /** Inyectar el ControlContainer principal para administrar los controles de formulario */
  parentContainer = inject(ControlContainer);

  /** Getter para acceder al grupo de formularios principal */
  get grupoFormularioPadre(): FormGroup {
    return this.parentContainer.control as FormGroup;
  }
  esSolicitudFerrosValor!: string;
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  tableData = {
    tableBody: [],
    tableHeader: [],
  };

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /**
   * Variable que almacena el estado actual de la solicitud.
   * Se inicializa como un objeto vacío de tipo `Solicitud220502State`.
   */
  solicitud220502State: Solicitud220503State = {} as Solicitud220503State;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();
 /**
   * Obtiene los datos de enumeración y establece valores de TEXTOS
   */
  /** Constante que almacena los textos utilizados en el componente.
    * Se importa desde el archivo `texto-enum.ts`.
    */
  ES_SOLICITUD_FERROS_VALOR = ES_SOLICITUD_FERROS_VALOR;

  enCambioValor: number | string = 0;
  constructor(
    public solicitud220503Query: Solicitud220503Query,
    public solicitud220503Store: Solicitud220503Store,
    private consultaioQuery: ConsultaioQuery,
  ) {
    /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Gancho de ciclo de vida que inicializa el componente.
   * Agrega un control de formulario dinámico al formulario principal
   */
  ngOnInit(): void {
   this.inicializarEstadoFormulario();
   
 
   this.solicitud220503Query.selectSolicitud$
     .pipe(
       takeUntil(this.destroyed$),
       map((res: Solicitud220503State) => {
         if (res.mercanciaLista && res.mercanciaLista.length > 0) {
           // Crear una nueva referencia del array para asegurar que Angular detecte el cambio
           this.mercanciaLista = [...res.mercanciaLista];
         } else if (res.mercanciaLista && res.mercanciaLista.length === 0) {
           // Si el array está vacío, también crear nueva referencia
           this.mercanciaLista = [];
         }
       })
     )
     .subscribe();
  }

  /**
   * Inicializa el formulario reactivo para capturar el valor de 'registro'.
   * Suscribe al estado almacenado en el store mediante el query `tramite301Query.selectSolicitud$`
   * y lo asigna a la variable local `solicitudState`. Luego, crea el formulario
   * con el valor inicial obtenido del store.
   */

  inicializarFormulario(): void {
     if (this.claveDeControl) {
      // Agregar un nuevo FormGroup dinámicamente al formulario principal
      this.grupoFormularioPadre.addControl(
        this.claveDeControl,
        new FormGroup({
          transporteIdMedio: new FormControl(
            this.solicitud220502State.transporteIdMedio || '',
            [Validators.required]
          ),
          identificacionTransporte: new FormControl(
            this.solicitud220502State.identificacionTransporte || ''
          ),
          esSolicitudFerros: new FormControl(
            this.solicitud220502State.esSolicitudFerros || 'no',
            [Validators.required]
          ),
          totalDeGuiasAmparadas: new FormControl(
            this.solicitud220502State.totalDeGuiasAmparadas || ''
          ),
        })
      );
    }

    this.solicitud220503Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((res: Solicitud220503State) => {
          this.solicitud220502State = res;
          const FORM_GROUP = this.grupoFormularioPadre.get(
            this.claveDeControl
          ) as FormGroup;
          if (FORM_GROUP) {
            FORM_GROUP.patchValue({
              transporteIdMedio: this.solicitud220502State.transporteIdMedio|| '',
              identificacionTransporte:
                this.solicitud220502State.identificacionTransporte || '',
              esSolicitudFerros: this.solicitud220502State.esSolicitudFerros || 'no',
              totalDeGuiasAmparadas:
                this.solicitud220502State.totalDeGuiasAmparadas || '',
            });
          }
        })
      )
      .subscribe();
if(this.esFormularioSoloLectura){
  (this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup).disable();
}
  }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }  
  }

    /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    
 
  this.inicializarFormulario();

  }


  /**
   * compo doc
   * @method enCambioDeValor
   * @description Actualiza el valor seleccionado.
   * @param {string | number} value - Nuevo valor seleccionado.
   *
   * Este método es para la etiqueta de radio de producto.
   */
  enCambioDeValor(value: number | string): void {
    this.enCambioValor = value;
    this.solicitud220503Store.setEsSolicitudFerros(value);
  }

  /**
   * Maneja los cambios en las propiedades de entrada y actualiza los datos de la tabla en consecuencia.
   * @param {SimpleChanges} changes - Objeto que contiene las propiedades modificadas.
   *
   */
  ngOnChanges(changes: SimpleChanges): void {
    const TBODYKEY = 'hMercanciaTabla';
    const TBODYDATA = 'dMercanciaBody';
    const MERCANCIALISTA = 'mercanciaLista';
    
    if (changes[TBODYKEY]?.currentValue) {
      this.tableData.tableHeader = changes[TBODYKEY]?.currentValue;
    }
    if (changes[TBODYDATA]?.currentValue) {
      this.tableData.tableBody = this.dMercanciaBody.map(item => ({
        tbodyData: [
          item.fraccionArancelaria,
          item.descripcionFraccion,
          item.nico,
          item.nicoDescripcion,
          item.cantidadSolicitadaUMT,
          item.unidadMedidaUMT,
          item.cantidadTotalUMT,
        ]
      })) as unknown as typeof this.tableData.tableBody;
    }
    if (changes[MERCANCIALISTA]?.currentValue) {
      // Crear una nueva referencia del array para asegurar que Angular detecte el cambio
      this.mercanciaLista = [...changes[MERCANCIALISTA].currentValue];
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
      this.grupoFormularioPadre.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre.controls[this.claveDeControl].patchValue({
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
    this.solicitud220503Store.setTransporteIdMedio(event.clave??'');
  }

  /**
   * Actualiza la identificación del transporte en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene la identificación del transporte.
   */
  setIdentificacionTransporte(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.solicitud220503Store.setIdentificacionTransporte(VALUE);
  }

  /**
   * Actualiza el total de guías amparadas en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene el número total de guías amparadas.
   */
  setTotalDeGuiasAmparadas(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    this.solicitud220503Store.setTotalDeGuiasAmparadas(VALUE);
  }
    validarFormularios(): boolean {
    const FORM_GROUP = this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup;
    if(FORM_GROUP.invalid){
      FORM_GROUP.markAllAsTouched();
      return false;
    }
    return FORM_GROUP ? FORM_GROUP.valid : false;
  }

  // Método público para asignar el transporteIdMedio desde el componente padre
  setTransporteIdMedioForm(transporteIdMedio: string): void {
    // Se obtiene el FormGroup dinámico usando la clave de control
    const FORM_GROUP = this.grupoFormularioPadre.get(
      this.claveDeControl
    ) as FormGroup;

    // Validar que el formulario exista
    if (!FORM_GROUP) {
      return;
    }

    // Se obtiene el FormControl específico
    const CONTROL = FORM_GROUP.get('transporteIdMedio') as FormControl;

    // Validar que el control exista
    if (!CONTROL) {
      return;
    }

    // Se asigna el valor directamente al FormControl
    CONTROL.setValue('MEDTRG.AE', {
      emitEvent: false // Evita ciclos con el store
    });
  }

  /**
   * @description
   * Obtiene la lista de mercancías seleccionadas desde la vista y la asigna
   * a la propiedad `mercanciaSeleccionLista` del componente.
   *
   * @param {MercanciaTabla[]} evento - Arreglo de mercancías seleccionadas.
   */
  obtenerMercanciaLista(evento: MercanciaTabla[]): void {
    this.mercanciaSeleccionLista = evento;
  }

  /**
   * @description
   * Permite modificar los saldos de las mercancías seleccionadas.
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
    this.solicitud220503Store.setMercanciaLista(item);
  }

  /**
   * @description
   * Actualiza un elemento de tipo `MercanciaTabla` dentro de la lista `mercanciaLista`.
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
      this.seleccionarMercancia(this.mercanciaLista);
    }
    this.inputMercanciaSelection = -1;
    this.mercanciaSeleccionLista = [];
    if (this.MODAL_INSTANCE) {
      this.MODAL_INSTANCE.hide();
    }
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
 * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
 * 
 * Si existe una clave de control y el grupo de formulario padre contiene ese control,
 * se elimina del formulario para evitar referencias innecesarias.
 * 
 * Además, se emite y completa el observable `destroyed$` para cancelar suscripciones activas
 * y liberar recursos.
 */
ngOnDestroy(): void {
  if (
    this.claveDeControl &&
    this.grupoFormularioPadre.contains(this.claveDeControl)
  ) {
    this.grupoFormularioPadre.removeControl(this.claveDeControl);
  }

  this.destroyed$.next();
  this.destroyed$.complete();
}

}
