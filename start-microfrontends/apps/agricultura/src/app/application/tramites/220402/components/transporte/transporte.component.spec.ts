import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransporteComponent } from './transporte.component';
import { CatalogoSelectComponent, TituloComponent } from '@libs/shared/data-access-user/src';
import { provideHttpClient } from '@angular/common/http';
import { Solicitud220402Store } from '../../estados/tramites/tramites220402.store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Solicitud220402Query } from '../../estados/queries/tramites220402.query';


describe('TransporteComponent', () => {
  let component: TransporteComponent;
  let fixture: ComponentFixture<TransporteComponent>;
  let solicitud220402StoreMock: any;
  let tramiteQueryMock: any;


  beforeEach(async () => {
    solicitud220402StoreMock = {
      setMediodeTransporte: jest.fn(),
      setIdentificacionDelTransporte: jest.fn(),
    };
    tramiteQueryMock = {
      selectSolicitud$: of({
        identificacionDelTransporte: ''
      }),
    };
    await TestBed.configureTestingModule({
      declarations: [TransporteComponent],
      imports: [CatalogoSelectComponent, TituloComponent, ReactiveFormsModule, FormsModule],
      providers: [provideHttpClient(),
      { provide: Solicitud220402Store, useValue: solicitud220402StoreMock },
      { provide: Solicitud220402Query, useValue: tramiteQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create transporte form on init', () => {
    component.crearFormTransporte();
    expect(component.transporteForm).toBeDefined();
    expect(component.transporteForm.get('mediodeTransporte')).toBeDefined();
    expect(component.transporteForm.get('identificationDelTransporte')).toBeDefined();
  });

  it('should validate form field', () => {
    component.crearFormTransporte();
    const form = component.transporteForm;
    const field = 'mediodeTransporte';
    form.get(field)?.setValue('');
    expect(component.isValid(form, field)).toBeFalsy();
    form.get(field)?.setValue('Some Value');
    expect(form.get(field)?.valid).toBeTruthy();
  });

  it('should mark form as touched if invalid', () => {
    component.crearFormTransporte();
    component.transporteForm.get('mediodeTransporte')?.setValue('');
    component.validarTransporteFormulario();
    expect(component.transporteForm.touched).toBeTruthy();
  });
  it('should disable the form controls when soloLectura is true', () => {
    component.soloLectura = true;
    component.inicializarEstadoFormulario();
    expect(component.transporteForm.disabled).toBe(true);
  });

  it('should enable the form controls when soloLectura is false', () => {
    component.soloLectura = false;
    component.inicializarEstadoFormulario();
    expect(component.transporteForm.enabled).toBe(true);
  });
  it('should call the correct store method with the form value for identificacionDelTransporte', () => {
    component.transporteForm.get('identificacionDelTransporte')?.setValue('ID123');
    component.setValoresStore(component.transporteForm, 'identificacionDelTransporte', 'setIdentificacionDelTransporte');
    expect(solicitud220402StoreMock.setIdentificacionDelTransporte).toHaveBeenCalledWith('ID123');
  });
});
