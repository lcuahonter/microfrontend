import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatosDeLaSolicitudComponent } from './datos-de-la-solicitud.component';
import { Solicitud } from '../../models/aviso-model';
import { TEXTOS_SOLICITUD } from '../../constantes/aviso-enum';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '@libs/shared/data-access-user/src';
import { DatosDelEstablecimientoComponent } from '../datos-del-establecimiento/datos-del-establecimiento.component';

describe('DatosDeLaSolicitudComponent', () => {
  let component: DatosDeLaSolicitudComponent;
  let fixture: ComponentFixture<DatosDeLaSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DatosDeLaSolicitudComponent, 
        HttpClientModule, 
        CommonModule, 
        AlertComponent, 
        DatosDelEstablecimientoComponent,
        ToastrModule.forRoot()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosDeLaSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct initial TEXTOS value', () => {
    expect(component.TEXTOS).toEqual(TEXTOS_SOLICITUD);
  });

  it('should initialize colapsable as true', () => {
    expect(component.colapsable).toBe(true);
  });

  it('should initialize tablaHeadData with mockTablaHeadDatos', () => {
    const mockTablaHeadDatos = ["Fecha Creación", "Mercancía", "Cantidad", "Proveedor"];
    expect(component.tablaHeadData).toEqual(mockTablaHeadDatos);
  });

  it('should have tablaFilaDatos input defined as an empty array initially', () => {
    expect(component.tablaFilaDatos).toEqual([]);
  });

  it('should toggle colapsable value when mostrarColapsable is called', () => {
    expect(component.colapsable).toBe(true);
    component.mostrarColapsable();
    expect(component.colapsable).toBe(false);
    component.mostrarColapsable();
    expect(component.colapsable).toBe(true);
  });

  it('should accept tablaFilaDatos as input and update its value', () => {
    const mockTablaFilaDatos: Solicitud[] = [
      { fechaCreacion: '2023-04-01', mercancia: 'Mercancía A', cantidad: '100', proovedor: 'Proveedor X' },
      { fechaCreacion: '2023-04-02', mercancia: 'Mercancía B', cantidad: '200', proovedor: 'Proveedor Y' },
    ];
    component.tablaFilaDatos = mockTablaFilaDatos;
    fixture.detectChanges();

    expect(component.tablaFilaDatos).toEqual(mockTablaFilaDatos);
  });
});