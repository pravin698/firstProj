import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotallimitsComponent } from './totallimits.component';

describe('TotallimitsComponent', () => {
  let component: TotallimitsComponent;
  let fixture: ComponentFixture<TotallimitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotallimitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotallimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
