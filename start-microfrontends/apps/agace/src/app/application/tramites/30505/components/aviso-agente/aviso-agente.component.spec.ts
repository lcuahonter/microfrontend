import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvisoAgenteComponent } from './aviso-agente.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Solicitud30505Store } from '../../../../estados/tramites/tramites30505.store';
import { Solicitud30505Query } from '../../../../estados/queries/tramites30505.query';
import { TercerosRelacionadosService } from '../../services/terceros-relacionados.service';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
describe('AvisoAgenteComponent', () => {
  let component: AvisoAgenteComponent;
  let fixture: ComponentFixture<AvisoAgenteComponent>;
  let routerMock: any;
  let routeMock: any;
  let tercerosServiceMock: any;
  let tramiteStoreMock: any;
  let tramiteQueryMock: any;

  beforeEach(async () => {
    routerMock = { navigate: jest.fn() };
    routeMock = {};
    tercerosServiceMock = { setAgente: jest.fn() };
    tramiteStoreMock = { eliminarAgento: jest.fn() };
    tramiteQueryMock = {
      selectSolicitud$: of({ agenteDatos: [{ id: 1, nombre: 'Agente' }] })
    };

    await TestBed.configureTestingModule({
      imports: [AvisoAgenteComponent,HttpClientTestingModule],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: TercerosRelacionadosService, useValue: tercerosServiceMock },
        { provide: Solicitud30505Store, useValue: tramiteStoreMock },
        { provide: Solicitud30505Query, useValue: tramiteQueryMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvisoAgenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call router.navigate on AgregarTransportias', () => {
    component.AgregarTransportias();
    expect(routerMock.navigate).toHaveBeenCalledWith(['../agregar-agente'], { relativeTo: routeMock });
  });

  it('should set modal property to default value', () => {
    expect(component.modal).toBe('modal');
  });

  it('should initialize avisoAgenteDatos as array with one item', () => {
    expect(Array.isArray(component.avisoAgenteDatos)).toBe(true);
    expect(component.avisoAgenteDatos.length).toBe(1);
  });
});
