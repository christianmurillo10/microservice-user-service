import { Message } from "kafkajs";
import UsersRepository from "../../../repositories/users.repository";
import Users from "../../../entities/users.entity";

const usersRepository = new UsersRepository();

const subscribeUserLoggedOut = async (message: Message): Promise<void> => {
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
  console.info(`Event Notification: Successfully logged out user ${data.id}.`);
};

export default subscribeUserLoggedOut;