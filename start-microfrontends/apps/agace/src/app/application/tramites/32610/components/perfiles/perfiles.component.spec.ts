import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of,  } from 'rxjs';
import { PerfilesComponent } from './perfiles.component';
import { Solicitud32610Store } from '../../estados/solicitud32610.store';
import { Solicitud32610Query } from '../../estados/solicitud32610.query';
 
describe('PerfilesComponent', () => {
  let component: PerfilesComponent;
  let store: Solicitud32610Store;
  let query: Solicitud32610Query;
 
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PerfilesComponent,ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: Solicitud32610Store,
          useValue: {
            actualizarEstado: jest.fn(),
          },
        },
        {
          provide: Solicitud32610Query,
          useValue: {
            selectSolicitud$: of({
              domicilio: 'Test Domicilio',
              antiguedad: '5 años',
              productos: 'Test Productos',
              embarquesExp: '10',
              embarquesImp: '15',
              empleados: '50',
              superficie: '1000 m2',
              nombre: 'Test Nombre',
              categoria: 'A',
              vigencia: '2025',
            }),
          },
        },
      ],
    }).compileComponents();
 
    const fixture = TestBed.createComponent(PerfilesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Solicitud32610Store);
    query = TestBed.inject(Solicitud32610Query);
    (component as any).tramite32610Store = store;
    fixture.detectChanges();
  });
 
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
 
  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.profileForm).toBeDefined();
  });
 
  it('should toggle mostrarContenido', () => {
    expect(component.mostrarContenido).toBe(false);
    component.alternarContenido();
    expect(component.mostrarContenido).toBe(true);
  });
 
  it('should toggle mostrarSeguridad', () => {
    expect(component.mostrarSeguridad).toBe(false);
    component.alternarSeguridad();
    expect(component.mostrarSeguridad).toBe(true);
  });
 
  it('should update antiguedad in the store', () => {
    component.profileForm.get('antiguedad')?.setValue('antiguedad');
    component.actualizarAntiguedad();
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"antiguedad": "antiguedad"}});
  });
 
  it('should update productos in the store', () => {
    component.profileForm.get('productos')?.setValue('New Product');
    component.actualizarProductos();
    expect(store.actualizarEstado).toHaveBeenCalledWith( {"perfiles": {"productos": "New Product"}});
  });
 
  it('should update embarquesExp in the store', () => {
    component.profileForm.get('embarquesExp')?.setValue('20');
    component.actualizarEmbarquesExp();
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"embarquesExp": "20"}});
  });
 
  it('should update embarquesImp in the store', () => {
    component.profileForm.get('embarquesImp')?.setValue('25');
    component.actualizarEmbarquesImp();
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"embarquesImp": "25"}});
  });
 
  it('should update empleados in the store', () => {
    component.profileForm.get('empleados')?.setValue('100');
    component.actualizarEmpleados();
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"empleados": "100"}}
);
  });
 
  it('should update superficie in the store', () => {
    component.profileForm.get('superficie')?.setValue('2000 m2');
    component.actualizarSuperficie();
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"superficie": "2000 m2"}});
  });
 
  it('should set vigencia in the store', () => {
    component.seleccionarVigenciaUno('2026');
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"vigencia": "2026"}});
  });
 
  it('should set vigenciaDos in the store', () => {
    component.seleccionarVigenciaDos('2027');
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"vigencia2": "2027"}});
  });
 
  it('should set vigenciaTres in the store', () => {
    component.seleccionarVigenciaTres('2028');
    expect(store.actualizarEstado).toHaveBeenCalledWith({"perfiles": {"vigencia3": "2028"}});
  });
 
  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
 
 