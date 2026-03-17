
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudComponent } from './solicitud.component';
import { DatosDeLaSolicitudComponent } from '../../components/datos-de-la-solicitud/datos-de-la-solicitud.component';
import { TipoPropietarioComponent } from '../../components/tipo-propietario/tipo-propietario.component';
import { DatosMercanciaComponent } from '../../components/datos-mercancia/datos-mercancia.component';
import { ManifiestoComponent } from '../../components/manifiesto/manifiesto.component';
import { RetornoImportacionTemporalService } from '../../services/retorno-importacion-temporal.service';

describe('SolicitudComponent', () => {
  let fixture: ComponentFixture<SolicitudComponent>;
  let component: SolicitudComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SolicitudComponent
      ],
      imports: [
        DatosDeLaSolicitudComponent,
        TipoPropietarioComponent,
        DatosMercanciaComponent,
        ManifiestoComponent
      ],
      providers: [
        {
          provide: RetornoImportacionTemporalService,
          useValue: {
            getAduanaDeIngreso: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
            getSeccionAduanera: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
            getProrroga: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
            getPropietario: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
            getTipoDePropietario: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
            getPais: jest.fn(() => ({ pipe: jest.fn(() => ({ subscribe: jest.fn() })) })),
          }
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-datos-de-la-solicitud', () => {
    const el = fixture.nativeElement.querySelector('app-datos-de-la-solicitud');
    expect(el).not.toBeNull();
  });

  it('should render app-tipo-propietario', () => {
    const el = fixture.nativeElement.querySelector('app-tipo-propietario');
    expect(el).not.toBeNull();
  });

  it('should render app-datos-mercancia', () => {
    const el = fixture.nativeElement.querySelector('app-datos-mercancia');
    expect(el).not.toBeNull();
  });

  it('should render app-manifiesto', () => {
    const el = fixture.nativeElement.querySelector('app-manifiesto');
    expect(el).not.toBeNull();
  });
});
