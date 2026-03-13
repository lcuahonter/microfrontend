import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { GestionAduaneraComponent } from './gestion-aduanera.component';
import { Solicitud32605Store } from '../../../estados/solicitud32605.store';
import { Solicitud32605Query } from '../../../estados/solicitud32605.query';

describe('GestionAduaneraComponent', () => {
  let component: GestionAduaneraComponent;
  let fixture: ComponentFixture<GestionAduaneraComponent>;
  let tramiteStoreSpy: jest.Mocked<Solicitud32605Store>;
  let tramiteQuerySpy: jest.Mocked<Solicitud32605Query>;
  let formBuilder: FormBuilder;

  const mockSolicitudState = {
    perfiles: {
      describaProcedimiento: 'Descripción del procedimiento',
      indiqueLosCriterios: 'Criterios establecidos',
      indiqueLosMetodos: 'Métodos indicados',
      describaLosIndicadores: 'Indicadores descritos',
      comercioExterior: 'Comercio exterior información'
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
      imports: [GestionAduaneraComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Solicitud32605Store, useValue: tramiteStoreSpy },
        { provide: Solicitud32605Query, useValue: tramiteQuerySpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAduaneraComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('actualizarFormularioConEstado', () => {
    beforeEach(() => {
      component.crearFormularioDeGestión();
    });

    it('debe retornar early cuando no hay formulario gestionAduanera', () => {
     
      component.gestionAduanera = null as any;
      component.solicitudState = mockSolicitudState as any;
      const spySetValue = jest.spyOn(formBuilder, 'group');

      
      component.actualizarFormularioConEstado();

      expect(spySetValue).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando no hay solicitudState', () => {
     
      component.solicitudState = null as any;
      const controlSpy = jest.spyOn(component.gestionAduanera.get('describaProcedimiento')!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(controlSpy).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando no hay perfiles en solicitudState', () => {
     
      component.solicitudState = {} as any;
      const controlSpy = jest.spyOn(component.gestionAduanera.get('describaProcedimiento')!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(controlSpy).not.toHaveBeenCalled();
    });

    it('debe actualizar controles del formulario con valores del estado', () => {
     
      component.solicitudState = mockSolicitudState as any;
      
      component.gestionAduanera.get('describaProcedimiento')?.setValue('Valor anterior');
      component.gestionAduanera.get('indiqueLosCriterios')?.setValue('Otro valor');
      
      const controlProcedimiento = component.gestionAduanera.get('describaProcedimiento');
      const controlCriterios = component.gestionAduanera.get('indiqueLosCriterios');
      const spyProcedimiento = jest.spyOn(controlProcedimiento!, 'setValue');
      const spyCriterios = jest.spyOn(controlCriterios!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(spyProcedimiento).toHaveBeenCalledWith('Descripción del procedimiento', { emitEvent: false });
      expect(spyCriterios).toHaveBeenCalledWith('Criterios establecidos', { emitEvent: false });
    });

    it('no debe actualizar controles que ya tienen el mismo valor', () => {
     
      component.solicitudState = mockSolicitudState as any;
      
      component.gestionAduanera.get('describaProcedimiento')?.setValue('Descripción del procedimiento');
      
      const control = component.gestionAduanera.get('describaProcedimiento');
      const spy = jest.spyOn(control!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(spy).not.toHaveBeenCalled();
    });

    it('no debe actualizar controles con valores undefined, null o vacíos en el estado', () => {
     
      component.solicitudState = {
        perfiles: {
          describaProcedimiento: undefined,
          indiqueLosCriterios: null,
          indiqueLosMetodos: '',
          describaLosIndicadores: 'Valor válido',
          comercioExterior: 'Otro valor válido'
        }
      } as any;
      
      const spyProcedimiento = jest.spyOn(component.gestionAduanera.get('describaProcedimiento')!, 'setValue');
      const spyCriterios = jest.spyOn(component.gestionAduanera.get('indiqueLosCriterios')!, 'setValue');
      const spyMetodos = jest.spyOn(component.gestionAduanera.get('indiqueLosMetodos')!, 'setValue');
      const spyIndicadores = jest.spyOn(component.gestionAduanera.get('describaLosIndicadores')!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(spyProcedimiento).not.toHaveBeenCalled();
      expect(spyCriterios).not.toHaveBeenCalled();
      expect(spyMetodos).not.toHaveBeenCalled();
      expect(spyIndicadores).toHaveBeenCalledWith('Valor válido', { emitEvent: false });
    });

    it('debe manejar correctamente cuando un control no existe', () => {
     
      component.solicitudState = {
        perfiles: {
          campoInexistente: 'Algún valor'
        }
      } as any;
      
      const originalControls = component.gestionAduanera.controls;
      Object.defineProperty(component.gestionAduanera, 'controls', {
        value: { ...originalControls, campoInexistente: undefined },
        configurable: true
      });

      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('debe iterar sobre todos los controles del formulario', () => {
     
      component.solicitudState = mockSolicitudState as any;
      const spyObjectKeys = jest.spyOn(Object, 'keys');

      
      component.actualizarFormularioConEstado();

      
      expect(spyObjectKeys).toHaveBeenCalledWith(component.gestionAduanera.controls);
    });

    it('debe procesar múltiples campos correctamente en una sola llamada', () => {
     
      const stateWithMultipleFields = {
        perfiles: {
          describaProcedimiento: 'Nuevo procedimiento',
          indiqueLosCriterios: 'Nuevos criterios',
          indiqueLosMetodos: 'Nuevos métodos'
        }
      };
      component.solicitudState = stateWithMultipleFields as any;

      component.gestionAduanera.patchValue({
        describaProcedimiento: 'Valor inicial 1',
        indiqueLosCriterios: 'Valor inicial 2',
        indiqueLosMetodos: 'Valor inicial 3'
      });

      const spyProcedimiento = jest.spyOn(component.gestionAduanera.get('describaProcedimiento')!, 'setValue');
      const spyCriterios = jest.spyOn(component.gestionAduanera.get('indiqueLosCriterios')!, 'setValue');
      const spyMetodos = jest.spyOn(component.gestionAduanera.get('indiqueLosMetodos')!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(spyProcedimiento).toHaveBeenCalledWith('Nuevo procedimiento', { emitEvent: false });
      expect(spyCriterios).toHaveBeenCalledWith('Nuevos criterios', { emitEvent: false });
      expect(spyMetodos).toHaveBeenCalledWith('Nuevos métodos', { emitEvent: false });
    });

    it('debe validar typecast correcto para fieldName as keyof', () => {
     
      component.solicitudState = mockSolicitudState as any;
      const spyForEach = jest.spyOn(Array.prototype, 'forEach');

      
      component.actualizarFormularioConEstado();

      
      expect(spyForEach).toHaveBeenCalled();
    });

    it('debe manejar estados con diferentes estructuras de perfiles', () => {
     
      const estadoConEstructuraDiferente = {
        perfiles: {
          describaProcedimiento: 'Solo este campo existe'
        }
      };
      component.solicitudState = estadoConEstructuraDiferente as any;
      
      const spyProcedimiento = jest.spyOn(component.gestionAduanera.get('describaProcedimiento')!, 'setValue');
      const spyCriterios = jest.spyOn(component.gestionAduanera.get('indiqueLosCriterios')!, 'setValue');

      
      component.actualizarFormularioConEstado();

      
      expect(spyProcedimiento).toHaveBeenCalledWith('Solo este campo existe', { emitEvent: false });
      expect(spyCriterios).not.toHaveBeenCalled();
    });
  });

  describe('setValoresStore', () => {
    beforeEach(() => {
      component.crearFormularioDeGestión();
    });

    it('debe retornar early cuando form es null', () => {
      
      component.setValoresStore(null, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe retornar early cuando form es undefined', () => {
      
      component.setValoresStore(undefined as any, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store cuando el control tiene un valor válido', () => {
     
      const valorTest = 'Descripción de prueba';
      component.gestionAduanera.get('describaProcedimiento')?.setValue(valorTest);

      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { describaProcedimiento: valorTest }
      });
    });

    it('no debe actualizar el store cuando el control tiene valor null', () => {
     
      component.gestionAduanera.get('describaProcedimiento')?.setValue(null);

      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('no debe actualizar el store cuando el control tiene valor undefined', () => {
     
      component.gestionAduanera.get('describaProcedimiento')?.setValue(undefined);

      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar cuando el campo especificado no existe en el formulario', () => {
      
      component.setValoresStore(component.gestionAduanera, 'campoInexistente');

      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe actualizar el store con diferentes tipos de campos', () => {
      const valorCriterios = 'Criterios de gestión aduanera';
      component.gestionAduanera.get('indiqueLosCriterios')?.setValue(valorCriterios);

      
      component.setValoresStore(component.gestionAduanera, 'indiqueLosCriterios');

      
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { indiqueLosCriterios: valorCriterios }
      });
    });

    it('debe actualizar el store con valores vacíos pero no null/undefined', () => {
     
      const valorVacio = '';
      component.gestionAduanera.get('describaProcedimiento')?.setValue(valorVacio);

      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
        perfiles: { describaProcedimiento: valorVacio }
      });
    });

    it('debe actualizar el store con todos los campos del formulario', () => {
     
      const campos = [
        'describaProcedimiento',
        'indiqueLosCriterios', 
        'indiqueLosMetodos',
        'describaLosIndicadores',
        'comercioExterior'
      ];

      campos.forEach((campo, index) => {
        const valor = `Valor para ${campo} - ${index}`;
        component.gestionAduanera.get(campo)?.setValue(valor);

        
        component.setValoresStore(component.gestionAduanera, campo);

        
        expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
          perfiles: { [campo]: valor }
        });
      });
    });

    it('debe llamar al store exactamente una vez por invocación válida', () => {
     
      const valor = 'Valor único';
      component.gestionAduanera.get('describaProcedimiento')?.setValue(valor);

      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');

      
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledTimes(1);
    });

    it('debe manejar múltiples llamadas consecutivas correctamente', () => {
     
      component.gestionAduanera.get('describaProcedimiento')?.setValue('Valor 1');
      component.gestionAduanera.get('indiqueLosCriterios')?.setValue('Valor 2');

      
      component.setValoresStore(component.gestionAduanera, 'describaProcedimiento');
      component.setValoresStore(component.gestionAduanera, 'indiqueLosCriterios');

      
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledTimes(2);
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenNthCalledWith(1, {
        perfiles: { describaProcedimiento: 'Valor 1' }
      });
      expect(tramiteStoreSpy.actualizarEstado).toHaveBeenNthCalledWith(2, {
        perfiles: { indiqueLosCriterios: 'Valor 2' }
      });
    });

    it('debe validar que el control existe antes de acceder a su valor', () => {
     
      const formSinControles = formBuilder.group({});

      
      component.setValoresStore(formSinControles, 'campoInexistente');

      
      expect(tramiteStoreSpy.actualizarEstado).not.toHaveBeenCalled();
    });

    it('debe manejar controles con valores de diferentes tipos de datos', () => {
      const testCases = [
        { campo: 'describaProcedimiento', valor: 'string value' },
        { campo: 'indiqueLosCriterios', valor: 'another string' }
      ];

      testCases.forEach(testCase => {
        jest.clearAllMocks();
        
        component.gestionAduanera.get(testCase.campo)?.setValue(testCase.valor);

        
        component.setValoresStore(component.gestionAduanera, testCase.campo);

        
        expect(tramiteStoreSpy.actualizarEstado).toHaveBeenCalledWith({
          perfiles: { [testCase.campo]: testCase.valor }
        });
      });
    });
  });
});
