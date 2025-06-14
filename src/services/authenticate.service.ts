import { UsersAccessType } from "../entities/users.entity";
import BusinessesModel from "../models/businesses.model";
import UsersModel from "../models/users.model";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED, MESSAGE_INVALID_API_KEY, MESSAGE_REQUIRED_API_KEY } from "../shared/constants/message.constant";
import ForbiddenException from "../shared/exceptions/forbidden.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { verifyToken } from "../shared/helpers/jwt.helper";
import BusinessesService from "./businesses.service";
import UsersService from "./users.service";

type Input = {
  token: string,
  api_key?: string,
};

type Output = {
  businesses?: BusinessesModel,
  users: UsersModel
};

export default class AuthenticateService {
  private input: Input;
  private businessesService: BusinessesService;
  private usersService: UsersService;

  constructor(input: Input) {
    this.input = input;
    this.businessesService = new BusinessesService();
    this.usersService = new UsersService();
  };

  private validateUserRecord = async (id: string) => {
    const usersRecord = await this.usersService.getById({ id })
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    return usersRecord;
  };

  private validateApiKey = async (api_key: string) => {
    const businessesRecord = await this.businessesService.getByApiKey(api_key)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    return businessesRecord;
  };

  execute = async (): Promise<Output> => {
    const { token, api_key } = this.input;
    let businessesRecord;
    const tokenData = verifyToken(token);

    if (!tokenData) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    // Validate users logged status
    const usersRecord = await this.validateUserRecord(tokenData.id as unknown as string);

    if (!usersRecord) {
      throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
    }

    if (Boolean(usersRecord.is_logged) === false) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    }

    // Validate via api_key if token client is BUSINESS
    if (tokenData.client === UsersAccessType.Business) {
      if (!api_key) {
        throw new ForbiddenException([MESSAGE_REQUIRED_API_KEY]);
      };

      businessesRecord = await this.validateApiKey(api_key as string);

      if (!businessesRecord) {
        throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
      }
    }

    return {
      businesses: businessesRecord,
      users: usersRecord
    };
  };
};