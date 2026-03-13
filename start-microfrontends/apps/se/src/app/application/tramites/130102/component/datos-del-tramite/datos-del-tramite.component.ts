/* eslint-disable @nx/enforce-module-boundaries */
/**
 * compo doc
 * @fileoverview Componente encargado de gestionar la selección de solicitudes y tipos de documentos en un trámite.
 * @module DetosDelTramiteComponent
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  ProductoOption,
  ProductoResponse,
} from 'libs/shared/data-access-user/src/core/services/130102/octava-temporal.enum';

import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { InputRadioComponent } from "@libs/shared/data-access-user/src/tramites/components/input-radio/input-radio.component";

import { TituloComponent } from 'libs/shared/data-access-user/src/tramites/components/titulo/titulo.component';

import { Solicitud130102State, Tramite130102Store } from '../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../estados/queries/tramite130102.query';

import { Subject, map, takeUntil } from 'rxjs';
import { FormularioRegistroService } from '../../services/octava-temporal.service';

import { CatOctavaTemporalService } from '../../services/cat-octava-temporal.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

/**
 * Componente para la gestión de solicitudes y tipos de documentos en un trámite.
 */
@Component({
  selector: 'app-datos-del-tramite',
  standalone: true,
  imports: [
    TituloComponent,
    CommonModule,
    ReactiveFormsModule,
    InputRadioComponent,
    CatalogoSelectComponent,
  ],
  templateUrl: './datos-del-tramite.component.html',
})
export class DetosDelTramiteComponent implements OnInit, OnDestroy {
  
  /**
   * Lista de campos de entrada utilizados en el formulario.
   */
  inputFields = [
    {
      label: 'Régimen al que se destinará la mercancía',
      placeholder: 'Seleccione una opción',
      required: true,
    },
    {
      label: 'Clasificación del régimen',
      placeholder: 'Seleccione una opción',
      required: true,
    },
  ];

  /**
   * Lista de catálogos disponibles para la selección.
   */
  catalogosArray: Catalogo[][] = [];

  /**
   * Formulario reactivo del componente.
   */
  formDelTramite!: FormGroup;

  /**
   * Opciones disponibles para la solicitud.
   */
  solicitude: ProductoOption[] = [];

  /**
   * Lista de tipos de documentos disponibles.
   */
  tiposDocumentosArray: Catalogo[] = [];

  /**
   * Valor seleccionado actualmente.
   */
  selectedValue: string | number = 'Inicial';

  /**
   * Valor predeterminado en la selección.
   */
  defaultSelect: string = 'Inicial';
  /**
   * Indica si el formulario es de solo lectura.
   */
  esFormularioSoloLectura: boolean = false;
  /**
   * Estado de la solicitud 130102, obtenido desde el store.
   */
  public solicitudState!: Solicitud130102State;
  /**
   * Observable utilizado para cancelar suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**
   * Constructor del componente.
   * @param {HttpClient} http - Servicio para realizar peticiones HTTP.
   * @param {FormBuilder} fb - Utilidad para la construcción de formularios reactivos.
   */
  constructor(private http: HttpClient, private fb: FormBuilder, 
    private tramite130102Store: Tramite130102Store,
    private tramite130102Query: Tramite130102Query,
    private formularioRegistroService: FormularioRegistroService,
    private catOctavaTemporalService: CatOctavaTemporalService,
    private consultaioQuery: ConsultaioQuery
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
  }

  /**
   * Inicializa el componente, configura el formulario y obtiene datos iniciales.
   */
  ngOnInit(): void { 
    
    this.inicializarEstadoFormulario();
    this.fetchSolicitudeOptions();
    this.fetchRegimenes();
    this.formularioRegistroService.registrarFormulario('formDelTramite', this.formDelTramite);
  }
   inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
   
  }
  /**
   * Guarda los datos del formulario y configura su estado según si es de solo lectura o editable.
   */
  guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.formDelTramite.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.formDelTramite.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }
  /**
   * Inicializa el formulario reactivo y sus validaciones.
   *
   * Este método se suscribe a los cambios en el estado de la solicitud y configura el formulario
   * con los valores iniciales obtenidos del store.
   */
  inicializarFormulario():void{
this.tramite130102Query.selectSeccionState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {  
        this.solicitudState = seccionState;
      })
    )
    .subscribe();

    this.formDelTramite = this.fb.group({
      solicitud: [this.solicitudState?.solicitud],
  

      regimen: [this.solicitudState?.regimen || null, [Validators.required]],
      clasificacionRegimen: [this.solicitudState?.clasificacionRegimen || null, [Validators.required]],
    });
     if (this.esFormularioSoloLectura) {
    this.formDelTramite.disable();
  }
  }
  /**
   * Asigna un valor del formulario al store.
   *
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Campo del formulario a obtener.
   * @param {keyof Tramite130102Store} metodoNombre - Método del store donde se guardará el valor.
   */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite130102Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite130102Store[metodoNombre] as (value: string | number) => void)(VALOR);

  }

  /**
   *  Clasificación del régimen basado en el régimen seleccionado.
   * @param {FormGroup} form - Formulario reactivo.
   * 
   *  
   */
  obtenerClaficacionRegimen(form: FormGroup): void {  
    const CVE_REGIMEN = form.get('regimen')?.value;

    if (CVE_REGIMEN) {
      this.catOctavaTemporalService.getClasificacionRegimenes(CVE_REGIMEN).pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.catalogosArray[1] = data.datos.map((item, index) => ({
          id: index,  
          clave: item.clave,
          descripcion: item.descripcion,
        }));
      });
    }
  }


  /**
   * Maneja los cambios en la opción seleccionada.
   *
   * Este método se activa cuando el usuario cambia el valor en el campo correspondiente.
   *
   * @param {string | number} value - El nuevo valor seleccionado.
   *
   * Este método es para el control de radio de solicitud.
   */
  onValueChange(value: string | number): void {
    this.selectedValue = value;

  }

  /**
   * Método de marcador de posición para gestionar el tipo de transporte.
   */
  tipoTransporte(): void {
    this.selectedValue = 'Nuevo';
  }

  /**
   * Obtiene la lista de opciones de solicitud desde un archivo JSON.
   */
  fetchSolicitudeOptions(): void {
    this.http
      .get<ProductoResponse>('/assets/json/130102/solicitude-options.json')
      .subscribe((data) => {
        this.solicitude = data.options;
        this.defaultSelect = data.defaultSelect;
      });
  }

  /**
   * Obtiene los regímenes desde el servicio CatOctavaTemporalService y actualiza el catálogo correspondiente.
   */
  fetchRegimenes(): void {
    this.catOctavaTemporalService.getRegimenes().pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
      this.catalogosArray[0] = data.datos.map((item) => ({
        id: parseInt(item.clave, 10),
        clave: item.clave,
        descripcion: item.descripcion,
      }));
    });
  }



  
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   *
   * Este método emite un valor a través del observable `destroyNotifier$` para notificar a los suscriptores
   * que el componente está siendo destruido, y luego completa el observable para liberar recursos.
   *
   * @returns {void} No retorna ningún valor.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
