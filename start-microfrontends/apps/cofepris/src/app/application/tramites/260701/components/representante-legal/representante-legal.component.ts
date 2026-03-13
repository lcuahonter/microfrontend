import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud260701State, Tramite260701Store } from '../../estados/tramites/tramite260701.store';
import { Subject,map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Tramite260701Query } from '../../estados/queries/tramite260701.query';

/**
 * RepresentanteLegalComponent
 * 
 * Este componente representa la sección de "Representante Legal" dentro del flujo de trámites.
 * Proporciona un formulario reactivo para capturar y gestionar los datos del representante legal.
 */
@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [CommonModule,TituloComponent,ReactiveFormsModule],
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss',
})
export class RepresentanteLegalComponent implements OnInit,OnDestroy {

   /**
     * Grupo de formularios principal para el representante legal.
     */
    representante!: FormGroup;

    /**
     * Notificador para destruir los observables al finalizar.
     */
    private destroyNotifier$: Subject<void> = new Subject();
    
    /**
     * Representa el estado de la Solicitud 260701.
     * Esta propiedad contiene los datos y la gestión del estado para la solicitud actual.
     * Se espera que se inicialice con una instancia de `Solicitud260303State`.
     */
    public solicitudState!: Solicitud260701State;
  /**
   * Indica si el formulario está en modo solo lectura.
   * Cuando es `true`, los campos del formulario no se pueden editar.
   */
    public esFormularioSoloLectura: boolean = false;
   
    /**
     * Constructor del componente.
     * @param fb - FormBuilder para la creación de formularios reactivos.
     */
    constructor(
      private readonly fb: FormBuilder,
      private tramite260701Store: Tramite260701Store,
      private tramite260701Query: Tramite260701Query,
      private consultaioQuery: ConsultaioQuery
    ) {
      this.consultaioQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    }
   
    /**
     * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
     * Obtiene el estado de la solicitud y crea el formulario del representante legal.
     */
    ngOnInit(): void {
      this.crearRepresentanteForm();
    }


    /**
     * Inicializa el grupo de formularios `representante` con controles y validadores predefinidos.
     * 
     * El grupo de formularios incluye los siguientes campos:
     * - `rfc`: Un campo requerido inicializado con el valor `rfc` de `solicitudState`.
     * - `nombre`: Un campo requerido inicializado con el valor `nombre` de `solicitudState`.
     * - `apellidoPaterno`: Un campo requerido inicializado con el valor `apellidoPaterno` de `solicitudState`.
     * - `apellidoMaterno`: Un campo requerido inicializado con el valor `apellidoMaterno` de `solicitudState`.
     * 
     * Cada campo está configurado con su valor inicial y reglas de validación respectivas.
     */
    public crearRepresentanteForm(): void {
       this.tramite260701Query.selectSolicitud$.pipe(takeUntil(this.destroyNotifier$),map((seccionState) => {
          this.solicitudState = seccionState;
      })).subscribe();
      this.representante = this.fb.group({
        rfc: [this.solicitudState?.rfc,Validators.required],
        nombre: [{ value: this.solicitudState?.nombre, disabled: false },[Validators.required]],
        apellidoPaterno: [{ value: this.solicitudState?.apellidoPaterno, disabled: false },[Validators.required]],
        apellidoMaterno: [{ value: this.solicitudState?.apellidoMaterno, disabled: false },[Validators.required]],
      });
    }
   
    /**
     * Método para actualizar los valores del formulario de representante legal.
     * Este método simula la obtención de nuevos valores y actualiza el formulario.
     */
    public obtenerValor(): void {
      if(this.representante.get('rfc')?.value !== '') {
        this.representante.patchValue({
          nombre: 47875, // Nota: Esto debería ser una cadena, considera ajustar si es necesario.
          apellidoPaterno: 'Paterno',
          apellidoMaterno: 'Materno',
        });
        this.representante.get('nombre')?.disable();
        this.representante.get('apellidoPaterno')?.disable();
        this.representante.get('apellidoMaterno')?.disable();
        this.setValoresStore(this.representante, 'nombre', 'setNombre');
        this.setValoresStore(this.representante, 'apellidoPaterno', 'setApellidoPaterno');
        this.setValoresStore(this.representante, 'apellidoMaterno', 'setApellidoMaterno');
      }
    }

  /**
   * Establece el valor de un campo en el store de Tramite31601.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  public setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite260701Store): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260701Store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

    /**
   * Determina si se debe cargar un formulario nuevo o uno existente.  
   * Ejecuta la lógica correspondiente según el estado del componente.
   */
  public inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.crearRepresentanteForm();
    }
  }

      /**
   * Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
   * Luego reinicializa el formulario con los valores actualizados desde el store.
   */
  public guardarDatosFormulario(): void {
    this.crearRepresentanteForm();
    Promise.resolve().then(() => {
      if (this.esFormularioSoloLectura) {
      this.representante.disable();
      } else if (!this.esFormularioSoloLectura) {
      this.representante.enable();
      }
    });
  }

  /**
   * Método del ciclo de vida de Angular que se llama cuando el componente se destruye.
   * Este método completa el observable destroyNotifier$ para cancelar las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
