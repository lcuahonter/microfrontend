import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { of, Subject } from 'rxjs';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { SolicitudProrrogaAvisoImportacionService } from '../../services/solicitud-prorroga-aviso-importacion.service';
import { HttpClientModule } from '@angular/common/http';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let mockConsultaQuery: any;
  let mockSolicitudService: any;

  const mockConsultaState = {
    update: false,
  };

  beforeEach(async () => {
    mockConsultaQuery = {
      selectConsultaioState$: of(mockConsultaState),
    };

    mockSolicitudService = {
      obtenerRegistroTomarMuestrasDatos: jest.fn().mockReturnValue(of({ foo: 'bar' })),
      actualizarEstadoFormulario: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [SolicitanteComponent,HttpClientModule],
      providers: [
        { provide: ConsultaioQuery, useValue: mockConsultaQuery },
        { provide: SolicitudProrrogaAvisoImportacionService, useValue: mockSolicitudService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with esDatosRespuesta = true if consultaState.update is false', () => {
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should call guardarDatosFormulario if consultaState.update is true', () => {
    component.consultaState.update = true;
    const spy = jest.spyOn(component, 'guardarDatosFormulario');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call actualizarEstadoFormulario and set esDatosRespuesta to true when guardarDatosFormulario is called and response exists', () => {
    component.guardarDatosFormulario();
    expect(mockSolicitudService.obtenerRegistroTomarMuestrasDatos).toHaveBeenCalled();
    expect(mockSolicitudService.actualizarEstadoFormulario).toHaveBeenCalledWith({ foo: 'bar' });
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('should update indice when seleccionaTab is called', () => {
    component.seleccionaTab(3);
    expect(component.indice).toBe(3);
  });
});
