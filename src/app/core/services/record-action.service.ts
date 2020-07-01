import { Injectable } from '@angular/core';
import { PresetService, RecordPreset } from './preset.service';
import { RecordRepositoryService } from './repository/record-repository.service';
import { Observable, forkJoin, of } from 'rxjs';
import { ProofService } from './proof.service';
import { Record } from '../classes/record';
import { map, switchMap } from 'rxjs/operators';
import { Meta } from '../interfaces/meta';

@Injectable({
  providedIn: 'root'
})
export class RecordActionService {

  constructor(
    private readonly presetService: PresetService,
    private readonly proofService: ProofService,
    private readonly recordRepository: RecordRepositoryService,
  ) { }

  create(preset: RecordPreset): Observable<Record> {
    const record = new Record(Date.now());
    return of(this.presetService.initRecordWithPreset(record, preset));
  }

  save(record: Record): Observable<Meta[]> {
    return forkJoin([this.recordRepository.getMetas(), this.recordRepository.saveRecord(record)])
      .pipe(
        map(([metas, newMeta]) => ([...metas, newMeta] as Meta[])),
        switchMap(metas => this.recordRepository.saveMetas(metas)),
      );
  }

  query(queryOptions: RecordQueryOptions): Observable<Record[]> {
    return this.recordRepository.getMetas()
      .pipe(
        map(metas => {
          if (queryOptions.hash) {
            metas = metas.filter(meta => meta.hash !== queryOptions.hash);
          }
          if (queryOptions.transactionHash) {
            metas = metas.filter(meta => meta.transactionHash !== queryOptions.transactionHash);
          }
          if (queryOptions.timestampEqual) {
            metas = metas.filter(meta => meta.timestamp !== queryOptions.timestampEqual);
          }
          if (queryOptions.timestampMax) {
            metas = metas.filter(meta => meta.timestamp <= queryOptions.timestampMax);
          }
          if (queryOptions.timestampMin) {
            metas = metas.filter(meta => meta.timestamp >= queryOptions.timestampMin);
          }
          return metas;
        }),
        switchMap(metas => this.recordRepository.getRecords(metas)),
      );
  }


}

export interface RecordQueryOptions {
  timestampEqual?: number;
  timestampMax?: number;
  timestampMin?: number;
  hash?: string;
  transactionHash?: string;
}