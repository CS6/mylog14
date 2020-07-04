import { Component, Input, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { Record } from '@core/classes/record';
import { DataStoreService } from '@core/services/store/data-store.service';

@Component({
  selector: 'app-daily-detail-records',
  templateUrl: './daily-detail-records.component.html',
  styleUrls: ['./daily-detail-records.component.scss'],
})
export class DailyDetailRecordsComponent implements OnInit {
  @Input() date: string;
  selected: number;

  records$ = this.dataStore.recordsByDate$
    .pipe(
      map(recordsByDate => recordsByDate[this.date]),
    );

  constructor(
    private readonly dataStore: DataStoreService,
  ) { }

  ngOnInit() {
  }

  getFieldsCount(record: Record): number {
    return record.fields.filter(field => (field.value)).length;
  }

  isSelected(record: Record): boolean {
    return (record.timestamp === this.selected);
  }

  selectRecord(record?: Record): void {
    if (!record) {
      this.selected = null;
      return;
    }
    this.selected = record.timestamp;
  }

}
