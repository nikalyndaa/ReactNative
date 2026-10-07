export const SITE_URL = "https://webpd411.itstep.click";
export const API_URL = `${SITE_URL}/api`;

export const AVATAR_SIZE = 1280;
export const imageUrl = (name?: string | null) =>
  name ? `${SITE_URL}/images/${name}_${AVATAR_SIZE}.webp` : null;