import { Message } from "kafkajs";
import UsersModel from "../../../models/users.model";
import UsersService from "../../../services/users.service";
import NotFoundException from "../../../shared/exceptions/not-found.exception";

const usersService = new UsersService();

const subscribeUserLoggedOut = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const record = await usersService.getById(value.id)
    .catch(err => {
      if (err instanceof NotFoundException) {
        console.log(`User ${value.id} not exist!`);
        return;
      }

      throw err;
    });

  if (!record) {
    return;
  }

  const data = {
    ...record,
    is_logged: value.is_logged,
    last_logged_at: value.last_logged_at,
    updated_at: new Date(),
  } as UsersModel;

  await usersService.save(data)
    .catch(err => {
      console.log("Error on updating users", err);
    });
  console.info(`Event Notification: Successfully logged out user ${data.id}.`);
};

export default subscribeUserLoggedOut;