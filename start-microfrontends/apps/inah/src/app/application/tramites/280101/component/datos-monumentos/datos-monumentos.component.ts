import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';

import { CONFIGURACION_ELEMENTO_TABLA, Elemento, Monumentos } from '../../constantes/permiso-de-exportacion.enum';

import { Catalogo, CatalogoSelectComponent, REGEX_SOLO_NUMEROS, TablaDinamicaComponent, TablaSeleccion, TituloComponent } from '@libs/shared/data-access-user/src';
import { Solicitud280101State, Tramite280101Store } from '../../../../estados/tramite/tramite280101.store';
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service';
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query';

// Decorador que define el componente y sus metadatos
/**
 * Componente que gestiona los datos de los monumentos en el trámite 280101.
 * 
 * Este componente incluye un formulario reactivo para capturar información
 * relacionada con los monumentos, así como funcionalidades para interactuar
 * con una tabla dinámica de elementos y navegar entre diferentes vistas.
 * 
 * @remarks
 * - Utiliza `FormBuilder` para la creación de formularios reactivos.
 * - Se conecta con un estado global mediante `Tramite280101Store` y `Tramite280101Query`.
 * - Implementa las interfaces `OnInit` y `OnDestroy` para manejar el ciclo de vida del componente.
 * 
 * @example
 * ```html
 * <app-datos-monumentos></app-datos-monumentos>
 * ```
 */
@Component({
  selector: 'app-datos-monumentos', // Selector utilizado en el HTML para instanciar este componente
  templateUrl: './datos-monumentos.component.html', // Ruta del archivo de plantilla HTML
  styleUrl: './datos-monumentos.component.scss', // Ruta del archivo de estilos SCSS
  standalone: true, // Indica que este componente es independiente
  imports: [ // Módulos y componentes importados para ser utilizados en este componente
    CatalogoSelectComponent, 
    CommonModule, 
    ReactiveFormsModule, 
    TablaDinamicaComponent, 
    TituloComponent
  ],
})

// Definición de la clase del componente
export class DatosMonumentoComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos de la mercancía.
   */
  mercanciaForm!: FormGroup;

  /**
   * Datos de la tabla de elementos.
   */
  datosTabla: Elemento[] = [];

  /**
   * Catálogo de aduanas.
   */
  aduana: Catalogo[] = [];

  /**
   * Configuración de la tabla de elementos.
   */
  configTableArray = CONFIGURACION_ELEMENTO_TABLA;

  /**
   * Estado de la solicitud 280101.
   */
  public solicitudState!: Solicitud280101State;

  /**
   * Subject para manejar la destrucción del componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Selección de la tabla.
   */
  TablaSeleccion = TablaSeleccion;

  /**
   * Lista de elementos seleccionados.
   */
  public elementoSeleccionLista: Elemento[] = [];

  /**
   * Datos de la tabla de elementos.
   */
  public elementoTablaDatos: Elemento[] = [];

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param router Router para la navegación.
   * @param activatedRoute ActivatedRoute para rutas relativas.
   * @param service Servicio de permiso de exportación.
   * @param store Store para gestionar el estado de la solicitud.
   * @param query Query para obtener el estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public service: PermisoDeExportacionService,
    private store: Tramite280101Store,
    private query: Tramite280101Query
  ) {
  
  }

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.getAduana();
    this.inicializarFormulario();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();

    this.elementoTablaDatos = this.solicitudState.elementoTablaDatos;
  }


  /**
   * Inicializa el formulario `mercanciaForm` con un conjunto de controles y validaciones.
   * 
   * Los campos del formulario incluyen:
   * - `descEpoca`: Campo de texto sin validaciones.
   * - `descMaterial`: Campo de texto sin validaciones.
   * - `descFraccion`: Campo de texto sin validaciones.
   * - `descripcionMercancia`: Campo obligatorio.
   * - `generica2`: Campo obligatorio.
   * - `descripcionIdentificacion`: Campo obligatorio.
   * - `generica1`: Campo obligatorio.
   * - `cantidadPresentacion`: Campo obligatorio que solo permite números enteros.
   * - `componente`: Campo obligatorio que solo permite números enteros.
   * - `importeTotalComponente`: Campo obligatorio que solo permite números enteros.
   * - `idFraccionGubernamental`: Campo obligatorio.
   * - `descripcionUsoMercancia`: Campo obligatorio.
   * 
   * Este método utiliza `FormBuilder` para crear un grupo de controles con sus respectivas validaciones.
   */
  inicializarFormulario(): void {
    this.mercanciaForm = this.fb.group({
      descEpoca: [''],
      descMaterial: [''],
      descFraccion: [''],
      descripcionMercancia: ['', Validators.required],
      generica2: ['', Validators.required],
      descripcionIdentificacion: ['', Validators.required],
      generica1: ['', Validators.required],
      cantidadPresentacion: ['', [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS)]],
      componente: ['', [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS)]],
      importeTotalComponente: ['', [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS)]],
      idFraccionGubernamental: ['', Validators.required],
      descripcionUsoMercancia: ['', Validators.required],
    });

  }

  /**
   * Guarda los datos del formulario en el estado.
   */
  Guardar(): void {
    if (this.mercanciaForm.valid) {
      this.service.indice = 3;
      const DATA: Monumentos = {
        titulo: this.mercanciaForm.get('descripcionMercancia')?.value,
        epoca: this.mercanciaForm.get('generica2')?.value,
        descEpoca: this.mercanciaForm.get('descEpoca')?.value,
        autor: this.mercanciaForm.get('descripcionIdentificacion')?.value,
        material: this.mercanciaForm.get('generica1')?.value,
        descMaterial: this.mercanciaForm.get('descMaterial')?.value,
        alto: this.mercanciaForm.get('cantidadPresentacion')?.value,
        ancho: this.mercanciaForm.get('componente')?.value,
        profundidad: this.mercanciaForm.get('importeTotalComponente')?.value,
        fraccion: this.mercanciaForm.get('idFraccionGubernamental')?.value,
        descFraccion: this.mercanciaForm.get('descFraccion')?.value,
        descripcionEstado: this.mercanciaForm.get('descripcionUsoMercancia')?.value,
      };

      this.store.setMonumento(DATA);
      this.mercanciaForm.reset();
      this.router.navigate(['../permiso'], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this.mercanciaForm.markAllAsTouched();
    }
  }

  /**
   * Cambia la descripción de la época según el valor seleccionado.
   */
  cambiaEpoca(): void {
    const GENERICA_VALUE = this.mercanciaForm.get('generica2')?.value;
    this.mercanciaForm.patchValue({
      descEpoca: this.aduana.find((epoca: Catalogo) => epoca.id === GENERICA_VALUE)?.descripcion || '',
    });
  }

  /**
   * Cambia la descripción del material según el valor seleccionado.
   */
  cambiaMaterial(): void {
    const GENERICA_VALUE = this.mercanciaForm.get('generica1')?.value;
    this.mercanciaForm.patchValue({
      descMaterial: this.aduana.find((material: Catalogo) => material.id === GENERICA_VALUE)?.descripcion || '',
    });
  }

  /**
   * Navega a la página para agregar un nuevo elemento.
   */
  agregar(): void {
    this.router.navigate(['../elemento'], {
      relativeTo: this.activatedRoute,
    });
  }

  /**
   * Cancela la operación y navega a la página de permiso.
   */
  cancelar(): void {
    this.router.navigate(['../permiso'], {
      relativeTo: this.activatedRoute,
    });
    this.service.indice = 3;
  }

  /**
   * Cambia la descripción de la fracción según el valor seleccionado.
   */
  cambiaFraccion(): void {
    const FRACCION_VALUE = this.mercanciaForm.get('idFraccionGubernamental')?.value;
    this.mercanciaForm.patchValue({
      descFraccion: this.aduana.find((fraccion: Catalogo) => fraccion.id === FRACCION_VALUE)?.descripcion || '',
    });
  }

  /**
   * Borra el elemento seleccionado de la tabla.
   */
  Borrar(): void {
    if (this.elementoSeleccionLista.length === 0) {
      return;
    }
    if (this.elementoSeleccionLista.length) {
      this.store.borrorElemento(this.elementoSeleccionLista[0]);
    }
    this.elementoSeleccionLista = [];
  }

  /**
   * Obtiene el catálogo de aduanas desde el servicio.
   */
  getAduana(): void {
    this.service.getAduana()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: Catalogo) => {
        this.aduana = Array.isArray(data) ? data : [data];
      });
  }

  /**
   * Método que se ejecuta al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}