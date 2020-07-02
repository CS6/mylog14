import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { Observable, Subject, timer, BehaviorSubject, empty } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DataStoreService } from 'src/app/core/services/store/data-store.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-daily-overview',
  templateUrl: './daily-overview.component.html',
  styleUrls: ['./daily-overview.component.scss'],
})

export class DailyOverviewComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  items$ = new Observable<CardItem[]>();
  cachedDateDiff = -10;

  WhatIsItToday = 0;

  arry: [number, number][] = [[1, 3], [125, 184], [125, 246], [125, 306], [125, 365], [125, 420], [125, 490], [125, 548], [125, 611], [125, 670], [125, 734], [125, 792], [125, 850], [125, 902], [125, 922], [984, 1200], [35, 36]];
  STFarry: [number, number][] = [[1, 3], [245, 246], [305, 306], [364, 365], [419, 420], [489, 490], [547, 548], [610, 611], [669, 670], [733, 734], [791, 792], [849, 850], [901, 902], [921, 922], [984, 1200], [35, 36]];

  options: AnimationOptions = {
    path: '/assets/MyLogBBTfix.json',
  };

  TEMPimg: '/assets/imgA.png';
  private animationItem: AnimationItem;
  emptyCardItem = {
    hasData: true,
    day: '15',
    month: 'Dec',
    date: '12/15',
    bt: '37.5',
    imgSrc: null,
    imgHeight: 400,
  };

  item$ = new BehaviorSubject(this.emptyCardItem);

  constructor(
    private readonly ngZone: NgZone,
    public modalService: ModalService,
  ) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAnimationCreated(animationItem: AnimationItem) {
    this.animationItem = animationItem;
  }

  onConfigReady() {
    this.startCountdown(0)
    .pipe(
        takeUntil(this.destroy$),
      ).subscribe(() => console.log('Animation stopped'), err => console.log(err));
  }

  private startCountdown(day: number) {
    const idx = (day > 14) ? 15 : day + 1; // The animation array has +1 offset
    this.WhatIsItToday = idx;
    this.animationPlay(idx);

    if (idx !== 15) {
      return timer(idx * 1000)
        .pipe(
          tap(() => this.animationStopOnDay(idx)),
        );
    }
  }

  private animationPlay(idx: number) {
    this.ngZone.runOutsideAngular(() => this.animationItem.playSegments(this.arry[idx], true));
  }

  onClickAnimation() {
    this.modalService.showShopScannerModal()
    .pipe(
      takeUntil(this.destroy$),
    ).subscribe();
  }

  private animationStopOnDay(idx: number) {
    this.ngZone.runOutsideAngular(() => this.animationItem.playSegments(this.STFarry[idx], true));
  }

}

export interface CardItem {
  hasData: boolean;
  day?: string;
  month?: string;
  date?: string;
  bt?: string;
  imgSrc?: string;
  imgHeight?: number;
}
