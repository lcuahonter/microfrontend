import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetallesFolioComponent } from './detalles-folio.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DetallesFolioComponent', () => {
  let component: DetallesFolioComponent;
  let fixture: ComponentFixture<DetallesFolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesFolioComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallesFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize folioTablaDatos with empty values', () => {
    expect(component.folioTablaDatos).toEqual({
      tipoDeSolicitud: '',
      folioDelTramite: '',
    });
  });

  it('should update folioTablaDatos when data is received', () => {
    const mockData = {
      tipoDeSolicitud: 'Test Solicitud',
      folioDelTramite: '12345',
    };
    component.folioTablaDatos = mockData;
    expect(component.folioTablaDatos).toEqual(mockData);
  });
});
