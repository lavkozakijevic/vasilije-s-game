<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.10" tiledversion="1.10.2" name="caves" tilewidth="32" tileheight="32" tilecount="80" columns="8">
 <image source="tileset_caves.png" width="256" height="320"/>
 <tile id="0">
  <properties>
   <property name="name" value="ground_tl"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="1">
  <properties>
   <property name="name" value="ground_t"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="2">
  <properties>
   <property name="name" value="ground_tr"/>
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
   <property name="name" value="slope_up"/>
   <property name="solid" type="bool" value="true"/>
   <property name="slope" type="bool" value="true"/>
   <property name="slope_dir" value="up"/>
  </properties>
 </tile>
 <tile id="6">
  <properties>
   <property name="name" value="slope_down"/>
   <property name="solid" type="bool" value="true"/>
   <property name="slope" type="bool" value="true"/>
   <property name="slope_dir" value="down"/>
  </properties>
 </tile>
 <tile id="7">
  <properties>
   <property name="name" value="ground_single"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="8">
  <properties>
   <property name="name" value="ground_l"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="9">
  <properties>
   <property name="name" value="ground_c"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="10">
  <properties>
   <property name="name" value="ground_r"/>
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
   <property name="name" value="ground_c_veins"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="14">
  <properties>
   <property name="name" value="ground_c_fossil"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="15">
  <properties>
   <property name="name" value="ground_pillar"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="16">
  <properties>
   <property name="name" value="ground_bl"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="17">
  <properties>
   <property name="name" value="ground_b"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="18">
  <properties>
   <property name="name" value="ground_br"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="19">
  <properties>
   <property name="name" value="oneway_l"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="20">
  <properties>
   <property name="name" value="oneway_m"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="21">
  <properties>
   <property name="name" value="oneway_r"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="22">
  <properties>
   <property name="name" value="walkway_l"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="23">
  <properties>
   <property name="name" value="walkway_m"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="24">
  <properties>
   <property name="name" value="walkway_r"/>
   <property name="oneway" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="25">
  <properties>
   <property name="name" value="crumble_0"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="0"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="26">
  <properties>
   <property name="name" value="crumble_1"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="1"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="27">
  <properties>
   <property name="name" value="crumble_2"/>
   <property name="oneway" type="bool" value="true"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="2"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="28">
  <properties>
   <property name="name" value="crumble_3"/>
   <property name="crumble" type="bool" value="true"/>
   <property name="crumble_frame" type="int" value="3"/>
   <property name="crumble_delay_ms" type="int" value="450"/>
  </properties>
 </tile>
 <tile id="29">
  <properties>
   <property name="name" value="lava_body"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lava" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="30">
  <properties>
   <property name="name" value="lava_surface_0"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lava" type="bool" value="true"/>
  </properties>
  <animation>
   <frame tileid="30" duration="180"/>
   <frame tileid="31" duration="180"/>
   <frame tileid="32" duration="180"/>
   <frame tileid="33" duration="180"/>
  </animation>
 </tile>
 <tile id="31">
  <properties>
   <property name="name" value="lava_surface_1"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lava" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="32">
  <properties>
   <property name="name" value="lava_surface_2"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lava" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="33">
  <properties>
   <property name="name" value="lava_surface_3"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lava" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="34">
  <properties>
   <property name="name" value="crust_0_freezing"/>
   <property name="crust" type="bool" value="true"/>
   <property name="crust_frame" type="int" value="0"/>
   <property name="crust_state" value="freezing"/>
   <property name="crust_note" value="swap a lava surface tile for crust_0 when ice hits it; 0 (150ms) -> 1 (hold ~3s) -> 2 (0.8s) -> 3 (150ms) -> back to lava_surface. Solid on frames 1-2."/>
  </properties>
 </tile>
 <tile id="35">
  <properties>
   <property name="name" value="crust_1_solid"/>
   <property name="solid" type="bool" value="true"/>
   <property name="crust" type="bool" value="true"/>
   <property name="crust_frame" type="int" value="1"/>
   <property name="crust_state" value="solid"/>
   <property name="crust_note" value="swap a lava surface tile for crust_0 when ice hits it; 0 (150ms) -> 1 (hold ~3s) -> 2 (0.8s) -> 3 (150ms) -> back to lava_surface. Solid on frames 1-2."/>
  </properties>
 </tile>
 <tile id="36">
  <properties>
   <property name="name" value="crust_2_cracking"/>
   <property name="solid" type="bool" value="true"/>
   <property name="crust" type="bool" value="true"/>
   <property name="crust_frame" type="int" value="2"/>
   <property name="crust_state" value="cracking"/>
   <property name="crust_note" value="swap a lava surface tile for crust_0 when ice hits it; 0 (150ms) -> 1 (hold ~3s) -> 2 (0.8s) -> 3 (150ms) -> back to lava_surface. Solid on frames 1-2."/>
  </properties>
 </tile>
 <tile id="37">
  <properties>
   <property name="name" value="crust_3_melting"/>
   <property name="crust" type="bool" value="true"/>
   <property name="crust_frame" type="int" value="3"/>
   <property name="crust_state" value="melting"/>
   <property name="crust_note" value="swap a lava surface tile for crust_0 when ice hits it; 0 (150ms) -> 1 (hold ~3s) -> 2 (0.8s) -> 3 (150ms) -> back to lava_surface. Solid on frames 1-2."/>
  </properties>
 </tile>
 <tile id="38">
  <properties>
   <property name="name" value="lavafall_top_0"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="top"/>
  </properties>
  <animation>
   <frame tileid="38" duration="110"/>
   <frame tileid="39" duration="110"/>
   <frame tileid="40" duration="110"/>
   <frame tileid="41" duration="110"/>
  </animation>
 </tile>
 <tile id="39">
  <properties>
   <property name="name" value="lavafall_top_1"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="top"/>
  </properties>
 </tile>
 <tile id="40">
  <properties>
   <property name="name" value="lavafall_top_2"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="top"/>
  </properties>
 </tile>
 <tile id="41">
  <properties>
   <property name="name" value="lavafall_top_3"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="top"/>
  </properties>
 </tile>
 <tile id="42">
  <properties>
   <property name="name" value="lavafall_bottom_0"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="bottom"/>
  </properties>
  <animation>
   <frame tileid="42" duration="110"/>
   <frame tileid="43" duration="110"/>
   <frame tileid="44" duration="110"/>
   <frame tileid="45" duration="110"/>
  </animation>
 </tile>
 <tile id="43">
  <properties>
   <property name="name" value="lavafall_bottom_1"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="bottom"/>
  </properties>
 </tile>
 <tile id="44">
  <properties>
   <property name="name" value="lavafall_bottom_2"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="bottom"/>
  </properties>
 </tile>
 <tile id="45">
  <properties>
   <property name="name" value="lavafall_bottom_3"/>
   <property name="hazard" type="bool" value="true"/>
   <property name="lavafall_part" value="bottom"/>
  </properties>
 </tile>
 <tile id="46">
  <properties>
   <property name="name" value="obsidian_spikes"/>
   <property name="hazard" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="47">
  <properties>
   <property name="name" value="deco_stalactites"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="48">
  <properties>
   <property name="name" value="bounce_idle"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2"/>
  </properties>
 </tile>
 <tile id="49">
  <properties>
   <property name="name" value="bounce_0"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2"/>
  </properties>
 </tile>
 <tile id="50">
  <properties>
   <property name="name" value="bounce_1"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2"/>
  </properties>
 </tile>
 <tile id="51">
  <properties>
   <property name="name" value="bounce_2"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2"/>
  </properties>
 </tile>
 <tile id="52">
  <properties>
   <property name="name" value="bounce_3"/>
   <property name="bounce" type="bool" value="true"/>
   <property name="bounce_multiplier" type="float" value="2"/>
  </properties>
 </tile>
 <tile id="53">
  <properties>
   <property name="name" value="grotto_end_top"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="54">
  <properties>
   <property name="name" value="grotto_top"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="55">
  <properties>
   <property name="name" value="grotto_interior"/>
   <property name="hidden_room" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="56">
  <properties>
   <property name="name" value="grotto_bottom"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="57">
  <properties>
   <property name="name" value="grotto_end_mid"/>
  </properties>
 </tile>
 <tile id="58">
  <properties>
   <property name="name" value="grotto_end_bottom"/>
   <property name="solid" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="59">
  <properties>
   <property name="name" value="grotto_interior_glow"/>
   <property name="hidden_room" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="60">
  <properties>
   <property name="name" value="grotto_facade"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="cover_for" value="hidden_room"/>
  </properties>
 </tile>
 <tile id="61">
  <properties>
   <property name="name" value="roots_l"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="62">
  <properties>
   <property name="name" value="roots_m"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="63">
  <properties>
   <property name="name" value="roots_r"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="64">
  <properties>
   <property name="name" value="roots_fringe"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="65">
  <properties>
   <property name="name" value="roots_fill"/>
   <property name="foreground" type="bool" value="true"/>
   <property name="fade_when_behind" type="bool" value="true"/>
   <property name="fade_alpha_note" value="engine fades whole layer to ~35% while hero overlaps"/>
  </properties>
 </tile>
 <tile id="66">
  <properties>
   <property name="name" value="deco_glow_mushrooms"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="67">
  <properties>
   <property name="name" value="deco_crystals"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="68">
  <properties>
   <property name="name" value="deco_mine_cart"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="69">
  <properties>
   <property name="name" value="deco_pickaxe"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="70">
  <properties>
   <property name="name" value="deco_bones"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="71">
  <properties>
   <property name="name" value="deco_lantern"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="72">
  <properties>
   <property name="name" value="deco_warning_sign"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="73">
  <properties>
   <property name="name" value="deco_yarn_rock"/>
   <property name="decor" type="bool" value="true"/>
  </properties>
 </tile>
</tileset>
