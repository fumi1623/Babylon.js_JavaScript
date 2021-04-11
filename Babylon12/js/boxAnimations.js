//表示場所の確保
var canvas = document.getElementById("renderCanvas");

// エンジン生成
var engine = new BABYLON.Engine(canvas);


//表示の中身（sceneの定義）
const createScene = function() {
  const scene = new BABYLON.Scene(engine);

  /**** Set camera and light *****/
  const light = new BABYLON. PointLight("Omni", new BABYLON.Vector3(0, 100, 100), scene);
  const camera = new BABYLON.ArcRotateCamera("camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  //Boxes
  var box1 = BABYLON.Mesh.CreateBox("Box1", 10.0, scene);
  box1.position.x = -20;
  var box2 = BABYLON.Mesh.CreateBox("Box2", 10.0, scene);

  var materialBox = new BABYLON.StandardMaterial("texture1", scene);
  materialBox.diffuseColor = new BABYLON.Color3(0, 1, 0);
  var materialBox2 = new BABYLON.StandardMaterial("texture2", scene);
  materialBox2.diffuseColor = new BABYLON.Color3(1, 0, 0);

  box1.material = materialBox;
  // box2.material = materialBox2;

  box2.position.x = 20;

  var animation1 = new BABYLON.Animation("tutoAnimation", "scaling.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  var keys = [];
  keys.push({frame: 0, value: 1});
  keys.push({frame: 20, value: 0.2});
  keys.push({frame: 100, value: 1});

  animation1.setKeys(keys);

  var animation2 = new BABYLON.Animation("tutoAnimation", "rotation.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  keys = [];
  keys.push({frame: 0, value: 0});
  keys.push({frame: 40, value: Math.PI});
  keys.push({frame: 80, value: 0});

  animation2.setKeys(keys);

  var animationGroup = new BABYLON.AnimationGroup("my group");
  animationGroup.addTargetedAnimation(animation1, box1);
  animationGroup.addTargetedAnimation(animation2, box1);
  // animationGroup.addTargetedAnimation(animation2, box2);
  //アニメーションを同じタイムラインに正規化する
  animationGroup.normalize(0, 100);
  //speed
  // animationGroup.speedRatio = 5;

  animationGroup.onAnimationEndObservable.add(function(){
    box2.material = materialBox2;
  })

  //UI
  var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
  var panel = new BABYLON.GUI.StackPanel();
  panel.isVertical = false;
  panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  advancedTexture.addControl(panel);

  var addButton = function(text, callback) {
    var button = BABYLON.GUI.Button.CreateSimpleButton("button", text);
    button.width = "140px";
    button.height = "40px";
    button.color = "white";
    button.background = "green";
    button.paddingLeft = "10px";
    button.paddingRight = "10px";
    button.onPointerUpObservable.add(function() {
      callback();
    });
    panel.addControl(button);
  }

  addButton("Play", function() {
    animationGroup.play(true);
  });
  addButton("Pause", function() {
    animationGroup.pause();
  });
  addButton("Stop", function() {
    animationGroup.reset();
    animationGroup.stop();
  });

  return scene;
}

//（定義したsceneを変数（定数でもいい）で定義）
var scene = createScene();

//定義した変数を実行する関数を定義
engine.runRenderLoop(function() {
  //表示の実行
  scene.render();
});