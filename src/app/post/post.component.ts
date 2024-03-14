import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  providers: [HttpClient]
})
export class PostComponent {
  http = inject(HttpClient);
  url: string = 'https://localhost:7203/tech,politics?sortBy=id&direction=asc';

  posts: any[] = [];

  urlSearchTag: string = '';
  errorMsg: string = '';

  arrayFields: string[] = ["likes", "reads", "popularity", "id"];


  ngOnInit(): void {
    this.fetchPosts(this.url);
  }

  fetchPosts(url: string) {
    this.http.get(url).subscribe((response: any) => {
      console.log(response);
      //this.posts = response;
      this.posts = Array.isArray(response) ? response : (response.posts || []);
    });
  }

  searchTags(tagVar: any, fieldVar: any, sortVar: any) {
    if (tagVar.value.length < 1) {
      this.posts = [];
      this.errorMsg = "tags parameter is required";
    } else if (!this.arrayFields.includes(fieldVar.value.toLowerCase()) && fieldVar.value.length > 0) {
      this.errorMsg = "sortBy parameter is invalid";
      this.posts = [];
    } else if (!["asc", "desc"].includes(sortVar.value.toLowerCase()) && sortVar.value.length > 0) {
      this.errorMsg = "direction parameter is invalid";
      this.posts = [];
    } else {
      if (fieldVar.value.length > 0) {
        let directionParam = sortVar.value.length > 0 ? "&direction=" + sortVar.value : "";
        this.urlSearchTag = `https://localhost:7203/${tagVar.value.toLowerCase()}?sortBy=${fieldVar.value.toLowerCase()}${directionParam}`;
        this.fetchPosts(this.urlSearchTag);
      } else {
        this.urlSearchTag = `https://localhost:7203/${tagVar.value.toLowerCase()}`;
        this.fetchPosts(this.urlSearchTag);
      }
    }
  }

}
