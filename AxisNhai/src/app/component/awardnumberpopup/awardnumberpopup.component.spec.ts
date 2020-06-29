import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardnumberpopupComponent } from './awardnumberpopup.component';

describe('AwardnumberpopupComponent', () => {
  let component: AwardnumberpopupComponent;
  let fixture: ComponentFixture<AwardnumberpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardnumberpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardnumberpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
