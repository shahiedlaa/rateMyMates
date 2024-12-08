import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class TeamViewService {

  public dashboardEmitter = new Subject<boolean>();

  dashboardClick(){
    this.dashboardEmitter.next(true);
  }
}
