/* eslint-disable @nx/enforce-module-boundaries */
/**
 * @module UsoEspicificoComponent
 * @description Componente para el formulario de Uso Específico, permitiendo al usuario ingresar información sobre el uso específico de un producto, incluyendo la fracción arancelaria y una descripción.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Catalogo } from 'libs/shared/data-access-user/src/core/models/shared/catalogos.model';

import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from 'libs/shared/data-access-user/src/tramites/components/table/table.component';
import { TituloComponent } from "libs/shared/data-access-user/src/tramites/components/titulo/titulo.component";

import fraccionOptionJson from 'libs/shared/theme/assets/json/130102/fracciónarancelaria-options.json';

import { CatalogoSelectClaveComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select-clave/catalogo-select.component';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src/tramites/components/catalogo-select/catalogo-select.component';

import { CommonModule } from '@angular/common';

import { Solicitud130102State, Tramite130102Store } from '../../estados/tramites/tramite130102.store';
import { Tramite130102Query } from '../../estados/queries/tramite130102.query';

import { Subject, map, takeUntil } from 'rxjs'; 
import { FormularioRegistroService } from '../../services/octava-temporal.service';

import { ConsultaioQuery, ConsultaioState, Notificacion, NotificacionesComponent, TablaDinamicaComponent, TablaSeleccion } from '@ng-mf/data-access-user';
import { ESPECIFICO_PREFILL, FRACCIONES_ANARCIA_TABLA } from '../../constantes/octava-temporal.enum';
import { CatOctavaTemporalService } from '../../services/cat-octava-temporal.service';
import { FraccionArancelariaProsec } from '../../models/octava-temporal.model';
import { FraccionesProsecRequest } from '../../models/request/regla-octava-request.model';

@Component({
  selector: 'app-uso-especifico',
  standalone: true,
  imports: [TituloComponent, CatalogoSelectComponent, CatalogoSelectClaveComponent, TableComponent, ReactiveFormsModule, CommonModule,TablaDinamicaComponent,NotificacionesComponent],
  templateUrl: './uso-especifico.component.html',
  styleUrl: './uso-especifico.component.scss'
})
export class UsoEspicificoComponent implements OnInit, OnDestroy {
   /**
       * @property {TablaSeleccion} tablaSeleccion
       * @description Tabla de selección para la tabla de cupos.
       */
      tablaSeleccion = TablaSeleccion;
  /*
    * @description Configuración de la tabla para mostrar las fracciones arancelarias.
    * @type {TablaDinamicaComponent}
    */
    
    configuracionTabla =FRACCIONES_ANARCIA_TABLA;
/**
 * @description Lista de fracciones arancelarias PROSEC.
 * @type {FraccionesProsecRequest[]}
 */
     datosSocios: FraccionesProsecRequest[] = [];

  /**
   * @description Formulario para el uso específico.
   * @type {FormGroup}
   */
  usoEspicificoForm!: FormGroup;


  /**
   * @description Opciones del catálogo de fracción arancelaria.
   * @type {Catalogo[]}
   */
  catalogos: Catalogo[] = [];

  /**
   * Estado actual de la solicitud 130102, obtenido desde el store.
    **/
  public solicitudState!: Solicitud130102State;

  /**
   * Observable utilizado para cancelar suscripciones al destruir el componente.
   */
  private destroyNotifier$: Subject<void> = new Subject();
  /**  
 * Filas seleccionadas en la tabla.  
 * Contiene objetos de tipo `FraccionArancelariaProsec`.  
 */  
 filasSeleccionadas: FraccionesProsecRequest[] = []; 
 /**
   * Notificación para mostrar alertas al usuario.
   */
  alertaNotificacion!: Notificacion;
  /*
  * @description Estado actual de la consulta, obtenido desde el store.
  */
  public consultaState!: ConsultaioState;

  /**
   * @constructor
   * @param {FormBuilder} formbuilt Servicio para construir el formulario.
   */
  constructor(private formbuilt: FormBuilder,
    private tramite130102Store: Tramite130102Store,
    private tramite130102Query: Tramite130102Query,
    private formularioRegistroService: FormularioRegistroService,
    private consultaioQuery: ConsultaioQuery,
    private catOctavaTemporalService: CatOctavaTemporalService
  ) { 

         this.inicializarFormulario();
  }

  /**
   * @method ngOnInit
   * @description Inicializa el componente y configura el formulario con reglas de validación.
   * @memberof UsoEspicificoComponent
   */
  ngOnInit(): void {
   
    this.obtienerDivisionesFraccion();
  }


  /**
   * Obtiene las divisiones de la fracción arancelaria seleccionada y actualiza el catálogo.
   * @param cveFraccion Clave de la fracción arancelaria para obtener las divisiones correspondientes.
   * @returns void
   *  
   */
  obtienerDivisionesFraccion(): void {
    this.catOctavaTemporalService.getDivisionesFraccionArancelaria().pipe(
      takeUntil(this.destroyNotifier$))
      .subscribe((data) => {
        this.catalogos = data.datos.map((item, index) => ({
          id: index,
          clave: item.clave,
          descripcion: item.clave + ' - ' + item.descripcion,
        }));  
    });
  }



  /**
   * @method inicializarEstadoFormulario
   * @description Inicializa el estado del formulario según si es de solo lectura o editable.
   * @memberof UsoEspicificoComponent
   */
  inicializarEstadoFormulario(): void {
    if (this.consultaState.readonly) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario();
    }
   
  }
  /*
    * Guarda los datos del formulario y ajusta su estado según si es de solo lectura o no.
    * @returns void
    * */
   guardarDatosFormulario(): void {
      this.inicializarFormulario();
      if (this.consultaState.readonly) {
        this.usoEspicificoForm.disable();
      } else if (!this.consultaState.readonly) {
        this.usoEspicificoForm.enable();
      } else {
        // No se requiere ninguna acción en el formulario
      }
  }
  /**
   * @method inicializarFormulario
   * @description Inicializa el formulario reactivo y sus validaciones.
   */
  inicializarFormulario(): void {
   
    this.usoEspicificoForm = this.formbuilt.group({
      fraccionArancelariaProsec: ['', Validators.required],
      descripcion: ['', [Validators.required, UsoEspicificoComponent.noLeadingSpacesValidator]],
    });

  }
    /**
   * Asigna un valor del formulario al store.
   *
   * @param {FormGroup} form - Formulario reactivo.
   * @param {string} campo - Campo del formulario a obtener.
   * @param {keyof Tramite130102Store} metodoNombre - Método del store donde se guardará el valor.
   */
   setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Tramite130102Store): void {
      const VALOR = form.get(campo)?.value;
      (this.tramite130102Store[metodoNombre] as (value: string | number | boolean) => void)(VALOR);
    }

  /**
   * @method obtenerRequisitosFraccionArancelariaEsquema
   * @description Actualiza el formulario con el ID y la descripción de la fracción arancelaria seleccionada.
   * @memberof UsoEspicificoComponent
   */
  obtenerRequisitosFraccionArancelariaEsquema(): void {
    const DESCRIPCION = 'Descripción fraccion PROSEC (Especificar el nombre comercial o técnico del producto en el que se utilizará la mercancía a importar)';
    this.usoEspicificoForm.get('descripcion')?.setValue(DESCRIPCION);
    this.tramite130102Store.setDynamicFieldValue('descripcion', DESCRIPCION);
  }

  /**
  * Validador que verifica que el valor del campo no tenga espacios al inicio ni al final.
  * 
  * @param control - Control del formulario a validar.
  * @returns Un objeto con el error 'leadingSpaces' si hay espacios al inicio o final, o null si es válido.
  */
  private static noLeadingSpacesValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.trim() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  }

  /**
   * compo doc
   * @method agregar
   * @description
   * Este método se utiliza para agregar una nueva entrada específica a la tabla dinámica.
   * Verifica si el formulario `ninoFormGroup` es válido antes de crear un objeto con los datos
   * específicos. Luego, agrega este objeto a la lista de datos de la tabla y actualiza el
   * estado dinámico del trámite con la nueva entrada. Finalmente, reinicia el formulario.
   *
   * Funcionalidad:
   * - Valida el formulario `ninoFormGroup` antes de procesar los datos.
   * - Crea un objeto con los datos específicos, incluyendo la fracción arancelaria y la descripción.
   * - Agrega la nueva entrada a la tabla dinámica y actualiza el estado dinámico del trámite.
   * - Reinicia el formulario para permitir la entrada de nuevos datos.
   *
   * @example
   * this.agregar();
   * // Agrega una nueva entrada específica a la tabla dinámica y actualiza el estado del trámite.
   */
  public agregar(): void {
   
    if (this.usoEspicificoForm.valid) {
     
      const FRACCIONID = (this.usoEspicificoForm.get('fraccionArancelariaProsec')?.value);
     // const FRACCIONDESCRIPCION = this.obtenerFraccionArancelariaProsec();
      const DESCRIPCION = this.usoEspicificoForm.get('descripcion')?.value?.trim();

      const EXISTS = this.datosSocios.some(item =>
        item.clave === FRACCIONID
      );

      if (!EXISTS &&FRACCIONID && DESCRIPCION) {
        const ESPECIFICO: FraccionesProsecRequest = {
          clave: FRACCIONID,
          fraccion: DESCRIPCION,
        };
        this.datosSocios = [...this.datosSocios, ESPECIFICO];
        this.tramite130102Store.setDynamicFieldValue('lista_fracciones_prosec', this.datosSocios);
         this.usoEspicificoForm.reset();
        this.initializeFormDefaults();
     
      } 
    } else {
      
      this.markFormGroupTouched();
    }
  }

  /**
 * @method obtenerFraccionArancelariaProsec
 * @description
 * Obtiene la descripción de la fracción arancelaria seleccionada en el formulario dinámico.
 * @returns {string} Descripción de la fracción arancelaria seleccionada o una cadena vacía si no existe.
 */
  public obtenerFraccionArancelariaProsec(): string {
    const DESCRIPCION = this.catalogos.find((ele: Catalogo) => ele.id === Number(this.usoEspicificoForm.get('fraccionArancelariaProsec')?.value))?.descripcion;
    return DESCRIPCION ?? '';
  }
  /**
 * Actualiza las filas seleccionadas en la tabla.
 * @param filas - Arreglo de objetos seleccionados de tipo `FraccionArancelariaProsec`.
 */
  alCambiarSeleccion(filas: FraccionesProsecRequest[]):void {
  this.filasSeleccionadas = filas;
  }
  /**
 * Muestra una notificación de confirmación para eliminar las filas seleccionadas.
 */
eliminarSeleccionadas(): void {
  if (!this.filasSeleccionadas?.length){
  return;
  } 

  this.alertaNotificacion = {
    tipoNotificacion: 'alert',
    categoria: 'danger',
    modo: 'action',
    titulo: 'Confirmación',
    mensaje: '¿Desea eliminar los registros seleccionados?',
    cerrar: false,
    txtBtnAceptar: 'Aceptar',
    txtBtnCancelar: 'Cancelar',
  };
}
/**
 * Ejecuta la acción de eliminación si el usuario confirma la notificación.
 * @param aceptado - Indica si el usuario aceptó la acción.
 */
onConfirmacionModal(aceptado: boolean): void {
  if (aceptado) {
    this.datosSocios = this.datosSocios.filter(
      fila => !this.filasSeleccionadas.includes(fila)
    );
    this.filasSeleccionadas = [];
  }
}
  /**
   * compo doc
   * @method ngOnDestroy
   * @description
   * Este método es parte del ciclo de vida del componente y se ejecuta automáticamente
   * cuando el componente está a punto de ser destruido. Se utiliza para limpiar las suscripciones
   * activas y evitar fugas de memoria en la aplicación.
   *
   * Funcionalidad:
   * - Notifica a través del `Subject` `destroyNotifier$` que el componente será destruido.
   * - Completa el `Subject` para liberar los recursos asociados.
   *
   * @example
   * ngOnDestroy(): void {
   *   this.destroyNotifier$.next();
   *   this.destroyNotifier$.complete();
   * }
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
 * @method initializeFormDefaults
 * @description Reinitializa los valores por defecto del formulario después del reset.
 */
private initializeFormDefaults(): void {
  this.usoEspicificoForm.patchValue({
    fraccionArancelariaProsec: '',
    descripcion: ''
  });
}

/**
 * @method markFormGroupTouched
 * @description Marca todos los campos del formulario como tocados para mostrar errores de validación.
 */
private markFormGroupTouched(): void {
  Object.keys(this.usoEspicificoForm.controls).forEach(key => {
    const CONTROL = this.usoEspicificoForm.get(key);
    CONTROL?.markAsTouched();
    CONTROL?.updateValueAndValidity();
  });
}
}