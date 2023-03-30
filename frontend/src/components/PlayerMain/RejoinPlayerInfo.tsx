/* eslint-disable react/jsx-no-useless-fragment */
import React, { useRef, useState } from "react";
import { gamePlayAPI } from "@apis/apis";
import { useLocation, useNavigate } from "react-router-dom";
import InputBox from "@components/common/InputBox";
import OTPInput from "@components/common/OTPInput";
import Button from "@components/common/Button";

// 1. 먼저 재참여자는 이전에 참여했던
//    닉네임과 비밀번호가 일치하는지 확인(/game/login)
// 2. isFinished == true (랭킹확인)
// 3. isFinished == false (이어하기)

export default function RejoinPlayerInfo() {
  const [otp, setOtp] = useState(""); // 비밀번호 state
  const [isClicked, setIsClicked] = useState(false); // 입장하기 버튼 클릭 여부
  const [isFinish, setIsFinish] = useState(false); // 참여자 게임 종료여부
  const [startedTime, setStartedTime] = useState(""); // 참여자 게임시작했던시간
  const location = useLocation(); // roomId props로 받기
  const navigate = useNavigate(); // 리다이렉트
  const nicknameHandler = useRef<HTMLInputElement>(null); // 닉네임 input
  const changeHandler = (value: string) => setOtp(value); // 비밀번호 input

  // 재참여 로그인
  const rejoinGameHandler = () => {
    const currentRef = nicknameHandler.current;
    if (otp.length < 4) {
      alert("비밀번호 4자리를 입력해주세요.");
    }

    const roomId = location.state.room;
    const roomPin = location.state.inputPin;

    if (currentRef) {
      let nicknameValue = currentRef.value;
      const password = parseInt(otp.slice(0, 4), 10);
      const request = gamePlayAPI.login(roomId, nicknameValue, password);

      request
        .then((res) => {
          setIsFinish(res.data.result.isFinished);
          setStartedTime(res.data.result.startTime);
          setIsClicked(true);
        })
        .catch((err) => {
          const errCode = err.response.data.status;
          switch (errCode) {
            case 400:
              alert("닉네임을 입력해주세요.");
              break;
            case 401:
              alert("닉네임과 비밀번호를 확인해주세요.");
              break;
            case 404:
              alert("참여한 전적이 없습니다. \n새게임을 시작해주세요.");
              navigate(`/newgame/${roomPin}`); // 새게임 페이지로 리다이렉트 -> 새게임페이지 나오면 닉네임 자동입력되게끔 추가해주기!!
              break;
            default:
              console.error();
          }
        });
      nicknameValue = ""; // 수정필요 -> 비워지지않음
      setOtp("");
    }
  };

  return (
    <div>
      <InputBox type="text" text="닉네임" ref={nicknameHandler} />
      <OTPInput value={otp} valueLength={4} onChange={changeHandler} />
      <div className="enter-button">
        {isClicked ? (
          <>
            {isFinish ? <Button text="랭킹보기" /> : <Button text="이어하기" />}
          </>
        ) : (
          <Button
            text="입장하기"
            type="submit"
            color="gray-blue"
            onClick={rejoinGameHandler}
          />
        )}
      </div>
    </div>
  );
}
