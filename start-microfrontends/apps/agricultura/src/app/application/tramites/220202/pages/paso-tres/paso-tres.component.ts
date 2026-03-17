import { Component } from '@angular/core';
import { FirmaElectronicaComponent } from '@ng-mf/data-access-user';

/**
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoTresComponent
 * @selector app-paso-tres
 * @templateUrl ./paso-tres.component.html
 * @styleUrls ./paso-tres.component.scss --220201
 */
@Component({
  selector: 'app-paso-tres',
  templateUrl: './paso-tres.component.html',
  styleUrls: ['./paso-tres.component.scss'],
  standalone: true,
  imports: [FirmaElectronicaComponent],
})
export class PasoTresComponent {}
