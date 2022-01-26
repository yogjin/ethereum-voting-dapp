const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let account = '';

let abi = JSON.parse(
  `[{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"candidateNames","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]`
);
const contractInstance = new web3.eth.Contract(
  abi,
  '0x707b52385e6c95c2964b9e54e0006f29e2aed323'
);

let candidates = {
  Rama: 'candidate-1',
  Nick: 'candidate-2',
  Jose: 'candidate-3',
};
function voteForCandidate(candidate) {
  let candidateName = document.querySelector('#candidate').value;
  contractInstance.methods
    .voteForCandidate(web3.utils.toHex(candidateName))
    .send({ from: account })
    .then(setVotingStatus);
}

// 득표현황 확인
// 각 후보에 대해 totalVotesFor 호출
document.addEventListener('DOMContentLoaded', function () {
  setAccount();
  setVotingStatus();
});
// 계정 설정하기
function setAccount() {
  web3.eth.getAccounts(function (err, accs) {
    if (err != null) {
      alert('There was an error fetching your accounts.');
      return;
    }
    if (accs.length === 0) {
      alert(
        "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
      );
      return;
    }
    account = accs[0];
  });
}
// 후보 투표현황 표시
function setVotingStatus() {
  let candidateNames = Object.keys(candidates);

  for (let i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
    contractInstance.methods
      .totalVotesFor(web3.utils.toHex(name))
      .call()
      .then((result) => {
        document.querySelector(`#${candidates[name]}`).innerHTML = result;
      });
  }
}
