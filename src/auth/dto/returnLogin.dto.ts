import { ReturnUserDTO } from "../../user/dto/returnUser.dto";

export interface ReturnLoginDTO {
  user: ReturnUserDTO;
  acessToken: string;
}