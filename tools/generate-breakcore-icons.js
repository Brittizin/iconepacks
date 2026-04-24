const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "breakcore-icon-pack");
const ICONS_DIR = path.join(OUT_DIR, "icons");
const PREVIEW_DIR = path.join(OUT_DIR, "preview");
const MANIFEST_DIR = path.join(OUT_DIR, "manifest");

const ICON_SIZE = 512;
const ICONS = [
  { slug: "whatsapp", name: "WhatsApp", glyph: "WA", packages: ["com.whatsapp", "com.whatsapp.w4b"] },
  { slug: "instagram", name: "Instagram", glyph: "IG", packages: ["com.instagram.android"] },
  { slug: "tiktok", name: "TikTok", glyph: "TK", packages: ["com.zhiliaoapp.musically"] },
  { slug: "youtube", name: "YouTube", glyph: "YT", packages: ["com.google.android.youtube"] },
  { slug: "youtube_music", name: "YouTube Music", glyph: "YM", packages: ["com.google.android.apps.youtube.music"] },
  { slug: "spotify", name: "Spotify", glyph: "SP", packages: ["com.spotify.music"] },
  { slug: "telegram", name: "Telegram", glyph: "TG", packages: ["org.telegram.messenger"] },
  { slug: "discord", name: "Discord", glyph: "DC", packages: ["com.discord"] },
  { slug: "x", name: "X", glyph: "X", packages: ["com.twitter.android"] },
  { slug: "threads", name: "Threads", glyph: "TH", packages: ["com.instagram.barcelona"] },
  { slug: "facebook", name: "Facebook", glyph: "FB", packages: ["com.facebook.katana"] },
  { slug: "messenger", name: "Messenger", glyph: "MS", packages: ["com.facebook.orca"] },
  { slug: "snapchat", name: "Snapchat", glyph: "SC", packages: ["com.snapchat.android"] },
  { slug: "reddit", name: "Reddit", glyph: "RD", packages: ["com.reddit.frontpage"] },
  { slug: "pinterest", name: "Pinterest", glyph: "PI", packages: ["com.pinterest"] },
  { slug: "twitch", name: "Twitch", glyph: "TW", packages: ["tv.twitch.android.app"] },
  { slug: "netflix", name: "Netflix", glyph: "NF", packages: ["com.netflix.mediaclient"] },
  { slug: "prime_video", name: "Prime Video", glyph: "PV", packages: ["com.amazon.avod.thirdpartyclient"] },
  { slug: "disney_plus", name: "Disney Plus", glyph: "DP", packages: ["com.disney.disneyplus"] },
  { slug: "max", name: "Max", glyph: "MX", packages: ["com.wbd.stream"] },
  { slug: "chrome", name: "Chrome", glyph: "CH", packages: ["com.android.chrome"] },
  { slug: "brave", name: "Brave", glyph: "BR", packages: ["com.brave.browser"] },
  { slug: "firefox", name: "Firefox", glyph: "FF", packages: ["org.mozilla.firefox"] },
  { slug: "samsung_internet", name: "Samsung Internet", glyph: "SI", packages: ["com.sec.android.app.sbrowser"] },
  { slug: "tor_browser", name: "Tor Browser", glyph: "TR", packages: ["org.torproject.torbrowser"] },
  { slug: "gmail", name: "Gmail", glyph: "GM", packages: ["com.google.android.gm"] },
  { slug: "google", name: "Google", glyph: "GO", packages: ["com.google.android.googlequicksearchbox"] },
  { slug: "maps", name: "Maps", glyph: "MP", packages: ["com.google.android.apps.maps"] },
  { slug: "drive", name: "Drive", glyph: "DV", packages: ["com.google.android.apps.docs"] },
  { slug: "photos", name: "Photos", glyph: "PH", packages: ["com.google.android.apps.photos"] },
  { slug: "calendar", name: "Calendar", glyph: "31", packages: ["com.google.android.calendar"] },
  { slug: "camera", name: "Camera", glyph: "CM", packages: ["com.google.android.GoogleCamera"] },
  { slug: "files", name: "Files", glyph: "FL", packages: ["com.google.android.apps.nbu.files"] },
  { slug: "phone", name: "Phone", glyph: "PHN", packages: ["com.google.android.dialer"] },
  { slug: "messages", name: "Messages", glyph: "MSG", packages: ["com.google.android.apps.messaging"] },
  { slug: "contacts", name: "Contacts", glyph: "CT", packages: ["com.google.android.contacts"] },
  { slug: "clock", name: "Clock", glyph: "CLK", packages: ["com.google.android.deskclock"] },
  { slug: "calculator", name: "Calculator", glyph: "CAL", packages: ["com.google.android.calculator"] },
  { slug: "settings", name: "Settings", glyph: "SET", packages: ["com.android.settings"] },
  { slug: "play_store", name: "Play Store", glyph: "PS", packages: ["com.android.vending"] },
  { slug: "play_games", name: "Play Games", glyph: "PG", packages: ["com.google.android.play.games"] },
  { slug: "gallery", name: "Gallery", glyph: "GAL", packages: ["com.sec.android.gallery3d"] },
  { slug: "weather", name: "Weather", glyph: "WE", packages: ["com.google.android.apps.weather"] },
  { slug: "notes", name: "Notes", glyph: "NT", packages: ["com.google.android.keep", "com.samsung.android.app.notes"] },
  { slug: "music", name: "Music", glyph: "MU", packages: ["com.google.android.apps.youtube.music"] },
  { slug: "recorder", name: "Recorder", glyph: "REC", packages: ["com.google.android.apps.recorder"] },
  { slug: "security", name: "Security", glyph: "SEC", packages: ["com.miui.securitycenter"] },
  { slug: "app_store", name: "Galaxy Store", glyph: "GS", packages: ["com.sec.android.app.samsungapps"] },
  { slug: "uber", name: "Uber", glyph: "UB", packages: ["com.ubercab"] },
  { slug: "ifood", name: "iFood", glyph: "FD", packages: ["br.com.brainweb.ifood"] },
  { slug: "mercado_livre", name: "Mercado Livre", glyph: "ML", packages: ["com.mercadolibre"] },
  { slug: "shopee", name: "Shopee", glyph: "SH", packages: ["com.shopee.br"] },
  { slug: "amazon", name: "Amazon", glyph: "AZ", packages: ["com.amazon.mShop.android.shopping"] },
  { slug: "aliexpress", name: "AliExpress", glyph: "AE", packages: ["com.alibaba.aliexpresshd"] },
  { slug: "nubank", name: "Nubank", glyph: "NU", packages: ["com.nu.production"] },
  { slug: "paypal", name: "PayPal", glyph: "PP", packages: ["com.paypal.android.p2pmobile"] },
  { slug: "picpay", name: "PicPay", glyph: "PY", packages: ["com.picpay"] },
  { slug: "binance", name: "Binance", glyph: "BN", packages: ["com.binance.dev"] },
  { slug: "steam", name: "Steam", glyph: "ST", packages: ["com.valvesoftware.android.steam.community"] },
  { slug: "epic_games", name: "Epic Games", glyph: "EG", packages: ["com.epicgames.portal"] },
  { slug: "roblox", name: "Roblox", glyph: "RB", packages: ["com.roblox.client"] },
  { slug: "minecraft", name: "Minecraft", glyph: "MC", packages: ["com.mojang.minecraftpe"] },
  { slug: "free_fire", name: "Free Fire", glyph: "FR", packages: ["com.dts.freefireth"] },
  { slug: "cod_mobile", name: "COD Mobile", glyph: "CD", packages: ["com.activision.callofduty.shooter"] },
  { slug: "standoff_2", name: "Standoff 2", glyph: "SO", packages: ["com.axlebolt.standoff2"] },
  { slug: "genshin_impact", name: "Genshin Impact", glyph: "GI", packages: ["com.miHoYo.GenshinImpact"] },
  { slug: "honkai_star_rail", name: "Honkai Star Rail", glyph: "HS", packages: ["com.HoYoverse.hkrpgoversea"] },
  { slug: "mobile_legends", name: "Mobile Legends", glyph: "MLB", packages: ["com.mobile.legends"] },
  { slug: "brawl_stars", name: "Brawl Stars", glyph: "BS", packages: ["com.supercell.brawlstars"] },
  { slug: "clash_royale", name: "Clash Royale", glyph: "CR", packages: ["com.supercell.clashroyale"] },
  { slug: "clash_of_clans", name: "Clash of Clans", glyph: "CC", packages: ["com.supercell.clashofclans"] },
  { slug: "pubg_mobile", name: "PUBG Mobile", glyph: "PGM", packages: ["com.tencent.ig"] },
  { slug: "chatgpt", name: "ChatGPT", glyph: "AI", packages: ["com.openai.chatgpt"] },
  { slug: "duolingo", name: "Duolingo", glyph: "DU", packages: ["com.duolingo"] },
  { slug: "capcut", name: "CapCut", glyph: "CP", packages: ["com.lemon.lvoverseas"] },
  { slug: "canva", name: "Canva", glyph: "CV", packages: ["com.canva.editor"] },
  { slug: "notion", name: "Notion", glyph: "NO", packages: ["notion.id"] },
  { slug: "vlc", name: "VLC", glyph: "VC", packages: ["org.videolan.vlc"] },
  { slug: "capcut_music", name: "SoundCloud", glyph: "SD", packages: ["com.soundcloud.android"] },
  { slug: "deezer", name: "Deezer", glyph: "DZ", packages: ["deezer.android.app"] },
  { slug: "kwai", name: "Kwai", glyph: "KW", packages: ["com.kwai.video"] },
  { slug: "linkedin", name: "LinkedIn", glyph: "IN", packages: ["com.linkedin.android"] },
  { slug: "sheets", name: "Google Sheets", glyph: "GSH", packages: ["com.google.android.apps.docs.editors.sheets"] },
  { slug: "docs", name: "Google Docs", glyph: "DOC", packages: ["com.google.android.apps.docs.editors.docs"] },
  { slug: "translate", name: "Translate", glyph: "TRN", packages: ["com.google.android.apps.translate"] },
  { slug: "wallet", name: "Wallet", glyph: "WL", packages: ["com.google.android.apps.walletnfcrel"] }
];

const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "10001", "11001", "10101", "10011", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  0: ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  6: ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  "+": ["00100", "00100", "00100", "11111", "00100", "00100", "00100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
  ":": ["00000", "01100", "01100", "00000", "01100", "01100", "00000"],
  "/": ["00001", "00010", "00100", "01000", "10000", "00000", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createCanvas(width, height) {
  return new PNG({ width, height });
}

function setPixel(png, x, y, color) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) {
    return;
  }
  const idx = (png.width * y + x) * 4;
  png.data[idx] = color[0];
  png.data[idx + 1] = color[1];
  png.data[idx + 2] = color[2];
  png.data[idx + 3] = color[3];
}

function blendPixel(png, x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) {
    return;
  }
  const idx = (png.width * y + x) * 4;
  const a = (color[3] / 255) * alpha;
  const inv = 1 - a;
  png.data[idx] = Math.round(color[0] * a + png.data[idx] * inv);
  png.data[idx + 1] = Math.round(color[1] * a + png.data[idx + 1] * inv);
  png.data[idx + 2] = Math.round(color[2] * a + png.data[idx + 2] * inv);
  png.data[idx + 3] = Math.min(255, Math.round((a + (png.data[idx + 3] / 255) * inv) * 255));
}

function fillRect(png, x, y, width, height, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      setPixel(png, px, py, color);
    }
  }
}

function drawHorizontalGlitch(png, y, thickness, color, alpha) {
  for (let row = 0; row < thickness; row += 1) {
    const py = y + row;
    for (let x = 0; x < png.width; x += 1) {
      blendPixel(png, x, py, color, alpha);
    }
  }
}

function pointInRoundedRect(x, y, left, top, right, bottom, radius) {
  if (x >= left + radius && x <= right - radius) return y >= top && y <= bottom;
  if (y >= top + radius && y <= bottom - radius) return x >= left && x <= right;
  const cx = x < left + radius ? left + radius : right - radius;
  const cy = y < top + radius ? top + radius : bottom - radius;
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= radius * radius;
}

function drawRoundedRectOutline(png, left, top, width, height, radius, thickness, color, alpha = 1) {
  const right = left + width - 1;
  const bottom = top + height - 1;
  for (let y = top; y <= bottom; y += 1) {
    for (let x = left; x <= right; x += 1) {
      const outer = pointInRoundedRect(x, y, left, top, right, bottom, radius);
      const inner = pointInRoundedRect(
        x,
        y,
        left + thickness,
        top + thickness,
        right - thickness,
        bottom - thickness,
        Math.max(0, radius - thickness)
      );
      if (outer && !inner) {
        blendPixel(png, x, y, color, alpha);
      }
    }
  }
}

function drawText(png, text, x, y, scale, color, alpha = 1, spacing = 1) {
  let cursor = x;
  for (const rawChar of text) {
    const char = rawChar.toUpperCase();
    const glyph = FONT[char] || FONT[" "];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === "1") {
          for (let sy = 0; sy < scale; sy += 1) {
            for (let sx = 0; sx < scale; sx += 1) {
              blendPixel(png, cursor + col * scale + sx, y + row * scale + sy, color, alpha);
            }
          }
        }
      }
    }
    cursor += (glyph[0].length + spacing) * scale;
  }
}

function measureText(text, scale, spacing = 1) {
  let width = 0;
  for (const rawChar of text) {
    const char = rawChar.toUpperCase();
    const glyph = FONT[char] || FONT[" "];
    width += (glyph[0].length + spacing) * scale;
  }
  return width > 0 ? width - spacing * scale : 0;
}

function wrapLabel(name) {
  const words = name.split(" ");
  if (words.length <= 1) {
    return [name.toUpperCase()];
  }
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (candidate.length <= 10) {
      current = candidate;
    } else {
      lines.push(current.toUpperCase());
      current = words[i];
    }
  }
  lines.push(current.toUpperCase());
  return lines.slice(0, 2);
}

function renderIcon(icon) {
  const rng = mulberry32(hashString(icon.slug));
  const png = createCanvas(ICON_SIZE, ICON_SIZE);
  const black = [4, 4, 4, 255];
  const deepRed = [64, 0, 0, 255];
  const red = [235, 12, 18, 255];
  const pale = [255, 242, 232, 255];

  fillRect(png, 0, 0, ICON_SIZE, ICON_SIZE, black);

  const centerX = ICON_SIZE / 2;
  const centerY = ICON_SIZE / 2;
  const glowRadius = 220 + Math.floor(rng() * 70);
  for (let y = 0; y < ICON_SIZE; y += 1) {
    for (let x = 0; x < ICON_SIZE; x += 1) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const glow = Math.max(0, 1 - dist / glowRadius);
      if (glow > 0) {
        blendPixel(png, x, y, deepRed, glow * 0.65);
      }
    }
  }

  for (let i = 0; i < 18; i += 1) {
    const y = Math.floor(rng() * ICON_SIZE);
    const alpha = 0.05 + rng() * 0.15;
    drawHorizontalGlitch(png, y, 1 + Math.floor(rng() * 3), red, alpha);
  }

  for (let i = 0; i < 1200; i += 1) {
    const x = Math.floor(rng() * ICON_SIZE);
    const y = Math.floor(rng() * ICON_SIZE);
    const shade = rng() > 0.5 ? pale : red;
    blendPixel(png, x, y, shade, 0.3 + rng() * 0.4);
  }

  drawRoundedRectOutline(png, 18, 18, ICON_SIZE - 36, ICON_SIZE - 36, 56, 3, red, 0.75);
  drawRoundedRectOutline(png, 26, 26, ICON_SIZE - 52, ICON_SIZE - 52, 50, 1, pale, 0.18);

  const glyph = icon.glyph.toUpperCase();
  const scale = glyph.length >= 3 ? 20 : glyph.length === 2 ? 26 : 34;
  const glyphWidth = measureText(glyph, scale, 1);
  const glyphX = Math.round((ICON_SIZE - glyphWidth) / 2);
  const glyphY = Math.round(ICON_SIZE * 0.28);

  drawText(png, glyph, glyphX + 8, glyphY + 10, scale, red, 0.28);
  drawText(png, glyph, glyphX - 4, glyphY + 3, scale, pale, 0.15);
  drawText(png, glyph, glyphX, glyphY, scale, pale, 1);

  for (let i = 0; i < 10; i += 1) {
    const y = glyphY + Math.floor(rng() * 160);
    const x = 70 + Math.floor(rng() * 360);
    const width = 20 + Math.floor(rng() * 120);
    for (let px = x; px < x + width; px += 1) {
      blendPixel(png, px, y, red, 0.25 + rng() * 0.25);
    }
  }

  const tag = ["SYS", "ERR", "VOID", "CTRL", "NOISE", "VX"][Math.floor(rng() * 6)];
  drawText(png, tag, 40, 52, 4, red, 0.85);

  for (let x = 40; x < ICON_SIZE - 40; x += 8) {
    if (rng() > 0.55) {
      blendPixel(png, x, ICON_SIZE - 88, red, 0.8);
      blendPixel(png, x, ICON_SIZE - 87, red, 0.4);
    }
  }

  return png;
}

function savePng(png, targetPath) {
  fs.writeFileSync(targetPath, PNG.sync.write(png));
}

function createPreview(icons) {
  const columns = 6;
  const cellWidth = 330;
  const cellHeight = 410;
  const margin = 48;
  const rows = Math.ceil(icons.length / columns);
  const width = columns * cellWidth + margin * 2;
  const height = rows * cellHeight + 240;
  const png = createCanvas(width, height);
  const black = [0, 0, 0, 255];
  const red = [237, 16, 24, 255];
  const pale = [255, 242, 232, 255];

  fillRect(png, 0, 0, width, height, black);
  drawText(png, "BREAKCORE ICON PACK", Math.round((width - measureText("BREAKCORE ICON PACK", 8, 1)) / 2), 36, 8, red, 0.95);

  icons.forEach((icon, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const x = margin + col * cellWidth;
    const y = 110 + row * cellHeight;
    const iconPng = PNG.sync.read(fs.readFileSync(path.join(ICONS_DIR, `${icon.slug}.png`)));
    const scale = 0.48;
    const iconSize = Math.round(iconPng.width * scale);
    for (let py = 0; py < iconSize; py += 1) {
      for (let px = 0; px < iconSize; px += 1) {
        const srcX = Math.floor(px / scale);
        const srcY = Math.floor(py / scale);
        const srcIdx = (iconPng.width * srcY + srcX) * 4;
        const color = [
          iconPng.data[srcIdx],
          iconPng.data[srcIdx + 1],
          iconPng.data[srcIdx + 2],
          iconPng.data[srcIdx + 3]
        ];
        blendPixel(png, x + 36 + px, y + py, color, 1);
      }
    }

    const lines = wrapLabel(icon.name);
    lines.forEach((line, lineIndex) => {
      const textWidth = measureText(line, 4, 1);
      drawText(png, line, x + Math.round((cellWidth - textWidth) / 2), y + iconSize + 28 + lineIndex * 34, 4, red, 0.95);
    });

    if (index % 5 === 0) {
      drawText(png, "GLITCH", x + 14, y + 8, 3, pale, 0.55);
    }
  });

  drawText(png, "SYSTEM // BREAKCORE MODE", margin, height - 76, 5, red, 0.9);
  return png;
}

function createWallpaper() {
  const width = 1440;
  const height = 3200;
  const png = createCanvas(width, height);
  const black = [0, 0, 0, 255];
  const red = [236, 14, 20, 255];
  const pale = [255, 242, 232, 255];
  fillRect(png, 0, 0, width, height, black);

  const rng = mulberry32(1337);
  for (let y = 0; y < height; y += 1) {
    const intensity = Math.max(0, 1 - Math.abs(y - height * 0.45) / (height * 0.6));
    for (let x = 0; x < width; x += 1) {
      if (rng() < 0.004) {
        blendPixel(png, x, y, red, intensity * (0.2 + rng() * 0.4));
      }
    }
  }

  const sampleSlugs = ["chatgpt", "spotify", "whatsapp", "instagram", "roblox", "youtube", "discord", "telegram", "minecraft"];
  sampleSlugs.forEach((slug, index) => {
    const iconPng = PNG.sync.read(fs.readFileSync(path.join(ICONS_DIR, `${slug}.png`)));
    const scale = 0.62;
    const size = Math.round(iconPng.width * scale);
    const x = 120 + (index % 3) * 420;
    const y = 380 + Math.floor(index / 3) * 420;
    for (let py = 0; py < size; py += 1) {
      for (let px = 0; px < size; px += 1) {
        const srcX = Math.floor(px / scale);
        const srcY = Math.floor(py / scale);
        const srcIdx = (iconPng.width * srcY + srcX) * 4;
        const color = [
          iconPng.data[srcIdx],
          iconPng.data[srcIdx + 1],
          iconPng.data[srcIdx + 2],
          iconPng.data[srcIdx + 3]
        ];
        blendPixel(png, x + px, y + py, color, 1);
      }
    }
  });

  drawText(png, "BREAKCORE", 210, 1860, 18, red, 0.95);
  drawText(png, "ICON PACK", 320, 2050, 14, pale, 0.95);
  drawText(png, "ILUIZ.OS", 365, 2330, 10, red, 0.9);
  drawText(png, "GLITCH MODE ON", 360, 2520, 7, pale, 0.75);
  return png;
}

function main() {
  ensureDir(OUT_DIR);
  ensureDir(ICONS_DIR);
  ensureDir(PREVIEW_DIR);
  ensureDir(MANIFEST_DIR);

  ICONS.forEach((icon) => {
    const png = renderIcon(icon);
    savePng(png, path.join(ICONS_DIR, `${icon.slug}.png`));
  });

  const preview = createPreview(ICONS);
  savePng(preview, path.join(PREVIEW_DIR, "breakcore-preview.png"));

  const wallpaper = createWallpaper();
  savePng(wallpaper, path.join(PREVIEW_DIR, "breakcore-wallpaper.png"));

  const manifest = {
    packName: "Breakcore Icon Pack",
    author: "Codex for ILuizkk",
    iconCount: ICONS.length,
    generatedAt: new Date().toISOString(),
    style: {
      theme: "breakcore",
      palette: ["#000000", "#ec0f15", "#fff2e8"],
      notes: "glitch, distressed, high-contrast, red on black"
    },
    icons: ICONS
  };

  fs.writeFileSync(path.join(MANIFEST_DIR, "icon-pack.json"), JSON.stringify(manifest, null, 2));
}

main();
