import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudPageComponent } from './solicitud-page.component';
import { ArtefactosPirotecnicosOrdinariosModule } from '../../artefactos-pirotecnicos-ordinarios.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolicitudPageComponent', () => {
  let component: SolicitudPageComponent;
  let fixture: ComponentFixture<SolicitudPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtefactosPirotecnicosOrdinariosModule, HttpClientTestingModule],
      declarations: [SolicitudPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
