import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@assets/logo.svg";

export default function Navbar() {
  // nav 가릴 주소
  // 추후 가릴 페이지가 많아지면, router로 가리기
  // 해당 링크 참고: https://changmin.tistory.com/40
  const location = useLocation();

  // 보다 명확한 경로 구분이 필요하다면 'path-to-regexp' 라이브러리를 설치해서 사용할 것
  if (
    location.pathname === "/login" ||
    location.pathname.startsWith("/newgame") || // /newgame으로 시작하는 경로(새게임페이지)
    location.pathname.startsWith("/rejoin") || // /rejoin 시작하는 경로(재참여페이지)
    location.pathname.startsWith("/game") || // /rejoin 시작하는 경로(재참여페이지)
    location.pathname.endsWith("/rank") // /rank으로 끝나는 경로(랭킹페이지)
  ) {
    return null;
  }
  return (
    <header className="app-main-header">
      {/* 게임 생성 페이지에서는 로고를 생략합니다. */}
      {location.pathname !== "/create/game" && (
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      )}
    </header>
  );
}
