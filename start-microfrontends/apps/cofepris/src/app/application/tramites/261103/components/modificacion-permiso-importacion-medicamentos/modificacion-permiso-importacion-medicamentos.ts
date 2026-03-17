

import { AlertComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosProcedureQuery } from '../../estados/tramites261103.query';
import { DatosProcedureState } from '../../estados/tramites261103.store';
import { DatosProcedureStore } from '../../estados/tramites261103.store';
import { DatosestablecimientoComponent } from '../datos-establecimiento/datos-establecimiento.component';
import { DomicilioEstablecimientosComponent } from '../domicilio-establecimientos/domicilio-establecimientos.component';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { InputRadioComponent } from '@libs/shared/data-access-user/src';
import { ManifiestosComponent } from '../manifiestos/manifiestos.component';
import { MercanciasComponent } from '../mercancias/mercancias.component';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RepresentanteLegalComponent } from '../representantelegal/representante-legal.component';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';




@Component({
  selector: 'app-modificacion-permiso-importacion-medicamentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatosestablecimientoComponent,
    DomicilioEstablecimientosComponent, MercanciasComponent, ManifiestosComponent,
    RepresentanteLegalComponent, InputRadioComponent, TituloComponent, AlertComponent],
  templateUrl: './modificacion-permiso-importacion-medicamentos.html',
  styleUrl: './modificacion-permiso-importacion-medicamentos.scss',
})
export class ModificacionPermisoImportacionMedicamentosComponent implements OnInit, OnDestroy {
  /**
   * Formulario reactivo para datos preoperativos.
   */
  preOperativeForm!: FormGroup;
  /** Subject para notificar la destrucción del componente */
  private destroy$ = new Subject<void>();

  /**
   * Referencias a los componentes hijos para poder llamar sus métodos de habilitación/deshabilitación
   */
  @ViewChild(DatosestablecimientoComponent) datosEstablecimientoComponent!: DatosestablecimientoComponent;
  @ViewChild(DomicilioEstablecimientosComponent) domicilioEstablecimientosComponent!: DomicilioEstablecimientosComponent;
  @ViewChild(MercanciasComponent) mercanciasComponent!: MercanciasComponent;
  @ViewChild(ManifiestosComponent) manifestosComponent!: ManifiestosComponent;
  @ViewChild(RepresentanteLegalComponent) representanteLegalComponent!: RepresentanteLegalComponent;

    /**
   * Opciones del componente de radio input.
   * @public
   */
    public radioOptions: { label: string; value: string }[] = [
      { label: 'Prórroga', value: 'Prorroga' },
      { label: 'Modificación', value: 'Modificacion' },
    ];
  /**
   * Clase de alerta informativa.
   */
  infoAlert = 'alert-info';

/**
 * Estado de la sección que contiene los datos del procedimiento.
 * 
 * Esta propiedad almacena el estado actual de los datos relacionados con el procedimiento.
 * Se inicializa a través de un observable en el método `obtenerDatosFormulario`, 
 * que suscribe a los cambios en el estado y actualiza esta propiedad con los datos más recientes.
 * 
 * Tipo: `DatosProcedureState`
 * 
 * @private
 */
  private seccionState!: DatosProcedureState;
    /**
   * Subject para notificar la destrucción del componente.
   */
    private destroyNotifier$: Subject<void> = new Subject();
    /**
    * Indica si el formulario está en modo solo lectura.
    * Cuando es `true`, los campos del formulario no se pueden editar.
    */
    esFormularioSoloLectura: boolean = false;
  /**
 * Constructor de la clase `DatosSolicitudComponent`.
 * 
 * Este constructor inicializa las dependencias necesarias para el funcionamiento del componente.
 * 
 * @param fb - Servicio `FormBuilder` utilizado para crear formularios reactivos.
 * @param store - Almacén de estado `DatosProcedureStore` para gestionar el estado de los datos del procedimiento.
 * @param query - Consulta `DatosProcedureQuery` para obtener datos del estado de los procedimientos.
 */
  constructor(private fb: FormBuilder,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaioQuery: ConsultaioQuery) {
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
          map((seccionState: { readonly: boolean }) => {
            this.esFormularioSoloLectura = seccionState.readonly;
            this.guardarDatosFormulario();
            this.disableGenerical();
          })
        )
        .subscribe()
  }
  /**
 * Gancho de ciclo de vida `ngOnInit`.
 * 
 * Este método se ejecuta automáticamente cuando el componente es inicializado por Angular.
 * Su propósito es realizar configuraciones iniciales necesarias para el correcto funcionamiento del componente.
 * 
 * En este caso, se realizan las siguientes acciones:
 * 
 * 1. `obtenerDatosFormulario()`: 
 *    - Método que suscribe a un observable para obtener los datos del estado del procedimiento.
 *    - Actualiza la propiedad `seccionState` con los datos más recientes.
 * 
 * 2. `crearFormulario()`: 
 *    - Método que inicializa el formulario reactivo `preOperativeForm` con los valores obtenidos del estado.
 *    - Define las validaciones necesarias para los campos del formulario.
 * 
 * @returns void
 */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
  }

  /**
* Gancho de ciclo de vida OnDestroy
*/
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
    * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
    * @param form - El formulario reactivo.
    * @param campo - El nombre del campo en el formulario.
    */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.store.establecerDatos({ [campo]: VALOR });
  }
  /**
 * Método para inicializar el formulario reactivo `preOperativeForm`.
 * Este formulario contiene los campos necesarios para capturar los datos preoperativos.
 * 
 * Campos del formulario:
 * - `ideGenerica1`: Campo opcional que se inicializa con el valor de `ideGenerica1` 
 *   del estado `seccionState`.
 * - `observaciones`: Campo obligatorio que se inicializa con el valor de `observaciones` 
 *   del estado `seccionState` y tiene una validación de requerido.
 * 
 * @returns void
 */
  crearFormulario(): void {
    this.query.selectProrroga$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.seccionState = seccionState;
      })
    )
    .subscribe()
    this.preOperativeForm = this.fb.group({
      ideGenerica1: [this.seccionState?.ideGenerica1],
      observaciones: [this.seccionState?.observaciones, [Validators.required]],
    });

    this.disableGenerical();
  }
  /**
   * Validar campo del formulario
   * @param field Nombre del campo
   * @returns Booleano que indica si el campo es válido
   */
  isValid(field: string): boolean {
    return Boolean(ModificacionPermisoImportacionMedicamentosService.isValid(this.preOperativeForm, field));
  }
  /**
* Gancho de ciclo de vida obtenerDatosFormulario
*/
  obtenerDatosFormulario(): void {
    this.query.selectProrroga$?.pipe(takeUntil(this.destroy$))
      .subscribe((data: DatosProcedureState) => {
        this.seccionState = data;
      });
  }
/**
 * Inicializa el estado del formulario.
 * 
 * Este método evalúa si el formulario debe ser inicializado en modo solo lectura o en modo editable.
 * 
 * 1. Si el formulario está en modo solo lectura (`esFormularioSoloLectura`):
 *    - Llama al método `guardarDatosFormulario` para cargar los datos y deshabilitar el formulario.
 * 
 * 2. Si el formulario no está en modo solo lectura:
 *    - Llama al método `obtenerDatosFormulario` para cargar los datos del estado actual.
 * 
 * Este método es útil para configurar el estado inicial del formulario y sincronizarlo
 * con los datos del estado global de la aplicación.
 * 
 * @returns {void}
 */
inicializarEstadoFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.guardarDatosFormulario();
    this.disableGenerical();
  } else {
    this.obtenerDatosFormulario();
  }
}
/**
* Carga los datos del formulario y actualiza su estado.
* 
* Este método realiza las siguientes acciones:
* 
* 1. Llama al método `obtenerDatosFormulario` para cargar los datos del estado actual.
* 2. Llama al método `crearFormulario` para inicializar el formulario reactivo con los datos obtenidos.
* 3. Evalúa si el formulario está en modo solo lectura (`esFormularioSoloLectura`):
*    - Si está en modo solo lectura, deshabilita el formulario utilizando el método `disable`.
*    - Si no está en modo solo lectura, habilita el formulario utilizando el método `enable`.
* 4. Aplica el estado del formulario a todos los componentes hijos a través de `disableGenerical`.
* 
* Este método es útil para sincronizar los datos del formulario con el estado global de la aplicación
* y configurar su estado (habilitado o deshabilitado) según corresponda.
* 
* @returns {void}
*/
guardarDatosFormulario(): void {
  this.obtenerDatosFormulario();
  this.crearFormulario();
  if (this.esFormularioSoloLectura) {
    this.preOperativeForm.disable();
  } else {
    this.preOperativeForm.enable();
  }
  
  // Aplicar el estado del formulario a todos los componentes hijos
  this.disableGenerical();
}


/**
   * Deshabilita o habilita el control 'observaciones' en el formulario `preOperativeForm`
   * basado en el estado de solo lectura del formulario y el valor del control 'ideGenerica1'.
   * También aplica la misma lógica de habilitación/deshabilitación a todos los componentes hijos.
   *
   * - Si el formulario no está inicializado, el método retorna inmediatamente.
   * - Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es true), 
   *   el control 'observaciones' y todos los campos de componentes hijos siempre se deshabilitan.
   * - Si el formulario no está en modo solo lectura, el control 'observaciones' y los campos
   *   de componentes hijos se deshabilitan a menos que el valor de 'ideGenerica1' sea exactamente 
   *   'Modificacion', en cuyo caso se habilitan.
   * - Aplica el estado de solo lectura a todos los componentes hijos llamando sus respectivos métodos.
   */
  disableGenerical(): void {
    // Verificar si el formulario está inicializado antes de acceder a él
    if (!this.preOperativeForm) {
      return;
    }

    // Determinar si los campos deben estar habilitados o deshabilitados
    const DEBE_ESTAR_HABILITADO = !this.esFormularioSoloLectura && 
                               (this.preOperativeForm.get('ideGenerica1')?.value === 'Modificacion');

    // Aplicar estado al campo observaciones del formulario principal
    if (DEBE_ESTAR_HABILITADO) {
      this.preOperativeForm.get('observaciones')?.enable();
    } else {
      this.preOperativeForm.get('observaciones')?.disable();
    }

    // Aplicar el estado a todos los componentes hijos
    this.aplicarEstadoFormularioComponentesHijos(DEBE_ESTAR_HABILITADO);
  }

  /**
   * Aplica el estado del formulario (habilitado/deshabilitado) a todos los componentes hijos.
   * 
   * Este método llama a los métodos de aplicación de estado de formulario de cada componente hijo
   * considerando tanto el estado de solo lectura como la lógica condicional de habilitación.
   * 
   * @param DEBE_ESTAR_HABILITADO - Indica si los formularios deben estar habilitados (true) o deshabilitados (false)
   * 
   * Componentes controlados:
   * - datos-establecimiento: Controla formulario `datosdelestablecimiento`
   * - domicilio-establecimientos: Controla formularios `domicilioEstablecimiento` y `AvisodeFuncionamiento`
   * - mercancias: Controla formulario `aduanaFormulario`
   * - manifiestos: Controla formulario `Aduana`
   * - representante-legal: Controla formulario `domicilioEstablecimiento`
   * 
   * @returns {void}
   */
  private aplicarEstadoFormularioComponentesHijos(DEBE_ESTAR_HABILITADO: boolean): void {
    // Establecer temporalmente el estado para que los componentes hijos lo lean
    const ESTADO_ORIGINAL = this.esFormularioSoloLectura;
    this.esFormularioSoloLectura = !DEBE_ESTAR_HABILITADO;

    // Aplicar estado al componente de datos de establecimiento
    if (this.datosEstablecimientoComponent) {
      this.datosEstablecimientoComponent.esFormularioSoloLectura = !DEBE_ESTAR_HABILITADO;
      this.datosEstablecimientoComponent.aplicarEstadoFormulario();
    }

    // Aplicar estado al componente de domicilio de establecimientos
    if (this.domicilioEstablecimientosComponent) {
      this.domicilioEstablecimientosComponent.esFormularioSoloLectura = !DEBE_ESTAR_HABILITADO;
      this.domicilioEstablecimientosComponent.guardarDatosFormulario();
    }

    // Aplicar estado al componente de mercancías
    if (this.mercanciasComponent) {
      this.mercanciasComponent.esFormularioSoloLectura = !DEBE_ESTAR_HABILITADO;
      this.mercanciasComponent.guardarDatosFormulario();
    }

    // Aplicar estado al componente de manifiestos
    if (this.manifestosComponent) {
      this.manifestosComponent.esFormularioSoloLectura = !DEBE_ESTAR_HABILITADO;
      this.manifestosComponent.aplicarEstadoFormulario();
    }

    // Aplicar estado al componente de representante legal
    if (this.representanteLegalComponent) {
      this.representanteLegalComponent.esFormularioSoloLectura = !DEBE_ESTAR_HABILITADO;
      this.representanteLegalComponent.aplicarEstadoFormulario();
    }

    // Restaurar el estado original
    this.esFormularioSoloLectura = ESTADO_ORIGINAL;
  }


}
