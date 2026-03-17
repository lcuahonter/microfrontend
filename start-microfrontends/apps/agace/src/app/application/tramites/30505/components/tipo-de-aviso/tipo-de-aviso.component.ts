import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { Subject, map, takeUntil } from 'rxjs';

import { AlertComponent, InputCheckComponent } from '@libs/shared/data-access-user/src';
import { Solicitud30505State, Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { AVISO_MOD } from '../../../../core/enums/30505/aviso-de-modificacion.enum';
import { CommonModule } from '@angular/common';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
/**
 * Componente encargado de gestionar el tipo de aviso dentro del trámite 30505.
 * Permite la selección de diferentes tipos de avisos mediante checkboxes y emite los cambios al componente padre.
 * Además, inicializa y mantiene el estado del formulario relacionado con los avisos.
 *
 * @remarks
 * Utiliza un formulario reactivo para manejar los datos de los avisos y se suscribe al estado de la solicitud
 * a través de un store y query específicos del trámite.
 *
 * @example
 * <app-tipo-de-aviso (checkboxChange)="onCheckboxChange($event)"></app-tipo-de-aviso>
 */
@Component({
  selector: 'app-tipo-de-aviso',
  templateUrl: './tipo-de-aviso.component.html',
  styleUrl: './tipo-de-aviso.component.scss',
  standalone: true,
  imports: [CommonModule, AlertComponent, InputCheckComponent, ReactiveFormsModule]
})

export class TipoDeAvisoComponent implements OnDestroy,OnInit {
  
  /**
   * Índice actual utilizado para rastrear la posición o el estado dentro del componente.
   * @default 0
   */
  public indice: number = 0;

  /**
   * Evento emitido cuando cambia el estado de los checkboxes.
   * 
   * @remarks
   * Este evento emite un arreglo de cadenas que representa los valores seleccionados actualmente.
   * 
   * @eventProperty
   */
  @Output() checkboxChange = new EventEmitter<string[]>();

  /**
   * Representa el formulario reactivo utilizado para capturar y validar los datos del aviso.
   * 
   * @type {FormGroup}
   * @see https://angular.io/api/forms/FormGroup
   */
  public avisoForm!: FormGroup;

  /**
   * Contiene el texto del aviso, inicializado con el valor de la constante AVISO_MOD.
   * 
   * @remarks
   * Esta propiedad se utiliza para mostrar o manipular el mensaje de aviso correspondiente
   * al tipo de trámite seleccionado en el componente.
   */
  public TEXTO: string = AVISO_MOD;

  /**
   * Notificador utilizado para destruir suscripciones y evitar fugas de memoria.
   * Se emite un valor cuando el componente es destruido, permitiendo que las suscripciones
   * se cancelen de manera segura utilizando el operador `takeUntil`.
   */
  public destroyNotifier$: Subject<void> = new Subject();

    /**
     * Representa el estado actual de la solicitud 30505 para el aviso.
     * 
     * @type {Solicitud30505State}
     * @private
     */
  private avisoState!: Solicitud30505State;

  /**
   * Arreglo que almacena los identificadores de los checkboxes seleccionados.
   * Cada elemento del arreglo representa el valor de un checkbox que ha sido marcado por el usuario.
   */
  public selectedCheckboxes: string[] = [];

  /**
   * Indica si el componente debe estar en modo solo lectura.
   * Cuando es `true`, los campos y acciones estarán deshabilitados para evitar modificaciones.
   * Valor predeterminado: `false`.
   */
  @Input() soloLectura: boolean = false;
  /**
   * Constructor de la clase TipoDeAvisoComponent.
   * 
   * @param fb - Instancia de FormBuilder para la creación y gestión de formularios reactivos.
   * @param tramiteStore - Instancia de Solicitud30505Store para la gestión del estado de los trámites.
   * @param tramiteQuery - Instancia de Solicitud30505Query para consultar el estado de los trámites.
   */
  constructor(
  private fb: FormBuilder,private tramiteStore:Solicitud30505Store,private tramiteQuery:Solicitud30505Query
  ) {
   
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Aquí se llama a `inicializarFormulario()` para preparar el formulario al cargar el componente.
   */
  ngOnInit(): void {

   this.inicializarFormulario();
  }

  /**
   * Inicializa el formulario de aviso y configura sus valores iniciales.
   *
   * - Suscribe al observable `selectSolicitud$` para obtener el estado actual de la sección y actualizar `AvisoState`.
   * - Crea el formulario reactivo `avisoForm` con los valores obtenidos de `AvisoState`.
   * - Deshabilita los campos `numeroDeOficio` y `fechaFinVigencia` en el formulario.
   * - Asigna los checkboxes seleccionados a la propiedad `selectedCheckboxes`.
   *
   * @returns {void} No retorna ningún valor.
   */
  inicializarFormulario():void{

      this.tramiteQuery.selectSolicitud$
        .pipe(
          takeUntil(this.destroyNotifier$),
          map((seccionState) => {
            this.avisoState = seccionState;
          })
        )
        .subscribe()

    this.avisoForm = this.fb.group({
      numeroDeOficio: [
        { value: this.avisoState?.numeroDeOficio, disabled: true },
      ],
      fechaFinVigencia: [
        { value: this.avisoState?.fechaFinVigencia, disabled: true },
      ],
      avisoDeMod: [this.avisoState?.avisoDeMod],
      avisoDeFusion: [this.avisoState?.avisoDeFusion],
      avisoDeCal: [this.avisoState?.avisoDeCal],
      avisoDenom: [this.avisoState?.avisoDenom]
    });
    
    this.selectedCheckboxes = this.avisoState?.selectedCheckbox;
    if(this.soloLectura) {
      this.avisoForm.disable();
    }
  }


  /**
   * Selecciona una pestaña específica estableciendo el índice actual.
   *
   * @param i - El índice de la pestaña que se desea seleccionar.
   */
  seleccionaTab(i: number): void {
    this.indice = i;
  }

  /**
   * Maneja el evento de cambio de un checkbox para los avisos.
   *
   * @param event - Evento del checkbox que indica si fue marcado o desmarcado.
   * @param controlName - Nombre del control asociado al checkbox.
   *
   * Al marcar o desmarcar un checkbox, actualiza el estado en el store,
   * modifica la lista de checkboxes seleccionados, emite el cambio a través
   * de un EventEmitter y actualiza los datos relacionados en el store.
   */
  onCambiarAviso(controlName: string,event: Event): void {
  
    const CHECKED = (event.target as HTMLInputElement).checked;
    this.tramiteStore.setAviso(controlName,CHECKED); // Set the aviso in the store

    if (CHECKED) {
      this.selectedCheckboxes = [...this.selectedCheckboxes, controlName]; // Create a new array instead of modifying the original
    } else {
      this.selectedCheckboxes = this.selectedCheckboxes.filter(item => item !== controlName); // Remove value if unchecked
    }

    this.checkboxChange.emit(this.selectedCheckboxes); // Emit the updated array
    this.tramiteStore.setCheckboxDatos(this.selectedCheckboxes);
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta cuando el componente es destruido.
   * Notifica a los suscriptores para limpiar recursos y completa el observable `destroyNotifier$`.
   * Es útil para evitar fugas de memoria al cancelar suscripciones activas.
   */
   ngOnDestroy(): void {
     this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}
