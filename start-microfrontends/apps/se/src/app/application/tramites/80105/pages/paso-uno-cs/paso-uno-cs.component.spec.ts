import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PasoUnoCsComponent } from './paso-uno-cs.component';
import { of } from 'rxjs';
import { SeccionLibStore } from '@libs/shared/data-access-user/src/core/estados/seccion.store';
import { Solocitud80105Service } from '../../services/service80105.service';
import { ConsultaioQuery, SolicitanteComponent } from '@ng-mf/data-access-user';
import { ToastrModule } from 'ngx-toastr';

describe('PasoUnoCsComponent', () => {
  let component: PasoUnoCsComponent;
  let fixture: ComponentFixture<PasoUnoCsComponent>;

  let seccionStoreMock: jest.Mocked<SeccionLibStore>;
  let serviceMock: jest.Mocked<Solocitud80105Service>;
  let consultaQueryMock: jest.Mocked<ConsultaioQuery>;

  beforeEach(async () => {
    seccionStoreMock = {
      establecerSeccion: jest.fn(),
      establecerFormaValida: jest.fn(),
    } as any;

    serviceMock = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of({ data: 'mock' })),
      actualizarEstadoFormulario: jest.fn(),
      getRegistroTomaMuestrasMercanciasDatas: jest.fn().mockReturnValue(of({ data: 'mock' })),
      actualizarEstadoFormularios: jest.fn(),
      getRegistroComplementosData: jest.fn().mockReturnValue(of({ data: 'mock' })),
      actualizarComplementos: jest.fn(),
      getRegistroFederatoriosData: jest.fn().mockReturnValue(of({ data: 'mock' })),
      actualizarFederatorios: jest.fn(),
      getRegistroComplementarData: jest.fn().mockReturnValue(of({ data: 'mock' })),
      actualizarComplementar: jest.fn(),
    } as any;

    consultaQueryMock = {
      selectConsultaioState$: of({ update: true }),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [PasoUnoCsComponent],
      imports: [ SolicitanteComponent, HttpClientTestingModule, ToastrModule.forRoot() ], 
      providers: [
        { provide: SeccionLibStore, useValue: seccionStoreMock },
        { provide: Solocitud80105Service, useValue: serviceMock },
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe asignar secciones en init', () => {
    // Expect store methods called during construction
    expect(seccionStoreMock.establecerSeccion).toHaveBeenCalled();
    expect(seccionStoreMock.establecerFormaValida).toHaveBeenCalled();
  });

  it('debe establecer el índice cuando se llama a seleccionaTab', () => {
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('debe establecer esDatosRespuesta y llamar a los métodos del servicio si update es true', () => {
    component.ngOnInit();
    expect(serviceMock.getRegistroTomaMuestrasMercanciasData).toHaveBeenCalled();
    expect(serviceMock.actualizarEstadoFormulario).toHaveBeenCalled();
    expect(serviceMock.getRegistroTomaMuestrasMercanciasDatas).toHaveBeenCalled();
    expect(serviceMock.actualizarEstadoFormularios).toHaveBeenCalled();
    expect(serviceMock.getRegistroComplementosData).toHaveBeenCalled();
    expect(serviceMock.actualizarComplementos).toHaveBeenCalled();
    expect(serviceMock.getRegistroFederatoriosData).toHaveBeenCalled();
    expect(serviceMock.actualizarFederatorios).toHaveBeenCalled();
    expect(serviceMock.getRegistroComplementarData).toHaveBeenCalled();
    expect(serviceMock.actualizarComplementar).toHaveBeenCalled();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe establecer esDatosRespuesta en true si update es false', () => {
    consultaQueryMock.selectConsultaioState$ = of({
      update: false,
      procedureId: null,
      parameter: null,
      department: null,
      folioTramite: null,
      // Add all other required properties of ConsultaioState with mock values
      // Example:
      // anotherProperty: null,
      // ...
    } as any);

    // Recreate component to apply the new observable value
    fixture = TestBed.createComponent(PasoUnoCsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debe limpiar destroyNotifier$ en ngOnDestroy', () => {
    const nextSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'next');
    const completeSpy = jest.spyOn<any, any>(component['destroyNotifier$'], 'complete');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
