jest.mock('libs/shared/theme/assets/json/110210/datos-del-destinatario.json', () => ({
  default: {
    nombres: 'Juan',
    primerApellido: 'Pérez',
    segundoApellido: 'García',
    numeroRegistroFiscal: 'RFC123456',
    razonSocial: 'Empresa S.A. de C.V.'
  }
}));

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelDestinatarioComponent } from './datos-del-destinatario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Tramite110210Query } from '../../estados/queries/tramite110210.query';
import { Tramite110210Store } from '../../estados/store/tramite110210.store';
import { of } from 'rxjs';
import mockData from 'libs/shared/theme/assets/json/110210/datos-del-destinatario.json';

describe('DatosDelDestinatarioComponent', () => {
  let component: DatosDelDestinatarioComponent;
  let fixture: ComponentFixture<DatosDelDestinatarioComponent>;

  const mockStore = {
    setNombres: jest.fn(),
    setPrimerApellido: jest.fn(),
    setSegundoApellido: jest.fn(),
    setNumeroRegistroFiscal: jest.fn(),
    setRazonSocial: jest.fn(),
  };

  const mockQuery = {
    selectTramite110210$: of({
      nombres: 'STORED_NOMBRES',
      primerApellido: 'STORED_APELLIDO1',
      segundoApellido: 'STORED_APELLIDO2',
      numeroRegistroFiscal: 'STORED_RFC',
      razonSocial: 'STORED_RS'
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosDelDestinatarioComponent, ReactiveFormsModule],
      providers: [
        { provide: Tramite110210Store, useValue: mockStore },
        { provide: Tramite110210Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('debe crear el componente', () => {
      expect(component).toBeTruthy();
    });

    it('debe inicializar los controles del formulario', () => {
      expect(component.solicitudForm.contains('nombres')).toBe(true);
      expect(component.solicitudForm.contains('primerApellido')).toBe(true);
      expect(component.solicitudForm.contains('segundoApellido')).toBe(true);
      expect(component.solicitudForm.contains('numeroRegistroFiscal')).toBe(true);
      expect(component.solicitudForm.contains('razonSocial')).toBe(true);
    });

    it('debe establecer valores del store y sobrescribir con mockData', () => {
      expect(component.solicitudForm.get('nombres')?.value).toBe('Juan'); 
      expect(component.solicitudForm.get('primerApellido')?.value).toBe('Pérez');
      expect(component.solicitudForm.get('segundoApellido')?.value).toBe('García');
      expect(component.solicitudForm.get('numeroRegistroFiscal')?.value).toBe('RFC123456');
      expect(component.solicitudForm.get('razonSocial')?.value).toBe('Empresa S.A. de C.V.');
    });

    it('debe establecer los valores del formulario desde mockData', () => {
      component.setFormValues();
      expect(component.solicitudForm.get('nombres')?.value).toBe(mockData.nombres);
      expect(component.solicitudForm.get('primerApellido')?.value).toBe(mockData.primerApellido);
      expect(component.solicitudForm.get('segundoApellido')?.value).toBe(mockData.segundoApellido);
      expect(component.solicitudForm.get('numeroRegistroFiscal')?.value).toBe(mockData.numeroRegistroFiscal);
      expect(component.solicitudForm.get('razonSocial')?.value).toBe(mockData.razonSocial);
    });

    it('debe actualizar el store con los valores actuales del formulario', () => {
      component.setFormValues();
      component['updateStore']();

      expect(mockStore.setNombres).toHaveBeenCalledWith(mockData.nombres);
      expect(mockStore.setPrimerApellido).toHaveBeenCalledWith(mockData.primerApellido);
      expect(mockStore.setSegundoApellido).toHaveBeenCalledWith(mockData.segundoApellido);
      expect(mockStore.setNumeroRegistroFiscal).toHaveBeenCalledWith(mockData.numeroRegistroFiscal);
      expect(mockStore.setRazonSocial).toHaveBeenCalledWith(mockData.razonSocial);
    });
  });
