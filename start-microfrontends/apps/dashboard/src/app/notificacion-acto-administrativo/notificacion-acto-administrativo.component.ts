import { FormBuilder ,FormGroup , ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmarNotificacionService } from '../services/confirmar-notificacion.service';
import { OnInit } from '@angular/core';
import { TituloComponent } from '@ng-mf/data-access-user';
import { TooltipModule } from 'ngx-bootstrap/tooltip';


@Component({
  selector: 'app-notificacion-acto-administrativo',
  standalone: true,
  imports: [CommonModule, TituloComponent, ReactiveFormsModule, TooltipModule],
  templateUrl: './notificacion-acto-administrativo.component.html',
  styleUrl: './notificacion-acto-administrativo.component.css',
})
export class NotificacionActoAdministrativoComponent implements OnInit {
  notificacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private confirmarNotificacionService: ConfirmarNotificacionService
  ) {
    this.notificacionForm = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      rfc: [{ value: '', disabled: true }],
      fechaHora: [{ value: '', disabled: true }],
    });
  }
  ngOnInit(): void {
    this.confirmarNotificacionService.getFolioDatos().subscribe((data) => {
      this.notificacionForm.patchValue({
        nombre: data.nombreDenominacionORazonSocial,
        rfc: data.rfc,
        fechaHora: data.fechaYHoraDeLaNotificacion,
      });
    });
  }
}
