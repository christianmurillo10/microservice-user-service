import UserEntity from "../entities/user.entity";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED } from "../shared/constants/message.constant";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { verifyToken } from "../shared/helpers/jwt.helper";
import UserService from "./user.service";

type Output = {
  user: UserEntity
};

export default class AuthenticateService {
  private token: string;
  private userService: UserService;

  constructor(token: string) {
    this.token = token;
    this.userService = new UserService();
  };

  private validateUserRecord = async (id: string) => {
    try {
      return await this.userService.getById(id);
    } catch (error) {
      if (error instanceof NotFoundException) return null;
      throw error
    }
  };

  execute = async (): Promise<Output> => {
    const tokenData = verifyToken(this.token);

    if (!tokenData) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    // Validate user logged status
    const userRecord = await this.validateUserRecord(tokenData.id as unknown as string);

    if (!userRecord) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    }

    if (Boolean(userRecord.isLogged) === false) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    }

    return {
      user: userRecord
    };
  };
};