import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectdirectorsComponent } from './projectdirectors.component';

describe('ProjectdirectorsComponent', () => {
  let component: ProjectdirectorsComponent;
  let fixture: ComponentFixture<ProjectdirectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectdirectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectdirectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
