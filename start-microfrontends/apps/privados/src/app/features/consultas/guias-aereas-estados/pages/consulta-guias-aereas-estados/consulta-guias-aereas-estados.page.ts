import { Component } from '@angular/core';
import { ConsultaManifiestoUnicoAereoComponent } from '../../components/consulta-manifiesto-unico-aereo/consulta-manifiesto-unico-aereo.component';

@Component({
  selector: 'app-consulta-guias-aereas-estados',
  standalone: true,
  imports: [ConsultaManifiestoUnicoAereoComponent],
  templateUrl: './consulta-guias-aereas-estados.page.html',
})
export class ConsultaGuiasAereasEstadosPage {}
