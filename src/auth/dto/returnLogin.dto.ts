import { ReturnUserDTO } from "src/user/dto/returnUser.dto";

export interface ReturnLoginDTO {
  user: ReturnUserDTO;
  acessToken: string;
}