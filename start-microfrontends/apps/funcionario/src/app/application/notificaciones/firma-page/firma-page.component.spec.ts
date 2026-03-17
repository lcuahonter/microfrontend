import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmaPageComponent } from './firma-page.component';

describe('FirmaPageComponent', () => {
  let component: FirmaPageComponent;
  let fixture: ComponentFixture<FirmaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirmaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirmaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
