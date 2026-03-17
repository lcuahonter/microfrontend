import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarDestinatarioFinalContenedoraComponent } from './agregar-destinatario-final-contenedora.component';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { DestinoFinal } from '../../../../shared/models/terceros-relacionados.model';
import { Tramite240105Store } from '../../estados/tramite240105Store.store';
import { Tramite240105Query } from '../../estados/tramite240105Query.query';
import { ID_PROCEDIMIENTO } from '../../constants/importacion-armas-municiones.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatosSolicitudService } from '../../../../shared/services/datos-solicitud.service';

describe('AgregarDestinatarioFinalContenedoraComponent', () => {
  let component: AgregarDestinatarioFinalContenedoraComponent;
  let fixture: ComponentFixture<AgregarDestinatarioFinalContenedoraComponent>;
  let mockTramiteStore: jest.Mocked<Tramite240105Store>;
  let mockTramiteQuery: Partial<Tramite240105Query>;

  beforeEach(async () => {
    mockTramiteStore = {
      updateDestinatarioFinalTablaDatos: jest.fn(),
      clearTercerosDatos: jest.fn()
    } as unknown as jest.Mocked<Tramite240105Store>;

    mockTramiteQuery = {
      obtenerTercerosDatos$: of({} as DestinoFinal)
    };

    await TestBed.configureTestingModule({
      imports: [AgregarDestinatarioFinalContenedoraComponent,HttpClientTestingModule],
      providers: [
        { provide: Tramite240105Store, useValue: mockTramiteStore },
        { provide: Tramite240105Query, useValue: mockTramiteQuery },
        DatosSolicitudService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarDestinatarioFinalContenedoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have idProcedimiento set to ID_PROCEDIMIENTO', () => {
    expect(component.idProcedimiento).toBe(ID_PROCEDIMIENTO);
  });

  it('should assign terechosDatos$ on ngOnInit', () => {
    component.terechosDatos$ = undefined as any;
    component.ngOnInit();
    expect(component.terechosDatos$).toBe(mockTramiteQuery.obtenerTercerosDatos$);
  });

  it('should call tramiteStore.updateDestinatarioFinalTablaDatos and emit cerrar on updateDestinatarioFinalTablaDatos', () => {
    const emitSpy = jest.spyOn(component.cerrar, 'emit');
    const destinatarios: DestinoFinal[] = [{}, {}] as DestinoFinal[];
    component.updateDestinatarioFinalTablaDatos(destinatarios);
    expect(mockTramiteStore.updateDestinatarioFinalTablaDatos).toHaveBeenCalledWith(destinatarios);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should call tramiteStore.clearTercerosDatos on cerrarEvent', () => {
    component.cerrarEvent();
    expect(mockTramiteStore.clearTercerosDatos).toHaveBeenCalled();
  });

  it('should have cancelarEventListenerCancel as an EventEmitter', () => {
    expect(component.cancelarEventListenerCancel instanceof EventEmitter).toBe(true);
  });
});