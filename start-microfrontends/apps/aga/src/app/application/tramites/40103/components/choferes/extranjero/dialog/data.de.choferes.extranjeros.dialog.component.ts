import { CommonModule } from "@angular/common";

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { CatalogoSelectComponent, SharedModule, TituloComponent } from "@libs/shared/data-access-user/src";
import { REGEX_POSTAL, REGEX_SIN_DIGITOS, REGEX_SOLO_DIGITOS } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';
import { Chofer40103Service } from "../../../../estados/chofer40103.service";
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';

import { Catalogo, CategoriaMensaje, Notificacion, NotificacionesComponent, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { Subject, firstValueFrom, takeUntil } from "rxjs";
import { NotificacionesService } from "@libs/shared/data-access-user/src/core/services/shared/notificaciones.service";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { modificarTerrestreService } from "../../../services/modificacar-terrestre.service";

/**
 * Componente para la gestión del diálogo de datos de choferes extranjeros en el trámite 40103.
 *
 * Este archivo contiene la definición del componente, sus propiedades, eventos y métodos principales
 * para la captura, edición y validación de datos de choferes extranjeros, así como la gestión de catálogos
 * y la interacción con servicios relacionados.
 *
 * - Permite la visualización y edición de datos de choferes extranjeros.
 * - Gestiona formularios reactivos y validaciones.
 * - Administra la apertura y cierre de modales.
 * - Emite eventos para agregar o cancelar la edición de choferes.
 * - Interactúa con servicios para obtener catálogos de países, estados, municipios y colonias.
 *
 * @component
 * @example
 * <app-choferes-datos-extranjeros-dialog
 *   [readonly]="true"
 *   [datosDeChofere]="chofer"
 *   (eventoAgregarModal)="onAgregar($event)"
 *   (cancelarEvent)="onCancelar()"
 * ></app-choferes-datos-extranjeros-dialog>
 */

/**
 * Interfaz para la respuesta de la API de búsqueda de chofer extranjero.
 * Define la estructura esperada de los datos del chofer, permitiendo
 * que las propiedades sean opcionales o nulas para manejar respuestas de API inconsistentes.
 */
interface ChoferExtranjeroApiResponse {
  nombre?: string | null;
  primer_apellido?: string | null;
  segundo_apellido?: string | null;
  nacionalidad?: string | null;
  numero_de_gafete?: string | null;
  vigencia_del_gafete?: string | null;
  nss?: string | null;
  numero_identificacion_fiscal?: string | null;
  correoElectronico?: string | null;
  telefono?: string | null;
  domicilio?: {
    pais?: string | null;
    codigo_postal?: string | null;
    estado?: string | null;
    calle?: string | null;
    numero_exterior?: string | null;
    numero_interior?: string | null;
    pais_de_residencia?: string | null;
    ciudad?: string | null;
      correo_electronico?: string | null;
  telefono?: string | null;
  } | null;
}

@Component({
  selector: 'app-choferes-datos-extranjeros-dialog',
  templateUrl: './data.de.choferes.extranjeros.dialog.component.html',
  styleUrls: ['./data.de.choferes.extranjeros.dialog.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    FormsModule,
    CatalogoSelectComponent,
    TituloComponent,
    NotificacionesComponent,
    TooltipModule
  ],
})
export class DatosDeChoferesExtranjerosDialogComponent implements OnInit, OnDestroy {
  /**
   * Marcar para mostrar un error de solo dígitos cuando el usuario escribe caracteres que no son dígitos.
   */
  showDigitsOnlyError: boolean = false;

  /**
   * Indica si el formulario ha sido enviado.
   * @type {boolean}
   */
  enviado: boolean = false;

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  @Input() readonly: boolean = false;

  /**
   * Contexto en el que se utiliza el diálogo (alta, modificación o retirada).
   * @type {('alta' | 'modificacion' | 'retirada')}
   */
  @Input() contexto: 'alta' | 'modificacion' | 'retirada' = 'alta';

  /**
   * Datos del chofer nacional que se mostrarán o editarán en el formulario.
   * @type {ChoferesExtranjeros}
   */
  @Input({ required: true }) datosDeChofere!: ChoferesExtranjeros;

  /**
   * Formulario reactivo para los datos del chofer.
   * @type {FormGroup}
   */
  formChoferes!: FormGroup;

  /**
   * Permite solo dígitos en el campo numeroDelSeguroSocial.
   */
  enInputSoloDigitos(event: Event): void {
    const ENTRADA = event.target as HTMLInputElement;
    const VALOR_ORIGINAL = ENTRADA.value;
    const SOLO_DIGITOS = VALOR_ORIGINAL.replace(REGEX_SIN_DIGITOS, '');
    this.showDigitsOnlyError = VALOR_ORIGINAL !== SOLO_DIGITOS;
    ENTRADA.value = SOLO_DIGITOS;
    this.formChoferes.get('numeroDelSeguroSocial')?.setValue(SOLO_DIGITOS, { emitEvent: false });
    if (!this.showDigitsOnlyError) {
      setTimeout(() => { this.showDigitsOnlyError = false; }, 1000);
    }
  }

  /**
   * Sujeto utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   * @type {Subject<unknown>}
   */
  destroyed$: Subject<unknown> = new Subject<unknown>();

  /**
   * Indica si se debe mostrar la notificación.
   * @type {boolean}
   */
  showNotification: boolean = false;

  /**
   * Lista de países disponibles.
   * @type {Catalogo[]}
   */
  paisList: Catalogo[] = [];

  /**
   * Lista de estados disponibles.
   * @type {Catalogo[]}
   */
  estadoList: Catalogo[] = [];

  /**
   * Lista de municipios o alcaldías disponibles.
   * @type {Catalogo[]}
   */
  municipioList: Catalogo[] = [];

  /**
   * Lista de colonias disponibles.
   * @type {Catalogo[]}
   */
  coloniaList: Catalogo[] = [];

  /**
   * Evento emitido al cancelar el modal.
   * @type {EventEmitter<void>}
   */
  @Output() cancelarEvent = new EventEmitter<void>();

  /**
   * Evento emitido al agregar o editar un chofer extranjero.
   * @type {EventEmitter<ChoferesExtranjeros>}
   */
  @Output() eventoAgregarModal = new EventEmitter<ChoferesExtranjeros>();

  /**
   * Alerta de notificación para mostrar mensajes al usuario.
   * @type {Notificacion | undefined}
   */
  public alertaNotificacion!: Notificacion | undefined;

  // ======================= MÉTODOS =======================

  /**
   * Constructor de la clase.
   * 
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param chofer40103Service Servicio específico para operaciones relacionadas con choferes en el trámite 40103.
   */
  constructor(private fb: FormBuilder,
    private chofer40103Service: Chofer40103Service,
    private modificarTerrestreService: modificarTerrestreService,
    private NOTIF: NotificacionesService
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga las listas de catálogos necesarias.
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    this.formChoferes = this.fb.group({
      numero: [{ value: this.datosDeChofere?.numero, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(10)]],
      primerApellido: [{ value: this.datosDeChofere?.primerApellido, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(50)]],
      segundoApellido: [{ value: this.datosDeChofere?.segundoApellido, disabled: this.readonly }],

      // Campos con validadores según readonly
      nacionalidad: [{ value: this.datosDeChofere?.nacionalidad, disabled: this.readonly }, this.readonly ? [] : [Validators.required]], 
      numeroDeGafete: [{ value: this.datosDeChofere?.numeroDeGafete, disabled: true }],
      vigenciaGafete: [{ value: this.datosDeChofere?.vigenciaGafete, disabled: true }],

      numeroDelSeguroSocial: [{ value: this.datosDeChofere?.numeroDelSeguroSocial, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(11), Validators.pattern(REGEX_SOLO_DIGITOS)]],
      numberDeIdeFiscal: [{ value: this.datosDeChofere?.numberDeIdeFiscal, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(13)]],

      // Campos con validadores según readonly
      pais: [{ value: this.datosDeChofere?.pais, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      codigoPostal: [{ value: this.datosDeChofere?.codigoPostal, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(5), Validators.pattern(REGEX_POSTAL)]],
      estado: [{ value: this.datosDeChofere?.estado, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],

      calle: [{ value: this.datosDeChofere?.calle, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(100)]],
      numeroExterior: [{ value: this.datosDeChofere?.numeroExterior, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(10)]],
      numeroInterior: [{ value: this.datosDeChofere?.numeroInterior, disabled: this.readonly }, this.readonly ? [] : [Validators.maxLength(10)]],

      paisDeResidencia: [{ value: this.datosDeChofere?.paisDeResidencia, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      ciudad: [{ value: this.datosDeChofere?.ciudad, disabled: this.readonly }, this.readonly ? [] : [Validators.required, Validators.maxLength(50)]],

      correoElectronico: [{ value: this.datosDeChofere?.correoElectronico, disabled: this.readonly }, this.readonly ? [] : [ Validators.email]],
      telefono: [{ value: this.datosDeChofere?.telefono, disabled: this.readonly }, this.readonly ? [] : [Validators.pattern(REGEX_SOLO_DIGITOS)]],
    });

    await this.obtenerListaPaises();
    await this.actualizarListasDatos(this.datosDeChofere);

  }


  /**
   * Obtiene la lista de países emisores desde el servicio `chofer40103Service` y la asigna a la propiedad `paisList`.
   *
   * @returns {Promise<void>}
   */
  async obtenerListaPaises(): Promise<void> {
    try {
      const DATOS = await firstValueFrom(
        this.chofer40103Service
          .getPaisEmisor()
          .pipe(takeUntil(this.destroyed$))
      );
      this.paisList = DATOS || [];
      if (this.paisList.length > 0) {
        this.alCambiarPais(this.paisList[0]);
      }
    } catch (error) {
      // Manejo de errores si es necesario
    }
  }

  /**
   * Maneja el cambio de país seleccionado, actualizando la lista de estados y reiniciando los campos dependientes.
   * @param value País seleccionado.
   * @returns {void}
   */
  alCambiarPais(value: Catalogo): void {
    this.obtenerEstadosPorPais(value);
    // Solo reiniciar controles que existan realmente en el formulario
    if (this.formChoferes.controls['estado']) {
      this.formChoferes.controls['estado'].reset();
    }
  }

  /**
   * Obtiene la lista de estados por país desde el servicio.
   * @param value País seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async obtenerEstadosPorPais(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATOS = await firstValueFrom(
        this.chofer40103Service
          .getEstadosPorPais(value.clave as string)
          .pipe(takeUntil(this.destroyed$))
      );
      this.estadoList = DATOS || [];
    } catch (error) {
      // Manejo de errores si es necesario
    }
    return this.estadoList;
  }

  /**
   * Maneja el cambio de estado seleccionado, actualizando la lista de municipios y reseteando los campos dependientes.
   * @param value Estado seleccionado.
   * @returns {void}
   */
  onEstadoChange(value: Catalogo): void {
    this.fetchMunicipiosByEstado(value);
    // Nota: los controles municipioAlcaldia y colonia no existen en el formulario actual
    // Restablecer solo si se agregan al formulario en el futuro
  }

  /**
   * Obtiene la lista de municipios por estado desde el servicio.
   * @param value Estado seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchMunicipiosByEstado(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATOS = await firstValueFrom(
        this.chofer40103Service
          .getMunicipiosPorEstado(value.clave as string)
          .pipe(takeUntil(this.destroyed$))
      );
      this.municipioList = DATOS || [];
    } catch (error) {
      // Manejo de errores si es necesario
    }
    return this.municipioList;

  }

  /**
   * Obtiene la lista de colonias por municipio desde el servicio.
   * @param value Municipio seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchColoniasByMunicipio(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATOS = await firstValueFrom(
        this.chofer40103Service
          .getColoniasPorMunicipio(value.clave as string)
          .pipe(takeUntil(this.destroyed$))
      );
      this.coloniaList = DATOS || [];
    } catch (error) {
      // Manejo de errores si es necesario
    }
    return this.coloniaList;
  }

  /**
   * Obtiene los controles de formulario del formulario choferes.
   */
  get getFormValues(): { [key: string]: AbstractControl } {
    return this.formChoferes.controls;
  }

  /**
   * Cierra el modal de choferes y emite el evento de cancelación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.alertaNotificacion = undefined;
    this.showDigitsOnlyError = false;
    this.showNotification = false;
    
    if (this.formChoferes) {
      this.formChoferes.markAsUntouched();
      this.formChoferes.markAsPristine();
    }
    
    this.cancelarEvent.emit();
  }

  /**
   * Restablece el formulario de choferes a sus valores predeterminados.
   * 
   * Este método reinicia todos los campos del formulario `formChoferes` con valores vacíos o por defecto,
   * permitiendo limpiar el formulario para una nueva entrada de datos.
   */
  restablecerFormulario(): void {
    this.formChoferes.reset({
      numero: '',
      primerApellido: '',
      segundoApellido: '',
      nacionalidad: '',
      numeroDeGafete: '',
      vigenciaGafete: '',
      numeroDelSeguroSocial: '',
      numberDeIdeFiscal: '',
      pais: '',
      codigoPostal: '',
      estado: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      paisDeResidencia: '',
      ciudad: '',
      correoElectronico: '',
      telefono: ''
    });
    
    this.showDigitsOnlyError = false;
    
    this.formChoferes.markAsPristine();
    this.formChoferes.markAsUntouched();
  }


  /**
   * Busca información de un chofer extranjero utilizando su número y actualiza el formulario.
   * @returns {Promise<void>}
   */
  async buscarChoferExtranjero(): Promise<void> {
    const NUMERO_DEL_SEGURO_SOCIAL = this.formChoferes.get('numeroDelSeguroSocial')?.value;

    if (!NUMERO_DEL_SEGURO_SOCIAL) {
      this.mostrarAlerta('Favor de ingresar número de seguro social.');
      return;
    }

    const IS_EXISTENCE = this.contexto === 'modificacion' || this.contexto === 'retirada';
    const DATOS_API = await this.realizarBusquedaChofer(NUMERO_DEL_SEGURO_SOCIAL, IS_EXISTENCE);

    if (DATOS_API) {
      const DATOS_CHOFER = this.mapearDatosChofer(DATOS_API);
      this.formChoferes.patchValue(DATOS_CHOFER);
    }
  }

  private async realizarBusquedaChofer(nss: string, isExistence: boolean): Promise<ChoferExtranjeroApiResponse | null> {
    try {
      const RESPONSE = await firstValueFrom(
        this.modificarTerrestreService.buscarChoferExtranjero(nss, isExistence).pipe(takeUntil(this.destroyed$))
      );

      if (RESPONSE.codigo !== '00') {
        this.NOTIF.showNotification({
          tipoNotificacion: 'toastr',
          categoria: 'danger',
          mensaje: RESPONSE.mensaje ? RESPONSE.mensaje : '',
          titulo: 'Error',
          modo: '',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: 'Cancelar',
        });
        return null;
      }
      return RESPONSE.datos;
    } catch (error) {
      this.mostrarAlerta('Error al buscar la información del chofer.', 'Error');
      return null;
    }
  }

  // eslint-disable-next-line class-methods-use-this, complexity
  private mapearDatosChofer(DATOS_API: ChoferExtranjeroApiResponse): Partial<ChoferesExtranjeros> {
    const DATOS_CHOFER: Partial<ChoferesExtranjeros> = {
      numero: DATOS_API.nombre ?? '',
      primerApellido: DATOS_API.primer_apellido ?? '',
      segundoApellido: DATOS_API.segundo_apellido ?? '',
      nacionalidad: DATOS_API.nacionalidad ?? '',
      numeroDeGafete: DATOS_API.numero_de_gafete ?? '',
      vigenciaGafete: DATOS_API.vigencia_del_gafete ?? '',
      numeroDelSeguroSocial: DATOS_API.nss ?? '',
      numberDeIdeFiscal: DATOS_API.numero_identificacion_fiscal ?? '',

    };
    if (DATOS_API.domicilio) {
      Object.assign(DATOS_CHOFER, {
        pais: DATOS_API.domicilio.pais ?? null,
        codigoPostal: DATOS_API.domicilio.codigo_postal ?? null,
        estado: DATOS_API.domicilio.estado ?? null,
        calle: DATOS_API.domicilio.calle ?? null,
        numeroExterior: DATOS_API.domicilio.numero_exterior ?? null,
        numeroInterior: DATOS_API.domicilio.numero_interior ?? null,
        paisDeResidencia: DATOS_API.domicilio.pais_de_residencia ?? null,
        ciudad: DATOS_API.domicilio.ciudad ?? null,
        correoElectronico: DATOS_API.domicilio.correo_electronico ?? null,
        telefono: DATOS_API.domicilio.telefono ?? null,
        
      });
    }
    return DATOS_CHOFER;
  }

  private mostrarAlerta(mensaje: string, titulo: string = 'Alert'): void {
    this.alertaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.INFORMACION,
      modo: 'action',
      titulo,
      mensaje,
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.showNotification = true;
  }

  /**
   * Actualiza las listas de estados, municipios y colonias según los datos del chofer.
   * @param data Datos del chofer extranjero.
   * @returns {Promise<void>}
   */
  private async actualizarListasDatos(data: ChoferesExtranjeros): Promise<void> {
    if (!data || this.paisList.length === 0) {
      return;
    }

    const PAISES_ENCONTRADOS = this.paisList.find((p: Catalogo) => p.descripcion === data.pais);
    if (PAISES_ENCONTRADOS) {
      data.pais = PAISES_ENCONTRADOS.id.toString();
      
      await this.obtenerEstadosPorPais(PAISES_ENCONTRADOS);
    }

    if (data.estado && this.estadoList.length > 0) {
      const ESTADO_ENCONTRADO = this.estadoList.find((e: Catalogo) => e.descripcion === data.estado);
      if (ESTADO_ENCONTRADO) {
        data.estado = ESTADO_ENCONTRADO.id.toString();
      }
    }

    if (data.paisDeResidencia) {
      const PAIS_RESIDENCIA_ENCONTRADO = this.paisList.find((p: Catalogo) => p.descripcion === data.paisDeResidencia);
      if (PAIS_RESIDENCIA_ENCONTRADO) {
        data.paisDeResidencia = PAIS_RESIDENCIA_ENCONTRADO.id.toString();
      }
    }

    if (data.nacionalidad) {
      const NACIONALIDAD_ENCONTRADA = this.paisList.find((p: Catalogo) => p.descripcion === data.nacionalidad);
      if (NACIONALIDAD_ENCONTRADA) {
        data.nacionalidad = NACIONALIDAD_ENCONTRADA.id.toString();
      }
    }

    this.formChoferes.patchValue({
      pais: data.pais,
      estado: data.estado,
      paisDeResidencia: data.paisDeResidencia,
      nacionalidad: data.nacionalidad
    });
  }

  /**
   * Limpia todos los campos del formulario de choferes.
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.formChoferes.reset();
  }

  /**
   * Guarda los datos editados del chofer extranjero si el formulario es válido, emite el evento y cierra el modal.
   * Si el formulario es inválido, muestra una notificación de alerta.
   * @returns {void}
   */
  guardarFilaEditada(): void {
    if (!this.formChoferes) {
      return;
    }
    
    this.enviado = true;
    this.formChoferes.markAllAsTouched();
    this.formChoferes.updateValueAndValidity();

    // Obtener todos los valores del formulario incluyendo controles deshabilitados
    const DATOS_FORMULARIO = this.formChoferes.getRawValue() as ChoferesExtranjeros;
    
    // Validar solo campos habilitados
    const CAMPOS_INVALIDOS: string[] = [];
    
    Object.keys(this.formChoferes.controls).forEach(clave => {
      const CONTROL = this.formChoferes.get(clave);
      
      // Omitir validación para controles deshabilitados
      if (CONTROL?.disabled) {
        return;
      }
      
      // Verificar si el control habilitado es inválido
      if (CONTROL?.invalid) {
        // Para campos requeridos, verificar si tienen valor
        if (CONTROL.hasError('required')) {
          CAMPOS_INVALIDOS.push(clave);
        }
        // Para errores de patrón/formato
        else if (CONTROL.hasError('pattern') || CONTROL.hasError('email')) {
          CAMPOS_INVALIDOS.push(clave);
        }
      }
    });

    // Verificar si el formulario es válido (sin campos habilitados inválidos)
    const ES_FORMULARIO_VALIDO = CAMPOS_INVALIDOS.length === 0;

    if (ES_FORMULARIO_VALIDO) {
      const DATOS = { ...DATOS_FORMULARIO };
      
      // Conservar datos existentes para modificaciones, o usar datos del formulario para registros nuevos
      if (this.datosDeChofere && this.datosDeChofere.numero && this.datosDeChofere.numero.trim() !== '') {
        // Mantener el número original para modificaciones (clave primaria)
        DATOS.numero = this.datosDeChofere.numero;
      }
      
      // Convertir IDs de vuelta a descripciones para mostrar
      DATOS.pais = this.paisList.find((p: Catalogo) => p.clave === DATOS_FORMULARIO.pais)?.clave || '';
      DATOS.estado = this.estadoList.find((e: Catalogo) => e.clave === DATOS_FORMULARIO.estado)?.clave || '';
      DATOS.paisDeResidencia = this.paisList.find((p: Catalogo) => p.clave === DATOS_FORMULARIO.paisDeResidencia)?.clave || '';
      DATOS.nacionalidad = this.paisList.find((p: Catalogo) => p.clave === DATOS_FORMULARIO.nacionalidad)?.clave || '';

      // Emitir el evento con los datos guardados
      this.eventoAgregarModal.emit(DATOS);
    } else {
      this.mostrarNotificacionErrorValidacion(CAMPOS_INVALIDOS);
    }
  }

  /**
   * Muestra una notificación de error de validación con los campos inválidos.
   * @param _CAMPOS_INVALIDOS Lista de campos que tienen errores de validación.
   * @returns {void}
   */
  private mostrarNotificacionErrorValidacion(_CAMPOS_INVALIDOS: string[]): void {
    this.alertaNotificacion = {
      tipoNotificacion: TipoNotificacionEnum.ALERTA,
      categoria: CategoriaMensaje.INFORMACION,
      modo: 'action',
      titulo: 'Formulario inválido',
      mensaje: `Por favor verifique los campos obligatorios`,
      cerrar: true,
      txtBtnAceptar: 'Aceptar',
      txtBtnCancelar: '',
    };
    this.showNotification = true;
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param nombreControl El nombre del control del formulario.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  esInvalido(nombreControl: string): boolean | null {
    const CONTROL = this.formChoferes.get(nombreControl);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : null;
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera recursos y completa el Subject destroyed$.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.destroyed$.next(1);
    this.destroyed$.complete();
  }

}