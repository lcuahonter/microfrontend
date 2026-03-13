import {
  AlertComponent, ConsultaioQuery, ConsultaioState, TituloComponent
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormularioGrupo, TipoDevAviso } from '../../models/avisomodify.model';
import { Subject, map, takeUntil } from 'rxjs';
import { AvisoModifyService } from '../../services/aviso-modify.service';
import { CommonModule } from '@angular/common';
import { InputCheckComponent } from '@libs/shared/data-access-user/src';
import { Tramite32301Query } from '../../estados/tramite32301.query';
import { Tramite32301Store } from '../../estados/tramite32301.store';

/**
 * Componente para manejar los tipos de aviso en el formulario de modificación.
 * Este componente contiene un formulario reactivo para capturar diversas opciones
 * relacionadas con la modalidad de certificación y otros aspectos del trámite.
 */
@Component({
  selector: 'app-tipo-de-aviso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AlertComponent,
    TituloComponent,
    InputCheckComponent,
  ],
  templateUrl: './tipo-de-aviso.component.html',
})
export class TipoDeAvisoComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para gestionar los tipos de aviso */
  miFormulario!: FormGroup;

  /** Objeto que contiene los datos del tipo de aviso */
  tipoDevAviso!: FormularioGrupo;

  /** EventEmitter para emitir los datos del formulario cuando se envíen */
  @Output() tabEnabledData = new EventEmitter<TipoDevAviso>();

  @Output() onContinue = new EventEmitter<void>();


  

  /** Variable para habilitar o deshabilitar el formulario */
  isDisabled: boolean = false;

  /** Modalidad de certificación */
  modalidadCertificacion!: TipoDevAviso;

  /** Sujeto para manejar el ciclo de vida de los observables */
  private destroy$: Subject<void> = new Subject<void>();
  /**
* Estado actual de la consulta obtenido desde el servicio.
*/
  consultaDatos!: ConsultaioState;

  tipoTramiteDeclaraciones = [];

  /**
   * Indica si el formulario es de solo lectura.
   * Se utiliza para determinar si los campos del formulario deben ser editables o no.
   */
  soloLectura: boolean = false;

  mensajeCamposObligatorios: string = '* Campos obligatorios';

  /**
   * Constructor del componente, inyecta las dependencias necesarias
   * @param fb - FormBuilder para crear formularios reactivos
   * @param AvisoModifyService - Servicio para obtener información sobre el aviso
   * @param store - Store para gestionar el estado global del trámite
   * @param Tramite32301Query - Query para obtener el estado actual del trámite
   */
  constructor(
    private fb: FormBuilder,
    private AvisoModifyService: AvisoModifyService,
    private store: Tramite32301Store,
    private Tramite32301Query: Tramite32301Query,
    private consultaioQuery: ConsultaioQuery
  ) {
  }

  /**
   * Inicializa el componente, suscribe a los cambios en el estado global
   * y actualiza el formulario con los datos recibidos.
   */
  ngOnInit(): void {
    this.crearFormMiFormulario();
    this.inicializamiFormulario();
    this.Tramite32301Query.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.tipoDevAviso = state;
        
        this.miFormulario.patchValue({
          modalidadCertificacion: this.tipoDevAviso?.tipoDevAviso?.modalidadCertificacion,
          foreignClientsSuppliers: this.tipoDevAviso?.tipoDevAviso?.foreignClientsSuppliers,
          nationalSuppliers: this.tipoDevAviso?.tipoDevAviso?.nationalSuppliers,
          modificationsMembers: this.tipoDevAviso?.tipoDevAviso?.modificationsMembers,
          changesToLegalDocuments: this.tipoDevAviso?.tipoDevAviso?.changesToLegalDocuments,
          mergerOrSplitNotice: this.tipoDevAviso?.tipoDevAviso?.mergerOrSplitNotice,
          additionFractions: this.tipoDevAviso?.tipoDevAviso?.additionFractions,
          acepto253: this.tipoDevAviso?.tipoDevAviso?.acepto253,
        });
      });
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.soloLectura = this.consultaDatos.readonly;
          this.inicializarEstadoFormulario();
        })
      )
      .subscribe();

    this.getTipoTramiteDeclaraciones();


  }
  /**
* Inicializa el estado del formulario según el modo de solo lectura.
* @private
*/
  private inicializarEstadoFormulario(): void {
    if (this.soloLectura) {
      this.miFormulario?.disable();
    } else {
      this.miFormulario?.enable();
    }
  }
  getLabelTramit(valor: string): string {
     this.tipoTramiteDeclaraciones.forEach((element: any) => {
      if (element.descripcion === valor) {
        valor = `${element.descripcion}`;
      }
    });
    return valor;
  }

  /**
 * Obtains the catalog of "tipo de trámite de declaraciones"
 * from the `AvisoModifyService`, updates the local variable
 * `tipoTramiteDeclaraciones`, and stores the data in the state
 * management store.
 *
 * The request is automatically unsubscribed when `destroy$` emits,
 * preventing memory leaks.
 *
 * @returns {void}
 */
  getTipoTramiteDeclaraciones(): void {
    this.AvisoModifyService.getTipoTramiteDeclaraciones()
      .pipe(
        takeUntil(this.destroy$),
        map((resp) => {
          // Manejar la respuesta si es necesario
          this.tipoTramiteDeclaraciones = resp.datos;
          this.store.setTipoTramiteDeclaraciones(resp.datos);

        })
      )
      .subscribe();
  }
  /**
   * Inicializa los datos del formulario con la información del servicio de aviso.
   * Establece la modalidad de certificación en el store.
   */
  inicializamiFormulario(): void {
    this.AvisoModifyService.getAvisoModify()
      .pipe(
        takeUntil(this.destroy$),
        map((resp) => {
          this.store.setModalidadCertificacion(resp.descripcion);
        })
      )
      .subscribe();
  }

  /**
   * Crea el formulario reactivo para el tipo de aviso con valores predefinidos.
   */
  crearFormMiFormulario(): void {
    this.miFormulario = this.fb.group({
      modalidadCertificacion: [{ value: '', disabled: true }],
      foreignClientsSuppliers: [false],
      nationalSuppliers: [false],
      modificationsMembers: [false],
      changesToLegalDocuments: [false],
      mergerOrSplitNotice: [false],
      additionFractions: [false],
      acepto253: [false, Validators.required],
    });
  }

  /**
   * Emite los valores del formulario cuando el usuario lo envía.
   */
  aiEnviar(): void {
    this.tabEnabledData.emit(this.miFormulario.value);
  }

  continuar(): void {
    this.onContinue.emit();
  }

  /**
   * Actualiza el store con el valor seleccionado de los proveedores extranjeros.
   */

  setClientesProveedoresExtranjeros(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'foreignClientsSuppliers'
    )?.value;
    this.store.setClientesProveedoresExtranjeros(FRACCION_ARANCELATIA);
  }

  /**
   * Actualiza el store con el valor seleccionado de los proveedores nacionales.
   */

  setProveedoresNacionales(): void {
    const FRACCION_ARANCELATIA =
      this.miFormulario.get('nationalSuppliers')?.value;
    this.store.setProveedoresNacionales(FRACCION_ARANCELATIA);
  }

  /**
   * Actualiza el store con el valor seleccionado de las modificaciones de miembros.
   */
  setModificacionesMiembros(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'modificationsMembers'
    )?.value;
    this.store.setModificacionesMiembros(FRACCION_ARANCELATIA);
  }

  /**
   * Actualiza el store con el valor seleccionado de los cambios en los documentos legales.
   */

  setCambiosDocumentosLegales(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'changesToLegalDocuments'
    )?.value;
    this.store.setCambiosDocumentosLegales(FRACCION_ARANCELATIA);
  }

  /**
   * Actualiza el store con el valor seleccionado sobre la notificación de fusión o escisión.
   */

  setNotifiFusionOescision(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'mergerOrSplitNotice'
    )?.value;
    this.store.setNotifiFusionOescision(FRACCION_ARANCELATIA);
  }

  /**
   * Actualiza el store con el valor seleccionado de las fracciones adicionales.
   */
  setAdicionalesFractions(): void {
    const FRACCION_ARANCELATIA =
      this.miFormulario.get('additionFractions')?.value;
    this.store.setAdicionalesFractions(FRACCION_ARANCELATIA);
  }

  /**
   * Actualiza el store con el valor del checkbox de aceptación del 253.
   */
  setAceptacion253(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get('acepto253')?.value;
    this.store.setAceptacion253(FRACCION_ARANCELATIA);
  }

  /**
   * Maneja la emisión de valores del formulario cuando se realiza alguna acción.
   */
  handleValores(): void {
    this.tabEnabledData.emit();
  }

  /**
   * Se llama cuando el componente es destruido para limpiar los recursos.
   */
  ngOnDestroy(): void {
    /**
     * Notifica a los observadores que el flujo de datos se va a destruir.
     */
    this.destroy$.next();

    /**
     * Completa el flujo de datos, asegurando que no se envíen más valores.
     */
    this.destroy$.complete();
  }
}
