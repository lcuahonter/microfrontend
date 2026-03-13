import { Component } from '@angular/core';
import { GuideRegisterComponent } from '../../components/guide-register/guide-register.component';

@Component({
  selector: 'app-registro-guias-page',
  standalone: true,
  imports: [GuideRegisterComponent],
  templateUrl: './registro-guias.page.html',
})
export class RegistroGuiasPage {}
