const Web3 = require('web3');
const fs = require('fs');
// ganache와 연결
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
// 1. 각 계정에 100ether씩 보유중인지 확인
const accPromise = web3.eth.getAccounts();
// accPromise.then((accounts) => {
//   accounts.forEach(async (account) => {
//     const wei = await web3.eth.getBalance(account);
//     const ether = web3.utils.fromWei(wei, 'ether');
//     console.log(ether);
//   });
// });

// 2. deploy contract (컨트랙트 배포)
// ganache 배포시 ABI와 binary code가 필요 --abi, --bin
// ABI는 흔히 알고있는 API와 비슷한 개념인데, binary 코드 수준에서 작동하는 인터페이스
const abi = JSON.parse(fs.readFileSync('./Voting_sol_Voting.abi'));
const bytecode = fs.readFileSync('./Voting_sol_Voting.bin').toString();
// console.log(abi);
// console.log(bytecode);
const VotingContract = new web3.eth.Contract(abi);
accPromise.then((accounts) => {
  // 컨트랙트를 블록체인에 배포
  VotingContract.deploy({
    data: bytecode,
    arguments: [['Rama', 'Nick', 'Jose'].map((name) => web3.utils.toHex(name))], // constructor
  })
    .send({
      from: accounts[0],
      gas: '4700000',
    })
    .then(async (newContractInstance) => {
      console.log(newContractInstance.options.address);
      // 일반호출과 읽기전용호출(view)의 차이는 블록체인의 상태를 바꾸는가 아닌가의 차이
      newContractInstance.methods
        .totalVotesFor(web3.utils.toHex('Rama'))
        .call() // 읽기 전용 함수일때 call() 사용
        .then(console.log); // Rama 투표수: 0
      // voteForCandidate(투표): 누구한테(Rama), 누가 투표(account[0])
      await newContractInstance.methods
        .voteForCandidate(web3.utils.toHex('Rama'))
        .send({ from: accounts[0] })
        .then(console.log);
      newContractInstance.methods
        .totalVotesFor(web3.utils.toHex('Rama'))
        .call()
        .then(console.log); // // Rama 투표수: 1
    });
});
