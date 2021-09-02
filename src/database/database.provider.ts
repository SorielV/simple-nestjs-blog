import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '@nestjs/config';

import { Repositories } from './constrains';
import { DatabaseConfig } from '../config/config';
import { UserEntity } from 'src/users/user.entity';
import { UserTokenEntity } from 'src/user-tokens/user-token.entity';
import { ProfileEntity } from 'src/profiles/profile.entity';
import { TagEntity } from 'src/tags/tag.entity';
import { ArticleEntity } from 'src/articles/article.entity';
import { ArticleTagEntity } from 'src/articles/article-tag.entity';

export const databaseProvider = [
  {
    provide: Repositories.Sequelize,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const database = configService.get<DatabaseConfig>('database');
      const sequelize = new Sequelize({
        logging: (msg) => console.log(msg),
        dialect: 'postgres',
        host: database.host,
        port: database.port,
        username: database.username,
        password: database.password,
        database: database.database,
        define: {
          underscored: true,
          freezeTableName: true,
        },
      });

      console.log('Sequelize Mounted');

      // scope logical limitations https://github.com/RobinBuschmann/sequelize-typescript/issues/388
      sequelize.addModels([
        UserEntity,
        UserTokenEntity,
        ProfileEntity,
        TagEntity,
        ArticleEntity,
        ArticleTagEntity,
      ]);

      // tricks for perform search
      ArticleEntity.belongsToMany(TagEntity, {
        through: ArticleTagEntity,
        as: '_',
      });

      await sequelize.sync();

      return sequelize;
    },
  },
];
