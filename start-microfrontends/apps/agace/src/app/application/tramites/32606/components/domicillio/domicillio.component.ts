import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, ConsultaioState, InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DOMICILIO_CATALOGO, DOMICILLIO_TABLA, ENTIDAD_CATALOGO, ENTIDAD_TABLA, RADIO_07, TIPO_INSTALACION_CATALOGO } from '../../constantes/adace32606.enum';
import { Domicillio, EntidadFederativa } from '../../models/adace.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32606State, Tramite32606Store } from '../../state/tramite32606.store';
import { CommonModule } from '@angular/common';
import { DomicillioLabelEnum } from '../../constantes/labels32606.enum';
import { EconomicoService } from '../../services/economico.service';
import { Modal } from 'bootstrap';
import { Tramite32606Query } from '../../state/tramite32606.query';

/** Componente para la sección de domicilio del trámite 32606. */
@Component({
  selector: 'app-domicillio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CatalogoSelectComponent, TablaDinamicaComponent, InputRadioComponent, TituloComponent,
    NotificacionesComponent],
  templateUrl: './domicillio.component.html',
  styleUrl: './domicillio.component.scss',
})
export class DomicillioComponent implements OnInit, OnDestroy {
  /** Formulario reactivo principal de domicilio. */
  public domicillioForm!: FormGroup;
  /** Catálogo de domicilio. */
  public domicillio = DOMICILIO_CATALOGO;
  /** Catálogo de tipo de instalación. */
  public tipoDeInstalacion = TIPO_INSTALACION_CATALOGO;
  /** Catálogo de entidad federativa. */
  public entidadFederativa = ENTIDAD_CATALOGO;
  /** Referencia a la tabla de selección. */
  public TablaSeleccion = TablaSeleccion;
  /** Configuración de la tabla de domicilio. */
  public domicillioTabla = DOMICILLIO_TABLA;
  /** Configuración de la tabla de entidad. */
  public entidadTabla = ENTIDAD_TABLA;
  /** Datos de domicilio para la tabla. */
  public domicillioDatos: Domicillio[] = [];
  /** Opciones para el radio tipo 07. */
  radioOpcions07 = RADIO_07;
  /** Nombre del archivo seleccionado. */
  nombreArchivo: string = '';
  /** Nombre del segundo archivo seleccionado. */
  nombreArchivo2: string = '';
  /** Notificación para el modal. */
  public nuevaNotificacion!: Notificacion;
  /** Índice del elemento a eliminar. */
  public elementoParaEliminar!: number;
  /** Lista de pedimentos. */
  public pedimentos: Array<Pedimento> = [];
  /** Referencia al modal de agregar domicilio. */
  @ViewChild('modalAgregar') modalElement!: ElementRef;
  /** Referencia al botón de cerrar modal. */
  @ViewChild('closeModal') closeModalButton!: ElementRef;
  /** Datos de la tabla de entidad federativa. */
  public entidadTablaDatos: EntidadFederativa[] = [];
  /** Domicilios seleccionados para eliminar. */
  seleccionarDomiciliosDatos: Domicillio[] = [] as Domicillio[];
  /** Referencia al modal de instalaciones principales. */
  @ViewChild('modalInstalacionesPrincipales', { static: false })
  modalInstalacionesPrincipalesElement!: ElementRef;
  /** Evento para emitir instalaciones principales seleccionadas. */
  @Output() instalacionesPrincipales = new EventEmitter<Domicillio>();
  /** Indica si el formulario está en modo solo lectura. */
  soloLectura: boolean = false;
  /** Estado actual de la solicitud. */
  public solicitudState!: Solicitud32606State;
  /** Observable para controlar la destrucción de suscripciones. */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** Estado de consulta actual. */
  consultaDatos!: ConsultaioState;
  /** Etiquetas para los campos del formulario. */
  enumEtiquetas = DomicillioLabelEnum;

   /**
   * Constructor del componente DomicillioComponent.
   * Se utiliza para la inyección de dependencias y la suscripción al estado de consulta,
   * lo que permite determinar si el formulario debe estar en modo solo lectura y actualizar su estado inicial.
   *
   * @param economico Servicio para operaciones económicas y obtención de catálogos.
   * @param query Servicio para consultar el estado actual del trámite 32606.
   * @param store Almacén global para gestionar el estado del trámite 32606.
   * @param fb Constructor de formularios reactivos.
   * @param consultaioQuery Servicio para consultar el estado de la sección y determinar el modo de solo lectura.
   */
  constructor(private economico: EconomicoService,
    public query: Tramite32606Query,
    public store: Tramite32606Store,
    private fb: FormBuilder,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.domicillioDatos = [];
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
  }

  /** Inicializa el formulario y sus valores según el modo solo lectura. */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.inicializarEstadoFormulario();
    this.obtenerDomicillio();
    this.obtenerEntidad();
    this.obtenerTablaEntidad();
    this.obtenerTablaDomicillio();
  }

  /** Establece el estado inicial del formulario según soloLectura. */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /** Habilita o deshabilita el formulario según soloLectura. */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.domicillioForm.disable();
    } else {
      this.domicillioForm.enable();
    }
  }

  /** Muestra el modal de instalaciones principales y abre el modal de notificación. */
  public seleccionarModificar(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(
        this.modalInstalacionesPrincipalesElement.nativeElement
      );
      MODAL_INSTANCE.show();
    }
    this.abrirModal();
  }

  /** Elimina los domicilios seleccionados de la lista. */
  eliminarDomiciliosDatos(): void {
    if (this.seleccionarDomiciliosDatos.length > 0) {
      this.seleccionarDomiciliosDatos.forEach((elemento) => {
        const INDICE = this.domicillioDatos.findIndex(
          (inv) => inv.tipoInstalacion === elemento.tipoInstalacion
        );
        if (INDICE !== -1) {
          this.domicillioDatos.splice(INDICE, 1);
        }
      });
    }
  }

  /** Muestra el modal para agregar domicilio. */
  public onAgregarClick(): void {
    if (this.modalElement) {
      const MODAL_INSTANCE = new Modal(this.modalElement.nativeElement);
      MODAL_INSTANCE.show();
    }
  }

  /** Elimina un pedimento de la lista si borrar es true. */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /** Abre el modal de notificación y guarda el índice del elemento. */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'No se encontró información',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    }
    this.elementoParaEliminar = i;
  }

  /** Obtiene el catálogo de domicilio desde el servicio. */
  obtenerDomicillio(): void {
    this.economico
      .obtenerDomicillio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.domicillio.catalogos = resp as Catalogo[];
      });
  }

  /** Obtiene el catálogo de entidad federativa desde el servicio. */
  obtenerEntidad(): void {
    this.economico
      .obtenerEntidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.entidadFederativa.catalogos = resp as Catalogo[];
      });
  }

  /** Obtiene los datos de la tabla de entidad federativa desde el servicio. */
  public obtenerTablaEntidad(): void {
    this.economico
      .obtenerTablaEntidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.entidadTablaDatos = data;
      });
  }

  /** Obtiene los datos de la tabla de domicilio desde el servicio. */
  public obtenerTablaDomicillio(): void {
    this.economico
      .obtenerTablaDomicillio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.domicillioDatos = data;
      });
  }

  /** Marca todos los campos del formulario como tocados si es inválido. */
  validarDestinatarioFormulario(): void {
    if (this.domicillioForm.invalid) {
      this.domicillioForm.markAllAsTouched();
    }
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el almacén para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32606Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /** Inicializa el formulario con los valores del estado de la solicitud. */
  donanteDomicilio(): void {
    this.domicillioForm = this.fb.group({
      domicillio: [{ value: this.solicitudState?.domicillio, disabled: this.soloLectura }, [Validators.required]],
      entidadFederativa: [{ value: this.solicitudState?.entidadFederativa, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio12: [{ value: this.solicitudState?.tipoRadio12, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio13: [{ value: this.solicitudState?.tipoRadio13, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio27: [{ value: this.solicitudState?.tipoRadio27, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio28: [{ value: this.solicitudState?.tipoRadio28, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio29: [{ value: this.solicitudState?.tipoRadio29, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio30: [{ value: this.solicitudState?.tipoRadio30, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio31: [{ value: this.solicitudState?.tipoRadio31, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio32: [{ value: this.solicitudState?.tipoRadio32, disabled: this.soloLectura }, [Validators.required]],
      tipoRadio33: [{ value: this.solicitudState?.tipoRadio33, disabled: this.soloLectura }, [Validators.required]],
      file1: [{ value: this.solicitudState?.file1, disabled: this.soloLectura }, [Validators.required]],
      file2: [{ value: this.solicitudState?.file2, disabled: this.soloLectura }, [Validators.required]],
      actualmente: [{ value: this.solicitudState?.actualmente, disabled: this.soloLectura }, [Validators.required]],
      actualmente2: [{ value: this.solicitudState?.actualmente2, disabled: this.soloLectura }, [Validators.required]],
      municipio: [{ value: this.solicitudState?.municipio, disabled: this.soloLectura }, [Validators.required]],
      tipoDeInstalacion: [{ value: this.solicitudState?.tipoDeInstalacion, disabled: this.soloLectura }, [Validators.required]],
      registroSESAT: [{ value: this.solicitudState?.registroSESAT, disabled: this.soloLectura }, [Validators.required]],
      descripcion: [{ value: this.solicitudState?.descripcion, disabled: this.soloLectura }, [Validators.required]],
      codigoPostal: [{ value: this.solicitudState?.codigoPostal, disabled: this.soloLectura }, [Validators.required]],
    });
  }

  /** Actualiza el nombre del archivo seleccionado y lo asigna al formulario. */
  alSeleccionarArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    const FILE = TARGET?.files ? TARGET.files[0] : null;
    this.nombreArchivo = FILE ? FILE.name : '';
    this.domicillioForm.patchValue({
      archivo: FILE,
    });
  }

  /** Actualiza el nombre del segundo archivo seleccionado y lo asigna al formulario. */
  alSeleccionarArchivo2(event: Event): void {
    const TARGET = event.target as HTMLInputElement;
    const FILE = TARGET?.files ? TARGET.files[0] : null;
    this.nombreArchivo2 = FILE ? FILE.name : '';
    this.domicillioForm.patchValue({
      archivo2: FILE,
    });
  }

  /** Actualiza la lista de domicilios seleccionados. */
  seleccionarDomiciliosDato(evento: Domicillio[]): void {
    this.seleccionarDomiciliosDatos = evento;
  }

  /** Emite el objeto de instalaciones principales seleccionado. */
  aceptarInstalacionesPrincipales(): void {
    const OBJETO_JSON: Domicillio = {
      instalacionPrincipal: this.domicillioForm.get('principales')?.value,
      tipoInstalacion: this.domicillioForm.get('tipoDeInstalacion')?.value,
      entidadFederativa: this.domicillioForm.get('entidadFederativa')?.value,
      municipioDelegacion: this.domicillioForm.get('municipio')?.value,
      direccion: this.domicillioForm.get('descripcion')?.value,
      codigoPostal: this.domicillioForm.get('codigoPostal')?.value,
      registroSESAT: this.domicillioForm.get('registroSESAT')?.value,
      procesoProductivo: this.domicillioForm.get('procesoProductivo')?.value,
      acreditaInmueble: this.domicillioForm.get('goceDelInmueble')?.value,
      operacionesCExt: this.domicillioForm.get('comercioExterior')?.value,
      instalacionCtpat: '',
      instalacionPerfil: '',
      instalacionPerfilRFE: '',
      instalacionPerfilAuto: '',
      instalacionPerfilFerro: '',
      instalacionPerfilRf: '',
      instalacionPerfilMensajeria: '',
    };

    this.instalacionesPrincipales.emit(OBJETO_JSON);
  }

  /** Libera recursos y completa el observable destroyed$ al destruir el componente. */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}