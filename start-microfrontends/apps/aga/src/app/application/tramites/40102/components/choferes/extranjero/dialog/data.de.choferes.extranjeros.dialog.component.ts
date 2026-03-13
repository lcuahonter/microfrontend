import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Catalogo, CategoriaMensaje, Notificacion, NotificacionesComponent, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent, SharedModule, TituloComponent } from "@libs/shared/data-access-user/src";
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";
import { Subject, firstValueFrom, takeUntil } from "rxjs";
import { Chofer40102Service } from "../../../../estados/chofer40102.service";
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { CommonModule } from "@angular/common";


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
    NotificacionesComponent
  ],
})
export class DatosDeChoferesExtranjerosDialogComponent implements OnInit, OnDestroy {

  /**
   * Indica si el formulario está en modo solo lectura.
   * @type {boolean}
   */
  @Input() readonly: boolean = false;

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
  @Output() cancelEvent = new EventEmitter<void>();

  /**
   * Evento emitido al agregar o editar un chofer nacional.
   * @type {EventEmitter<ChoferesExtranjeros>}
   */
  @Output() addModalEvent = new EventEmitter<ChoferesExtranjeros>();

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
   * @param chofer40102Service Servicio específico para operaciones relacionadas con choferes en el trámite 40102.
   */
  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private chofer40102Service: Chofer40102Service,
  ) {
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga las listas de catálogos necesarias.
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {


    this.formChoferes = this.fb.group({
      numero: [{ value: this.datosDeChofere?.numero, disabled: this.readonly}, [Validators.required, Validators.maxLength(10)]],
      primerApellido: [{ value: this.datosDeChofere?.primerApellido, disabled: this.readonly }, [Validators.required, Validators.maxLength(50)]],
      segundoApellido: [{ value: this.datosDeChofere?.segundoApellido, disabled: this.readonly }],

      nacionalidad: [{ value: this.datosDeChofere?.nacionalidad, disabled: true }, [Validators.required]],
      numeroDeGafete: [{ value: this.datosDeChofere?.numeroDeGafete, disabled: true }],
      vigenciaGafete: [{ value: this.datosDeChofere?.vigenciaGafete, disabled: true }],

      numeroDelSeguroSocial: [{ value: this.datosDeChofere?.numeroDelSeguroSocial, disabled: this.readonly }, [Validators.required, Validators.maxLength(11), Validators.pattern(/^\d{11}$/)]],
      numberDeIdeFiscal: [{ value: this.datosDeChofere?.numberDeIdeFiscal, disabled: this.readonly }, [Validators.required, Validators.maxLength(13)]],

      pais: [{ value: this.datosDeChofere?.pais, disabled: true }, [Validators.required]],
      codigoPostal: [{ value: this.datosDeChofere?.codigoPostal, disabled: this.readonly }, [Validators.required, Validators.maxLength(5), Validators.pattern(/^\d{5}$/)]],
      estado: [{ value: this.datosDeChofere?.estado, disabled: this.readonly }, [Validators.required]],

      calle: [{ value: this.datosDeChofere?.calle, disabled: this.readonly }, [Validators.required, Validators.maxLength(100)]],
      numeroExterior: [{ value: this.datosDeChofere?.numeroExterior, disabled: this.readonly }, [Validators.required, Validators.maxLength(10)]],
      numeroInterior: [{ value: this.datosDeChofere?.numeroInterior, disabled: this.readonly }, [Validators.maxLength(10)]],
      
      paisDeResidencia: [{ value: this.datosDeChofere?.paisDeResidencia, disabled: this.readonly }, [Validators.required]],
      ciudad: [{ value: this.datosDeChofere?.ciudad, disabled: this.readonly }, [Validators.required, Validators.maxLength(50)]],
      
      correoElectronico: [{ value: this.datosDeChofere?.correoElectronico, disabled: this.readonly }],
      telefono: [{ value: this.datosDeChofere?.telefono, disabled: this.readonly }],
    });

    await this.paisListData();
    await this.updateListsData(this.datosDeChofere);

  }


  /**
   * Obtiene la lista de países emisores desde el servicio `chofer40102Service` y la asigna a la propiedad `paisList`.
   *
   * @returns {void}
   */
  async paisListData(): Promise<void> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40102Service
          .getPaisEmisor()
          .pipe(takeUntil(this.destroyed$))
      );
      this.paisList = DATA || [];
      if (this.paisList.length > 0) {
        this.onPaisChange(this.paisList[0]);
      }
    } catch (error) {
      // Manejo de errores si es necesario
    }
  }

  /**
   * Maneja el cambio de país seleccionado, actualizando la lista de estados y reseteando los campos dependientes.
   * @param value País seleccionado.
   * @returns {void}
   */
  onPaisChange(value: Catalogo): void {
    this.fetchEstadosByPais(value);
    this.formChoferes.controls['estado'].reset();
    this.formChoferes.controls['municipioAlcaldia'].reset();
    this.formChoferes.controls['colonia'].reset();
  }

  /**
   * Obtiene la lista de estados por país desde el servicio.
   * @param value País seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchEstadosByPais(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40102Service
          .getEstadosPorPais(value.id)
          .pipe(takeUntil(this.destroyed$))
      );
      this.estadoList = DATA || [];
    } catch (error) {
      console.error('Error al obtener estados por país:', error);
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

    this.formChoferes.controls['municipioAlcaldia'].reset();
    this.formChoferes.controls['colonia'].reset();
  }

  /**
   * Obtiene la lista de municipios por estado desde el servicio.
   * @param value Estado seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchMunicipiosByEstado(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40102Service
          .getMunicipiosPorEstado(value.id)
          .pipe(takeUntil(this.destroyed$))
      );
      this.municipioList = DATA || [];
    } catch (error) {
      console.error('Error al obtener municipios por estado:', error);
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

    this.formChoferes.controls['colonia'].reset();
  }

  /**
   * Obtiene la lista de colonias por municipio desde el servicio.
   * @param value Municipio seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchColoniasByMunicipio(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40102Service
          .getColoniasPorMunicipio(value.id)
          .pipe(takeUntil(this.destroyed$))
      );
      this.coloniaList = DATA || [];
    } catch (error) {
      console.error('Error al obtener colonias por municipio:', error);
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
  openModal(): void {
    this.modalRef = this.modalService.show(this.datosDeChoferesModal, { class: 'modal-xl' });
  }

  /**
   * Cierra el modal de choferes y emite el evento de cancelación.
   * @returns {void}
   */
  closeModal(): void {
    this.modalRef?.hide();
    this.cancelEvent.emit();
  }

  /**
   * Restablece el formulario de choferes a sus valores predeterminados.
   * 
   * Este método reinicia todos los campos del formulario `formChoferes` con valores vacíos o por defecto,
   * permitiendo limpiar el formulario para una nueva entrada de datos.
   */
  resetForm(): void {
    this.formChoferes.reset({
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
      paisDeResidencia: '1',
      ciudad: '',
      localidad: '',
      codigoPostal: '',
      correoElectronico: '',
      telefono: ''
    });
    
  }

  /**
   * Maneja la entrada en el campo CURP y busca automáticamente el chofer si la longitud es suficiente.
   * @returns {void}
   */
  onCurpInput(): void {
    const CURP_VALUE = this.formChoferes.get('curp')?.value;
    if (CURP_VALUE && CURP_VALUE.length >= 18) {
      this.buscarChoferNacional(CURP_VALUE);
    }
  }

  /**
   * Busca información de un chofer nacional utilizando su CURP y actualiza el formulario.
   * @param curp CURP del chofer nacional.
   * @returns {Promise<void>}
   */
  async buscarChoferNacional(curp: string): Promise<void> {
    if (!curp) {
      //this.showNotification = true;
      this.alertaNotificacion = {
        tipoNotificacion: TipoNotificacionEnum.ALERTA,
        categoria: CategoriaMensaje.INFORMACION,
        modo: 'action',
        titulo: 'Alert',
        mensaje: 'La información proporcionada no existe',
        cerrar: true,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      return;
    }

    await this.chofer40102Service
      .obtenerTablaDatos<ChoferesExtranjeros>('mock-data-choferes-extranjero.json')
      .pipe(takeUntil(this.destroyed$))
      .subscribe( (response) => {
            if(response?.length === 0) {
              this.alertaNotificacion = {
                tipoNotificacion: TipoNotificacionEnum.ALERTA,
                categoria: CategoriaMensaje.INFORMACION,
                modo: 'action',
                titulo: 'Alert',
                mensaje: 'No se encontró información para el CURP o RFC proporcionado.',
                cerrar: true,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
              return;
            }
        this.updateListsData(response[0]);
        // Rellenar el formulario
        this.formChoferes.patchValue(response[0]);
      });
  }

  /**
   * Actualiza las listas de estados, municipios y colonias según los datos del chofer.
   * @param data Datos del chofer nacional.
   * @returns {Promise<void>}
   */
  private updateListsData(data: ChoferesExtranjeros): void {
    data.pais = (this.paisList.find((p:Catalogo )=> p.descripcion === data.pais)?.id)?.toString();
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
      this.formChoferes.markAllAsTouched();
      this.formChoferes.updateValueAndValidity();

    if (this.formChoferes.valid) {
      const DATA = this.formChoferes.getRawValue() as ChoferesExtranjeros;
      DATA.pais = this.paisList.find(p => p.id === Number(DATA.pais))?.descripcion || '';
      // DATA.estado = this.estadoList.find(e => e.id === Number(DATA.estado))?.descripcion || '';
      DATA.paisDeResidencia = this.paisList.find(p => p.id === Number(DATA.paisDeResidencia))?.descripcion || '';

      // Aquí puedes realizar la lógica para guardar los datos del chofer
      this.addModalEvent.emit(DATA);
      this.closeModal();
    } else {
        this.alertaNotificacion = {
          tipoNotificacion: TipoNotificacionEnum.ALERTA,
          categoria: CategoriaMensaje.INFORMACION,
          modo: 'action',
          titulo: 'Alert',
          mensaje: 'Formulario inválido, por favor verifica los campos.',
          cerrar: true,
          txtBtnAceptar: 'Aceptar',
          txtBtnCancelar: '',
        };
    }
  }

  /**
   * Verifica si el control del formulario es inválido y ha sido tocado.
   * @param controlName El nombre del control del formulario.
   * @returns {boolean | null} `true` si el control es inválido y tocado, `null` si no existe el control.
   */
  isInvalid(controlName: string): boolean | null {
    const CONTROL = this.formChoferes.get(controlName);
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