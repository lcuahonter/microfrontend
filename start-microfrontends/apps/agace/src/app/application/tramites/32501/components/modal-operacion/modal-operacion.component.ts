import { AvisoCatalogo } from '../../models/aviso-catalogo.model';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CatalogosSelect } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MercanciasDesmontadasOSinMontarService } from '../../services/mercancias-desmontadas-o-sin-montar.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Solicitud32501Query } from '../../estados/solicitud32501.query';
import { Solicitud32501State } from '../../estados/solicitud32501.store';
import { Solicitud32501Store } from '../../estados/solicitud32501.store';
import { Subject } from 'rxjs';
import { TituloComponent } from '@libs/shared/data-access-user/src';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';

/**
 * Componente que representa un modal para la operación de importación.
 * Permite gestionar los datos relacionados con la solicitud 32501, incluyendo
 * la selección de aduana, patente, RFC y pedimento. Implementa la inicialización
 * de formularios reactivos y la suscripción a cambios en el estado de la solicitud.
 * También maneja la limpieza de suscripciones al destruirse el componente.
 */
@Component({
  selector: 'app-modal-operacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
  ],
  providers: [MercanciasDesmontadasOSinMontarService],
  templateUrl: './modal-operacion.component.html',
  styleUrl: './modal-operacion.component.scss',
})
/**
 * Componente que representa un modal para la operación de importación.
 * Permite gestionar los datos relacionados con la solicitud 32501, incluyendo
 * la selección de aduana, patente, RFC y pedimento. Implementa la inicialización
 * de formularios reactivos y la suscripción a cambios en el estado de la solicitud.
 * También maneja la limpieza de suscripciones al destruirse el componente.
 */
export class ModalOperacionComponent implements OnInit, OnDestroy {
  /**
   * Formulario para los datos de la operación de importación.
   */
  frmDatosOperacionImp!: FormGroup;

  /**
   * Opción seleccionada de aduana.
   */
  opcionAduana: CatalogosSelect = {} as CatalogosSelect;

  /**
   * Observable para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private destroyed$ = new Subject<void>();

  /**
   * Estado actual de la solicitud 32501.
   */
  solicitud32501State: Solicitud32501State = {} as Solicitud32501State;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para la creación de formularios reactivos.
   * @param MercanciasDesmontadasOSinMontarService Servicio para obtener datos del catálogo de avisos.
   * @param solicitud32501Query Consulta de datos relacionados con la solicitud 32501.
   * @param solicitud32501Store Almacén de datos para la solicitud 32501.
   */
  constructor(
    private fb: FormBuilder,
    public mercanciasDesmontadasOSinMontarService: MercanciasDesmontadasOSinMontarService,
    public solicitud32501Query: Solicitud32501Query,
    public solicitud32501Store: Solicitud32501Store
  ) {
    
  }

  /**
   * Inicializa el formulario y suscriptores.
   */
  ngOnInit(): void {
    this.frmDatosOperacionImp = this.fb.group({
      patente: [this.solicitud32501State.patente, [Validators.required]],
      rfc: [this.solicitud32501State.rfc, [Validators.required]],
      pedimento: [this.solicitud32501State.pedimento, [Validators.required]],
      aduana: [this.solicitud32501State.aduana, [Validators.required]],
    });

    this.solicitud32501Query.seleccionarSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((respuesta: Solicitud32501State) => {
          this.solicitud32501State = respuesta;
          this.frmDatosOperacionImp.patchValue({
            patente: this.solicitud32501State.patente,
            rfc: this.solicitud32501State.rfc,
            pedimento: this.solicitud32501State.pedimento,
            aduana: this.solicitud32501State.aduana,
          });
        })
      )
      .subscribe();
  }


/**
   * Establece los valores del formulario en el estado de la solicitud.
   * @param formulario Formulario reactivo que contiene los datos de la operación.
   * @param campo Campo específico del formulario que se va a establecer en el estado.
   */
  establecerValoresEnEstado(formulario: FormGroup, campo: string): void {
    const VALOR = formulario.get(campo)?.value;
    this.solicitud32501Store.establecerDatos({ [campo]: VALOR });
  }

  /**
   * Verifica si un campo del formulario no es válido.
   * @param id Identificador del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario undefined.
   */
  noEsValido(id: string): boolean | undefined {
    const CONTROL = this.frmDatosOperacionImp.get(id);
    return CONTROL?.invalid && CONTROL?.touched;
  }

  /**
   * Verifica si un campo del formulario es válido.
   * @param field Nombre del campo en el formulario.
   * @returns true si el campo es inválido y ha sido tocado, de lo contrario false.
   */
  esValido(field: string): boolean {
    const CONTROL = this.frmDatosOperacionImp.get(field);
    return CONTROL ? CONTROL.invalid && CONTROL.touched : false;
  }

  /**
   * Método de limpieza al destruir el componente.
   * Cancela suscripciones para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
