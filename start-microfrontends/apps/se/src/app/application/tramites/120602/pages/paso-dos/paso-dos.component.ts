import { Component, OnInit } from '@angular/core';
import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';

import { CatalogosService } from '@ng-mf/data-access-user';

import { CommonModule } from '@angular/common';

import { AlertComponent, AnexarDocumentosComponent, TEXTOS, TituloComponent } from '@libs/shared/data-access-user/src';

/**
 * @class PasoDosComponent
 * @description
 * Este componente gestiona el segundo paso de un trámite, donde se anexan documentos y se muestran alertas.
 *
 * @since 1.0.0
 * @version 1.0.0
 * @license MIT
 *
 * @selector app-paso-dos
 * @standalone true
 * @requires CommonModule
 * @requires AnexarDocumentosComponent
 * @requires AlertComponent
 * @requires TituloComponent
 *
 * @templateUrl ./paso-dos.component.html
 * @styleUrl ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  standalone: true,
  imports: [CommonModule, AnexarDocumentosComponent, AlertComponent, TituloComponent],
  templateUrl: './paso-dos.component.html',
  styleUrl: './paso-dos.component.scss',
})
export class PasoDosComponent implements OnInit {
  TEXTOS = TEXTOS;
 
   tiposDocumentos: Catalogo[] = [];
   infoAlert = 'alert-info';
   catalogoDocumentos: Catalogo[] = [];
   documentosSeleccionados: Catalogo[] = [];
 
   constructor(
     private catalogosServices: CatalogosService,
   ) { 
     //
   }
 
   ngOnInit(): void {
     this.getTiposDocumentos();
     this.documentosSeleccionados = [
       {
         id: 1,
         descripcion: 'Documentos que ampare el valor de la mercancía'
       },
       {
         id: 2,
         descripcion: 'Documentos del medio de transporte (Guías, BL o carta porte según corresponda)'
       }
     ]
 
   }
 
   /**
  * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
  */
   getTiposDocumentos(): void {
     this.catalogosServices
       .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
       .subscribe({
         next: (resp): void => {
           if (resp.length > 0) {
             this.catalogoDocumentos = resp;
           }
         },
         error: (_error): void => {
           //
          },
       });
   }
}