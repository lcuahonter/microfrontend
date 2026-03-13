import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';
import { DatosMercanciaService } from '../../services/datos-mercancia/datos-mercancia.service';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockDatosMercanciaService: any;
  let mockConsultaQuery: any;
  let consultaioStateSubject: Subject<any>;

  beforeEach(async () => {
    consultaioStateSubject = new Subject();

    mockDatosMercanciaService = {
      obtenerDatosMercancia: jest.fn(),
      actualizarFormularioMovilizacion: jest.fn()
    };

    mockConsultaQuery = {
      selectConsultaioState$: consultaioStateSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [PasoUnoComponent,HttpClientTestingModule],
      providers: [
        { provide: DatosMercanciaService, useValue: mockDatosMercanciaService },
        { provide: ConsultaioQuery, useValue: mockConsultaQuery }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should handle consultaQuery state update === false and set esDatosRespuesta to true', () => {
    consultaioStateSubject.next({ update: false });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call datosMercanciaService.obtenerDatosMercancia and actualizarFormularioMovilizacion when data is received', () => {
    const data = { datos: { test: 'value' } };
    mockDatosMercanciaService.obtenerDatosMercancia.mockReturnValue(of(data));

    component.guardarDatosFormulario();

    expect(mockDatosMercanciaService.obtenerDatosMercancia).toHaveBeenCalled();
    expect(mockDatosMercanciaService.actualizarFormularioMovilizacion).toHaveBeenCalledWith(data.datos);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should not call actualizarFormularioMovilizacion if data is undefined or null', () => {
    mockDatosMercanciaService.obtenerDatosMercancia.mockReturnValue(of(null));

    component.guardarDatosFormulario();

    expect(mockDatosMercanciaService.actualizarFormularioMovilizacion).not.toHaveBeenCalled();
  });

  it('should change selected tab index when seleccionaTab is called', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should cleanup destroyNotifier$ on ngOnDestroy', () => {
    const completeSpy = jest.spyOn(component['destroyNotifier$'], 'complete');
    const nextSpy = jest.spyOn(component['destroyNotifier$'], 'next');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
