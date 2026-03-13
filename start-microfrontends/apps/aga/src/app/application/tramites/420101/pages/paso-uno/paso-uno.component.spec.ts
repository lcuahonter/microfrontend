// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  Injectable
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { PasoUnoComponent } from './paso-uno.component';
import { Tramite420101Query } from '../../estados/tramite420101Query.query';
import { Tramite420101Store } from '../../estados/tramite420101Store.store';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Injectable()
class MockTramite420101Query {}

@Injectable()
class MockTramite420101Store {}

describe('PasoUnoComponent', () => {
  let fixture: ComponentFixture<PasoUnoComponent>;
  let component: PasoUnoComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      declarations: [PasoUnoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Tramite420101Query, useClass: MockTramite420101Query },
        { provide: Tramite420101Store, useClass: MockTramite420101Store }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.tramite420101Query = component.tramite420101Query || {};
    component.tramite420101Query.getTabSeleccionado$ = observableOf({});
    component.ngOnInit();
  });

  it('should run #seleccionaTab()', async () => {
    component.tramite420101Store = component.tramite420101Store || {};
    component.tramite420101Store.updateTabSeleccionado = jest.fn();
    component.seleccionaTab({});
    expect(component.tramite420101Store.updateTabSeleccionado).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {
      next: jest.fn(),
      complete: jest.fn()
    };
    component.ngOnDestroy();

    
  });
});