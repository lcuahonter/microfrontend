import * as XLSX from 'xlsx'; // Importa XLSX para leer archivos Excel
import { AlertComponent, InputCheckComponent, InputRadioComponent, Notificacion, NotificacionesComponent, TituloComponent, VALID_FILE_REGEX } from '@libs/shared/data-access-user/src';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud32201State, Tramite32201Store } from '../../estados/tramite32201.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SOLICITUD_32201_ENUM } from '../../constantes/anexo';
import { Tramite32201Query } from '../../estados/tramite32201.query';

/**
 * Componente que representa la funcionalidad de la solicitud del trámite 32201.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TituloComponent,
    AlertComponent,
    InputCheckComponent,
    NotificacionesComponent,
    InputRadioComponent
  ],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para datos.
   */
  solicitudForm!: FormGroup;

  /**
   * Estado de la solicitud.
   */
  public solicitudState!: Solicitud32201State;

  /**
   * Notificador para destruir observables.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Asigna el aviso de privacidad simplificado al atributo `TEXTOS`.
   */
  TEXTOS = SOLICITUD_32201_ENUM;

  /**
   * Etiqueta del archivo seleccionado.
   */
  elgirDeArchivo: string = this.TEXTOS.ELGIR_DE_ARCHIVO;

  /**
   * Elemento de entrada de archivo HTML.
   *
   * @type {HTMLInputElement}
   */
  elgirArchivo!: HTMLInputElement;

  /**
   * Archivo de medicamentos seleccionado.
   */
  archivoMedicamentos: File | null = null;

  /**
   * Evento de salida que emite cuando se hace clic en el botón continuar.
   */
  @Output() continuarEvento = new EventEmitter<string>();

  /**
   * Una cadena que representa la clase CSS para una alerta de información.
   * Esta clase se utiliza para aplicar estilo a los mensajes de información en el componente.
   */
  public infoAlert = 'alert-info';

  /**
   * Representa una confirmar instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
  public confirmarNotificacion!: Notificacion;

  /**
   * Representa una error instancia de notificación asociada con el componente.
   * Esta propiedad se utiliza para gestionar y almacenar datos de notificaciones.
   */
  public errorNotificacion!: Notificacion;

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
   * Opciones de radio.
   */
  radioOpcions = [
    { label: 'Sí', value: 'si' },
    { label: 'No', value: 'no' },
  ];

  /**
   * Texto de requisito.
   */
  textoRequisito = this.TEXTOS.TEXTO_REQUISITOS;

  /**
   * Indica si se debe mostrar un error cuando se deseleccionan todos los regímenes 1, 2 y 3
   * después de haber estado seleccionados.
   */
  mostrarErrorDeseleccionRegimenes: boolean = false;

  /**
   * Constructor del componente.
   * @param fb - FormBuilder para crear formularios reactivos.
   * @param tramite32201Store - Store para manejar el estado del trámite.
   * @param tramite32201Query - Query para obtener datos del trámite.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32201Store: Tramite32201Store,
    private tramite32201Query: Tramite32201Query,
    private consultaioQuery: ConsultaioQuery
  ) { }

  /**
   * Propiedad para rastrear el estado anterior de los regímenes 1, 2 y 3
   * para detectar cuando se deseleccionan después de haber estado seleccionados
   */
  private regimenesAnteriores = {
    regimen_1: false,
    regimen_2: false,
    regimen_3: false
  };

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Llama a los métodos para obtener datos de establecimientos, empleados, domicilios e instalaciones.
   */  
  ngOnInit(): void {
    this.tramite32201Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          if (this.solicitudState) {
            this.inicializarEstadoFormulario();
          }
        })
      )
      .subscribe();
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
    if (!this.solicitudState) {
      return;
    }
    this.guardarDatosFormulario();   
  }
  /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
    this.donanteDomicilio();
    if (this.esFormularioSoloLectura) {
      this.solicitudForm.disable();
    } else {
      this.solicitudForm.enable();
      this.configurarValidacionRadio3();
      this.solicitudForm.get('textoGenerico22')?.disable();
      this.solicitudForm.get('textoGenerico23')?.disable();
      this.solicitudForm.get('textoGenerico24')?.disable();
    }
  }

  /**
   * Método para cargar un archivo de proveedores.
   * Valida que el archivo sea de formato Excel (.xls o .xlsx) y verifica el número de columnas.
   * Si el archivo es válido, muestra un modal de confirmación; de lo contrario, muestra un modal de error.
   */
  cargarProveedores(): void {
    const FILE_INPUT = document.getElementById(
      'cargarProveedores'
    ) as HTMLInputElement;
    const FILE = FILE_INPUT.files?.[0];
    if (FILE) {
      if (VALID_FILE_REGEX.test(FILE.name)) {
        const READER = new FileReader();
        READER.onload = (e): void => {
          const DATA = new Uint8Array(e.target?.result as ArrayBuffer);
          const WORKBOOK = XLSX.read(DATA, { type: 'array' });
          const JSON_DATA = XLSX.utils.sheet_to_json(
            WORKBOOK.Sheets[WORKBOOK.SheetNames[0]],
            { header: 1 }
          );

          const EXPECTED_COLUMNS = 5; // Agregue aquí el número requerido de columnas o lógica
          const FIRST_ROW = JSON_DATA[0] as string[];
          if (FIRST_ROW.length === EXPECTED_COLUMNS) {
            this.confirmarModal(); // Abre el modal de confirmación
          } else {
            this.errorModal(); // Abre el modal de error
          }
        };

        READER.readAsArrayBuffer(FILE);
      }
    }
  }

  public confirmarModal(): void {
    this.confirmarNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: '',
      mensaje: 'Los registros se realizaron correctamente',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  public errorModal(): void {
    this.errorNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'Mensajes',
      mensaje: 'El número de columnas del archivo es incorrecto',
      cerrar: false,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Activa la selección del archivo de medicamentos.
   * @returns {void}
   */
  activarSeleccionArchivo(): void {
    this.elgirArchivo = document.getElementById(
      'archivoMedicamentos'
    ) as HTMLInputElement;
    if (this.elgirArchivo) {
      this.elgirArchivo.click();
    }
  }

  /**
   * Maneja el cambio de archivo en el input de archivo.
   *
   * @param event Evento de cambio de archivo.
   *
   * @returns {void}
   */
  onCambioDeArchivo(event: Event): void {
    const TARGET = event.target as HTMLInputElement;

    if (TARGET.files && TARGET.files.length > 0) {
      this.archivoMedicamentos = TARGET.files[0];
      this.elgirDeArchivo = this.archivoMedicamentos.name;
    } else {
      this.elgirDeArchivo = this.elgirArchivo?.value;
    }
  }

  /**
   * Establece el valor de un campo en el store de Tramite32201.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite32201Store
  ): void {
    const FIELD_VALUE = form.get(campo)?.value;
    (this.tramite32201Store[metodoNombre] as (value: unknown) => void)(
      FIELD_VALUE
    );
  }

  /**
   * Método para inicializar el formulario reactivo con los valores del estado de la solicitud.
   * Este método se llama al inicializar el componente y establece los valores del formulario
   * basándose en el estado actual de la solicitud.
   */    
  donanteDomicilio(): void {
    if (!this.solicitudState) {
      return;
    }

    this.solicitudForm = this.fb.group({
      regimen_0: [{value: this.solicitudState?.regimen_0, disabled: this.esFormularioSoloLectura}],
      regimen_1: [{value: this.solicitudState?.regimen_1, disabled: this.esFormularioSoloLectura}],
      regimen_2: [{value: this.solicitudState?.regimen_2, disabled: this.esFormularioSoloLectura}],
      regimen_3: [{value: this.solicitudState?.regimen_3, disabled: this.esFormularioSoloLectura}],
      manifiesto: [{value: this.solicitudState?.manifiesto, disabled: this.esFormularioSoloLectura}],
      radio_1: [{value: this.solicitudState?.radio_1, disabled: this.esFormularioSoloLectura}],
      radio_2: [{value: this.solicitudState?.radio_2, disabled: this.esFormularioSoloLectura}],
      radio_3: [{value: this.solicitudState?.radio_3, disabled: this.esFormularioSoloLectura}],
      valorAduana: [{value: this.solicitudState?.valorAduana, disabled: this.esFormularioSoloLectura}],
      textoGenerico10: [{value: this.solicitudState?.textoGenerico10, disabled: this.esFormularioSoloLectura}],
      textoGenerico11: [{value: this.solicitudState?.textoGenerico11, disabled: this.esFormularioSoloLectura}],
      textoGenerico12: [{value: this.solicitudState?.textoGenerico12, disabled: this.esFormularioSoloLectura}],
      textoGenerico13: [{value: this.solicitudState?.textoGenerico13, disabled: this.esFormularioSoloLectura}],
      textoGenerico14: [{value: this.solicitudState?.textoGenerico14, disabled: this.esFormularioSoloLectura}],
      textoGenerico15: [{value: this.solicitudState?.textoGenerico15, disabled: this.esFormularioSoloLectura}],
      textoGenerico16: [{value: this.solicitudState?.textoGenerico16, disabled: this.esFormularioSoloLectura}],
      textoGenerico17: [{value: this.solicitudState?.textoGenerico17, disabled: this.esFormularioSoloLectura}],
      textoGenerico18: [{value: this.solicitudState?.textoGenerico18, disabled: this.esFormularioSoloLectura}],
      textoGenerico19: [{value: this.solicitudState?.textoGenerico19, disabled: this.esFormularioSoloLectura}],
      textoGenerico20: [{value: this.solicitudState?.textoGenerico20, disabled: this.esFormularioSoloLectura}],
      textoGenerico21: [{value: this.solicitudState?.textoGenerico21, disabled: this.esFormularioSoloLectura}],      
      textoGenerico22: [{value: this.solicitudState?.textoGenerico22, disabled: true}],
      textoGenerico23: [{value: this.solicitudState?.textoGenerico23, disabled: true}],
      textoGenerico24: [{value: this.solicitudState?.textoGenerico24, disabled: true}],
    });

    if (this.esFormularioSoloLectura) {
      this.solicitudForm.disable();
    } else {
      this.configurarValidacionRegimen();
      this.configurarValidacionRadio3();
    }
  }

  /**
   * Configura la validación para los checkboxes de Régimen aduanero.
   * Muestra un popup cuando regimen_0 está seleccionado y NINGUNO de los otros está seleccionado.
   * También valida cuando se deseleccionan todos los regímenes 1, 2 y 3 después de haber estado seleccionados.
   */
  private configurarValidacionRegimen(): void {
    if (!this.esFormularioSoloLectura) {
      this.regimenesAnteriores = {
        regimen_1: this.solicitudForm.get('regimen_1')?.value || false,
        regimen_2: this.solicitudForm.get('regimen_2')?.value || false,
        regimen_3: this.solicitudForm.get('regimen_3')?.value || false
      };

      ['regimen_0', 'regimen_1', 'regimen_2', 'regimen_3'].forEach(controlName => {
        this.solicitudForm.get(controlName)?.valueChanges
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe(() => {
            this.validarRegimenAduanero();
          });
      });
    }
  }  

    /**
   * Valida la condición de Régimen aduanero y muestra popup si es necesario.
   * Condición 1: Si regimen_0 está seleccionado y NINGUNO de regimen_1, regimen_2 o regimen_3 está seleccionado.
   * Condición 2: Si cualquiera de los regímenes 1, 2 o 3 estaba seleccionado y ahora todos están deseleccionados.
   * Condición 3: Si alguno de los regímenes 1, 2 o 3 está seleccionado, oculta el mensaje de error.
   */  
  private validarRegimenAduanero(): void {
    const REGIMEN_0 = this.solicitudForm.get('regimen_0')?.value;
    const REGIMEN_1 = this.solicitudForm.get('regimen_1')?.value;
    const REGIMEN_2 = this.solicitudForm.get('regimen_2')?.value;
    const REGIMEN_3 = this.solicitudForm.get('regimen_3')?.value;

    if (REGIMEN_0) {
      if (!REGIMEN_1 && !REGIMEN_2 && !REGIMEN_3) {
        this.mostrarPopupRegimenAduanero();
      }
    }

    const REGIMEN_ACTUALES = { regimen_1: REGIMEN_1, regimen_2: REGIMEN_2, regimen_3: REGIMEN_3 };
    const REGIMEN_SELECCCIONADO = this.regimenesAnteriores.regimen_1 || 
                                          this.regimenesAnteriores.regimen_2 || 
                                          this.regimenesAnteriores.regimen_3;
    const REGIMENS = REGIMEN_1 || REGIMEN_2 || REGIMEN_3;

    if (REGIMEN_SELECCCIONADO && !REGIMENS) {
      this.mostrarErrorDeseleccionRegimenes = true;
    } else if (REGIMENS) {
      this.mostrarErrorDeseleccionRegimenes = false;
    }

    this.regimenesAnteriores = { ...REGIMEN_ACTUALES };
  }
  
  /**
   * Muestra un popup de advertencia para la condición de Régimen aduanero.
   */
  public mostrarPopupRegimenAduanero(): void {
    this.confirmarNotificacion = {
      tipoNotificacion: 'alert',
      categoria: 'warning',
      modo: 'action',
      titulo: '',
      mensaje: 'Debe contar con IMMEX activo y vigente.',
      cerrar: false,
      tiempoDeEspera: 5000,
      txtBtnAceptar: 'Acceptar',
      txtBtnCancelar: '',
    };
  }

  /**
   * Maneja la confirmación del popup de régimen aduanero.
   * @param confirmar - Indica si el usuario confirmó (true) o canceló (false)
   */    
  public manejarConfirmacionRegimen(confirmar: boolean): void {
    if (confirmar) {
      this.deseleccionarRegimen0();
    }
    this.confirmarNotificacion = null as any;
  }

  /**
   * Deselecciona el régimen 0 y actualiza el store.
   */
  private deseleccionarRegimen0(): void {
    this.solicitudForm.get('regimen_0')?.setValue(false);
    this.tramite32201Store.setRegimen_0(false);
  }

  /**
   * Configura la validación para el radio_3 que controla la habilitación/deshabilitación
   * de los campos textoGenerico y valorAduana.
   */
  private configurarValidacionRadio3(): void {
    if (!this.esFormularioSoloLectura) {
      this.solicitudForm.get('radio_3')?.valueChanges
        .pipe(takeUntil(this.destroyNotifier$))
        .subscribe((valor) => {
          this.controlarCamposTextoGenerico(valor);
        });
      
      const VALOR_INICIAL_RADIO = this.solicitudForm.get('radio_3')?.value;
      this.controlarCamposTextoGenerico(VALOR_INICIAL_RADIO);
    }
  }

  /**
   * Controla la habilitación/deshabilitación de los campos textoGenerico y valorAduana
   * basado en el valor del radio_3.
   * @param valorRadio3 - El valor seleccionado en radio_3 ('si' o 'no')
   */  
  private controlarCamposTextoGenerico(valorRadio3: string): void {
    const CAMPOS_TEXTO_GENERICO = [
      'textoGenerico10', 'textoGenerico11', 'textoGenerico12', 'textoGenerico13',
      'textoGenerico14', 'textoGenerico15', 'textoGenerico16', 'textoGenerico17',
      'textoGenerico18', 'textoGenerico19', 'textoGenerico20', 'textoGenerico21',
      'valorAduana'
    ];

    if (this.esFormularioSoloLectura) {
      CAMPOS_TEXTO_GENERICO.forEach(campo => {
        this.solicitudForm.get(campo)?.disable();
      });
      return;
    }

    if (valorRadio3 === 'si') {
      CAMPOS_TEXTO_GENERICO.forEach(campo => {
        this.solicitudForm.get(campo)?.enable();
      });
    } else {
      CAMPOS_TEXTO_GENERICO.forEach(campo => {
        this.solicitudForm.get(campo)?.disable();
      });
    }
  }

  /** Actualiza el décimo texto genérico y recalcula el valor comercial */
  actualizarTextoGenerico10(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico10(VALOR);
    this.calcularValorComercial();
  }

  /** Actualiza el undécimo texto genérico y recalcula el valor aduanero */
  actualizarTextoGenerico11(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico11(VALOR);
    this.calcularValorAduana();
  }

  /** Actualiza el duodécimo texto genérico y recalcula el porcentaje */
  actualizarTextoGenerico12(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico12(VALOR);
    this.calcularValorPorcentaje();
  }

  /** Actualiza el decimotercer texto genérico y recalcula el valor comercial */
  actualizarTextoGenerico13(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico13(VALOR);
    this.calcularValorComercial();
  }

  /** Actualiza el decimocuarto texto genérico y recalcula el valor aduanero */
  actualizarTextoGenerico14(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico14(VALOR);
    this.calcularValorAduana();
  }

  /** Actualiza el decimoquinto texto genérico y recalcula el porcentaje */
  actualizarTextoGenerico15(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico15(VALOR);
    this.calcularValorPorcentaje();
  }

  /** Actualiza el decimosexto texto genérico y recalcula el valor comercial */
  actualizarTextoGenerico16(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico16(VALOR);
    this.calcularValorComercial();
  }

  /** Actualiza el decimoséptimo texto genérico y recalcula el valor aduanero */
  actualizarTextoGenerico17(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico17(VALOR);
    this.calcularValorAduana();
  }

  /** Actualiza el decimoctavo texto genérico y recalcula el porcentaje */
  actualizarTextoGenerico18(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico18(VALOR);
    this.calcularValorPorcentaje();
  }

  /** Actualiza el decimonoveno texto genérico y recalcula el valor comercial */
  actualizarTextoGenerico19(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico19(VALOR);
    this.calcularValorComercial();
  }

  /** Actualiza el vigésimo texto genérico y recalcula el valor aduanero */
  actualizarTextoGenerico20(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico20(VALOR);
    this.calcularValorAduana();
  }

  /** Actualiza el vigesimoprimer texto genérico y recalcula el porcentaje */
  actualizarTextoGenerico21(evento: Event): void {
    const VALOR = (evento.target as HTMLInputElement).value;
    this.tramite32201Store.setTextoGenerico21(VALOR);
    this.calcularValorPorcentaje();
  }

  /** Calcula el valor comercial sumando los valores ingresados */
  calcularValorComercial(): void {
    const VALOR1 = this.solicitudForm.get('textoGenerico10')?.value;
    const VALOR2 = this.solicitudForm.get('textoGenerico13')?.value;
    const VALOR3 = this.solicitudForm.get('textoGenerico16')?.value;
    const VALOR4 = this.solicitudForm.get('textoGenerico19')?.value;

    const VALOR_COMERCIAL = (Number(VALOR1) || 0) + (Number(VALOR2) || 0) + (Number(VALOR3) || 0) + (Number(VALOR4) || 0);
    this.tramite32201Store.setTextoGenerico22(VALOR_COMERCIAL);
    this.solicitudForm.get('textoGenerico22')?.setValue(VALOR_COMERCIAL, { emitEvent: false });
  }

  /** Calcula el valor aduanero sumando los valores ingresados */
  calcularValorAduana(): void {
    const VALOR1 = this.solicitudForm.get('textoGenerico11')?.value;
    const VALOR2 = this.solicitudForm.get('textoGenerico14')?.value;
    const VALOR3 = this.solicitudForm.get('textoGenerico17')?.value;
    const VALOR4 = this.solicitudForm.get('textoGenerico20')?.value;

    const VALOR_ADUANERO = (Number(VALOR1) || 0) + (Number(VALOR2) || 0) + (Number(VALOR3) || 0) + (Number(VALOR4) || 0);
    this.tramite32201Store.setTextoGenerico23(VALOR_ADUANERO);
    this.solicitudForm.get('textoGenerico23')?.setValue(VALOR_ADUANERO, { emitEvent: false });
  }

  /** Calcula el porcentaje basado en los valores ingresados */
  calcularValorPorcentaje(): void {
    const VALOR1 = this.solicitudForm.get('textoGenerico12')?.value;
    const VALOR2 = this.solicitudForm.get('textoGenerico15')?.value;
    const VALOR3 = this.solicitudForm.get('textoGenerico18')?.value;
    const VALOR4 = this.solicitudForm.get('textoGenerico21')?.value;

    const VALOR_PORCENTAJE = (Number(VALOR1) || 0) + (Number(VALOR2) || 0) + (Number(VALOR3) || 0) + (Number(VALOR4) || 0);
    this.tramite32201Store.setTextoGenerico24(VALOR_PORCENTAJE);
    this.solicitudForm.get('textoGenerico24')?.setValue(VALOR_PORCENTAJE, { emitEvent: false });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el observable `destroyed$` para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

}
