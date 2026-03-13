import { FECHA_DE_FACTURA, OPCIONES_DE_BOTON_DE_RADIO, OPCIONES_INFORMACION, OPCIONES_RECONOCIMIENTO } from '@libs/shared/data-access-user/src/tramites/constantes/32616/datos-comunes.enum';
import { MERCANCIA_TABLA, MercanciasInfo } from '@libs/shared/data-access-user/src/core/models/32616/dato-comunes.model';

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Catalogo, CatalogoSelectComponent, ConfiguracionColumna, InputFecha, InputFechaComponent, InputRadioComponent, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32616MensajeriaState, Tramite32616MensajeriaStore } from '../../estados/tramites/tramite32616_mensajeria.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { Modal } from 'bootstrap';
import { SolicitudDeRegistroInvocarService } from '../../services/solicitudDeRegistroInvocar/solicitud-de-registro-invocar.service';
import { TEXTOS_ESTATICOS_MENSAJERIA } from '../../constantes/texto-estatico.enum';
import { Tramite32616MensajeriaQuery } from '../../estados/queries/mensajeria.query';
import productivo from '@libs/shared/theme/assets/json/32616/productivo.json';
/**
 * Componente que gestiona la sección de mensajería para el trámite 32616.
 * Permite capturar y mostrar información relacionada con solicitantes, filiales,
 * empresas y mercancías, así como datos del pago.
 */
@Component({
  selector: 'app-mensajeria',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    TituloComponent,
    TablaDinamicaComponent,
    CatalogoSelectComponent,
    InputFechaComponent
  ],
  templateUrl: './mensajeria.component.html',
  styleUrl: './mensajeria.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MensajeriaComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_MENSAJERIA

  /** Formulario principal de la sección de mensajería */
  public mensajeriaGroup!: FormGroup;

  /** Formulario para la sección de sus filiales */
  public susFilialesForm!: FormGroup;

  /** Formulario para la sección de las empresas */
  public lasEmpresasForm!: FormGroup;

  /**
   * Determina si el formulario debe estar en modo solo lectura.
   */
  esFormularioSoloLectura: boolean = false;

  /** Observable utilizado para cancelar suscripciones activas */
  public destroyNotifier$: Subject<void> = new Subject();

  /** Estado actual de la solicitud */
  public solicitudState!: Solicitud32616MensajeriaState;

  /** Opciones para los botones de radio */
  public opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /** Opciones de reconocimiento mutuo */
  public opcionReconocimiento = OPCIONES_RECONOCIMIENTO;

  /** Opciones de información proporcionada */
  public opcionInformacionProporcionada = OPCIONES_INFORMACION;

  /** Bandera que indica si es "La Solicitante" */
  public isLaSolicitante: boolean = false;

  /** Bandera que indica si aplica a "Sus Filiales" */
  public isSusFiliales: boolean = false;

  /** Bandera que indica si aplica a "Las Empresas" */
  public isLasEmpresas: boolean = false;

  /** Configuración del input de fecha de factura */
  public fechaFacturaInput: InputFecha = FECHA_DE_FACTURA;

  /** Configuración de columnas para la tabla de mercancías */
  public mercanciasTabla: ConfiguracionColumna<MercanciasInfo>[] = MERCANCIA_TABLA;

  /** Datos a mostrar en la tabla de mercancías */
  public mercanciasTablaDatos: MercanciasInfo[] = [];

  /** Tipo de selección usada en la tabla (Checkbox) */
  public tablaSeleccionCheckbox: TablaSeleccion = TablaSeleccion.CHECKBOX;

  /** Referencia al modal de la primera tabla */
  @ViewChild('tablaModal', { static: false }) public tablaModal!: ElementRef;

  /** Referencia al modal de la segunda tabla */
  @ViewChild('tablaDosModal', { static: false }) public tablaDosModal!: ElementRef;

  /** Instancia del modal de la primera tabla */
  public tablaInstance!: Modal;

  /** Instancia del modal de la segunda tabla */
  public tablaDosInstance!: Modal;

  /** Lista de sectores productivos leída desde un archivo JSON */
  public sectorProductivoAgace: Catalogo[] = productivo;

  /**
   * Constructor del componente
   * @param fb FormBuilder para la creación de formularios reactivos
   * @param service Servicio para obtener datos de la tabla
   * @param tramite32616Store Store del trámite 32616
   * @param tramite32616Query Query del trámite 32616
   */
  constructor(
    private fb: FormBuilder,
    private service: SolicitudDeRegistroInvocarService,
    private tramite32616Store: Tramite32616MensajeriaStore,
    private tramite32616Query: Tramite32616MensajeriaQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /**
     * Inicializa el formulario con datos del store y aplica validaciones.
     * También aplica configuración de solo lectura si es necesario.
     * @method inicializarEstadoFormulario
     */
  inicializarEstadoFormulario(): void {
    this.tramite32616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormulario();
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
   * Método del ciclo de vida `ngOnInit`.
   * Se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.tramite32616Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.obtenerTablaDatos();
  }

  /**
   * Método del ciclo de vida `ngAfterViewInit`.
   * Se ejecuta una vez que la vista ha sido completamente inicializada.
   */
  ngAfterViewInit(): void {
    if (this.tablaModal) {
      this.tablaInstance = new Modal(this.tablaModal.nativeElement);
    }
    if (this.tablaDosModal) {
      this.tablaDosInstance = new Modal(this.tablaDosModal.nativeElement);
    }
  }

  /**
   * Crea e inicializa los formularios del componente.
   */
  crearFormulario(): void {
    this.mensajeriaGroup = this.fb.group({
      laSolicitante: [this.solicitudState?.laSolicitante],
      susFiliales: [this.solicitudState?.susFiliales],
      lasEmpresas: [this.solicitudState?.lasEmpresas],
      finDeVigencia: [this.solicitudState?.finDeVigencia],
      numeroDeOficio: [this.solicitudState?.numeroDeOficio],
      fechaDePresentacion: [this.solicitudState?.fechaDePresentacion],
      mensajeriaPaqueteria: [this.solicitudState?.mensajeriaPaqueteria],
      laSolicitanteInterna: [this.solicitudState?.laSolicitanteInterna],
      subsidiaria: [this.solicitudState?.subsidiaria],
      filiales: [this.solicitudState?.filiales],
      matrices: [this.solicitudState?.matrices],
      aeronauticaCivil: [this.solicitudState?.aeronauticaCivil],
      conformidadArticulos: [this.solicitudState?.conformidadArticulos],
      documentosMercancias: [this.solicitudState?.documentosMercancias],
      generalAeronauticaCivil: [this.solicitudState?.generalAeronauticaCivil],
      exteriorConformidad: [this.solicitudState?.exteriorConformidad],
      reconocimientoMutuo: [this.solicitudState?.reconocimientoMutuo],
      rfcListado: [this.solicitudState?.rfcListado],
      nombreRazonSocialListado: [this.solicitudState?.nombreRazonSocialListado],
      direccionFiscalListado: [this.solicitudState?.direccionFiscalListado],
      paginaElectronicaListado: [this.solicitudState?.paginaElectronicaListado],
      correoElectronicaListado: [this.solicitudState?.correoElectronicaListado],
      telefonoContactoListado: [this.solicitudState?.telefonoContactoListado],
      informacionProporcionada: [this.solicitudState?.informacionProporcionada],
      claveReferencia: [this.solicitudState?.claveReferencia, Validators.required],
      numeroOperacion: [this.solicitudState?.numeroOperacion, Validators.required],
      cadenaDependencia: [this.solicitudState?.cadenaDependencia, Validators.required],
      banco: [this.solicitudState?.banco, Validators.required],
      llavePago: [this.solicitudState?.llavePago, Validators.required],
      fechaFactura: [this.solicitudState?.fechaFactura, Validators.required],
      importePago: [this.solicitudState?.importePago, Validators.required]
    });

    this.susFilialesForm = this.fb.group({
      rfc: [this.solicitudState?.rfc, Validators.required],
      rfcDos: [{ value: '', disabled: true }],
      denominacionRazonSocial: [{ value: '', disabled: true }],
      domicilio: [{ value: '', disabled: true }],
    });

    this.lasEmpresasForm = this.fb.group({
      rfcLasEmpresas: [this.solicitudState?.rfcLasEmpresas, Validators.required],
      denominacionRazonSocial: [{ value: '', disabled: true }],
      domicilio: [{ value: '', disabled: true }],
    });

    this.isLaSolicitante = parseInt(this.solicitudState?.laSolicitante, 10) === 1;
    this.isSusFiliales = parseInt(this.solicitudState?.susFiliales, 10) === 1;
    this.isLasEmpresas = parseInt(this.solicitudState?.lasEmpresas, 10) === 1;
  }

  /**
   * Obtiene los datos de la tabla de mercancías desde el servicio.
   */
  obtenerTablaDatos(): void {
    this.service.obtenerTablaDatos()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        const DATOS = data?.data;
        this.mercanciasTablaDatos.push(DATOS[0]);
      });
  }

  /**
   * Abre el modal de la primera tabla.
   */
  openTablaModal(): void {
    if (this.tablaInstance) {
      this.tablaInstance.show();
    }
  }

  /**
   * Cierra el modal de la primera tabla.
   */
  closeTablaModal(): void {
    if (this.tablaInstance) {
      this.tablaInstance.hide();
    }
  }

  /**
   * Abre el modal de la segunda tabla.
   */
  openTablaDosModal(): void {
    if (this.tablaDosInstance) {
      this.tablaDosInstance.show();
    }
  }

  /**
   * Cierra el modal de la segunda tabla.
   */
  closeTablaDosModal(): void {
    if (this.tablaDosInstance) {
      this.tablaDosInstance.hide();
    }
  }

  /**
   * Establece el valor de un campo y lo propaga al store.
   * @param form Formulario reactivo que contiene el campo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método del store para actualizar el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32616MensajeriaStore): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite32616Store[metodoNombre] as (value: string) => void)(VALOR);

    if (campo === 'laSolicitante') {
      this.isLaSolicitante = VALOR === true;
    }
    if (campo === 'susFiliales') {
      this.isSusFiliales = VALOR === true;
    }
    if (campo === 'lasEmpresas') {
      this.isLasEmpresas = VALOR === true;
    }
  }

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
    metodoNombre: keyof Tramite32616MensajeriaStore
  ): void {
    this.mensajeriaGroup.get('fechaFactura')?.setValue(nuevo_valor);
    this.mensajeriaGroup.get('fechaFactura')?.markAsUntouched();
    const VALOR = form.get(campo)?.value;
    (this.tramite32616Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Método del ciclo de vida `ngOnDestroy`.
   * Se ejecuta al destruir el componente para liberar recursos.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
