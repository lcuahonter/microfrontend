import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Catalogo, CategoriaMensaje, Notificacion, NotificacionesComponent, REGEX_CURP, REGEX_RFC, REGEX_SOLO_DIGITOS, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent, SharedModule, TituloComponent } from "@libs/shared/data-access-user/src";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { Subject, firstValueFrom, takeUntil } from "rxjs";
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Chofer40103Service } from "../../../../estados/chofer40103.service";

import { CommonModule } from "@angular/common";
import { DatosDelChoferNacional } from "../../../../models/registro-muestras-mercancias.model";
import { NotificacionesService } from "@libs/shared/data-access-user/src/core/services/shared/notificaciones.service";
import { modificarTerrestreService } from '../../../services/modificacar-terrestre.service';

@Component({
  selector: 'app-choferes-datos',
  templateUrl: './data.de.choferes.nacional.dialog.component.html',
  styleUrls: ['./data.de.choferes.nacional.dialog.component.scss'],
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
export class DatosDeChoferesNacionalDialogComponent implements OnInit, OnDestroy {

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
   * Indica si el formulario ha sido enviado.
   * @type {boolean}
   */
  enviado: boolean = false;

  /**
   * Datos del chofer nacional que se mostrarán o editarán en el formulario.
   * @type {DatosDelChoferNacional}
   */
  @Input({ required: true }) datosDeChofere!: DatosDelChoferNacional;

  /**
   * Formulario reactivo para los datos del chofer.
   * @type {FormGroup}
   */
  formChoferes!: FormGroup;

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
   * Referencia al template del modal de choferes.
   * @type {TemplateRef<unknown>}
   */
  @ViewChild('datosDeChoferesModal') datosDeChoferesModal!: TemplateRef<unknown>;

  /**
   * Referencia al modal de Bootstrap.
   * @type {BsModalRef | undefined}
   */
  modalRef?: BsModalRef;

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
  @Output() cancelarEvento = new EventEmitter<void>();

  /**
   * Evento emitido al agregar o editar un chofer nacional.
   * @type {EventEmitter<DatosDelChoferNacional>}
   */
  @Output() agregarEventoModal = new EventEmitter<DatosDelChoferNacional>();

  /**
   * Alerta de notificación para mostrar mensajes al usuario.
   * @type {Notificacion}
   */
  public alertaNotificacion!: Notificacion;

  // ======================= MÉTODOS =======================

  /**
   * Constructor de la clase.
   * 
   * @param fb Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param modalService Servicio para la gestión de modales (ventanas emergentes) utilizando BsModalService.
   * @param chofer40103Service Servicio específico para operaciones relacionadas con choferes en el trámite 40103.
   */
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private chofer40103Service: Chofer40103Service,
    private modificarTerrestreService: modificarTerrestreService,
      private NOTIF: NotificacionesService
  ) {
    // Lógica constructora
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga las listas de catálogos necesarias.
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    /**
     * Carga la lista de países antes de inicializar el formulario.
     * Esto es necesario para tener los datos de catálogos disponibles.
     */
    await this.paisListData();
    
    this.initializeForm();

    if (this.datosDeChofere && Object.keys(this.datosDeChofere).length > 0) {
      await this.updateListsData(this.datosDeChofere);
    } else {
      if (this.paisList.length > 0) {
    const PAIS_MEXICO = this.paisList.find(p => p.clave === "MEX");
        this.formChoferes.get('pais')?.setValue(PAIS_MEXICO?.id);
        this.onPaisChange(PAIS_MEXICO as Catalogo);
      }
    }
  }

  /**
   * Inicializa el formulario reactivo con los valores y validaciones correspondientes.
   * @returns {void}
   */
  private initializeForm(): void {
    this.formChoferes = this.fb.group({

      /**
       * Campo ID: Identificador único del chofer, siempre deshabilitado
       * Se usa para distinguir entre registros nuevos (null) y existentes
       */
      id: [{ value: this.datosDeChofere?.id || null, disabled: true }], 
      
      /**
       * Campo CURP: Clave Única de Registro de Población, campo obligatorio
       * Validaciones: requerido, máximo 18 caracteres, patrón específico de CURP mexicana
       * Se usa para búsqueda automática de datos del chofer
       */
      curp: [{ value: this.datosDeChofere?.curp, disabled: false },
      [
        Validators.required,
        Validators.maxLength(18),
        Validators.pattern(REGEX_CURP),
      ]],

      rfc: [{ value: this.datosDeChofere?.rfc, disabled: false }, [Validators.required, Validators.pattern(REGEX_RFC)]],
      nombre: [{ value: this.datosDeChofere?.nombre, disabled: true }], 
      primerApellido: [{ value: this.datosDeChofere?.primerApellido, disabled: true }], 
      segundoApellido: [{ value: this.datosDeChofere?.segundoApellido, disabled: true }], 
      numeroDeGafete: [{ value: this.datosDeChofere?.numeroDeGafete, disabled: true }], 
      vigenciaGafete: [{ value: this.datosDeChofere?.vigenciaGafete, disabled: true }], 

      calle: [{ value: this.datosDeChofere?.calle, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      numeroExterior: [{ value: this.datosDeChofere?.numeroExterior, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      numeroInterior: [{ value: this.datosDeChofere?.numeroInterior, disabled: this.readonly }], 
      pais: [{ value: this.paisList.length > 0 ? this.paisList[0].id : 1, disabled: true }],
      estado: [{ value: this.datosDeChofere?.estado || '', disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      municipioAlcaldia: [{ value: this.datosDeChofere?.municipioAlcaldia || '', disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      colonia: [{ value: this.datosDeChofere?.colonia || '', disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      paisDeResidencia: [{ value: this.datosDeChofere?.paisDeResidencia, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      ciudad: [{ value: this.datosDeChofere?.ciudad, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      localidad: [{ value: this.datosDeChofere?.localidad, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      codigoPostal: [{ value: this.datosDeChofere?.codigoPostal, disabled: this.readonly }, this.readonly ? [] : [Validators.required]],
      correoElectronico: [{ value: this.datosDeChofere?.correoElectronico, disabled: this.readonly }, this.readonly ? [] : [Validators.email]],
      telefono: [{ value: this.datosDeChofere?.telefono, disabled: this.readonly }, this.readonly ? [] : [Validators.pattern(REGEX_SOLO_DIGITOS)]],
    });
  }


  /**
   * Obtiene la lista de países emisores desde el servicio `chofer40103Service` y la asigna a la propiedad `paisList`.
   *
   * @returns {void}
   */
  async paisListData(): Promise<void> {
    try {
      const DATOS = await firstValueFrom(
        this.chofer40103Service
          .getPaisEmisor()
          .pipe(takeUntil(this.destroyed$))
      );
      this.paisList = DATOS || [];
    } catch (error) {
      // Manejo de errores
    }
  }

  /**
   * Maneja el cambio de país seleccionado, actualizando la lista de estados y reseteando los campos dependientes.
   * @param value País seleccionado.
   * @returns {void}
   */
  onPaisChange(value: Catalogo): void {
    this.fetchEstadosByPais(value);
    if (this.formChoferes) {
      this.formChoferes.controls['estado'].reset();
      this.formChoferes.controls['municipioAlcaldia'].reset();
      this.formChoferes.controls['colonia'].reset();
    }
  }

  /**
   * Obtiene la lista de estados por país desde el servicio.
   * @param value País seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchEstadosByPais(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATOS = await firstValueFrom(
        this.chofer40103Service
          .getEstadosPorPais(value.clave as string)
          .pipe(takeUntil(this.destroyed$))
      );
      this.estadoList = DATOS || [];
    } catch (error) {
      // Manejo de errores
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

    if (this.formChoferes) {
      this.formChoferes.controls['municipioAlcaldia'].reset();
      this.formChoferes.controls['colonia'].reset();
    }
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
          .getMunicipiosPorEstado(value?.clave as string)
          .pipe(takeUntil(this.destroyed$))
      );
      this.municipioList = DATOS || [];
    } catch (error) {
      // Manejo de errores
    }
    return this.municipioList;

  }

  /**
   * Maneja el cambio de municipio seleccionado, actualizando la lista de colonias y reseteando el campo colonia.
   * @param value Municipio seleccionado.
   * @returns {void}
   */
  onMunicipioChange(value: Catalogo): void {
    this.fetchColoniasByMunicipio(value);

    if (this.formChoferes) {
      this.formChoferes.controls['colonia'].reset();
    }
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
      // Manejo de errores
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
   * Abre el modal de choferes.
   * @returns {void}
   */
  abrirModal(): void {
    this.modalRef = this.modalService.show(this.datosDeChoferesModal, { class: 'modal-xl' });
  }

  /**
   * Cierra el modal de choferes y emite el evento de cancelación.
   * @returns {void}
   */
  cerrarModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
    this.cancelarEvento.emit();
  }

  /**
   * Restablece el formulario de choferes a sus valores predeterminados.
   * 
   * Este método reinicia todos los campos del formulario `formChoferes` con valores vacíos o por defecto,
   * permitiendo limpiar el formulario para una nueva entrada de datos.
   */
  restablecerFormulario(): void {
    this.formChoferes.reset({
      id: null,
      curp: '',
      rfc: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      numeroDeGafete: '',
      vigenciaGafete: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      pais: 1,
      estado: '',
      municipioAlcaldia: '',
      colonia: '',
      paisDeResidencia: '',
      ciudad: '',
      localidad: '',
      codigoPostal: '',
      correoElectronico: '',
      telefono: ''
    });

  }


  /**
   * Busca información de un chofer nacional utilizando su CURP y actualiza el formulario.
   * @returns {Promise<void>}
   */
  async buscarChoferNacional(): Promise<void> {
    if (!this.formChoferes) {
      return;
    }
    const RFC = this.formChoferes?.get('rfc')?.value;
    const CURP = this.formChoferes?.get('curp')?.value;

    if (!RFC && !CURP) {
      this.alertaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.INFORMACION,
        modo: 'action',
        titulo: 'Alert',
        mensaje: 'Favor de ingresar CURP o RFC',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.showNotification = true;
      return;
    }

    const ISEXISTENCE = this.contexto === 'modificacion' || this.contexto === 'retirada';
    const PAYLOAD = { RFC, CURP };

    try {
      const API_RESPONSE = await firstValueFrom(
        this.modificarTerrestreService
          .buscarChoferNacional(PAYLOAD, ISEXISTENCE)
          .pipe(takeUntil(this.destroyed$))
      );

      if (API_RESPONSE.codigo !== '00') {
        this.NOTIF.showNotification({
              tipoNotificacion: 'toastr',
              categoria: 'danger',
              mensaje: API_RESPONSE.mensaje ? API_RESPONSE.mensaje : '',
              titulo: 'Error',
              modo: '',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: 'Cancelar',
            });
        return;
      }
      
      const DATOS_API = API_RESPONSE.datos;
      const DATOS_CHOFER: DatosDelChoferNacional = {
        id: this.formChoferes.get('id')?.value,
        curp: DATOS_API.curp,
        rfc: DATOS_API.rfc,
        nombre: DATOS_API.nombre,
        primerApellido: DATOS_API.primer_apellido,
        segundoApellido: DATOS_API.segundo_apellido,
        numeroDeGafete: DATOS_API.numero_de_gafete,
        vigenciaGafete: DATOS_API.vigencia_del_gafete,
        calle: DATOS_API.domicilio.calle,
        numeroExterior: DATOS_API.domicilio.numero_exterior,
        numeroInterior: DATOS_API.domicilio.numero_interior, // Not provided by API
        pais: DATOS_API.domicilio.pais,
        estado: DATOS_API.domicilio.estado,
        municipioAlcaldia: DATOS_API.domicilio.municipio,
        colonia: DATOS_API.domicilio.colonia,
        localidad: DATOS_API.domicilio.localidad,
        codigoPostal: DATOS_API.domicilio.codigo_postal,
        paisDeResidencia: DATOS_API.domicilio.pais_de_residencia, // Not provided by API
        ciudad: DATOS_API.domicilio.ciudad, // Not provided by API
        correoElectronico:DATOS_API.domicilio.correo_electronico || '',
        telefono: DATOS_API.domicilio.telefono || ''
      };

      await this.updateListsData(DATOS_CHOFER);
      
      this.formChoferes.patchValue({
        ...DATOS_CHOFER,
      });
    } catch (error) {
      // Manejo de errores
      this.alertaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.INFORMACION,
        modo: 'action',
        titulo: 'Error',
        mensaje: 'Error al buscar la información del chofer.',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.showNotification = true;
    }
  }

  /**
   * Actualiza las listas de estados, municipios y colonias según los datos del chofer.
   * @param data Datos del chofer nacional.
   * @returns {Promise<void>}
   */
  private async updateListsData(data: DatosDelChoferNacional): Promise<void> {
    if (!this.paisList || this.paisList.length === 0) {
      return;
    }

    // Para los conductores nacionales, el país siempre es México.
    const PAISMEXICO = this.paisList.find(p => p.clave === 'MEX');
    if (!PAISMEXICO) {
      return;
    }

    this.formChoferes.patchValue({
      pais: PAISMEXICO.clave,
    });

    const ESTADO = await this.fetchEstadosByPais(PAISMEXICO);
    if (ESTADO.length === 0 || !data.estado) {return;}

    const ESTADOSELECCIONADO = ESTADO.find(e => e.clave === data.estado);
    if (!ESTADOSELECCIONADO) {return;}

    this.formChoferes.patchValue({ estado: ESTADOSELECCIONADO.clave });
    const MUNICIPIOS = await this.fetchMunicipiosByEstado(ESTADOSELECCIONADO);
    if (MUNICIPIOS.length === 0 || !data.municipioAlcaldia) {return;}

    const MUNICIPIOSSELECCIONADO = MUNICIPIOS.find(m => m.clave === data.municipioAlcaldia);
    if (!MUNICIPIOSSELECCIONADO) {return;}

    this.formChoferes.patchValue({ municipioAlcaldia: MUNICIPIOSSELECCIONADO.clave });
    const COLONIA = await this.fetchColoniasByMunicipio(MUNICIPIOSSELECCIONADO);
    if (COLONIA.length === 0 || !data.colonia) {return;}

    const COLONIASELECCIONADA = COLONIA.find(c => c.clave === data.colonia);
    if (!COLONIASELECCIONADA) {return;}

    this.formChoferes.patchValue({ colonia: COLONIASELECCIONADA.clave });
  }

  /**
   * Limpia todos los campos del formulario de choferes.
   * @returns {void}
   */
  limpiarFormulario(): void {
    this.formChoferes.reset();
  }

  /**
   * Guarda los datos editados del chofer nacional si el formulario es válido, emite el evento y cierra el modal.
   * Si el formulario es inválido, muestra una notificación de alerta.
   * @returns {void}
   */
  guardarFilaEditada(): void {
    this.enviado = true;
    this.formChoferes.markAllAsTouched();
    this.formChoferes.updateValueAndValidity();

    const DATOS_FORMULARIO = this.formChoferes.getRawValue() as DatosDelChoferNacional;
    
    const CAMPOS_INVALIDOS: string[] = [];
    
    Object.keys(this.formChoferes.controls).forEach(key => {
      const CONTROL_FORMULARIO = this.formChoferes.get(key);
      
      if (CONTROL_FORMULARIO?.disabled) {
        return;
      }
      
      if (CONTROL_FORMULARIO?.invalid) {
        if (CONTROL_FORMULARIO.hasError('required')) {
          CAMPOS_INVALIDOS.push(key);
        }
        else if (CONTROL_FORMULARIO.hasError('pattern') || CONTROL_FORMULARIO.hasError('email')) {
          CAMPOS_INVALIDOS.push(key);
        }
      }
    });

    const ES_FORMULARIO_VALIDO = CAMPOS_INVALIDOS.length === 0;

    if (ES_FORMULARIO_VALIDO) {
      const DATOS = { ...DATOS_FORMULARIO };
    
      if (this.datosDeChofere && this.datosDeChofere.id && this.datosDeChofere.id !== null && this.datosDeChofere.id !== undefined) {
        DATOS.id = this.datosDeChofere.id;
      } else {
        DATOS.id = Date.now();
      }
      
      DATOS.pais = this.paisList.find(p => p.clave === DATOS_FORMULARIO.pais)?.clave || '';
      DATOS.estado = this.estadoList.find(e => e.clave === DATOS_FORMULARIO.estado)?.clave || '';
      DATOS.municipioAlcaldia = this.municipioList.find(m => m.clave === DATOS_FORMULARIO.municipioAlcaldia)?.clave || '';
      DATOS.colonia = this.coloniaList.find(c => c.clave === DATOS_FORMULARIO.colonia)?.clave || '';
      DATOS.paisDeResidencia = this.paisList.find(p => p.clave === DATOS_FORMULARIO.paisDeResidencia)?.clave || '';
      
      this.agregarEventoModal.emit(DATOS);
      this.cerrarModal();
    } else {
      this.alertaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.INFORMACION,
        modo: 'action',
        titulo: 'Formulario inválido',
        mensaje: `Por favor verifique los campos obligatorios.`,
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.showNotification = true;
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param controlName El nombre del control del formulario.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(controlName: string): boolean | null {
    const CONTROL_FORMULARIO = this.formChoferes.get(controlName);
    return CONTROL_FORMULARIO ? CONTROL_FORMULARIO.invalid && CONTROL_FORMULARIO.touched : null;
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