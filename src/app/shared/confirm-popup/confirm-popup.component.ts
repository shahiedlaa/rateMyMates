import { Component, Input, OnChanges} from '@angular/core';
import { Router } from '@angular/router';

import { PostService } from 'src/app/teams/post-service';

@Component({
  selector: 'confirm-popup',
  templateUrl: './confirm-popup.component.html',
  styleUrls: ['./confirm-popup.component.css']
})
export class ConfirmPopupComponent implements OnChanges{

  constructor(private postService:PostService, private router: Router){}

  @Input() action;
  @Input() postId;

  public actionText = '';

  ngOnChanges(){
    this.actionText = this.action;
  }

  confirmAction() {
    switch(this.action){
      case 'delete':
        this.postService.deletePost(this.postId).subscribe(
          (response) => {
            console.log(response);
            this.router.navigate(['../']);
          }
        );
        break;
    }
  }

  deleteTeam(postId: string) {

  }
}
