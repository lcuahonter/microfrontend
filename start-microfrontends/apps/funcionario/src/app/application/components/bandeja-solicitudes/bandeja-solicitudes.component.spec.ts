import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BandejaSolicitudesComponent } from './bandeja-solicitudes.component';
import { provideHttpClient } from '@angular/common/http';

describe('BandejaSolicitudesComponent', () => {
  let component: BandejaSolicitudesComponent;
  let fixture: ComponentFixture<BandejaSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BandejaSolicitudesComponent],
      providers: [provideHttpClient()]
    }).compileComponents();

    fixture = TestBed.createComponent(BandejaSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
