import formatData from "./helper.js";
const loader = document.getElementById("loader");
const container = document.getElementById("container");
const questionText = document.getElementById("question-text");
const answerList = document.querySelectorAll(".answer-text");
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("next-button");
const questionNumber = document.getElementById("question-number");

const CORRECT_BONUS = 10;
const URL =
  "https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple";
let formattedData = null;
let questionIndex = 0;
let correctAnswer = null;
let score = 0;
let isAccepted = true;

const fetchData = async () => {
  const response = await fetch(URL);
  const json = await response.json();
  formattedData = formatData(json.results);
  start();
};

const start = () => {
  showQuestion();
  loader.style.display = "none";
  container.style.display = "block";
};

const showQuestion = () => {
  questionNumber.innerText = questionIndex + 1;
  const { question, answers, correctAnswerIndex } =
    formattedData[questionIndex];
  correctAnswer = correctAnswerIndex;
  console.log(correctAnswer);
  questionText.innerText = question;
  answerList.forEach((button, index) => {
    //ایندکس برای درست نشستن سوال ها در باتن ها
    button.innerText = answers[index];
  });
};

const checkAnswer = (event, index) => {
  //این دو خط برای این است که ما فقط یکبار حق انتخاب جواب داشته باشیم
  if (!isAccepted) return;
  isAccepted = false;
  const isCorrect = index === correctAnswer ? true : false;
  if (isCorrect) {
    event.target.classList.add("correct");
    score += CORRECT_BONUS;
    scoreText.innerText = score;
  } else {
    event.target.classList.add("incorrect");
    answerList[correctAnswer].classList.add("correct");
  }
};

const nextHndler = () => {
  questionIndex++;
  if (questionIndex < formattedData.length) {
    isAccepted = true;
    removeClasses();
    showQuestion();
  } else {
    window.location.assign("/end.html")
  }
};
//حذف کلاس های جواب درست و نادرست
const removeClasses = () => {
  answerList.forEach((button) => (button.className = "answer-text"));
};

window.addEventListener("load", fetchData);
nextButton.addEventListener("click", nextHndler);
//ایندکس برای مقایسه باتن کلیک شده و ایندکس جواب درست سوال
answerList.forEach((button, index) => {
  button.addEventListener("click", (event) => checkAnswer(event, index));
});
