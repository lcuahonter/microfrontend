import { Component, OnInit, inject, signal } from '@angular/core';
import { TypeSearchGuideRegister } from '../../interfaces/guides-register.interface';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { FormUtils } from '@/shared/utils/formUtils';
import { CommonModule, NgClass } from '@angular/common';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { CatologsRegisterGuideService } from '../../services/catologs-register-guide.service';
import { take, tap } from 'rxjs';
import { Message } from '../../interfaces/catalogs.interface';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { TabsGuideRegisterComponent } from '../tabs-guide-register/tabs-guide-register.component';
import { RegisterGuideService } from '../../services/register-guide.service';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { PreFillMasterDatos } from '../../interfaces/master.interface';
import { PrefillHouse } from '../../interfaces/house.interface';
import { isEmptyObject } from '@/shared/utils/serviceUtils';
declare const $: any;

@Component({
  selector: 'app-guide-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    Tooltip,
    ButtonComponent,
    TabsGuideRegisterComponent,
    CommonModule,
    DialogComponent,
  ],
  templateUrl: './guide-register.component.html',
})
export class GuideRegisterComponent implements OnInit {
  private catalogsService = inject(CatologsRegisterGuideService);
  private registerGuideService = inject(RegisterGuideService);
  private sessionStorage = inject(SessionStorageService);
  private formBuilder = inject(FormBuilder);
  CREATION = 'Creation';
  UPDATE = 'Update';
  DELETION = 'Deletion';
  searchType: TypeSearchGuideRegister | null = null;
  displayInvalidFormAlert = false;
  searchTypeEnum = TypeSearchGuideRegister;
  formUtils = FormUtils;
  searchTypeForm = this.formBuilder.group(
    {
      purpuseCode: [null as string | null, Validators.required],
      guideManifest: [null as string | null],
    },
    {
      validators: [
        this.formUtils.conditionalRequiredValidator(
          'purpuseCode',
          ['Deletion', 'Update'],
          'guideManifest',
        ),
      ],
    },
  );
  purpuses: Message[] = [];
  purpusesBackup: Message[] = [];
  documentSavedMsg = '';
  isUpdating = signal<boolean>(false);
  readyToDelete = false;
  documentDeletedIdMsg = '';

  ngOnInit(): void {
    this.loadFromSessionStorage();
    this.getPruposeMessages();
    this.listenFormChanges();

    if (
      !isEmptyObject(this.registerGuideService.preFillMasterDatos) ||
      !isEmptyObject(this.registerGuideService.preFillHouseDatos)
    ) {
      this.isUpdating.set(true);
    }
  }

  submitForm() {
    this.searchTypeForm.markAllAsTouched();
  }

  onSearchTypeChange() {
    this.sessionStorage.set('searchByGuideRegister', this.searchType);
    this.registerGuideService.searchByGuideRegister.set(this.searchType);
    this.registerGuideService.formsDispatched.set(false);
    this.searchTypeForm.reset();
    if (this.searchType === this.searchTypeEnum.MANIFEST) {
      this.purpuses = this.purpuses.filter((msg) => msg.clave !== this.UPDATE);
    } else {
      this.purpuses = this.purpusesBackup;
    }
  }

  getPruposeMessages(): void {
    this.catalogsService
      .getPurposeMessages()
      .pipe(
        tap((messages: Message[]) => {
          this.purpuses = messages;
          this.purpusesBackup = messages;
        }),
        take(1),
      )
      .subscribe();
  }

  purposeCodeIsCreation() {
    const porpuseValue = this.searchTypeForm.controls['purpuseCode'].value;
    return porpuseValue === this.CREATION;
  }

  purposeCodeIsUpdating() {
    const porpuseValue = this.searchTypeForm.controls['purpuseCode'].value;
    return porpuseValue === this.UPDATE;
  }

  isUpdatingOrDeletion() {
    const porpuseValue = this.searchTypeForm.controls['purpuseCode'].value;
    return porpuseValue === this.UPDATE || porpuseValue === this.DELETION;
  }

  purposeCodeIsNotNull() {
    const porpuseValue = this.searchTypeForm.controls['purpuseCode'].value;
    return !!porpuseValue;
  }

  cancel() {
    this.searchTypeForm.controls['purpuseCode'].setValue(null);
    this.searchType = null;
    this.displayInvalidFormAlert = false;
    this.isUpdating.set(false);
    this.sessionStorage.clear();
    this.registerGuideService.reset();
  }

  listenFormChanges() {
    this.searchTypeForm.get('purpuseCode')?.valueChanges.subscribe((value) => {
      if (value === this.CREATION) {
        this.sessionStorage.cleanParamsFromSessionStorage(['purpuseCode', 'guideManifest']);
        this.registerGuideService.purpuseCode.set(value);
      }
      this.sessionStorage.set('purpuseCode', value);
      this.readyToDelete = false;
    });

    this.searchTypeForm.get('guideManifest')?.valueChanges.subscribe((value) => {
      this.sessionStorage.set('guideManifest', value);
    });
  }

  displayAlert(display: boolean) {
    this.displayInvalidFormAlert = display;
  }

  onSaveDocumentSuccess(msg: string) {
    this.documentSavedMsg = msg;
    this.cancel();
    $('#documentSaved').modal();
  }

  onSaveDocumentFail() {
    $('#documentSaveFailed').modal();
  }

  documentDeleted() {
    this.cancel();
    $('#documentDeleted').modal();
  }

  getCode(): string {
    return this.searchType === this.searchTypeEnum.MASTER
      ? '740'
      : this.searchType === this.searchTypeEnum.HOUSE
        ? '703'
        : this.searchType === this.searchTypeEnum.MANIFEST
          ? '122'
          : '';
  }

  getGuideNumber(): string {
    return this.searchTypeForm.value.guideManifest ?? '';
  }

  searchGuideManifest() {
    this.catalogsService
      .getGuide(this.getGuideNumber(), this.getCode())
      .pipe(
        tap((res: string) => {
          if (res === 'NO' || res === 'NOVALIDO') {
            $('#notResults').modal();
          } else {
            if (this.purposeCodeIsUpdating()) {
              this.getGuide(res);
            } else {
              this.readyToDelete = true;
            }
          }
        }),
        take(1),
      )
      .subscribe();
  }

  deleteGuide() {
    if (this.getCode() === '740') {
      this.registerGuideService
        .deleteMaster(this.getGuideNumber(), true)
        .pipe(
          tap((res) => {
            if (res.success) {
              this.documentDeletedIdMsg = `Borrado exitoso: ${res.waybillNumber}`;
              this.documentDeleted();
            } else {
              this.onSaveDocumentFail();
            }
          }),
          take(1),
        )
        .subscribe();
    } else if (this.getCode() === '122') {
      this.registerGuideService
        .deleteManifest(this.getGuideNumber(), true)
        .pipe(
          tap((res) => {
            if (res.success) {
              this.documentDeletedIdMsg = `Borrado exitoso: ${res.manifestNumber}`;
              this.documentDeleted();
            } else {
              this.onSaveDocumentFail();
            }
          }),
          take(1),
        )
        .subscribe();
    } else if (this.getCode() === '703') {
      this.registerGuideService
        .deleteHouse(this.getGuideNumber(), true)
        .pipe(
          tap((res) => {
            if (res.success) {
              this.documentDeletedIdMsg = `Borrado exitoso: ${res.houseNumber}`;
              this.documentDeleted();
            } else {
              this.onSaveDocumentFail();
            }
          }),
          take(1),
        )
        .subscribe();
    }

    this.documentDeletedIdMsg = '';
  }

  getGuide(guide: string) {
    if (this.searchType === this.searchTypeEnum.MASTER) {
      this.registerGuideService
        .getMaster(guide)
        .pipe(
          tap((res: PreFillMasterDatos) => {
            this.registerGuideService.preFillMasterDatos = res;
            this.sessionStorage.set(
              'preFillMasterDatos',
              this.registerGuideService.preFillMasterDatos,
            );
            this.isUpdating.set(true);
          }),
          take(1),
        )
        .subscribe();
    } else if (this.searchType === this.searchTypeEnum.HOUSE) {
      this.registerGuideService
        .getHouse(guide)
        .pipe(
          tap((res: PrefillHouse) => {
            this.registerGuideService.preFillHouseDatos = res;
            this.sessionStorage.set(
              'preFillHouseDatos',
              this.registerGuideService.preFillHouseDatos,
            );
            this.isUpdating.set(true);
          }),
          take(1),
        )
        .subscribe();
    }
  }

  private loadFromSessionStorage() {
    const searchByGuideRegister =
      this.sessionStorage.get<TypeSearchGuideRegister>('searchByGuideRegister');
    if (searchByGuideRegister) {
      this.searchType = searchByGuideRegister;
      this.registerGuideService.searchByGuideRegister.set(this.searchType);
    }

    const purpuseCode = this.sessionStorage.get<string>('purpuseCode');
    const guideManifest = this.sessionStorage.get<string>('guideManifest');
    const form = { purpuseCode, guideManifest };
    this.searchTypeForm.patchValue(form);
  }
}
