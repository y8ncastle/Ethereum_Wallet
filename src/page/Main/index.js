import React, { Fragment, useState, useEffect } from "react";
import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Table,
} from "reactstrap";
import ethereum from "../../assets/images/logo/ethereum.png";
import crypto from "../../assets/images/cryptocurrency.png";
import * as bip39 from "bip39";
import hdkey from "ethereumjs-wallet/dist/hdkey";
import erc from "../../assets/images/erc.png";
import Web3 from "web3";
import abi from "../../common/abi";
import tokens from "../../assets/images/tokens.png";

const Main = () => {
  const [status, setStatus] = useState(7);
  const [pwd, setPwd] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [checkMnemo, setCheckMnemo] = useState("");
  const [balance, setBalance] = useState(0);
  const [txList, setTxList] = useState([]);
  const [modalTransfer, setModalTransfer] = useState(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalTx, setModalTx] = useState(false);
  const [modalTokTransfer, setModalTokTransfer] = useState(false);
  const [txDetail, setTxDetail] = useState([]);
  const [customTokens, setCustomTokens] = useState([]);
  const [ethAddr, setEthAddr] = useState("");
  const [ethAmount, setEthAmount] = useState("");
  const [tokAmount, setTokAmount] = useState("");
  const [futureGas, setFutureGas] = useState("");
  const [currentTok, setCurrentTok] = useState("");
  const [contract, setContract] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimal, setDecimal] = useState("");

  const handlePwd = (e) => {
    setPwd(e.target.value);
  };

  const handleCheckPwd = (e) => {
    setCheckPwd(e.target.value);
  };

  const handleMnemonic = (e) => {
    setCheckMnemo(e.target.value);
  };

  const handleEthAddr = (e) => {
    setEthAddr(e.target.value);
  };

  const handleEthAmount = (e) => {
    setEthAmount(e.target.value);
  };

  const handleTokAmount = (e) => {
    setTokAmount(e.target.value);
  };

  const handleContract = (e) => {
    setContract(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleSymbol = (e) => {
    setSymbol(e.target.value);
  };

  const handleDecimal = (e) => {
    setDecimal(e.target.value);
  };

  const toggleTransfer = () => {
    setModalTransfer(!modalTransfer);
  };

  const toggleModalAdd = () => {
    setModalAdd(!modalAdd);
  };

  const toggleTokTransfer = () => {
    setModalTokTransfer(!modalTokTransfer);
  };

  const toggleModalTx = () => {
    setModalTx(!modalTx);
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
    localStorage.setItem("wallet-key", "");
    localStorage.setItem("private-addr", "");
    localStorage.setItem("public-addr", "");
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
    localStorage.setItem("public-addr", address);
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

  const checkUserData = async () => {
    try {
      const web3 = new Web3(
        new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ROPSTEN)
      );
      const balCheck = await web3.eth.getBalance(
        localStorage.getItem("public-addr")
      );
      const currentGas = await web3.eth.getGasPrice();
      setFutureGas(web3.utils.fromWei(currentGas, "ether"));

      /*const currentBlock = await web3.eth.getBlockNumber();

      getTransactionsByAccount(
        localStorage.getItem("public-addr"),
        currentBlock - 50,
        currentBlock
      );*/

      setBalance(web3.utils.fromWei(balCheck, "ether"));
      setTxList([
        {
          status: "success",
          txHash:
            "0x00dc5099bfa3e20aa90e0404ea6b52b3abde1a6488583a5405431338f6068414",
          timestamp: "1655430067",
        },
      ]);
      setCustomTokens([
        {
          name: "BaSE",
          symbol: "BSE",
          decimal: "0",
          contract: "0x47f7083d0E8e4d0DB26b1be805EdAc8aFbBC6357",
          balance: "50",
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  /*async function getTransactionsByAccount(
    myaccount,
    startBlockNumber,
    endBlockNumber
  ) {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ROPSTEN)
    );

    if (endBlockNumber == null) {
      endBlockNumber = await web3.eth.blockNumber;
      console.log("Using endBlockNumber: " + endBlockNumber);
    }
    if (startBlockNumber == null) {
      startBlockNumber = endBlockNumber - 1000;
      console.log("Using startBlockNumber: " + startBlockNumber);
    }
    console.log(
      'Searching for transactions to/from account "' +
        myaccount +
        '" within blocks ' +
        startBlockNumber +
        " and " +
        endBlockNumber
    );

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      if (i % 1000 == 0) {
        console.log("Searching block " + i);
      }
      let block = await web3.eth.getBlock(i, true);
      let resultList = [];

      if (block != null && block.transactions != null) {
        block.transactions.forEach(function(e) {
          if (myaccount === "*" || myaccount === e.from || myaccount === e.to) {
            console.log(
              "  tx hash          : " +
                e.hash +
                "\n" +
                "   nonce           : " +
                e.nonce +
                "\n" +
                "   blockHash       : " +
                e.blockHash +
                "\n" +
                "   blockNumber     : " +
                e.blockNumber +
                "\n" +
                "   transactionIndex: " +
                e.transactionIndex +
                "\n" +
                "   from            : " +
                e.from +
                "\n" +
                "   to              : " +
                e.to +
                "\n" +
                "   value           : " +
                e.value +
                "\n" +
                "   time            : " +
                block.timestamp +
                " " +
                new Date(block.timestamp * 1000).toGMTString() +
                "\n" +
                "   gasPrice        : " +
                e.gasPrice +
                "\n" +
                "   gas             : " +
                e.gas +
                "\n" +
                "   input           : " +
                e.input
            );

            resultList.push([
              {
                txHash: e.hash,
                blockHash: e.blockHash,
                blockNumber: e.blockNumber,
                from: e.from,
                to: e.to,
                input: e.input,
              },
            ]);
          }
        });
      }
    }
  }*/

  const detailHash = async (hash) => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ROPSTEN)
    );

    const result = await web3.eth.getTransactionReceipt(hash);

    setTxDetail([
      hash,
      result.blockHash,
      result.blockNumber,
      result.from,
      result.to,
      result.logs[0].topics[0],
    ]);

    toggleModalTx();
  };

  const transferToken = async (name, symbol) => {
    setCurrentTok({ name: name, symbol: symbol });

    toggleTokTransfer();
  };

  const CustomDataList = (props) => {
    if (customTokens.length > 0) {
      return (
        <>
          {props.tokens.map((token) => (
            <div
              className="d-flex sebang"
              style={{ marginTop: 30, justifyContent: "center" }}
            >
              <Card
                className="d-flex shadow"
                style={{
                  width: "450px",
                  borderRadius: "15px",
                  height: "70px",
                  marginTop: "10px",
                  color: "#333333",
                  justifyContent: "center",
                }}
              >
                <div
                  className="d-flex align-items-center row"
                  style={{ justifyContent: "space-between" }}
                >
                  <img
                    src={tokens}
                    alt="..."
                    width="7%"
                    style={{ marginLeft: 40 }}
                  ></img>
                  <div style={{ marginRight: 95 }}>{token.name}</div>
                  <div style={{ marginLeft: 70, marginRight: 10 }}>
                    {token.balance} {token.symbol}
                  </div>
                  <Button
                    color="primary"
                    size="sm"
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                      marginRight: "40px",
                    }}
                    onClick={() => transferToken(token.name, token.symbol)}
                  >
                    전송
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </>
      );
    } else return <></>;
  };

  const TxDataList = (props) => {
    if (txList.length > 0) {
      return (
        <>
          {props.hashes.map((hash) => (
            <div className="d-flex" style={{ justifyContent: "center" }}>
              <Card
                className="shadow"
                style={{ width: "500px", height: "100px", marginTop: 30 }}
              >
                <div
                  className="d-flex row"
                  style={{ justifyContent: "space-between" }}
                >
                  {hash.status === "failed" ? (
                    <Button
                      disabled
                      className="sebang"
                      color="danger"
                      style={{
                        fontSize: "10px",
                        marginTop: 15,
                        marginLeft: 35,
                      }}
                    >
                      Failed Transaction
                    </Button>
                  ) : (
                    <Button
                      disabled
                      className="sebang"
                      color="success"
                      style={{
                        fontSize: "10px",
                        marginTop: 15,
                        marginLeft: 35,
                      }}
                    >
                      Completed Transaction
                    </Button>
                  )}
                  <div
                    className="sebang"
                    style={{
                      marginRight: 50,
                      marginTop: 23,
                      fontSize: "15px",
                    }}
                  >
                    {new Date(hash.timestamp * 1000).toLocaleString()}
                  </div>
                </div>
                <div className="sebang">
                  <Button
                    color="link"
                    style={{ fontSize: "11px", marginTop: 7 }}
                    onClick={() => detailHash(hash.txHash)}
                  >
                    {hash.txHash}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </>
      );
    } else return <></>;
  };

  useEffect(() => {
    if (status >= 7) {
      const interval = setInterval(() => {
        checkUserData();
      }, 1000);

      return () => clearInterval(interval);
    }
  });

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
                        {localStorage.getItem("public-addr")}
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
                      <div>보유 잔액</div>
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
                        onClick={toggleTransfer}
                      >
                        전송하기
                      </Button>
                    </div>
                  </Card>
                </div>
                <CustomDataList tokens={customTokens} />
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
                      <img src={erc} alt="..." width="30px" height="30px"></img>
                      <Button
                        color="link"
                        style={{
                          color: "#333333",
                          fontSize: "17px",
                        }}
                        onClick={toggleModalAdd}
                      >
                        ERC-20 커스텀 토큰 추가하기
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
                className="shadow d-flex"
                style={{
                  width: "600px",
                  minHeight: "73vh",
                  marginTop: 20,
                  marginLeft: 20,
                  borderRadius: "30px",
                  borderWidth: "2px",
                  borderColor: "#333333",
                }}
              >
                <div
                  className="sebang"
                  style={{ marginTop: 30, marginLeft: 40, fontSize: "18px" }}
                >
                  트랜잭션 내역
                </div>
                <TxDataList hashes={txList} />
              </Card>
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
      <Modal
        zIndex={2000}
        centered
        size="lg"
        isOpen={modalTx}
        toggle={toggleModalTx}
      >
        <ModalHeader
          className="sebang"
          style={{ fontSize: "13px", marginLeft: "5px" }}
          toggle={toggleModalTx}
        >
          트랜잭션 상세 내역
        </ModalHeader>
        <ModalBody>
          <div className="sebang">
            <Table
              hover
              bordered
              striped
              className="mb-2"
              style={{ fontSize: "12px" }}
            >
              <thead className="thead-light">
                <tr>
                  <th scope="col">Type</th>
                  <th scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Tx Hash</th>
                  <td>{txDetail[0]}</td>
                </tr>
                <tr>
                  <th scope="row">Block Hash</th>
                  <td>{txDetail[1]}</td>
                </tr>
                <tr>
                  <th scope="row">Block Number</th>
                  <td>{txDetail[2]}</td>
                </tr>
                <tr>
                  <th scope="row">From</th>
                  <td>{txDetail[3]}</td>
                </tr>
                <tr>
                  <th scope="row">To</th>
                  <td>{txDetail[4]}</td>
                </tr>
                <tr>
                  <th scope="row">Data</th>
                  <td>{txDetail[5]}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="sebang btn-link-dark"
            color="link"
            onClick={toggleModalTx}
          >
            닫기
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        zIndex={2000}
        centered
        isOpen={modalTransfer}
        toggle={toggleTransfer}
      >
        <ModalHeader
          className="sebang"
          style={{ fontSize: "13px", marginLeft: "5px" }}
          toggle={toggleTransfer}
        >
          이더리움 전송
        </ModalHeader>
        <ModalBody>
          <div className="sebang">
            <div className="d-flex row">
              <div style={{ marginLeft: 25, marginTop: 5, marginRight: 20 }}>
                수신 주소
              </div>
              <input
                type="text"
                placeholder="전송할 이더리움 주소를 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "350px",
                  marginLeft: 12,
                }}
                onChange={handleEthAddr}
                value={ethAddr}
              ></input>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 25, marginRight: 20 }}>
                전송 개수
              </div>
              <input
                type="number"
                placeholder="전송할 이더리움 개수를 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "250px",
                  marginTop: 20,
                  marginLeft: 12,
                }}
                onChange={handleEthAmount}
                value={ethAmount}
              ></input>
              <div style={{ marginLeft: 12, marginTop: 26 }}>ETH</div>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 30, marginRight: 20 }}>
                예상 수수료
              </div>
              <input
                disabled
                type="number"
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "250px",
                  marginTop: 25,
                }}
                value={futureGas}
              ></input>
              <div style={{ marginLeft: 12, marginTop: 30 }}>ETH</div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="sebang btn-link-dark"
            size="sm"
            color="primary"
            onClick={toggleTransfer}
          >
            전송
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        zIndex={2000}
        centered
        isOpen={modalTokTransfer}
        toggle={toggleTokTransfer}
      >
        <ModalHeader
          className="sebang"
          style={{ fontSize: "13px", marginLeft: "5px" }}
          toggle={toggleTokTransfer}
        >
          ERC-20 토큰 전송
        </ModalHeader>
        <ModalBody>
          <div className="sebang">
            <div className="d-flex row">
              <div style={{ marginLeft: 25, marginTop: 5, marginRight: 20 }}>
                수신 주소
              </div>
              <input
                type="text"
                placeholder="전송할 이더리움 주소를 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "350px",
                  marginLeft: 12,
                }}
                onChange={handleEthAddr}
                value={ethAddr}
              ></input>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 25, marginRight: 20 }}>
                전송 개수
              </div>
              <input
                type="number"
                placeholder="전송할 토큰 개수를 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "250px",
                  marginTop: 20,
                  marginLeft: 12,
                }}
                onChange={handleTokAmount}
                value={tokAmount}
              ></input>
              <div style={{ marginLeft: 12, marginTop: 26 }}>
                {currentTok.symbol}
              </div>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 30, marginRight: 20 }}>
                예상 수수료
              </div>
              <input
                disabled
                type="number"
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "250px",
                  marginTop: 25,
                }}
                value={futureGas}
              ></input>
              <div style={{ marginLeft: 12, marginTop: 30 }}>ETH</div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="sebang btn-link-dark"
            size="sm"
            color="primary"
            onClick={toggleTokTransfer}
          >
            전송
          </Button>
        </ModalFooter>
      </Modal>
      <Modal zIndex={2000} centered isOpen={modalAdd} toggle={toggleModalAdd}>
        <ModalHeader
          className="sebang"
          style={{ fontSize: "13px", marginLeft: "5px" }}
          toggle={toggleModalAdd}
        >
          ERC-20 커스텀 토큰 추가
        </ModalHeader>
        <ModalBody>
          <div className="sebang">
            <div className="d-flex row">
              <div style={{ marginLeft: 25, marginTop: 5, marginRight: 20 }}>
                컨트랙트 주소
              </div>
              <input
                type="text"
                placeholder="토큰의 컨트랙트 주소를 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "350px",
                  marginLeft: 5,
                }}
                onChange={handleContract}
                value={contract}
              ></input>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 25, marginRight: 20 }}>
                토큰 이름
              </div>
              <input
                type="text"
                placeholder="토큰의 이름을 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "250px",
                  marginTop: 20,
                  marginLeft: 32,
                }}
                onChange={handleName}
                value={name}
              ></input>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 25, marginRight: 20 }}>
                토큰 심볼
              </div>
              <input
                type="text"
                placeholder="토큰의 심볼을 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "250px",
                  marginTop: 20,
                  marginLeft: 32,
                }}
                onChange={handleSymbol}
                value={symbol}
              ></input>
            </div>
            <div className="row">
              <div style={{ marginLeft: 25, marginTop: 30, marginRight: 20 }}>
                소수점 자리수
              </div>
              <input
                type="number"
                placeholder="토큰 소수점 자리수(Decimal)을 입력해주세요."
                style={{
                  fontSize: "13px",
                  padding: 5,
                  width: "300px",
                  marginTop: 25,
                  marginLeft: 5,
                }}
                onChange={handleDecimal}
                value={decimal}
              ></input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="sebang btn-link-dark"
            size="sm"
            color="primary"
            onClick={toggleModalAdd}
          >
            등록
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Main;
