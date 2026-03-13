import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PerfilesMensajeriaComponent } from './perfiles-mensajeria.component';
import { Tramite32616PerfilesMensajeriaStore } from '../../estados/tramites/tramite32616_perfilesMensajeria.store';
import { Tramite32616PerfilesMensajeriaQuery } from '../../estados/queries/perfilesMensajeria.query';
import { of, Subject } from 'rxjs';

describe('PerfilesMensajeriaComponent', () => {
  let component: PerfilesMensajeriaComponent;
  let store: Tramite32616PerfilesMensajeriaStore;
  let query: Tramite32616PerfilesMensajeriaQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PerfilesMensajeriaComponent,ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: Tramite32616PerfilesMensajeriaStore,
          useValue: {
            setAntiguedad: jest.fn(),
            setProductos: jest.fn(),
            setEmbarquesExp: jest.fn(),
            setEmbarquesImp: jest.fn(),
            setEmpleados: jest.fn(),
            setSuperficie: jest.fn(),
            setVigencia: jest.fn(),
            setVigenciaDos: jest.fn(),
            setVigenciaTres: jest.fn(),
          },
        },
        {
          provide: Tramite32616PerfilesMensajeriaQuery,
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

    const fixture = TestBed.createComponent(PerfilesMensajeriaComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Tramite32616PerfilesMensajeriaStore);
    query = TestBed.inject(Tramite32616PerfilesMensajeriaQuery);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.profileForm).toBeDefined();
    expect(component.profileForm.get('domicilio')?.value).toBe('Test Domicilio');
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
    component.profileForm.get('antiguedad')?.setValue('10 años');
    component.actualizarAntiguedad();
    expect(store.setAntiguedad).toHaveBeenCalledWith('10 años');
  });

  it('should update productos in the store', () => {
    component.profileForm.get('productos')?.setValue('New Product');
    component.actualizarProductos();
    expect(store.setProductos).toHaveBeenCalledWith('New Product');
  });

  it('should update embarquesExp in the store', () => {
    component.profileForm.get('embarquesExp')?.setValue('20');
    component.actualizarEmbarquesExp();
    expect(store.setEmbarquesExp).toHaveBeenCalledWith('20');
  });

  it('should update embarquesImp in the store', () => {
    component.profileForm.get('embarquesImp')?.setValue('25');
    component.actualizarEmbarquesImp();
    expect(store.setEmbarquesImp).toHaveBeenCalledWith('25');
  });

  it('should update empleados in the store', () => {
    component.profileForm.get('empleados')?.setValue('100');
    component.actualizarEmpleados();
    expect(store.setEmpleados).toHaveBeenCalledWith('100');
  });

  it('should update superficie in the store', () => {
    component.profileForm.get('superficie')?.setValue('2000 m2');
    component.actualizarSuperficie();
    expect(store.setSuperficie).toHaveBeenCalledWith('2000 m2');
  });

  it('should set vigencia in the store', () => {
    component.seleccionarVigenciaUno('2026');
    expect(store.setVigencia).toHaveBeenCalledWith('2026');
  });

  it('should set vigenciaDos in the store', () => {
    component.seleccionarVigenciaDos('2027');
    expect(store.setVigenciaDos).toHaveBeenCalledWith('2027');
  });

  it('should set vigenciaTres in the store', () => {
    component.seleccionarVigenciaTres('2028');
    expect(store.setVigenciaTres).toHaveBeenCalledWith('2028');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});