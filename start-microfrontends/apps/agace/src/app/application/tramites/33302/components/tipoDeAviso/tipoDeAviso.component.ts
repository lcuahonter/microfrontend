import {
  AlertComponent,
  InputCheckComponent,
  TituloComponent,
} from '@ng-mf/data-access-user';
import {
  Component,
  EventEmitter,
  Input,
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
import { Subject, map, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Solicitud32301Service} from '../../services/solicitud.service';
import { TipoDevAviso } from '../../models/avisomodify.model';
import { Tramite33302Query } from '../../estados/tramite33302.query';
import { Tramite33302Store } from '../../estados/tramite33302.store';

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
    TituloComponent,
    AlertComponent,
    InputCheckComponent,
  ],
  templateUrl: './tipoDeAviso.component.html',
})
export class TipoDeAvisoComponent implements OnInit, OnDestroy {
  /** Formulario reactivo para gestionar los tipos de aviso */
  miFormulario!: FormGroup;

  /** Objeto que contiene los datos del tipo de aviso */
  tipoDevAviso!: TipoDevAviso;

  /** EventEmitter para emitir los datos del formulario cuando se envíen */
  @Output() tabEnabledData = new EventEmitter<TipoDevAviso>();

  /** Variable para habilitar o deshabilitar el formulario */
  isDisabled: boolean = false;

  /** Modalidad de certificación */
  modalidadCertificacion!: TipoDevAviso;

  /**
   * @description Constructor del componente.
   * Inicializa el componente y establece el índice de la pestaña seleccionada.
   */
  @Input() formularioDeshabilitado: boolean = false;

  /** Sujeto para manejar el ciclo de vida de los observables */
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Constructor del componente, inyecta las dependencias necesarias
   * @param fb - FormBuilder para crear formularios reactivos
   * @param AvisoModifyService - Servicio para obtener información sobre el aviso
   * @param store - Store para gestionar el estado global del trámite
   * @param Tramite32301Query - Query para obtener el estado actual del trámite
   */
  constructor(
    private fb: FormBuilder,
    private AvisoModifyService: Solicitud32301Service,
    private store: Tramite33302Store,
    private Tramite32301Query: Tramite33302Query
  ) {
    this.crearFormMiFormulario();
  }

  /**
   * Inicializa el componente, suscribe a los cambios en el estado global
   * y actualiza el formulario con los datos recibidos.
   */
  ngOnInit(): void {
    this.inicializamiFormulario();
    
    this.Tramite32301Query.select()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.tipoDevAviso = state as unknown as TipoDevAviso;
        this.crearFormMiFormulario();
        if (this.formularioDeshabilitado) {
          this.miFormulario.disable();
        }
      });
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
          this.store.actualizarEstado({modalidadCertificacion:resp.descripcion});
        })
      )
      .subscribe();
  }

  /**
   * Crea el formulario reactivo para el tipo de aviso con valores predefinidos.
   */
  crearFormMiFormulario(): void {
    this.miFormulario = this.fb.group({
      modalidadCertificacion: [
        { value: this.tipoDevAviso?.modalidadCertificacion, disabled: true },
      ],
      foreignClientsSuppliers: [this.tipoDevAviso?.foreignClientsSuppliers],
      nationalSuppliers: [this.tipoDevAviso?.nationalSuppliers],
      modificationsMembers: [this.tipoDevAviso?.modificationsMembers],
      changesToLegalDocuments: [this.tipoDevAviso?.changesToLegalDocuments],
      mergerOrSplitNotice: [this.tipoDevAviso?.mergerOrSplitNotice],
      additionFractions: [this.tipoDevAviso?.additionFractions],
      acepto253: [this.tipoDevAviso?.acepto253, Validators.required],
      presenten: [ this.tipoDevAviso?.presenten],
      contratados: [this.tipoDevAviso?.contratados],
      expirado: [this.tipoDevAviso?.expirado],
      derechos: [this.tipoDevAviso?.derechos],
    });
  }

  /**
   * Emite los valores del formulario cuando el usuario lo envía.
   */
  aiEnviar(): void {
    this.tabEnabledData.emit(this.miFormulario.value);
  }

  /**
   * Actualiza el store con el valor seleccionado de los proveedores extranjeros.
   */

  setClientesProveedoresExtranjeros(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'foreignClientsSuppliers'
    )?.value;
    this.store.actualizarEstado({
      foreignClientsSuppliers: FRACCION_ARANCELATIA,});
  }

  /**
   * Actualiza el store con el valor seleccionado de los proveedores nacionales.
   */

  setProveedoresNacionales(): void {
    const FRACCION_ARANCELATIA =
      this.miFormulario.get('nationalSuppliers')?.value;
    this.store.actualizarEstado({
      nationalSuppliers: FRACCION_ARANCELATIA,});
  }

  /**
   * Actualiza el store con el valor seleccionado de las modificaciones de miembros.
   */
  setModificacionesMiembros(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'modificationsMembers'
    )?.value;
    this.store.actualizarEstado({
      modificationsMembers: FRACCION_ARANCELATIA});
  }

  /**
   * Actualiza el store con el valor seleccionado de los cambios en los documentos legales.
   */

  setCambiosDocumentosLegales(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'changesToLegalDocuments'
    )?.value;
    this.store.actualizarEstado({
      changesToLegalDocuments: FRACCION_ARANCELATIA,});
  }

  /**
   * Actualiza el store con el valor seleccionado sobre la notificación de fusión o escisión.
   */

  setNotifiFusionOescision(): void {
    const FRACCION_ARANCELATIA = this.miFormulario.get(
      'mergerOrSplitNotice'
    )?.value;
    this.store.actualizarEstado({
      mergerOrSplitNotice: FRACCION_ARANCELATIA});
  }

  /**
   * Actualiza el store con el valor seleccionado de las fracciones adicionales.
   */
  setAdicionalesFractions(): void {
    const FRACCION_ARANCELATIA =
      this.miFormulario.get('additionFractions')?.value;
    this.store.actualizarEstado({
      additionFractions: FRACCION_ARANCELATIA});
  }

  /**
 * @method setPresenten
 * @description
 * Actualiza el store con el valor seleccionado del campo 'Presenten'.
 * Este método obtiene el valor del formulario reactivo y lo sincroniza con el estado global.
 */
setPresenten(): void {
  const FRACCION_ARANCELATIA = this.miFormulario.get('presenten')?.value;
  this.store.actualizarEstado({
    presenten: FRACCION_ARANCELATIA,
  });
}

/**
 * @method setContratados
 * @description
 * Actualiza el store con el valor seleccionado del campo 'Contratados'.
 * Este método obtiene el valor del formulario reactivo y lo sincroniza con el estado global.
 */
setContratados(): void {
  const FRACCION_ARANCELATIA = this.miFormulario.get('contratados')?.value;
  this.store.actualizarEstado({
    contratados: FRACCION_ARANCELATIA
  });
}

/**
 * @method setExpirado
 * @description
 * Actualiza el store con el valor seleccionado del campo 'Expirado'.
 * Este método obtiene el valor del formulario reactivo y lo sincroniza con el estado global.
 */
setExpirado(): void {
  const FRACCION_ARANCELATIA = this.miFormulario.get('expirado')?.value;
  this.store.actualizarEstado({
    expirado: FRACCION_ARANCELATIA
  });
}

/**
 * @method setDerechos
 * @description
 * Actualiza el store con el valor seleccionado del campo 'Derechos'.
 * Este método obtiene el valor del formulario reactivo y lo sincroniza con el estado global.
 */
setDerechos(): void {
  const FRACCION_ARANCELATIA = this.miFormulario.get('derechos')?.value;
  this.store.actualizarEstado({
    derechos: FRACCION_ARANCELATIA
  });
}

/**
 * @method setAceptacion253
 * @description
 * Actualiza el store con el valor del checkbox de aceptación del artículo 253.
 * Este método obtiene el valor del formulario reactivo y lo sincroniza con el estado global.
 */
setAceptacion253(): void {
  const FRACCION_ARANCELATIA = this.miFormulario.get('acepto253')?.value;
  this.store.actualizarEstado({
    acepto253: FRACCION_ARANCELATIA
  });
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
