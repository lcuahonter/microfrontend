import {
  Catalogo,
  CatalogoSelectComponent,
  CatalogosSelect,
  ConsultaioState,
  InputFecha,
  InputFechaComponent,
  TituloComponent,
  ValidacionesFormularioService,
} from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FECHA_FINAL, FECHA_INICIAL, FECHA_PAGO } from '../models/registro.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import {
  Solicitud31803State,
  Tramite31803Store,
} from '../state/Tramite31803.store';
import { CommonModule } from '@angular/common';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { RegistroSolicitudService } from '../services/registro-solicitud-service.service';
import { Solicitud31803Enum } from '../constantes/solicitud31803.enum';
import { Tramite31803Query } from '../state/Tramite31803.query';


/**
 * Componente que gestiona la solicitud del trámite 31803.
 * Contiene la lógica para inicializar el formulario, manejar eventos y comunicarse con el estado global.
 */
@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    TituloComponent,
    InputFechaComponent,
    CatalogoSelectComponent,
    ReactiveFormsModule,
  ],
  providers: [RegistroSolicitudService],
  templateUrl: './Solicitud.component.html',
  styleUrl: './Solicitud.component.scss',
})
export class SolicitudComponent implements OnInit, OnDestroy {

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud31803State;

  /**
   * Configuración para el campo de fecha inicial.
   */
  fechaInicialInput: InputFecha = FECHA_INICIAL;

  /**
   * Configuración para el campo de fecha final.
   */
  fechaFinalInput: InputFecha = FECHA_FINAL;

  /**
   * Configuración para el campo de fecha de pago.
   */
  fechaPagoInput: InputFecha = FECHA_PAGO;

  /**
   * Enumeración que contiene los textos utilizados en el componente.
   */
  solicitudEnum = Solicitud31803Enum;

  /**
   * Formulario reactivo para gestionar los datos de la solicitud.
   */
  registroForm!: FormGroup;


  /**
    * Subject para destruir notificador.
    */
  consultaDatos!: ConsultaioState;
  
/**
 * Indica si el formulario se encuentra en modo solo lectura.
 * Si es `true`, los controles del formulario estarán deshabilitados para evitar modificaciones.
 */
esFormularioSoloLectura: boolean = false;

/**
 * Indica si se debe mostrar un mensaje de error al usuario.
 */
mostrarError: boolean = false;

/**
 * Subject utilizado para notificar y limpiar suscripciones activas al destruir el componente.
 * Se emite un valor y se completa en el método `ngOnDestroy` para evitar fugas de memoria.
 */
public destroyNotifier$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
  * Configuración para el catálogo de bancos.
  */
  public bancoCatalogo: CatalogosSelect = {
    labelNombre: 'Banco',
    required: false,
    primerOpcion: 'Selecciona un valor',
    catalogos: [],
  };

  /**
   * Constructor del componente.
   * Se utiliza para la inyección de dependencias.
   *
   * @param registroSolicitud Servicio para obtener datos relacionados con la solicitud.
   * @param fb Constructor de formularios reactivos.
   * @param store Almacén global para gestionar el estado del trámite.
   * @param query Consulta para obtener el estado actual del trámite.
   * @param validacionesService Servicio para validar campos del formulario.
   */
  constructor(
    private consultaioQuery: ConsultaioQuery,
    private registroSolicitud: RegistroSolicitudService,
    public fb: FormBuilder,
    private store: Tramite31803Store,
    private query: Tramite31803Query,
    private validacionesService: ValidacionesFormularioService
  ) {
    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.consultaDatos = seccionState;
          this.esFormularioSoloLectura = this.consultaDatos.readonly;
        })
      )
      .subscribe()
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario, obtiene datos iniciales y suscribe al estado global.
   */
  ngOnInit(): void {
    this.obtenerDatosBanco();
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyNotifier$),
        map((seccionState) => {
          this.solicitudState = seccionState;       
        })
      )
      .subscribe();
     this.donanteDomicilio()
  }

/**
 * Determina el estado inicial del formulario según el modo de solo lectura.
 * 
 * Si el formulario está en modo solo lectura, llama a `guardarDatosDelFormulario()` para deshabilitar los campos.
 * Si no está en modo solo lectura, llama a `datosDeAvisoForm()` para aplicar la configuración correspondiente.
 */
inicializarEstadoFormulario(): void {
  if (this.esFormularioSoloLectura) {
    this.guardarDatosDelFormulario();
  } else {
    this.donanteDomicilio();
  }
}


  /**
   * Actualiza el campo de fecha de pago en el formulario y en el estado global.
   *
   * @param nuevo_fechaPago Nueva fecha de pago seleccionada.
   */
  cambioFechaPago(nuevo_fechaPago: string): void {
    this.registroForm.patchValue({
      fechaPago: nuevo_fechaPago,
    });
    this.setValoresStore(this.registroForm, 'fechaPago', 'setFechaPago');
  }

  /**
   * Obtiene los datos del catálogo de bancos desde el servicio.
   */
  obtenerDatosBanco(): void {
    this.registroSolicitud
      .obtenerDatosBanco()
      .pipe(takeUntil(this.destroyNotifier$))
      .subscribe((resp): void => {
        this.bancoCatalogo.catalogos = resp as Catalogo[];
      });
  }

  /**
   * Maneja el envío del formulario.
   * Valida el formulario antes de realizar acciones adicionales.
   */
  enviarFormulario(): void {
    if (this.registroForm.valid) {
      // Aquí se implementará la lógica para manejar el envío del formulario.
    }
  }

  /**
   * Verifica si un campo del formulario es válido.
   *
   * @param form Formulario reactivo.
   * @param field Nombre del campo a validar.
   * @returns `true` si el campo es válido, de lo contrario `false`.
   */
  esValido(form: FormGroup, field: string): boolean {
    return this.validacionesService.isValid(form, field) || false;
  }

  /**
   * Marca todos los campos del formulario como tocados si es inválido.
   */
  validarDestinatarioFormulario(): boolean {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.mostrarError = true;
      return false;
    }
    return true;
  }

  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   *
   * @param form Formulario reactivo.
   * @param campo Nombre del campo en el formulario.
   * @param metodoNombre Nombre del método en el almacén para actualizar el valor.
   */
  setValoresStore(
    form: FormGroup,
    campo: string,
    metodoNombre: keyof Tramite31803Store
  ): void {
    const VALOR = form.get(campo)?.value;
    (this.store[metodoNombre] as (value: unknown) => void)(VALOR);
  }

  /**
 * Habilita o deshabilita el formulario de acuerdo al modo de solo lectura.
 * 
 * Si el formulario está en modo solo lectura (`esFormularioSoloLectura` es `true`), 
 * deshabilita todos los campos del formulario para evitar modificaciones.
 * En caso contrario, habilita los campos para permitir la edición.
 */
  guardarDatosDelFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.registroForm.disable();
    } else {
      this.registroForm.enable();
    }
  }

/**
 * Inicializa el formulario reactivo `registroForm` con los valores actuales del estado de la solicitud.
 * 
 * Crea el formulario con los campos requeridos y sus validaciones, utilizando los valores actuales de `solicitudState`.
 * Al finalizar, llama a `inicializarEstadoFormulario()` para aplicar la configuración de solo lectura si corresponde.
 */
  donanteDomicilio(): void {
    this.registroForm = this.fb.group({
      numeroOficio: [{value : this.solicitudState?.numeroOficio, disabled: this.esFormularioSoloLectura}],
      claveReferencia: [{value: this.solicitudState?.claveReferencia, disabled: this.esFormularioSoloLectura}],
      cadenaDependencia: [{value: this.solicitudState?.cadenaDependencia, disabled: this.esFormularioSoloLectura}],
      importePago: [{value: this.solicitudState?.importePago, disabled: this.esFormularioSoloLectura}, [Validators.maxLength(16)]],
      fechaInicial: [{value: this.solicitudState?.fechaInicial, disabled: this.esFormularioSoloLectura}],
      fechaFinal: [{value: this.solicitudState?.fechaFinal, disabled: this.esFormularioSoloLectura}],
      banco: [{value: this.solicitudState?.banco, disabled: this.esFormularioSoloLectura}, [Validators.required]],
      llave: [{value: this.solicitudState?.llave, disabled: this.esFormularioSoloLectura}, [Validators.required, Validators.maxLength(20)]],
      manifiesto1: [{value: this.solicitudState?.manifiesto1, disabled: this.esFormularioSoloLectura}, [Validators.required]],
      manifiesto2: [{value: this.solicitudState?.manifiesto2, disabled: this.esFormularioSoloLectura}, [Validators.required]],
      numeroOperacion: [{value: this.solicitudState?.numeroOperacion, disabled: this.esFormularioSoloLectura}, [Validators.required, Validators.maxLength(30)]],
      fechaPago: [{value: this.solicitudState?.fechaPago, disabled: this.esFormularioSoloLectura}, [Validators.required]],
    });
  }

  /**
   * Borrar del formulario los datos de pago.
   * @returns {void}
   */
  borrarDatosPago(): void {
    this.registroForm.get('numeroOperacion')?.reset();
    this.registroForm.get('banco')?.reset();
    this.registroForm.get('llave')?.reset();
    this.registroForm.get('fechaPago')?.reset();

    this.setValoresStore(this.registroForm, 'numeroOperacion', 'setNumeroOperacion');
    this.setValoresStore(this.registroForm, 'banco', 'setBanco');
    this.setValoresStore(this.registroForm, 'llave', 'setLlave');
    this.setValoresStore(this.registroForm, 'fechaPago', 'setFechaPago');
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Cancela todas las suscripciones activas.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next(true);
    this.destroyNotifier$.complete();
  }
}