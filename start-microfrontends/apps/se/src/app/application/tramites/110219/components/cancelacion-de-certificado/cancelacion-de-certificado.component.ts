import { CERTIFICATE_OF_ORIGIN_NUMBER,Catalogo,CatalogoSelectComponent,CatalogosSelect,ConfiguracionColumna,ConsultaioQuery,ConsultaioState,DatosPasos,InputFecha,ListaPasosWizard,PASOS,TablaSeleccion,TituloComponent,ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CertificadoApiData, ColumnasTabla, FECHAI_NICIAL, FECHA_FINAL } from '../../models/certificado.model';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject,map, takeUntil } from 'rxjs';
import { Solicitud110219State, Tramite110219Store } from '../../estados/Tramite110219.store';
import { AlertComponent } from '@libs/shared/data-access-user/src/tramites/components/alert/alert.component';
import { CatalogoServices } from '@ng-mf/data-access-user';
import { CertificadoService } from '../../services/certificado.service';
import { CommonModule } from '@angular/common';
import { InputFechaComponent } from "@libs/shared/data-access-user/src/tramites/components/input-fecha/input-fecha.component";
import { TablaDinamicaComponent } from "@libs/shared/data-access-user/src/tramites/components/tabla-dinamica/tabla-dinamica.component";
import { Tramite110219Query } from '../../estados/Tramite110219.query';
/** 
 * Texto de alerta que se muestra para indicar los certificados disponibles.
 */
const TERCEROS_TEXTO_DE_ALERTA = 'Certificados Disponibles';

/**
 * Componente para gestionar la cancelación de certificados.
 */
@Component({
  selector: 'app-cancelacion-de-certificado',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    AlertComponent,
    TablaDinamicaComponent,
    InputFechaComponent,

  ],
  templateUrl: './cancelacion-de-certificado.component.html',
  styleUrl: './cancelacion-de-certificado.component.css',
})
export class CancelacionDeCertificadoComponent implements OnInit, OnDestroy {
  /**
   * Estado de consulta de datos (readonly, etc).
   */
  consultaDatos!: ConsultaioState;

  /**
   * Identificador del trámite actual.
   *
   * @remarks
   * Este valor representa el código único asociado al trámite que se está gestionando en el componente.
   */
  tramiteId: string = '110219';

    /**
     * Lista de objetos de tipo Catalogo que representa los tratados o acuerdos disponibles para la búsqueda.
     * Se utiliza para mostrar las opciones en el componente de datos de búsqueda.
     */
    tratadoAcuerdo: Catalogo[] = [];

    /**
     * Lista de objetos de tipo Catalogo que representa los países disponibles para seleccionar en el bloque correspondiente.
     * Se utiliza para mostrar opciones de países en el componente de búsqueda.
     */
    paisBloque: Catalogo[] = [];

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * Formulario reactivo para la cancelación de certificados.
   */
  validacionForm!: FormGroup;

  /**
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Datos de la tabla de certificados disponibles.
   */
  public certificadoDisponsiblesTablaDatos: ColumnasTabla[] = [];

  /**
   * Datos completos de la API para los certificados (sin mapear).
   */
  private certificadosApiDataCompletos: CertificadoApiData[] = [];

  /**
   * Evento para emitir datos al componente padre.
   */
  @Output() dataEvent = new EventEmitter<number>();

  /**
   * Evento para indicar si el número de certificado es válido.
   */
  @Output() isNumeroCertificado = new EventEmitter<boolean>();

  /**
   * Evento para indicar si el patrón del número de certificado es válido.
   */
  @Output() isNumeroCertificadoPattern = new EventEmitter<boolean>();

  /**
   * Evento para habilitar el certificado de origen.
   */
  @Output() certificadoOriginEnable = new EventEmitter<boolean>();

  /**
   * Evento para emitir los datos del certificado seleccionado.
   */
  @Output() certificadoSeleccionado = new EventEmitter<ColumnasTabla>();

  /**
   * Evento para emitir todos los datos completos del certificado seleccionado desde la API.
   */
  @Output() certificadoApiDataSeleccionado = new EventEmitter<CertificadoApiData>();

  /**
   * Texto de alerta para mostrar en el componente.
   */
  TEXTO_DE_ALERTA: string = TERCEROS_TEXTO_DE_ALERTA;

  /**
   * Fecha inicial para el formulario.
   */
  fechaInicialInput: InputFecha = FECHAI_NICIAL;

  /**
   * Fecha final para el formulario.
   */
  fechaFinalInput: InputFecha = FECHA_FINAL;

  /**
   * Estado de la solicitud actual.
   */
  public solicitudState!: Solicitud110219State;

  /**
   * Lista de pasos del asistente (wizard).
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Enumeración para la selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Indica si se deben mostrar errores en el formulario.
   */
  mostrarErrores: boolean = true;

  /**
   * Indica si se está buscando un certificado.
   */
  estaBuscando: boolean = true;

  /**
   * Indica si el certificado de origen está habilitado.
   */
  isCertificadoOriginEnable: boolean = false;

  /**
   * Catálogo de tratados.
   */
  tratado!: CatalogosSelect;

  /**
   * Catálogo de países.
   */
  pais!: CatalogosSelect;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

  /**
   * Mensaje de error a mostrar.
   */
  mensajeError: string = '';

  /**
   * Datos de los pasos del asistente.
   */
  datosPasos: DatosPasos = {
    nroPasos: this.pasos.length,
    indice: this.indice,
    txtBtnAnt: 'Anterior',
    txtBtnSig: 'Continuar',
  };

  /**
   * Configuración del catálogo de tratados.
   */
  public tratadoCatalogo: CatalogosSelect = {
    labelNombre: 'Tratado / Acuerdo:',
    required: false,
    primerOpcion: 'Selecciona un VALOR',
    catalogos: [],
  };

  /**
   * Configuración del catálogo de países.
   */
  public paisCatalogo: CatalogosSelect = {
    labelNombre: 'País / Bloque:',
    required: false,
    primerOpcion: 'Selecciona un VALOR',
    catalogos: [],
  };

  /**
   * Encabezados de la tabla de certificados disponibles.
   */
  public headers: ConfiguracionColumna<ColumnasTabla>[] = [
    { encabezado: 'Numero de certificado', clave: (ele: ColumnasTabla) => ele.numeroCertificado, orden: 1 },
    { encabezado: 'País/Bloque', clave: (ele: ColumnasTabla) => ele.pais, orden: 2 },
    { encabezado: 'Tratado/Acuerdo', clave: (ele: ColumnasTabla) => ele.tratado, orden: 3 },
    { encabezado: 'Fecha expedicion', clave: (ele: ColumnasTabla) => ele.fechaExpedicion, orden: 4 },
    { encabezado: 'Fecha vencimiento', clave: (ele: ColumnasTabla) => ele.fechaVencimiento, orden: 5 },
  ];

  /**
   * Constructor del componente.
   * @param certificadoService Servicio para gestionar certificados.
   * @param fb Constructor de formularios.
   * @param validacionesService Servicio para validar formularios.
   * @param store Almacén de datos del trámite.
   * @param query Consulta de datos del trámite.
   * @param consultaioQuery Consulta de estado de sección.
   */
  constructor(
    private certificadoService: CertificadoService,
    private fb: FormBuilder,
    private validacionesService: ValidacionesFormularioService,
    private store: Tramite110219Store,
    private query: Tramite110219Query,
    private consultaioQuery: ConsultaioQuery,
    private catalogoServices: CatalogoServices,

  ) {
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

  /**
   * Inicializa el componente, el formulario y carga catálogos y datos de la tabla.
   */
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   *
   * - Inicializa el formulario `cancelacionForm` con los valores actuales del estado de la solicitud y validadores requeridos.
   * - Obtiene los datos necesarios para los campos de tratado y país utilizando el `tramiteId`.
   * - Recupera las solicitudes para la tabla.
   * - Inicializa el estado del formulario.
   * - Se suscribe a los cambios del estado de la solicitud para mantener sincronizado el formulario.
   * - Llama al método para obtener el domicilio del donante.
   */
  ngOnInit(): void {
    

    // Inicializar el estado de la tabla
    this.estaBuscando = false;
    this.mostrarErrores = true;
    this.certificadoDisponsiblesTablaDatos = [];

    this.getPaisdata(this.tramiteId);
    this.donanteDomicilio();
    this.inicializarEstadoFormulario();

    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
          const NUMERO_CERTIFICADO = this.solicitudState?.validacionForm?.numeroCertificado || this.solicitudState?.numeroCertificado || '';
          
          if (this.validacionForm) {
            const TRATADO_VALUE = this.solicitudState?.validacionForm?.tratado || this.solicitudState?.tratado || '';
            const PAIS_VALUE = this.solicitudState?.validacionForm?.pais || this.solicitudState?.pais || '';
            const FECHA_INICIAL_VALUE = this.solicitudState?.validacionForm?.fechaInicial || this.solicitudState?.fechaInicial || '';
            const FECHA_FINAL_VALUE = this.solicitudState?.validacionForm?.fechaFinal || this.solicitudState?.fechaFinal || '';
            
            setTimeout(() => {
              const FORMATTED_FECHA_INICIAL = FECHA_INICIAL_VALUE ? this.formatDateForInput(FECHA_INICIAL_VALUE) : '';
              const FORMATTED_FECHA_FINAL = FECHA_FINAL_VALUE ? this.formatDateForInput(FECHA_FINAL_VALUE) : '';
              
              let paisFormValue = '';
              let tratadoFormValue = '';
              
              if (Array.isArray(PAIS_VALUE) && PAIS_VALUE.length > 0) {
                paisFormValue = PAIS_VALUE[0].clave || PAIS_VALUE[0].id?.toString() || '';
              } else if (typeof PAIS_VALUE === 'string') {
                paisFormValue = PAIS_VALUE;
              }
              
              if (Array.isArray(TRATADO_VALUE) && TRATADO_VALUE.length > 0) {
                tratadoFormValue = TRATADO_VALUE[0].clave || TRATADO_VALUE[0].id?.toString() || '';
              } else if (typeof TRATADO_VALUE === 'string') {
                tratadoFormValue = TRATADO_VALUE;
              }
              
              const CURRENT_FECHA_INITIAL = this.validacionForm.get('fechaInicial')?.value;
              const CURRENT_FECHA_FINAL = this.validacionForm.get('fechaFinal')?.value;
              const CURRENT_PAIS = this.validacionForm.get('pais')?.value;
              const CURRENT_TRATADO = this.validacionForm.get('tratado')?.value;

              this.validacionForm.patchValue({
                numeroCertificado: NUMERO_CERTIFICADO,
                tratado: CURRENT_TRATADO || tratadoFormValue,
                pais: CURRENT_PAIS || paisFormValue,
                fechaInicial: CURRENT_FECHA_INITIAL || FORMATTED_FECHA_INICIAL,
                fechaFinal: CURRENT_FECHA_FINAL || FORMATTED_FECHA_FINAL
              });
              
              Object.keys(this.validacionForm.controls).forEach(key => {
                const CONTROL = this.validacionForm.get(key);
                CONTROL?.markAsDirty();
                CONTROL?.updateValueAndValidity();
              });
            }, 0);
          }
        })
      )
      .subscribe();
  }

  /**
   * Inicializa el estado del formulario según el modo de consulta (lectura/edición).
   *
   * Este método evalúa el estado actual de la consulta para determinar si el formulario
   * debe estar en modo de solo lectura o en modo de edición. Dependiendo del estado,
   * ejecuta las acciones correspondientes para configurar correctamente el formulario.
   *
   * @returns void - No retorna valor, pero configura el estado del formulario
   *
   * @example
   * ```typescript
   * this.inicializarEstadoFormulario();
   * // El formulario se configura según el estado de consulta actual
   * ```
   *
   * @remarks
   * - Si `soloLectura` es true, llama a `guardarDatosFormulario()` para cargar datos existentes
   * - Si `soloLectura` es false, llama a `donanteDomicilio()` para inicializar el formulario vacío
   * - Se ejecuta durante la inicialización del componente y cuando cambia el estado de consulta
   * - Es crucial para mantener la consistencia del estado del formulario
   *
   * @see guardarDatosFormulario
   * @see donanteDomicilio
   * @see ConsultaioState
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.donanteDomicilio();
    }
  }

  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.soloLectura) {
      this.validacionForm.disable();
    } else {
      this.validacionForm.enable();
    }
  }

  /**
   * Cambia la fecha inicial en el formulario.
   * @param nuevo_fechaIncial Nueva fecha inicial.
   */
  cambioFechaInicial(nuevo_fechaIncial: string): void {
    this.validacionForm.patchValue({
      fechaInicial: nuevo_fechaIncial,
    });
    this.setValoresStore(this.validacionForm, 'fechaInicial', 'setFechaInicial');
  }

  /**
   * Cambia la fecha final en el formulario.
   * @param nuevo_fechaFinal Nueva fecha final.
   */
  cambioFechaFinal(nuevo_fechaFinal: string): void {
    this.validacionForm.patchValue({
      fechaFinal: nuevo_fechaFinal,
    });

    this.setValoresStore(this.validacionForm, 'fechaFinal', 'setFechaFinal');
  }

  /**
   * Valida el formulario del destinatario. Marca todos los campos como tocados si es inválido.
   */
  validarDestinatarioFormulario(): void {
    if (this.validacionForm.invalid) {
      this.validacionForm.markAllAsTouched();
    }
  }

  /**
   * Convierte una cadena de fecha en formato 'DD/MM/YYYY' a formato 'YYYY-MM-DD'.
   *
   * @param dateString - Cadena de fecha en formato 'DD/MM/YYYY'.
   * @returns La fecha convertida en formato 'YYYY-MM-DD'. Si la cadena es inválida o vacía, retorna la cadena original o una cadena vacía.
   */
  private convertDateFormat(dateString: string): string {
    if (!dateString) {return ''}
    
    // Divide la cadena de fecha por '/'
    const DATEPARTS = dateString.split('/');
    if (DATEPARTS.length !== 3) {return dateString;}
    
    const [DAY, MONTH, YEAR] = DATEPARTS;
    return `${YEAR}-${MONTH.padStart(2, '0')}-${DAY.padStart(2, '0')}`;
  }

  /**
   * Convierte una fecha ISO o formato YYYY-MM-DD a formato 'DD/MM/YYYY' para los inputs.
   *
   * @param dateString - Cadena de fecha en formato ISO o 'YYYY-MM-DD'.
   * @returns La fecha convertida en formato 'DD/MM/YYYY'. Si la cadena es inválida o vacía, retorna una cadena vacía.
   */
  private formatDateForInput(dateString: string): string {
    if (!dateString) {return '';}
    
    try {
      const DATE_OBJ = new Date(dateString);
      if (isNaN(DATE_OBJ.getTime())) {return '';}
      
      const DAY = DATE_OBJ.getDate().toString().padStart(2, '0');
      const MONTH = (DATE_OBJ.getMonth() + 1).toString().padStart(2, '0');
      const YEAR = DATE_OBJ.getFullYear();
      
      return `${DAY}/${MONTH}/${YEAR}`;
    } catch (error) {
      return '';
    }
  }

  /**
   * Activa el estado de búsqueda y emite eventos relacionados con el número de certificado.
   * Pattern validation: ^[A-Za-z0-9]{8,20}$ (8-20 alphanumeric characters)
  /**
   * Flow:
   * 1. Empty input → isNumeroCertificado.emit(true) → shows "campo requerido"
   * 2. Invalid pattern → isNumeroCertificadoPattern.emit(true) → shows "El certificado de origen no existe"
   * 3. Valid pattern → both emit(false) → shows certificate table
   */
  alBuscarClic(): void {
    const { PAIS, TRATADO, FECHA_INICIAL, FECHA_FINAL } = this.validacionForm.value;

    this.estaBuscando = true;
    this.mostrarErrores = false;
    
    const PAYLOAD: any = {
      rfc: 'AAL0409235E6',
      fechaInicial: FECHA_INICIAL ? this.convertDateFormat(FECHA_INICIAL) : '',
      fechaFinal: FECHA_FINAL ? this.convertDateFormat(FECHA_FINAL) : '',
    };

    if (PAIS) {
      const PAIS_OBJ = this.paisCatalogo.catalogos.find(p => p.clave === PAIS);
      if (PAIS_OBJ) {
        PAYLOAD.clavePaisSeleccionado = `${PAIS_OBJ.descripcion}-${PAIS_OBJ.clave}`;
      }
    }

    if (TRATADO) {
      PAYLOAD.idTratadoAcuerdo = TRATADO;
    }

    this.certificadoService
      .buscarListaMercanciasCert(PAYLOAD)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp) => {
          if (Array.isArray(resp?.datos)) {
            this.appendToTable(resp.datos);
          }
          this.estaBuscando = false;
        },
        error: () => {
          this.estaBuscando = false;
          this.mostrarErrores = true;
        },
      });
  } 

  /**
   * Busca un certificado en la tabla de certificados disponibles.
   * @param numero Número de certificado a buscar.
   * @returns `true` si el certificado existe, de lo contrario `false`.
   */
  buscarCertificado(numero: string): boolean {
    if (!numero || numero.trim() === '') {
      return false;
    }

    return this.certificadoDisponsiblesTablaDatos.some(
      (certificado) => String(certificado.numeroCertificado).trim() === numero.trim()
    );
  }


  /**
   * Limpia el formulario y resetea la tabla de certificados.
   */
  limpiarBusqueda(): void {
    this.validacionForm.get('numeroCertificado')?.setValue('');
    this.estaBuscando = true;
    this.mostrarErrores = true;
    this.mensajeError = '';
    this.isNumeroCertificado.emit(false);
    this.isNumeroCertificadoPattern.emit(false);
  }

  /**
   * Maneja los cambios en el input del número de certificado
   * @param event Evento del input
   */
  onNumeroCertificadoChange(event: Event): void {
    const VALOR = (event.target as HTMLInputElement).value;
    this.setValoresStore(this.validacionForm, 'numeroCertificado', 'setNumeroCertificado');
    if (!VALOR?.trim()) {
      this.mostrarErrores = true;
    }
  } 

  /**
   * Obtiene los datos del catálogo de tratados/acuerdos para un trámite específico.
   *
   * Este método realiza una consulta al servicio de catálogos para recuperar información
   * sobre tratados comerciales y acuerdos internacionales disponibles para el trámite especificado.
   * Los datos obtenidos se utilizan para poblar el selector de tratados en el formulario.
   *
   * @param tramiteId - Identificador único del trámite (ej: '110219') para el cual se consultan
   *                    los datos del catálogo de tratados y acuerdos comerciales
   *
   * @returns void - No retorna valor, pero actualiza la propiedad `tratadoCatalogo.catalogos`
   *                 con los datos obtenidos del servicio
   *
   * @throws Error - Puede lanzar errores si la consulta al servicio falla
   *
   * @example
   * ```typescript
   * this.getTratadoData('110219');
   * // Después de la ejecución, tratadoCatalogo.catalogos contendrá los tratados disponibles
   * ```
   *
   * @see CatalogoServices.tratadoAcuerdoCatalogo
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  getTratadoData(cveEntidad: { clave: string; descripcion: string }): void {
    this.catalogoServices
      .tratadosAcuerdosCatalogo(this.tramiteId, cveEntidad.clave)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.tratadoCatalogo.catalogos = resp.datos ?? [];
    });
  }

  /** Maneja el evento de cambio cuando se selecciona una nueva entidad federativa.
   * Actualiza la lista de representaciones federales basándose en la entidad seleccionada.
   * @param event - Objeto Catalogo que representa la entidad seleccionada.
   */
  onChangeEntidad(event: Catalogo): void {
    const SELECTED_ENTIDAD = event;
    this.getTratadoData({
      clave: SELECTED_ENTIDAD.clave ?? '',
      descripcion: SELECTED_ENTIDAD.descripcion ?? '',
    });
  }

  /**
   * Obtiene el catálogo de países y bloques comerciales asociados a un trámite específico.
   *
   * Este método consulta el servicio de catálogos para recuperar la lista de países y bloques
   * comerciales disponibles para el trámite especificado. Los datos se utilizan para poblar
   * el selector de países en el formulario de cancelación de certificados.
   *
   * @param tramiteId - Identificador único del trámite (ej: '110219') para el cual se requiere
   *                    obtener el catálogo de países y bloques comerciales
   *
   * @returns void - No retorna valor, pero actualiza la propiedad `paisCatalogo.catalogos`
   *                 con los datos de países obtenidos del servicio
   *
   * @throws Error - Puede lanzar errores si la consulta al servicio de catálogos falla
   *
   * @example
   * ```typescript
   * this.getPaisdata('110219');
   * // Después de la ejecución, paisCatalogo.catalogos contendrá los países disponibles
   * ```
   *
   * @remarks
   * - La suscripción se gestiona automáticamente con `takeUntil(this.destroyed$)`
   * - Se cancela automáticamente cuando el componente se destruye para evitar memory leaks
   * - Los datos incluyen tanto países individuales como bloques comerciales
   *
   * @see CatalogoServices.paisBloqueCatalogo
   * @see Catalogo
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  getPaisdata(tramiteId: string): void {
    this.catalogoServices
      .paisBloqueCatalogo(tramiteId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.paisCatalogo.catalogos = resp.datos ?? [];
      });
  }

  /**
   * Obtiene y carga los datos de la tabla de certificados disponibles para cancelación.
   *
   * Este método consulta el servicio de certificados para recuperar la lista de certificados
   * disponibles que pueden ser cancelados. Los datos se muestran en una tabla dinámica
   * que permite al usuario seleccionar el certificado que desea cancelar.
   *
   * @returns void - No retorna valor, pero actualiza la propiedad `certificadoDisponsiblesTablaDatos`
   *                 con los datos de certificados obtenidos del servicio
   *
   * @throws Error - Puede lanzar errores si la consulta al servicio de certificados falla
   *
   * @example
   * ```typescript
   * this.getSolicitudesTabla();
   * // Después de la ejecución, certificadoDisponsiblesTablaDatos contendrá los certificados
   * ```
   *
   * @remarks
   * - Los datos incluyen información como número de certificado, país, tratado, fechas, etc.
   * - La suscripción se gestiona automáticamente con `takeUntil(this.destroyed$)`
   * - Se ejecuta durante la inicialización del componente
   * - Los datos se utilizan para poblar la tabla de certificados disponibles
   *
   * @see CertificadoService.getSolicitudesTabla
   * @see ColumnasTabla
   * @see TablaDinamicaComponent
   * @since 1.0.0
   * @author Sistema VUCEM
   */
  public getSolicitudesTabla(): void {
    const NUMERO = this.validacionForm.get('numeroCertificado')?.value || '';

    this.estaBuscando = true;
    this.mostrarErrores = false;

    this.certificadoService
      .buscarMercanciasCert({
        rfc: 'AAL0409235E6',
        numeroCertificadoOrigen: NUMERO.trim(),
      })
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (resp) => {
          if (Array.isArray(resp?.datos)) {
            this.appendToTable(resp.datos);
          }
          this.estaBuscando = false;
        },
        error: () => {
          this.estaBuscando = false;
          this.mostrarErrores = true;
        },
      });
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param form Formulario.
   * @param field Campo a verificar.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Establece valores en el almacén de datos.
   * @param form Formulario.
   * @param campo Campo del formulario.
   * @param metodoNombre Nombre del método en el almacén.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite110219Store
  ): void {
    const VALOR = form.get(campo)?.value;
    
    if (campo === 'pais' && metodoNombre === 'setPais') {
      const SELECTED_PAIS = this.paisCatalogo.catalogos.find(p => 
        p.clave === VALOR || p.id?.toString() === VALOR
      );
      if (SELECTED_PAIS) {
        (this.store[metodoNombre] as (value: Catalogo[]) => void)([SELECTED_PAIS]);
      }
      return;
    }
    
    if (campo === 'tratado' && metodoNombre === 'setTratado') {
      const SELECTED_TRATADO = this.tratadoCatalogo.catalogos.find(t => 
        t.clave === VALOR || t.id?.toString() === VALOR
      );
      if (SELECTED_TRATADO) {
        (this.store[metodoNombre] as (value: Catalogo[]) => void)([SELECTED_TRATADO]);
      }
      return;
    }
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Inicializa el formulario con los datos del estado de la solicitud.
   */
  donanteDomicilio(): void {
    const NUMERO_CERTIFICADO_INITIAL = this.solicitudState?.validacionForm?.numeroCertificado || this.solicitudState?.numeroCertificado || '';
    const TRATADO_INITIAL = this.solicitudState?.validacionForm?.tratado || this.solicitudState?.tratado || '';
    const PAIS_INITIAL = this.solicitudState?.validacionForm?.pais || this.solicitudState?.pais || '';
    const FECHA_INICIAL_INITIAL = this.solicitudState?.validacionForm?.fechaInicial || this.solicitudState?.fechaInicial || '';
    const FECHA_FINAL_INITIAL = this.solicitudState?.validacionForm?.fechaFinal || this.solicitudState?.fechaFinal || '';

    this.validacionForm = this.fb.group({
      numeroCertificado: [{ value: NUMERO_CERTIFICADO_INITIAL, disabled: this.soloLectura}, 
        [Validators.required, 
          Validators.pattern(CERTIFICATE_OF_ORIGIN_NUMBER)]],
      tratado: [
        { value: TRATADO_INITIAL, disabled: this.soloLectura },
        [],
      ],
      pais: [
        { value: PAIS_INITIAL, disabled: this.soloLectura },
        [],
      ],
      fechaInicial: [
        {
          value: FECHA_INICIAL_INITIAL,
          disabled: this.soloLectura,
        },
        [],
      ],
      fechaFinal: [
        { value: FECHA_FINAL_INITIAL, disabled: this.soloLectura },
        [],
      ],
    });
  }

  /**
   * Emite un evento al hacer clic en un botón.
   */
  emitirEventoClick(): void {
    this.dataEvent.emit(3);
  }

  /**
   * Getter para el número de certificado.
   */
  get numeroCertificado(): string {
    return this.validacionForm.get('numeroCertificado')?.value || '';
  }

  /**
   * Maneja el evento de doble clic en la tabla de certificados.
   * @param evt Evento de mouse.
   */
  onTablaDblClick(evt: MouseEvent): void {
    const TD = (evt.target as HTMLElement).closest('td');
    if (!TD) { return; }

    const TR = TD.parentElement;
    if (!TR) { return; }

    // Obtenga el índice de fila para encontrar los datos correspondientes
    const TABLE = TR.closest('table');
    if (!TABLE) { return; }

    /**
     * @desc Referencia al elemento `<tbody>` dentro de la tabla especificada por la constante `TABLE`.
     * @type {HTMLTableSectionElement | null}
     * @see https://developer.mozilla.org/es/docs/Web/API/HTMLTableSectionElement
     *
     * @remarks
     * Utilizado para manipular dinámicamente las filas del cuerpo de la tabla en el componente de cancelación de certificado.
     *
     * @author
     * Generado automáticamente por GitHub Copilot.
     */
    const TBODY = TABLE.querySelector('tbody');
    if (!TBODY) { return; }

    const ROWS = Array.from(TBODY.querySelectorAll('tr'));
    const ROW_INDEX = ROWS.indexOf(TR as HTMLTableRowElement);

    if (ROW_INDEX >= 0 && ROW_INDEX < this.certificadoDisponsiblesTablaDatos.length) {
      const MATCH = this.certificadoDisponsiblesTablaDatos[ROW_INDEX];

      if (MATCH) {
        this.isCertificadoOriginEnable = true;
        this.certificadoOriginEnable.emit(this.isCertificadoOriginEnable);
        this.handleCertificadoDblClick(MATCH);
      }
    }
  }

  /**
   * Maneja la lógica al hacer doble clic sobre un certificado.
   * @param cert Certificado seleccionado.
   */
  private handleCertificadoDblClick(cert: ColumnasTabla): void {
    // Emitir los datos del certificado seleccionado al componente padre
    this.certificadoSeleccionado.emit(cert);
    
    // Encontrar los datos completos de la API para este certificado
    const CERTIFICADO_API_COMPLETO = this.certificadosApiDataCompletos.find(
      (apiCert: CertificadoApiData) => apiCert.numeroCertificado === cert.numeroCertificado
    );
    
    // Emitir los datos completos de la API si se encontraron
    if (CERTIFICADO_API_COMPLETO) {
      this.certificadoApiDataSeleccionado.emit(CERTIFICADO_API_COMPLETO);
    }
    
    // Navegar al siguiente paso (certificado de origen)
    this.dataEvent.emit(3);
  }

  /**
   * @description
   * Valida los campos principales del formulario de certificado.
   * Verifica que los campos `entidadFederativa` y `bloque` tengan valores válidos
   * (no vacíos ni nulos). Si ambos son válidos, retorna `true`.
   * En caso contrario, marca todos los controles del formulario como "touched"
   * y retorna `false`.
   *
   * @returns {boolean} `true` si el formulario es válido; `false` en caso contrario.
   */
  validarFormularios(): boolean {
    if (
      this.validacionForm.get('numeroCertificado')?.value !== '' &&
      this.validacionForm.get('numeroCertificado')?.value !== null
    ) {
      return true;
    }
    this.validacionForm.markAllAsTouched();
    return false;
  }

  /**
   * Actualiza el formulario manualmente con datos del certificado
   * @param certificadoData Datos del certificado desde la API
   */
  public actualizarFormularioConDatos(certificadoData: { 
    numeroCertificado?: string; 
    fechaExpedicion?: string; 
    fechaVencimiento?: string;
    [key: string]: unknown;
  }): void {
    if (this.validacionForm && certificadoData) {
      const NUMERO_CERTIFICADO = certificadoData.numeroCertificado || '';
      const FECHA_EXPEDICION = certificadoData.fechaExpedicion || '';
      const FECHA_VENCIMIENTO = certificadoData.fechaVencimiento || '';
      
      this.validacionForm.patchValue({
        numeroCertificado: NUMERO_CERTIFICADO,
        fechaInicial: FECHA_EXPEDICION ? this.formatDateForInput(FECHA_EXPEDICION) : '',
        fechaFinal: FECHA_VENCIMIENTO ? this.formatDateForInput(FECHA_VENCIMIENTO) : ''
      });
      
      this.store.setNumeroCertificado(NUMERO_CERTIFICADO);
      if (FECHA_EXPEDICION) {
        this.store.setFechaExpedicion(FECHA_EXPEDICION);
      }
      if (FECHA_VENCIMIENTO) {
        this.store.setFechaVencimiento(FECHA_VENCIMIENTO);
      }
      
      Object.keys(this.validacionForm.controls).forEach(key => {
        const CONTROL = this.validacionForm.get(key);
        CONTROL?.markAsDirty();
        CONTROL?.updateValueAndValidity();
      });
    }
  }

  /**
   * Limpia los recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
 * Agrega nuevos certificados a la tabla dinámica sin eliminar los existentes.
 *
 * - Evita duplicados en la tabla usando el número de certificado como clave única.
 * - Mantiene sincronizada la información completa proveniente de la API
 *   para su uso posterior (por ejemplo, doble clic en la tabla).
 *
 * @param data Lista de certificados recibidos desde la API.
 */
  private appendToTable(data: CertificadoApiData[]): void {
    const EXISTING = new Set(
      this.certificadoDisponsiblesTablaDatos.map(d => d.numeroCertificado)
    );
  
    const NUEVOS = data
      .filter(cert => !EXISTING.has(cert.numeroCertificado))
      .map(cert => ({
        numeroCertificado: cert.numeroCertificado || '',
        pais: cert.paisAsociado?.nombre || '',
        tratado: cert.tratadoAsociado?.nombre || '',
        fechaExpedicion: cert.fechaExpedicion || '',
        fechaVencimiento: cert.fechaVencimiento || '',
      }));
  
    this.certificadoDisponsiblesTablaDatos = [
      ...this.certificadoDisponsiblesTablaDatos,
      ...NUEVOS,
    ];
    const API_EXISTING = new Set(
      this.certificadosApiDataCompletos.map(c => c.numeroCertificado)
    );
    this.certificadosApiDataCompletos.push(
      ...data.filter(c => !API_EXISTING.has(c.numeroCertificado))
    );
  }
  
  
}