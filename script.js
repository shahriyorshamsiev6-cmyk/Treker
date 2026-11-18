
    // ПОЛНЫЙ КАТАЛОГ ПРИВЫЧЕК СО СКРИНШОТОВ
    const PRESETS = [
      { id: 'p1', icon: '💧', title: 'Пить воду', sub: '8 стаканов в день', time: '09:00' },
      { id: 'p2', icon: '🌙', title: 'Ранний сон', sub: 'В кровати до 23:00', time: '22:45' },
      { id: 'p3', icon: '💊', title: 'Принять витамины', sub: 'Ежедневные добавки', time: '08:30' },
      { id: 'p4', icon: '🚫', title: 'Без алкоголя', sub: 'Оставайтесь трезвым сегодня', time: '' },
      { id: 'p5', icon: '🏃', title: 'Упражнения', sub: 'Тренировка 30 минут', time: '17:00' },
      { id: 'p6', icon: '👟', title: '10 000 шагов', sub: '10 000 шагов ежедневно', time: '19:00' },
      { id: 'p7', icon: '🧘', title: 'Растяжка', sub: 'Растяжка 10 минут', time: '07:30' },
      { id: 'p8', icon: '💪', title: 'Отжимания', sub: '30 отжиманий в день', time: '18:00' },
      { id: 'p9', icon: '🧠', title: 'Глубокая работа', sub: '90 минут концентрации', time: '10:00' },
      { id: 'p10', icon: '📋', title: 'Планировать завтра', sub: 'Подготовьте следующий день', time: '21:30' },
      { id: 'p11', icon: '📵', title: 'Без соцсетей', sub: 'Не заходите в ленту', time: '' },
      { id: 'p12', icon: '📥', title: 'Пустой инбокс', sub: 'Очистите почту', time: '16:00' },
      { id: 'p13', icon: '📘', title: 'Чтение', sub: '20 страниц в день', time: '21:00' },
      { id: 'p14', icon: '🌐', title: 'Учить язык', sub: '15 минут практики', time: '15:00' },
      { id: 'p15', icon: '▶️', title: 'Онлайн-курс', sub: '30 минут обучения', time: '16:30' },
      { id: 'p16', icon: '✍️', title: 'Вести дневник', sub: 'Подведите итоги дня', time: '22:00' },
      { id: 'p17', icon: '🧘‍♂️', title: 'Медитация', sub: 'Медитация 10 минут', time: '08:00' },
      { id: 'p18', icon: '💜', title: 'Благодарность', sub: 'Запишите 3 вещи, за которые благодарны', time: '22:15' },
      { id: 'p19', icon: '🌬️', title: 'Глубокое дыхание', sub: 'Дыхательное упражнение 5 мин', time: '' },
      { id: 'p20', icon: '🔌', title: 'Цифровой детокс', sub: '1 час без экрана', time: '22:00' },
      { id: 'p21', icon: '🥗', title: 'Есть овощи', sub: '3 порции овощей', time: '' },
      { id: 'p22', icon: '🍔', title: 'Без фастфуда', sub: 'Избегайте обработанной пищи', time: '' },
      { id: 'p23', icon: '🍳', title: 'Готовить дома', sub: 'Домашняя еда', time: '' },
      { id: 'p24', icon: '☕', title: 'Без сахара', sub: 'Откажитесь от добавленного сахара', time: '' },
      { id: 'p25', icon: '📞', title: 'Позвонить семье', sub: 'Поддерживайте связь', time: '19:30' },
      { id: 'p26', icon: '😊', title: 'Сделать комплимент', sub: 'Распространяйте позитив', time: '' },
      { id: 'p27', icon: '👨‍👩‍👦', title: 'Качественное время', sub: '30 минут с близкими', time: '20:00' },
      { id: 'p28', icon: '🎨', title: 'Рисовать', sub: '15 минут творчества', time: '' },
      { id: 'p29', icon: '📝', title: 'Писать', sub: '500 слов в день', time: '' },
      { id: 'p30', icon: '🎵', title: 'Играть музыку', sub: '20 минут практики', time: '' },
      { id: 'p31', icon: '📷', title: 'Фотография', sub: 'Сделайте отличный снимок', time: '' },
      { id: 'p32', icon: '🛏️', title: 'Заправить кровать', sub: 'Начните день правильно', time: '07:15' },
      { id: 'p33', icon: '✨', title: 'Убраться', sub: '10 минут уборки', time: '18:30' },
      { id: 'p34', icon: '🧴', title: 'Уход за кожей', sub: 'Утренний и вечерний уход', time: '07:45' }
    ];

    // СОСТОЯНИЕ ПРИЛОЖЕНИЯ (АВТОСОХРАНЕНИЕ В LOCALSTORAGE)
    let appState = JSON.parse(localStorage.getItem('apex_tracker_data')) || {
      onboarded: false,
      habits: [],
      completedDates: {}, // { '2026-11-17': ['p1', 'p2'] }
      totalCompletions: 0,
      profileName: '',
      alarmSound: 'beep'
    };

    let selectedPresetIds = new Set(appState.habits.map(h => h.id));
    let alarmInterval = null;
    let triggeredMinute = '';

    function saveState() {
      localStorage.setItem('apex_tracker_data', JSON.stringify(appState));
    }

    function getTodayKey() {
      return new Date().toISOString().split('T')[0];
    }

    // ИНИЦИАЛИЗАЦИЯ
    function init() {
      if (!appState.onboarded || appState.habits.length === 0) {
        renderPresets();
        document.getElementById('onboardingView').classList.remove('hidden');
      } else {
        showMainApp();
      }
      startClockAndAlarms();
    }

    // ОНБОРДИНГ
    function renderPresets() {
      const container = document.getElementById('presetList');
      container.innerHTML = '';
      PRESETS.forEach(item => {
        const isSel = selectedPresetIds.has(item.id);
        const div = document.createElement('div');
        div.className = `preset-item ${isSel ? 'selected' : ''}`;
        div.onclick = () => {
          if (selectedPresetIds.has(item.id)) selectedPresetIds.delete(item.id);
          else selectedPresetIds.add(item.id);
          renderPresets();
        };
        div.innerHTML = `
          <div class="preset-left">
            <div class="habit-icon-box">${item.icon}</div>
            <div class="preset-info">
              <h4>${item.title}</h4>
              <span>${item.sub}</span>
            </div>
          </div>
          <div class="check-circle">${isSel ? '✓' : '+'}</div>
        `;
        container.appendChild(div);
      });
    }

    function finishOnboarding() {
      const existingMap = new Map(appState.habits.map(h => [h.id, h]));
      const updatedHabits = [];

      selectedPresetIds.forEach(id => {
        if (existingMap.has(id)) {
          updatedHabits.push(existingMap.get(id));
        } else {
          const preset = PRESETS.find(p => p.id === id);
          if (preset) updatedHabits.push({ ...preset });
        }
      });

      // Сохраняем также пользовательские привычки, созданные вручную
      appState.habits.forEach(h => {
        if (h.id.startsWith('custom_')) updatedHabits.push(h);
      });

      if (updatedHabits.length === 0) {
        alert('Выбери хотя бы одну привычку!');
        return;
      }

      appState.habits = updatedHabits;
      appState.onboarded = true;
      saveState();
      showMainApp();
    }

    function openOnboardingAgain() {
      selectedPresetIds = new Set(appState.habits.map(h => h.id));
      document.getElementById('mainAppView').classList.add('hidden');
      document.getElementById('bottomNav').classList.add('hidden');
      document.getElementById('onboardingView').classList.remove('hidden');
      renderPresets();
    }

    // ГЛАВНЫЙ ЭКРАН
    function showMainApp() {
      document.getElementById('onboardingView').classList.add('hidden');
      document.getElementById('mainAppView').classList.remove('hidden');
      document.getElementById('bottomNav').classList.remove('hidden');

      document.getElementById('profileNameInput').value = appState.profileName || '';
      document.getElementById('alarmSoundSelect').value = appState.alarmSound || 'beep';

      renderToday();
      renderCalendar();
      renderAnalytics();
      renderRewards();
    }

    function renderToday() {
      const list = document.getElementById('todayHabitsList');
      list.innerHTML = '';
      const today = getTodayKey();
      const doneList = appState.completedDates[today] || [];

      appState.habits.forEach(habit => {
        const isDone = doneList.includes(habit.id);
        const card = document.createElement('div');
        card.className = `habit-card ${isDone ? 'done' : ''}`;
        card.innerHTML = `
          <div class="preset-left" style="cursor:pointer; flex:1;" onclick="toggleHabit('${habit.id}')">
            <div class="habit-icon-box">${habit.icon}</div>
            <div class="preset-info">
              <h4>${habit.title}</h4>
              <span>${habit.sub}</span>
              <div class="habit-meta">
                <span class="alarm-tag" onclick="event.stopPropagation(); editAlarmTime('${habit.id}')">
                  ⏰ ${habit.time ? habit.time : 'Задать время'}
                </span>
              </div>
            </div>
          </div>
          <div class="habit-actions">
            <div class="check-circle" style="cursor:pointer; ${isDone ? 'background:var(--accent-green);border-color:var(--accent-green);color:#fff;' : ''}" onclick="toggleHabit('${habit.id}')">
              ${isDone ? '✓' : ''}
            </div>
            <button class="delete-btn" title="Удалить" onclick="deleteHabit('${habit.id}')">✕</button>
          </div>
        `;
        list.appendChild(card);
      });

      const total = appState.habits.length;
      const doneCount = doneList.filter(id => appState.habits.some(h => h.id === id)).length;
      const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

      document.getElementById('progressText').innerText = `${percent}% (${doneCount}/${total})`;
      document.getElementById('progressFill').style.width = `${percent}%`;
    }

    function toggleHabit(id) {
      const today = getTodayKey();
      if (!appState.completedDates[today]) appState.completedDates[today] = [];
      const idx = appState.completedDates[today].indexOf(id);

      if (idx === -1) {
        appState.completedDates[today].push(id);
        appState.totalCompletions++;
      } else {
        appState.completedDates[today].splice(idx, 1);
        appState.totalCompletions = Math.max(0, appState.totalCompletions - 1);
      }

      saveState();
      renderToday();
      renderCalendar();
      renderAnalytics();
      renderRewards();
    }

    function deleteHabit(id) {
      appState.habits = appState.habits.filter(h => h.id !== id);
      saveState();
      renderToday();
      renderAnalytics();
    }

    function editAlarmTime(id) {
      const habit = appState.habits.find(h => h.id === id);
      if (!habit) return;
      const newTime = prompt(`Введи время будильника для "${habit.title}" в формате ЧЧ:ММ (например, 08:30). Оставь пустым, чтобы убрать:`, habit.time || '');
      if (newTime !== null) {
        habit.time = newTime.trim();
        saveState();
        renderToday();
      }
    }

    // МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ПРИВЫЧКИ
    function openCustomModal() {
      document.getElementById('customModal').style.display = 'flex';
    }
    function closeCustomModal() {
      document.getElementById('customModal').style.display = 'none';
    }
    function saveCustomHabit() {
      const title = document.getElementById('newHabitTitle').value.trim();
      const sub = document.getElementById('newHabitSub').value.trim() || 'Ежедневная цель';
      const icon = document.getElementById('newHabitIcon').value.trim() || '🔥';
      const time = document.getElementById('newHabitTime').value;

      if (!title) {
        alert('Введи название привычки!');
        return;
      }

      const newHabit = {
        id: 'custom_' + Date.now(),
        title,
        sub,
        icon,
        time
      };

      appState.habits.push(newHabit);
      appState.onboarded = true;
      saveState();

      document.getElementById('newHabitTitle').value = '';
      document.getElementById('newHabitSub').value = '';
      document.getElementById('newHabitTime').value = '';
      closeCustomModal();
      showMainApp();
    }

    // КАЛЕНДАРЬ, АНАЛИТИКА, НАГРАДЫ
    function renderCalendar() {
      const grid = document.getElementById('calendarGrid');
      grid.innerHTML = '';
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const todayDate = now.getDate();

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const doneCount = (appState.completedDates[dateStr] || []).length;
        const isAllDone = appState.habits.length > 0 && doneCount >= appState.habits.length;

        const cell = document.createElement('div');
        cell.className = `cal-day ${d === todayDate ? 'active-day' : ''} ${isAllDone ? 'completed-day' : ''}`;
        cell.innerText = d;
        grid.appendChild(cell);
      }
    }

    function renderAnalytics() {
      const activeDays = Object.values(appState.completedDates).filter(arr => arr.length > 0).length;
      document.getElementById('statStreak').innerText = `${activeDays} дн.`;
      document.getElementById('statTotal').innerText = appState.totalCompletions;
      document.getElementById('statActive').innerText = appState.habits.length;

      let lvl = 'Новичок';
      if (appState.totalCompletions >= 50) lvl = 'Мастер режима';
      else if (appState.totalCompletions >= 15) lvl = 'Железная воля';
      else if (appState.totalCompletions >= 5) lvl = 'На старте';
      document.getElementById('statLevel').innerText = lvl;
    }

    function renderRewards() {
      const badges = [
        { icon: '🥉', title: 'Первый шаг', desc: 'Выполни первую привычку', unlocked: appState.totalCompletions >= 1 },
        { icon: '🔥', title: 'Набираем темп', desc: 'Выполни 10 задач', unlocked: appState.totalCompletions >= 10 },
        { icon: '⚡', title: 'Машина дисциплины', desc: 'Выполни 30 задач', unlocked: appState.totalCompletions >= 30 },
        { icon: '👑', title: 'Легенда APEX', desc: 'Выполни 100 задач', unlocked: appState.totalCompletions >= 100 }
      ];

      const container = document.getElementById('rewardsList');
      container.innerHTML = '';
      badges.forEach(b => {
        container.innerHTML += `
          <div class="badge-card ${b.unlocked ? '' : 'locked'}">
            <div class="habit-icon-box" style="font-size:24px;">${b.icon}</div>
            <div>
              <h4>${b.title} ${b.unlocked ? '✅' : '🔒'}</h4>
              <span style="font-size:13px; color:var(--text-muted);">${b.desc}</span>
            </div>
          </div>
        `;
      });
    }

    function saveProfile() {
      appState.profileName = document.getElementById('profileNameInput').value;
      appState.alarmSound = document.getElementById('alarmSoundSelect').value;
      saveState();
    }

    function switchTab(tabId, title, btn) {
      ['today', 'calendar', 'analytics', 'rewards', 'profile'].forEach(id => {
        document.getElementById('tab-' + id).classList.add('hidden');
      });
      document.getElementById('tab-' + tabId).classList.remove('hidden');
      document.getElementById('pageTitle').innerText = title;

      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    // ВСТРОЕННЫЙ БУДИЛЬНИК И СИНТЕЗАТОР ЗВУКА (WEB AUDIO API)
    function playTone() {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const type = appState.alarmSound || 'beep';
      if (type === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Ре
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
      } else if (type === 'arcade') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
      }

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }

    function testAlarmSound() {
      playTone();
    }

    function triggerAlarm(habitTitle) {
      document.getElementById('alarmPopupText').innerText = `Пора выполнить: ${habitTitle}`;
      document.getElementById('alarmPopup').style.display = 'block';
      playTone();
      clearInterval(alarmInterval);
      alarmInterval = setInterval(playTone, 1500);
    }

    function stopAlarm() {
      clearInterval(alarmInterval);
      document.getElementById('alarmPopup').style.display = 'none';
    }

    function startClockAndAlarms() {
      setInterval(() => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const currentHM = `${hh}:${mm}`;

        document.getElementById('liveClock').innerText = `${currentHM}:${ss}`;

        if (ss === '00' && triggeredMinute !== currentHM) {
          const dueHabit = appState.habits.find(h => h.time === currentHM);
          if (dueHabit) {
            triggeredMinute = currentHM;
            triggerAlarm(dueHabit.title);
          }
        }
      }, 1000);
    }

    init();