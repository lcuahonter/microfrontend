import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { PerfilesComponent } from './perfiles.component';
import { Tramite32617Store } from '../../estados/tramites32617.store';
import { Tramite32617Query } from '../../estados/tramites32617.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
 
describe('PerfilesComponent', () => {
  let component: PerfilesComponent;
  let store: Tramite32617Store;
  let query: Tramite32617Query;
  let consultaioQuery: ConsultaioQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PerfilesComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: Tramite32617Store,
          useValue: {
            establecerDatos: jest.fn(),
          },
        },
        {
          provide: Tramite32617Query,
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
            selectTramite32617$: of({
              perfiles: {
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
                vigencia2: '2026',
                vigencia3: '2027',
              }
            }),
          },
        },
        {
          provide: ConsultaioQuery,
          useValue: {
            selectConsultaioState$: of({
              readonly: false
            }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(PerfilesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite32617Store);
    query = TestBed.inject(Tramite32617Query);
    consultaioQuery = TestBed.inject(ConsultaioQuery);
    (component as any).tramite32617Store = store;
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
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"antiguedad": "antiguedad"}});
  });
 
  it('should update productos in the store', () => {
    component.profileForm.get('productos')?.setValue('New Product');
    component.actualizarProductos();
    expect(store.establecerDatos).toHaveBeenCalledWith( {"perfiles": {"productos": "New Product"}});
  });
 
  it('should update embarquesExp in the store', () => {
    component.profileForm.get('embarquesExp')?.setValue('20');
    component.actualizarEmbarquesExp();
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"embarquesExp": "20"}});
  });
 
  it('should update embarquesImp in the store', () => {
    component.profileForm.get('embarquesImp')?.setValue('25');
    component.actualizarEmbarquesImp();
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"embarquesImp": "25"}});
  });
 
  it('should update empleados in the store', () => {
    component.profileForm.get('empleados')?.setValue('100');
    component.actualizarEmpleados();
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"empleados": "100"}}
);
  });
 
  it('should update superficie in the store', () => {
    component.profileForm.get('superficie')?.setValue('2000 m2');
    component.actualizarSuperficie();
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"superficie": "2000 m2"}});
  });
 
  it('should set vigencia in the store', () => {
    component.seleccionarVigenciaUno('2026');
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"vigencia": "2026"}});
  });
 
  it('should set vigenciaDos in the store', () => {
    component.seleccionarVigenciaDos('2027');
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"vigencia2": "2027"}});
  });
 
  it('should set vigenciaTres in the store', () => {
    component.seleccionarVigenciaTres('2028');
    expect(store.establecerDatos).toHaveBeenCalledWith({"perfiles": {"vigencia3": "2028"}});
  });
 
  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
 
 