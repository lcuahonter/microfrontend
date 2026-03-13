import {
  CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_AEREO,
  CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_CARRETERO,
  CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_FERROVIARIO,
  CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_MARITIMO,
  CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_OTRO,
  CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_PEATONAL,
  LABEL_HORA_ARRIBO,
  LISTA_TIPO_TRANSPORTE,
  MODIFICAR_ITEM_TRANSPORTE,
  MSG_AGREGA_TRANSPORTE_EXITOSAMENTE,
  MSG_CAMBIO_TIPO_TRANSPORTE,
  MSG_ELIMNA_TRANSPORTE_EXITOSAMENTE,
  MSG_INGRESA_UNA_GUIA,
  MSG_NUMERO_BL_INVALIDO,
  MSG_NUMERO_BL_VACIO,
  MSG_REGISTRA_UNA_GUIA,
  MSG_SELECCIONA_ITEM,
  MSG_SELECCIONA_SOLO_UN_REGISTRO,
  SIN_VALOR_SELECT,
} from '../../../core/enums/transporte-componente.enum';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ItemTransporteDespacho,
  TransporteDespacho,
} from '../../../core/models/shared/agregar-transporte.model';
import {
  MSG_MODIFICA_ELEMENTO,
  TITULO_MODAL_AVISO,
} from '../../../core/enums/mensajes-modal-comunes.enum';
import {
  Notificacion,
  NotificacionesComponent,
} from '../notificaciones/notificaciones.component';
import { Subject, takeUntil, tap } from 'rxjs';
import { Catalogo } from '../../../core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '../catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ConfiguracionColumna } from '../../../core/models/shared/configuracion-columna.model';

import { Catalogos } from '../../../core/models/shared/catalogo.model';
import { InputCheckComponent } from '../input-check/input-check.component';
import { InputHoraComponent } from '../input-hora/input-hora.component';
import { Modal } from 'bootstrap';
import { TIPO_TRANSPORTE } from '../../constantes/agregar-transporte.enum';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '../../../core/enums/tabla-seleccion.enum';
import { TipoEquipoService } from '../../../core/services/shared/catalogos/tipo-equipo.service';
import { ValidaTransporteService } from '../../../core/services/shared/api-validaciones/valida-transporte.service';
import { formatearFechaDdMmYyyy } from '../../../core/utils/utilerias';

@Component({
  selector: 'lib-transporte',
  templateUrl: './transporte.component.html',
  styleUrl: './transporte.component.scss',
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    FormsModule,
    InputCheckComponent,
    InputHoraComponent,
    NotificacionesComponent,
    ReactiveFormsModule,
    TablaDinamicaComponent,
  ],
})
export class TransporteComponent implements OnInit, OnChanges {
  /**
   * Datos de entrada del catalogo de transporte.
   * @type {Catalogo[]}
   */
  @Input({ required: true }) catalogoTransporte!: Catalogo[];

  /**
   * Datos de la tabla de transporte.
   * @type {TransporteDespacho[]}
   */
  @Input() tablaTransporte!: TransporteDespacho[];

  /**
   * Tipo de transporte seleccionado.
   * @type {string}
   */
  @Input() tipoTransporteSeleccionado!: string;

  /**
   * Título personalizado para el modal.
   * @type {string}
   */
  @Input() tituloModalPersonalizado: string = 'Datos del transporte de arribo/salida (al/del) país';

  /**
   * Indica si el componente es editable o no.
   */
  @Input() editable?: boolean = true;

  /**
   * Emisor de eventos para enviar los datos de la tabla.
   */
  @Output() datosTabla: EventEmitter<TransporteDespacho[]> = new EventEmitter<
    TransporteDespacho[]
  >();

  /**
   * Referencia al elemento del modal para agregar transporte.
   */
  @ViewChild('agregarTransporte') agregarTransporte!: ElementRef;

  /**
   * Referencia al botón para cerrar el modal.
   */
  @ViewChild('btnCerrarModal') btnCerrarModal!: ElementRef;

  /**
   * Emisor de eventos para enviar el tipo de transporte seleccionado.
   * @type {EventEmitter<string>}
   */
  @Output() seleccionTipoTransporte: EventEmitter<string> =
    new EventEmitter<string>();

  /**
   * @description
   * Configuración de la tabla de terceros.
   */
  tablaSeleccion = TablaSeleccion;

  /**
   * @description
   * Encabezado de la tabla de terceros.
   */
  encabezadoDeTablaTransporte!: ConfiguracionColumna<TransporteDespacho>[];

  /**
   * Etiqueta para la hora de arribo.
   */
  readonly LABEL_HORA_ARRIBO: string = LABEL_HORA_ARRIBO;

  /**
   * @description Valor -1 en selects para indicar "Sin valor seleccionado".
   */
  readonly SIN_VALOR: number = Number(SIN_VALOR_SELECT);

  /**
   * Formulario para el transporte carretero.
   */
  carreteroForma!: FormGroup;

  /**
   * Formulario para el transporte ferroviario.
   */
  ferroviarioForma!: FormGroup;

  /**
   * Formulario para el transporte peatonal.
   */
  peatonalForma!: FormGroup;

  /**
   * Formulario para el transporte otro.
   */
  otroForma!: FormGroup;

  /**
   * Formulario para el transporte maritimo.
   */
  maritimoForma!: FormGroup;

  /**
   * Formulario para el transporte aereo.
   */
  aereoForma!: FormGroup;

  /**
   * Cabecera de la tabla.
   */
  headerTabla!: ItemTransporteDespacho[];

  /**
   * Contenido de la tabla.
   */
  bodyTabla: TransporteDespacho[] = [];

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Control para las observaciones.
   */
  public observaciones: FormControl = new FormControl('', [
    Validators.maxLength(500),
  ]);

  /**
   * @description Notificador para destruir el observable al finalizar el componente.
   * Se utiliza para evitar fugas de memoria y asegurar que los recursos se liberen adecuadamente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Lista del catalogo tipo de equipo
   * @type {ICatalogo[]}
   */
  public tipoEquipoCatalogo: Catalogos[] = [];

  /**
   *  @description Lista de modelos de carros respecto al año.
   *  @type {Catalogo[]}
   */
  anios!: Catalogo[];

  /**
   * @description Formulario para seleccionar el tipo de transporte.
   * @type {FormGroup}
   */
  tipoTransporteForma: FormGroup = this.fb.group({
    tipoTransporte: [-1],
  });

  /**
   * @description Titulo del modal.
   * @type {string}
   */
  tituloModal!: string;

  /**
   * @description Mensaje del modal.
   * @type {string}
   */
  mensajeModal!: string;

  /**
   * @description Tipo de transporte seleccionado.
   * @type {string}
   */
  tipoTransporte: string = '';

  /**
   * @description Lista que contiene los tipos de transporte.
   * @type {ICatalogo[]}
   */
  readonly LISTA_TIPO_TRANSPORTE = LISTA_TIPO_TRANSPORTE;

  /**
   * @description Indica si se deben seleccionar todos los checkboxes de la tabla.
   * @type {boolean}
   */
  checkSeleccionarTodos: boolean = false;

  /**
   * @property {TransporteDespacho[]} transporteSeleccionado
   * Almacena la fila seleccionada de la tabla de transportes.
   */
  public transporteSeleccionado: TransporteDespacho[] = [];

  /**
   * @description Proceso del modal
   */
  public procesoModal: string = '';

  /**
   * @description Registro seleccionado en la tabla de transporte.
   * @type {TransporteDespacho}
   */
  registroSeleccionado: TransporteDespacho = {
    tipo_transporte: SIN_VALOR_SELECT,
    modelo_transporte: SIN_VALOR_SELECT,
    tipo_equipo: SIN_VALOR_SELECT,
    mismos_datos_transporte: false,
  };

  /**
   * @description Indica si la acción es de modificación.
   */
  accionModificar: boolean = false;

  /**
   * bandera que controla el mostrar y ocultar los botones de guias 
   */
  limpiarGuiasBandera: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private tipoEquipoServicio: TipoEquipoService,
    private validaTransporteService: ValidaTransporteService
  ) {}

  ngOnInit(): void {
    this.crearLosFormularios();
    this.getTipoEquipo();
    if(!this.editable) {
      this.tipoTransporteForma.disable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tablaTransporte'] && changes['tablaTransporte'].currentValue) {
      this.bodyTabla = [...this.tablaTransporte];
      // Convertir valores booleanos a texto para mostrar en la tabla
      this.bodyTabla.forEach(transporte => {        
        
        if (transporte.arribo_pendiente_aereo !== undefined) {
          transporte.arribo_pendiente_aereo_des = transporte.arribo_pendiente_aereo ? 'Sí' : 'No';
        }
        if (transporte.guia_valida !== undefined) {
          transporte.guia_valida_des = transporte.guia_valida ? 'Sí' : 'No';
        }
      });
    }

    if (
      changes['tipoTransporteSeleccionado'] &&
      changes['tipoTransporteSeleccionado'].currentValue
    ) {
      this.tipoTransporteForma
        .get('tipoTransporte')
        ?.setValue(this.tipoTransporteSeleccionado);

      this.creaTablaTransporte();
    }
  }

  /**
   * @description Maneja el cambio del tipo de transporte seleccionado.
   * @returns {void} No retorna ningún valor.
   */
  onChangeTipoTransporte(): void {
    if (this.bodyTabla.length > 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_CAMBIO_TIPO_TRANSPORTE,
        cerrar: false,
        txtBtnAceptar: 'Sí',
        txtBtnCancelar: 'No',
      };
      this.procesoModal = 'cambioTipoTransporte';
      return;
    }
    this.tipoTransporte = this.tipoTransporteForma.get('tipoTransporte')?.value;
    this.creaTablaTransporte();
  }

  /**
   *
   */
  static tieneValoresValidos(form: FormGroup): boolean {
    const VALORES = form.getRawValue();
    return Object.values(VALORES).some(
      (valor) =>
        valor !== null &&
        valor !== undefined &&
        valor !== false &&
        valor !== -1 &&
        valor !== SIN_VALOR_SELECT &&
        valor !== ''
    );
  }

  /**
   * @description Asigna el nombre del formulario, segín el transporte elegido.
   * @return {string} - Nombre del formulario según el tipo de transporte.
   */
  static nombreFormaTransporte(tipoTransporte: number): string {
    switch (tipoTransporte) {
      case LISTA_TIPO_TRANSPORTE[0].id: // Carretero
        return 'carreteroForma';
      case LISTA_TIPO_TRANSPORTE[1].id: // Ferroviario
        return 'ferroviarioForma';
      case LISTA_TIPO_TRANSPORTE[2].id: // Aéreo
        return 'aereoForma';
      case LISTA_TIPO_TRANSPORTE[3].id: // Marítimo
        return 'maritimoForma';
      case LISTA_TIPO_TRANSPORTE[4].id: // Peatonal
        return 'peatonalForma';
      default: // Otro
        return 'otroForma';
    }
  }

  /**
   * Crea la tabla de transporte según el tipo seleccionado.
   * @returns {void} No retorna ningún valor.
   */
  creaTablaTransporte(): void {
    const TIPO_TRANSPORTE = parseInt(
      this.tipoTransporteForma.get('tipoTransporte')?.value,
      10
    );
    this.seleccionTipoTransporte.emit(TIPO_TRANSPORTE.toString());
    this.encabezadoDeTablaTransporte = this.tipoTabla(TIPO_TRANSPORTE);
  }

  /**
   * Crea los formularios para cada tipo de transporte.
   * @returns void
   */
  crearLosFormularios(): void {
    this.crearCarreteroForm();
    this.crearFerroviarioForm();
    this.crearPeatonalForm();
    this.crearOtroForm();
    this.crearAereoForm();
    this.crearMaritimoForm();
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte carretero.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearCarreteroForm(): void {
    this.carreteroForma = this.fb.group({
      emp_transportista: [
        this.registroSeleccionado?.emp_transportista,
        [Validators.maxLength(80)],
      ],
      numero_porte: [
        this.registroSeleccionado?.numero_porte,
        [Validators.maxLength(50)],
      ],
      fecha_porte: [
        this.registroSeleccionado?.fecha_porte || '',
        [],
      ],
      marca_transporte: [
        this.registroSeleccionado?.marca_transporte,
        [Validators.maxLength(70)],
      ],
      modelo_transporte: [this.registroSeleccionado?.modelo_transporte],
      placas_transporte: [
        this.registroSeleccionado?.placas_transporte,
        [Validators.maxLength(150)],
      ],
      contenedor_transporte: [
        this.registroSeleccionado?.contenedor_transporte,
        [Validators.maxLength(150)],
      ],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte carretero.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearFerroviarioForm(): void {
    this.ferroviarioForma = this.fb.group({
      numero_bl: [
        this.registroSeleccionado?.numero_bl,
        [Validators.maxLength(25)],
      ],
      tipo_equipo: [
        { value: this.registroSeleccionado?.tipo_equipo, disabled: true },
      ],
      iniciales_equipo: [
        { value: this.registroSeleccionado?.iniciales_equipo, disabled: true },
        [Validators.maxLength(10)],
      ],
      numero_equipo: [
        { value: this.registroSeleccionado?.numero_equipo, disabled: true },
        [Validators.maxLength(15)],
      ],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte peatonal.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearPeatonalForm(): void {
    this.peatonalForma = this.fb.group({
      rfc_empresa: [
        this.registroSeleccionado?.rfc_empresa,
        [Validators.maxLength(13)],
      ],
      emp_transportista: [
        this.registroSeleccionado?.emp_transportista,
        [Validators.maxLength(80)],
      ],
      nombre_transportista: [
        this.registroSeleccionado?.nombre_transportista,
        [Validators.maxLength(100)],
      ],
      num_gafete: [
        this.registroSeleccionado?.num_gafete,
        [Validators.maxLength(20)],
      ],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte otro.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearOtroForm(): void {
    this.otroForma = this.fb.group({
      tipo_transporte_des: [
        this.registroSeleccionado?.tipo_transporte_des || '',
        [Validators.maxLength(100)],
      ],
      emp_transportista: [
        this.registroSeleccionado?.emp_transportista || '',
        [Validators.maxLength(80)],
      ],
      datos_transporte: [
        this.registroSeleccionado?.datos_transporte || '',
        [Validators.maxLength(250)],
      ],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte áereo.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearAereoForm(): void {
    this.aereoForma = this.fb.group({
      arribo_pendiente_aereo: [
        this.registroSeleccionado?.arribo_pendiente_aereo,
      ],
      guia_master_aereo: [
        this.registroSeleccionado?.guia_master_aereo,
        [Validators.maxLength(12)],
      ],
      guia_house_aereo: [
        this.registroSeleccionado?.guia_house_aereo,
        [Validators.maxLength(25)],
      ],
      fecha_arribo_aereo: [
        this.registroSeleccionado?.fecha_arribo_aereo,
        [Validators.maxLength(15)],
      ],
      hora_arribo_aereo: [
        this.registroSeleccionado?.hora_arribo_aereo,
        [Validators.maxLength(5)],
      ],
      guia_valida: [
        { value: this.registroSeleccionado?.guia_valida, disabled: true },
      ],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte marítimo.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearMaritimoForm(): void {
    this.maritimoForma = this.fb.group({
      guia_bl_Maritimo: [
        this.registroSeleccionado?.guia_bl_Maritimo,
        [Validators.maxLength(15)],
      ],
      guia_house_maritimo: [
        this.registroSeleccionado?.guia_house_maritimo,
        [Validators.maxLength(15)],
      ],
      nombre_buque_maritimo: [
        this.registroSeleccionado?.nombre_buque_maritimo,
        [Validators.maxLength(70)],
      ],
      contenedor_maritimo: [
        this.registroSeleccionado?.contenedor_maritimo,
        Validators.maxLength(600),
      ],
    });
  }

  /**
   * Determina el tipo de tabla y configura el formulario correspondiente según el tipo de transporte.
   *
   * @returns {ItemTransporte[]} Encabezados de la tabla correspondientes al tipo de transporte seleccionado.
   */
  tipoTabla(
    tipoTransporte: number
  ): ConfiguracionColumna<TransporteDespacho>[] {
    switch (tipoTransporte) {
      case LISTA_TIPO_TRANSPORTE[0].id: // Carretero
        this.anios = TransporteComponent.obtenerAniosModelo();
        return CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_CARRETERO;
      case LISTA_TIPO_TRANSPORTE[1].id: // Ferroviario
        return CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_FERROVIARIO;
      case LISTA_TIPO_TRANSPORTE[2].id: // Aéreo
        return CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_AEREO;
      case LISTA_TIPO_TRANSPORTE[3].id: // Marítimo
        return CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_MARITIMO;
      case LISTA_TIPO_TRANSPORTE[4].id: // Peatonal
        return CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_PEATONAL;
      default: // Otro
        return CONFIGURACION_ENCABEZADO_TABLA_TRANSPORTE_OTRO;
    }
  }

  /**
   * Obtiene el catálogo de tipo de equipo para el tipo de transporte ferroviario.
   * return {void} No retorna ningún valor.
   */
  getTipoEquipo(): void {
    this.tipoEquipoServicio
      .getTipoEquipo()
      .pipe(
        tap((response) => {
          if (response) {
            this.tipoEquipoCatalogo = response.datos;
          }
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * @description Esta función genera un array de años desde 1980 hasta el año actual.
   * @returns {Catalogo[]} - Devuelve un array de años desde 1980 hasta el año actual.
   */
  static obtenerAniosModelo(): Catalogo[] {
    const ANIO_ACTUAL = new Date().getFullYear();
    const ANIOS: Catalogo[] = [];
    for (let i = 1980; i <= ANIO_ACTUAL; i++) {
      const ANIO: Catalogo = {
        id: i,
        descripcion: i.toString(),
      };

      ANIOS.push(ANIO);
    }

    return ANIOS;
  }

  /**
   * Elimina los elementos seleccionados de la tabla de transporte.
   * @returns {void} No retorna ningún valor.
   */
  eliminarSeleccionados(): void {
    if (this.transporteSeleccionado.length === 0) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_SELECCIONA_ITEM,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

   

   
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_CAMBIO_TIPO_TRANSPORTE,
        cerrar: true,
        txtBtnAceptar: 'Sí',
        txtBtnCancelar: 'No',
      };
      this.procesoModal = 'eliminarTransporte';
      return;
    
  }

  /**agregarTransporte
   * Abre el modal para agregar un documento.
   * @returns {void}
   */
  abrirModal(accion: string = ''): void {
    const MODAL_AGREGA = new Modal(this.agregarTransporte.nativeElement);
    MODAL_AGREGA.show();
    this.limpiarGuias();
    if (accion === MODIFICAR_ITEM_TRANSPORTE) {
      this.accionModificar = true;
      const TIPO_TRANSPORTE = parseInt(
        this.tipoTransporteForma.get('tipoTransporte')?.value,
        10
      );
      this.crearFormaTransporteParaModificar(TIPO_TRANSPORTE);
    }
  }

  /**
   * Restablece el formulario carretero a su estado inicial.
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.carreteroForma.reset({
      emp_transportista: '',
      numero_porte: '',
      fecha_porte: '',
      marca_transporte: '',
      modelo_transporte: SIN_VALOR_SELECT, // Valor específico para este campo
      placas_transporte: '',
      contenedor_transporte: '',
    });

    this.ferroviarioForma.reset({
      numero_bl: '',
      tipo_equipo: SIN_VALOR_SELECT, // Valor específico para este campo
      iniciales_equipo: '',
      numero_equipo: '',
    });

    this.aereoForma.reset({
      arribo_pendiente_aereo: false,
      guia_master_aereo: '',
      guia_house_aereo: '',
      fecha_arribo_aereo: '',
      hora_arribo_aereo: '',
      guia_valida: false,
    });

    // Marítimo
    this.maritimoForma.reset({
      guia_bl_Maritimo: '',
      guia_house_maritimo: '',
      nombre_buque_maritimo: '',
      contenedor_maritimo: '',
    });

    // Peatonal
    this.peatonalForma.reset({
      rfc_empresa: '',
      emp_transportista: '',
      nombre_transportista: '',
      num_gafete: '',
    });

    // Otro
    this.otroForma.reset({
      tipo_transporte_des: '',
      emp_transportista: '',
      datos_transporte: '',
    });

    this.observaciones.setValue('');

    this.limpiarGuias();
  }

  /**
   * Cierra el modal.
   * @returns {void}
   */
  cerrarModal(): void {
    this.btnCerrarModal.nativeElement.click();
    this.tituloModal = '';
    this.mensajeModal = '';
    this.accionModificar = false;
    this.limpiarFormulario();
  }

  /**
   * Agrega un tipo de transporte a la tabla según el tipo seleccionado.
   *
   * @returns {void} No retorna ningún valor.
   */
  agregarTipoTransporte(): void {
    const TIPO_TRANSPORTE = parseInt(
      this.tipoTransporteForma.get('tipoTransporte')?.value,
      10
    );

    const FORMULARIO_NOMBRE = TransporteComponent.nombreFormaTransporte(
      TIPO_TRANSPORTE
    ) as keyof this;

    const FORMULARIO = this[FORMULARIO_NOMBRE] as FormGroup;
    
    const VALORES = TransporteComponent.tieneValoresValidos(FORMULARIO);

    if (!VALORES && !this.observaciones.value) {
      this.cerrarModal();
      return;
    }

    switch (TIPO_TRANSPORTE) {
      case LISTA_TIPO_TRANSPORTE[0].id: {
        // Carretero
        const TRANSPORTE: TransporteDespacho = this.carreteroForma.value;
        TRANSPORTE.tipo_transporte = TIPO_TRANSPORTE.toString();
        TRANSPORTE.modelo_transporte =
          TRANSPORTE.modelo_transporte === SIN_VALOR_SELECT
            ? ''
            : TRANSPORTE.modelo_transporte;
        TRANSPORTE.observaciones = this.observaciones.value;
        TRANSPORTE.seleccionado = false;
        this.bodyTabla.push(TRANSPORTE);

        this.carreteroForma.reset({
          emp_transportista: '',
          numero_porte: '',
          fecha_porte: '',
          marca_transporte: '',
          modelo_transporte: SIN_VALOR_SELECT, // Valor específico para este campo
          placas_transporte: '',
          contenedor_transporte: '',
        });
        break;
      }
      case LISTA_TIPO_TRANSPORTE[1].id: {
        // Ferroviario
        const TRANSPORTE: TransporteDespacho =
          this.ferroviarioForma.getRawValue();
        TRANSPORTE.tipo_transporte = TIPO_TRANSPORTE.toString();
        TRANSPORTE.tipo_equipo =
          TRANSPORTE.tipo_equipo === SIN_VALOR_SELECT
            ? ''
            : TRANSPORTE.tipo_equipo;
        TRANSPORTE.observaciones = this.observaciones.value;
        TRANSPORTE.seleccionado = false;

        this.bodyTabla.push(TRANSPORTE);
        this.ferroviarioForma.reset({
          numero_bl: '',
          tipo_equipo: SIN_VALOR_SELECT, // Valor específico para este campo
          iniciales_equipo: '',
          numero_equipo: '',
        });
        break;
      }

      case LISTA_TIPO_TRANSPORTE[2].id: {
        // Aéreo
        const TRANSPORTE: TransporteDespacho = this.aereoForma.getRawValue();
        TRANSPORTE.tipo_transporte = TIPO_TRANSPORTE.toString();
        TRANSPORTE.arribo_pendiente_aereo_des =
          TRANSPORTE.arribo_pendiente_aereo ? 'Sí' : 'No';
        TRANSPORTE.guia_valida_des = TRANSPORTE.guia_valida ? 'Sí' : 'No';
        TRANSPORTE.observaciones = this.observaciones.value;
        TRANSPORTE.seleccionado = false;

        this.bodyTabla.push(TRANSPORTE);

        this.aereoForma.reset({
          arribo_pendiente_aereo: false,
          guia_master_aereo: '',
          guia_house_aereo: '',
          fecha_arribo_aereo: '',
          hora_arribo_aereo: '',
          guia_valida: false,
        });
        break;
      }

      case LISTA_TIPO_TRANSPORTE[3].id: {
        // Marítimo
        const TRANSPORTE: TransporteDespacho = this.maritimoForma.value;
        TRANSPORTE.tipo_transporte = TIPO_TRANSPORTE.toString();
        TRANSPORTE.observaciones = this.observaciones.value;
        TRANSPORTE.seleccionado = false;

        this.bodyTabla.push(TRANSPORTE);
        this.maritimoForma.reset();
        break;
      }
      case LISTA_TIPO_TRANSPORTE[4].id: {
        // Peatonal
        const TRANSPORTE: TransporteDespacho = this.peatonalForma.value;
        TRANSPORTE.tipo_transporte = TIPO_TRANSPORTE.toString();
        TRANSPORTE.observaciones = this.observaciones.value;
        TRANSPORTE.seleccionado = false;

        this.bodyTabla.push(TRANSPORTE);
        this.peatonalForma.reset();
        break;
      }

      default: {
        // Otro
        const TRANSPORTE: TransporteDespacho = this.otroForma.value;
        TRANSPORTE.tipo_transporte = TIPO_TRANSPORTE.toString();

        // Ensure tipo_transporte_des is properly set
        if (!TRANSPORTE.tipo_transporte_des) {
          TRANSPORTE.tipo_transporte_des = this.otroForma.get('tipo_transporte_des')?.value || '';
        }
        
        TRANSPORTE.observaciones = this.observaciones.value;
        TRANSPORTE.seleccionado = false;

        this.bodyTabla.push(TRANSPORTE);
        this.otroForma.reset({
          tipo_transporte_des: '',
          emp_transportista: '',
          datos_transporte: '',
        });
        break;
      }
    }

    const DESCRIPCION_TIPO_TRANSPORTE =
      this.LISTA_TIPO_TRANSPORTE.find((item) => item.id === TIPO_TRANSPORTE)
        ?.nombre ?? '';

    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: 'Aviso',
      mensaje: MSG_AGREGA_TRANSPORTE_EXITOSAMENTE.replace(
        '{tipoTransporte}',
        DESCRIPCION_TIPO_TRANSPORTE
      ),
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };

    this.observaciones.setValue('');
    this.enviarTransporteTabla();
    this.cerrarModal();
  }

  /**
   * Emite los datos de transporte a la tabla.
   *
   * @returns {void} No retorna ningún valor.
   */
  enviarTransporteTabla(): void {
    this.datosTabla.emit(this.bodyTabla);
  }

  /**
   * Valida el número BL para el transporte ferroviario, si s valido, regresa los datos de tipo equipo, Iniciales de quipo y Número de equipo.
   * @returns {void} No retorna ningún valor.
   */
  postValidarNumeroBL(): void {
    const NUMERO_BL = parseInt(
      this.ferroviarioForma.get('numero_bl')?.value,
      10
    );
    if (NUMERO_BL) {
      this.validaTransporteService
        .getValidaTransporte(TIPO_TRANSPORTE.FERRO, {
          numeroBL: NUMERO_BL,
        })
        .pipe(
          tap((response) => {
            if (response.codigo === '00') {
              const DATOS = response.datos;
              this.agregarValorCampoDisabled('tipo_equipo', DATOS.tipoEquipo);
              this.agregarValorCampoDisabled(
                'iniciales_equipo',
                DATOS.inicialesEquipo
              );
              this.agregarValorCampoDisabled(
                'numero_equipo',
                DATOS.numeroEquipo
              );
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: '',
                modo: 'action',
                titulo: 'Aviso',
                mensaje: MSG_NUMERO_BL_INVALIDO,
                cerrar: false,
                txtBtnAceptar: 'Cerrar',
                txtBtnCancelar: '',
              };
              this.ferroviarioForma
                .get('tipo_equipo')
                ?.setValue(SIN_VALOR_SELECT);
              this.ferroviarioForma.get('iniciales_equipo')?.setValue('');
              this.ferroviarioForma.get('numero_equipo')?.setValue('');
            }
          }),
          takeUntil(this.destroyNotifier$)
        )
        .subscribe();
    } else {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_NUMERO_BL_VACIO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Valida la guía aérea, si es válida, se habilita el campo de guía válida.
   * @returns {void} No retorna ningún valor.
   */
  postValidarGuiaAerea(): void {
    const GUIA_MASTER = this.aereoForma.get('guia_master_aereo')?.value;
    const GUIA_HOUSE = this.aereoForma.get('guia_house_aereo')?.value;

    if (GUIA_HOUSE && GUIA_MASTER) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_INGRESA_UNA_GUIA,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (!GUIA_MASTER && !GUIA_HOUSE) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_REGISTRA_UNA_GUIA,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    const GUIA = GUIA_MASTER ? { guiaMasterAereo: GUIA_MASTER } : { guiaHouseAereo: GUIA_HOUSE };
    this.validaTransporteService
      .getValidaTransporte(TIPO_TRANSPORTE.AEREO, GUIA)
      .pipe(
        tap((response) => {
          if (response.codigo === '00') {
            this.aereoForma.get('guia_valida')?.setValue(true);
            if(GUIA_MASTER){
              this.aereoForma.get('guia_master_aereo')?.disable();
            }
            if(GUIA_HOUSE) {
              this.aereoForma.get('guia_house_aereo')?.disable();
            }
            this.limpiarGuiasBandera = true;
          } else {
            this.aereoForma.get('guia_master_aereo')?.setValue('');
            this.aereoForma.get('guia_house_aereo')?.setValue('');
            this.aereoForma.get('guia_valida')?.setValue(false);
          }
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
  }

  /**
   * Agrega un valor a un campo del formulario que esta desactivado.
   * @param campo {string} - Nombre del campo en el formulario.
   * @param valor {string | null} - Valor a establecer en el campo.
   */
  agregarValorCampoDisabled(campo: string, valor: string | null): void {
    this.ferroviarioForma.get(campo)?.enable();
    this.ferroviarioForma.get(campo)?.setValue(valor);
    this.ferroviarioForma.get(campo)?.disable();
  }

  /**
   * Metodo para manejar la confirmación del modal.
   * @param aceptar {boolean} - Indica si se acepta la acción.
   */
  confirmacionModal(aceptar: boolean): void {
    if (this.procesoModal === 'cambioTipoTransporte') {
      if (aceptar && this.nuevaNotificacion.txtBtnCancelar) {
        this.bodyTabla = [];
        this.datosTabla.emit(this.bodyTabla);
        const TIPO_TRANSPORTE = parseInt(
          this.tipoTransporteForma.get('tipoTransporte')?.value,
          10
        );
        this.encabezadoDeTablaTransporte = this.tipoTabla(TIPO_TRANSPORTE);
      } else {
        this.tipoTransporteForma
          .get('tipoTransporte')
          ?.setValue(this.tipoTransporteSeleccionado);
      }
      this.procesoModal = '';
    }

    if( this.procesoModal === 'eliminarTransporte' && aceptar) {
     this.bodyTabla = this.bodyTabla.filter(
      (transporte) =>
        !this.transporteSeleccionado.some(
          (seleccionado) => seleccionado === transporte
        )
      );
      this.datosTabla.emit(this.bodyTabla)
    }
  }

  /**
   * @description Método que se ejecuta al hacer clic en el botón "Modificar".
   * Valida si hay un transporte seleccionado y si es así, abre el modal para modificarlo.
   * Si no hay transporte seleccionado, muestra una notificación de aviso.
   * @returns {void} No retorna ningún valor.
   */
  btnModificar(): void {
    if (
      !this.transporteSeleccionado ||
      this.transporteSeleccionado.length === 0
    ) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_SELECCIONA_ITEM,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    if (this.transporteSeleccionado.length > 1) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: MSG_SELECCIONA_SOLO_UN_REGISTRO,
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    this.registroSeleccionado = this.transporteSeleccionado[0];
    this.abrirModal('modificar');
  }

  /**
   * @description Crea el formulario de transporte para modificar según el tipo de transporte seleccionado.
   * @param tipoTransporte {number} - Tipo de transporte seleccionado.
   * @return {void} No retorna ningún valor.
   */
  crearFormaTransporteParaModificar(tipoTransporte: number): void {
    switch (tipoTransporte) {
      case LISTA_TIPO_TRANSPORTE[0].id: // Carretero
        this.carreteroForma.patchValue(this.registroSeleccionado);
        // Asegurar que la fecha se establezca correctamente
        if (this.registroSeleccionado.fecha_porte) {
          this.carreteroForma.get('fecha_porte')?.setValue(this.registroSeleccionado.fecha_porte);
        }
        break;
      case LISTA_TIPO_TRANSPORTE[1].id: // Ferroviario
        this.ferroviarioForma.patchValue(this.registroSeleccionado);
        break;
      case LISTA_TIPO_TRANSPORTE[2].id: // Aéreo
        this.aereoForma.patchValue(this.registroSeleccionado);
        break;
      case LISTA_TIPO_TRANSPORTE[3].id: // Marítimo
        this.maritimoForma.patchValue(this.registroSeleccionado);
        break;
      case LISTA_TIPO_TRANSPORTE[4].id: // Peatonal
        this.peatonalForma.patchValue(this.registroSeleccionado);
        break;
      default: // Otro
        this.otroForma.patchValue(this.registroSeleccionado);
        break;
    }
    this.observaciones.setValue(this.registroSeleccionado.observaciones);
  }

  /**
   * Método que se ejecuta al hacer clic en el botón "Modificar" del modal para agregar o modificar un tipo de transporte.
   * @param tipoTransporte {number} - Tipo de transporte seleccionado.
   */
  modificarTransporte(): void {
    const TIPO_TRANSPORTE = parseInt(
      this.tipoTransporteForma.get('tipoTransporte')?.value,
      10
    );

    const FORMULARIO_NOMBRE = TransporteComponent.nombreFormaTransporte(
      TIPO_TRANSPORTE
    ) as keyof this;

    const FORMULARIO = this[FORMULARIO_NOMBRE] as FormGroup;

    const VALORES = TransporteComponent.tieneValoresValidos(FORMULARIO);

    if (!VALORES && !this.observaciones.value) {
      this.cerrarModal();
      return;
    }

    const TRANSPORTE: TransporteDespacho = this.bodyTabla.find(
      (item) => item === this.registroSeleccionado
    ) as TransporteDespacho;    
    
    switch (TIPO_TRANSPORTE) {
      case LISTA_TIPO_TRANSPORTE[0].id: // Carretero
        Object.assign(TRANSPORTE, {
          emp_transportista:
            this.carreteroForma.get('emp_transportista')?.value,
          numero_porte: this.carreteroForma.get('numero_porte')?.value,
          fecha_porte: this.carreteroForma.get('fecha_porte')?.value,
          marca_transporte: this.carreteroForma.get('marca_transporte')?.value,
          modelo_transporte:
            this.carreteroForma.get('modelo_transporte')?.value ===
            SIN_VALOR_SELECT
              ? ''
              : this.carreteroForma.get('modelo_transporte')?.value,
          placas_transporte:
            this.carreteroForma.get('placas_transporte')?.value,
          contenedor_transporte: this.carreteroForma.get(
            'contenedor_transporte'
          )?.value,
        });
        break;
      case LISTA_TIPO_TRANSPORTE[1].id: // Ferroviario
        Object.assign(TRANSPORTE, {
          numero_bl: this.ferroviarioForma.get('numero_bl')?.value,
          tipo_equipo:
            this.ferroviarioForma.get('tipo_equipo')?.value === SIN_VALOR_SELECT
              ? ''
              : this.ferroviarioForma.get('tipo_equipo')?.value,
          iniciales_equipo:
            this.ferroviarioForma.get('iniciales_equipo')?.value,
          numero_equipo: this.ferroviarioForma.get('numero_equipo')?.value,
        });
        break;
      case LISTA_TIPO_TRANSPORTE[2].id: {
        // Aéreo

        Object.assign(TRANSPORTE, {
          arribo_pendiente_aereo: this.aereoForma.get('arribo_pendiente_aereo')
            ?.value,
          arribo_pendiente_aereo_des: this.aereoForma.get(
            'arribo_pendiente_aereo'
          )?.value
            ? 'Sí'
            : 'No',
          guia_master_aereo: this.aereoForma.get('guia_master_aereo')?.value,
          guia_house_aereo: this.aereoForma.get('guia_house_aereo')?.value,
          fecha_arribo_aereo: this.aereoForma.get('fecha_arribo_aereo')?.value,
          hora_arribo_aereo: this.aereoForma.get('hora_arribo_aereo')?.value,
          guia_valida: this.aereoForma.get('guia_valida')?.value,
          guia_valida_des: this.aereoForma.get('guia_valida')?.value
            ? 'Sí'
            : 'No',
        });
        break;
      }
      case LISTA_TIPO_TRANSPORTE[3].id: // Marítimo
        Object.assign(TRANSPORTE, {
          guia_bl_Maritimo: this.maritimoForma.get('guia_bl_Maritimo')?.value,
          guia_house_maritimo: this.maritimoForma.get('guia_house_maritimo')
            ?.value,
          nombre_buque_maritimo: this.maritimoForma.get('nombre_buque_maritimo')
            ?.value,
          contenedor_maritimo: this.maritimoForma.get('contenedor_maritimo')
            ?.value,
        });
        break;
      case LISTA_TIPO_TRANSPORTE[4].id: // Peatonal
        Object.assign(TRANSPORTE, {
          rfc_empresa: this.peatonalForma.get('rfc_empresa')?.value,
          emp_transportista: this.peatonalForma.get('emp_transportista')?.value,
          nombre_transportista: this.peatonalForma.get('nombre_transportista')
            ?.value,
          num_gafete: this.peatonalForma.get('num_gafete')?.value,
        });
        break;
      default: // Otro
        Object.assign(TRANSPORTE, {
          tipo_transporte_des: this.otroForma.get('tipo_transporte_des')?.value || '',
          emp_transportista: this.otroForma.get('emp_transportista')?.value || '',
          datos_transporte: this.otroForma.get('datos_transporte')?.value || '',
        });
        break;
    }

    TRANSPORTE.observaciones = this.observaciones.value;
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: '',
      modo: 'action',
      titulo: TITULO_MODAL_AVISO,
      mensaje: MSG_MODIFICA_ELEMENTO,
      cerrar: false,
      txtBtnAceptar: 'Cerrar',
      txtBtnCancelar: '',
    };
    this.cerrarModal();
    this.enviarTransporteTabla();
  }

  /**
   * Limpia y habilita las cajas para guia house y guia master
   */
  limpiarGuias(): void {
    this.aereoForma.get('guia_master_aereo')?.setValue('');
    this.aereoForma.get('guia_master_aereo')?.enable();
    this.aereoForma.get('guia_house_aereo')?.setValue('');
    this.aereoForma.get('guia_house_aereo')?.enable();
    this.limpiarGuiasBandera = false;
  }
  
}


