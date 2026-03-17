import { Component, OnInit } from '@angular/core';
import { ConsultaioQuery, ConsultaioStore } from '@ng-mf/data-access-user'
import { AccuseComponentes } from '@libs/shared/data-access-user/src/core/models/lista-trimites.model';
import { DatosGeneralesDelTramiteComponent } from '@libs/shared/data-access-user/src';
import { LISTA_TRIMITES } from '../shared/constantes/lista-trimites.enums';

@Component({
  selector: 'app-datos-generales-tramite',
  standalone: true,
  imports: [DatosGeneralesDelTramiteComponent],
  templateUrl: './datos-generales-tramite.component.html',
  styleUrl: './datos-generales-tramite.component.scss',
})
export class DatosGeneralesTramiteComponent implements OnInit{
  tramites: AccuseComponentes[] = LISTA_TRIMITES;
  folioTramite: string = ''
  tramite: string = ''
  idSolicitud: string = ''

  constructor(
    private consultaioStore: ConsultaioStore,
    public consultaQuery: ConsultaioQuery
  ) { }

  ngOnInit(): void {
    const FOLIO_TRAMITE = localStorage.getItem('folioTramite') || '';
    const TIPO_TRAMITE = localStorage.getItem('tipoTramite') || '';
    const ID_SOLICITUD = localStorage.getItem('idSolicitud') || '';

    this.folioTramite = FOLIO_TRAMITE
    this.tramite = TIPO_TRAMITE
    this.idSolicitud = ID_SOLICITUD

    this.consultaioStore.establecerConsultaio(
      this.tramite,
      "consulta-tramite",
      "se",
      this.folioTramite,
      "",
      "",
      true,
      false,
      true,
      "",
      "",
      this.idSolicitud
    )

  }
}
