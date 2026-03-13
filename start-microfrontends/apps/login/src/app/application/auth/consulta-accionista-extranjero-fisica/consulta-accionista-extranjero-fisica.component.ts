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
 * Componente para consultar y mostrar información de un accionista extranjero persona física.
 * Permite visualizar y confirmar los datos de un socio extranjero, así como guardar la información.
 */
@Component({
  selector: 'app-consulta-accionista-extranjero-fisica',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './consulta-accionista-extranjero-fisica.component.html',
  styleUrl: './consulta-accionista-extranjero-fisica.component.scss',
})
export class ConsultaAccionistaExtranjeroFisicaComponent implements OnInit {
  /** Formulario reactivo para la consulta del socio extranjero */
  public formConsultaSocioExtranjero!: FormGroup;
  /** Estado consultado del accionista extranjero */
  public accionistaExtranjeroConsultado?: AccionistaStore;
  /** Notificador para destruir suscripciones al destruir el componente */
  private destroyNotifier$: Subject<void> = new Subject();
  /** Objeto con los datos del socio extranjero */
  public socioExtranjero!: ConsultaSocioExtranjero;
  /** Listado de socios extranjeros */
  public listadoSociosExtranjero: ConsultaSocioExtranjero[] = [];
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
   * Inicializa el componente, suscribe a los cambios de estado y llena el formulario con los datos del socio extranjero.
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
    this.socioExtranjero = this.accionistaExtranjeroConsultado?.accionistaExtranjeroFisica || {} as ConsultaSocioExtranjero;
    this.listadoSociosExtranjero = this.accionistaExtranjeroConsultado?.listaAccionistasExtranjeros || [];
    this.crearFormSocioAccionista();
    this.llenarCamposSocioAccionista();
  }

  /**
   * Crea el formulario reactivo para el socio extranjero.
   */
  crearFormSocioAccionista(): void {
    this.formConsultaSocioExtranjero = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '' }],
      pais: [{ value: '', disabled: true }],
      codigoPostal: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      razonSocial: [{ value: '' }],
      calle: [{ value: '' }],
      numeroInterior: [{ value: '' }],
      numeroExterior: [{ value: '' }],
      numeroSeguroSocial: [{ value: '' }],
      numeroIdentificacionFiscal: [{ value: '' }]
    });
  }

  /**
   * Llena los campos del formulario con los datos del socio extranjero consultado.
   */
  llenarCamposSocioAccionista(): void {
    if (this.accionistaExtranjeroConsultado) {
      this.formConsultaSocioExtranjero.get('nombre')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.nombre);
      this.formConsultaSocioExtranjero.get('apellidoPaterno')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.apellidoPaterno);
      this.formConsultaSocioExtranjero.get('apellidoMaterno')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.apellidoMaterno);
      this.formConsultaSocioExtranjero.get('pais')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.pais);
      this.formConsultaSocioExtranjero.get('codigoPostal')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.codigoPostal);
      this.formConsultaSocioExtranjero.get('estado')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.estado);
      this.formConsultaSocioExtranjero.get('razonSocial')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.razonSocial);
      this.formConsultaSocioExtranjero.get('calle')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.calle);
      this.formConsultaSocioExtranjero.get('numeroInterior')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.numeroInterior);
      this.formConsultaSocioExtranjero.get('numeroExterior')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.numeroExterior);
      this.formConsultaSocioExtranjero.get('numeroSeguroSocial')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.numeroSeguroSocial);
      this.formConsultaSocioExtranjero.get('numeroIdentificacionFiscal')?.setValue(this.accionistaExtranjeroConsultado.accionistaExtranjeroFisica.numeroIdentificacionFiscal);
    }
  }

  /**
   * Confirma y guarda los datos del socio extranjero persona física.
   * Si el formulario es válido, guarda el socio y actualiza el estado, mostrando notificaciones según el resultado.
   */
  confirmarExtranjeroFisica() : void {
    if (this.formConsultaSocioExtranjero.invalid) {
      this.formConsultaSocioExtranjero.markAllAsTouched();
      return;
    }
    const DATOS: ConsultaSocioExtranjero = {
      ...this.formConsultaSocioExtranjero.getRawValue()
    };
    this.servicioUsuario.guardarSocioExtranjero(DATOS)
      .pipe(
        map((succes) => {
          if (succes) {
            if (this.listadoSociosExtranjero.length === 0) {
              this.listadoSociosExtranjero = [];
            }
            this.listadoSociosExtranjero.push(this.socioExtranjero);
            this.accionistaStore.setListaSociosExtrajero(this.listadoSociosExtranjero);
            this.accionistaStore.setRegistraDatosExtranjero(true);
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

  /**
   * Método que se ejecuta al cancelar el guardado del socio accionista.
   * Navega a la página de registro de socio accionista.
   */
  cancelarGuardado(): void {
    this.router.navigate(['login/registro-socio-accionista']);
  }
}