const translations = {
    zh: {
        title: "数独游戏",
        newGame: "新游戏",
        check: "检查答案",
        solve: "显示答案",
        easy: "简单",
        medium: "中等",
        hard: "困难",
        timer: "时间: ",
        // 添加更多翻译
    },
    en: {
        title: "Sudoku Game",
        newGame: "New Game",
        check: "Check Answer",
        solve: "Show Answer",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        timer: "Time: ",
        // 添加更多翻译
    },
    ja: {
        title: "数独ゲーム",
        newGame: "新ゲーム",
        check: "解答チェック",
        solve: "解答表示",
        easy: "簡単",
        medium: "普通",
        hard: "難しい",
        timer: "時間: ",
        // 添加更多翻译
    }
};

function changeLanguage(lang) {
    document.documentElement.lang = lang;
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// 初始化语言
document.getElementById('language').addEventListener('change', (e) => {
    changeLanguage(e.target.value);
});

// 根据浏览器语言自动设置
const userLang = navigator.language || navigator.userLanguage;
const defaultLang = userLang.startsWith('zh') ? 'zh' : 
                    userLang.startsWith('ja') ? 'ja' : 'en';
document.getElementById('language').value = defaultLang;
changeLanguage(defaultLang);