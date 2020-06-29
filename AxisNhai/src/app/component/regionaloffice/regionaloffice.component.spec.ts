import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionalofficeComponent } from './regionaloffice.component';

describe('RegionalofficeComponent', () => {
  let component: RegionalofficeComponent;
  let fixture: ComponentFixture<RegionalofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionalofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionalofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
