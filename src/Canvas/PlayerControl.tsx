import { useCallback, useState, useEffect } from 'react'
import { MdPause, MdPlayArrow, MdStop } from 'react-icons/md'
import { IPlayer, Player } from 'textalive-app-api'
import { PlayerSeekbar } from 'textalive-react-api'
import './style.css'

interface Props {
  disabled: boolean
  player: Player
}

export default function PlayerControl({ disabled, player }: Props) {
  const [status, setStatus] = useState('stop')

  useEffect(() => {
    const listener = {
      onPlay: () => setStatus('play'),
      onPause: () => setStatus('pause'),
      onStop: () => setStatus('stop'),
    }
    player.addListener(listener)
    return () => {
      player.removeListener(listener)
    }
  }, [player])

  const handlePlay = useCallback(() => player && player.requestPlay(), [player])
  const handlePause = useCallback(
    () => player && player.requestPause(),
    [player]
  )
  const handleStop = useCallback(() => player && player.requestStop(), [player])

  return (
    <div className='control'>
      <button
        onClick={status !== 'play' ? handlePlay : handlePause}
        disabled={disabled}
      >
        {status !== 'play' ? <MdPlayArrow /> : <MdPause />}
      </button>
      <button onClick={handleStop} disabled={disabled || status === 'stop'}>
        <MdStop />
      </button>
      <div className='seekbar'>
        <PlayerSeekbar player={disabled ? undefined : (player as IPlayer)} />
      </div>
    </div>
  )
}
