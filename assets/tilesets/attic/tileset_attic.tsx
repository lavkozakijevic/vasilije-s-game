<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="attic" tilewidth="32" tileheight="32" tilecount="88" columns="8">
 <image source="tileset_attic.png" width="256" height="352"/>
 <tile id="0">
  <properties>
   <property name="name" value="floor_tl"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="1">
  <properties>
   <property name="name" value="floor_t"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="2">
  <properties>
   <property name="name" value="floor_tr"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="3">
  <properties>
   <property name="name" value="inner_nw"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="4">
  <properties>
   <property name="name" value="inner_ne"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="5">
  <properties>
   <property name="name" value="plank_edge_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="6">
  <properties>
   <property name="name" value="plank_edge_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="7">
  <properties>
   <property name="name" value="floor_single"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="8">
  <properties>
   <property name="name" value="floor_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="9">
  <properties>
   <property name="name" value="floor_c"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="10">
  <properties>
   <property name="name" value="floor_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="11">
  <properties>
   <property name="name" value="inner_sw"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="12">
  <properties>
   <property name="name" value="inner_se"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="13">
  <properties>
   <property name="name" value="floor_bl"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="14">
  <properties>
   <property name="name" value="floor_b"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="15">
  <properties>
   <property name="name" value="floor_br"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="16">
  <properties>
   <property name="name" value="rafter"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="17">
  <properties>
   <property name="name" value="roof_boards"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="18">
  <properties>
   <property name="name" value="roof_slope_l"/>
   <property name="solid" type="bool" value="true"/>
   <property name="slope" value="ceiling_left"/>
  </properties>
 </tile>
 <tile id="19">
  <properties>
   <property name="name" value="roof_slope_r"/>
   <property name="solid" type="bool" value="true"/>
   <property name="slope" value="ceiling_right"/>
  </properties>
 </tile>
 <tile id="20">
  <properties>
   <property name="name" value="beam_l"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="21">
  <properties>
   <property name="name" value="beam_m"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="22">
  <properties>
   <property name="name" value="beam_r"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="23">
  <properties>
   <property name="name" value="beam_end"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="24">
  <properties>
   <property name="name" value="post"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="25">
  <properties>
   <property name="name" value="beam_joint"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="26">
  <properties>
   <property name="name" value="creaky_intact"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="0"/>
   <property name="crumble_note" value="creaky_intact -> cracked (0.25s after the hero lands) -> breaking (0.2s) -> gone; respawns as intact after 3s"/>
  </properties>
 </tile>
 <tile id="27">
  <properties>
   <property name="name" value="creaky_cracked"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="1"/>
   <property name="crumble_note" value="creaky_intact -> cracked (0.25s after the hero lands) -> breaking (0.2s) -> gone; respawns as intact after 3s"/>
  </properties>
 </tile>
 <tile id="28">
  <properties>
   <property name="name" value="creaky_breaking"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="2"/>
   <property name="crumble_note" value="creaky_intact -> cracked (0.25s after the hero lands) -> breaking (0.2s) -> gone; respawns as intact after 3s"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="name" value="creaky_gone"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="3"/>
   <property name="crumble_note" value="creaky_intact -> cracked (0.25s after the hero lands) -> breaking (0.2s) -> gone; respawns as intact after 3s"/>
  </properties>
 </tile>
 <tile id="30">
  <properties>
   <property name="name" value="box_a"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="31">
  <properties>
   <property name="name" value="box_b"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="32">
  <properties>
   <property name="name" value="box_c"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="33">
  <properties>
   <property name="name" value="box_wide_a_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="34">
  <properties>
   <property name="name" value="box_wide_a_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="35">
  <properties>
   <property name="name" value="box_wide_b_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="36">
  <properties>
   <property name="name" value="box_wide_b_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="37">
  <properties>
   <property name="name" value="suitcase_red_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="38">
  <properties>
   <property name="name" value="suitcase_red_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="39">
  <properties>
   <property name="name" value="suitcase_blue_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="40">
  <properties>
   <property name="name" value="suitcase_blue_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="41">
  <properties>
   <property name="name" value="wardrobe_top_l"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="42">
  <properties>
   <property name="name" value="wardrobe_top_r"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="43">
  <properties>
   <property name="name" value="wardrobe_mid_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="44">
  <properties>
   <property name="name" value="wardrobe_mid_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="45">
  <properties>
   <property name="name" value="wardrobe_base_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="46">
  <properties>
   <property name="name" value="wardrobe_base_r"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="47">
  <properties>
   <property name="name" value="wardrobe_door_mid_l"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="cover_for" value="hidden_room"/>
   <property name="fade_alpha_note" value="engine fades the whole layer to ~35% while the hero overlaps"/>
  </properties>
 </tile>
 <tile id="48">
  <properties>
   <property name="name" value="wardrobe_door_mid_r"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="cover_for" value="hidden_room"/>
   <property name="fade_alpha_note" value="engine fades the whole layer to ~35% while the hero overlaps"/>
  </properties>
 </tile>
 <tile id="49">
  <properties>
   <property name="name" value="wardrobe_door_base_l"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="cover_for" value="hidden_room"/>
   <property name="fade_alpha_note" value="engine fades the whole layer to ~35% while the hero overlaps"/>
  </properties>
 </tile>
 <tile id="50">
  <properties>
   <property name="name" value="wardrobe_door_base_r"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="cover_for" value="hidden_room"/>
   <property name="fade_alpha_note" value="engine fades the whole layer to ~35% while the hero overlaps"/>
  </properties>
 </tile>
 <tile id="51">
  <properties>
   <property name="name" value="wardrobe_inside_rail"/>
   <property name="hidden_room" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="52">
  <properties>
   <property name="name" value="wardrobe_inside_coats"/>
   <property name="hidden_room" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="53">
  <properties>
   <property name="name" value="wardrobe_inside_floor"/>
   <property name="hidden_room" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="54">
  <properties>
   <property name="name" value="rocking_chair_tl"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="55">
  <properties>
   <property name="name" value="rocking_chair_tr"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="56">
  <properties>
   <property name="name" value="rocking_chair_bl"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="57">
  <properties>
   <property name="name" value="rocking_chair_br"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="58">
  <properties>
   <property name="name" value="mattress_idle"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.4"/>
  </properties>
 </tile>
 <tile id="59">
  <properties>
   <property name="name" value="mattress_0"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.4"/>
  </properties>
 </tile>
 <tile id="60">
  <properties>
   <property name="name" value="mattress_1"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.4"/>
  </properties>
 </tile>
 <tile id="61">
  <properties>
   <property name="name" value="mattress_2"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.4"/>
  </properties>
 </tile>
 <tile id="62">
  <properties>
   <property name="name" value="mattress_3"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2.4"/>
  </properties>
 </tile>
 <tile id="63">
  <properties>
   <property name="name" value="skylight_tl"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="64">
  <properties>
   <property name="name" value="skylight_tr"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="65">
  <properties>
   <property name="name" value="skylight_bl"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="66">
  <properties>
   <property name="name" value="skylight_br"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="67">
  <properties>
   <property name="name" value="sunbeam_l"/>
   <property name="foreground" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="68">
  <properties>
   <property name="name" value="sunbeam_r"/>
   <property name="foreground" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="69">
  <properties>
   <property name="name" value="cobweb_corner_l"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="70">
  <properties>
   <property name="name" value="cobweb_corner_r"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="71">
  <properties>
   <property name="name" value="deco_cobweb_hanging"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="72">
  <properties>
   <property name="name" value="deco_painting_landscape"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="73">
  <properties>
   <property name="name" value="deco_painting_portrait"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="74">
  <properties>
   <property name="name" value="deco_dress_form"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="75">
  <properties>
   <property name="name" value="deco_christmas_box"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="76">
  <properties>
   <property name="name" value="deco_broken_lamp"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="77">
  <properties>
   <property name="name" value="deco_rolled_rug"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="78">
  <properties>
   <property name="name" value="deco_birdcage"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="79">
  <properties>
   <property name="name" value="deco_book_pile"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="80">
  <properties>
   <property name="name" value="deco_sled"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="81">
  <properties>
   <property name="name" value="deco_trunk_l"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="82">
  <properties>
   <property name="name" value="deco_trunk_r"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="83">
  <properties>
   <property name="name" value="hatch_l"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="hatch" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="84">
  <properties>
   <property name="name" value="hatch_r"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="hatch" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
