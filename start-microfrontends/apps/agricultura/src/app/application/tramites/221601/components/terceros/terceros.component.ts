import {
  AlertComponent,
  Catalogo,
  CatalogoSelectComponent,
  ConfiguracionColumna,
  InputRadioComponent,
  NotificacionesComponent,
  TablaDinamicaComponent,
  TablaSeleccion,
  TituloComponent,
  ValidacionesFormularioService,

} from '@libs/shared/data-access-user/src';
import { Notificacion } from '@libs/shared/data-access-user/src';

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Exportador,
  MENSAJE_TABLA_OBLIGATORIA,
  PreOperativo,
} from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';

import { CONFIGURATION_TABLA_DATOS, CONFIGURATION_TABLA_DESTINATARIO } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';
import { Destinatario } from '@libs/shared/data-access-user/src/core/models/221601/zoosanitario.model';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  Solicitud221601State,
  Tramite221601Store
} from '../../../../estados/tramites/tramite221601.store';
import {
  Subject,
  map,
  takeUntil
} from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { ModalComponent } from '../modal/modal.component';
import { Tramite221601Query } from '../../../../estados/queries/tramite221601.query';
import realizar from '@libs/shared/theme/assets/json/221601/zoosanitario.json';

import { CommonModule } from '@angular/common';
import { ZoosanitarioService } from '../../service/zoosanitario.service';

import Plantatif from '@libs/shared/theme/assets/json/221601/plantatif.json';

/**
 * @fileoverview Componente para la gestión de terceros (destinatarios) en el trámite zoosanitario 221601.
 * Este componente permite agregar, modificar, eliminar y buscar terceros con diferentes tipos de persona
 * (física, moral, planta TIF).
 * 
 * @author Sistema de Agricultura
 * @version 1.0.0
 * @since 2025
 */

/**
 * Componente standalone para la gestión de terceros en el trámite 221601.
 * Maneja formularios reactivos para capturar datos personales y de contacto
 * de destinatarios con validaciones condicionales según el tipo de persona.
 * 
 * @component TercerosComponent
 * @standalone true
 * @selector app-terceros
 * @templateUrl ./terceros.component.html
 * @styleUrls ./terceros.component.scss
 * 
 * @implements {OnInit} Inicialización del componente
 * @implements {OnDestroy} Limpieza de recursos y subscripciones
 * 
 * @example
 * ```html
 * <app-terceros></app-terceros>
 * ```
 */
@Component({
  selector: 'app-terceros',
  standalone: true,
  imports: [
    TituloComponent,
    TablaDinamicaComponent,
    AlertComponent,
    FormsModule,
    ReactiveFormsModule,
    CatalogoSelectComponent,
    ModalComponent,
    CommonModule,
    InputRadioComponent,
    NotificacionesComponent
  ],
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit, OnDestroy {

  /**
   * Catálogo de países obtenido desde el archivo JSON de configuración.
   * @type {Catalogo[]}
   * @public
   */
  public paisCatalogo: Catalogo[] = realizar.pais;

  /**
   * Catálogo de estados/entidades federativas.
   * @type {Catalogo[]}
   * @public
   */
  public estadoCatalogo: Catalogo[] = realizar.estado;

  /**
   * Catálogo de municipios.
   * @type {Catalogo[]}
   * @public
   */
  public municipioCatalogo: Catalogo[] = realizar.municipio;

  /**
   * Catálogo de colonias.
   * @type {Catalogo[]}
   * @public
   */
  public coloniaCatalogo: Catalogo[] = realizar.colonia;

  /**
   * Configuración de plantas TIF importada desde archivo JSON.
   * @type {any[]}
   * @public
   */
  Plantatif = [Plantatif];

  /**
   * Formulario reactivo para capturar datos personales del destinatario.
   * @type {FormGroup}
   * @public
   */
  datosPersonales!: FormGroup;

  /**
   * Formulario reactivo para seleccionar el tipo de persona.
   * @type {FormGroup}
   * @public
   */
  tipoPersonaForm!: FormGroup;

  /**
   * Formulario reactivo para buscar terceros existentes.
   * @type {FormGroup}
   * @public
   */
  buscarTercerosForm!: FormGroup;

  /**
   * Controla la visibilidad del modal para agregar/editar terceros.
   * @type {boolean}
   * @default false
   */
  showtercerosModal = false;

  /**
   * Controla la visibilidad del modal de búsqueda de terceros.
   * @type {boolean}
   * @default false
   */
  showBuscarTercerosModal = false;

  /**
   * Controla la visibilidad de los campos para persona física.
   * @type {boolean}
   * @default false
   */
  showFisicaRow: boolean = false;

  /**
   * Controla la visibilidad de los campos para persona moral.
   * @type {boolean}
   * @default false
   */
  showMoralRow: boolean = false;

  /**
   * Controla la visibilidad de los campos para planta TIF.
   * @type {boolean}
   * @default false
   */
  showPlantaRow: boolean = false;

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   * @default false
   */
  esFormularioSoloLectura: boolean = false;

  /**
   * Nombre del establecimiento TIF seleccionado.
   * @type {string}
   * @default ''
   */
  nombreEstablecimientoTif: string = '';

  /**
   * Número del establecimiento TIF seleccionado.
   * @type {string}
   * @default ''
   */
  numeroEstablecimientoTif: string = '';

  /**
   * Array de exportadores seleccionados en la tabla.
   * @type {Exportador[]}
   * @default []
   */
  exportadorSeleccionado: Exportador[] = [];

  /**
   * Array de destinatarios seleccionados en la tabla.
   * @type {Destinatario[]}
   * @default []
   */
  destinatarioSeleccionado: Destinatario[] = [];

  /**
   * Indica si se está editando un destinatario existente.
   * @type {boolean}
   * @default false
   */
  isEditingDestinatario: boolean = false;

  /**
   * Índice del destinatario que se está editando.
   * @type {number}
   * @default -1
   */
  editingDestinatarioIndex: number = -1;

  /**
   * Controla la visibilidad de alertas para destinatarios.
   * @type {boolean}
   * @default false
   */
  public mostrarAlertaDestinatario: boolean = false;

  /**
   * Controla la visibilidad de confirmaciones para destinatarios.
   * @type {boolean}
   * @default false
   */
  public confirmacionAlertaDestinatario: boolean = false;

  /**
   * Configuración de notificación para destinatarios.
   * @type {Notificacion}
   * @public
   */
  public notificacionDestinatario!: Notificacion;

  /**
   * Subject para manejar la destrucción de subscripciones.
   * @type {Subject<void>}
   * @private
   */
  private destroyed$ = new Subject<void>();

  /**
   * Subject adicional para notificar destrucción de subscripciones.
   * @type {Subject<void>}
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Opciones disponibles para el tipo de persona.
   * @type {PreOperativo[]}
   * @default []
   */
  tipoPersonaOptions: PreOperativo[] = [];

  /**
   * Configuración para selección de checkbox en tablas.
   * @type {TablaSeleccion}
   * @public
   */
  public checkbox = TablaSeleccion.CHECKBOX;

  /**
   * Configuración de columnas para la tabla de exportadores.
   * @type {ConfiguracionColumna<Exportador>[]}
   * @public
   */
  configuracionTabla: ConfiguracionColumna<Exportador>[] = CONFIGURATION_TABLA_DATOS;

  /**
   * Array de destinatarios agregados.
   * @type {Destinatario[]}
   * @default []
   */
  destinatario: Destinatario[] = [];

  /**
   * Configuración de columnas para la tabla de destinatarios.
   * @type {ConfiguracionColumna<Destinatario>[]}
   * @public
   */
  configuracionTablaDatos: ConfiguracionColumna<Destinatario>[] = CONFIGURATION_TABLA_DESTINATARIO;

  /**
   * Estado actual de la solicitud del trámite.
   * @type {Solicitud221601State}
   * @public
   */
  public solicitudState!: Solicitud221601State;

  /**
   * Texto de mensaje para tabla obligatoria.
   * @type {string}
   * @public
   */
  TEXTOS: string = MENSAJE_TABLA_OBLIGATORIA;

  /**
   * Array de exportadores disponibles.
   * @type {Exportador[]}
   * @public
   */
  exportador: Exportador[] = realizar.exportador;

  /**
   * Estado del radio button para planta TIF.
   * @type {boolean}
   * @default false
   */
  public planta = false;

  /**
   * Estado del radio button para persona física.
   * @type {boolean}
   * @default false
   */
  public fisica = false;

  /**
   * Estado del radio button para persona moral.
   * @type {boolean}
   * @default false
   */
  public moral = false;

  /**
   * Controla la visibilidad del modal de confirmación de eliminación.
   * @type {boolean}
   * @default false
   */
  showDeleteConfirmModal = false;

  /**
   * Constructor del componente TercerosComponent.
   * Inicializa las dependencias y subscripciones necesarias.
   * 
   * @param {FormBuilder} fb - Constructor de formularios reactivos
   * @param {Tramite221601Store} tramite221601Store - Store para el estado del trámite
   * @param {Tramite221601Query} tramite221601Query - Query para consultas del trámite
   * @param {ConsultaioQuery} consultaioQuery - Query para consultas generales
   * @param {ChangeDetectorRef} cdr - Referencia al detector de cambios
   * @param {ValidacionesFormularioService} validacionesService - Servicio de validaciones
   * @param {ZoosanitarioService} service - Servicio específico del trámite zoosanitario
   */
  constructor(
    private fb: FormBuilder,
    private tramite221601Store: Tramite221601Store,
    private tramite221601Query: Tramite221601Query,
    private consultaioQuery: ConsultaioQuery,
    private readonly cdr: ChangeDetectorRef,
    private validacionesService: ValidacionesFormularioService,
    private service: ZoosanitarioService
  ) {
    // Subscripción para detectar cambios en el estado de solo lectura
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarCertificadoFormulario();
        })
      )
      .subscribe();
  }

  /**
   * Método del ciclo de vida OnInit.
   * Inicializa el componente y carga los datos necesarios.
   * 
   * @memberof TercerosComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.inicializarCertificadoFormulario();
    this.cargarRadio();
  }

  /**
   * Inicializa la configuración del formulario según el modo de operación.
   * Determina si debe estar en modo solo lectura o editable.
   * 
   * @memberof TercerosComponent
   * @returns {void}
   */
  inicializarCertificadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Validador estático para números de teléfono.
   * Verifica que el valor sea numérico y no exceda la longitud máxima.
   * 
   * @static
   * @param {AbstractControl} control - Control del formulario a validar
   * @returns {ValidationErrors | null} Errores de validación o null si es válido
   */
  private static phoneValidator(control: import('@angular/forms').AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }

    const VALUE = control.value.toString();
    const ISVALIDNUMBER = /^\d+$/.test(VALUE);

    if (!ISVALIDNUMBER) {
      return { pattern: true };
    }

    if (VALUE.length > 30) {
      return { maxlength: true };
    }

    return null;
  }

  /**
   * Inicializa todos los formularios reactivos del componente.
   * Configura validaciones, valores por defecto y subscripciones a cambios.
   * 
   * @memberof TercerosComponent
   * @returns {void}
   */
  inicializarFormulario(): void {
    // Subscripción al estado de la solicitud
    this.tramite221601Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    // Inicialización del formulario de tipo de persona
    this.tipoPersonaForm = this.fb.group({
      tipoPersona: [this.solicitudState?.tipoPersona || null, Validators.required],
    });

    // Inicialización del formulario de búsqueda
    this.buscarTercerosForm = this.fb.group({
      tipoPersonaBuscar: [null],
      nombre: [''],
      apellidoPaterno: [''],
      apellidoMaterno: [''],
      razonSocial: [''],
      correoElectronico: [''],
      pais: [this.paisCatalogo[0].id],
      entidadFederativa: ['']
    });

    // Inicialización del formulario de datos personales
    this.datosPersonales = this.fb.group({
      nombre: [this.solicitudState?.nombre || '', [Validators.maxLength(200)]],
      primerApellido: [this.solicitudState?.primerApellido || '', [Validators.maxLength(200)]],
      segundoApellido: [this.solicitudState?.segundoApellido || '', [Validators.maxLength(200)]],
      social: [this.solicitudState?.social || '', [Validators.maxLength(250)]],
      pais: [this.solicitudState?.pais || this.paisCatalogo[0].id, Validators.required],
      codigo: [this.solicitudState?.codigo || '', [Validators.minLength(5), Validators.maxLength(5)]],
      estado: [this.solicitudState?.estado || '', Validators.required],
      municipio: [this.solicitudState?.municipio || '', Validators.required],
      colonia: [this.solicitudState?.colonia || ''],
      calle: [this.solicitudState?.calle || '', [Validators.required, Validators.maxLength(100)]],
      exterior: [this.solicitudState?.exterior || '', [Validators.required, Validators.maxLength(55)]],
      interior: [this.solicitudState?.interior || '', [Validators.maxLength(55)]],
      lada: [this.solicitudState?.lada || '', [TercerosComponent.phoneValidator, Validators.maxLength(5)]],
      telefono: [this.solicitudState?.telefono || '', [TercerosComponent.phoneValidator, Validators.maxLength(30)]],
      correoElectronico: [this.solicitudState?.correoElectronico || '', [Validators.required, Validators.email]],
      tif: [this.solicitudState?.tif || ''],
    });

    // Subscripción a cambios en el tipo de persona
    this.tipoPersonaForm.get('tipoPersona')?.valueChanges.subscribe(value => {
      this.handleTipoPersonaChange(value);
      this.updateConditionalValidators(value);
      this.resetRadioStates();
      this.inputChecked(value);
    });

    this.resetRadioStates();
    this.updateStoreWithFormData();
  }

  /**
   * Abre el modal para agregar un nuevo tercero/destinatario.
   * Limpia los formularios y resetea los estados.
   * 
   * @memberof TercerosComponent
   * @returns {void}
   */
  tercerosAgregar(): void {
    this.isEditingDestinatario = false;
    this.editingDestinatarioIndex = -1;
    this.limpiarDatosFormulario();
    this.tipoPersonaForm.reset();
    this.resetRadioStates();
    this.showFisicaRow = false;
    this.showMoralRow = false;
    this.showPlantaRow = false;
    this.showtercerosModal = true;
  }

  /**
   * Inicia el proceso de eliminación de destinatarios seleccionados.
   * Valida que haya registros seleccionados antes de mostrar confirmación.
   * 
   * @memberof TercerosComponent
   * @returns {void}
   */
  eliminarDestinatario(): void {
    if (!this.destinatarioSeleccionado || this.destinatarioSeleccionado.length === 0) {
      this.mostrarNotificacionDestinatario(
        'Selecciona un registro.',
        false
      );
      return;
    }

    this.mostrarNotificacionDestinatario(
      '¿Estás seguro que deseas eliminar los registros marcados?',
      true
    );
  }

  /**
   * Muestra una notificación para operaciones con destinatarios.
   * 
   * @private
   * @param {string} mensaje - Mensaje a mostrar en la notificación
   * @param {boolean} [mostrarCancelar=false] - Si debe mostrar botón de cancelar
   * @returns {void}
   */
  private mostrarNotificacionDestinatario(mensaje: string, mostrarCancelar: boolean = false): void {
    this.notificacionDestinatario = {
      tipoNotificacion: 'alert',
      categoria: 'danger',
      modo: 'action',
      titulo: 'MENSAJE',
      mensaje: mensaje,
      cerrar: true,
      tiempoDeEspera: 2000,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: mostrarCancelar ? 'Cancelar' : '',
    };

    if (mostrarCancelar) {
      this.confirmacionAlertaDestinatario = true;
    } else {
      this.mostrarAlertaDestinatario = true;
    }
  }

  /**
   * Maneja la respuesta de confirmación para eliminar destinatarios.
   * 
   * @param {boolean} confirmar - Si el usuario confirmó la eliminación
   * @returns {void}
   */
  onConfirmacionDestinatario(confirmar: boolean): void {
    this.confirmacionAlertaDestinatario = false;

    if (confirmar) {
      this.realizarEliminacionDestinatario();
    }
  }

  /**
   * Cierra la alerta de destinatario.
   * 
   * @returns {void}
   */
  onAlertaDestinatario(): void {
    this.mostrarAlertaDestinatario = false;
  }

  /**
   * Ejecuta la eliminación real de los destinatarios seleccionados.
   * 
   * @private
   * @returns {void}
   */
  private realizarEliminacionDestinatario(): void {
    this.destinatario = this.destinatario.filter(record =>
      !this.destinatarioSeleccionado.includes(record)
    );

    this.destinatarioSeleccionado = [];
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    this.mostrarNotificacionDestinatario(
      'Datos eliminados correctamente.',
      false
    );
  }

  /**
   * Cancela la operación actual y cierra el modal de terceros.
   * Limpia todos los formularios y resetea estados.
   * 
   * @returns {void}
   */
  cancelarDestinatario(): void {
    this.isEditingDestinatario = false;
    this.editingDestinatarioIndex = -1;
    this.destinatarioSeleccionado = [];
    this.limpiarDatosFormulario();
    this.tipoPersonaForm.reset();
    this.resetRadioStates();
    this.showtercerosModal = false;
  }

  /**
   * Inicia el proceso de modificación de un destinatario seleccionado.
   * Valida la selección y carga los datos para edición.
   * 
   * @returns {void}
   */
  modificarDestinatario(): void {
    if (this.destinatarioSeleccionado.length === 0) {
      this.mostrarNotificacionDestinatario('Por favor selecciona un destinatario para modificar.');
      return;
    }

    const DESTINATARIO_A_MODIFICAR = this.destinatarioSeleccionado[0];
    this.editingDestinatarioIndex = this.destinatario.findIndex(dest =>
      dest.nombreDenominacionORazonSocial === DESTINATARIO_A_MODIFICAR.nombreDenominacionORazonSocial &&
      dest.correoElectronico === DESTINATARIO_A_MODIFICAR.correoElectronico &&
      dest.telefono === DESTINATARIO_A_MODIFICAR.telefono
    );

    if (this.editingDestinatarioIndex === -1) {
      this.mostrarNotificacionDestinatario('No se pudo encontrar el destinatario seleccionado.');
      return;
    }
    this.isEditingDestinatario = true;
    this.cargarDatosDestinatarioParaEdicion(DESTINATARIO_A_MODIFICAR);
    this.showtercerosModal = true;
  }

  /**
   * Carga los datos de un destinatario en el formulario para edición.
   * 
   * @private
   * @param {Destinatario} destinatario - Destinatario a editar
   * @returns {void}
   */
  private cargarDatosDestinatarioParaEdicion(destinatario: Destinatario): void {
    const TIPO_PERSONA = TercerosComponent.determinarTipoPersona(destinatario.nombreDenominacionORazonSocial);
    this.tipoPersonaForm.patchValue({
      tipoPersona: TIPO_PERSONA
    });

    this.inputChecked(TIPO_PERSONA);
    this.handleTipoPersonaChange(TIPO_PERSONA);

    const TELEFONO_PARTS = destinatario.telefono ? destinatario.telefono.split('-') : ['', ''];
    const LADA = TELEFONO_PARTS.length > 1 ? TELEFONO_PARTS[0] : '';
    const TELEFONO = TELEFONO_PARTS.length > 1 ? TELEFONO_PARTS[1] : TELEFONO_PARTS[0];

    const PAIS_ID = this.paisCatalogo.find((p: Catalogo) => p.descripcion === destinatario.pais)?.id || this.paisCatalogo[0].id;
    const ESTADO_ID = this.estadoCatalogo.find((e: Catalogo) => e.descripcion === destinatario.entidadFederativa)?.id || '';
    const MUNICIPIO_ID = this.municipioCatalogo.find((m: Catalogo) => m.descripcion === destinatario.municipioOAlcaldia)?.id || '';
    const COLONIA_ID = this.coloniaCatalogo.find((c: Catalogo) => c.descripcion === destinatario.colonia)?.id || '';

    if (TIPO_PERSONA === 'fisica') {
      const NOMBRES = TercerosComponent.parsearNombreCompleto(destinatario.nombreDenominacionORazonSocial);
      this.datosPersonales.patchValue({
        nombre: NOMBRES.nombre,
        primerApellido: NOMBRES.primerApellido,
        segundoApellido: NOMBRES.segundoApellido,
        social: '',
        pais: PAIS_ID,
        codigo: destinatario.codigoPostal,
        estado: ESTADO_ID,
        municipio: MUNICIPIO_ID,
        colonia: COLONIA_ID,
        calle: destinatario.calle,
        exterior: destinatario.numeroExterior,
        interior: destinatario.numeroInterior,
        lada: LADA,
        telefono: TELEFONO,
        correoElectronico: destinatario.correoElectronico,
        tif: ''
      });
    } else {
      this.datosPersonales.patchValue({
        nombre: '',
        primerApellido: '',
        segundoApellido: '',
        social: destinatario.nombreDenominacionORazonSocial,
        pais: PAIS_ID,
        codigo: destinatario.codigoPostal,
        estado: ESTADO_ID,
        municipio: MUNICIPIO_ID,
        colonia: COLONIA_ID,
        calle: destinatario.calle,
        exterior: destinatario.numeroExterior,
        interior: destinatario.numeroInterior,
        lada: LADA,
        telefono: TELEFONO,
        correoElectronico: destinatario.correoElectronico,
        tif: ''
      });
    }

    this.datosPersonales.markAsPristine();
    this.datosPersonales.markAsUntouched();
    this.tipoPersonaForm.markAsPristine();
    this.tipoPersonaForm.markAsUntouched();
  }

  /**
   * Determina el tipo de persona basándose en el nombre completo.
   * 
   * @static
   * @param {string} nombreCompleto - Nombre completo a analizar
   * @returns {string} Tipo de persona ('fisica' o 'moral')
   */
  private static determinarTipoPersona(nombreCompleto: string): string {
    const PALABRAS = nombreCompleto.trim().split(' ').filter(palabra => palabra.length > 0);
    return PALABRAS.length >= 2 ? 'fisica' : 'moral';
  }

  /**
   * Parsea un nombre completo en sus componentes individuales.
   * 
   * @static
   * @param {string} nombreCompleto - Nombre completo a parsear
   * @returns {Object} Objeto con nombre, primer apellido y segundo apellido
   */
  private static parsearNombreCompleto(nombreCompleto: string): { nombre: string, primerApellido: string, segundoApellido: string } {
    const PARTES = nombreCompleto.trim().split(' ').filter(parte => parte.length > 0);

    return {
      nombre: PARTES[0] || '',
      primerApellido: PARTES[1] || '',
      segundoApellido: PARTES.slice(2).join(' ') || ''
    };
  }

  /**
   * Guarda un destinatario nuevo o modifica uno existente.
   * Valida todos los campos antes de procesar.
   * 
   * @returns {void}
   */
  guardarDestinatario(): void {
    if (!this.tipoPersonaForm.get('tipoPersona')?.value) {
      this.mostrarNotificacionDestinatario('Por favor selecciona el tipo de persona.');
      return;
    }
    const TIPO_PERSONA = this.tipoPersonaForm.get('tipoPersona')?.value;
    this.updateConditionalValidators(TIPO_PERSONA);
    setTimeout(() => {
      Object.keys(this.datosPersonales.controls).forEach(key => {
        const CONTROL = this.datosPersonales.get(key);
        if (CONTROL?.invalid) {
          CONTROL.markAsTouched();
        }
      });

      if (this.tipoPersonaForm.invalid || this.datosPersonales.invalid) {
        this.tipoPersonaForm.markAllAsTouched();
        this.datosPersonales.markAllAsTouched();
        this.mostrarNotificacionDestinatario('Por favor completa todos los campos requeridos correctamente.');
        return;
      }

      this.procesarGuardadoDestinatario();
    }, 100);
  }

  /**
   * Procesa el guardado del destinatario después de las validaciones.
   * Construye el objeto destinatario y lo agrega o actualiza en la lista.
   * 
   * @private
   * @returns {void}
   */
  private procesarGuardadoDestinatario(): void {
    const FORM_VALUE = this.datosPersonales.value;
    const TIPO_PERSONA = this.tipoPersonaForm.get('tipoPersona')?.value;
    const PAIS_SELECCIONADO = this.paisCatalogo.find((item: Catalogo) => item.id === Number(FORM_VALUE.pais));
    const ESTADO_SELECCIONADO = this.estadoCatalogo.find((item: Catalogo) => item.id === Number(FORM_VALUE.estado));
    const MUNICIPIO_SELECCIONADO = this.municipioCatalogo.find((item: Catalogo) => item.id === Number(FORM_VALUE.municipio));
    const COLONIA_SELECCIONADA = this.coloniaCatalogo.find((item: Catalogo) => item.id === Number(FORM_VALUE.colonia));
    const NOMBRE_COMPLETO = TercerosComponent.obtenerNombreCompleto(FORM_VALUE, TIPO_PERSONA);
    const DOMICILIO_COMPLETO = TercerosComponent.obtenerDomicilioCompleto(FORM_VALUE, COLONIA_SELECCIONADA, MUNICIPIO_SELECCIONADO, ESTADO_SELECCIONADO);
    
    const DESTINATARIO_DATA: Destinatario = {
      nombreDenominacionORazonSocial: NOMBRE_COMPLETO,
      telefono: FORM_VALUE.lada && FORM_VALUE.telefono ? `${FORM_VALUE.lada}-${FORM_VALUE.telefono}` : (FORM_VALUE.telefono || ''),
      correoElectronico: FORM_VALUE.correoElectronico || '',
      domicilio: DOMICILIO_COMPLETO,
      calle: FORM_VALUE.calle || '',
      numeroExterior: FORM_VALUE.exterior || '',
      numeroInterior: FORM_VALUE.interior || '',
      pais: PAIS_SELECCIONADO?.descripcion || '',
      colonia: COLONIA_SELECCIONADA?.descripcion || '',
      municipioOAlcaldia: MUNICIPIO_SELECCIONADO?.descripcion || '',
      entidadFederativa: ESTADO_SELECCIONADO?.descripcion || '',
      codigoPostal: FORM_VALUE.codigo || ''
    };

    if (this.isEditingDestinatario && this.editingDestinatarioIndex !== -1) {
      const NUEVO_ARRAY = [...this.destinatario];
      NUEVO_ARRAY[this.editingDestinatarioIndex] = DESTINATARIO_DATA;
      this.destinatario = NUEVO_ARRAY;
    } else {
      this.destinatario = [...this.destinatario, DESTINATARIO_DATA];
    }
    
    this.isEditingDestinatario = false;
    this.editingDestinatarioIndex = -1;
    this.destinatarioSeleccionado = [];

    this.limpiarDatosFormulario();
    this.tipoPersonaForm.reset();
    this.resetRadioStates();
    this.showtercerosModal = false;

    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  /**
   * Actualiza las validaciones condicionales según el tipo de persona seleccionado.
   * 
   * @private
   * @param {string} tipoPersona - Tipo de persona ('fisica', 'moral', 'planta')
   * @returns {void}
   */
  private updateConditionalValidators(tipoPersona: string): void {
    const NOMBRECONTROL = this.datosPersonales.get('nombre');
    const PRIMERAPELLIDOCONTROL = this.datosPersonales.get('primerApellido');
    const SOCIALCONTROL = this.datosPersonales.get('social');
    const CALLECONTROL = this.datosPersonales.get('calle');
    const EXTERIORCONTROL = this.datosPersonales.get('exterior');
    const CORREOCONTROL = this.datosPersonales.get('correoElectronico');
    const ESTADOCONTROL = this.datosPersonales.get('estado');
    const PAISCONTROL = this.datosPersonales.get('pais');
    const MUNICIPIOCONTROL = this.datosPersonales.get('municipio');

    // Limpiar validadores existentes
    NOMBRECONTROL?.clearValidators();
    PRIMERAPELLIDOCONTROL?.clearValidators();
    SOCIALCONTROL?.clearValidators();
    CALLECONTROL?.clearValidators();
    EXTERIORCONTROL?.clearValidators();
    CORREOCONTROL?.clearValidators();
    ESTADOCONTROL?.clearValidators();
    PAISCONTROL?.clearValidators();
    MUNICIPIOCONTROL?.clearValidators();

    // Aplicar validadores según tipo de persona
    if (tipoPersona === 'fisica') {
      NOMBRECONTROL?.setValidators([Validators.required, Validators.maxLength(200)]);
      PRIMERAPELLIDOCONTROL?.setValidators([Validators.required, Validators.maxLength(200)]);
      SOCIALCONTROL?.setValidators([Validators.maxLength(250)]);
    } else if (tipoPersona === 'moral' || tipoPersona === 'planta') {
      SOCIALCONTROL?.setValidators([Validators.required, Validators.maxLength(250)]);
      NOMBRECONTROL?.setValidators([Validators.maxLength(200)]);
      PRIMERAPELLIDOCONTROL?.setValidators([Validators.maxLength(200)]);
    }

    // Validadores comunes
    CALLECONTROL?.setValidators([Validators.required, Validators.maxLength(100)]);
    EXTERIORCONTROL?.setValidators([Validators.required, Validators.maxLength(55)]);
    CORREOCONTROL?.setValidators([Validators.required, Validators.email]);
    ESTADOCONTROL?.setValidators([Validators.required]);
    PAISCONTROL?.setValidators([Validators.required]);
    MUNICIPIOCONTROL?.setValidators([Validators.required]);

    // Actualizar validez de todos los controles
    NOMBRECONTROL?.updateValueAndValidity();
    PRIMERAPELLIDOCONTROL?.updateValueAndValidity();
    SOCIALCONTROL?.updateValueAndValidity();
    CALLECONTROL?.updateValueAndValidity();
    EXTERIORCONTROL?.updateValueAndValidity();
    CORREOCONTROL?.updateValueAndValidity();
    ESTADOCONTROL?.updateValueAndValidity();
    PAISCONTROL?.updateValueAndValidity();
    MUNICIPIOCONTROL?.updateValueAndValidity();
  }

  /**
   * Resetea todos los estados de los radio buttons.
   * 
   * @private
   * @returns {void}
   */
  private resetRadioStates(): void {
    this.fisica = false;
    this.moral = false;
    this.planta = false;
  }

  /**
   * Guarda los datos del formulario y configura el modo de solo lectura si es necesario.
   * 
   * @returns {void}
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.tipoPersonaForm.disable();
      this.datosPersonales.disable();
    } else {
      this.tipoPersonaForm.enable();
      this.datosPersonales.enable();
    }
  }

  /**
   * Actualiza el store con los datos del formulario.
   * 
   * @returns {void}
   */
  updateStoreWithFormData(): void {
    const UPDATE_PERSONALES_FORM: Solicitud221601State = {
      ...this.solicitudState,
      pais: this.datosPersonales.get('pais')?.value,
    };
    this.tramite221601Store.update(UPDATE_PERSONALES_FORM);
  }

  /**
   * Maneja los cambios en el tipo de persona seleccionado.
   * Muestra/oculta las secciones correspondientes del formulario.
   * 
   * @param {string} tipoPersona - Tipo de persona seleccionado
   * @returns {void}
   */
  handleTipoPersonaChange(tipoPersona: string): void {
    this.showFisicaRow = false;
    this.showMoralRow = false;
    this.showPlantaRow = false;

    if (tipoPersona === 'fisica') {
      this.showFisicaRow = true;
      this.datosPersonales.enable();
    } else if (tipoPersona === 'moral') {
      this.showMoralRow = true;
      this.datosPersonales.enable();
    } else if (tipoPersona === 'planta') {
      this.showPlantaRow = true;
      this.showMoralRow = true;
      this.datosPersonales.disable();
    }
  }

  /**
   * Establece valores en el store del trámite.
   * 
   * @param {FormGroup} form - Formulario origen
   * @param {string} campo - Campo específico
   * @param {keyof Tramite221601Store} metodoNombre - Método del store a ejecutar
   * @returns {void}
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite221601Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite221601Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
   * Maneja la selección de exportadores en la tabla.
   * 
   * @param {Exportador[]} filas - Exportadores seleccionados
   * @returns {void}
   */
  onExportadorSeleccionado(filas: Exportador[]): void {
    this.exportadorSeleccionado = filas;
  }

  /**
   * Maneja la selección de destinatarios en la tabla.
   * 
   * @param {Destinatario[]} filas - Destinatarios seleccionados
   * @returns {void}
   */
  onDestinatarioSeleccionado(filas: Destinatario[]): void {
    this.destinatarioSeleccionado = [...filas];
    this.cdr.detectChanges();
  }

  /**
   * Maneja la selección de radio buttons para tipo de persona.
   * 
   * @public
   * @param {string} checkBoxName - Nombre del radio button seleccionado
   * @returns {void}
   */
  public inputChecked(checkBoxName: string): void {
    this.resetRadioStates();
    if (checkBoxName === 'fisica') {
      this.fisica = true;
    } else if (checkBoxName === 'moral') {
      this.moral = true;
    } else if (checkBoxName === 'planta') {
      this.planta = true;
    }

    this.tipoPersonaForm.get('tipoPersona')?.setValue(checkBoxName, { emitEvent: false });
    this.updateConditionalValidators(checkBoxName);
    this.handleTipoPersonaChange(checkBoxName);
  }

  /**
   * Cambia el radio button de persona física.
   * 
   * @param {string | number} value - Valor seleccionado
   * @returns {void}
   */
  cambiarRadioFisica(value: string | number): void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO);
    this.handleTipoPersonaChange(VALOR_SELECCIONADO);
  }

  /**
   * Cancela la operación de eliminación.
   * 
   * @returns {void}
   */
  cancelarEliminacion(): void {
    this.showDeleteConfirmModal = false;
  }

  /**
   * Limpia los campos de búsqueda TIF.
   * 
   * @returns {void}
   */
  limpiarBusquedaTif(): void {
    this.nombreEstablecimientoTif = '';
    this.numeroEstablecimientoTif = '';
  }

  /**
   * Abre el modal de búsqueda de terceros y resetea el formulario.
   * 
   * @returns {void}
   */
  abrirBuscarTercerosModal(): void {
    this.showBuscarTercerosModal = true;
    this.buscarTercerosForm.reset({
      tipoPersonaBuscar: null,
      pais: this.paisCatalogo[0].id,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      razonSocial: '',
      correoElectronico: '',
      entidadFederativa: ''
    });
  }

  /**
   * Cierra el modal de búsqueda de terceros.
   * 
   * @returns {void}
   */
  cerrarBuscarTercerosModal(): void {
    this.showBuscarTercerosModal = false;
  }

  /**
   * Limpia el formulario de búsqueda de terceros.
   * 
   * @returns {void}
   */
  limpiarBuscarTerceros(): void {
    this.buscarTercerosForm.reset({
      tipoPersonaBuscar: null,
      pais: this.paisCatalogo[0].id,
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      razonSocial: '',
      correoElectronico: '',
      entidadFederativa: ''
    });
  }

  /**
   * Carga las opciones de radio buttons desde el servicio.
   * 
   * @returns {void}
   */
  cargarRadio(): void {
    this.service.obtenerRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });
  }

  /**
   * Maneja la entrada de solo números en campos específicos.
   * 
   * @param {Event} event - Evento de input
   * @returns {void}
   */
  onNumericInput(event: Event): void {
    const INPUT = event.target as HTMLInputElement;
    const VALUE = INPUT.value;
    const NUMERICVALUE = VALUE.replace(/[^0-9]/g, '');

    if (VALUE !== NUMERICVALUE) {
      INPUT.value = NUMERICVALUE;
      const CONTROLNAME = INPUT.getAttribute('formControlName');
      if (CONTROLNAME) {
        this.datosPersonales.get(CONTROLNAME)?.setValue(NUMERICVALUE);
        this.datosPersonales.get(CONTROLNAME)?.markAsTouched();
        this.datosPersonales.get(CONTROLNAME)?.updateValueAndValidity();
      }
    }
  }

  /**
   * Método del ciclo de vida OnDestroy.
   * Completa todas las subscripciones para evitar memory leaks.
   * 
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Limpia todos los campos del formulario de datos personales.
   * 
   * @returns {void}
   */
  limpiarDatosFormulario(): void {
    this.datosPersonales.reset({
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      social: '',
      pais: this.paisCatalogo[0].id,
      codigo: '',
      estado: '',
      municipio: '',
      colonia: '',
      calle: '',
      exterior: '',
      interior: '',
      lada: '',
      telefono: '',
      correoElectronico: '',
      tif: ''
    });

    this.datosPersonales.markAsUntouched();
    this.datosPersonales.markAsPristine();
  }

  /**
   * Obtiene el nombre completo basándose en el tipo de persona.
   * 
   * @static
   * @private
   * @param {Object} formValue - Valores del formulario
   * @param {string} tipoPersona - Tipo de persona
   * @returns {string} Nombre completo formateado
   */
  private static obtenerNombreCompleto(
    formValue: {
      nombre?: string;
      primerApellido?: string;
      segundoApellido?: string;
      social?: string;
    },
    tipoPersona: string
  ): string {
    if (tipoPersona === 'fisica') {
      const NOMBRE = formValue.nombre || '';
      const PRIMER_APELLIDO = formValue.primerApellido || '';
      const SEGUNDO_APELLIDO = formValue.segundoApellido || '';

      return `${NOMBRE} ${PRIMER_APELLIDO} ${SEGUNDO_APELLIDO}`.trim();
    }
    return formValue.social || '';
  }

  /**
   * Construye el domicilio completo concatenando todos los componentes.
   * 
   * @static
   * @private
   * @param {Object} formValue - Valores del formulario de dirección
   * @param {Catalogo | undefined} colonia - Colonia seleccionada
   * @param {Catalogo | undefined} municipio - Municipio seleccionado
   * @param {Catalogo | undefined} estado - Estado seleccionado
   * @returns {string} Domicilio completo formateado
   */
  private static obtenerDomicilioCompleto(
    formValue: {
      calle?: string;
      exterior?: string;
      interior?: string;
      codigo?: string;
    },
    colonia: Catalogo | undefined,
    municipio: Catalogo | undefined,
    estado: Catalogo | undefined
  ): string {
    const PARTES_DOMICILIO = [
      formValue.calle,
      formValue.exterior ? `#${formValue.exterior}` : '',
      formValue.interior ? `Int. ${formValue.interior}` : '',
      colonia?.descripcion,
      municipio?.descripcion,
      estado?.descripcion,
      formValue.codigo
    ].filter(parte => parte && parte.trim() !== '');

    return PARTES_DOMICILIO.join(', ');
  }
}