/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gamePlayAPI } from "@apis/apis";
import { Grid } from "@mui/material";
import RankInfo from "./RankInfo";
import "@styles/RankPage.scss";
import ShareButton from "./ShareButton";

interface IUser {
  grade: number;
  nickname: string;
  duration: string;
  isUser: boolean;
  solvedCnt: number;
}

export default function PlayerRank() {
  const [isUser, setIsUser] = useState(false);
  const [userArray, setUserArray] = useState<IUser[]>([]);

  const location = useLocation(); // roomId, nickname props로 받기
  const room = location.state.roomId;
  const nickname = location.state.nicknameValue;
  useEffect(() => {
    const request = gamePlayAPI.rank(room, nickname);
    request.then((res) => {
      const users = res.data.result;
      setUserArray(users);
    });
  }, [room, nickname]);

  return (
    <section className="player-rank-wrapper">
      <header className="ranking-title-flag">
        <h1>Ranking</h1>
      </header>
      <div className="rank-content">
        <Grid container className="rank-header">
          <Grid item xs={3} md={3}>
            <h5 className="rank-box1">등수</h5>
          </Grid>
          <Grid item xs={4} md={4}>
            <h5 className="rank-box2">닉네임</h5>
          </Grid>
          <Grid item xs={3} md={3}>
            <h5 className="rank-box3">시간</h5>
          </Grid>
        </Grid>
        {userArray.map((user: IUser, index: number) => (
          <RankInfo
            key={index}
            rank={user.grade}
            nickname={user.nickname}
            time={user.duration}
          />
        ))}
      </div>
      <ShareButton />
    </section>
  );
}
