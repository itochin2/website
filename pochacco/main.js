// メイン画面の処理

document.addEventListener('DOMContentLoaded', function() {
    loadQuizList();
});

function loadQuizList() {
    const quizGrid = document.getElementById('quizGrid');
    const totalQuizzesElement = document.getElementById('totalQuizzes');
    
    // ローディング表示
    quizGrid.innerHTML = '<div class="loading">クイズ一覧を読み込み中...</div>';
    
    try {
        // クイズカードを生成
        const quizCards = quizList.map(quiz => createQuizCard(quiz)).join('');
        quizGrid.innerHTML = quizCards;
        
        // 総クイズ数を表示
        totalQuizzesElement.textContent = quizList.length;
        
        // カードにクリックイベントを追加
        addCardClickEvents();
        
    } catch (error) {
        console.error('クイズリストの読み込みに失敗しました:', error);
        quizGrid.innerHTML = `
            <div class="error">
                ❌ クイズリストの読み込みに失敗しました。<br>
                quiz-list.js ファイルを確認してください。
            </div>
        `;
    }
}

function createQuizCard(quiz) {
    const difficultyClass = `difficulty-${quiz.difficulty}`;
    const difficultyText = {
        'easy': '初級',
        'medium': '中級', 
        'hard': '上級'
    }[quiz.difficulty] || '不明';
    
    const typeLabels = {
        'single': '単一選択',
        'multiple': '複数選択',
        'binary': '○×問題'
    };
    
    const typeBadges = quiz.types.map(type => {
        const typeClass = `type-${type}`;
        return `<span class="type-badge ${typeClass}">${typeLabels[type]}</span>`;
    }).join('');
    
    return `
        <div class="quiz-card" data-quiz-id="${quiz.id}" data-quiz-file="${quiz.file}">
            <div class="quiz-icon">${quiz.icon}</div>
            <h3 class="quiz-title">${quiz.title}</h3>
            <p class="quiz-description">${quiz.description}</p>
            
            <div class="quiz-stats">
                <div class="stat-item">
                    <span class="stat-number">${quiz.questionCount}</span>
                    <span class="stat-label">問題</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${quiz.category}</span>
                    <span class="stat-label">カテゴリ</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number ${difficultyClass}">${difficultyText}</span>
                    <span class="stat-label">難易度</span>
                </div>
            </div>
            
            <div class="quiz-types">
                ${typeBadges}
            </div>
            
            <button class="start-button" onclick="startQuiz('${quiz.id}', '${quiz.file}')">
                ${quiz.title}を開始 🚀
            </button>
        </div>
    `;
}

function addCardClickEvents() {
    const quizCards = document.querySelectorAll('.quiz-card');
    
    quizCards.forEach(card => {
        // ボタン以外の部分をクリックした時もクイズを開始
        card.addEventListener('click', function(e) {
            // ボタンをクリックした場合は重複処理を避ける
            if (e.target.classList.contains('start-button')) {
                return;
            }
            
            const quizId = this.dataset.quizId;
            const quizFile = this.dataset.quizFile;
            startQuiz(quizId, quizFile);
        });
        
        // ホバー効果の強化
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function startQuiz(quizId, quizFile) {
    try {
        // クイズファイルが存在するかチェック（実際の実装では省略可能）
        console.log(`Starting quiz: ${quizId}`);
        console.log(`Quiz file: ${quizFile}`);
        
        // クエリストリングを使わずに直接ページ名で移動
        // 各クイズ専用のHTMLページに移動
        const quizPageName = quizId + '.html';
        window.location.href = quizPageName;
        
    } catch (error) {
        console.error('クイズの開始に失敗しました:', error);
        alert('クイズページが見つかりません。ファイルを確認してください。');
    }
}

// 検索・フィルター機能（将来の拡張用）
function filterQuizzes(category = 'all', difficulty = 'all') {
    const filteredQuizzes = quizList.filter(quiz => {
        const categoryMatch = category === 'all' || quiz.category === category;
        const difficultyMatch = difficulty === 'all' || quiz.difficulty === difficulty;
        return categoryMatch && difficultyMatch;
    });
    
    const quizGrid = document.getElementById('quizGrid');
    const quizCards = filteredQuizzes.map(quiz => createQuizCard(quiz)).join('');
    quizGrid.innerHTML = quizCards;
    
    addCardClickEvents();
    
    document.getElementById('totalQuizzes').textContent = filteredQuizzes.length;
}

// カテゴリ一覧を取得（将来の拡張用）
function getCategories() {
    return [...new Set(quizList.map(quiz => quiz.category))];
}

// 難易度一覧を取得（将来の拡張用）
function getDifficulties() {
    return [...new Set(quizList.map(quiz => quiz.difficulty))];
}