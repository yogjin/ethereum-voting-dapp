const Web3 = require('web3');

// ganache와 연결
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// 각 계정에 100ether씩 보유중인지 확인
const accPromise = web3.eth.getAccounts();
accPromise.then((accounts) => {
  accounts.forEach(async (account) => {
    const wei = await web3.eth.getBalance(account);
    const ether = web3.utils.fromWei(wei, 'ether');
    console.log(ether);
  });
});
