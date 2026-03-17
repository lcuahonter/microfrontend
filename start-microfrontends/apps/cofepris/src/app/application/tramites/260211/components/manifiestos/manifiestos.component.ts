/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertComponent, InputRadioComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Solicitud260211State,
  Tramite260211Store,
} from '../../../../estados/tramites/tramite260211.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ALERTA_DE_MANIFESTO_Y_DECLARACIONES, MENSAJE_DE_ALERTA } from '@libs/shared/data-access-user/src/core/enums/260211/manifiestos.enum';
import { Tramite260211Query } from '../../../../estados/queries/tramite260211.query';

import { ProductoOption } from '../../models/permiso-sanitario.enum';
import { SanitarioService } from '../../services/sanitario.service';
 
/**
 * Componente principal para gestionar el formulario de manifiestos.
 */
@Component({
  selector: 'app-manifiestos',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    AlertComponent,
    ReactiveFormsModule,
    InputRadioComponent
  ],
  templateUrl: './manifiestos.component.html',
  styleUrl: './manifiestos.component.scss',
})
 
/**
 * Componente para gestionar los manifiestos de la solicitud.
 */
export class ManifiestosComponent implements OnInit, OnDestroy {
   producto: ProductoOption[] = [];
 
  /**
   * Valor por defecto para el campo de selección.
   * Se utiliza para establecer un valor inicial en el formulario.
   */
  defaultSelect: string = 'Si';
  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  public esFormularioSoloLectura: boolean = false; 
  /**
   * Mensaje de alerta para el usuario.
   */
  public mensaje: string = MENSAJE_DE_ALERTA;

/** Constante que almacena los datos de manifiestos de alerta */
    MANIFIESTOS_ALERT = ALERTA_DE_MANIFESTO_Y_DECLARACIONES

  /**
   * Estado de la solicitud obtenido desde el store.
   */
  public solicitudState!: Solicitud260211State;
 
  /**
   * Notificador para destruir observables activos y evitar pérdidas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();
 
  /**
   * Grupo de formularios principal para gestionar los manifiestos.
   */
  manifiestos!: FormGroup;
 
  /**
   * Constructor del componente.
   * @param fb - FormBuilder para la creación de formularios.
   * @param tramite260211Store - Servicio para interactuar con el store de Tramite260211.
   * @param tramite260211Query - Servicio para consultar el estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
     private service: SanitarioService,
    private tramite260211Store: Tramite260211Store,
    private tramite260211Query: Tramite260211Query,
    private consultaioQuery: ConsultaioQuery
  ) {
     /**
     * Se suscribe al estado de `Consultaio` para obtener información actualizada del estado del formulario.
     *
     * - Asigna el valor de solo lectura (`readonly`) a la propiedad `esFormularioSoloLectura`.
     * - Llama a `inicializarEstadoFormulario()` para aplicar configuraciones basadas en el estado recibido.
     * - La suscripción se cancela automáticamente cuando `destroyNotifier$` emite un valor (para evitar fugas de memoria).
     */
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState)=>{
        this.esFormularioSoloLectura = seccionState.readonly; 
       
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe();
  }
 
  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Obtiene el estado de la solicitud y crea el formulario de manifiestos.
   */
  ngOnInit(): void {
  this.service
      .getPermisoData()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((data: ProductoOption[]) => {
        this.producto = data; // Bind the fetched data
       
      });
    
  this.inicializarEstadoFormulario();
   

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
        this.manifiestos.disable();
      } else if (!this.esFormularioSoloLectura) {
        this.manifiestos.enable();
      } 
  }
  /**
   * Inicializa el formulario de manifiestos con los valores del estado de la solicitud.
   * Se suscribe al estado de la solicitud para obtener los valores iniciales.
   */
inicializarFormulario(): void {
  this.tramite260211Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
         /**
     * Inicialización del formulario de manifiestos.
     */
    this.manifiestos = this.fb.group({
      cumplimiento: [this.solicitudState?.cumplimiento, Validators.required],
      mensaje: [this.solicitudState?.mensaje],
    });

   if (this.esFormularioSoloLectura) {
    this.manifiestos.disable();
  }
}
  /**
   * Establece el valor de un campo en el store de Tramite260211.
   * @param form - El grupo de formularios que contiene el campo.
   * @param campo - El nombre del campo cuyo valor se va a establecer.
   * @param metodoNombre - El nombre del método en el store que se utilizará para establecer el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite260211Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.tramite260211Store[metodoNombre] as (value: any) => void)(VALOR);
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
 