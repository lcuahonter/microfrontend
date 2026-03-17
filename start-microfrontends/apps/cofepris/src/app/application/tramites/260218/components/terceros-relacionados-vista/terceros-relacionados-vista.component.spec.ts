import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TercerosRelacionadosVistaComponent } from './terceros-relacionados-vista.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TercerosRelacionadosVistaComponent', () => {
  let component: TercerosRelacionadosVistaComponent;
  let fixture: ComponentFixture<TercerosRelacionadosVistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: {},
            queryParams: {}
          }
        }
      }]

    }).compileComponents();

    fixture = TestBed.createComponent(TercerosRelacionadosVistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize fabricantes$ observable on ngOnInit', () => {
    expect(component.fabricanteTablaDatos).toBeDefined();
  });

  it('should initialize destinatarios$ observable on ngOnInit', () => {
    expect(component.destinatarioFinalTablaDatos).toBeDefined();
  });

  it('should initialize proveedores$ observable on ngOnInit', () => {
    expect(component.proveedorTablaDatos).toBeDefined();
  });

  it('should initialize facturadores$ observable on ngOnInit', () => {
    expect(component.facturadorTablaDatos).toBeDefined();
  });

});
