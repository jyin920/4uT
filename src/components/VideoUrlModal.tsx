import React, { useState } from 'react';
import { X, Youtube, Search } from 'lucide-react';

interface VideoUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (videoId: string) => void;
  currentVideoId: string;
}

export const VideoUrlModal: React.FC<VideoUrlModalProps> = ({
  isOpen,
  onClose,
  onSelectVideo,
  currentVideoId,
}) => {
  const [inputUrl, setInputUrl] = useState(
    currentVideoId ? `https://www.youtube.com/watch?v=${currentVideoId}` : ''
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let extractedId = inputUrl.trim();
    if (extractedId.includes('watch?v=')) {
      const match = extractedId.match(/watch\?v=([a-zA-Z0-9_-]{11})/);
      if (match) extractedId = match[1];
    } else if (extractedId.includes('youtu.be/')) {
      const match = extractedId.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (match) extractedId = match[1];
    }

    if (!extractedId || extractedId.length < 5) {
      setError('有効なYouTube動画URLまたは動画ID（11文字）を入力してください');
      return;
    }

    onSelectVideo(extractedId);
    onClose();
  };

  const presetVideos = [
    {
      id: 'Rv_unO1n6U8',
      title: 'ふぉ〜ゆ〜「BLOOM WORLD」【Official Music Video】',
      tag: '指定リクエスト曲 · 結成15周年記念',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">追跡対象のYouTube動画</h3>
            <p className="text-xs text-slate-400">任意のYouTube動画URLまたはIDを指定できます</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              YouTube動画URL / 動画ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://www.youtube.com/watch?v=Rv_unO1n6U8"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-600 outline-none focus:border-rose-500"
              />
            </div>
            {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
          </div>

          <div>
            <span className="text-xs text-slate-400 block mb-2">おすすめプリセット:</span>
            <div className="space-y-2">
              {presetVideos.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setInputUrl(`https://www.youtube.com/watch?v=${v.id}`);
                    onSelectVideo(v.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                    currentVideoId === v.id
                      ? 'bg-rose-950/30 border-rose-600/60 text-white'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-semibold text-white">{v.title}</div>
                  <div className="text-[11px] text-rose-400 mt-0.5">{v.tag}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>読み込んで追跡</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
