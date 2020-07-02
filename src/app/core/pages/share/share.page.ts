import { Component, OnDestroy } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { combineLatest, defer, Subject } from 'rxjs';
import { first, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { DataStoreService } from '../../services/data-store.service';
import { UploadService } from '../../services/upload.service';

const { Clipboard } = Plugins;

enum Stage {
  AreYouSure = 0,
  Upload = 1,
  ShareToWhom = 2,
  Shared = 3,
  Error = 4
}

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnDestroy {

  destroy$ = new Subject();
  stage = Stage.AreYouSure;
  StageEnum = Stage;

  constructor(
    public readonly uploadService: UploadService,
    private readonly popoverCtrl: PopoverController,
    private readonly toastCtrl: ToastController,
    private readonly dataStoreService: DataStoreService
  ) { }

  confirm() {
    this.stage += 1;
    if (this.stage === Stage.Upload) {
      this.uploadService.uploadZip()
        .pipe(
          map(generatedUrl => {
            const userData = this.dataStoreService.getUserData();
            userData.generatedUrl = generatedUrl;
            return userData;
          }),
          switchMap(userData => this.dataStoreService.updateUserData(userData))
        )
        .subscribe(() => { }, err => {
          console.log(err);
          this.stage = Stage.Error;
          this.uploadService.clearUrl();
        });
    }
    if (this.stage === Stage.Shared) {
      this.uploadService.clearUrl();
    }
  }

  onClickCopy() {
    this.uploadService.generatedUrl$
      .pipe(
        take(1),
        switchMap(url => Clipboard.write({ string: url })),
        switchMap(() => this.presentToastCopied()),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private presentToastCopied() {
    return defer(() => (this.toastCtrl.create({
      message: '連結已複製到剪貼簿',
      position: 'top',
      color: 'primary',
      cssClass: 'toast',
      duration: 1000,
    })))
      .pipe(
        switchMap(toast => toast.present()),
      );
  }

  cancel() {
    this.uploadService.clearUrl();
    this.popoverCtrl.dismiss();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
