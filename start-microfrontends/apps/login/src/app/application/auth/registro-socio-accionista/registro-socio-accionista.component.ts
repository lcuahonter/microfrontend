import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AccionistaStore, AccionistaStoreService } from '../../../estados/accionista.store';
import { CONFIGURACION_ENCABEZADO_SOCIO, CONFIGURACION_ENCABEZADO_SOCIO_EXTRANJERO } from '../../core/constantes/socio-accionista.enum';
import { Catalogo, CatalogoSelectComponent, Notificacion, NotificacionesComponent, REGEX_RFC_FISICA, REGEX_RFC_MORAL, TablaDinamicaComponent, TablaSeleccion } from '@libs/shared/data-access-user/src';
import { Component, OnDestroy } from '@angular/core';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { AccionistaDatosQuery } from '../../../queries/accionista.query';
import { CommonModule } from '@angular/common';
import { ConsultaSocioExtranjero } from '../../core/models/consulta-socio-extranjero.model';
import { ConsultaSocioNacional } from '../../core/models/consulta-socio-nacional.model';
import { Nacionalidad } from '../../core/enums/nacionalidad.enum';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoPersona } from '../../core/enums/tipo-persona.enum';
import { UsuariosService } from '../../core/service/usuarios.service';
import data from '@libs/shared/theme/assets/json/login/cat-pais.json';

/**
 * Componente responsable del registro de socios accionistas, tanto nacionales como extranjeros (persona física o moral).
 * Incluye lógica para validaciones condicionales, consultas y navegación según el tipo de persona y nacionalidad.
 */
@Component({
  selector: 'app-registro-socio-accionista',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaDinamicaComponent, CatalogoSelectComponent, NotificacionesComponent],
  templateUrl: './registro-socio-accionista.component.html',
  styleUrl: './registro-socio-accionista.component.scss',
})
export class RegistroSocioAccionistaComponent implements OnInit, OnDestroy {

  /** Formulario principal del componente */
  FormSocioAccionista!: FormGroup;

  /** Enumeración para controlar la selección de filas en tablas */
  tablaSeleccion = TablaSeleccion;

  /** Catálogo de países disponible para el usuario */
  catPais!: Catalogo[];

  /** Configuración del encabezado de tabla para socios nacionales */
  encabezadoDeTablaAccionista = CONFIGURACION_ENCABEZADO_SOCIO;

  /** Configuración del encabezado de tabla para socios extranjeros */
  encabezadoDeTablaAccionistaExtranjero = CONFIGURACION_ENCABEZADO_SOCIO_EXTRANJERO;

  /** Lista de socios accionistas nacionales */
  public listaSociosAccionistas: ConsultaSocioNacional[] = [];

  /** Lista de socios accionistas extranjeros */
  public listaSociosAccionistasExtranjeros: ConsultaSocioExtranjero[] = [];

  /** Socios nacionales seleccionados */
  public socioAccionistaSeleccionado: ConsultaSocioNacional[] = [];

  /** Socios extranjeros seleccionados */
  public socioAccionistaExtranjerosSeleccionado: ConsultaSocioExtranjero[] = [];

  /** Subject utilizado para destruir subscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();

  /** Datos del socio nacional consultado */
  socioNacional?: ConsultaSocioNacional;

  /** Datos del socio extranjero físico consultado */
  socioExtranjero?: ConsultaSocioExtranjero;

  /** Datos del socio extranjero moral consultado */
  socioExtranjeroMoral?: ConsultaSocioExtranjero;

  /** Controla si se debe visualizar la tabla */
  public visualizarTabla: boolean = false;

  /** Estado inicial del store de accionistas */
  public accionistaInicialStore!: AccionistaStore;

  /** Notificación para mostrar mensajes al usuario.*/
  public nuevaNotificacion!: Notificacion;

  /** Enums para nacionalidad */
  public Nacionalidad = Nacionalidad;

  /** Enums para tipo de persona */
  public TipoPersona = TipoPersona;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private busquedaQuery: AccionistaDatosQuery,
    private accionistaStore: AccionistaStoreService
  ) {
    this.FormSocioAccionista = this.fb.group({
      tipoNacionalidad: [Nacionalidad.Nacional], /** Inicializado como "sí" */
      personaNacional: [TipoPersona.Fisica],/** Inicializado como "Persona Física" */
      rfc: ['', [RegistroSocioAccionistaComponent.validadorRFC]],
      nombre: [''],
      apellidoPaterno: [''],
      pais: [''],
      codigoPostal: [''],
      estado: [''],
      razonSocial: ['']
    });
  }

  /**
   * Inicializa el componente, obtiene catálogos, estado inicial y configura validaciones dinámicas.
   */
  ngOnInit(): void {
    this.catPais = data;
    this.busquedaQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.accionistaInicialStore = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.FormSocioAccionista.get('tipoNacionalidad')?.valueChanges.subscribe(() => {
      this.actualizarValidaciones();
    });
    this.FormSocioAccionista.get('personaNacional')?.valueChanges.subscribe(() => {
      this.actualizarValidaciones();
    });
    this.actualizarValidaciones();
    this.listaSociosAccionistas = this.accionistaInicialStore.listaAccionistasNacionales;
    this.listaSociosAccionistasExtranjeros = this.accionistaInicialStore.listaAccionistasExtranjeros;
  }

  /** Getter para el campo tipoNacionalidad del formulario */
  get tipoNacionalidad(): Nacionalidad {
    return this.FormSocioAccionista.get('tipoNacionalidad')?.value;
  }

  /** Getter para el campo personaNacional del formulario */
  get personaNacional(): void | string {
    return this.FormSocioAccionista.get('personaNacional')?.value;
  }

  /**
   * Validador estático para validar RFC (persona física o moral).
   * @param control - Campo a validar
   * @returns Error de validación o null si es válido
   */
  static validadorRFC(control: AbstractControl): ValidationErrors | null {
    const VALUE = control.value;
    if (!VALUE) {
      return null;
    }
    const ES_VALIDO = REGEX_RFC_FISICA.test(VALUE) || REGEX_RFC_MORAL.test(VALUE);
    return ES_VALIDO ? null : { rfcInvalido: true };
  }

  /**
   * Lógica para agregar un socio accionista nacional o extranjero según tipo.
   */
  agregarSocioAccionista(): void {
    const NACIONALIDAD = this.tipoNacionalidad;
    const PERSONA = this.personaNacional;
    if (NACIONALIDAD === Nacionalidad.Nacional) {
      const RFC = this.FormSocioAccionista.get('rfc')?.value;
      this.usuariosService.consultaSocioNacional(RFC)
        .pipe(
          map((data) => {
            if (data) {
              this.socioNacional = data;
              this.accionistaStore.setsocioAccionistaNacional(this.socioNacional);
              this.router.navigate(['login/consulta-socio-accionista']);
            } else {
              this.nuevaNotificacion = {
                tipoNotificacion: 'alert',
                categoria: 'danger',
                modo: 'action',
                titulo: 'Alerta',
                mensaje: 'No se encontró un socio accionista con el RFC proporcionado.',
                cerrar: false,
                tiempoDeEspera: 2000,
                txtBtnAceptar: 'Aceptar',
                txtBtnCancelar: '',
              };
              console.error('No se encontró un socio accionista con el RFC proporcionado.');
            }
          }),
          catchError((error) => {
            console.error('Error al consultar capturista:', error);
            return of(undefined);
          }),
          takeUntil(this.destroyNotifier$)
        )
        .subscribe();
    }
    else {
      if (PERSONA === TipoPersona.Fisica) {
        const NOMBRE = this.FormSocioAccionista.get('nombre')?.value;
        const APELLIDOPATERNO = this.FormSocioAccionista.get('apellidoPaterno')?.value;
        const PAIS = this.FormSocioAccionista.get('pais')?.value;
        const CODIGOPOSTAL = this.FormSocioAccionista.get('codigoPostal')?.value;
        const ESTADO = this.FormSocioAccionista.get('estado')?.value;
        this.usuariosService.consultaSocioExtranjeroFisica(NOMBRE, APELLIDOPATERNO, PAIS, CODIGOPOSTAL, ESTADO)
          .pipe(
            map((data) => {
              if (data) {
                this.socioExtranjero = data;
                this.accionistaStore.setsocioAccionistaExtranjero(this.socioExtranjero);
                this.router.navigate(['login/consulta-accionista-extranjero-fisica']);
              } else {
                this.nuevaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: 'danger',
                  modo: 'action',
                  titulo: 'Alerta',
                  mensaje: 'No se encontró un socio nacional con el nombre proporcionado.',
                  cerrar: false,
                  tiempoDeEspera: 2000,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: '',
                };
                console.error('No se encontró un socio nacional con el nombre proporcionado.');
              }
            }),
            catchError((error) => {
              console.error('Error al consultar socio nacional:', error);
              return of(undefined);
            }),
            takeUntil(this.destroyNotifier$)
          )
          .subscribe();
      } else if (PERSONA === TipoPersona.Moral) {
        const RAZONSOCIAL = this.FormSocioAccionista.get('razonSocial')?.value;
        const PAIS = this.FormSocioAccionista.get('pais')?.value;
        const CODIGOPOSTAL = this.FormSocioAccionista.get('codigoPostal')?.value;
        const ESTADO = this.FormSocioAccionista.get('estado')?.value;
        this.usuariosService.consultaSocioExtranjerMoral(RAZONSOCIAL, PAIS, CODIGOPOSTAL, ESTADO)
          .pipe(
            map((data) => {
              if (data) {
                this.socioExtranjeroMoral = data;
                this.accionistaStore.setsocioAccionistaExtranjeroMoral(this.socioExtranjeroMoral);
                this.router.navigate(['login/consulta-accionista-extranjero-moral']);
              } else {
                this.nuevaNotificacion = {
                  tipoNotificacion: 'alert',
                  categoria: 'danger',
                  modo: 'action',
                  titulo: 'Alerta',
                  mensaje: 'No se encontró un socio nacional con la razón social proporcionada.',
                  cerrar: false,
                  tiempoDeEspera: 2000,
                  txtBtnAceptar: 'Aceptar',
                  txtBtnCancelar: '',
                };
                console.error('No se encontró un socio nacional con la razón social proporcionada.');
              }
            }),
            catchError((error) => {
              console.error('Error al consultar socio nacional:', error);
              return of(undefined);
            }),
            takeUntil(this.destroyNotifier$)
          )
          .subscribe();
      }
    }

  }

  /**
   * Elimina subscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this.destroyNotifier$.next();
    this.destroyNotifier$.complete();
  }

  /**
   * Aplica reglas de validación dinámica a los campos del formulario según el tipo de persona y nacionalidad.
   */
  actualizarValidaciones(): void {
    const NACIONALIDAD = this.tipoNacionalidad;
    const PERSONA = this.personaNacional;
    const RFC = this.FormSocioAccionista.get('rfc');
    const NOMBRE = this.FormSocioAccionista.get('nombre');
    const APELLIDOPATERNO = this.FormSocioAccionista.get('apellidoPaterno');
    const PAIS = this.FormSocioAccionista.get('pais');
    const CODIGOPOSTAL = this.FormSocioAccionista.get('codigoPostal');
    const ESTADO = this.FormSocioAccionista.get('estado');
    const RAZONSOCIAL = this.FormSocioAccionista.get('razonSocial');

    RFC?.clearValidators();
    NOMBRE?.clearValidators();
    APELLIDOPATERNO?.clearValidators();
    PAIS?.clearValidators();
    CODIGOPOSTAL?.clearValidators();
    ESTADO?.clearValidators();
    RAZONSOCIAL?.clearValidators();

    if (NACIONALIDAD === Nacionalidad.Nacional) {
      RFC?.setValidators([RegistroSocioAccionistaComponent.validadorRFC, Validators.required]);
    } else {
      PAIS?.setValidators([Validators.required]);
      CODIGOPOSTAL?.setValidators([Validators.required]);
      ESTADO?.setValidators([Validators.required]);

      if (PERSONA === TipoPersona.Fisica) {
        NOMBRE?.setValidators([Validators.required]);
        APELLIDOPATERNO?.setValidators([Validators.required]);
      } else if (PERSONA === TipoPersona.Moral) {
        RAZONSOCIAL?.setValidators([Validators.required]);
      }
    }
    RFC?.updateValueAndValidity();
    NOMBRE?.updateValueAndValidity();
    APELLIDOPATERNO?.updateValueAndValidity();
    PAIS?.updateValueAndValidity();
    CODIGOPOSTAL?.updateValueAndValidity();
    ESTADO?.updateValueAndValidity();
    RAZONSOCIAL?.updateValueAndValidity();
  }

  /**
   * Navega hacia la vista de firma electrónica.
   */
  enviarFirma(): void {
    if (this.listaSociosAccionistasExtranjeros.length > 0) {
      this.router.navigate(['login/firma-electronica']);
    }
    else {
      this.nuevaNotificacion = {
        tipoNotificacion: 'alert',
        categoria: 'danger',
        modo: 'action',
        titulo: 'Alerta',
        mensaje: 'No hay accionistas para enviar a firmar.',
        cerrar: false,
        tiempoDeEspera: 2000,
        txtBtnAceptar: 'Aceptar',
        txtBtnCancelar: '',
      };
    }
  }

  /**
   * Elimina los elementos seleccionados en ambas listas (nacional y extranjero).
   */
  eliminarSeleccionados(): void {
    this.socioAccionistaSeleccionado.forEach((socio) => {
      const INDEX = this.listaSociosAccionistas.indexOf(socio);
      if (INDEX > -1) {
        this.listaSociosAccionistas.splice(INDEX, 1);
      }
    });
    this.listaSociosAccionistasExtranjeros.forEach((socio) => {
      const INDEX = this.listaSociosAccionistasExtranjeros.indexOf(socio);
      if (INDEX > -1) {
        this.listaSociosAccionistasExtranjeros.splice(INDEX, 1);
      }
    });
    this.socioAccionistaSeleccionado = [];
    this.socioAccionistaExtranjerosSeleccionado = [];
  }

}
