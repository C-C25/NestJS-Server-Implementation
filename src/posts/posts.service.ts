import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepo: Repository<PostsEntity>,
  ) { }

  async getPost() {
    return this.postsRepo.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
    });

    if (post === undefined) throw new NotFoundException('게시글을 찾지 못했습니다.');

    return post;
  }

  // auth 적용 예정
  // async createPost(authorId: number, dto: CreatePostDto) {
  //   const post = this.postsRepo.create({
  //     author: {
  //       id: authorId,
  //     },
  //     ...dto,
  //     likeCount: 0,
  //     commentCount: 0,
  //   });

  //   const newPost = await this.postsRepo.save(post);

  //   return newPost;
  // };

  async updatePost(postId: number, dto: UpdatePostDto) {
    const post = await this.postsRepo.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException('포스트를 찾지 못했습니다.')

    if (dto.title === undefined) {
      dto.title = post?.title;
    };

    if (dto.content === undefined) {
      dto.content = post?.content;
    }

    const newPost = await this.postsRepo.save(post);

    return newPost;
  }

  // 작성자가 삭제 할수 있는 정책이라면
  async removePost(postId: number) {
    const post = await this.postsRepo.findOne({
      where: {
        id: postId,
      }
    });

    if (!post) {
      throw new NotFoundException('포스트를 찾지 못했습니다.')
    }

    await this.postsRepo.delete(post);

    return postId;
  }
}
