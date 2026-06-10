# Episode 2 Media Integration Manifest

| Field | Details |
|---|---|
| Final social video | `/home/ubuntu/episode2_video/athlynxai_episode2_lee_social_cut.mp4` |
| Repo video path | `client/public/media/podcast/episode-2/athlynxai-episode2-lee-social-cut.mp4` |
| Duration | Approximately 1:18 voice-led content, exported in 9:16 vertical social format. |
| Resolution | 1080 × 1920 MP4, H.264 video, AAC audio. |
| Voice source | `SavetoVoiceMemos.m4a`, copied to `client/public/media/podcast/episode-2/athlynxai-episode2-lee-voice-source.m4a`. |
| Music source | Original instrumental anthem bed generated for this task, copied to `client/public/media/podcast/episode-2/athlynxai-episode2-anthem-bed.wav`. |
| Poster | `client/public/media/podcast/episode-2/episode2-lee-social-poster.jpg`. |
| Podcast page update | `client/src/pages/Podcast.tsx` now stages Episode 1 and Episode 2 media, adds Episode 2 audio source vault, and labels Spotify URL status as pending user-provided public links. |
| AXN update | `client/src/pages/AthlynXAIOperatingLayer.tsx` now includes an AXN Streaming Network & Podcast episode rail with Episode 1 and Episode 2 tiles. |
| Routes confirmed | `/podcast`, `/athlynxai-os`, `/axn-streaming`, `/axn-os`, `/podcast-os`, and `/podcast-social-engine` already route to the relevant local pages. |
| Brand rules | Uses AthlynX, AthlynXAI, The Athlete’s Playbook, and AXN Streaming Network & Podcast. No plain standalone X mark was intentionally added. |
| Public action status | No public social post, Spotify update, GitHub push, or deployment has been performed. User approval is required before any external mutation. |

## Spotify Placeholder Strategy

The website now represents Episode 1 and Episode 2 without inventing Spotify URLs. Once Chad provides the public Spotify episode links, they can be added to the episode metadata and platform buttons.

## Social Caption Draft

> Episode 2 social cut is here. Lee Marshall sets the tone: discipline, growth, mind, body, soul, and transformative thinking for the next generation of athletes. The Athlete’s Playbook is building through AthlynXAI and AXN Streaming Network & Podcast — one step better every time.

Suggested hashtags: `#AthlynXAI #AthlynX #TheAthletesPlaybook #AXNStreamingNetwork #AthleteDevelopment #NIL #Recruiting #MindBodySoul #SportsPodcast`
