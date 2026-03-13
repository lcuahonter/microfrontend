import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RetirosCofepris261702State, Tramite261702Store } from '../../../../estados/tramites/tramite261702.store';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioState } from '@ng-mf/data-access-user';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { PERMISO_A_DESISTIR } from '../../constantes/retiros-cofepris.enum';
import { Tramite261702Query } from '../../../../estados/queries/tramite261702.query';

/**
 * @Component Decorador
 * 
 * Este decorador se utiliza para definir los metadatos del componente Angular.
 * Especifica el selector, la plantilla, los estilos y otras configuraciones para el componente.
 * 
 * Propiedades:
 * - `selector`: La etiqueta HTML personalizada utilizada para incluir este componente en las plantillas.
 * - `standalone`: Indica que este componente es un componente independiente y no pertenece a ningún NgModule.
 * - `imports`: Especifica los módulos y componentes de los que depende este componente.
 * - `templateUrl`: La ruta al archivo de plantilla HTML para este componente.
 * - `styleUrl`: La ruta al archivo SCSS que contiene los estilos para este componente.
 */
@Component({
  selector: 'permiso-desistir',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './permisoDesistir.component.html',
  styleUrl: './permisoDesistir.component.scss',
})
export class PermisoDesistirComponent implements OnInit, OnDestroy {

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof PermisoDesistirComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({})
  });


  /**
      * @property consultaState
      * @description
      * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
      */
      @Input() consultaState!: ConsultaioState;

   /**
  * Subject para destruir las suscripciones.
  */
   private destruirNotificador$: Subject<void> = new Subject();
 
   /**
   * Estado de la solicitud de la sección 301.
   * @type {RetirosCofepris261702State}
   * @memberof PermisoDesistirComponent
   */
   public retirosState!: RetirosCofepris261702State;

    /**
   * compo doc
   * @constructor
   * Inicializa una nueva instancia del componente `PermisoDesistirComponent`.
   * 
   * @param tramite261702Store Servicio encargado de gestionar el estado dinámico asociado al trámite 261702.
   * @param tramite261702Query Consulta que facilita la obtención de datos específicos del estado del trámite 261702.
   */
  constructor(
    private tramite261702Store: Tramite261702Store,
    private tramite261702Query: Tramite261702Query
  // eslint-disable-next-line no-empty-function
  ) {}
    
  /**
   * compo doc
   * Constantes importadas desde el archivo de enumeración que contienen textos clave y mensajes de advertencia
   * utilizados en el contexto de los trámites relacionados con permisos a desistir.
   * @memberof PermisoDesistirComponent
   */
  public permisoDesistirFormData = PERMISO_A_DESISTIR;

  /**
  * compo doc
  * @getter ninoFormGroup
  * @description
  * Este getter devuelve el grupo de formularios anidado llamado `ninoFormGroup` 
  * dentro del formulario reactivo principal `forma`. 
  * Se utiliza para acceder y manipular los controles y valores específicos de este grupo de formularios.
  * 
  * @returns {FormGroup} El grupo de formularios `ninoFormGroup` como un objeto de tipo `FormGroup`.
  * 
  * @example
  * const grupo = this.ninoFormGroup;
  * grupo.get('campo').setValue('nuevo valor');
  */
get ninoFormGroup(): FormGroup {
  return this.forma.get('ninoFormGroup') as FormGroup;
}

  /**
   * @method ngOnInit
   * @description
   * El gancho `ngOnInit` se llama al inicializar el componente. Este método realiza las siguientes acciones:
   * - Se suscribe al observable `selectRetiros$` para obtener el estado de los retiros y lo asigna a la propiedad `retirosState`.
   * - Escucha los cambios en los valores del formulario reactivo `forma` y actualiza el store dinámico con los valores cambiados.
   * @memberof PermisoDesistirComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite261702Query.selectRetiros$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.retirosState = seccionState;
        })
      )
      .subscribe();
      this.obtainorFolioDatos();
  }

  /**
  * compo doc
  * @method establecerCambioDeValor
  * @description
  * Este método se utiliza para manejar los cambios en los valores de un formulario dinámico.
  * Recibe un evento que contiene el nombre del campo y su nuevo valor, y actualiza el estado
  * dinámico del formulario en el store correspondiente.
  * 
  * @param event - Un objeto que contiene el campo que ha cambiado y su nuevo valor.
  * El objeto tiene la estructura: `{ campo: string; valor: any }`.
  * 
  * @example
  * establecerCambioDeValor({ campo: 'nombre', valor: 'Juan' });
  * // Actualiza el campo 'nombre' con el valor 'Juan' en el store dinámico.
  */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  establecerCambioDeValor(event: { campo: string; valor: any }): void {
    if (event) {
      this.cambioEnValoresStore(event.campo, event.valor);
    }
  }

  /**
  * compo doc
  * @method cambioEnValoresStore
  * @description 
  * Este método se utiliza para emitir un evento cuando hay un cambio en los valores del formulario.
  * Recibe como parámetros el formulario preactivo (FormGroup) y el campo que ha cambiado.
  * Luego, emite un objeto con esta información utilizando el EventEmitter `emitirValorCambiado`.
  * @param form - El formulario reactivo que contiene los datos.
  * @param campo - El nombre del campo que ha cambiado.
  */
  public cambioEnValoresStore(campo: string, value: unknown): void {
    this.tramite261702Store.setDynamicFieldValue(campo, value);
  }

 obtainorFolioDatos(): void {
    const FOLIO_TRAMITE = localStorage.getItem('folioTramite') || '';
    const TIPO_SOLICITUD = localStorage.getItem('tipoSolicitud') || '';
    const VALORES_ACTUALIZADOS = {
      folio: FOLIO_TRAMITE || 'N/A',
      tipoDeSolicitud: TIPO_SOLICITUD || 'N/A',
    };
    this.ninoFormGroup.patchValue(VALORES_ACTUALIZADOS);
    Object.entries(VALORES_ACTUALIZADOS).forEach(([campo, valor]) => {
      this.cambioEnValoresStore(campo, valor);
    });
  }

  /**
  * Se ejecuta al destruir el componente.
  * Emite un valor y completa el subject `destruirNotificador$` para cancelar las suscripciones.
  */
  ngOnDestroy(): void {
    this.destruirNotificador$.next();
    this.destruirNotificador$.complete();
  }
  
}
