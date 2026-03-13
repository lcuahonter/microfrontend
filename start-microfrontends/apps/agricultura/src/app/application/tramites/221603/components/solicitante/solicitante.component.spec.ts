import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { SolicitanteComponent } from './solicitante.component';

import { DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL, FormulariosService, PERSONA_FISICA_NACIONAL, PERSONA_MORAL_NACIONAL, SolicitanteService, TIPO_PERSONA, TituloComponent } from '@libs/shared/data-access-user/src';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;
  let fixture: ComponentFixture<SolicitanteComponent>;
  let solicitanteService: SolicitanteService;
  let formulariosService: FormulariosService;

  const mockSolicitanteService = {
    getDatosGenerales: jest.fn().mockReturnValue(
      of({
        data: JSON.stringify({
          datosGenerales: { nombre: 'John Doe', rfc: 'DOEJ123456' },
          domicilioFiscal: { calle: 'Main St', numero: '123' },
        }),
      })
    ),
  };

  const mockFormulariosService = {
    obtenerNombresCamposForm: jest.fn().mockReturnValue(['nombre', 'rfc', 'calle', 'numero']),
    agregarValorCampoDesactivado: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitanteComponent],
      imports: [ReactiveFormsModule, TituloComponent],
      providers: [
        FormBuilder,
        { provide: SolicitanteService, useValue: mockSolicitanteService },
        { provide: FormulariosService, useValue: mockFormulariosService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    solicitanteService = TestBed.inject(SolicitanteService);
    formulariosService = TestBed.inject(FormulariosService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with datosGenerales and domicilioFiscal groups', () => {
    expect(component.form.contains('datosGenerales')).toBe(true);
    expect(component.form.contains('domicilioFiscal')).toBe(true);
  });

  it('should call obtenerTipoPersona and set the correct persona and domicilioFiscal configuration for FISICA_NACIONAL', () => {
    component.obtenerTipoPersona(TIPO_PERSONA.FISICA_NACIONAL);
    expect(component.persona).toEqual(PERSONA_FISICA_NACIONAL);
    expect(component.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
  });

  it('should call obtenerTipoPersona and set the correct persona and domicilioFiscal configuration for MORAL_NACIONAL', () => {
    component.obtenerTipoPersona(TIPO_PERSONA.MORAL_NACIONAL);
    expect(component.persona).toEqual(PERSONA_MORAL_NACIONAL);
    expect(component.domicilioFiscal).toEqual(DOMICILIO_FISCAL_PERSONA_MORAL_O_FISICA_NACIONAL);
  });

  it('should initialize form groups with the correct controls', () => {
    component.inicializarFormGroup(PERSONA_FISICA_NACIONAL, 'datosGenerales');
    const datosGeneralesForm = component.datosGeneralesForm;
    expect(datosGeneralesForm.contains('nombre')).toBe(true);
    expect(datosGeneralesForm.contains('rfc')).toBe(true);
  });

  it('should return datosGeneralesForm as a FormGroup', () => {
    expect(component.datosGeneralesForm).toBeInstanceOf(FormGroup);
  });

  it('should return domicilioFiscalForm as a FormGroup', () => {
    expect(component.domicilioFiscalForm).toBeInstanceOf(FormGroup);
  });

  it('should get validators correctly', () => {
    const validators = SolicitanteComponent.getValidators(['required', 'maxLength:10', 'pattern:^[a-zA-Z]+$']);
    expect(validators.length).toBe(3);
    expect(validators[0]).toBe(Validators.required);
  });

  it('should handle empty validators array in getValidators', () => {
    const validators = SolicitanteComponent.getValidators([]);
    expect(validators.length).toBe(0);
  });
});