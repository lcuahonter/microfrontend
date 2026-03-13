import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TercerosRelacionadosFabricanteComponent } from './terceros-relacionados-fabricante.component';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-fabricante/terceros-fabricante.component';
import SELECT_OPTIONS_DATA from '@libs/shared/theme/assets/json/260501/fabricante-select-options-data.json';
import { Tramite260509Store } from '../../../../estados/tramites/260509/tramite260509.store';
@Component({
  template: `
    <app-terceros-relacionados-fabricante
      [isContinuarTriggered]="trigger"
    ></app-terceros-relacionados-fabricante>
  `
})
class HostWrapperComponent {
  trigger = false;
}

class MockTramite260509Store {
  setFormValidity = jest.fn();
}

describe('TercerosRelacionadosFabricanteComponent (REAL children)', () => {
  let fixture: ComponentFixture<HostWrapperComponent>;
  let host: HostWrapperComponent;
  let component: TercerosRelacionadosFabricanteComponent;
  let store: MockTramite260509Store;

  beforeEach(async () => {
    (SELECT_OPTIONS_DATA as any) = {
      localidadSelectData: [],
      codigoPostalSelectData: [],
      coloniaSelectData: [],
      municipioSelectData: [],
      paisSelectData: [],
    };
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TercerosRelacionadosFabricanteComponent,
        TercerosRelacionadosComponent
      ],
      declarations: [HostWrapperComponent],
      providers: [
        { provide: Tramite260509Store, useClass: MockTramite260509Store }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HostWrapperComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.children[0];
    component = element.componentInstance;
    store = TestBed.inject(Tramite260509Store) as any;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default idProcedimiento', () => {
    expect(component.idProcedimiento).toBe(260502);
  });

  it('should call setFormValidity for fabricante', () => {
    component.onTableValidEvent('fabricante');
    expect(store.setFormValidity).toHaveBeenCalledWith('fabricanteTablaValid', true);
  });

  it('should call setFormValidity for formulador', () => {
    component.onTableValidEvent('formulador');
    expect(store.setFormValidity).toHaveBeenCalledWith('formuladorTablaValid', true);
  });

  it('should call setFormValidity for proveedor', () => {
    component.onTableValidEvent('proveedor');
    expect(store.setFormValidity).toHaveBeenCalledWith('proveedorTablaValid', true);
  });

  it('should call child.markTouched() when validarFormulario() is triggered', () => {
    const child = component.tercerosRelacionadosComponent;
    jest.spyOn(child, 'markTouched');
    component.validarFormulario();
    expect(child.markTouched).toHaveBeenCalled();
  });

  it('should call markTouched() when table valid event fires', () => {
    const child = component.tercerosRelacionadosComponent;
    jest.spyOn(child, 'markTouched');
    component.onTableValidEvent('fabricante');
    expect(child.markTouched).toHaveBeenCalled();
  });
});
