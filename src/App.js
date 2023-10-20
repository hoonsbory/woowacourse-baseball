

import {Console,  Random} from "@woowacourse/mission-utils";
class App {
  numRange = 3;
  script = {
    gameStart : '숫자 야구 게임을 시작합니다.',
    question : '숫자를 입력하세요 : ',
    noCorrect : '낫싱',
    correct : '3개의 숫자를 모두 맞히셨습니다! 게임 종료',
    retry : '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.',
    exit : '게임 종료'
  }
  constructor() {
  }
  async play() {
    let restartGame;
    do {
      this.comNum = this.generateUniqueNumbers(this.numRange,1,9);
      restartGame = await this.playGame();
    } while (restartGame);

    Console.print(this.script.exit);
  }

  async playGame() {
    Console.print(this.script.gameStart);

    let isCorrect = false

    while(!isCorrect) {
      const userNums = await this.getUserInput();

      if (!this.isCorrectNums(userNums)) throw new Error("[ERROR]");

      const {strike,ball} = this.getResult(userNums);

      isCorrect = strike ===3

      this.printResult(strike, ball);

      if (isCorrect)
        return await this.askForRetry();
    }
  }

  async getUserInput() {
    const input = await Console.readLineAsync(this.script.question);
    return [...input].map(i => Number(i));
  }

  printResult(strike, ball) {
    if (strike ===0 && ball ===0)
      Console.print(this.script.noCorrect);
    else
      Console.print(`${ball >0 ? ball + '볼 ' : ''}${strike >0 ? strike + '스트라이크' : ''}`);

    if (strike ===3)
      Console.print(this.script.correct);
  }

  async askForRetry() {
    const input = await Console.readLineAsync(this.script.retry);
    return Number(input) ===1;
  }



  getResult(nums){
    let strike=0, ball=0;

    nums.forEach((num,idx)=>{
      if(num===this.comNum[idx]) strike++;
      else if(this.comNum.includes(num)) ball++;
    })
    return {strike, ball};
  }
  isCorrectNums(nums){
    const isCorrectNums = nums.every(num=>!isNaN(num)&&num!==0)
    const set = new Set(nums)

    return set.size===this.numRange&&isCorrectNums
  }
  generateUniqueNumbers(count, min, max) {
    const numbers = new Set();
    while (numbers.size < count) {
      numbers.add(Random.pickNumberInRange(min, max));
    }
    return [...numbers];
  }
}

export default App;

const app= new App()

app.play()

