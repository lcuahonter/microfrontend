import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MercanciasSeleccionadasFormComponent } from './mercancias-seleccionadas-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CertificadoTecnicoJaponService } from '../../service/certificadoTecnicoJapon.service';
import { Tramite110218Query } from '../../estados/queries/tramite110218.query';
import { Tramite110218Store } from '../../estados/tramites/tramite110218.store';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MercanciasSeleccionadasFormComponent', () => {
  let component: MercanciasSeleccionadasFormComponent;
  let fixture: ComponentFixture<MercanciasSeleccionadasFormComponent>;
  let mockService: any;
  let mockQuery: any;
  let mockStore: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockService = {
      getUnidadMedida: jest.fn().mockReturnValue(of([{ id: 1, descripcion: 'Unidad' }])),
      getTipodeFctura: jest.fn().mockReturnValue(of([{ id: 2, descripcion: 'Factura' }]))
    };
    mockQuery = {
      selectTramite110218State$: of({
        complementoDelaDescripcion: 'desc',
        marca: 'marca',
        valorMercancia: 100,
        unidaddeMedidadeComercializacion: 1,
        numerodeFactura: '123',
        tipodeFactura: 2
      })
    };
    mockStore = {
      setTramite110218State: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [MercanciasSeleccionadasFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CertificadoTecnicoJaponService, useValue: mockService },
        { provide: Tramite110218Query, useValue: mockQuery },
        { provide: Tramite110218Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MercanciasSeleccionadasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar unidaddeMedidadeComercializacionOptions al llamar unidadMedidaData', () => {
    component.unidadMedidaData();
    expect(mockService.getUnidadMedida).toHaveBeenCalled();
    expect(component.unidaddeMedidadeComercializacionOptions).toEqual([{ id: 1, descripcion: 'Unidad' }]);
  });

  it('debería inicializar tipodeFacturaOptions al llamar tipoDeFactura', () => {
    component.tipoDeFactura();
    expect(mockService.getTipodeFctura).toHaveBeenCalled();
    expect(component.tipodeFacturaOptions).toEqual([{ id: 2, descripcion: 'Factura' }]);
  });

  it('debería actualizar los valores del formulario en tableDataValues si selectedRow existe', () => {
    component.inicializarFormulario();
    component.selectedRow = { nombreComercial: 'Com', nombreIngles: 'Ing', cantidad: '100', fechadelaFactura: '2024-11-13' } as any;
    component.tableDataValues();
    expect(component.modifydatosdelcertificado.get('nombreComercial')?.value).toBe('Com');
    expect(component.modifydatosdelcertificado.get('nombreIngles')?.value).toBe('Ing');
    expect(component.modifydatosdelcertificado.get('cantidad')?.value).toBe('100');
    expect(component.modifydatosdelcertificado.get('fechadelaFactura')?.value).toBe('2024-11-13');
  });

  it('debería emitir true en modificarSuccess', () => {
    const spy = jest.spyOn(component.modificarÉxitoBtn, 'emit');
    component.modificarSuccess();
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('debería actualizar el store con setValorStore', () => {
    component.inicializarFormulario();
    component.modifydatosdelcertificado.get('marca')?.setValue('NuevaMarca');
    component.setValorStore(component.modifydatosdelcertificado, 'marca');
    expect(mockStore.setTramite110218State).toHaveBeenCalledWith({ marca: 'NuevaMarca' });
  });

  it('debería actualizar estadoSeleccionado al llamar getValorStore', () => {
    component.getValorStore();
    expect(component.estadoSeleccionado).toEqual(expect.objectContaining({
      complementoDelaDescripcion: 'desc',
      marca: 'marca'
    }));
  });

  it('debería limpiar destroyed$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn((component as any).destroyed$, 'next');
    const completeSpy = jest.spyOn((component as any).destroyed$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('debería inicializar el formulario con los valores por defecto correctos', () => {
    component.estadoSeleccionado = {
      complementoDelaDescripcion: 'desc',
      marca: 'marca',
      valorMercancia: 100,
      unidaddeMedidadeComercializacion: 1,
      numerodeFactura: '123',
      tipodeFactura: 2
    } as any;
    component.inicializarFormulario();
    expect(component.modifydatosdelcertificado.get('complementoDelaDescripcion')?.value).toBe('desc');
    expect(component.modifydatosdelcertificado.get('marca')?.value).toBe('marca');
    expect(component.modifydatosdelcertificado.get('valorMercancia')?.value).toBe(100);
    expect(component.modifydatosdelcertificado.get('unidaddeMedidadeComercializacion')?.value).toBe(1);
    expect(component.modifydatosdelcertificado.get('numerodeFactura')?.value).toBe('123');
    expect(component.modifydatosdelcertificado.get('tipodeFactura')?.value).toBe(2);
  });
});