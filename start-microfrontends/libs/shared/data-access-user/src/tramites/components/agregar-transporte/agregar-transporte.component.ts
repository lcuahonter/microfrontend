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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  HEADER_TABLA_AEREO,
  HEADER_TABLA_CARRETERO,
  HEADER_TABLA_FERROVIARIO,
  HEADER_TABLA_MARITIMO,
  HEADER_TABLA_OTRO,
  HEADER_TABLA_PEATONAL,
  LABEL_HORA_ARRIBO,
} from '../../../core/enums/transporte-componente.enum';
import {
  ItemTransporteDespacho,
  TransporteAereo,
  TransporteCarretero,
  TransporteDespacho,
  TransporteFerroviario,
  TransporteMaritimo,
  TransporteOtro,
  TransportePeatonal,
} from '../../../core/models/shared/agregar-transporte.model';
import { Subject, takeUntil, tap } from 'rxjs';
import { Catalogo } from '../../../core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '../catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';

import { Catalogos } from '../../../core/models/shared/catalogo.model';
import { InputCheckComponent } from '../input-check/input-check.component';
import { InputHoraComponent } from '../input-hora/input-hora.component';
import { Modal } from 'bootstrap';
import { TipoEquipoService } from '../../../core/services/shared/catalogos/tipo-equipo.service';
import { ValidaTransporteService } from '../../../core/services/shared/api-validaciones/valida-transporte.service';

import {
  Notificacion,
  NotificacionesComponent,
} from '../notificaciones/notificaciones.component';
import { BooleanoSiNoPipe } from '../../pipes/booleanoSiNo/booleano-si-no.pipe';
import { TIPO_TRANSPORTE } from '../../constantes/agregar-transporte.enum';
import { TablaDinamicaComponent } from '../tabla-dinamica/tabla-dinamica.component';
import { TablaSeleccion } from '../../../core/enums/tabla-seleccion.enum';

import { ConfiguracionColumna } from '../../../core/models/shared/configuracion-columna.model';

@Component({
  selector: 'lib-agregar-transporte',
  standalone: true,
  imports: [
    CatalogoSelectComponent,
    CommonModule,
    InputCheckComponent,
    ReactiveFormsModule,
    InputHoraComponent,
    NotificacionesComponent,
    BooleanoSiNoPipe,
    TablaDinamicaComponent,
  ],
  templateUrl: './agregar-transporte.component.html',
  styleUrl: './agregar-transporte.component.scss',
})

/**
 * @deprecated
 * Este componente se va a deprecar, en su lugar se va a utilizar el componente <lib-transporte>
 */
export class AgregarTransporteComponent implements OnChanges, OnInit {
  /**
   * Tipo de trasnporte seleccionado.
   * @type {string}
   */
  @Input() tipo!: string;

  /**
   * Datos de la tabla de transporte.
   * @type {any[]}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() tablaTransporte!: any[];

  /**
   * Emisor de eventos para enviar los datos de la tabla.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Output() datosTabla: EventEmitter<any[]> = new EventEmitter<
    (
      | TransporteAereo
      | TransporteCarretero
      | TransporteFerroviario
      | TransporteMaritimo
      | TransporteOtro
      | TransportePeatonal
    )[]
  >();

  @ViewChild('agregarTransporte') agregarTransporte!: ElementRef;
  @ViewChild('btnCerrarModal') btnCerrarModal!: ElementRef;

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
   * Cabecera de la tabla para el transporte ferroviario.
   */
  readonly HEADER_TABLA_FERROVIARIO: ItemTransporteDespacho[] =
    HEADER_TABLA_FERROVIARIO;

  /**
   * Cabecera de la tabla para el transporte carretero.
   */
  readonly HEADER_TABLA_CARRETERO: ItemTransporteDespacho[] =
    HEADER_TABLA_CARRETERO;

  /**
   * Cabecera de la tabla para el transporte peatonal.
   */
  readonly HEADER_TABLA_PEATONAL: ItemTransporteDespacho[] =
    HEADER_TABLA_PEATONAL;

  /**
   * Cabecera de la tabla para el transporte otro.
   */
  readonly HEADER_TABLA_OTRO: ItemTransporteDespacho[] = HEADER_TABLA_OTRO;

  /**
   * Cabecera de la tabla para el transporte aereo.
   */
  readonly HEADER_TABLA_AEREO: ItemTransporteDespacho[] = HEADER_TABLA_AEREO;

  /**
   * Cabecera de la tabla para el transporte maritimo.
   */
  readonly HEADER_TABLA_MARITIMO: ItemTransporteDespacho[] =
    HEADER_TABLA_MARITIMO;

  /**
   * Etiqueta para la hora de arribo.
   */
  readonly LABEL_HORA_ARRIBO: string = LABEL_HORA_ARRIBO;

  tituloModal!: string;
  mensajeModal!: string;

  /**
   * Cabecera de la tabla.
   */
  headerTabla!: ItemTransporteDespacho[];

  /**
   * Contenido de la tabla.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodyTabla: any[] = [];

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
   * Forma seleccionada para el transporte.
   */
  formaSeleccionada!: string;

  public tipoEquipoCatalogo: Catalogos[] = [];

  /**
   * Control para las observaciones.
   */
  public observaciones: FormControl = new FormControl('', [
    Validators.maxLength(500),
  ]);
  anios!: Catalogo[];

  /**
   * @descripcion Notificación para mostrar mensajes al usuario.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * @description Notificador para destruir el observable al finalizar el componente.
   * Se utiliza para evitar fugas de memoria y asegurar que los recursos se liberen adecuadamente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  constructor(
    private fb: FormBuilder,
    private tipoEquipoServicio: TipoEquipoService,
    private validaTransporteService: ValidaTransporteService
  ) {}

  ngOnInit(): void {
    this.getTipoEquipo();
  }

  /**
   * Detecta y maneja los cambios en las propiedades de entrada del componente.
   *
   * @param changes - Objeto que contiene los cambios en las propiedades de entrada.
   *                  'tipo': Actualiza el encabezado de la tabla según el tipo.
   *                  'tablaTransporte': Actualiza el cuerpo de la tabla con los datos proporcionados.
   * @returns void
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipo'] && changes['tipo'].currentValue) {
      this.headerTabla = this.tipoTabla();
    }

    if (changes['tablaTransporte'] && changes['tablaTransporte'].currentValue) {
      this.bodyTabla = [...this.tablaTransporte];
    }
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte carretero.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearCarreteroForm(): void {
    this.carreteroForma = this.fb.group({
      empTransportista: ['', [Validators.maxLength(80)]],
      numeroPorte: ['', [Validators.maxLength(50)]],
      fechaPorte: ['', [Validators.maxLength(10)]],
      marcaTransporte: ['', [Validators.maxLength(70)]],
      modeloTransporte: [-1],
      placasTransporte: ['', [Validators.maxLength(150)]],
      contenedorTransporte: ['', [Validators.maxLength(150)]],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte carretero.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearFerroviarioForm(): void {
    this.ferroviarioForma = this.fb.group({
      numeroBL: ['', [Validators.maxLength(25)]],
      tipoEquipo: [{ value: '-1', disabled: true }],
      inicialesEquipo: [
        { value: '', disabled: true },
        [Validators.maxLength(10)],
      ],
      numeroEquipo: [{ value: '', disabled: true }, [Validators.maxLength(15)]],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte peatonal.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearPeatonalForm(): void {
    this.peatonalForma = this.fb.group({
      rfcEmpresa: ['', [Validators.maxLength(13)]],
      empTransportista: ['', [Validators.maxLength(80)]],
      nombreTransportista: ['', [Validators.maxLength(100)]],
      numGafete: ['', [Validators.maxLength(20)]],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte otro.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearOtroForm(): void {
    this.otroForma = this.fb.group({
      tipoTransporteDes: ['', [Validators.maxLength(100)]],
      empTransportista: ['', [Validators.maxLength(80)]],
      datosTransporte: ['', [Validators.maxLength(250)]],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte áereo.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearAereoForm(): void {
    this.aereoForma = this.fb.group({
      arriboPendienteAereo: [''],
      guiaMasterAereo: ['', [Validators.maxLength(12)]],
      guiaHouseAereo: ['', [Validators.maxLength(25)]],
      fechaArriboAereo: ['', [Validators.maxLength(15)]],
      horaArriboAereo: ['', [Validators.maxLength(5)]],
      guiaValida: [{ value: false, disabled: true }],
    });
  }

  /**
   * Crea y configura el formulario reactivo para los datos del transporte marítimo.
   * Define los campos con sus valores iniciales y validaciones correspondientes.
   * @returns void
   */
  crearMaritimoForm(): void {
    this.maritimoForma = this.fb.group({
      guiaBLMaritimo: ['', [Validators.maxLength(15)]],
      guiaHouseMaritimo: ['', [Validators.maxLength(15)]],
      nombreBuqueMaritimo: ['', [Validators.maxLength(70)]],
      contenedorMaritimo: ['', Validators.maxLength(600)],
    });
  }

  /**
   * Determina el tipo de tabla y configura el formulario correspondiente según el tipo de transporte.
   *
   * @returns {ItemTransporteDespacho[]} Encabezados de la tabla correspondientes al tipo de transporte seleccionado.
   */
  tipoTabla(): ItemTransporteDespacho[] {
    switch (parseInt(this.tipo, 10)) {
      case 1:
        this.formaSeleccionada = 'carreteroForma';
        this.anios = AgregarTransporteComponent.obtenerAniosModelo();
        this.crearCarreteroForm();
        return this.HEADER_TABLA_CARRETERO;
      case 2:
        this.crearFerroviarioForm();
        return this.HEADER_TABLA_FERROVIARIO;
      case 3:
        this.crearAereoForm();
        return this.HEADER_TABLA_AEREO;
        break;
      case 4:
        this.crearMaritimoForm();
        return this.HEADER_TABLA_MARITIMO;
        break;
      case 5:
        this.crearPeatonalForm();
        return this.HEADER_TABLA_PEATONAL;
      default:
        this.crearOtroForm();
        return this.HEADER_TABLA_OTRO;
    }
  }

  /**
   * Abre el modal para agregar un documento.
   * @returns {void}
   */
  abrirModal(): void {
    const MODAL_AGREGA = new Modal(this.agregarTransporte.nativeElement);
    MODAL_AGREGA.show();
  }

  /**
   * Cierra el modal.
   * @returns {void}
   */
  cerrarModal(): void {
    this.btnCerrarModal.nativeElement.click();
    this.tituloModal = '';
    this.mensajeModal = '';
  }

  /**
   * Restablece el formulario carretero a su estado inicial.
   * @returns {void}
   */
  limpiarFormulario(): void {
    const FORMULARIOS = [
      this.carreteroForma,
      this.ferroviarioForma,
      this.peatonalForma,
      this.otroForma,
      this.aereoForma,
      this.maritimoForma,
    ];

    FORMULARIOS.forEach((form) => form?.reset());

    this.observaciones.setValue('');
  }

  /**
   * Agrega un tipo de transporte a la tabla según el tipo seleccionado.
   *
   * @returns {void} No retorna ningún valor.
   */
  agregarTipoTransporte(): void {
    switch (parseInt(this.tipo, 10)) {
      case 1: {
        const TRANSPORTE: TransporteCarretero = this.carreteroForma.value;
        TRANSPORTE.observaciones = this.observaciones.value;
        this.bodyTabla.push(TRANSPORTE);
        this.carreteroForma.reset();
        break;
      }

      case 2: {
        const TRANSPORTE: TransporteFerroviario =
          this.ferroviarioForma.getRawValue();
        TRANSPORTE.tipoEquipo =
          TRANSPORTE.tipoEquipo === '-1' ? '' : TRANSPORTE.tipoEquipo;
        TRANSPORTE.observaciones = this.observaciones.value;
        this.bodyTabla.push(TRANSPORTE);
        this.ferroviarioForma.reset();
        break;
      }

      case 3: {
        const TRANSPORTE: TransporteAereo = this.aereoForma.getRawValue();
        TRANSPORTE.observaciones = this.observaciones.value;
        this.bodyTabla.push(TRANSPORTE);
        this.aereoForma.reset();
        break;
      }

      case 4: {
        const TRANSPORTE: TransporteMaritimo = this.maritimoForma.value;
        TRANSPORTE.observaciones = this.observaciones.value;
        this.bodyTabla.push(TRANSPORTE);
        this.maritimoForma.reset();
        break;
      }
      case 5: {
        const TRANSPORTE: TransportePeatonal = this.peatonalForma.value;
        TRANSPORTE.observaciones = this.observaciones.value;
        this.bodyTabla.push(TRANSPORTE);
        this.peatonalForma.reset();
        break;
      }

      default: {
        const TRANSPORTE: TransporteOtro = this.otroForma.value;
        TRANSPORTE.observaciones = this.observaciones.value;
        this.bodyTabla.push(TRANSPORTE);
        this.otroForma.reset();
        break;
      }
    }

    this.enviarTransporteTabla();
    this.cerrarModal();
  }

  /**
   * Selecciona o deselecciona todos los checkboxes con la clase 'check-transporte'.
   *
   * @param event - Evento que contiene el estado del checkbox principal.
   * @returns void
   */
  // eslint-disable-next-line class-methods-use-this
  seleccionarTodos(event: Event): void {
    const CHECKBOXES = document.querySelectorAll('.check-transporte');
    CHECKBOXES.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = (
        event.target as HTMLInputElement
      ).checked;
    });
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
   * Emite los datos de transporte a la tabla.
   *
   * @returns {void} No retorna ningún valor.
   */
  enviarTransporteTabla(): void {
    this.datosTabla.emit(this.bodyTabla);
  }

  //#Servicios

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
   * Valida el número BL para el transporte ferroviario, si s valido, regresa los datos de tipo equipo, Iniciales de quipo y Número de equipo.
   * @returns {void} No retorna ningún valor.
   */
  postValidarNumeroBL(): void {
    const NUMERO_BL = parseInt(
      this.ferroviarioForma.get('numeroBL')?.value,
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
              this.agregarValorCampoDisabled('tipoEquipo', DATOS.tipoEquipo);
              this.agregarValorCampoDisabled(
                'inicialesEquipo',
                DATOS.inicialesEquipo
              );
              this.agregarValorCampoDisabled(
                'numeroEquipo',
                DATOS.numeroEquipo
              );
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: '',
                modo: 'action',
                titulo: 'Aviso',
                mensaje: 'Número BL es inválido.',
                cerrar: false,
                txtBtnAceptar: 'Cerrar',
                txtBtnCancelar: '',
              };
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
        mensaje: 'Debes agregar un número BL.',
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
    const GUIA_MASTER = this.aereoForma.get('guiaMasterAereo')?.value;
    const GUIA_HOUSE = this.aereoForma.get('guiaHouseAereo')?.value;

    if (GUIA_HOUSE && GUIA_MASTER) {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: '',
        modo: 'action',
        titulo: 'Aviso',
        mensaje: 'Debes registar una sola guía.',
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
        mensaje: 'Debes registrar la guía master o la guía house.',
        cerrar: false,
        txtBtnAceptar: 'Cerrar',
        txtBtnCancelar: '',
      };
      return;
    }

    const GUIA = GUIA_MASTER ? GUIA_MASTER : GUIA_HOUSE;
    this.validaTransporteService
      .getValidaTransporte(TIPO_TRANSPORTE.AEREO, { guiaHouseAereo: GUIA })
      .pipe(
        tap((response) => {
          if (response.codigo === '00') {
            this.aereoForma.get('guiaValida')?.setValue(true);
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
   * Verifica si el valor proporcionado es un booleano.
   *
   * @param valor - Valor a verificar.
   * @returns {boolean} `true` si el valor es un booleano, de lo contrario `false`.
   */

  // eslint-disable-next-line class-methods-use-this
  esBooleano(valor: string | number | boolean): boolean {
    return typeof valor === 'boolean';
  }
}
