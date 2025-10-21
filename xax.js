// ...existing code...
const levels = [
  { img: '20251021_194124 (2).jpg', options: ['тыквенный суп','хапама','борщ'], correct: 1 },
  { img: '20251021_193132.jpg', options: ['хаш','рис','ариса'], correct: 2 },
  { img: 'IMG-86241b9042a5df893bd957883981ccb2-V.jpg', options: ['голубцы','долма','блинчики'], correct: 1 },
  { img: 'IMG-b4967f5ea4f5ac847b0f0964733367fa-V.jpg', options: ['холодец','желе','оливье'], correct: 0 },
  { img: 'IMG-7d5b344e93d00b8c88291079c7d17ae1-V.jpg', options: ['окрошка','спас','салат'], correct: 0 },
  { img: 'IMG-1a64be7adcd87a65b5ebaec2a1fd8d2a-V.jpg', options: ['хинкали','манты','пельмени'], correct: 2 },
  { img: 'IMG-8303c41d7e7b5852ad5aef6da1c8952c-V.jpg', options: ['блины','сырники','оладушки'], correct: 0 },
  { img: 'IMG-5dd3c42e8b78c868203d76b5aaa44783-V.jpg', options: ['щи','хаш','овощной суп'], correct: 1 },
];

let cur = 0;
const imgEl = document.getElementById('foodImage');
const optionsEl = document.getElementById('options');
const overlay = document.getElementById('overlay');
const resultText = document.getElementById('resultText');
const nextBtn = document.getElementById('nextBtn');
const badge = document.getElementById('badge');
const progressBar = document.getElementById('bar');
const progressText = document.getElementById('progressText');

let locked = false; // блокировка после клика

function renderLevel(i){
  const lvl = levels[i];
  imgEl.src = lvl.img;
  optionsEl.innerHTML = '';
  // сброс стиля badge/кнопки (чтобы не сохранялись цвета)
  badge.style.background = '';
  nextBtn.style.background = '';
  nextBtn.style.color = '';

  // обновить прогресс
  updateProgress();

  lvl.options.forEach((opt, idx) => {
    const b = document.createElement('button');
    b.className = 'option';
    b.type = 'button';
    b.textContent = opt;
    b.onclick = ()=> choose(idx, b);
    // сброс стилей/атрибутов (на случай, если кнопки реиспользуются)
    b.style.opacity = 0;
    b.classList.remove('disabled','correct','wrong');
    optionsEl.appendChild(b);
    // небольшая анимация появления
    b.style.transitionDelay = (idx * 80) + 'ms';
    requestAnimationFrame(()=> b.style.opacity = 1);
  });

  // в случае если картинка не найдена — показать заглушку
  imgEl.onerror = ()=> { imgEl.src = 'images/placeholder.png' }
}

function choose(idx, btnEl){
  if(locked) return;
  locked = true;

  const lvl = levels[cur];
  // временно запретим повторные клики
  const all = Array.from(optionsEl.children);
  all.forEach(o => o.classList.add('disabled'));

  if(idx === lvl.correct){
    // правильный — подсветка выбранного варианта (необязательно), показываем overlay с зелёными цветами
    btnEl.classList.add('correct');
    showOverlay(true);
  } else {
    // неправильный — не подсвечиваем варианты (по запросу), только показываем overlay с красными цветами
    showOverlay(false);
  }
}

function showOverlay(isWin){
  const res = overlay.querySelector('.result');

  if(isWin){
    // если это последний уровень — сообщение и кнопка для перезапуска
    if(cur === levels.length - 1){
      resultText.textContent = 'Все уровни пройдены!';
      nextBtn.textContent = 'Начать заново';
    } else {
      resultText.textContent = 'Правильно!';
      nextBtn.textContent = 'Следующий уровень';
    }
    // зелёная палитра для badge и кнопки
    badge.style.background = 'linear-gradient(135deg,#b7765a,#4e3b33)';
    nextBtn.style.background = '#4e3b33';
    nextBtn.style.color = '#fff';
    res.classList.add('win');
  } else {
    resultText.textContent = 'Неправильно.';
    nextBtn.textContent = 'Попробовать ещё';
    // красная палитра для badge и кнопки
    badge.style.background = 'linear-gradient(135deg, rgb(255 85 85), rgb(28 0 0))';
    nextBtn.style.background = 'linear-gradient(135deg, rgb(255 85 85), rgb(28 0 0))';
    nextBtn.style.color = '#fff';
    res.classList.remove('win');
  }

  overlay.classList.remove('hidden');
}

nextBtn.onclick = ()=>{
  overlay.classList.add('hidden');

  // поведение по тексту кнопки:
  const action = nextBtn.textContent;
  if(action === 'Следующий уровень'){
    cur++;
    if(cur >= levels.length) cur = 0; // на всякий случай, но нормальной логики уже handled
  } else if(action === 'Начать заново'){
    cur = 0;
  } // 'Попробовать ещё' — оставляем тот же уровень

  // сброс блокировки и перерендер уровня
  locked = false;
  renderLevel(cur);
};

function updateProgress(){
  const percent = Math.round((cur / (levels.length - 1)) * 100);
  progressBar.style.width = percent + '%';
  progressText.textContent = `Уровень ${cur + 1} / ${levels.length}`;
}

// инициализация
renderLevel(cur);
// ...existing code...