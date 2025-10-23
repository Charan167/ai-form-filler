export function getPageContext() {
  const pageContext: any[] = [];
  const elements = document.querySelectorAll(
    "head > title, meta[type='description'], body > h1 "
  );

  elements.forEach((element) =>
    pageContext.push({
      tag: element?.tagName,
      id: element?.id,
      innerText: element?.innerHTML,
      url: window.location.href
    })
  );

  return pageContext;
}
