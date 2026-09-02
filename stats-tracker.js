/*
 * hitotoki 共通記録スクリプト
 * -----------------------------------------------
 * 各ゲームが対局を終えるたびに呼び出して、記録タブ（ホーム画面下部の「記録」）に
 * 表示する統計情報を localStorage に蓄積しておくための仕組み。
 *
 * 保存データ（キー: 'hitotoki_stats'）:
 * {
 *   firstPlayedAt: "2026-09-01T12:34:56.000Z",  // 初めて記録された日時（以後変わらない）
 *   totalPlays: 12,                              // 全ゲーム合計のプレイ回数
 *   totalWins: 7,                                // 全ゲーム合計の勝利数（CPU対戦のみ集計）
 *   byGame: {
 *     "mini_shogi": {
 *       title: "ミニ将棋",
 *       plays: 5,           // このゲームの合計プレイ回数（2人対戦も含む）
 *       wins: 3,            // このゲームの合計勝利数（CPU対戦のみ）
 *       cpuResults: [true, false, true, ...]  // 直近50戦ぶんの対CPU勝敗（勝ち=true）
 *     },
 *     ...
 *   }
 * }
 *
 * 使い方：各ゲームの </body> 直前に追加する
 *   <script src="stats-tracker.js"></script>
 *
 * そのうえで、対局が終わったタイミングで1回だけ呼び出す：
 *   window.hitotokiStats.recordGameEnd('mini_shogi', 'ミニ将棋', { vsCPU: true, won: true });
 *
 * - vsCPU: true の場合のみ「対CPU勝率」の集計対象になる（2人対戦はプレイ回数のみ加算）
 * - won: vsCPU:true の時に、プレイヤー視点で勝ったかどうかを渡す
 * - 2人対戦（vsCPUなし）の場合は { } のみ、または省略してよい
 */
(function(){
  var KEY = 'hitotoki_stats';
  var MAX_CPU_HISTORY = 50;

  function loadStats(){
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var parsed = JSON.parse(raw);
        if(parsed && typeof parsed === 'object'){
          parsed.byGame = parsed.byGame || {};
          return parsed;
        }
      }
    }catch(e){}
    return { firstPlayedAt: null, totalPlays: 0, totalWins: 0, byGame: {} };
  }

  function saveStats(stats){
    try{ localStorage.setItem(KEY, JSON.stringify(stats)); }catch(e){}
  }

  function recordGameEnd(gameId, title, opts){
    opts = opts || {};
    var stats = loadStats();

    if(!stats.firstPlayedAt){
      stats.firstPlayedAt = new Date().toISOString();
    }
    stats.totalPlays = (stats.totalPlays || 0) + 1;

    if(!stats.byGame[gameId]){
      stats.byGame[gameId] = { title: title, plays: 0, wins: 0, cpuResults: [] };
    }
    var g = stats.byGame[gameId];
    g.title = title;
    g.plays += 1;

    if(opts.vsCPU){
      g.cpuResults = g.cpuResults || [];
      g.cpuResults.push(!!opts.won);
      if(g.cpuResults.length > MAX_CPU_HISTORY){
        g.cpuResults = g.cpuResults.slice(g.cpuResults.length - MAX_CPU_HISTORY);
      }
      if(opts.won){
        g.wins += 1;
        stats.totalWins = (stats.totalWins || 0) + 1;
      }
    }

    saveStats(stats);
    return stats;
  }

  window.hitotokiStats = {
    load: loadStats,
    recordGameEnd: recordGameEnd,
  };
})();
