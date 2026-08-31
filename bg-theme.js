/*
 * hitotoki 共通背景テーマ適用スクリプト
 * -----------------------------------------------
 * ホーム画面（index.html）の⚙メニュー「背景」で選んだ色を、
 * このスクリプトを読み込んだ全ページに反映させるための仕組み。
 *
 * 仕組み：
 * - ホーム画面で背景色を選ぶと、グラデーションの色指定文字列を
 *   localStorage の 'pref_bg_gradient' キーに保存する
 * - このスクリプトを読み込んだページは、読み込み時にそのキーを確認し、
 *   保存されていればページの背景に同じグラデーションを適用する
 * - 保存されていなければ何もしない（そのページ本来の初期背景のまま）
 *
 * 使い方：各ページの </body> 直前に以下を追加するだけ
 *   <script src="bg-theme.js"></script>
 */
(function(){
  var STORAGE_KEY = 'pref_bg_gradient';
  var saved = localStorage.getItem(STORAGE_KEY);
  if(saved){
    document.body.style.background = 'radial-gradient(ellipse at 50% -10%, ' + saved + ')';
  }
})();
