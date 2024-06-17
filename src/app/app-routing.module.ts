import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostCreateComponent } from "./teams/post-create/post-create.component";
import { PostListComponent } from "./teams/post-list/post-list.component";
import { AuthGuard, PermissionsService } from "./auth/auth.guard";
import { TeamViewComponent } from "./teams/team-view/team-view.component";
import { GameweekComponent } from "./teams/team-view/gameweek/gameweek.component";

const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'view/:postId', component: TeamViewComponent, canActivate: [AuthGuard],
    children: [
      { path: 'gameweek/:gameNumber', component: GameweekComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [PermissionsService]
})
export class AppRoutingModule { }

