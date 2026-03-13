import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { TransferTypeSearch } from '../../../interfaces/transfers.interface';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass, NgIf } from '@angular/common';
import { TransferService } from '../../../services/transfer.service';

@Component({
  selector: 'app-manifest-number-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './manifest-number-form.component.html',
})
export class ManifestNumberFormComponent implements OnInit {
  @Output() onSubmitForm = new EventEmitter<TransferTypeSearch>();
  private formBuilder = inject(FormBuilder);
  private sessionStorage = inject(SessionStorageService);
  private transferService = inject(TransferService);
  formUtils = FormUtils;
  manifestForm = this.formBuilder.group(
    {
      manifestNumber: [''],
      numFlight: [''],
    },
    {
      validators: [FormUtils.atLeastOneRequiredValidator(['manifestNumber', 'numFlight'])],
    },
  );

  ngOnInit(): void {
    this.persistData();
  }

  submitForm() {
    this.manifestForm.markAllAsTouched();
    if (this.manifestForm.valid) {
      const manifestNumber = this.manifestForm.controls['manifestNumber'].value;
      this.transferService.manifest.set(manifestNumber);
      this.sessionStorage.set('manifestNumber', manifestNumber);

      const flight = this.manifestForm.controls['numFlight'].value;
      this.transferService.flight.set(flight);
      this.sessionStorage.set('flight', flight);

      this.onSubmitForm.emit(TransferTypeSearch.MANIFEST_NUMBER);
    }
  }

  resetForm() {
    this.manifestForm.reset();
  }

  private persistData() {
    const manifestNumber = this.sessionStorage.get<string>('manifestNumber');
    const numFlight = this.sessionStorage.get<string>('flight');
    if (!!manifestNumber && !!numFlight) {
      try {
        const formValues: any = {};
        formValues.manifestNumber = manifestNumber;
        formValues.numFlight = numFlight;

        this.manifestForm.patchValue(formValues);
        this.transferService.manifest.set(manifestNumber);
        this.transferService.flight.set(numFlight);
        this.onSubmitForm.emit(TransferTypeSearch.MANIFEST_NUMBER);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
