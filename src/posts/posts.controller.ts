import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/decorators/user.decorators';
import { UsersEntity } from '../users/entities/users.entity';
import { AccessTokenGuard } from '../auth/guard/jwt.guard/access.token.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getPosts() {
    return this.postsService.getPost();
  }

  // @UseGuards(AccessTokenGuard)
  // @Post()
  // postPosts(
  //   @User() user: UsersEntity,
  //   @Body() dto: CreatePostDto,
  // ) {
  //   return this.postsService.createPost(user.id, dto)
  // }
}
