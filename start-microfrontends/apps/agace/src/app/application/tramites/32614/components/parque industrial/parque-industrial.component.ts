import {
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
} from '@libs/shared/data-access-user/src';
import { Solicitud32614MensajeriaState, Tramite32614MensajeriaStore} from '../../estados/tramites/tramite32614_mensajeria.store';
import { AgregarTransportistasComponent } from '../agregar-transportistas/agregar-transportistas.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ElementRef } from '@angular/core';
import { FECHA_DE_FACTURA } from '@libs/shared/data-access-user/src/tramites/constantes/32614/datos-comunes.enum';
import { FECHA_DE_INICIO } from '../../constants/solicitud.enum';
import { FECHA_DE_PAGO } from '../../constants/solicitud.enum';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputFecha } from '@libs/shared/data-access-user/src';
import { InputFechaComponent } from '@libs/shared/data-access-user/src';
import { InputRadio } from '../../models/solicitud.model';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { MensajeriaComponent } from '../mensajeria/mensajeria.component';
import { Modal } from 'bootstrap';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { PerfilesMensajeriaComponent } from '../perfiles-mensajeria/perfiles-mensajeria.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud32614Query } from '../../estados/solicitud32614.query';
import { Solicitud32614State } from '../../estados/solicitud32614.store';
import { Solicitud32614Store } from '../../estados/solicitud32614.store';
import { SolicitudRadioLista } from '../../models/solicitud.model';
import { SolicitudService } from '../../services/solicitud.service';
import { Subject } from 'rxjs';
import { TRANSPORTISTAS_CONFIGURACION } from '../../constants/solicitud.enum';
import { TablaDinamicaComponent } from '@libs/shared/data-access-user/src';
import { TablaSeleccion } from '@libs/shared/data-access-user/src';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite32614MensajeriaQuery } from '../../estados/queries/mensajeria.query';
import { TransportistasTable } from '../../models/solicitud.model';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import productivo from '@libs/shared/theme/assets/json/32614/productivo.json';
import { takeUntil } from 'rxjs';

/**
 * Componente principal para gestionar los datos de importador y exportador
 * en el formulario, incluyendo la integración con transportistas y validaciones
 * dinámicas.
 */
@Component({
  selector: 'app-parque-industrial',
  standalone: true,
  imports: [
    CommonModule,
    CatalogoSelectComponent,
    ReactiveFormsModule,
    InputRadioComponent,
    InputFechaComponent,
    TituloComponent,
    TablaDinamicaComponent,
    AgregarTransportistasComponent,
    PerfilesMensajeriaComponent,
    MensajeriaComponent,
  ],
  providers: [SolicitudService],
  templateUrl: './parque-industrial.component.html',
  styleUrl: './parque-industrial.component.scss',
})
export class ParqueIndustrialComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para el componente importador-exportador */
  parqueIndustrialForm!: FormGroup;

  /** Sujeto que maneja la destrucción de suscripciones */
  private destroy$: Subject<void> = new Subject<void>();

  /** Opciones de radio para la selección de valores */
  sinoOpcion: InputRadio = {} as InputRadio;
  /**
   * Representa una opción de radio para el reconocimiento mutuo.
   * Se utiliza para manejar las opciones relacionadas con el mutuo en el formulario.
   */
  mutuo: InputRadio = {} as InputRadio;

  /**
   * Representa una opción de radio para la clasificación de la información.
   * Se utiliza para manejar las opciones relacionadas con la clasificación de la información en el formulario.
   */
  clasificacionInformacion: InputRadio = {} as InputRadio;

  /** Estado de la solicitud */
  solicitud32614State: Solicitud32614State = {} as Solicitud32614State;

  /** Fechas de inicio y pago de la solicitud */
  fechaDeFinDeVigencia: InputFecha = FECHA_DE_INICIO;

  /** Formulario principal de la sección de mensajería */
  public mensajeriaGroup!: FormGroup;
  /**
   * Fecha de pago asociada a la solicitud.
   * Se inicializa con el valor constante `FECHA_DE_PAGO` que contiene la fecha predeterminada de pago.
   */
  fechaDePago: InputFecha = FECHA_DE_PAGO;

  /** Configuración y lista de transportistas */
  transportistasTabla = TablaSeleccion.CHECKBOX;
  /**
   * Configuración de las columnas para la tabla de transportistas.
   * Se inicializa con la configuración predeterminada definida en `TRANSPORTISTAS_CONFIGURACION`.
   */
  transportistasConfiguracionColumnas: ConfiguracionColumna<TransportistasTable>[] =
    TRANSPORTISTAS_CONFIGURACION;

  /**
   * Lista de transportistas disponibles para ser seleccionados en el formulario.
   * Se llena dinámicamente con los datos de transportistas obtenidos desde el servicio.
   */
  transportistasLista: TransportistasTable[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;

  /** Referencia a la vista del modal de transportistas */
  @ViewChild('transportistas', { static: false })
  transportistaElement!: ElementRef;

  /**
   * Constructor del componente
   * @param fb FormBuilder para crear formularios reactivos
   * @param solicitudService Servicio para manejar la lógica de solicitudes
   * @param solicitud32614Store Store para manejar el estado de la solicitud
   * @param solicitud32614Query Consulta para obtener el estado de la solicitud
   */
  constructor(
    private fb: FormBuilder,
    public solicitudService: SolicitudService,
    public solicitud32614Store: Solicitud32614Store,
    public solicitud32614Query: Solicitud32614Query,
    public consultaioQuery: ConsultaioQuery,
    private tramite32614Store: Tramite32614MensajeriaStore,
    private tramite32614MensajeriaQuery: Tramite32614MensajeriaQuery
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
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.conseguirOpcionDeRadio();
    this.conseguirTransportistasLista();
  }

  /**
   * Método llamado al inicializar el componente, configura el formulario con los valores del estado de solicitud
   */
  ngOnInit(): void {
        this.tramite32614MensajeriaQuery.selectSolicitud$
          .pipe(
            takeUntil(this.destroy$),
            map((seccionState) => {
              this.solicitudState = seccionState;
              this.inicializarEstadoFormulario();
            })
          )
          .subscribe();
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.inicializarFormulario();
    }
    if (this.esFormularioSoloLectura) {
      Object.keys(this.mensajeriaGroup.controls)
        .map((key) => this.mensajeriaGroup.get(key))
        .map((control) => {
          control?.disable();
          return control;
        });
    } else {
      Object.keys(this.mensajeriaGroup.controls)
        .map((key) => this.mensajeriaGroup.get(key))
        .map((control) => {
          control?.enable();
          return control;
        });
    }
  }

  /**
   * Establece el valor de un campo y lo propaga al store.
   * @param form Formulario reactivo que contiene el campo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método del store para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32614MensajeriaStore
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32614Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /** Configuración del input de fecha de factura */
  public fechaFacturaInput: InputFecha = FECHA_DE_FACTURA;

  /**
   * Actualiza la fecha de la factura en el formulario y en el store.
   * @param nuevo_valor Nuevo valor para la fecha
   * @param form Formulario reactivo
   * @param campo Nombre del campo a actualizar
   * @param metodoNombre Método del store a invocar
   */
  cambioFechaFactura(
    nuevo_valor: string,
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32614MensajeriaStore
  ): void {
    this.mensajeriaGroup.get('fechaFactura')?.setValue(nuevo_valor);
    this.mensajeriaGroup.get('fechaFactura')?.markAsUntouched();
    const VALOR = form.get(campo)?.value;
    (this.tramite32614Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** Lista de sectores productivos leída desde un archivo JSON */
  public sectorProductivoAgace: Catalogo[] = productivo;

    /**
   * Estado actual de la solicitud del trámite
   */
  public solicitudState!: Solicitud32614MensajeriaState;
 

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.parqueIndustrialForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.parqueIndustrialForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el formulario `parqueIndustrialForm` con los valores del estado actual `solicitud32614State`.
   *
   * Este formulario recopila información relacionada con operaciones de importación y exportación,
   * como identificadores de campos (`2042`, `2043`, `2044`), fechas clave, montos y detalles bancarios.
   *
   * Detalles del formulario:
   * - Algunos campos como `fechaInicioComercio` se inician deshabilitados y con validaciones (`Validators.required`).
   * - Otros campos tienen validaciones específicas como `Validators.maxLength`.
   *
   * El método también se suscribe al observable `selectSolicitud$` para actualizar el formulario cuando
   * cambie el estado global de la solicitud.
   *
   * La suscripción se gestiona con `takeUntil` para evitar fugas de memoria.
   */
  inicializarFormulario(): void {
    this.parqueIndustrialForm = this.fb.group({
      '2042': [this.solicitud32614State[2042]],
      '2043': [this.solicitud32614State[2043]],
      '2044': [this.solicitud32614State[2044]],
      fechaInicioComercio: [
        { value: this.solicitud32614State.fechaInicioComercio, disabled: true },
        Validators.required,
      ],
      fechaPago: [this.solicitud32614State.fechaPago],
      monto: [this.solicitud32614State.monto, [Validators.maxLength(10)]],
      operacionesBancarias: [
        this.solicitud32614State.operacionesBancarias,
        [Validators.maxLength(25)],
      ],
      llavePago: [
        this.solicitud32614State.llavePago,
        [Validators.maxLength(25)],
      ],
    });

    // Initialize mensajeriaGroup for the payment section
    this.mensajeriaGroup = this.fb.group({
      claveReferencia: [this.solicitudState?.claveReferencia, Validators.required],
      numeroOperacion: [this.solicitudState?.numeroOperacion, Validators.required],
      cadenaDependencia: [this.solicitudState?.cadenaDependencia, Validators.required],
      banco: [this.solicitudState?.banco, Validators.required],
      llavePago: [this.solicitudState?.llavePago, Validators.required],
      fechaFactura: [this.solicitudState?.fechaFactura],
      importePago: [this.solicitudState?.importePago, Validators.required],
    });

  }

  /**
   * Obtiene las opciones de radio desde el servicio de solicitud
   */
  conseguirOpcionDeRadio(): void {
    this.solicitudService
      .conseguirOpcionDeRadio()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: SolicitudRadioLista) => {
          this.sinoOpcion = respuesta.requisitos;
          this.mutuo = respuesta.reconocimientoMutuo;
          this.clasificacionInformacion = respuesta.clasificacionInformacion;
        },
      });
  }

  /**
   * Obtiene la lista de transportistas desde el servicio de solicitud
   */
  conseguirTransportistasLista(): void {
    this.solicitudService
      .conseguirTransportistasLista()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta: TransportistasTable[]) => {
          this.transportistasLista = respuesta;
        },
      });
  }

  /**
   * Actualiza el valor de la propiedad 2042 en el store
   * @param evento Nuevo valor para la propiedad
   */
  actualizar2042(evento: string | number): void {
    this.solicitud32614Store.actualizar2042(evento);
  }

  /**
   * Actualiza el valor de la propiedad 2043 en el store
   * @param evento Nuevo valor para la propiedad
   */
  actualizar2043(evento: string | number): void {
    this.solicitud32614Store.actualizar2043(evento);
  }

  /**
   * Actualiza el valor de la propiedad 2044 en el store
   * @param evento Nuevo valor para la propiedad
   */
  actualizar2044(evento: string | number): void {
    this.solicitud32614Store.actualizar2044(evento);
  }

  /**
   * Actualiza la fecha de inicio del comercio en el store
   * @param evento Fecha de inicio del comercio
   */
  actualizarFechaInicioComercio(evento: string): void {
    this.solicitud32614Store.actualizarFechaInicioComercio(evento);
  }

  /**
   * Actualiza la fecha de pago en el store
   * @param evento Fecha de pago
   */
  actualizarFechaPago(evento: string): void {
    this.solicitud32614Store.actualizarFechaPago(evento);
  }

  /**
   * Actualiza el monto de la solicitud en el store
   * @param evento Monto de la solicitud
   */
  actualizarMonto(evento: string): void {
    this.solicitud32614Store.actualizarMonto(evento);
  }

  /**
   * Actualiza las operaciones bancarias en el store
   * @param evento Operaciones bancarias
   */
  actualizarOperacionesBancarias(evento: string): void {
    this.solicitud32614Store.actualizarOperacionesBancarias(evento);
  }

  /**
   * Actualiza la llave de pago en el store
   * @param evento Llave de pago
   */
  actualizarLlavePago(evento: string): void {
    this.solicitud32614Store.actualizarLlavePago(evento);
  }

  /**
   * Muestra el modal para agregar un nuevo transportista
   */
  agregarTransportistaModel(): void {
    if (this.transportistaElement) {
      const MODAL_INSTANCE = new Modal(this.transportistaElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /**
   * Agrega un transportista a la lista
   * @param evento Datos del transportista
   */
  transportistasDatos(evento: TransportistasTable): void {
    this.transportistasLista.push(evento);
  }

  /**
   * Método llamado al destruir el componente, limpia las suscripciones
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
