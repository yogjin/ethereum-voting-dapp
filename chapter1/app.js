const Web3 = require('web3');

// ganache와 연결
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// 각 계정에 100ether씩 보유중인지 확인
const accounts = web3.eth.accounts;
accounts.forEach((account) => {
  const wei = web3.eth.getBalance(account).toNumber();
  const ether = web3.fromWei(wei, 'ether');
  console.log(ether);
});
