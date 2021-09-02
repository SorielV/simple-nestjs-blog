import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindTagsDto } from './dto/find.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  find(@Query() options: FindTagsDto) {
    return this.tagsService.find(options);
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.tagsService.findById(id, { rejectOnEmpty: true });
  }
}
