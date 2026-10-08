# Builds assets/maps/house_l8.tmj (Level 8, Night Patrol) from a column height map.
# Run: python3 tools/make_night_map.py   (tile ids are tileset_house.tsj ids; the .tmj stores id + 1)
import json, random, os
random.seed(11)
W, H = 64, 12
FLIP = 0x80000000
ground = [[0] * W for _ in range(H)]; decor_back = [[0] * W for _ in range(H)]; decor = [[0] * W for _ in range(H)]; fg = [[0] * W for _ in range(H)]
ents = []
def put(layer, r, c, tid, flip=False): layer[r][c] = (tid + 1) | (FLIP if flip else 0)
def ent(type_, name, x, y, w=32, h=32):
    ents.append(dict(id=len(ents) + 1, name=name, type=type_, x=x, y=y, width=w, height=h, rotation=0, visible=True))

# The living room from the family's photos, at the kids' scale: a low ceiling (rows 0-3), the room on rows 4-8,
# the floor on row 9. Walls and windows are tiles (the painted backgrounds are not used here).
# Every toy sits on a surface you can reach with a normal jump (at most 2 rows up, at most 2 columns across)
# from the floor or from the piece of furniture next to it. 60 seconds, ~20 toys.
for c in range(W):
    for r in range(0, 2): put(ground, r, c, 9)             # the wooden floor of the room upstairs
    put(ground, 2, c, 17); put(ground, 3, c, 23)             # its underside, then the ceiling cornice
    for r in range(4, 8): put(decor_back, r, c, 19)         # plaster wall
    put(decor_back, 8, c, 20)                               # skirting board
    put(ground, 9, c, 1)
    for y in (10, 11): put(ground, y, c, 9)
KINDS = ['football', 'lego', 'teddy', 'car', 'stick', 'crayons', 'markers', 'pencils', 'chessboard', 'cards', 'uno', 'plush_bunny', 'plush_dino', 'plush_cat', 'sword']
n_toys = [0]; toys_at = []
def toy(c, r, dx=8):   # a toy resting on the surface whose top is row r
    k = KINDS[n_toys[0] % len(KINDS)]; n_toys[0] += 1; toys_at.append((c, r))
    ent('toy', k, c * 32 + dx, r * 32 - 18, 16, 16)
def row(r, c0, ids, layer=None):
    for i, t in enumerate(ids): put(layer or ground, r, c0 + i, t)
def armchair(c, red=True): put(ground, 7, c, 27 if red else 29); put(ground, 8, c, 28 if red else 30)
def table(c0): row(8, c0, [31, 32])
def daybed(c0, c1):          # seat on row 7; the space underneath (row 8) is hidden by the hanging throw
    row(7, c0, [24] + [25] * (c1 - c0 - 1) + [26])
    for c in range(c0, c1 + 1): put(decor_back, 8, c, 70); put(fg, 8, c, 72 if c == c1 else 71)
def window(c0):              # a 2x2 window on rows 5-6 with its sill on row 7 and lace curtains either side
    row(5, c0, [51, 52], decor_back); row(6, c0, [53, 54], decor_back); row(7, c0 - 1, [48, 49, 49, 50])
    for c in (c0 - 1, c0 + 2): put(fg, 5, c, 73); put(fg, 6, c, 75)
def sideboard(c0):           # 5 wide: top on row 6, the TV on row 5, a cupboard you walk into on rows 7-8 with a low shelf
    row(6, c0, [33, 34, 34, 34, 35]); row(5, c0 + 1, [41, 42])
    for c in range(c0, c0 + 5):
        for r in (7, 8): put(decor_back, r, c, 39); put(fg, r, c, 36 if c == c0 else 38 if c == c0 + 4 else 37)
    put(ground, 8, c0 + 3, 40)
def chandelier(c0): row(5, c0, [55, 56]); put(decor, 4, c0, 57)
def lamp(c): put(ground, 6, c, 59)
def drawers(c): put(ground, 6, c, 43); put(ground, 7, c, 44); put(ground, 8, c, 44)
def shelf(c0, n): row(5, c0, [45] + [46] * (n - 2) + [47])

ent('hero_kid', 'player_spawn', 48, 257)
put(decor, 8, 1, 81); put(decor_back, 4, 2, 77); put(decor_back, 4, 3, 77)
window(4); toy(5, 7)                                         # on the window sill
armchair(8); table(10); toy(11, 8)                           # on the coffee table
daybed(13, 17); toy(14, 9); toy(16, 9); put(ground, 8, 18, 65)   # under the bed; bouncy mattress
shelf(18, 3); toy(19, 5)                                     # wall shelf (from the daybed seat)
put(decor_back, 5, 21, 80)
sideboard(22); toy(23, 9); toy(25, 8); toy(23, 5, 16); toy(26, 6)   # in the cupboard, on its shelf, on the TV, on the sideboard
armchair(27, False); lamp(29); chandelier(30); toy(30, 5); toy(31, 5)   # armchair -> lamp stand -> chandelier (right next to it)
window(34); toy(34, 7)
drawers(38); table(39); shelf(39, 3); toy(38, 6); toy(40, 5); toy(41, 5)   # coffee table -> drawers -> shelf
put(decor_back, 5, 43, 78); put(decor, 8, 42, 86)
daybed(44, 48); toy(45, 9); toy(47, 9); put(ground, 8, 49, 60)
armchair(50); lamp(51); chandelier(52); toy(53, 5)
table(56); sideboard(57); toy(60, 9); toy(59, 5, 16)
put(decor, 8, 62, 89); put(decor_back, 5, 62, 87)

# ---- Level 8: the same room at night. Night tiles are tileset_house_night ids + 96 (tileset_house_l8.png = house + night).
N = 96
def tablecloth(c0): row(7, c0, [N + 0, N + 1], fg); row(8, c0, [N + 2, N + 3], fg)
def curtain(c): put(fg, 6, c, N + 4); put(fg, 7, c, N + 5); put(fg, 8, c, N + 6)
def coats(c): put(fg, 6, c, N + 14); put(fg, 7, c, N + 15); put(fg, 8, c, N + 16)
tablecloth(10); tablecloth(39); tablecloth(56)
curtain(2); curtain(33); curtain(37)
row(7, 19, [N + 7, N + 8]); row(8, 19, [N + 9, N + 10])          # the big armchair with a blanket (hide; climb on it)
put(decor, 8, 29, N + 11); row(8, 42, [N + 12, N + 13], decor); put(decor, 8, 55, N + 11)
coats(63 - 1)
for c in (3, 7, 12, 20, 28, 32, 36, 43, 49, 54):                # ten more toys on the floor, out in the open (Marija's favourites)
    toy(c, 9)
ent('marija_night', 'marija', 40 * 32, 257)
flat = lambda layer: [v for row_ in layer for v in row_]
m = dict(compressionlevel=-1, height=H, width=W, infinite=False, orientation='orthogonal', renderorder='right-down', tilewidth=32, tileheight=32, type='map', version='1.10', tiledversion='1.10.2',
         nextlayerid=10, nextobjectid=len(ents) + 1, tilesets=[dict(firstgid=1, source='../tilesets/house_night/tileset_house_l8.tsj')], layers=[])
for i, (n, px) in enumerate([('sky', 0), ('far', 0.2), ('mid', 0.45), ('near', 0.7)]):
    m['layers'].append(dict(id=i + 1, name='bg_' + n, type='imagelayer', image=f'../backgrounds/house/bg_house_{n}.png', repeatx=True, parallaxx=px, parallaxy=1, opacity=1, visible=True, x=0, y=0))
for i, (n, L) in enumerate([('decor_back', decor_back), ('ground', ground), ('decor', decor), ('foreground', fg)]):
    m['layers'].append(dict(id=5 + i, name=n, type='tilelayer', width=W, height=H, x=0, y=0, opacity=1, visible=True, data=flat(L)))
m['layers'].append(dict(id=9, name='entities', type='objectgroup', draworder='topdown', opacity=1, visible=True, x=0, y=0, objects=ents))
out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'maps', 'house_l8.tmj')
json.dump(m, open(out, 'w'), indent=1)
print('wrote', out, '| toys', n_toys[0], '| width', W)
