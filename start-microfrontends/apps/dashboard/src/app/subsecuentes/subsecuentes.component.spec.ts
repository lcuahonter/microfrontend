// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SubsecuentesComponent } from './subsecuentes.component';
import {
  TituloComponent,
  AcusesYResolucionesFolioDelTramiteBusquedaComponent,
} from '@ng-mf/data-access-user';
import { HttpClientModule } from '@angular/common/http';
describe('SubsecuentesComponent', () => {
  let component: SubsecuentesComponent;
  let fixture: ComponentFixture<SubsecuentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        SubsecuentesComponent,
        TituloComponent,
        AcusesYResolucionesFolioDelTramiteBusquedaComponent,
        HttpClientModule,
      ],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(SubsecuentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form group with expected controls', () => {
    const form = component.busquedaForm;
    expect(form.contains('folioDelTramite')).toBe(true);
    expect(form.contains('fechaInicial')).toBe(true);
    expect(form.contains('fechaFinal')).toBe(true);
  });

  it('should initialize form controls with empty values', () => {
    expect(component.busquedaForm.get('folioDelTramite')?.value).toBe('');
    expect(component.busquedaForm.get('fechaInicial')?.value).toBe('');
    expect(component.busquedaForm.get('fechaFinal')?.value).toBe('');
  });

  it('should allow setting and retrieving form control values', () => {
    const form = component.busquedaForm;

    form.get('folioDelTramite')?.setValue('ABC123');
    form.get('fechaInicial')?.setValue('2024-01-01');
    form.get('fechaFinal')?.setValue('2024-01-31');

    expect(form.get('folioDelTramite')?.value).toBe('ABC123');
    expect(form.get('fechaInicial')?.value).toBe('2024-01-01');
    expect(form.get('fechaFinal')?.value).toBe('2024-01-31');
  });

  it('should have the correct procedureUrl', () => {
    expect(component.procedureUrl).toBe('/aga/subsecuentes');
  });
});
