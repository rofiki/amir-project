import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomemakerEditComponent } from './homemaker-edit.component';

describe('HomemakerEditComponent', () => {
  let component: HomemakerEditComponent;
  let fixture: ComponentFixture<HomemakerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomemakerEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomemakerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
