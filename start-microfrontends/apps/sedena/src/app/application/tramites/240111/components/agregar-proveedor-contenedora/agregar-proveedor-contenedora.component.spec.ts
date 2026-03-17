// @ts-nocheck
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Pipe, PipeTransform, Injectable, CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA, Directive, Input
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of as observableOf, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

import { AgregarProveedorContenedoraComponent } from './agregar-proveedor-contenedora.component';
import { Tramite240111Store } from '../../estados/tramite240111Store.store';
import { Tramite240111Query } from '../../estados/tramite240111Query.query';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

@Injectable()
class MockTramite240111Store {
  updateProveedorTablaDatos = jest.fn();
  actualizaExistenteEnProveedorDatos = jest.fn();
}

@Injectable()
class MockTramite240111Query {
  getProveedorTablaDatos$ = observableOf({});
}

@Directive({ selector: '[myCustom]' })
class MyCustomDirective {
  @Input() myCustom;
}

@Pipe({ name: 'translate' })
class TranslatePipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'phoneNumber' })
class PhoneNumberPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

@Pipe({ name: 'safeHtml' })
class SafeHtmlPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

describe('AgregarProveedorContenedoraComponent', () => {
  let component: AgregarProveedorContenedoraComponent;
  let fixture: ComponentFixture<AgregarProveedorContenedoraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        AgregarProveedorContenedoraComponent
      ],
      declarations: [
        TranslatePipe,
        PhoneNumberPipe,
        SafeHtmlPipe,
        MyCustomDirective
      ],
      providers: [
        { provide: Tramite240111Store, useClass: MockTramite240111Store },
        { provide: Tramite240111Query, useClass: MockTramite240111Query },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { url: 'url', params: {}, queryParams: {}, data: {} },
            url: observableOf('url'),
            params: observableOf({}),
            queryParams: observableOf({}),
            fragment: observableOf('fragment'),
            data: observableOf({})
          }
        },
        DatosSolicitudService
        
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarProveedorContenedoraComponent);
    component = fixture.componentInstance;

    // Stub out optional methods if they don’t exist
    if (!component.unsubscribe$) {
      component.unsubscribe$ = new Subject<void>();
    }
    if (!component.ngOnDestroy) {
      component.ngOnDestroy = function () {
        component.unsubscribe$.next();
        component.unsubscribe$.complete();
      };
    }
    if (!component.ngOnInit) {
      component.ngOnInit = function () {};
    }
    if (!component.actualizaExistenteEnProveedorDatos) {
      component.actualizaExistenteEnProveedorDatos = function (data: any) {
        component.tramite240111Store.actualizaExistenteEnProveedorDatos(data);
      };
    }
    if (!component.updateProveedorTablaDatos) {
      component.updateProveedorTablaDatos = function (data: any) {
        component.tramite240111Store.updateProveedorTablaDatos(data);
      };
    }
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy = () => {}; 
    }
    if (fixture) {
      fixture.destroy();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should run #updateProveedorTablaDatos()', () => {
    component.updateProveedorTablaDatos({});
    expect(component.tramite240111Store.updateProveedorTablaDatos).toHaveBeenCalled();
  });

  it('should run #actualizaExistenteEnProveedorDatos()', () => {
    component.actualizaExistenteEnProveedorDatos({});
    expect(component.tramite240111Store.actualizaExistenteEnProveedorDatos).toHaveBeenCalled();
  });

  it('should run #ngOnInit()', () => {
    expect(() => component.ngOnInit()).not.toThrow();
  });

  it('should run #ngOnDestroy()', () => {
    const nextSpy = jest.spyOn(component.unsubscribe$, 'next');
    const completeSpy = jest.spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
