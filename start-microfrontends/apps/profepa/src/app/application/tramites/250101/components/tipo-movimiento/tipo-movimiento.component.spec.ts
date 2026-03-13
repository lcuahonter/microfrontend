import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TipoMovimientoComponent } from './tipo-movimiento.component';
import { TipoMovimientoService } from '../../services/tipo-movimiento.service';
import { Tramite250101Store } from '../../estados/tramite250101.store';
import { Tramite250101Query } from '../../estados/tramite250101.query';

class Tramite250101QueryMock {
  tipoAduana$ = of([]);
  tipoInspectoria$ = of([]);
  tipoMunicipio$ = of([]);
  destinatarioDenominacion$ = of([]);
  selectSolicitud$ = of({});
}

describe('TipoMovimientoComponent', () => {
  let component: TipoMovimientoComponent;
  let fixture: ComponentFixture<TipoMovimientoComponent>;
  let tipoMovimientoServiceMock: any;
  let tramite250101StoreMock: any;

  beforeEach(async () => {
    tipoMovimientoServiceMock = {
      getAduanaData: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Aduana 1' }])),
      getInspectoriaData: jest.fn().mockReturnValue(of([{ id: 2, descripcion: 'Inspectoria 1' }])),
      getAlcaldiaData: jest.fn().mockReturnValue(of([{ id: 3, descripcion: 'Municipio 1' }])),
    };

    tramite250101StoreMock = {
      establecerTipoAduana: jest.fn(),
      establecerTipoInspectoria: jest.fn(),
      establecerTipoMunicipio: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,TipoMovimientoComponent],
      declarations: [],
      providers: [
        { provide: TipoMovimientoService, useValue: tipoMovimientoServiceMock },
        { provide: Tramite250101Store, useValue: tramite250101StoreMock },
        { provide: Tramite250101Query, useClass: Tramite250101QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TipoMovimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario y obtener datos en ngOnInit', () => {
    expect(component.tipoMovimientoForm).toBeDefined();
    expect(tipoMovimientoServiceMock.getAduanaData).toHaveBeenCalled();
    expect(tipoMovimientoServiceMock.getInspectoriaData).toHaveBeenCalled();
    expect(tipoMovimientoServiceMock.getAlcaldiaData).toHaveBeenCalled();
    expect(component.aduanaData).toEqual([{ id: 1, descripcion: 'Aduana 1' }]);
    expect(component.inspectoriaData).toEqual([{ id: 2, descripcion: 'Inspectoria 1' }]);
    expect(component.municipioData).toEqual([{ id: 3, descripcion: 'Municipio 1' }]);
  });

  it('debería establecer valores predeterminados en el formulario', () => {
    const formValue = component.tipoMovimientoForm.value;
    expect(formValue.tipoMovimiento).toBe("1");
    expect(formValue.tipoAduana ?? '').toBe('');
    expect(formValue.tipoInspectoria ?? '').toBe('');
    expect(formValue.tipoMunicipio ?? '').toBe('');
  });

  it('debería llamar a establecerTipoAduana cuando se llama a actualizarAduana', () => {
    component.tipoMovimientoForm.patchValue({ tipoAduana: 'Aduana 1' });
    component.actualizarAduana();
    expect(tramite250101StoreMock.establecerTipoAduana).toHaveBeenCalledWith('Aduana 1');
  });

  it('debería llamar a establecerTipoInspectoria cuando se llama a actualizarInspectoria', () => {
    component.tipoMovimientoForm.patchValue({ tipoInspectoria: 'Inspectoria 1' });
    component.actualizarInspectoria();
    expect(tramite250101StoreMock.establecerTipoInspectoria).toHaveBeenCalledWith('Inspectoria 1');
  });

  it('debería llamar a establecerTipoMunicipio cuando se llama a actualizarMunicipio', () => {
    component.tipoMovimientoForm.patchValue({ tipoMunicipio: 'Municipio 1' });
    component.actualizarMunicipio();
    expect(tramite250101StoreMock.establecerTipoMunicipio).toHaveBeenCalledWith('Municipio 1');
  });

  it('debería limpiar las suscripciones en ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  
  it('debería deshabilitar el formulario si esFormularioSoloLectura es verdadero', () => {
    component.esFormularioSoloLectura = true;
    component.tipoMovimientoForm.enable(); 
    component.inicializarEstadoFormulario();
    expect(component.tipoMovimientoForm.disabled).toBe(true);
  });

  it('debería habilitar el formulario si esFormularioSoloLectura es falso', () => {
    component.esFormularioSoloLectura = false;
    component.tipoMovimientoForm.disable(); 
    component.inicializarEstadoFormulario();
    expect(component.tipoMovimientoForm.enabled).toBe(true);
  });

  it('debería manejar correctamente datos vacíos de los servicios', () => {
    tipoMovimientoServiceMock.getAduanaData.mockReturnValueOnce(of([]));
    tipoMovimientoServiceMock.getInspectoriaData.mockReturnValueOnce(of([]));
    tipoMovimientoServiceMock.getAlcaldiaData.mockReturnValueOnce(of([]));
    component.ngOnInit();
    expect(component.aduanaData).toEqual([]);
    expect(component.inspectoriaData).toEqual([]);
    expect(component.municipioData).toEqual([]);
  });
});
