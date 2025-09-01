const getMeta = (container: HTMLElement, key: string) => {
  const meta = container.getElementsByTagName("meta");

  for (let i = 0; i < meta.length; i += 1) {
    if (
      key === meta[i].getAttribute("name") ||
      key === meta[i].getAttribute("property")
    ) {
      return meta[i].getAttribute("content");
    }
  }

  return "";
};

export { getMeta };
