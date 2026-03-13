import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Solicitud32605State, Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { OPCIONES_DE_BOTON_DE_RADIO } from '@libs/shared/data-access-user/src/tramites/constantes/31616/datos-comunes.enum';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';
import { TEXTOS_ESTATICOS_SEGURIDAD_COMERCIALES } from '../../../constants/texto-estatico-tres.enum';
/**
 * @component SociosComercialesComponent
 * @description
 * Componente encargado de gestionar el formulario relacionado con los socios comerciales.
 * Permite la captura y validación de datos relacionados con procedimientos, medidas de seguridad,
 * formatos, periodicidad, y otros aspectos relacionados con los socios comerciales.
 */
@Component({
  selector: 'app-socios-comerciales',
  standalone: true,
  imports: [InputRadioComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './socios-comerciales.component.html',
  styleUrl: './socios-comerciales.component.scss',
})
export class SociosComercialesComponent implements OnInit, OnDestroy {
  /**
 * Contiene los textos estáticos utilizados en la vista, definidos en el archivo de constantes.
 */
  public textos = TEXTOS_ESTATICOS_SEGURIDAD_COMERCIALES
  /**
   * @property {string[]} opcionDeBotonDeRadio
   * @description
   * Opciones disponibles para los botones de radio en el formulario.
   */
  opcionDeBotonDeRadio = OPCIONES_DE_BOTON_DE_RADIO;

  /**
   * @property {FormGroup} sociosComercialesForm
   * @description
   * Formulario reactivo que contiene los campos relacionados con los socios comerciales.
   */
  sociosComercialesForm!: FormGroup;

  /**
   * @property {Solicitud32605State} solicitudState
   * @description
   * Estado actual de la solicitud, obtenido desde el store.
   * Contiene los valores iniciales para los campos del formulario.
   */
  private solicitudState!: Solicitud32605State;

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
   * @param {Solicitud32605Store} tramite32605Store - Store para gestionar el estado de la solicitud.
   * @param {Solicitud32605Query} tramite32605Query - Query para obtener datos del estado de la solicitud.
   */
  constructor(
    private fb: FormBuilder,
    private tramite32605Store: Solicitud32605Store,
    private tramite32605Query: Solicitud32605Query,
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
      this.crearFormularioSociosComerciales();
    }
  }

  /**
   * @method crearFormularioSociosComerciales
   * @description
   * Crea y configura el formulario reactivo con los campos necesarios para los socios comerciales.
   * Los valores iniciales se obtienen del estado de la solicitud.
   */
  crearFormularioSociosComerciales(): void {
    const PERFILES = this.solicitudState?.perfiles || {};
    
    this.sociosComercialesForm = this.fb.group({
      ...SociosComercialesComponent.crearControlesPrimarios(PERFILES),
      ...SociosComercialesComponent.crearControlesSecundarios(PERFILES)
    });
  }

  /**
   * Crea los controles primarios del formulario de socios comerciales.
   */
  private static crearControlesPrimarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiqueLleva: [perfiles['indiqueLleva'] || '', Validators.required],
      // eslint-disable-next-line @typescript-eslint/dot-notation, dot-notation
      describaProcedimientoDos: [perfiles['describaProcedimientoDos'] || '', Validators.required],
      indiqueSocios: [perfiles['indiqueSocios'] || '', Validators.required],
      indiqueForma: [perfiles['indiqueForma'] || '', Validators.required],
      indiqueExisten: [perfiles['indiqueExisten'] || '', Validators.required],
      indiqueCuenta: [perfiles['indiqueCuenta'] || '', Validators.required],
      procedimientoRealizar: [perfiles['procedimientoRealizar'] || '', Validators.required]
    };
  }

  /**
   * Crea los controles secundarios del formulario de socios comerciales.
   */
  private static crearControlesSecundarios(perfiles: Record<string, unknown>): Record<string, unknown[]> {
    return {
      indiquePeriodicidad: [perfiles['indiquePeriodicidad'] || '', Validators.required],
      describaComo: [perfiles['describaComo'] || '', Validators.required],
      comoAseguran: [perfiles['comoAseguran'] || '', Validators.required],
      indiqueFormatos: [perfiles['indiqueFormatos'] || '', Validators.required],
      senalarMedidas: [perfiles['senalarMedidas'] || '', Validators.required],
      casoSocios: [perfiles['casoSocios'] || '', Validators.required]
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
