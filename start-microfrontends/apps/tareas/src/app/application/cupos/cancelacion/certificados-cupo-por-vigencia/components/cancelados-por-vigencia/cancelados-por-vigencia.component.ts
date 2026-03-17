import { Component, Input } from '@angular/core';
import { ConfiguracionColumna, ExpandirTablaComponent, TablaDinamicaComponent } from '@ng-mf/data-access-user';
import { CertificadoCancelado } from '../../service/model/response/certificados-vigencia.model';
import { CommonModule } from '@angular/common';

/**
 * Componente que muestra una tabla con los certificados cancelados por vigencia.
 * @param datos - Array de certificados cancelados.
 */
@Component({
  selector: 'app-cancelados-por-vigencia',
  standalone: true,
  imports: [CommonModule, ExpandirTablaComponent, TablaDinamicaComponent],
  template: `
    <div class="p-3">
      <app-expandir-tabla title="Certificados cancelados">
        <app-tabla-dinamica
          [configuracionTabla]="configuracionTabla"
          [datos]="datos"
          [itemsPerPage]="5"
          [showRowNumber]="false"
        ></app-tabla-dinamica>
      </app-expandir-tabla>
    </div>
  `
})
export class CanceladosPorVigenciaComponent {
  @Input() datos: CertificadoCancelado[] = [];
  
  configuracionTabla: ConfiguracionColumna<CertificadoCancelado>[] = [
    { encabezado: 'Folio del oficio de certificado', clave: (item: CertificadoCancelado): string => item.folioOficio, orden: 1 },
    { encabezado: 'RFC', clave: (item: CertificadoCancelado): string => item.rfc, orden: 2 },
    { encabezado: 'Nombre, Denominación o Razón Social', clave: (item: CertificadoCancelado): string => item.nombreRazonSocial, orden: 3 },
    { encabezado: 'Representación Federal', clave: (item: CertificadoCancelado): string => item.representacionFederal, orden: 4 }
  ];
}
