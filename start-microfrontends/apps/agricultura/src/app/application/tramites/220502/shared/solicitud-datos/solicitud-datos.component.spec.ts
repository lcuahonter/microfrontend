import { AlertComponent } from '@ng-mf/data-access-user';
import { ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SolicitudDatosComponent } from './solicitud-datos.component';
import { TestBed } from '@angular/core/testing';
import { TituloComponent } from '@ng-mf/data-access-user';
import { Solicitud } from '../../models/solicitud-pantallas.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudDatosComponent', () => {
  let component: SolicitudDatosComponent;
  let fixture: ComponentFixture<SolicitudDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule,TituloComponent, AlertComponent,SolicitudDatosComponent,HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default colapsable value as true', () => {
    expect(component.colapsable).toBe(true);
  });

  it('should toggle colapsable when mostrarColapsable is called', () => {
    component.colapsable = true;
    component.mostrarColapsable();
    expect(component.colapsable).toBe(false);
    component.mostrarColapsable();
    expect(component.colapsable).toBe(true);
  });

  it('should have tablaHeadData as input', () => {
    const TESTHEADDATA = ['Fecha Creación', 'Mercancía','Cantidad','Proovedor'];
    component.tablaHeadData = TESTHEADDATA;
    fixture.detectChanges();
    expect(component.tablaHeadData).toEqual(TESTHEADDATA);
  });

  it('should have tablaFilaDatos as input', () => {
    const TESTFILEDATOS: Solicitud[] = [
      {
        fechaCreacion: '2025-02-02 19:50:08:0',
        mercancia: 'descripcion',
        cantidad: '1000000',
        proovedor: 'erick',
      },
      {
        fechaCreacion: '2025-02-02 19:50:08:0',
        mercancia: 'descripcion',
        cantidad: '1000000',
        proovedor: 'erick',
      },
    ];
    component.tablaFilaDatos = TESTFILEDATOS;
    fixture.detectChanges();
    expect(component.tablaFilaDatos).toEqual(TESTFILEDATOS);
  });
});
