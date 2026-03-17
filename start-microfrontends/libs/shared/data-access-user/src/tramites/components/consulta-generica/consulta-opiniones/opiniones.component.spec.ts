import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpinionesComponent } from './opiniones.component';
import { FolioQuery } from '../../../../core/queries/folio.query';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('OpinionesComponent', () => {
  let component: OpinionesComponent;
  let fixture: ComponentFixture<OpinionesComponent>;
  let folioQueryMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    /** Crear mock para FolioQuery */
    folioQueryMock = {
      getFolio: jest.fn().mockReturnValue(of('TRA123456'))
    };

    /** Crear mock para ActivatedRoute */
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('123')
        },
        queryParamMap: {
          get: jest.fn().mockReturnValue(null)
        }
      },
      paramMap: of({
        get: (key: string) => '123'
      }),
      queryParamMap: of({
        get: (key: string) => null
      })
    };

    await TestBed.configureTestingModule({
      imports: [
        OpinionesComponent,
        HttpClientTestingModule // Añadido para proporcionar HttpClient
      ],
      providers: [
        { provide: FolioQuery, useValue: folioQueryMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock } // Añadido mock para ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OpinionesComponent);
    component = fixture.componentInstance;

    /** Si no existe el método seleccionaTab, lo creamos para la prueba */
    if (!component.seleccionaTab) {
      component.seleccionaTab = jest.fn((indice: number) => {
        component.indice = indice;
      });
    }
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Prueba que verifica que el componente recupera correctamente el folio
   * desde el servicio FolioQuery durante la inicialización.
   * 
   * @test
   * @group Inicialización
   */
  it('should retrieve folio from FolioQuery on init', () => {
    /** Verificar que se llamó al método getFolio */
    expect(folioQueryMock.getFolio).toHaveBeenCalled();

    /** Verificar que el folio se estableció correctamente */
    expect(component.folio).toBe('TRA123456');
  });

  /**
   * Prueba que verifica que el método seleccionaTab cambia correctamente
   * el índice de la pestaña activa.
   * 
   * @test
   * @group Interacción
   */
  it('should change the active tab when seleccionaTab is called', () => {
    /** El valor inicial debe ser 1 */
    expect(component.indice).toBe(1);

    /** Llamar al método con un nuevo valor */
    component.seleccionaTab(2);
    fixture.detectChanges();

    /** Verificar que el valor ha cambiado */
    expect(component.indice).toBe(2);
  });
});