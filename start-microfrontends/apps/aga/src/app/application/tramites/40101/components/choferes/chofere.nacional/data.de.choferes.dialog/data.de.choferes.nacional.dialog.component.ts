import { ApiResponseChofer, DatosDelChoferNacional } from '../../../../models/registro-muestras-mercancias.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Catalogo, CategoriaMensaje, Notificacion, NotificacionesComponent, REGEX_CURP, REGEX_RFC, REGEX_SOLO_DIGITOS, TipoNotificacionEnum } from '@ng-mf/data-access-user';
import { Chofer40101Store, createInitialState } from '../../../../estado/chofer40101.store';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Chofer40101Query } from '../../../../estado/chofer40101.query';
import { Chofer40101Service } from '../../../../estado/chofer40101.service';
import { CommonModule } from '@angular/common';

import { SharedModule, TituloComponent } from '@libs/shared/data-access-user/src';
import { Subject, firstValueFrom, takeUntil } from 'rxjs';
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
    TituloComponent,
    NotificacionesComponent
  ],
})
export class DatosDeChoferesNacionalDialogComponent implements OnInit, OnDestroy {
  isEditando: boolean = false;
  indiceEditando: number | null = null;
  @Input() readonly: boolean = false;
  @Input({ required: true }) datosDeChofere!: DatosDelChoferNacional;
  formChoferes!: FormGroup;
  destroyed$: Subject<unknown> = new Subject<unknown>();
  showNotification: boolean = false;
  @ViewChild('datosDeChoferesModal') datosDeChoferesModal!: TemplateRef<unknown>;
  modalRef?: BsModalRef;
  paisList: Catalogo[] = [];
  estadoList: Catalogo[] = [];
  municipioList: Catalogo[] = [];
  coloniaList: Catalogo[] = [];
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() addModalEvent = new EventEmitter<{ datos: DatosDelChoferNacional, indice?: number }>();
  public alertaNotificacion!: Notificacion;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private chofer40101Service: Chofer40101Service,
    private modificacarTerrestreService: modificarTerrestreService,
    private chofer40101Store: Chofer40101Store,
    private chofer40101Query: Chofer40101Query
  ) { }

  /**
    * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
    * Inicializa el formulario y carga las listas de catálogos necesarias.
    * @returns {Promise<void>}
    */
  async ngOnInit(): Promise<void> {
    this.chofer40101Store.setSelectedDriverType('nacional');
    this.formChoferes = this.fb.group({
      curp: [{ value: this.datosDeChofere?.curp, disabled: false }, [Validators.required, Validators.maxLength(18), Validators.pattern(REGEX_CURP)]],
      rfc: [{ value: this.datosDeChofere?.rfc, disabled: false }, [Validators.required, Validators.pattern(REGEX_RFC)]],
      nombre: [{ value: this.datosDeChofere?.nombre, disabled: true }, Validators.required],
      primerApellido: [{ value: this.datosDeChofere?.primerApellido, disabled: true }, Validators.required],
      segundoApellido: [{ value: this.datosDeChofere?.segundoApellido, disabled: true }],
      numeroDeGafete: [{ value: this.datosDeChofere?.numeroDeGafete, disabled: true }],
      vigenciaGafete: [{ value: this.datosDeChofere?.vigenciaGafete, disabled: true }],
      calle: [{ value: this.datosDeChofere?.calle, disabled: this.readonly }, Validators.required],
      numeroExterior: [{ value: this.datosDeChofere?.numeroExterior, disabled: this.readonly }, Validators.required],
      numeroInterior: [{ value: this.datosDeChofere?.numeroInterior, disabled: this.readonly }],
      pais: [{ value: 1, disabled: true }],
      estado: [{ value: this.datosDeChofere?.estado, disabled: this.readonly }, Validators.required],
      municipioAlcaldia: [{ value: this.datosDeChofere?.municipioAlcaldia, disabled: this.readonly }, Validators.required],
      colonia: [{ value: this.datosDeChofere?.colonia, disabled: this.readonly }, Validators.required],
      paisDeResidencia: [{ value: this.datosDeChofere?.paisDeResidencia, disabled: this.readonly }, Validators.required],
      ciudad: [{ value: this.datosDeChofere?.ciudad, disabled: this.readonly }, Validators.required],
      localidad: [{ value: this.datosDeChofere?.localidad, disabled: this.readonly }, Validators.required],
      codigoPostal: [{ value: this.datosDeChofere?.codigoPostal, disabled: this.readonly }, Validators.required],
      correoElectronico: [{ value: this.datosDeChofere?.correoElectronico, disabled: this.readonly }, [Validators.email]],
      telefono: [{ value: this.datosDeChofere?.telefono, disabled: this.readonly }, [Validators.pattern(REGEX_SOLO_DIGITOS)]],
    }, { updateOn: 'change' });

    await this.paisListData();
  }

  /**
   * Obtiene la lista de países emisores desde el servicio `chofer40101Service` y la asigna a la propiedad `paisList`.
   *
   * @returns {void}
   */
  async paisListData(): Promise<void> {
    try {
      const DATA = await firstValueFrom(this.chofer40101Service.getPaisEmisor().pipe(takeUntil(this.destroyed$)));
      this.paisList = DATA || [];
      if (this.paisList.length > 0) {
        this.formChoferes.controls['pais'].setValue("MEX");
        this.chofer40101Store.setDriver('nacional', { pais: "MEX" });
      }
      this.onPaisChange();
    } catch (error) {
      // Handle error
    }
  }

  /**
 * Maneja el cambio de país seleccionado, actualizando la lista de estados y reseteando los campos dependientes.
 * @returns {void}
 */
  onPaisChange(): void {
    const PAISID = this.formChoferes.get('pais')?.value;
    if (!PAISID) { return; }
    this.chofer40101Service.getEstadosPorPaisMex().pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.estadoList = data || [];
      this.formChoferes.controls['estado'].reset();
      this.formChoferes.controls['municipioAlcaldia'].reset();
      this.formChoferes.controls['colonia'].reset();
      const ESTADO = this.estadoList.length > 0 ? this.estadoList[0].clave : '';
      this.formChoferes.controls['estado'].setValue(ESTADO);
      this.chofer40101Store.setDriver('nacional', { estado: String(ESTADO) });
      this.onEstadoChange();
    });
  }

  /**
   * Maneja el cambio de estado seleccionado, actualizando la lista de municipios y reseteando los campos dependientes.
   * @returns {void}
   */
  onEstadoChange(): void {
    const ESTADOID = this.formChoferes.get('estado')?.value;
    if (!ESTADOID) { return; }
    this.chofer40101Store.setDriver('nacional', { estado: String(ESTADOID) });
    this.chofer40101Service.getMunicipiosPorEstado(ESTADOID).pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.municipioList = data || [];
      this.formChoferes.controls['colonia'].reset();
      const MUNICIPIO = this.municipioList.length > 0 ? String(this.municipioList[0].clave) : '';
      this.formChoferes.controls['municipioAlcaldia'].setValue(MUNICIPIO);
      this.chofer40101Store.setDriver('nacional', { municipioAlcaldia: MUNICIPIO, colonia: '' });
      this.onMunicipioChange();
    });
  }

  /**
   * Maneja el cambio de municipio seleccionado, actualizando la lista de colonias y reseteando el campo colonia.
   * @returns {void}
   */
  onMunicipioChange(): void {
    const MUNICIPIOID = this.formChoferes.get('municipioAlcaldia')?.value;
    if (!MUNICIPIOID) { return; }
    this.chofer40101Store.setDriver('nacional', { municipioAlcaldia: String(MUNICIPIOID) });
    this.chofer40101Service.getColoniasPorMunicipio(MUNICIPIOID).pipe(takeUntil(this.destroyed$)).subscribe(data => {
      this.coloniaList = data || [];
      const COLONIA = this.coloniaList.length > 0 ? String(this.coloniaList[0].clave) : '';
      this.formChoferes.controls['colonia'].reset()
      this.formChoferes.controls['colonia'].setValue(COLONIA)
      this.chofer40101Store.setDriver('nacional', { colonia: COLONIA })
    });
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
   * Limpia el formulario de choferes a sus valores predeterminados.
   * Este método reinicia todos los campos del formulario `formChoferes` con valores vacíos o por defecto,
   * permitiendo limpiar el formulario para una nueva entrada de datos.
   */
  limpiarFormulario(): void {
    this.formChoferes.reset();
    this.chofer40101Store.update({ driverInEdit: createInitialState().driverInEdit });
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
      const DATOS = this.formChoferes.getRawValue() as DatosDelChoferNacional;
      DATOS.pais = this.paisList.find(p => String(p.clave) === String(DATOS.pais))?.clave || '';
      DATOS.estado = this.estadoList.find(e => String(e.clave) === String(DATOS.estado))?.clave || '';
      DATOS.municipioAlcaldia = this.municipioList.find(m => String(m.clave) === String(DATOS.municipioAlcaldia))?.clave || '';
      DATOS.colonia = this.coloniaList.find(c => String(c.clave) === String(DATOS.colonia))?.clave || '';
      DATOS.paisDeResidencia = this.paisList.find(p => String(p.clave) === String(DATOS.paisDeResidencia))?.clave || '';

      if (this.isEditando && this.indiceEditando !== null) {
        this.addModalEvent.emit({ datos: DATOS, indice: this.indiceEditando });
      } else {
        this.addModalEvent.emit({ datos: DATOS });
      }
      this.isEditando = false;
      this.indiceEditando = null;
      this.cerrarModal();
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
   * Obtener datos para el conductor nacional usando CURP y RFC
   */
  ObtenerDatosConductorNacional(): void {
    const CURP_VALUE = this.formChoferes.get('curp')?.value;
    const RFC_VALUE = this.formChoferes.get('rfc')?.value;
    this.modificacarTerrestreService.buscarChoferNacional(CURP_VALUE, RFC_VALUE).subscribe((data: ApiResponseChofer) => {
      if (data && data.datos) {
        this.completarFormularioConDatos(data.datos);
        this.onEstadoChange();
      }
    });
  }
  /**
   * Función auxiliar para completar el formulario con datos del chofer.
   * @param DATOS Datos de la respuesta de la API
   */
  private completarFormularioConDatos(DATOS: ApiResponseChofer['datos']): void {
    const FORMDATA = {
      curp: DATOS.curp || '',
      rfc: DATOS.rfc || '',
      nombre: DATOS.nombre || '',
      primerApellido: DATOS.primer_apellido || '',
      segundoApellido: DATOS.segundo_apellido || '',
      numeroDeGafete: DATOS.numero_de_gafete || '',
      vigenciaGafete: DATOS.vigencia_del_gafete || '',
      calle: DATOS.domicilio?.calle || '',
      numeroExterior: DATOS.domicilio?.numero_exterior || '',
      numeroInterior: DATOS.domicilio?.numero_interior || '',
      estado: DATOS.domicilio?.estado || '',
      municipioAlcaldia: DATOS.domicilio?.municipio || '',
      colonia: DATOS.domicilio?.colonia || '',
      paisDeResidencia: DATOS.domicilio?.pais || '',
      ciudad: DATOS.domicilio?.localidad || '',
      localidad: DATOS.domicilio?.localidad || '',
      codigoPostal: DATOS.domicilio?.codigo_postal || '',
      telefono: DATOS.domicilio?.telefono || '',
      correoElectronico: DATOS.domicilio?.correo_electronico || '',
    };
    this.formChoferes.patchValue(FORMDATA);
    this.chofer40101Store.setDriver('nacional', FORMDATA);
  }

  /**
 * Método para iniciar la edición de un registro.
 * @param datos Datos del chofer a editar
 * @param indice Índice del registro en la tabla
 */
  editarRegistro(datos: DatosDelChoferNacional, indice: number): void {
    this.isEditando = true;
    this.indiceEditando = indice;
    this.formChoferes.patchValue(datos);
    this.chofer40101Store.setDriver('nacional', datos);
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