/* eslint-disable complexity */
import { AlertComponent, BtnContinuarComponent, ConfiguracionColumna, ConsultaioQuery, ConsultaioState, DatosPasos, InputFecha, ListaPasosWizard, PASOS, TELEFONO, TablaDinamicaComponent, TablaSeleccion, TituloComponent, ValidacionesFormularioService } from '@libs/shared/data-access-user/src';
import { CertificadoApiData, ColumnasTabla, FECHA_EXPEDICION, FECHA_VENCIMIENTO, MercanciaCertificado, ProductoresAsociados } from '../../models/certificado.model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud110219State, Tramite110219Store } from '../../estados/Tramite110219.store';
import { CertificadoService } from '../../services/certificado.service';
import { CommonModule } from '@angular/common';
import { Tramite110219Query } from '../../estados/Tramite110219.query';

/** 
 * Texto de alerta que se muestra para la tabla de mercancías del certificado.
 */
const TEXTO_DE_ALERTA_MERCANCIAS = 'Mercancías del Certificado';

/** 
 * Texto de alerta que se muestra para la tabla de productores asociados al certificado.
 */
const TEXTO_DE_ALERTA_PRODUCTORES = 'Productores asociados';

/**
 * Componente para gestionar el certificado de origen.
 */
@Component({
  selector: 'app-certificado-de-origen',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    BtnContinuarComponent,
  ],
  templateUrl: './certificado-de-origen.component.html',
  styleUrl: './certificado-de-origen.component.css',
})
export class CertificadoDeOrigenComponent
  implements OnInit, OnDestroy, OnChanges
{
  /**
   * Estado de consulta de datos (readonly, etc).
   */
  consultaDatos!: ConsultaioState;

  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  soloLectura: boolean = false;

  /**
   * Indica si se debe mostrar los errores de validación.
   * Se activa cuando el usuario intenta continuar con el formulario inválido.
   */
  mostrarErroresValidacion: boolean = false;

  /**
   * Formulario reactivo para el certificado de origen.
   */
  cancelacionForm!: FormGroup;

  /**
   * Evento para emitir datos al componente padre al continuar.
   */
  @Output() dataEventContinuar = new EventEmitter<number>();

  /**
   * Evento para indicar si los datos al continuar son válidos.
   */
  @Output() isDataEventContinuar = new EventEmitter<boolean>();

  /**
   * Evento para indicar si hay un error de patrón en la cancelación (excede 1500 caracteres).
   */
  @Output() cancelacionPatternEvent = new EventEmitter<boolean>();

  /**
   * Datos del certificado seleccionado desde la tabla de cancelación.
   */
  @Input() certificadoSeleccionado: ColumnasTabla | null = null;

  /**
   * Datos completos de la API del certificado seleccionado.
   */
  @Input() certificadoApiDataCompleto: CertificadoApiData | null = null;

  /**
   * Sujeto para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Datos de la tabla de mercancías del certificado.
   */
  public mercanciaCertificadoTablaDatos: MercanciaCertificado[] = [];

  /**
   * Datos de la tabla de productores asociados.
   */
  public productoresAsociadosTablaDatos: ProductoresAsociados[] = [];

  /**
   * Texto de alerta para mercancías.
   */
  TEXTO_DE_ALERTA_MERCANCIAS = TEXTO_DE_ALERTA_MERCANCIAS;

  /**
   * Texto de alerta para productores.
   */
  TEXTO_DE_ALERTA_PRODUCTORES = TEXTO_DE_ALERTA_PRODUCTORES;

  /**
   * Fecha inicial para el formulario.
   */
  fechaInicialInput: InputFecha = FECHA_EXPEDICION;

  /**
   * Fecha final para el formulario.
   */
  fechaFinalInput: InputFecha = FECHA_VENCIMIENTO;

  /**
   * Estado de la solicitud actual.
   */
  public solicitudState!: Solicitud110219State;

  /**
   * Enumeración para la selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Encabezados de la tabla de mercancías.
   */
  public encabezadosMercancias: ConfiguracionColumna<MercanciaCertificado>[] = [
    {
      encabezado: 'Número de Orden',
      clave: (ele: MercanciaCertificado) => ele.numeroOrden,
      orden: 1,
    },
    {
      encabezado: 'Fracción arancelaria',
      clave: (ele: MercanciaCertificado) => ele.fraccionArancelaria,
      orden: 2,
    },
    {
      encabezado: 'Nombre técnico',
      clave: (ele: MercanciaCertificado) => ele.nombreTecnico,
      orden: 3,
    },
    {
      encabezado: 'Nombre comercial',
      clave: (ele: MercanciaCertificado) => ele.nombreComercial,
      orden: 4,
    },
    {
      encabezado: 'Nombre en Inglés',
      clave: (ele: MercanciaCertificado) => ele.nombreIngles,
      orden: 5,
    },
    {
      encabezado: 'Complemento de la Descripción',
      clave: (ele: MercanciaCertificado) => ele.complementoDescripcion,
      orden: 6,
    },
    {
      encabezado: 'Marca',
      clave: (ele: MercanciaCertificado) => ele.marca,
      orden: 7,
    },
    {
      encabezado: 'Criterio para conferir origen',
      clave: (ele: MercanciaCertificado) => ele.criterio,
      orden: 8,
    },
    {
      encabezado: 'Norma',
      clave: (ele: MercanciaCertificado) => ele.norma,
      orden: 9,
    },
    {
      encabezado: 'Cantidad a Exportar',
      clave: (ele: MercanciaCertificado) => ele.cantidadExportar,
      orden: 10,
    },
    {
      encabezado: 'Unidad de medida de comercialización (Cantidad a Exportar)',
      clave: (ele: MercanciaCertificado) => ele.unidad,
      orden: 11,
    },
    {
      encabezado: 'Masa bruta',
      clave: (ele: MercanciaCertificado) => ele.masaBruta,
      orden: 12,
    },
    {
      encabezado: 'Unidad de medida de comercialización (Masa bruta)',
      clave: (ele: MercanciaCertificado) => ele.comercializacion,
      orden: 13,
    },
    {
      encabezado: 'Valor de la mercancía',
      clave: (ele: MercanciaCertificado) => ele.valorMercancia,
      orden: 14,
    },
    {
      encabezado: 'Número de factura',
      clave: (ele: MercanciaCertificado) => ele.numeroFactura,
      orden: 15,
    },
    {
      encabezado: 'Fecha de Factura',
      clave: (ele: MercanciaCertificado) => ele.fechaFactura,
      orden: 16,
    },
    {
      encabezado: 'Número de Registro de Productos',
      clave: (ele: MercanciaCertificado) => ele.registroProductos,
      orden: 17,
    },
  ];

  /**
   * Encabezados de la tabla de productores asociados.
   */
  public encabezadosProductores: ConfiguracionColumna<ProductoresAsociados>[] =
    [
      {
        encabezado: 'Nombre del productor',
        clave: (ele: ProductoresAsociados) => ele.nombreProductor,
        orden: 1,
      },
      {
        encabezado: 'Número de registro fiscal',
        clave: (ele: ProductoresAsociados) => ele.numeroRegistroFiscal,
        orden: 2,
      },
      {
        encabezado: 'Dirección',
        clave: (ele: ProductoresAsociados) => ele.direccion,
        orden: 3,
      },
      {
        encabezado: 'Correo electrónico',
        clave: (ele: ProductoresAsociados) => ele.correoElectronico,
        orden: 4,
      },
      {
        encabezado: 'Teléfono',
        clave: (ele: ProductoresAsociados) => ele.telefono,
        orden: 5,
      },
      {
        encabezado: 'Fax',
        clave: (ele: ProductoresAsociados) => ele.fax,
        orden: 6,
      },
    ];

  /**
   * Lista de pasos del asistente.
   */
  pasos: ListaPasosWizard[] = PASOS;

  /**
   * Índice del paso actual.
   */
  indice: number = 1;

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
    public store: Tramite110219Store,
    private query: Tramite110219Query,
    private consultaioQuery: ConsultaioQuery
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
   * Inicializa el componente y el formulario, y carga los datos de la tabla de mercancías.
   */
  ngOnInit(): void {
    this.cancelacionForm = new FormGroup({
      motivoCancelacion: new FormControl('', Validators.required),
      fechaExpedicion: new FormControl(
        this.solicitudState?.fechaExpedicion,
        
      ),
      fechaVencimiento: new FormControl(
        this.solicitudState?.fechaVencimiento,
        
      ),
      certificadoDeOrigen: new FormControl(
        this.solicitudState?.certificadoDeOrigen,
        
      ),
      bloque: new FormControl(this.solicitudState?.bloque, ),
      acuerdo: new FormControl(
        this.solicitudState?.acuerdo,
        
      ),
      observaciones: new FormControl(
        this.solicitudState?.observaciones,
        
      ),
      nombre: new FormControl(this.solicitudState?.nombre, ),
      primerApellido: new FormControl(
        this.solicitudState?.primerApellido,
        
      ),
      segundoApellido: new FormControl(
        this.solicitudState?.segundoApellido,
        
      ),
      registroFiscal: new FormControl(
        this.solicitudState?.registroFiscal,
        
      ),
      razonSocial: new FormControl(
        this.solicitudState?.razonSocial,
        
      ),
      calle: new FormControl(this.solicitudState?.calle, ),
      numeroLetra: new FormControl(
        this.solicitudState?.numeroLetra,
        
      ),
      telefono: new FormControl(
        { value: this.solicitudState?.telefono, disabled: true },
        [Validators.pattern(TELEFONO)]
      ),
      ciudad: new FormControl(this.solicitudState?.ciudad, ),
      fax: new FormControl(this.solicitudState?.fax, [
        Validators.pattern(TELEFONO),
      ]),
      correoElectronico: new FormControl(
        this.solicitudState?.correoElectronico,
        [Validators.email]
      ),
    });
    this.inicializarEstadoFormulario();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();

    if (this.certificadoSeleccionado) {
      this.populateFormWithCertificateData(this.certificadoSeleccionado);
    }
  }

  /**
   * Detecta cambios en las propiedades de entrada del componente.
   * @param changes Cambios en las propiedades.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['certificadoSeleccionado'] &&
      changes['certificadoSeleccionado'].currentValue
    ) {
      this.populateFormWithCertificateData(
        changes['certificadoSeleccionado'].currentValue
      );
    }

    // Si tenemos datos completos de la API, usarlos para poblar el formulario
    if (
      changes['certificadoApiDataCompleto'] &&
      changes['certificadoApiDataCompleto'].currentValue
    ) {
      this.populateFormWithCompleteApiData(
        changes['certificadoApiDataCompleto'].currentValue
      );
    }
  }

  /**
   * Pobla el formulario con los datos del certificado seleccionado.
   * @param certificado Datos del certificado seleccionado.
   */
  private populateFormWithCertificateData(certificado: ColumnasTabla): void {
    if (this.cancelacionForm && certificado) {
      const VALIDACION_FORM = this.cancelacionForm.get(
        'validacionForm'
      ) as FormGroup;
      if (VALIDACION_FORM) {
        // Extract only the date part from ISO datetime strings
        const FECHA_EXPEDICION = this.extractDateFromISO(
          certificado.fechaExpedicion
        );
        const FECHA_VENCIMIENTO = this.extractDateFromISO(
          certificado.fechaVencimiento
        );

        VALIDACION_FORM.patchValue({
          certificadoDeOrigen: certificado.numeroCertificado,
          fechaExpedicion: FECHA_EXPEDICION,
          fechaVencimiento: FECHA_VENCIMIENTO,
          bloque: certificado.pais,
          acuerdo: certificado.tratado,
        });
      }
    }
  }

  /**
   * Pobla el formulario con todos los datos completos de la API del certificado seleccionado.
   * @param certificadoApiData Datos completos de la API del certificado seleccionado.
   */
  private populateFormWithCompleteApiData(
    certificadoApiData: CertificadoApiData
  ): void {
    if (this.cancelacionForm && certificadoApiData) {
      const VALIDACION_FORM = this.cancelacionForm.get(
        'validacionForm'
      ) as FormGroup;
      if (VALIDACION_FORM) {
        const FECHA_EXPEDICION = this.extractDateFromISO(
          certificadoApiData.fechaExpedicion || ''
        );
        const FECHA_VENCIMIENTO = this.extractDateFromISO(
          certificadoApiData.fechaVencimiento || ''
        );

        setTimeout(() => {
          this.cancelacionForm.get('validacionForm')?.patchValue({
            certificadoDeOrigen: certificadoApiData.numeroCertificado || '',
            fechaExpedicion: FECHA_EXPEDICION,
            fechaVencimiento: FECHA_VENCIMIENTO,
            bloque: certificadoApiData.paisAsociado?.nombre || '',
            acuerdo: certificadoApiData.tratadoAsociado?.nombre || '',
            observaciones: certificadoApiData.observaciones || '',
            nombre: certificadoApiData.solicitud?.destinatario?.nombre || '',
            primerApellido: certificadoApiData.solicitud?.destinatario?.apellidoMaterno || '',
            segundoApellido: certificadoApiData.solicitud?.destinatario?.apellidoPaterno || '',
            registroFiscal: certificadoApiData.mercanciasAsociadas?.[0]?.numeroRegistro || '',
            razonSocial: certificadoApiData.solicitud?.destinatario?.razonSocial || '',
            numeroLetra: certificadoApiData.solicitud?.destinatario?.numeroPermiso || '',
            telefono: certificadoApiData.solicitud?.destinatario?.domicilio?.telefono || '',
            ciudad: certificadoApiData.solicitud?.destinatario?.domicilio?.ciudad || '',
            fax: certificadoApiData.solicitud?.destinatario?.domicilio?.fax || '',
            correoElectronico: certificadoApiData.solicitud?.destinatario?.correoElectronico || '',
            nombreRepresentante: certificadoApiData.solicitud?.representanteLegal?.nombre || '',
            correoElectronicoRepresentante: certificadoApiData.solicitud?.representanteLegal?.correoElectronico || '',
            telefonoRepresentante: certificadoApiData.solicitud?.representanteLegal?.telefono || '',
            faxRepresentante: certificadoApiData.solicitud?.destinatario?.domicilio?.fax || '',
          });
          // Mapear las mercancías de la API al formato de la tabla
          if (certificadoApiData.mercanciasAsociadas?.length) {
            this.mercanciaCertificadoTablaDatos = certificadoApiData.mercanciasAsociadas.map(m => ({
              numeroOrden: m.numeroOrden?.toString() || '',
              fraccionArancelaria: m.fraccionArancelaria || '',
              nombreTecnico: m.nombreTecnico || '',
              nombreComercial: m.nombreComercial || '',
              nombreIngles: m.nombreIngles || '',
              complementoDescripcion: m.complementoDescripcion || '',
              marca: m.marca || '',
              criterio: '',
              norma: '', 
              cantidadExportar: m.cantidad?.toString() || '',
              unidad: m.unidadMedidaDescripcion || '',
              masaBruta: m.masaBruta?.toString() || '',
              comercializacion: '',
              valorMercancia: m.valorMercancia?.toString() || '',
              numeroFactura: m.numeroFactura || '',
              fechaFactura: m.fechaFactura || '',
              registroProductos: m.numeroRegistro || ''
            }));
          }

          // Mapear los productores de la API al formato de la tabla
          if (certificadoApiData.productores?.length) {
            this.productoresAsociadosTablaDatos = certificadoApiData.productores.map(productor => ({
              nombreProductor: productor.nombre || '',
              numeroRegistroFiscal: productor.razonSocial || '',
              direccion: productor.direcciones || '',
              correoElectronico: productor.correoElectronico || '',
              telefono: productor.telefono || '',
              fax: productor.domicilio?.fax || '',
            }));
          }
        }, 0);
       
        this.cancelacionForm.patchValue({
          validacionForm: VALIDACION_FORM
        });
      }
    }
  }

  /**
   * Extrae solo la fecha de un string ISO datetime.
   * @param isoString String en formato ISO (ej: "2021-12-14T12:57:50.000-06:00")
   * @returns Fecha en formato YYYY-MM-DD o el string original si no es válido
   */
  private extractDateFromISO(isoString: string): string {
    if (!isoString) {
      return '';
    }

    try {
      // Si es un string ISO válido, extraer solo la fecha
      if (isoString.includes('T')) {
        return isoString.split('T')[0]; // Obtiene la parte antes de 'T'
      }

      // Si ya es solo fecha, devolverla tal como está
      return isoString;
    } catch (error) {
      return isoString; // Devolver el string original si hay error
    }
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de mercancía.
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
      this.cancelacionForm.disable();
    } else {
      this.cancelacionForm.enable();
    }
  }

  /**
   * Obtiene los datos de la tabla de mercancías del certificado.
   */
  public getMercanciaCertificadoTabla(): void {
    this.certificadoService
      .getMercanciaCertificadoTabla()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.mercanciaCertificadoTablaDatos = data;
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
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Obtiene el formulario de validación anidado.
   */
  get validacionForm(): FormGroup {
    return this.cancelacionForm.get('validacionForm') as FormGroup;
  }

  /**
   * Inicializa el formulario con los datos del estado de la solicitud.
   */
  donanteDomicilio(): void {
    this.cancelacionForm = this.fb.group({
      validacionForm: this.fb.group({
        motivoCancelacion: [
          {
            value: this.solicitudState?.motivoCancelacion,
            disabled: this.soloLectura,
          },
          [Validators.required, Validators.maxLength(1500)],
        ],
        fechaExpedicion: [
          {
            value: this.solicitudState?.fechaExpedicion,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        fechaVencimiento: [
          {
            value: this.solicitudState?.fechaVencimiento,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        certificadoDeOrigen: [
          {
            value: this.solicitudState?.certificadoDeOrigen,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        bloque: [
          { value: this.solicitudState?.bloque, disabled: this.soloLectura },
          [Validators.required],
        ],
        acuerdo: [
          { value: this.solicitudState?.acuerdo, disabled: this.soloLectura },
          [Validators.required],
        ],
        observaciones: [
          {
            value: this.solicitudState?.observaciones,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        nombre: [
          { value: this.solicitudState?.nombre, disabled: this.soloLectura },
          [Validators.required],
        ],
        primerApellido: [
          {
            value: this.solicitudState?.primerApellido,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        segundoApellido: [
          {
            value: this.solicitudState?.segundoApellido,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        registroFiscal: [
          {
            value: this.solicitudState?.registroFiscal,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        razonSocial: [
          {
            value: this.solicitudState?.razonSocial,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        calle: [
          { value: this.solicitudState?.calle, disabled: this.soloLectura },
          [Validators.required],
        ],
        numeroLetra: [
          {
            value: this.solicitudState?.numeroLetra,
            disabled: this.soloLectura,
          },
          [Validators.required],
        ],
        telefono: [
          { value: this.solicitudState?.telefono, disabled: this.soloLectura },
          [Validators.required, Validators.pattern(TELEFONO)],
        ],
        ciudad: [
          { value: this.solicitudState?.ciudad, disabled: this.soloLectura },
          [Validators.required],
        ],
        fax: [
          { value: this.solicitudState?.fax, disabled: this.soloLectura },
          [Validators.required, Validators.pattern(TELEFONO)],
        ],
        correoElectronico: [
          {
            value: this.solicitudState?.correoElectronico,
            disabled: this.soloLectura,
          },
          [Validators.required, Validators.email],
        ],
        nombreRepresentante: [{ value: '', disabled: true }],
        empresaRepresentante: [{ value: '', disabled: true }],
        telefonoRepresentante: [{ value: '', disabled: true }],
        faxRepresentante: [{ value: '', disabled: true }],
        correoElectronicoRepresentante: [{ value: '', disabled: true }],
      }),
    });
  }

  /**
   * Emite un evento al hacer clic en un botón.
   */
  emitirEventoClick(): void {
    const MOTIVO_CANCELACION_CONTROL = this.cancelacionForm.get('validacionForm.motivoCancelacion');
    const IS_CANCELACION_PATTERN_ERROR = MOTIVO_CANCELACION_CONTROL?.hasError('maxlength') || false;
    
    // Emitir el estado del error de patrón de cancelación
    this.cancelacionPatternEvent.emit(IS_CANCELACION_PATTERN_ERROR);
    
    if (this.cancelacionForm.get('validacionForm')?.valid) {
      this.mostrarErroresValidacion = false;
      this.dataEventContinuar.emit(3);
      this.isDataEventContinuar.emit(false);
    } else {
      this.mostrarErroresValidacion = true;
      this.cancelacionForm.get('validacionForm')?.markAllAsTouched();
      this.datosPasos.indice = 1;
      this.isDataEventContinuar.emit(true);
      this.dataEventContinuar.emit(3);
    }
  }

  /**
   * Limpia los recursos al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  validarFormularios(): boolean {
    const MOTIVO_CANCELACION_CONTROL = this.cancelacionForm.get('validacionForm.motivoCancelacion');
    const IS_CANCELACION_PATTERN_ERROR = MOTIVO_CANCELACION_CONTROL?.hasError('maxlength') || false;
    
    // Emitir el estado del error de patrón de cancelación
    this.cancelacionPatternEvent.emit(IS_CANCELACION_PATTERN_ERROR);
    
    if(
      MOTIVO_CANCELACION_CONTROL?.value !== '' &&
      MOTIVO_CANCELACION_CONTROL?.value !== null &&
      MOTIVO_CANCELACION_CONTROL?.valid
    ){
      return true;
    }
    this.cancelacionForm.get('validacionForm')?.markAllAsTouched();
    return false;
  }
}