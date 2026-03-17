import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MensajeriaComponent } from './mensajeria.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';

// Mock services and dependencies
const mockService = { obtenerTablaDatos: jest.fn(() => of({ data: [{}] })) };
const mockTramite32614Store = {};
const mockTramite32614Query = { selectSolicitud$: of({}) };
const mockConsultaioQuery = { selectConsultaioState$: of({ readonly: false }) };

describe('MensajeriaComponent', () => {
  let component: MensajeriaComponent;
  let fixture: ComponentFixture<MensajeriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [MensajeriaComponent],
      providers: [
        FormBuilder,
        { provide: 'SolicitudDeRegistroInvocarService', useValue: mockService },
        { provide: 'Tramite32614MensajeriaStore', useValue: mockTramite32614Store },
        { provide: 'Tramite32614MensajeriaQuery', useValue: mockTramite32614Query },
        { provide: 'ConsultaioQuery', useValue: mockConsultaioQuery },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MensajeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the MensajeriaComponent', () => {
    expect(component).toBeTruthy();
  });
});