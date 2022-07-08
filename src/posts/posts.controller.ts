import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import CreatePostDto from './dto/create-post.dto';
import LikePostDto from './dto/like-post.dto';
import PaginationPostDto from './dto/pagination-post.dto';
import ReadAllPostDto from './dto/read-all-post.dto';
import ReadPostDto from './dto/read-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('posts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Post('create')
  @ApiBody({
    type: CreatePostDto,
    description: 'The post to be created',
  })
  @ApiCreatedResponse({
    description: 'The post has been created',
    type: ReadPostDto,
  })
  async create(@Req() req, @Body() post: CreatePostDto) {
    return this.postService.create(post, req.user);
  }

  @Post(':id/like')
  @ApiNoContentResponse({
    description: 'The post has been liked',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async like(@Req() req, @Param() post: LikePostDto) {
    await this.postService.like(post.id, req.user);
  }

  @Delete(':id/like')
  @ApiNoContentResponse({
    description: 'The post has been like removed',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlike(@Req() req, @Param() post: LikePostDto) {
    await this.postService.removeLike(post.id, req.user);
  }

  @Post('list')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'List of posts',
    type: PaginationPostDto,
  })
  async readAll(@Body() param: ReadAllPostDto) {
    return this.postService.readPost(param);
  }
}
