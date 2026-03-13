import { MercanciasComponent } from './mercancias.component';
import { FormBuilder } from '@angular/forms';
import { Tramite250102Store } from '../../estados/tramite250102.store';
import { Tramite250102Query } from '../../estados/tramite250102.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { of, Subject } from 'rxjs';

jest.mock('@libs/shared/theme/assets/json/250102/banco.json', () => ({
  __esModule: true,
  default: {
    descripcion: [{ id: 1, descripcion: 'desc1' }],
    fraccion: [{ id: 1, descripcion: 'frac1' }],
    medida: [{ id: 1, descripcion: 'med1' }],
    genero: [{ id: 1, descripcion: 'gen1' }],
    especie: [{ id: 1, descripcion: 'esp1' }],
    comun: [{ id: 1, descripcion: 'com1' }],
    origen: [{ id: 1, descripcion: 'ori1' }],
    procedencia: [{ id: 1, descripcion: 'pro1' }]
  }
}));

describe('MercanciasComponent', () => {
  let component: MercanciasComponent;
  let mockStore: any;
  let mockQuery: any;
  let mockConsultaioQuery: any;

  beforeEach(() => {
    mockStore = { establecerDatos: jest.fn() };
    mockQuery = {
      selectTramiteState$: of({
        productos: [],
        detalles: [],
        descripcion: '',
        fraccion: '',
        arancelaria: '',
        cantidad: '',
        medida: '',
        genero: '',
        especie: '',
        comun: '',
        origen: '',
        procedencia: ''
      })
    };
    mockConsultaioQuery = {
      selectConsultaioState$: of({ readonly: false })
    };

    component = new MercanciasComponent(
      new FormBuilder(),
      mockStore,
      mockQuery,
      mockConsultaioQuery
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and state on ngOnInit', () => {
    component.ngOnInit();
    expect(component.formMercancias).toBeDefined();
    expect(component.solicitudState).toBeDefined();
  });

  it('should disable arancelaria field after form creation', () => {
    component.ngOnInit();
    expect(component.formMercancias.get('arancelaria')?.disabled).toBe(true);
  });

  it('should add detalle to fraccionData if form is valid', () => {
    component.ngOnInit();
    component.formMercancias.patchValue({
      descripcion: 1,
      fraccion: 1,
      arancelaria: 'test',
      cantidad: 1,
      medida: 1,
      genero: 1,
      especie: 1,
      comun: 1,
      origen: 1,
      procedencia: 1
    });
    component.fraccionData = [];
    component.agregarDetalle();
    expect(component.fraccionData.length).toBe(1);
  });

  it('should not add detalle if form is invalid', () => {
    component.ngOnInit();
    component.formMercancias.patchValue({
      descripcion: '',
      fraccion: '',
      arancelaria: '',
      cantidad: '',
      medida: '',
      genero: '',
      especie: '',
      comun: '',
      origen: '',
      procedencia: ''
    });
    component.fraccionData = [];
    component.agregarDetalle();
    expect(component.fraccionData.length).toBe(0);
  });

  it('should reset form and fraccionData on cancelarDetalle', () => {
    component.ngOnInit();
    component.fraccionData = [{ fraccionArancelaria: 'test', cantidad: '1', unidadMedida: 'kg', nombreCientifico: '', nombreComun: '', paisOrigen: '', paisProcedencia: '' }];
    component.mostrarModalMercancias = true;
    component.cancelarDetalle();
    expect(component.formMercancias.value.descripcion).toBeNull();
    expect(component.fraccionData.length).toBe(0);
    expect(component.mostrarModalMercancias).toBe(false);
  });

  it('should call establecerDatos on establecerValoresStore', () => {
    component.ngOnInit();
    component.formMercancias.patchValue({ descripcion: 'test' });
    component.establecerValoresStore(component.formMercancias, 'descripcion');
    expect(mockStore.establecerDatos).toHaveBeenCalled();
  });

  it('should clean up on ngOnDestroy', () => {
    const spy = jest.spyOn((component as any).notificadorDestruccion$, 'next');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  // 🆕 NEW TESTS BELOW

  it('should not save product if fraccionData is empty', () => {
    component.ngOnInit();
    component.formMercancias.patchValue({ descripcion: 1 });
    component.fraccionData = [];
    component.guardarDetalle();
    expect(mockStore.establecerDatos).not.toHaveBeenCalled();
  });

  it('should not save product if descripcion is missing', () => {
    component.ngOnInit();
    component.fraccionData = [{
      fraccionArancelaria: 'test', cantidad: '1', unidadMedida: 'kg',
      nombreCientifico: 'gen', nombreComun: 'com', paisOrigen: 'ori', paisProcedencia: 'pro'
    }];
    component.formMercancias.patchValue({ descripcion: '' });
    component.guardarDetalle();
    expect(mockStore.establecerDatos).not.toHaveBeenCalled();
  });

  it('should save product and detalles in guardarDetalle', () => {
    component.ngOnInit();
    component.formMercancias.patchValue({
      descripcion: 1,
      fraccion: 1,
      arancelaria: 'test',
      cantidad: 1,
      medida: 1,
      genero: 1,
      especie: 1,
      comun: 1,
      origen: 1,
      procedencia: 1
    });
    component.agregarDetalle();
    component.guardarDetalle();
    expect(mockStore.establecerDatos).toHaveBeenCalledWith(
      expect.objectContaining({
        productos: expect.any(Array),
        detalles: expect.any(Array)
      })
    );
    expect(component.mostrarModalMercancias).toBe(true);
  });

  it('should return detalles for a valid producto in obtenerDatosAnidados', () => {
    const productoMock = { id: 123, descripcion: 'desc1' };
    const detallesMock = [{ fraccionArancelaria: 'test', cantidad: '1', unidadMedida: 'kg', nombreCientifico: '', nombreComun: '', paisOrigen: '', paisProcedencia: '' }];
    component.mapaDetalles.set(123, detallesMock);
    const result = component.obtenerDatosAnidados(productoMock);
    expect(result).toEqual(detallesMock);
  });

  it('should toggle modal and reset form when abrirModalMercancias is called', () => {
    component.ngOnInit();
    component.mostrarModalMercancias = false;
    component.formMercancias.patchValue({ descripcion: 1 });
    component.fraccionData = [{ fraccionArancelaria: 'old' } as any];

    component.abrirModalMercancias();
    expect(component.mostrarModalMercancias).toBe(true);
    expect(component.formMercancias.value.descripcion).toBeNull();
    expect(component.fraccionData.length).toBe(0);
  });
});
