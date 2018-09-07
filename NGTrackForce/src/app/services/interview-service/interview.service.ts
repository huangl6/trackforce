import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Interview } from '../../models/interview.model';
import { BehaviorSubject, AsyncSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class InterviewService {
  private baseURL: string = environment.url + 'TrackForce/interviews';

  constructor(private http: HttpClient) {};
  private allInterviews$: BehaviorSubject<Interview[]> = new BehaviorSubject<Interview[]>([]);
  private createInterview$: AsyncSubject<boolean> = new AsyncSubject<boolean>();
  private associateInterviews$: BehaviorSubject<Interview[]> = new BehaviorSubject<Interview[]>([]);
  private interviewID$: AsyncSubject<Interview> = new AsyncSubject<Interview>();
  private updateInterview$: AsyncSubject<boolean> = new AsyncSubject<boolean>();

  /**
   *
   * Get all of the interviews, every single one
   */
  public getAllInterviews(): BehaviorSubject<Interview[]> {
    this.http.get<Interview[]>(this.baseURL).subscribe(
      (data: Interview[]) => this.allInterviews$.next(data),
      error => this.allInterviews$.error(error)
    );
    return this.allInterviews$;
  }

  /**
   *
   * This method will create a new interview for an associate
   * @param interview - the new interview object
   * @param id - associate id
   *
   */
  public createInterview(
    interview: Interview,
    id: number
  ) {
    const url: string = this.baseURL + '/' + id;
    this.http.post<boolean>(url, interview).subscribe(
      data => this.createInterview$.next(data),
      error => this.createInterview$.error(error)
    );
    return this.createInterview$;
  }

  /**
   *
   * This method gets all the interviews for a specific associate
   * Reviewed by Max
   * @since 6.18.06.08
   *
   * @param id - this is the associate's id
   */
  public getInterviewsForAssociate(id: number): BehaviorSubject<Interview[]> {
    const url: string = this.baseURL + '/' + id;
    this.http.get<Interview[]>(url).subscribe(
      (data: Interview[]) => this.associateInterviews$.next(data),
      error => this.associateInterviews$.error(error)
    );
    return this.associateInterviews$;
  }

  public getInterviewById(id: number): AsyncSubject<Interview> {
    const url: string = this.baseURL + "/getInterviewById/" + id;
    this.http.get<Interview>(url).subscribe(
      (data: Interview) => this.interviewID$.next(data),
      error => this.interviewID$.error(error)
    );
    return this.interviewID$;
  }

  /**
   *
   * This method updates an existing interview
   * Reviewed by Max
   * @since 6.18.06.08
   *
   * @param interview - this is the updated interview object
   * @param id - this is the id of the associate
   */
  public updateInterview(interview: Interview): AsyncSubject<boolean> {
    const url: string = this.baseURL + "/" + interview.id;
    // console.log("asdf");
    this.http.put<boolean>(url, interview).subscribe(
      data => this.updateInterview$.next(data),
      error => this.updateInterview$.error(error)
    );
    return this.updateInterview$;
  }
}
