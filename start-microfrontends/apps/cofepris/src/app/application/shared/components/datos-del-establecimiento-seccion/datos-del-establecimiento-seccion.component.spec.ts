// @ts-nocheck
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Directive, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of as observableOf } from 'rxjs';

import { DatosDelEstablecimientoSeccionComponent } from './datos-del-establecimiento-seccion.component';
import { FormBuilder } from '@angular/forms';
import { DatosDelSolicituteSeccionStateStore } from '../../estados/stores/datos-del-solicitute-seccion.store';
import { DatosDelSolicituteSeccionQuery } from '../../estados/queries/datos-del-solicitute-seccion.query';

@Injectable()
class MockDatosDelSolicituteSeccionStateStore {
  update = jest.fn();
}

@Injectable()
class MockDatosDelSolicituteSeccionQuery {
  select = jest.fn().mockReturnValue(observableOf({}));
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value) {
    return value;
  }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
 ;
  }


describe('DatosDelEstablecimientoSeccionComponent', () => {
  let fixture: ComponentFixture<DatosDelEstablecimientoSeccionComponent>;
  let component: DatosDelEstablecimientoSeccionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [
        DatosDelEstablecimientoSeccionComponent,
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective,
      CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        FormBuilder,
        { provide: DatosDelSolicituteSeccionStateStore, useClass: MockDatosDelSolicituteSeccionStateStore },
        { provide: DatosDelSolicituteSeccionQuery, useClass: MockDatosDelSolicituteSeccionQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDelEstablecimientoSeccionComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty state on ngOnInit when state is null', () => {
    jest.spyOn(component.establecimientoQuery, 'select').mockReturnValue(observableOf(null));
    component.ngOnInit();
    expect(component.detosEstablecimiento.value).toEqual({});
  });

  it('should initialize the form with state on ngOnInit when state is defined', () => {
    const mockState = { nombreEspecifico: 'Test Name' };
    jest.spyOn(component.establecimientoQuery, 'select').mockReturnValue(observableOf(mockState));
    component.ngOnInit();
    expect(component.detosEstablecimiento.value).toEqual(mockState);
  });

  it('should update the store on form value changes', () => {
    component.ngOnInit();
    const mockValue = { nombreEspecifico: 'Updated Name' };
    component.detosEstablecimiento.patchValue(mockValue);
    expect(component.establecimientoStore.update).toHaveBeenCalledWith(mockValue);
  });

  it('should open the establecimiento modal', () => {
    component.establecimientoModalInstance = { show: jest.fn() } as any;
    component.openEstablecimientoModal();
    expect(component.establecimientoModalInstance.show).toHaveBeenCalled();
  });

  it('should close the establecimiento modal', () => {
    component.establecimientoModalInstance = { hide: jest.fn() } as any;
    component.closeEstablecimientoModal();
    expect(component.establecimientoModalInstance.hide).toHaveBeenCalled();
  });

  it('should clean up subscriptions on ngOnDestroy', () => {
    const destroySpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should bind form control to input field', () => {
    component.ngOnInit();
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input[formControlName="nombreEspecifico"]')).nativeElement;
    input.value = 'New Value';
    input.dispatchEvent(new Event('input'));
    expect(component.detosEstablecimiento.get('nombreEspecifico')?.value).toBe('New Value');
  });

  it('should handle null state gracefully', () => {
    jest.spyOn(component.establecimientoQuery, 'select').mockReturnValue(observableOf(null));
    component.ngOnInit();
    expect(component.detosEstablecimiento.value).toEqual({});
  });
});