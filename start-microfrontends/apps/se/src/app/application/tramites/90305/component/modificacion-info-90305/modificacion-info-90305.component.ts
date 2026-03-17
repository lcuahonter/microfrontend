/**
 * compo doc
 * @component ModificacionInfo90305Component
 * @description
 * Este componente muestra información sobre la modificación de Prosec.
 * Obtiene los datos desde `ProsecModificacionServiceTsService` y los presenta en un formulario.
 */
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';


import { Subject } from 'rxjs';

import { map, takeUntil } from 'rxjs/operators';
import { ProsecModificacionServiceTsService } from '../../services/prosec-modificacion.service';

import { Tramite90305State, Tramite90305Store } from '../../estados/tramite90305.store';
import { Tramite90305Query } from '../../estados/tramite90305.query';

/**
 * selector app-modificacion-info-90305
 * @standalone true
 */
@Component({
  selector: 'app-modificacion-info-90305',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modificacion-info-90305.component.html',
  styleUrl: './modificacion-info-90305.component.scss',
})
export class ModificacionInfo90305Component implements OnInit, OnDestroy {
  /** Bandera de solo lectura (puedes adaptarla si tienes lógica para esto) */
  public esFormularioSoloLectura: boolean = false;
  /**
 * Estado de la solicitud de la sección.
 */
  public solicitudState!: Tramite90305State;
  /** Formulario de modificación de información */
  modificationInfoForm!: FormGroup;
  /** Subject para manejar la destrucción del componente y evitar fugas de memoria */
  private destroyed$ = new Subject<void>();

  /**
   * constructor
   * @param {FormBuilder} fb - Constructor del formulario
   * @param {ProsecModificacionServiceTsService} modificaaionInfo - Servicio para obtener la información de modificación
   */
  constructor(
    private fb: FormBuilder,
    private modificaaionInfo: ProsecModificacionServiceTsService,
    private tramite90305Store: Tramite90305Store,
    private tramite90305Query: Tramite90305Query,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.crearFormCombinacion();
        })
      )
      .subscribe()
  }

/** Método del ciclo de vida de Angular - inicializa el formulario y carga la información */
  ngOnInit(): void {
    this.inicializarCombinacionFormulario();
  }

  /**
   * Inicializa el formulario de combinación requerido.
   * 
   * Si el formulario está en modo solo lectura (`esFormularioSoloLectura`), 
   * guarda los datos actuales del formulario llamando a `guardarDatosFormulario()`.
   * De lo contrario, inicializa el formulario llamando a `inicializarFormulario()`.
   */
  inicializarCombinacionFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario();
    } else {
      this.inicializarFormulario()
    }
  }

  /**
   * @comdoc
   * Guarda los datos del formulario de combinación requerida.
   * 
   * Inicializa el formulario y ajusta su estado de habilitación según si es de solo lectura.
   * - Si el formulario es de solo lectura, lo deshabilita.
   * - Si no es de solo lectura, lo habilita.
   * - Si no aplica ninguna de las condiciones anteriores, no realiza ninguna acción adicional.
   */
  guardarDatosFormulario(): void {
    this.inicializarFormulario();
    if (this.esFormularioSoloLectura) {
      this.modificationInfoForm.disable();
    } else {
      this.modificationInfoForm.enable();
    }
  }

  /**
   * Inicializa el formulario con los valores de la solicitud.
   */
  inicializarFormulario(): void {
    this.tramite90305Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.crearFormCombinacion();
    this.loadInfo();
  }

  /**
* @description createFormMerge se utiliza para crear el formulario denominado formCombinacion
* 
*/
  /**
 * Inicializa el formulario `formCombinacion` con los valores del estado `solicitudState`
 * y aplica validación de longitud máxima (200) a `puntoIngreso`.
 */
  public crearFormCombinacion(): void {
    this.modificationInfoForm = this.fb.group({
      registroFederalContribuyentes: [{ value: this.solicitudState?.registroFederalContribuyentes, disabled: true }],
      representacionFederal: [{ value: this.solicitudState?.representacionFederal, disabled: true }],
      tipoModificacion: [{ value: this.solicitudState?.tipoModificacion, disabled: true }],
      modificacionPrograma: [{ value: this.solicitudState?.modificacionPrograma, disabled: true }],
    });
  }

  /**
     * Carga la información de modificación desde el servicio y actualiza el formulario
     */
  loadInfo(): void {
    this.modificaaionInfo
      .getModoficacionInfo()
      .subscribe((data) => {
        this.modificationInfoForm.patchValue({
          registroFederalContribuyentes: data.registroFederalContribuyentes,
          representacionFederal: data.representacionFederal,
          tipoModificacion: data.tipoModificacion,
          modificacionPrograma: data.modificacionPrograma,
        });
      });
  }
  /**
   *
   */
  onControlChange(controlName: string): void {
    const UPDATED_VALUE = { [controlName]: this.modificationInfoForm.get(controlName)?.value };
    this.tramite90305Store.update(UPDATED_VALUE);
  }

  /** Método del ciclo de vida de Angular - se ejecuta al destruir el componente */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
