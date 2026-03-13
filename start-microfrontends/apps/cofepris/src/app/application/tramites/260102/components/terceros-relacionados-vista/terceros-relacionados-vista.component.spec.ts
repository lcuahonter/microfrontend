// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
Input,
  CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA,
  Injectable
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { Tramite260102Store } from '../../estados/stores/tramite260102Store.store';
import { Tramite260102Query } from '../../estados/queries/tramite260102Query.query';
import { ConsultaioQuery } from '@ng-mf/data-access-user';

@Injectable()
class MockTramite260102Store {
  updateFabricanteTablaDatos = jest.fn();
  updateDestinatarioFinalTablaDatos = jest.fn();
  updateProveedorTablaDatos = jest.fn();
  updateFacturadorTablaDatos = jest.fn();
}

@Injectable()
class MockTramite260102Query {
  getFabricanteTablaDatos$ = observableOf([]);
  getDestinatarioFinalTablaDatos$ = observableOf([]);
  getProveedorTablaDatos$ = observableOf([]);
  getFacturadorTablaDatos$ = observableOf([]);
}

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TercerosRelacionadosVistaComponent
      ],
      providers: [
        { provide: Tramite260102Store, useClass: MockTramite260102Store },
        { provide: Tramite260102Query, useClass: MockTramite260102Query },
        { provide: ConsultaioQuery, useValue: { selectConsultaioState$: observableOf({}) } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              queryParams: {}
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fabricantes$ observable on ngOnInit', () => {
    expect(component.fabricanteTablaDatos).toBeDefined();
  });

  it('should initialize destinatarios$ observable on ngOnInit', () => {
    expect(component.destinatarioFinalTablaDatos).toBeDefined();
  });

  it('should initialize proveedores$ observable on ngOnInit', () => {
    expect(component.proveedorTablaDatos).toBeDefined();
  });

  it('should initialize facturadores$ observable on ngOnInit', () => {
    expect(component.facturadorTablaDatos).toBeDefined();
  });

  it('should run addFabricantes()', () => {
    const store = TestBed.inject(Tramite260102Store);
    component.addFabricantes({ id: 1 });
    expect(store.updateFabricanteTablaDatos).toHaveBeenCalled();
  });

  it('should run addDestinatarios()', () => {
    const store = TestBed.inject(Tramite260102Store);
    component.addDestinatarios({ id: 2 });
    expect(store.updateDestinatarioFinalTablaDatos).toHaveBeenCalled();
  });

  it('should run addProveedores()', () => {
    const store = TestBed.inject(Tramite260102Store);
    component.addProveedores({ id: 3 });
    expect(store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run addFacturadores()', () => {
    const store = TestBed.inject(Tramite260102Store);
    component.addFacturadores({ id: 4 });
    expect(store.updateFacturadorTablaDatos).toHaveBeenCalled();
  });

  it('should clean up on ngOnDestroy()', () => {
    component.destroy$ = {
      next: jest.fn(),
      complete: jest.fn()
    };
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
