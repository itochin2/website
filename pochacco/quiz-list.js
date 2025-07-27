// クイズリスト設定ファイル
// 新しいクイズを追加するには、このファイルのquizList配列に情報を追加してください

const quizList = [
    {
        id: 'general-knowledge',
        title: '一般知識クイズ',
        description: 'さまざまな分野の基礎知識を問う総合問題です。歴史、地理、科学など幅広いジャンルから出題されます。',
        icon: '🧠',
        difficulty: 'medium',
        questionCount: 12,
        file: 'C:/Users/itoch/Downloads/general-knowledge.js',
        types: ['single', 'multiple', 'binary'],
        category: '総合'
    },
    {
        id: 'peripheral-nervous-system',
        title: '🧠 生理解剖学I 第10回 末梢神経',
        description: '生理解剖学I 第10回 末梢神経 (配布用)  250623から出題されます。',
        icon: '🧠',
        difficulty: 'hard',
        questionCount: 30,
        file: 'peripheral-nervous-system.js',
        types: ['single', 'multiple', 'binary'],
        category: '薬学・医学'
    },
    {
        id: 'peripheral-nervous-system2',
        title: '👁生理解剖学I 第11回 感覚器① 皮膚と感覚',
        description: '生理解剖学I 第11回 感覚器① (配布用) 250701から出題されます。',
        icon: '👁',
        difficulty: 'hard',
        questionCount: 32,
        file: 'peripheral-nervous-system2.js',
        types: ['single', 'multiple', 'binary'],
        category: '薬学・医学'
    },
    {
        id: 'peripheral-nervous-system3',
        title: '👁️生理解剖学I 第12回 感覚器② 特殊感覚',
        description: '生理解剖学I 第12回 感覚器②(配布用) 250708から出題されます。',
        icon: '👁️',
        difficulty: 'hard',
        questionCount: 31,
        file: 'peripheral-nervous-system3.js',
        types: ['single', 'multiple', 'binary'],
        category: '薬学・医学'
    },


];

/*
================================================================================
                            クイズ追加ガイド
================================================================================

新しいクイズを追加するには、上記のquizList配列に以下の形式で追加してください：

{
    id: 'unique-quiz-id',              // 一意のID（英数字とハイフンのみ）
    title: 'クイズのタイトル',           // 表示されるタイトル
    description: 'クイズの説明文...',    // クイズの内容説明
    icon: '🎯',                        // アイコン（絵文字）
    difficulty: 'easy',               // 難易度: 'easy', 'medium', 'hard'
    questionCount: 10,                // 問題数
    file: 'questions/filename.js',   // 問題ファイルのパス
    types: ['single', 'multiple'],   // 含まれる問題形式
    category: 'カテゴリ名'             // カテゴリ
}

問題形式の指定:
- 'single': 単一選択問題
- 'multiple': 複数選択問題  
- 'binary': ○×問題

難易度の目安:
- 'easy': 初級レベル（中学生程度）
- 'medium': 中級レベル（高校生程度）
- 'hard': 上級レベル（大学生・専門レベル）

================================================================================
*/
