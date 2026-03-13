import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { DomicilioDelDestinatarioComponent } from './domicilio-del-destinatario.component';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';
import { Tramite110210Store } from '../../estados/store/tramite110210.store';

jest.mock('libs/shared/theme/assets/json/110210/domicilio-del-destinatario.json', () => {
  return {
    __esModule: true,
    default: {
      ciudad: 'Mock City',
      calle: 'Mock Street',
      numeroLetra: '123C',
      telefono: '5555555555',
      fax: '1111111111',
      correoElectronico: 'mock@example.com',
      observaciones: 'Mock Observations',
    },
  };
});

describe('DomicilioDelDestinatarioComponent', () => {
  let component: DomicilioDelDestinatarioComponent;
  let fixture: ComponentFixture<DomicilioDelDestinatarioComponent>;
  let tramite110210QueryMock: jest.Mocked<Tramite110210Query>;
  let tramite110210StoreMock: jest.Mocked<Tramite110210Store>;

  beforeEach(async () => {
    tramite110210QueryMock = {
      selectTramite110210$: of({
        ciudad: 'Test City',
        calle: 'Test Street',
        numeroLetra: '123A',
        telefono: '1234567890',
        fax: '0987654321',
        correoElectronico: 'test@example.com',
        observaciones: 'Test Observations',
      }),
    } as unknown as jest.Mocked<Tramite110210Query>;

    tramite110210StoreMock = {
      setCiudad: jest.fn(),
      setCalle: jest.fn(),
      setNumeroLetra: jest.fn(),
      setTelefono: jest.fn(),
      setFax: jest.fn(),
      setCorreoElectronico: jest.fn(),
      setObservaciones: jest.fn(),
    } as unknown as jest.Mocked<Tramite110210Store>;

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DomicilioDelDestinatarioComponent],
      providers: [
        FormBuilder,
        { provide: Tramite110210Query, useValue: tramite110210QueryMock },
        { provide: Tramite110210Store, useValue: tramite110210StoreMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomicilioDelDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer manualmente los valores del formulario usando setFormValues()', () => {
    component.setFormValues();

    expect(component.solicitudForm.get('ciudad')?.value).toBe('Mock City');
    expect(component.solicitudForm.get('calle')?.value).toBe('Mock Street');
    expect(component.solicitudForm.get('telefono')?.value).toBe('5555555555');
    expect(component.solicitudForm.get('correoElectronico')?.value).toBe('mock@example.com');
  });

  it('debería actualizar el store con los valores del formulario en updateStore()', () => {
    component.solicitudForm.patchValue({
      ciudad: 'Ciudad Actualizada',
      calle: 'Calle Actualizada',
      numeroLetra: '456B',
      telefono: '9876543210',
      fax: '0123456789',
      correoElectronico: 'actualizado@example.com',
      observaciones: 'Observaciones Actualizadas',
    });

    component.updateStore();

    expect(tramite110210StoreMock.setCiudad).toHaveBeenCalledWith('Ciudad Actualizada');
    expect(tramite110210StoreMock.setCalle).toHaveBeenCalledWith('Calle Actualizada');
    expect(tramite110210StoreMock.setNumeroLetra).toHaveBeenCalledWith('456B');
    expect(tramite110210StoreMock.setTelefono).toHaveBeenCalledWith('9876543210');
    expect(tramite110210StoreMock.setFax).toHaveBeenCalledWith('0123456789');
    expect(tramite110210StoreMock.setCorreoElectronico).toHaveBeenCalledWith('actualizado@example.com');
    expect(tramite110210StoreMock.setObservaciones).toHaveBeenCalledWith('Observaciones Actualizadas');
  });

  it('debería desuscribirse de destroy$ en ngOnDestroy()', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  
  it('debería inicializar el formulario en ngOnInit y establecer valores desde mockData', () => {
    expect(component.solicitudForm).toBeDefined();
    expect(component.solicitudForm.get('ciudad')?.value).toBe('Mock City');
    expect(component.solicitudForm.get('calle')?.value).toBe('Mock Street');
    expect(component.solicitudForm.get('numeroLetra')?.value).toBe('123C');
  });
  
});