/**
 * 公開中のシナリオ一覧
 */
const SCENARIOS = [
  {
    id: 'tunnel-orbs',
    title: '幽霊に嫌われた話',
    hook: '心霊スポットで撮った写真——友達にはオーブが写っていた。自分だけ、一枚も。笑い合ったその夜から、部屋でラップ音が鳴り始めた。',
    genre: '心霊ホラー',
    version: 'v1.0',
    endings: 5,
    path: 'scenarios/tunnel-orbs/',
  },
  {
    id: 'neighbor-letters',
    title: '隣人の手紙',
    hook: '孤独死した隣人から、三通の手紙が届く。封筒には名前だけ。素性も住所もわからない宛先を、推理していくうちに——あなたも、手紙の宛先の一人だった。',
    genre: '心理サスペンス',
    version: 'v1.0',
    endings: 5,
    path: 'scenarios/neighbor-letters/',
  },
  {
    id: 'yokohama-earthquake',
    title: '首都直下型地震、横浜まで帰る',
    hook: '午後二時四十六分、丸の内のオフィスでコーヒーが波打った。半分できかけのティラノが床に落ち、スマホが鳴り続ける。港北のマンションにいるのは、妻と三歳の息子だけ。電車は動かない。帰る道は、あなたが選ぶ。',
    genre: '災害サスペンス',
    version: 'v1.4',
    endings: 5,
    path: 'scenarios/yokohama-earthquake/',
  },
  {
    id: 'wonderful-world',
    title: '素晴らしきこの世界',
    hook: 'AIがこの世のすべてを請け負い、人間には娯楽だけを与える。読み手だけに、特別な権限が提案される——あなたは、どう選ぶ？',
    genre: 'SF / メタフィクション',
    version: 'v1.0',
    endings: 4,
    path: 'scenarios/wonderful-world/',
  },
  {
    id: 'perfect-murder',
    title: '完全なる殺人',
    hook: '鍵のかかった書斎で、不動産王の死体が見つかる。現場には四人分の恨みが——イヤリング、カフリンク、口紅、切れたベルト。あなたは、どの容疑者を追う？',
    genre: '本格ミステリー',
    version: 'v1.0',
    endings: 5,
    path: 'scenarios/perfect-murder/',
  },
  {
    id: 'blue-sheet-cradle',
    title: 'ブルーシートのゆりかご',
    hook: '震災三日目、体育館の避難所。生後二ヶ月の蓮が三時間泣き続け、誰も眠れない。届いたブルーシートは六枚だけ——屋根の雨漏れ、寝床、足元の泥。大工だった木下爺が言う。「一枚あれば、ゆりかごが作れる」。父の家は、二キロ先で音が途切れている。',
    genre: '災害ヒューマンドラマ',
    version: 'v1.1',
    endings: 6,
    path: 'scenarios/blue-sheet-cradle/',
  },
];
