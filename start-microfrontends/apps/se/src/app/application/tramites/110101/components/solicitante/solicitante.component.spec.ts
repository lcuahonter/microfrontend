// mock solicitante.json
jest.mock('@libs/shared/theme/assets/json/110101/solicitante-mockdata.json', () => ({
  __esModule: true,
  default: {
    rfc: 'AAL0409235E6',
    denominacion: 'AGRICOLA ALPE S DE RL DE CV',
    actividadEconomica: 'Siembra, cultivo y cosecha de papa',
    correoElectronico: 'vucem2.5@hotmail.com'
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import mockData from '@libs/shared/theme/assets/json/110101/solicitante-mockdata.json';
import { Tramite110101Store } from '../../estados/tramites/solicitante110101.store';
import { SolicitanteComponent } from './solicitante.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('SolicitanteComponent', () => {
  let component: SolicitanteComponent;
  let fixture: ComponentFixture<SolicitanteComponent>;
  let mockStore: Partial<Record<keyof Tramite110101Store, jest.Mock>>;

  beforeEach(async () => {
    mockStore = {
      setRfc: jest.fn(),
      setDenominacion: jest.fn(),
      setActividadEconomica: jest.fn(),
      setCorreoElectronico: jest.fn(),
      _select: jest.fn().mockReturnValue(of({})), // Mock _select to return an observable
      // Add any additional observable properties expected by the component
    };

    await TestBed.configureTestingModule({
      imports: [SolicitanteComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Tramite110101Store, useValue: mockStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con los valores de mockData', () => {
    expect(component.solicitudForm.value).toEqual({
      rfc: mockData.rfc,
      denominacion: mockData.denominacion,
      actividadEconomica: mockData.actividadEconomica,
      correoElectronico: mockData.correoElectronico
    });
  });

  it('debe establecer los valores del formulario desde mockData', () => {
    component.setFormValues();
    expect(component.solicitudForm.get('rfc')?.value).toBe(mockData.rfc);
    expect(component.solicitudForm.get('denominacion')?.value).toBe(mockData.denominacion);
    expect(component.solicitudForm.get('actividadEconomica')?.value).toBe(mockData.actividadEconomica);
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe(mockData.correoElectronico);
  });

  it('debe renderizar los campos del formulario como solo lectura', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#rfc').readOnly).toBeTruthy();
    expect(compiled.querySelector('#denominacion').readOnly).toBeTruthy();
    expect(compiled.querySelector('#actividad-economica').readOnly).toBeTruthy();
    expect(compiled.querySelector('#correo-electronico').readOnly).toBeTruthy();
  });

  it('debe actualizar el store con los valores del formulario', () => {
    component.solicitudForm.setValue({
      rfc: 'TEST123456789',
      denominacion: 'Test Denominacion',
      actividadEconomica: 'Test Actividad',
      correoElectronico: 'test@example.com',
    });

    component['updateStore']();

    expect(mockStore.setRfc).toHaveBeenCalledWith('TEST123456789');
    expect(mockStore.setDenominacion).toHaveBeenCalledWith('Test Denominacion');
    expect(mockStore.setActividadEconomica).toHaveBeenCalledWith('Test Actividad');
    expect(mockStore.setCorreoElectronico).toHaveBeenCalledWith('test@example.com');
  });
});