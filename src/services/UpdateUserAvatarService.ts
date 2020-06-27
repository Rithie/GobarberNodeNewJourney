import { getRepository } from "typeorm";
import { join } from "path";
import upload from "../config/upload";
import fs from "fs";

import User from "../models/Users";

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new Error("Only authenticated users can change avatar.");
    }

    if (user.avatar) {
      const userAvatarFilePath = join(upload.directory, user.avatar);
      const userAvatarFileExist = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExist) await fs.promises.unlink(userAvatarFilePath);
    }

    user.avatar = avatarFilename;

    await usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;