/**
 * @component ConsultadDomicilios90305Component
 * @description
 * Este componente permite la consulta de domicilios relacionados con Prosec.
 * Utiliza un formulario reactivo con un campo de selección de estado basado en un catálogo.
 * Los datos del catálogo se obtienen del servicio `ProsecModificacionServiceTsService`.
 * El estado seleccionado se gestiona utilizando Akita para asegurar la persistencia del estado.
 */

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {
  ConsultaioQuery,
  TituloComponent
} from '@ng-mf/data-access-user';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Tramite90305State, Tramite90305Store } from '../../estados/tramite90305.store';
import { map, takeUntil } from 'rxjs/operators';
import { CatalogoResponse} from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';
import { Subject } from 'rxjs';
import { Tramite90305Query } from '../../estados/tramite90305.query';
/**
 * compo docs
 * @selector app-consultad-domicilios-90305
 * @standalone true
 */
@Component({
  selector: 'app-consultad-domicilios-90305',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './consultad-domicilios-90305.component.html',
  styleUrl: './consultad-domicilios-90305.component.scss',
})
export class ConsultadDomicilios90305Component implements OnInit, OnDestroy {
  /**
   * Evento emitido cuando se busca un domicilio
   * @type {EventEmitter<any>}
   */
 @Output() domicilioBuscado = new EventEmitter<string>();
  /** Catálogo de estados cargado desde un archivo JSON */
  estadoJson: CatalogoResponse[] = [];
  /** Formulario reactivo para la consulta de domicilios */
  formConsulta!: FormGroup;

  /** Catálogo de estados para mantener similitud con DeLaMuestraComponent */
  public estadoCatalogo!: CatalogoResponse[];
  /** Notificador de destrucción similar */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;

    /**
   * Estado de la solicitud de la sección.
   */
  public solicitudState!: Tramite90305State;

  /**
   * Constructor
   * @param {FormBuilder} fb - Constructor de formularios reactivos
   * @param {ProsecModificacionServiceTsService} listaDomicilios - Servicio para obtener los datos del catálogo
   * @param {Tramite90305Store} tramite90305Store - Store de Akita para gestionar el estado
   * @param {Tramite90305Query} tramite90305Query - Query de Akita para seleccionar el estado
   */
  constructor(
    private fb: FormBuilder,
    private listaDomicilios: ProsecModificacionServiceTsService,
    private tramite90305Store: Tramite90305Store,
    private tramite90305Query: Tramite90305Query,
    private consultaioQuery: ConsultaioQuery,
  ) {
    
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Método del ciclo de vida de Angular - inicializa el componente y configura el formulario
   */
  ngOnInit(): void {
    // Inicializa el formulario reactivo con un control para el estado
    this.formConsulta = this.fb.group({
      estadoControl: [{ value: this.solicitudState?.selectedEstado,disabled: false }, Validators.required],
    });

    this.loadEstado();

    
    this.inicializarEstadoFormulario();
      this.listaDomicilios.registrarFormulario(
      'formConsulta',
      this.formConsulta
    );
  }

  /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   * Además, obtiene la información del catálogo de estados.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
    this.getEstadoCatalogo();
  }
   
/**
 * Busca domicilios basados en el estado seleccionado en el formulario.
 * Si el formulario es inválido, marca todos los campos como tocados.
 */
buscarDomicilios() {
  
  if (this.formConsulta.invalid) {
    this.formConsulta.markAllAsTouched();
    return;
  }
  const ESTADO_SELECCIONADO = this.formConsulta.get('estadoControl')?.value;
  if (ESTADO_SELECCIONADO) {
  
    this.domicilioBuscado.emit(ESTADO_SELECCIONADO); // emit only the value

  }
}
  /**
   * Inicializa el formulario reactivo para capturar el estado seleccionado.
   */
    inicializarFormulario(): void {
      this.tramite90305Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe();
        
    }

  /**
   * Carga datos y deshabilita el formulario si es solo lectura.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    this.formConsulta = this.fb.group({
      estadoControl: [{ value: this.solicitudState?.selectedEstado,disabled: false }, Validators.required],
    });
    if (this.esFormularioSoloLectura) {
      this.formConsulta.disable();
    } else {
      this.formConsulta.enable();
    }
  }

  /**
   * Carga el catálogo de estados desde el servicio.
   */
  getEstadoCatalogo(): void {
    this.listaDomicilios
      .getEstadoData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp: CatalogoResponse[]) => {
        this.estadoCatalogo = resp;
      });
  }

  /**
   * Carga los datos del catálogo de estados desde el servicio
   */
  loadEstado(): void {
    this.listaDomicilios
      .getEstadoData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp: CatalogoResponse[]) => {
        this.estadoJson = resp;
      });
  }

  /**
   * Obtiene el estado seleccionado del formulario y lo guarda en el store
   */
  getMunicipios(): void {
    const SELECTED_ESTADO = this.formConsulta.get('estadoControl')?.value;
    this.tramite90305Store.setSelectedEstado(SELECTED_ESTADO);
  }

  /*
    * Método del ciclo de vida de Angular - destruye el componente
  */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
