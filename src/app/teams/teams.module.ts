import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from "../shared/paginator/pagination.component";
import { TeamViewComponent } from './team-view/team-view.component';
import { GameweekComponent } from "./team-view/gameweek/gameweek.component";
import { GameWeekModalComponent } from './team-view/game-week-modal/game-week-modal.component';
import { EditRatingsModalComponent } from './team-view/gameweek/edit-ratings-modal/edit-ratings-modal.component';
import { TableRankingComponent } from './team-view/table-ranking/table-ranking.component';
import { BrowserModule } from "@angular/platform-browser";
import { NgApexchartsModule } from "ng-apexcharts";
import { ConfirmPopupComponent } from "../shared/confirm-popup/confirm-popup.component";


@NgModule({
  declarations: [
    PostCreateComponent,
    PostListComponent,
    PaginationComponent,
    TeamViewComponent,
    GameweekComponent,
    GameWeekModalComponent,
    EditRatingsModalComponent,
    TableRankingComponent,
    ConfirmPopupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    ReactiveFormsModule,
    NgApexchartsModule
  ]
})
export class TeamsModule { }
