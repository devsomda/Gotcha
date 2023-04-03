import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  email: string;
  nickname: string;
  organization?: string;
  profileImage?: string;
  isLogin: boolean;
}

const initialState: UserState = {
  id: -1,
  email: "",
  nickname: "",
  isLogin: false,
  organization: "",
  profileImage: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 로그인
    setLogin: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        id: action.payload.id,
        email: action.payload.email,
        nickname: action.payload.nickname,
        isLogin: true,
        organization: action.payload.organization,
        profileImage: action.payload.profileImage,
      };
    },

    // 회원정보 수정
    putUser: (state, action: PayloadAction<UserState>) => {
      return {
        ...state,
        nickname: action.payload.nickname,
        organization: action.payload.organization,
        profileImage: action.payload.profileImage,
      };
    },

    // 로그아웃
    setLogout: (state) => {
      return {
        ...state,
        id: -1,
        email: "",
        nickname: "",
        isLogin: false,
        organization: "",
        profileImage: "",
      };
    },
  },
});

export const { setLogin, putUser, setLogout } = userSlice.actions;
export default userSlice.reducer;