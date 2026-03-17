import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificacionesComponent } from './certificaciones.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Tramite5601Store } from '../../estados/stores/tramite5601.store';
import { Tramite5601Query } from '../../estados/queries/tramite5601.query';
import { of, Subject } from 'rxjs';
import { Tramite5601State } from '../../estados/stores/tramite5601.store';
import { FORMULARIO_CERTIFICACION_DETALLES, MENSAJE_MODAL, TITULO_MODAL } from '../../constantes/tramite5601.enum';

jest.mock('../../estados/queries/tramite5601.query');
jest.mock('../../estados/stores/tramite5601.store');

describe('CertificacionesComponent (Jest)', () => {
  let component: CertificacionesComponent;
  let fixture: ComponentFixture<CertificacionesComponent>;
  let store: jest.Mocked<Tramite5601Store>;
  let query: jest.Mocked<Tramite5601Query>;

  const ESTADO_MOCK: Tramite5601State = {
    tieneCertificacion: false,
    certificacionEmpresa: '',
    otraCertificacion: '',
    aduana: '',
    seccionAduanera: '',
    tipoOperacion: '',
    fechaOperacion: '',
    motivoDespachoDomicilio: '',
    observaciones: '',
    especificacionesMercancia: '',
    descripcionMercancia: '',
    tipoMoneda: '',
    valorMercancia: '',
    esquemasControlSeguridad: '',
    distanciaRutaTiempos: '',
    direccion: '',
    telefono: '',
    distanciaAduana: '',
    referencias: ''
  };

  beforeEach(async () => {
    store = new Tramite5601Store() as jest.Mocked<Tramite5601Store>;
    query = new Tramite5601Query(store) as jest.Mocked<Tramite5601Query>;
    query.selectCertificacion$ = of(ESTADO_MOCK);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CertificacionesComponent],
      providers: [
        FormBuilder,
        { provide: Tramite5601Store, useValue: store },
        { provide: Tramite5601Query, useValue: query },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CertificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el estado desde el query', () => {
    expect(component.certificacionState).toEqual(ESTADO_MOCK);
  });

  it('debería cerrar el modal correctamente', () => {
    component.modal = 'show';
    component.tituloModal = 'titulo';
    component.mensajeModal = 'mensaje';
    component.cerrarModal();
    expect(component.tituloModal).toBe('titulo');
    expect(component.mensajeModal).toBe('mensaje');
  });

  it('debería llamar setDynamicFieldValue del store al establecer un cambio de valor', () => {
    const SPY = jest.spyOn(store, 'setDynamicFieldValue');
    const EVENTO = { campo: 'aduana', valor: 'Tijuana' };

    component.establecerCambioDeValor(EVENTO);

    expect(SPY).toHaveBeenCalledWith('aduana', 'Tijuana');
  });
});
