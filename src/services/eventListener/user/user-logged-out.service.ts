import UserModel from "../../../models/user.model";
import UserEventListenerServiceAbstract from "../event-listener.abstract";
import EventListenerService from "../event-listener.interface";
import UserService from "../../user.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

export default class UserLoggedOutEventListenerService extends UserEventListenerServiceAbstract<UserModel> implements EventListenerService<UserModel> {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  };

  execute = async (): Promise<void> => {
    if (!this.state) {
      console.error("State cannot be empty!");
      return;
    };

    const userId = this.state.newDetails.id!;
    const existingUser = await this.userService.getById({ id: userId })
      .catch(err => {
        if (err instanceof NotFoundException) {
          console.log(`User ${userId} not exist!`);
          return;
        }

        throw err;
      });

    if (!existingUser) {
      return;
    }

    const user = new UserModel({
      ...existingUser,
      ...this.state.newDetails
    });
    await this.userService.save(user)
      .catch(err => {
        console.log("Error on updating user", err);
      });

    console.info(`Event Notification: Successfully logged out user ${user.id}.`);
  };
};