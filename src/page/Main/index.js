/* eslint-disable */
import React, { Fragment } from "react";
import { Button, Card } from "reactstrap";
import ethereum from "../../assets/images/logo/ethereum.png";
import crypto from "../../assets/images/cryptocurrency.png";

const Main = () => {
  return (
    <Fragment>
      <div
        className="d-flex"
        style={{
          minHeight: "12vh",
          backgroundColor: "#333333",
          minWidth: "100vh",
          justifyContent: "center",
        }}
      >
        <div className="d-flex row" style={{ paddingTop: 30 }}>
          <img src={ethereum} alt="..." width="40px" height="60px"></img>
          <h2
            className="sebang"
            style={{ color: "#ffffff", marginTop: 13, marginLeft: 25 }}
          >
            Ethereum Wallet
          </h2>
        </div>
      </div>
      <div
        className="d-flex"
        style={{
          minHeight: "78vh",
          backgroundColor: "#333333",
          minWidth: "100vh",
          justifyContent: "center",
        }}
      >
        <div
          className="d-flex"
          style={{
            paddingTop: 20,
            paddingBottom: 30,
          }}
        >
          <Card
            className="shadow"
            style={{
              width: "580px",
              minHeight: "72vh",
              borderRadius: "30px",
              borderWidth: "2px",
              borderColor: "#333333",
            }}
          >
            <div
              className="d-flex"
              style={{ justifyContent: "center", marginTop: 50 }}
            >
              <img src={crypto} alt="..." width="180px"></img>
            </div>
            <div
              className="d-flex"
              style={{ width: "580px", justifyContent: "center" }}
            >
              <div
                className="leferi"
                style={{ fontSize: "16px", marginTop: "70px" }}
              >
                새로운 이더리움 지갑을 생성합니다.
              </div>
            </div>
            <div className="d-flex" style={{ justifyContent: "center" }}>
              <Button
                className="isa shadow"
                style={{
                  width: "350px",
                  height: "60px",
                  fontSize: "19px",
                  borderRadius: "10px",
                  borderWidth: "0px",
                  marginTop: "30px",
                  backgroundColor: "#56a897",
                  color: "#ffffff",
                }}
              >
                지갑 생성하기
              </Button>
            </div>
            <div
              className="d-flex"
              style={{ width: "580px", justifyContent: "center" }}
            >
              <div
                className="leferi"
                style={{ fontSize: "16px", marginTop: "80px" }}
              >
                기존에 만든 이더리움 지갑을 불러옵니다.
              </div>
            </div>
            <div className="d-flex" style={{ justifyContent: "center" }}>
              <Button
                className="isa shadow"
                style={{
                  width: "350px",
                  height: "60px",
                  fontSize: "19px",
                  borderRadius: "10px",
                  borderWidth: "0px",
                  marginTop: "30px",
                  backgroundColor: "#56a897",
                  color: "#ffffff",
                }}
              >
                지갑 복원하기
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <div
        className="d-flex"
        style={{
          minHeight: "10vh",
          backgroundColor: "#333333",
          minWidth: "100vh",
          justifyContent: "center",
        }}
      >
        <div
          className="row"
          style={{ paddingTop: 30, justifyContent: "center" }}
        >
          <div
            className="leferi"
            style={{
              color: "#ffffff",
              fontSize: "13px",
              paddingBottom: "10px",
            }}
          >
            2022 소프트웨어 공학 프로젝트 (이더리움 지갑) - 정윤성, 은태영,
            조성우
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Main;
