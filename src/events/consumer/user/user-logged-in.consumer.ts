import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";
import { UserLoggedIn } from "../../../shared/types/events/users.type";

const usersService = new UsersService();

const subscribeUserLoggedIn = async (value: EventMessageData<UserLoggedIn>): Promise<void> => {
  const userId = value.new_details.id;
  const record = await usersService.getById({ id: userId })
    .catch(err => {
      if (err instanceof NotFoundException) {
        console.log(`User ${userId} not exist!`);
        return;
      }

      throw err;
    });

  if (!record) {
    return;
  }

  const data = {
    ...record,
    is_logged: value.new_details.is_logged,
    last_logged_at: value.new_details.last_logged_at,
    updated_at: new Date(),
  } as UsersModel;

  await usersService.save(data)
    .catch(err => {
      console.log("Error on updating users", err);
    });
  console.info(`Event Notification: Successfully logged in user ${data.id}.`);
};

export default subscribeUserLoggedIn;