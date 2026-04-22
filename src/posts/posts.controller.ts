import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getPosts() {
    return this.postsService.getPost();
  }

  @Post()
  postPosts(
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.createPost(dto)
  }
}
