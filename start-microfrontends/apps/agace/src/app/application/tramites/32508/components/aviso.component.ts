import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs';

import { Catalogo, CatalogoSelectComponent, InputFecha, InputFechaComponent, InputRadioComponent, Notificacion, NotificacionesComponent, Pedimento,
  SoloNumerosDirective, TituloComponent, VALID_FILE_REGEX, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { BaseResponse } from '@libs/shared/data-access-user/src/core/models/5701/base-response.model';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { AdaceService } from '../services/adace.service';
import { CargaArchivoDictamenResponse } from '../models/adace.model';
import { Solicitud32508State, Tramite32508Store } from '../state/Tramite32508.store';
import { Tramite32508Query } from '../state/Tramite32508.query';
import { ANO_CATALOGO, AprovechamientoTextos, FECHA_INICIAL, FECHA_PAGO, MES_CATALOGO, RADIO_OPCIONS, RADIO_PARCIAL, RADIO_TOTAL } from '../constantes/adace32508.enum';
/**
 * Componente que representa el aviso dentro del trámite 32508.
 * Este componente gestiona la lógica y la interfaz de usuario para capturar y mostrar
 * los datos relacionados con el aviso, incluyendo formularios, catálogos y notificaciones.
 */
@Component({
  selector: 'app-aviso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    NotificacionesComponent,
    SoloNumerosDirective,
  ],
  providers: [AdaceService],
  templateUrl: './aviso.component.html',
  styleUrl: './aviso.component.scss',
})
export class AvisoComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Observable para gestionar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Formulario reactivo para gestionar los datos del aviso.
   */
  avisoForm!: FormGroup;

  /**
   * Opciones para los radios relacionados con el aprovechamiento.
   */
  radioOpcions = RADIO_OPCIONS;

  /**
   * Opciones para el radio relacionado con la disminución parcial.
   */
  radioParcial = RADIO_PARCIAL;

  /**
   * Opciones para el radio relacionado con la disminución total.
   */
  radioTotal = RADIO_TOTAL;

  /**
   * Configuración para la fecha inicial del dictamen.
   */
  fechaInitialInput: InputFecha = FECHA_INICIAL;

  /**
   * Configuración para la fecha de pago.
   */
  fechaPagoInput: InputFecha = FECHA_PAGO;

  /**
   * Texto relacionado con el aprovechamiento parcial.
   */
  textoParcial = AprovechamientoTextos.PARCIAL;

  /**
   * Texto relacionado con el aprovechamiento total.
   */
  textoTotal = AprovechamientoTextos.TOTAL;

  /**
   * Configuración para el catálogo de años.
   */
  public anoCatalogo = ANO_CATALOGO;

  /**
   * Configuración para el catálogo de meses.
   */
  public mesCatalogo = MES_CATALOGO;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud32508State;

  /**
   * Lista de pedimentos asociados al aviso.
   */
  public pedimentos: Array<Pedimento> = [];

  /**
   * Notificación a mostrar en el modal.
   */
  public nuevaNotificacion!: Notificacion;

  /**
   * Índice del elemento a eliminar.
   */
  public elementoParaEliminar!: number;

  /**
   * Indica si se está cargando un archivo (para secciones de un solo archivo).
   */
  cargarArchivo: boolean = false;

  /**
   * Indica si se cargó exitosamente el archivo de compensación.
   */
  cargarArchivoCompensacion: boolean = false;

  /**
   * Indica si se cargó exitosamente el archivo de disminución.
   */
  cargarArchivoDisminucion: boolean = false;

  /**
   * Valor seleccionado en los radios de tipo de dictamen.
   */
  valorSeleccionado: string | number = 'disminucion';

  /**
   * Valor seleccionado en el radio de pago parcial.
   */
  valorSeleccionadoParcial: string = 'no';

  /**
   * Valor seleccionado en el radio de aprovechamiento total.
   */
  valorSeleccionadoTotal: string = 'no';

  /**
   * Nombre del archivo seleccionado (para secciones de un solo archivo).
   */
  nombreArchivo: string = '';

  /**
   * Nombre del archivo de compensación seleccionado.
   */
  nombreArchivoCompensacion: string = '';

  /**
   * Nombre del archivo de disminución seleccionado.
   */
  nombreArchivoDisminucion: string = '';

  /**
   * Indica si se debe mostrar la disminución.
   */
  monstrarDisminucion: boolean = false;

  /**
   * Indica si se debe mostrar la compensación.
   */
  mostrarCompensacion: boolean = false;

  /**
   * Indica si se deben mostrar la disminución y compensación.
   */
  mostrarDisminucionYCompensacion: boolean = false;

  /**
   * Indica si se debe aplicar una disminución parcial.
   */
  disminucionParcial: boolean = false;

  /**
   * Fecha de pago asociada a la solicitud.
   * Se inicializa con el valor constante `FECHA_DE_PAGO` que contiene la fecha predeterminada de pago.
   */
  fechaPago: InputFecha = FECHA_PAGO;

  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;

  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Indica si se debe mostrar el error de archivo no cargado.
   */
  mostrarErrorArchivo: boolean = false;

  /**
   * Constructor del componente.
   * @param adace Servicio para gestionar datos relacionados con los catálogos.
   * @param fb Constructor de formularios reactivos.
   * @param store Almacén global para gestionar el estado del trámite.
   * @param query Consulta para obtener el estado actual del trámite.
   * @param validacionesService Servicio para validar campos del formulario.
   */
  constructor(
    private adace: AdaceService,
    public fb: FormBuilder,
    private store: Tramite32508Store,
    private query: Tramite32508Query,
    private validacionesService: ValidacionesFormularioService,
    private consultaioQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario, obtiene datos iniciales y suscribe al estado global.
   */
  ngOnInit(): void {
    // ✅ IMPORTANTE: Crear el formulario PRIMERO, antes de cualquier suscripción
    this.donanteDomicilio();
    this.obtenerDatosAnoPeriodo();
    this.obtenerDatosMesPeriodo();

    // Ahora sí podemos suscribirnos y usar el formulario de manera segura
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;

          // Actualizar todos los campos del formulario con los valores del estado
          if (this.avisoForm && seccionState) {
            this.actualizarFormularioConEstado(seccionState);
          }
        })
      )
      .subscribe();
    this.setValoresStore(this.avisoForm, 'radioParcial', 'setRadioPartial');

    // ✅ Suscripción a cambios del campo rfcCpi
    this.avisoForm
      .get('rfcCpi')
      ?.valueChanges.pipe(
        takeUntil(this.destroyed$),
        debounceTime(500), // Esperar 500ms después del último cambio
        distinctUntilChanged() // Solo emitir si el valor cambió
      )
      .subscribe((rfc: string) => {
        if (rfc && rfc.trim().length > 11) {
          // Consultar datos del CPI cuando tiene 11+ caracteres
          this.consultarDatosCpi(rfc);
        } else {
          this.store.setRfcCpi(rfc);
          // Si tiene menos de 11 caracteres y ya hay nombreCpi, limpiar
          const NOMBRE_ACTUAL = this.avisoForm.get('nombre')?.value;
          if (NOMBRE_ACTUAL) {
            this.avisoForm.patchValue({ nombre: '' });
            this.store.setNombreCpi('');
          }
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.avisoForm.get('tipoDictamen')?.value === '') {
      this.avisoForm.get('tipoDictamen')?.setValue('disminucion');
      this.store.setTipoDictamen('disminucion');
    }
  }

  /**
   * Obtiene los datos del catálogo de años.
   * Después de cargar, re-aplica el valor del estado si existe.
   */
  obtenerDatosAnoPeriodo(): void {
    this.adace
      .obtenerDatosAno()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        if (resp.codigo === '00') {
          this.anoCatalogo.catalogos = resp.datos || [];

          // Re-aplicar el valor del estado después de cargar el catálogo
          if (this.solicitudState?.anoSeleccionado && this.avisoForm) {
            this.avisoForm.patchValue({ ano: this.solicitudState.anoSeleccionado });
          }
        }
      });
  }

  /**
   * Obtiene los datos del catálogo de meses.
   * Después de cargar, re-aplica el valor del estado si existe.
   */
  obtenerDatosMesPeriodo(): void {
    this.adace
      .obtenerDatosMes()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        if (resp.codigo === '00') {
          this.mesCatalogo.catalogos = resp.datos || [];

          // Re-aplicar el valor del estado después de cargar el catálogo
          if (this.solicitudState?.mesSeleccionado && this.avisoForm) {
            this.avisoForm.patchValue({ mes: this.solicitudState.mesSeleccionado });
          }
        }
      });
  }

  /**
   * Maneja la selección de un archivo en el input.
   * @param event Evento de cambio del input de archivo.
   * @param tipo Tipo de archivo: 'compensacion', 'disminucion' o undefined para archivo único.
   */
  alSeleccionarArchivo(event: Event, tipo?: 'compensacion' | 'disminucion'): void {
    const TARGET = event.target as HTMLInputElement;
    const FILE = TARGET?.files ? TARGET.files[0] : null;
    const NOMBRE_ARCHIVO = FILE ? FILE.name : 'Sin archivos seleccionados';

    if (tipo === 'compensacion') {
      this.nombreArchivoCompensacion = NOMBRE_ARCHIVO;
      this.avisoForm.patchValue({ archivoCompensacion: FILE });
    } else if (tipo === 'disminucion') {
      this.nombreArchivoDisminucion = NOMBRE_ARCHIVO;
      this.avisoForm.patchValue({ archivoDisminucion: FILE });
    } else {
      // Para secciones de un solo archivo (disminución o compensación individual)
      this.nombreArchivo = NOMBRE_ARCHIVO;
      this.avisoForm.patchValue({ archivo: FILE });
    }
  }

  /**
   * Valida que el archivo sea un archivo Excel válido (.xls o .xlsx).
   * @param file Archivo a validar
   * @returns true si el archivo es válido, false en caso contrario
   */
  private validarArchivoExcel(file: File | null): boolean {
    if (!file) {
      return false;
    }
    return VALID_FILE_REGEX.test(file.name);
  }

  /**
   * Carga el archivo de dictamen seleccionado.
   * Valida el tipo de archivo, construye el FormData y envía la petición al servidor.
   * @param tipoDictamen Tipo de dictamen: 'compensacion' o 'disminucion'.
   */
  cargaArchivo(tipoDictamen: string): void {
    const TIPO_DICTAMEN_GENERAL = this.avisoForm.get('tipoDictamen')?.value;
    let file: File | null = null;

    // Determinar qué archivo usar según el contexto
    if (TIPO_DICTAMEN_GENERAL === 'disminucionYCompensacion') {
      // En sección combinada, usar el archivo específico según el tipo
      if (tipoDictamen === 'compensacion') {
        file = this.avisoForm.get('archivoCompensacion')?.value as File | null;
      } else if (tipoDictamen === 'disminucion') {
        file = this.avisoForm.get('archivoDisminucion')?.value as File | null;
      }
    } else {
      // En secciones individuales, usar el archivo único
      file = this.avisoForm.get('archivo')?.value as File | null;
    }

    if (!file) {
      this.mostrarNotificacionError('No se ha seleccionado ningún archivo');
      return;
    }

    if (!this.validarArchivoExcel(file)) {
      this.mostrarNotificacionError('El archivo debe ser de formato Excel (.xls o .xlsx)');
      return;
    }

    const FORMDATA = new FormData();
    FORMDATA.append('archivo', file, file.name);

    this.adace
      .cargarArchivoDictamen(tipoDictamen, FORMDATA)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (response: BaseResponse<CargaArchivoDictamenResponse>) => {
          this.manejarCargaExitosa(response, tipoDictamen);
        },
        error: (error) => {
          console.error('Error en carga de archivo:', error);
          this.manejarErrorCarga(error);
        },
      });
  }

  /**
   * Maneja la respuesta exitosa de la carga de archivo.
   * @param response Respuesta del servidor
   * @param tipoArchivoCargado Tipo de archivo que se cargó: 'compensacion' o 'disminucion'
   */
  private manejarCargaExitosa(response: BaseResponse<CargaArchivoDictamenResponse>, tipoArchivoCargado: string): void {
    if (response.codigo === '200' || response.codigo === '00') {
      const TIPO_DICTAMEN_GENERAL = this.avisoForm.get('tipoDictamen')?.value || 'disminucion';

      // Almacenar las listas según el tipo de archivo cargado
      if (tipoArchivoCargado === 'disminucion' && response.datos?.lista_disminucion) {
        this.store.setListaDisminucion(response.datos.lista_disminucion);
      } else if (tipoArchivoCargado === 'compensacion' && response.datos?.lista_compensacion) {
        this.store.setListaCompensacion(response.datos.lista_compensacion);
      }

      // Actualizar la bandera correcta según el contexto
      if (TIPO_DICTAMEN_GENERAL === 'disminucionYCompensacion') {
        // En sección combinada, actualizar bandera específica
        if (tipoArchivoCargado === 'compensacion') {
          this.cargarArchivoCompensacion = true;
        } else if (tipoArchivoCargado === 'disminucion') {
          this.cargarArchivoDisminucion = true;
        }
      } else {
        // En secciones individuales, usar bandera única
        this.cargarArchivo = true;
      }

      this.abrirModal();
    } else {
      const MENSAJE_ERROR = response.datos?.mensaje || response.error || 'Error al procesar el archivo';
      this.mostrarNotificacionError(MENSAJE_ERROR);
    }
  }

  /**
   * Maneja los errores durante la carga del archivo.
   * @param error Error capturado durante la petición
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private manejarErrorCarga(error: any): void {
    let mensajeError = 'Error al cargar el archivo. Por favor, intente nuevamente.';

    if (error?.error?.mensaje) {
      mensajeError = error.error.mensaje;
    } else if (error?.mensaje) {
      mensajeError = error.mensaje;
    } else if (error?.message) {
      mensajeError = error.message;
    }

    this.mostrarNotificacionError(mensajeError);
    this.cargarArchivo = false;
  }

  /**
   * Muestra una notificación de error al usuario.
   * @param mensaje Mensaje de error a mostrar
   */
  private mostrarNotificacionError(mensaje: string): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Error',
      mensaje: mensaje,
      cerrar: false,
      tiempoDeEspera: 3000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Elimina un pedimento de la lista.
   * @param borrar Indica si se debe eliminar el pedimento.
   */
  eliminarPedimento(borrar: boolean): void {
    if (borrar) {
      this.pedimentos.splice(this.elementoParaEliminar, 1);
    }
  }

  /**
   * Abre un modal con una notificación.
   * @param i Índice del elemento a eliminar (opcional).
   */
  abrirModal(i: number = 0): void {
    this.nuevaNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'success',
      modo: 'action',
      titulo: 'Éxito',
      mensaje: 'El archivo se cargó correctamente',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.elementoParaEliminar = i;
  }

  /**
   * Actualiza la fecha de pago en el formulario y el estado global.
   * @param nuevo_fechaPago Nueva fecha de pago.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.avisoForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.avisoForm, 'fechaPago', 'setFechaPago');
  }

  /**
   * Actualiza la fecha de elaboración en el formulario y el estado global.
   * @param nuevo_fechaPago Nueva fecha de elaboración.
   */
  cambioFechaInitial(nuevo_fechaPago: string): void {
    this.store.setFechaElaboracion(nuevo_fechaPago);
  }

  /**
   * Valida el formulario y marca todos los campos como tocados si es inválido.
   */
  validarDestinatarioFormulario(): void {
    if (this.avisoForm.invalid) {
      this.avisoForm.markAllAsTouched();
    }
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param form Formulario reactivo.
   * @param field Nombre del campo a verificar.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param form Formulario reactivo.
   * @param campo Nombre del campo a actualizar.
   * @param metodoNombre Nombre del método del almacén para actualizar el estado.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite32508Store): void {
    const VALOR = form.get(campo)?.value;

    // ✅ Manejo especial para nombre del CPI
    if (campo === 'nombre') {
      this.store.setNombreCpi(VALOR);
    }

    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);

    const AVISO_RADIO =
      this.avisoForm.get('tipoDictamen')?.value === '' ? 'disminucion' : this.avisoForm.get('tipoDictamen')?.value;

    if (AVISO_RADIO === 'disminucion') {
      this.monstrarDisminucion = true;
      this.mostrarCompensacion = false;
      this.mostrarDisminucionYCompensacion = false;
    } else if (AVISO_RADIO === 'compensacion') {
      this.monstrarDisminucion = false;
      this.mostrarCompensacion = true;
      this.mostrarDisminucionYCompensacion = false;
    } else if (AVISO_RADIO === 'disminucionYCompensacion') {
      this.monstrarDisminucion = false;
      this.mostrarCompensacion = false;
      this.mostrarDisminucionYCompensacion = true;
    }

    // Actualizar validadores dinámicos cuando cambie el tipo de dictamen
    if (campo === 'tipoDictamen') {
      this.actualizarValidadoresPorTipoDictamen(AVISO_RADIO);
    }

    const RADIO_PARCIAL = this.avisoForm.get('radioParcial')?.value;

    if (RADIO_PARCIAL === 'si') {
      this.disminucionParcial = true;
    } else {
      this.disminucionParcial = false;
    }

    // Actualizar validadores dinámicos cuando cambie el pago parcial
    if (campo === 'radioParcial') {
      this.actualizarValidadoresPorPagoParcial(RADIO_PARCIAL);
    }
  }
  /**
   * Configura el formulario con los valores iniciales del estado.
   */
  donanteDomicilio(): void {
    this.avisoForm = this.fb.group({
      // Campos siempre requeridos
      claveFiscalizado: [this.solicitudState?.claveFiscalizado, [Validators.required]],
      adace: [{ value: this.solicitudState?.adace, disabled: true }, [Validators.required]],
      tipoDictamen: [this.solicitudState?.tipoDictamen, [Validators.required]],
      rfcCpi: [this.solicitudState?.rfcCpi, [Validators.required, Validators.maxLength(13)]],
      nombre: [{ value: this.solicitudState?.nombre, disabled: true }, [Validators.required]],
      numeroInscripcion: [this.solicitudState?.numeroInscripcion, [Validators.required]],
      ano: [this.solicitudState?.ano, [Validators.required]],
      mes: [this.solicitudState?.mes, [Validators.required]],
      fechaElaboracion: [this.solicitudState?.fechaElaboracion, [Validators.required]],
      radioParcial: [this.solicitudState?.radioParcial || 'no', [Validators.required]],
      radioTotal: [this.solicitudState?.radioTotal || 'no', [Validators.required]],
      aprovechamiento: [this.solicitudState?.aprovechamiento, [Validators.required]],
      ingresos: [this.solicitudState?.ingresos, [Validators.required]],
      dictaminadaCantidad: [this.solicitudState?.dictaminadaCantidad, [Validators.required]],

      // Campos condicionales por tipo de dictamen (validadores se ajustan dinámicamente)
      saldoPendienteDisminuirAnterior: [this.solicitudState?.saldoPendienteDisminuirAnterior],
      saldoPendienteCompensarAnterior: [this.solicitudState?.saldoPendienteCompensarAnterior],
      disminucionAplicada: [this.solicitudState?.disminucionAplicada],
      saldoPendienteDisminuir: [this.solicitudState?.saldoPendienteDisminuir],
      compensacionAplicada: [this.solicitudState?.compensacionAplicada],
      saldoPendienteCompensar: [this.solicitudState?.saldoPendienteCompensar],

      // Campos condicionales por pago parcial
      cantidad: [this.solicitudState?.cantidad],
      llaveDePago: [this.solicitudState?.llaveDePago],
      fechaPago: [this.solicitudState?.fechaPago],

      // Archivos (validación manejada por archivosRequeridosCargados)
      archivo: [null],
      archivoCompensacion: [null],
      archivoDisminucion: [null],
    });

    // Aplicar validadores dinámicos según el tipo de dictamen inicial
    const tipoDictamenInicial = this.solicitudState?.tipoDictamen || 'disminucion';
    this.actualizarValidadoresPorTipoDictamen(tipoDictamenInicial);

    // Aplicar validadores dinámicos según pago parcial inicial
    const radioParcialInicial = this.solicitudState?.radioParcial || 'no';
    this.actualizarValidadoresPorPagoParcial(radioParcialInicial);

    // Inicializar las variables de valor seleccionado con los valores del estado
    if (this.solicitudState) {
      this.valorSeleccionadoParcial = this.normalizarValorRadio(this.solicitudState.radioParcial);
      this.valorSeleccionadoTotal = this.normalizarValorRadio(this.solicitudState.radioTotal);
      this.disminucionParcial = this.valorSeleccionadoParcial === 'si';
    }

    this.inicializarEstadoFormulario();
  }

  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según el modo de solo lectura.
   *
   * Si la propiedad `soloLectura` es verdadera, deshabilita todos los controles del formulario.
   * En caso contrario, habilita los controles del formulario
   *
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    // ✅ Verificar que el formulario existe antes de usarlo
    if (!this.avisoForm) {
      return;
    }

    if (this.esFormularioSoloLectura) {
      this.avisoForm.disable();
    } else {
      this.avisoForm.enable();
      ['adace', 'nombre'].map((field) => this.avisoForm.get(field)?.disable());
    }
  }

  /**
   * Actualiza la fecha de pago en el store
   * @param evento Fecha de pago
   */
  actualizarFechaPago(evento: string): void {
    this.store.setFechaPago(evento);
  }

  /**
   * Consulta los datos generales del CPI usando su RFC.
   * Valida que el RFC tenga al menos 11 caracteres antes de realizar la consulta.
   * Llena el campo 'nombre' del formulario con la razón social obtenida.
   *
   * @param rfc RFC del Contador Público Inscrito
   */
  consultarDatosCpi(rfc: string): void {
    // Validar longitud mínima
    if (!rfc || rfc.trim().length < 11) {
      return;
    }

    const RFC_LIMPIO = rfc.trim();

    // Guardar el RFC en el store ANTES de la consulta para evitar que se borre
    this.store.setRfcCpi(RFC_LIMPIO);

    // Llamar al servicio para obtener datos generales
    this.adace
      .getDatosGeneralesAPI(RFC_LIMPIO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (respuesta) => {
          if (respuesta?.datos?.identificacion) {
            const RAZON_SOCIAL = respuesta.datos.identificacion.razon_social || '';

            // Llenar el campo nombre del formulario
            this.avisoForm.patchValue({
              nombre: RAZON_SOCIAL,
            });

            // Guardar en el store
            this.store.setNombreCpi(RAZON_SOCIAL);
          } else {
            const NOMBRE_ACTUAL = this.avisoForm.get('nombre')?.value;
            if (NOMBRE_ACTUAL) {
              this.avisoForm.patchValue({ nombre: '' });
              this.store.setNombreCpi('');
            }
          }
        },
        error: (error) => {
          console.error('Error al consultar datos del CPI:', error);

          const MENSAJE =
            error?.error?.mensaje || error?.mensaje || 'No se pudieron obtener los datos del RFC proporcionado';

          this.mostrarNotificacionError(MENSAJE);

          // Limpiar el campo nombre en caso de error
          this.avisoForm.patchValue({
            nombre: '',
          });
        },
      });
  }

  /**
   * Normaliza un valor booleano o string a 'si' o 'no'.
   * Maneja valores como: true, false, 'true', 'false', 'si', 'no', 1, 0, etc.
   * @param valor Valor a normalizar
   * @returns 'si' o 'no'
   */
  private normalizarValorRadio(valor: unknown): string {
    if (valor === true || valor === 'true' || valor === 'si' || valor === 1 || valor === '1') {
      return 'si';
    }
    return 'no';
  }

  /**
   * Actualiza el formulario con los valores del estado actual.
   * Este método se ejecuta cada vez que el estado del store cambia.
   * @param estado Estado actual de la solicitud
   */
  private actualizarFormularioConEstado(estado: Solicitud32508State): void {
    // Normalizar los valores de radio
    const radioParcialNormalizado = this.normalizarValorRadio(estado.radioParcial);
    const radioTotalNormalizado = this.normalizarValorRadio(estado.radioTotal);

    // Usar patchValue para actualizar múltiples campos a la vez sin afectar validadores
    this.avisoForm.patchValue({
      claveFiscalizado: estado.claveFiscalizado || '',
      adace: estado.adace || '',
      tipoDictamen: estado.tipoDictamen || '',
      rfcCpi: estado.rfcCpi || '',
      numeroInscripcion: estado.numeroInscripcion || '',
      ano: estado.anoSeleccionado || null,
      mes: estado.mesSeleccionado || null,
      radioParcial: radioParcialNormalizado,
      radioTotal: radioTotalNormalizado,
      saldoPendienteDisminuirAnterior: estado.saldoPendienteDisminuirAnterior || '',
      saldoPendienteCompensarAnterior: estado.saldoPendienteCompensarAnterior || '',
      aprovechamiento: estado.aprovechamiento || '',
      disminucionAplicada: estado.disminucionAplicada || '',
      compensacionAplicada: estado.compensacionAplicada || '',
      saldoPendienteDisminuir: estado.saldoPendienteDisminuir || '',
      saldoPendienteCompensar: estado.saldoPendienteCompensar || '',
      cantidad: estado.cantidad || '',
      llaveDePago: estado.llaveDePago || '',
      fechaElaboracion: estado.fechaElaboracion || '',
      fechaPago: estado.fechaPago || '',
      ingresos: estado.ingresos || '',
      dictaminadaCantidad: estado.dictaminadaCantidad || '',
    });

    // El campo 'nombre' se maneja de forma especial (puede venir del CPI o del recinto)
    // Solo actualizarlo si nombreCpi está presente, de lo contrario usar el nombre general
    this.avisoForm.patchValue({ nombre: estado.nombreCpi });

    // Actualizar las variables de visibilidad según el tipo de dictamen
    const tipoDictamen = estado.tipoDictamen;
    if (tipoDictamen === 'disminucion') {
      this.monstrarDisminucion = true;
      this.mostrarCompensacion = false;
      this.mostrarDisminucionYCompensacion = false;
    } else if (tipoDictamen === 'compensacion') {
      this.monstrarDisminucion = false;
      this.mostrarCompensacion = true;
      this.mostrarDisminucionYCompensacion = false;
    } else if (tipoDictamen === 'disminucionYCompensacion') {
      this.monstrarDisminucion = false;
      this.mostrarCompensacion = false;
      this.mostrarDisminucionYCompensacion = true;
    }

    // Actualizar las variables de valor seleccionado para los radios
    this.valorSeleccionadoParcial = radioParcialNormalizado;
    this.valorSeleccionadoTotal = radioTotalNormalizado;

    // Actualizar la variable de disminución parcial
    // this.disminucionParcial = radioParcialNormalizado === 'si';
  }

  /**
   * Maneja la selección de año del catálogo.
   * Guarda el valor seleccionado en anoSeleccionado del store.
   * @param catalogo Objeto Catalogo seleccionado
   */
  onAnoSeleccionado(catalogo: Catalogo): void {
    this.store.setAnoSeleccionado(catalogo.clave || '');
  }

  /**
   * Maneja la selección de mes del catálogo.
   * Guarda el valor seleccionado en mesSeleccionado del store.
   * @param catalogo Objeto Catalogo seleccionado
   */
  onMesSeleccionado(catalogo: Catalogo): void {
    this.store.setMesSeleccionado(catalogo.clave || '');
  }

  /**
   * Valida el formulario completo incluyendo archivos requeridos.
   * Marca todos los campos como touched para mostrar errores visuales.
   * @returns true si el formulario y los archivos son válidos, false en caso contrario
   */
  public validarFormulario(): boolean {
    this.avisoForm.markAllAsTouched();

    if (!this.archivosRequeridosCargados()) {
      this.mostrarErrorArchivo = true;
      return false;
    }

    this.mostrarErrorArchivo = false;
    return this.avisoForm.valid;
  }

  /**
   * Verifica si los archivos Excel requeridos han sido cargados según el tipo de dictamen.
   * @returns true si todos los archivos requeridos están cargados
   */
  public archivosRequeridosCargados(): boolean {
    if (this.esFormularioSoloLectura) {
      return true;
    }

    const tipoDictamen = this.avisoForm.get('tipoDictamen')?.value;

    if (tipoDictamen === 'disminucion' || tipoDictamen === 'compensacion') {
      return this.cargarArchivo;
    } else if (tipoDictamen === 'disminucionYCompensacion') {
      return this.cargarArchivoCompensacion && this.cargarArchivoDisminucion;
    }
    return false;
  }

  /**
   * Actualiza los validadores de los campos condicionales según el tipo de dictamen seleccionado.
   * @param tipoDictamen Tipo de dictamen: 'disminucion', 'compensacion' o 'disminucionYCompensacion'
   */
  private actualizarValidadoresPorTipoDictamen(tipoDictamen: string): void {
    // Campos de disminución
    const camposDisminucion = ['saldoPendienteDisminuirAnterior', 'disminucionAplicada', 'saldoPendienteDisminuir'];
    // Campos de compensación
    const camposCompensacion = ['saldoPendienteCompensarAnterior', 'compensacionAplicada', 'saldoPendienteCompensar'];

    const requiereDisminucion = tipoDictamen === 'disminucion' || tipoDictamen === 'disminucionYCompensacion';
    const requiereCompensacion = tipoDictamen === 'compensacion' || tipoDictamen === 'disminucionYCompensacion';

    camposDisminucion.forEach((campo) => {
      const control = this.avisoForm.get(campo);
      if (control) {
        control.setValidators(requiereDisminucion ? [Validators.required] : []);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    camposCompensacion.forEach((campo) => {
      const control = this.avisoForm.get(campo);
      if (control) {
        control.setValidators(requiereCompensacion ? [Validators.required] : []);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    // Resetear flag de error de archivo al cambiar tipo
    this.mostrarErrorArchivo = false;
  }

  /**
   * Actualiza los validadores de los campos condicionales según el pago parcial.
   * @param radioParcial Valor del radio: 'si' o 'no'
   */
  private actualizarValidadoresPorPagoParcial(radioParcial: string): void {
    const camposPagoParcial = ['cantidad', 'llaveDePago', 'fechaPago'];
    const esParcial = radioParcial === 'si';

    camposPagoParcial.forEach((campo) => {
      const control = this.avisoForm.get(campo);
      if (control) {
        control.setValidators(esParcial ? [Validators.required] : []);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el observable `destroyed$` para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Descarga la plantilla Excel según el tipo de dictamen.
   * @param tipoPlantilla Tipo de plantilla: 'compensacion' o 'disminucion'
   */
  descargaPlantilla(tipoPlantilla: string): void {
    const ID_SOLICITUD = this.consultaDatos.id_solicitud;

    if (!ID_SOLICITUD) {
      this.mostrarNotificacionError(
        'No se encontró el ID de la solicitud. Guarde la solicitud antes de descargar la plantilla.'
      );
      return;
    }

    this.adace
      .descargaPlantilla(ID_SOLICITUD, tipoPlantilla)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: async (response: BaseResponse<string>) => {
          if (response.datos) {
            const BLOB = await this.base64ToBlob(
              response.datos,
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            const URL = window.URL.createObjectURL(BLOB);
            const LINK = document.createElement('a');
            LINK.href = URL;
            LINK.download = `plantilla_${tipoPlantilla}_${ID_SOLICITUD}.xls`;
            LINK.click();
            window.URL.revokeObjectURL(URL);
          } else {
            console.error('Error al descargar plantilla');
            this.mostrarNotificacionError('Error al descargar la plantilla. Intente nuevamente.');
          }
        },
        error: (error) => {
          console.error('Error al descargar plantilla:', error);
          this.mostrarNotificacionError('Error al descargar la plantilla. Intente nuevamente.');
        },
      });
  }

  /**
   * Convierte un string Base64 a un Blob usando Fetch API
   * @param base64 String en formato Base64
   * @param contentType Tipo MIME del archivo
   * @returns Promise<Blob> del archivo
   */
  async base64ToBlob(base64: string, contentType: string): Promise<Blob> {
    const RESPONSE = await fetch(`data:${contentType};base64,${base64}`);
    return RESPONSE.blob();
  }
}