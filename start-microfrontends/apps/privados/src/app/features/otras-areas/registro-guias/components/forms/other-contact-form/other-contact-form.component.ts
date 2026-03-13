import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { IntegerOnlyDirective } from '@/shared/directives/integer-only.directive';
import { FormUtils } from '@/shared/utils/formUtils';
import { NgClass, NgIf } from '@angular/common';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { OtherContactForm } from '../../../interfaces/guides-register.interface';

@Component({
  selector: 'app-other-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, Tooltip, ButtonComponent, IntegerOnlyDirective, NgIf, NgClass],
  templateUrl: './other-contact-form.component.html',
})
export class OtherContactFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private registerGuideService = inject(RegisterGuideService);
  isUpdating: boolean = false;
  contactTemporalId: number | null = null;
  formUtils = FormUtils;
  contactForm = this.formBuilder.group({
    personName: [null, Validators.required],
    departmentName: [null],
    telephone: [null],
    emailAddress: [null, [Validators.email]],
  });

  ngOnInit(): void {
    this.setValuesIfIsUpdating();
  }

  onSubmit(): void {
    this.contactForm.markAllAsTouched();

    if (this.contactForm.valid) {
      if (this.isUpdating) {
        let contacts = this.sessionStorage.get<OtherContactForm[]>('otherContacts');
        if (!!contacts) {
          try {
            contacts = contacts.map((contact) => {
              if (contact.temporalId === this.contactTemporalId) {
                return {
                  ...this.contactForm.value,
                  temporalId: contact.temporalId,
                } as unknown as OtherContactForm;
              }
              return {
                ...contact,
              };
            });
            this.registerGuideService.otherContacts = contacts;
            this.sessionStorage.set('otherContacts', contacts);
            this.sessionStorage.remove('contactToUpdate');
            this.onCancel();
          } catch (e) {
            // Ignore error if parsing fails
          }
        }
      } else {
        const contact = this.contactForm.value as unknown as OtherContactForm;
        this.registerGuideService.otherContacts = [
          ...(this.registerGuideService.otherContacts ?? []),
          { ...contact, temporalId: Date.now() },
        ];
        this.sessionStorage.set('otherContacts', this.registerGuideService.otherContacts);
        this.onCancel();
      }
    }
  }

  onCancel(): void {
    this.sessionStorage.remove('contactToUpdate');
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.PERSONAS,
    ]);
  }

  private setValuesIfIsUpdating() {
    const contactToUpdate = this.sessionStorage.get<OtherContactForm>('contactToUpdate');

    if (!!contactToUpdate) {
      this.isUpdating = true;
      this.contactTemporalId = contactToUpdate.temporalId || null;
      try {
        const formValues: any = {};
        formValues.contactToUpdate = {
          ...contactToUpdate,
        };
        this.contactForm.patchValue(formValues.contactToUpdate);
      } catch (e) {
        // Ignore error if parsing fails
      }
    }
  }
}
