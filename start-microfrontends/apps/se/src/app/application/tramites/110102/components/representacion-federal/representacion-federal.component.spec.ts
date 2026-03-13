import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RepresentacionFederalComponent } from './representacion-federal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RepresentacionfederalService } from '@ng-mf/data-access-user';
import { Tramite110102Store } from '../../estados/store/tramite110102.store';
import { Tramite110102Query } from '../../estados/queries/tramite110102.query';
import { of } from 'rxjs';

describe('RepresentacionFederalComponent', () => {
  let component: RepresentacionFederalComponent;
  let fixture: ComponentFixture<RepresentacionFederalComponent>;
  let mockService: any;
  let mockStore: any;
  let mockQuery: any;

  beforeEach(async () => {
    mockService = {
      getEntidadFederativa: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Entidad 1' }])),
      getRepresentacionfederal: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Representación 1' }]))
    };
    mockStore = { establecerDatos: jest.fn() };
    mockQuery = {
      selectTramite110102$: of({
        claveEntidadFederativa: '01',
        claveUnidadAdministrativa: 'RF1',
        protestoDecirVerdad: true
      })
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,RepresentacionFederalComponent],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: RepresentacionfederalService, useValue: mockService },
        { provide: Tramite110102Store, useValue: mockStore },
        { provide: Tramite110102Query, useValue: mockQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RepresentacionFederalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit debe inicializar el formulario y cargar entidades federativas', () => {
    const SPY_CARGAR_ENTIDADES = jest.spyOn(component, 'cargarEntidadesFederativas');
    const SPY_OBTENER_VALORES = jest.spyOn(component, 'obtenerValoresDelEstado');
    component.ngOnInit();
    expect(SPY_CARGAR_ENTIDADES).toHaveBeenCalled();
    expect(SPY_OBTENER_VALORES).toHaveBeenCalled();
  });

  it('cargarEntidadesFederativas debe llenar entidadesFederativas', () => {
    component.cargarEntidadesFederativas();
    expect(component.entidadesFederativas).toEqual([{ id: 1, descripcion: 'Entidad 1' }]);
  });

  it('alCambiarEntidadFederativa debe llamar a obtenerRepresentacionFederal y establecerValoresEnEstado si el valor no es -1', () => {
    const SPY_OBTENER = jest.spyOn(component, 'obtenerRepresentacionFederal');
    const SPY_ESTABLECER = jest.spyOn(component, 'establecerValoresEnEstado');
    component.alCambiarEntidadFederativa({ target: { value: '01' } } as any);
    expect(SPY_OBTENER).toHaveBeenCalledWith('01');
    expect(SPY_ESTABLECER).toHaveBeenCalledWith(component.formularioRepresentacionFederal, 'claveEntidadFederativa');
  });

  it('alCambiarEntidadFederativa debe limpiar opcionesRepresentacionFederal si el valor es -1', () => {
    component.opcionesRepresentacionFederal = [{ id: 1, descripcion: 'Representación 1' }];
    component.alCambiarEntidadFederativa({ target: { value: '-1' } } as any);
    expect(component.opcionesRepresentacionFederal).toEqual([]);
  });

  it('obtenerRepresentacionFederal debe llenar opcionesRepresentacionFederal', () => {
    component.obtenerRepresentacionFederal('01');
    expect(component.opcionesRepresentacionFederal).toEqual([{ id: 1, descripcion: 'Representación 1' }]);
  });

  it('establecerValoresEnEstado debe llamar a establecerDatos en el store', () => {
    component.formularioRepresentacionFederal.get('claveEntidadFederativa')?.setValue('01');
    component.establecerValoresEnEstado(component.formularioRepresentacionFederal, 'claveEntidadFederativa');
    expect(mockStore.establecerDatos).toHaveBeenCalledWith({ claveEntidadFederativa: '01' });
  });

  it('obtenerValoresDelEstado debe actualizar el formulario con valores del store', () => {
    component.formularioRepresentacionFederal.patchValue({
      claveEntidadFederativa: '',
      claveUnidadAdministrativa: '',
      protestoDecirVerdad: false
    });
    component.obtenerValoresDelEstado();
    expect(component.formularioRepresentacionFederal.get('claveEntidadFederativa')?.value).toBe('01');
    expect(component.formularioRepresentacionFederal.get('claveUnidadAdministrativa')?.value).toBe('RF1');
    expect(component.formularioRepresentacionFederal.get('protestoDecirVerdad')?.value).toBe(true);
  });

  it('ngOnDestroy debe completar el subject destruido$', () => {
    const SPY_NEXT = jest.spyOn((component as any).destruido$, 'next');
    const SPY_COMPLETE = jest.spyOn((component as any).destruido$, 'complete');
    component.ngOnDestroy();
    expect(SPY_NEXT).toHaveBeenCalled();
    expect(SPY_COMPLETE).toHaveBeenCalled();
  });
});