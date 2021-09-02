import { Op } from 'sequelize';

export const Like = (q: string) => ({
  [Op.like]: `%${q}%`,
});
