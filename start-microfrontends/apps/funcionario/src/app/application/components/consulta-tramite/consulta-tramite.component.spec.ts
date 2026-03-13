import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultaTramiteComponent } from './consulta-tramite.component';
import { provideHttpClient } from '@angular/common/http';

describe('ConsultaTramiteComponent', () => {
  let component: ConsultaTramiteComponent;
  let fixture: ComponentFixture<ConsultaTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaTramiteComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
