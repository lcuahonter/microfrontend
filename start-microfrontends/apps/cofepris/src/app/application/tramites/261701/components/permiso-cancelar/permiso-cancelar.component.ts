import { CancelacionPeticion261701State, Tramite261701Store } from '../../estados/store/tramite261701.store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery, ModeloDeFormaDinamica } from '@ng-mf/data-access-user';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormasDinamicasComponent } from '@libs/shared/data-access-user/src/tramites/components/formas-dinamicas/formas-dinamicas/formas-dinamicas.component';
import { PERMISO_A_CANCELAR } from '../../constantes/cancelacion-peticion.enum';
import { Tramite261701Query } from '../../estados/query/tramite261701.query';

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
  selector: 'permiso-cancelar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormasDinamicasComponent
  ],
  templateUrl: './permiso-cancelar.component.html',
  styleUrl: './permiso-cancelar.component.scss',
})
export class PermisoCancelarComponent implements OnInit, OnDestroy {

  /**
   * compo doc
   * @type {FormGroup}
   * @memberof PermisoCancelarComponent
   * @description
   * Este es un formulario reactivo de Angular representado por un FormGroup.
   * Se utiliza para manejar y validar los datos del formulario en el componente.
   */
  public forma: FormGroup = new FormGroup({
    ninoFormGroup: new FormGroup({})
  });

  /**
 * Subject para destruir las suscripciones.
 */
  private destruirNotificador$: Subject<void> = new Subject();

  /**
  * Estado de la solicitud de la sección 301.
  * @type {CancelacionPeticion261701State}
  * @memberof PermisoCancelarComponent
  */
  public cancelacionState!: CancelacionPeticion261701State;

  /**
  * Indica si el formulario está en modo solo lectura.
  * Cuando es `true`, los campos del formulario no se pueden editar.
  */
  esFormularioSoloLectura: boolean = false;

  /**
 * compo doc
 * @constructor
 * Inicializa una nueva instancia del componente `PermisoCancelarComponent`.
 * 
 * @param tramite261701Store Servicio encargado de gestionar el estado dinámico asociado al trámite 261701.
 * @param tramite261701Query Consulta que facilita la obtención de datos específicos del estado del trámite 261701.
 */
  constructor(
    private tramite261701Store: Tramite261701Store,
    private tramite261701Query: Tramite261701Query,
    private consultaioQuery: ConsultaioQuery,
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
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
        })
      )
      .subscribe()
  }

  /**
   * compo doc
   * Constantes importadas desde el archivo de enumeración que contienen textos clave y mensajes de advertencia
   * utilizados en el contexto de los trámites relacionados con permisos a Cancelar.
   * @memberof PermisoCancelarComponent
   */
  public permisoCancelarFormData: ModeloDeFormaDinamica[] = [];

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
   * - Se suscribe al observable `selectRetiros$` para obtener el estado de los retiros y lo asigna a la propiedad `cancelacionState`.
   * - Escucha los cambios en los valores del formulario reactivo `forma` y actualiza el store dinámico con los valores cambiados.
   * @memberof PermisoCancelarComponent
   * @returns {void}
   */
  ngOnInit(): void {
    this.tramite261701Query.select$
      .pipe(
        takeUntil(this.destruirNotificador$),
        map((seccionState) => {
          this.cancelacionState = seccionState;
        })
      )
      .subscribe();

    this.actualizarPermisoCancelarFormData();
    this.obtainorFolioDatos();
  }

  /**
   * Actualiza permisoCancelarFormData basado en el valor actual de esFormularioSoloLectura
   * y establece los valores predeterminados desde cancelacionState
   */
  private actualizarPermisoCancelarFormData(): void {
    // Mantener la lógica ternaria original para determinar qué conjunto de datos usar
    this.permisoCancelarFormData = this.esFormularioSoloLectura ? PERMISO_A_CANCELAR.map(campo => {
      if (this.cancelacionState[campo.campo] !== undefined) {
        return {
          ...campo,
          desactivado: true,
        };
      }
      // Si no existe, mantener el campo original
      return campo;
    }) : PERMISO_A_CANCELAR;
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
  
  establecerCambioDeValor(event: { campo: string; valor: string | number }): void {
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
    this.tramite261701Store.establecerDatos(campo, value);
  }

  /**
   * Valida el formulario marcando todos los controles como tocados.
   * 
   * Este método se utiliza para activar la validación de todos los campos del formulario,
   * mostrando los mensajes de error correspondientes en caso de que existan campos inválidos.
   */
  validarFormulario(): void {
    this.forma.markAllAsTouched();
  }

  /**
   * Obtiene los valores de 'folioTramite' y 'tipoSolicitud' desde el localStorage,
   * los asigna al formulario 'ninoFormGroup' y actualiza el store con los valores obtenidos.
   * Si no existen los valores en el localStorage, se asigna 'N/A' por defecto.
   *
   * @remarks
   * Este método es útil para inicializar el formulario con datos previamente almacenados
   * y asegurar que el store refleje los valores actuales del formulario.
   */
  obtainorFolioDatos(): void {
    
    const FOLIO_TRAMITE = this.cancelacionState['tramiteAsociados']?
    this.cancelacionState['tramiteAsociados'][0]?.folioTramite : '';
    const TIPO_SOLICITUD = this.cancelacionState['tramiteAsociados']?
    this.cancelacionState['tramiteAsociados'][0]?.tipoTramite : '';
    
    const VALORES_ACTUALIZADOS = {
      folioTramite: FOLIO_TRAMITE,
      tipoTramite: TIPO_SOLICITUD,
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
