// ref の子要素を全て消す
export const resetNode = (ref: HTMLDivElement | null) => {
  if (!ref) {
    return
  }
  while (ref.firstChild) {
    ref.removeChild(ref.firstChild)
  }
}
