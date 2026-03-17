import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { ConceptosComponent } from './conceptos.component';
import { RegistrosDeComercioExteriorService } from '../../services/registros-de-comercio-exterior.service';
import { Tramite31603IvaeiepsStore } from '../../estados/stores/tramite31603ivaeieps.store';
import { Tramite31603IvaeiepsQuery } from '../../estados/queries/tramite31603ivaeieps.query';

describe('ConceptosComponent', () => {
  let component: ConceptosComponent;
  let fixture: ComponentFixture<ConceptosComponent>;
  let comercioExteriorSvcMock: any;
  let tramite31603StoreMock: any;
  let tramite31603QueryMock: any;

  beforeEach(async () => {
    comercioExteriorSvcMock = {
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, name: 'Banco 1' }] })),
    };
    tramite31603StoreMock = {};
    tramite31603QueryMock = {
      selectSolicitud$: of({ transferencias: 'test' }),
    };

    await TestBed.configureTestingModule({
      imports: [ConceptosComponent],
      providers: [
        FormBuilder,
        { provide: RegistrosDeComercioExteriorService, useValue: comercioExteriorSvcMock },
        { provide: Tramite31603IvaeiepsStore, useValue: tramite31603StoreMock },
        { provide: Tramite31603IvaeiepsQuery, useValue: tramite31603QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConceptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize conceptosForm on ngOnInit', () => {
    expect(component.conceptosForm).toBeDefined();
    expect(component.conceptosForm.get('transferencias')?.value).toBe('test');
  });

  it('should call getBancoCatalogDatos and populate catalog data', () => {
    component.getBancoCatalogDatos();
    expect(comercioExteriorSvcMock.getBancoDatos).toHaveBeenCalled();
    expect(component.bimestreUnoCatalogo).toEqual([{ id: 1, name: 'Banco 1' }]);
    expect(component.bimestreDosCatalogo).toEqual([{ id: 1, name: 'Banco 1' }]);
    expect(component.bimestreTresCatalogo).toEqual([{ id: 1, name: 'Banco 1' }]);
  });

  it('should update valorSeleccionado on onEmpleadosPropiosCambio', () => {
    component.onEmpleadosPropiosCambio('testValue');
    expect(component.valorSeleccionado).toBe('testValue');
  });

  it('should update conEmpleadosSeleccionado on onConEmpleados', () => {
    component.onConEmpleados('testValue');
    expect(component.conEmpleadosSeleccionado).toBe('testValue');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
