import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { TabGeneralDataComponent } from '../tabs/tab-general-data/tab-general-data.component';
import { TabMasterInfoComponent } from '../tabs/tab-master-info/tab-master-info.component';
import { RegisterGuideService } from '../../services/register-guide.service';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { TabPersonsTransportComponent } from '../tabs/tab-persons-transport/tab-persons-transport.component';
import { TabManifestInfoComponent } from '../tabs/tab-manifest-info/tab-manifest-info.component';
import { TypeSearchGuideRegister } from '../../interfaces/guides-register.interface';
import { NgIf } from '@angular/common';
import { TabHouseInfoComponent } from '../tabs/tab-house-info/tab-house-info.component';
import { take, tap } from 'rxjs';

declare const $: any;

@Component({
  selector: 'app-tabs-guide-register',
  standalone: true,
  imports: [
    ButtonComponent,
    TabGeneralDataComponent,
    TabMasterInfoComponent,
    TabPersonsTransportComponent,
    TabManifestInfoComponent,
    TabHouseInfoComponent,
    NgIf,
  ],
  templateUrl: './tabs-guide-register.component.html',
})
export class TabsGuideRegisterComponent implements OnInit, AfterViewInit {
  @ViewChild(TabGeneralDataComponent) tabGeneralDataComponent!: TabGeneralDataComponent;
  @ViewChild(TabMasterInfoComponent) tabMasterInfoComponent!: TabMasterInfoComponent;
  @ViewChild(TabManifestInfoComponent) tabManifestInfoComponent!: TabManifestInfoComponent;
  @ViewChild(TabHouseInfoComponent) tabHouseInfoComponent!: TabHouseInfoComponent;
  @ViewChild(TabPersonsTransportComponent)
  tabPersonsTransportComponent!: TabPersonsTransportComponent;
  @Output() onDisplayAlert = new EventEmitter<boolean>();
  @Output() onSaveDocumentSuccess = new EventEmitter<string>();
  @Output() onSaveDocumentFail = new EventEmitter<void>();
  private sessionStorage = inject(SessionStorageService);
  private registerGuideService = inject(RegisterGuideService);
  typeSearchEnum = TypeSearchGuideRegister;

  ngOnInit(): void {
    this.loadFromSessionStorage();

    if (this.registerGuideService.resetTabs()) {
      this.setActiveTab('step1');
    }
  }

  ngAfterViewInit() {
    if (this.registerGuideService.formsDispatched()) {
      this.continueProcess(false);
    }
  }

  continueProcess(comesFromUser: boolean = true) {
    this.tabGeneralDataComponent.onSubmit();
    this.tabGeneralDataComponent.saveValuesInSessionStorage();

    if (this.isMaster) {
      this.tabMasterInfoComponent.onSubmit();
      this.tabMasterInfoComponent.saveValuesInSessionStorage();
    } else if (this.isManifest) {
      this.tabManifestInfoComponent.onSubmit();
      this.tabManifestInfoComponent.saveValuesInSessionStorage();
    } else if (this.isHouse) {
      this.tabHouseInfoComponent.onSubmit();
      this.tabHouseInfoComponent.saveValuesInSessionStorage();
    }

    if (!this.isManifest) {
      this.tabPersonsTransportComponent.onSubmit();
      this.tabPersonsTransportComponent.saveValuesInSessionStorage();
    }

    const generalInvalid = !this.tabGeneralDataComponent.formIsValid();
    const secondInvalid = !this.secondTabIsValid();
    const personsInvalid = !this.isManifest
      ? !this.tabPersonsTransportComponent.formIsValid()
      : false;
    if (generalInvalid || secondInvalid || personsInvalid) {
      if (comesFromUser) {
        if (generalInvalid) {
          this.setActiveTab('step1');
        } else if (secondInvalid) {
          this.setActiveTab('step2');
        } else if (personsInvalid) {
          this.setActiveTab('step3');
        }
      }

      this.onDisplayAlert.emit(true);
    } else {
      this.onDisplayAlert.emit(false);

      if (!this.isManifest) {
        this.setActiveTab('step3');
      }

      if (comesFromUser) {
        if (this.registerGuideService.isMaster) {
          this.registerGuideService
            .saveMaster()
            .pipe(
              tap(({ success, waybillNumber }) => {
                if (success) {
                  this.onSaveDocumentSuccess.emit(
                    `Guardado exitoso Waybill number: ${waybillNumber}`,
                  );
                  this.registerGuideService.reset();
                } else {
                  this.onSaveDocumentFail.emit();
                }
              }),
              take(1),
            )
            .subscribe();
        } else if (this.registerGuideService.isManifest) {
          this.registerGuideService
            .saveManifest()
            .pipe(
              tap(({ success, manifestNumber }) => {
                if (success) {
                  this.onSaveDocumentSuccess.emit(
                    `Guardado exitoso Manifest number: ${manifestNumber}`,
                  );
                  this.registerGuideService.reset();
                } else {
                  this.onSaveDocumentFail.emit();
                }
              }),
              take(1),
            )
            .subscribe();
        } else if (this.registerGuideService.isHouse) {
          this.registerGuideService
            .saveHouse()
            .pipe(
              tap(({ success, houseNumber }) => {
                if (success) {
                  this.onSaveDocumentSuccess.emit(`Guardado exitoso House number: ${houseNumber}`);
                  this.registerGuideService.reset();
                } else {
                  this.onSaveDocumentFail.emit();
                }
              }),
              take(1),
            )
            .subscribe();
        }
      }
    }

    this.registerGuideService.formsDispatched.set(true);
    this.sessionStorage.set('formsDispatched', this.registerGuideService.formsDispatched());
  }

  secondTabIsValid(): boolean {
    return this.isMaster
      ? this.tabMasterInfoComponent.formIsValid()
      : this.isManifest
        ? this.tabManifestInfoComponent.formIsValid()
        : this.isHouse
          ? this.tabHouseInfoComponent.formIsValid()
          : false;
  }

  setActiveTab(tab: string): void {
    this.registerGuideService.activeTab.set(tab);
    this.sessionStorage.set('activeTab', this.registerGuideService.activeTab());
  }

  get activeTab() {
    return this.registerGuideService.activeTab();
  }

  get isManifest() {
    return this.registerGuideService.searchByGuideRegister() === this.typeSearchEnum.MANIFEST;
  }

  get isMaster() {
    return this.registerGuideService.searchByGuideRegister() === this.typeSearchEnum.MASTER;
  }

  get isHouse() {
    return this.registerGuideService.searchByGuideRegister() === this.typeSearchEnum.HOUSE;
  }

  get typeGuide() {
    return this.isMaster
      ? 'Máster'
      : this.isHouse
        ? 'House'
        : this.isManifest
          ? 'Manifiesto'
          : 'Máster';
  }

  loadFromSessionStorage() {
    const activeTab = this.sessionStorage.get<string>('activeTab');

    if (activeTab) {
      this.registerGuideService.activeTab.set(activeTab);
    }
  }
}
