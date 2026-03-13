import { ActivatedRoute, Router } from '@angular/router'; // Importa las clases para manejar rutas y navegación.
import { CommonModule, Location } from '@angular/common'; // Importa funcionalidades comunes y manejo de ubicación.
import { Component, OnDestroy, OnInit } from '@angular/core'; // Importa las clases base para componentes de Angular.

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa clases para formularios reactivos.
import { Subject, takeUntil } from 'rxjs'; // Importa clases para manejar observables y suscripciones.

import { Catalogo, CatalogoSelectComponent, REGEX_SOLO_NUMEROS, TituloComponent } from '@libs/shared/data-access-user/src'; // Importa componentes y modelos compartidos.
import { Elemento } from '../../constantes/permiso-de-exportacion.enum'; // Importa la interfaz `Elemento`.
import { PermisoDeExportacionService } from '../../services/permiso-de-exportacion.service'; // Importa el servicio de permisos de exportación.
import { Tramite280101Query } from '../../../../estados/queries/tramite280101.query'; // Importa la consulta para el estado del trámite.
import { Tramite280101Store } from '../../../../estados/tramite/tramite280101.store'; // Importa el store para manejar el estado del trámite.
/**
 * Componente que representa un formulario para gestionar elementos añadidos.
 * Este componente es independiente y utiliza formularios reactivos para la captura de datos.
 */
@Component({
  selector: 'app-elemento-anadidos',
  templateUrl: './elemento-anadidos.component.html',
  styleUrl: './elemento-anadidos.component.scss',
  standalone: true,
  imports: [CatalogoSelectComponent, CommonModule, ReactiveFormsModule, TituloComponent],
})
export class ElementoAnadidasComponent implements OnInit,OnDestroy {
  /**
   * Formulario reactivo para gestionar los datos del elemento añadido.
   */
  parteForm!: FormGroup;

  /**
   * Subject utilizado para manejar la destrucción del componente y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Catálogo de aduanas disponible para selección.
   */
  aduana: Catalogo[] = [];

  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación y manejo de formularios reactivos.
   * @param router Router para la navegación entre rutas.
   * @param activatedRoute ActivatedRoute para obtener información de la ruta activa.
   * @param location Location para manejar la navegación hacia atrás.
   * @param service Servicio para gestionar permisos de exportación.
   * @param store Store para manejar el estado del trámite.
   * @param query Query para consultar el estado del trámite.
   */
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public location: Location,
    public service: PermisoDeExportacionService,
    private store: Tramite280101Store,
    private query: Tramite280101Query
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    this.getAduana(); // Obtiene el catálogo de aduanas.
    this.inicializarFormulario();
    
  }

  /**
   * Inicializa el formulario reactivo para la gestión de elementos añadidos.
   * 
   * Este formulario contiene los siguientes campos:
   * - `descElementoAnadido`: Campo opcional para la descripción del elemento añadido.
   * - `idElementoAnadido`: Campo obligatorio para el ID del elemento añadido.
   * - `descripcionPresentacion`: Campo obligatorio para la descripción de la presentación.
   * - `alto`: Campo obligatorio para el alto del elemento, debe ser un valor numérico.
   * - `ancho`: Campo obligatorio para el ancho del elemento, debe ser un valor numérico.
   * - `profundidad`: Campo obligatorio para la profundidad del elemento, debe ser un valor numérico.
   * 
   * Cada campo incluye validaciones específicas, como obligatoriedad y patrones para asegurar
   * que los valores ingresados sean válidos.
   */
  inicializarFormulario(): void {
    this.parteForm = this.fb.group({
      descElementoAnadido: [''], // Campo para la descripción del elemento añadido.
      idElementoAnadido: ['', Validators.required], // Campo obligatorio para el ID del elemento añadido.
      descripcionPresentacion: ['', Validators.required], // Campo obligatorio para la descripción de la presentación.
      alto: ['', [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS)]], // Campo obligatorio para el alto, debe ser numérico.
      ancho: ['', [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS)]], // Campo obligatorio para el ancho, debe ser numérico.
      profundidad: ['', [Validators.required, Validators.pattern(REGEX_SOLO_NUMEROS)]], // Campo obligatorio para la profundidad, debe ser numérico.
    });
  }

  /**
   * Guarda los datos del formulario en el estado y navega hacia atrás.
   */
  Guardar(): void {
    if (this.parteForm.valid) {
      const DATA: Elemento = {
        descElementoAnadido: this.parteForm.get('descElementoAnadido')?.value, // Obtiene la descripción del elemento añadido.
        idElementoAnadido: this.parteForm.get('idElementoAnadido')?.value, // Obtiene el ID del elemento añadido.
        descripcionPresentacion: this.parteForm.get('descripcionPresentacion')?.value, // Obtiene la descripción de la presentación.
        alto: this.parteForm.get('alto')?.value, // Obtiene el valor del alto.
        ancho: this.parteForm.get('ancho')?.value, // Obtiene el valor del ancho.
        profundidad: this.parteForm.get('profundidad')?.value, // Obtiene el valor de la profundidad.
      };
      this.store.setElemento(DATA); // Guarda el elemento en el estado.
      this.parteForm.reset(); // Resetea el formulario.
      this.location.back(); // Navega hacia atrás.
    } else {
      this.parteForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores.
    }
  }

  /**
   * Obtiene el catálogo de aduanas desde el servicio.
   */
  getAduana(): void {
    this.service
      .getAduana()
      .pipe(takeUntil(this.destroyed$)) // Finaliza la suscripción al destruir el componente.
      .subscribe((data: Catalogo) => {
        this.aduana = Array.isArray(data) ? data : [data]; // Asigna los datos al catálogo de aduanas.
      });
  }

  /**
   * Cancela la operación y navega hacia atrás.
   */
  CancelElemento(): void {
    this.parteForm.reset(); // Resetea el formulario.
    this.location.back(); // Navega hacia atrás.
  }

  /**
   * Cambia la descripción del elemento añadido según el ID seleccionado.
   */
  cambiaElementoAnadido(): void {
    const ID = this.parteForm.get('idElementoAnadido')?.value; // Obtiene el ID del elemento añadido.
    const DESC = this.aduana.filter((x) => x.id === ID); // Filtra el catálogo de aduanas por el ID.
    if (DESC.length > 0) {
      this.parteForm.patchValue({
        descElementoAnadido: DESC[0].descripcion, // Asigna la descripción correspondiente.
      });
    }
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Emite una señal a través del observable `destroyed$` para notificar a los suscriptores
   * que deben limpiar recursos o cancelar suscripciones, y luego completa el observable.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}