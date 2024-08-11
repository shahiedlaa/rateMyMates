import { Component, OnDestroy, OnInit } from "@angular/core";
import { initFlowbite } from "flowbite";

import { Subscription } from "rxjs";

import { PostService } from "../post-service";
import { Post } from "../post.model";
import { AuthService } from "src/app/auth/auth.service";
import * as e from "express";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit, OnDestroy {

  constructor(public postService: PostService, private authService: AuthService) { }
  posts: Post[] = [];

  postsSub!: Subscription;
  private authStatusSubs: Subscription;

  isLoading = false;
  userIsAuthenticated = false;

  creatorId: string;
  userId: string;

  totalPosts: number;
  postsPerPage = 2;
  currentPage = 1;

  ngOnInit(): void {
    setTimeout(() => {
      initFlowbite();
    });
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.postService.getPosts(this.postsPerPage, 1);
    };
    this.postsSub = this.postService.returnUpdatePostListener().subscribe(
      (postData: { posts: Post[], postCount: number }) => {
        this.posts = postData.posts;
        this.isLoading = false;
        this.totalPosts = postData.postCount;
      }
    )
    this.userIsAuthenticated = this.authService.getAuthentication();
    this.authStatusSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
        console.log(this.userIsAuthenticated);
      });
    this.creatorId = localStorage.getItem('userId');
    console.log(this.userIsAuthenticated);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }

  onDelete(id: any) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  changePage(page: number) {
    this.isLoading = true;
    this.currentPage = page;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    console.log(this.currentPage);
  }

}
