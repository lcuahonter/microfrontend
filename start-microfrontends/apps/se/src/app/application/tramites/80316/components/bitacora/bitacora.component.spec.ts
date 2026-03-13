import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BitacoraComponent } from './bitacora.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

describe('BitacoraComponent', () => {
  let fixture;
  let component !: BitacoraComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, ToastrModule, HttpClientTestingModule ],
      declarations: [ ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideToastr({
          positionClass: 'toast-top-right',
        }),
      ]
    }).overrideComponent(BitacoraComponent, {
    }).compileComponents();
    fixture = TestBed.createComponent(BitacoraComponent);
    component = fixture.debugElement.componentInstance;
    component.solicitudService = component.solicitudService || {};
    component.solicitudService.obtenerBitacora = jest.fn().mockReturnValue(observableOf({}));
  });

  it('debería ejecutar #constructor()', () => {
    expect(component).toBeTruthy();
  });


  it('debería ejecutar #ngOnDestroy()', () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.unsubscribe = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.unsubscribe).toHaveBeenCalled();
  });

});