import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CapacitacionSeguridadComponent } from './capacitacion-seguridad.component';
import { Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';

describe('CapacitacionSeguridadComponent', () => {
  let component: CapacitacionSeguridadComponent;
  let fixture: ComponentFixture<CapacitacionSeguridadComponent>;
  let tramiteStoreSpy: jest.Mocked<Solicitud32605Store>;
  let tramiteQuerySpy: jest.Mocked<Solicitud32605Query>;
  let formBuilder: FormBuilder;

  const mockSolicitudState = {
    perfiles: {
      mediosTransporte: 'Valor medios transporte',
      estaDifusion: 'Valor difusión',
      enunciativaLimitativa: 'Valor limitativa',
      procedimientosEmpresa: 'Valor procedimientos',
      mediosDeTransporte: 'Valor medios de transporte'
    }
  };

  beforeEach(async () => {
    tramiteStoreSpy = {
      actualizarEstado: jest.fn()
    } as any;

    tramiteQuerySpy = {
      selectSolicitud$: of(mockSolicitudState)
    } as any;

    await TestBed.configureTestingModule({
      imports: [CapacitacionSeguridadComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Solicitud32605Store, useValue: tramiteStoreSpy },
        { provide: Solicitud32605Query, useValue: tramiteQuerySpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacitacionSeguridadComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.crearFormularioDeGestion();
    });

    it('debe retornar early cuando no hay formulario capacitacion', () => {
     
      component.capacitacion = null as any;
      component.solicitudState = mockSolicitudState as any;
      const spySetValue = jest.spyOn(formBuilder, 'group');

     
      component.actualizarFormularioConEstado();

      expect(spySetValue).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando no hay solicitudState', () => {
     
      component.solicitudState = null as any;
      const controlSpy = jest.spyOn(component.capacitacion.get('mediosTransporte')!, 'setValue');

     
      component.actualizarFormularioConEstado();

     
      expect(controlSpy).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando no hay perfiles en solicitudState', () => {
     
      component.solicitudState = {} as any;
      const controlSpy = jest.spyOn(component.capacitacion.get('mediosTransporte')!, 'setValue');

     
      component.actualizarFormularioConEstado();

     
      expect(controlSpy).not.toHaveBeenCalled();
    });

    it('debe actualizar controles del formulario con valores del estado', () => {
     
      component.solicitudState = mockSolicitudState as any;
      
      component.capacitacion.get('mediosTransporte')?.setValue('Valor anterior');
      component.capacitacion.get('estaDifusion')?.setValue('Otro valor');
      
      const controlMediosTransporte = component.capacitacion.get('mediosTransporte');
      const controlEstaDifusion = component.capacitacion.get('estaDifusion');
      const spyMediosTransporte = jest.spyOn(controlMediosTransporte!, 'setValue');
      const spyEstaDifusion = jest.spyOn(controlEstaDifusion!, 'setValue');

     
      component.actualizarFormularioConEstado();

     
      expect(spyMediosTransporte).toHaveBeenCalledWith('Valor medios transporte', { emitEvent: false });
      expect(spyEstaDifusion).toHaveBeenCalledWith('Valor difusión', { emitEvent: false });
    });

    it('no debe actualizar controles que ya tienen el mismo valor', () => {
     
      component.solicitudState = mockSolicitudState as any;
      
      component.capacitacion.get('mediosTransporte')?.setValue('Valor medios transporte');
      
      const control = component.capacitacion.get('mediosTransporte');
      const spy = jest.spyOn(control!, 'setValue');

     
      component.actualizarFormularioConEstado();

     
      expect(spy).not.toHaveBeenCalled();
    });

    it('no debe actualizar controles con valores undefined, null o vacíos en el estado', () => {
     
      component.solicitudState = {
        perfiles: {
          mediosTransporte: undefined,
          estaDifusion: null,
          enunciativaLimitativa: '',
          procedimientosEmpresa: 'Valor válido',
          mediosDeTransporte: 'Otro valor válido'
        }
      } as any;
      
      const spyMediosTransporte = jest.spyOn(component.capacitacion.get('mediosTransporte')!, 'setValue');
      const spyEstaDifusion = jest.spyOn(component.capacitacion.get('estaDifusion')!, 'setValue');
      const spyEnunciativaLimitativa = jest.spyOn(component.capacitacion.get('enunciativaLimitativa')!, 'setValue');
      const spyProcedimientosEmpresa = jest.spyOn(component.capacitacion.get('procedimientosEmpresa')!, 'setValue');

     
      component.actualizarFormularioConEstado();

     
      expect(spyMediosTransporte).not.toHaveBeenCalled();
      expect(spyEstaDifusion).not.toHaveBeenCalled();
      expect(spyEnunciativaLimitativa).not.toHaveBeenCalled();
      expect(spyProcedimientosEmpresa).toHaveBeenCalledWith('Valor válido', { emitEvent: false });
    });

    it('debe manejar correctamente cuando un control no existe', () => {
     
      component.solicitudState = {
        perfiles: {
          campoInexistente: 'Algún valor'
        }
      } as any;
      
      const originalControls = component.capacitacion.controls;
      Object.defineProperty(component.capacitacion, 'controls', {
        value: { ...originalControls, campoInexistente: undefined },
        configurable: true
      });

      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe iterar sobre todos los controles del formulario', () => {
     
      component.solicitudState = mockSolicitudState as any;
      const spyObjectKeys = jest.spyOn(Object, 'keys');

     
      component.actualizarFormularioConEstado();

     
      expect(spyObjectKeys).toHaveBeenCalledWith(component.capacitacion.controls);
    });

    it('debe procesar múltiples campos correctamente en una sola llamada', () => {
     
      const stateWithMultipleFields = {
        perfiles: {
          mediosTransporte: 'Nuevo valor medios',
          estaDifusion: 'Nueva difusión',
          enunciativaLimitativa: 'Nueva limitativa'
        }
      };
      component.solicitudState = stateWithMultipleFields as any;

      component.capacitacion.patchValue({
        mediosTransporte: 'Valor inicial 1',
        estaDifusion: 'Valor inicial 2',
        enunciativaLimitativa: 'Valor inicial 3'
      });

      const spyMedios = jest.spyOn(component.capacitacion.get('mediosTransporte')!, 'setValue');
      const spyDifusion = jest.spyOn(component.capacitacion.get('estaDifusion')!, 'setValue');
      const spyLimitativa = jest.spyOn(component.capacitacion.get('enunciativaLimitativa')!, 'setValue');

     
      component.actualizarFormularioConEstado();

     
      expect(spyMedios).toHaveBeenCalledWith('Nuevo valor medios', { emitEvent: false });
      expect(spyDifusion).toHaveBeenCalledWith('Nueva difusión', { emitEvent: false });
      expect(spyLimitativa).toHaveBeenCalledWith('Nueva limitativa', { emitEvent: false });
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component.crearFormularioDeGestion();
    });

    it('debe retornar early cuando form es null', () => {
     
      component.setValoresStore(null, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando form es undefined', () => {
     
      component.setValoresStore(undefined as any, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene un valor válido', () => {
     
      const valorTest = 'Valor para el store';
      component.capacitacion.get('mediosTransporte')?.setValue(valorTest);

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { mediosTransporte: valorTest }
      });
    });

    it('no debe actualizar el store cuando el control tiene valor null', () => {
     
      component.capacitacion.get('mediosTransporte')?.setValue(null);

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debe actualizar el store cuando el control tiene valor undefined', () => {
     
      component.capacitacion.get('mediosTransporte')?.setValue(undefined);

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar cuando el campo especificado no existe en el formulario', () => {
     
      component.setValoresStore(component.capacitacion, 'campoInexistente');

      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store con valores de diferentes tipos de datos', () => {
      const valorString = 'Texto de prueba';
      component.capacitacion.get('mediosTransporte')?.setValue(valorString);

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { mediosTransporte: valorString }
      });
    });

    it('debe actualizar el store con valores vacíos pero no null/undefined', () => {
     
      const valorVacio = '';
      component.capacitacion.get('mediosTransporte')?.setValue(valorVacio);

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { mediosTransporte: valorVacio }
      });
    });

    it('debe actualizar el store con el campo correcto especificado', () => {
     
      const valorEstaDifusion = 'Valor para está difusión';
      component.capacitacion.get('estaDifusion')?.setValue(valorEstaDifusion);

     
      component.setValoresStore(component.capacitacion, 'estaDifusion');

     
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { estaDifusion: valorEstaDifusion }
      });
    });

    it('debe llamar al store exactamente una vez por invocación válida', () => {
     
      const valor = 'Valor único';
      component.capacitacion.get('mediosTransporte')?.setValue(valor);

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');

     
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledTimes(1);
    });

    it('debe manejar múltiples llamadas consecutivas correctamente', () => {
     
      component.capacitacion.get('mediosTransporte')?.setValue('Valor 1');
      component.capacitacion.get('estaDifusion')?.setValue('Valor 2');

     
      component.setValoresStore(component.capacitacion, 'mediosTransporte');
      component.setValoresStore(component.capacitacion, 'estaDifusion');

     
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledTimes(2);
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenNthCalledWith(1, {
        perfiles: { mediosTransporte: 'Valor 1' }
      });
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenNthCalledWith(2, {
        perfiles: { estaDifusion: 'Valor 2' }
      });
    });
  });
});
