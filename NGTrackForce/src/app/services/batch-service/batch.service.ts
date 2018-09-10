/** @Author Princewill Ibe */

import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, AsyncSubject } from 'rxjs';
import { Batch } from '../../models/batch.model';
import { Associate } from '../../models/associate.model';

@Injectable()
export class BatchService {
  private baseURL: string = environment.url + 'TrackForce/batches';

  constructor(private http: HttpClient) {}

  private allBatches$: BehaviorSubject<Batch[]> = new BehaviorSubject<Batch[]>([]);
  private batchesWithinDates$: BehaviorSubject<Batch[]> = new BehaviorSubject<Batch[]>([]);
  private batchesByDates$: BehaviorSubject<Batch[]> = new BehaviorSubject<Batch[]>([]);
  private associatesForBatch$: BehaviorSubject<Associate[]> = new BehaviorSubject<Associate[]>([]);
  private batchDetails$: AsyncSubject<Object> = new AsyncSubject<Object>();
  /**
   *  This gets all of the batches, every single one
   */
  public getAllBatches(): BehaviorSubject<Batch[]> {
    const url = this.baseURL;
    this.http.get<Batch[]>(url).subscribe(
      (data: Batch[]) => this.allBatches$.next(data),
      error => this.allBatches$.error(error)
    );
    return this.allBatches$;
  }

  /*
    Get batches with dates
  */
  public getBatchesWithinDates(
    startDate: Date,
    endDate: Date
  ): Observable<Batch[]> {
    const url =
      this.baseURL +
      '/withindates' +
      `/?start=${startDate.getTime()}&end=${endDate.getTime()}`;
    this.http.get<Batch[]>(url).subscribe(
      (data: Batch[]) => this.batchesWithinDates$.next(data),
      error => this.batchesWithinDates$.error(error)
    );
    return this.batchesWithinDates$;
  }

  /**
   * Given start and end date, return the batches that started and completed
   * within the time range
   *
   * @param {Date} startDate - needs to be in long time
   * @param {Date} endDate - needs to be in long time
   * @returns {BehaviorSubject<Batch[]>}
   */
  public getBatchesByDate(startDate: Date, endDate: Date): BehaviorSubject<Batch[]> {
    const url =
      this.baseURL + `/?start=${startDate.getTime()}&?end=${endDate.getTime()}`;
    this.http.get<Batch[]>(url).subscribe(
      (data: Batch[]) => this.batchesByDates$.next(data),
      error => this.batchesByDates$.error(error)
    );
    return this.batchesByDates$;
  }

  /**
   * This method will get a list of associates in the batch with given id
   * @param {number} id - the id of the batch you want the assciates for
   * @returns {Observable<Associate[]>}
   */
  public getAssociatesForBatch(id: number): BehaviorSubject<Associate[]> {
    const url = this.baseURL + '/' + id + '/associates';
    this.http.get<Associate[]>(url).subscribe(
      (data: Associate[]) => this.associatesForBatch$.next(data),
      error => this.associatesForBatch$.error(error)
    );
    return this.associatesForBatch$
  }

  /*
    1806_Andrew_H
    This method sends a start and end date along with the coursename I.E. Java,PEGA.
    A Json object array is received and returned
    See 1806 iteration 6 - Team 4 Predictions - Request Response Doc - #1
  */
  public getBatchDetails(
    startDate: Date,
    endDate: Date,
    CourseName: string
  ): Observable<Object> {
    const url =
      this.baseURL +
      `/details?start=${startDate.getTime()}&end=${endDate.getTime()}&courseName=${CourseName}`;
    this.http.get<Object>(url).subscribe(
      data => this.batchDetails$.next(data),
      error => this.batchDetails$.error(error)
    );
    return this.batchDetails$;
  }

  public getAssociateCountByCurriculum(
    startDate: Date,
    endDate: Date,
    CourseName: string
  ): Observable<Object> {
    return this.http.get<Object>(
      this.baseURL +
        `/countby?start=${startDate.getTime()}&end=${endDate.getTime()}&courseName=${CourseName}`
    );
  }

  /**
   *1806_Kevin_C
   * @param id Id of a batch
   * @returns {Batch} Batch with that id
   */
  public getBatchDetailsById(id: number): Observable<Batch> {
    const url = this.baseURL + '/batch/' + id;
    return this.http.get<Batch>(url);
  }

  // // ============================================================================
  // // Not in the batch resource

  // /**
  //  * To save time, only retrieves the batches between
  //  * three months before the currrent date
  //  * and three months after the current date.
  //  *
  //  * @returns {Observable<Batch[]>}
  //  */
  // public getDefaultBatches(): Observable<Batch[]> {
  //   const now: Date = new Date();
  //   // all batches will be over by then
  //   const monthRadius = 3;
  //   const threeMonthsBefore = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //   threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - monthRadius);
  //   const threeMonthsAfter = new Date(now.getFullYear(), now.getMonth(), 28);
  //   threeMonthsAfter.setMonth(threeMonthsAfter.getMonth() + monthRadius);
  //   return this.getBatchesByDate(threeMonthsBefore, threeMonthsAfter);
  // }

  // public getBatchesSortedById(): Observable<Batch[]> {
  //   return this.http.get<Batch[]>(this.baseURL + '?sorted=id');
  // }

  // public getBatchesSortedByDate(): Observable<Batch[]> {
  //   return this.http.get<Batch[]>(this.baseURL + '?sorted=date');
  // }

  // public getBatchByType(threeMonthsBefore: number, threeMonthsAfter: number, type: string): Observable<Batch[]> {
  //   return this.http.get<Batch[]>(this.baseURL + '?start=' + threeMonthsBefore + '&end=' + threeMonthsAfter + '&type=' + type);
  // }
}
