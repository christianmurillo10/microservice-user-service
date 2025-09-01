import { UserAccessType } from "../models/user.model";
import UserEntity from "../entities/user.entity";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED, MESSAGE_DATA_NOT_PERMITTED_TO_ACCESS_RESOURCE, MESSAGE_INVALID_API_KEY } from "../shared/constants/message.constant";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { verifyToken } from "../shared/helpers/jwt.helper";
import UserService from "./user.service";
import ForbiddenException from "../shared/exceptions/forbidden.exception";

type Input = {
  token: string,
  organizationId?: string,
};

type Output = {
  user: UserEntity
};

export default class AuthenticateService {
  private input: Input;
  private userService: UserService;

  constructor(input: Input) {
    this.input = input;
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
    const { token, organizationId } = this.input;
    const tokenData = verifyToken(token);

    if (!tokenData) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    // Validate via organizationId if token client is ORGANIZATION
    if (
      tokenData.client === UserAccessType.Organization &&
      organizationId === ":organizationId" &&
      organizationId !== String(tokenData.sub)
    ) {
      throw new ForbiddenException([MESSAGE_DATA_NOT_PERMITTED_TO_ACCESS_RESOURCE]);
    };

    // Validate user logged status
    const userRecord = await this.validateUserRecord(tokenData.id as unknown as string);

    if (!userRecord) {
      throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
    }

    if (Boolean(userRecord.isLogged) === false) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    }

    return {
      user: userRecord
    };
  };
};