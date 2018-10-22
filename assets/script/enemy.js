// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        map: {
            default: null,
            type: cc.Node,

        },
        jumpDuration:0.2,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.tile = cc.p(0, 0);
        this.enabled = false;
    },

    start() {

    },
    onbutton: function () {
     //   if (this.map.men_state.active == true)
     //       this.map.men_state.active = false;
        if (this.map.game.lv_flag == 1)
            return;

        if (this.map.game.player_flag != 1)
            return;

        if (this.map.men_state.active == true)
            this.map.men_state.active = false;
        if (this.map.skilldis.active == true)
            this.map.skilldis.active = false;
        if (this.map.game.itemflag == 1)
            this.map.game.itemflag = 0;


        if (this.map.game.enemy_touch ==0&&this.map.game.current_player != null && this.map.game.current_player.move_flag == 1)
            this.map.game.current_player.getobj().getComponent('player').close();


        this.map.menu.active = true;
        this.map.menu.setPosition(this.menupos());

        this.map.Menu_flag.move_flag = 0;
        this.map.Menu_flag.skill_flag = 1;
        this.map.Menu_flag.attack_flag = 0;
        this.map.Menu_flag.item_flag = 0;
        this.map.Menu_flag.standby_flag = 0;
        this.map.menu.getChildByName('move').opacity = 0;
        this.map.menu.getChildByName('attack').opacity = 0;
        this.map.menu.getChildByName('item').opacity = 0;
        this.map.menu.getChildByName('standby').opacity = 0;
        this.map.menu.getChildByName('skill').opacity = 255;
        this.map.game.enemy_touch = 1;

        
        this.map.game.current_player = this.person;
      //  this.map.onbuttonstate();
      //  this.map.game.current_player = null;
    },
    menupos: function () {
        var pos;
        // var height = this.map.tiledMap.getMapSize().height;
        // var width = this.map.tiledMap.getMapSize().width;
        // var x = this.person.gettile().x;
        //  var y = this.person.gettile().y;
        var x = this.person.getobj().getPosition().x + this.map.node.x;
        var y = this.person.getobj().getPosition().y + this.map.node.y;
        var height = cc.visibleRect.topRight.y;
        var width = cc.visibleRect.topRight.x;
        cc.log(height);
        cc.log(width);
        if (x <= width / 2 && y <= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x + 40, this.person.getobj().getPosition().y + this.map.node.y + 40);
        else if (x >= width / 2 && y <= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x - 80, this.person.getobj().getPosition().y + this.map.node.y + 40);
        else if (x <= width / 2 && y >= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x + 40, this.person.getobj().getPosition().y + this.map.node.y - 200);
        else if (x >= width / 2 && y >= height / 2)
            pos = cc.p(this.person.getobj().getPosition().x + this.map.node.x - 80, this.person.getobj().getPosition().y + this.map.node.y - 200);

        return pos;
    },

    init: function (map) {
        this.map = map;
        this.person = this.map.personpool.findperson(this.node);
        this.node.parent = this.map.node;
      //  cc.log(this.person);
        this.enabled = true;
        //  this.person.settile(cc.p(0, Math.floor(Math.random() * 15)));
        //this.tile = this.map.playerTile;
    },
    updatapos: function () {

        this.node.setPosition(this.getpostile(this.person.gettile()));

    },
    getpostile: function (position) {
        // cc.log(position);
        let x = position.x * this.map.tiledMap.getTileSize().width;
        let y = (this.map.tiledMap.getMapSize().height - position.y - 1) * this.map.tiledMap.getTileSize().height;

        return cc.p(x, y);
    },
    //移动enemy至最近的player处
    movetoplayer: function () {
        var x = this.person.nearplayer.gettile().x;//- this.person.gettile().x;
        var y = this.person.nearplayer.gettile().y;//- this.person.gettile().y;
        var range = this.person.getrange();
        var position;
        var min_ran = Math.abs(this.person.gettile().x - x) + Math.abs(this.person.gettile().y - y);
        var min_pos = this.person.gettile();
        for (var i = -1 * range; i <= range; i++)
            for (var j = Math.abs(i) - range; j <= range - Math.abs(i); j++) {
                position = cc.p(this.person.gettile().x + i, this.person.gettile().y + j);
             //   cc.log(this.map.game.player_map[position.x, position.y]);
                if (this.ondetection(position)) {
                 //   cc.log(123);
                    if (min_ran > Math.abs(position.x - x) + Math.abs(position.y - y)) {
                        min_ran = Math.abs(position.x - x) + Math.abs(position.y - y);
                        min_pos = position;
                        
                    }
                }

            }
        this.moveanimation(min_pos);
        //this.map.cunrrent_enemy=;
       // this.map.game.enemy_flag = 1;
    },
    ondetection: function (pos) {
        if (pos.x < 0 || pos.y < 0 || pos.x >= this.map.tiledMap.getMapSize().width || pos.y >= this.map.tiledMap.getMapSize().height || pos.x == this.person.gettile().x && pos.y == this.person.gettile().y || pos.x == this.person.nearplayer.gettile().x && pos.y == this.person.nearplayer.gettile().y|| this.map.game.player_map[pos.x][pos.y] != null || this.map.game.enemy_map[pos.x][pos.y] != null)// || this.map.game.npc_map[pos.x][pos.y] != null)
            return 0;
        else
            return 1;
    },
    //enemy move animation
    moveanimation: function (position) {       
        var h = position.x - this.person.gettile().x;
        var v = this.person.gettile().y - position.y;
        this.map.game.enemy_map[this.person.gettile().x][this.person.gettile().y] = null;
        this.person.settile(position);
        this.map.game.enemy_map[position.x][position.y] = this.person;
     //   cc.log(cc.p(v, h));
     //   cc.log(this.getpostile(cc.p(h, this.map.tiledMap.getMapSize().height - 1)));
        var moveh = cc.moveBy(this.jumpDuration * Math.abs(h), this.getpostile(cc.p(h, this.map.tiledMap.getMapSize().height - 1)));//easing(cc.easeCubicActionOut());
        var movev = cc.moveBy(this.jumpDuration * Math.abs(v), this.getpostile(cc.p(0, this.map.tiledMap.getMapSize().height - 1 - v)));//easing(cc.easeCubicActionOut());
        var callback = cc.callFunc(this.completee, this);
        this.node.runAction(cc.sequence(moveh, movev, callback));
        
    },
    completee: function () {
        this.terrian();
        this.onattack();
        this.nextenemy();
    },
    terrian: function () {
        if (this.map.game.terrain_map[this.person.gettile().x][this.person.gettile().y] == null) {
            this.person.ATK_aid = 0;
            this.person.DEF_aid = 0;
        }
        else {
            this.person.ATK_aid = this.map.game.terrain_map[this.person.gettile().x][this.person.gettile().y].ATK;
            this.person.DEF_aid = this.map.game.terrain_map[this.person.gettile().x][this.person.gettile().y].DEF;

        }
    },
    onattack: function () {
        var range = Math.abs(this.person.gettile().x - this.person.nearplayer.gettile().x) + Math.abs(this.person.gettile().y - this.person.nearplayer.gettile().y)
        if (range < this.person.getattack_range()) {
            this.person.nearplayer.HP -= ((this.person.ATK + this.person.ATK_aid - (this.person.nearplayer.DEF + this.person.nearplayer.DEF_aid)) <= 0 ? 0 : (this.person.ATK + this.person.ATK_aid - (this.person.nearplayer.DEF + this.person.nearplayer.DEF_aid)));

            this.map.blooddisplay(this.getpostile(this.person.nearplayer.gettile()), (this.person.nearplayer.DEF - this.person.ATK) >= 0 ? 0 : (this.person.nearplayer.DEF - this.person.ATK));

            this.onplayer();
        }
    },

    //检测player血量是否0
    onplayer: function () {
     //   cc.log(this.map.game.player_map[this.person.nearplayer.gettile().x][this.person.nearplayer.gettile().y]);
        if (this.person.nearplayer.HP <= 0) {
      //      this.map.game.player_group.removeobj(this.person.nearplayer, 1);
          
       //     this.map.personpool.removeperson(this.person.nearplayer, this.map.personpool);

            this.map.game.death = 1;
        }

    },

    move: function () {

        this.movetoplayer();
    },


    //下一个enemy行动
    nextenemy: function () {
        var position = this.map.game.enemy_group.findobject(this.person, 1);
     //   cc.log(this.person.getid());
     //   cc.log(position);
        if (this.map.game.enemy_group.find(position, 0).next != null) {
            this.map.game.current_enemy = this.map.game.enemy_group.find(position, 0).next.element;
            this.map.game.enemy_flag = 1;
           // cc.log(this.map.game.current_enemy.getid());
          //  this.map.game.current_enemy.getobj().getComponent('enemy').move();
          //  this.map.game.player_flag = 1;
          //  this.map.player_init();
        }
        else {
            this.map.game.current_enemy = this.map.game.enemy_group.gethead().element;
            this.map.game.player_flag = 1;
            
            this.map.player_init();
        }
    },
    getpostile: function (position) {
        // cc.log(position);
        let x = position.x * this.map.tiledMap.getTileSize().width;
        let y = (this.map.tiledMap.getMapSize().height - position.y - 1) * this.map.tiledMap.getTileSize().height;

        return cc.p(x, y);
    },
    update() {
        //cc.log(this.person);
       
    //    this.updatapos();

    },
});
