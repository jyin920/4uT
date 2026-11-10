import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, Copy, ShieldCheck, Terminal, HelpCircle } from 'lucide-react';

interface ApiKeyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyGuideModal: React.FC<ApiKeyGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKeyName, setCopiedKeyName] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyName(true);
    setTimeout(() => setCopiedKeyName(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              YouTube Data API v3 キーの取得と設定手順
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Google Cloud で無料枠（1日10,000クォータ）の公式APIキーを発行する手順です
            </p>
          </div>
        </div>

        {/* Step-by-step numbered instructions */}
        <div className="space-y-4 text-xs text-slate-300">
          {/* Step 1 */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono">STEP 1</span>
              <a
                href="https://console.cloud.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium underline"
              >
                <span>Google Cloud Console を開く</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Googleアカウントでログインし、画面上部で対象プロジェクトを選択（未作成の場合は「新しいプロジェクトを作成」）します。
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono">STEP 2</span>
              <span className="text-slate-400 text-[11px]">APIの有効化</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              左上メニューの「<strong>APIとサービス</strong>」→「<strong>ライブラリ</strong>」を開き、検索ボックスに「<strong>YouTube Data API v3</strong>」と入力して選択し、「<strong>有効にする</strong>」をクリックします。
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 font-mono">STEP 3</span>
              <span className="text-slate-400 text-[11px]">API キーの発行</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              「<strong>APIとサービス</strong>」→「<strong>認証情報</strong>」を開き、上部の「<strong>+ 認証情報を作成</strong>」→「<strong>API キー</strong>」を選択します。<br />
              <code className="text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded font-mono text-[11px]">AIzaSy...</code> で始まるキーが生成されるのでコピーします。
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 bg-slate-900/80 border border-emerald-900/40 bg-emerald-950/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 font-mono">STEP 4</span>
              <span className="text-emerald-400 font-medium text-[11px]">本アプリ（AI Studio）に設定</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              AI Studioの左側メニューにある「<strong>Secrets</strong>（鍵アイコン）」パネルを開き、新しいシークレットを追加します：
            </p>
            <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <div>
                <div className="text-[10px] text-slate-500 font-mono uppercase">Key (変数名)</div>
                <div className="font-mono font-bold text-white text-xs">YOUTUBE_API_KEY</div>
              </div>
              <button
                onClick={() => handleCopy('YOUTUBE_API_KEY')}
                className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 flex items-center gap-1 transition-colors"
              >
                {copiedKeyName ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKeyName ? 'コピー済' : 'キー名をコピー'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              ※ Valueには、STEP 3で取得した <code className="text-amber-300 font-mono">AIzaSy...</code> を貼り付けて保存してください。設定後、自動的に公式API優先モードへ切り替わります。
            </p>
          </div>
        </div>

        {/* Note about fallback */}
        <div className="mt-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>キーが未設定でも問題ありません：</strong> 本アプリはAPIキーが未登録の場合でも、YouTube公開ページおよびInnertube直接取得エンジンが自動稼働しているため、現在のままでも正確な再生数・高評価数・コメント数が全自動更新されます。
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
