import { AxiosResponse } from "axios";
import request from "./agents";

// APis about game play
const gamePlayAPI = {
  enter: (roomCode: number): Promise<AxiosResponse> =>
    request.get("/game/enter", { params: { roomCode } }),
};

const memberAPI = {
  duplicateEmail: (email: string): Promise<AxiosResponse> =>
    request.get("member/duplicateEmail", {
      params: { email },
    }),
  duplicateNickName: (nickname: string): Promise<AxiosResponse> =>
    request.get("member/duplicateNickname", {
      params: { nickname },
    }),
  signUp: (
    nickname: string,
    password: string,
    organization: string,
    email: string
    // registrationId?: string
  ): Promise<AxiosResponse> =>
    request.post("member/signup",
    { nickname, password, organization, email }),
};

export { gamePlayAPI, memberAPI };
