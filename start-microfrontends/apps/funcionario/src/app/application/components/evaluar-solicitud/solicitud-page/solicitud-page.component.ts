import { EncabezadoRequerimientoComponent, FirmaPageComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { CapturarRequerimientoComponent } from '../capturar-requerimiento/capturar-requerimiento.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GenerarDictamenComponent } from '../generar-dictamen/generar-dictamen.component';
import { RequerimientoInformacionComponent } from '../requerimiento-informacion/requerimiento-informacion.component';
import { Router } from '@angular/router';
import { SolicitarDocumentosEvaluacionComponent } from '../solicitar-documentos-evaluacion/solicitar-documentos-evaluacion.component';
import { SolicitarOpinionComponent } from '../solicitar-opinion/solicitar-opinion.component';

@Component({
  selector: 'app-solicitud-page',
  standalone: true,
  imports: [CommonModule, EncabezadoRequerimientoComponent, GenerarDictamenComponent, CapturarRequerimientoComponent, SolicitarDocumentosEvaluacionComponent, RequerimientoInformacionComponent, FirmaPageComponent, TituloComponent, SolicitarOpinionComponent], // <-- Importa los componentes aquí
  templateUrl: './solicitud-page.component.html',
  styleUrl: './solicitud-page.component.scss',
})
export class SolicitudPageComponent {
  /**
     * Índice de la pestaña seleccionada
     */
  indice: number = 1;
  /**
   * Variable para firmar
   */
  public firmarFuncionario: boolean = true;
  constructor(
    private router: Router
  ) { }
  
  /**
   * Método para seleccionar la pestaña
   * @param i indica el número de la pestaña seleccionada
   */
  seleccionaTab(i: number): void {
    if (i === 2 || i === 3) {
      this.firmarFuncionario = false;
    }
    this.indice = i;
  }
  /*
   * Método que se ejecuta para guardar y firmar
  */
  guardarFirmar(): void {
    this.router.navigate(['funcionario/firma-electronica']);
  }
}
