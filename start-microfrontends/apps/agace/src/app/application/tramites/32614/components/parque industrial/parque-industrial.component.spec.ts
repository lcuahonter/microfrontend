import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParqueIndustrialComponent } from './parque-industrial.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';

const mockSolicitudService = {
  conseguirOpcionDeRadio: jest.fn(() => of({ requisitos: {}, reconocimientoMutuo: {}, clasificacionInformacion: {} })),
  conseguirTransportistasLista: jest.fn(() => of([])),
};
const mockSolicitud32614Store = {
  actualizar2042: jest.fn(),
  actualizar2043: jest.fn(),
  actualizar2044: jest.fn(),
  actualizarFechaInicioComercio: jest.fn(),
  actualizarFechaPago: jest.fn(),
  actualizarMonto: jest.fn(),
  actualizarOperacionesBancarias: jest.fn(),
  actualizarLlavePago: jest.fn(),
};
const mockSolicitud32614Query = { selectSolicitud$: of({}) };
const mockConsultaioQuery = { selectConsultaioState$: of({ readonly: false }) };
const mockTramite32614MensajeriaStore = {};

describe('ParqueIndustrialComponent', () => {
  let component: ParqueIndustrialComponent;
  let fixture: ComponentFixture<ParqueIndustrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [ParqueIndustrialComponent],
      providers: [
        FormBuilder,
        { provide: 'SolicitudService', useValue: mockSolicitudService },
        { provide: 'Solicitud32614Store', useValue: mockSolicitud32614Store },
        { provide: 'Solicitud32614Query', useValue: mockSolicitud32614Query },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
        { provide: 'Tramite32614MensajeriaStore', useValue: mockTramite32614MensajeriaStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParqueIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente ParqueIndustrialComponent', () => {
    expect(component).toBeTruthy();
  });
});