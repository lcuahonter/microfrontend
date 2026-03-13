import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasoUnoComponent } from './paso-uno.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { DatosComunesTresComponent } from '../../../../shared/components/datos-comunes-tres/datos-comunes-tres.component';
import { TercerosRelacionadosComponent } from '../../../../shared/components/terceros-relacionados/terceros-relacionados.component';
import { TransporteFerroviarioComponent } from '../../components/transporte-ferroviario/transporte-ferroviario.component';
import { PerfilesFerrovarioComponent } from '../../components/perfiles-ferrovario/perfiles-ferrovario.component';
import { of } from 'rxjs';
import { ConsultaioQuery } from '@ng-mf/data-access-user';
import { DatosComunesTresService } from '../../../../shared/services/datos-comunes-tres.service';
import { RubroTransporteFerrovarioService } from '../../services/rubro-transporte-ferrovario/rubro-transporte-ferrovario.service';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosComunesTresServiceMock: any;
  let rubroTransporteFerrovarioServiceMock: any;
  let consultaQueryMock: any;

  beforeEach(async () => {
    datosComunesTresServiceMock = {
    getDatosComunesTresData: jest.fn(() => of({ a: 1 })),
    actualizarEstadoFormulario: jest.fn()
  };

    rubroTransporteFerrovarioServiceMock = {
      getrubroTransporteFerrovarioData: jest.fn(() => of({ b: 2 })),
      actualizarEstadoFormulario: jest.fn()
    };

    consultaQueryMock = {
      selectConsultaioState$: of({ update: true })
    };

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [HttpClientTestingModule, SolicitanteComponent, DatosComunesTresComponent, TercerosRelacionadosComponent, TransporteFerroviarioComponent, PerfilesFerrovarioComponent],
      providers: [
        { provide: ConsultaioQuery, useValue: consultaQueryMock },
        { provide: DatosComunesTresService, useValue: datosComunesTresServiceMock },
        { provide: RubroTransporteFerrovarioService, useValue: rubroTransporteFerrovarioServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener el valor predeterminado de indice como 1', () => {
    expect(component.indice).toBe(1);
  });

  it('debería actualizar el indice cuando se llama a seleccionaTab', () => {
    component.indice = 1;
    expect(component.indice).toBe(1);

    component.seleccionaTab(2);
    expect(component.indice).toBe(2);

    component.seleccionaTab(3);
    expect(component.indice).toBe(3);

    component.seleccionaTab(4);
    expect(component.indice).toBe(4);
  });

  it('debería establecer consultaState y llamar a guardarDatosFormulario cuando update es true', () => {
    const mockConsultaState = { update: true, readonly: false };
    const guardarSpy = jest.spyOn(component, 'guardarDatosFormulario');
    (component as any).consultaQuery = {
      selectConsultaioState$: of(mockConsultaState),
    };
    component.ngOnInit();
    expect(component.consultaState.update).toBeTruthy();
    expect(guardarSpy).toHaveBeenCalled();
  });

  it('debería llamar a actualizarEstadoFormulario para cada clave/valor del datosComunesTresService y rubroTransporteFerrovarioService', () => {
    component.guardarDatosFormulario();
    expect(datosComunesTresServiceMock.getDatosComunesTresData).toHaveBeenCalled();
    expect(datosComunesTresServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('a', 1);
    expect(rubroTransporteFerrovarioServiceMock.getrubroTransporteFerrovarioData).toHaveBeenCalled();
    expect(rubroTransporteFerrovarioServiceMock.actualizarEstadoFormulario).toHaveBeenCalledWith('b', 2);
    expect(component.esDatosRespuesta).toBe(true);
  });

  it('debería completar destroyNotifier$ en ngOnDestroy', () => {
      const completeSpy = jest.spyOn(
        (component as any).destroyNotifier$,
        'complete'
      );
      const nextSpy = jest.spyOn((component as any).destroyNotifier$, 'next');
      component.ngOnDestroy();
      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
});
