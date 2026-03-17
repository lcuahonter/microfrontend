import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BandejaPendientesComponent } from './seleccion-modulo.component';
import { provideHttpClient } from '@angular/common/http';

describe('BandejaPendientesComponent', () => {
  let component: BandejaPendientesComponent;
  let fixture: ComponentFixture<BandejaPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandejaPendientesComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(BandejaPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
