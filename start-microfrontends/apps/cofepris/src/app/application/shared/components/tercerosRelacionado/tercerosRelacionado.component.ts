import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Catalogo, ConfiguracionColumna, MENSAJEDEALERTA, TituloComponent } from '@libs/shared/data-access-user/src';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { TablaSeleccion } from '@ng-mf/data-access-user';

import {PermisoModel } from '../../models/aviso-exportacion.model'

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExportacionService } from '../../services/exportacion.service';

import { Subject, map, takeUntil } from 'rxjs';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';

import { ExportacionState } from '../../estados/stores/exportacion.store';

import { ExportacionStore } from '../../estados/stores/exportacion.store'; 

import { ExportacionQuery } from '../../../shared/estados/queries/exportacion.query';

import { InputRadioComponent } from '@libs/shared/data-access-user/src';

import { PreOperativo } from '../../../shared/models/datos-modificacion.model';

import { NICO_TABLA } from '../../models/aviso-exportacion.model';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

/**
 * component TercerosRelacionadoComponent
 * description Componente para gestionar la relación de terceros en el sistema.
 * Proporciona funcionalidades para cargar datos, manejar formularios y gestionar el estado.
 */
@Component({
  selector: 'app-terceros-relacionado',
  standalone: true,
  imports: [CommonModule,AlertComponent , TituloComponent,TablaDinamicaComponent,CatalogoSelectComponent,FormsModule,ReactiveFormsModule,InputRadioComponent],
  templateUrl: './tercerosRelacionado.component.html',
  styleUrl: './tercerosRelacionado.component.css',
})
export class TercerosRelacionadoComponent implements OnInit, OnDestroy {

   /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false; 

  /**
   * property solicitudState
   * description Estado actual de la solicitud.
   */
  public solicitudState!: ExportacionState;

  /**
   * property facturatorForm
   * description Formulario reactivo para gestionar los datos del facturador.
   */
  facturatorForm!: FormGroup;

  /**
   * property destroyed$
   * description Sujeto para manejar la destrucción de suscripciones.
   */
  private destroyed$ = new Subject<void>();

  /**
   * property TEXTOS
   * description Textos de alerta utilizados en el componente.
   */
  public TEXTOS = MENSAJEDEALERTA;

  /**
   * property infoAlert
   * description Clase CSS para mostrar alertas informativas.
   */
  public infoAlert = 'alert-info';

  /**
   * property modal
   * description Estado del modal.
   */
  public modal = 'modal';

  /**
   * property tipoPersonaOptions
   * description Opciones para el tipo de persona (física o moral).
   */
  tipoPersonaOptions: PreOperativo[] = [];
  /**
   * property localidadList
   * description Lista de localidades cargadas desde el servicio.
   */
  public localidadList!: Catalogo[];

  /**
   * property TablaSeleccion
   * description Configuración de la tabla de selección.
   */
  tipoSeleccionTabla = TablaSeleccion;

  /**
   * property tercerosProd
   * description Lista de productos de terceros.
   */
  tercerosProd: PermisoModel[] = [];

  /**
   * constructor
   * param fb FormBuilder para crear formularios reactivos.
   * param service Servicio para manejar datos de exportación.
   * param tramites260604Store Almacén para gestionar el estado de los trámites.
   * param tramites260604Query Consulta para obtener datos del estado de los trámites.
   */
  constructor(
    private fb: FormBuilder,
    private service: ExportacionService,
    private exportacionStore: ExportacionStore,
    private exportacionQuery: ExportacionQuery,
     private consultaioQuery: ConsultaioQuery,
  ) {
    //constructor
  }

  /**
   * property closeModal
   * description Referencia al elemento del modal para cerrarlo.
   */
  @ViewChild('closeModal') closeModal!: ElementRef;

  /**
   * property configuracionTabla
   * description Configuración de las columnas de la tabla.
   */
  configuracionTabla: ConfiguracionColumna<PermisoModel>[] = NICO_TABLA;



  /**
   * method ngOnInit
   * description Método de inicialización del componente.
   */
  ngOnInit(): void {
   
this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
    this.loadMercancias();
    this.loadLocalidad();
    this.getFacturator()
    this.cargarRadio();
    this. inicializarEstadoFormulario();
  }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.getFacturator();
    }  
    
  }

   /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  guardarDatosFormulario(): void {
      this.getFacturator();
      if (this.esFormularioSoloLectura) {
        this.facturatorForm.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.facturatorForm.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }


  cargarRadio(): void {
    this.service.obtenerRadio()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tipoPersonaOptions = resp;
      });
  }
  /**
   * method loadMercancias
   * description Carga los datos de mercancías desde el servicio.
   */
  loadMercancias(): void {
    this.service.obtenerTabla()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp) => {
        this.tercerosProd = resp;
      });
  }

  /**
   * method loadLocalidad
   * description Carga los datos de localidades desde el servicio.
   */
  loadLocalidad(): void {
    this.service.obtenerDatosLocalidad()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.localidadList = data as Catalogo[];
      });
  }

  /**
   * method abrirModalfacurator
   * description Abre el modal para gestionar el facturador.
   */
  abrirModalfacurator(): void {
    this.modal = 'show';
    this.getFacturator();
  }

  /**
   * method getFacturator
   * description Inicializa el formulario del facturador con valores predeterminados.
   */
  getFacturator(): void {
    this.exportacionQuery.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState as ExportacionState;
        })
      )
      .subscribe();
    this.facturatorForm = this.fb.group({
      tipoPersona: [this.solicitudState?.tipoPersona || 'fisica', Validators.required],
      nombre: [this.solicitudState?.nombre || '', [Validators.required]],
      apellidoPrimer: [this.solicitudState?.apellidoPrimer || '', Validators.required],
      apellidoSegundo: [this.solicitudState?.apellidoSegundo || ''],
      denominacionRazonSocial: [this.solicitudState?.denominacionRazonSocial || '', [Validators.maxLength(254)]],
      selectPais: [this.solicitudState?.denominacionRazonSocial || '', Validators.required],
      estadoLocalidad: [this.solicitudState?.estadoLocalidad || '', Validators.required],
      codPostal1: [this.solicitudState?.codPostal1 || ''],
      calle: [this.solicitudState?.calle || '', [Validators.maxLength(300)]],
      numExterior: [this.solicitudState?.numExterior || '', [Validators.maxLength(55)]],
      numInterior: [this.solicitudState?.numInterior || '', [Validators.maxLength(55)]],
      lada: [this.solicitudState?.lada || '', [Validators.maxLength(5)]],
      telefono: [this.solicitudState?.telefono || ''],
      correoElectronico: [this.solicitudState?.correoElectronico || '', [Validators.required, Validators.email]],
    });
  }

   /**
   * method setValoresStore
   * description Establece valores en el almacén de trámites.
   * param form Formulario reactivo.
   * param campo Nombre del campo del formulario.
   * param metodoNombre Método del almacén a invocar.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof ExportacionStore): void {
    const VALOR = form.get(campo)?.value;
    (this.exportacionStore[metodoNombre] as (value: string) => void)(VALOR);
  }

  /**
   * property fisica
   * description Indica si el tipo de persona es física.
   */
  public fisica = false;

  /**
   * property moral
   * description Indica si el tipo de persona es moral.
   */
  public moral = false;

  /**
   * method inputChecked
   * description Cambia el estado de los checkboxes según el tipo de persona.
   * param checkBoxName Nombre del checkbox seleccionado.
   */
  public inputChecked(checkBoxName: string): void {
    if (checkBoxName === 'fisica') {
      this.fisica = true;
      this.moral = false;
    } else {
      this.fisica = false;
      this.moral = true;
    }
  }

  /**
   * method cambiarRadioFisica
   * description Cambia el estado del radio button según el valor seleccionado.
   * param value Valor seleccionado.
   */
  cambiarRadioFisica(value: string | number): void {
    const VALOR_SELECCIONADO = value as string;
    this.inputChecked(VALOR_SELECCIONADO);
  }

  /**
   * method ngOnDestroy
   * description Método para limpiar suscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
