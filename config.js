// ============================================
// Alushe システム共通設定
// 会社名・店舗・役職・権限・接続先はここだけで管理する
// 他社導入時はこのファイルを差し替える
// ============================================
const APP_CONFIG = {
  companyName: 'Alushe',

  // Supabase接続先（全ページ共通）
  supabaseUrl: 'https://kxuzdkwbmxfinmmqqkep.supabase.co',
  supabaseAnon: 'sb_publishable_2JQdW4ZrTUHo8vDBsF829w_82lPC_53',

  // 全店に所属する人（代表・管理者）の店舗値
  allStoresValue: '全店共通',

  // 店舗グループ（表示順）
  storeGroups: [
    { id: 'hair', label: 'ヘアサロン' },
    { id: 'eye',  label: 'まつげ・ネイル' },
  ],

  // 店舗一覧（この順番で左から表示）
  // id = DBに保存される値 / label = 画面に表示する名前
  stores: [
    { id: '新宿',           label: '新宿',           group: 'hair' },
    { id: '原宿',           label: '原宿',           group: 'hair' },
    { id: '秋葉原',         label: '秋葉原',         group: 'hair' },
    { id: '錦糸町',         label: '錦糸町',         group: 'hair' },
    { id: 'メルティエ',     label: 'メルティエ',     group: 'hair' },
    { id: 'elua',           label: '錦糸町elua',     group: 'hair' },
    { id: '平井',           label: '平井',           group: 'hair' },
    { id: 'アルーシェ船堀', label: 'アルーシェ船堀', group: 'hair' },
    { id: '船堀スカイ',     label: '船堀スカイ',     group: 'hair' },
    { id: '心斎橋',         label: '心斎橋',         group: 'hair' },
    // まつげ・ネイル系は店舗名が確定したらここに追加（group: 'eye'）
  ],

  // 役職（上位から順に。スタッフ一覧・数値管理の役職順に使う）
  positions: [
    '代表取締役', 'FCオーナー', 'マネージャー', '店長',
    '副店長', 'スタイリスト', 'アシスタント', 'アルバイト', '管理者',
  ],

  // 新規登録で本人が選べる役職
  selfRegisterPositions: ['副店長', 'スタイリスト', 'アシスタント', 'アルバイト'],

  // 権限（役職名で判定）
  roles: {
    staffEditor:   ['代表取締役', '管理者', 'FCオーナー', 'マネージャー', '店長'],             // 人材マスターの編集
    meetingViewer: ['代表取締役', '管理者', 'FCオーナー', 'マネージャー', '店長'],             // 会議報告の閲覧
    currEditor:    ['代表取締役', '管理者', 'FCオーナー', 'マネージャー', '店長', '副店長', 'スタイリスト'], // カリキュラム編集
    currTarget:    ['アシスタント', 'アルバイト'],                                          // カリキュラム対象者
    teacher:       ['店長', '副店長', 'スタイリスト'],                                      // 担当講師の候補
  },

  // メニュー（ホーム画面のカードと上部タブはこの順番で表示）
  // access: 'all' = ログインした全員 / それ以外は roles のキー名
  menus: [
    { id: 'sales',       icon: '📊', name: '数値管理',         url: 'sales.html',            access: 'all' },
    { id: 'meeting',     icon: '📝', name: '会議報告',         url: 'meeting.html',          access: 'meetingViewer' },
    { id: 'evaluation',  icon: '⭐', name: '人事評価制度',     url: 'evaluation.html',       access: 'all' },
    { id: 'schedule',    icon: '📆', name: '年間スケジュール', url: 'schedule.html',         access: 'all' },
    { id: 'appointment', icon: '📅', name: '次回予約管理',     url: 'next-reservation.html', access: 'all', comingSoon: true },
    { id: 'staff',       icon: '👥', name: '人材マスター',     page: 'staff',                access: 'staffEditor' },
  ],
};

// ===== 共通ヘルパー =====
function storeLabel(id) {
  if (id === APP_CONFIG.allStoresValue) return '全店共通';
  const s = APP_CONFIG.stores.find(function (x) { return x.id === id; });
  return s ? s.label : (id || '');
}

// 店舗の並び順（全店共通が先頭、未登録の店舗は末尾）
function storeOrder(id) {
  if (id === APP_CONFIG.allStoresValue) return -1;
  const i = APP_CONFIG.stores.findIndex(function (x) { return x.id === id; });
  return i === -1 ? 999 : i;
}

// 店舗の<option>を生成（withAll=trueで先頭に「すべての店舗」）
function storeOptionsHtml(selected, withAll) {
  let html = withAll ? '<option value="">すべての店舗</option>' : '';
  APP_CONFIG.storeGroups.forEach(function (g) {
    const list = APP_CONFIG.stores.filter(function (s) { return s.group === g.id; });
    if (!list.length) return;
    html += '<optgroup label="' + g.label + '">';
    list.forEach(function (s) {
      html += '<option value="' + s.id + '"' + (s.id === selected ? ' selected' : '') + '>' + s.label + '</option>';
    });
    html += '</optgroup>';
  });
  return html;
}

// 役職の<option>を生成（list省略時は全役職）
function positionOptionsHtml(selected, list) {
  const src = list || APP_CONFIG.positions;
  return src.map(function (p) {
    return '<option value="' + p + '"' + (p === selected ? ' selected' : '') + '>' + p + '</option>';
  }).join('');
}

// 役職の並び順
function positionOrder(p) {
  const i = APP_CONFIG.positions.indexOf(p || '');
  return i === -1 ? 999 : i;
}

// ===== メニュー（全ページ共通） =====
function canAccessMenu(m, me) {
  if (!me || m.comingSoon) return false;
  if (m.access === 'all') return true;
  return (APP_CONFIG.roles[m.access] || []).includes(me.position);
}

// 上部タブのHTML（activeId: 'home' またはメニューのid）
function appNavHtml(activeId, me) {
  let h = '<button class="nav-tab' + (activeId === 'home' ? ' active' : '') + '" onclick="goNav(\'home\')">🏠 ホーム</button>';
  APP_CONFIG.menus.forEach(function (m) {
    if (m.comingSoon) {
      h += '<button class="nav-tab" disabled style="opacity:0.4;cursor:not-allowed">' + m.icon + ' ' + m.name + '</button>';
      return;
    }
    if (!canAccessMenu(m, me)) return;
    h += '<button class="nav-tab' + (activeId === m.id ? ' active' : '') + '" onclick="goNav(\'' + m.id + '\')">' + m.icon + ' ' + m.name + '</button>';
  });
  return h;
}

// タブ・カードを押したときの移動
// ページ側で window.onAppNav を定義すると、そのページ内で処理できる
function goNav(id) {
  if (typeof window.onAppNav === 'function' && window.onAppNav(id)) return;
  if (id === 'home') { location.href = 'index.html'; return; }
  const m = APP_CONFIG.menus.find(function (x) { return x.id === id; });
  if (!m || m.comingSoon) return;
  location.href = m.page ? 'index.html#' + m.page : m.url;
}
