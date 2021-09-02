import {
  Body,
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  UseGuards,
  Req,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JWTAuthGuard } from '../auth/jwt-auth.guard';
import { IAuthRequest } from '../common/interface';
import { ProfilesService } from '../profiles/profiles.service';
import { ITagReport, TagsService } from '../tags/tags.service';
import { ArticleEntityScopes } from './article.entity';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { FindArticlesDto } from './dto/find.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesServices: ArticlesService,
    private readonly profilesServices: ProfilesService,
    private readonly tagsService: TagsService,
    @Inject(CACHE_MANAGER)
    private cacheManger: Cache,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  create(
    @Body() data: CreateArticleDto,
    @Req() { user: { userId } }: IAuthRequest,
  ) {
    return this.articlesServices.create(userId, data);
  }

  @Get()
  find(@Query() options: FindArticlesDto) {
    return this.articlesServices.find({
      ...options,
      scope: ArticleEntityScopes.Paging,
    });
  }

  // TODO: Rename / Cache constrains
  @Get('tags')
  async fetchTagsReport() {
    const TAGS_REPORT = 'TAGS_REPORT';
    const cached = await this.cacheManger.get<ITagReport>(TAGS_REPORT);
    if (cached) return cached;
    const report = await this.tagsService.fetchTagsReport();
    this.cacheManger.set(TAGS_REPORT, report, { ttl: 100 });
    return report;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWTAuthGuard)
  @UseGuards(JWTAuthGuard)
  findById(@Param('id') id: number) {
    return this.articlesServices.findById(id, { rejectOnEmpty: true });
  }

  @Get('/own')
  @UseGuards(JWTAuthGuard)
  findByOwner(
    @Body() data: FindArticlesDto,
    @Req() { user: { userId } }: IAuthRequest,
  ) {
    return this.articlesServices.findByUserId({
      ...data,
      userId,
      owner: true,
    });
  }

  @Get('/user/:username')
  async findByUsername(
    @Body() data: FindArticlesDto,
    @Param('username') username: string,
  ) {
    const userId = await this.profilesServices.findUserIdByUsername(username, {
      rejectOnEmpty: true,
    });
    return this.articlesServices.findByUserId({
      ...data,
      userId,
      owner: false,
    });
  }

  @Patch(':id')
  @UseGuards(JWTAuthGuard)
  updateById(
    @Param('id') id: number,
    @Body() data: UpdateArticleDto,
    @Req() { user: { userId } }: IAuthRequest,
  ) {
    return this.articlesServices.updateById(id, {
      ...data,
      userId,
    });
  }

  @Delete(':id')
  @UseGuards(JWTAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteById(
    @Param('id') id: number,
    @Req() { user: { userId } }: IAuthRequest,
  ) {
    return this.articlesServices.deleteById(id, userId);
  }
}
