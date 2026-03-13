import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-preview-documento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-documento.component.html',
})
export class PreviewDocumentoComponent implements OnInit {
  /**
   * @description Variable de entrada para definir el título del modal.
   */
  title?: string;

  /**
 * URL segura del PDF, sanitizada para evitar problemas de seguridad en Angular.
 * Se usa en elementos como `<iframe [src]="rutaPdf"></iframe>`.
 */
  rutaPdf?: SafeResourceUrl;

  /**
   * @description Variable de entrada para definir la ruta del documento a mostrar.
   */
  ruta?: string;

  constructor(public bsModalRef: BsModalRef, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.rutaPdf = this.sanitizer.bypassSecurityTrustResourceUrl(this.ruta || '');
  }
}
