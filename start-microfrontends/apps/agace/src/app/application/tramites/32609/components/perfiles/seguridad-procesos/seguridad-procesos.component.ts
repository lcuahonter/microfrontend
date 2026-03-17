import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
 Tramite32609Store,
  Tramites32609State,
} from '../../../estados/tramites32609.store';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { TEXTOS_ESTATICOS_SEGURIDAD_PROCESOS } from '../../../enums/texto-estatico-tres.enum';
import { Tramite32609Query } from '../../../estados/tramites32609.query';

/**
 * @component SeguridadProcesosComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con la seguridad de los procesos.
 * Permite la captura y validación de datos relacionados con almacenes, tecnologías, procesamiento,
 * validación, y otros aspectos relacionados con la seguridad de los procesos.
 */
@Component({
  selector: 'app-seguridad-procesos',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './seguridad-procesos.component.html',
  styleUrl: './seguridad-procesos.component.scss',
})
export class SeguridadProcesosComponent implements OnInit, OnDestroy {
    /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_SEGURIDAD_PROCESOS
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} seguridadProcesosForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con la seguridad de los procesos.
   */
  seguridadProcesosForm!: FormGroup;

  /**
   * @property {Tramites32609State} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Tramites32609State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description
   * Notificador utilizado para gestionar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @constructor
   * @description
   * Constructor que inicializa los servicios necesarios para el componente.
   * @param {FormBuilder} fb - Servicio para construir formularios reactivos.
   * @param {Tramite32609Store} tramite32609Store - Store para gestionar el estado de la solicitud.
   * @param {Tramite32609Query} tramite32609Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32609Store: Tramite32609Store,
    private tramite32609Query: Tramite32609Query
  ) {
    //Añade lógica aquí
  }

  /**
   * @method ngOnInit
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario y suscribe al estado de la solicitud.
   */
  ngOnInit(): void {
    this.tramite32609Query.selectTramite32609$
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
      this.crearFormularioSeguridadProcesos();
    }
  }

  /**
   * @method crearFormularioSeguridadProcesos
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para la seguridad de los procesos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioSeguridadProcesos(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.seguridadProcesosForm = this.fb.group({
      ...SeguridadProcesosComponent.crearControlesPrimarios(PERFILES),
      ...SeguridadProcesosComponent.crearControlesSecundarios(PERFILES)
    });
  }

  /**
   * Crea los controles primarios del formulario de seguridad de procesos.
   */
  private static crearControlesPrimarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiqueAlmacenes: [perfiles['indiqueAlmacenes'] || '', Validators.required],
      expliqueBrevementeDos: [perfiles['expliqueBrevementeDos'] || '', Validators.required],
      indiqueCerciora: [perfiles['indiqueCerciora'] || '', Validators.required],
      indiqueEstos: [perfiles['indiqueEstos'] || '', Validators.required],
      indiquePertenecen: [perfiles['indiquePertenecen'] || '', Validators.required],
      indiqueResponsable: [perfiles['indiqueResponsable'] || '', Validators.required],
      indiqueTecnologia: [perfiles['indiqueTecnologia'] || '', Validators.required],
      describirProcesamiento: [perfiles['describirProcesamiento'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles secundarios del formulario de seguridad de procesos.
   */
  private static crearControlesSecundarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      detalleComo: [perfiles['detalleComo'] || '', Validators.required],
      indiqueUtiliza: [perfiles['indiqueUtiliza'] || '', Validators.required],
      detalleValida: [perfiles['detalleValida'] || '', Validators.required],
      comoNumero: [perfiles['comoNumero'] || '', Validators.required],
      senaleAsociados: [perfiles['senaleAsociados'] || '', Validators.required],
      estosEmpresa: [perfiles['estosEmpresa'] || '', Validators.required]
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
      this.tramite32609Store.establecerDatos({ perfiles: { [campo]: CONTROL.value } });
    }
  }

  /**
   * @method ngOnDestroy
   * @description
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Libera las suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}