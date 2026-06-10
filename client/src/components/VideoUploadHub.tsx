/**
 * VideoUploadHub — AthlynXAI
 * Athlete recruiting video upload and gallery.
 * Vimeo-first, server-mediated uploads with S3/R2 fallback.
 */
import { useState, useRef, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Upload, Video, Trash2, Eye, Star, Share2, Play, Film, Plus, X, Shield, Cloud, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const VIDEO_TYPES = [
  { id: "highlight", label: "Highlight Reel", desc: "Your best plays" },
  { id: "recruiting", label: "Recruiting Video", desc: "Scout-ready athlete film" },
  { id: "game_film", label: "Game Film", desc: "Full game footage" },
  { id: "training", label: "Training", desc: "Practice and drills" },
  { id: "other", label: "Other", desc: "Any other video" },
] as const;

type VideoType = typeof VIDEO_TYPES[number]["id"];
type UploadProvider = "vimeo" | "fallback";

interface VideoUploadHubProps {
  userId?: number;
  readOnly?: boolean;
}

function getVimeoEmbedUrl(video: any): string | null {
  if (video?.playerUrl) return video.playerUrl;
  if (video?.vimeoId) return `https://player.vimeo.com/video/${video.vimeoId}`;
  if (typeof video?.vimeoUri === "string") {
    const id = video.vimeoUri.split("/").filter(Boolean).pop();
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}

function VideoPlayerFrame({ video, playing, onPlay }: { video: any; playing: boolean; onPlay: () => void }) {
  const isVimeo = video?.provider === "vimeo" || video?.vimeoId || video?.vimeoUri;
  const embedUrl = isVimeo ? getVimeoEmbedUrl(video) : null;

  if (playing) {
    if (embedUrl) {
      return (
        <iframe
          src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1&title=0&byline=0&portrait=0`}
          title={video.title || "AthlynXAI recruiting video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
    }
    return (
      <video
        src={video.url}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center cursor-pointer bg-gradient-to-br from-blue-950 to-slate-900"
      onClick={onPlay}
    >
      {video.thumbnailUrl ? (
        <img src={video.thumbnailUrl} alt="Video thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-70" />
      ) : null}
      <div className="relative z-10 w-14 h-14 rounded-full bg-blue-600/90 flex items-center justify-center hover:bg-blue-500 transition-colors shadow-lg shadow-blue-950/60">
        <Play className="w-6 h-6 text-white ml-1" />
      </div>
      {video.isHighlightReel && (
        <div className="absolute top-2 left-2 bg-blue-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
          <Star className="w-3 h-3" /> Highlight Reel
        </div>
      )}
      {isVimeo && (
        <div className="absolute top-2 right-2 bg-black/70 text-[#00C2FF] text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
          <Shield className="w-3 h-3" /> Vimeo Secure
        </div>
      )}
    </div>
  );
}

export default function VideoUploadHub({ userId, readOnly = false }: VideoUploadHubProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProvider, setUploadProvider] = useState<UploadProvider>("vimeo");
  const [selectedType, setSelectedType] = useState<VideoType>("highlight");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [isHighlightReel, setIsHighlightReel] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetUserId = userId ?? Number(user?.id ?? 0);

  const { data: videos = [], refetch } = trpc.media.getAthleteVideos.useQuery(
    { userId: targetUserId },
    { enabled: targetUserId > 0, retry: false }
  );

  const getUploadUrl = trpc.media.getUploadUrl.useMutation();
  const createVimeoUpload = trpc.media.createVimeoUpload.useMutation();
  const completeVimeoUpload = trpc.media.completeVimeoUpload.useMutation();
  const syncVimeoVideo = trpc.media.syncVimeoVideo.useMutation({
    onSuccess: () => refetch(),
    onError: (error: any) => toast.error(error?.message || "Vimeo sync failed"),
  });
  const saveMedia = trpc.media.saveMedia.useMutation({
    onSuccess: () => {
      refetch();
      resetUploadForm();
      toast.success("Video uploaded successfully!");
    },
  });
  const deleteVideo = trpc.media.deleteVideo.useMutation({
    onSuccess: () => { refetch(); toast.success("Video deleted"); },
  });
  const recordView = trpc.media.recordView.useMutation();

  function resetUploadForm() {
    setShowUploadForm(false);
    setSelectedFile(null);
    setVideoTitle("");
    setVideoDesc("");
    setIsHighlightReel(false);
    setUploadProgress(0);
  }

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (file.size > 5 * 1024 * 1024 * 1024) {
      toast.error("File too large. Max 5GB for recruiting videos.");
      return;
    }
    setSelectedFile(file);
    setVideoTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    setShowUploadForm(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  async function uploadToVimeo(file: File) {
    const ticket = await createVimeoUpload.mutateAsync({
      filename: file.name,
      contentType: file.type,
      fileSizeBytes: file.size,
      mediaType: selectedType,
      title: videoTitle || file.name,
      description: videoDesc,
      sport: (user as any)?.sport || "",
      isHighlightReel,
    });

    if ((ticket as any).fallback || !(ticket as any).uploadLink) {
      toast.info("Vimeo is not configured yet. Using secure platform storage fallback.");
      await uploadToFallbackStorage(file);
      return;
    }

    setUploadProgress(20);
    const xhr = new XMLHttpRequest();
    await new Promise<void>((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) setUploadProgress(20 + Math.round((event.loaded / event.total) * 65));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Vimeo upload failed: ${xhr.status}`));
      };
      xhr.onerror = () => reject(new Error("Vimeo upload failed"));
      xhr.open("PATCH", (ticket as any).uploadLink);
      xhr.setRequestHeader("Tus-Resumable", "1.0.0");
      xhr.setRequestHeader("Upload-Offset", "0");
      xhr.setRequestHeader("Content-Type", "application/offset+octet-stream");
      xhr.send(file);
    });

    setUploadProgress(90);
    await completeVimeoUpload.mutateAsync({
      vimeoUri: (ticket as any).vimeoUri,
      vimeoId: (ticket as any).vimeoId,
      playerUrl: (ticket as any).playerUrl,
      link: (ticket as any).link,
      mediaType: selectedType,
      title: videoTitle || file.name,
      description: videoDesc,
      sport: (user as any)?.sport || "",
      isHighlightReel,
      processingStatus: "processing",
    });
    await refetch();
    resetUploadForm();
    toast.success("Video sent to Vimeo. Processing may take a few minutes.");
  }

  async function uploadToFallbackStorage(file: File) {
    if (!user) return;
    const { uploadUrl, key, publicUrl, fallback } = await getUploadUrl.mutateAsync({
      filename: file.name,
      contentType: file.type,
      mediaType: selectedType,
      fileSizeBytes: file.size,
    });

    setUploadProgress(30);
    let finalUrl = publicUrl;

    if (uploadUrl && !fallback) {
      const xhr = new XMLHttpRequest();
      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(30 + Math.round((e.loaded / e.total) * 60));
        };
        xhr.onload = () => {
          if (xhr.status === 200) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } else {
      finalUrl = URL.createObjectURL(file);
      setUploadProgress(90);
    }

    await saveMedia.mutateAsync({
      key,
      publicUrl: finalUrl,
      mediaType: selectedType,
      title: videoTitle || file.name,
      description: videoDesc,
      sport: (user as any)?.sport || "",
      isHighlightReel,
    });
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);
    setUploadProgress(10);

    try {
      if (uploadProvider === "vimeo") await uploadToVimeo(selectedFile);
      else await uploadToFallbackStorage(selectedFile);
      setUploadProgress(100);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleShare = (video: any) => {
    const url = `${window.location.origin}/athlete/${targetUserId}`;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied to clipboard!");
  };

  const typeEmoji: Record<string, string> = {
    highlight: "", recruiting: "", game_film: "", training: "", other: "",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-black text-base flex items-center gap-2">
          <Film className="w-5 h-5 text-blue-400" />
          Recruiting Videos
          {videos.length > 0 && (
            <span className="text-xs bg-blue-900/60 text-blue-400 px-2 py-0.5 rounded-full">{videos.length}</span>
          )}
        </h3>
        {!readOnly && !showUploadForm && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-3 py-2 rounded-full transition-colors"
          >
            <Plus className="w-3 h-3" /> Add Video
          </button>
        )}
      </div>

      {!readOnly && !showUploadForm && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-blue-400 bg-blue-900/30"
              : "border-blue-800/50 hover:border-blue-600/70 hover:bg-blue-900/20"
          }`}
        >
          <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-white font-bold text-sm">Drop your recruiting video here or click to upload</div>
          <div className="text-blue-500 text-xs mt-1">Vimeo-backed hosting · MP4, MOV, AVI · Highlight reels, game film, training</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
          />
        </div>
      )}

      {showUploadForm && selectedFile && (
        <div className="bg-[#0d1f3c] border border-blue-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-white font-black text-sm">{selectedFile.name}</div>
            <button onClick={resetUploadForm} className="text-slate-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">Hosting</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setUploadProvider("vimeo")}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${uploadProvider === "vimeo" ? "border-[#1E90FF] bg-[#1E90FF]/20 text-white" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}
              >
                <div className="font-black flex items-center gap-1"><Shield className="w-3 h-3" /> Vimeo Recruiter Player</div>
                <div className="text-slate-500 text-[10px] mt-1">Ad-free, domain-whitelisted embeds</div>
              </button>
              <button
                onClick={() => setUploadProvider("fallback")}
                className={`text-left p-3 rounded-xl border text-xs transition-all ${uploadProvider === "fallback" ? "border-blue-500 bg-blue-900/60 text-white" : "border-slate-700 text-slate-400 hover:border-slate-600"}`}
              >
                <div className="font-black flex items-center gap-1"><Cloud className="w-3 h-3" /> Platform Storage</div>
                <div className="text-slate-500 text-[10px] mt-1">S3/R2 fallback if Vimeo is unavailable</div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-2">Video Type</label>
            <div className="grid grid-cols-2 gap-2">
              {VIDEO_TYPES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedType === t.id
                      ? "border-blue-500 bg-blue-900/60 text-white"
                      : "border-slate-700 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <div className="font-bold">{t.label}</div>
                  <div className="text-slate-500 text-[10px]">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Title</label>
            <input
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              placeholder="e.g. Senior Season Highlights 2026"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-blue-400 text-xs font-bold uppercase tracking-wider block mb-1">Description (optional)</label>
            <textarea
              value={videoDesc}
              onChange={e => setVideoDesc(e.target.value)}
              placeholder="Describe what scouts will see..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isHighlightReel}
              onChange={e => setIsHighlightReel(e.target.checked)}
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-white text-sm font-bold">Set as my primary Highlight Reel</span>
          </label>

          {uploading && (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{uploadProvider === "vimeo" ? "Uploading to Vimeo..." : "Uploading..."}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-[#0a1628] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading || !videoTitle}
              className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : uploadProvider === "vimeo" ? "Upload to Vimeo" : "Upload Video"}
            </button>
            <button
              onClick={resetUploadForm}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {videos.map((video: any) => (
            <div key={video.id} className="bg-[#0d1f3c] border border-blue-800/50 rounded-2xl overflow-hidden group hover:border-blue-600/70 transition-all">
              <div className="relative aspect-video bg-black">
                <VideoPlayerFrame
                  video={video}
                  playing={playingId === video.id}
                  onPlay={() => {
                    setPlayingId(video.id);
                    if (targetUserId > 0) recordView.mutate({ userId: targetUserId, videoId: video.id });
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {typeEmoji[video.type] || ""} {video.type?.replace("_", " ")}
                </div>
              </div>

              <div className="p-3">
                <div className="text-white font-bold text-sm truncate">{video.title}</div>
                {video.description && (
                  <div className="text-slate-500 text-xs mt-0.5 truncate">{video.description}</div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {video.views || 0}</span>
                    <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
                    {video.processingStatus && video.processingStatus !== "ready" && (
                      <span className="text-[#00C2FF] flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {video.processingStatus}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {video.provider === "vimeo" && !readOnly && video.vimeoUri && (
                      <button
                        onClick={() => syncVimeoVideo.mutate({ videoId: video.id, vimeoUri: video.vimeoUri })}
                        className="text-slate-500 hover:text-[#00C2FF] transition-colors p-1"
                        title="Sync Vimeo status"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleShare(video)}
                      className="text-slate-500 hover:text-blue-400 transition-colors p-1"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {!readOnly && (
                      <button
                        onClick={() => deleteVideo.mutate({ videoId: video.id, key: video.key || video.vimeoUri || video.id })}
                        className="text-slate-600 hover:text-[#1E90FF] transition-colors p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-600">
          <Video className="w-10 h-10 mx-auto mb-2 text-slate-700" />
          <div className="text-sm font-bold text-slate-500">
            {readOnly ? "No videos uploaded yet" : "Upload your first recruiting video to get noticed by scouts"}
          </div>
          {!readOnly && (
            <div className="text-xs text-slate-600 mt-1">Vimeo-backed highlight reels help coaches watch clean, ad-free film</div>
          )}
        </div>
      )}
    </div>
  );
}
