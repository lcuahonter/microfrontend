import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState, SolicitanteComponent,TIPO_PERSONA } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import { InformationGeneralSolicitanteComponent } from '../../components/information-general-solicitante/information-general-solicitante.component';
import { InformationGeneralSolicitanteService } from '../../services/information-general-solicitante.service';

@Component({
  selector: 'app-paso-uno',
  templateUrl: './paso-uno.component.html',
  styleUrl: './paso-uno.component.scss',
})
export class PasoUnoComponent implements AfterViewInit, OnDestroy {

  /**
   * @property solicitante - Referencia al componente `SolicitanteComponent` que se utiliza para manejar
   *                          la lógica y los datos relacionados con el solicitante en este paso del trámite.
   * @command Este decorador `@ViewChild` permite acceder al componente hijo para interactuar con sus métodos y propiedades.
   */
  @ViewChild(SolicitanteComponent) solicitante!: SolicitanteComponent;

/**
 * Referencia al componente hijo `InformationGeneralSolicitanteComponent` que permite acceder a sus métodos y propiedades desde el componente padre.
 */
 @ViewChild('informationGeneralRef')
informationGeneralSolicitanteComponent!: InformationGeneralSolicitanteComponent;
  
  /**
   * @property indice - Representa el  índice actual utilizado en el componente.
   * @type {number}
   * @default 1
   * @remarks Este valor se utiliza para rastrear el estado o posición en el flujo del componente.
   * @command Este índice puede ser modificado dinámicamente según las necesidades del flujo.
   */
  indice: number = 1;
  /**
  * Esta variable se utiliza para almacenar el índice del subtítulo.
  */
  public consultaState!: ConsultaioState;
  /** Subject para notificar la destrucción del componente. */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Datos de respuesta del servidor utilizados para actualizar el formulario. */
  public esDatosRespuesta: boolean = false;

  /**
   * Constructor de la clase PasoUnoComponent.
   * 
   * Inicializa las dependencias necesarias para el componente, suscribe al estado de consulta
   * y determina si se deben guardar los datos del formulario o mostrar los datos de respuesta.
   * 
   * @param cdr Referencia para la detección de cambios en Angular.
   * @param consultaQuery Servicio para consultar el estado de la solicitud.
   * @param informationGeneralService Servicio para obtener información general del solicitante.
   */
  constructor(private cdr: ChangeDetectorRef, public consultaQuery: ConsultaioQuery,public informationGeneralService:InformationGeneralSolicitanteService) {
    this.consultaQuery.selectConsultaioState$.pipe(takeUntil(this.destroyNotifier$), map((seccionState) => {
      this.consultaState = seccionState;
    })).subscribe();
    if (this.consultaState && this.consultaState.procedureId === '32515' &&
      this.consultaState.update) {
      this.guardarDatosFormulario();
    } else {
      this.esDatosRespuesta = true;
    }
  }
  /**
* Carga datos desde un archivo JSON y actualiza el store con la información obtenida.
* Luego reinicializa el formulario con los valores actualizados desde el store.
*/
  guardarDatosFormulario(): void {
    this.informationGeneralService
      .getRegistroTomaMuestrasMercanciasData().pipe(
        takeUntil(this.destroyNotifier$)
      )
      .subscribe((resp) => {
        if (resp) {
          this.esDatosRespuesta = true;
          this.informationGeneralService.actualizarEstadoFormulario(resp);
        }
      });
  }

  /**
   * @method ngAfterViewInit
   * @description Este método se ejecuta después de que la vista del componente ha sido inicializada.
   * Se utiliza para realizar operaciones que dependen de que la vista esté completamente cargada.
   * 
   * @command Este método llama a `obtenerTipoPersona` con el tipo de persona `MORAL_NACIONAL` 
   * y luego fuerza la detección de cambios en el componente.
   */
  ngAfterViewInit(): void {
    this.solicitante?.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    this.cdr.detectChanges();
  }

  /**
   * Este método permite que el usuario seleccione una pestaña cambiando el valor de `indice`.
   * 
   * @param indice El índice de la pestaña seleccionada.
   * 
   * @example
   * Cambiar la pestaña seleccionada:
   * this.seleccionaTab(2); // Selecciona la segunda pestaña.
   */
  seleccionaTab(indice: number): void {
    // Establece el índice de la pestaña seleccionada
    this.indice = indice;
  }
 /**
   * @method ngOnDestroy
   * @description Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Utiliza el Subject `destroyNotifier$` para notificar la destrucción y completar las suscripciones.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }


/**
 * Valida los formularios del paso actual y marca los campos inválidos como tocados para mostrar errores de validación.
 */
public validarFormularios(): boolean {
  let isValid = true;

  // Validar formulario de solicitante (pestaña 1)
  if (this.indice === 1 && this.solicitante?.form) {
    if (this.solicitante.form.invalid) {
      this.solicitante.form.markAllAsTouched();
      isValid = false;
    }
  }

  // Validar formularios de información general (pestaña 2)
  if (this.indice === 2 && this.informationGeneralSolicitanteComponent && this.esDatosRespuesta) {
    const FORMS_VALID = this.informationGeneralSolicitanteComponent.validateAllForms();
    if (!FORMS_VALID) {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Obtiene el estado de validación de todos los formularios en ambas pestañas del paso uno.
 */
public obtenerValidacionTotalFormularios(): { tab1Valid: boolean, tab2Valid: boolean } {
  // Validación de pestaña 1 (Solicitante)
  const TAB1_VALID = this.solicitante?.form?.valid || false;
  
  // Validación de pestaña 2 (Componentes de información general)
  let tab2Valid = false;
  if (this.informationGeneralSolicitanteComponent && this.esDatosRespuesta) {
    tab2Valid = this.informationGeneralSolicitanteComponent.areAllFormsValid();
  }

  return { tab1Valid: TAB1_VALID, tab2Valid };
}
}
