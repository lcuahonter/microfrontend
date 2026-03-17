import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../shared/utils/formUtils';
import { NgClass, NgIf } from '@angular/common';
import { RoutingService } from '../../../core/services/routing.service';
import { APP_ROUTES } from '../../../routes.constants';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private routing = inject(RoutingService);
  formUtils = FormUtils;
  loginForm: FormGroup = this.fb.group({
    certificate: [null, Validators.required],
    key: [null, Validators.required],
    password: ['', Validators.required],
  });

  login() {
    this.routing.navigate([APP_ROUTES.VUCEM]);
    this.loginForm.markAllAsTouched();
    console.log(this.loginForm.value);
  }
}
