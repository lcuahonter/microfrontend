import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReprestantanteComponent } from './represtantante.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('ReprestantanteComponent', () => {
  let component: ReprestantanteComponent;
  let fixture: ComponentFixture<ReprestantanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReprestantanteComponent,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReprestantanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const formValues = component.represtantante.value;
    expect(formValues.rfc).toBe(component.datosRepresentativos.rfc);
    expect(formValues.nombre).toBe(component.datosRepresentativos.nombre);
    expect(formValues.apellidoPaterno).toBe(component.datosRepresentativos.apellidoPaterno);
    expect(formValues.apellidoMaterno).toBe(component.datosRepresentativos.apellidoMaterno);
    expect(formValues.telefono).toBe(component.datosRepresentativos.telefono);
    expect(formValues.correo).toBe(component.datosRepresentativos.correo);
  });

  it('should disable specific form controls on initialization', () => {
    expect(component.represtantante.get('rfc')?.disabled).toBe(true);
    expect(component.represtantante.get('nombre')?.disabled).toBe(true);
    expect(component.represtantante.get('apellidoPaterno')?.disabled).toBe(true);
    expect(component.represtantante.get('apellidoMaterno')?.disabled).toBe(true);
  });

  it('should update the store when setValoresStore is called', () => {
    const mockStoreMethod = jest.fn();
    component['tramite32616Store'] = { updateField: mockStoreMethod } as any;

    component.setValoresStore(component.represtantante, 'telefono', 'setTelefono');
    expect(mockStoreMethod).toHaveBeenCalledWith(component.represtantante.get('telefono')?.value);
  });

  it('should unsubscribe from observables on destroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate required fields in the form', () => {
    const form = component.represtantante;
    form.get('telefono')?.setValue('');
    form.get('correo')?.setValue('');

    expect(form.get('telefono')?.valid).toBe(false);
    expect(form.get('correo')?.valid).toBe(false);

    form.get('telefono')?.setValue('1234567890');
    form.get('correo')?.setValue('test@example.com');

    expect(form.get('telefono')?.valid).toBe(true);
    expect(form.get('correo')?.valid).toBe(true);
  });
});
