import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EmailData } from '../../core/models/response-email.model';
import { EmailModifyService } from '../../core/service/respuesta-modificacion-correo.service';
import { Notificacion} from '@libs/shared/data-access-user/src';
import { NotificacionesComponent } from "@libs/shared/data-access-user/src/tramites/components/notificaciones/notificaciones.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ng-mf-modificar-correo-electronico',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NotificacionesComponent],
  templateUrl: './modificar-correo-electronico.component.html',
  styleUrl: './modificar-correo-electronico.component.scss'
})
export class ModificarCorreoElectronicoComponent implements OnInit, OnDestroy {
  /** Formulario de correo electrónico */
  public emailForm!: FormGroup;
    
  /** Notificación para mostrar estados y errores */
  public nuevaAlertaNotificacion: Notificacion | null = null;
  
  /** Subject para manejar la limpieza de suscripciones */
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly emailService: EmailModifyService,
    private readonly toastr: ToastrService
  ) {}

  /** Inicializa el componente */
  public ngOnInit(): void {
    this.inicializarFormulario();
  }

  /** Limpia las suscripciones al destruir el componente */
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Maneja el envío del formulario */
  public onSubmit(): void {
    if (!this.emailForm.valid) {
      return;
    }
    
    const EMAILDATA: EmailData = {
      currentEmail: this.emailForm.get('currentEmail')?.value,
      newEmail: this.emailForm.get('newEmail')?.value
    };

    this.emailService.actualizarEmail(EMAILDATA)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if (response.codigo > 0) {
            this.nuevaAlertaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'success',
              modo: 'action',
              titulo: '',
              mensaje: 'Los correos electrónicos se modificaron correctamente.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            }
            this.emailForm.reset();
          } else {
            this.nuevaAlertaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: 'Los correos electrónicos se modificaron correctamente.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
          }
        },
        error: (error) => {
          this.nuevaAlertaNotificacion = {
              tipoNotificacion: 'alert',
              categoria: 'error',
              modo: 'action',
              titulo: '',
              mensaje: error.error?.mensaje || 'Error al actualizar el correo electrónico. Por favor, intente nuevamente.',
              cerrar: false,
              tiempoDeEspera: 2000,
              txtBtnAceptar: 'Aceptar',
              txtBtnCancelar: '',
            };
        }
      });
  }

  /** Inicializa el formulario con validaciones */
  private inicializarFormulario(): void {
    this.emailForm = this.fb.group({
      currentEmail: ['vucem2.5@hotmail.com', [Validators.required, Validators.email]],
      newEmail: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
       ]],
      confirmEmail: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]]
    }, { validators: this.validarEmailsIguales });
  }

  /** Valida que los correos electrónicos coincidan */
  private validarEmailsIguales(group: FormGroup): boolean | null {
    const NEWEMAIL = group.get('newEmail')?.value;
    const CONFIRMAR_EMAIL = group.get('confirmEmail')?.value;
    return NEWEMAIL === CONFIRMAR_EMAIL ? true : false;
  }
}