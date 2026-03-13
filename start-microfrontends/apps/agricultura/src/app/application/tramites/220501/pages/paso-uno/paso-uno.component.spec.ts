import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasoUnoComponent } from './paso-uno.component';
import { SolicitanteComponent } from '@libs/shared/data-access-user/src';
import { HttpClientModule } from '@angular/common/http';
import { RevisionDocumentalComponent } from '../../components/revision-documental/revision-documental.component';
import { SolicitudComponent } from '../../components/solicitud/solicitud.component';
import { Solicitud220501Store } from '../../estados/tramites220501.store';
import { SagarpaService } from '../../services/sagarpa/sagarpa.service';
import { of } from 'rxjs';

describe('PasoUnoComponent', () => {
  let component: PasoUnoComponent;
  let fixture: ComponentFixture<PasoUnoComponent>;
  let solicitud220501Store: any;
  let sagarpaService: any;

  beforeEach(async () => {
    const MOCK_RESPONSE = {
      solicitud220501State: {
        "medioDeTransporte": 1,
        "identificacionTransporte": "020202",
        "esSolicitudFerros": "1",
        "totalGuias": "10",
        "foliodel": "1502200200120240301000015",
        "aduanaIngreso": 1,
        "oficinaInspeccion": 1,
        "puntoDeInspeccion": 1,
        "puntoInspeccion": 1,
        "claveUCON": "UCON123",
        "establecimientoTIF": 1,
        "nombre": "Nombre",
        "numeroguia": "Numeroguia",
        "regimen": 1,
        "capturaDatosMercancia": "1",
        "coordenadas": "193423",
        "movilizacion": 1,
        "transporte": "Camión",
        "punto": 1,
        "nombreEmpresa": 1,
        "exentoPagoNo": "1",
        "justificacion": 1,
        "claveReferencia": "454000554",
        "cadenaDependencia": "0003008010CEZI",
        "banco": 1,
        "llavePago": "A94FA47497834FBD",
        "importePago": "2562",
        "fetchapago": "01/08/24",
        "mostrarAgregarMercancia": false,
        "fraccionArancelaria": "01039201",
        "descripcionFraccion": "Con pedigree o certificado de alto registro",
        "nico": "00",
        "descripcion": "Con pedigree o certificado de alto registro",
        "unidaddeMedidaDeUMT": "Cabeza",
        "cantidadTotalUMT": "1000000",
        "saldoPendiente": "1000000"
      },
      solicitud220502State: {
        "certificadosAutorizados": 1,
        "horaDeInspeccion": 1,
        "aduanaDeIngreso": 1,
        "sanidadAgropecuaria": 1,
        "fechaDeInspeccion": "01/05/2025",
        "primerapellido": "Primer_Apellido",
        "segundoapellido": "Segundo_Apellido",
        "mercancia": "Mercancia",
        "tipocontenedor": 1
      }
    }

    solicitud220501Store = {
      setSagarpaState: jest.fn(),
    };

    sagarpaService = {
      getRegistroTomaMuestrasMercanciasData: jest.fn().mockReturnValue(of(MOCK_RESPONSE)),
      actualizarEstadoFormulario: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [PasoUnoComponent],
      imports: [
        SolicitanteComponent,
        HttpClientModule,
        SolicitudComponent,
        RevisionDocumentalComponent
      ],
      providers: [
        { provide: Solicitud220501Store, useValue: solicitud220501Store },
        { provide: SagarpaService, useValue: sagarpaService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PasoUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the indice with the provided index', () => {
    component.indice = 0;
    component.seleccionaTab(2);
    expect(component.indice).toBe(2);
  });

  it('should set esDatosRespuesta to true and update store and service if response is present', () => {    
    const MOCK_RESPONSE = {
      solicitud220501State: {
        "medioDeTransporte": 1,
        "identificacionTransporte": "020202",
        "esSolicitudFerros": "1",
        "totalGuias": "10",
        "foliodel": "1502200200120240301000015",
        "aduanaIngreso": 1,
        "oficinaInspeccion": 1,
        "puntoDeInspeccion": 1,
        "puntoInspeccion": 1,
        "claveUCON": "UCON123",
        "establecimientoTIF": 1,
        "nombre": "Nombre",
        "numeroguia": "Numeroguia",
        "regimen": 1,
        "capturaDatosMercancia": "1",
        "coordenadas": "193423",
        "movilizacion": 1,
        "transporte": "Camión",
        "punto": 1,
        "nombreEmpresa": 1,
        "exentoPagoNo": "1",
        "justificacion": 1,
        "claveReferencia": "454000554",
        "cadenaDependencia": "0003008010CEZI",
        "banco": 1,
        "llavePago": "A94FA47497834FBD",
        "importePago": "2562",
        "fetchapago": "01/08/24",
        "mostrarAgregarMercancia": false,
        "fraccionArancelaria": "01039201",
        "descripcionFraccion": "Con pedigree o certificado de alto registro",
        "nico": "00",
        "descripcion": "Con pedigree o certificado de alto registro",
        "unidaddeMedidaDeUMT": "Cabeza",
        "cantidadTotalUMT": "1000000",
        "saldoPendiente": "1000000"
      },
      solicitud220502State: {
        "certificadosAutorizados": 1,
        "horaDeInspeccion": 1,
        "aduanaDeIngreso": 1,
        "sanidadAgropecuaria": 1,
        "fechaDeInspeccion": "01/05/2025",
        "primerapellido": "Primer_Apellido",
        "segundoapellido": "Segundo_Apellido",
        "mercancia": "Mercancia",
        "tipocontenedor": 1
      }
    }

    component.guardarDatosFormulario();

    expect(component.esDatosRespuesta).toBe(true);
    expect(solicitud220501Store.setSagarpaState).toHaveBeenCalledWith(MOCK_RESPONSE.solicitud220501State);
    expect(sagarpaService.actualizarEstadoFormulario).toHaveBeenCalledWith(MOCK_RESPONSE.solicitud220502State);
  });

  it('should not call update methods if response is null', () => {
    sagarpaService.getRegistroTomaMuestrasMercanciasData = jest.fn().mockReturnValue(of(null));

    component.guardarDatosFormulario();
    
    expect(solicitud220501Store.setSagarpaState).not.toHaveBeenCalled();
    expect(sagarpaService.actualizarEstadoFormulario).not.toHaveBeenCalled();
  });
});
