import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { SolicitantetabComponent } from './solicitantetab.component';
import { SolicitanteasigncionserviceService } from '@libs/shared/data-access-user/src';
import { HttpClientModule } from '@angular/common/http';

describe('SolicitantetabComponent', () => {
  let component: SolicitantetabComponent;
  let fixture: ComponentFixture<SolicitantetabComponent>;
  let service: jest.Mocked<SolicitanteasigncionserviceService>;

  const mockData = {
    especie: 'Test Especie',
    funcionZootecnica: 'Test Funcion',
    autorizado: 'Test Autorizado',
    expendido: 'Test Expendido',
    disponible: 'Test Disponible',
    ampliar: 'Test Ampliar',
  };

  beforeEach(async () => {
    const serviceSpy = {
      getSolicitante: jest.fn().mockReturnValue(of(mockData)), 
    };
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, SolicitantetabComponent],
      providers: [
        { provide: SolicitanteasigncionserviceService, useValue: serviceSpy },
        { provide: require('../../estados/queries/tramite120404.query').Tramite120404Query, useValue: { selectTramite120404$: require('rxjs').of(mockData) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitantetabComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(SolicitanteasigncionserviceService) as jest.Mocked<SolicitanteasigncionserviceService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    component.ngOnInit();
    expect(component.formasignacion).toBeDefined();
    expect(component.formasignacion.get('especie')).toBeDefined();
    expect(component.formasignacion.get('disponible')).toBeDefined();
  });

  it('debería cargar los datos de asignación al inicializar', () => {
    component.ngOnInit();
    expect(component.formasignacion.value).toEqual(mockData);
  });
});
