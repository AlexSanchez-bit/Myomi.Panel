import { UserService } from "../services/User.service";

const userService = new UserService();

export function useUserService() {
  return { userService };
}
