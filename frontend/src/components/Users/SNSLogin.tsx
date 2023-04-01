import React from "react";
import { Link } from "react-router-dom";
import Button from "@components/common/Button";
import GoogleButton from "./GoogleButton";

export default function SNSLogin() {
  return (
    <div className="social-logins-container">
      <div className="social-login-title">
        <hr />
        <h5>SNS 로그인 / 회원가입</h5>
        <hr />
      </div>

      <GoogleButton />
      <Button text="카카오톡 로그인" color="kakao" />
      <Link to="/signup">
        <Button text="회원가입" color="skyblue" />
      </Link>
    </div>
  );
}
