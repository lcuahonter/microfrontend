import { TypeSearch } from '@/features/consultas/guias-aereas/interfaces/air-waybill-forms.interface';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MasterFormComponent } from '../forms/master-form/master-form.component';
import { ManifestFormComponent } from '../forms/manifest-form/manifest-form.component';
import { HouseFormComponent } from '../forms/house-form/house-form.component';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { GuideTableComponent } from '../guide-table/guide-table.component';
import { GuidesService } from '../../services/guides.service';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';

declare const $: any;

@Component({
  selector: 'app-consulta-manifiesto-unico-aereo',
  standalone: true,
  imports: [
    FormsModule,
    MasterFormComponent,
    ManifestFormComponent,
    HouseFormComponent,
    ButtonComponent,
    GuideTableComponent,
    DialogComponent,
  ],
  templateUrl: './consulta-manifiesto-unico-aereo.component.html',
})
export class ConsultaManifiestoUnicoAereoComponent implements OnInit {
  @ViewChild(HouseFormComponent) houseComponent!: HouseFormComponent;
  @ViewChild(MasterFormComponent) masterComponent!: MasterFormComponent;
  @ViewChild(ManifestFormComponent) manifestComponent!: ManifestFormComponent;
  @ViewChild(GuideTableComponent) guideTable!: GuideTableComponent;
  private sessionStorage = inject(SessionStorageService);
  private guidesService = inject(GuidesService);
  searchType: TypeSearch | null = null;
  searchTypeEnum = TypeSearch;
  displayData = signal<boolean>(false);
  currentForm = signal<TypeSearch | null>(null);

  ngOnInit(): void {
    this.loadSearchTypeFromSession();
  }

  onSearchTypeChange() {
    this.sessionStorage.set('searchBy', this.searchType);
    this.guidesService.searchBy.set(this.searchType);
    this.displayData.set(false);
    this.cleanParamsFromSessionStorage();
  }

  displayTable(form: TypeSearch) {
    this.currentForm.set(form);

    if (this.displayData()) {
      if (form === TypeSearch.HOUSE) {
        this.guideTable.getHouseGuide();
      } else if (form === TypeSearch.MASTER) {
        this.guideTable.getMasterGuide();
      } else if (form === TypeSearch.MANIFEST) {
        this.guideTable.getManifestGuide();
      }
    } else {
      this.displayData.set(true);
    }
  }

  submitForm() {
    const activeComponent = this.getActiveFormComponent();
    if (activeComponent) {
      activeComponent.submitForm();
    }
  }

  displayNotResults() {
    $('#notResults').modal();
  }

  cleanParamsFromSessionStorage() {
    this.sessionStorage.cleanParamsFromSessionStorage([
      'houseGuide',
      'caat',
      'guideMaster',
      'guideManifest',
    ]);
  }

  private loadSearchTypeFromSession(): void {
    const searchBy = this.sessionStorage.get<TypeSearch | null>('searchBy');
    if (searchBy) {
      this.guidesService.searchBy.set(searchBy);
      this.searchType = searchBy;
    }
  }

  private getActiveFormComponent() {
    switch (this.searchType) {
      case this.searchTypeEnum.MANIFEST:
        return this.manifestComponent;
      case this.searchTypeEnum.MASTER:
        return this.masterComponent;
      case this.searchTypeEnum.HOUSE:
        return this.houseComponent;
      default:
        return null;
    }
  }
}
