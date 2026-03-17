import { ActivatedRoute } from '@angular/router';
import { CatalogosSelect } from '@ng-mf/data-access-user';
import { CatalogosService } from '../../servicios/catalogos.service';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { RegionFormaInt} from '../../modelos/datos-de-interfaz.model';
import { Router } from '@angular/router';
import { SeccionLibQuery} from '@libs/shared/data-access-user/src';
import { SeccionLibState} from '@libs/shared/data-access-user/src';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { TramiteState } from '../../estados/tramite290101.store';
import { TramiteStore } from '../../estados/tramite290101.store';
import { TramiteStoreQuery } from '../../estados/tramite290101.query';
import { Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-regiones',
  templateUrl: './regiones.component.html',
})
export class RegionesComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para los datos de regiones.
   * @type {FormGroup}
   */
  regionForm!: FormGroup;



  /**
   * Estado del formulario de regiones.
   * @type {RegionFormaInt}
   */
  regionFormaState!: RegionFormaInt;

  /**
   * Catálogo de productos de café.
   * @type {CatalogosSelect}
   */
  productoCafe: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de estados.
   * @type {CatalogosSelect}
   */
  estado: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de tipos de café.
   * @type {CatalogosSelect}
   */
  descripTipoCafe: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Estado de la sección actual.
   * Contiene información sobre el estado de la sección.
   * @type {SeccionLibState}
   */
  private seccion!: SeccionLibState;

  /**
   * Subject para notificar la destrucción del componente.
   * Utilizado para gestionar la limpieza de recursos.
   * @type {Subject<void>}
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * @param {Router} router - Servicio de enrutamiento de Angular.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {CatalogosService} catalogosService - Servicio para cargar catálogos.
   * @param {TramiteStoreQuery} tramiteStoreQuery - Consulta del estado del trámite.
   * @param {TramiteStore} tramiteStore - Almacén del estado del trámite.
   * @param {SeccionLibQuery} seccionQuery - Consulta del estado de la sección.
   * @param {SeccionLibStore} seccionStore - Almacén del estado de la sección.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private catalogosService: CatalogosService,
    private tramiteStoreQuery: TramiteStoreQuery,
    private tramiteStore: TramiteStore,
    private seccionQuery: SeccionLibQuery,
    private seccionStore: SeccionLibStore,
    private activateRoute: ActivatedRoute,
  ) {
    // Se puede agregar aquí la lógica del constructor si es necesario
  }


  /**
   * Cambia la pestaña activa en la interfaz.
   * @param {number} index - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(index: number): void {
    // Solo agregar datos a la tabla si el formulario es válido
    if (this.regionForm.valid) {
      const REGIONES_DATOS= {
        TABLA_Columna_1: RegionesComponent.obtenerDescripcionPorId(this.estado, this.regionForm.value.estado) || this.regionForm.value.estado,
        TABLA_Columna_2: RegionesComponent.obtenerDescripcionPorId(this.productoCafe, this.regionForm.value.productoCafe) || this.regionForm.value.productoCafe,
        TABLA_Columna_3: this.regionForm.value.descRegionCompra,
        TABLA_Columna_4: RegionesComponent.obtenerDescripcionPorId(this.descripTipoCafe, this.regionForm.value.descripTipoCafe) || this.regionForm.value.descripTipoCafe,
        TABLA_Columna_5: this.regionForm.value.volumen,
        estatus: true, 
         
      };
      this.tramiteStore.setRegionesTabla([REGIONES_DATOS]);

      this.router.navigate(['../cafe-exportadores'], { queryParams: { tab: index } ,
      relativeTo: this.activateRoute });

    } else {
      this.regionForm.markAllAsTouched();
    }

  }
  

  /**
   * Método de inicialización del componente.
   * Configura el formulario y carga los catálogos necesarios.
   */
  ngOnInit(): void {
    // Inicializar formulario primero
    this.iniciarFormulario();
    
    // Cargar catálogos
    this.cargarEstadoCatalog();
    this.cargarProductoCafe();
    this.cargarTipoDeCafe();

    // Solo una suscripción para el estado del trámite
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState: TramiteState) => {
          if (seccionState && seccionState.RegionFormatState) {
            this.regionFormaState = seccionState.RegionFormatState;
            // Solo hacer patch si hay datos válidos
            if (RegionesComponent.hasValidStateData(this.regionFormaState)) {
              this.regionForm.patchValue(this.regionFormaState, { emitEvent: false });
            }
          }
        })
      ).subscribe();

    // Suscripción para cambios en el formulario con debounce
    this.regionForm.valueChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(300), // Aumentar el delay para evitar actualizaciones excesivas
        tap(() => {
          if (this.regionForm.valid) {
            const ACTIVE_STATE = { ...this.regionForm.value };
            this.tramiteStore.setRegionTramite(ACTIVE_STATE);
          }
        })
      )
      .subscribe();

    // Suscripción para el estado de la sección
    this.seccionQuery.selectSeccionState$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(seccionState => {
        this.seccion = seccionState;
      });
  }

  /**
   * Verifica si el estado tiene datos válidos para hacer patch al formulario
   */
  private static hasValidStateData(state: RegionFormaInt): boolean {
    return state && Object.values(state).some(value => 
      value !== null && value !== undefined && value !== ''
    );
  }

  /**
   * Inicializa el formulario reactivo con valores por defecto.
   */
  iniciarFormulario(): void {
    this.regionForm = this.fb.group({
      estado: ['', Validators.required],
      productoCafe: ['', Validators.required],
      descRegionCompra: ['', [Validators.required]],
      descripTipoCafe: ['', Validators.required],
      volumen: ['', Validators.required],
    });
  }

  /**
   * Carga el catálogo de productos de café.
   */
  cargarProductoCafe(): void {
    this.catalogosService.cargarBodegaPropiaAlquilad()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(resp => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.productoCafe = {
            labelNombre: 'Café compra',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Carga el catálogo de tipos de café.
   */
  cargarTipoDeCafe(): void {
    this.catalogosService.cargarTipoDeCafe()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(resp => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.descripTipoCafe = {
            labelNombre: 'Tipo de café',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Carga el catálogo de estados.
   */
  cargarEstadoCatalog(): void {
    this.catalogosService.cargarEstadoCatalog()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(resp => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.estado = {
            labelNombre: 'Estado',
            required: false,
            primerOpcion: 'Selecciona un valor',
            catalogos: RESPONSE,
          };
        }
      });
  }

  /**
   * Método genérico para obtener la descripción de un catálogo basado en su ID.
   * @param {CatalogosSelect} catalogo - El catálogo donde buscar.
   * @param {string | number} id - El ID del elemento a buscar.
   * @returns {string | undefined} La descripción del elemento encontrado o undefined si no existe.
   */
  private static obtenerDescripcionPorId(catalogo: CatalogosSelect, id: string | number): string | undefined {
    return catalogo.catalogos.find((item) => item.id === Number(id))?.descripcion;
  }

  /**
   * Resetea el formulario de regiones.
   */
  cancelarBodega(): void {
    this.regionForm.reset();
    // Navegar directamente sin llamar seleccionaTab para evitar agregar filas vacías
    this.router.navigate(['../cafe-exportadores'], { queryParams: { tab: 2 },
      relativeTo: this.activateRoute });
  }

  /**
   * Método de limpieza al destruir el componente.
   * Libera los recursos y cancela las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}