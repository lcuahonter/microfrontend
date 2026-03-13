import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@libs/shared/data-access-user/src';

/**
 * Componente que representa el tercer paso de un proceso o flujo.
 * Este componente es independiente (standalone) y utiliza el componente `FirmaElectronicaComponent`
 * para gestionar la firma electrónica.
 * 
 * @selector app-paso-tres
 * @standalone true
 * @imports [FirmaElectronicaComponent]
 * @templateUrl ./paso-tres.component.html
 * @styleUrls ['./paso-tres.component.scss']
 */
@Component({
  selector: 'app-paso-tres',
  standalone: true,
  imports: [
    FirmaElectronicaComponent
  ],
  templateUrl: './paso-tres.component.html',
  
})
export class PasoTresComponent {

}