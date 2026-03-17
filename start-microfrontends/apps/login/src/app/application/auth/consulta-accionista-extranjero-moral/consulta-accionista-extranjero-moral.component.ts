import { AccionistaStore, AccionistaStoreService } from '../../../estados/accionista.store';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Notificacion, NotificacionesComponent } from '@libs/shared/data-access-user/src';
import { Subject, catchError, map, of, takeUntil } from 'rxjs';
import { AccionistaDatosQuery } from '../../../queries/accionista.query';
import { CommonModule } from '@angular/common';
import { ConsultaSocioExtranjero } from '../../core/models/consulta-socio-extranjero.model';
import { Router } from '@angular/router';
import { UsuariosService } from '../../core/service/usuarios.service';

/**
 * Componente para consultar y mostrar información de un accionista extranjero persona moral.
 * Permite visualizar y confirmar los datos de un socio extranjero moral, así como guardar la información.
 */
@Component({
  selector: 'app-consulta-accionista-extranjero-moral',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './consulta-accionista-extranjero-moral.component.html',
  styleUrl: './consulta-accionista-extranjero-moral.component.scss',
})
export class ConsultaAccionistaExtranjeroMoralComponent implements OnInit {
  /** Formulario reactivo para la consulta del socio extranjero moral */
  public formConsultaSocioExtranjero!: FormGroup;
  /** Estado consultado del accionista extranjero */
  public accionistaExtranjeroConsultado?: AccionistaStore;
  /** Notificador para destruir suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Objeto con los datos del socio extranjero moral */
  public socioExtranjero!: ConsultaSocioExtranjero;
  /** Listado de socios extranjeros morales */
  public listadoSociosExtranjero: ConsultaSocioExtranjero[] = [];
  /** Indica si los datos han sido registrados */
  public registrarDatos: boolean = false;
  /** Notificación para mostrar mensajes al usuario */
  public nuevaNotificacion!: Notificacion;

  /**
   * Constructor del componente.
   * @param fb FormBuilder para crear formularios reactivos.
   * @param router Router de Angular para navegación.
   * @param busquedaQuery Query para obtener datos del accionista.
   * @param accionistaStore Servicio para manipular el estado de accionistas.
   * @param servicioUsuario Servicio para operaciones de usuario.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private busquedaQuery: AccionistaDatosQuery,
    private accionistaStore: AccionistaStoreService,
    private servicioUsuario: UsuariosService
  ) { }

  /**
   * Inicializa el componente, suscribe a los cambios de estado y llena el formulario con los datos del socio extranjero moral.
   */
  ngOnInit(): void {
    this.busquedaQuery.selectSolicitud$
      .pipe(
        map((seccionState) => {
          this.accionistaExtranjeroConsultado = seccionState;
        }),
        takeUntil(this.destroyNotifier$)
      )
      .subscribe();
    this.socioExtranjero = this.accionistaExtranjeroConsultado?.accionistaExtranjeroMoral || {} as ConsultaSocioExtranjero;
    this.listadoSociosExtranjero = this.accionistaExtranjeroConsultado?.listaAccionistasExtranjerosMoral || [];
    this.crearFormSocioAccionista();
    this.llenarCamposSocioAccionista();
  }

  /**
   * Crea el formulario reactivo para el socio extranjero moral.
   */
  crearFormSocioAccionista(): void {
    this.formConsultaSocioExtranjero = this.fb.group({
      razonSocial: [{ value: '', disabled: true }],
      pais: [{ value: '', disabled: true }],
      codigoPostal: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      calle: [{ value: '' }],
      numeroInterior: [{ value: '' }],
      numeroExterior: [{ value: '' }]
    });
  }

  /**
   * Llena los campos del formulario con los datos del socio extranjero moral consultado.
   */
  llenarCamposSocioAccionista(): void {
    if (this.accionistaExtranjeroConsultado) {
      this.formConsultaSocioExtranjero.get('razonSocial')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.razonSocial);
      this.formConsultaSocioExtranjero.get('pais')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.pais);
      this.formConsultaSocioExtranjero.get('codigoPostal')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.codigoPostal);
      this.formConsultaSocioExtranjero.get('estado')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.estado);
      this.formConsultaSocioExtranjero.get('calle')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.calle);
      this.formConsultaSocioExtranjero.get('numeroInterior')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.numeroInterior);
      this.formConsultaSocioExtranjero.get('numeroExterior')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroMoral.numeroExterior);
    }
  }

  /**
   * Confirma y guarda los datos del socio extranjero persona moral.
   * Si el formulario es válido, guarda el socio y actualiza el estado, mostrando notificaciones según el resultado.
   */
  confirmarSocioExtranjeroMoral(): void {
    if (this.formConsultaSocioExtranjero.invalid) {
      this.formConsultaSocioExtranjero.markAllAsTouched();
      return;
    }
    const DATOS: ConsultaSocioExtranjero = {
      ...this.formConsultaSocioExtranjero.getRawValue()
    };

    this.servicioUsuario.guardarSocioExtranjeroMoral(DATOS)
      .pipe(
        map((succes) => {
          if (succes) {
            if (this.listadoSociosExtranjero.length === 0) {
              this.listadoSociosExtranjero = [];
            }
            this.listadoSociosExtranjero.push(this.socioExtranjero);
            this.accionistaStore.setListaSociosExtrajero(this.listadoSociosExtranjero);
            this.accionistaStore.setRegistraDatosExtranjero(this.registrarDatos = true);
            this.router.navigate(['login/registro-socio-accionista']);
          }
          else {
            this.nuevaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: 'Error',
              mensaje: 'El registro no se puedo guardar correctamente.',
              cerrar: true,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
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

  cancelarGuardado(): void {
    this.router.navigate(['login/registro-socio-accionista']);
  }
}