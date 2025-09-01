const getContactHref = (name: string, contact: string) => {
  const hrefs: { [key: string]: string } = {
    mastodon: `${contact}`,
    email: btoa(contact) || "",
    line: `line://ti/p/${contact}`,
    x: `https://www.x.com/${contact}`,
    telegram: `https://t.me/${contact}`,
    vkontakte: `https://vk.com/${contact}`,
    medium: `https://medium.com/${contact}`,
    github: `https://github.com/${contact}`,
    weibo: `https://www.weibo.com/${contact}`,
    gitlab: `https://www.gitlab.com/${contact}`,
    codepen: `https://www.codepen.io/${contact}`,
    soundcloud: `https://soundcloud.com/${contact}`,
    facebook: `https://www.facebook.com/${contact}`,
    instagram: `https://www.instagram.com/${contact}`,
    linkedin: `https://www.linkedin.com/in/${contact}`,
    youtube: `https://www.youtube.com/channel/${contact}`,
    bluesky: `https://bsky.app/profile/${contact}.bsky.social`,
  };

  return hrefs[name] ?? contact;
};

export { getContactHref };
