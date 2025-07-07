// グローバル変数
let quizData = [];
let userAnswers = [];

// 配列をシャッフルする関数
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// クイズを初期化する関数
function initializeQuiz() {
    quizData = shuffleArray(originalQuizData);
    userAnswers = new Array(quizData.length).fill(null);
}

function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';

    quizData.forEach((item, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-card';
        questionDiv.innerHTML = `
            <div class="question-number">問題 ${index + 1}</div>
            <div class="question-text">${item.q}</div>
            <div class="choices">
                <button class="choice-btn" onclick="selectAnswer(${index}, true)">○</button>
                <button class="choice-btn" onclick="selectAnswer(${index}, false)">×</button>
            </div>
            <div class="result" id="result-${index}"></div>
        `;
        container.appendChild(questionDiv);
    });
    updateScore();
}

function selectAnswer(questionIndex, userChoice) {
    if (userAnswers[questionIndex] !== null) return;

    userAnswers[questionIndex] = userChoice;
    const isCorrect = userChoice === quizData[questionIndex].a;
    
    const questionCard = document.querySelectorAll('.question-card')[questionIndex];
    const buttons = questionCard.querySelectorAll('.choice-btn');
    const resultDiv = document.getElementById(`result-${questionIndex}`);

    buttons.forEach((btn, btnIndex) => {
        const btnValue = btnIndex === 0;
        btn.disabled = true;
        
        if (btnValue === userChoice) {
            btn.classList.add(isCorrect ? 'correct' : 'incorrect');
        } else if (btnValue === quizData[questionIndex].a) {
            btn.classList.add('correct');
        }
    });

    const explanation = quizData[questionIndex].e ? 
        `<div class="explanation">${quizData[questionIndex].e}</div>` : '';
    
    const aiExplanation = quizData[questionIndex].ai ? 
        `<div class="explanation"><strong>＜AI解説＞</strong><br>${quizData[questionIndex].ai}</div>` : '';
    
    const goroExplanation = quizData[questionIndex].goro ? 
        `<div class="explanation"><strong>＜語呂合わせ＞</strong><br>${quizData[questionIndex].goro}</div>` : '';
    
    resultDiv.innerHTML = `
        ${isCorrect ? '✓ 正解' : '✗ 不正解'}
        ${explanation}
        ${aiExplanation}
        ${goroExplanation}
    `;
    resultDiv.className = `result ${isCorrect ? 'correct' : 'incorrect'} show`;

    updateScore();
    updateProgress();
}

function updateScore() {
    const answered = userAnswers.filter(a => a !== null).length;
    const correct = userAnswers.filter((a, i) => a === quizData[i].a).length;
    const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    document.getElementById('scoreDisplay').textContent = `${correct}/${answered} (${percentage}%)`;
}

function updateProgress() {
    const answered = userAnswers.filter(a => a !== null).length;
    const percentage = (answered / quizData.length) * 100;
    document.getElementById('progressBar').style.width = percentage + '%';
}

function resetQuiz() {
    initializeQuiz();
    renderQuestions();
    updateProgress();
}

// 初期化（DOMContentLoadedイベントで実行）
document.addEventListener('DOMContentLoaded', function() {
    initializeQuiz();
    renderQuestions();
});