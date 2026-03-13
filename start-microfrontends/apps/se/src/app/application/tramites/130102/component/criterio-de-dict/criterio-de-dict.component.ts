/* eslint-disable @nx/enforce-module-boundaries */
/**
 * CriterioDeDictComponent es un componente que maneja la selección de solicitudes de mercancía.
 * @packageDocumentation
 * @module CriterioDeDictComponent
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Catalogo, ConsultaioQuery } from '@ng-mf/data-access-user';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CatalogoSelectClaveComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select-clave/catalogo-select.component';
import { CommonModule } from '@angular/common';
import SolicitudMercanciaValues from 'libs/shared/theme/assets/json/130102/solicitud_mercancia.json';

import { TituloComponent } from '@ng-mf/data-access-user';

import {
  Solicitud130102State,
  Tramite130102Store,
} from '../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../estados/queries/tramite130102.query';

import { Subject, Subscription, map, takeUntil } from 'rxjs';
import { FormularioRegistroService } from '../../services/octava-temporal.service';
import { CatOctavaTemporalService } from '../../services/cat-octava-temporal.service';
import { distinctUntilChanged } from 'rxjs/operators';
/**
 * CriterioDeDictComponent es un componente que maneja la selección de solicitudes de mercancía.
 */
@Component({
  selector: 'app-criterio-de-dict',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    CatalogoSelectClaveComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './criterio-de-dict.component.html',
  styleUrl: './criterio-de-dict.component.scss',
})
export class CriterioDeDictComponent implements OnInit , OnDestroy {
   /**
   * Suscripción a los cambios en el formulario react
   */
  private subscription: Subscription = new Subscription();
  /**
   * Configuración del formulario de criterio de dictamen.
   */
  frmCriterioDictamen!: FormGroup;

  /**
   * Solicitudes de mercancía disponibles.
   * @type {Catalogo[]} - Las solicitudes de mercancía disponibles.
   */
  solicitudMercanciaLista: Catalogo[] = [];


/**
 * Estado del textarea de criterio de dictamen.
 */
  criteroDisabled: boolean = true;

  /*
  **    * Valor del criterio de dictamen.
  */
  dataCriteroDictamen: string = '';

  /**
   * Solicitud de mercancía seleccionada.
   */
  seleccionadaSolicitudMercancia: Catalogo = { id: 0, descripcion: '' };
  /**
   * Estado de la solicitud.
   * @type {Solicitud130102State}
   */
  public solicitudState!: Solicitud130102State;
  /**
   * Notificador para destruir el componente.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Indica si el formulario es de solo lectura.
   * @type {boolean}
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Inicializa el componente CriterioDeDict.
   * @constructor
   * @param {FormBuilder} fb - El constructor de formularios.
   * @returns void
   * @description Inicializa el componente CriterioDeDict.
   */
  constructor(
    private fb: FormBuilder,
    private tramite130102Store: Tramite130102Store,
    private tramite130102Query: Tramite130102Query,
    private formularioRegistroService: FormularioRegistroService,
    private consultaioQuery: ConsultaioQuery,
    private catOctavaTemporalService: CatOctavaTemporalService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

      
    this.tramite130102Query.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(state => ({
          fraccionArancelaria: state.fraccionArancelaria,
          regimen: state.regimen,
          clasificacionRegimen: state.clasificacionRegimen
        })),
        distinctUntilChanged((prev, curr) =>
          prev.fraccionArancelaria === curr.fraccionArancelaria &&
          prev.regimen === curr.regimen &&
          prev.clasificacionRegimen === curr.clasificacionRegimen
        )
      )
      .subscribe(({ fraccionArancelaria, regimen, clasificacionRegimen }) => {
        if (fraccionArancelaria && regimen && clasificacionRegimen) {
          this.obtenerCatEsquemaRegla();
        }
      });
  }

  /**
   * Maneja la selección de una solicitud de mercancía.
   * @param e - La solicitud de mercancía seleccionada.
   */
  fetchSolicitudMercancia(e: any): void {

  
  }

  /*
  **    * Obtiene el catálogo de esquema de regla octava.
  */
  obtenerCatEsquemaRegla(): void {
    this.catOctavaTemporalService.getEsquemaReglaOctava(
      this.solicitudState.fraccionArancelaria || '', 
      this.solicitudState.regimen || '', 
      this.solicitudState.clasificacionRegimen || '').subscribe((data) => {
      this.solicitudMercanciaLista = data.datos.map((item, index) => ({
        id: index,
        clave: item.clave,
        descripcion: item.descripcion,
      }));  
    }); 
    this.dataCriteroDictamen = '';
  } 

  /**
   * Asigna un valor del formulario al store.
   *
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Campo del formulario a obtener.
   * @param {keyof Tramite130102Store} metodoNombre - Método del store donde se guardará el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite130102Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130102Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  setCriterioDictamenText(form: FormGroup): void {
    const idSolicitud = form.get('solicitudMercancia')?.value;
 
    const solicitudSeleccionada = this.solicitudMercanciaLista.find(
      (solicitud) => solicitud.clave === idSolicitud 
    );

    if (solicitudSeleccionada) {
      this.tramite130102Store.setCriterioDictamen(solicitudSeleccionada.descripcion);
      this.frmCriterioDictamen.setValue({
        solicitudMercancia: idSolicitud,
        criterioDictamen: solicitudSeleccionada.descripcion,
      });
      this.dataCriteroDictamen = solicitudSeleccionada.descripcion;
    }
  }




  /**
   * Obtiene las solicitudes de mercancía.
   * @returns void
   * @description Obtiene las solicitudes de mercancía.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.formularioRegistroService.registrarFormulario(
      'frmCriterioDictamen',
      this.frmCriterioDictamen
    );
    
  }
/** 
    * Inicializa el formulario de criterio de dictamen.
  */
  
    inicializarFormulario(): void {
    this.subscription.add(
      this.tramite130102Query.selectSeccionState$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.solicitudState = seccionState;
          })
        )
        .subscribe()
    );
   this.frmCriterioDictamen = this.fb.group({
      solicitudMercancia: [
        this.solicitudState?.solicitudMercancia,
        Validators.required,
      ],
      criterioDictamen: [
        this.solicitudState?.criterioDictamen,
     { value: '', disabled: true }],
    });
       if (this.esFormularioSoloLectura) {
    this.frmCriterioDictamen.disable();
  }
  }
  /**
   * Inicializa el estado del formulario.
   * @returns void
   * @description Inicializa el estado del formulario.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
   
  }

  /*
  **
    * Guarda los datos del formulario y ajusta su estado según si es de solo lectura o no.
    * @returns void
    * @description Guarda los datos del formulario y ajusta su estado según si es de solo lectura o no. 
    */
    guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.frmCriterioDictamen.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.frmCriterioDictamen.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }

   /**
   * Método del ciclo de vida que se ejecuta al destruir el componente.
   * Emite y completa el observable para evitar fugas de memoria.
   */

  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
