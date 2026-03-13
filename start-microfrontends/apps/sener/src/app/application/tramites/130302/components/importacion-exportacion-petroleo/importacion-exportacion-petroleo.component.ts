import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AlertComponent, InputFecha, InputFechaComponent, TituloComponent } from '@libs/shared/data-access-user/src';

import { ConfiguracionColumna } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';

import { AvisoValor, FECHA_DE_PAGO, NICO_TABLA, PRORROGA_DEL, PermisoModel } from '../../models/permiso-importacion.model';
import { PermisoPetroleoService } from '../../services/permiso-petroleo.service';

import { map, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';

import { AVISO_PRIVACIDAD, INFORMACION_DE_LA_OBRA_ARTE } from '../../enums/permiso-petroleo.enum';
import { ExportarIlustraciones130302State, Tramite130302Store } from '../../estados/tramite130302.store';
import { Tramite130302Query } from '../../estados/queries/tramite130302.query';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

/**
 * component ImportacionExportacionPetroleoComponent
 * description Componente para gestionar la importación y exportación de petróleo.
 * Proporciona formularios y tablas dinámicas para la gestión de datos relacionados.
 */
@Component({
  selector: 'app-importacion-exportacion-petroleo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent, TablaDinamicaComponent, FormasDinamicasComponent, AlertComponent, InputFechaComponent],
  templateUrl: './importacion-exportacion-petroleo.component.html',
  styleUrls: ['./importacion-exportacion-petroleo.component.scss']
})
export class ImportacionExportacionPetroleoComponent implements OnInit, OnDestroy {

   /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * property form
   * description Formulario reactivo principal del componente.
   */
  form!: FormGroup;

  /**
   * property destroyed$
   * description Subject para manejar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * property informacionFormData
   * description Información relacionada con la obra de arte.
   */
  public informacionFormData = INFORMACION_DE_LA_OBRA_ARTE;

  /**
   * property fechaInicioInput
   * description Fecha inicial de pago.
   */
  fechaInicioInput: InputFecha = FECHA_DE_PAGO;

  /**
   * property fechaInicioOutput
   * description Fecha de prórroga.
   */
  fechaInicioOutput: InputFecha = PRORROGA_DEL;

  /**
   * property forma
   * description Formulario reactivo para datos dinámicos.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({})
  });

  /**
   * property destroy$
   * description Subject para manejar la destrucción de suscripciones.
   */
  public destroy$ = new Subject<void>();

  /**
   * property aduanaAlert
   * description Mensaje de aviso de privacidad.
   */
  public aduanaAlert = AVISO_PRIVACIDAD;

  /**
   * property exportarIlustracionesState
   * description Estado relacionado con la exportación de ilustraciones.
   */
  public exportarIlustracionesState!: ExportarIlustraciones130302State;

  /**
   * property ninoFormGroup
   * description Getter para acceder al grupo de formularios de niños.
   */
  get ninoFormGroup(): FormGroup {
    return this.forma.get('ninoFormGroup') as FormGroup;
  }

/**
   * property tipoSeleccionTabla
   * description Tipo de selección para la tabla dinámica.
   */
  tipoSeleccionTabla = TablaSeleccion;

  /**
   * property tercerosProd
   * description Lista de modelos de permisos.
   */
  tercerosProd: PermisoModel[] = [];

  /**
   * constructor
   * description Constructor del componente.
   * param fb FormBuilder para la creación de formularios.
   * param service Servicio para gestionar permisos de petróleo.
   * param tramite130302Store Almacén de estado del trámite.
   * param tramite130302Query Consultas relacionadas con el trámite.
   */
  constructor(private fb: FormBuilder, private service: PermisoPetroleoService, private tramite130302Store: Tramite130302Store,
    private tramite130302Query: Tramite130302Query, private consultaioQuery: ConsultaioQuery,) 
    { }

  /**
   * property configuracionTabla
   * description Configuración de columnas para la tabla dinámica.
   */
  configuracionTabla: ConfiguracionColumna<PermisoModel>[] = NICO_TABLA;

  /**
   * method ngOnInit
   * description Inicializa el componente y carga datos iniciales.
   */
  ngOnInit(): void {

     this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe();

    this.configurarGrupoForm();
    this.loadMercancias();
    this.loadAsignacionData();
  }

  /**
 * @method configurarGrupoForm
 * @description Configures the reactive form group for the "Datos del Establecimiento RFC" component.
 * This method initializes the form group with default values and validation rules for the fields:
 * - `rfcDel`: Optional field with a maximum length of 254 characters.
 * - `denominacionRazonSocial`: Required field with a maximum length of 254 characters.
 * - `correoElectronico`: Required field with a valid email format and a maximum length of 320 characters.
 * 
 * @memberof DatosDelEstablecimientoRfcComponent
 */
  configurarGrupoForm(): void {
this.tramite130302Query.selectExportarIlustraciones$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.exportarIlustracionesState = seccionState;
        })
      )
      .subscribe();
    
      this.form = this.fb.group({
      saldoDisponible: [new FormControl({ value: '', disabled: true })],
      fechaPago: [this.exportarIlustracionesState?.fechaPago, { disabled: true }],
      prorrogaAl: [this.exportarIlustracionesState?.prorrogaAl, { disabled: true }],
      motivoJustificacion: new FormControl(this.exportarIlustracionesState?.motivoJustificacion),
      otrasDeclaraciones: new FormControl(this.exportarIlustracionesState?.otrasDeclaraciones),
      
    });
 /*
     * Si el formulario está en modo solo lectura, deshabilita todos los campos.
     * En caso contrario, habilita los campos para permitir la edición.
     * Esto asegura que el formulario refleje correctamente el estado de solo lectura.
     */
    if (this.esFormularioSoloLectura && this.form ) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  /**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.form.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.form, 'fechaPago', 'setfechaPago');
  }
  /**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
   */
  oncambioFechaPago(nuevo_fechaPago: string): void {
    this.form.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.form, 'prorrogaAl', 'setprorrogaAl');
  }


  /**
   * method loadAsignacionData
   * description Carga datos del solicitante y los asigna al formulario.
   */
  loadAsignacionData(): void {
    this.service.getSolicitante()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data: AvisoValor) => {
        this.form.patchValue({
          saldoDisponible: data.saldoDisponible,
         });
      });
  }

  /**
   * method loadMercancias
   * description Carga datos de mercancías y los asigna a la lista de productos.
   */
  loadMercancias(): void {
    this.service.obtenerTabla()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tercerosProd = resp;
      });
  }


  /**
   * method establecerCambioDeValor
   * description Establece un cambio de valor dinámico en el almacén.
   * param event Evento con el campo y valor a cambiar.
   */
  establecerCambioDeValor(event: { campo: string; valor: object | string }): void {
    if (event) {
      this.tramite130302Store.setDynamicFieldValue(event.campo, event.valor);
    }
  }

  /**
   * method setValoresStore
   * description Establece valores en el almacén desde el formulario.
   * param form Formulario reactivo.
   * param campo Nombre del campo en el formulario.
   * param metodoNombre Método del almacén para establecer el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite130302Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130302Store[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * method ngOnDestroy
   * description Limpia las suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

 
}
