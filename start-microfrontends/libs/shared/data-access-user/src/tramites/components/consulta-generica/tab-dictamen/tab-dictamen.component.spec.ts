import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TabDictamenComponent } from "./tab-dictamen.component";

describe('TabDictamenComponent', () => {
  let component: TabDictamenComponent;
  let fixture: ComponentFixture<TabDictamenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDictamenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});