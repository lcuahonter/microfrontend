import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud32605State, Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';
import { TEXTOS_ESTATICOS_SEGURIDAD_PERSONAL } from '../../../constants/texto-estatico-tres.enum';

/**
 * Componente encargado de gestionar la sección de "Seguridad del Personal"
 * dentro del trámite 31616. Administra un formulario con validaciones y se
 * sincroniza con el store y el query personalizados para persistir el estado.
 */
@Component({
  selector: 'app-seguridad-personal',
  standalone: true,
  imports: [
    InputRadioComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './seguridad-personal.component.html',
  styleUrl: './seguridad-personal.component.scss'
})
export class SeguridadPersonalComponent implements OnInit,OnDestroy{
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_PERSONAL

  /**
   * Formulario reactivo que contiene los campos relacionados con la seguridad del personal.
   */
  seguridadPersonal!: FormGroup;

  /**
   * Opciones de selección para botones de radio reutilizables en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * Estado actual de la solicitud del trámite, obtenido desde el query.
   */
  public solicitudState!: Solicitud32605State;

  /**
   * Sujeto utilizado para cancelar suscripciones activas al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * Constructor del componente.
   * 
   * @param fb Constructor de formularios reactivos.
   * @param tramite32605Store Store personalizado del trámite 31616.
   * @param tramite32605Query Query personalizado del trámite 31616.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32605Store: Solicitud32605Store,
    private tramite32605Query: Solicitud32605Query
  ) {
    //Añade lógica aquí
  }

  /**
   * Hook de inicialización del componente.
   * Se suscribe al estado del query y genera el formulario con datos precargados.
   */
  ngOnInit(): void {
    this.tramite32605Query.selectSolicitud$
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        this.actualizarFormularioConEstado();
      });
  }

  /**
   * Actualiza el formulario con el estado actual si está disponible.
   */
  private actualizarFormularioConEstado(): void {
    if (this.solicitudState) {
      this.crearFormularioDeGestión();
    }
  }

  /**
   * Crea el formulario reactivo utilizando los valores actuales del estado.
   * Cada campo incluye una validación requerida para asegurar su completitud.
   */
  crearFormularioDeGestión(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.seguridadPersonal = this.fb.group({
      ...SeguridadPersonalComponent.crearControlesPrimarios(PERFILES),
      ...SeguridadPersonalComponent.crearControlesSecundarios(PERFILES)
    });
  }

  /**
   * Crea los controles primarios del formulario de seguridad personal.
   */
  private static crearControlesPrimarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      describaContratacion: [perfiles['describaContratacion'] || '', Validators.required],
      documentacionExigida: [perfiles['documentacionExigida'] || '', Validators.required],
      examenesSolicitados: [perfiles['examenesSolicitados'] || '', Validators.required],
      conformeAnalisis: [perfiles['conformeAnalisis'] || '', Validators.required],
      periodicidad: [perfiles['periodicidad'] || '', Validators.required],
      confidencialidad: [perfiles['confidencialidad'] || '', Validators.required],
      contratacionPersonal: [perfiles['contratacionPersonal'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles secundarios del formulario de seguridad personal.
   */
  private static crearControlesSecundarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      describaProcedimientoPersonal: [perfiles['describaProcedimientoPersonal'] || '', Validators.required],
      seguimientoProcedimiento: [perfiles['seguimientoProcedimiento'] || '', Validators.required],
      identificaciones: [perfiles['identificaciones'] || '', Validators.required],
      sistemasInformaticos: [perfiles['sistemasInformaticos'] || '', Validators.required],
      proveedoresServicios: [perfiles['proveedoresServicios'] || '', Validators.required],
      administracionPersonal: [perfiles['administracionPersonal'] || '', Validators.required],
      expliqueBrevemente: [perfiles['expliqueBrevemente'] || '', Validators.required]
    };
  }

  /**
   * Establece valores en el store desde un control de formulario específico.
   * Actualiza el estado global con el valor del campo si no es nulo o indefinido.
   * 
   * param form - Formulario que contiene el control
   * param campo - Nombre del campo a actualizar en el store
   */
  setValoresStore(form: FormGroup | null, campo: string): void {
    if (!form) {
      return;
    }
    const CONTROL = form.get(campo);
    if (CONTROL && CONTROL.value !== null && CONTROL.value !== undefined) {
      this.tramite32605Store.actualizarEstado({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * Hook de destrucción del componente.
   * Cancela todas las suscripciones activas emitiendo y completando el `destroyNotifier$`.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
