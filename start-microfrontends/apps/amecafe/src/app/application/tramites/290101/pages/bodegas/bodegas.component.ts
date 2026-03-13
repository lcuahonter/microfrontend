import { ActivatedRoute } from '@angular/router';
import { BodegasFormaInt} from '../../modelos/datos-de-interfaz.model';
import { CatalogosSelect } from '@ng-mf/data-access-user';
import { CatalogosService } from '../../servicios/catalogos.service';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@libs/shared/data-access-user/src';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeccionLibQuery} from '@libs/shared/data-access-user/src';
import { SeccionLibState} from '@libs/shared/data-access-user/src';
import { SeccionLibStore } from '@libs/shared/data-access-user/src';
import { Subject } from 'rxjs';
import { TramiteStore } from '../../estados/tramite290101.store';
import { TramiteStoreQuery } from '../../estados/tramite290101.query';
import { Validators } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-bodegas',
  templateUrl: './bodegas.component.html',
})
export class BodegasComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para los datos de bodegas.
   * @type {FormGroup}
   */
  bodegaForm!: FormGroup;

  /**
   * Estado del formulario de bodegas.
   * Contiene la información capturada en el formulario.
   * @type {BodegasFormaInt}
   */
  bodegasFormaState!: BodegasFormaInt;

  /**
   * Indica si el formulario debe mostrarse solo en modo de lectura.
   * @type {boolean}
   */
  @Input() esFormularioSoloLectura!: boolean;

  /**
   * Catálogo de opciones para propiedad o alquiler.
   * Contiene las opciones disponibles para indicar si la bodega es propia o alquilada.
   * @type {CatalogosSelect}
   */
  propAlquil: CatalogosSelect = {
    labelNombre: '',
    required: false,
    primerOpcion: '',
    catalogos: [],
  };

  /**
   * Catálogo de estados.
   * Contiene las opciones disponibles para los estados.
   * @type {CatalogosSelect}
   */
  estado: CatalogosSelect = {
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
   * @param {ConsultaioQuery} consultaioQuery - Consulta Akita para manejar y actualizar el estado de una sección.
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
    private consultaioQuery: ConsultaioQuery,
  ) {
      this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe()
  }
    /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
  }

    /**
     * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
     * Luego reinicializa el formulario con los valores actualizados desde el store.
     */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.bodegaForm.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.bodegaForm.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

    inicializarFormulario(): void {
    // Inicializar el formulario primero
    this.bodegaForm = this.fb.group({
      razonSocial: ['', [Validators.required, Validators.maxLength(200)]],
      propAlquil: ['', Validators.required],
      calle: ['', [Validators.required, Validators.maxLength(100)]],
      numeroExterior: ['', Validators.required],
      numeroInterior: ['', Validators.maxLength(50)],
      colonia: ['', [Validators.required, Validators.maxLength(100)]],
      estado: ['', Validators.required],
      entidadNombre: [''],
      codigoPostal: ['', [Validators.required, Validators.maxLength(12)]],
      capacidadAlmacenaje: ['', [Validators.required, Validators.maxLength(20)]],
    });

    // Solo una suscripción para el estado del trámite
    this.tramiteStoreQuery.selectSolicitudTramite$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          if (seccionState && seccionState.BodegasFormaState) {
            this.bodegasFormaState = seccionState.BodegasFormaState;
            // Solo hacer patch si hay datos válidos
            if (BodegasComponent.hasValidStateData(this.bodegasFormaState)) {
              this.bodegaForm.patchValue(this.bodegasFormaState, { emitEvent: false });
            }
          }
        })
      )
      .subscribe();
  }


  /**
   * Cambia la pestaña activa en la interfaz.
   * @param {number} index - Índice de la pestaña a seleccionar.
   */
  seleccionaTab(index: number): void {
    // Solo agregar datos a la tabla si el formulario es válido y tiene datos
    if (this.bodegaForm.valid) {
      const BODEGAS_DATOS = {
        TABLA_Columna_1: this.bodegaForm.value.razonSocial,
        TABLA_Columna_2: this.bodegaForm.value.propAlquil,
        TABLA_Columna_3: this.bodegaForm.value.calle,
        TABLA_Columna_4: this.bodegaForm.value.numeroExterior,
        TABLA_Columna_5: this.bodegaForm.value.numeroInterior,
        TABLA_Columna_6: this.bodegaForm.value.colonia,
        TABLA_Columna_7: this.bodegaForm.value.estado,
        TABLA_Columna_8: this.bodegaForm.value.codigoPostal,
        TABLA_Columna_9: this.bodegaForm.value.capacidadAlmacenaje,
        estatus: true,
      };
      this.tramiteStore.setBodegasTabla([BODEGAS_DATOS]);
      this.router.navigate(['../cafe-exportadores'], { queryParams: { tab: index },
      relativeTo: this.activateRoute,});
    }else {
      this.bodegaForm.markAllAsTouched();
    }

    
  }

  /**
   * Método de inicialización del componente.
   * Configura el formulario y carga los catálogos necesarios.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.cargarEstadoCatalog();
    this.cargarBodegaPropiaAlquilad();

    // Suscripción para cambios en el formulario con debounce
    this.bodegaForm.valueChanges
      .pipe(
        takeUntil(this.destroyNotifier$),
        delay(300), // Aumentar el delay para evitar actualizaciones excesivas
        tap(() => {
          if (this.bodegaForm.valid) {
            const ACTIVE_STATE = { ...this.bodegaForm.value };
            this.tramiteStore.setBodegasTramite(ACTIVE_STATE);
          }
        })
      )
      .subscribe();

    /**
     * Se suscribe a los cambios en el estado de la sección.
     * Almacena la información de la sección en la propiedad `seccion`.
     * Para el botón de validación Continuar.
     */
    this.seccionQuery.selectSeccionState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map(seccionState => {
          this.seccion = seccionState;
        })
      )
      .subscribe();
  }

  /**
   * Carga el catálogo de opciones para propiedad o alquiler.
   */
  cargarBodegaPropiaAlquilad(): void {
    this.catalogosService.cargarBodegaPropiaAlquilad()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe(resp => {
        if (resp.code === 200) {
          const RESPONSE = resp.data;
          this.propAlquil = {
            labelNombre: 'Propia o alquilada',
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
   * Resetea el formulario de bodegas.
   */

    cancelarBodega(): void {
    this.bodegaForm.reset();
    // Navegar directamente sin llamar seleccionaTab para evitar agregar filas vacías
    this.router.navigate(['../cafe-exportadores'], { queryParams: { tab: 2 },
      relativeTo: this.activateRoute });
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
   * Verifica si el estado tiene datos válidos para hacer patch al formulario
   */
  private static hasValidStateData(state: BodegasFormaInt): boolean {
    return state && Object.values(state).some(value => 
      value !== null && value !== undefined && value !== ''
    );
  }

  /**
   * @method ngOnDestroy
   * @description Hook del ciclo de vida que se llama cuando el componente es destruido.
   * Garantiza la limpieza adecuada emitiendo un valor al subject `destroyNotifier$` 
   * y completándolo para liberar recursos y prevenir fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}