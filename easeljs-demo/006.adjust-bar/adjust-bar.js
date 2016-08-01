function AdjustBar(stage,name, min, max, begin, theme){
  var defaultProps = {
    name: 'adjust-bar',
    min: 0,
    max: 100,
    begin: 30,
    theme: 'summer'
  };

  var themes = {
    summer: {
      bar: {
        radius: 10,
        color: '#4A96AD'
      },
      barstick: {
        color: '#4A96AD',
        height: 5,
        width: 200
      }
    }
  }

  this.stage = stage;
  this.name = name || defaultProps.name;
  this.min = (typeof min !== 'undefined') ? min : defaultProps.min;
  this.max = (typeof max !== 'undefined') ? max : defaultProps.max;
  this.begin = this.num = (typeof begin !== 'undefined') ? begin :  defaultProps.begin;
  this.theme = theme || defaultProps.theme;

  var themeProps = themes[this.theme];

  var height = themeProps.bar.radius * 2;
  var width = themeProps.barstick.width + themeProps.bar.radius * 2 ;
  var range = this.max - this.min;
  var rate = range/themeProps.barstick.width;

  var nameBox = new createjs.Text(this.name, "15px Arial", "#B7B7B7");
  nameBox.x = (width - nameBox.getBounds().width)/2;
  nameBox.y = height/2;

  var bar = new createjs.Shape();
  bar.graphics.beginFill(themeProps.bar.color).drawCircle(themeProps.bar.radius, themeProps.bar.radius, themeProps.bar.radius);
  bar.x = themeProps.bar.radius + ( (this.begin - this.min) / rate);
  bar.on('pressmove', function(event){
    event.target.x = Math.min(event.stageX, themeProps.barstick.width);
    this.stage.update();
  }.bind(this));

  bar.on('pressup', function(event){
    this.setChange(Math.floor(event.target.x * rate) + this.min);
  }.bind(this));

  var barstick = new createjs.Shape();
  barstick.graphics.beginFill(themeProps.barstick.color).drawRect(themeProps.bar.radius, (height - themeProps.barstick.height)/2, themeProps.barstick.width, themeProps.barstick.height)

  var container = new createjs.Container();
  container.addChild(barstick);
  container.addChild(bar);
  container.addChild(nameBox);
  container.setBounds(0, 0, width, height);
  container.on('pressmove', function(event){
    if(event.target !== container) return;
    event.target.x = event.stageX;
    event.target.y = event.stageY;
  });

  this.container = container;
  this.stage.addChild(container);
  this.stage.update();
}

AdjustBar.prototype.getDisplayObject = function(){
  return this.container;
}

AdjustBar.prototype.setChange = function(num){
  if(num !== this.num){
    (typeof this.callback == 'function') && this.callback(num);
  }
  this.num = num;
}

AdjustBar.prototype.onChange = function(callback){
  this.callback = callback;
}
