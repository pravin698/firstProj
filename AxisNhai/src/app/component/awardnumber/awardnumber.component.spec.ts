import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardnumberComponent } from './awardnumber.component';

describe('AwardnumberComponent', () => {
  let component: AwardnumberComponent;
  let fixture: ComponentFixture<AwardnumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardnumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardnumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
