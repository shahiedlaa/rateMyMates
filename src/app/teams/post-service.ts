import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Router } from "@angular/router";
import { initFlowbite } from "flowbite";
import { BehaviorSubject, Subject, map } from "rxjs";

import { Post } from "./post.model";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts"

@Injectable({ providedIn: 'root' })
export class PostService {
  posts: Post[] = [];
  updatePosts = new Subject<{ posts: Post[], postCount: number }>()
  formEmiiter = new BehaviorSubject(null);
  emitCreatorId = new BehaviorSubject(null);
  userId: string;

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage?: number, currentPage?: number) {

    const accessType = localStorage.getItem('accessType');
    const creatorId = localStorage.getItem('creatorId');
    let queryParams;

    if (accessType !== 'user') {
      queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    }
    else {
      queryParams = `?pageSize=${postsPerPage}&page=${currentPage}&creatorId=${creatorId}`;
    };

    this.http.get<{ message: string, posts: any, maxPosts: number, userId: string }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map((post: any) => {
            this.emitCreatorId.next(post.creator);
            this.userId = postData.userId;
            localStorage.setItem('userId', this.userId);
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.updatePosts.next({ posts: [...this.posts], postCount: transformedPosts.maxPosts });
      })
  }

  getPost(id: string | null) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(BACKEND_URL + '/' + id);
  }

  returnUpdatePostListener() {
    return this.updatePosts.asObservable();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title)
    }
    else {
      postData = {
        id: id, title: title, content: content, imagePath: image, creator: null
      };
    }
    console.log(postData);
    this.http.put(BACKEND_URL + '/' + id, postData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(['/']);
      })
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title)
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      })
    setTimeout(() => {
      initFlowbite();
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + '/' + postId);
  }

  getCreatorId() {
    return this.emitCreatorId.asObservable();
  }

}
