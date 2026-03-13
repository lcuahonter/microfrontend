import {
  Catalogo,
  MSG_ELIMINA_ELEMENTO,
  MSG_SELECCIONA_REGISTRO,
  Notificacion,
  NotificacionesComponent,
  SoloNumerosDirective,
  TEXTO_CERRAR,
  TipoPedimentoService,
} from '@ng-mf/data-access-user';
import {
  ColumnMode,
  NgxDatatableModule,
  SelectionType,
} from '@swimlane/ngx-datatable';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  forwardRef,
  output,
} from '@angular/core';
import {
  DatosComponentePedimento,
  Pedimento,
} from '../../../../core/models/5701/tramite5701.model';

import { EMPTY, Subject, catchError, map, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MSG_ERROR_NO_PEDIMENTOS,
  MSG_NRO_PEDIMENTO,
  MSG_NRO_PEDIMENTO_LLENAR_DATOS,
  MSG_PEDIMENTO_EXISTE_PREVIO,
  MSG_PEDIMENTO_EXISTE_YA_PAGADO,
  MSG_PEDIMENTO_NO_VALIDO,
  MSG_PEDIMENTO_YA_CAPTURADO,
} from '../../../../core/enums/5701/mensajes-modal-5701.enum';

import {
  Solicitud5701State,
  Tramite5701Store,
} from '../../../../core/estados/tramites/tramite5701.store';
import { BodyEstadoPedimento } from '../../../../core/models/5701/pedimento.model';
import { CommonModule } from '@angular/common';
import { EstadoPedimentoService } from '../../../../core/services/5701/pedimento/estado-pedimento.service';
import { TITULO_MODAL_AVISO } from '@libs/shared/data-access-user/src/tramites/constantes/terceros.enums';
import { ToastrService } from 'ngx-toastr';
import { Tramite5701Query } from '../../../../core/queries/tramite5701.query';

/**
 * Componente responsable de gestionar la captura, validación y presentación
 * de datos relacionados con pedimentos aduanales en un formulario interactivo.
 * Permite seleccionar, editar y emitir eventos de cambios hacia componentes padres.
 */
@Component({
  selector: 'c-pedimento',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    forwardRef(() => SoloNumerosDirective),
    NotificacionesComponent,
    NgxDatatableModule,
  ],
  templateUrl: './pedimento.component.html',
  styleUrl: './pedimento.component.scss',
  providers: [ToastrService],
})

/**
 * Componente encargado de gestionar la lógica de captura, validación y emisión de datos
 * relacionados con los pedimentos aduanales dentro del trámite 5701.
 */
export class PedimentoComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Propiedades de entrada del componente.
   * validacion: Indica si la validación es correcta.
   */
  @Input({ required: true }) validacion!: boolean | undefined;

  /**
   * Propiedades de entrada del componente.
   * {datosNroPedimento: DatosComponentePedimento} Datos del número de pedimento.
   */
  @Input({ required: true }) datosNroPedimento!: DatosComponentePedimento;

  /**
   * Datos de la tabla de pedimentos.
   */
  @Input() tablaPedimento!: Pedimento[];

  /**
   * Emisor de eventos para la tabla de pedimentos.
   */
  @Input({ required: true }) numeroPatente!: string;

  /**
   * 
   * Indica si el componente es editable o no.
   * Por defecto es true.
   */
  @Input({ required: false }) editable?: boolean = true;

  /**
   * Flag para mostrar el mensaje de error desde el padre.
   */
  @Input() mostrarMensajeError?: boolean = false;

  /**
   * Se utiliza para emitir los datos de la tabla de pedimentos al componente padre.
   */
  @Output() datosTablaPedimento: EventEmitter<Pedimento[]> = new EventEmitter();

  /**
   * Estado de la solicitud 5701.
   */
  public solicitudState!: Solicitud5701State;

  /**
   * Subject para manejar la destrucción del componente y limpiar las suscripciones.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Emisor de eventos para validar los campos del formulario.
   * Se utiliza para emitir un evento cuando se requiere validar los campos del formulario.
   */
  validaCampos = output<void>();

  /**
   * Formulario reactivo para el componente de pedimento.
   * Se utiliza para manejar la validación y los valores del formulario.
   */
  public pedimentoForm: FormControl = new FormControl('', [
    Validators.maxLength(7),
  ]);

  /**
   * Array con los datos de los pedimentos.
   * Se utiliza para almacenar los pedimentos ingresados por el usuario.
   */
  public pedimentos: Pedimento[] = [];

  /**
   * Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion: Notificacion | null = null;

  /**
   * 
   * Flag para controlar la visibilidad del modal.
   */
  public mostrarModal = false;


  /**
   * Tipos de pedimento disponibles.
   */
  public tiposPedimento: Catalogo[] = [];

  /**
   * Lista de pedimentos seleccionados en la tabla.
   * Se utiliza para almacenar los pedimentos que han sido seleccionados por el usuario en la tabla.
   */
  public selected: Pedimento[] = [];

  /**
   * Tipo de selección para la tabla de pedimentos.
   * Se utiliza para definir el tipo de selección en la tabla de pedimentos.
   */
  public SelectionType = SelectionType;

  /**
   * Objeto para manejar la edición de celdas en la tabla de pedimentos.
   * Se utiliza para determinar si una celda está en modo de edición.
   */
  public editar: { [key: string]: boolean } = {};

  /**
   * Modo de visualización de columnas en la tabla de pedimentos.
   * Se utiliza para definir el modo de visualización de las columnas en la tabla de pedimentos.
   */
  public ColumnMode = ColumnMode;

  /**
   * Mensajes personalizados para la tabla de pedimentos.
   * Actualmente contiene el mensaje a mostrar cuando no hay registros disponibles.
   */
  public mensajes = {
    emptyMessage: '',
  };

  /**
   * Flag para rastrear si el usuario ha interactuado con el formulario.
   * Se utiliza para mostrar mensajes de validación solo después de la interacción del usuario.
   */
  public userHasInteracted = false;

  /**
   * Flag para controlar cuándo mostrar el mensaje de validación de datos.
   */
  private showDataValidationMessage = false;

  /**
   * Constructor del componente Pedimento.
   * Se inyectan las dependencias necesarias para el componente, incluyendo servicios y store.
   * tramite5701Query
   * tramite5701Store
   * estadoPedimentoService
   * tipoPedimentoService
   */
  constructor(
    private tramite5701Query: Tramite5701Query,
    private tramite5701Store: Tramite5701Store,
    private estadoPedimentoService: EstadoPedimentoService,
    private tipoPedimentoService: TipoPedimentoService,
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Se utiliza para obtener los tipos de pedimento y suscribirse al estado de la solicitud 5701.
   */
  ngOnInit(): void {
    this.getTiposPedimento();
    this.tramite5701Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((solicitudState) => {
          this.solicitudState = solicitudState;
        })
      )
      .subscribe();
      if(!this.editable) {
        this.pedimentoForm.disable();
      }
  }

  /**
   * Obtiene los tipos de pedimento disponibles y los almacena en una variable.
   */
  getTiposPedimento(): void {
    this.tipoPedimentoService
      .getListaTipoPedimento()
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((response) => {
          if (response.datos.length > 0) {
            this.tiposPedimento = response.datos;
          } else {
            this.tiposPedimento = [];
          }
        })
      )
      .subscribe();
  }

  /**
   * Verifica si el formulario de pedimento es válido.
   * {boolean | null} - Retorna true si el formulario es válido, false si no lo es, o null si no hay errores.
   */
  get isValid(): boolean | null {
    return this.pedimentoForm.errors && this.pedimentoForm.touched;
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando uno o más valores de las propiedades de entrada de un componente cambian.
   * changes - Un objeto que contiene los cambios detectados en las propiedades de entrada.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tablaPedimento'] && changes['tablaPedimento'].currentValue) {
      this.pedimentos = [...changes['tablaPedimento'].currentValue];
    }

    if (changes['validacion']) {
      this.validacion = changes['validacion'].currentValue;
      this.acciones();
    }

    if (changes['datosNroPedimento']) {
      this.datosNroPedimento = changes['datosNroPedimento'].currentValue;
    }
  }
  
  /**
   * Agrega un nuevo pedimento.
   * Esta función emite un evento para validar los campos y luego ejecuta las acciones correspondientes.
   */
  agregaPedimento(): void {
    this.userHasInteracted = true;
    this.mostrarMensajeError = false;

    if (!this.pedimentoForm.value || this.pedimentoForm.value.trim() === '') {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_NRO_PEDIMENTO,
        cerrar: false,
        txtBtnAceptar: TEXTO_CERRAR,
        txtBtnCancelar: '',
      };
      return;
    }
            
    if (this.pedimentos.length > 0 && this.hasPedimentosSinTipo()) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_NRO_PEDIMENTO_LLENAR_DATOS,
        cerrar: false,
        txtBtnAceptar: TEXTO_CERRAR,
        txtBtnCancelar: '',
      };
      return;      
    }

    if (this.pedimentos.length > 0 && this.hasPedimentosSinDatos()) {
      this.showDataValidationMessage = true;
      return;
    }
    
    this.nuevaNotificacion = null;
    
    this.showDataValidationMessage = true;
    this.validaCampos.emit();
    if (this.validacion) {      
      this.acciones();
    }    
  }

  /**
   * Realiza las acciones necesarias para validar y agregar un pedimento.
   */
  acciones(): void {

    if (this.validacion) {
      const NUMERO_PEDIMENTO = this.pedimentoForm.value
        ? parseInt(this.pedimentoForm.value, 10)
        : 0;      

      switch (NUMERO_PEDIMENTO) {        

        default: {
          const PEDIMENTOS_VALIDOS = this.pedimentos.every(
            (item) => item.tipoPedimento !== 0 && item.numero !== ''
          );
          const PEDIMENTO_EXISTE = this.pedimentos.some(
            (item) => item.pedimento === NUMERO_PEDIMENTO
          );

          if (this.pedimentos.length > 0 && PEDIMENTO_EXISTE) {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'danger',
              modo: 'action',
              titulo: TITULO_MODAL_AVISO,
              mensaje: MSG_PEDIMENTO_YA_CAPTURADO,
              cerrar: false,
              txtBtnAceptar: TEXTO_CERRAR,
              txtBtnCancelar: '',
            };
            return;
          }

          const BODY: BodyEstadoPedimento = {
            aduana: parseInt(this.solicitudState.idAduanaDespacho, 10),
            patente: this.numeroPatente,
            pedimento: parseInt(this.pedimentoForm.value, 10),
          };

          this.estadoPedimentoService
            .postEstadoPedimento(BODY)
            .pipe(
              takeUntil(this.destroyNotifier$),
              map((response) => {
                switch (response.codigo) {
                  case '00':
                    {
                      const PEDIMENTO: Pedimento = {
                        idPedimento: 0,
                        patente: this.numeroPatente,
                        pedimento: response.datos.pedimento,
                        aduana: response.datos.aduana,
                        tipoPedimento: 0,
                        estadoPedimento: response.datos.estado_pedimento,
                        subEstadoPedimento: response.datos.sub_estado_pedimento,
                        descTipoPedimento: 'Por evaluar',
                        numero: '',
                        comprobanteValor: '',
                        pedimentoValidado: 'false',
                      };

                      this.nuevaNotificacion = {
                        tipoNotificacion: 'alert',
                        categoria: 'success',
                        modo: 'action',
                        titulo: TITULO_MODAL_AVISO,
                        mensaje: MSG_PEDIMENTO_NO_VALIDO,
                        cerrar: false,
                        txtBtnAceptar: TEXTO_CERRAR,
                        txtBtnCancelar: '',
                      };

                      this.pedimentos.push(PEDIMENTO);
                      this.pedimentoForm.reset();
                      this.userHasInteracted = false;
                      this.datosTablaPedimento.emit(this.pedimentos);
                    }
                    break;
                  default:
                    this.nuevaNotificacion = {
                      tipoNotificacion: 'alert',
                      categoria: 'danger',
                      modo: 'action',
                      titulo: TITULO_MODAL_AVISO,
                      mensaje: MSG_PEDIMENTO_NO_VALIDO,
                      cerrar: false,
                      txtBtnAceptar: 'Aceptar',
                      txtBtnCancelar: '',
                    };
                    break;
                }
              }),
              catchError((_error) => {
                this.nuevaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: 'danger',
                  modo: 'action',
                  titulo: TITULO_MODAL_AVISO,
                  mensaje: MSG_NRO_PEDIMENTO_LLENAR_DATOS,
                  cerrar: false,
                  txtBtnAceptar: TEXTO_CERRAR,
                  txtBtnCancelar: '',
                };

                const PEDIMENTO: Pedimento = {
                  idPedimento: this.pedimentos.length + 1,
                  patente: this.datosNroPedimento.patente,
                  pedimento: NUMERO_PEDIMENTO,
                  aduana: this.datosNroPedimento.idAduanaDespacho,
                  tipoPedimento: 0,
                  estadoPedimento: '',
                  subEstadoPedimento: '',
                  descTipoPedimento: 'Por evaluar',
                  numero: '',
                  comprobanteValor: '',
                  pedimentoValidado: 'No validado',
                };

                this.pedimentos.push(PEDIMENTO);
                this.pedimentoForm.reset();
                this.datosTablaPedimento.emit(this.pedimentos);
                return EMPTY;
              })
            )
            .subscribe();
          break;
        }
      }
    }
  }

  /**
   * Elimina un elemento de la lista de pedimentos en la posición especificada.
   * {number} i - El índice del elemento a eliminar.
   */
  abrirModalEliminar(): void {
    if (this.pedimentos.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_ERROR_NO_PEDIMENTOS,
        cerrar: false,
        txtBtnAceptar: TEXTO_CERRAR,
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.selected.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: TITULO_MODAL_AVISO,
        mensaje: MSG_SELECCIONA_REGISTRO,
        cerrar: false,
        txtBtnAceptar: TEXTO_CERRAR,
        txtBtnCancelar: '',
      };
      return;
    }

    this.pedimentos = this.pedimentos.filter(
      (pedimento) => !this.selected.includes(pedimento)
    );

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: MSG_ELIMINA_ELEMENTO,
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };

    this.mostrarMensajeError = false;
    this.datosTablaPedimento.emit(this.pedimentos);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Notifica y completa el observable `destroyNotifier$` para limpiar suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método que se ejecuta cuando se selecciona un pedimento en la tabla.
   * Actualiza la lista de pedimentos seleccionados.
   * { selected } - Objeto que contiene los pedimentos seleccionados.
   */
  onSelect({ selected }: { selected: Pedimento[] }): void {
    if (selected && selected.length > 0) {
      this.selected.splice(0, this.selected.length);
      this.selected.push(...selected);
    }
  }

  /**
   * Método para actualizar el valor de una celda en la tabla de pedimentos.
   * Este método se ejecuta cuando se edita una celda en la tabla.
   * {Event} event - El evento que se dispara al editar la celda.
   * { string } cell - El nombre de la celda que se está editando.
   * { number } rowIndex - El índice de la fila que contiene la celda que se está editando.
   */
  actualizarValor(event: Event, cell: string, rowIndex: number): void {
    const TARGET = event.target as HTMLInputElement;

    this.editar[`${rowIndex}-${cell}`] = false;
    this.mostrarMensajeError = false;
    this.showDataValidationMessage = false;

    if (
      cell === 'descTipoPedimento' ||
      cell === 'numero' ||
      cell === 'comprobanteValor'
    ) {
      this.pedimentos[rowIndex][cell] = TARGET.value;
      if (cell === 'descTipoPedimento') {
        const TIPO_PEDIMENTO = this.tiposPedimento.find(
          (tipo) => tipo.descripcion === TARGET.value
        );

        if (TIPO_PEDIMENTO) {
          this.pedimentos[rowIndex].tipoPedimento = TIPO_PEDIMENTO.id;
          
          if (TIPO_PEDIMENTO.id === 4) {
            this.pedimentos[rowIndex].numero = '';
          } else {
            this.pedimentos[rowIndex].comprobanteValor = '';
          }

          this.showDataValidationMessage = false;

          if (TIPO_PEDIMENTO.id) {
            if (TIPO_PEDIMENTO.id !== 4) {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'success',
                modo: 'action',
                titulo: TITULO_MODAL_AVISO,
                mensaje: MSG_PEDIMENTO_EXISTE_YA_PAGADO,
                cerrar: false,
                txtBtnAceptar: TEXTO_CERRAR,
                txtBtnCancelar: '',
              };
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: TITULO_MODAL_AVISO,
                mensaje: MSG_PEDIMENTO_EXISTE_PREVIO,
                cerrar: false,
                txtBtnAceptar: TEXTO_CERRAR,
                txtBtnCancelar: '',
              };
            }
          }
        }
      }
    }

    this.pedimentos = [...this.pedimentos];
    this.datosTablaPedimento.emit(this.pedimentos);
  }

  /**
   * Método para editar una celda en la tabla de pedimentos.
   * rowIndex - El índice de la fila que contiene el pedimento a editar.
   */
  editarCelda(rowIndex: number): void {
    const TIPO_PEDIMENTO = this.pedimentos[rowIndex].tipoPedimento;
    switch (TIPO_PEDIMENTO) {
      case 4:
        this.editar[rowIndex + `-comprobanteValor`] = true;
        break;
      case 0:
        this.editar[rowIndex + `-numero`] = false;
        break;
      default:
        this.editar[rowIndex + `-numero`] = true;
        break;
    }
  }

  /**
   * Verifica si hay pedimentos sin tipo de pedimento asignado.
   * @returns {boolean} - True si hay pedimentos sin tipo, false en caso contrario.
   */
  hasPedimentosSinTipo(): boolean {
    return this.pedimentos.some(pedimento => 
      !pedimento.tipoPedimento || pedimento.tipoPedimento === 0
    );
  }
  
  /**
   * Determina si debe mostrarse el mensaje de validación de pedimentos.
   * Solo muestra mensaje cuando se intenta agregar sin número o hay pedimentos sin tipo.
   * @returns {boolean} - True si debe mostrar mensaje de validación.
   */
  shouldShowValidationMessage(): boolean {
    
    // Mostrar mensaje si el padre indica que debe mostrarse (desde Continuar)
    if (this.mostrarMensajeError) {      
      if (this.pedimentos.length === 0) {
        return true;
      }
      if (this.hasPedimentosSinTipo()) {
        return true;
      }
      if (this.hasPedimentosSinDatos()) {
        return true;
      }
    }

    // Validaciones del botón Agregar
    if (!this.userHasInteracted || !this.validacion) {
      return false;
    }
        
    const numeroVacio = !this.pedimentoForm.value || this.pedimentoForm.value.trim() === '';

    if (numeroVacio) {
      return false;
    }

    if (this.pedimentos.length === 0 && numeroVacio) {
      return true;
    }

    if (this.pedimentos.length > 0 && this.hasPedimentosSinTipo()) {
      return true;
    }

    if (this.showDataValidationMessage && this.hasPedimentosSinDatos()) {
      return true;
    }

    return false;
  }

  /**
   * Genera el mensaje de validación basado en el estado actual de los pedimentos.
   * @returns {string} - Mensaje de validación correspondiente.
   */
  getMensajeValidacion(): string {
    // Mensajes desde el botón Continuar (padre)
    if (this.mostrarMensajeError) {
      if (this.pedimentos.length === 0) {
        return 'Se debe agregar por lo menos un pedimento';
      }
      if (this.hasPedimentosSinTipo()) {
        return 'Debe agregar el tipo del pedimento';
      }
      if (this.hasPedimentosSinDatos()) {
        return 'Debe agregar el número o comprobante de valor del pedimento';
      }
    }

    // Mensajes desde el botón Agregar
    const numeroVacio = !this.pedimentoForm.value || this.pedimentoForm.value.trim() === '';

    if (!this.validacion) {
      return '';
    }
    if (this.pedimentos.length === 0) {
      return '';
    }
    if (this.pedimentos.length === 0 && numeroVacio) {
      return 'Se debe agregar por lo menos un pedimento.';
    }
    if (this.pedimentos.length > 0 && this.hasPedimentosSinTipo()) {
      return 'Debe agregar el tipo del pedimento';
    }
    if (this.pedimentos.length > 0 && this.hasPedimentosSinDatos()) {
      return 'Debe agregar el número o comprobante de valor del pedimento';
    }
    return '';
  }

  /**
   * Verifica si hay pedimentos con tipo asignado pero sin número o comprobante de valor.
   * @returns {boolean} - True si hay pedimentos sin datos requeridos.
   */
  hasPedimentosSinDatos(): boolean {
    return this.pedimentos.some(pedimento => {
      if (pedimento.tipoPedimento && pedimento.tipoPedimento !== 0) {
        if (pedimento.tipoPedimento === 4) {
          return !pedimento.comprobanteValor || pedimento.comprobanteValor.trim() === '';
        } else {
          return !pedimento.numero || pedimento.numero.trim() === '';
        }
      }
      return false;
    });
  }

  /**
   * Verifica si hay campos de datos en modo de edición (sin confirmar con ENTER).
   * @returns {boolean} - True si hay campos en edición.
   */
  hayCamposEnEdicion(): boolean {
    return Object.keys(this.editar).some(key => 
      this.editar[key] && (key.includes('-numero') || key.includes('-comprobanteValor'))
    );
  }

  /**
   * Maneja el evento de cambio en el campo de entrada del número de pedimento.
   * Resetea las banderas de interacción del usuario y mensaje de validación.
   */
  onInputChange(): void {
    this.userHasInteracted = false;
    this.showDataValidationMessage = false;
  }

}