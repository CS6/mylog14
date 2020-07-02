import { Injectable } from '@angular/core';
import { FilesystemDirectory } from '@capacitor/core';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Record } from '../interfaces/record';
import { RecordMeta } from '../interfaces/record-meta';
import { FileSystemService } from './file-system.service';
import { LedgerService } from './ledger.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  RECORD_META_REPOSITORY = 'records';
  RECORD_DIRECTORY = FilesystemDirectory.Data;

  constructor(
    private fileSystem: FileSystemService,
    private ledger: LedgerService,
    private localStorage: LocalStorageService,
  ) { }

  getRecord(recordMeta: RecordMeta): Observable<Record> {
    return this.fileSystem.getJsonData(recordMeta.path, recordMeta.directory);
  }

  getRecords(recordMetas: RecordMeta[]): Observable<Record[]> {
    return forkJoin(
      recordMetas.map(recordMeta => this.getRecord(recordMeta)),
    );
  }

  getRawRecords(recordMetas: RecordMeta[]): Observable<string[]> {
    return forkJoin(
      recordMetas.map(recordMeta => this.fileSystem.getJsonData(recordMeta.path, recordMeta.directory, false)),
    );
  }

  saveRecord(record: Record, recordMetas: RecordMeta[]): Observable<RecordMeta[]> {
    const fileSave$ = this.fileSystem.saveJsonData(record);
    return fileSave$
      .pipe(
        switchMap(filename => this.fileSystem.getFileHash(filename)
          .pipe(
            map(fileHash => [filename, fileHash])),
        ),
        switchMap(([filename, fileHash]) => this.ledger.createTransactionHash(fileHash)
          .pipe(
            map(transactionHash => [filename, fileHash, transactionHash]),
          )
        ),
        map(([filename, fileHash, transactionHash]) => {
          return this.createRecordMeta(record.timestamp, filename, fileHash, transactionHash);
        }),
        map(recordMeta => {
          recordMetas.push(recordMeta);
          return recordMetas;
        }),
      );
  }

  getRecordMetas(): Observable<RecordMeta[]> {
    return this.localStorage.getData(this.RECORD_META_REPOSITORY, []);
  }

  saveRecordMetas(recordMetas: RecordMeta[]): Observable<RecordMeta[]> {
    return this.localStorage.setData(recordMetas, this.RECORD_META_REPOSITORY);
  }

  private createRecordMeta(timestamp: number, filename: string, fileHash: string, transactionHash: string): RecordMeta {
    return {
      timestamp,
      path: filename,
      directory: this.RECORD_DIRECTORY,
      hash: fileHash,
      transactionHash,
    };
  }

}
