import './index.scss'

interface Props {
  type: 'normal' | 'primary'
  text: string
  onClick(): void
}

export default function Button({type, text, onClick}: Props) {
  return <button onClick={onClick} className={`button ${type}`}>{text}</button>
}
