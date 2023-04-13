import React, { useEffect, useState, useMemo } from 'react'
import { IPlayerApp, Player, PlayerListener } from 'textalive-app-api'
import PlayerControl from './PlayerControl'
import './style.css'

export default function Canvas() {
  const [player, setPlayer] = useState<Player>()
  const [app, setApp] = useState<IPlayerApp>()
  const [char, setChar] = useState('')
  const [mediaElement, setMediaElement] = useState<HTMLDivElement | null>(null)

  const div = useMemo(() => <div className='media' ref={setMediaElement} />, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !mediaElement) {
      return
    }

    console.log('--- [app] create Player instance ---')
    const p = new Player({
      app: {
        // トークンは https://developer.textalive.jp/profile で取得したものを使う
        token: 'T1eQwHaxqMeDptHe'
      },
      mediaElement,
    })

    const playerListener: PlayerListener = {
      onAppReady: (app) => {
        console.log('--- [app] initialized as TextAlive app ---')
        console.log('managed:', app.managed)
        console.log('host:', app.host)
        console.log('song url:', app.songUrl)
        if (!app.songUrl) {
          p.createFromSongUrl('https://piapro.jp/t/Vfrl/20230120182855', {
            video: {
              // 音楽地図訂正履歴: https://songle.jp/songs/2427950/history
              beatId: 4267334,
              chordId: 2405059,
              repetitiveSegmentId: 2475645,
              // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FVfrl%2F20230120182855
              lyricId: 56095,
              lyricDiffId: 9637,
            },
          })
        }
        setApp(app)
      },
      onVideoReady: () => {
        console.log('--- [app] video is ready ---')
        console.log('player:', p)
        console.log('player.data.song:', p.data.song)
        console.log('player.data.song.name:', p.data.song.name)
        console.log('player.data.song.artist.name:', p.data.song.artist.name)
        console.log('player.data.songMap:', p.data.songMap)
        let c = p.video.firstChar
        while (c && c.next) {
          c.animate = (now, u) => {
            if (u.startTime <= now && u.endTime > now) {
              setChar(u.text)
            }
          }
          c = c.next
        }
      },
    }
    p.addListener(playerListener)

    setPlayer(p)

    return () => {
      console.log('--- [app] shutdown ---')
      p.removeListener(playerListener)
      p.dispose()
    }
  }, [mediaElement])

  return (
    <>
      {player && app && (
        <div className='controls'>
          <PlayerControl disabled={app.managed} player={player} />
        </div>
      )}
      <div className='wrapper'>
        <div className='char'>{char}</div>
      </div>
      {div}
    </>
  )
}
