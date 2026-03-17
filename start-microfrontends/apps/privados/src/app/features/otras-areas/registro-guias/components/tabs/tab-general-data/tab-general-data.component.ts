import { DatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { FormUtils } from '@/shared/utils/formUtils';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
import { TimeFormatDirective } from '@/shared/directives/time-format.directive';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { Subject, take, tap } from 'rxjs';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { MaxLengthDirective } from '@/shared/directives/max-length.directive';
import { UppercaseDirective } from '@/shared/directives/uppercase.directive';
import { combineLocalDateAndTime } from '@/shared/utils/serviceUtils';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { TypeSearchGuideRegister } from '../../../interfaces/guides-register.interface';
import { WaybillType } from '../../../interfaces/master.interface';
import { FlightManifestType } from '../../../interfaces/manifest.interface';
import { WaybillTypeHouse } from '../../../interfaces/house.interface';
declare var $: any;

@Component({
  selector: 'app-tab-general-data',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BsDatepickerModule,
    DatePickerComponent,
    Tooltip,
    DialogComponent,
    TimeFormatDirective,
    CommonModule,
    MaxLengthDirective,
    UppercaseDirective,
  ],
  templateUrl: './tab-general-data.component.html',
})
export class TabGeneralDataComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private sessionStorage = inject(SessionStorageService);
  private registerGuideService = inject(RegisterGuideService);
  private catalogsService = inject(CatologsRegisterGuideService);
  typeSearchEnum = TypeSearchGuideRegister;
  formUtils = FormUtils;
  generalDataForm = this.formBuilder.group({
    issueDate: [null, Validators.required],
    issueTime: ['', [Validators.required, this.formUtils.timeFormatValidator()]],
    purposeCode: [{ value: '', disabled: true }, Validators.required],
    caat: ['', Validators.required],
    rfc: ['', Validators.required],
  });
  issueDateInitialValue: Date | undefined = undefined;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadFromSessionStorage();
  }

  saveValuesInSessionStorage() {
    this.sessionStorage.set('generalDataTab', this.generalDataForm.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.generalDataForm.markAllAsTouched();
    this.saveValuesInSessionStorage();
    if (this.formIsValid()) {
      const { issueDate, issueTime } = this.generalDataForm.value;

      if (!issueDate || !issueTime) {
        return;
      }

      const issueDateTimeIso = combineLocalDateAndTime(issueDate as Date, issueTime as string);
      const purposeCodeMenu = this.registerGuideService.purpuseCode() || '';
      const rfc = this.generalDataForm.controls['rfc'].value || '';
      const typeCode = this.registerGuideService.getMsgType();
      const infoMasterTab = this.sessionStorage.get<any>('infoMasterTab');
      const houseMasterForm = this.sessionStorage.get<any>('houseMasterForm');

      if (this.registerGuideService.isMaster) {
        this.registerGuideService.rootPayload = {
          rfc,
          numMaster:
            this.registerGuideService.purpuseCode() === 'Update'
              ? infoMasterTab.waybillNumber
              : null,
          purposeCodeMenu,
          typeCodeMHD: typeCode,
          waybillType: {
            messageHeaderDocument: {
              typeCode,
              issueDateTime: issueDateTimeIso,
              purposeCode: purposeCodeMenu,
            },
          } as WaybillType,
          idMensajeOriginal: null,
        };
      } else if (this.registerGuideService.isManifest) {
        this.registerGuideService.manifestRequest = {
          purposeCodeMenu,
          typeCodeMHD: typeCode,
          rfc,
          numManifest: null,
          flightManifestType: {
            messageHeaderDocumentDTO: {
              id: null,
              name: null,
              typeCode,
              issueDateTime: issueDateTimeIso, // ISO string
              purposeCode: purposeCodeMenu,
              versionID: null,
              conversationID: null,
              senderParty: {
                primaryID: null,
                schemeID: null,
              },
              recipientParty: {
                primaryID: null,
                schemeID: null,
              },
            },
          } as FlightManifestType,
        };
      } else if (this.registerGuideService.isHouse) {
        this.registerGuideService.houseRequest = {
          rfc,
          numHouse:
            this.registerGuideService.purpuseCode() === 'Update'
              ? houseMasterForm.houseWaybillNumber
              : null,
          purposeCodeMenu,
          typeCodeMHD: typeCode,
          idMensajeOriginal: null,
          waybillType: {
            messageHeaderDocument: {
              id: null,
              name: null,
              typeCode,
              issueDateTime: issueDateTimeIso, // ISO string
              purposeCode: purposeCodeMenu,
              versionID: null,
              conversationID: null,
              senderParty_PrimaryID: null,
              senderParty_SchemeID: null,
              recipientParty_PrimaryID: null,
              recipientParty__SchemeID: null,
            },
          } as WaybillTypeHouse,
        };
      }
    }
  }

  search() {
    const caat = this.generalDataForm.controls['caat'].value;
    if (caat) {
      this.getRfc(caat.toUpperCase(), this.registerGuideService.getMsgType());
    }
  }

  formIsValid(): boolean {
    return this.generalDataForm.valid;
  }

  private getRfc(caat: string, tipoMensaje: string) {
    this.catalogsService
      .getRFC(caat, tipoMensaje)
      .pipe(
        tap((rfc: string) => {
          if (!!rfc) {
            if (rfc === 'caat no valido') {
              $('#caatModal').modal();
            } else {
              this.generalDataForm.controls['rfc'].setValue(rfc);
            }
          } else {
            $('#caatModal').modal();
          }
        }),
        take(1),
      )
      .subscribe();
  }

  private loadFromSessionStorage() {
    const purpuseCode = this.sessionStorage.get<string>('purpuseCode');
    this.registerGuideService.purpuseCode.set(purpuseCode);
    this.generalDataForm.controls.purposeCode.setValue(purpuseCode);
    const generalDataTab = this.sessionStorage.get<any>('generalDataTab');
    if (!!generalDataTab) {
      try {
        this.generalDataForm.patchValue(generalDataTab);
        this.issueDateInitialValue = generalDataTab.issueDate
          ? new Date(generalDataTab.issueDate)
          : undefined;
        this.search();
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
