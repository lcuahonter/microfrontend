import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConsultaioQuery, ConsultaioState } from '@ng-mf/data-access-user';
import { Subject, map, takeUntil } from 'rxjs';
import {
  TablaDinamicaComponent,
  TablaSeleccion,
} from '@libs/shared/data-access-user/src';
import { CHOFERES_EXTRANJEROS_TABLA } from '../../../../enum/choferes.enum';
import { Chofer40101Query } from '../../../../estado/chofer40101.query';
import { Chofer40101Store } from '../../../../estado/chofer40101.store';
import { ChoferesExtranjeros } from '../../../../models/registro-muestras-mercancias.model';
import { ConfiguracionColumna } from '@libs/shared/data-access-user/src/core/models/shared/configuracion-columna.model';
import { DatosDeChoferesExtranjerosDialogComponent } from '../dialog/data.de.choferes.extranjeros.dialog.component';

@Component({
  selector: 'app-chofere-alta-de-extranjeros',
  templateUrl: './chofere.alta.de.extranjeros.component.html',
  styleUrls: ['./chofere.alta.de.extranjeros.component.scss'],
  standalone: true,
  imports: [
    TablaDinamicaComponent,
    DatosDeChoferesExtranjerosDialogComponent,
  ],
  providers: [BsModalService],
})
export class ChofereAltaDeExtranjerosComponent implements OnInit, OnDestroy {
  tipoSeleccionTabla = TablaSeleccion.CHECKBOX;
  ConfiguracionColumna: ConfiguracionColumna<ChoferesExtranjeros>[] = CHOFERES_EXTRANJEROS_TABLA;
  datosDelChoferExtranjeros: ChoferesExtranjeros[] = [];
  datosDelChoferExtranjerosSelected: ChoferesExtranjeros[] = [];
  datosConsulta!: ConsultaioState;
  datosChofere: ChoferesExtranjeros = {} as ChoferesExtranjeros;
  modalRef!: BsModalRef | null;
  @ViewChild('datosDeChoferesModal', { static: false })
  agregarModalDialog!: TemplateRef<Element>;
  @ViewChild(DatosDeChoferesExtranjerosDialogComponent)
  datosDeChoferesDialogComponent!: DatosDeChoferesExtranjerosDialogComponent;
  destroy$: Subject<unknown> = new Subject();
  esSoloLectura: boolean = false;

  constructor(
    private bsModalService: BsModalService,
    private chofer40101Store: Chofer40101Store,
    private chofer40101Query: Chofer40101Query,
    private consultaioQuery: ConsultaioQuery
  ) { }

  ngOnInit(): void {
    this.chofer40101Query.select(state => state.driversExtranjero)
      .pipe(
        takeUntil(this.destroy$),
        map(drivers => drivers.filter(d => d.status !== 'deleted').map(d => d.data as ChoferesExtranjeros))
      )
      .subscribe(data => {
        this.datosDelChoferExtranjeros = data;
      });

    this.consultaioQuery.selectConsultaioState$
      .pipe(
        takeUntil(this.destroy$),
        map((seccionState) => {
          if (seccionState.readonly) {
            this.datosConsulta = seccionState;
            this.esSoloLectura = this.datosConsulta.readonly;
          }
        })
      ).subscribe();
  }


  onChofereNationalSelected($event: ChoferesExtranjeros[]): void {
    this.datosDelChoferExtranjerosSelected = $event;
  }

  addNewRow(template: TemplateRef<unknown>): void {
    this.datosChofere = {} as ChoferesExtranjeros;
    this.openModal(template);
  }

  editSelectedRow(template: TemplateRef<unknown>): void {
    if (this.datosDelChoferExtranjerosSelected.length === 0) {
      return;
    }
    const SELECTIONADO = this.datosDelChoferExtranjerosSelected[0];
    const FULLDRIVERLIST = this.chofer40101Query.getValue().driversExtranjero;
    const INDICE = FULLDRIVERLIST.findIndex(item => item.data === SELECTIONADO);
    this.datosChofere = SELECTIONADO;
    setTimeout(() => {
      if (this.datosDeChoferesDialogComponent && INDICE !== -1) {
        this.datosDeChoferesDialogComponent.editarRegistro(SELECTIONADO, INDICE);
      }
    });
    this.openModal(template);
  }

  @ViewChild(TablaDinamicaComponent)
  tablaDinamicaComponent!: TablaDinamicaComponent<ChoferesExtranjeros>;

  deleteSelectedRow(): void {
    if (this.datosDelChoferExtranjerosSelected.length > 0) {
      const FULLDRIVERLIST = this.chofer40101Query.getValue().driversExtranjero;
      const INDICESTODELETE = this.datosDelChoferExtranjerosSelected.map(selectedDriver => {
        return FULLDRIVERLIST.findIndex(item => item.data === selectedDriver);
      }).filter(index => index !== -1).sort((a, b) => b - a);

      INDICESTODELETE.forEach(index => {
        this.chofer40101Store.deleteDriver('extranjero', index);
      });

      this.datosDelChoferExtranjerosSelected = [];
      if (this.tablaDinamicaComponent) {
        this.tablaDinamicaComponent.listaDeFilaSeleccionada.emit([]);
      }
    }
  }

  openModal(template: TemplateRef<unknown>): void {
    this.modalRef = this.bsModalService.show(template, {
      class: 'modal-fullscreen',
    });
  }

  cancelModal(): void {
    this.modalRef?.hide();
    this.modalRef = null;
  }

  addModal(evento: { datos: ChoferesExtranjeros, indice?: number }): void {
    if (evento.indice !== undefined) {
      this.chofer40101Store.updateDriver('extranjero', evento.indice, evento.datos);
    } else {
      this.chofer40101Store.addDriver('extranjero', evento.datos);
    }

    this.datosDelChoferExtranjerosSelected = [];
    if (this.tablaDinamicaComponent) {
      this.tablaDinamicaComponent.listaDeFilaSeleccionada.emit([]);
    }
    this.cancelModal();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}