import { ChangeDetectorRef, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

import { Subject, map, takeUntil } from 'rxjs';

import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';

import { DatosDeLaSolicitudComponent } from '../../../../shared/components/2614/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { DatosDelEstablecimientoSeccionComponent } from '../../../../shared/components/datos-del-establecimiento-seccion/datos-del-establecimiento-seccion.component';
import { EstablecimientoComponent } from '../../../../shared/components/establecimiento/establecimiento.component';
import { PropietarioComponent } from '../../../../shared/components/propietario/propietario.component';

import { ID_PROCEDIMIENTO } from '../../constants/solicitud-importacion-ambulancia.enum';
import { Tramite2614Query } from '../../../../estados/queries/tramite2614.query';
import { Tramite2614Store } from '../../../../estados/tramites/tramite2614.store';

/**
 * @component DatosDeLaSolicitudContenedoraComponent
 * @description Componente contenedor para el trámite 261401, encargado
 * de gestionar la lógica y presentación de datos relacionados con la
 * solicitud. Integra `DatosDeLaSolicitudComponent` para mostrar/editar
 * información específica, y sincroniza el estado global mediante
 * `Tramite261401Store`.
 **/
@Component({
  selector: 'app-datos-de-la-solicitud-contenedora',
  standalone: true,
  imports: [CommonModule, DatosDeLaSolicitudComponent],
  providers: [Tramite2614Store, Tramite2614Query],
  templateUrl: './datos-de-la-solicitud-contenedora.component.html',
  styleUrls: ['./datos-de-la-solicitud-contenedora.component.scss'],
})
export class DatosDeLaSolicitudContenedoraComponent implements OnDestroy {
  
  /**
   * Referencia al componente de datos de la solicitud.
   * Permite acceder y validar el formulario principal de la solicitud.
   */
  @ViewChild(DatosDeLaSolicitudComponent)
  datosDeLaSolicitudComponent?: DatosDeLaSolicitudComponent;

  /**
   * Referencia al componente de propietario.
   * Permite acceder y validar los formularios relacionados con el propietario.
   */
  @ViewChild(PropietarioComponent)
  propietarioComponent?: PropietarioComponent;

  /**
   * Referencia al componente de establecimiento.
   * Permite acceder y validar los formularios relacionados con el establecimiento y mercancía.
   */
  @ViewChild(EstablecimientoComponent)
  establecimientoComponent?: EstablecimientoComponent;

  /**
   * Referencia al componente de la sección de datos del establecimiento.
   * Permite acceder y validar el formulario de datos del establecimiento.
   */
  @ViewChild(DatosDelEstablecimientoSeccionComponent)
  datosDelEstablecimientoSeccionComponent?: DatosDelEstablecimientoSeccionComponent;

  /**
   * Formulario reactivo principal del trámite.
   * Utilizado para validar los datos generales del trámite.
   */
  formDelTramite?: FormGroup;

  /**
   * Formulario reactivo para la sección de mercancía.
   * Permite validar los datos relacionados con la mercancía involucrada.
   */
  mercanciaForm?: FormGroup;

  /**
   * Arreglo de datos que representa las filas de la tabla principal.
   * Se utiliza para validar la selección y existencia de partidas.
   */
  tableBodyData?: unknown[];

  /**
   * Bandera que indica si las partidas de la tabla son inválidas.
   * Se actualiza según la validación de la tabla de partidas.
   */
  isInvalidaPartidas: boolean = false;

  /**
   * Formulario reactivo para la sección de país.
   * Permite validar los datos relacionados con el país seleccionado.
   */
  paisForm?: FormGroup;

  /**
   * Formulario reactivo para la sección de representación.
   * Permite validar los datos del representante legal.
   */
  frmRepresentacionForm?: FormGroup;

  /**
   * Identificador del procedimiento actual.
   * @type {number}
   */
  public readonly idProcedimiento: number = ID_PROCEDIMIENTO;

      /**
   * @property
   * @name permisoDefinitivoTitulo
   * @type {string[]}
   * @description Identificador único del procedimiento actual. Este valor se utiliza para asociar el componente con un trámite específico en el sistema.
   */
  permisoDefinitivoTitulo: number = ID_PROCEDIMIENTO;

  /**
   * @property
   * @name permisoSeccion
   * @type {string[]}
   * @description Identificador de la sección de permisos específica para este procedimiento.
   */
  permisoSeccion: number = ID_PROCEDIMIENTO;
  
  /**
   * @property destroyNotifier$
   * @description Subject utilizado para cancelar observables de manera ordenada
   * cuando el componente se destruye, evitando fugas de memoria.
   * @private
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property consultaState
   * @description
   * Estado actual de la consulta gestionado por el store `ConsultaioQuery`.
   */
  @Input() public consultaState!: ConsultaioState;

/**
   * @property {boolean} esFormularioSoloLectura
   * @description Bandera que determina si el formulario de pago de derechos debe
   * mostrarse en modo solo lectura. Cuando es `true`, todos los campos del formulario
   * se deshabilitan y no permiten edición. Este valor se actualiza automáticamente
   * basándose en el estado de consulta obtenido del `ConsultaioQuery`.
   * 
   * @type {boolean}
   * @default false
   * @access public
   * @readonly false
   * @example
   * ```typescript
   * // En el template
   * <app-pago-derechos [readonly]="esFormularioSoloLectura"></app-pago-derechos>
   * ```
   */
  public esFormularioSoloLectura: boolean = false;

  /**
   * Crea una instancia de DatosDeLaSolicitudContenedoraComponent.
   *
   * Inicializa la suscripción al estado de consulta mediante el store `ConsultaioQuery`.
   * Actualiza la bandera `esFormularioSoloLectura` y el estado `consultaState` cada vez que cambia el estado de consulta.
   *
   * @param consultaQuery Servicio para consultar el estado global de la consulta.
   * @param tramite261401Query Servicio para consultar el estado específico del trámite 261401.
   * @param tramite261401Store Store para gestionar el estado del trámite 261401.
   * @param cdr Servicio de Angular para detectar y aplicar cambios en el ciclo de vida del componente.
   *
   * La suscripción se cancela automáticamente al destruir el componente para evitar fugas de memoria.
   */
  constructor(
    private consultaQuery: ConsultaioQuery,
    private tramite2614Query: Tramite2614Query,
    private tramite2614Store: Tramite2614Store,
    private cdr: ChangeDetectorRef
  ) {
    this.consultaQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.esFormularioSoloLectura = seccionState.readonly;
          this.consultaState = seccionState;
          this.cdr.detectChanges();
        })
      )
      .subscribe();
  }

  /**
   * Valida todos los formularios asociados al trámite, incluyendo los formularios principales,
   * de propietario, establecimiento, datos del establecimiento, país y representante legal.
   * También valida la existencia de partidas en la tabla principal.
   * Marca todos los controles como "touched" si son inválidos para mostrar los errores en la UI.
   *
   * @returns {boolean} Retorna true si todos los formularios y la selección de partidas son válidos; false en caso contrario.
   */
  validarFormularioDatosDeLaSolicitud(): boolean {
    let isValid = true;

    // Ayudante para validar un formulario y actualizar isValid
    const VALIDAR_FORMULARIO = (form: FormGroup | undefined): void => {
      if (form && form.invalid) {
        form.markAllAsTouched();
        isValid = false;
      }
    };

    // Validar todos los formularios
    VALIDAR_FORMULARIO(this.datosDeLaSolicitudComponent?.formulario);
    VALIDAR_FORMULARIO(this.propietarioComponent?.propietarioradioForm);
    VALIDAR_FORMULARIO(this.propietarioComponent?.formTercerosDatos);
    VALIDAR_FORMULARIO(this.establecimientoComponent?.datosMercanciaForm);
    VALIDAR_FORMULARIO(this.datosDelEstablecimientoSeccionComponent?.detosEstablecimiento);
    VALIDAR_FORMULARIO(this.formDelTramite);
    VALIDAR_FORMULARIO(this.mercanciaForm);
    VALIDAR_FORMULARIO(this.paisForm);
    VALIDAR_FORMULARIO(this.frmRepresentacionForm);

    // Validar tableBodyData y isInvalidaPartidas
    if (this.tableBodyData) {
      if (this.tableBodyData.length === 0) {
        this.isInvalidaPartidas = true;
        isValid = false;
      } else {
        this.isInvalidaPartidas = false;
      }
    }

    return isValid;
  }
  /**
   * Método del ciclo de vida de Angular que se llama justo antes de que el componente sea destruido.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }
}