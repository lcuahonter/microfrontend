/**
 * Componente para gestionar el pago de derechos.
 * 
 * Métodos:
 * - ngOnInit: Inicializa el componente y configura las suscripciones necesarias.
 * - crearFormularioPagoDerechos: Crea y configura el formulario para el pago de derechos.
 * - cambioFechaFinal: Maneja el cambio de la fecha final en el formulario.
 * - onllavaDePagoChange: Maneja el cambio de la llave de pago en el formulario.
 * - setValoresStore: Actualiza un valor específico en el store.
 * - ngOnDestroy: Limpia las suscripciones cuando el componente se destruye.
 */
import { Component } from '@angular/core';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { InputFecha } from '@libs/shared/data-access-user/src';

import { map } from 'rxjs';

import { takeUntil } from 'rxjs';

import { FECHA } from '../../enum/fetcha.enum';

import { PermisoCitesService } from '../../services/permiso-cites.service';
import { Subject } from 'rxjs';

import { Solicitud230902State } from '../../estados/tramite230902.store';
import { Subscription } from 'rxjs';
import { Tramite230902Query } from '../../estados/tramite230902.query';
import { Tramite230902Store } from '../../estados/tramite230902.store';

@Component({
  selector: 'app-pago-de-derechos',
  templateUrl: './pago-de-derechos.component.html',
  styleUrls: ['./pago-de-derechos.component.scss'],
})
export class PagoDeDerechosComponent implements OnInit, OnDestroy {

  /**
   * Formulario para el pago de derechos.
   * Contiene los datos y validaciones del formulario de pago de derechos.
   * {FormGroup}
   */
  formPagoDerechos!: FormGroup;

  /**
   * Entrada de fecha final.
   * Configuración para el input de fecha final.
   * {InputFecha}
   */
  fechaFinalInput: InputFecha = FECHA;

  /**
   * Estado de la solicitud 230902.
   * Contiene el estado actual de la solicitud.
   * {Solicitud230902State}
   */
  solicitud230902State!: Solicitud230902State;

  /**
   * Notificador para destruir las suscripciones.
   * Se utiliza para cancelar suscripciones activas al destruir el componente.
   * {Subject<void>}
   */
  private destroyed$: Subject<void> = new Subject();

  /**
   * Indica si el formulario está en modo solo lectura.
   * Si es verdadero, los campos del formulario estarán deshabilitados para edición.
   * {boolean}
   */
  esFormularioSoloLectura: boolean = false; 

  /**
   * Suscripción general para manejar y limpiar las suscripciones del componente.
   * Se utiliza para evitar fugas de memoria.
   * {Subscription}
   */
  private subscription: Subscription = new Subscription();

  /**
   * @property {boolean} showError
   * @description
   * Indica si se debe mostrar un mensaje de error cuando la llave de pago contiene caracteres especiales.
   * Se establece a `true` cuando se detectan caracteres no alfanuméricos en el campo llave de pago.
   */
  showError: boolean = false;

  /**
   * @property {boolean} pagoError
   * @description
   * Indica si se debe mostrar un error de fecha cuando la fecha de pago ingresada es posterior a la fecha actual.
   * Se establece a `true` cuando el usuario ingresa una fecha futura en el campo de fecha de pago.
   */
  pagoError: boolean = false;

  /**
   * Constructor del componente.
   * Inicializa los servicios y dependencias necesarias para la gestión de datos y formularios.
   * permisoCitesService Servicio de permisos CITES.
   * tramite230902Store Almacén de trámites 230902.
   * tramite230902Query Consulta de trámites 230902.
   * formBuilder Constructor de formularios.
   * consultaioQuery Consulta de IO.
   */
  constructor(
    public permisoCitesService: PermisoCitesService,
    private tramite230902Store: Tramite230902Store,
    private tramite230902Query: Tramite230902Query,
    private formBuilder: FormBuilder,
    private consultaioQuery: ConsultaioQuery,
  ) {
     this.consultaioQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
       this.esFormularioSoloLectura = seccionState.readonly;
       this.inicializarEstadoFormulario();
      })
    )
    .subscribe()
  }

  /**
   * Inicializa el estado del formulario dependiendo si es solo lectura o editable.
   * Si es solo lectura, deshabilita los campos y ajusta la configuración de la fecha.
   */
  inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
      this.guardarDatosFormulario(); // Llama al método para cargar los datos del formulario
    } else {
      this.crearFormularioPagoDerechos();
    }
  }

  /**
   * Guarda los datos del formulario y ajusta el estado de solo lectura.
   * Deshabilita o habilita los campos y la fecha según corresponda.
   */
  guardarDatosFormulario(): void {
    this.crearFormularioPagoDerechos();
    if (this.esFormularioSoloLectura) {
      this.formPagoDerechos.disable();
    } else if (!this.esFormularioSoloLectura) {
      this.formPagoDerechos.enable();
    } else {
      // No se requiere ninguna acción en el formulario
    }
  }

  /**
   * Inicializa el componente.
   * Configura las suscripciones necesarias y prepara el formulario.
   */
  ngOnInit(): void {
    this.inicializarEstadoFormulario();
    this.permisoCitesService.inicializaPagoDeDerechosDatosCatalogos();
  }

  /**
   * Crea el formulario para el pago de derechos.
   * Configura los campos del formulario con validaciones y valores iniciales.
   */
  crearFormularioPagoDerechos(): void {
    this.tramite230902Query.selectSolicitud$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(state => { this.solicitud230902State = state });
    this.subscription.add(
      this.tramite230902Query.selectSolicitud$
        .pipe(
          takeUntil(this.destroyed$),
          map((seccionState) => {
            this.solicitud230902State = seccionState;
          })
        )
        .subscribe()
    );

    this.formPagoDerechos = this.formBuilder.group({
      claveDeReferencia: new FormControl(this.solicitud230902State.claveDeReferencia),
      cadenaPagoDependencia: new FormControl(this.solicitud230902State.cadenaPagoDependencia),
      banco: new FormControl(this.solicitud230902State.banco, Validators.required),
      llaveDePago: new FormControl(this.solicitud230902State.llaveDePago, [Validators.required, Validators.pattern('^[A-Za-z]{10}$')]),
      fecPago: new FormControl(this.solicitud230902State.fecPago, Validators.required),
      impPago: new FormControl({ value: this.solicitud230902State.impPago, disabled: true }),
    });

    this.formPagoDerechos.get('claveDeReferencia')?.disable();
    this.formPagoDerechos.get('cadenaPagoDependencia')?.disable();
    this.formPagoDerechos.get('impPago')?.disable();
  }

  /**
   * Maneja el cambio de la fecha final en el formulario.
   * Actualiza el valor de la fecha en el estado del formulario y en el almacén.
   * nuevo_valor El nuevo valor de la fecha final.
   */
  cambioFechaFinal(nuevo_valor: string): void {
    this.formPagoDerechos.patchValue({
      fecPago: nuevo_valor,
    });
    this.tramite230902Store.setfecPago(
      this.formPagoDerechos.get('fecPago')?.value
    );
    const FECHA_ACTUAL = new Date();
    const [DIA, MES, ANIO] = nuevo_valor.split('/').map(Number);
    const FECHA_INGRESADA = new Date(ANIO, MES - 1, DIA);
    this.pagoError = FECHA_INGRESADA > FECHA_ACTUAL;
  }

  /**
   * Maneja el cambio de la llave de pago en el formulario.
   * Actualiza la llave de pago en el almacén, convirtiéndola a mayúsculas.
   */
  onllavaDePagoChange(): void {
    const CAPITALIZED_VALUE = this.formPagoDerechos
      .get('llaveDePago')
      ?.value.toUpperCase();
    this.formPagoDerechos.get('llaveDePago')?.setValue(CAPITALIZED_VALUE);
    const HASSPECIALCHAR = /[^A-Za-z0-9]/.test(CAPITALIZED_VALUE);
    this.showError = HASSPECIALCHAR;
  }

  /**
   * Método setValoresStore
   * Descripción: Actualiza un valor específico en el store utilizando el método correspondiente.
   * form Formulario reactivo que contiene los datos.
   * campo Nombre del campo cuyo valor se actualizará en el store.
   */
  setValoresStore(form: FormGroup, campo: string): void {
    const VALOR = form.get(campo)?.value;
    this.tramite230902Store.establecerDatos({ [campo]: VALOR });
  }
  /**
   * @method validarFormulario
   * @description
   * Valida el formulario de pago de derechos.
   * Verifica que todos los campos requeridos del formulario sean válidos antes de permitir el envío o avance.
   * Si el formulario es válido, retorna `true`.
   * Si el formulario es inválido, marca todos los controles como "tocados" para mostrar los errores de validación y retorna `false`.
   * 
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  validarFormulario(): boolean {
    if (this.formPagoDerechos.valid) {
      return true;
    }
    this.formPagoDerechos.markAllAsTouched();
    return false
  }

  /**
   * Limpia las suscripciones cuando el componente se destruye.
   * Evita fugas de memoria al completar el Subject.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}