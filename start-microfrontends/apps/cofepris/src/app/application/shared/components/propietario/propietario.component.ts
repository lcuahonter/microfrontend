/**
 * @fileoverview Componente `PropietarioComponent`
 * Este componente gestiona el formulario relacionado con los datos del propietario,
 * incluyendo información personal, dirección, y otros datos relevantes. También permite
 * la interacción con un modal para agregar o editar propietarios, y la actualización del estado global.
 */

import { CommonModule } from '@angular/common';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Modal } from 'bootstrap';

import { Subject, map, takeUntil } from 'rxjs';

import {
  ConfiguracionColumna,
  InputRadioComponent,
  TablaSeleccion,
  TituloComponent,
  doDeepCopy,
  esValidObject,
  getValidDatos,
} from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';


import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';

import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';

import { PropietarioModel, PropietarioRadio, PropietarioTipoPersona } from '../../models/datos-de-la-solicitud.model';

import { EstablecimientoComponent } from '../establecimiento/establecimiento.component';
import { EstablecimientoService } from '../../services/establecimiento.service';

import { ESTABLECIMIENTO_TABLE_CONFIG } from '../../constantes/aviso-de-funcionamiento.enum';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { Notificacion } from '@libs/shared/data-access-user/src';
import { NotificacionesService } from '@libs/shared/data-access-user/src/core/services/shared/notificaciones.service';
/*
* @description
*/ 
@Component({
  selector: 'app-propietario',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputRadioComponent,
    TablaDinamicaComponent,
    ReactiveFormsModule,
    FormsModule,
    EstablecimientoComponent,
    TooltipModule
  ],
  templateUrl: './propietario.component.html',
  styleUrl: './propietario.component.scss',
})
export class PropietarioComponent implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Referencia al modal de propietario.
   */
  @ViewChild('propietarioModal', { static: false }) propietarioModal!: ElementRef;

  /**
   * Subject utilizado para destruir las suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * Formulario para gestionar los datos personales del propietario.
   */
  formTercerosDatos!: FormGroup;

  /**
   * Formulario para gestionar los datos del radio de propietario.
   */
  propietarioradioForm!: FormGroup;

  /**
   * Datos del catálogo de tipo de persona.
   */
  propietarioTipoPersonaData : PropietarioTipoPersona[]=[];

  /**
   * Datos del catálogo de opciones de radio.
   */
  propietarioRadioData: PropietarioRadio[] = [];

  /**
   * Instancia del modal de Bootstrap.
   */
  modalInstance!: Modal;

  /**
   * Datos de los propietarios agregados.
   */
  propietarioData: PropietarioModel[] = [];

  /**
   * Un arreglo que contiene los datos de las sociedades seleccionadas.
   * Se utiliza para almacenar temporalmente las sociedades que el usuario ha seleccionado
   * para realizar acciones específicas, como eliminar o modificar sus datos.
   */
  public seleccionarlistaSociedades: PropietarioModel[] = [];

  /**
   * Valor seleccionado en el formulario.
   */
  selectedValue: string = '';

  /**
   * Indicador para mostrar los datos personales.
   */
  showDatosPersonales = false;

  /**
   * Indicador para mostrar el botón de búsqueda.
   */
  showBuscarButton = false;

  /** 
   * Indicador para mostrar el botón de búsqueda de CURP. 
   */
  mostrarBuscarCurpBtn = false;

  /**
   * Valor mostrado en el formulario.
   */
  showValue: string = '';

  /**
   * Indica el valor actual para mostrar información relacionada con terceros.
   * 
   * @remarks
   * Esta propiedad se utiliza para controlar la visualización de secciones o componentes
   * relacionados con terceros dentro del componente propietario.
   * 
   * @defaultValue ''
   */
  mostrarTerceros: string = '';

/**
 * Indica si el formulario debe mostrarse en modo solo lectura.
 * Cuando es verdadero, los campos del formulario no pueden ser editados por el usuario.
 */
 esFormularioSoloLectura: boolean = false;

 /** Cadena que representa los trámites recibidos desde el componente padre,  
 *  utilizada para configurar o mostrar información relacionada. */
 @Input() public tramites!: string;
 
 /** Indica si la tabla se encuentra vacía  
 *  y permite controlar la visualización en la interfaz. */
 public tablaVacia: boolean = false;

  /**
   * @description Identificador del procedimiento asociado al trámite.
   */
  @Input() idProcedimiento!: number;

 /** Referencia al componente de establecimiento obtenido mediante template reference,  
 *  usada para acceder a sus métodos y propiedades desde este componente. */
 @ViewChild('EstablecimientoComponent') establecimientoComponent!: EstablecimientoComponent;

  /** Notificación seleccionada para mostrar mensajes al usuario,  
   *  como alertas o confirmaciones, en función de las acciones realizadas. */

 public seleccionarFilaNotificacion!: Notificacion;
  /** Indica si se ha hecho clic en el botón de búsqueda. */

 public buscarClicked: boolean = false;

  /**
   * Indica si hay un registro seleccionado en la tabla.
   */
  selectedRecord: boolean = false;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para inicializar formularios reactivos.
   * @param propietarioStore Store para gestionar el estado del propietario.
   * @param propietarioQuery Query para obtener el estado inicial del propietario.
   */
  constructor(
    private fb: FormBuilder,
    private propietarioStore: DatosDelSolicituteSeccionStateStore,
    private propietarioQuery: DatosDelSolicituteSeccionQuery,
    private establecimientoService : EstablecimientoService,
    private consultaQuery: ConsultaioQuery,
    private notificacionesService: NotificacionesService
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }

  /**
   * Ciclo de vida `AfterViewInit`.
   * Inicializa la instancia del modal de Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.propietarioModal) {
      this.modalInstance = new Modal(this.propietarioModal.nativeElement);
    }
  }

  /**
   * Enum para la selección de tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Ciclo de vida `OnInit`.
   * Inicializa los formularios y carga los datos iniciales.
   */
  ngOnInit(): void {
    this.propietarioradioForm = this.fb.group({
      tercerosTipoPersona: [null, Validators.required],
      tercerosCurp: [null, [Validators.required, Validators.maxLength(254)]],
      tercerosNacionalidad: [null, Validators.required],
      tercerosRfc: [null, Validators.required],
    });

    this.formTercerosDatos = this.fb.group({
      tercerosDenominacionRazonSocial: [
        { value: null, disabled: true },
        Validators.required,
      ],
      tercerosPais: ['', Validators.required],
      tercerosEstadoLocalidad: ['', Validators.required],
      tercerosMunicipioAlcaldia: ['', Validators.required],
      tercerosLocalidad: ['', Validators.required],
      tercerosColonia: ['', Validators.required],
      tercerosCodigoPostal: ['', Validators.required],
      tercerosCalle: ['', Validators.required],
      tercerosNumeroExterior: ['', Validators.required],
      tercerosNumeroInterior: [''],
      tercerosTelefono: [''],
      tercerosCorreoElectronico: [''],
      tercerosLada: [''],
      tercerosNombre: ['', Validators.required],
      tercerosSegundoApellido: [''],
      tercerosPrimerApellido: ['', Validators.required],
    });

     this.inicializarFormulario();
  }

  /**
   * Inicializa el estado del formulario según el modo de solo lectura.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    }
  }

    /**
     * Guarda los datos del formulario y ajusta el estado de solo lectura.
     */
    guardarDatosFormulario(): void {
      if (this.esFormularioSoloLectura) {
        this.propietarioradioForm?.disable();
      } else {
        this.propietarioradioForm.enable();
      } 
    }

    /**
     * Inicializa los formularios y carga los datos iniciales de propietario, tipo de persona y radio.
     */
    inicializarFormulario(): void {
      this.propietarioQuery
      .select('propietarioData')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.propietarioData = data;
      });

      this.establecimientoService
      .getPropietarioRadioData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PropietarioRadio[]) => {
        this.propietarioRadioData = data; 
      });

      this.establecimientoService
      .getPropietarioTipoPersonaData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: PropietarioTipoPersona[]) => {
        this.propietarioTipoPersonaData = data; 
      });
    }

  /**
   * Configuración de columnas de la tabla.
   */
  configuracionTabla: ConfiguracionColumna<PropietarioModel>[] =ESTABLECIMIENTO_TABLE_CONFIG;

  /**
   * Guarda un nuevo propietario y actualiza el estado global.
   */
  guardarPropietario(): void {
    const RFC = this.propietarioradioForm.get('tercerosRfc')?.value;
    const CURP = this.propietarioradioForm.get('tercerosCurp')?.value;
    const NOMBRE = `${this.formTercerosDatos?.get('tercerosDenominacionRazonSocial')?.value}`.trim() ||
    `${this.formTercerosDatos?.get('tercerosNombre')?.value} ${this.formTercerosDatos?.get('tercerosPrimerApellido')?.value} ${this.formTercerosDatos?.get('tercerosSegundoApellido')?.value}`.trim();
   
    if (!RFC && (this.mostrarTerceros === 'Nacional' && (this.showValue === 'Moral' || this.showValue === 'Física'))) {
      this.seleccionarFilaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Haga click en el botón buscar del campo R.F.C',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.notificacionesService.showNotification(this.seleccionarFilaNotificacion);
      return;
    }

    if (!this.buscarClicked && (this.mostrarTerceros === 'Nacional' && (this.showValue === 'Moral' || this.showValue === 'Física'))) {
      this.seleccionarFilaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: '',
        mensaje: 'Haga click en el botón buscar del campo R.F.C',
        cerrar: true,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
      this.notificacionesService.showNotification(this.seleccionarFilaNotificacion);
      return;
    }

   
    this.buscarClicked = false;

    const PROPIETARIO: PropietarioModel = {
      NombredenominacionORazonSocial: NOMBRE,
      rfc: RFC,
      curp: CURP,
      telefono: this.formTercerosDatos.get('tercerosTelefono')?.value,
      CorreoElectronico:
        this.formTercerosDatos.get('tercerosCorreoElectronico')?.value,
      calle: this.formTercerosDatos.get('tercerosCalle')?.value,
      numeroExterior:
        this.formTercerosDatos.get('tercerosNumeroExterior')?.value,
      numeroInterior:
        this.formTercerosDatos.get('tercerosNumeroInterior')?.value,
      pais: this.formTercerosDatos.get('tercerosPais')?.value,
      colonia: this.formTercerosDatos.get('tercerosColonia')?.value,
      municipioOAlcaldia:
        this.formTercerosDatos.get('tercerosMunicipioAlcaldia')?.value,
      localidad: this.formTercerosDatos.get('tercerosLocalidad')?.value,
      entidadFederativa: this.formTercerosDatos.get('tercerosEstadoLocalidad')?.value,
      estadoLocalidad: '---',
      codigoPostal:
        this.formTercerosDatos.get('tercerosCodigoPostal')?.value,
    };

  const IS_EMPTY = Object.values(PROPIETARIO).every((value) => !value);

    if (IS_EMPTY) {
      return;
    }

  const UPDATED_DATA = [...this.propietarioData, PROPIETARIO];

   this.propietarioStore.update({ propietarioData: UPDATED_DATA });

    this.formTercerosDatos.reset();
    this.propietarioradioForm.reset();
    this.closePropietarioModal();
  }

  /**
   * Abre el modal de propietario.
   */
  openPropietarioModal(): void {
    if (this.propietarioModal) {
      this.modalInstance.show();
    }
    this.limpiarFormulario(); 
    this.formTercerosDatos.disable();
     this.propietarioradioForm.get('tercerosCurp')?.disable();
     this.propietarioradioForm.get('tercerosRfc')?.disable();
  }

  modificar(): void {
    if (this.propietarioModal) {
      this.modalInstance.show();
      this.formTercerosDatos.disable();
      this.propietarioradioForm.get('tercerosCurp')?.disable();
      this.propietarioradioForm.get('tercerosRfc')?.disable();
      if (this.seleccionarlistaSociedades.length > 0) {
        this.propietarioradioForm.patchValue({
          tercerosCurp: this.seleccionarlistaSociedades[0].curp,
          tercerosRfc: this.seleccionarlistaSociedades[0].rfc,
        })

        this.formTercerosDatos.patchValue({
          tercerosNombre: this.seleccionarlistaSociedades[0].NombredenominacionORazonSocial,
          tercerosDenominacionRazonSocial: this.seleccionarlistaSociedades[0].NombredenominacionORazonSocial,
          tercerosPais: this.seleccionarlistaSociedades[0].pais,
          tercerosEstadoLocalidad: this.seleccionarlistaSociedades[0].entidadFederativa,
          tercerosMunicipioAlcaldia: this.seleccionarlistaSociedades[0].municipioOAlcaldia,
          tercerosLocalidad: this.seleccionarlistaSociedades[0].localidad,
          tercerosColonia: this.seleccionarlistaSociedades[0].colonia,
          tercerosCodigoPostal: this.seleccionarlistaSociedades[0].codigoPostal,
          tercerosCalle: this.seleccionarlistaSociedades[0].calle,
          tercerosNumeroExterior: this.seleccionarlistaSociedades[0].numeroExterior,
          tercerosNumeroInterior: this.seleccionarlistaSociedades[0].numeroInterior,
          tercerosTelefono: this.seleccionarlistaSociedades[0].telefono,
          tercerosCorreoElectronico: this.seleccionarlistaSociedades[0].CorreoElectronico,
          tercerosSegundoApellido: this.seleccionarlistaSociedades[0].NombredenominacionORazonSocial,
          tercerosPrimerApellido: this.seleccionarlistaSociedades[0].NombredenominacionORazonSocial,
        });
      }
    }
  }

  /**
   * Cierra el modal de propietario.
   */
  closePropietarioModal(): void {
    if (this.propietarioModal) {
      this.modalInstance.hide();
    }
  }


  /**
   * Resets the form data when switching between "Física" and "Moral".
   */
  resetFormOnSwitch(): void {
    const CURRENTTIPOPERSONA = this.propietarioradioForm.get('tercerosTipoPersona')?.value;
    this.propietarioradioForm.reset();
    this.formTercerosDatos.reset();
    if (CURRENTTIPOPERSONA) {
      this.propietarioradioForm.patchValue({ tercerosTipoPersona: CURRENTTIPOPERSONA });
    }
  }

  /**
   * Maneja el cambio de selección en el formulario.
   * @param value Valor seleccionado.
   */
  onSelectionChange(value: string): void {
   

    this.showBuscarButton = value !== '';
    this.showValue = value;

    if (this.mostrarTerceros === 'Nacional' && this.showValue === 'No contribuyente') {
      this.formTercerosDatos.disable();
      this.propietarioradioForm.get('tercerosCurp')?.enable();
      this.propietarioradioForm.get('tercerosRfc')?.disable();
      this.showBuscarButton = false;
      this.mostrarBuscarCurpBtn = true;
    } else if (this.mostrarTerceros === 'Nacional' && (this.showValue === 'Física' || this.showValue === 'Moral')) {
      this.formTercerosDatos.disable();
      this.propietarioradioForm.get('tercerosRfc')?.enable();
      this.showBuscarButton = true;
      this.mostrarBuscarCurpBtn = false;
    } else {
      this.formTercerosDatos.enable();
      this.propietarioradioForm.get('tercerosRfc')?.enable();
      this.propietarioradioForm.get('tercerosCurp')?.disable();
      this.showBuscarButton = true;
      this.mostrarBuscarCurpBtn = false;
    }

  }

  /**
   * Maneja el cambio de radio en el formulario.
   * @param value Valor seleccionado.
   */
  onRadioChange(value: string | number): void {
    this.showDatosPersonales = value === 'Nacional';
    this.mostrarTerceros = String(value);

    if (this.mostrarTerceros === 'Extranjero') {
      this.propietarioTipoPersonaData = this.propietarioTipoPersonaData.filter(
        (option) => option.value === 'Física' || option.value === 'Moral'
      );
    } else {
      
      this.establecimientoService
        .getPropietarioTipoPersonaData()
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: PropietarioTipoPersona[]) => {
          this.propietarioTipoPersonaData = data;
        });
    }
  }

  /**
   * Limpia todos los campos del formulario.
   */
  limpiarFormulario(): void {
    this.propietarioradioForm.reset();
    this.formTercerosDatos.reset();
  }

  /**
   * Busca los datos del representante por RFC y los actualiza en el formulario.
   */
buscarRepresentanteRfc(): void {
  this.buscarClicked = true;
  const RFC = this.propietarioradioForm.get('tercerosRfc')?.value;
  if (RFC) {
    this.establecimientoService
      .getRepresentanteByRfc(RFC, this.tramites)
      .pipe(takeUntil(this.destroy$))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((response: any) => {
        if (response && response.datos && response.datos.length > 0) {
          const RESPONSE = response.datos[0].contribuyente;
          const DOMICILIO = RESPONSE.domicilio;
          this.formTercerosDatos.patchValue({
            tercerosNombre: RESPONSE.nombre || '',
            tercerosPrimerApellido: RESPONSE.apellido_paterno || '',
            tercerosSegundoApellido: RESPONSE.apellido_materno || '',
            tercerosDenominacionRazonSocial: RESPONSE.razon_social || '',
            tercerosPais: DOMICILIO.pais?.nombre || '',
            tercerosEstadoLocalidad: DOMICILIO.entidad_federativa?.nombre || '',
            tercerosMunicipioAlcaldia: DOMICILIO.delegacion_municipio?.nombre || '',
            tercerosLocalidad: DOMICILIO.localidad?.nombre || '',
            tercerosCodigoPostal: DOMICILIO.cp || '',
            tercerosColonia: DOMICILIO.colonia?.nombre || '',
            tercerosCalle: DOMICILIO.calle || '',
            tercerosNumeroExterior: DOMICILIO.num_exterior || '',
            tercerosNumeroInterior: DOMICILIO.num_interior || '',
            tercerosLada: '',
            tercerosTelefono: RESPONSE.telefono || '',
            tercerosCorreoElectronico: RESPONSE.correo_electronico || '',
          });
          this.propietarioradioForm.patchValue({
            tercerosCurp: RESPONSE.curp || '',
          });
        }
      });
  }
}

/** 
 * Busca los datos del representante por CURP y los actualiza en el formulario.
 */
curpBuscar(): void {
  const CURP = this.propietarioradioForm.get('tercerosCurp')?.value;
  if(getValidDatos(CURP)) {
    this.establecimientoService.getCURPBuscar(CURP)
    .pipe(takeUntil(this.destroy$))
    .subscribe((response) => {
      if(esValidObject(response)) {
        const API_RESPONSE = doDeepCopy(response);
        if(esValidObject(API_RESPONSE.datos)) {
          const RESPONSE = API_RESPONSE.datos[0].contribuyente;
          const DOMICILIO = RESPONSE.domicilio;
          this.formTercerosDatos.patchValue({
            tercerosNombre: RESPONSE.nombre || '',
            tercerosPrimerApellido: RESPONSE.apellido_paterno || '',
            tercerosSegundoApellido: RESPONSE.apellido_materno || '',
            tercerosDenominacionRazonSocial: RESPONSE.razon_social || '',
            tercerosPais: DOMICILIO.pais?.nombre || '',
            tercerosEstadoLocalidad: DOMICILIO.entidad_federativa?.nombre || '',
            tercerosMunicipioAlcaldia: DOMICILIO.delegacion_municipio?.nombre || '',
            tercerosLocalidad: DOMICILIO.localidad?.nombre || '',
            tercerosCodigoPostal: DOMICILIO.cp || '',
            tercerosColonia: DOMICILIO.colonia?.nombre || '',
            tercerosCalle: DOMICILIO.calle || '',
            tercerosNumeroExterior: DOMICILIO.num_exterior || '',
            tercerosNumeroInterior: DOMICILIO.num_interior || '',
            tercerosLada: '',
            tercerosTelefono: RESPONSE.telefono || '',
            tercerosCorreoElectronico: RESPONSE.correo_electronico || '',
          });
          this.propietarioradioForm.patchValue({
            tercerosCurp: RESPONSE.curp || '',
          });
        }
      }
    });
  }
}

/** Selecciona una lista de propietarios.
 * @param event Evento de selección con la lista de propietarios seleccionados.
 */
  public seleccionarlistaPropietario(event: PropietarioModel[]): void {
    this.seleccionarlistaSociedades = event;
  }

  /** 
   * Elimina los propietarios seleccionados de la lista. 
   */
  public eliminarPropietario(): void {
    if (this.seleccionarlistaSociedades.length > 0) {
      this.propietarioData = this.propietarioData.filter(item => {

        return !this.seleccionarlistaSociedades.some(selectedItem =>
          selectedItem.rfc === item.rfc &&
          (selectedItem.NombredenominacionORazonSocial === item.NombredenominacionORazonSocial && 
          selectedItem.CorreoElectronico === item.CorreoElectronico &&
            selectedItem.calle === item.calle &&
            selectedItem.numeroExterior === item.numeroExterior &&
            selectedItem.numeroInterior === item.numeroInterior &&
            selectedItem.pais === item.pais &&
            selectedItem.colonia === item.colonia &&
            selectedItem.municipioOAlcaldia === item.municipioOAlcaldia &&
            selectedItem.localidad === item.localidad &&
            selectedItem.entidadFederativa === item.entidadFederativa &&
            selectedItem.estadoLocalidad === item.estadoLocalidad &&
            selectedItem.codigoPostal === item.codigoPostal
          )
        );
      });

      this.seleccionarlistaSociedades = [];
      this.propietarioStore.setDynamicFieldValue('Sociedades', this.propietarioData);
    }
  }

/** Valida los formularios del componente de establecimiento,  
 *  devolviendo `true` si todos son correctos o `false` en caso contrario. */
validarFormularios(): boolean { 
  const ESTABLECIMIENTO_VALIDO = this.establecimientoComponent?.validarEstablecimientoFormularios?.() ?? false;
  return ESTABLECIMIENTO_VALIDO;
}

  /**
   * Maneja la selección de filas en la tabla.
   * @param event Evento de selección de fila.
   */
  onRowSelected(event: any): void {
    this.selectedRecord = event ? true : false;
  }

  /**
   * Ciclo de vida `OnDestroy`.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}