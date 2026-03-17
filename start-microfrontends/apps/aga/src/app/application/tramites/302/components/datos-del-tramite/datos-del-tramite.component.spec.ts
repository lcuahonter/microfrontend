import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDelTramiteComponent } from './datos-del-tramite.component';
import { Tramite302Store } from '../../../../../application/core/estados/tramites/tramite302.store';
import { Tramite302Query } from '../../../../../application/core/queries/tramite302.query';
import { Solicitud302Service } from '../../services/service302.service';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DetallesDelProducto } from '../../models/certi-registro.model';

describe('DatosDelTramiteComponent', () => {
  let component: DatosDelTramiteComponent;
  let fixture: ComponentFixture<DatosDelTramiteComponent>;
  let tramite302StoreMock: any;
  let tramite302QueryMock: any;
  let solicitud302ServiceMock: any;
  const productoMock: DetallesDelProducto = {
    tipoDeMercancia: 'Electrónica',
    condicionDeLaMercancia: 'Nueva',
    cantidad: 10,
    enSucaso: 'N/A',
    unidadDeMedida: 'Piezas',
    anoDeImportacionTemporal: 2023,
    modelo: 'ABC-123',
    marca: 'XYZ',
    numeroDeSerie: 456789
};

  beforeEach(async () => {
    tramite302StoreMock = {
      setDynamicFieldValue: jest.fn()
    };

    tramite302QueryMock = {
      selectRegistro$: of({ detallesDelProducto: [] })
    };

    solicitud302ServiceMock = {
      getAduanaData: jest.fn().mockReturnValue(of([])),
      getUnidadDeMedidaData: jest.fn().mockReturnValue(of([])),
      getImportacionTemporalData: jest.fn().mockReturnValue(of([])),
      getProductos: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DatosDelTramiteComponent],
      providers: [
        { provide: Tramite302Store, useValue: tramite302StoreMock },
        { provide: Tramite302Query, useValue: tramite302QueryMock },
        { provide: Solicitud302Service, useValue: solicitud302ServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosDelTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to tramite302Query', () => {
    component.ngOnInit();
    expect(component.certiRegistroState).toBeDefined();
  });

  it('should open and close modal', () => {
    component.modalElement = { nativeElement: { click: jest.fn() } } as any;
    component.closeModal = { nativeElement: { click: jest.fn() } } as any;

    component.abrirModal();
    expect(component.modal).toBe('show');

    component.cerrarModal();
    expect(component.closeModal.nativeElement.click).toHaveBeenCalled();
  });

  it('should modify a product when form is valid', () => {
    const originalProduct: DetallesDelProducto = { ...productoMock };
    // const modifiedProduct: DetallesDelProducto = { ...productoMock, marca: 'MODIFICADO' };

    component.detallesDelProducto = [originalProduct];
    component.selectedProducto = [originalProduct];
    component.formAgregarProductos = component['fb'].group({
        tipoDeMercancia: ['Electrónica'],
        condicionDeLaMercancia: ['Nueva'],
        cantidad: [10],
        enSucaso: ['N/A'],
        unidadDeMedida: ['Piezas'],
        anoDeImportacionTemporal: [2023],
        modelo: ['ABC-123'],
        marca: ['MODIFICADO'],
        numeroDeSerie: [456789]
    });

    jest.spyOn(component.formAgregarProductos, 'valid', 'get').mockReturnValue(true);

    component.modificarProductos();

    expect(component.detallesDelProducto[0].marca).toBe('MODIFICADO');
    expect(tramite302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('detallesDelProducto', component.detallesDelProducto);
});

  it('should delete a selected product', () => {
    const producto: DetallesDelProducto = { ...productoMock };

    component.detallesDelProducto = [producto];
    component.selectedProducto = [producto];

    component.eliminarProducto();

    expect(component.detallesDelProducto.length).toBe(0);
    expect(tramite302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('detallesDelProducto', []);
    expect(component.modalConfirmacion).toBe('show');
});

  it('should call store on establecerCambioDeValor', () => {
    const event = { campo: 'campo1', valor: 'valor' };
    component.establecerCambioDeValor(event);
    expect(tramite302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo1', 'valor');
  });

  it('should call store on setValoresStore', () => {
    const form = component['fb'].group({ campo1: ['valor'] });
    const event = { campo: 'campo1', forma: form };

    component.setValoresStore(event);
    expect(tramite302StoreMock.setDynamicFieldValue).toHaveBeenCalledWith('campo1', 'valor');
  });

  it('should patch values when modifying modal', () => {
    component.selectedProducto = [{ campo1: 'valor' } as any];
    component.formAgregarProductos = component['fb'].group({ campo1: [''] });
    component.closeModal = { nativeElement: { click: jest.fn() } } as any;

    component.modificarModal();

    expect(component.modal).toBe('show');
    expect(component.formAgregarProductos.get('campo1')?.value).toBe('valor');
  });

  it('should clear form when limpiarProductos is called', () => {
    component.formAgregarProductos = component['fb'].group({ campo1: ['valor'] });

    component.limpiarProductos();

    expect(component.formAgregarProductos.get('campo1')?.value).toBeNull();
  });

  it('should unsubscribe on ngOnDestroy', () => {
    const spy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});