import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PlaneacionDelaSeguridadComponent } from './planeacion-de-la-seguridad.component';
import { Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';

describe('PlaneacionDelaSeguridadComponent', () => {
  let component: PlaneacionDelaSeguridadComponent;
  let fixture: ComponentFixture<PlaneacionDelaSeguridadComponent>;
  let mockStore: jest.Mocked<Solicitud32605Store>;
  let mockQuery: jest.Mocked<Solicitud32605Query>;
  let formBuilder: FormBuilder;

  const mockSolicitudState = {
    perfiles: {
      comiteSeguridad: 'Si',
      fuentesInformacion: 'No',
      politica: 'Si',
      indique: 'Descripcion ejemplo',
      periodicidadDos: 'Mensual',
      programa: 'Si',
      capacitacion: 'No',
      procedimiento: 'Si',
      descripcionProcedimiento: 'Descripcion procedimiento',
      nombreProcedimiento: 'Nombre procedimiento'
    }
  };
 
  beforeEach(async () => {
    mockStore = {
      actualizarEstado: jest.fn(),
    } as any;

    mockQuery = {
      selectSolicitud$: of(mockSolicitudState),
    } as any;

    await TestBed.configureTestingModule({
      imports: [PlaneacionDelaSeguridadComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Solicitud32605Store, useValue: mockStore },
        { provide: Solicitud32605Query, useValue: mockQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaneacionDelaSeguridadComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('setValoresStore', () => {
    let testForm: FormGroup;

    beforeEach(() => {
      testForm = formBuilder.group({
        comiteSeguridad: ['Si'],
        fuentesInformacion: ['No'],
        politica: ['Si'],
        campoVacio: [''],
        campoNulo: [null],
        campoUndefined: [undefined],
      });
    });

    it('debería actualizar el store cuando el formulario y control son válidos', () => {
      component.setValoresStore(testForm, 'comiteSeguridad');

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { comiteSeguridad: 'Si' }
      });
    });

    it('debería actualizar el store con diferentes tipos de valores', () => {
      component.setValoresStore(testForm, 'fuentesInformacion');
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { fuentesInformacion: 'No' }
      });

      component.setValoresStore(testForm, 'politica');
      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { politica: 'Si' }
      });
    });

    it('debería actualizar el store incluso con string vacío', () => {
      component.setValoresStore(testForm, 'campoVacio');

      expect(mockStore.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { campoVacio: '' }
      });
    });

    it('no debería actualizar el store cuando el formulario es null', () => {
      component.setValoresStore(null, 'comiteSeguridad');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el control es null', () => {
      component.setValoresStore(testForm, 'campoNulo');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el control es undefined', () => {
      component.setValoresStore(testForm, 'campoUndefined');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debería actualizar el store cuando el campo no existe en el formulario', () => {
      component.setValoresStore(testForm, 'campoInexistente');

      expect(mockStore.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debería manejar correctamente múltiples llamadas al store', () => {
      component.setValoresStore(testForm, 'comiteSeguridad');
      component.setValoresStore(testForm, 'fuentesInformacion');

      expect(mockStore.actualizarEstado).toHaveBeenCalledTimes(2);
      expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(1, {
        perfiles: { comiteSeguridad: 'Si' }
      });
      expect(mockStore.actualizarEstado).toHaveBeenNthCalledWith(2, {
        perfiles: { fuentesInformacion: 'No' }
      });
    });
  });

  describe('inputChecked', () => {
    beforeEach(() => {
      component.anexe = false;
    });

    it('debería establecer anexe como true cuando checkBoxValue es "1"', () => {
      component.inputChecked('1');
      
      expect(component.anexe).toBe(true);
    });

    it('debería establecer anexe como true cuando checkBoxValue es 1 (número)', () => {
      component.inputChecked(1);
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es "0"', () => {
      component.anexe = true;
      component.inputChecked('0');
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es 0 (número)', () => {
      component.anexe = true; 
      component.inputChecked(0);
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es string vacío', () => {
      component.anexe = true;
      component.inputChecked('');
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es "false"', () => {
      component.anexe = true;
      component.inputChecked('false');
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es "true"', () => {
      component.anexe = true;
      component.inputChecked('true');
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es null', () => {
      component.anexe = true;
      component.inputChecked(null as any);
      
      expect(component.anexe).toBe(false);
    });

    it('debería establecer anexe como false cuando checkBoxValue es undefined', () => {
      component.anexe = true;
      component.inputChecked(undefined as any);
      
      expect(component.anexe).toBe(false);
    });

    it('debería manejar múltiples cambios de estado correctamente', () => {
      expect(component.anexe).toBe(false);
      
      
      component.inputChecked('1');
      expect(component.anexe).toBe(true);
      
      
      component.inputChecked('0');
      expect(component.anexe).toBe(false);
      
      component.inputChecked('1');
      expect(component.anexe).toBe(true);
      
      component.inputChecked('anything');
      expect(component.anexe).toBe(false);
    });
  });
});
