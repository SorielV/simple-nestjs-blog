import { Sequelize } from 'sequelize-typescript';

import { Repositories } from '../database/constrains';
import { UserEntity } from '../users/user.entity';
import { UserTokenEntity } from '../user-tokens/user-token.entity';
import { ProfileEntity } from '../profiles/profile.entity';
import { TagEntity } from '../tags/tag.entity';
import { ArticleEntity } from '../articles/article.entity';
import { ArticleTagEntity } from '../articles/article-tag.entity';

export const databaseProvider = {
  provide: Repositories.Sequelize,
  useFactory: () => {
    const sequelize = new Sequelize({
      logging: true,
      dialect: 'sqlite',
      storage: 'db-test.sqlite',
      validateOnly: true,
      models: [
        UserEntity,
        UserTokenEntity,
        ProfileEntity,
        TagEntity,
        ArticleEntity,
        ArticleTagEntity,
      ],
    });

    console.log('Sequelize Mocked');

    return sequelize;
  },
};
