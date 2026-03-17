import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasoUnoComponent } from './paso-uno.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { DatosTramiteService } from '../../services/datos-tramite.service';
import { Tramite11201Store } from '../../../../core/estados/tramites/tramite11201.store';
import { fakeAsync, tick } from '@angular/core/testing';
import { TIPO_PERSONA } from '@libs/shared/data-access-user/src';



describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let datosTramiteServiceMock: any;
  let tramite11201StoreMock: any;

  beforeEach(() => {
    datosTramiteServiceMock = {
      getDatosConsulta: jest.fn().mockReturnValue(
        of({
          "success": true,
          "message": "",
          "datos": {
            "tipoBusqueda": "Contenedor",
            "aduana": "0",
            "fechaIngreso": "15/10/2025",
            "inicialesContenedor": "equipo",
            "numeroContenedor": "equipo",
            "digitoDeControl": "1",
            "contenedores": "C11223",
            "aduanaMenuDesplegable": "0",
            "fechaDeIngreso": "15/10/2025",
            "menuDesplegable": "0",
            "numeroManifiesta": "1",
            "datosDelContenedor": [
              {
                "id": 1,
                "inicialesEquipo": "BBZM",
                "numeroEquipo": 1098765,
                "digitoVerificador": 4,
                "tipoEquipo": "AC",
                "aduana": 430,
                "fechaIngreso": "2024-03-13",
                "vigencia": "2025-03-13",
                "estadoConstancia": "Válido",
                "existeEnVUCEM": "Sí",
                "idConstancia": "CONST12345",
                "numeroManifiesto": "MANI67890",
                "idSolicitud": "SOLICITUD001",
                "fechaInicio": "2024-03-01"
              }
            ]
          }
        })
      )
    };

    tramite11201StoreMock = {
      setTipoBusqueda: jest.fn(),
      setAduana: jest.fn(),
      setFechaIngreso: jest.fn(),
      setInicialesContenedor: jest.fn(),
      setNumeroContenedor: jest.fn(),
      setDigitoDeControl: jest.fn(),
      setContenedores: jest.fn(),
      setFechaDeIngreso: jest.fn(),
      setAduanaMenuDesplegable: jest.fn(),
      setMenuDesplegable: jest.fn(),
      setNumeroManifiesta: jest.fn(),
      setDelContenedor: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, PasoUnoComponent],
      providers: [
        provideHttpClient(), provideHttpClientTesting(),
        { provide: DatosTramiteService, useValue: datosTramiteServiceMock },
        { provide: Tramite11201Store, useValue: tramite11201StoreMock },
      ]
    }).overrideComponent(PasoUnoComponent, {

    }).compileComponents();
    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.debugElement.componentInstance;
    
  });

  it('should run #constructor()', async () => {
    expect(component).toBeTruthy();
  });

  it('should run #ngAfterViewInit()', async () => {
    component.ngAfterViewInit();
  });

  it('should run #seleccionaTab()', async () => {
    component.seleccionaTab(1);
  });

  it('should emit continuarEvento when continuar is called', () => {
    const spy = jest.spyOn(component.continuarEvento, 'emit');
    component.continuar();
    expect(spy).toHaveBeenCalledWith('');
  });

  it('should open modal when cancelar is called', () => {
    const abrirModalSpy = jest.spyOn(component, 'abrirModal');
    component.cancelar();
    expect(abrirModalSpy).toHaveBeenCalled();
  });

  it('should reset solicitudForm, set indice to 2, and emit cancelarEvento when confirmarCancelacion is called with true', () => {
    component.contenedorComponent = { 
      solicitudForm: { reset: jest.fn() },
      limpiarCampos: jest.fn(),
      datosTabla: [],
      datosDelContenedor: []
    } as any;
    component.tramite11201Store = { limpiarSolicitud: jest.fn() } as any;
    const resetSpy = jest.spyOn(component.contenedorComponent.solicitudForm, 'reset');
    const cancelarSpy = jest.spyOn(component.cancelarEvento, 'emit');
    const obtenerTipoPersonaSpy = jest.spyOn(component, 'obtenerTipoPersona');

    component.confirmarCancelacion(true);

    expect(resetSpy).toHaveBeenCalled();
    expect(component.indice).toBe(2);
    expect(cancelarSpy).toHaveBeenCalled();
    expect(obtenerTipoPersonaSpy).toHaveBeenCalled();
  });

  it('should clean up subscriptions when ngOnDestroy is called', () => {
    const destroySpy = jest.spyOn(component.destroyNotifier$, 'next');
    const completeSpy = jest.spyOn(component.destroyNotifier$, 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalledWith();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should call obtenerTipoPersona on SolicitanteComponent with TIPO_PERSONA.MORAL_NACIONAL', (done) => {
    component.solicitante = {
      obtenerTipoPersona: jest.fn(),
    } as any;
    component.obtenerTipoPersona();
    setTimeout(() => {
      expect(component.solicitante.obtenerTipoPersona).toHaveBeenCalledWith(TIPO_PERSONA.MORAL_NACIONAL);
      done();
    }, 50);
  });


  it('should fetch data and update the store when fetchGetDatosConsulta is called', () => {
    component.fetchGetDatosConsulta();
    expect(datosTramiteServiceMock.getDatosConsulta).toHaveBeenCalled();
    expect(tramite11201StoreMock.setTipoBusqueda).toHaveBeenCalled();
    expect(tramite11201StoreMock.setAduana).toHaveBeenCalled();
    expect(tramite11201StoreMock.setFechaIngreso).toHaveBeenCalled()
    expect(tramite11201StoreMock.setInicialesContenedor).toHaveBeenCalled()
    expect(tramite11201StoreMock.setNumeroContenedor).toHaveBeenCalled()
    expect(tramite11201StoreMock.setDigitoDeControl).toHaveBeenCalled()
    expect(tramite11201StoreMock.setContenedores).toHaveBeenCalled()
    expect(tramite11201StoreMock.setFechaDeIngreso).toHaveBeenCalled()
    expect(tramite11201StoreMock.setAduanaMenuDesplegable).toHaveBeenCalled()
    expect(tramite11201StoreMock.setMenuDesplegable).toHaveBeenCalled()
    expect(tramite11201StoreMock.setNumeroManifiesta).toHaveBeenCalled()
    expect(tramite11201StoreMock.setDelContenedor).toHaveBeenCalled()
  });


});