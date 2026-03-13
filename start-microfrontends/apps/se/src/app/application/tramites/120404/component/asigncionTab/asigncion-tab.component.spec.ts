import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignciontabComponent } from '../asigncionTab/asigncion-tab.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Tramite120404Store } from '../../estados/store/tramite120404.store';
import { Tramite120404Query } from '../../estados/queries/tramite120404.query';
import { CatalogoSelectComponent } from '@ng-mf/data-access-user';
import { InputRadioComponent } from '@ng-mf/data-access-user';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

describe('AsignciontabComponent', () => {
  let component: AsignciontabComponent;
  let fixture: ComponentFixture<AsignciontabComponent>;
  let tramiteStore: Tramite120404Store;
  let tramiteQuery: Tramite120404Query;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,AsignciontabComponent, CatalogoSelectComponent, InputRadioComponent,HttpClientModule],
      providers: [
        FormBuilder,
        Tramite120404Store,
        {
          provide: Tramite120404Query,
          useValue: {
            selectTramite120404$: of({ asignacionRadio: false, asignacionsolitud: '', numTramite: '' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignciontabComponent);
    component = fixture.componentInstance;
    tramiteStore = TestBed.inject(Tramite120404Store);
    tramiteQuery = TestBed.inject(Tramite120404Query);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario correctamente', () => {
    expect(component.asignacionForm).toBeDefined();
    expect(component.asignacionForm).toBeTruthy();
  });

  it('debe actualizar el store cuando se llama setValoresStore', () => {
    const spy = jest.spyOn(tramiteStore, 'establecerDatos');
    component.setValoresStore(component.asignacionForm, 'asignacionRadio');
    expect(spy).toHaveBeenCalled();
  });

  it('debe deshabilitar el formulario si esFormularioSoloLectura es verdadero', () => {
    component.esFormularioSoloLectura = true;
    component.guardarDatosFormulario();
    expect(component.asignacionForm.disabled).toBeTruthy();
  });

  it('debe habilitar el formulario si esFormularioSoloLectura es falso', () => {
    component.esFormularioSoloLectura = false;
    component.guardarDatosFormulario();
    expect(component.asignacionForm.enabled).toBeTruthy();
  });

  it('debe destruir las suscripciones de los observables al destruir el componente', () => {
    const spy = jest.spyOn(component.destroyed$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
  
    it('debe inicializar el formulario en ngOnInit', () => {
      const spy = jest.spyOn(component, 'initForm');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  
    it('debe validar el formulario y marcarlo como tocado si es inválido', () => {
      component.initForm();
      component.asignacionForm.get('numTramite')?.setValue('');
      const result = component.validarFormularios();
      expect(result).toBe(false);
      expect(component.asignacionForm.get('numTramite')?.touched).toBe(true);
    });
  
    it('debe retornar mensaje de error para numTramite requerido', () => {
      component.initForm();
      const control = component.asignacionForm.get('numTramite');
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getNumTramiteErrorMessage()).toContain('obligatorio');
    });
  
    it('debe retornar mensaje de error para numTramite inválido', () => {
      component.initForm();
      const control = component.asignacionForm.get('numTramite');
      control?.setValue('abc');
      control?.markAsTouched();
      expect(component.getNumTramiteErrorMessage()).toContain('número válido');
    });
  
    it('debe retornar mensaje de error para numTramite demasiado largo', () => {
      component.initForm();
      const control = component.asignacionForm.get('numTramite');
      control?.setValue('1'.repeat(31));
      control?.markAsTouched();
      expect(component.getNumTramiteErrorMessage()).toContain('exceder 30 caracteres');
    });
  
    it('debe emitir evento buscarIntento al buscar', () => {
      const spy = jest.spyOn(component.buscarIntento, 'emit');
      component.initForm();
      component.buscar();
      expect(spy).toHaveBeenCalled();
    });
  
    it('debe llamar tramite120404Store.setBuscarSection(false) si el formulario es inválido al buscar', () => {
      const spy = jest.spyOn(tramiteStore, 'setBuscarSection');
      component.initForm();
      component.asignacionForm.get('numTramite')?.setValue('');
      component.buscar();
      expect(spy).toHaveBeenCalledWith(false);
    });
  
    it('debe llamar tramite120404Store.setBuscarSection(true) si el formulario es válido al buscar', () => {
      const spy = jest.spyOn(tramiteStore, 'setBuscarSection');
      component.initForm();
      component.asignacionForm.get('numTramite')?.setValue('123');
      component.asignacionForm.get('asignacionRadio')?.setValue('vigencia');
      component.asignacionForm.get('asignacionsolitud')?.setValue('test');
      component.buscar();
      expect(spy).toHaveBeenCalledWith(true);
    });
  
    it('debe marcar control como inválido si no es válido y tocado', () => {
      component.initForm();
      const control = component.asignacionForm.get('numTramite');
      control?.setValue('');
      control?.markAsTouched();
      expect(component.isInvalid('numTramite')).toBe(true);
    });
  
    it('debe retornar null en isInvalid si el control no existe', () => {
      expect(component.isInvalid('noExiste')).toBeNull();
    });
});
