function assembleContent() {
  let texts = [];
  const journalContent = document.getElementsByClassName("journalContent")[0];
  for(const line of journalContent.children) {
    const text = line.lastElementChild.textContent;
    texts.push(text);
  }
  return JSON.stringify(texts);
}