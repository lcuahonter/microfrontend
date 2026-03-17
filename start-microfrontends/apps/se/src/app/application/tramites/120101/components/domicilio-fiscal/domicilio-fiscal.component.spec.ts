import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomicilioFiscalComponent } from './domicilio-fiscal.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DomicilioFiscalComponent', () => {
  let component: DomicilioFiscalComponent;
  let fixture: ComponentFixture<DomicilioFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomicilioFiscalComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DomicilioFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
