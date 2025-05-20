import { Message } from "kafkajs";
import UsersRepository from "../../../repositories/users.repository";
import Users from "../../../models/users.model";

const usersRepository = new UsersRepository();

const subscribeUserLoggedIn = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const record = await usersRepository.findById(value.id);
  const data = {
    ...record,
    is_logged: value.is_logged,
    last_logged_at: value.last_logged_at,
    updated_at: new Date(),
  } as Users;
  await usersRepository.update({
    id: value.id,
    params: data
  });
  console.info(`Event Notification: Successfully logged in user ${data.id}.`);
};

export default subscribeUserLoggedIn;