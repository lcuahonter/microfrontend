import { CapturaSolicitudeService } from '../../services/captura-solicitud.service';

import { Catalogo, ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { CatalogosSelect } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MediodetransporteService } from '../../services//medio-de-transporte.service';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Solicitud230101Query } from '../../estados/queries/tramites230101.query';
import { Solicitud230101State } from '../../estados/tramites/tramites230101.store';
import { Solicitud230101Store } from '../../estados/tramites/tramites230101.store';
import { Subject } from 'rxjs';
import { ValidacionesFormularioService } from '@ng-mf/data-access-user';
import { Validators } from '@angular/forms';
import { map } from 'rxjs';
import { takeUntil } from 'rxjs';



@Component({
  selector: 'app-pago-de-derecho',
  templateUrl: './pago-de-derecho.component.html',
  styleUrl: './pago-de-derecho.component.scss',
})
export class PagoDeDerechoComponent implements OnInit, OnDestroy {

  /**
   * @property {ReplaySubject<boolean>} destroyed$
   * @description Sujeto que emite un valor booleano para indicar la destrucción del componente.
   * Se utiliza para limpiar suscripciones y evitar fugas de memoria.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * @property {Solicitud230101State} derechoState
   * @description Estado actual del trámite 230101, que contiene información relevante
   * para la sección de pago de derechos.
   */
  public derechoState!: Solicitud230101State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Sujeto utilizado para notificar la destrucción del componente.
   * Se emplea para limpiar suscripciones y evitar fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {FormGroup} FormSolicitud
   * @description Grupo de formularios principal que contiene los controles de formulario
   * relacionados con el pago de derechos. Este formulario incluye validaciones y se utiliza
   * para capturar y gestionar los datos del usuario en esta sección.
   */
  FormSolicitud!: FormGroup;

  /**
   * @property {string} respuesta
   * @description Almacena la respuesta obtenida de alguna operación o servicio.
   * Este campo puede ser utilizado para mostrar mensajes o resultados en la interfaz de usuario.
   */
  respuesta: string = '';

  /**
   * @property {Catalogo} bancoSeleccionado
   * @description Representa el banco seleccionado por el usuario en el formulario de pago de derechos.
   * Este campo se utiliza para almacenar y gestionar la información del banco seleccionado.
   */
  bancoSeleccionado!: Catalogo;

  /**
   * @property {CatalogosSelect} bancoCatalogo - Representa la configuración del catálogo de bancos.
   * 
   * @description
   * Este objeto define las propiedades necesarias para configurar un catálogo de selección
   * relacionado con los bancos. Incluye el nombre del campo, si es obligatorio, la primera opción
   * que se muestra al usuario y una lista de catálogos disponibles.
   * 
   * @property {string} labelNombre - Etiqueta que describe el nombre del campo (en este caso, "Banco").
   * @property {boolean} required - Indica si este campo es obligatorio.
   * @property {string} primerOpcion - Texto que se muestra como la primera opción en el selector.
   * @property {Array<any>} catalogos - Lista de opciones disponibles en el catálogo.
   */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };
  /**
      * Indica si el formulario es de solo lectura.
      */
  esFormularioSoloLectura: boolean = false;

  /**
   * Estado de los datos de consulta.
   */
  consultaDatos!: ConsultaioState;

  /** Estado de la consulta que se obtiene del store. */
  public consultaState!: ConsultaioState;
  /**
   * Constructor de la clase PagoDeDerechoComponent.
   * 
   * @param fb - Servicio `FormBuilder` para la creación y gestión de formularios reactivos.
   * @param captuaservice - Servicio `CapturaSolicitudeService` para manejar la captura de solicitudes.
   * @param solicitud230101Store - Almacén `Solicitud230101Store` para gestionar el estado de la solicitud 230101.
   * @param solicitud230101Query - Consulta `Solicitud230101Query` para obtener datos del estado de la solicitud 230101.
   * @param validacionesService - Servicio `ValidacionesFormularioService` para realizar validaciones personalizadas en formularios.
   * @param mediodetransporteService - Servicio `MediodetransporteService` para gestionar datos relacionados con medios de transporte.
   */
  constructor(
    private fb: FormBuilder,
    private captuaservice: CapturaSolicitudeService,
    private solicitud230101Store: Solicitud230101Store,
    private solicitud230101Query: Solicitud230101Query,
    private validacionesService: ValidacionesFormularioService,
    private mediodetransporteService: MediodetransporteService,
    private consultaioQuery: ConsultaioQuery
  ) {
    this.fetchBancoData();
  }

  /**
   * @method fetchBancoData
   * @description Obtiene los datos del catálogo de bancos desde el servicio de medio de transporte
   * y los asigna al catálogo de bancos en el componente.
   * 
   * @returns {void}
   * 
   * @example
   * this.fetchBancoData();
   * 
   * @remarks
   * Este método utiliza el servicio `mediodetransporteService` para obtener los datos
   * y se asegura de limpiar las suscripciones utilizando el operador `takeUntil` con `destroyed$`.
   */
  fetchBancoData(): void {
    this.mediodetransporteService
      .getMedioDeTransporte()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.bancoCatalogo.catalogos = data as Catalogo[];
      });
  }
  /**
   * Hook del ciclo de vida de Angular que se llama después de que la vista del componente se ha inicializado completamente.
   *
   * Este método realiza las siguientes acciones:
   * - Llama al método `getMercancia` para inicializar el objeto `mercancia`.
   * - Inicializa el grupo de formularios `FormSolicitud` con controles de formulario anidados y validadores.
   */

  ngOnInit(): void {
    this.solicitud230101Query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.derechoState = seccionState;
        })
      )
      .subscribe();

    this.FormSolicitud = this.fb.group({
      pagodeDerechos: this.fb.group({
        claveDeReferencia: [{ value: this.derechoState?.claveDeReferencia, disabled: true }, [Validators.required, Validators.maxLength(50)]],
        cadenaPagoDependencia: [{ value: this.derechoState?.cadenaPagoDependencia, disabled: true }, [Validators.required, Validators.maxLength(50)]],
        banco: [this.derechoState?.banco, Validators.required],
        llaveDePago: [this.derechoState?.llaveDePago, [Validators.required, Validators.maxLength(10)]],
        fecPago: [this.derechoState?.fecPago, Validators.required],
        impPago: [{ value: this.derechoState?.impPago, disabled: true }, [Validators.required, Validators.maxLength(16)]]
      }),
    });
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();
    this.inicializarEstadoFormulario();
  }
  /**
   * Este método se utiliza para inicializar el estado del formulario.
   * Si el formulario es de solo lectura, se deshabilita; de lo contrario, se habilita.
   * 
   * @returns {void}
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.FormSolicitud?.disable();
    }
    else {
      this.FormSolicitud?.enable();
    }
  }

  /**
   * Este método se utiliza para validar la forma del transporte. - 220401
   * @param form: Forma del transporte
   * @param field: campo del formulario
   * @returns Validaciones del formulario
   */
  isValid(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
       * Establece los valores en el store de tramite5701.
       *
       * @param {FormGroup} form - El formulario del cual se obtiene el valor.
       * @param {string} campo - El nombre del campo del formulario cuyo valor se va a obtener.
       * @param {string} metodoNombre - El nombre del método en el store que se va a invocar con el valor del campo.
       * @returns {void}
       */
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud230101Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud230101Store[metodoNombre] as (value: string | number | boolean) => void)(VALOR);
  }

  /**
* Obtiene el grupo de formulario 'pagodeDerechos' del formulario principal 'FormSolicitud'.
*
* @returns {FormGroup} El grupo de formulario 'pagodeDerechos'.
*/
  get pagodeDerechos(): FormGroup {
    return this.FormSolicitud.get('pagodeDerechos') as FormGroup;
  }

  /**
   * @override
   * @method
   * @name ngOnDestroy
   * @description Este método se ejecuta automáticamente cuando el componente se destruye. 
   * Se utiliza para limpiar recursos y evitar fugas de memoria.
   * 
   * @example
   * // Ejemplo de uso:
   * ngOnDestroy(): void {
   *   this.destroyed$.next(true);
   *   this.destroyed$.complete();
   *   this.destroyNotifier$.next();
   *   this.destroyNotifier$.complete();
   * }
   * 
   * @remarks
   * Este método envía notificaciones a los observables `destroyed$` y `destroyNotifier$` 
   * para indicar que el componente está siendo destruido, y luego completa ambos observables.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
