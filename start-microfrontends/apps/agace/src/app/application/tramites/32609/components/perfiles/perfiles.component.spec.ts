import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PerfilesComponent } from './perfiles.component';
import { Tramite32609Store } from '../../estados/tramites32609.store';
import { Tramite32609Query } from '../../estados/tramites32609.query';
import { of, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Mock components for child components
@Component({
  selector: 'app-planeacion-de-la-seguridad',
  template: '<div>Mock Planeacion Component</div>'
})
class MockPlaneacionDelaSeguridadComponent {}

@Component({
  selector: 'app-seguridad-fisica',
  template: '<div>Mock Seguridad Fisica Component</div>'
})
class MockSeguridadFisicaComponent {}

@Component({
  selector: 'app-controles-fisico',
  template: '<div>Mock Controles Fisico Component</div>'
})
class MockControlesFisicoComponent {}

@Component({
  selector: 'app-socios-comerciales',
  template: '<div>Mock Socios Comerciales Component</div>'
})
class MockSociosComercialesComponent {}

@Component({
  selector: 'app-seguridad-procesos',
  template: '<div>Mock Seguridad Procesos Component</div>'
})
class MockSeguridadProcesosComponent {}

@Component({
  selector: 'app-gestion-aduanera',
  template: '<div>Mock Gestion Aduanera Component</div>'
})
class MockGestionAduaneraComponent {}

@Component({
  selector: 'app-seguridad-los-vehiculos',
  template: '<div>Mock Seguridad Vehiculos Component</div>'
})
class MockSeguridadLosVehiculosComponent {}

@Component({
  selector: 'app-seguridad-personal',
  template: '<div>Mock Seguridad Personal Component</div>'
})
class MockSeguridadPersonalComponent {}

@Component({
  selector: 'app-seguridad-informacion-documentacion',
  template: '<div>Mock Seguridad Informacion Component</div>'
})
class MockSeguridadInformacionDocumentacionComponent {}

@Component({
  selector: 'app-capacitacion-seguridad',
  template: '<div>Mock Capacitacion Seguridad Component</div>'
})
class MockCapacitacionSeguridadComponent {}

@Component({
  selector: 'app-manejo-investigacion',
  template: '<div>Mock Manejo Investigacion Component</div>'
})
class MockManejoInvestigacionComponent {}

@Component({
  selector: 'input-fecha',
  template: '<div>Mock Input Fecha Component</div>'
})
class MockInputFechaComponent {}

@Component({
  selector: 'input-radio',
  template: '<div>Mock Input Radio Component</div>'
})
class MockInputRadioComponent {}

describe('PerfilesComponent', () => {
  let component: PerfilesComponent;
  let fixture: ComponentFixture<PerfilesComponent>;
  let store: Tramite32609Store;
  let query: Tramite32609Query;

  const mockTramiteState = {
    perfiles: {
      antiguedad: '5',
      productos: 'Test Productos',
      embarquesExp: '10',
      embarquesImp: '15',
      empleados: '50',
      superficie: '1000',
      vigencia: '2025-01-01',
      vigenciaLlegada: '2025-06-01',
      vigenciaFinalizada: '2025-12-31'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PerfilesComponent,
        ReactiveFormsModule,
        CommonModule
      ],
      declarations: [
        MockPlaneacionDelaSeguridadComponent,
        MockSeguridadFisicaComponent,
        MockControlesFisicoComponent,
        MockSociosComercialesComponent,
        MockSeguridadProcesosComponent,
        MockGestionAduaneraComponent,
        MockSeguridadLosVehiculosComponent,
        MockSeguridadPersonalComponent,
        MockSeguridadInformacionDocumentacionComponent,
        MockCapacitacionSeguridadComponent,
        MockManejoInvestigacionComponent,
        MockInputFechaComponent,
        MockInputRadioComponent
      ],
      providers: [
        FormBuilder,
        {
          provide: Tramite32609Store,
          useValue: {
            establecerDatos: jest.fn(),
          },
        },
        {
          provide: Tramite32609Query,
          useValue: {
            selectTramite32609$: of(mockTramiteState),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite32609Store);
    query = TestBed.inject(Tramite32609Query);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('🔧 Component Initialization', () => {
    it('should initialize the form on ngOnInit', () => {
      expect(component.profileForm).toBeDefined();
      expect(component.profileForm.get('antiguedad')?.value).toBe('5');
    });

    it('should initialize all boolean flags to false', () => {
      expect(component.mostrarContenido).toBe(false);
      expect(component.mostrarSeguridad).toBe(false);
      expect(component.mostrarAccesoFisico).toBe(false);
      expect(component.mostrarSociosComeciales).toBe(false);
      expect(component.mostrarSeguridadProcesos).toBe(false);
      expect(component.mostrarGestionAduanera).toBe(false);
      expect(component.mostrarSeguridadVehiculos).toBe(false);
      expect(component.mostrarSeguridadPersonal).toBe(false);
      expect(component.mostrarSeguridadInformacion).toBe(false);
      expect(component.mostrarCapacitacionSeguridad).toBe(false);
      expect(component.mostrarManejoInvestigacion).toBe(false);
      expect(component.hasAgregar).toBe(false);
    });

    it('should initialize textos property', () => {
      expect(component.textos).toBeDefined();
    });

    it('should initialize date input objects', () => {
      expect(component.fechaInicioInput).toBeDefined();
      expect(component.fechaInputDatos).toBeDefined();
    });

    it('should initialize radio button options', () => {
      expect(component.opcionDeBotonDeRadio).toBeDefined();
    });
  });

  describe('🔄 Toggle Methods', () => {
    it('should toggle mostrarContenido', () => {
      expect(component.mostrarContenido).toBe(false);
      component.alternarContenido();
      expect(component.mostrarContenido).toBe(true);
      component.alternarContenido();
      expect(component.mostrarContenido).toBe(false);
    });

    it('should toggle mostrarSeguridad', () => {
      expect(component.mostrarSeguridad).toBe(false);
      component.alternarSeguridad();
      expect(component.mostrarSeguridad).toBe(true);
      component.alternarSeguridad();
      expect(component.mostrarSeguridad).toBe(false);
    });

    it('should toggle mostrarAccesoFisico', () => {
      expect(component.mostrarAccesoFisico).toBe(false);
      component.alternarAccesoFisico();
      expect(component.mostrarAccesoFisico).toBe(true);
    });

    it('should toggle mostrarSociosComerciales', () => {
      expect(component.mostrarSociosComeciales).toBe(false);
      component.alternarSociosComerciales();
      expect(component.mostrarSociosComeciales).toBe(true);
    });

    it('should toggle mostrarSeguridadProcesos', () => {
      expect(component.mostrarSeguridadProcesos).toBe(false);
      component.alternarSeguridadProcesos();
      expect(component.mostrarSeguridadProcesos).toBe(true);
    });

    it('should toggle mostrarGestionAduanera', () => {
      expect(component.mostrarGestionAduanera).toBe(false);
      component.alternarGestionAduanera();
      expect(component.mostrarGestionAduanera).toBe(true);
    });

    it('should toggle mostrarSeguridadVehiculos', () => {
      expect(component.mostrarSeguridadVehiculos).toBe(false);
      component.alternarSeguridadVehiculos();
      expect(component.mostrarSeguridadVehiculos).toBe(true);
    });

    it('should toggle mostrarSeguridadPersonal', () => {
      expect(component.mostrarSeguridadPersonal).toBe(false);
      component.alternarSeguridadPersonal();
      expect(component.mostrarSeguridadPersonal).toBe(true);
    });

    it('should toggle mostrarSeguridadInformacion', () => {
      expect(component.mostrarSeguridadInformacion).toBe(false);
      component.alternarSeguridadInformacion();
      expect(component.mostrarSeguridadInformacion).toBe(true);
    });

    it('should toggle mostrarCapacitacionSeguridad', () => {
      expect(component.mostrarCapacitacionSeguridad).toBe(false);
      component.alternarCapacitacionSeguridad();
      expect(component.mostrarCapacitacionSeguridad).toBe(true);
    });

    it('should toggle mostrarManejoInvestigacion', () => {
      expect(component.mostrarManejoInvestigacion).toBe(false);
      component.alternarManejoInvestigacion();
      expect(component.mostrarManejoInvestigacion).toBe(true);
    });
  });

  describe('📝 Form Update Methods', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update antiguedad in the store', () => {
      component.profileForm.get('antiguedad')?.setValue('10');
      component.actualizarAntiguedad();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { antiguedad: '10' } });
    });

    it('should update productos in the store', () => {
      component.profileForm.get('productos')?.setValue('New Product');
      component.actualizarProductos();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { productos: 'New Product' } });
    });

    it('should update embarquesExp in the store', () => {
      component.profileForm.get('embarquesExp')?.setValue('20');
      component.actualizarEmbarquesExp();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { embarquesExp: '20' } });
    });

    it('should update embarquesImp in the store', () => {
      component.profileForm.get('embarquesImp')?.setValue('25');
      component.actualizarEmbarquesImp();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { embarquesImp: '25' } });
    });

    it('should update empleados in the store', () => {
      component.profileForm.get('empleados')?.setValue('100');
      component.actualizarEmpleados();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { empleados: '100' } });
    });

    it('should update superficie in the store', () => {
      component.profileForm.get('superficie')?.setValue('2000');
      component.actualizarSuperficie();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { superficie: '2000' } });
    });
  });

  describe('📅 Date Selection Methods', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should set vigencia in the store', () => {
      component.seleccionarVigenciaUno('2026-01-01');
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { vigencia: '2026-01-01' } });
    });

    it('should set vigenciaDos in the store', () => {
      component.seleccionarVigenciaDos('2027-01-01');
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { vigencia2: '2027-01-01' } });
    });

    it('should set vigenciaTres in the store', () => {
      component.seleccionarVigenciaTres('2028-01-01');
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { vigencia3: '2028-01-01' } });
    });
  });

  describe('🔧 Form Management', () => {
    it('should create form with correct initial values from state', () => {
      expect(component.profileForm.get('antiguedad')?.value).toBe('5');
      expect(component.profileForm.get('productos')?.value).toBe('Test Productos');
      expect(component.profileForm.get('embarquesExp')?.value).toBe('10');
      expect(component.profileForm.get('embarquesImp')?.value).toBe('15');
      expect(component.profileForm.get('empleados')?.value).toBe('50');
      expect(component.profileForm.get('superficie')?.value).toBe('1000');
    });

    it('should update form when state changes', () => {
      const newState = {
        perfiles: {
          antiguedad: '8',
          productos: 'Updated Products',
          embarquesExp: '30',
          embarquesImp: '25',
          empleados: '75',
          superficie: '1500'
        }
      };

      // Simulate state change by calling crearFormularioProfileForm with new state
      (component as any).solicitudState = newState;
      component.actualizarFormularioConEstado();

      expect(component.profileForm.get('antiguedad')?.value).toBe('8');
      expect(component.profileForm.get('productos')?.value).toBe('Updated Products');
    });

    it('should handle missing perfiles in state gracefully', () => {
      (component as any).solicitudState = {};
      expect(() => component.actualizarFormularioConEstado()).not.toThrow();
    });

    it('should handle null form gracefully in setValoresStore', () => {
      expect(() => component.setValoresStore(null, 'antiguedad')).not.toThrow();
    });

    it('should call store update when setValoresStore is called with valid form', () => {
      component.profileForm.get('antiguedad')?.setValue('15');
      component.setValoresStore(component.profileForm, 'antiguedad');
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { antiguedad: '15' } });
    });
  });

  describe('🧹 Cleanup', () => {
    it('should clean up subscriptions on ngOnDestroy', () => {
      const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
      const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });

  describe('🎯 Edge Cases', () => {
    it('should handle form controls with null/undefined values', () => {
      component.profileForm.get('antiguedad')?.setValue(null);
      expect(() => component.actualizarAntiguedad()).not.toThrow();
    });

    it('should handle empty string values in form controls', () => {
      component.profileForm.get('productos')?.setValue('');
      component.actualizarProductos();
      expect(store.establecerDatos).toHaveBeenCalledWith({ perfiles: { productos: '' } });
    });

    it('should maintain form validity requirements', () => {
      const antigüedadControl = component.profileForm.get('antiguedad');
      antigüedadControl?.setValue('invalid-text');
      expect(antigüedadControl?.invalid).toBe(true);
      
      antigüedadControl?.setValue('123');
      expect(antigüedadControl?.valid).toBe(true);
    });
  });
});