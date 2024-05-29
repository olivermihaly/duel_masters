import { dataSource } from "./dataSource";
import { User } from "./entity/user";

export async function getAllUsers(): Promise<User[]> {
  const userRepository = dataSource.getRepository(User);
  return await userRepository.find();
}

export async function getUserByName(name: string): Promise<User | null> {
  const userRepository = dataSource.getRepository(User);
  return await userRepository.findOneBy({ name });
}
