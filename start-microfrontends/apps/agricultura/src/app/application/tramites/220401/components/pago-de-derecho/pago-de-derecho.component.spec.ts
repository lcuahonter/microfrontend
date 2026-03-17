import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { CatalogoSelectComponent } from '@libs/shared/data-access-user/src';
import { CommonModule } from '@angular/common';
import { PagoDeDerechoComponent } from './pago-de-derecho.component';
import { TituloComponent } from '@libs/shared/data-access-user/src';


describe('PagoDeDerechoComponent', () => {
  let component: PagoDeDerechoComponent;
  let fixture: ComponentFixture<PagoDeDerechoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        TituloComponent,
        CatalogoSelectComponent,
        PagoDeDerechoComponent
      ],
      declarations: [],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoDeDerechoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

 it('should initialize the form with correct controls', () => {
  expect(component.FormSolicitud).toBeDefined();
  expect(component.FormSolicitud.get('exentoDePago')).toBeTruthy();
  expect(component.FormSolicitud.get('Justificacion')).toBeTruthy();
  expect(component.FormSolicitud.get('Banco')).toBeTruthy();
  expect(component.FormSolicitud.get('rfcImportExport')).toBeTruthy();
});
  it('should call getJustificacion and set Justificacion correctly', () => {
    component.getJustificacion();
    expect(component.Justificacion).toEqual([
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ]);
  });

  it('should call getBanco and set Banco correctly', () => {
    component.getBanco();
    expect(component.Banco).toEqual([
      { id: 1, descripcion: 'Si' },
      { id: 2, descripcion: 'No' },
    ]);
  });

it('should update form fields when "exentoDePago" is "No"', () => {
  component.updateFormFieldsBasedOnExentoDePago('No');

  expect(component.FormSolicitud.get('rfcImportExport')?.value).toBe('454000554');
  expect(component.FormSolicitud.get('cadenaDependencia')?.value).toBe('0001012A0000EX');
  expect(component.FormSolicitud.get('importePago')?.value).toBe('594.0');
});


 it('should reset form fields when "exentoDePago" is not "No"', () => {
  component.updateFormFieldsBasedOnExentoDePago('Si');
  
  expect(component.FormSolicitud.get('rfcImportExport')?.value).toBeNull();
  expect(component.FormSolicitud.get('cadenaDependencia')?.value).toBeNull();
  expect(component.FormSolicitud.get('importePago')?.value).toBeNull();
});



});
