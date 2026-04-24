const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "breakcore-icon-pack");
const ICONS_DIR = path.join(OUT_DIR, "icons");
const PREVIEW_DIR = path.join(OUT_DIR, "preview");
const MANIFEST_DIR = path.join(OUT_DIR, "manifest");
const REF_DIR = path.join(ROOT, "source-art", "refs");

const ICON_SIZE = 512;
const REFERENCE_FILES = {
  square: path.join(REF_DIR, "breakcore-sheet-square.png"),
  wide: path.join(REF_DIR, "breakcore-sheet-wide.png")
};

const REFERENCE_LAYOUTS = {
  square: {
    file: "square",
    cropWidth: 176,
    cropHeight: 176,
    positions: {
      0:  [25, 54],
      1:  [226, 54],
      2:  [428, 54],
      3:  [629, 54],
      4:  [830, 54],
      5:  [1031, 54],
      6:  [25, 255],
      7:  [226, 255],
      8:  [428, 255],
      9:  [629, 255],
      10: [830, 255],
      11: [1031, 255],
      12: [25, 456],
      13: [226, 456],
      14: [428, 456],
      15: [629, 456],
      16: [830, 456],
      17: [1031, 456],
      18: [25, 657],
      19: [226, 657],
      20: [428, 657],
      21: [629, 657],
      22: [830, 657],
      23: [1031, 657],
      24: [25, 858],
      25: [226, 858],
      26: [428, 858],
      27: [629, 858],
      28: [830, 858],
      29: [1031, 858],
      30: [25, 1059],
      31: [226, 1059],
      32: [428, 1059],
      33: [629, 1059],
      34: [830, 1059],
      35: [1031, 1059]
    }
  },
  wide: {
    file: "wide",
    cropWidth: 142,
    cropHeight: 142,
    positions: {
      0:  [16, 55],
      1:  [184, 55],
      2:  [352, 55],
      3:  [520, 55],
      4:  [688, 55],
      5:  [856, 55],
      6:  [1024, 55],
      7:  [1192, 55],
      8:  [1360, 55],
      9:  [16, 222],
      10: [184, 222],
      11: [352, 222],
      12: [520, 222],
      13: [688, 222],
      14: [856, 222],
      15: [1024, 222],
      16: [1192, 222],
      17: [1360, 222],
      18: [16, 390],
      19: [184, 390],
      20: [352, 390],
      21: [520, 390],
      22: [688, 390],
      23: [856, 390],
      24: [1024, 390],
      25: [1192, 390],
      26: [1360, 390],
      27: [16, 558],
      28: [184, 558],
      29: [352, 558],
      30: [520, 558],
      31: [688, 558],
      32: [856, 558],
      33: [1024, 558],
      34: [1192, 558],
      35: [1360, 558],
      36: [16, 726],
      37: [184, 726],
      38: [352, 726],
      39: [520, 726]
    }
  }
};

const ICONS = [
  { slug: "whatsapp", name: "WhatsApp", glyph: "WA", packages: ["com.whatsapp", "com.whatsapp.w4b"], reference: { sheet: "square", index: 5 } },
  { slug: "instagram", name: "Instagram", glyph: "IG", packages: ["com.instagram.android"], reference: { sheet: "square", index: 7 } },
  { slug: "tiktok", name: "TikTok", glyph: "TK", packages: ["com.zhiliaoapp.musically"], reference: { sheet: "square", index: 8 } },
  { slug: "youtube", name: "YouTube", glyph: "YT", packages: ["com.google.android.youtube"], reference: { sheet: "square", index: 6 } },
  { slug: "youtube_music", name: "YouTube Music", glyph: "YM", packages: ["com.google.android.apps.youtube.music"], reference: { sheet: "wide", index: 37 } },
  { slug: "spotify", name: "Spotify", glyph: "SP", packages: ["com.spotify.music"], reference: { sheet: "square", index: 3 } },
  { slug: "telegram", name: "Telegram", glyph: "TG", packages: ["org.telegram.messenger"], reference: { sheet: "square", index: 9 } },
  { slug: "discord", name: "Discord", glyph: "DC", packages: ["com.discord"], reference: { sheet: "square", index: 1 } },
  { slug: "x", name: "X", glyph: "X", packages: ["com.twitter.android"], reference: { sheet: "square", index: 11 } },
  { slug: "threads", name: "Threads", glyph: "TH", packages: ["com.instagram.barcelona"] },
  { slug: "facebook", name: "Facebook", glyph: "FB", packages: ["com.facebook.katana"] },
  { slug: "messenger", name: "Messenger", glyph: "MS", packages: ["com.facebook.orca"], reference: { sheet: "wide", index: 20 } },
  { slug: "snapchat", name: "Snapchat", glyph: "SC", packages: ["com.snapchat.android"] },
  { slug: "reddit", name: "Reddit", glyph: "RD", packages: ["com.reddit.frontpage"] },
  { slug: "pinterest", name: "Pinterest", glyph: "PI", packages: ["com.pinterest"], reference: { sheet: "square", index: 35 } },
  { slug: "twitch", name: "Twitch", glyph: "TW", packages: ["tv.twitch.android.app"], reference: { sheet: "square", index: 34 } },
  { slug: "netflix", name: "Netflix", glyph: "NF", packages: ["com.netflix.mediaclient"], reference: { sheet: "square", index: 33 } },
  { slug: "prime_video", name: "Prime Video", glyph: "PV", packages: ["com.amazon.avod.thirdpartyclient"] },
  { slug: "disney_plus", name: "Disney Plus", glyph: "DP", packages: ["com.disney.disneyplus"] },
  { slug: "max", name: "Max", glyph: "MX", packages: ["com.wbd.stream"] },
  { slug: "chrome", name: "Chrome", glyph: "CH", packages: ["com.android.chrome"], reference: { sheet: "square", index: 2 } },
  { slug: "brave", name: "Brave", glyph: "BR", packages: ["com.brave.browser"] },
  { slug: "firefox", name: "Firefox", glyph: "FF", packages: ["org.mozilla.firefox"] },
  { slug: "samsung_internet", name: "Samsung Internet", glyph: "SI", packages: ["com.sec.android.app.sbrowser"] },
  { slug: "tor_browser", name: "Tor Browser", glyph: "TR", packages: ["org.torproject.torbrowser"], reference: { sheet: "wide", index: 34 } },
  { slug: "gmail", name: "Gmail", glyph: "GM", packages: ["com.google.android.gm"], reference: { sheet: "square", index: 10 } },
  { slug: "google", name: "Google", glyph: "GO", packages: ["com.google.android.googlequicksearchbox"] },
  { slug: "maps", name: "Maps", glyph: "MP", packages: ["com.google.android.apps.maps"], reference: { sheet: "square", index: 26 } },
  { slug: "drive", name: "Drive", glyph: "DV", packages: ["com.google.android.apps.docs"] },
  { slug: "photos", name: "Photos", glyph: "PH", packages: ["com.google.android.apps.photos"], reference: { sheet: "square", index: 15 } },
  { slug: "calendar", name: "Calendar", glyph: "31", packages: ["com.google.android.calendar"], reference: { sheet: "square", index: 17 } },
  { slug: "camera", name: "Camera", glyph: "CM", packages: ["com.google.android.GoogleCamera"], reference: { sheet: "square", index: 14 } },
  { slug: "files", name: "Files", glyph: "FL", packages: ["com.google.android.apps.nbu.files"], reference: { sheet: "square", index: 16 } },
  { slug: "phone", name: "Phone", glyph: "PHN", packages: ["com.google.android.dialer"], reference: { sheet: "square", index: 13 } },
  { slug: "messages", name: "Messages", glyph: "MSG", packages: ["com.google.android.apps.messaging"], reference: { sheet: "square", index: 12 } },
  { slug: "contacts", name: "Contacts", glyph: "CT", packages: ["com.google.android.contacts"] },
  { slug: "clock", name: "Clock", glyph: "CLK", packages: ["com.google.android.deskclock"], reference: { sheet: "square", index: 18 } },
  { slug: "calculator", name: "Calculator", glyph: "CAL", packages: ["com.google.android.calculator"], reference: { sheet: "square", index: 22 } },
  { slug: "settings", name: "Settings", glyph: "SET", packages: ["com.android.settings"], reference: { sheet: "square", index: 19 } },
  { slug: "play_store", name: "Play Store", glyph: "PS", packages: ["com.android.vending"], reference: { sheet: "square", index: 20 } },
  { slug: "play_games", name: "Play Games", glyph: "PG", packages: ["com.google.android.play.games"] },
  { slug: "gallery", name: "Gallery", glyph: "GAL", packages: ["com.sec.android.gallery3d"] },
  { slug: "weather", name: "Weather", glyph: "WE", packages: ["com.google.android.apps.weather"], reference: { sheet: "square", index: 27 } },
  { slug: "notes", name: "Notes", glyph: "NT", packages: ["com.google.android.keep", "com.samsung.android.app.notes"], reference: { sheet: "square", index: 23 } },
  { slug: "music", name: "Music", glyph: "MU", packages: ["com.google.android.apps.youtube.music"], reference: { sheet: "square", index: 24 } },
  { slug: "recorder", name: "Recorder", glyph: "REC", packages: ["com.google.android.apps.recorder"], reference: { sheet: "square", index: 25 } },
  { slug: "security", name: "Security", glyph: "SEC", packages: ["com.miui.securitycenter"], reference: { sheet: "square", index: 28 } },
  { slug: "app_store", name: "Galaxy Store", glyph: "GS", packages: ["com.sec.android.app.samsungapps"], reference: { sheet: "square", index: 21 } },
  { slug: "uber", name: "Uber", glyph: "UB", packages: ["com.ubercab"] },
  { slug: "ifood", name: "iFood", glyph: "FD", packages: ["br.com.brainweb.ifood"] },
  { slug: "mercado_livre", name: "Mercado Livre", glyph: "ML", packages: ["com.mercadolibre"], reference: { sheet: "wide", index: 19 } },
  { slug: "shopee", name: "Shopee", glyph: "SH", packages: ["com.shopee.br"] },
  { slug: "amazon", name: "Amazon", glyph: "AZ", packages: ["com.amazon.mShop.android.shopping"], reference: { sheet: "wide", index: 2 } },
  { slug: "aliexpress", name: "AliExpress", glyph: "AE", packages: ["com.alibaba.aliexpresshd"], reference: { sheet: "wide", index: 1 } },
  { slug: "nubank", name: "Nubank", glyph: "NU", packages: ["com.nu.production"] },
  { slug: "paypal", name: "PayPal", glyph: "PP", packages: ["com.paypal.android.p2pmobile"] },
  { slug: "picpay", name: "PicPay", glyph: "PY", packages: ["com.picpay"] },
  { slug: "binance", name: "Binance", glyph: "BN", packages: ["com.binance.dev"] },
  { slug: "steam", name: "Steam", glyph: "ST", packages: ["com.valvesoftware.android.steam.community"], reference: { sheet: "wide", index: 30 } },
  { slug: "epic_games", name: "Epic Games", glyph: "EG", packages: ["com.epicgames.portal"] },
  { slug: "roblox", name: "Roblox", glyph: "RB", packages: ["com.roblox.client"], reference: { sheet: "square", index: 0 } },
  { slug: "minecraft", name: "Minecraft", glyph: "MC", packages: ["com.mojang.minecraftpe"], reference: { sheet: "square", index: 32 } },
  { slug: "free_fire", name: "Free Fire", glyph: "FR", packages: ["com.dts.freefireth"], reference: { sheet: "square", index: 30 } },
  { slug: "cod_mobile", name: "COD Mobile", glyph: "CD", packages: ["com.activision.callofduty.shooter"], reference: { sheet: "square", index: 31 } },
  { slug: "standoff_2", name: "Standoff 2", glyph: "SO", packages: ["com.axlebolt.standoff2"], reference: { sheet: "square", index: 4 } },
  { slug: "genshin_impact", name: "Genshin Impact", glyph: "GI", packages: ["com.miHoYo.GenshinImpact"], reference: { sheet: "wide", index: 11 } },
  { slug: "honkai_star_rail", name: "Honkai Star Rail", glyph: "HS", packages: ["com.HoYoverse.hkrpgoversea"], reference: { sheet: "wide", index: 14 } },
  { slug: "mobile_legends", name: "Mobile Legends", glyph: "MLB", packages: ["com.mobile.legends"] },
  { slug: "brawl_stars", name: "Brawl Stars", glyph: "BS", packages: ["com.supercell.brawlstars"] },
  { slug: "clash_royale", name: "Clash Royale", glyph: "CR", packages: ["com.supercell.clashroyale"] },
  { slug: "clash_of_clans", name: "Clash of Clans", glyph: "CC", packages: ["com.supercell.clashofclans"] },
  { slug: "pubg_mobile", name: "PUBG Mobile", glyph: "PGM", packages: ["com.tencent.ig"] },
  { slug: "chatgpt", name: "ChatGPT", glyph: "AI", packages: ["com.openai.chatgpt"], reference: { sheet: "wide", index: 5 } },
  { slug: "duolingo", name: "Duolingo", glyph: "DU", packages: ["com.duolingo"], reference: { sheet: "wide", index: 7 } },
  { slug: "capcut", name: "CapCut", glyph: "CP", packages: ["com.lemon.lvoverseas"] },
  { slug: "canva", name: "Canva", glyph: "CV", packages: ["com.canva.editor"] },
  { slug: "notion", name: "Notion", glyph: "NO", packages: ["notion.id"] },
  { slug: "vlc", name: "VLC", glyph: "VC", packages: ["org.videolan.vlc"] },
  { slug: "capcut_music", name: "SoundCloud", glyph: "SD", packages: ["com.soundcloud.android"], reference: { sheet: "wide", index: 26 } },
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

function hasReferenceAssets() {
  return Object.values(REFERENCE_FILES).every((file) => fs.existsSync(file));
}

function loadPng(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function savePng(png, filePath) {
  fs.writeFileSync(filePath, PNG.sync.write(png));
}

function createCanvas(width, height) {
  return new PNG({ width, height });
}

function setPixel(png, x, y, color) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const idx = (png.width * y + x) * 4;
  png.data[idx] = color[0];
  png.data[idx + 1] = color[1];
  png.data[idx + 2] = color[2];
  png.data[idx + 3] = color[3];
}

function blendPixel(png, x, y, color, alpha = 1) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
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

function drawHorizontalGlitch(png, y, thickness, color, alpha) {
  for (let row = 0; row < thickness; row += 1) {
    for (let x = 0; x < png.width; x += 1) {
      blendPixel(png, x, y + row, color, alpha);
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
        if (glyph[row][col] !== "1") continue;
        for (let sy = 0; sy < scale; sy += 1) {
          for (let sx = 0; sx < scale; sx += 1) {
            blendPixel(png, cursor + col * scale + sx, y + row * scale + sy, color, alpha);
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
  if (words.length <= 1) return [name.toUpperCase()];
  const lines = [];
  let current = words[0];
  for (let i = 1; i < words.length; i += 1) {
    const candidate = `${current} ${words[i]}`;
    if (candidate.length <= 10) current = candidate;
    else {
      lines.push(current.toUpperCase());
      current = words[i];
    }
  }
  lines.push(current.toUpperCase());
  return lines.slice(0, 2);
}

function cropAndScale(src, left, top, width, height, outSize) {
  const out = createCanvas(outSize, outSize);
  for (let y = 0; y < outSize; y += 1) {
    for (let x = 0; x < outSize; x += 1) {
      const srcX = Math.min(src.width - 1, left + Math.floor((x / outSize) * width));
      const srcY = Math.min(src.height - 1, top + Math.floor((y / outSize) * height));
      const idx = (src.width * srcY + srcX) * 4;
      setPixel(out, x, y, [
        src.data[idx],
        src.data[idx + 1],
        src.data[idx + 2],
        src.data[idx + 3]
      ]);
    }
  }
  return out;
}

function applyBreakcoreFinish(png, seed) {
  const rng = mulberry32(seed);
  const red = [235, 12, 18, 255];
  const pale = [255, 242, 232, 255];

  for (let i = 0; i < 900; i += 1) {
    const x = Math.floor(rng() * png.width);
    const y = Math.floor(rng() * png.height);
    blendPixel(png, x, y, rng() > 0.7 ? pale : red, 0.16 + rng() * 0.2);
  }

  for (let i = 0; i < 16; i += 1) {
    drawHorizontalGlitch(png, Math.floor(rng() * png.height), 1 + Math.floor(rng() * 2), red, 0.08 + rng() * 0.08);
  }

  drawRoundedRectOutline(png, 18, 18, png.width - 36, png.height - 36, 56, 3, red, 0.8);
  return png;
}

function renderFallbackIcon(icon) {
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
      const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / glowRadius);
      if (glow > 0) blendPixel(png, x, y, deepRed, glow * 0.65);
    }
  }

  const glyph = icon.glyph.toUpperCase();
  const scale = glyph.length >= 3 ? 20 : glyph.length === 2 ? 26 : 34;
  const glyphWidth = measureText(glyph, scale, 1);
  const glyphX = Math.round((ICON_SIZE - glyphWidth) / 2);
  const glyphY = Math.round(ICON_SIZE * 0.28);

  drawText(png, glyph, glyphX + 8, glyphY + 10, scale, red, 0.28);
  drawText(png, glyph, glyphX - 4, glyphY + 3, scale, pale, 0.15);
  drawText(png, glyph, glyphX, glyphY, scale, pale, 1);

  const tag = ["SYS", "ERR", "VOID", "CTRL", "NOISE", "VX"][Math.floor(rng() * 6)];
  drawText(png, tag, 40, 52, 4, red, 0.85);
  return applyBreakcoreFinish(png, hashString(`${icon.slug}:finish`));
}

function renderReferenceIcon(icon, sheets) {
  if (!icon.reference) return null;
  const layout = REFERENCE_LAYOUTS[icon.reference.sheet];
  if (!layout) return null;
  const src = sheets[layout.file];
  if (!src) return null;
  const [left, top] = layout.positions[icon.reference.index];
  if (left === undefined || top === undefined) return null;
  const cropped = cropAndScale(src, left, top, layout.cropWidth, layout.cropHeight, ICON_SIZE);
  return applyBreakcoreFinish(cropped, hashString(`${icon.slug}:ref`));
}

function renderIcon(icon, sheets) {
  return renderReferenceIcon(icon, sheets) || renderFallbackIcon(icon);
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
  const red = [237, 16, 24, 255];
  const pale = [255, 242, 232, 255];
  fillRect(png, 0, 0, width, height, [0, 0, 0, 255]);

  drawText(png, "BREAKCORE ICON PACK", Math.round((width - measureText("BREAKCORE ICON PACK", 8, 1)) / 2), 36, 8, red, 0.95);

  icons.forEach((icon, index) => {
    const row = Math.floor(index / columns);
    const col = index % columns;
    const x = margin + col * cellWidth;
    const y = 110 + row * cellHeight;
    const iconPng = loadPng(path.join(ICONS_DIR, `${icon.slug}.png`));
    const scale = 0.48;
    const iconSize = Math.round(iconPng.width * scale);
    for (let py = 0; py < iconSize; py += 1) {
      for (let px = 0; px < iconSize; px += 1) {
        const srcX = Math.floor(px / scale);
        const srcY = Math.floor(py / scale);
        const srcIdx = (iconPng.width * srcY + srcX) * 4;
        blendPixel(png, x + 36 + px, y + py, [
          iconPng.data[srcIdx],
          iconPng.data[srcIdx + 1],
          iconPng.data[srcIdx + 2],
          iconPng.data[srcIdx + 3]
        ], 1);
      }
    }

    wrapLabel(icon.name).forEach((line, lineIndex) => {
      const textWidth = measureText(line, 4, 1);
      drawText(png, line, x + Math.round((cellWidth - textWidth) / 2), y + iconSize + 28 + lineIndex * 34, 4, red, 0.95);
    });

    if (index % 5 === 0) drawText(png, "GLITCH", x + 14, y + 8, 3, pale, 0.55);
  });

  drawText(png, "SYSTEM // BREAKCORE MODE", margin, height - 76, 5, red, 0.9);
  return png;
}

function createWallpaper() {
  const width = 1440;
  const height = 3200;
  const png = createCanvas(width, height);
  fillRect(png, 0, 0, width, height, [0, 0, 0, 255]);
  const red = [236, 14, 20, 255];
  const pale = [255, 242, 232, 255];
  const rng = mulberry32(1337);

  for (let y = 0; y < height; y += 1) {
    const intensity = Math.max(0, 1 - Math.abs(y - height * 0.45) / (height * 0.6));
    for (let x = 0; x < width; x += 1) {
      if (rng() < 0.004) blendPixel(png, x, y, red, intensity * (0.2 + rng() * 0.4));
    }
  }

  ["chatgpt", "spotify", "whatsapp", "instagram", "roblox", "youtube", "discord", "telegram", "minecraft"].forEach((slug, index) => {
    const iconPng = loadPng(path.join(ICONS_DIR, `${slug}.png`));
    const scale = 0.62;
    const size = Math.round(iconPng.width * scale);
    const x = 120 + (index % 3) * 420;
    const y = 380 + Math.floor(index / 3) * 420;
    for (let py = 0; py < size; py += 1) {
      for (let px = 0; px < size; px += 1) {
        const srcX = Math.floor(px / scale);
        const srcY = Math.floor(py / scale);
        const srcIdx = (iconPng.width * srcY + srcX) * 4;
        blendPixel(png, x + px, y + py, [
          iconPng.data[srcIdx],
          iconPng.data[srcIdx + 1],
          iconPng.data[srcIdx + 2],
          iconPng.data[srcIdx + 3]
        ], 1);
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

  const sheets = hasReferenceAssets()
    ? {
        square: loadPng(REFERENCE_FILES.square),
        wide: loadPng(REFERENCE_FILES.wide)
      }
    : {};

  ICONS.forEach((icon) => savePng(renderIcon(icon, sheets), path.join(ICONS_DIR, `${icon.slug}.png`)));
  savePng(createPreview(ICONS), path.join(PREVIEW_DIR, "breakcore-preview.png"));
  savePng(createWallpaper(), path.join(PREVIEW_DIR, "breakcore-wallpaper.png"));

  fs.writeFileSync(
    path.join(MANIFEST_DIR, "icon-pack.json"),
    JSON.stringify({
      packName: "Breakcore Icon Pack",
      author: "Codex for ILuizkk",
      iconCount: ICONS.length,
      generatedAt: new Date().toISOString(),
      applyMode: "shortcut",
      style: {
        theme: "breakcore",
        palette: ["#000000", "#ec0f15", "#fff2e8"],
        notes: "glitch, distressed, high-contrast, red on black"
      },
      icons: ICONS
    }, null, 2)
  );
}

main();
