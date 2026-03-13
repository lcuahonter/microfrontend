import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DatosGeneralesComponent } from './datos-generales.component';
import TipoPersonaBtn from 'libs/shared/theme/assets/json/260402/tipoPersonaBtn.json';

describe('DatosGeneralesComponent', () => {
  let component: DatosGeneralesComponent;
  let fixture: ComponentFixture<DatosGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,DatosGeneralesComponent],
      declarations: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosGeneralesComponent);
    component = fixture.componentInstance;
    component.radioBtn = TipoPersonaBtn; 
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.ngOnInit();
    expect(component.datosGeneralesForm).toBeDefined();
    expect(component.datosGeneralesForm.controls['tipoPersona']).toBeDefined();
  });

  it('should emit cancelDatosGenerales event', () => {
    spyOn(component.cancelDatosGenerales, 'emit');
    component.closeDatosGenerales();
    expect(component.cancelDatosGenerales.emit).toHaveBeenCalled();
  });

  it('should validate required form fields', () => {
    component.ngOnInit();

    const form = component.datosGeneralesForm;
    form.controls['tipoPersona'].setValue('');
    form.controls['razonSocial'].setValue('');
    form.controls['pais'].setValue('');
    form.controls['calle'].setValue('');
    form.controls['numeroExterior'].setValue('');

    expect(form.controls['tipoPersona'].valid).toBeFalsy();
    expect(form.controls['razonSocial'].valid).toBeFalsy();
    expect(form.controls['pais'].valid).toBeFalsy();
    expect(form.controls['calle'].valid).toBeFalsy();
    expect(form.controls['numeroExterior'].valid).toBeFalsy();
  });

  it('should emit formularioGuardar event when the form is valid', () => {
    spyOn(component.formularioGuardar, 'emit');
    component.ngOnInit();

    const form = component.datosGeneralesForm;
    form.controls['tipoPersona'].setValue('Persona Fisica');
    form.controls['razonSocial'].setValue('Example Corp');
    form.controls['pais'].setValue('India');
    form.controls['calle'].setValue('Example Street');
    form.controls['numeroExterior'].setValue('123');

    expect(form.valid).toBeTruthy();

    component.enviarFormulario();
    expect(component.formularioGuardar.emit).toHaveBeenCalledWith(form.value);
  });
});
