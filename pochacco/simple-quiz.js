// シンプルなクイズシステム（直接インポート版）

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let answered = false;
let shuffledQuestions = [];

// Fisher-Yates シャッフルアルゴリズム
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initQuiz() {
    console.log('Initializing quiz with questions:', questions.length);
    
    // タイトルとサブタイトルをquizConfigから動的に設定
    if (typeof quizConfig !== 'undefined' && quizConfig.title) {
        document.getElementById('quizTitle').textContent = quizConfig.title;
        document.getElementById('quizSubtitle').textContent = quizConfig.subtitle;
        document.title = quizConfig.title; // ページタイトルも更新
    } else {
        console.warn('quizConfig not found, using default titles');
    }
    
    // 問題をシャッフル
    shuffledQuestions = shuffleArray(questions.map((q, index) => ({ ...q, originalIndex: index })));
    
    document.getElementById('totalQuestions').textContent = questions.length;
    userAnswers = new Array(questions.length).fill(null).map(() => []);
    showQuestion();
    updateProgress();
}

function showQuestion() {
    const question = shuffledQuestions[currentQuestion];
    const quizContent = document.getElementById('quizContent');
    
    const typeLabels = {
        'single': '単一選択',
        'multiple': '複数選択', 
        'binary': '○×問題'
    };

    const inputType = question.type === 'single' || question.type === 'binary' ? 'radio' : 'checkbox';
    
    // 複数選択問題の場合、正解数を表示
    let answerCountDisplay = '';
    if (question.type === 'multiple') {
        answerCountDisplay = `<div class="answer-count">✓ 正解数: ${question.correctCount}個選択してください</div>`;
    }
    
    quizContent.innerHTML = `
        <div class="question-card">
            <div class="question-header">
                <div class="question-number">問題 ${currentQuestion + 1}</div>
                <div class="question-type ${question.type}">${typeLabels[question.type]}</div>
            </div>
            <div class="question-text">${question.question}</div>
            <div class="question-instruction">${question.instruction}</div>
            ${answerCountDisplay}
            <div class="options">
                ${question.options.map((option, index) => `
                    <div class="option" onclick="selectOption(${index})" data-index="${index}">
                        <div class="${inputType} ${userAnswers[currentQuestion].includes(index) ? 'checked' : ''}"></div>
                        <span>${question.type === 'binary' ? option : String.fromCharCode(65 + index) + '. ' + option}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    updateButtons();
    answered = userAnswers[currentQuestion].length > 0;
}

function selectOption(index) {
    const question = shuffledQuestions[currentQuestion];
    
    if (answered) return;

    if (question.type === 'single' || question.type === 'binary') {
        userAnswers[currentQuestion] = [index];
        
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            option.classList.remove('selected');
            const radio = option.querySelector('.radio');
            if (radio) radio.classList.remove('checked');
        });
        
        const selectedOption = options[index];
        selectedOption.classList.add('selected');
        const radio = selectedOption.querySelector('.radio');
        if (radio) radio.classList.add('checked');
        
        setTimeout(() => submitAnswer(), 300);
        
    } else {
        const currentAnswers = userAnswers[currentQuestion];
        const optionIndex = currentAnswers.indexOf(index);
        
        if (optionIndex > -1) {
            currentAnswers.splice(optionIndex, 1);
        } else {
            currentAnswers.push(index);
        }
        
        const option = document.querySelector(`[data-index="${index}"]`);
        const checkbox = option.querySelector('.checkbox');
        
        if (currentAnswers.includes(index)) {
            option.classList.add('selected');
            checkbox.classList.add('checked');
        } else {
            option.classList.remove('selected');
            checkbox.classList.remove('checked');
        }

        document.getElementById('submitBtn').disabled = userAnswers[currentQuestion].length === 0;
        
        if (question.correctCount && currentAnswers.length === question.correctCount) {
            setTimeout(() => submitAnswer(), 500);
        }
    }
}

function submitAnswer() {
    if (userAnswers[currentQuestion].length === 0) return;

    answered = true;
    const question = shuffledQuestions[currentQuestion];
    const userAnswer = userAnswers[currentQuestion];
    const correctAnswer = question.correct;
    
    const options = document.querySelectorAll('.option');
    
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        
        if (correctAnswer.includes(index)) {
            option.classList.add('correct');
        } else if (userAnswer.includes(index)) {
            option.classList.add('incorrect');
        }
    });

    // 解説を表示
    const questionCard = document.querySelector('.question-card');
    let resultIcon, resultText;
    
    let isCorrect = false;
    if (question.type === 'multiple') {
        const correctCount = userAnswer.filter(ans => correctAnswer.includes(ans)).length;
        const incorrectCount = userAnswer.filter(ans => !correctAnswer.includes(ans)).length;
        isCorrect = correctCount === correctAnswer.length && incorrectCount === 0;
    } else {
        isCorrect = userAnswer.length === 1 && correctAnswer.includes(userAnswer[0]);
    }
    
    if (isCorrect) {
        resultIcon = '✅';
        resultText = '正解！';
    } else {
        resultIcon = '❌';
        resultText = '不正解';
    }
    
    const explanationHtml = `
        <div class="explanation">
            <div class="explanation-title">
                ${resultIcon} ${resultText}
            </div>
            <div class="explanation-content">
                ${question.explanation}
            </div>
        </div>
    `;
    
    questionCard.insertAdjacentHTML('beforeend', explanationHtml);

    // スコア計算
    if (question.type === 'multiple') {
        const correctCount = userAnswer.filter(ans => correctAnswer.includes(ans)).length;
        const incorrectCount = userAnswer.filter(ans => !correctAnswer.includes(ans)).length;
        
        if (correctCount === correctAnswer.length && incorrectCount === 0) {
            score += 1;
        } else if (correctCount > 0 && incorrectCount === 0) {
            score += correctCount / correctAnswer.length;
        }
    } else {
        if (userAnswer.length === 1 && correctAnswer.includes(userAnswer[0])) {
            score += 1;
        }
    }

    document.getElementById('scoreDisplay').textContent = Math.round(score * 10) / 10;
    document.getElementById('submitBtn').disabled = true;
    
    if (currentQuestion < questions.length - 1) {
        document.getElementById('nextBtn').disabled = false;
    } else {
        setTimeout(showResults, 2000);
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        answered = userAnswers[currentQuestion].length > 0;
        showQuestion();
        updateProgress();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        answered = userAnswers[currentQuestion].length > 0;
        showQuestion();
        updateProgress();
    }
}

function updateButtons() {
    document.getElementById('prevBtn').disabled = currentQuestion === 0;
    document.getElementById('nextBtn').disabled = !answered || currentQuestion === questions.length - 1;
    
    const question = shuffledQuestions[currentQuestion];
    const submitBtn = document.getElementById('submitBtn');
    
    if (question.type === 'single' || question.type === 'binary') {
        submitBtn.style.display = 'none';
    } else {
        submitBtn.style.display = 'inline-block';
        submitBtn.disabled = userAnswers[currentQuestion].length === 0 || answered;
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function showResults() {
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    let celebration = '';

    if (percentage >= 90) {
        message = '素晴らしい！完璧に近い成績です！🏆';
        celebration = 'celebration';
    } else if (percentage >= 70) {
        message = 'よくできました！とても良い成績です！🎉';
        celebration = 'celebration';
    } else if (percentage >= 50) {
        message = 'まずまずの成績ですね。頑張りました！👍';
    } else {
        message = '次回はもう少し頑張ってみましょう！💪';
    }

    const typeStats = {
        single: { correct: 0, total: 0 },
        multiple: { correct: 0, total: 0 },
        binary: { correct: 0, total: 0 }
    };

    shuffledQuestions.forEach((question, index) => {
        typeStats[question.type].total++;
        
        if (question.type === 'multiple') {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correct;
            const correctCount = userAnswer.filter(ans => correctAnswer.includes(ans)).length;
            const incorrectCount = userAnswer.filter(ans => !correctAnswer.includes(ans)).length;
            
            if (correctCount === correctAnswer.length && incorrectCount === 0) {
                typeStats[question.type].correct++;
            }
        } else {
            const userAnswer = userAnswers[index];
            if (userAnswer.length === 1 && question.correct.includes(userAnswer[0])) {
                typeStats[question.type].correct++;
            }
        }
    });

    document.getElementById('quizContent').innerHTML = `
        <div class="result-card ${celebration}">
            <div class="result-score">${percentage}%</div>
            <div class="result-message">${message}</div>
            <div style="font-size: 1.2em; color: #7f8c8d; margin-bottom: 20px;">
                総合スコア: ${Math.round(score * 10) / 10} / ${questions.length} 点
            </div>
            
            <div class="result-details">
                <h3 style="margin-bottom: 15px; color: #2c3e50;">問題タイプ別成績</h3>
                ${typeStats.single.total > 0 ? `
                <div class="result-item">
                    <span>単一選択問題</span>
                    <span>${typeStats.single.correct} / ${typeStats.single.total} 問正解</span>
                </div>` : ''}
                ${typeStats.multiple.total > 0 ? `
                <div class="result-item">
                    <span>複数選択問題</span>
                    <span>${typeStats.multiple.correct} / ${typeStats.multiple.total} 問正解</span>
                </div>` : ''}
                ${typeStats.binary.total > 0 ? `
                <div class="result-item">
                    <span>○×問題</span>
                    <span>${typeStats.binary.correct} / ${typeStats.binary.total} 問正解</span>
                </div>` : ''}
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-top: 30px;">
                <button class="btn btn-success" onclick="restartQuiz()">
                    もう一度チャレンジ 🔄
                </button>
                <button class="btn" onclick="window.location.href='index.html'">
                    メイン画面に戻る 🏠
                </button>
            </div>
        </div>
    `;

    document.querySelector('.controls').style.display = 'none';
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = new Array(questions.length).fill(null);
    answered = false;
    
    document.getElementById('scoreDisplay').textContent = '0';
    document.querySelector('.controls').style.display = 'flex';
    
    initQuiz();
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, checking questions and config...');
    
    // quizConfigの存在チェック
    if (typeof quizConfig === 'undefined') {
        console.error('quizConfig not found');
        document.getElementById('quizContent').innerHTML = `
            <div class="error" style="text-align: center; padding: 60px 20px; color: #e74c3c; font-size: 1.2em;">
                ❌ クイズ設定が読み込まれていません。<br>
                quizConfig が定義されているか確認してください。
            </div>
        `;
        return;
    }
    
    // questionsの存在チェック
    if (typeof questions === 'undefined' || !questions || questions.length === 0) {
        console.error('Questions not found or empty');
        document.getElementById('quizContent').innerHTML = `
            <div class="error" style="text-align: center; padding: 60px 20px; color: #e74c3c; font-size: 1.2em;">
                ❌ 問題データが読み込まれていません。<br>
                questions 配列が定義されているか確認してください。
            </div>
        `;
        return;
    }
    
    console.log('Quiz config found:', quizConfig);
    console.log('Questions found:', questions.length);
    initQuiz();
});
