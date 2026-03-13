/**
 * compodoc
 * @fileoverview Componente `DatosDelEstablecimientoSeccionComponent`
 * Este componente gestiona los datos del establecimiento, incluyendo su denominación o razón social
 * y su correo electrónico. Utiliza formularios reactivos para la validación y sincronización de datos
 * con un estado global a través de un `StateStore`.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DatosDelSolicituteSeccionState,DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';


import { Modal } from 'bootstrap';

import { Subject,map, takeUntil } from 'rxjs';


import { TituloComponent } from '@libs/shared/data-access-user/src';

import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';

import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
/**
 * compodoc
 * @description
 * Componente para gestionar los datos del establecimiento.
 * Permite cargar y actualizar datos en un formulario reactivo, sincronizándolos con un estado global.
 */
@Component({
  selector: 'app-datos-del-establecimiento-seccion',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, FormsModule,TooltipModule],
  templateUrl: './datos-del-establecimiento-seccion.component.html',
  styleUrl: './datos-del-establecimiento-seccion.component.scss',
})
/*
  * @description
  * Clase que representa el componente de datos del establecimiento.
  * Este componente gestiona la visualización y edición de los datos del establecimiento,
  * incluyendo su denominación, razón social y correo electrónico.
  */
export class DatosDelEstablecimientoSeccionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /**
   * Referencia al botón que abre el modal del establecimiento.
   */
  @ViewChild('establecimientoModalButton', { static: false })
  establecimientoModalButton!: ElementRef;

  /**
   * Subject utilizado para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroy$ = new Subject<void>();

  /**
   * Formulario reactivo que contiene los campos del establecimiento.
   */
  detosEstablecimiento!: FormGroup;

  /**
   * Instancia del modal de Bootstrap.
   */
  establecimientoModalInstance!: Modal;

  /**
   * Indica si el formulario debe estar deshabilitado.
   */
  formularioDeshabilitado: boolean = false;

   /**
   * Estado de la solicitud de la sección .
   */
  public solicitudState!: DatosDelSolicituteSeccionState;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para inicializar formularios reactivos.
   * @param establecimientoStore StateStore para sincronizar datos del establecimiento.
   * @param establecimientoQuery Query para obtener el estado inicial del establecimiento.
   */
  constructor(
    private fb: FormBuilder,
    private establecimientoStore: DatosDelSolicituteSeccionStateStore,
    private establecimientoQuery: DatosDelSolicituteSeccionQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroy$),
      map((seccionState)=>{
        this.formularioDeshabilitado = seccionState.readonly; 
        this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Ciclo de vida `OnInit`.
   * Inicializa el formulario y sincroniza los datos con el estado global.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario()

  }
  onControlChange(controlName: string): void {
    const UPDATED_VALUE = { [controlName]: this.detosEstablecimiento.get(controlName)?.value };
    this.establecimientoStore.update(UPDATED_VALUE);
  }
  /**
   * Ciclo de vida `AfterViewInit`.
   * Inicializa la instancia del modal de Bootstrap.
   */
  ngAfterViewInit(): void {
    if (this.establecimientoModalButton) {
      this.establecimientoModalInstance = new Modal(
        this.establecimientoModalButton.nativeElement
      );
    }
  }

  /**
   * Inicializa el formulario reactivo con los campos requeridos y carga el estado inicial.
   * Suscribe el formulario a los cambios del estado global para mantenerlo sincronizado.
   */
  inicializarFormulario(): void {
    this.detosEstablecimiento = this.fb.group({
      establecimientoDenominacionRazonSocial: ['', Validators.required],
      establecimientoCorreoElectronico: ['', [Validators.required, Validators.email]],
    });

    // Cargar el estado inicial en el formulario
    this.establecimientoQuery
      .select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.detosEstablecimiento.patchValue(state, { emitEvent: false });
      });
  }

  /**
   * Abre el modal del establecimiento.
   */
  openEstablecimientoModal(): void {
    this.establecimientoModalInstance.show();
  }

    /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.  
   * Además, obtiene la información del catálogo de mercancía.
   */
  inicializarEstadoFormulario(): void {
    if (this.formularioDeshabilitado) {
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
      if (this.formularioDeshabilitado) {
        this.detosEstablecimiento.disable();
      } else {
        this.detosEstablecimiento.enable();
      }
  }

    /**
   * Maneja el evento de cambio en el campo de RFC del representante.
   * Llama a la función para buscar el representante por RFC.
   */
  hasError(controlName: string, errorName: string){
    return this.detosEstablecimiento.get(controlName)?.touched &&
           this.detosEstablecimiento.get(controlName)?.hasError(errorName);
  }

/** Valida que los campos obligatorios del formulario de domicilio estén completos,  
 *  marcando todos los controles si falta alguno y devolviendo el resultado. */
validarDomicilioFormularios(): boolean {
  const CAMPOS_OBLIGATORIOS = [
    'establecimientoDenominacionRazonSocial',
    'establecimientoCorreoElectronico'
  ];

  const ALL_FILLED = CAMPOS_OBLIGATORIOS.every(field => {
    const VALOR = this.detosEstablecimiento.get(field)?.value;
    return VALOR !== '' && VALOR !== null && VALOR !== undefined;
  });

  if (ALL_FILLED) {
    return true;
  }
  this.detosEstablecimiento.markAllAsTouched();
  return false;
}

  /**
   * Ciclo de vida `OnDestroy`.
   * Limpia las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}