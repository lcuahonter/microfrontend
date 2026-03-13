
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from "@ng-mf/data-access-user";
import { DatosProcedureQuery } from '../../estados/tramites261103.query';
import { DatosProcedureState } from '../../estados/tramites261103.store';
import { DatosProcedureStore } from '../../estados/tramites261103.store';
import { Domicilio } from '../../modelos/domicilio-establecimientos.model';
import { ModificacionPermisoImportacionMedicamentosService } from '../../services/modificacion-permiso-importacion-medicamentos.service';
import { TituloComponent } from '@libs/shared/data-access-user/src';

@Component({
  selector: 'app-representante-legal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TituloComponent],
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss',
})
export class RepresentanteLegalComponent implements OnInit, OnDestroy {
  /**
 * Formulario reactivo para datos preoperativos.
 */
  domicilioEstablecimiento!: FormGroup;
  /**
* Formulario reactivo para datos preoperativos.
*/
  AvisodeFuncionamiento!: FormGroup;

  /** Array para almacenar la respuesta de permisos cancelar */
  Domicilios: Domicilio[] = [];

  /** Subject para notificar la destrucción del componente */
  private destroy$ = new Subject<void>();
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
   * Constructor para SolicitanteComponent.
   * 
   * @param fb - Una instancia de FormBuilder utilizada para crear y gestionar formularios.
   */
  constructor(private fb: FormBuilder,
    private store: DatosProcedureStore,
    private query: DatosProcedureQuery,
    private consultaioQuery: ConsultaioQuery,
  ) {
    this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.esFormularioSoloLectura = seccionState.readonly;
        this.aplicarEstadoFormulario();
      })
    )
    .subscribe();
  }

  /**
   * Gancho de ciclo de vida que se llama después de que se inicializan las propiedades enlazadas a datos de una directiva.
   * Inicializa el componente configurando los valores del formulario.
   * 
   */
  ngOnInit(): void {
    this.obtenerDatosFormulario();
    this.establecerdomicilioEstablecimiento();

  }

  /**
 * Inicializa el domicilioEstablecimiento con un conjunto de controles de formulario.
 * Cada control se inicializa con un valor de cadena vacío y está deshabilitado.
 * Los controles del formulario incluyen:
 */
  public establecerdomicilioEstablecimiento(): void {
    this.query.selectProrroga$
    .pipe(
      takeUntil(this.destroyNotifier$),
      map((seccionState) => {
        this.seccionState = seccionState;
      })
    )
    .subscribe()
    this.domicilioEstablecimiento = this.fb.group({
      representanteLegalRFC: [{ value: this.seccionState?.representanteLegalRFC,disabled:false},[Validators.required]],
      buscar: [{ value: this.seccionState?.buscar,disabled:false },[Validators.required]],
      representanteLegalNombre: [{ value: this.seccionState?.representanteLegalNombre,disabled:false },[Validators.required]],
      representanteLegalApPaterno: [{ value: this.seccionState?.representanteLegalApPaterno ,disabled:false},[Validators.required]],
      representanteLegalApMaterno: [{ value: this.seccionState?.representanteLegalApMaterno,disabled:false },[Validators.required]],
    });

    this.aplicarEstadoFormulario();
  }


  
  /**
   * Aplica el estado de solo lectura al formulario.
   * 
   * Este método habilita o deshabilita todos los controles del formulario
   * basándose en el valor de la propiedad `esFormularioSoloLectura` y el valor de `ideGenerica1`.
   * 
   * Lógica de habilitación:
   * - Si el formulario está en modo solo lectura, todos los campos se deshabilitan.
   * - Si no está en modo solo lectura, los campos solo se habilitan si `ideGenerica1` es 'Modificacion'.
   * - En cualquier otro caso, los campos se deshabilitan.
   * 
   * Este método es público para permitir que componentes padre puedan aplicar cambios de estado del formulario.
   * 
   * @returns {void}
   */
  public aplicarEstadoFormulario(): void {
    if (!this.domicilioEstablecimiento) {
      return;
    }

    // Obtener el valor de ideGenerica1 del estado
    const IDE_GENERICA_1 = this.seccionState?.ideGenerica1;
    
    // Determinar si los campos deben estar habilitados
    const DEBE_ESTAR_HABILITADO = !this.esFormularioSoloLectura && (IDE_GENERICA_1 === 'Modificacion');

    if (DEBE_ESTAR_HABILITADO) {
      this.domicilioEstablecimiento.enable();
    } else {
      this.domicilioEstablecimiento.disable();
    }
  }

   /**
     * Pasa el valor de un campo del formulario a la tienda para la gestión del estado.
     * @param form - El formulario reactivo.
     * @param campo - El representanteLegalNombre del campo en el formulario.
     */
   setValoresStore(form: FormGroup, campo: string) :void{
    const VALOR = form.get(campo)?.value;
    this.store.establecerDatos({ [campo]: VALOR });
  }

    /**
* Gancho de ciclo de vida OnDestroy
*/
ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
  /**
   * Validar campo del formulario
   * @param field representanteLegalNombre del campo
   * @returns Booleano que indica si el campo es válido
   */
  isValid(field: string): boolean {
    return Boolean(ModificacionPermisoImportacionMedicamentosService.isValid(this.domicilioEstablecimiento, field));
  }
    /**
* Gancho de ciclo de vida obtenerDatosFormulario
*/
obtenerDatosFormulario():void{
  this.query.selectProrroga$?.pipe(takeUntil(this.destroy$))
  .subscribe((data:DatosProcedureState) => {
    this.seccionState = data;
  });
}

/**
 * Inicializa el estado del formulario.
 * 
 * Este método realiza las siguientes acciones:
 * 1. Obtiene los datos del formulario desde el estado mediante el método `obtenerDatosFormulario`.
 * 2. Configura el formulario reactivo para el domicilio del representante legal utilizando el método `establecerdomicilioEstablecimiento`.
 * 
 * Es útil para establecer los valores iniciales del formulario y sincronizarlos con el estado global de la aplicación.
 * 
 * @returns {void}
 */
inicializarEstadoFormulario(): void {
  this.obtenerDatosFormulario();
  this.establecerdomicilioEstablecimiento();        
    }
}

