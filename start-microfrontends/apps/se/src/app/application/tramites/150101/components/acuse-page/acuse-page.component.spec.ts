import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AcusePageComponent } from './acuse-page.component';
import { CommonModule } from '@angular/common';
import { AcuseComponent } from '@libs/shared/data-access-user/src';
import { ACUSE_SERVICIOS_EXTRAORDINARIOS, TITULO_ACUSE, TXT_ALERTA_ACUSE } from '@libs/shared/data-access-user/src';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AcusePageComponent', () => {
  let component: AcusePageComponent;
  let fixture: ComponentFixture<AcusePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        AcuseComponent, 
        AcusePageComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AcusePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize subtitulo with the correct value', () => {
    expect(component.subtitulo).toBe(TITULO_ACUSE);
  });

  it('should initialize encabezadoTablaAcuse, accionesTablaAcuse, and datosTablaAcuse with correct values', () => {
    expect(component.encabezadoTablaAcuse).toBe(ACUSE_SERVICIOS_EXTRAORDINARIOS.encabezadoTablaAcuse);
    expect(component.accionesTablaAcuse).toEqual(ACUSE_SERVICIOS_EXTRAORDINARIOS.accionesTablaAcuse);
    expect(component.datosTablaAcuse).toEqual(ACUSE_SERVICIOS_EXTRAORDINARIOS.datosTablaAcuse);
  });

  it('should set folio to a default value and txtAlerta correctly in ngOnInit', () => {
    component.folio = '01010101010101010101010101010101';
    component.ngOnInit();
    expect(component.folio).toBe('01010101010101010101010101010101');
    expect(component.txtAlerta).toBe(TXT_ALERTA_ACUSE(component.folio));
  });
});
