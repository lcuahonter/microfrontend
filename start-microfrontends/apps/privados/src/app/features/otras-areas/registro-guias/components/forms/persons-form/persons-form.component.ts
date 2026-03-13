import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Tooltip } from '@/shared/components/tooltip/tooltip.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterGuideService } from '../../../services/register-guide.service';
import { ButtonComponent } from '@/shared/components/button/button.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { FormUtils } from '@/shared/utils/formUtils';
import { TableComponent } from '@/shared/components/table/table.component';
import { TableBodyData, TableData } from '@/shared/interfaces/table.interface';
import { RoutingService } from '@/core/services/routing.service';
import { STORE_FRONT_ROUTES } from '@/routes.constants';
import { OTRAS_AREAS_ROUTES } from '../../../../otras-areas.routes.constants';
import { REGISTRO_GUIAS_ROUTES } from '../../../registro-guias.routes.constants';
import { SessionStorageService } from '@/shared/services/session-storage.service';
import { CatologsRegisterGuideService } from '../../../services/catologs-register-guide.service';
import { Subject, take, takeUntil, tap } from 'rxjs';
import { Country, PersonType, Rol } from '../../../interfaces/catalogs.interface';
import { OtherContactForm, PersonsForm } from '../../../interfaces/guides-register.interface';
import { DialogComponent } from '@/shared/components/dialog/dialog.component';
declare const $: any;

@Component({
  selector: 'app-persons-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ButtonComponent,
    NgClass,
    NgIf,
    NgForOf,
    TableComponent,
    DialogComponent,
  ],
  templateUrl: './persons-form.component.html',
})
export class PersonsFormComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private registerGuideService = inject(RegisterGuideService);
  private routingService = inject(RoutingService);
  private sessionStorage = inject(SessionStorageService);
  private catalogsService = inject(CatologsRegisterGuideService);
  private destroy$ = new Subject<void>();
  tableContactData = signal<TableData>({
    headers: ['Person Name', 'Department Name', 'Phone Number', 'Email Address'],
    body: [],
  });
  isLoadingContactData = signal<boolean>(false);
  hiddenContactData = signal<Object[]>([]);
  errorContactData = false;
  warningText = '';
  displayWarning = false;
  formUtils = FormUtils;
  personTypes: PersonType[] = [];
  displayDeleteBtnContact = signal<boolean>(false);
  displayUpdateBtnContact = signal<boolean>(false);
  contactRowsSelected: TableBodyData[] = [];
  countries: Country[] = [];
  rolesParts: Rol[] = [];
  personsForm = this.formBuilder.group({
    typePerson: [null, Validators.required],
    name: [null, Validators.required],
    streetName: [null, Validators.required],
    cityName: [null, Validators.required],
    countryId: ['', Validators.required],
    countryName: [''],
    roleId: [null],
    roleName: [null],
  });

  get otherSelected() {
    return String(this.personsForm.get('typePerson')?.value) === 'Other';
  }

  get hasConsignee(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Consignee');
  }

  get hasConsignor(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Consignor');
  }

  get hasFreightForwarder(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Freight Forwarder');
  }
  get hasOther(): boolean {
    return !!this.registerGuideService.persons?.some((p) => p.typePerson === 'Other');
  }

  ngOnInit(): void {
    this.getTypePersons();
    this.getNameCountries();
    this.getRolesParts();
    this.listeIdSelectChanges();
    this.handleTypePersonChanges();
    this.loadTablesData();
    this.listenIdSelectsChanges();
  }

  private listenIdSelectsChanges() {
    this.personsForm.controls['roleId'].valueChanges
      .pipe(
        tap((value) => {
          this.personsForm.controls['roleName'].setValue(value);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private loadTablesData() {
    const contacts = this.registerGuideService.otherContacts;
    if (!!contacts) {
      const body = contacts.map((contact) => [
        contact.personName,
        contact.departmentName ?? '',
        contact.telephone ?? '',
        contact.emailAddress ?? '',
      ]);

      this.tableContactData.set({ ...this.tableContactData(), body });
      this.hiddenContactData.set(contacts);
    }
  }

  displayDeleteModal() {
    $('#registerDeletedContact').modal();
  }

  contactSelected(rowsSelected: TableBodyData[]) {
    this.contactRowsSelected = rowsSelected;
    if (!!rowsSelected && rowsSelected.length === 1) {
      this.displayDeleteBtnContact.set(true);
      this.displayUpdateBtnContact.set(true);
    } else {
      this.displayDeleteBtnContact.set(false);
      this.displayUpdateBtnContact.set(true);
    }
  }

  updateContact() {
    this.sessionStorage.set('contactToUpdate', this.contactRowsSelected[0].hiddenData);
    this.addContact();
  }

  removeContact() {
    this.tableContactData.set({ ...this.tableContactData(), body: [] });
    this.registerGuideService.otherContacts = this.registerGuideService.otherContacts
      ? this.registerGuideService.otherContacts.filter(
          (contact) => contact.temporalId !== this.contactRowsSelected[0].hiddenData.temporalId,
        )
      : null;
    this.sessionStorage.set('otherContacts', this.registerGuideService.otherContacts);
    this.displayDeleteBtnContact.set(false);
    this.loadTablesData();
    this.displayDeleteModal();
  }

  private handleTypePersonChanges(): void {
    this.personsForm
      .get('typePerson')
      ?.valueChanges.pipe(
        tap((typePerson) => {
          if (typePerson === 'Consignor' && this.hasConsignor) {
            this.warningText = 'Type Person: Consignor ya fue agregado';
            this.displayWarning = true;
          } else if (typePerson === 'Consignee' && this.hasConsignee) {
            this.warningText = 'Type Person: Consignee ya fue agregado';
            this.displayWarning = true;
          } else if (typePerson === 'Freight Forwarder' && this.hasFreightForwarder) {
            this.warningText = 'Type Person: Freight Forwarder ya fue agregado';
            this.displayWarning = true;
          } else if (typePerson === 'Other' && this.hasOther) {
            this.warningText = 'Type Person: Other ya fue agregado';
            this.displayWarning = true;
          } else {
            this.warningText = '';
            this.displayWarning = false;
          }
          if (typePerson === 'Other') {
            this.personsForm.get('roleId')?.setValidators([Validators.required]);
          } else {
            this.personsForm.get('roleId')?.clearValidators();
            this.personsForm.get('roleId')?.setValue(null);
            this.personsForm.get('roleName')?.setValue(null);
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  onSubmit() {
    this.personsForm.markAllAsTouched();
    if (this.personsForm.valid && !this.displayWarning) {
      const contacts = this.sessionStorage.get<OtherContactForm[]>('otherContacts');
      const roleId = this.personsForm.value.roleId;
      const persons = {
        ...this.personsForm.value,
        countryId: this.personsForm.value.countryId?.split('|')[0],
        roleRealId: roleId ? this.rolesParts.filter((rol) => rol.valor === roleId)[0].clave : null,
        contacts: Array.isArray(contacts) && contacts.length > 0 ? contacts : [],
      } as unknown as PersonsForm;

      this.registerGuideService.persons = [...(this.registerGuideService.persons ?? []), persons];
      this.sessionStorage.set('persons', this.registerGuideService.persons);
      this.registerGuideService.goToTabsPage();
      this.sessionStorage.remove('otherContacts');
      this.registerGuideService.otherContacts = [];
    }
  }

  onCancel(): void {
    this.registerGuideService.goToTabsPage();
    this.sessionStorage.remove('personsForm');
    this.sessionStorage.remove('otherContacts');
    this.registerGuideService.otherContacts = [];
  }

  addContact() {
    this.routingService.navigate([
      STORE_FRONT_ROUTES.OTRAS_AREAS,
      OTRAS_AREAS_ROUTES.REGISTRO_GUIAS_AEREAS,
      REGISTRO_GUIAS_ROUTES.OTRO_CONTACTO,
    ]);
  }

  private getNameCountries() {
    this.catalogsService
      .getNameCountries()
      .pipe(
        tap((countries: Country[]) => {
          this.countries = countries;
        }),
        take(1),
      )
      .subscribe();
  }

  private getTypePersons() {
    this.catalogsService
      .getTypePersons()
      .pipe(
        tap((personTypes: PersonType[]) => {
          this.personTypes = personTypes;
        }),
        take(1),
      )
      .subscribe();
  }

  private listeIdSelectChanges() {
    this.personsForm.controls['countryId'].valueChanges
      .pipe(
        tap((value) => {
          if (!value) {
            return;
          }
          this.personsForm.controls['countryName'].setValue(value?.split('|')[1]);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getRolesParts() {
    this.catalogsService
      .getRolesParts()
      .pipe(
        tap((rolesParts: Rol[]) => {
          this.rolesParts = rolesParts;
        }),
        take(1),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
