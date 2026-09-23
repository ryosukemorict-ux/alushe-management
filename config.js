// ============================================
// Alushe システム共通設定
// 会社名・店舗・役職・接続先はここだけで管理する
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
    // まつげ・ネイル系は店舗名が確定したらここに追加
  ],

  // 役職（上位から順に）
  positions: [
    '代表取締役', '管理者', 'FCオーナー', 'マネージャー',
    '店長', '副店長', 'スタイリスト', 'アシスタント', 'アルバイト',
  ],

  // 新規登録で本人が選べる役職
  selfRegisterPositions: ['副店長', 'スタイリスト', 'アシスタント', 'アルバイト'],
};

// ===== 共通ヘルパー =====
function storeLabel(id) {
  if (id === APP_CONFIG.allStoresValue) return '全店共通';
  const s = APP_CONFIG.stores.find(function (x) { return x.id === id; });
  return s ? s.label : (id || '');
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
