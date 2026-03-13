import { CATALOGOS_ID } from '@ng-mf/data-access-user';
import { Catalogo } from '@ng-mf/data-access-user';
import { CatalogosService } from '@ng-mf/data-access-user';
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { TEXTOS_REQUISITOS } from '../../constantes/certificado-zoosanitario.enum';
import { takeUntil } from 'rxjs';


/**
 * Componente para mostrar el subtítulo del asistente.
 * @component PasoDosComponent
 * @selector app-paso-dos
 * @templateUrl ./paso-dos.component.html
 * @styleUrls ./paso-dos.component.scss
 */
@Component({
  selector: 'app-paso-dos',
  templateUrl: './paso-dos.component.html',
  styleUrls: ['./paso-dos.component.scss']
})
export class PasoDosComponent implements OnInit, OnDestroy{

  /**
   * Objeto con los textos de los requisitos.
   * @property {object} TEXTOS_REQUISITOS - Textos para los requisitos del certificado zoosanitario. --220201
   */
  TEXTOS = TEXTOS_REQUISITOS;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  catalogoDocumentos: Catalogo[] = [];

  constructor(private catalogosServices: CatalogosService) {
    // no hacer nada
  }

  ngOnInit(): void {
    this.getTiposDocumentos();
  }

  /**
 * Obtiene el catalgoso de los tipos de documentos disponibles para el trámite.
 */
  getTiposDocumentos(): void {
    this.catalogosServices
      .getCatalogo(CATALOGOS_ID.CAT_TIPO_DOCUMENTO)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((resp): void => {
        this.catalogoDocumentos = resp;
      });
  }

  /**
   * Este método se utiliza para destruir la suscripción.
   * @returns destroyed$
   */
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}