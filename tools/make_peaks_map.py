# Builds assets/maps/peaks_l2.tmj (Level 2, The Frostfang Peaks) from a column height map.
# Run: python3 tools/make_peaks_map.py   (tile ids are tileset_peaks.tsj ids; the .tmj stores id + 1)
import json, random, os
random.seed(7)
W, H = 184, 12
FLIP = 0x80000000
ground = [[0] * W for _ in range(H)]; decor_back = [[0] * W for _ in range(H)]; decor = [[0] * W for _ in range(H)]; fg = [[0] * W for _ in range(H)]
ents = []
def put(layer, r, c, tid, flip=False): layer[r][c] = (tid + 1) | (FLIP if flip else 0)
def ent(type_, name, x, y, w=32, h=32, **extra):
    ents.append(dict(id=len(ents) + 1, name=name, type=type_, x=x, y=y, width=w, height=h, rotation=0, visible=True, **extra))

# ---- height map: top row of the ground per column (None = pit or water)
h = [9] * W; ice = [False] * W; water = {}   # water[c] = 'open' | 'pond'
for c in range(10, 13): h[c] = 8                     # a small step
for c in range(35, 46): ice[c] = True                 # packed ice: slide
for c in range(48, 54): h[c] = None; water[c] = 'open' if c in (48, 53) else 'pond'   # frozen pond, open water at both edges
for c in range(75, 79): h[c] = 7                      # plateau with Brine's statue
for c in range(100, 112): h[c] = None                 # the yeti's chasm (rope bridge on row 9)
for c in range(146, 149): h[c] = None; water[c] = 'open'

def top_tile(c, r):
    L = h[c - 1] if c > 0 else r; R_ = h[c + 1] if c < W - 1 else r
    lo = L is None or L > r; ro = R_ is None or R_ > r
    if ice[c]: return 26 if lo and ro else 22 if lo else 24 if ro else 23
    return 1 if lo and ro else 0 if lo else 2 if ro else 1
for c in range(W):
    r = h[c]
    if r is None:
        if c in water:
            if water[c] == 'pond': put(ground, 9, c, 34)
            else: put(ground, 9, c, 36)
            for y in (10, 11): put(ground, y, c, 35)
        continue
    put(ground, r, c, top_tile(c, r))
    for y in range(r + 1, H):
        L = h[c - 1] if c > 0 else 0; R_ = h[c + 1] if c < W - 1 else 0
        le = L is None or L > y; re = R_ is None or R_ > y
        t = 15 if le and re else 8 if le else 10 if re else (random.choice([13, 14]) if random.random() < 0.06 else 9)
        put(ground, y, c, t)

def block(c0, c1, r0, r1):   # a floating solid rock block
    for r in range(r0, r1 + 1):
        for c in range(c0, c1 + 1):
            if r == r0: t = 0 if c == c0 else 2 if c == c1 else 1
            elif r == r1: t = 16 if c == c0 else 18 if c == c1 else 17
            else: t = 8 if c == c0 else 10 if c == c1 else 9
            put(ground, r, c, t)
def ledge(r, c0, c1, kind='snow'):
    ids = (19, 20, 21) if kind == 'snow' else (27, 28, 29)
    for c in range(c0, c1 + 1): put(ground, r, c, ids[0] if c == c0 else ids[2] if c == c1 else ids[1])
def crumble(r, c0, c1):
    for c in range(c0, c1 + 1): put(ground, r, c, 30)
def coins(r, c0, c1, step=1):
    for c in range(c0, c1 + 1, step): ent('item_coin', 'coin', c * 32 + 8, r * 32 + 10, 16, 16)
def coin_arc(c0, c1, r_top):
    n = c1 - c0
    for i, c in enumerate(range(c0, c1 + 1)):
        k = abs(i - n / 2) / (n / 2 or 1); ent('item_coin', 'coin', c * 32 + 8, round((r_top + k * 1.5) * 32 + 10), 16, 16)

# ---- A: the snowy start, the cheetah, Rime
ent('hero_ice', 'player_spawn', 64, 257)
put(decor, 8, 1, 64); put(decor, 8, 3, 62); put(decor, 8, 6, 63); put(decor_back, 8, 8, 70); put(decor_back, 8, 15, 60); put(decor_back, 8, 18, 70)
coins(8, 4, 8, 2)
ledge(6, 14, 16); coins(5, 14, 16)
put(decor, 8, 21, 61)                                   # the rock the cheetah shivers behind
ent('companion_cheetah', 'cheetah', 22 * 32, 257)
put(decor, 8, 25, 66); put(decor, 8, 26, 66)
ent('enemy_ice_wolf', 'ice_wolf', 29 * 32, 257)
coins(8, 27, 30)
ent('knight_statue', 'ice', 33 * 32, 257)

# ---- B: packed ice, a snow sprite, the frozen pond
coin_arc(36, 44, 6); put(decor_back, 8, 38, 60); put(decor, 8, 44, 69)
ent('enemy_snow_sprite', 'snow_sprite', 41 * 32, 4 * 32)
coins(8, 49, 52)
put(ground, 8, 57, 40)                                   # one ice spike
ent('item_heart', 'heart', 55 * 32 + 8, 8 * 32 + 10, 16, 16)
# hidden high route: the snow drift bounces you up into the snowy pine branches
put(ground, 8, 59, 42)
ledge(3, 58, 68)
for c in range(57, 70): put(fg, 1, c, 55 if c == 57 else 57 if c == 69 else 56); put(fg, 2, c, 58)
coins(2, 60, 65); ent('item_gem', 'gem', 67 * 32 + 8, 2 * 32 + 10, 16, 16)
crumble(5, 69, 71)
ent('enemy_frostling', 'frostling', 64 * 32, 257)
put(decor_back, 8, 62, 60); put(decor, 8, 67, 67)

# ---- C: checkpoint, Brine's plateau, the ice cave
ent('checkpoint', 'checkpoint', 72 * 32, 224, 32, 64)
ent('knight_statue', 'water', 76 * 32, 7 * 32 - 31)
coins(6, 75, 78, 3)
ent('enemy_snow_sprite', 'snow_sprite', 81 * 32, 3 * 32)
put(decor, 8, 81, 65)
# hidden ice cave (like the forest's hollow log): row 7 roof, row 8 inside, facade in front
put(ground, 7, 84, 47); put(ground, 7, 90, 47, True)
for c in range(85, 90): put(ground, 7, c, 48)
put(ground, 8, 84, 51); put(ground, 8, 90, 51, True)
for c in range(85, 90): put(decor_back, 8, c, 53 if c == 87 else 49); put(fg, 8, c, 54)
coins(8, 85, 87); ent('item_gem', 'gem', 89 * 32 + 8, 8 * 32 + 10, 16, 16)
coins(6, 85, 89, 2)

# ---- D: the yeti cub's rope bridge (arena: cols 96-115)
ent('yeti_arena', 'yeti_arena', 96 * 32, 0, 640, 360)
ledge(9, 100, 111, 'rope')
ent('boss_yeti_cub', 'yeti_cub', 106 * 32, 224, 64, 64)
put(decor, 8, 97, 68)                                    # Baba's red yarn caught on a branch
coins(8, 113, 115)

# ---- E: frostlings, the icicle overhang, a spike
ent('enemy_frostling', 'frostling', 120 * 32, 257)
put(ground, 8, 118, 42); coins(3, 117, 120)
ledge(6, 122, 124)
block(126, 132, 4, 5)
for c in (126, 128, 130, 132): put(decor, 6, c, 41)
for c in (127, 129, 131): ent('hazard_icicle', 'icicle', c * 32 + 8, 192, 16, 32)
coins(3, 127, 130); ent('item_gem', 'gem', 131 * 32 + 8, 3 * 32 + 10, 16, 16)
ent('item_heart', 'heart', 124 * 32 + 8, 5 * 32 + 10, 16, 16)
ent('enemy_ice_wolf', 'ice_wolf', 136 * 32, 257)
put(ground, 8, 139, 40)
put(decor_back, 8, 134, 60); put(decor, 8, 137, 66)

# ---- F: ledges over icy water, the last climb
ledge(7, 142, 144); ledge(7, 145, 149); ledge(5, 150, 152); crumble(6, 154, 156)
coins(6, 142, 149, 2); coins(4, 150, 152)
ent('enemy_snow_sprite', 'snow_sprite', 151 * 32, 2 * 32)
ent('enemy_frostling', 'frostling', 157 * 32, 257)
ent('checkpoint', 'checkpoint', 160 * 32, 224, 32, 64)
ent('item_heart', 'heart', 162 * 32 + 8, 8 * 32 + 10, 16, 16)

# ---- G: the Frost Warden's glacier hall (the last 20 columns)
ent('boss_frost_warden', 'frost_warden', 5600, 192, 96, 96)
ent('exit_arch', 'exit', 5760, 192, 64, 96)
for c in (165, 168, 171): put(decor, 8, c, 65)

flat = lambda layer: [v for row in layer for v in row]
m = dict(compressionlevel=-1, height=H, width=W, infinite=False, orientation='orthogonal', renderorder='right-down', tilewidth=32, tileheight=32, type='map', version='1.10', tiledversion='1.10.2',
         nextlayerid=10, nextobjectid=len(ents) + 1, tilesets=[dict(firstgid=1, source='../tilesets/peaks/tileset_peaks.tsj')], layers=[])
for i, (n, px) in enumerate([('sky', 0), ('far', 0.2), ('mid', 0.45), ('near', 0.7)]):
    m['layers'].append(dict(id=i + 1, name='bg_' + n, type='imagelayer', image=f'../backgrounds/peaks/bg_peaks_{n}.png', repeatx=True, parallaxx=px, parallaxy=1, opacity=1, visible=True, x=0, y=0))
for i, (n, L) in enumerate([('decor_back', decor_back), ('ground', ground), ('decor', decor), ('foreground', fg)]):
    m['layers'].append(dict(id=5 + i, name=n, type='tilelayer', width=W, height=H, x=0, y=0, opacity=1, visible=True, data=flat(L)))
m['layers'].append(dict(id=9, name='entities', type='objectgroup', draworder='topdown', opacity=1, visible=True, x=0, y=0, objects=ents))
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'maps', 'peaks_l2.tmj')
json.dump(m, open(out, 'w'), indent=1)
print('wrote', out, '| coins', sum(e['type'] == 'item_coin' for e in ents), '| gems', sum(e['type'] == 'item_gem' for e in ents))
