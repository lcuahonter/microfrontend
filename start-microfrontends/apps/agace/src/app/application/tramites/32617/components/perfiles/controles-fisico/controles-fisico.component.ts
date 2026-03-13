import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tramite32617Store, Tramites32617State } from '../../../estados/tramites32617.store';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { TEXTOS_ESTATICOS_CONTROLES_FISICO } from '../../../constants/texto-estatico.enum';
import { Tramite32617Query } from '../../../estados/tramites32617.query';

/**
 * @component ControlesFisicoComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con los controles físicos.
 * Permite la captura y validación de datos relacionados con procedimientos documentados, mecanismos de control,
 * registros, características de seguridad, y otros aspectos relacionados con los controles físicos.
 */
@Component({
  selector: 'app-controles-fisico',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './controles-fisico.component.html',
  styleUrl: './controles-fisico.component.scss',
})
export class ControlesFisicoComponent implements OnInit, OnDestroy {
   /**
   * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
   */
    public textos = TEXTOS_ESTATICOS_CONTROLES_FISICO
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} controlesFisico
   * @description
   * Formulario reactivo que contiene los campos relacionados con los controles físicos.
   */
  controlesFisico!: FormGroup;

  /**
   * @property {Tramites32617State} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Tramites32617State;

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
   * @param {Tramite32610Store} Tramite32610Store - Store para gestionar el estado de la solicitud.
   * @param {Tramite32617Query} tramite32617Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32617Store: Tramite32617Store,
    private tramite32617Query: Tramite32617Query
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
    this.tramite32617Query.selectTramite32617$
      .pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((seccionState) => {
        this.solicitudState = seccionState;
        if (!this.controlesFisico) {
          this.crearFormularioControlesFisico();
        } else {
          this.actualizarFormularioConEstado();
        }
      });
  }

  /**
   * @method crearFormularioControlesFisico
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para los controles físicos.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioControlesFisico(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.controlesFisico = this.fb.group({
      ...ControlesFisicoComponent.crearControlesPrincipales(PERFILES),
      ...ControlesFisicoComponent.crearControlesSecundarios(PERFILES)
    });
  }

  /**
   * @method crearControlesPrincipales
   * @description
   * Crea los controles principales del formulario.
   */
  private static crearControlesPrincipales(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      procedimientoDocumentado: [perfiles['procedimientoDocumentado'] || '', Validators.required],
      indiqueNumero: [perfiles['indiqueNumero'] || '', Validators.required],
      cargosFunciones: [perfiles['cargosFunciones'] || '', Validators.required],
      casoContratarse: [perfiles['casoContratarse'] || '', Validators.required],
      casoContar: [perfiles['casoContar'] || '', Validators.required],
      describirProcedimiento: [perfiles['describirProcedimiento'] || '', Validators.required],
      indiqueMecanismos: [perfiles['indiqueMecanismos'] || '', Validators.required],
      indicarEmpleados: [perfiles['indicarEmpleados'] || '', Validators.required],
      indiqueIdentifica: [perfiles['indiqueIdentifica'] || '', Validators.required],
      describaEmpresa: [perfiles['describaEmpresa'] || '', Validators.required]
    };
  }

  /**
   * @method crearControlesSecundarios
   * @description
   * Crea los controles secundarios del formulario.
   */
  private static crearControlesSecundarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiqueAsegura: [perfiles['indiqueAsegura'] || '', Validators.required],
      procedimientoParaControl: [perfiles['procedimientoParaControl'] || '', Validators.required],
      senaleRegistros: [perfiles['senaleRegistros'] || '', Validators.required],
      senaleQuien: [perfiles['senaleQuien'] || '', Validators.required],
      describaRecepion: [perfiles['describaRecepion'] || '', Validators.required],
      indiqueEncargado: [perfiles['indiqueEncargado'] || '', Validators.required],
      indiqueIdentfica: [perfiles['indiqueIdentfica'] || '', Validators.required],
      senaleComo: [perfiles['senaleComo'] || '', Validators.required],
      describaCaracteristicas: [perfiles['describaCaracteristicas'] || '', Validators.required],
      senaleAccion: [perfiles['senaleAccion'] || '', Validators.required],
      registroVisitantes: [perfiles['registroVisitantes'] || '', Validators.required]
    };
  }

  /**
   * @method actualizarFormularioConEstado
   * @description
   * Actualiza los valores del formulario con los datos del estado actual.
   * Se ejecuta cuando el estado cambia después de la inicialización del formulario.
   */
  actualizarFormularioConEstado(): void {
    if (!this.controlesFisico || !this.solicitudState?.perfiles) {
      return;
    }
    const PERFILES = this.solicitudState.perfiles;
    Object.keys(this.controlesFisico.controls).forEach(fieldName => {
      const CONTROL = this.controlesFisico.get(fieldName);
      const STATE_VALUE = PERFILES[fieldName as keyof typeof PERFILES];
      if (CONTROL && STATE_VALUE !== undefined && STATE_VALUE !== null && STATE_VALUE !== '') {
        if (CONTROL.value !== STATE_VALUE) {
          CONTROL.setValue(STATE_VALUE, { emitEvent: false });
        }
      }
    });
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
      this.tramite32617Store.establecerDatos({ perfiles: { [campo]: CONTROL.value } });
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