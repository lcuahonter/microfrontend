import {
  AbstractControl,
  ControlContainer,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Catalogo,
  CatalogosSelect,
  REG_X,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import {
  Solicitud220501State,
  Solicitud220501Store,
} from '../../../220501/estados/tramites220501.store';

import {
  Solicitud220502State,
  Solicitud220502Store,
} from '../../estados/tramites220502.store';
import { Solicitud220501Query } from '../../../220501/estados/tramites220501.query';

import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Solicitud220502Query } from '../../estados/tramites220502.query';
import { SolicitudPantallasService } from '../../services/solicitud-pantallas.service';
import { TIPO_CONTENEDOR } from '../../constantes/constantes';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


/**
 * Componente que representa al responsable de la inspección en un punto.
 * Este componente agrega y administra dinámicamente controles de formulario para los detalles de responsabilidad de inspección.
 */
@Component({
  selector: 'app-responsable-inspeccion-en-punto',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TituloComponent,
    CatalogoSelectComponent,
    TooltipModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: (): ControlContainer =>
        inject<ControlContainer>(ControlContainer, { skipSelf: true }),
    },
  ],
  templateUrl: './responsable-inspeccion-en-punto.component.html',
  styleUrls: ['./responsable-inspeccion-en-punto.component.scss'],
})
export class ResponsableInspeccionEnPuntoComponent
  implements OnInit, OnDestroy
{
  /**Entrada de propiedad para identificar la clave de control en el formulario principal */
  @Input() claveDeControl: string = '';
   /**
   * Indica el número de procedimiento.
   */
  @Input() procedimiento?: number;
  /** Inyecte el ControlContainer principal para administrar los controles de formulario*/
  contenedorPrincipal = inject(ControlContainer);
  /**
   * Getter para acceder al grupo de formulario principal.
   * Devuelve el grupo de formulario principal al que se agregan controles dinámicos.
   */
  get grupoFormularioPadre(): FormGroup {
    return this.contenedorPrincipal.control as FormGroup;
  }
  /** Almacena datos del catálogo para el tipo de contenedor. */
  tipoContenedor: CatalogosSelect = TIPO_CONTENEDOR;

  /**
   * Subject para desuscribirse de los observables.
   * @type {Subject<void>}
   */
  private destroyed$ = new Subject<void>();

  /**
   * Variable que almacena el estado actual de la solicitud.
   * Se inicializa como un objeto vacío de tipo `Solicitud220502State`.
   */
  solicitud220502State: Solicitud220502State = {} as Solicitud220502State;

  /**
   * Indica si el formulario está deshabilitado.
   */
  @Input() formularioDeshabilitado!: boolean;

  /**
   * Indica si el formulario es válido.
   */
  @Input() formValida: boolean = false;

  /**
   * @constructor
   * Inyecta los servicios y dependencias necesarias para el componente.
   *
   * @param solicitud220502Store - Store que gestiona el estado de la solicitud 220502.
   * @param solicitud220502Query - Query para consultar el estado de la solicitud 220502.
   * @param solicitudService - Servicio para obtener datos relacionados con la solicitud.
   */
  constructor(
    private solicitud220502Store: Solicitud220502Store,
    private solicitud220501Store: Solicitud220501Store,
    private solicitud220502Query: Solicitud220502Query,
    private solicitud220501Query: Solicitud220501Query,
    private solicitudService: SolicitudPantallasService /**Servicio para obtener datos de solicitud */
  ) {
    /** Inyectar el ControlContainer principal para administrar los controles de formulario */
  }

  private getStore(): Solicitud220501Store | Solicitud220502Store {
    // Obtener el store correcto basado en el procedimiento
    if (this.procedimiento === 220501) {
      return this.solicitud220501Store;
    } 
      return this.solicitud220502Store;
    
  }

  private getQuery(): {
    selectSolicitud$: Observable<Solicitud220501State | Solicitud220502State>;
  } {
    return this.procedimiento === 220501
      ? this.solicitud220501Query
      : this.solicitud220502Query;
  }
  /**
   * Ciclo de vida que inicializa el componente.
   * Agrega un control de formulario dinámico y carga datos iniciales.
   */
  ngOnInit(): void {
    if (this.claveDeControl) {
      // Agregue un nuevo FormGroup dinámico al formulario principal
      this.grupoFormularioPadre.addControl(
        this.claveDeControl,
        new FormGroup({
          nombre: new FormControl(this.solicitud220502State.nombre, [
            Validators.maxLength(150),
          ]),
          primerapellido: new FormControl(
            this.solicitud220502State.primerapellido,
            [Validators.maxLength(80)]
          ),
          segundoapellido: new FormControl(
            this.solicitud220502State.segundoapellido,
            [Validators.maxLength(80)]
          ),
          mercancia: new FormControl(this.solicitud220502State.mercancia, [
            Validators.required,
            Validators.maxLength(3),
            Validators.pattern(REG_X.SOLO_NUMEROS),
          ]),
          tipocontenedor: new FormControl(
            this.solicitud220502State.tipocontenedor,
            []
          ),
        })
      );
    }

    this.getQuery().selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((res) => {
          this.solicitud220502State = res;
          const FORM_GROUP = this.grupoFormularioPadre.get(
            this.claveDeControl
          ) as FormGroup;

          if (FORM_GROUP) {
            FORM_GROUP.patchValue({
              nombre: this.solicitud220502State.nombre,
              primerapellido: this.solicitud220502State.primerapellido,
              segundoapellido: this.solicitud220502State.segundoapellido,
              mercancia: this.solicitud220502State.mercancia,
              tipocontenedor: this.solicitud220502State.tipocontenedor,
            });
          }
        })
      )
      .subscribe();
    this.cargarDatosIniciales(); // Cargar datos del catálogo inicial

    if (this.formularioDeshabilitado) {
      this.grupoFormularioPadre?.disable();
    } else {
      this.grupoFormularioPadre?.enable();
    }
  }
  /**
   * Maneja la selección de un artículo del catálogo.
   * Actualiza el formulario con la descripción del catálogo seleccionado.
   * @param e - El artículo del catálogo seleccionado
   */
  tipoContenedorSeleccion(e: Catalogo): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre?.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre?.controls[this.claveDeControl].patchValue({
        tipocontenedor: e.descripcion,
      });
    }
  }
  /**
   * Carga datos del catálogo inicial para el tipo de contenedor.
   */
  cargarDatosIniciales(): void {
    this.solicitudService.getDataResponsableInspeccion(this.procedimiento ? this.procedimiento.toString(): '').pipe(takeUntil(this.destroyed$)).subscribe({
      next: (data: Catalogo[]) => {
           const CATALOGOTEMPLATE = (
      label: string,
      required: boolean,
      catalogos: Catalogo[]
    ): CatalogosSelect => ({
      labelNombre: label,
      required,
      primerOpcion: 'Selecciona un valor',
      catalogos,
    });

    this.tipoContenedor = CATALOGOTEMPLATE(
      'Tipo contenedor',
      false,
      data
    );
        
      },
    });
  }
  /**
   * Actualiza el nombre en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene el nuevo valor del nombre.
   */
  setNombre(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    (this.getStore() as Solicitud220502Store).setNombre(VALUE);
  }

  /**
   * Actualiza el primer apellido en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene el nuevo valor del primer apellido.
   */
  setPrimerapellido(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    (this.getStore() as Solicitud220502Store).setPrimerapellido(VALUE);
  }

  /**
   * Actualiza el segundo apellido en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene el nuevo valor del segundo apellido.
   */
  setSegundoapellido(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    (this.getStore() as Solicitud220502Store).setSegundoapellido(VALUE);
  }

  /**
   * Actualiza la mercancía en el estado de la solicitud.
   *
   * @param event - Evento del input que contiene la descripción de la mercancía.
   */
  setMercancia(event: Event): void {
    const VALUE = (event.target as HTMLInputElement).value;
    (this.getStore() as Solicitud220502Store).setMercancia(VALUE);
  }

  /**
   * Actualiza el tipo de contenedor en el estado de la solicitud.
   *
   * @param event - Objeto de tipo Catalogo que contiene el identificador del tipo de contenedor.
   */
  setTipoContenedor(event: Catalogo): void {
    (this.getStore() as Solicitud220502Store).setTipocontenedor(
      event.clave ?? ''
    );
  }
/**
 * Marca todos los controles del FormGroup como tocados y sucios.
 */
marcarControlesComoTocados(): void {
  const FORMGROUP = this.grupoFormularioPadre.get(this.claveDeControl) as FormGroup;

  if (!FORMGROUP) {
    return;
  }

  const CONTROLS = FORMGROUP.controls as { [key: string]: AbstractControl };

  Object.values(CONTROLS).forEach(control => {
    control.markAsTouched({ onlySelf: true });
    control.markAsDirty({ onlySelf: true });
    control.updateValueAndValidity();
  });
}
  /**
   * Gancho de ciclo de vida que limpia el componente.
   * Elimina el control de formulario del formulario principal.
   */
  ngOnDestroy(): void {
    if (
      this.claveDeControl &&
      this.grupoFormularioPadre?.contains(this.claveDeControl)
    ) {
      this.grupoFormularioPadre?.removeControl(this.claveDeControl);
    }
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
