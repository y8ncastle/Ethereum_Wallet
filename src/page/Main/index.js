/* eslint-disable */
import React, { Fragment, useState } from "react";
import { Button, Card } from "reactstrap";
import ethereum from "../../assets/images/logo/ethereum.png";
import crypto from "../../assets/images/cryptocurrency.png";
import * as bip39 from "bip39";
import hdkey from "ethereumjs-wallet/dist/hdkey";
import erc from "../../assets/images/erc.png";

const Main = () => {
  const [status, setStatus] = useState(7);
  const [pwd, setPwd] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [checkMnemo, setCheckMnemo] = useState("");
  const [publicAdr, setPublicAdr] = useState(
    "0x80eF9C46443E616032ffFB05e89aC7693830cD50"
  );
  const [balance, setBalance] = useState(0);

  const handlePwd = (e) => {
    setPwd(e.target.value);
  };

  const handleCheckPwd = (e) => {
    setCheckPwd(e.target.value);
  };

  const handleMnemonic = (e) => {
    setCheckMnemo(e.target.value);
  };

  const initPwd = () => {
    setPwd("");
    setCheckPwd("");
  };

  const goBackToHome = () => {
    setStatus(1);
    setPwd("");
    setCheckPwd("");
    setMnemonic("");
    setCheckMnemo("");
  };

  const checkPwdValidity = () => {
    if (pwd.length === 0 || checkPwd.length === 0)
      alert("비밀번호를 입력해주세요.");
    else if (pwd !== checkPwd) alert("비밀번호가 서로 다릅니다.");
    else {
      localStorage.setItem("wallet-key", pwd);

      if (status === 2) generateMnemonic();
      else if (status === 5) setStatus(6);
    }
  };

  const generateMnemonic = async () => {
    const genMnemonic = bip39.generateMnemonic();

    setMnemonic(genMnemonic);
    setStatus(3);

    const seed = await bip39.mnemonicToSeed(genMnemonic);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const path = "m/44'/60'/0'/0/0";
    const wallet = hdWallet.derivePath(path).getWallet();
    const prvKey = `0x${wallet.getPrivateKey().toString("hex")}`;
    const address = `0x${wallet.getAddress().toString("hex")}`;

    localStorage.setItem("private-addr", prvKey);
    localStorage.setItem("public-addr", publicAdr);
    setPublicAdr(address);
  };

  const checkMnemonic = () => {
    if (mnemonic !== checkMnemo) alert("기존의 니모닉과 다릅니다.");
    else setStatus(7);
  };

  const validateMnemonic = async () => {
    const result = bip39.validateMnemonic(checkMnemo);

    if (result === false) alert("니모닉이 유효하지 않습니다.");
    else {
      const seed = await bip39.mnemonicToSeed(checkMnemo);
      const hdWallet = hdkey.fromMasterSeed(seed);
      const path = "m/44'/60'/0'/0/0";
      const wallet = hdWallet.derivePath(path).getWallet();
      const prvKey = `0x${wallet.getPrivateKey().toString("hex")}`;
      const address = `0x${wallet.getAddress().toString("hex")}`;

      localStorage.setItem("private-addr", prvKey);
      localStorage.setItem("public-addr", address);
      setStatus(7);
    }
  };

  const checkUserData = async () => {};

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
            Ethereum Web Wallet
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
            {status === 1 ? (
              <>
                <div
                  className="d-flex"
                  style={{ justifyContent: "center", marginTop: 55 }}
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
                    onClick={() => setStatus(2)}
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
                    onClick={() => setStatus(5)}
                  >
                    지갑 복원하기
                  </Button>
                </div>
              </>
            ) : status === 2 || status === 5 ? (
              <>
                <div
                  className="d-flex sebang"
                  style={{
                    justifyContent: "center",
                    fontSize: "22px",
                    marginTop: 70,
                    marginBottom: 40,
                  }}
                >
                  관리에 필요한 비밀번호를 설정해주세요.
                </div>
                <div className="leferi">
                  <Card style={{ marginLeft: 40, marginRight: 40 }}>
                    <input
                      type="password"
                      placeholder="비밀번호를 입력해주세요."
                      maxLength="20"
                      style={{ fontSize: "17px", padding: 15 }}
                      onChange={handlePwd}
                      value={pwd}
                    ></input>
                    <input
                      type="password"
                      placeholder="비밀번호를 다시 입력해주세요."
                      maxLength="20"
                      style={{ fontSize: "17px", padding: 15, marginTop: 20 }}
                      onChange={handleCheckPwd}
                      value={checkPwd}
                    ></input>
                  </Card>
                </div>

                <div>
                  <div
                    className="sebang d-flex"
                    style={{ justifyContent: "center", marginTop: 60 }}
                  >
                    <Button
                      style={{
                        width: "200px",
                        height: "50px",
                        fontSize: "19px",
                        backgroundColor: "#56a897",
                        borderRadius: "10px",
                        borderWidth: "0px",
                        color: "#ffffff",
                      }}
                      onClick={checkPwdValidity}
                    >
                      설정하기
                    </Button>
                    <Button
                      color="dark"
                      style={{
                        width: "200px",
                        height: "50px",
                        marginLeft: 40,
                        fontSize: "19px",
                        borderRadius: "10px",
                        borderWidth: "0px",
                        color: "#ffffff",
                      }}
                      onClick={initPwd}
                    >
                      입력 초기화
                    </Button>
                  </div>
                  <div
                    className="sebang d-flex"
                    style={{ justifyContent: "center", marginTop: 40 }}
                  >
                    <Button
                      color="dark"
                      style={{
                        width: "300px",
                        height: "50px",
                        fontSize: "19px",
                        borderRadius: "10px",
                        borderWidth: "0px",
                        color: "#ffffff",
                      }}
                      onClick={goBackToHome}
                    >
                      돌아가기
                    </Button>
                  </div>
                </div>
              </>
            ) : status === 3 ? (
              <>
                <div
                  className="d-flex sebang"
                  style={{
                    justifyContent: "center",
                    fontSize: "22px",
                    marginTop: 70,
                    marginBottom: 40,
                  }}
                >
                  아래의 니모닉을 백업해주세요.
                </div>
                <textarea
                  className="leferi"
                  type="text"
                  style={{
                    fontSize: "17px",
                    padding: 15,
                    marginLeft: 40,
                    marginRight: 40,
                    height: "200px",
                  }}
                  value={mnemonic}
                ></textarea>
                <div
                  className="leferi"
                  style={{
                    fontSize: "15px",
                    color: "#ec5a50",
                    marginTop: 20,
                    marginLeft: 45,
                  }}
                >
                  * 니모닉은 이더리움 계정을 복구할 수 있는 개인키입니다. 외부에
                  공개되지
                  <br />
                  않도록 반드시 안전한 곳에 보관하시기 바랍니다.
                </div>
                <div
                  className="d-flex sebang"
                  style={{ marginTop: 40, justifyContent: "center" }}
                >
                  <Button
                    style={{
                      width: "300px",
                      height: "60px",
                      fontSize: "19px",
                      borderRadius: "10px",
                      borderWidth: "0px",
                      marginTop: "30px",
                      backgroundColor: "#56a897",
                      color: "#ffffff",
                    }}
                    onClick={() => setStatus(4)}
                  >
                    백업 완료
                  </Button>
                </div>
              </>
            ) : status === 4 ? (
              <>
                <div
                  className="d-flex sebang"
                  style={{
                    justifyContent: "center",
                    fontSize: "22px",
                    marginTop: 70,
                    marginBottom: 40,
                  }}
                >
                  앞에서 백업한 니모닉을 그대로 입력해주세요.
                </div>
                <textarea
                  className="leferi"
                  type="text"
                  style={{
                    fontSize: "17px",
                    padding: 15,
                    marginLeft: 40,
                    marginRight: 40,
                    height: "200px",
                  }}
                  rows="5"
                  onChange={handleMnemonic}
                  value={checkMnemo}
                ></textarea>
                <div
                  className="leferi"
                  style={{
                    fontSize: "15px",
                    color: "#ec5a50",
                    marginTop: 20,
                    marginLeft: 45,
                  }}
                >
                  * 니모닉은 이더리움 계정을 복구할 수 있는 개인키입니다. 외부에
                  공개되지
                  <br />
                  않도록 반드시 안전한 곳에 보관하시기 바랍니다.
                </div>
                <div
                  className="d-flex sebang"
                  style={{ marginTop: 40, justifyContent: "center" }}
                >
                  <Button
                    style={{
                      width: "200px",
                      height: "60px",
                      fontSize: "19px",
                      borderRadius: "10px",
                      borderWidth: "0px",
                      marginTop: "30px",
                      backgroundColor: "#56a897",
                      color: "#ffffff",
                    }}
                    onClick={checkMnemonic}
                  >
                    복원하기
                  </Button>
                  <Button
                    color="dark"
                    style={{
                      width: "200px",
                      height: "60px",
                      marginLeft: 30,
                      fontSize: "19px",
                      borderRadius: "10px",
                      borderWidth: "0px",
                      marginTop: "30px",
                      color: "#ffffff",
                    }}
                    onClick={() => setStatus(3)}
                  >
                    다시 백업하기
                  </Button>
                </div>
              </>
            ) : status === 6 ? (
              <>
                <div
                  className="d-flex sebang"
                  style={{
                    justifyContent: "center",
                    fontSize: "22px",
                    marginTop: 70,
                    marginBottom: 40,
                  }}
                >
                  복구할 니모닉을 입력해주세요.
                </div>
                <textarea
                  className="leferi"
                  type="text"
                  style={{
                    fontSize: "17px",
                    padding: 15,
                    marginLeft: 40,
                    marginRight: 40,
                    height: "200px",
                  }}
                  rows="5"
                  onChange={handleMnemonic}
                  value={checkMnemo}
                ></textarea>
                <div
                  className="leferi"
                  style={{
                    fontSize: "15px",
                    color: "#ec5a50",
                    marginTop: 20,
                    marginLeft: 45,
                  }}
                >
                  * 니모닉은 이더리움 계정을 복구할 수 있는 개인키입니다. 외부에
                  공개되지
                  <br />
                  않도록 반드시 안전한 곳에 보관하시기 바랍니다.
                </div>
                <div
                  className="d-flex sebang"
                  style={{ marginTop: 40, justifyContent: "center" }}
                >
                  <Button
                    style={{
                      width: "200px",
                      height: "60px",
                      fontSize: "19px",
                      borderRadius: "10px",
                      borderWidth: "0px",
                      marginTop: "30px",
                      backgroundColor: "#56a897",
                      color: "#ffffff",
                    }}
                    onClick={validateMnemonic}
                  >
                    복원하기
                  </Button>
                  <Button
                    color="dark"
                    style={{
                      width: "200px",
                      height: "60px",
                      marginLeft: 30,
                      fontSize: "19px",
                      borderRadius: "10px",
                      borderWidth: "0px",
                      marginTop: "30px",
                      color: "#ffffff",
                    }}
                    onClick={goBackToHome}
                  >
                    홈으로 돌아가기
                  </Button>
                </div>
              </>
            ) : status === 7 ? (
              <>
                <div
                  className="d-flex sebang"
                  style={{ marginTop: 30, justifyContent: "center" }}
                >
                  <Card
                    className="d-flex bg-asteroid shadow"
                    style={{
                      width: "450px",
                      borderRadius: "15px",
                      height: "250px",
                      marginTop: "10px",
                      color: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        marginTop: 20,
                        marginLeft: 25,
                        width: "400px",
                        height: "40px",
                        fontSize: "18px",
                      }}
                    >
                      <div
                        className="row"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div style={{ marginLeft: 25 }}>Ethereum</div>
                        <div
                          style={{
                            marginRight: 25,
                            color: "#909090",
                            fontSize: "16px",
                          }}
                        >
                          Ropsten Network
                        </div>
                      </div>
                    </div>
                    <div
                      className="d-flex"
                      style={{
                        width: "450px",
                        height: "40px",
                        fontSize: "18px",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{ marginTop: "15px", fontSize: "15px" }}>
                        {publicAdr}
                      </div>
                    </div>

                    <div
                      className="row"
                      style={{
                        marginTop: "30px",
                        marginLeft: "25px",
                        width: "400px",
                        height: "30px",
                        fontSize: "18px",
                        justifyContent: "space-between",
                        borderBottom: "1px dotted",
                        paddingBottom: "10px",
                      }}
                    >
                      <div>보유 잔액:</div>
                      <div>{balance} ETH</div>
                    </div>
                    <div
                      className="d-flex"
                      style={{
                        marginTop: "25px",
                        width: "450px",
                        height: "40px",
                        fontSize: "18px",
                        justifyContent: "center",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <Button
                        block
                        color="white"
                        style={{ color: "#333333", fontSize: "16px" }}
                      >
                        전송하기
                      </Button>
                    </div>
                  </Card>
                </div>
                <div
                  className="d-flex sebang"
                  style={{ marginTop: 30, justifyContent: "center" }}
                >
                  <Card
                    className="d-flex shadow"
                    style={{
                      width: "450px",
                      borderRadius: "15px",
                      height: "90px",
                      marginTop: "10px",
                      color: "#ffffff",
                      justifyContent: "center",
                    }}
                  >
                    <div className="d-flex justify-content-center align-items-center row">
                      <img src={erc} alt="..." width="35px" height="35px"></img>
                      <Button
                        color="link"
                        style={{
                          color: "#333333",
                          fontSize: "17px",
                          marginLeft: "5px",
                        }}
                      >
                        ERC20 커스텀 토큰 추가하기
                      </Button>
                    </div>
                  </Card>
                </div>
              </>
            ) : null}
          </Card>
        </div>
        {status >= 7 ? (
          <>
            <div className="column">
              <Card
                className="shadow"
                style={{
                  width: "600px",
                  minHeight: "73vh",
                  marginTop: 20,
                  marginLeft: 20,
                  borderRadius: "30px",
                  borderWidth: "2px",
                  borderColor: "#333333",
                }}
              ></Card>
            </div>
          </>
        ) : null}
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
