import { UserAccessType } from "../entities/user.entity";
import OrganizationModel from "../models/organization.model";
import UserModel from "../models/user.model";
import { MESSAGE_DATA_INVALID_TOKEN, MESSAGE_DATA_NOT_LOGGED, MESSAGE_INVALID_API_KEY, MESSAGE_REQUIRED_API_KEY } from "../shared/constants/message.constant";
import ForbiddenException from "../shared/exceptions/forbidden.exception";
import NotFoundException from "../shared/exceptions/not-found.exception";
import UnauthorizedException from "../shared/exceptions/unauthorized.exception";
import { verifyToken } from "../shared/helpers/jwt.helper";
import OrganizationService from "./organization.service";
import UserService from "./user.service";

type Input = {
  token: string,
  apiKey?: string,
};

type Output = {
  organization?: OrganizationModel,
  user: UserModel
};

export default class AuthenticateService {
  private input: Input;
  private organizationService: OrganizationService;
  private userService: UserService;

  constructor(input: Input) {
    this.input = input;
    this.organizationService = new OrganizationService();
    this.userService = new UserService();
  };

  private validateUserRecord = async (id: string) => {
    const userRecord = await this.userService.getById({ id })
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    return userRecord;
  };

  private validateApiKey = async (apiKey: string) => {
    const organizationRecord = await this.organizationService.getByApiKey(apiKey)
      .catch(err => {
        if (err instanceof NotFoundException) return null;
        throw err;
      });

    return organizationRecord;
  };

  execute = async (): Promise<Output> => {
    const { token, apiKey } = this.input;
    let organizationRecord;
    const tokenData = verifyToken(token);

    if (!tokenData) {
      throw new UnauthorizedException([MESSAGE_DATA_INVALID_TOKEN]);
    };

    // Validate user logged status
    const userRecord = await this.validateUserRecord(tokenData.id as unknown as string);

    if (!userRecord) {
      throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
    }

    if (Boolean(userRecord.isLogged) === false) {
      throw new UnauthorizedException([MESSAGE_DATA_NOT_LOGGED]);
    }

    // Validate via apiKey if token client is BUSINESS
    if (tokenData.client === UserAccessType.Organization) {
      if (!apiKey) {
        throw new ForbiddenException([MESSAGE_REQUIRED_API_KEY]);
      };

      organizationRecord = await this.validateApiKey(apiKey as string);

      if (!organizationRecord) {
        throw new NotFoundException([MESSAGE_INVALID_API_KEY]);
      }
    }

    return {
      organization: organizationRecord,
      user: userRecord
    };
  };
};