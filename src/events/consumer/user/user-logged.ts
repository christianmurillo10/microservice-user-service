import { Message } from "kafkajs";
import UsersRepository from "../../../repositories/users.repository";
import Users from "../../../entities/users.entity";

const usersRepository = new UsersRepository();

const subscribeUserLogged = async (message: Message): Promise<void> => {
  const value = JSON.parse(message.value?.toString() ?? '{}');
  const record = await usersRepository.findById(value.id);
  const data = {
    ...record,
    name: value.name,
    username: value.username,
    email: value.email,
    password: value.password,
    access_type: value.access_type,
    is_active: value.is_active,
    is_logged: value.is_logged,
    last_logged_at: value.last_logged_at,
    created_at: value.created_at,
    updated_at: value.updated_at,
  } as Users;
  await usersRepository.update({
    id: value.id,
    params: data
  });
  console.info(`Event Notification: Successfully updated user ${data.id}.`);
};

export default subscribeUserLogged;