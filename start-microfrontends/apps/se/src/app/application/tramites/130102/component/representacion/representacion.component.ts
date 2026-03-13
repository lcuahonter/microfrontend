/*
* RepresentacionComponent es un componente que maneja la selección de entidades federativas y representaciones federales.
*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';
import { CommonModule } from '@angular/common';

import { Solicitud130102State, Tramite130102Store } from '../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../estados/queries/tramite130102.query';

import { Subject, map, takeUntil } from 'rxjs'; 
import { FormularioRegistroService } from '../../services/octava-temporal.service';

import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Catalogo, TituloComponent } from '@libs/shared/data-access-user/src';
import { CatOctavaTemporalService } from '../../services/cat-octava-temporal.service';

/**
 * RepresentacionComponent es un componente que maneja la selección de entidades federativas y representaciones federales.
 */
@Component({
  selector: 'app-representacion',
  standalone: true,
  imports: [
    TituloComponent,
    CatalogoSelectComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './representacion.component.html',
})
export class RepresentacionComponent implements OnInit, OnDestroy {
  /**
   * Configuración del formulario de representación.
   * @type {FormGroup}
   */
  frmRepresentacion!: FormGroup;

  /**
   * Entidades federativas disponibles.
   * @type {Catalogo[]} - Las entidades federativas disponibles.
   */
  entidadFederativaLista: Catalogo[] = [];

  /**
   * Representaciones federales disponibles.
   * @type {Catalogo[]} - Las representaciones federales disponibles.
   */
  representacionFederalLista: Catalogo[] = [];

  /**
   * Representación federal seleccionada.
   * @type {Catalogo}
   */
  seleccionadaEntidadFederativa: Catalogo = { id: 0, descripcion: '' };

  /**
   * Representación federal seleccionada.
   * @type {Catalogo}
   */
  seleccionadaRepresentacionFederal: Catalogo = { id: 0, descripcion: '' };

    /**
   * Estado actual de la solicitud 130102, obtenido desde el store.
   */
  public solicitudState!: Solicitud130102State;

  /**
   * Observable utilizado para cancelar suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
/*
   * Indica si el formulario es de solo lectura.
   */
   esFormularioSoloLectura: boolean = false;


  /**
   * Inicializa el componente RepresentacionComponent.
   * @constructor
   * @param {FormBuilder} fb - El constructor de formularios.
   * @returns void
   */
  constructor(private fb: FormBuilder,
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
inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
   
  }
  /*
    * Guarda los datos del formulario y configura su estado según si es de solo lectura o editable.
    * @returns void
    * @description Guarda los datos del formulario y configura su estado según si es de solo lectura o editable.
*/
   guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.esFormularioSoloLectura) {
        this.frmRepresentacion.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.frmRepresentacion.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }
  /**
   * Inicializa el formulario reactivo y sus validaciones.
   * @returns void
   * @description Inicializa el formulario reactivo y sus validaciones.
   */
  inicializarFormulario(): void {
  this.tramite130102Query.selectSeccionState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {  
        this.solicitudState = seccionState;
      })
    )
    .subscribe();

    this.frmRepresentacion = this.fb.group({
      entidad: [ this.solicitudState?.entidad || null, Validators.required],
      representacion: [ this.solicitudState?.representacion || null, Validators.required],
    });
    if (this.esFormularioSoloLectura) {
    this.frmRepresentacion.disable();
  }
  }
  /**
   * Maneja la selección de una entidad federativa.
   * @param e - La entidad federativa seleccionada.
   * @returns void
   */
  entidadFederativaSeleccion(e: Catalogo): void {
    this.seleccionadaEntidadFederativa = e;
  }

  /**
   * Maneja la selección de una representación federal.
   * @param r - La representación federal seleccionada.
   * @returns void
   */
  representacionFederalSeleccion(r: Catalogo): void {
    this.seleccionadaRepresentacionFederal = r;
  }

  /**
   * Obtiene las entidades federativas y representaciones federales.
   * @returns void
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.formularioRegistroService.registrarFormulario('frmRepresentacion', this.frmRepresentacion);
    this.obtenerEntidadesFederativas();

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



  /*
  * Obtiene las opciones de entidades federativas.    
  * @returns void
  * @description Obtiene las opciones de entidades federativas.
  */
  obtenerEntidadesFederativas(): void {
    this.catOctavaTemporalService.getEntidadesFederativas().pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
      this.entidadFederativaLista = data.datos.map((item, index) => ({
        id: index,
        clave: item.clave,
        descripcion: item.descripcion,
      }));  
    });
  }

  /**
   * Obtiene las unidades administrativas basadas en la entidad seleccionada.
   * @param cveEntidad Clave de la entidad para obtener las unidades administrativas.
   * @returns void
   */
  obtenerUnidadesAdministrativas(cveEntidad: string): void {
    this.catOctavaTemporalService.getUnidadesAdministrativas(cveEntidad).pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
      this.representacionFederalLista = data.datos.map((item, index) => ({  
        id: index,
        clave: item.clave,
        descripcion: item.descripcion,
      }));  
    });
  }

  /**
   * maneja el cambio en la selección de la entidad federativa y actualiza las unidades administrativas.
   * @param form - Formulario reactivo.
   * @return void
   */
  onChangeEntidad(form: FormGroup): void {
    const CVE_ENTIDAD = form.get('entidad')?.value;
    if (CVE_ENTIDAD) {
      this.obtenerUnidadesAdministrativas(CVE_ENTIDAD);
    }
  }

  /**
   * Obtiene las opciones de representaciones federales.
   * @returns void
   */
  fetchRepresentacionFederal(r: Catalogo): void {
    this.seleccionadaRepresentacionFederal = r;
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
