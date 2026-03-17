import { ANO_CATALOGO, FECHA_ACUSE, FECHA_FRANJO, FECHA_INICIAL, FECHA_PAGO, RADIO_PARCIAL, RADIO_RESIDENTE, RADIO_TIPO_SOLICITUDE, RADIO_VEHICULO } from '../constantes/aviso32514.enum';
import { Catalogo, CatalogoSelectComponent, ConsultaioQuery, InputFecha, InputFechaComponent, InputRadioComponent, NotificacionesComponent, SoloAlfabetosDirective, SoloLetrasNumerosDirective, SoloNumerosDirective, TituloComponent } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy, OnInit, forwardRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReplaySubject, map, takeUntil } from 'rxjs';
import { Solicitud32514State, Tramite32514Store } from '../state/Tramite32514.store';
import { AdaceService } from '../services/aviso-retorno.service';
import { CommonModule } from '@angular/common';
import { Tramite32514Query } from '../state/Tramite32514.query';
/**
 * Componente que representa el aviso dentro del trámite 32514.
 * Este componente gestiona la lógica y la interfaz de usuario para capturar y mostrar
 * los datos relacionados con el aviso, incluyendo formularios, catálogos y notificaciones.
 */
@Component({
  selector: 'app-aviso-retorno',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TituloComponent,
    InputRadioComponent,
    CatalogoSelectComponent,
    InputFechaComponent,
    NotificacionesComponent,
    forwardRef(() => SoloNumerosDirective),
    forwardRef(() => SoloLetrasNumerosDirective),
    forwardRef(() => SoloAlfabetosDirective),
  ],
  providers: [AdaceService],
  templateUrl: './aviso-retorno.component.html',
  styleUrl: './aviso-retorno.component.scss',
})
export class AvisoRetornoComponent implements OnInit, OnDestroy {
  /**
   * Observable para gestionar la destrucción del componente.
   */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Formulario reactivo para gestionar los datos del aviso.
   */
  avisoForm!: FormGroup;

  /**
   * Opciones para los radios relacionados con el aprovechamiento.
   */
  radioOpcions = RADIO_RESIDENTE;

  /**
   * Opciones para el radio relacionado con la disminución parcial.
   */
  radioParcial = RADIO_PARCIAL;

  /**
   * Opciones para el radio relacionado con la disminución total.
   */
  radioTotal = RADIO_TIPO_SOLICITUDE;

  /**
   * Configuración para la fecha inicial del dictamen.
   */
  fechaInitialInput: InputFecha = FECHA_INICIAL;

  /**
   * Configuración para la fecha de pago.
   */
  fechaPagoInput: InputFecha = FECHA_PAGO;


  /**
   * Configuración para el catálogo de años.
   */
  public anoCatalogo = ANO_CATALOGO;

  /**
   * Configuración para el catálogo de meses.
   */
  public fechaFranjo = FECHA_FRANJO;

  public fechaAcuseRecibo = FECHA_ACUSE;

  /**
   * Configuración para el catálogo de meses.
   */
  public fetchVehiculo = RADIO_VEHICULO;

  /**
   * Estado actual de la solicitud.
   */
  public solicitudState!: Solicitud32514State;

  /**
   * Observable que indica si el formulario está en modo solo lectura.
   * Cuando es `true`, el formulario no permite modificaciones por parte del usuario.
   *
   * @type {boolean}
   */
  esFormularioSoloLectura!: boolean;

  mostrarError: boolean = false;

  /**
   * Constructor del componente que inyecta los servicios necesarios para la gestión del formulario
   * del trámite 32514, incluyendo creación de formularios, acceso al estado del trámite y consulta general.
   *
   * @param {AdaceService} adace - Servicio para operaciones relacionadas con ADACE.
   * @param {FormBuilder} fb - Utilidad de Angular para construir formularios reactivos.
   * @param {Tramite32514Store} store - Store que gestiona el estado del trámite 32514.
   * @param {Tramite32514Query} query - Servicio para consultar el estado del trámite 32514.
   * @param {ConsultaioQuery} consultaQuery - Servicio para consultar el estado general de la solicitud.
   */
  constructor(
    private adace: AdaceService,
    public fb: FormBuilder,
    private store: Tramite32514Store,
    private query: Tramite32514Query,
    private consultaQuery: ConsultaioQuery
  ) {}

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Configura el formulario, obtiene datos iniciales y suscribe al estado global.
   */
  ngOnInit(): void {
    this.query.selectSolicitud$
      .pipe(
        takeUntil(this.destroyed$),
        map((seccionState) => {
          this.solicitudState = seccionState;
        })
      )
      .subscribe();
    this.donanteDomicilio();
    this.obtenerDatosAnoPeriodo();

    this.consultaQuery.selectConsultaioState$
    .pipe(
      takeUntil(this.destroyed$),
      map((seccionState) => {
        if(!seccionState.create && seccionState.procedureId === '32514') {
          this.esFormularioSoloLectura = seccionState.readonly;
        } else {
          this.esFormularioSoloLectura = false;
        }
        this.inicializarEstadoFormulario();
      })
    ).subscribe();
  }

   /**
   * Evalúa si se debe inicializar o cargar datos en el formulario.
   */
   inicializarEstadoFormulario(): void {
    if (this.esFormularioSoloLectura) {
        this.avisoForm.disable();
    } else {
      this.avisoForm.enable();
    }
  }

  /**
   * Obtiene los datos del catálogo de años.
   */
  obtenerDatosAnoPeriodo(): void {
    this.adace
      .obtenerDatosAno()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.anoCatalogo.catalogos = resp as Catalogo[];
      });
  }


  /**
   * Valida el formulario y marca todos los campos como tocados si es inválido.
   */
  validarDestinatarioFormulario(): void {
    if (this.avisoForm.invalid) {
      this.avisoForm.markAllAsTouched();
    }
  }



  /**
   * Actualiza un valor en el estado global utilizando el almacén.
   * @param campo Nombre del campo a actualizar.
   */
  setValoresStore(
    campo: string
  ): void {
    const VALOR = this.avisoForm.get(campo)?.value;
    this.store.setEstado(campo, VALOR);
  }

  pamaRadioOption() : void {
    const DECLARA = this.avisoForm.get('declara')?.value;
    if(DECLARA === 'si') {
      this.mostrarError = true;
      this.avisoForm.get('declara')?.setValue('null');
      this.setValoresStore('declara');
    }
    else if(DECLARA === 'no') {
      this.mostrarError = false;
      this.setValoresStore('declara')
    }
  }

  /**
   * Configura el formulario con los valores iniciales del estado.
   */
  donanteDomicilio(): void {
    this.avisoForm = this.fb.group({

      residenteNacExt: ['', Validators.required],
      tipoSolicitude:  ['', Validators.required],
      numeroVehiculo:['', Validators.required],
      numeroPermiso: ['', [Validators.required, Validators.maxLength(50)]],
      fechaEmision: ['', Validators.required],
      fechaVencimiento:['', Validators.required],
      numeroPedimento:['', [Validators.required, Validators.maxLength(15)]],
      fechaPedimento:['', [Validators.required, Validators.maxLength(10)]],
      avisoNacExt: ['', Validators.required],
      fechaAcuse:['', Validators.required],
      conformidad: ['', Validators.required],


      marca:  ['', [Validators.required, Validators.maxLength(50)]],
      tipo:  ['', [Validators.required, Validators.maxLength(50)]],
      modelo:  ['', [Validators.required, Validators.maxLength(50)]],
      niv:  ['', [Validators.required, Validators.maxLength(50)]],
      numeroDePlacas:  ['', [Validators.required, Validators.maxLength(50)]],
      estadoPlacas:  ['', [Validators.required, Validators.maxLength(50)]],

      declara: ['', [Validators.required]],
      tipoVehiculo:['', [Validators.required]],
      especifique: ['', [Validators.required]],
      numeroSerie: ['', [Validators.required, Validators.maxLength(50)]],

      numeroFranja: ['', Validators.required],
      fechaFranja: ['', Validators.required]
     
    });
    this.query.selectSolicitud$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(res => {
      this.avisoForm.patchValue(res)
    });
  }

  /**
   * Método del ciclo de vida de Angular que se ejecuta al destruir el componente.
   * Completa el observable `destroyed$` para evitar fugas de memoria.
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}