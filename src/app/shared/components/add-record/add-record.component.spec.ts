import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateTestingModule } from '../../tests/translate-testing/translate-testing.module';
import { AddRecordComponent } from './add-record.component';

describe('AddRecordComponent', () => {
  let component: AddRecordComponent;
  let fixture: ComponentFixture<AddRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddRecordComponent],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        FormsModule,
        TranslateTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
