import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';

import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConsultaioQuery,
  ConsultaioState,
  InputRadioComponent,
  TituloComponent,
  ValidacionesFormularioService
} from '@ng-mf/data-access-user';

import { EXENTO_DE_PAGO } from '../../constantes/certificado-zoosanitario.enum';
import { MediodetransporteService } from '../../services/medio-de-transporte.service';

import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';

import { CommonGet, DatosDeChoresIniciarData } from '../../models/pantallas-captura.model';
import { Solicitud220402State, Solicitud220402Store } from '../../estados/tramites/tramites220402.store';


@Component({
  selector: 'app-pago-de-derecho',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent
  ],
  templateUrl: './pago-de-derecho.component.html',
  styleUrl: './pago-de-derecho.component.scss',
})
export class PagoDeDerechoComponent implements OnInit, OnDestroy {
  /**
   * @property {ReplaySubject<boolean>} destroyed$
   * @description ReplaySubject utilizado para notificar la destrucción del componente y evitar fugas de memoria.
   * 
   * Este ReplaySubject emite un valor cuando el componente es destruido y se completa para liberar recursos.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * @property {Solicitud220402State} derechoState
   * @description Estado actual del derecho, que contiene información relacionada con el trámite y el solicitante.
   */
  public derechoState!: Solicitud220402State;

  /**
   * @property {Subject<void>} destroyNotifier$
   * @description Subject utilizado para notificar y completar las suscripciones activas al destruir el componente, evitando fugas de memoria.
   */
  private destroyNotifier$: Subject<void> = new Subject();

  /**
   * @property {Subscription} statusSubscription
   * @description Suscripción a los cambios de estado del formulario para actualizar el store.
   * @private
   */
  private statusSubscription!: Subscription;

  /**
   * @property {FormGroup} FormSolicitud
   * @description Formulario principal que contiene los datos del derecho.
   */
  FormSolicitud!: FormGroup;

  /**
   * @property {string} respuesta
   * @description Respuesta obtenida del servidor o utilizada para mostrar información en el componente.
   * @default ''
   */
  respuesta: string = '';

  /**
   * @property {CatalogosSelect} mercanciaCatalogo
   * @description Catálogo que contiene información sobre las mercancías disponibles.
   */
  public mercanciaCatalogo!: CatalogosSelect;

  /**
   * @property {Catalogo} bancoSeleccionado
   * @description Banco seleccionado por el usuario en el formulario.
   */
  bancoSeleccionado!: Catalogo;

  /**
    * Opciones disponibles para el grupo de radio.
    */
  radioOpcions = EXENTO_DE_PAGO;

  /**
   * @property {CatalogosSelect} bancoCatalogo
   * @description Catálogo que contiene información sobre los bancos disponibles.
   * 
   * @property {string} labelNombre - Nombre del catálogo.
   * @property {boolean} required - Indica si el catálogo es obligatorio.
   * @property {string} primerOpcion - Texto de la primera opción del catálogo.
   * @property {Catalogo[]} catalogos - Lista de opciones disponibles en el catálogo.
   */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: true,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };
  /**
   * @property {ConsultaioState} consultaDatos
   * @description Estado actual de la consulta, que contiene información relacionada con el trámite y el solicitante.
   */
  consultaDatos!: ConsultaioState;
  /**
   * @property {boolean} soloLectura
   * @description Indica si el formulario o los campos están en modo de solo lectura.
   * @default false
   */
  soloLectura: boolean = false;
  /**
   * @constructor
   * @description Constructor del componente `PagoDeDerechoComponent`.
   * 
   * Este constructor inicializa los servicios necesarios para el funcionamiento del componente y realiza la carga inicial de datos del catálogo de bancos mediante el método `fetchBancoData`.
   * 
   */
  constructor(
    private fb: FormBuilder,
    private solicitud220402Store: Solicitud220402Store,
    private solicitud220402Query: Solicitud220402Query,
    private validacionesService: ValidacionesFormularioService,
    private mediodetransporteService: MediodetransporteService,
    private consultaioQuery: ConsultaioQuery,
    private cdr: ChangeDetectorRef

  ) {
    this.fetchBancoData();
  }
  /**
  * @method ngOnInit
  * @description Inicializa el componente, configura el estado del formulario y carga los datos necesarios.
  */
  ngOnInit(): void {
    this.getMercancia();
    this.inicializarFormulario(); // Crear el formulario una sola vez

    this.solicitud220402Query.selectSolicitud$
      .pipe(
        take(1),
        map((seccionState) => {
          this.derechoState = seccionState;
          // Actualizar el formulario con el estado más reciente sin recrearlo
          if (this.FormSolicitud) {
            this.FormSolicitud.patchValue({ datosImportadorExportador: this.derechoState }, { emitEvent: false });
          }
        })
      )
      .subscribe();

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    // Suscripción a los cambios de estado del formulario para actualizar el store de Akita.
    this.statusSubscription = this.FormSolicitud.statusChanges.subscribe(() => {
        this.solicitud220402Store.updateFormStatus('pagoDerechos', this.FormSolicitud.valid);
    });

    // Comprueba si se debe marcar el formulario como 'touched' al iniciar.
    if (this.solicitud220402Query.getValue().markAllAsTouched) {
        this.mostrarErrores();
    }
  }
  /**
   * @method inicializarFormulario
   * @description Inicializa el formulario `FormSolicitud` con los datos del estado actual y configura su comportamiento dinámico.
   */
inicializarFormulario(): void {
    // Inicialice solo si el formulario no existe o el estado está disponible
    if (!this.FormSolicitud || this.derechoState) {
      this.FormSolicitud = this.fb.group({
        datosImportadorExportador: this.fb.group({
          exentoDePago: [this.derechoState?.exentoDePago, [Validators.required]],
          nombreImportExport: [this.derechoState?.nombreImportExport],
          justificacion: [this.derechoState?.justificacion, [Validators.required, Validators.maxLength(100)]],
          claveDeReferencia: [this.derechoState?.claveDeReferencia, []],
          cadenaDependencia: [this.derechoState?.cadenaDependencia, [Validators.required, Validators.maxLength(50)]],
          banco: [this.derechoState?.banco, [Validators.required]],
          llaveDePago: [this.derechoState?.llaveDePago, [Validators.required, Validators.maxLength(50)]],
          fechaPago: [this.derechoState?.fechaPago, [Validators.required, PagoDeDerechoComponent.fechaLimValidator()]],
          importePago: [this.derechoState?.importePago, []],
        }),
      });

      // Aplicar el estado del campo inicial según el valor de exentoDePago
      this.actualizarCamposDeFormularioBasadosEnExentoDePago();

      // Solo obtener valores predeterminados si no existen en el estado
      if (!this.derechoState?.claveDeReferencia && !this.derechoState?.importePago) {
     this.getImporteYClaveReferencia()
      }
    }
  }

  getImporteYClaveReferencia(): void {
       this.mediodetransporteService
          .getPagoDeChoresIniciar()
          .pipe(takeUntil(this.destroyNotifier$))
          .subscribe((data: CommonGet<DatosDeChoresIniciarData>): void => {
            this.FormSolicitud.patchValue({
              datosImportadorExportador: {
                claveDeReferencia: data.datos.clave_referencia,
                importePago: data.datos.importe_pago
              }
            });
            this.solicitud220402Store.setClaveDeReferencia(data.datos.clave_referencia);
            this.solicitud220402Store.setImportePago(data.datos.importe_pago.toString());
          });
  }
  /**
   * @method inicializarEstadoFormulario
   * @description Configura el estado del formulario `FormSolicitud` según el modo de solo lectura.
   */
  inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.FormSolicitud?.disable();
    } else {
      // Se elimina la llamada a this.FormSolicitud?.enable() porque era redundante
      // y causaba conflictos con la lógica de habilitar/deshabilitar campos específicos
      // que ya se maneja dentro de actualizarCamposDeFormularioBasadosEnExentoDePago.
      this.actualizarCamposDeFormularioBasadosEnExentoDePago();
    }
  }
  /**
   * @method exentoDePagoChange
   * @description Actualiza los campos del formulario según el valor seleccionado en el campo 'exentoDePago'.
   */
  exentoDePagoChange(): void {
    this.actualizarCamposDeFormularioBasadosEnExentoDePago();
  }
  /**
   * @method actualizarBanco
   * @description Actualiza el banco seleccionado en el formulario con el valor proporcionado.
   */
  actualizarBanco(e: Catalogo): void {
    this.bancoSeleccionado = e;
  }
  /**
   * @method fetchBancoData
   * @description Obtiene los datos del catálogo de bancos y los asigna al formulario.
   */
  fetchBancoData(): void {
    this.mediodetransporteService
      .getBanco()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data): void => {
        this.bancoCatalogo.catalogos = data.datos as Catalogo[];
      });
  }

  /**
 * Actualiza los campos del formulario en función del valor de 'exentoDePago'.
 *
 * Este método ajusta la validez, habilitación y deshabilitación de los campos del formulario
 * 'FormSolicitud' según el valor seleccionado en el campo 'exentoDePago'. Si el formulario está
 * en modo de solo lectura o no existe, no realiza ninguna acción.
 *
 * Comportamiento:
 * - Si 'exentoDePago' no tiene valor, deshabilita y limpia los validadores de los campos de pago.
 * - Si 'exentoDePago' es 'No', habilita y asigna validadores a los campos de pago, deshabilitando
 *   el campo de justificación.
 * - Si 'exentoDePago' es 'Si', habilita y asigna validador al campo de justificación, deshabilitando
 *   los campos de pago.
 * - Actualiza la validez de todos los controles del grupo 'datosImportadorExportador'.
 *
 * @method
 * @returns {void}
 */
  actualizarCamposDeFormularioBasadosEnExentoDePago(): void {
    if (!this.FormSolicitud) {
      return;
    }
    
    // No modifique los estados de los campos si el formulario está en modo de solo lectura
    if (this.soloLectura) {
      return;
    }
    
    const EXENTODEPAGO = this.FormSolicitud.get('datosImportadorExportador.exentoDePago')?.value;
    
    // Si no se establece ningún valor, configure el estado predeterminado
    if (EXENTODEPAGO === null || EXENTODEPAGO === undefined || EXENTODEPAGO === '') {
      // Establezca el comportamiento predeterminado para cuando no se seleccione ninguna opción: deshabilite todos los campos de pago
      this.FormSolicitud.get('datosImportadorExportador.justificacion')?.setValidators([]);
      this.FormSolicitud.get('datosImportadorExportador.cadenaDependencia')?.setValidators([]);
      this.FormSolicitud.get('datosImportadorExportador.llaveDePago')?.setValidators([]);
      this.FormSolicitud.get('datosImportadorExportador.banco')?.setValidators([]);
      this.FormSolicitud.get('datosImportadorExportador.fechaPago')?.setValidators([]);
      this.FormSolicitud.get('datosImportadorExportador.claveDeReferencia')?.disable();
      this.FormSolicitud.get('datosImportadorExportador.importePago')?.disable();
      this.FormSolicitud.get('datosImportadorExportador.cadenaDependencia')?.disable();
      this.FormSolicitud.get('datosImportadorExportador.llaveDePago')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.banco')?.disable();
      this.FormSolicitud.get('datosImportadorExportador.fechaPago')?.disable();
      this.FormSolicitud.get('datosImportadorExportador.justificacion')?.disable();
    } else {
      // Restablecer solo si hay un valor y se está cambiando
      // Primero habilite el formulario, luego aplique deshabilitaciones específicas
      this.FormSolicitud.get('datosImportadorExportador')?.enable();
      
      if (EXENTODEPAGO === 'No') {
        // No exenta - habilitar campos de pago
        this.FormSolicitud.get('datosImportadorExportador.cadenaDependencia')?.setValidators([Validators.required]);
        this.FormSolicitud.get('datosImportadorExportador.llaveDePago')?.setValidators([Validators.required]);
        this.FormSolicitud.get('datosImportadorExportador.banco')?.setValidators([Validators.required]);
        this.FormSolicitud.get('datosImportadorExportador.fechaPago')?.setValidators([Validators.required, PagoDeDerechoComponent.fechaLimValidator()]);
        this.FormSolicitud.get('datosImportadorExportador.justificacion')?.setValidators([]);
        this.FormSolicitud.get('datosImportadorExportador.justificacion')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.claveDeReferencia')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.importePago')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.justificacion')?.setValue(null);
        this.solicitud220402Store.setJustificacion('');
        this.getImporteYClaveReferencia();
      } else if (EXENTODEPAGO === 'Si') {
        // Exento: habilitar solo el campo de justificación
        this.FormSolicitud.get('datosImportadorExportador.justificacion')?.setValidators([Validators.required]);
        this.FormSolicitud.get('datosImportadorExportador.cadenaDependencia')?.setValidators([]);
        this.FormSolicitud.get('datosImportadorExportador.llaveDePago')?.setValidators([]);
        this.FormSolicitud.get('datosImportadorExportador.banco')?.setValidators([]);
        this.FormSolicitud.get('datosImportadorExportador.fechaPago')?.setValidators([]);
        this.FormSolicitud.get('datosImportadorExportador.claveDeReferencia')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.importePago')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.cadenaDependencia')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.llaveDePago')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.banco')?.disable();
        this.FormSolicitud.get('datosImportadorExportador.fechaPago')?.disable();

        // Set form values to null
        this.FormSolicitud.get('datosImportadorExportador.claveDeReferencia')?.setValue(null);
        this.FormSolicitud.get('datosImportadorExportador.importePago')?.setValue(null);
        this.FormSolicitud.get('datosImportadorExportador.fechaPago')?.setValue(null);
        this.FormSolicitud.get('datosImportadorExportador.banco')?.setValue(null);
        this.FormSolicitud.get('datosImportadorExportador.llaveDePago')?.setValue(null);
        this.FormSolicitud.get('datosImportadorExportador.cadenaDependencia')?.setValue(null);

        // Set STORE values to null/empty to prevent repopulation
        this.solicitud220402Store.setClaveDeReferencia('');
        this.solicitud220402Store.setImportePago('');
        this.solicitud220402Store.setFechaPago('');
        this.solicitud220402Store.setBanco('');
        this.solicitud220402Store.setllaveDePago('');
        this.solicitud220402Store.setCadenaDependencia('');
      }
    }
    
    const GRUPO = this.FormSolicitud.get('datosImportadorExportador') as FormGroup;
    if (GRUPO) {
      Object.values(GRUPO.controls).forEach(control => {
        control.updateValueAndValidity();
      });
    }
  }
  /**
   * Inicializa el objeto `mercancia` con propiedades y valores predefinidos.
   *
   * El objeto `mercancia` contiene las siguientes propiedades:
   * - `labelNombre`: Una cadena de texto que se establece en 'Mercancía', utilizada como etiqueta o título.
   * - `required`: Un valor booleano que se establece en `true`, indicando que este campo es obligatorio.
   * - `primerOpcion`: Una cadena de texto que se establece en 'Seleccione un valor', utilizada como opción predeterminada o de marcador de posición en un menú desplegable.
   * - `catalogos`: Un arreglo de objetos que representan las opciones en el catálogo. Cada objeto tiene:
   *   - `id`: Un identificador único para la opción.
   *   - `descripcion`: Una cadena de texto que describe la opción. Actualmente, ambas opciones tienen la misma descripción 'Opción 1'.
   */

  public getMercancia(): void {
    this.mercanciaCatalogo = {
      labelNombre: 'Mercancía',
      required: true,
      primerOpcion: 'Selecciona un valor',
      catalogos: [
        {
          id: 1,
          descripcion: 'Opción 1',
        },
        {
          id: 2,
          descripcion: 'Opción 1',
        },
      ],
    };
  }

  /**
   * Este método se utiliza para validar la forma del transporte. - 220402
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
  setValoresStore(form: FormGroup, campo: string, metodoNombre: keyof Solicitud220402Store): void {
    const VALOR = form.get(campo)?.value;
    (this.solicitud220402Store[metodoNombre] as (value: (boolean | string | null)) => void)(VALOR);
  }

  /**
  * Obtiene el grupo de formulario 'datosImportadorExportador' del formulario principal 'FormSolicitud'.
  *
  * @returns {FormGroup} El grupo de formulario 'datosImportadorExportador'.
  */
  get datosImportadorExportador(): FormGroup {
    return this.FormSolicitud.get('datosImportadorExportador') as FormGroup;
  }
  /**
   * Validador para asegurar que la fecha seleccionada no sea en el futuro.
   */
  public static fechaLimValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const LIM = control.value;
      if (LIM) {
        const [YEAR, MONTH, DAY] = LIM.split('-');
        const FECHA = new Date(+Number(YEAR), +Number(MONTH) - 1, +Number(DAY));
        const TODAY = new Date();
        if (FECHA.getTime() > TODAY.getTime()) {
          return { fechaLim: true }; // Retorna error si la fecha está en el futuro
        }
      }
      return null;
    };
  }

  /**
   * Método que se ejecuta al destruir el componente.
   * 
   * Libera los recursos y cancela las suscripciones activas.
   */
  ngOnDestroy(): void {
    // Asegura que el último estado de validez se guarde en el store antes de destruir el componente.
    if (this.FormSolicitud) {
      this.solicitud220402Store.updateFormStatus('pagoDerechos', this.FormSolicitud.valid);
    }

    // Cancela la suscripción a los cambios de estado para evitar fugas de memoria.
    if (this.statusSubscription) {
        this.statusSubscription.unsubscribe();
    }

    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Método para mostrar errores en el formulario.
   * 
   * Este método activa la visualización de errores en el formulario marcando todos los campos como tocados.
   */
  public mostrarErrores = ():void => {
    this.FormSolicitud?.markAllAsTouched?.();
    this.cdr.detectChanges();
  }
}