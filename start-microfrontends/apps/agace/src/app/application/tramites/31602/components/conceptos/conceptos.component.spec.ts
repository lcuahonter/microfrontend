import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ConceptosComponent } from './conceptos.component';
import { ComercioExteriorService } from '../../services/comercio-exterior.service';
import { Tramite31602IvaeiepsStore } from '../../estados/stores/tramite31602ivaeieps.store';
import { Tramite31602IvaeiepsQuery } from '../../estados/queries/tramite31602ivaeieps.query';

describe('ConceptosComponent', () => {
  let component: ConceptosComponent;
  let fixture: ComponentFixture<ConceptosComponent>;
  let comercioExteriorServiceMock: any;
  let tramite31602StoreMock: any;
  let tramite31602QueryMock: any;

  beforeEach(async () => {
    comercioExteriorServiceMock = {
      getBancoDatos: jest.fn().mockReturnValue(of({ data: [{ id: 1, name: 'Banco 1' }] })),
    };

    tramite31602StoreMock = {
      setTransferencias: jest.fn(),
    };

    tramite31602QueryMock = {
      selectSolicitud$: of({
        transferencias: 'test',
        transferenciasVir: 'testVir',
      }),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ConceptosComponent],
      providers: [
        { provide: ComercioExteriorService, useValue: comercioExteriorServiceMock },
        { provide: Tramite31602IvaeiepsStore, useValue: tramite31602StoreMock },
        { provide: Tramite31602IvaeiepsQuery, useValue: tramite31602QueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConceptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize conceptosForm with default values', () => {
    expect(component.conceptosForm.value).toEqual({
      transferencias: 'test',
      transferenciasVir: 'testVir',
      retornos: null,
      retornosSe: null,
      constancias: null,
      constanciasDe: null,
      total: null,
      totalDos: null,
      empleadosPropios: null,
      conEmpleados: null,
      indiqueSiLosSocios: null,
      numeroEmpleados: null,
      numeroEmpleadosDos: null,
      numeroEmpleadosTres: null,
      comboBimestresUno: null,
      comboBimestresDos: null,
      comboBimestresTres: null,
    });
  });

  it('should call getBancoCatalogDatos and populate catalog data', () => {
    component.getBancoCatalogDatos();
    expect(comercioExteriorServiceMock.getBancoDatos).toHaveBeenCalled();
    expect(component.bimestreUnoCatalogo).toEqual([{ id: 1, name: 'Banco 1' }]);
    expect(component.bimestreDosCatalogo).toEqual([{ id: 1, name: 'Banco 1' }]);
    expect(component.bimestreTresCatalogo).toEqual([{ id: 1, name: 'Banco 1' }]);
  });

  it('should update valorSeleccionado on onEmpleadosPropiosCambio', () => {
    component.onEmpleadosPropiosCambio('Yes');
    expect(component.valorSeleccionado).toBe('Yes');
  });

  it('should update conEmpleadosSeleccionado on onConEmpleados', () => {
    component.onConEmpleados('No');
    expect(component.conEmpleadosSeleccionado).toBe('No');
  });

  it('should call setValoresStore and update store', () => {
    const form = component.conceptosForm;
    form.get('transferencias')?.setValue('Updated Value');
    component.setValoresStore(form, 'transferencias', 'setTransferencias');
    expect(tramite31602StoreMock.setTransferencias).toHaveBeenCalledWith('Updated Value');
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
