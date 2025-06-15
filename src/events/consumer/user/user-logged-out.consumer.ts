import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";
import { EventMessageData } from "../../../shared/types/common.type";
import { UserLoggedOut } from "../../../shared/types/events/users.type";

const usersService = new UsersService();

const subscribeUserLoggedOut = async (value: EventMessageData<UserLoggedOut>): Promise<void> => {
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

  const data = new UsersModel({ ...record, ...value.new_details });
  await usersService.save(data)
    .catch(err => {
      console.log("Error on updating users", err);
    });
  console.info(`Event Notification: Successfully logged out user ${data.id}.`);
};

export default subscribeUserLoggedOut;