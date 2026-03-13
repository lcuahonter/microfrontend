import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistroModificacionComponent } from './registro-modificacion.component';
import { Router } from '@angular/router';
import { SolicitudService } from '../../services/solicitud.service';
import { provideHttpClient } from '@angular/common/http';

@Injectable()
class MockRouter {
  navigate() {};
}

@Injectable()
class solicitudService {}

describe('RegistroModificacionComponent', () => {
  let fixture: ComponentFixture<RegistroModificacionComponent>;
  let component: {
    valorDeAlternancia(): unknown;
    router: any;
    datosDelContenedor: any;
    immerModificacionService: any; ngOnDestroy: () => void; lenarLaTabla: jest.Mock<any, any, any>; ngOnInit: () => void; destroyNotifier$: { next?: any; complete?: any; }; 
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, ReactiveFormsModule, RegistroModificacionComponent ],
      declarations: [],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      providers: [
        provideHttpClient(),
        { provide: Router, useClass: MockRouter },
        { provide: solicitudService, useClass: SolicitudService },
      ]
    }).overrideComponent(RegistroModificacionComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(RegistroModificacionComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy = function() {};
    fixture.destroy();
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngOnInit()', async () => {
    component.lenarLaTabla = jest.fn();
    component.ngOnInit();
    expect(component.lenarLaTabla).toHaveBeenCalled();
  });

  it('should run #ngOnDestroy()', async () => {
    component.destroyNotifier$ = component.destroyNotifier$ || {};
    component.destroyNotifier$.next = jest.fn();
    component.destroyNotifier$.complete = jest.fn();
    component.ngOnDestroy();
    expect(component.destroyNotifier$.next).toHaveBeenCalled();
    expect(component.destroyNotifier$.complete).toHaveBeenCalled();
  });
  
  it('should run valorDeAlternancia and navigate for "se"', () => {
    component.router = {
      url: '/se/immex-modificacion',
      navigate: jest.fn(),
    } as any;
    component.valorDeAlternancia();
    expect(
      component.router.navigate
    ).toHaveBeenCalledWith([
      '/se/modificaciones-immex/solicitud',
    ]);
  });

  it('should run valorDeAlternancia and navigate for "pago"', () => {
    component.router = {
      url: '/pago/immex-modificacion',
      navigate: jest.fn(),
    } as any;
    component.valorDeAlternancia();
    expect(
      component.router.navigate
    ).toHaveBeenCalledWith([
      '/pago/modificaciones-immex/solicitud',
    ]);
  });

});