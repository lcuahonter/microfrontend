import { CommonModule } from '@angular/common';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';

import { Catalogo, CategoriaMensaje, Notificacion, NotificacionesComponent, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import {
  SharedModule,
  TituloComponent
} from '@libs/shared/data-access-user/src';
import { REGEX_SOLO_DIGITOS } from '@libs/shared/data-access-user/src/tramites/constantes/regex.constants';

import { Chofer40101Service } from '../../../../estado/chofer40101.service';

import { ApiResponseChofer, ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { Chofer, Chofer40101Store } from '../../../../estado/chofer40101.store';


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

  submitted = false;
  isEditando: boolean = false;

  indiceEditando: number | null = null;
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
  // @Output() addModalEvent = new EventEmitter<ChoferesExtranjeros>();
  @Output() addModalEvent = new EventEmitter<{ datos: ChoferesExtranjeros, indice?: number }>();

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
   * @param chofer40101Service Servicio específico para operaciones relacionadas con choferes en el trámite 40101.
   */
  constructor(private fb: FormBuilder,
    private modalService: BsModalService,
    private chofer40101Service: Chofer40101Service,
    private chofer40101Store: Chofer40101Store,
  ) {
    // Lógica para el constructor si es necesario.
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Inicializa el formulario y carga las listas de catálogos necesarias.
   * @returns {Promise<void>}
   */
  async ngOnInit(): Promise<void> {
    this.chofer40101Store.setSelectedDriverType('extranjero');

    this.formChoferes = this.fb.group({
      nombre: [{ value: this.datosDeChofere?.nombre, disabled: this.readonly }, [Validators.required, Validators.maxLength(200)]],
      primerApellido: [{ value: this.datosDeChofere?.primerApellido, disabled: this.readonly }, [Validators.required, Validators.maxLength(200)]],
      segundoApellido: [{ value: this.datosDeChofere?.segundoApellido, disabled: this.readonly }, [Validators.maxLength(200)]],
      nacionalidad: [{ value: this.datosDeChofere?.nacionalidad, disabled: this.readonly }],
      numeroDeGafete: [{ value: this.datosDeChofere?.numeroDeGafete, disabled: this.readonly }, [Validators.maxLength(24)]],
      vigenciaGafete: [{ value: this.datosDeChofere?.vigenciaGafete, disabled: this.readonly }, [Validators.maxLength(15)]],
      numeroDelSeguroSocial: [{ value: this.datosDeChofere?.numeroDelSeguroSocial, disabled: this.readonly }, [Validators.required, Validators.maxLength(18), Validators.pattern(REGEX_SOLO_DIGITOS)]],
      identificadorFiscal: [{ value: this.datosDeChofere?.identificadorFiscal, disabled: this.readonly }, [Validators.required, Validators.maxLength(18)]],
      pais: [{ value: this.datosDeChofere?.pais, disabled: this.readonly }],
      codigoPostal: [{ value: this.datosDeChofere?.codigoPostal, disabled: this.readonly }, [Validators.required, Validators.maxLength(10)]],
      estado: [{ value: this.datosDeChofere?.estado, disabled: this.readonly }, [Validators.required]],
      calle: [{ value: this.datosDeChofere?.calle, disabled: this.readonly }, [Validators.required, Validators.maxLength(100)]],
      numeroExterior: [{ value: this.datosDeChofere?.numeroExterior, disabled: this.readonly }, [Validators.required, Validators.maxLength(10)]],
      numeroInterior: [{ value: this.datosDeChofere?.numeroInterior, disabled: this.readonly }, [Validators.maxLength(10)]],
      paisDeResidencia: [{ value: this.datosDeChofere?.paisDeResidencia, disabled: this.readonly }],
      ciudad: [{ value: this.datosDeChofere?.ciudad, disabled: this.readonly }, [Validators.required, Validators.maxLength(50)]],
      correoElectronico: [{ value: this.datosDeChofere?.correoElectronico, disabled: this.readonly }, [Validators.email]],
      telefono: [{ value: this.datosDeChofere?.telefono, disabled: this.readonly }, [Validators.pattern(REGEX_SOLO_DIGITOS)]],
    }, { updateOn: 'change' });

    await this.paisListData();
  }

  updateDriverFromForm(field: keyof Chofer): void {
    const VALUE = this.formChoferes.get(field as string)?.value;
    this.chofer40101Store.setDriver('extranjero', { [field]: VALUE });
  }


  /**
   * Obtiene la lista de países emisores desde el servicio `chofer40101Service` y la asigna a la propiedad `paisList`.
   *
   * @returns {void}
   */
  async paisListData(): Promise<void> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40101Service
          .getPaisEmisor()
          .pipe(takeUntil(this.destroyed$))
      );
      this.paisList = DATA || [];
      const VALUENATIONAL = this.paisList.length > 0 ? this.paisList[0].clave : ""
      this.formChoferes.controls['nacionalidad'].setValue(VALUENATIONAL);
    } catch (error) {
      // Manejo de errores si es necesario
    }
  }

  /**
   * Obtiene la lista de estados por país desde el servicio.
   * @param value País seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchEstadosByPais(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40101Service
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
    if (!value) { return; }
    this.chofer40101Store.setDriver('extranjero', { estado: value.clave });
    this.fetchMunicipiosByEstado(value);
  }

  /**
   * Obtiene la lista de municipios por estado desde el servicio.
   * @param value Estado seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchMunicipiosByEstado(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40101Service
          .getMunicipiosPorEstado(value.clave as string)
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
    if (!value) { return; }
    this.chofer40101Store.setDriver('extranjero', { municipioAlcaldia: value.clave });
    this.fetchColoniasByMunicipio(value);
  }

  /**
   * Obtiene la lista de colonias por municipio desde el servicio.
   * @param value Municipio seleccionado.
   * @returns {Promise<Catalogo[]>}
   */
  private async fetchColoniasByMunicipio(value: Catalogo): Promise<Catalogo[]> {
    try {
      const DATA = await firstValueFrom(
        this.chofer40101Service
          .getColoniasPorMunicipio(value.clave as string)
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
  abiertoModal(): void {
    this.modalRef = this.modalService.show(this.datosDeChoferesModal, { class: 'modal-xl' });
  }

  /**
   * Cierra el modal de choferes y emite el evento de cancelación.
   * @returns {void}
   */
  cerrarModal(): void {
    this.modalRef?.hide();
    this.cancelEvent.emit();
  }

  /**
   * Restablece el formulario de choferes a sus valores predeterminados.
   * 
   * Este método reinicia todos los campos del formulario `formChoferes` con valores vacíos o por defecto,
   * permitiendo limpiar el formulario para una nueva entrada de datos.
   */
  limpiarFormulario(): void {
    this.formChoferes.reset();
    this.chofer40101Store.clear();
  }

  /**
  * Método para iniciar la edición de un registro.
  * @param datos Datos del chofer a editar
  * @param indice Índice del registro en la tabla
  */
  editarRegistro(datos: ChoferesExtranjeros, indice: number): void {
    this.isEditando = true;
    this.indiceEditando = indice;
    this.formChoferes.patchValue(datos);
    this.chofer40101Store.setDriver('extranjero', datos);
  }

  /**
   * Busca información de un chofer nacional utilizando su CURP y actualiza el formulario.
   * @param numeroDelSeguroSocial CURP del chofer nacional.
   * @returns {Promise<void>}
   */
  async buscarChoferNacional(numeroDelSeguroSocial: string): Promise<void> {
    if (!numeroDelSeguroSocial) {
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
    const NSS = this.formChoferes.get('numeroDelSeguroSocial')?.value
    await this.chofer40101Service
      .obtenerDatos(NSS)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response: ApiResponseChofer) => {
        if (response) {
          const DATOSTOMAPPED: ChoferesExtranjeros = {
            ...response.datos,
            nombre: response.datos.nombre ?? '',
            primerApellido: response?.datos?.primer_apellido ?? '',
            segundoApellido: response?.datos?.segundo_apellido ?? '',
            nacionalidad: response?.datos?.nacionalidad ?? '',
            numeroDeGafete: response?.datos?.numero_de_gafete ?? '',
            vigenciaGafete: response?.datos?.vigencia_del_gafete ?? '',
            numeroDelSeguroSocial: response?.datos?.nss ?? '',
            identificadorFiscal: response?.datos?.rfc ?? '',
            pais: response.datos?.domicilio?.pais ?? '',
            codigoPostal: response.datos?.domicilio?.codigo_postal ?? '',
            estado: response.datos?.domicilio?.estado ?? '',
            calle: response.datos?.domicilio?.calle ?? '',
            numeroExterior: response.datos?.domicilio?.numero_exterior ?? '',
            numeroInterior: response.datos?.domicilio?.numero_interior ?? '',
            paisDeResidencia: response.datos?.domicilio?.pais ?? '',
            ciudad: response.datos?.domicilio?.ciudad ?? '',
            correoElectronico: response.datos?.domicilio?.correo_electronico ?? '',
            telefono: response.datos?.domicilio?.telefono ?? '',
          };
          this.completarFormularioConDatos(DATOSTOMAPPED);
        }
      });
  }

  /**
   * Función auxiliar para completar el formulario con datos del chofer.
   * @param datos Datos de la respuesta de la API
   */
  private completarFormularioConDatos(datos: ChoferesExtranjeros): void {
    this.formChoferes.patchValue(datos);
    this.chofer40101Store.setDriver('extranjero', datos);
  }

  /**
   * Guarda los datos editados del chofer nacional si el formulario es válido, emite el evento y cierra el modal.
   * Si el formulario es inválido, muestra una notificación de alerta.
   * @returns {void}
   */
  guardarFilaEditada(): void {
    this.submitted = true;
    Object.values(this.formChoferes.controls).forEach(control => {
      control.markAsTouched({ onlySelf: true });
      control.updateValueAndValidity();
    });

    if (this.formChoferes.valid) {
      const DATA = this.formChoferes.getRawValue() as ChoferesExtranjeros;
       DATA.pais = this.paisList.find(p => String(p.clave) === String(DATA.pais))?.clave || '';
      DATA.paisDeResidencia = this.paisList.find(p => String(p.clave) === String(DATA.pais))?.clave || '';
      if (this.isEditando && this.indiceEditando !== null) {
        this.addModalEvent.emit({ datos: DATA, indice: this.indiceEditando as number });
      } else {
        this.addModalEvent.emit({ datos: DATA });
      }
      // Aquí puedes realizar la lógica para guardar los datos del chofer
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